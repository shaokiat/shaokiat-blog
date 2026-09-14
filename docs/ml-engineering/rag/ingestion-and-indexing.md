---
sidebar_position: 2
---

# Ingestion & Indexing

> **Customer framing:** A customer hands you 40 GB of PDFs, exported HTML, and a ticket database, and asks how long until the assistant works. The answer depends almost entirely on what happens before a single embedding is computed.

**Official docs:**
- [pgvector README](https://github.com/pgvector/pgvector) · [HNSW and IVFFlat indexing](https://github.com/pgvector/pgvector#indexing)
- [Unstructured document parsing](https://docs.unstructured.io/open-source/core-functionality/partitioning)
- [LangChain text splitters](https://python.langchain.com/docs/concepts/text_splitters/)
- [OpenAI embeddings](https://platform.openai.com/docs/guides/embeddings) · [MTEB retrieval leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
- [Postgres row-level security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

## Parsing comes first

No retrieval tuning recovers from a bad parse. A mis-parsed table does not produce an empty embedding, it produces a confident wrong one. Budget more time here than on chunking.

| Source | What breaks | What to do |
|---|---|---|
| Native PDF | Reading order in two-column layouts, repeated headers and footers | Layout-aware parser, strip repeating lines per page |
| Scanned PDF | OCR errors baked into the text silently | OCR with per-character confidence, quarantine low-confidence pages |
| HTML | Nav bars, cookie banners, and footers embedded into every chunk | Extract the main content node, drop boilerplate before chunking |
| DOCX, PPTX | Nothing much. Structure is in the file already. | Use headings and slide titles as chunk metadata |
| Tickets, DB rows | Nothing. It is already structured. | Template each row into a short document, keep the ID |

**Tables are the hard part.** Linearising a table to plain text destroys the row-column binding, so "Enterprise plan, 30 day retention" becomes three loose words in a bag. Three options, in order of effort:

1. Serialise each table to markdown and keep it in one chunk. Cheap, works up to roughly 30 rows.
2. Emit one chunk per row with the header prepended: `Plan: Enterprise | Retention: 30 days | SLA: 4h`. Survives chunking, retrieves precisely.
3. Keep tables in Postgres as real rows and query them alongside the vector search. Correct, and more plumbing.

```python
from unstructured.partition.pdf import partition_pdf

elements = partition_pdf(
    "runbook.pdf",
    strategy="hi_res",              # layout model, not raw text extraction
    infer_table_structure=True,     # tables come back as HTML, not soup
)

for el in elements:
    if el.category == "Table":
        store_table(el.metadata.text_as_html, page=el.metadata.page_number)
```

:::warning
Read the parsed output of ten random documents with your own eyes before building anything on top of it. This single habit catches more RAG failures than any metric.
:::

---

## Chunking

A chunk is the unit of retrieval and the unit of context. Those two pull in opposite directions: small chunks retrieve precisely, large chunks answer completely.

| Strategy | How | Use when |
|---|---|---|
| Fixed-size | N tokens, fixed overlap | Baseline. Uniform prose with no structure. |
| Recursive | Split on paragraph, then sentence, then token, until under the limit | Default choice for mixed documents |
| Structural | Split on markdown headings or HTML sections | Docs with real headings. Best quality per unit of effort. |
| Semantic | Split where consecutive sentence embeddings diverge | Long unstructured transcripts. Costs an embedding pass. |
| Document-aware | Per row, per slide, per function | Tables, code, slide decks |

Start at 500 to 800 tokens with 10 to 15 percent overlap, then move it based on eval scores, not taste.

**Always prepend context to the chunk.** A chunk that reads "It must be rotated every 90 days" is unretrievable and unusable. The same chunk prefixed with `Meridian Support Assist > Security Policy > API Keys` is both.

```python
def contextualise(chunk: str, doc_title: str, section_path: list[str]) -> str:
    breadcrumb = " > ".join([doc_title, *section_path])
    return f"{breadcrumb}\n\n{chunk}"
```

:::info Best practice
Prepend the document title and section breadcrumb to every chunk before embedding. It is three lines of code and usually the largest single recall win available.
:::

---

## Embeddings

| Decision | Rule |
|---|---|
| Model family | Pick a retrieval-tuned model, not a general sentence encoder. Check MTEB retrieval, not the overall average. |
| Hosted or self-hosted | Self-host if you are airgapped or re-embedding often. Hosted otherwise. |
| Dimensionality | Higher recall, linearly higher memory and index cost |
| Max input | Must exceed your chunk size plus the breadcrumb, or you silently truncate |
| Asymmetric prefixes | Some models need `query:` and `passage:` prefixes. Skipping them quietly costs recall. |

Index memory is easy to estimate and easy to forget:

```
400,000 chunks x 1536 dims x 4 bytes = 2.4 GB of raw vectors
HNSW graph overhead adds roughly 30 to 50 percent on top.
```

Matryoshka models let you truncate 1536 dimensions to 512 and keep most of the recall. That is a 3x cut in index memory for a few points of recall, and it is usually the right trade at corpus scale.

:::danger One-way door
Changing the embedding model means re-embedding the entire corpus and rebuilding every index. Decide it once, deliberately, and write down why.
:::

---

## Metadata and multi-tenant isolation

Anything you filter on must be a column, not a key inside a JSON blob. Filtering is part of the query plan, and the planner cannot help you if the value is buried.

Minimum useful metadata per chunk: `tenant_id`, `doc_id`, `source_uri`, `section_path`, `updated_at`, `acl_group`.

| Isolation model | Blast radius of a bug | Ops cost | Use when |
|---|---|---|---|
| Shared table, `tenant_id` filter | Every tenant | Low | Many small tenants, and RLS is on |
| Schema per tenant | One tenant | Medium | Tens of tenants, per-tenant retention rules |
| Database per tenant | One tenant | High | Regulated or airgapped tenants |

Meridian runs shared tables for the 117 cloud tenants and separate databases for the three on-prem ones.

**Enforce isolation in the database, not the application.** One forgotten `WHERE tenant_id = ...` in one code path is a cross-tenant leak.

```sql
ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON chunks
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Pre-filter versus post-filter is not a detail.** If the ANN index searches globally and the tenant filter is applied afterwards, a tenant holding 1 percent of the corpus gets far fewer than `k` results, sometimes zero. pgvector handles this with iterative scans; other engines want the filter pushed into the search.

```sql
SET hnsw.iterative_scan = relaxed_order;
SET hnsw.max_scan_tuples = 40000;
```

:::warning
Test retrieval as your smallest tenant, not your largest. Recall collapses at low selectivity, and the big tenant will never show you the bug.
:::

---

## Choosing the vector store

| Option | Filtering | Hybrid search | Ops burden | Pick it when |
|---|---|---|---|---|
| **pgvector** | Native SQL, RLS | Needs `tsvector` plus manual fusion | Lowest if you already run Postgres | The data already lives in Postgres. Default. |
| **Qdrant** | Strong payload filters, pre-filtered search | Built in | Medium, self-hostable | Filter-heavy workloads, on-prem |
| **Weaviate** | Good | Built in, tunable alpha | Medium | You want hybrid without writing fusion |
| **Pinecone** | Good, namespaces per tenant | Sparse plus dense | None, it is managed | You want zero ops and accept lock-in |

Under roughly 10 million vectors, pgvector with HNSW is fast enough and you keep joins, transactions, backups, and RLS. Reach for a dedicated store when you outgrow one node or need pre-filtered search that Postgres cannot plan well.

---

## HNSW vs IVFFlat

Both are approximate. Recall is a dial you set, not a property you receive.

| | HNSW | IVFFlat |
|---|---|---|
| Structure | Navigable small-world graph | Inverted lists around k-means centroids |
| Build time | Slow | Fast |
| Memory | High, graph lives in RAM | Low |
| Query speed at high recall | Faster | Slower |
| Needs data before build | No | Yes, it clusters existing rows |
| Handles heavy inserts | Yes | Degrades, needs rebuilds |
| Knobs | `m`, `ef_construction`, `ef_search` | `lists`, `probes` |

```sql
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

SET hnsw.ef_search = 100;  -- raise for recall, lower for latency
```

Defaults worth knowing: `m = 16` and `ef_construction = 64` are fine for most corpora. `ef_search` is the runtime dial. Raising it from 40 to 200 buys recall and costs latency, and it is the first thing to tune when retrieval misses.

For IVFFlat, `lists ≈ rows / 1000` up to a million rows, then `sqrt(rows)`, with `probes` around `sqrt(lists)`.

:::info Best practice
Choose HNSW unless build time or memory forces your hand. Then measure recall against exact search on 200 queries and set `ef_search` from the curve, not from a blog post.
:::

---

## Keeping the index current

| Change | Cheapest correct move |
|---|---|
| New document | Insert chunks. HNSW absorbs inserts fine. |
| Edited document | Delete chunks by `doc_id`, insert new ones. Never patch in place. |
| Deleted document | Hard delete, then confirm it is gone from retrieval. Tombstones leak. |
| Changed chunking strategy | Full rebuild |
| Changed embedding model | Full rebuild, blue-green |

Blue-green is the only rebuild pattern worth writing down. Build the new index into a second table, verify recall on the eval set, swap in one transaction, keep the old table for a day.

```sql
BEGIN;
ALTER TABLE chunks RENAME TO chunks_old;
ALTER TABLE chunks_new RENAME TO chunks;
COMMIT;
```

Right-to-be-forgotten requests are a deletion path with a deadline. Make sure it reaches the index, the embedding cache, and the retrieval logs.

→ See [Production](./production.md#freshness-and-deletion) for the ingestion pipeline as a scheduled job.

→ Next: [Retrieval & Generation](./retrieval-and-generation.md).
