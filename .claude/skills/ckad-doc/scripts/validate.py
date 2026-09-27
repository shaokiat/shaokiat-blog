"""Server-side dry-run every ```yaml block in the given markdown files against the current kubectl context.
Skips blocks whose first line is '# fragment' or that are Kustomization files (reported, not failed).
Usage: python3 validate.py <file.md>..."""
import re, subprocess, sys

subprocess.run("kubectl create ns validate --dry-run=client -o yaml | kubectl apply -f -", shell=True, capture_output=True)
bad = skipped = ok = 0
for f in sys.argv[1:]:
    for i, blk in enumerate(re.findall(r"```yaml\n(.*?)```", open(f).read(), re.S), 1):
        first = blk.strip().splitlines()[0]
        if first.startswith("# fragment") or "kind: Kustomization" in blk or first.startswith("# values"):
            skipped += 1
            print(f"SKIP {f}#{i}: {first}")
            continue
        nss = set(re.findall(r"^\s+namespace: ([\w-]+)", blk, re.M))
        for ns in nss:
            subprocess.run(f"kubectl create ns {ns} --dry-run=client -o yaml | kubectl apply -f -", shell=True, capture_output=True)
        cmd = ["kubectl", "apply", "--dry-run=server", "-f", "-"] + ([] if nss or "kind: Namespace" in blk else ["-n", "validate"])
        r = subprocess.run(cmd, input=blk, capture_output=True, text=True)
        err = "\n".join(l for l in r.stderr.splitlines() if "version difference" not in l)
        if r.returncode or err.strip():
            bad += 1
            print(f"FAIL {f}#{i}:\n{err}\n---\n{blk[:300]}")
        else:
            ok += 1
print(f"\nok={ok} skipped={skipped} failed={bad}")
sys.exit(1 if bad else 0)
