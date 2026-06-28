---
---

# Overview

A working knowledge base for GenAI workflows and agentic systems — focused on practical evaluation of real implementations rather than theory.

:::info Suggested reading order
Start with **Agent Design Patterns** to build the vocabulary. Then read a **Use Case** to see the patterns applied to a concrete problem. Cross-references link between them throughout.
:::

## Topics

### Agent Design Patterns

Ten patterns across three tiers — **Foundational** (ReAct, Plan-and-Execute, Reflection, Tool Use), **Orchestration** (Orchestrator-Subagent, Parallelization, Pipeline/DAG), and **Reliability** (HITL, Memory Management, Guardrails) — covering how agents structure reasoning loops, delegate work, and stay safe.

- [Agent Design Patterns](./agent_design_patterns.md)

### Use Cases

End-to-end implementations that map each use case to the relevant patterns and walk through concrete design decisions.

- [Data Validation Agent](./use_cases/data-validation-agent/index.md) — Tool Use, ReAct, HITL, Parallelization

### Model Context Protocol (MCP)

Protocol internals, how to build a server with the Python SDK, and six design patterns — Thin Wrapper, Intent-Level Tool, Read/Write Separation, Resource-First, Stateless Server, and Confirmation Gate.

- [MCP Inner Workings & Design Patterns](./mcp.md)

### AI Slide Deck Making

Evaluating open-source tools across complexity tiers — from single-pass generators (slide-deck-ai) to Gamma-like agentic pipelines (Presenton), with Marp as a future code-first option.

- [Overview & Tool Comparison](./ai-slide-decks/overview.md)

---

*Pages are added as each topic is explored hands-on.*
