---
sidebar_position: 6
---

# Production

> **Customer framing:** The pilot worked with 2,000 documents and one tenant. Now it is 400,000 chunks across 120 tenants, three of them airgapped, and the support team complains it feels slow. Here is where the time and the money go.

**Official docs:**
- [pgvector performance](https://github.com/pgvector/pgvector#performance) · [Postgres partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [vLLM optimization and tuning](https://docs.vllm.ai/en/latest/configuration/optimization.html)
- [Anthropic prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

---

## Latency budget

Budget the whole path to first token, then attack the largest slice. Meridian's target is 2 seconds to first token.

<svg className="ml-diagram wide" viewBox="0 0 600 250" role="img" aria-label="Latency waterfall to first token, showing generation and CPU reranking dominating">
  <text x="8" y="16" fontSize="10.5" fontWeight="600" className="box-text">Path to first token · GPU rerank</text>
  <rect x="8" y="26" width="52" height="18" rx="2" className="box-fill" />
  <rect x="62" y="26" width="8" height="18" rx="2" className="box-fill" />
  <rect x="72" y="26" width="14" height="18" rx="2" className="box-fill" />
  <rect x="88" y="26" width="10" height="18" rx="2" className="box-accent" />
  <rect x="100" y="26" width="200" height="18" rx="2" className="box-fill" opacity="0.85" />
  <text x="312" y="40" fontSize="10" className="axis-label">≈ 900 ms</text>

  <text x="8" y="74" fontSize="10.5" fontWeight="600" className="overfit-label">Path to first token · CPU rerank</text>
  <rect x="8" y="84" width="52" height="18" rx="2" className="box-fill" />
  <rect x="62" y="84" width="8" height="18" rx="2" className="box-fill" />
  <rect x="72" y="84" width="14" height="18" rx="2" className="box-fill" />
  <rect x="88" y="84" width="72" height="18" rx="2" className="box-accent" />
  <text x="124" y="97" textAnchor="middle" fontSize="9" className="box-text-accent">rerank</text>
  <rect x="162" y="84" width="200" height="18" rx="2" className="box-fill" opacity="0.85" />
  <text x="374" y="98" fontSize="10" className="overfit-label">≈ 1.2 s — rerank now costs more than search</text>

  <line x1="8" y1="126" x2="560" y2="126" className="axis-line" />
  <text x="34" y="142" textAnchor="middle" fontSize="9" className="axis-label">rewrite</text>
  <text x="34" y="154" textAnchor="middle" fontSize="8.5" className="axis-label">150–400</text>
  <text x="66" y="142" textAnchor="middle" fontSize="9" className="axis-label">embed</text>
  <text x="66" y="154" textAnchor="middle" fontSize="8.5" className="axis-label">10–30</text>
  <text x="79" y="168" textAnchor="middle" fontSize="9" className="axis-label">search</text>
  <text x="79" y="180" textAnchor="middle" fontSize="8.5" className="axis-label">5–50</text>
  <text x="124" y="142" textAnchor="middle" fontSize="9" className="box-text-accent">rerank</text>
  <text x="124" y="154" textAnchor="middle" fontSize="8.5" className="box-text-accent">15 GPU / 200+ CPU</text>
  <text x="240" y="142" textAnchor="middle" fontSize="9" className="axis-label">generation, first token</text>
  <text x="240" y="154" textAnchor="middle" fontSize="8.5" className="axis-label">300–1500</text>
  <text x="560" y="142" textAnchor="end" fontSize="9" className="axis-label">ms</text>

  <line x1="8" y1="196" x2="470" y2="196" className="margin-line" strokeWidth="2" strokeDasharray="5 4" />
  <text x="478" y="200" fontSize="10" className="fit-label">2 s target</text>
  <text x="8" y="228" fontSize="10" className="axis-label">Streaming moves the user-visible number to the left edge of generation, not to its right.</text>
</svg>

| Stage | Typical | Dominated by |
|---|---|---|
| Query rewrite, if multi-turn | 150 to 400 ms | A small model, or skip it on turn one |
| Embed the query | 10 to 30 ms | API round trip. Local model is faster. |
| ANN search | 5 to 50 ms | `ef_search`, corpus size, filter selectivity |
| Sparse search, parallel with ANN | 5 to 30 ms | GIN index, term frequency |
| Rerank 50 candidates | 15 to 40 ms GPU, 200 ms plus CPU | Batch size, chunk length |
| Prompt assembly | Under 5 ms | Nothing. It is string work. |
| Generation, first token | 300 ms to 1.5 s | Prompt length, model size, prefix cache |

Numbers are indicative. Measure your own with a span per stage.

Two surprises show up repeatedly. Reranking on CPU costs more than everything before it combined. And a conversational rewrite on every turn adds a fixed few hundred milliseconds that nobody accounted for.

---

## Cutting latency

| Move | Buys | Costs |
|---|---|---|
| Stream tokens | Perceived latency drops to TTFT | Nothing. Do it first. |
| Run dense and sparse in parallel | 5 to 30 ms | A little concurrency code |
| Cache query embeddings | 10 to 30 ms on repeats | Cache invalidation on model change |
| Cache full answers for common questions | Everything | Staleness. Key the cache by tenant and corpus version. |
| Prefix-cache the system prompt | 100 ms plus on generation | Requires stable prompt prefixes |
| Rerank on GPU, or use a hosted reranker | 150 ms plus | GPU cost, or per-call cost |
| Lower `ef_search` | 10 to 40 ms | Recall. Measure what you traded. |
| Skip rewrite on the first turn | 150 to 400 ms | One `if` statement |

:::info Best practice
Stream first, then parallelise, then cache. Only trade recall for latency once the free wins are gone, and always re-run the eval set after changing `ef_search`.
:::

---

## Scaling the corpus

Index memory is the constraint that arrives first.

| | |
|---|---|
| 400,000 chunks × 1536 dims × 4 bytes | 2.4 GB vectors |
| HNSW graph overhead, roughly 40% | 1.0 GB |
| **Total** | **≈ 3.4 GB, and it must stay in RAM** |

Growth options, cheapest first:

1. **Truncate dimensions.** A Matryoshka model at 512 dims cuts that to about 1.1 GB. Usually the best trade available.
2. **More RAM.** Boring, effective, and cheaper than an architecture change until it is not.
3. **Partition by tenant.** Postgres declarative partitioning on `tenant_id`, one index per partition. Small tenants get small, fast indexes, and isolation improves for free.
4. **Shard across nodes.** Only when one node cannot hold the working set.

Partitioning fixes the filtered-search problem structurally. Searching a partition holding 3,000 chunks needs no filter pushdown at all, because the filter became the table.

:::warning
Highly selective filters are where ANN recall quietly collapses. A tenant with 0.5 percent of the corpus can get near-empty results from an index that looks healthy in aggregate. Test as the smallest tenant.
:::

---

## Freshness and deletion

Ingestion is a pipeline, not a script someone runs. Give it a schedule, a queue, and a dead-letter path.

| Event | Path |
|---|---|
| New or edited document | Delete chunks by `doc_id`, re-parse, re-embed, insert |
| Deleted document | Hard delete from index, cache, and logs |
| Re-chunk or re-embed | Blue-green rebuild, verified on the eval set before the swap |
| Failed parse | Dead-letter queue with the document and the error, reviewed weekly |

Track corpus version per tenant. It is what invalidates answer caches and what tells you whether a bad answer came from stale content.

Right-to-be-forgotten is a deletion path with a legal deadline. It must reach the vector index, the embedding cache, the answer cache, and the retrieval logs. Write the test.

---

## Multi-tenant isolation in production

Correctness is enforced in the database, with RLS.

→ See [Ingestion & Indexing](./ingestion-and-indexing.md#metadata-and-multi-tenant-isolation) for the isolation models and the RLS policy.

What still bites you after RLS is on:

- **Uneven quality.** Recall varies per tenant with corpus size and document quality. Track recall per tenant, not globally, or a single large tenant will hide every small tenant's problems.
- **Noisy neighbours.** One tenant's bulk re-ingest competes for the same connection pool and the same GPU. Rate-limit ingestion per tenant and keep it off the serving path.
- **Cost attribution.** Log tokens and retrieval calls per tenant from day one. Retrofitting per-tenant cost is painful and someone will ask.

---

## Airgapped and on-prem

Meridian's three regulated tenants run entirely inside the customer's network. Every hosted component needs a self-hosted counterpart, decided up front.

| Component | Self-hosted choice |
|---|---|
| Embeddings | A local retrieval model, served on the same GPU box |
| Vector store | pgvector in the customer's Postgres |
| Reranker | Local cross-encoder, GPU if the latency target is tight |
| Generation | vLLM with an open-weight model |
| Judge for guardrails | A small local NLI model. A hosted judge is not available to you here. |

Constraints to plan for: no API fallback when the local model misbehaves, model weights shipped and versioned like any other artifact, and upgrades on the customer's maintenance window rather than yours. Keep the pipeline identical across cloud and on-prem and vary only the model endpoints, or you end up maintaining two products.

→ See [vLLM](../llm-inference/vllm-serving.md) for serving the generation model, including quantization and memory sizing on a fixed GPU budget.

---

## What to monitor

| Signal | Why it matters |
|---|---|
| Recall@k on the eval set, per tenant | The leading indicator. Everything else is downstream. |
| Empty-retrieval rate | A spike means an ingestion break or a new query type |
| Escalation rate | Rising means quality drift. Falling to zero means the threshold is wrong. |
| Groundedness distribution | The shape matters more than the mean |
| p95 latency per stage | Tells you which stage regressed, not just that something did |
| Tokens and cost per answer, per tenant | Where agentic retrieval shows up on the bill |
| Corpus version and ingestion lag | Answers about last week's change need last week's docs |

:::info Best practice
Alert on empty-retrieval rate and escalation rate. Both move before users complain, and neither needs a judge model to compute.
:::
