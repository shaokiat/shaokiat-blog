# CLAUDE.md — shaokiat-blog

This is a personal study and portfolio blog built with **Docusaurus v3**. Content lives in `docs/` and is written in Markdown. The site is deployed from the `main` branch.

---

## Skills

| Command | What it does |
|---|---|
| `/new-doc` | Create a new ML Engineering documentation page following the repo's style conventions |
| `/new-genai-doc` | Create a new GenAI Agents documentation page following the MCP guide's style conventions |

---

## Writing & Diagram Style

Applies to every page under `docs/ml-engineering/` and `docs/google-professional-cloud-architect/`, when editing as well as when creating. `docs/genai-agents/` implementation pages are the exception — there the code *is* the artifact, so they keep it.

**Prose**
- Short declarative sentences. Prefer a period over an em-dash; chains of em-dashes read as machine-written.
- Cut hedges ("it's worth noting", "genuinely", "in practice"). Omit background that doesn't change a decision.
- "Use X when Y", never "X is a tool that does Y".
- Name the failure a thing prevents. A stage or rule whose failure you can't name should be cut.

**Prefer a table or a diagram to a paragraph.** In order of preference:

| Content | Form |
|---|---|
| Comparison, options, trade-offs | Table |
| A rule with wrong answers worth showing | Table with a Result column, wrong rows included |
| A sequence of stages | Mermaid `flowchart LR` + a stage table |
| Spatial or quantitative intuition (curves, layers, waterfalls) | Inline SVG using the `.ml-diagram` classes in `src/css/custom.css` |
| A formula | One-line blockquote in plain words, not notation |

**Code is a last resort, not a default.** Include a block only when the reader will copy it verbatim (a prompt, a schema). Do not include library calls, function implementations, or DDL — name the operator, the setting, or the knob inline and let the linked docs carry the syntax. A table of knobs with defaults beats the `CREATE INDEX` that sets them.

**Formulas**: state the intuition, not the algebra. `tfidf = tf × log(N/df)` became "how often the term appears here × how rare it is across the corpus". Keep parameter names and their defaults in a table.

**Diagrams**
- Mermaid pipelines: wrap in `<div className="mermaid-scroll" style={{maxWidth: "900px", margin: "0 auto"}}>` so they scroll on mobile instead of shrinking.
- Node labels: one bold word plus a `<small>` detail line. Never a sentence.
- `classDef accent` marks the stages that matter; `classDef optional` (dashed) marks skippable ones. Both are styled in `custom.css` — never inline colours, the global mermaid CSS overrides them.
- Every coloured diagram needs a one-line legend beneath it saying what the colour *means* on that page.
- A diagram earns its place by showing a mechanism prose can't. Skip it for anything a table already handles.

**Cross-linking**: `→ See [Page](./file.md#anchor)`. Link instead of restating — if two pages explain the same mechanism, one of them should be a pointer.

**MDX gotchas**: a bare `<` before a digit breaks the build (write "under 10"). Use `className`, not `class`, in inline JSX.

Run `npm run build` after editing. It catches broken links and anchors. If it flags a link to a page that exists, `npm run clear` first.

---

## GenAI & Agents Section

Content lives under `docs/genai-agents/`. Three layers, cross-linked:

- `agent_design_patterns.md` — architecture layer: how agent loops are shaped (ReAct, Plan-and-Execute, HITL, …)
- `concepts/` — technique layer: one page per **decision area** (context engineering, model I/O, reliability, evaluation), not per algorithm. New techniques are appended as sections or table rows to an existing page — never a new file per concept. A page splits only when it becomes unwieldy.
- `use_cases/` — one directory per use case (`index.md` overview + `implementation.md`), created with `/new-genai-doc` style conventions

Linking convention: use case pages link into concepts with `→ Concept: [Title](../concepts/page.md#anchor)` (mirrors the PCA `→ Reference:` convention). Each concept section ends with a **Used in:** backlink list to the use cases that apply it. Stub concept pages carry a `:::note Stub` admonition until filled.

---

## ML Engineering Section

Content lives under `docs/ml-engineering/`. Two active subfolders plus an archive:

- `llm-inference/` (sidebar position 2) — model serving, vLLM, streaming, agent endpoints
- `rag/` (position 3) — `index.md`, `ingestion-and-indexing.md`, `retrieval.md`, `generation.md`, `evaluation.md`, `production.md`, in that sidebar order
- `archive/` — the old Tier 1 FastAPI foundation pages. Every page carries `draft: true`, so they are excluded from the production build and visible only via `npm start` (same pattern as the Supabase pages in `docs/database/`). Do not link to them from published pages: a link to a draft page breaks `npm run build`.

