---
title: Accident Case Management
sidebar_label: Accident Case Management
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Case Study: AI Assistant for Accident Case Management

> Builds on: [RAG](../../ai-engineering/rag/index.md) · [Ingestion & Indexing](../../ai-engineering/rag/ingestion-and-indexing.md) · [Retrieval](../../ai-engineering/rag/retrieval.md) · [Generation & Grounding](../../ai-engineering/rag/generation.md) · [Evaluation & Guardrails](../../ai-engineering/rag/evaluation.md)

A police force wants an AI system for accident cases, and the brief is three sentences long. This breakdown works through it the way a forward deployed engineer would: discovery before design, decomposition before architecture. It avoids the most common failure: jumping straight to "vector database + LLM" and building the wrong thing well.

## The brief

> A police force records accidents in a legacy application: notes, photos, insurance details and property damage. Some data is structured in a database; the rest is unstructured (notes, PDFs, images).
>
> Design an AI system that takes the details of an accident and returns:
> - relevant past cases,
> - ratings of the people and vehicles involved.

:::warning[Gaps in the brief]
No user. No workflow. No definition of "similar" or "rating". Framing closes these gaps.
:::

## How to approach it

<ThemedImage
  alt="Five areas in order: framing, decomposition, architecture, guardrails and evaluation, delivery, each with the output it produces"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-1-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-1-dark.svg'),
  }}
/>

*Figure C1-1: The order to work through the case study. Amber marks the two areas most often skipped, and the ones that change the design most.*

