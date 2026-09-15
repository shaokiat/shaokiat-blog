# New Documentation Page

Create or extend a page in the ML Engineering section (`docs/ml-engineering/`) following the established conventions in this repo.

## What to ask the user

Before writing anything, ask for:
1. **Topic name** — e.g. "Streaming Responses", "Background Tasks"
2. **Section** — LLM Inference or RAG
3. **Scope** — stub (outline + official docs only) or expanded (fully written)

## Where it goes

| Section | Directory | New file or append? |
|---|---|---|
| LLM Inference | `docs/ml-engineering/llm-inference/` | New file per topic |
| RAG | `docs/ml-engineering/rag/` | **Append to an existing page.** Only create a new file if a page becomes unwieldy. |

RAG has five content pages covering the whole pipeline. A new RAG technique is a new `##` section or a new table row on the page that owns that decision, not a new file:

| Decision area | Page |
|---|---|
| Parsing, chunking, embeddings, metadata storage, vector store, index | `rag/ingestion-and-indexing.md` |
| Dense/sparse/hybrid search, RRF, metadata filtering, reranking, agentic retrieval | `rag/retrieval.md` |
| Prompt assembly, grounding, citations | `rag/generation.md` |
| Offline metrics, eval sets, runtime guardrails, escalation | `rag/evaluation.md` |
| Latency, scaling, isolation, on-prem, monitoring | `rag/production.md` |

The retrieval/generation boundary is the shortlist: `retrieval.md` ends when the top ~5 chunks are chosen.

File name for a new page: kebab-case of the topic. "Background Tasks" → `background-tasks.md`.

Sidebar position: check existing files in the target directory and use the next available integer.

`docs/ml-engineering/archive/` holds the retired FastAPI foundation pages. Every file there carries `draft: true`, so it is excluded from the production build and visible only under `npm start`. Do not add pages there, and **never link to an archive page from a published page** — a link to a draft page fails `npm run build`.

## Page structure — follow this exactly

```markdown
---
sidebar_position: <next available>
---

# <Topic Name>

> **Customer framing:** A customer needed X. Here is the architecture and the tradeoffs.

**Official docs:**
- [Label](url)
- ...

---

## <Section>

...content...

:::info Best practice
One-liner rule the reader should remember.
:::

→ See [Related Page](./related-page.md#section) for <what they'll find there>.
```

## Style rules

**Prose, tables, diagrams, and the code-is-a-last-resort rule live in `CLAUDE.md` → Writing & Diagram Style.** Read that section before writing. Page-specific additions:

- **Customer framing** — every page opens with a blockquote in the form "A customer needed X. Here is the architecture and the tradeoffs." Frame from the customer's perspective, not the technology's.
- **Official docs block** — a list of official doc links immediately after the framing, then a `---`. No content without a cited link.
- **`:::info Best practice`** — key one-liner takeaways only, not general information.
- **RAG pages share one running example**: Meridian Support Assist, a multi-tenant internal-docs assistant (~400k chunks, 120 tenants, 3 airgapped). Reuse it rather than inventing a scenario.
- **Open each page with a pipeline diagram** where the topic is a sequence of stages, followed by a stage table giving each stage's job and the cost of getting it wrong.

## After creating the file

1. Update `docs/ml-engineering/index.md` — add a linked row to the correct section table and renumber if needed.
2. Update `CLAUDE.md` if the section structure changed.
3. Run `npm run build` to confirm no broken links. If it reports a broken link to a page that clearly exists, run `npm run clear` first — a stale `.docusaurus` cache produces phantom broken links.

## Stub vs expanded

**Stub:** frontmatter, customer framing, official docs, `---`, and a `## Topics to cover` bullet list. No code yet.

**Expanded:** every subtopic becomes a `##` section with explanation, a comparison table or diagram, and a `:::info Best practice` where applicable. Code only if the reader will paste it.

## Existing cross-reference map

Use these to add `→ See` links without duplicating content:

| Topic | Page | Key sections |
|---|---|---|
| Model loading, batching, health checks | `llm-inference/model-serving.md` | `#model-loading`, `#batching`, `#health--readiness-endpoints` |
| PagedAttention, continuous batching, quantization, GPU sizing | `llm-inference/vllm-serving.md` | `#prefill-vs-decode`, `#static-vs-continuous-batching`, `#quantization`, `#sizing-a-deployment` |
| Pipeline map, when RAG beats long context | `rag/index.md` | `#rag-is-a-retrieval-problem`, `#do-you-need-rag-at-all` |
| Parsing, chunking, embeddings, isolation, HNSW | `rag/ingestion-and-indexing.md` | `#parsing-comes-first`, `#chunking`, `#metadata-and-multi-tenant-isolation`, `#hnsw-vs-ivfflat` |
| Hybrid search, BM25, RRF, metadata filtering, reranking, agentic retrieval | `rag/retrieval.md` | `#why-hybrid-search`, `#sparse-search-terms`, `#combining-them-with-rrf`, `#metadata-the-filter-both-retrievers-share`, `#reranking`, `#agentic-and-multi-hop-retrieval` |
| Context budget, chunk ordering, grounding, citations | `rag/generation.md` | `#building-the-prompt`, `#grounding-and-citations` |
| Recall@k, RAGAS, eval sizing, escalation | `rag/evaluation.md` | `#retrieval-metrics-first`, `#how-much-eval-is-enough`, `#faithfulness-and-the-escalation-threshold` |
| Latency, scaling, tenant isolation, on-prem | `rag/production.md` | `#latency-budget`, `#scaling-the-corpus`, `#airgapped-and-on-prem`, `#what-to-monitor` |
| Agent loop shapes, context across hops | `../genai-agents/agent_design_patterns.md`, `../genai-agents/concepts/context-engineering.md` | — |
