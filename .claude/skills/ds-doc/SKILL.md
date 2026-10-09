---
name: ds-doc
description: Write or edit pages in docs/data-science/ (lifecycle and model reference pages, the predictive-maintenance scenario, hub, start-here pages, figures). Use when adding or changing Data Science study notes.
---

# DS Doc

Pages in `docs/data-science/` follow a reduced version of the CKAD house style (`.claude/skills/ckad-doc/SKILL.md`). The pages are read, not run: there are no labs, no setup page and no code to validate. The **gold standard** pages are the source of truth for structure and tone.

General prose rules live in CLAUDE.md → *Writing & Diagram Style*, including **code is a last resort**. Name the operator or knob inline (`TimeSeriesSplit`, `scale_pos_weight`) and put settings in a knob table instead of a code block.

## Steps

1. **Classify the page and read its gold standard in full** before writing.

   | Type | Location | Gold standard | Figure prefix |
   |---|---|---|---|
   | Reference (lifecycle) | `ml-lifecycle/*.md` | `ml-lifecycle/model-training.md` | `L<sidebar_position>` (Figure L4-1) |
   | Reference (models) | `supervised/*.md`, `landscape.md` | `supervised/classification.md` | `M<sidebar_position>`; landscape is `M3` |
   | Scenario | `scenarios/*.md` | `scenarios/predictive-maintenance.md` | `S<sidebar_position>` (Figure S1-1). Hidden from the build for now: don't link to it |
   | Start Here | `start-here/learning-path.md`, `start-here/glossary.md` | themselves | none |
   | Hub | `index.md` | itself (modelled on the PCA `index.md`) | n/a |

   Model pages give each model an H3 with a one-sentence lead, an optional figure, and a two-column table (`Use when` / `Get it right` / `On the … data`).

   Done when: you can list the gold standard's section order and its numbering for the new page.

2. **Find the owner of every concept.** Grep `docs/data-science` for it. Each meaning has one owner page; everywhere else gets `→ See [Page](./file.md#anchor)`. Current owners: cross-validation, bias–variance, regularisation and bagging vs boosting → `supervised/index.md`; the snapshot date and label → `ml-lifecycle/index.md`; metric definitions and thresholds → `supervised/classification.md#evaluation-metrics`; validation splits, tuning, sign-off → `ml-lifecycle/model-training.md`; leakage and the pipeline pattern → `ml-lifecycle/data-preprocessing.md`.

3. **Keep the running examples consistent.** Classification and the lifecycle use the **machine-failure** problem (10,000 machines, monthly snapshots Jan–Jun, 3% base rate, maintenance rule PR-AUC 0.24, logistic 0.31, tuned XGBoost 0.46). Regression uses **bike-rental demand**. Grep before quoting a number; a number that appears on two pages must match.

4. **Write to the page contract** (below), then add figures (see *Figures*).

5. **Wire it in.** Link the first prose mention of a glossary term to `start-here/glossary.md#<term>` (new terms get a row with a `<Link id="term" />` anchor), add a hub bullet in `index.md`, update the learning path and backlinks, then:

   ```bash
   npm run build && python3 .claude/skills/ckad-doc/scripts/check_anchors.py docs/data-science
   ```

   Done when: the build passes and the anchor check reports 0 broken. Renaming a heading changes its anchor; grep for inbound `#anchor` links first and keep the heading text when one exists.

## Page contract

### Reference page, in this order

1. Frontmatter (`title`, `sidebar_label`, `sidebar_position`), then `ThemedImage` / `useBaseUrl` imports if it has `fig.py` figures.
2. H1, then `> Docs:` line of scikit-learn / library doc links separated by ` · `.
3. `## Overview`: one paragraph. What the stage or model is for, and the failure people hit, with a number from the running example.
4. Figures (optional) with captions.
5. `## Key concepts`: H3 subsections, each led by one sentence and carried by a table. The first H3 is the decisions or cheatsheet table. Rules with wrong answers get a **Result** column with ❌ rows included. Knobs go in a `Knob | Setting here | Why` table.
6. `## Gotchas`: bullets, each `**Bold failure.** What happens. What to do.`
7. `## Scenario questions`: 3–5, format below. **Observe** names what you'd look at (a sliced metric, a plot, a feature importance, a run log), not a command.
8. `## Summary`: exactly five `**Bold claim.** One-sentence consequence.` lines.
9. `**Next →**` link to the next page in the learning path.

### Scenario page

`> Builds on:` line → `## Situation` → `## Requirements` (requirement | failure it prevents) → `## Architecture` (one figure) → `## Techniques used` (technique | role here | reference link) → `## Walkthrough` (numbered bold steps, tables not code) → `## How I'd explain this in an interview` (one spoken blockquote, 60–90 seconds, ends on the trade-off) → `## Follow-up questions`.

### Scenario questions

```markdown
**Q2 ★★ Question as an interviewer would ask it?**

<details>
<summary>Model answer</summary>

- **Clarify:** the question you'd ask back.
- **Observe:** what you'd look at and what it shows, with numbers.
- **Hypothesise:** the causes, most likely first.
- **Fix:** the change.
- **Prevent:** the lasting control, with the trade-off stated.

</details>
```

★ recall, ★★ apply, ★★★ diagnose or design.

## Figures

Pick the form by what the figure shows:

| Shows | Form | Source |
|---|---|---|
| Components, flows, splits, pipelines, containment | `fig.py` ThemedImage | `scripts/figures/<page>.py` → `static/img/data-science/fig-<page>-<n>-{light,dark}.svg` |
| Data: scatter, curves, decision boundaries, margins | Inline `<svg className="ml-diagram">` | On the page. Classes and theme colours in `src/css/custom.css` |
| Decision tree ("which model?") | Mermaid, `mermaid-scroll` wrapper, `classDef accent` | On the page |
| Comparison | Table, not a figure | — |

- **`fig.py` figures** follow `.claude/skills/ckad-doc/FIGURES.md`: same helpers, same colour rules, view the preview PNG after every run. Each figures file starts with the path shim in `scripts/figures/model_training.py` and sets `fig.OUT` to `static/img/data-science`.
- **`ml-diagram` plots** keep their CSS classes, so one SVG serves both themes. Use `pt-blue` / `pt-orange` for the two classes (fill: points, bars, curves), `fit-line` (green) for the model, `underfit-line` / `overfit-line` for comparison curves, `highlight-pt` for the point the figure is about. No inline colours. Add `wide` to the class for two-panel plots.
- **Preview inline plots** with `python3 .claude/skills/ds-doc/scripts/preview_inline.py <page>.md`. It renders every `ml-diagram` on the page, light above dark, with the real colour tokens. Fix every label that overlaps a point or line.
- Every figure, of any form, gets a numbered italic caption with the page prefix that says what each colour means on that figure: `*Figure M2-1: … Blue is …, orange is …*`.
- No ASCII-art trees. Convert them to Mermaid or a table.