| Area | Output | Failure if skipped |
|---|---|---|
| [Problem framing](#problem-framing) | A refined problem statement | A well-built system for the wrong user |
| [Decomposition](#decomposition) | A capability table | Everything forced into one vector index |
| [Architecture](#architecture) | Components mapped to capabilities | Exact facts answered by similarity search |
| [Guardrails and evaluation](#guardrails-and-evaluation) | Rules and success measures | Fabricated history about a real person |
| [Delivery](#delivery) | A phased roadmap | High-risk features shipped before governance |

The order matters because each area depends on the previous one: the capabilities come from the framing answers, and the phasing depends on which capabilities are low-risk.

## Problem framing

Ask, record the answer, and note how it changes the design. Where the client can't answer, state an assumption and move on.

| Area | Question | Answer | Design impact |
|---|---|---|---|
| Goal | Speed up officers, improve investigations, or both? | Help officers handle cases faster, with better context | Success is officer time saved, not model accuracy |
| Users | Who uses it, and how? | Officers logging accidents, through a chatbot | Conversational intake |
| Workflow | What takes them the most time today? | Entering details, and working out which procedures and paperwork apply | **New requirement:** workflow guidance |
| Inputs | What does the officer provide? | Car model, license, incident type, number of parties | Defines what the chatbot must extract |
| Outputs | What does "relevant cases" mean? | Same place and time, same people or vehicles, same kind of incident | Three meanings, three methods: filters, exact match, semantic search |
| Roadmap | Should it flag things over time? | Eventually: repeat suspects, multi-incident vehicles, risk ratings | A later phase |
| Data* | How much history? | A few years | Enough for retrieval to be useful |
| Hosting* | Can data leave the environment? | On-premises only | Self-hosted LLM and embedding models |
| Integration* | Read only, or also create cases? | Read-only to start | Legacy system stays out of the blast radius |

\* Working assumption, not confirmed by the client.

### The rating requirement

| Question | Answer |
|---|---|
| What does a "rating" mean, and what decisions would it affect? | Something like an honor or social rating for people and vehicles |

As stated, this is the highest-risk requirement in the brief. Raise it during framing, before it shapes the design:

| Aspect | Recommendation |
|---|---|
| Risk | Scores invite bias, judge people by a number they can't see or challenge, and create legal exposure. The EU AI Act prohibits social scoring by public authorities. |
| Alternative | An **incident history profile**: factual indicators like prior incidents, each linked to its source record |
| Accountability | The officer makes the judgment, not the system |

<ThemedImage
  alt="Feedback loop: more policing in an area leads to more recorded incidents, which raise scores for residents, which justify more policing"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-2-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-2-dark.svg'),
  }}
/>

*Figure C1-2: The bias loop a person score creates. Amber is the step the system adds. Without it, the loop has nothing to amplify.*

**Design impact:** profiling becomes a deterministic, evidence-linked query, not a score.

### Refined problem statement

> An AI chatbot that helps officers record an accident conversationally, then returns the workflow and paperwork that apply, similar past cases, and an evidence-based history of the people and vehicles involved, later adding proactive flags.

The problem started as a data request ("find similar cases") and is now a workflow problem ("help an officer handle this accident faster").

:::tip[In the interview]
Say the refined statement out loud and get the interviewer to agree before you design anything. Then: "Let me break this into capabilities, then go through the architecture from the top down. Stop me anywhere you want more detail."
:::

## Decomposition

| # | Capability | Technique | Why |
|---|---|---|---|
| 1 | Conversational intake | LLM extracts structured details over several turns | Officers describe accidents in free text |
| 2 | Similar case search | Filters + keyword + vector search, fused | "Similar" has three meanings |
| 3 | Workflow and paperwork | Rules select the workflow from a fixed catalog; RAG only for follow-up questions | Workflows are predetermined; the wrong one has legal consequences |
| 4 | People and vehicle history | Exact database queries over linked records | An LLM must never invent someone's history |

Not everything with an LLM is RAG: only capability 2 is retrieval in the usual sense. The architecture gives each capability its own component, built around a shared storage layer.

## Architecture

:::tip[Presenting the architecture]
In a 45-minute session, spend about 10 minutes on framing, 25 on the architecture and 10 on follow-ups. Open with Figure C1-3, then go one layer deeper at a time along the data's path. If you're pulled into a deep dive early, follow it, and cover guardrails and delivery briefly at the end.
:::

### System overview

The system splits into a background **write path** and a live **read path** that share one storage layer. The LLM never answers from memory, only from what it retrieves.

<ThemedImage
  alt="Big picture: a background write path from the legacy system through ingestion into storage, and a live read path from officer to chatbot to retrieval, both sharing a storage layer of SQL store, vector index, workflow catalog and procedures index; access control, audit logs and evaluation span every layer"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-3-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-3-dark.svg'),
  }}
/>

*Figure C1-3: Two paths, one storage layer. Blue is processing, amber is the read path and the LLM, green is storage, grey is the external source. The architecture figures below use the same colours, and the sections below follow its boxes: ingestion, storage, retrieval, chatbot.*

Two paths exist because OCR and table joins are too slow to run while the officer waits. Heavy work is done ahead of time. The write path is the librarian cataloguing books as they arrive; the read path is the front desk helping a visitor.

| Store | Answers | Example | Capability |
|---|---|---|---|
| SQL store | "What's true?" | "This plate appears in 2 past cases." | 4 People and vehicle history |
| Vector index | "What's similar?" | "5 comparable night-time rear-end collisions nearby." | 2 Similar cases |
| Workflow catalog | "What must I do?" | "Two-vehicle rear-end, no injuries: W-RE-01, forms F-12 and F-19." | 3 Workflow, exact and versioned |
| Procedures index | "Why, or what if?" | "When must the other driver's insurer be notified?" | 3 Follow-up questions |

Capability 1, intake, is the chatbot itself. It runs an open-weight LLM, self-hosted on-premises, as is the embedding model.

| Design principle | Failure it prevents |
|---|---|
| The LLM is the interface, not the source of truth. Every claim cites a record. | A fluent, invented history about a real person |
| Vectors answer "what's similar". SQL answers "what's true". | ABC1234 and ABC1243 treated as the same plate |
| The LLM plans, code executes. | Unvalidated queries and unpredictable tool calls |
| Sit beside the legacy system. Read from a replica. | Load or writes that disrupt the system of record |

### Ingestion (write path)

:::warning[The naive answer]
Serialize every row as `column: value` text, embed it, and embed PDF text too. It misses:

- **Exact values:** IDs, counts, dates, locations.
- **The case:** rows fragment it across tables.
- **Images:** photos and scans go unread.
- **Identity:** no entity resolution.
- **Workflows:** no catalog.
- **Freshness:** no continuous sync.
- **Control:** no metadata or access levels.
:::

<ThemedImage
  alt="Ingestion pipeline in six stages, top to bottom: capture changes, extract content, clean and normalize, resolve entities, build case documents, index; low-confidence extractions and uncertain entity matches go to human review"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-4-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-4-dark.svg'),
  }}
/>

*Figure C1-4: Six stages, one direction. Dashed grey is the human review path for anything the pipeline isn't sure of. Green is where data lands.*

