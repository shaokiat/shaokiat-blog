# New Documentation Page

Create a new documentation page for the ML Engineering section following the established conventions in this repo.

## What to ask the user

Before writing anything, ask for:
1. **Topic name** — e.g. "Background Tasks", "Streaming Responses"
2. **Tier** — Tier 1 (Foundation), Tier 2 (ML Integration), or Tier 3 (Production Engineering)
3. **Scope** — stub (outline + official docs only) or expanded (fully written)

## File location

| Tier | Directory |
|---|---|
| Tier 1 | `docs/ml-engineering/foundation/` |
| Tier 2 | `docs/ml-engineering/ml-integration/` |
| Tier 3 | `docs/ml-engineering/production/` |

File name: kebab-case of the topic. e.g. "Background Tasks" → `background-tasks.md`

Sidebar position: check existing files in the target directory and use the next available integer.

## Page structure — follow this exactly

```markdown
---
sidebar_position: <next available>
---

# <Topic Name>

> **Customer framing:** A customer needed X — here is the architecture and tradeoffs.

**Official docs:**
- [Label](url)
- ...

---

## <Section>

...content...

:::info Best practice
One-liner rule the reader should remember.
:::

→ See [Related Page](./related-page.md#section) for <what they'll find there>.
```

## Style rules

- **Customer framing** — every page opens with a blockquote in the form "A customer needed X — here's the architecture and tradeoffs." Frame the problem from the customer's perspective, not the technology's.
- **Official docs block** — always include a list of official doc links immediately after the framing. No content without a cited link.
- **`---` separator** — always place a horizontal rule between the docs block and the first section.
- **`:::info Best practice`** — use for key one-liner takeaways only. Not for general information. Close with `:::`.
- **Cross-references** — use `→ See [Page Title](./filename.md#section)` to link to related pages instead of repeating content. Prefer linking over duplicating.
- **Tables for comparisons**, bullet lists for options, bold for service/package names.
- **Code examples** — every section that introduces a concept should have a working code snippet.
- **No fluff** — omit background that doesn't change a decision. Prefer "use X when Y" over "X is a tool that does Y".
- **No comments in code** unless the WHY is non-obvious.

## After creating the file

1. Update `docs/ml-engineering/intro.md` — add a linked row to the correct tier table.
2. Update `CLAUDE.md` — add the new page to the Sidebar Positions table with its assigned position number.
3. Run `npm run build` to confirm no broken links.

## Stub vs expanded

**Stub:** Include the frontmatter, customer framing, official docs, `---`, and a `## Topics to cover` section with a bullet list of subtopics. No code yet.

**Expanded:** Write all sections in full. Every subtopic from the bullet list becomes a `##` section with explanation, code example, and a `:::info Best practice` where applicable.

## Existing cross-reference map

Use these to add `→ See` links without duplicating content:

| Topic | Page | Key sections |
|---|---|---|
| HTTP methods, status codes, REST | `foundation/backend-fundamentals.md` | `#http-methods`, `#http-status-codes`, `#401-vs-403` |
| Path/query params, Pydantic validation | `foundation/routing-validation.md` | `#request-bodies`, `#pydantic-v2-field-validators` |
| Depends(), sub-deps, yield, overrides | `foundation/dependency-injection.md` | `#scoped-dependencies-with-yield`, `#testing-with-dependency_overrides` |
| async def vs def, event loop, blocking | `foundation/async-foundations.md` | `#async-def-vs-def`, `#blocking-calls-to-watch-for` |
| Project layout, settings, lifespan | `foundation/project-structure.md` | `#settings-with-pydantic-settings`, `#lifespan-events` |
| Swagger, ReDoc, examples, prod disable | `foundation/openapi-docs.md` | `#disabling-docs-in-production` |
| JWT, API keys, RBAC, scopes | `foundation/auth-patterns.md` | `#jwt-with-oauth2passwordbearer`, `#role-based-access-control` |
| Model loading, batching, health checks | `ml-integration/model-serving.md` | `#model-loading`, `#health--readiness-endpoints` |
