---
sidebar_position: 4
---

# Generation & Grounding

> **Customer framing:** Retrieval found the right chunk and the answer still cited the wrong document. Retrieval quality and answer quality are different problems, and this is the second one.

**Official docs:**
- [Lost in the Middle (paper)](https://arxiv.org/abs/2307.03172)
- [Anthropic prompt engineering](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)

Everything here assumes a shortlist of roughly 5 chunks, produced by [Retrieval](./retrieval.md).

---

## Building the prompt

Budget the context window explicitly. A table beats a guess.

| Slot | Budget |
|---|---|
| System prompt and instructions | 500 tokens |
| Retrieved chunks, 5 x 700 | 3,500 tokens |
| Conversation history, trimmed | 2,000 tokens |
| Reserved for the answer | 1,000 tokens |

<svg className="ml-diagram wide" viewBox="0 0 560 200" role="img" aria-label="Recall accuracy is high at the start and end of the context and sags in the middle">
  <path d="M60 150 Q 180 62, 290 62 Q 400 62, 500 150 L 500 150 L 60 150 Z" className="sag-fill" />
  <path d="M60 62 Q 175 62, 290 122 Q 405 62, 500 62" className="curve-line" strokeWidth="2.5" />
  <line x1="60" y1="150" x2="500" y2="150" className="axis-line" strokeWidth="1.5" />
  <line x1="60" y1="150" x2="60" y2="40" className="axis-line" strokeWidth="1.5" />
  <text x="46" y="95" textAnchor="end" fontSize="10.5" className="axis-label" transform="rotate(-90 46 95)">recall accuracy</text>
  <text x="280" y="176" textAnchor="middle" fontSize="10.5" className="axis-label">position of the answer in the context</text>
  <text x="60" y="166" textAnchor="middle" fontSize="10" className="axis-label">start</text>
  <text x="500" y="166" textAnchor="middle" fontSize="10" className="axis-label">end</text>
  <circle cx="72" cy="62" r="4.5" className="highlight-pt" />
  <text x="86" y="52" fontSize="11" fontWeight="600" className="highlight-label">chunk 1</text>
  <circle cx="488" cy="62" r="4.5" className="highlight-pt" />
  <text x="474" y="52" textAnchor="end" fontSize="11" fontWeight="600" className="highlight-label">chunk 2</text>
  <text x="290" y="112" textAnchor="middle" fontSize="11" className="overfit-label">the sag</text>
  <text x="290" y="138" textAnchor="middle" fontSize="10" className="axis-label">chunks 3, 4, 5</text>
</svg>

Three rules for assembling the chunks:

1. **Order by attention, not by score.** Models attend to the beginning and end of the context and sag in the middle, so ranked order is the wrong order. Put the top chunk first and the second best *last*.
2. **Deduplicate.** Overlapping chunks from one document repeat text, waste budget, and make the model over-weight whatever got repeated. Collapse near-duplicates and merge adjacent chunks from the same section.
3. **Label every chunk.** Prefix each with a number, its breadcrumb, its `doc_id`, and `updated_at` — so the model can cite it, and you can resolve the citation back to a source.

> **[1]** Security Policy > API Keys *(doc:POLICY-4471, updated 2026-03-02)*
> Keys must be rotated every 90 days…

---

## Grounding and citations

The prompt is a contract. Four clauses, and the last one is the one people leave out:

| Clause | Why |
|---|---|
| Answer only from the numbered context | Scopes the model to what you retrieved |
| Cite the chunk numbers used, like `[1]` or `[2, 3]` | Makes the answer auditable |
| Do not use outside knowledge | Closes the gap the first clause leaves open |
| If the context lacks the answer, say so **in these exact words** | Gives it a way out, and a string you can match on |

The refusal path is a feature, not a failure. A system that never says "not found" is a system that hallucinates instead — and a fixed refusal string is what lets you count how often it happens.

**Verify citations in code, not on trust.** Parse the cited numbers out of the answer, check each one was actually in the shortlist, and route to escalation if any points at nothing. A citation to `[7]` when you sent five chunks is a hallucination that looks like diligence.

:::info Best practice
Render citations as links to the source document and section. Users trust an assistant they can check, and it turns every answer into a spot-check of your retrieval.
:::

→ See [Evaluation & Guardrails](./evaluation.md#faithfulness-and-the-escalation-threshold) for scoring groundedness rather than assuming it.

---

→ Next: [Evaluation & Guardrails](./evaluation.md), for scoring all of this rather than assuming it.