| # | Stage | What it does | Failure it prevents |
|---|---|---|---|
| 1 | Capture changes | CDC from a read replica (fallback: incremental sync on a last-modified timestamp). A file watcher picks up new photos and PDFs. A one-off backfill loads history first. | A stale index, or load on the system of record |
| 2 | Extract content | OCR, vision and layout parsing (table below). Every field stores a confidence score and a link to its source. | Photos and scans invisible to search |
| 3 | Clean and normalize | Decode codes (`07` → `rear_end_collision`), standardize dates and timezones, geocode addresses, normalize IDs (`abc 1234` → `ABC1234`). Quality checks flag rows, never drop them. | One vehicle stored under two spellings |
| 4 | Resolve entities | Exact match on license, VIN and plate. Fuzzy match for names and misread plates. Stable entity IDs. | One driver split into several histories |
| 5 | Build case documents | Join incident, persons, vehicles, insurance and extractions on `case_id`. Split into text to embed and metadata. | A case fragmented across tables |
| 6 | Index | SQL for facts and links. Vector index for embedded chunks + metadata. BM25 for identifiers. | Exact lookups answered by similarity |

| Input | Tool | Output |
|---|---|---|
| License photo | OCR / vision-language model | Name, license number, expiry |
| Plate photo | Plate recognition / OCR | Plate number |
| Damage photo | Vision model caption (optionally an image embedding) | "Rear bumper crushed, tail light broken" |
| Scanned or form PDF | Layout-aware parser + OCR | Form fields, tables intact |
| Typed notes | None | Text as is |

:::danger[A false merge is worse than a missed match]
A false merge gives someone another person's history. A missed match only loses a link. Set strict thresholds and send uncertain matches to human review.
:::

**Workflow catalog and procedures index.** A separate, simpler pipeline. The catalog is built from the procedure manuals, owned by the procedures team, and versioned with effective dates. The procedures index chunks the same manuals for follow-up questions.

<details>
<summary>Production properties</summary>

| Property | What it means |
|---|---|
| Idempotent | Upserts keyed on source IDs; a replayed event changes nothing |
| Handles updates and deletes | A corrected case re-embeds its chunks; a deleted one disappears from every store |
| Provenance | Every field links back to its source record or document |
| Reprocessable | Raw inputs are kept, so a better OCR or embedding model can re-run history |
| Observable | Sync lag, error rate, review queue size, confidence distribution |
| Secure | On-premises; access levels copied into metadata; sensitive fields masked |

</details>

→ See [The ingestion pipeline](../../ai-engineering/rag/ingestion-and-indexing.md#the-ingestion-pipeline) and [Keeping the index current](../../ai-engineering/rag/ingestion-and-indexing.md#keeping-the-index-current)

### Storage

#### Linking structured and unstructured data

Everything links through two keys: `case_id` and `entity_id`.

<ThemedImage
  alt="Data model: CASES and ENTITIES are joined by CASE_ENTITIES; CASES have DOCUMENTS, which yield EXTRACTIONS resolved to ENTITIES; CHUNKS belong to CASES and come from DOCUMENTS"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-5-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-5-dark.svg'),
  }}
/>

*Figure C1-5: The data model. Blue is structured, grey is unstructured, green is the vector layer. Amber is EXTRACTIONS, the bridge between the two worlds. Every arrow is one-to-many.*

| Side | Tables | Holds |
|---|---|---|
| Structured | CASES, CASE_ENTITIES, ENTITIES | Facts, and who was involved in which role |
| Unstructured | DOCUMENTS | Photos, PDFs and notes, each tied to a case |
| Bridge | EXTRACTIONS | Fields read from documents, each with a confidence and a resolved `entity_id` |
| Vector | CHUNKS | Embedded text, linked back to its case and document |

The bridge in action: OCR reads a plate from a photo, entity resolution assigns its `entity_id`, and the photo now links to the same vehicle as the structured records.

```text
Case C-0001
 ├─ CASE_ENTITIES: driver = E-55 (person), vehicle = E-91 (car ABC1234)
 ├─ DOCUMENT D-7: license photo   → EXTRACTION license_no "L-998812", 0.97 → E-55
 ├─ DOCUMENT D-8: plate photo     → EXTRACTION plate "ABC1234", 0.91       → E-91
 └─ DOCUMENT D-9: insurance PDF   → EXTRACTION policy holder               → E-55
```

#### What goes where: SQL vs vectors

