---
---

# Overview

A working knowledge base for GenAI workflows and agentic systems — focused on practical evaluation of real implementations rather than theory.

:::info Suggested reading order
Start with **Agent Design Patterns** to build the vocabulary. Then read a **Use Case** to see the patterns applied to a concrete problem. Dip into **Core Concepts** as a use case links to them — they're reference pages, not a course. Cross-references link between all three throughout.
:::

## Topics

### Agent Design Patterns

Ten patterns across three tiers — **Foundational** (ReAct, Plan-and-Execute, Reflection, Tool Use), **Orchestration** (Orchestrator-Subagent, Parallelization, Pipeline/DAG), and **Reliability** (HITL, Memory Management, Guardrails) — covering how agents structure reasoning loops, delegate work, and stay safe.

- [Agent Design Patterns](./agent_design_patterns.md)

### Core Concepts

The technique layer beneath the patterns — implementation reference pages that use cases link into. One page per decision area, appended to as new use cases touch them.

- [Context Engineering](./concepts/context-engineering.md) — window management, memory tiers, chunking, BM25 + embedding relevance scoring
- [Model I/O](./concepts/model-io.md) — tool schemas in, structured output parsing out *(stub)*
- [Reliability](./concepts/reliability.md) — stop conditions, failure isolation, graceful degradation, concurrency *(stub)*
- [Evaluation & Observability](./concepts/evaluation-observability.md) — tracing, LLM-as-judge, cost tracking *(stub)*

### Use Cases

End-to-end implementations that map each use case to the relevant patterns and walk through concrete design decisions.

- [Data Validation Agent](./use_cases/data-validation-agent/index.md) — Tool Use, ReAct, HITL, Parallelization
- [Researcher Agent](./use_cases/researcher-agent/index.md) — Plan-and-Execute, Parallelization, Pipeline/DAG, Guardrails

### Model Context Protocol (MCP)

Protocol internals, how to build a server with the Python SDK, and six design patterns — Thin Wrapper, Intent-Level Tool, Read/Write Separation, Resource-First, Stateless Server, and Confirmation Gate.

- [MCP Inner Workings & Design Patterns](./mcp.md)

### AI Slide Deck Making

Evaluating open-source tools across complexity tiers — from single-pass generators (slide-deck-ai) to Gamma-like agentic pipelines (Presenton), with Marp as a future code-first option.

- [Overview & Tool Comparison](./ai-slide-decks/overview.md)

---

*Pages are added as each topic is explored hands-on.*
