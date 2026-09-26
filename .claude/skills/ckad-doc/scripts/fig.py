"""SVG helpers for docs/kubernetes-ckad figures, matching Figures 1-1 and 1-2.

Usage (from a file in scripts/figures/):  from fig import *;  save(name, w, h, aria, parts)
Writes static/img/kubernetes-ckad/fig-<name>-light.svg and -dark.svg, plus a preview PNG
(light above dark) in the system temp dir. Set CHROME to override the browser path.
"""
import os, subprocess, html, tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
OUT = str(REPO / "static/img/kubernetes-ckad")
SCR = os.path.join(tempfile.gettempdir(), "ckad-fig-preview")
os.makedirs(SCR, exist_ok=True)
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
DARK = {
    "#f6f8fa": "#202329", "#eef2f6": "#2a2f37", "#cbd5e1": "#3f4854",
    "#dce8f5": "#1e3347", "#3a6f9a": "#4a7fa5", "#1e3a4f": "#c5d5e8",
    "#4a5568": "#8896a8", "#52606d": "#8896a8",
    "#fef3c7": "#3d3320", "#d97706": "#a5822f", "#713f12": "#e0cfa8",
    "#e3f1e8": "#1f3529", "#2d7a52": "#4a8f6a", "#1f5c3d": "#b8dcc6",
    "#94a3b8": "#5b6675", "#ffffff": "#1b1b1d",
}
KIND = {  # fill, stroke, title
    "blue": ("#dce8f5", "#3a6f9a", "#1e3a4f"),
    "amber": ("#fef3c7", "#d97706", "#713f12"),
    "green": ("#e3f1e8", "#2d7a52", "#1f5c3d"),
    "grey": ("#eef2f6", "#94a3b8", "#52606d"),
}
MUTED, EDGE, BLABEL = "#4a5568", "#3a6f9a", "#52606d"
e = html.escape


def outer(x, y, w, h, label):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#f6f8fa" stroke="#cbd5e1" stroke-width="1.5"/>\n'
            f'<text x="{x+16}" y="{y+20}" font-size="10" font-weight="600" letter-spacing="1.2" fill="{BLABEL}">{e(label)}</text>')


def boundary(x, y, w, h, label, fill="#eef2f6", dashed=False, stroke="#cbd5e1", color=BLABEL):
    d = ' stroke-dasharray="6 4"' if dashed else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="1.5"{d}/>\n'
            f'<text x="{x+14}" y="{y+19}" font-size="10" font-weight="600" letter-spacing="1.2" fill="{color}">{e(label)}</text>')


def box(x, y, w, h, title, sub=None, kind="blue", sub2=None, dashed=False):
    f, s, t = KIND[kind]
    cx = x + w / 2
    d = ' stroke-dasharray="5 3"' if dashed else ""
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{f}" stroke="{s}" stroke-width="1.5"{d}/>']
    if sub is None:
        out.append(f'<text x="{cx:g}" y="{y+h/2+5:g}" text-anchor="middle" font-size="13" font-weight="700" fill="{t}">{e(title)}</text>')
    else:
        ty = y + h / 2 - (12 if sub2 else 5)
        out.append(f'<text x="{cx:g}" y="{ty:g}" text-anchor="middle" font-size="13" font-weight="700" fill="{t}">{e(title)}</text>')
        out.append(f'<text x="{cx:g}" y="{ty+19:g}" text-anchor="middle" font-size="11" fill="{MUTED}">{e(sub)}</text>')
        if sub2:
            out.append(f'<text x="{cx:g}" y="{ty+33:g}" text-anchor="middle" font-size="11" fill="{MUTED}">{e(sub2)}</text>')
    return "\n".join(out)


