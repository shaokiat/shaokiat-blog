# New GenAI Concept Doc

Create a new **concept or protocol guide** for the `docs/genai-agents/` section — pages that explain how a technology or pattern works and how to design with it (e.g. MCP, tool use, RAG, evals). For use case architecture pages, use `/new-genai-usecase` instead.

## What to ask the user

Before writing anything, ask for:
1. **Topic name** — e.g. "Tool Use", "RAG Pipeline", "Evals"
2. **Worked example scenario** — one concrete domain to use throughout (e.g. "order management assistant", "support ticket triage"). Every example in the doc must use this scenario.
3. **Scope** — stub (structure + headings only) or expanded (fully written)

## File location

Directory: `docs/genai-agents/`
File name: kebab-case of the topic. e.g. "RAG Pipeline" → `rag-pipeline.md`
Sidebar position: check existing files in the directory and use the next available integer.

## Page structure — follow this exactly

```markdown
---
sidebar_position: <next available>
---

# <Topic Name>

> <One-line hook — frame it as a design problem, not a technology description>

---

## Should I use <X>?

<One sentence on when it adds overhead and what problem it solves>

| Use <X> when | Skip <X> when |
|---|---|
| <reason> | <reason> |
| <reason> | <reason> |

---

## What you're building

<Two-sides description: what you write on each side>

- **<Side A>** — <one-sentence role>
- **<Side B>** — <one-sentence role>

```text title="Architecture"
<ASCII diagram showing the two sides and how they connect>
```

<One-sentence summary of who orchestrates vs. who executes>

### What <X> can expose

<Primitives table if applicable>

| Primitive | When | Use for |
|---|---|---|

---

## How it works end-to-end

<Three actors, two phases framing — who mediates what>

```mermaid
flowchart LR
    <high-level overview of setup vs. runtime phases>
```

### 1. <Setup / Handshake>

<What happens on first connection — the most common failure point>

```text title="Cold-start sequence"
1. <step> — <what it does>
2. <step> — <what it does>
...
```

<Wire-level example of the critical message>

```json title="<label>"
{ ... }
```

<One-line consequence of misconfiguration>

### 2. <Schema / Config fetch>

<What gets fetched and why>

```json title="<request>"
{ ... }
```

```json title="<response>"
{ ... }
```

### 3. What the model sees

<How schemas/config reach the model — not system prompt text, it's the tools parameter>

<Registry or equivalent mapping, if the concept has routing>

**Do you have to handle this yourself?**
- **Framework / managed host** — handled automatically
- **Rolling your own** — you do: <exact steps>

<Schema example the model reads>

:::tip
<One-line advice on writing descriptions the model can act on>
:::

<Token cost note if schemas accumulate in context>

### 4. The <runtime> loop

<How the model drives calls turn by turn — use the worked example scenario>

```mermaid
sequenceDiagram
    actor User
    participant Model
    participant Client as <Agent Client name>
    participant Server

    User->>Model: "<realistic user message using the scenario>"
    ...
