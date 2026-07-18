# CLAUDE.md — shaokiat-blog

This is a personal study and portfolio blog built with **Docusaurus v3**. Content lives in `docs/` and is written in Markdown. The site is deployed from the `main` branch.

---

## Skills

| Command | What it does |
|---|---|
| `/new-doc` | Create a new ML Engineering documentation page following the repo's style conventions |
| `/new-genai-doc` | Create a new GenAI Agents documentation page following the MCP guide's style conventions |

---

## GenAI & Agents Section

Content lives under `docs/genai-agents/`. Three layers, cross-linked:

- `agent_design_patterns.md` — architecture layer: how agent loops are shaped (ReAct, Plan-and-Execute, HITL, …)
- `concepts/` — technique layer: one page per **decision area** (context engineering, model I/O, reliability, evaluation), not per algorithm. New techniques are appended as sections or table rows to an existing page — never a new file per concept. A page splits only when it becomes unwieldy.
- `use_cases/` — one directory per use case (`index.md` overview + `implementation.md`), created with `/new-genai-doc` style conventions

Linking convention: use case pages link into concepts with `→ Concept: [Title](../concepts/page.md#anchor)` (mirrors the PCA `→ Reference:` convention). Each concept section ends with a **Used in:** backlink list to the use cases that apply it. Stub concept pages carry a `:::note Stub` admonition until filled.

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
