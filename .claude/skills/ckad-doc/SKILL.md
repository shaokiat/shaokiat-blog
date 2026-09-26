---
name: ckad-doc
description: Write or edit pages in docs/kubernetes-ckad/ (reference pages, scenarios, start-here primers, labs, figures). Use when adding or changing Kubernetes/CKAD study notes.
---

# CKAD Doc

Pages in `docs/kubernetes-ckad/` follow one house style. The **gold standard** pages are the source of truth for structure and tone; this skill names them, states the contract they share, and says how to prove a page is done.

General prose rules (short declarative sentences, "use X when Y", tables over paragraphs, MDX gotchas) live in CLAUDE.md → *Writing & Diagram Style*. They apply here too, with one difference: this section keeps copy-paste `kubectl` and YAML, because the reader runs them in a live cluster.

## Steps

1. **Classify the page and read its gold standard in full** before writing.

   | Type | Location | Gold standard | Numbering prefix |
   |---|---|---|---|
   | Reference | `reference/<topic>.md` | `reference/architecture.md` | its `sidebar_position` (Figure 5-1, Lab 5-1) |
   | Scenario | `scenarios/<topic>.md` | `scenarios/ml-model-serving.md` | `S<sidebar_position>` (Figure S1-1) |
   | Primer | `mental-model.md`, `start-here/*.md` | `mental-model.md`, `start-here/local-setup.md` | `0` (Figure 0-1, Lab 0) |
   | Hub | `index.md` | `docs/google-professional-cloud-architect/index.md` | n/a |

   Done when: you can list the gold standard's section order and its numbering for the new page.

2. **Find the owner of every concept you plan to explain.** Grep the section for each concept. Each meaning has exactly one **owner** page; everywhere else gets a one-line pointer (`→ See [Page](./file.md#anchor)`). If an existing page already explains it, link to it; if your page becomes the better owner, move the explanation and leave a pointer behind.

   Done when: every concept on your page is either owned here or a pointer, and no two pages explain the same mechanism.

3. **Write to the page contract** (below), then add figures if the page earns one → read [FIGURES.md](FIGURES.md).

4. **Prove it runs** → read [VALIDATION.md](VALIDATION.md). Every YAML block passes server-side dry-run, every lab and drill has been run on kind, and symptoms quoted on the page are captured output.

5. **Wire it in.** Link terms to the glossary on first mention, add hub bullets pointing at section anchors, update backlinks, then run `npm run build` and `python3 .claude/skills/ckad-doc/scripts/check_anchors.py`.

   Done when: build passes, anchor check reports 0 broken, `grep -rn TODO docs/kubernetes-ckad` is empty, and anything you could not run is listed for the user.

## Page contract

### Reference page, in this order

1. Frontmatter (`title`, `sidebar_label`, `sidebar_position`), then `ThemedImage` / `useBaseUrl` imports if it has figures.
2. H1, then `> Docs:` line of kubernetes.io links separated by ` · `.
3. `## Overview`: one paragraph. What it is, why it exists, the failure people hit.
4. Figures (optional) with captions.
5. `## Key concepts`: H3 subsections, each a table. Rules with wrong answers get a table with a **Result** column that includes the wrong rows.
6. `## kubectl essentials`: one-line lead-in per code block; imperative commands first (`--dry-run=client -o yaml`, `kubectl explain`); aligned trailing `#` comments; minimal full-object YAML skeletons.
7. `## 🧪 Lab`: see *Labs*.
8. `## Gotchas`: bullets, each `**Bold failure.** What happens. What to do.`
9. `## Scenario questions`: 3–5, see *Scenario questions*.
10. `## Summary`: exactly five `**Bold claim.** One-sentence consequence.` lines.

### Scenario page, in this order

`> Builds on:` line → `## Situation` (one paragraph, a concrete incident) → `## Requirements` (table: requirement | failure it prevents) → `## Architecture` (one figure) → `## Kubernetes resources used` (table: resource | role here | reference link) → `## Walkthrough` (numbered bold steps with YAML) → `## How I'd explain this in an interview` (one blockquote, spoken, 60–90 seconds, ends on the trade-off) → `## Follow-up questions` (same format as scenario questions).

### Labs

```markdown
:::tip Lab 5-1 ★★
See [Standard lab setup](../start-here/local-setup.md#standard-lab-setup).

**Imperative task name.**

1. Numbered steps in namespace `lab5`.

**Verify**

(bash block with expected output as trailing comments)

<details>
<summary>Solution</summary>

(bash block: every command, expected output as comments, ends with kubectl delete namespace lab5)

</details>
:::
```

Labs must run on a plain kind cluster. Difficulty: ★ recall, ★★ apply, ★★★ diagnose or design. When a lab repeats an earlier one, state what it builds on ("Builds on [Lab 0](...)") and keep only the new part.

### Scenario questions

```markdown
**Q2 ★★ Question as an interviewer would ask it?**

<details>
<summary>Model answer</summary>

- **Clarify:** the question you'd ask back.
- **Observe:** the exact command and what its output shows.
- **Hypothesise:** the causes, most likely first.
- **Fix:** the change, at the owner object.
- **Prevent:** the lasting control, with the trade-off stated.

</details>
```

### Voice and linking

- Write as the candidate would say it out loud: concrete, first-person in interview blocks, trade-offs named.
- Quote real error text in backticks; it is what the reader will search for.
- First mention of a glossary term links to `start-here/glossary.md#<term>`. New terms get a row there with a `<Link id="term" />` anchor.
- Cross-page links carry an anchor when a section exists (`./storage.md#access-modes`), so the reader lands on the answer.