```

**How routing works**

<If there's a registry or ID-threading mechanism, explain it here with a short inline example>

| What's happening | Implication |
|---|---|
| <observation> | <design consequence> |

### What you actually write

| Side | You write | Framework handles |
|---|---|---|
| **<Side A>** | <your code> | <framework code> |
| **<Side B>** | <your loop> | <framework plumbing> |

**<Side A> — implementation**

<The decorator/registration pattern. Explain: type hints → schema, docstring → description>

```python title="<filename>.py"
<minimal working implementation using the scenario>
```

**<Side B> — the loop**

```text title="<Side B> — the loop"
You write:   <steps>
Framework:   <what it handles>
```

---

## Designing your <X>s

This is where most implementations go wrong. The protocol is simple; the interface design is not.

### The three choices that define every <X>

**1. <First design axis>**

<Principle. Bad vs. good example with ❌/✅>

```text title="<label>"
❌ <bad approach>
✅ <good approach>
```

**2. <Second design axis>**

<Principle. Show narrow vs. broad inputs, or tight vs. loose contracts>

```python title="<label>"
# ❌ <bad>
# ✅ <good>
```

**3. <Third design axis (errors / outputs)>**

<Principle. Show unrecoverable vs. structured errors>

```python title="<label>"
# ❌ exception / stack trace
# ✅ structured return with hint
```

### Design patterns

Start with the simplest pattern. Only reach for a more complex one when a specific signal applies.

| Signal | Pattern |
|---|---|
| No special conditions | **<default pattern>** ← default |
| <signal> | **<pattern>** |
| <signal> | **<pattern>** |

---

**<Default pattern> — default**

<One-sentence description. Named for what it does, not the technology>

```text
<minimal example using the scenario>
```

<One sentence on tradeoffs>

:::warning
<The structural mistake that signals you've outgrown this pattern>
:::

---

**<Pattern 2> — <signal that triggers it>**

<Explanation>

```python title="<filename>.py"
<code using the scenario>
```

:::info Tradeoff
<What you give up by using this pattern>
:::

---

**<Pattern 3> — <signal>**

<Explanation>

```python title="<filename>.py"
<code using the scenario>
```

---

### <X> availability constraints

<What gets fixed at connection/load time that the model can't change later>

| Consequence | What to do |
|---|---|
| <consequence> | <mitigation> |

---

## ⚠️ <Primary risk category>

<How the risk arises — concrete attack or failure scenario>

```text title="<risk scenario>"
<concrete example of the failure>
```

| Mitigation | Why |
|---|---|
| <mitigation> | <reason> |

---

## Before you ship

| Check | Severity | Why |
|---|---|---|
| <check> | **Critical** | <reason> |
| <check> | **Should** | <reason> |

---

## Testing your <X>

<Recommended tool for local testing before wiring to a full host>

```bash title="<tool invocation>"
<command>
```

<One sentence on what to verify>

---

## Further reading

- [<Title>](<url>) — <one-line description>
```

## Style rules

**Scenario discipline**
- Pick one scenario before writing. Use it for every example — tool names, IDs, data values, user messages, error responses.
- IDs must be consistent. If section 3 says `ord_abc123`, every later section uses `ord_abc123`.
- Use realistic but short values. `Alice Chen` not `User123`. `ord_abc123` not `id`.

**Diagrams**
- Architecture overview → `flowchart LR` (horizontal, two sides)
- End-to-end phase overview → `flowchart LR`
- Turn-by-turn runtime → `sequenceDiagram`
- Keep sequence diagram lines short: drop parameter key names for single-arg calls, remove quotes from JSON values, drop redundant fields on repeated results.

**Admonitions — use Docusaurus `:::` syntax, never inline labels**
- `:::warning` — structural mistakes, risks, things that silently fail
- `:::info <Title>` — tradeoffs (use `info` not `note` — note is too light)
- `:::tip` — best practices, framing advice

**Code blocks**
- Always include `title=` attribute: `title="orders_server.py"`, `title="Cold-start sequence"`
- Use `@decorator` registration style when showing server-side tool definitions
- Bad/good comparisons: `# ❌` and `# ✅` as inline comments, or `❌`/`✅` prefix in text blocks
- No comments except when the WHY is non-obvious

**Tables**
- Use/skip → two-column at the top of "Should I use X?"
- Routing → Signal | Pattern, with `← default` on the default row
- Implications → What's happening | Implication
- Before you ship → Check | Severity | Why

**Prose**
- Decision guides over descriptions: "use X when Y" not "X is a thing that does Y"
- No inline "Risk:", "Note:", "Tradeoff:" — use admonitions
- Cross-link to `agent_design_patterns.md` whenever a design pattern matches one defined there
- No fluff — omit background that doesn't change a decision

## After creating the file

1. Check `docs/genai-agents/_category_.json` for the sidebar label.
2. Update `CLAUDE.md` — add the new page to the Sidebar Positions table if one exists for this section.
3. Run `npm run build` to confirm no broken links or Mermaid errors.

## Stub vs expanded

**Stub:** Frontmatter, all `##` and `###` headings, one-line placeholder under each heading, official docs links. No code yet.

**Expanded:** All sections written in full. Every design principle has a ❌/✅ example. Every pattern has a code block using the chosen scenario. Admonitions in place.

## Existing cross-reference map

| Topic | Page | Key anchor |
|---|---|---|
| Agent design patterns (tool use, HITL, guardrails, orchestrator) | `agent_design_patterns.md` | `#4-tool-use`, `#8-human-in-the-loop-hitl`, `#10-guardrails-and-validation`, `#5-orchestratorsubagent` |
| MCP server/client architecture | `mcp.md` | `#what-youre-building`, `#how-it-works-end-to-end` |
| Auth patterns | `../ml-engineering/foundation/auth-patterns.md` | — |
