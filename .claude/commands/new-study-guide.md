# New Study Guide Page

Write or revise a study-guide/cheatsheet page (data science, ML lifecycle, or any concept-guide section) in this repo's house style. This skill defines both the page structure and the prose rules. Use it whenever writing guide-style content, even without an explicit request.

## Voice and prose rules (non-negotiable)

- **Senior data scientist coaching a junior.** The page's job is to transfer judgment, not list facts. Say what the expert actually does, in what order, and what they'd push back on: "Deciding which regime you're in is the actual skill." "Audit miracles." Name the mistake the reader is about to make and the habit that prevents it.
- **Tight and opinionated.** Short declarative sentences. State the opinion flat: "Trees need neither." "Drop rows: almost never."
- **Periods over em-dashes.** Prefer a period, colon, or comma. One em-dash per paragraph at most; never chains. Verbose em-dash prose reads AI-generated and was explicitly rejected.
- **No hedges or filler.** Cut "it's worth noting", "genuinely", "essentially", stacked appositives.
- **Tables over prose enumeration.** If listing 3+ options, it's a table with a "use when" column.
- **Decision guides over descriptions.** "Use X when Y" beats "X is a technique that does Y".

## Page skeleton

```markdown
---
sidebar_position: <next available>
---

# Page Title

Two or three opinionated sentences framing the problem. No throat-clearing.

## Cheatsheet
<!-- Table: Topic/Model | Default | Avoid | #1 failure mode -->

## <Running example intro, if the page carries one>
<!-- One dataset threads the whole page; results table with illustrative numbers -->

## Topic Section (one per concept)
> **Remember one thing:** <the single distinguishing fact, one line>

Short explanation. Then, as fits:
- Options table with links to official docs (sklearn/library API pages)
- :::tip / :::note / :::warning / :::danger blocks for judgment calls and traps
- Minimal code snippet (4–8 lines, only load-bearing arguments)
- "**On the <example> data:**" paragraph grounding the concept with numbers

## <Memorable summary>
<!-- NOT a checklist. 3–5 numbered rules, each one bold line + one-sentence gloss.
     e.g. "The Five Rules". End with a one-line closer. -->
```

## Structure rules

- **Cheatsheet first.** The reader revising for an interview gets the whole page in one table before any scrolling.
- **One running example per page.** Reuse existing ones for continuity (bike-rental for regression, machine failure for classification and the ML lifecycle — the user's background is manufacturing, prefer plant-floor framing). Numbers are illustrative of the typical pattern; say so once near the results table.
- **Worked numbers over assertions.** Don't say "accuracy misleads on imbalanced data"; show the 92%-accuracy-zero-recall confusion matrix.
- **Memory hooks.** Every major section opens with `> **Remember one thing:** ...`.
- **Admonitions**: `:::danger` for leakage/correctness traps, `:::warning` for common mistakes, `:::tip` for defaults, `:::note` for nuance.
- **Link, don't repeat.** Each concept has one home page. Other pages link to it: metrics live in classification.md, CV mechanics in supervised/index.md, serving code in ml-engineering. If tempted to re-explain, link instead.
- **Diagrams** (SVG/mermaid) only when they carry intuition prose can't; label axes with the running example's variables, not "x (feature)".

## Repo gotchas

- `.md` files are parsed as MDX: a bare `<` followed by a digit or letter (e.g. `<10`) breaks the build. Write "under 10".
- Verify with `npm run build` — it fails on broken links and MDX errors.
- `docusaurus.config.js` excludes some docs from the build (e.g. `predictive-maintenance*`); don't link to excluded pages.
- Check sibling files for the next `sidebar_position`; categories need `_category_.json` with a `link` block if the label should be clickable.