Structured data doesn't need to become vectors. Retrieval in RAG can be a database query.

| Approach | How | Good for | Weakness |
|---|---|---|---|
| Serialize & embed | Rows → text → vectors | Fuzzy "cases like this" | Bad at exact values, counts, dates, locations |
| Query via tools | LLM calls predefined parameterized SQL | "How many incidents for plate X?" | Only anticipated questions |
| **Hybrid (recommended)** | Embed case text + metadata, and expose SQL tools | Both | More moving parts |

| SQL tool | Answers |
|---|---|
| `get_entity_history(plate_or_license)` | Every case this person or vehicle appears in |
| `count_incidents(entity_id, since_date)` | "How many since last year?" |
| `find_cases(location, radius_m, time_window, incident_type)` | "What happened near here recently?" |
| `get_case_details(case_id)` | The full record behind a citation |

Officers get predefined tools, not text-to-SQL. Predefined tools prevent injection, enforce access inside each function, and avoid wrong generated joins. Text-to-SQL can come later for analysts, on a read-only replica with restricted views.

| `chunk_type` | Embedded text | Source |
|---|---|---|
| `case_summary` | Short summary per case | Generated from structured fields |
| `narrative` | Incident description and notes, chunked if long | Notes field |
| `document_text` | Text from PDFs and scanned forms | OCR / layout parser |
| `image_caption` | Description of damage and scene photos | Vision model |
| `procedure` | Procedure manual sections | Procedures index, for follow-up questions |

Each chunk also carries link IDs, filter metadata copied from CASES, and provenance.

:::info[Rule of thumb]
If you'd filter or match on it exactly, it's metadata. If you'd describe it in words, embed it.
:::

Some facts are duplicated on purpose. SQL is the source of truth; the metadata copy exists only for filtering. With pgvector, the metadata is ordinary columns:

```sql
CREATE TABLE case_chunks (
  chunk_id       BIGSERIAL PRIMARY KEY,
  case_id        TEXT NOT NULL,
  document_id    TEXT,
  chunk_type     TEXT NOT NULL,
  chunk_text     TEXT NOT NULL,
  embedding      VECTOR(768),
  incident_type  TEXT,               -- same enum as SQL: 'rear_end_collision'
  occurred_at    TIMESTAMPTZ,
  location       GEOGRAPHY(POINT),  -- PostGIS
  plates         TEXT[],
  access_level   TEXT,
  source_version INT
);

SELECT case_id, chunk_text
FROM case_chunks
WHERE incident_type = 'rear_end_collision'
  AND occurred_at > now() - interval '2 years'
  AND ST_DWithin(location, :point, 1000)
  AND access_level = ANY(:user_levels)
ORDER BY embedding <=> :query_vector
LIMIT 10;
```

<details>
<summary>The same search on a dedicated vector database</summary>

Metadata is a JSON payload. Create payload indexes on frequently filtered fields.

```python
results = client.search(
    collection="case_chunks",
    vector=query_vector,
    filter={
        "must": [
            {"key": "incident_type", "match": "rear_end_collision"},
            {"key": "occurred_at", "range": {"gte": "2023-10-01"}},
            {"key": "location", "geo_radius": {"lat": 0.0, "lon": 0.0, "radius_m": 1000}},
            {"key": "access_level", "match_any": user_levels},
        ]
    },
    limit=10,
)
```

</details>

**Filter before ranking.** Post-filtering takes the top-k by similarity and then drops non-matching rows, which can leave 2 results out of 10, or none. Pre-filtering ranks only matching records, and it's the only safe way to enforce access. **Use pgvector by default**: links, filters and access checks run in one transaction. A dedicated vector database earns its place at large scale. Then sync it through the pipeline, stamp `source_version` on every chunk, and monitor drift from SQL.

→ See [Selectivity breaks ANN, not BM25](../../ai-engineering/rag/retrieval.md#selectivity-breaks-ann-not-bm25) and [Choosing the vector store](../../ai-engineering/rag/ingestion-and-indexing.md#choosing-the-vector-store)

### Retrieval (read path)

#### Breaking a query into searches

One officer message usually holds several searches and a rule. An LLM planner splits it; code runs the parts.

<ThemedImage
  alt="Query planning: the planner turns the officer's message into vector search, keyword search, entity lookup and workflow rules; vector and keyword results are fused into ranked similar cases, while entity history and the workflow chosen by rules stay separate, and all three feed hydration and the answer"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-6-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-6-dark.svg'),
  }}