RAG pages share one running example: **Meridian Support Assist**, a multi-tenant internal-docs assistant. Keep it when adding sections. New RAG material is appended to one of the five existing pages; add a sixth only when a page becomes unwieldy.

The retrieval/generation boundary is the shortlist: `retrieval.md` ends when the top ~5 chunks are chosen, `generation.md` starts there. Metadata is split the same way — `ingestion-and-indexing.md` owns what is attached and how it is indexed, `retrieval.md` owns how it gates, boosts, and interacts with ANN selectivity.

---

## Google Professional Cloud Architect (PCA) Section

All PCA content lives under `docs/google-professional-cloud-architect/`.

### Structure

```
docs/google-professional-cloud-architect/
├── _category_.json          # Sidebar label: "GCP Cloud Architect ☁️", position 5
├── index.md                 # Landing page: brief intro + case study links + full 6-section exam guide
├── reference/               # Sidebar position 2 — concise decision guides per GCP topic
│   ├── _category_.json
│   ├── cloud-storage.md
│   ├── compute-selection.md
│   ├── database-selection.md
│   ├── hybrid-connectivity.md
│   ├── vertex-ai-genai.md
│   ├── security-controls.md
│   └── networking-services.md
└── case-studies/            # Sidebar position 3 — one page per official exam case study
    ├── _category_.json
    ├── altostrat-media.md
    ├── cymbal-retail.md
    ├── ehr-healthcare.md
    └── knightmotives-automotive.md
```

### Page Conventions

**`intro.md`** — the single overview page. Contains a brief description, links to all 4 case studies, and the full 6-section PCA exam guide outline. Do not create a separate study guide page; keep everything here to avoid duplication.

**Reference pages** — each covers one GCP topic area. Structure:
1. One-line intro with link to official Google Cloud docs
2. "Options at a Glance" comparison table
3. Decision guide — scenario-based ("when X → use Y")
4. Detailed subsections for nuanced topics (e.g. key types in Cloud KMS, tier differences in SCC)
5. Official Documentation links at the bottom

Every reference page must include cited links to `cloud.google.com` docs. Do not add content without a doc link.

**Case study pages** — one per official PCA exam case study. Structure:
1. Callout block with link to official case study PDF (and any supplementary resources)
2. "What This Case Study Is About" — 2–3 sentence theme summary
3. "Existing Environment" table (if known from the official PDF)
4. "Key Requirements to Focus On" — grouped by theme, each group prefixed with `→ Reference:` links to relevant reference pages
5. "Exam Tips" — bullet list of signal → answer mappings

### Adding New Reference Pages

1. Create the file under `reference/` with the next `sidebar_position` number.
2. Follow the structure above — options table, decision guide, doc links.
3. Link back from any case study that touches that topic using `→ Reference: [Title](../reference/filename.md)`.
4. Add a one-line entry to `intro.md` under the relevant exam section (e.g. Section 1.3) pointing to the new page.

### Adding New Case Studies

If Google updates the official PCA exam case studies:
1. Create a new file under `case-studies/` with the next `sidebar_position`.
2. Use the official case study PDF as the source of truth for business and technical requirements.
3. Keep the page focused on exam-relevant architecture decisions — do not dump the full PDF content.
4. Update the Case Studies list in `intro.md`.

### Writing Style

- Exam-oriented: every section should answer "what would the exam test here?"
- Decision guides over descriptions — prefer "use X when Y" over "X is a service that does Y"
- Tables for comparisons, bullet lists for options, bold for service names
- No fluff — omit background that doesn't change an architectural decision
- Cite official Google Cloud docs for every service mentioned

### Sidebar Positions

Docusaurus uses `sidebar_position` in frontmatter to order pages within a category. Current assignments:

| File | Position |
|---|---|
| `index.md` | — |
| `reference/` category | 2 |
| `case-studies/` category | 3 |
| `reference/cloud-storage.md` | 1 |
| `reference/compute-selection.md` | 2 |
| `reference/database-selection.md` | 3 |
| `reference/hybrid-connectivity.md` | 4 |
| `reference/vertex-ai-genai.md` | 5 |
| `reference/security-controls.md` | 6 |
| `reference/networking-services.md` | 7 |
| `reference/vpc-and-firewall.md` | 8 |
| `reference/backup-and-recovery.md` | 9 |
| `reference/infrastructure-orchestration.md` | 10 |
| `reference/high-availability-dr.md` | 11 |
| `reference/data-processing.md` | 12 |
| `reference/migration.md` | 13 |
| `reference/well-architected-framework.md` | 14 |
| `reference/ci-cd.md` | 15 |
| `reference/cost-optimization.md` | 16 |
| `reference/observability.md` | 17 |

When adding a new reference page, increment from 17 onwards. When adding a new case study, increment from 4 onwards.