def pod(x, y, w, h, text, sub=None, kind="green", tag="POD"):
    """Small boundary-style box with an uppercase corner tag (Pods, containers)."""
    f, s, t = KIND[kind]
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{f}" stroke="{s}" stroke-width="1.5"/>',
           f'<text x="{x+8}" y="{y+15}" font-size="9" font-weight="600" letter-spacing="1" fill="{s}">{e(tag)}</text>']
    cy = y + h / 2 + (10 if sub is None else 4)
    out.append(f'<text x="{x+w/2:g}" y="{cy:g}" text-anchor="middle" font-size="12" font-weight="600" fill="{t}">{e(text)}</text>')
    if sub:
        out.append(f'<text x="{x+w/2:g}" y="{cy+16:g}" text-anchor="middle" font-size="10.5" fill="{MUTED}">{e(sub)}</text>')
    return "\n".join(out)


def arrow(*pts, both=False, dashed=False, color=EDGE, width=1.5, head=True):
    p = " ".join(f"{a:g},{b:g}" for a, b in pts)
    m = (' marker-end="url(#a)"' if head else "") + (' marker-start="url(#a)"' if both else "")
    d = ' stroke-dasharray="5 4"' if dashed else ""
    return f'<polyline points="{p}" fill="none" stroke="{color}" stroke-width="{width}"{m}{d}/>'


def path(d, dashed=False, width=1.5, head=True):
    m = ' marker-end="url(#a)"' if head else ""
    da = ' stroke-dasharray="5 4"' if dashed else ""
    return f'<path d="{d}" fill="none" stroke="{EDGE}" stroke-width="{width}"{m}{da}/>'


def label(x, y, text, anchor="middle", halo=None, size=11, color=MUTED, weight=None, italic=False):
    h = f' stroke="{halo}" stroke-width="4" paint-order="stroke"' if halo else ""
    w = f' font-weight="{weight}"' if weight else ""
    i = ' font-style="italic"' if italic else ""
    return f'<text x="{x:g}" y="{y:g}" text-anchor="{anchor}" font-size="{size}" fill="{color}"{h}{w}{i}>{e(text)}</text>'


def tag(x, y, text, kind="amber"):
    """Pill used for labels/selectors, e.g. app=api."""
    f, s, t = KIND[kind]
    w = 7 * len(text) + 14
    return (f'<rect x="{x}" y="{y}" width="{w}" height="18" rx="9" fill="{f}" stroke="{s}" stroke-width="1.2"/>'
            f'<text x="{x+w/2:g}" y="{y+13}" text-anchor="middle" font-size="10.5" font-weight="600" fill="{t}">{e(text)}</text>')


def raw(s):
    return s


def save(name, w, h, aria, parts):
    body = "\n  ".join("\n  ".join(p.split("\n")) for p in parts)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" font-family="{FONT}" role="img" aria-label="{e(aria)}">\n'
           f'  <defs>\n    <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n'
           f'      <path d="M0 0L10 5L0 10z" fill="{EDGE}"/>\n    </marker>\n  </defs>\n\n  {body}\n</svg>\n')
    light = f"{OUT}/fig-{name}-light.svg"
    open(light, "w").write(svg)
    dark = svg
    for k, v in DARK.items():
        dark = dark.replace(k, v)
    open(f"{OUT}/fig-{name}-dark.svg", "w").write(dark)
    preview(name, w, h)


def preview(name, w, h):
    """Render light above dark into one PNG for visual review."""
    page = f"{SCR}/{name}.html"
    open(page, "w").write(
        f"<body style='margin:0'><div style='background:#fff;padding:10px'><img src='file://{OUT}/fig-{name}-light.svg' style='width:1100px'></div>"
        f"<div style='background:#1b1b1d;padding:10px'><img src='file://{OUT}/fig-{name}-dark.svg' style='width:1100px'></div>")
    ph = int(2 * (1100 * h / w + 20))
    subprocess.run([CHROME, "--headless=new", "--disable-gpu",
                    "--allow-file-access-from-files", f"--screenshot={SCR}/{name}.png", f"--window-size=1120,{ph}", f"file://{page}"],
                   stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    print(f"preview: {SCR}/{name}.png")
