---
sidebar_position: 1
---

# AI Slide Deck Making — Overview & Tool Comparison

Evaluating open-source tools that turn a topic or document into a presentation using LLMs — focused on three tools across different complexity tiers.

---

## The Core Workflow

Most AI slide deck tools share the same pipeline:

```
Input (topic / doc / URL)
    → Content planning (LLM outlines slide structure)
    → Content generation (LLM writes per-slide copy)
    → Rendering (Markdown → HTML/PDF/PPTX)
    → [Optional] Visual enhancement (image search, design polish)
```

The key architectural decisions are:
- **Single-pass vs. multi-step agentic** — does the LLM generate everything in one call or does an agent iteratively plan, draft, and revise?
- **Rendering target** — Markdown+CSS (Marp), PPTX (python-pptx), or browser-native HTML
- **Visual layer** — does the tool handle layout and design, or is that left to the user?

---

## Tools at a Glance

| Tool | Approach | Rendering | Visual layer | Open Source |
|---|---|---|---|---|
| **slide-deck-ai** | Single-pass, Streamlit UI | HTML (reveal.js) | Minimal | ✅ |
| **Presenton** | Agentic multi-step | Browser (React) | Gamma-like polish | ✅ |
| **Marp** *(future)* | Markdown renderer (BYO LLM) | PDF / PPTX | CSS themes | ✅ |

---

## Deep Dives

### slide-deck-ai

[slide-deck-ai](https://github.com/barun-saha/slide-deck-ai) is a Streamlit app that takes a topic and generates a structured slide deck in a single LLM pass. It is the simplest end-to-end implementation — useful as a baseline and for understanding the minimal viable pipeline.

**Pipeline:**
1. User enters a topic and slide count in the Streamlit UI
2. A single LLM call generates a JSON structure describing each slide's title and bullet points
3. The JSON is rendered into an HTML slide deck using reveal.js

**Strengths:** Minimal setup — runs locally with Streamlit. Supports multiple LLM backends (OpenAI, Google Gemini, local via Ollama). Good starting point for understanding the core prompt-to-slides loop.

**Weakness:** Single-pass generation means no iterative refinement. Output structure is flat (title + bullets). No image or layout intelligence — visual quality is entirely dependent on the reveal.js default theme.

**When to use:** Quick content drafts, internal notes, or as a reference implementation to study before building something custom.

**Repo:** [barun-saha/slide-deck-ai](https://github.com/barun-saha/slide-deck-ai)

---

### Presenton

[Presenton](https://github.com/presenton/presenton) is an open-source alternative to Gamma — it combines an agentic content pipeline with a browser-based design layer to produce visually polished presentations.

**Pipeline:**
1. User enters a topic or pastes source content
2. An agent generates an outline (multi-step: topic → section headings → per-slide content)
3. A design engine assigns layouts, selects complementary visuals, and renders slides in the browser
4. User can edit slides inline before exporting to PDF or PPTX

**Strengths:** Closest open-source approximation of Gamma's UX. Handles layout decisions automatically. Inline editing means the LLM output is a starting point, not a final artefact. Self-hostable.

**Weakness:** Heavier stack than slide-deck-ai. Visual quality depends on the built-in template set — less flexible than fully custom CSS. Still early-stage; expect rough edges.

**When to use:** When you need a shareable, visually presentable deck without paying for Gamma or SlidesGPT. Good for client-facing or stakeholder content where aesthetics matter.

**Repo:** [presenton/presenton](https://github.com/presenton/presenton)

---

### Marp *(coming soon)*

[Marp](https://marp.app/) is a Markdown-to-slides renderer — not an AI tool itself, but the cleanest way to produce version-controlled, CI-friendly decks when paired with an LLM to generate the Markdown source.

*Deep dive and workflow notes to be added after hands-on evaluation.*

---

## Evaluation Dimensions

| Dimension | slide-deck-ai | Presenton |
|---|---|---|
| **Setup complexity** | Low (Streamlit + pip) | Medium (Docker / Node stack) |
| **Visual quality** | Basic (reveal.js default) | High (design engine) |
| **Editability** | Limited | Inline browser editing |
| **Model flexibility** | OpenAI, Gemini, Ollama | Configurable |
| **Export formats** | HTML | PDF, PPTX |
| **Generation approach** | Single-pass | Multi-step agentic |

---

## References

- [slide-deck-ai GitHub](https://github.com/barun-saha/slide-deck-ai)
- [Presenton GitHub](https://github.com/presenton/presenton)
- [Marp documentation](https://marpit.marp.app/)
- [reveal.js documentation](https://revealjs.com/)
