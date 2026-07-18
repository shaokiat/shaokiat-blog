---
sidebar_position: 1
---

# Context Engineering

> Everything the agent knows at any moment is what fits in the context window. This page covers the techniques for deciding what goes in and keeping it small: window management, memory tiers, chunking, and relevance scoring.

This is the technique layer beneath [Memory Management](../agent_design_patterns.md#9-memory-management) — that page covers *when* an agent needs memory; this one covers *how* each mechanism works.

---

## Context window management

The context window is a flat list of messages — system prompt, user turns, model reasoning, tool calls, tool results. Every token counts against the budget, and tool results are usually the biggest consumer: one large file read can cost thousands of tokens in a single step.

Four strategies, three reactive and one proactive:

| Strategy | How it works | Trade-off |
|---|---|---|
| **Sliding window** | Keep system prompt + last N messages, evict the rest | Early observations vanish — if step 15 depends on step 2, the agent fails or hallucinates |
| **Auto-compact** | Summarize old messages with a model call before evicting; inject the summary back | Costs latency and tokens; the summary may drop a detail that later matters |
| **Output truncation** | Cap tool results before they enter memory (`[output truncated]`) | The model can't see what was cut; pair with a way to re-fetch |
| **Token budget signaling** | Inject remaining-budget count into the system prompt so the model self-regulates verbosity | The only *proactive* strategy — but too aggressive a warning makes the model terse too early |

**Decision guide**

- Short sessions that fit comfortably → do nothing; management costs more than it saves
- Long tool-heavy sessions → truncate outputs first (cheapest), then add a sliding window
- Sessions where early decisions must survive → auto-compact with a summary prompt that preserves tool results, decisions, and open tasks — not prose
- Agent overshoots the limit mid-task → add budget signaling so it lands the task before the wall

**Used in:** [Data Validation Agent](../use_cases/data-validation-agent/implementation.md#where-state-lives) — session state as an in-context YAML block, updated per tool call.

---

## Memory tiers

Memory is what survives beyond the current window. Three tiers, ordered by scale:

| Tier | Survives restart | Scales to | Context cost |
|---|---|---|---|
| **Short-term** — the context window itself | No | ~200K tokens | O(history) |
| **Intermediate** — facts in a file, injected at session start | Yes | Dozens of facts | O(n) — everything injected |
| **Long-term** — indexed store, retrieved by relevance | Yes | Thousands of facts | O(k) — top-k only |

Intermediate memory breaks at hundreds of facts: token cost grows linearly, attention dilutes across irrelevant context, and eventually the injection alone blows the budget. The fix is retrieval — a clean system prompt, with the agent fetching only the top-k facts relevant to the current query. Scoring those facts is the [relevance scoring](#relevance-scoring) problem below.

**Used in:** [Data Validation Agent](../use_cases/data-validation-agent/implementation.md#session-state) (intermediate — in-context state block) · [Researcher Agent](../use_cases/researcher-agent/implementation.md#2c-compress-compresspy) (retrieval scoring applied statelessly — no store at all).

---

## Chunking strategies

Retrieval and compression both operate on chunks, and chunk boundaries decide what a relevance score can see. A chunk that splits mid-sentence scores poorly for every query; a chunk with three topics scores mediocre for all of them.

| Strategy | How it splits | Use when |
|---|---|---|
| **Fixed-size** | Every N chars, with overlap | Baseline; text has no exploitable structure |
| **Paragraph-aware** | Pack whole paragraphs up to the size limit; hard-slice only oversized ones | Prose with real paragraph breaks — scraped articles, docs. A few lines of code, no library |
| **Recursive** | Try splitting by section, then paragraph, then sentence, then chars | Mixed or nested structure (LangChain's `RecursiveCharacterTextSplitter`) |
| **Semantic** | Split where embedding similarity between adjacent sentences drops | Retrieval quality justifies an embedding pass per document |

Two knobs regardless of strategy:

- **Chunk size** — smaller chunks score more precisely but lose surrounding context; larger chunks preserve context but dilute the score. 500–1000 chars is the common range.
- **Overlap** — repeats the tail of one chunk at the head of the next so a fact straddling a boundary survives in at least one chunk. Only applies where hard slicing happens.

**Used in:** [Researcher Agent](../use_cases/researcher-agent/implementation.md#2c-compress-compresspy) — paragraph-aware at 800/100, chosen over recursive to avoid a LangChain dependency.

---

## Relevance scoring

Given a query and a pile of chunks (or facts), which ones deserve context space? Two base methods, each blind where the other sees:

| Method | Strength | Weakness |
|---|---|---|
| **BM25** (keyword) | Exact tokens — names, IDs, URLs, code | Misses paraphrase: "deployment infra" won't match "CI/CD" |
| **Embedding cosine similarity** | Semantic matches — concepts, synonyms | Smooths over exact tokens; "AWS" may not outrank a vaguely-cloudy chunk |
| **Hybrid** | Both | One extra scoring pass |

### Hybrid scoring

Normalize both score sets to [0, 1], combine with a weighted sum, take top-k. A common split is **0.3 BM25 + 0.7 vector** — semantic carries most queries, keyword rescues exact-token ones.

```text title="Hybrid scoring, in one pass"
bm25_scores   = BM25(chunks).score(query)         → normalize to [0,1]
vector_scores = cosine(embed(chunks), embed(query))
final         = 0.3 × bm25 + 0.7 × vector          → sort, keep top-k
```

Two implementation notes that matter more than the weights:

- **Batch the embedding call.** Embed all chunks plus the query in one API call, not one call per chunk. Faster, cheaper, and the idiomatic use of a batchable API.
- **Stateful vs stateless is a real fork.** A memory store embeds once at `add()` and persists the index for many future searches. Compression scores throwaway chunks once and discards them — no store, no persistence, plain functions. Same formula, different lifecycle; don't build the store when nothing needs to persist.

### Beyond hybrid

Techniques to append here as they come up in future use cases:

- **LLM re-ranking** — a second pass where a model re-orders the hybrid top-k; better precision, one extra call per query
- **Cross-encoder re-ranking** — scores query and chunk jointly instead of comparing separate embeddings; more accurate, doesn't scale past a shortlist

**Used in:** [Researcher Agent](../use_cases/researcher-agent/implementation.md#2c-compress-compresspy) — hybrid at 0.3/0.7, stateless, batched embeddings.
