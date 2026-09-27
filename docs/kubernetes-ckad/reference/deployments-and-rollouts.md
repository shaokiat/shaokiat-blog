---
title: Deployments & Rollouts
sidebar_label: Deployments & Rollouts
sidebar_position: 5
---

import Link from "@docusaurus/Link";
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Deployments & Rollouts

> Docs: [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) · [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) · [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) · [kubectl rollout](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/)

## Overview

A Deployment runs a stateless app as N identical Pods and changes them safely. It doesn't manage Pods itself. It owns ReplicaSets, one per version of the Pod template, and each ReplicaSet owns its Pods. A change to the template creates a new ReplicaSet. The Deployment then scales the new one up and the old one down within the limits you set, and it keeps old ReplicaSets at zero replicas so a rollback is one scale operation away. Every CKAD deployment strategy (rolling, blue/green, canary) is built from these pieces plus Service label selectors.

<ThemedImage
  alt="A Deployment owns an old ReplicaSet scaling down and a new ReplicaSet scaling up; a step chart shows the old/new Pod counts moving from 3/0 to 0/3 with maxSurge 1 and maxUnavailable 0"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-deployments-and-rollouts-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-deployments-and-rollouts-1-dark.svg'),
  }}
/>

*Figure 5-1: Ownership and a rolling update. Grey is the old version, green the new one. Amber marks the Deployment, the only object you edit, and the step shown on the left.*

## Key concepts

### Choosing a workload resource

| Resource | Pods are | Identity and storage | Use for |
|---|---|---|---|
| **Deployment** | Interchangeable, random names | None. Shared or no storage. | Stateless web apps, APIs, workers |
| **StatefulSet** | Ordered, stable names (`db-0`, `db-1`) | Stable DNS per Pod, one PVC each | Databases, Kafka, anything with per-replica state |
| **DaemonSet** | One per node | Usually `hostPath` | Log collectors, node exporters, CNI agents |
| **Job / CronJob** | Run to completion | Varies | Batch work (→ [Jobs & CronJobs](./jobs-and-cronjobs.md)) |

### Rollout strategy

| Strategy | Behaviour | Downtime | Use when |
|---|---|---|---|
| `RollingUpdate` (default) | Replace Pods gradually within `maxSurge` / `maxUnavailable` | None if readiness probes are right | Almost always |
| `Recreate` | Delete all old Pods, then create new ones | Yes | Two versions can't run at once, or RWO volumes (→ [Storage](./storage.md)) |

| Setting | Default | Effect |
|---|---|---|
| `maxSurge` | 25% | Extra Pods allowed above `replicas` during the rollout. Higher is faster and costs more. |
| `maxUnavailable` | 25% | Pods allowed below `replicas`. 0 means capacity never drops. |
| `minReadySeconds` | 0 | A new Pod must stay Ready this long before it counts |
| `progressDeadlineSeconds` | 600 | After this, the rollout is marked failed. It is not rolled back automatically. |
| `revisionHistoryLimit` | 10 | Old ReplicaSets kept for rollback |

### Release strategies with core primitives

| Strategy | How | Rollback | Cost |
|---|---|---|---|
| **Rolling** | One Deployment, change the image | `kubectl rollout undo` | No extra capacity. Two versions serve at once. |
| **Blue/green** | Two Deployments (`version: blue`, `version: green`). The Service selector points at one. | Switch the selector back | Double capacity during the release |
| **Canary** | Two Deployments sharing the Service's label. Traffic splits by replica ratio (9 stable : 1 canary ≈ 10%). | Scale the canary to 0 | Coarse split. Precise percentages need an Ingress controller, Gateway API or a mesh. |

→ See [Zero-Downtime Release](../scenarios/zero-downtime-release.md) for all three end to end.

## kubectl essentials

Create and change:

```bash
kubectl create deployment web --image=nginx:1.27 --replicas=3 --port=80
kubectl set image deployment/web nginx=nginx:1.28        # container name = image name by default
kubectl scale deployment web --replicas=5
kubectl annotate deployment web kubernetes.io/change-cause="bump nginx to 1.28"
kubectl rollout restart deployment/web                   # new Pods, same spec (picks up new ConfigMap values)
```

Watch and undo:

```bash
kubectl rollout status deployment/web
kubectl rollout history deployment/web
kubectl rollout history deployment/web --revision=2      # what that revision contained
kubectl rollout undo deployment/web                      # back one revision
kubectl rollout undo deployment/web --to-revision=1
kubectl rollout pause deployment/web                     # batch several changes into one rollout
kubectl rollout resume deployment/web
kubectl get rs -l app=web                                # one ReplicaSet per revision
```

