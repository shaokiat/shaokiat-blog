---
sidebar_position: 3
---

# Retrieval & Generation

> **Customer framing:** A customer reports that the assistant cannot find a policy by its exact document code, but answers fine when asked in plain English. Here is why pure vector search does that, and what to put in front of it.

**Official docs:**
- [pgvector querying](https://github.com/pgvector/pgvector#querying) · [Postgres full-text search](https://www.postgresql.org/docs/current/textsearch.html)
- [Reciprocal Rank Fusion (paper)](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)
- [Sentence Transformers cross-encoders](https://sbert.net/examples/applications/cross-encoder/README.html) · [Cohere Rerank](https://docs.cohere.com/docs/rerank-overview)
- [Lost in the Middle (paper)](https://arxiv.org/abs/2307.03172) · [HyDE (paper)](https://arxiv.org/abs/2212.10496)
- [Anthropic tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

---

## Dense search and what it misses

Dense retrieval embeds the query and returns nearest neighbours. Match the distance metric to the model. Most modern embedding models are normalised, which makes cosine and inner product equivalent, and inner product cheaper.

```sql
SELECT doc_id, section_path, content
FROM chunks
WHERE tenant_id = current_setting('app.tenant_id')::uuid
ORDER BY embedding <=> $1
LIMIT 50;
```

Dense search fails in a predictable set of cases:

| Query | Why it misses |
|---|---|
| `POLICY-4471` | Identifiers carry no semantics. The embedding is noise. |
| `ERR_TLS_CERT_EXPIRED` | Rare token, poorly represented in the embedding space |
| "plans that do **not** include SSO" | Embeddings handle negation badly. "Includes SSO" scores high. |
| "Novak retention rule" | Rare proper noun, swamped by the surrounding common words |

Every one of these is what keyword search has always been good at. So use both.

---

## Hybrid search

Run dense and sparse retrieval in parallel and fuse the rankings. Reciprocal Rank Fusion is the default because it fuses ranks, not scores, so you never have to normalise a cosine similarity against a BM25 score.

```
score(d) = Σ over retrievers of 1 / (k + rank(d)),  k = 60
```

```python
def rrf(runs: list[list[str]], k: int = 60) -> list[str]:
    scores: dict[str, float] = {}
    for run in runs:
        for rank, doc_id in enumerate(run, start=1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

fused = rrf([dense_ids, bm25_ids])
```

In Postgres, the sparse half is a `tsvector` column with a GIN index and `ts_rank_cd`. No extra service required.

:::info Best practice
Hybrid with RRF is the highest-value change in most RAG systems and it costs about 30 lines. Do it before you consider a different embedding model.
:::

---

## Query transformation

Optional, and pay for it only when eval shows you need it.

| Technique | What it does | Cost | Worth it when |
|---|---|---|---|
| Conversational rewrite | Turns "what about the enterprise one?" into a standalone query | One small LLM call | Always, for multi-turn chat |
| Multi-query | Generates 3 paraphrases, retrieves each, fuses | 1 call plus 3 retrievals | Recall is the bottleneck |
| HyDE | Writes a hypothetical answer, embeds that instead of the question | One call | Questions phrased very differently from the corpus |

Conversational rewriting is not optional in a chat product. Without it, turn three retrieves nothing useful and users blame the model.

---

## Reranking

Retrieval and ranking are different jobs. The bi-encoder embeds query and chunk separately, which is what makes the index possible and also what caps its precision. A cross-encoder reads the query and the chunk together and scores the pair. It cannot be indexed, so it only runs on a shortlist.

**Retrieve 50, rerank, keep 5.** The shortlist is wide because the reranker fixes ordering, not recall. If the right chunk is not in the 50, reranking cannot save you.

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-v2-m3")
pairs = [(query, c.content) for c in candidates]
top = [c for _, c in sorted(zip(reranker.predict(pairs), candidates), reverse=True)][:5]
```

Where the time actually goes, for a 400k-chunk corpus. Indicative, not benchmarks: measure your own.

| Step | Typical | Driven by |
|---|---|---|
| Embed the query | 10 to 30 ms | Hosted API round trip, or local model |
| ANN search | 5 to 50 ms | `ef_search`, corpus size, filter selectivity |
| Cross-encoder rerank, 50 candidates | 15 to 40 ms on GPU, 200 ms plus on CPU | Batch size, chunk length, model size |
| Generation, first token | 300 ms to 1.5 s | Prompt length, model, prefix cache hits |

Reranking on CPU is the usual surprise. It can cost more than retrieval and generation combined.

→ See [Production](./production.md#latency-budget) for the full waterfall and how to cut it.

**Params worth tuning, in order:** shortlist size (`k` before rerank), final `k` after rerank, then `ef_search`. A fixed similarity threshold is fragile, since score distributions shift per query type. If you need a "no answer" signal, take it from the reranker score on the top result, and calibrate it on your eval set.

---

## Building the prompt

Budget the context window explicitly. A table beats a guess.

| Slot | Budget |
|---|---|
| System prompt and instructions | 500 tokens |
| Retrieved chunks, 5 x 700 | 3,500 tokens |
| Conversation history, trimmed | 2,000 tokens |
| Reserved for the answer | 1,000 tokens |

Three rules for assembling the chunks:

1. **Order by attention, not by score.** Models attend to the beginning and end of the context and sag in the middle. Put the top chunk first and the second best last.
2. **Deduplicate.** Overlapping chunks from one document repeat text, waste budget, and make the model over-weight whatever got repeated. Collapse near-duplicates and merge adjacent chunks from the same section.
3. **Label every chunk.** Give each one an ID and its breadcrumb so the model can cite it and you can resolve the citation back to a source.

```
[1] Security Policy > API Keys (doc:POLICY-4471, updated 2026-03-02)
Keys must be rotated every 90 days...

[2] Onboarding Runbook > Provisioning (doc:RB-91, updated 2026-01-14)
...
```

---

## Grounding and citations

The prompt is a contract. Say what the model may use, and give it a way out.

```
Answer only from the numbered context below.
Cite the chunk numbers you used, like [1] or [2, 3].
If the context does not contain the answer, say exactly:
"I could not find this in your documentation."
Do not use knowledge from outside the context.
```

The refusal path is a feature, not a failure. A system that never says "not found" is a system that hallucinates instead.

Verify citations in code, not on trust. Parse the cited IDs, check each one was actually retrieved, and drop the answer to the escalation path if a citation points at nothing.

```python
cited = set(re.findall(r"\[(\d+)\]", answer))
if not cited or not cited <= {str(i) for i in range(1, len(chunks) + 1)}:
    return escalate(answer, reason="bad_or_missing_citation")
```

:::info Best practice
Render citations as links to the source document and section. Users trust an assistant they can check, and it turns every answer into a spot-check of your retrieval.
:::

→ See [Evaluation & Guardrails](./evaluation.md#faithfulness-and-the-escalation-threshold) for scoring groundedness rather than assuming it.

---

## Agentic and multi-hop retrieval

Single-pass RAG assumes one query embedding can express the whole information need. Multi-hop questions break that assumption. "Which tenants on the Enterprise plan are affected by the retention change we shipped in March?" needs the plan list and the change record, and no single embedding sits near both.

| Pattern | How it works | Cost vs single-pass | Use when |
|---|---|---|---|
| Single-pass hybrid plus rerank | One retrieval, one generation | Baseline | Almost always. Start here. |
| Query decomposition | Split into sub-questions, retrieve per sub-question, fuse, answer once | 1 extra call, N retrievals | Eval shows compound questions failing |
| Iterative retrieval | Retrieve, judge sufficiency, refine the query, retrieve again | 2 to 4 round trips | Research-style questions, exploratory corpora |
| Retrieval as a tool | The model decides whether and what to search, possibly several times | Unbounded unless capped | Mixed traffic where many turns need no retrieval at all |

Retrieval as a tool is the one worth understanding, because it removes the fixed pre-retrieval. "Thanks, that worked" no longer triggers a pointless vector search, and a hard question can trigger three.

```python
tools = [{
    "name": "search_docs",
    "description": "Search this tenant's documentation. Use for any factual question about their setup, policies, or runbooks.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string"},
            "section": {"type": "string", "description": "Optional section filter"},
        },
        "required": ["query"],
    },
}]
```

Two things to cap, always: total retrieval calls per turn, and total tokens accumulated across hops. Without both, an iterative loop will happily spend a dollar answering a question worth a cent.

:::warning
Agentic retrieval multiplies latency and cost by the number of hops and makes failures harder to reproduce. Adopt it when your eval set shows multi-hop failures, not because the architecture diagram looks better.
:::

→ See [Agent Design Patterns](../../genai-agents/agent_design_patterns.md) for the loop shapes this sits inside, and [Context Engineering](../../genai-agents/concepts/context-engineering.md) for managing what accumulates across hops.