/>

*Figure C1-6: Two searches merge; entity history and the workflow stay separate. Amber is the LLM, blue is code, green is what each branch returns. Workflow rules are a decision table, not a search.*

The officer writes: *"Rear-end collision at Junction X last night, the car is ABC1234 and the driver seemed tired. Seen anything like this?"*

The planner returns:

```json
{
  "intents": ["similar_cases", "entity_history", "workflow"],
  "identifiers": {"plates": ["ABC1234"], "licenses": []},
  "filters": {
    "incident_type": "rear_end_collision",
    "location": "Junction X",
    "radius_m": 1000,
    "time_of_day": "night"
  },
  "workflow_attributes": {
    "vehicle_count": 2,
    "other_driver_present": null,
    "injuries": null
  },
  "semantic_query": "rear-end collision at night, driver appeared fatigued"
}
```

| Part of plan | Goes to | Why |
|---|---|---|
| `identifiers` | Entity lookup (SQL) + keyword search | Exact values. Embeddings blur ABC1234 and ABC1243. |
| `semantic_query` | Vector search | Meaning matters: "seemed tired" ≈ "fatigued" |
| `filters` | Vector, keyword and SQL | Narrow candidates before ranking |
| `workflow_attributes` | Decision rules → catalog lookup by ID | The workflow must be exactly right, not similar |
| `intents` | Which branches run | "What paperwork?" triggers the workflow branch |

Code validates and normalizes the plan before running it. It uppercases plates, geocodes "Junction X", and maps free text such as "rear end" to the `rear_end_collision` enum that SQL and chunk metadata share. Values outside the allowed lists are rejected.

| | Planner (one structured plan) | Free agent (tool loop) |
|---|---|---|
| Speed | One LLM call, searches in parallel | Several sequential LLM calls |
| Predictability | Same plan shape every time | Path varies per question |
| Testing and auditing | Assert on a JSON plan | Inspect a trace |
| Flexibility | Fixed set of intents | Handles unanticipated questions |

The planner handles every turn, follow-ups included, using the case state. Agent-style tool loops are an option later, for open-ended analyst queries.

