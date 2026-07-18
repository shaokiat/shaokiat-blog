---
sidebar_position: 3
---

# Reliability

> Techniques for keeping agent runs alive and honest: stopping loops, surviving flaky tools and dead URLs, and degrading to "I don't know" instead of a confident fabrication.

:::note Stub
Section headings are in place; content fills in as use cases touch each topic.
:::

---

## Stop conditions

The three ways a loop terminates — final answer, max steps, explicit stop tool — and what happens when none fire.

## Retries and error recovery

Retrying flaky tools vs letting the agent reason around persistent failures; when each is the right layer.

## Layered failure isolation

Nested catch layers where each catches a different failure mode. Worked example in the [Researcher Agent](../use_cases/researcher-agent/implementation.md#failure-isolation-across-the-stages); to be generalized here.

## Graceful degradation and abstention

Every stage degrades to something honest — a skipped source, a one-item plan, an explicit "not enough information" — never a crash or a fabrication.

## Concurrency mechanics

Matching the primitive to the call stack: parallel tool calls in one turn, `ThreadPoolExecutor` for sync blocking code, asyncio for genuinely async stacks.

---

**Used in:** [Researcher Agent](../use_cases/researcher-agent/implementation.md#failure-isolation-across-the-stages) (isolation layers, abstention, thread-pool fan-out) · [Data Validation Agent](../use_cases/data-validation-agent/implementation.md#loop-prevention) (loop prevention, non-idempotent write guards).
