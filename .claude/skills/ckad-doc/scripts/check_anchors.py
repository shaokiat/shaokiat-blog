"""Check that every cross-page link with an #anchor in a docs section resolves in the built site.
Run `npm run build` first. Usage (from repo root): python3 .claude/skills/ckad-doc/scripts/check_anchors.py [docs/<section>]
Defaults to docs/kubernetes-ckad."""
import glob, os, re, sys

bad = 0
root = sys.argv[1] if len(sys.argv) > 1 else "docs/kubernetes-ckad"
for src in glob.glob(f"{root}/**/*.md*", recursive=True):
    for path, anchor in re.findall(r"\]\((\.{1,2}/[^)#]+\.mdx?)#([^)]+)\)", open(src).read()):
        tgt = os.path.normpath(os.path.join(os.path.dirname(src), path))[len("docs/"):].rsplit(".", 1)[0]
        tgt = tgt[: -len("/index")] if tgt.endswith("/index") else tgt
        html = f"build/docs/{tgt}/index.html"
        if not os.path.exists(html) or f'id="{anchor}"'.encode() not in open(html, "rb").read():
            bad += 1
            print(f"MISSING {src}: {path}#{anchor}")
print(f"broken anchors: {bad}")
sys.exit(1 if bad else 0)
