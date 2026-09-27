# Figures

A figure earns its place when it shows a mechanism a table can't: containment (what runs inside what), flow between components, or change over time. Comparisons stay tables.

## Visual language

The look is set in code by `scripts/fig.py`, the source of truth for colours, fonts and shapes. Use its helpers rather than hand-writing SVG, so every figure matches Figures 1-1 and 1-2 in `reference/architecture.md`.

| Element | Helper | Reads as |
|---|---|---|
| Top-level frame (cluster, panel) | `outer()` | Rounded rectangle, small uppercase label top-left |
| Nested boundary (namespace, node, Pod) | `boundary()` | Same, one level in |
| Component | `box(title, subtitle, kind)` | **Bold title** + muted subtitle ("kube-scheduler / assigns Pods to nodes") |
| Pod or container | `pod()` | Small box with a `POD` corner tag |
| Label or selector | `tag()` | Pill, e.g. `app=api` |
| Flow | `arrow()`, `path()` | Always labelled with what flows (`label()`, halo when it crosses a line) |

Colour carries one meaning per figure, chosen from three accents plus grey: `blue` the default component, `amber` the one thing the figure is about, `green` healthy/new/actual state, `grey` old or inactive. The caption says what each colour means *on that figure*.

Mermaid is reserved for decision trees (Figure 13-1 is the example): wrap it in `<div className="mermaid-scroll" style={{maxWidth: "900px", margin: "0 auto"}}>`, use rectangle nodes (the site CSS doesn't style stadium shapes in dark mode), `classDef accent` for the nodes that matter.

## Steps

1. **Add the figure to a source file** in `scripts/figures/` (existing files group figures by area; each file's docstring lists its figures; start a new file for a new area) and call `save("<page>-<n>", width, height, aria_label, parts)`. That writes `static/img/kubernetes-ckad/fig-<page>-<n>-light.svg` and `-dark.svg` (dark is derived from light by the colour map in `fig.py`) and renders a preview PNG with light above dark.
2. **Look at the preview** (the path is printed) and fix every overlap, clipped label, or arrow that touches the wrong box. Re-run until clean.
   Done when: you have viewed the preview after the final run and both themes are legible.
3. **Embed it** after the Overview (reference) or under `## Architecture` (scenario):

   ```mdx
   <ThemedImage
     alt="One sentence describing what the figure shows"
     sources={{
       light: useBaseUrl('/img/kubernetes-ckad/fig-<page>-<n>-light.svg'),
       dark: useBaseUrl('/img/kubernetes-ckad/fig-<page>-<n>-dark.svg'),
     }}
   />

   *Figure 5-1: What it shows. Amber is …, green is …*
   ```

4. **Check it on the served site** (`npm run build && npx docusaurus serve`) for pages where the figure is the main content; the site defaults to dark mode.

Figures 1-1 and 1-2 predate the helper and are hand-written SVG; edit those files directly and keep the dark copy in sync.