A Deployment that never drops capacity during a rollout:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels: {app: web}
spec:
  replicas: 3
  revisionHistoryLimit: 5
  selector:
    matchLabels: {app: web}           # immutable after creation
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  minReadySeconds: 5
  template:
    metadata:
      labels: {app: web}              # must match the selector
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        ports: [{containerPort: 80}]
        readinessProbe:
          httpGet: {path: /, port: 80}
          periodSeconds: 5
```

Blue/green is a Service whose selector names one version:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
    version: blue                     # switch to green to cut over
  ports:
  - port: 80
    targetPort: 80
```

## 🧪 Lab

:::tip Lab 5-1 ★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [readiness probes](./probes-and-observability.md#the-three-probes) (the manifest uses one) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Roll forward, break it, roll back.**

**Goal**

1. In namespace `lab5`, apply the Deployment above (3 replicas, `maxSurge: 1`, `maxUnavailable: 0`).
2. Update the image to `nginx:1.28` with a change-cause. Watch the ReplicaSets during the rollout.
3. Update to `nginx:1.99-typo`. Observe what happens to availability.
4. Roll back to the working version and confirm the revision history.

**Verify**

```bash
kubectl -n lab5 get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'   # nginx:1.28
kubectl -n lab5 get deploy web                     # 3/3 READY
kubectl -n lab5 rollout history deployment/web
```

<details>
<summary>🟡 Hints</summary>

1. The generator can't set `strategy`, so save the Deployment above as `web.yaml` and apply it.
2. "Ship a new image" in [Command Patterns](../start-here/command-patterns.md#change-it). The change-cause is an annotation: `kubectl annotate -h`. Watch with `kubectl get rs -w`.
3. Count Ready Pods while the new one fails. What does `maxUnavailable: 0` promise?
4. `kubectl rollout -h` lists `status`, `history` and `undo`.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the lab namespace.

   ```bash
   kubectl create namespace lab5
   ```

2. Create the Deployment from the manifest above, saved as `web.yaml`.

   ```bash
   kubectl -n lab5 apply -f web.yaml
   ```

3. Wait until all 3 Pods are Ready.

   ```bash
   kubectl -n lab5 rollout status deployment/web
   ```

4. Change the container image; this starts a rolling update.

   ```bash
   kubectl -n lab5 set image deployment/web nginx=nginx:1.28
   ```

5. Record why, so rollout history shows it.

   ```bash
   kubectl -n lab5 annotate deployment/web kubernetes.io/change-cause="nginx 1.28"
   ```

6. Watch the ReplicaSets: new RS 0→1→2→3, old RS 3→2→1→0.

   ```bash
   kubectl -n lab5 get rs -w
   ```

7. Roll out an image tag that doesn't exist.

   ```bash
   kubectl -n lab5 set image deployment/web nginx=nginx:1.99-typo
   ```

8. Check the Pods: one new Pod in ImagePullBackOff, 3 old Pods still Ready.

   ```bash
   kubectl -n lab5 get pods
   ```

   maxUnavailable: 0 means no old Pod is removed until a new one is Ready. Users see no outage.

9. Wait briefly for the rollout: it times out because it's stuck.

   ```bash
   kubectl -n lab5 rollout status deployment/web --timeout=30s
   ```

10. Go back to the previous revision.

    ```bash
    kubectl -n lab5 rollout undo deployment/web
    ```

11. Wait until the rollback finishes.

    ```bash
    kubectl -n lab5 rollout status deployment/web
    ```

12. List revisions: the 1.28 revision moved to the newest number.

    ```bash
    kubectl -n lab5 rollout history deployment/web
    ```

    The broken revision also says "nginx 1.28": change-cause is copied from the Deployment's annotation, so it goes stale unless you update it with every change.

13. Run the ✅ Check below, then delete everything the lab created.

    ```bash
    kubectl delete namespace lab5
    ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "back on nginx:1.28"   "$(kubectl -n lab5 get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}')" "nginx:1.28"
t "3 Pods Ready"         "$(kubectl -n lab5 get deploy web -o jsonpath='{.status.readyReplicas}')" "3"
t "3 revisions"          "$(kubectl -n lab5 rollout history deployment/web | grep -cE '^[0-9]+ ')" "3"
t "typo ReplicaSet at 0" "$(kubectl -n lab5 get rs -o jsonpath='{range .items[?(@.spec.template.spec.containers[0].image=="nginx:1.99-typo")]}{.spec.replicas}{end}')" "0"
```
:::

<Link id="lab-5-2" />

:::tip Lab 5-2 ★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [Lab 5-1](#-lab) · [Release strategies](#release-strategies-with-core-primitives) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Blue/green with one patch, then a canary by replica ratio.**

**Goal**

1. In namespace `lab5b`, create Deployments `web-blue` (`nginx:1.27`) and `web-green` (`nginx:1.28`), 3 replicas each, labelled `app: web` plus `version: blue` or `version: green`. Add a client Pod `c`.
2. Create Service `web` on port 80 that sends all traffic to blue. Prove which version answers.
3. Cut over to green with one command, prove it, and note how you would roll back.
4. Turn it into a canary: the Service selects both versions, green runs 1 replica, blue 3. Sample 40 requests and count the versions.

**Verify**

```bash
kubectl -n lab5b exec c -- wget -S -qO /dev/null -T 3 http://web 2>&1 | grep -i server:   # nginx/1.27.5 or nginx/1.28.3
kubectl -n lab5b get svc web -o jsonpath='{.spec.selector}{"\n"}'                       # {"app":"web"} after step 4
```

<details>
<summary>🟡 Hints</summary>

1. The generator can't set two labels, so write the blue Deployment as YAML and derive green from it. Give both a readiness probe.
2. `kubectl create service clusterip -h` sets the selector to `app=<name>`; `kubectl patch` adds `version`. The `Server` response header names the nginx version: `wget -S` prints headers.
3. The switch is the Service's `spec.selector`. Rollback is the same command with the old value.
4. Remove `version` from the selector (`--type=json` with a `remove` op) and `kubectl scale`. Loop `wget` in the client Pod and count with `sort | uniq -c`.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the namespace and a client Pod.

   ```bash
   kubectl create namespace lab5b
   kubectl -n lab5b run c --image=busybox:1.36 --restart=Never -- sleep 3600
   ```

2. Write the blue Deployment, derive green from it, and apply both.

   ```bash
   cat > blue.yaml <<'EOF'
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: web-blue
   spec:
     replicas: 3
     selector:
       matchLabels: {app: web, version: blue}
     template:
       metadata:
         labels: {app: web, version: blue}
       spec:
         containers:
         - name: nginx
           image: nginx:1.27
           readinessProbe:
             httpGet: {path: /, port: 80}
   EOF
   sed 's/blue/green/g; s/1\.27/1.28/' blue.yaml > green.yaml
   kubectl -n lab5b apply -f blue.yaml -f green.yaml
   kubectl -n lab5b rollout status deployment/web-green
   ```

3. Create the Service, pinned to blue.

   ```bash
   kubectl -n lab5b create service clusterip web --tcp=80:80
   kubectl -n lab5b patch service web -p '{"spec":{"selector":{"app":"web","version":"blue"}}}'
   kubectl -n lab5b exec c -- wget -S -qO /dev/null -T 3 http://web 2>&1 | grep -i server:
   ```

   ```text
     Server: nginx/1.27.5
   ```

   If the first call prints nothing, run it again: kube-proxy takes a second to program a brand-new Service.

4. Cut over. Green was already Ready, so no Pod starts; only the endpoints change.

   ```bash
   kubectl -n lab5b patch service web -p '{"spec":{"selector":{"app":"web","version":"green"}}}'
   kubectl -n lab5b exec c -- wget -S -qO /dev/null -T 3 http://web 2>&1 | grep -i server:
   ```

   ```text
     Server: nginx/1.28.3
   ```

   Rollback is the same patch with `blue`: instant, because blue is still running at full size.

5. Make it a canary: select both versions, and shrink green to 1 of 4 Pods.

   ```bash
   kubectl -n lab5b scale deployment web-green --replicas=1
   sleep 5                                          # let the 2 extra green Pods terminate
   kubectl -n lab5b patch service web --type=json -p '[{"op":"remove","path":"/spec/selector/version"}]'
   kubectl -n lab5b exec c -- sh -c 'for i in $(seq 40); do wget -S -qO /dev/null -T 3 http://web 2>&1 | grep -i server:; done' | sort | uniq -c
   ```

   ```text
     31   Server: nginx/1.27.5
      9   Server: nginx/1.28.3
   ```

   About 1 in 4, as the replica ratio predicts. Each `wget` opens a new connection; clients that keep connections open skew the split (→ [Zero-Downtime Release](../scenarios/zero-downtime-release.md#follow-up-questions)).

6. Run the ✅ Check below, then delete everything the lab created.

   ```bash
   kubectl delete namespace lab5b
   ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "selector is app=web only" "$(kubectl -n lab5b get svc web -o jsonpath='{.spec.selector}')" '{"app":"web"}'
t "3 blue, 1 green Ready"    "$(kubectl -n lab5b get deploy web-blue web-green -o jsonpath='{.items[*].status.readyReplicas}')" "3 1"
t "4 endpoints"              "$(kubectl -n lab5b get endpointslices -l kubernetes.io/service-name=web -o jsonpath='{range .items[*].endpoints[*]}x{end}')" "xxxx"
t "both versions answer"     "$(kubectl -n lab5b exec c -- sh -c 'for i in $(seq 40); do wget -S -qO /dev/null -T 3 http://web 2>&1 | grep -io "nginx/1\.2[78]"; done' | sort -u | tr '\n' ' ')" "nginx/1.27 nginx/1.28 "
```
:::

## Gotchas

- **Only template changes trigger a rollout.** Editing a ConfigMap the Pods read doesn't. Use `kubectl rollout restart`, or a hashed ConfigMap name (→ [Config & Secrets](./config-and-secrets.md)).
- **The selector is immutable.** Changing `spec.selector` means deleting and recreating the Deployment.
- **No readiness probe means instant Ready.** The rollout counts a Pod as available the moment it starts, even if the app needs 30 s to warm up. → See [Probes & Observability](./probes-and-observability.md).
- **A stuck rollout is not rolled back.** After `progressDeadlineSeconds` it is only marked `ProgressDeadlineExceeded`. Rollback is your call, or your pipeline's.
- **`replicas` in Git fights the HPA.** If an HPA manages the Deployment, remove `replicas` from the manifest or every apply resets it. → See [Resources & Scaling](./resources-and-scaling.md).
- **`rollout undo` creates drift.** The live object no longer matches Git. Revert in Git as well.

## Scenario questions

**Q1 ★ A rollout has been "in progress" for 15 minutes. What do you check?**

<details>
<summary>Model answer</summary>

- **Clarify:** are users affected? What changed in this rollout?
- **Observe:** `kubectl rollout status`, then `kubectl get rs` to see how far the new ReplicaSet got, then `kubectl describe pod` on a new Pod.
- **Hypothesise:** new Pods can't become Ready: image pull failure, crash, failing readiness probe, or not enough capacity to schedule the surge Pod.
- **Fix:** if users are unaffected (old Pods still serving thanks to `maxUnavailable: 0`), take time to diagnose. Otherwise `kubectl rollout undo` first, then diagnose.
- **Prevent:** a pipeline step that waits on `rollout status --timeout` and undoes on failure.

</details>

**Q2 ★★ Rollback with `kubectl rollout undo` or with a Git revert?**

<details>
<summary>Model answer</summary>

- **Clarify:** how is production deployed: CI applying from Git, or a GitOps controller?
- **Observe:** under GitOps, a manual undo gets reverted by the controller within minutes.
- **Hypothesise:** `rollout undo` is fastest: it only rescales an old ReplicaSet. Git revert is slower but keeps the source of truth right.
- **Fix:** in an incident, undo first to stop the bleeding, then revert in Git right away. Under GitOps, revert in Git, since that's the only lasting path.
- **Prevent:** make the Git path fast enough that nobody needs the manual one.

</details>

**Q3 ★★ Blue/green or canary for a payment service?**

<details>
<summary>Model answer</summary>

- **Clarify:** can two versions run at once (schema, message formats)? Is there budget for double capacity? How good is monitoring?
- **Observe:** canary limits the blast radius but needs metrics good enough to judge 10% of traffic. Blue/green gives an instant, all-or-nothing switch.
- **Hypothesise:** payments favour canary. A bug reaches 1–5% of users, not 100%.
- **Fix:** canary with precise traffic weights (Gateway API or a mesh, not replica ratios) and automated analysis on error rate and latency.
- **Prevent:** if versions can't coexist, blue/green is the only option. Say so up front; it's the deciding constraint.

</details>

**Q4 ★★★ A release includes a database column rename. How do you roll it out without downtime?**

<details>
<summary>Model answer</summary>

- **Clarify:** is a rename required, or can we add a column? How big is the table?
- **Observe:** during any rolling update, old and new Pods run together against one database. Rollback puts old code back on the new schema.
- **Hypothesise:** a rename in one step breaks whichever version isn't expecting it.
- **Fix:** expand/contract in three releases. (1) Add the new column; code writes both and reads old. (2) Backfill; code reads new. (3) Drop the old column once no rollback target needs it. Run migrations as a Job before the rollout (→ [Jobs & CronJobs](./jobs-and-cronjobs.md)).
- **Prevent:** a rule that every schema change must work with the current and previous app versions.

</details>

## Summary

- **Deployment → ReplicaSet → Pods.** One ReplicaSet per template version. Rollback is rescaling an old one.
- **`maxSurge` and `maxUnavailable` set speed vs capacity.** `maxUnavailable: 0` keeps full capacity throughout.
- **Readiness probes make rollouts safe.** Without them, "available" means "started".
- **Blue/green and canary are label tricks.** Two Deployments, one Service, move the selector or the ratio.
- **Only the Pod template triggers a rollout.** Config changes need a restart or a new name.
