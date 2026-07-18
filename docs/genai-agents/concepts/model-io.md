---
sidebar_position: 2
---

# Model I/O

> The two contract surfaces between your code and the model: tool schemas going in, structured data coming out. Both fail the same way — the model treats a contract as a suggestion.

:::note Stub
Section headings are in place; content fills in as use cases touch each topic.
:::

---

## Input side: tool schemas

How tool definitions reach the model — type hints and docstrings auto-generated into JSON schemas, so ordinary functions become the API contract.

## Dynamic tool loading

Loading tools at runtime by capability or discovery instead of a fixed registry.

## Output side: parsing model responses

The parse fallback chain: strict parse → extract from decoration → degrade to a usable default. Written up in context in the [Researcher Agent planner](../use_cases/researcher-agent/implementation.md#the-defensive-parse-chain); to be generalized here.

## Structured output enforcement

Pydantic validation, provider `response_format` schemas, and instructor — what each solves, what each can't, and when the parse chain remains necessary.

---

**Used in:** [Researcher Agent](../use_cases/researcher-agent/implementation.md#the-defensive-parse-chain) — planner parse chain and the Pydantic trade-off discussion.
