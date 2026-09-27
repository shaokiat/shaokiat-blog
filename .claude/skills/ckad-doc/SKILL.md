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
   | Reference | `reference/<topic>.md` | `reference/architecture.md` | Labs: `<Learning Path phase>-<n>` (Lab 2-2). Figures: the page's original `sidebar_position` (Figure 5-1) |
   | Scenario | `scenarios/<topic>.md` | `scenarios/ml-model-serving.md` | `S<sidebar_position>` (Figure S1-1) |
   | Start Here primer | `start-here/*.md` (Learning Path → Mental Model → Local Setup → Command Patterns; Glossary is lookup) | `start-here/mental-model.md`, `start-here/command-patterns.md` | Labs: phase 1 (Lab 1-1). Figures: `0` (Figure 0-1) |
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

Every lab has three **tiers**, defined once in `start-here/local-setup.md#lab-tiers`: 🔴 Challenge (Goal + Verify only), 🟡 Hints, 🟢 Guided.

```markdown
:::tip Lab 2-2 ★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · prerequisite pages, and any [add-on](../start-here/local-setup.md#cluster-add-ons) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Imperative task name.**

**Goal**

1. Numbered outcomes in namespace `lab2-2`.

**Verify**

(bash block with expected output as trailing comments)

<details>
<summary>🟡 Hints</summary>

1. One hint per Goal step: the command family, the `-h` or `kubectl explain` to read, or the Command Patterns row. Never the full command.

</details>

<details>
<summary>🟢 Guided</summary>

1. One sentence saying what this step does.

   ```bash
   one command (heredocs and continuation lines stay in one block)
   ```

   ```text
   literal output the reader should see, captured from a real run
   ```

   Prose for anything that explains rather than shows.

(Step 1 creates the namespace; the last step is kubectl delete namespace lab2-2 (the namespace is `lab` + the lab ID). File edits are text-only steps: "Edit `slow.yaml`: add `concurrencyPolicy: Forbid` under `spec:`." The last step says "Run the ✅ Check below, then delete…".)

</details>

**✅ Check**

(bash block: the one-line `t()` helper, then one `t "name" "$(command)" "expected"` line per Goal outcome; every line prints PASS or FAIL)
:::
```

Labs must run on a plain kind cluster. Difficulty: ★ recall, ★★ apply, ★★★ diagnose or design. When a lab repeats an earlier one, state what it builds on ("Builds on [Lab 1-1](...)") and keep only the new part. Guided commands use the patterns and images in `start-here/command-patterns.md`; a command pattern new to the section gets a row there first.

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
- Wrap every `<placeholder>` and output token such as `<none>` in backticks when it sits in prose. MDX parses a bare `<none>` as a JSX tag and the build fails.
- First mention of a glossary term links to `start-here/glossary.md#<term>`. New terms get a row there with a `<Link id="term" />` anchor.
- Cross-page links carry an anchor when a section exists (`./storage.md#access-modes`), so the reader lands on the answer.
