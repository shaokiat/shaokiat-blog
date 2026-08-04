---
sidebar_position: 4
---

# Evaluation & Observability

> Knowing whether the agent works, where it spends its steps, and what each run costs — before deploying it or comparing alternatives.

:::note Stub
Section headings are in place; content fills in as use cases touch each topic.
:::

---

## Execution tracing

Capturing a structured trace of a live run — steps, tool calls, observations — as the raw material for everything else on this page.

## Log analysis

Aggregating traces into step counts, tool usage, and error rates without re-running anything.

## LLM-as-judge

Scoring agent outputs against a rubric with a judge model; where it's reliable and where it drifts.

## RAG evaluation

Attributing a bad answer to the retriever or the generator, using claim-level metrics scored by a judge model.

→ Guide: [RAG Evaluation with RAGAS](../rag-evaluation.md)

## Token and cost tracking

A cumulative usage accumulator on the shared LLM wrapper, so every call path (completions, embeddings) reports into one total per run.

---

**Used in:** [Researcher Agent](../use_cases/researcher-agent/implementation.md#step-4--return-report) — cumulative token/cost tracking printed per run.
