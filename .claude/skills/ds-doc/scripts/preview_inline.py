"""Render every inline <svg className="ml-diagram"> on a page, light above dark, into one PNG.

Usage (from repo root): python3 .claude/skills/ds-doc/scripts/preview_inline.py docs/data-science/<page>.md
Uses the real colour tokens from src/css/custom.css. Set CHROME to override the browser path."""
import os, re, subprocess, sys, tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
page = Path(sys.argv[1])
svgs = re.findall(r'<svg className="ml-diagram.*?</svg>', page.read_text(), re.S)
# JSX → SVG attributes: className → class, camelCase → kebab-case (except viewBox)
svgs = [re.sub(r" ([a-z]+[A-Z][A-Za-z]*)=", lambda m: " " + (m[1] if m[1] == "viewBox" else re.sub(r"([A-Z])", r"-\1", m[1]).lower()) + "=",
               s.replace("className=", "class=")) for s in svgs]
body = "".join(f"<div style='padding:10px;background:{bg}' {attr}>{''.join(svgs)}</div>"
               for bg, attr in (("#fff", ""), ("#1b1b1d", "data-theme='dark'")))
out = Path(tempfile.gettempdir()) / f"ds-inline-{page.stem}"
html = out.with_suffix(".html")
html.write_text(f"<link rel='stylesheet' href='file://{REPO}/src/css/custom.css'><style>.ml-diagram{{width:100%;height:auto}}</style><body style='margin:0;width:700px'>{body}")
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--allow-file-access-from-files",
                f"--screenshot={out}.png", f"--window-size=720,{len(svgs) * 2 * 330 + 60}", f"file://{html}"],
               stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
print(f"{len(svgs)} figures → {out}.png")
