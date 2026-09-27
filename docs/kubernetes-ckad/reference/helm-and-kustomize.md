---
title: Helm & Kustomize
sidebar_label: Helm & Kustomize
sidebar_position: 6
---

import Link from "@docusaurus/Link";

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
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [envFrom](./config-and-secrets.md#injection-methods) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**One base, two environments.**

**Goal**

1. Create `base/` with a Deployment `web` (`nginx:1.27`, 1 replica) that reads `LOG_LEVEL` from a generated ConfigMap `web-config`.
2. Create `overlays/prod/` that sets namespace `lab6`, prefix `prod-`, 3 replicas, tag `1.28` and `LOG_LEVEL=info`.
3. Render the overlay, then apply it. Change `LOG_LEVEL` to `warn` and re-apply. What happens to the Pods, and why?

**Verify**

```bash
kubectl -n lab6 get deploy prod-web -o jsonpath='{.spec.replicas} {.spec.template.spec.containers[0].image}{"\n"}'  # 3 nginx:1.28
kubectl -n lab6 get configmap                                  # prod-web-config-<hash>, one per LOG_LEVEL applied
```

<details>
<summary>🟡 Hints</summary>

1. Generate the Deployment with `--dry-run=client -o yaml`, then add `envFrom` pointing at `web-config`. The ConfigMap comes from `configMapGenerator`, not from a file.
2. The fields you need are in the Kustomize features table above: `namespace`, `namePrefix`, `replicas`, `images`, and a generator with `behavior: merge`.
3. `kubectl kustomize <dir>` renders; `kubectl apply -k <dir>` applies. Compare the ConfigMap name before and after.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the directory layout and enter it.

   ```bash
   mkdir -p app/base app/overlays/prod && cd app
   ```

2. Write the base Deployment; it reads every key of web-config as env vars.

   ```bash
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
   ```

3. Write `base/kustomization.yaml` as shown above.

4. Write `overlays/prod/kustomization.yaml` as shown above, but with `namespace: lab6`.

5. Create the target namespace.

   ```bash
   kubectl create namespace lab6
   ```

6. Render the overlay without applying: names prefixed, configMapRef rewritten to the hashed name.

   ```bash
   kubectl kustomize overlays/prod | less
   ```

7. Apply the rendered overlay.

   ```bash
   kubectl apply -k overlays/prod
   ```

8. Edit the overlay: change `LOG_LEVEL=info` to `LOG_LEVEL=warn`.

9. Apply again.

   ```bash
   kubectl apply -k overlays/prod
   ```

10. List ReplicaSets: a new one appeared.

    ```bash
    kubectl -n lab6 get rs
    ```

    The ConfigMap name (hash) changed, so the Pod template changed, so a rollout happened.

11. Run the ✅ Check below, then delete everything the lab created.

    ```bash
    cd .. && kubectl delete namespace lab6
    ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "3 replicas on 1.28"     "$(kubectl -n lab6 get deploy prod-web -o jsonpath='{.spec.replicas} {.spec.template.spec.containers[0].image}')" "3 nginx:1.28"
t "Pods see LOG_LEVEL=warn" "$(kubectl -n lab6 exec deploy/prod-web -- printenv LOG_LEVEL)" "warn"
t "config change rolled"   "$(kubectl -n lab6 get rs --no-headers | wc -l | tr -d ' ')" "2"
t "two hashed ConfigMaps"  "$(kubectl -n lab6 get configmap -o name | grep -c 'prod-web-config-')" "2"
```
:::

<Link id="lab-6-2" />

:::tip Lab 6-2 ★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · the [helm CLI](https://helm.sh/docs/intro/install/) (v3 or v4) and internet access · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Install a chart, break its values, roll back.**

**Goal**

1. Add the `podinfo` repo. Install chart `podinfo/podinfo` version `6.15.0` as release `web` in namespace `lab6-helm`, with 2 replicas.
2. Upgrade the release to set `ui.message=hello`, keeping 2 replicas.
3. Upgrade again, passing only `--set ui.message=oops`. How many replicas are there now, and why?
4. Roll back to the revision that had 2 replicas and `hello`.

**Verify**

```bash
helm history web -n lab6-helm                               # 4 revisions, the last "Rollback to 2"
kubectl -n lab6-helm get deploy web-podinfo                 # 2/2
helm get values web -n lab6-helm                            # replicaCount: 2, message: hello
```

<details>
<summary>🟡 Hints</summary>

1. `helm repo add -h`, then `helm install -h`: look at `--version`, `--create-namespace` and `--set`. `helm show values` names the replica key.
2. `helm upgrade -h`: which flag keeps the values from the last revision?
3. Compare `helm get values` before and after. Values you don't pass again are not kept by default.
4. `helm history` numbers the revisions; `helm rollback <release> <revision>`.

</details>

<details>
<summary>🟢 Guided</summary>

1. Add the chart repository and find the replica key.

   ```bash
   helm repo add podinfo https://stefanprodan.github.io/podinfo
   helm repo update
   helm show values podinfo/podinfo --version 6.15.0 | grep -E '^replicaCount|  message'
   ```

   ```text
   replicaCount: 1
     message: ""
   ```

2. Install a pinned chart version with 2 replicas.

   ```bash
   helm install web podinfo/podinfo --version 6.15.0 -n lab6-helm --create-namespace --set replicaCount=2
   kubectl -n lab6-helm rollout status deployment/web-podinfo
   ```

   ```text
   NAME: web
   NAMESPACE: lab6-helm
   STATUS: deployed
   REVISION: 1
   DESCRIPTION: Install complete
   ```

3. Upgrade, keeping the earlier values and adding a message.

   ```bash
   helm upgrade web podinfo/podinfo --version 6.15.0 -n lab6-helm --reuse-values --set ui.message=hello
   helm get values web -n lab6-helm
   ```

   ```text
   USER-SUPPLIED VALUES:
   replicaCount: 2
   ui:
     message: hello
   ```

4. Upgrade the careless way: a new `--set` and nothing else.

   ```bash
   helm upgrade web podinfo/podinfo --version 6.15.0 -n lab6-helm --set ui.message=oops
   kubectl -n lab6-helm get deploy web-podinfo -o jsonpath='{.spec.replicas}{"\n"}'
   helm get values web -n lab6-helm
   ```

   ```text
   1
   USER-SUPPLIED VALUES:
   ui:
     message: oops
   ```

   Without `--reuse-values` (or `-f` with the full values file), Helm starts from the chart defaults. `replicaCount: 2` was dropped, so the Deployment scaled to 1.

5. Roll back to revision 2 and read the history.

   ```bash
   helm rollback web 2 -n lab6-helm
   kubectl -n lab6-helm rollout status deployment/web-podinfo
   helm history web -n lab6-helm
   ```

   ```text
   REVISION  UPDATED                   STATUS      CHART           APP VERSION  DESCRIPTION
   1         Sun Sep 27 09:54:27 2026  superseded  podinfo-6.15.0  6.15.0       Install complete
   2         Sun Sep 27 09:54:39 2026  superseded  podinfo-6.15.0  6.15.0       Upgrade complete
   3         Sun Sep 27 09:54:40 2026  superseded  podinfo-6.15.0  6.15.0       Upgrade complete
   4         Sun Sep 27 09:54:41 2026  deployed    podinfo-6.15.0  6.15.0       Rollback to 2
   ```

   A rollback is a new revision (4) with revision 2's values and templates. History only moves forward.

6. Run the ✅ Check below, then delete everything the lab created.

   ```bash
   kubectl delete namespace lab6-helm
   ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "4 revisions"           "$(helm history web -n lab6-helm -o json | grep -o '"revision":' | wc -l | tr -d ' ')" "4"
t "last is Rollback to 2" "$(helm history web -n lab6-helm --max 1 -o json | grep -o 'Rollback to 2')" "Rollback to 2"
t "2 replicas again"      "$(kubectl -n lab6-helm get deploy web-podinfo -o jsonpath='{.status.readyReplicas}')" "2"
t "message is hello"      "$(kubectl -n lab6-helm get deploy web-podinfo -o jsonpath='{.spec.template.spec.containers[0].env[?(@.name=="PODINFO_UI_MESSAGE")].value}')" "hello"
```
:::

## Gotchas

- **`helm upgrade` without `--reuse-values` or `-f` resets your values.** Earlier `--set` flags are dropped. Keep values in a file in Git and always pass `-f`.
- **Releases are namespaced.** `helm list` shows the current namespace only. Use `-A`.
- **Manual edits to Helm-managed objects drift.** The next upgrade overwrites them. Change values instead.
- **Failed upgrades leave a `failed` release.** `helm history` shows it. `helm rollback` to the last `deployed` revision, or pass `--rollback-on-failure` (Helm 4; `--atomic` in Helm 3, deprecated in 4) to roll back automatically on failure.
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
- **Prevent:** `helm upgrade --rollback-on-failure --timeout 10m` in CI (`--atomic` on Helm 3), which rolls back on failure. Test upgrades in staging with production-like values.

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
- **`helm upgrade --install --rollback-on-failure` is the CI form.** Idempotent, and it rolls back on failure.
- **Kustomize generators hash config into names.** A config change becomes a rollout automatically.
- **`kubectl kustomize` and `helm template` render without applying.** Read the output before you ship it.
