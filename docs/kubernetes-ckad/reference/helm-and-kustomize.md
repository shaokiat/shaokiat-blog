---
title: Helm & Kustomize
sidebar_label: Helm & Kustomize
sidebar_position: 6
---

# Helm & Kustomize

> Docs: [Helm](https://helm.sh/docs/) · [Helm cheat sheet](https://helm.sh/docs/intro/cheatsheet/) · [Kustomize in kubectl](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)

## Overview

Raw YAML stops scaling once the same app runs in three environments or you install someone else's software. **Helm** is a package manager: a chart is a set of templates plus default values, and each install is a named **release** with a revision history you can roll back. **Kustomize** has no templates: it takes plain YAML (a base) and applies patches per environment (overlays), and it is built into `kubectl` as `-k`. Use Helm to install third-party software and when you need to ship a configurable package. Use Kustomize for your own apps when each environment differs only in a few fields. Many teams use both: Helm for vendor charts, Kustomize for their own services.

## Key concepts

### Helm vs Kustomize

| | Helm | Kustomize |
|---|---|---|
| Model | Go templates + `values.yaml` | Plain YAML + patches |
| Built into kubectl | No, separate `helm` CLI | Yes: `kubectl apply -k` |
| Release tracking | Yes. History, `helm rollback`. | No. Just applied objects. |
| Readability | Templates get hard to read | Base is valid YAML you can apply alone |
| Best for | Installing third-party software, distributing packages | Your own apps across dev/staging/prod |

### Helm terms

| Term | Meaning |
|---|---|
| **Chart** | Package: templates, `Chart.yaml`, default `values.yaml` |
| **Repository** | Where charts are published: an HTTP index or an OCI registry |
| **Release** | One installed instance of a chart in a namespace, with a name |
| **Revision** | A numbered version of a release. Every `upgrade` or `rollback` adds one. |
| **Values** | Inputs to the templates. Precedence: chart defaults < `-f file` < `--set` |

### Kustomize features

| Field in `kustomization.yaml` | Does |
|---|---|
| `resources` | Files or directories to include (the base) |
| `namespace` / `namePrefix` / `labels` | Applied to every object |
| `images` | Override image name or tag without a patch |
| `replicas` | Override replica counts by name |
| `patches` | Strategic-merge or JSON patches for anything else |
| `configMapGenerator` / `secretGenerator` | Build ConfigMaps with a content hash in the name, so a change triggers a rollout |

## kubectl essentials

Helm install and inspect:

```bash
helm repo add podinfo https://stefanprodan.github.io/podinfo
helm repo update
helm search repo podinfo
helm show values podinfo/podinfo | less                 # what can I set?
helm install web podinfo/podinfo -n demo --create-namespace --set replicaCount=2
helm install web podinfo/podinfo -n demo -f my-values.yaml
helm list -A                                            # releases in every namespace
helm get values web -n demo                             # values you supplied
helm get manifest web -n demo                           # rendered YAML actually applied
helm template web podinfo/podinfo --set replicaCount=2  # render locally, install nothing
```

Helm upgrade and roll back:

```bash
helm upgrade web podinfo/podinfo -n demo --reuse-values --set ui.message=hi
helm upgrade --install web podinfo/podinfo -n demo -f values.yaml   # idempotent: CI-friendly
helm history web -n demo
helm rollback web 1 -n demo
helm uninstall web -n demo
```

Kustomize:

```bash
kubectl kustomize overlays/prod           # render, apply nothing
kubectl apply -k overlays/prod
kubectl diff -k overlays/prod             # what would change
kubectl delete -k overlays/prod
```

A base and a prod overlay:

```text
app/
├── base/
│   ├── kustomization.yaml
│   └── deployment.yaml
└── overlays/
    └── prod/
        └── kustomization.yaml
```

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- deployment.yaml
configMapGenerator:
- name: web-config
  literals:
  - LOG_LEVEL=debug
```

```yaml
# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: prod
namePrefix: prod-
resources:
- ../../base
images:
- name: nginx
  newTag: "1.28"
replicas:
- name: web
  count: 3
configMapGenerator:
- name: web-config
  behavior: merge
  literals:
  - LOG_LEVEL=info
patches:
- target: {kind: Deployment, name: web}
  patch: |-
    - op: add
      path: /spec/template/spec/containers/0/resources
      value: {requests: {cpu: 100m, memory: 128Mi}}
```

## 🧪 Lab

:::tip Lab 6-1 ★★
**One base, two environments.**

1. Create `base/` with a Deployment `web` (`nginx:1.27`, 1 replica) that reads `LOG_LEVEL` from a generated ConfigMap `web-config`.
2. Create `overlays/prod/` that sets namespace `lab6`, prefix `prod-`, 3 replicas, tag `1.28` and `LOG_LEVEL=info`.
3. Render the overlay, then apply it. Change `LOG_LEVEL` and re-apply. What happens to the Pods, and why?
4. *(If Helm is installed)* Install `podinfo/podinfo` as release `web` in `lab6-helm` with 2 replicas, upgrade it with `ui.message=hello`, then roll back to revision 1.

**Verify**

```bash
kubectl -n lab6 get deploy prod-web -o jsonpath='{.spec.replicas} {.spec.template.spec.containers[0].image}{"\n"}'  # 3 nginx:1.28
kubectl -n lab6 get configmap                                  # prod-web-config-<hash>
helm history web -n lab6-helm                                  # 3 revisions, the last "Rollback to 1"
```

<details>
<summary>Solution</summary>

```bash
mkdir -p app/base app/overlays/prod && cd app
cat > base/deployment.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 1
  selector:
    matchLabels: {app: web}
  template:
    metadata:
      labels: {app: web}
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        envFrom:
        - configMapRef: {name: web-config}
EOF
# base/kustomization.yaml: as shown above
# overlays/prod/kustomization.yaml: as shown above, but with namespace: lab6

kubectl create namespace lab6
kubectl kustomize overlays/prod | less        # names prefixed, configMapRef rewritten to the hashed name
kubectl apply -k overlays/prod

# change LOG_LEVEL=info to LOG_LEVEL=warn in the overlay, then:
kubectl apply -k overlays/prod
kubectl -n lab6 get rs                        # a new ReplicaSet: the ConfigMap name (hash) changed,
                                              # so the Pod template changed, so a rollout happened

# Helm part
helm install web podinfo/podinfo -n lab6-helm --create-namespace --set replicaCount=2
helm upgrade web podinfo/podinfo -n lab6-helm --reuse-values --set ui.message=hello
helm rollback web 1 -n lab6-helm
helm history web -n lab6-helm

kubectl delete namespace lab6 lab6-helm
```

</details>
:::

## Gotchas

- **`helm upgrade` without `--reuse-values` or `-f` resets your values.** Earlier `--set` flags are dropped. Keep values in a file in Git and always pass `-f`.
- **Releases are namespaced.** `helm list` shows the current namespace only. Use `-A`.
- **Manual edits to Helm-managed objects drift.** The next upgrade overwrites them. Change values instead.
- **Failed upgrades leave a `failed` release.** `helm history` shows it. `helm rollback` to the last `deployed` revision, or use `--atomic` to roll back automatically on failure.
- **kubectl's built-in Kustomize lags the standalone one.** Check `kubectl version` if a newer field isn't recognised.
- **Generated ConfigMap names change on every edit.** Reference them only through Kustomize, which rewrites the references. A hand-written name won't match. Old generated ConfigMaps are left behind; clean them up or prune.

## Scenario questions

**Q1 ★ Install a vendor's chart into `monitoring` with 3 replicas and your own values file. What commands, and what do you check first?**

<details>
<summary>Model answer</summary>

- **Clarify:** which chart version is approved? Is there an existing release to upgrade instead?
- **Observe:** `helm show values` to find the replica key. It differs per chart (`replicaCount`, `server.replicas`).
- **Hypothesise:** a first install with `-f values.yaml`, pinned with `--version`.
- **Fix:** `helm upgrade --install <name> <chart> -n monitoring --create-namespace --version <v> -f values.yaml`, then `helm get manifest` to confirm the rendered replicas.
- **Prevent:** always pin `--version`. An unpinned install picks up whatever was published that morning.

</details>

**Q2 ★★ A `helm upgrade` failed halfway. The release shows `failed` and some Pods run the new version. What now?**

<details>
<summary>Model answer</summary>

- **Clarify:** is the app serving? Is the failure in the chart (rendering or hooks) or the app (Pods not Ready)?
- **Observe:** `helm history` shows the failed revision. `kubectl get pods` and events show what broke.
- **Hypothesise:** a failing pre-upgrade hook (such as a migration Job) or new Pods that never became Ready before `--wait` timed out.
- **Fix:** `helm rollback <release> <last-good-revision>`, then fix and upgrade again.
- **Prevent:** `helm upgrade --atomic --timeout 10m` in CI, which rolls back on failure. Test upgrades in staging with production-like values.

</details>

**Q3 ★★ Your team runs one internal service in dev, staging and prod. Helm or Kustomize?**

<details>
<summary>Model answer</summary>

- **Clarify:** how different are the environments? Does anyone outside the team install it?
- **Observe:** differences are usually replicas, image tag, resources and a few config values.
- **Hypothesise:** Kustomize fits: the base stays readable YAML and overlays show the differences explicitly. A chart adds templating and a values API nobody else consumes.
- **Fix:** base + three overlays in Git, applied by CI or a GitOps controller.
- **Prevent:** trade-off to name: if the service becomes a product other teams install with their own settings, Helm's packaging and versioning start paying off.

</details>

**Q4 ★★★ A chart needs a database password. How do you keep it out of Git?**

<details>
<summary>Model answer</summary>

- **Clarify:** what secret store exists (Vault, cloud secret manager)? Is GitOps in use?
- **Observe:** `--set password=...` ends up in shell history, and in the release record: anyone with read access to Helm's release Secrets can see it.
- **Hypothesise:** the secret should not pass through Helm at all.
- **Fix:** keep the password in a secret manager, sync it into a Kubernetes Secret with External Secrets Operator, and have the chart reference the existing Secret by name (most charts support `existingSecret`). Encrypted-in-Git options (SOPS, Sealed Secrets) work when there is no secret manager.
- **Prevent:** a CI check that rejects plaintext secrets in values files. → See [Config & Secrets](./config-and-secrets.md).

</details>

## Summary

- **Helm packages and tracks releases; Kustomize patches plain YAML.** Choose by who installs it and how much varies.
- **Pin chart versions and keep values in files.** `--set` and unpinned charts are unrepeatable.
- **`helm upgrade --install --atomic` is the CI form.** Idempotent, and it rolls back on failure.
- **Kustomize generators hash config into names.** A config change becomes a rollout automatically.
- **`kubectl kustomize` and `helm template` render without applying.** Read the output before you ship it.
