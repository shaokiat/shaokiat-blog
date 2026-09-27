# Validation

Every command and manifest on a CKAD page is something the reader will type into a real cluster. Run it before publishing it.

## Cluster

Use a throwaway kind cluster (setup in `docs/kubernetes-ckad/start-here/local-setup.md`). Ask the user before installing kind or starting Docker. Add metrics-server only for pages that use `kubectl top` or HPA:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl -n kube-system patch deploy metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

kindnet enforces NetworkPolicy, so policy labs work on a plain kind cluster. Delete the cluster when done: `kind delete cluster --name ckad`.

## Steps

1. **Dry-run every YAML block** on the page:

   ```bash
   python3 .claude/skills/ckad-doc/scripts/validate.py docs/kubernetes-ckad/reference/<page>.md
   ```

   It server-side dry-runs each ` ```yaml ` block, creating namespaces the block names. Blocks that are Kustomization files, or whose first line is `# fragment`, are skipped and reported: build those with `kubectl kustomize`.
   Done when: `failed=0`.

2. **Run every lab, drill and walkthrough for real**, command by command, as the reader would. Replace interactive steps (`kubectl edit`) with the equivalent `patch`. Test from a long-lived client Pod (`kubectl run c --image=busybox:1.36 --restart=Never -- sleep 3600`, then `kubectl exec c -- ...`); `kubectl run --rm -i` loses output to an attach race.
   Done when: every Verify command prints what the page says it prints.

3. **Copy observed output onto the page.** Error messages, status columns and timings are quoted from the run, not recalled. When the run disagrees with the page, the run wins: fix the text.

4. **Report what you could not run** (a tool that isn't installed, a cloud-only feature) to the user and in the PR description.

## Facts that runs have already corrected

These were written wrong from memory and fixed by running them. Recheck similar claims the same way.

| Claim | Observed |
|---|---|
| A Service with no endpoints times out | `Connection refused`: kube-proxy rejects it. Only NetworkPolicy drops time out. |
| Egress deny shows a DNS error | busybox `wget` just times out; `nslookup` says `no servers could be reached` |
| `kubectl run x -- cmd` sets the command | It sets `args`. `create deployment/job -- cmd` sets `command`. |
| `logs --previous` shows the last crash | During back-off, plain `kubectl logs` shows it; `--previous` is one attempt older |
| LimitRange `max.cpu` only caps | With no `default.cpu`, it also injects `max` as the CPU limit |
| Mismatched Deployment selector creates Pods forever | Rejected at apply: `selector does not match template labels` |
| Readiness failure after 10 s | `failureThreshold × periodSeconds` (3 × 5 s = 15 s) |
