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

RAG has four content pages covering the whole pipeline. A new RAG technique is a new `##` section or a new table row on the page that owns that decision, not a new file:

| Decision area | Page |
|---|---|
| Parsing, chunking, embeddings, metadata, vector store, index | `rag/ingestion-and-indexing.md` |
| Dense/hybrid search, reranking, prompt assembly, citations, agentic retrieval | `rag/retrieval-and-generation.md` |
| Offline metrics, eval sets, runtime guardrails, escalation | `rag/evaluation.md` |
| Latency, scaling, isolation, on-prem, monitoring | `rag/production.md` |

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

- **Customer framing** — every page opens with a blockquote in the form "A customer needed X. Here is the architecture and the tradeoffs." Frame the problem from the customer's perspective, not the technology's.
- **Official docs block** — always include a list of official doc links immediately after the framing. No content without a cited link.
- **`---` separator** — always place a horizontal rule between the docs block and the first section.
- **`:::info Best practice`** — use for key one-liner takeaways only. Not for general information. Close with `:::`.
- **Cross-references** — use `→ See [Page Title](./filename.md#section)` instead of repeating content. Prefer linking over duplicating.
- **Tables for comparisons**, bullet lists for options, bold for service/package names.
- **Code examples** — every section that introduces a concept should have a working code snippet.
- **Tight and opinionated** — short declarative sentences. Prefer a period over an em-dash; chains of em-dashes read as machine-written. Cut hedges ("it's worth noting", "genuinely").
- **No fluff** — omit background that doesn't change a decision. Prefer "use X when Y" over "X is a tool that does Y".
- **No comments in code** unless the WHY is non-obvious.
- **RAG pages share one running example**: Meridian Support Assist, a multi-tenant internal-docs assistant (~400k chunks, 120 tenants, 3 airgapped). Reuse it rather than inventing a new scenario.
- **MDX gotcha**: a bare `<` followed by a digit breaks the build. Write "under 10", not the symbol.

## After creating the file

1. Update `docs/ml-engineering/index.md` — add a linked row to the correct section table and renumber if needed.
2. Update `CLAUDE.md` if the section structure changed.
3. Run `npm run build` to confirm no broken links. If it reports a broken link to a page that clearly exists, run `npm run clear` first — a stale `.docusaurus` cache produces phantom broken links.

## Stub vs expanded

**Stub:** frontmatter, customer framing, official docs, `---`, and a `## Topics to cover` bullet list. No code yet.

**Expanded:** every subtopic becomes a `##` section with explanation, code example, and a `:::info Best practice` where applicable.

## Existing cross-reference map

Use these to add `→ See` links without duplicating content:

| Topic | Page | Key sections |
|---|---|---|
| Model loading, batching, health checks | `llm-inference/model-serving.md` | `#model-loading`, `#batching`, `#health--readiness-endpoints` |
| PagedAttention, continuous batching, quantization, GPU sizing | `llm-inference/vllm-serving.md` | `#prefill-vs-decode`, `#static-vs-continuous-batching`, `#quantization`, `#sizing-a-deployment` |
| Pipeline map, when RAG beats long context | `rag/index.md` | `#rag-is-a-retrieval-problem`, `#do-you-need-rag-at-all` |
| Parsing, chunking, embeddings, isolation, HNSW | `rag/ingestion-and-indexing.md` | `#parsing-comes-first`, `#chunking`, `#metadata-and-multi-tenant-isolation`, `#hnsw-vs-ivfflat` |
| Hybrid search, reranking, citations, agentic retrieval | `rag/retrieval-and-generation.md` | `#hybrid-search`, `#reranking`, `#grounding-and-citations`, `#agentic-and-multi-hop-retrieval` |
| Recall@k, RAGAS, eval sizing, escalation | `rag/evaluation.md` | `#retrieval-metrics-first`, `#how-much-eval-is-enough`, `#faithfulness-and-the-escalation-threshold` |
| Latency, scaling, tenant isolation, on-prem | `rag/production.md` | `#latency-budget`, `#scaling-the-corpus`, `#airgapped-and-on-prem`, `#what-to-monitor` |
| Agent loop shapes, context across hops | `../genai-agents/agent_design_patterns.md`, `../genai-agents/concepts/context-engineering.md` | — |
