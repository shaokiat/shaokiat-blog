"""Check that every cross-page link with an #anchor in docs/kubernetes-ckad resolves in the built site.
Run `npm run build` first. Usage (from repo root): python3 .claude/skills/ckad-doc/scripts/check_anchors.py"""
import glob, os, re, sys

bad = 0
for src in glob.glob("docs/kubernetes-ckad/**/*.md", recursive=True):
    for path, anchor in re.findall(r"\]\((\.{1,2}/[^)#]+\.md)#([^)]+)\)", open(src).read()):
        tgt = os.path.normpath(os.path.join(os.path.dirname(src), path))[len("docs/"):-3]
        tgt = tgt[: -len("/index")] if tgt.endswith("/index") else tgt
        html = f"build/docs/{tgt}/index.html"
        if not os.path.exists(html) or f'id="{anchor}"'.encode() not in open(html, "rb").read():
            bad += 1
            print(f"MISSING {src}: {path}#{anchor}")
print(f"broken anchors: {bad}")
sys.exit(1 if bad else 0)
