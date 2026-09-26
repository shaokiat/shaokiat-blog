---
title: kubectl Cheatsheet
sidebar_label: kubectl Cheatsheet
sidebar_position: 14
---

# kubectl Cheatsheet

> Docs: [kubectl quick reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/) · [JSONPath support](https://kubernetes.io/docs/reference/kubectl/jsonpath/) · [kubectl reference](https://kubernetes.io/docs/reference/kubectl/generated/)

## Overview

The CKAD is a speed test: roughly two hours of hands-on tasks in live clusters. The winning habit is imperative first: generate YAML with `kubectl create ... --dry-run=client -o yaml`, edit only the fields the generator can't set, then apply. Typing manifests from memory is slow and error-prone. Search `kubernetes.io/docs` for the rest; it's the only site you can open during the exam. This page collects the commands the other pages use, grouped by task, with the shell setup that saves a few seconds on every one of them.

## Key concepts

### What the generators can create

| Resource | Command | Can't set (edit the YAML) |
|---|---|---|
| Pod | `kubectl run web --image=nginx:1.27 --port=80 --labels=app=web` | Probes, volumes, resources, securityContext |
| Deployment | `kubectl create deployment web --image=nginx:1.27 --replicas=3 --port=80` | Probes, strategy, volumes |
| Service | `kubectl expose deployment web --port=80 --target-port=8080` | Named ports |
| Job | `kubectl create job hello --image=busybox:1.36 -- echo hi` | completions, parallelism, backoffLimit |
| CronJob | `kubectl create cronjob tick --image=busybox:1.36 --schedule="*/5 * * * *" -- date` | concurrencyPolicy, timeZone |
| ConfigMap | `kubectl create configmap cfg --from-literal=K=V --from-file=app.conf` | n/a |
| Secret | `kubectl create secret generic db --from-literal=password=x` | n/a |
| ServiceAccount | `kubectl create serviceaccount ci-bot` | n/a |
| Role / RoleBinding | `kubectl create role r --verb=get,list --resource=pods` / `kubectl create rolebinding rb --role=r --serviceaccount=ns:ci-bot` | n/a |
| Ingress | `kubectl create ingress shop --rule="host/path*=svc:80"` | TLS details |
| ResourceQuota | `kubectl create quota q --hard=pods=10,requests.cpu=2` | Scopes |
| HPA | `kubectl autoscale deployment web --min=2 --max=10 --cpu=50%` | `behavior` |
| NetworkPolicy, PVC, LimitRange | No generator | Copy from the docs |

### `--` means different things

| Command | Words after `--` become | Result with an image that has an entrypoint |
|---|---|---|
| `kubectl run x --image=img -- a b` | `args` | Entrypoint runs with `a b` as arguments |
| `kubectl run x --image=img --command -- a b` | `command` | Entrypoint replaced by `a b` |
| `kubectl create deployment x --image=img -- a b` | `command` | Entrypoint replaced by `a b` |
| `kubectl create job x --image=img -- a b` | `command` | Entrypoint replaced by `a b` |

### Output formats

| Flag | Gives |
|---|---|
| `-o wide` | Extra columns: node, IP |
| `-o yaml` / `-o json` | The full object |
| `-o name` | `pod/web-5c9b`, ready for scripts |
| `-o jsonpath='{...}'` | Specific fields |
| `-o custom-columns=NAME:.metadata.name,...` | Your own table |
| `--show-labels`, `-L app` | Labels as a column |
| `--sort-by=.metadata.creationTimestamp` | Sorted rows |

## kubectl essentials

Shell setup, first thing in the exam (the `k` alias and completion are usually preconfigured; check with `type k`):

```bash
alias k=kubectl
source <(kubectl completion bash); complete -o default -F __start_kubectl k
export do="--dry-run=client -o yaml"             # k create deploy web --image=nginx $do > web.yaml
export now="--force --grace-period=0"            # k delete pod web $now
k config set-context --current --namespace=lab   # stop typing -n
```

The exam shell is bash. In zsh, `$do` isn't word-split: write `${=do}`.

Vim, so pasted YAML keeps its indentation (`~/.vimrc`):

```text
set expandtab tabstop=2 shiftwidth=2 autoindent
```

In vim, `:set paste` before pasting from the docs, `V` + `>` / `<` to shift a block, `:%s/old/new/g` to replace.

Context and lookup:

```bash
k config get-contexts
k config use-context <ctx>
k api-resources --namespaced=true -o name | head
k explain deployment.spec.strategy.rollingUpdate
k explain pod.spec --recursive | grep -i toleration
```

Generate, edit, apply:

```bash
k run web --image=nginx:1.27 $do > pod.yaml
k create deployment web --image=nginx:1.27 --replicas=3 $do > deploy.yaml
k apply -f deploy.yaml
k replace --force -f pod.yaml                    # recreate a Pod after editing an immutable field
k diff -f deploy.yaml                            # preview what apply would change
```

Rollouts:

```bash
k set image deployment/web nginx=nginx:1.28
k rollout status deployment/web
k rollout history deployment/web
k rollout undo deployment/web --to-revision=1
k rollout restart deployment/web
k scale deployment/web --replicas=5
```

Labels, selectors and annotations:

```bash
k label pod web tier=frontend
k label pod web tier-                            # remove a label
k annotate deployment web owner=team-a
k get pods -l 'app=web,tier!=backend'
k get pods -l 'env in (prod,staging)'
k get pods --field-selector status.phase!=Running -A
```

Debugging:

```bash
k describe pod <pod>
k logs <pod> --previous -c <container>
k get events --sort-by=.lastTimestamp
k exec -it <pod> -- sh
k debug -it <pod> --image=busybox:1.36 --target=<container>
k run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://web
k top pods --sort-by=memory
```

JSONPath and custom columns:

```bash
k get pods -o jsonpath='{.items[*].metadata.name}'
k get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.podIP}{"\n"}{end}'
k get pod web -o jsonpath='{.spec.containers[*].image}'
k get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'
k get pods -o custom-columns='NAME:.metadata.name,NODE:.spec.nodeName,IMAGE:.spec.containers[0].image'
k get pods -A -o jsonpath='{.items[*].spec.containers[*].image}' | tr ' ' '\n' | sort | uniq -c
k get secret db -o jsonpath='{.data.password}' | base64 -d
```

## 🧪 Lab

:::tip Lab 14-1 ★★
**Speed drill: eight tasks in ten minutes.**

Work in namespace `lab14`. Only imperative commands and `$do` + a quick edit are allowed.

1. Pod `nginx` (`nginx:1.27`) with label `tier=web`.
2. Deployment `api` (`nginx:1.27`, 3 replicas), exposed as ClusterIP Service `api` on 80.
3. ConfigMap `cfg` with `MODE=prod`, injected into `api` as env vars.
4. Scale `api` to 5, then update its image to `nginx:1.28`, then roll back.
5. Job `once` (`busybox:1.36`) that runs `echo done`.
6. CronJob `tick` every 5 minutes running `date`.
7. Print each Pod's name and node, one per line.
8. Print the image of every container in the namespace with a count.

**Verify**

```bash
k -n lab14 get pod nginx --show-labels
k -n lab14 get deploy api -o jsonpath='{.spec.replicas} {.spec.template.spec.containers[0].image}{"\n"}'   # 5 nginx:1.27
k -n lab14 get job once -o jsonpath='{.status.succeeded}{"\n"}'                                             # 1
k -n lab14 get cronjob tick
```

<details>
<summary>Solution</summary>

```bash
k create namespace lab14 && k config set-context --current --namespace=lab14
k run nginx --image=nginx:1.27 --labels=tier=web
k create deployment api --image=nginx:1.27 --replicas=3 --port=80
k expose deployment api --port=80
k create configmap cfg --from-literal=MODE=prod
k set env deployment/api --from=configmap/cfg
k scale deployment api --replicas=5
k set image deployment/api nginx=nginx:1.28
k rollout undo deployment/api
k create job once --image=busybox:1.36 -- echo done
k create cronjob tick --image=busybox:1.36 --schedule="*/5 * * * *" -- date
k get pods -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName
k get pods -o jsonpath='{.items[*].spec.containers[*].image}' | tr ' ' '\n' | sort | uniq -c

k config set-context --current --namespace=default && k delete namespace lab14
```

</details>
:::

## Gotchas

- **`--dry-run=client` validates nothing against the server.** A typo'd field passes. `--dry-run=server` runs full validation and admission.
- **`kubectl apply` on an object made with `create`** prints a `last-applied-configuration` warning. Harmless, but mixing both styles makes diffs confusing.
- **Invalid `kubectl edit` saves are kept in `/tmp`.** The error message gives the path. `kubectl apply -f` it after fixing.
- **`--force --grace-period=0` hides problems.** Fine for exam speed; in production it skips graceful shutdown and can leave the old Pod running on an unreachable node.
- **`kubectl run -- cmd` sets args, not the command.** See the table above.
- **Quote selectors, jsonpath and custom-columns.** `!=`, `()`, `{}` and `[*]` mean something to the shell.
- **Namespace on every command.** After `set-context --namespace`, remember to switch back, or later tasks land in the wrong place.

## Scenario questions

**Q1 ★ Find every Pod in the cluster that isn't `Running`, fastest way.**

<details>
<summary>Model answer</summary>

- **Clarify:** include `Succeeded` Job Pods? They are finished, not broken.
- **Observe:** phase is a field on every Pod, and field selectors filter on the server.
- **Hypothesise:** `kubectl get pods -A --field-selector status.phase!=Running,status.phase!=Succeeded`.
- **Fix:** then `describe` the interesting ones. Note that `CrashLoopBackOff` Pods have phase `Running`, so also scan `kubectl get pods -A | grep -v Running` or sort by restarts.
- **Prevent:** a saved alias or dashboard for this view. It's the first thing to check in any incident.

</details>

**Q2 ★★ Produce a table of every Deployment with its image and replica count, across all namespaces.**

<details>
<summary>Model answer</summary>

- **Clarify:** one container per Pod, or can there be several?
- **Observe:** the fields live at `.spec.template.spec.containers[*].image` and `.spec.replicas`.
- **Hypothesise:** custom columns are clearer than jsonpath ranges.
- **Fix:** `kubectl get deploy -A -o custom-columns='NS:.metadata.namespace,NAME:.metadata.name,REPLICAS:.spec.replicas,IMAGE:.spec.template.spec.containers[*].image'`.
- **Prevent:** for anything more complex than a table, `-o json | jq` is easier to read and debug than long jsonpath.

</details>

**Q3 ★★ You need to change a field on a running Pod and `kubectl edit` refuses to save. What happened and what do you do?**

<details>
<summary>Model answer</summary>

- **Clarify:** which field? Is the Pod owned by a controller?
- **Observe:** the error says `Pod updates may not change fields other than ...`. kubectl saved your edit to a file in `/tmp`.
- **Hypothesise:** most Pod spec fields are immutable. Only a few (such as `image`) can change in place.
- **Fix:** standalone Pod: `kubectl replace --force -f /tmp/kubectl-edit-xxxx.yaml`. Owned Pod: change the Deployment instead, which rolls out new Pods.
- **Prevent:** in the exam, generate YAML to a file first and edit the file, not the live object.

</details>

**Q4 ★★★ List Deployments whose containers have no CPU request, cluster-wide, for an HPA rollout.**

<details>
<summary>Model answer</summary>

- **Clarify:** do LimitRange defaults count? They are injected into Pods, not Deployments.
- **Observe:** jsonpath can filter with `?()`, but "field missing" filters are awkward and error-prone.
- **Hypothesise:** `-o json | jq` is the right tool: `kubectl get deploy -A -o json | jq -r '.items[] | select(any(.spec.template.spec.containers[]; .resources.requests.cpu == null)) | "\(.metadata.namespace)/\(.metadata.name)"'`.
- **Fix:** add requests to those Deployments before creating HPAs, or rely on LimitRange defaults (then check Pods, not Deployments).
- **Prevent:** an admission policy (ValidatingAdmissionPolicy or Kyverno) that requires CPU requests. → See [Resources & Scaling](./resources-and-scaling.md).

</details>

## Summary

- **Generate, don't type.** `$do` and a quick edit beats writing YAML from memory.
- **Know which fields the generators can't set.** Probes, volumes and strategy always need an edit.
- **`--` after `run` sets args; after `create` it sets the command.**
- **jsonpath for one field, custom-columns for a table, jq for logic.**
- **Set the namespace per task and set it back.** Wrong-namespace work scores zero.
