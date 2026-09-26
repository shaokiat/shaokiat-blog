---
title: "Command Patterns: kubectl by Task"
sidebar_label: Command Patterns
sidebar_position: 3
---

# Command Patterns: kubectl by Task

> Docs: [kubectl overview](https://kubernetes.io/docs/reference/kubectl/) · [kubectl quick reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/) · [kubectl command reference](https://kubernetes.io/docs/reference/kubectl/generated/)

Skip memorising flags. Learn one grammar, the lookup commands, and the patterns below, organized by what you want to do. `-h` fills in the rest. Every Lab's 🟢 Guided tier uses exactly these patterns, and the 🟡 Hints tier points you back to them. Exam-speed tricks (aliases, `$do`, jsonpath) live in the [kubectl Cheatsheet](../reference/kubectl-cheatsheet.md).

## The grammar

```text
kubectl <verb> <type>[/<name>] [-n <namespace>] [flags] [-- <command> <args>]
kubectl  get    pods/web         -n lab5         -o wide
kubectl  create deployment web   -n lab5         --image=nginx:1.27 --replicas=3
kubectl  run    tmp              -n lab5         --image=busybox:1.36 --rm -it --restart=Never -- sh
```

| Part | What goes there | Find valid values with |
|---|---|---|
| `verb` | What to do: `get`, `create`, `delete`… | `kubectl -h` |
| `type` | A [resource](./glossary.md#resource): `pods`, `deployments`, or short names `po`, `deploy`, `svc` | `kubectl api-resources` |
| `name` | One object. Omit it to act on all of that type. | `kubectl get <type>` |
| `-n` | The [namespace](./glossary.md#namespace). `-A` means all namespaces. | [Which namespace?](#which-namespace-does-my-command-use) |
| `flags` | Options for this verb | `kubectl <verb> -h` |
| `--` | Everything after it is the container's command | [What `--` does](#what----does) |

### Verb families

| Family | Verbs | Changes the cluster? |
|---|---|---|
| Look | `get`, `describe`, `logs`, `events`, `top`, `explain`, `auth can-i` | No |
| Create from flags ([imperative](./glossary.md#imperative-vs-declarative)) | `run`, `create`, `expose`, `autoscale` | Yes |
| Change | `apply`, `set`, `scale`, `label`, `annotate`, `patch`, `edit`, `rollout` | Yes |
| Get inside | `exec`, `port-forward`, `cp`, `debug` | No (except `debug`, which adds a container) |
| Remove | `delete` | Yes |

### What `--` does

| Command | Words after `--` become | Result with an image that has an entrypoint |
|---|---|---|
| `kubectl run x --image=img -- a b` | `args` | Entrypoint runs with `a b` as arguments |
| `kubectl run x --image=img --command -- a b` | `command` | Entrypoint replaced by `a b` |
| `kubectl create deployment x --image=img -- a b` | `command` | Entrypoint replaced by `a b` |
| `kubectl create job x --image=img -- a b` | `command` | Entrypoint replaced by `a b` |

This is why the [image kit](#the-image-kit) starts agnhost with `-- netexec` under `run`, but `-- /agnhost netexec` under `create deployment`.

## Look it up instead of memorising

| I don't know… | Run | What you get |
|---|---|---|
| Which flags a command takes | `kubectl create deployment -h` | **Examples first**, then flags. Copy an example and change the names. |
| What I can create from flags | `kubectl create -h` | The list of generators: `deployment`, `job`, `secret`, `role`… |
| What a field is called, or where it goes | `kubectl explain deploy.spec.strategy` | Field docs. Add `--recursive` for the whole tree. |
| A kind's short name, API group, or whether it's namespaced | `kubectl api-resources` | One row per kind |
| What YAML a command would produce | Append `--dry-run=client -o yaml` | The manifest. Nothing is created. |
| Which flags work on every command | `kubectl options` | `-n`, `--context`, `-v`… |

## I want to…

### Run something

| I want to… | Pattern | Example |
|---|---|---|
| Run one Pod | `kubectl run <name> --image=<img>` | `kubectl run web --image=nginx:1.27` |
| Run N copies that heal themselves | `kubectl create deployment <name> --image=<img> --replicas=<n>` | `kubectl create deployment web --image=nginx:1.27 --replicas=3` |
| Run a task to completion | `kubectl create job <name> --image=<img> -- <cmd>` | `kubectl create job hello --image=busybox:1.36 -- echo hi` |
| Run a task on a schedule | `kubectl create cronjob <name> --image=<img> --schedule="<cron>" -- <cmd>` | `kubectl create cronjob tick --image=busybox:1.36 --schedule="*/5 * * * *" -- date` |
| Get a throwaway shell | `kubectl run tmp --rm -it --image=busybox:1.36 --restart=Never -- sh` | Deleted when you exit |

### Expose it

| I want to… | Pattern | Example |
|---|---|---|
| Give Pods one stable name | `kubectl expose deployment <name> --port=<svc-port> --target-port=<container-port>` | `kubectl expose deployment web --port=80` |
| Reach it from my laptop | `kubectl port-forward svc/<name> <local>:<svc-port>` | `kubectl port-forward svc/web 8080:80` |
| Route HTTP by host and path | `kubectl create ingress <name> --rule="<host>/<path>*=<svc>:<port>"` | `kubectl create ingress shop --rule="shop.example.com/api*=api:80"` |

### Configure it

| I want to… | Pattern | Example |
|---|---|---|
| Store settings | `kubectl create configmap <name> --from-literal=<K>=<V>` | `kubectl create configmap cfg --from-literal=MODE=prod` |
| Store a password | `kubectl create secret generic <name> --from-literal=<K>=<V>` | `kubectl create secret generic db --from-literal=password=s3cr3t` |
| Inject them as env vars | `kubectl set env deployment/<name> --from=configmap/<cm>` | `kubectl set env deployment/web --from=configmap/cfg` |
| Set requests and limits | `kubectl set resources deployment/<name> --requests=... --limits=...` | `kubectl set resources deployment/web --requests=cpu=100m,memory=128Mi` |
| Autoscale | `kubectl autoscale deployment <name> --min=<n> --max=<n> --cpu=<pct>%` | `kubectl autoscale deployment web --min=2 --max=10 --cpu=50%` |

### Change it

| I want to… | Pattern | Example |
|---|---|---|
| Ship a new image | `kubectl set image deployment/<name> <container>=<img>` | `kubectl set image deployment/web nginx=nginx:1.28` |
| Change the replica count | `kubectl scale deployment <name> --replicas=<n>` | `kubectl scale deployment web --replicas=5` |
| Undo the last rollout | `kubectl rollout undo deployment/<name>` | `kubectl rollout undo deployment/web` |
| Restart all Pods | `kubectl rollout restart deployment/<name>` | Picks up new ConfigMap values |
| Change one field | `kubectl patch <type> <name> -p '<json>'` | `kubectl patch svc web -p '{"spec":{"selector":{"app":"web"}}}'` |
| Change anything, by hand | `kubectl edit <type>/<name>` | Opens the live object in `$EDITOR` |
| Apply a file | `kubectl apply -f <file>` | `kubectl apply -f web.yaml` |

### Check it

| I want to… | Pattern | Example |
|---|---|---|
| See if it's running | `kubectl get <type> [-o wide] [-w]` | `kubectl get pods -w` |
| See why it isn't | `kubectl describe <type>/<name>`, then read **Events** | `kubectl describe pod/web-7d4f` |
| See what it printed | `kubectl logs <pod> [-c <container>] [--previous] [-f]` | `kubectl logs web-7d4f --previous` |
| See what just happened | `kubectl get events --sort-by=.lastTimestamp` | Add `--field-selector type=Warning` |
| Wait for a rollout | `kubectl rollout status deployment/<name>` | `kubectl rollout status deployment/web` |
| Wait for a condition | `kubectl wait --for=condition=<c> <type>/<name> --timeout=<t>` | `kubectl wait --for=condition=Ready pod/web --timeout=60s` |
| Check a permission | `kubectl auth can-i <verb> <type> --as=<who>` | `kubectl auth can-i list pods --as=system:serviceaccount:lab9:ci-bot` |

### Get inside

| I want to… | Pattern | Example |
|---|---|---|
| Run a command in a container | `kubectl exec <pod> [-c <container>] -- <cmd>` | `kubectl exec web-7d4f -- nginx -v` |
| Open a shell in it | `kubectl exec -it <pod> -- sh` | Needs a shell in the image |
| Call a Service from inside | `kubectl exec <client> -- wget -qO- -T 3 http://<svc>` | Uses the [client Pod](#the-image-kit) |
| Debug an image with no shell | `kubectl debug -it <pod> --image=busybox:1.36 --target=<container>` | Adds a temporary container |

### Clean up

| I want to… | Pattern | Example |
|---|---|---|
| Delete one object | `kubectl delete <type> <name>` | `kubectl delete pod web` |
| Delete a whole lab | `kubectl delete namespace <ns>` | `kubectl delete namespace lab5` |

## Generate, edit, apply

Generators can't set everything: probes, volumes and resources need YAML. Generate a correct skeleton instead of typing one:

```bash
kubectl create deployment web --image=nginx:1.27 --dry-run=client -o yaml > web.yaml   # 1. generate
# 2. edit web.yaml: add only what the generator can't set
kubectl apply -f web.yaml                                                             # 3. apply
```

| Resource | Generator | Add by hand |
|---|---|---|
| Pod | `run` | Probes, volumes, resources, securityContext |
| Deployment | `create deployment` | Probes, strategy, volumes |
| Service | `expose` / `create service` | Named ports |
| Job / CronJob | `create job` / `create cronjob` | completions, parallelism, backoffLimit / concurrencyPolicy, timeZone |
| ConfigMap, Secret, ServiceAccount, Role, RoleBinding, Quota | `create <kind>` | Rarely anything |
| Ingress | `create ingress` | TLS details |
| HPA | `autoscale` | `behavior` |
| NetworkPolicy, PVC, LimitRange | None | Copy a skeleton from the reference page or the docs |

## Which namespace does my command use?

The first of these that is set wins:

1. The `-n` flag
2. `metadata.namespace` in the YAML (a conflict with `-n` is an error)
3. The current context's namespace
4. `default`

Check the current default with `kubectl config view --minify | grep namespace`. The Guided tier of every lab passes `-n lab<N>` explicitly, so it works whatever your default is.

## The image kit

Four images cover every lab. Pin the tags: the rollout labs rely on the difference between `nginx:1.27` and `1.28`, and `latest` changes under you.

| Image | Gives you | Use it for | Start it with |
|---|---|---|---|
| `busybox:1.36` | `sh`, `wget`, `nslookup`, `sleep` | Test clients, one-off commands, Jobs, fake apps that crash on purpose | `kubectl run c --image=busybox:1.36 --restart=Never -- sleep 3600` |
| `nginx:1.27` (and `1.28`) | Web server on port 80 | Deployments, Services, rolling updates | `kubectl create deployment web --image=nginx:1.27` |
| `registry.k8s.io/e2e-test-images/agnhost:2.53` | HTTP server on any port, with `/hostname`, `/healthz` and `/readyz` | Services where `targetPort` isn't 80, probes, NetworkPolicy | `kubectl create deployment api --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080` |
| `registry.k8s.io/hpa-example` | A CPU-heavy page on port 80 | HPA load tests | `kubectl create deployment web --image=registry.k8s.io/hpa-example --port=80` |

**Keep a client Pod.** Start `c` once per lab and test through it with `kubectl exec c -- wget -qO- -T 3 http://<svc>`. It's faster than a new `run --rm` each time, and `run --rm -i` can lose output while it attaches.

→ Next: [Glossary](./glossary.md) for any term above, or start with [Lab 0](./mental-model.md#-lab).