→ See [Plan and Execute](../agent_design_patterns.md#2-plan-and-execute) and [Query transformation](../../ai-engineering/rag/retrieval.md#query-transformation)

#### Combining the results

:::info[Don't merge everything into one list]
Vector and keyword search answer "what's similar". Their results are fused and ranked. Entity lookup answers "what's true", and the workflow comes from rules. Both stay exact, complete, and in their own sections.
:::

| # | Step | Does |
|---|---|---|
| 1 | Group | Collapse chunks to one entry per `case_id` |
| 2 | Fuse | Reciprocal rank fusion across vector and keyword results |
| 3 | Rerank (optional) | Cross-encoder over the top 20–50, keep the top 5–10 |
| 4 | Business rules | Re-check access. Remove cases already listed in entity history, so nothing appears twice. |

> **RRF:** for each case, add up 1 / (k + its rank) over every search that found it, with k = 60.

| Case | Vector rank | Keyword rank | RRF |
|---|---|---|---|
| C-0042 | 1 | 3 | 1/61 + 1/63 = 0.0323 |
| C-0388 | — | 1 | 1/61 = 0.0164 |
| C-0251 | 2 | — | 1/62 = 0.0161 |

Cases found by more than one search rise to the top. No score tuning needed.

**Hydration.** Fetch current facts from SQL for the final case IDs. On any conflict, SQL wins over chunk metadata.

The LLM receives sectioned context:

```text
ENTITY HISTORY (exact, from SQL)
- Vehicle ABC1234 (E-91): 2 prior cases: C-0013, C-0107

SIMILAR CASES (ranked)
1. C-0042: rear-end collision at Junction X, 23:10.
   Matched because: same junction, night, fatigue in notes
2. C-0388: rear-end collision 600 m away, 01:30.
   Matched because: night, driver reported drowsiness

WORKFLOW TO FOLLOW (from catalog)
- Pending. Required: injuries, other_driver_present.

Answer only from the sections above. Cite case and workflow IDs.
If a section is empty or pending, say so and ask for what's missing.
```

→ See [Combining them with RRF](../../ai-engineering/rag/retrieval.md#combining-them-with-rrf), [Reranking](../../ai-engineering/rag/retrieval.md#reranking) and [Grounding and citations](../../ai-engineering/rag/generation.md#grounding-and-citations)

#### Selecting the workflow

Choosing the paperwork is a classification against written rules, not a similarity search. The planner extracts the attributes; code applies the rules; the catalog returns the workflow by ID.

```json
{
  "workflow_id": "W-RE-01",
  "version": 3,
  "effective_from": "2025-01-01",
  "triggers": {"incident_type": "rear_end_collision", "vehicle_count": 2},
  "steps": ["Photograph both vehicles", "Record both drivers' licenses", "Exchange insurance details"],
  "forms": ["F-12 Accident report", "F-19 Vehicle damage"]
}
```

A decision table picks a base workflow, then add-ons:

| Condition | Workflow | Adds |
|---|---|---|
| `rear_end_collision`, 2 vehicles | W-RE-01 (base) | Accident report, vehicle damage form |
| `injuries = true` | + W-INJ-01 | Injury report, medical reference |
| `other_driver_present = false` | + W-HR-01 | Hit-and-run report |
| Property damaged | + W-PD-01 | Property damage form |
| `injuries` unknown | None yet | Chatbot asks "Was anyone hurt?" |

| Why rules, not the LLM | Failure it prevents |
|---|---|
| Correctness | A plausible but wrong form filed |
| Explainability | An officer who can't see why this workflow applies |
| Procedures are already rules | A prompt that drifts from the manual |

**Partial information.** Similar-case search runs on the first message. The workflow waits until its required attributes are known, and the chatbot asks for what's missing. **The officer confirms the workflow** before any paperwork starts. Questions about a step ("Do I need to notify the insurer?") go to the procedures index and are answered with citations.

### The chatbot: conversation loop

<ThemedImage
  alt="Conversation loop: each officer message goes to the planner LLM call, which returns state updates; code validates and merges them into the case state and reruns only what changed against the stores; the answer LLM call replies from sectioned context; every turn is written to the audit log"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-7-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-7-dark.svg'),
  }}
/>

*Figure C1-7: One turn. Amber is the officer and the two LLM calls, blue is code, green is storage.*

| # | Step | Who |
|---|---|---|
| 1 | Read the case state and the new message; return state updates and intents | LLM call 1: planner |
| 2 | Validate the updates and merge them into the case state | Code |
| 3 | Rerun only what changed: a new plate reruns entity lookup, a new injury answer reruns the workflow rules | Code |
| 4 | Reply from the sectioned context, with citations | LLM call 2: answer |
| 5 | Log the plan, retrieved IDs and reply | Code |

| Memory | Holds | Why |
|---|---|---|
| Case state | Structured fields: type, location, plates, workflow attributes | The source of truth. The planner returns updates only. |
| Recent turns | The last few messages, verbatim | Resolves "it" and "that car" |
| Summary | Older turns, compressed | Keeps long sessions inside the context window |

Sessions are stored per case, so an officer can resume a case later. Every turn is logged for audit.

Three turns of one conversation:

| Turn | Officer says | State update | Reruns | Reply |
|---|---|---|---|---|
| 1 | "Rear-end collision at Junction X last night, plate ABC1234, driver seemed tired." | Type, location, plate, semantic query, 2 vehicles | All branches. Workflow pending. | Entity history (C-0013, C-0107), similar cases (C-0042, C-0388), and "Was anyone hurt? Did the other driver stay?" |
| 2 | "No injuries, the other driver stayed." | `injuries = false`, `other_driver_present = true` | Workflow rules only | W-RE-01 v3 with steps and forms F-12, F-19. "Confirm this workflow?" |
| 3 | "Correction, the plate is ABC1243." | Plate ABC1234 → ABC1243 | Entity lookup and keyword search; similar cases re-fused | New entity history for ABC1243. Workflow unchanged. |

→ See [Memory Management](../agent_design_patterns.md#9-memory-management)

## Guardrails and evaluation

| Guardrail | Rule | Failure it prevents |
|---|---|---|
| Grounding | No record, no claim about a person. | A fabricated history |
| Access control | Permissions applied as retrieval filters. Every profile view logged. | Unaccountable lookups of individuals |
| Workflow confirmation | The officer confirms the workflow before paperwork starts. | Wrong forms filed |
| Turn audit | Every turn logged: plan, retrieved IDs, reply. | An answer nobody can explain later |
| Human in the loop | Outputs are advisory. The officer decides. | The system becoming the decision maker |

| Metric | Measures |
|---|---|
| Planner test set | Questions → expected plans. Re-run on every prompt or model change. |
| Workflow classification accuracy | Ground truth exists: past cases record the paperwork that was filed. |
| Precision@k from officer feedback | Are the returned cases relevant? |
| Extraction accuracy | Did OCR and intake capture the right fields? |
| Entity-resolution precision and recall | Linking quality. False merges weighted heavily. |
| Time saved per case | The original goal |

→ See [Retrieval metrics first](../../ai-engineering/rag/evaluation.md#retrieval-metrics-first)

## Delivery

<ThemedImage
  alt="Three delivery phases separated by gates: intake and workflow guidance, then similar case search after officer adoption and relevance feedback, then entity history and flags after governance is agreed"
  sources={{
    light: useBaseUrl('/img/case-studies/fig-accident-cases-8-light.svg'),
    dark: useBaseUrl('/img/case-studies/fig-accident-cases-8-dark.svg'),
  }}
/>

*Figure C1-8: Phased delivery. Amber ships first: quick value, low risk. Dashed ships only if the governance gate passes.*

| Phase | Scope | Gate to the next phase |
|---|---|---|
| 1 | Intake + workflow guidance | Officer adoption and relevance feedback |
| 2 | Similar case search | Governance agreed: access, audit, review process |
| 3 | Entity history and proactive flags | — |

Phase 1 can go live within weeks and start collecting the feedback that improves the rest.

## Summary

**Discovery turns a data request into a workflow problem.** The workflow and paperwork requirement never appears in the brief; it comes from asking about the users.

**Not everything with an LLM is RAG.** Only similar case search is retrieval; the workflow is rules plus a lookup, and person and vehicle history is a deterministic query.

**Vectors answer "what's similar", SQL answers "what's true".** Similar cases are fused and ranked; entity history stays exact and separate, and SQL wins at hydration.

**Raise risk early, with an alternative.** An evidence-linked incident history profile gives officers what they need without scoring people.

**Ship the lowest-risk, highest-value capability first.** Intake and workflow guidance go live in weeks and generate the feedback that gates every later phase.

<details>
<summary>One line per layer</summary>

- **Big picture.** A background pipeline prepares data into four stores, and a chatbot uses them as tools. The LLM never answers from memory, only from what it retrieves.
- **Ingestion.** Six stages: CDC from a replica, OCR and vision with confidence scores and human review, normalization, strict entity resolution, case documents, indexing. Idempotent, handles updates, reprocessable.
- **Linking.** Everything links through `case_id` and `entity_id`. Extractions bridge photos to structured entities.
- **Retrieval.** An LLM planner splits the message into identifiers, filters, workflow attributes and a semantic query. Code runs the branches in parallel. Similar cases are fused with RRF, entity history stays exact and separate, and SQL is the source of truth at hydration.
- **Workflow.** Decision rules over extracted attributes pick a versioned workflow from the catalog. The chatbot asks for missing attributes, and the officer confirms.
- **Conversation loop.** Two LLM calls per turn with code in between. Memory is the structured case state, only what changed is rerun, sessions are stored per case, and every turn is logged.

</details>

## Follow-up questions

**How would you match a misread plate?**

<details>
<summary>Answer</summary>

Fuzzy matching on the plate, confirmed by supporting evidence such as the same vehicle model or driver. Below the threshold, the match goes to human review instead of being linked.

</details>

**What if an officer corrects a case after indexing?**

<details>
<summary>Answer</summary>

CDC picks up the update and the pipeline re-embeds that case's chunks. Until it does, hydration still shows the corrected facts, because SQL wins over chunk metadata.

</details>

**How do you know the planner extracted the right things?**

<details>
<summary>Answer</summary>

A planner test set of questions and their expected plans, run on every prompt or model change.

</details>

**Why not let the LLM pick the workflow?**

<details>
<summary>Answer</summary>

The procedures are already written as rules, and a wrong form has real consequences. Rules are exact and explainable; the LLM only extracts the attributes the rules need.

</details>

**Why not pure vector search?**

<details>
<summary>Answer</summary>

Exact IDs, counts, dates and locations need SQL and filters. Embeddings place ABC1234 and ABC1243 almost on top of each other.

</details>

**How do you stop officers seeing cases they shouldn't?**

<details>
<summary>Answer</summary>

Pre-filter every search on access level, re-check access at hydration, and log every profile view.

</details>
