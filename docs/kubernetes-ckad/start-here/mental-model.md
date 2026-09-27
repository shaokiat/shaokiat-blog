---
title: "Mental Model: How Kubernetes Thinks"
sidebar_label: Mental Model
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Mental Model: How Kubernetes Thinks

> Docs: [Kubernetes objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/) · [Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) · [Labels and selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)

Read this page first. Every other page in this section is a detail of one idea explained here: the big idea, the object map, five concepts, the six-step chain behind every `kubectl apply`, and how to tell which step broke. Then set up a cluster with [Local Setup](./local-setup.md) and learn the commands in [Command Patterns](./command-patterns.md).

## The big idea

You never tell Kubernetes *what to do*. You tell it *what should exist*, and it works out the steps. A [manifest](./glossary.md#manifest) is a statement of desired state ("3 replicas of nginx:1.27"). It's stored, and [controllers](./glossary.md#controller) compare it with actual state forever, acting whenever the two differ. There's no "run" command that finishes. There's only a gap that keeps being closed.

That's why a deleted [Pod](./glossary.md#pod) comes back, why a failed [node](./glossary.md#node)'s Pods reappear elsewhere, and why an edit to a live [object](./glossary.md#object) disappears on the next apply. None of these are special features. They're all the same loop.

→ See [Figure 1-2: the reconciliation loop](../reference/architecture.md#overview) in Architecture.

## The object map

Most commands act on one of a handful of objects. They connect in only two ways: one object **owns** another, or one object **finds** another by label or name.

<ThemedImage
  alt="Object hierarchy in a namespace: a Deployment owns a ReplicaSet, which owns three Pods, each holding a container. A Service finds the Pods by the label app=web; a ConfigMap or Secret is mounted into them by name. The Pods run on Nodes, which sit outside the namespace"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-mental-model-map-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-mental-model-map-dark.svg'),
  }}
/>

*Figure 0-1: The objects behind a typical app. Amber is what you write, blue is what a controller writes for you, green is what runs, grey is the machines. Solid arrows are ownership, dashed arrows are lookups.*

| Link | Example | Delete the one on the left | If it breaks |
|---|---|---|---|
| **Owns** (solid) | Deployment → ReplicaSet → Pod | Everything it owns goes too | Rare. The controller recreates what's missing. |
| **Finds by label** (dashed) | Service → Pods | The Pods are untouched | Silent. The Service just has no endpoints. |
| **Finds by name** (dashed) | Pod → ConfigMap, Secret | The Pod keeps running, but a new one fails to start | Loud. The new Pod shows `CreateContainerConfigError` (env) or stays `ContainerCreating` (volume). |

What this means at the command line:

| Object | You create it with | Edit it directly? | See it with |
|---|---|---|---|
| Deployment | `kubectl create deployment` / `apply` | Yes. This is the object you change. | `kubectl get deploy` |
| ReplicaSet | The Deployment controller | No. The Deployment overwrites your edit. | `kubectl get rs` |
| Pod | The ReplicaSet controller | No. Delete it and a new one replaces it. | `kubectl get pods -o wide` (shows the node) |
| Service | `kubectl expose` / `apply` | Yes | `kubectl get svc`, `kubectl get endpointslices` |
| ConfigMap / Secret | `kubectl create configmap` / `secret` | Yes. Running Pods don't see env changes until restarted. | `kubectl get cm,secret` |
| Node | The cluster | No | `kubectl get nodes` (no `-n`: cluster-scoped) |

Pod names encode the hierarchy. `web-69c6f74b8b-x2k9p` is Deployment `web`, ReplicaSet hash `69c6f74b8b`, Pod suffix `x2k9p`. `kubectl get all -n <ns>` lists Deployments, ReplicaSets, Pods and Services together, but not ConfigMaps or Secrets.

→ Config wiring in detail: [Config & Secrets](../reference/config-and-secrets.md).

## Five core concepts

| Concept | One sentence | What it explains | Detail |
|---|---|---|---|
| **The [API server](./glossary.md#api-server) is the hub** | Every component reads and writes through it; only it touches [etcd](./glossary.md#etcd). | No component calls another. If the API server is down, nothing new happens, but running apps keep running. | [Components](../reference/architecture.md#components) |
| **[spec vs status](./glossary.md#spec-vs-status)** | You write `spec` (desired), controllers write `status` (actual). | Debugging is comparing the two and asking which controller should have closed the gap. | [Where a change lives](../reference/architecture.md#where-a-change-lives) |
| **Pods are disposable** | The smallest unit, replaced rather than repaired, with a new IP each time. | Why you never edit a Pod, and why nothing should address a Pod IP. | [Pods & Multi-Container](../reference/pods-and-multi-container.md) |
| **Controllers are one pattern** | Each keeps one invariant true, using the same watch-diff-act loop. | Deployments, Jobs and DaemonSets differ in the promise, not the mechanism. | Table below |
| **[Labels](./glossary.md#label) are the only glue** | Objects find each other by label [selector](./glossary.md#selector), never by name or ownership. | A typo in a label silently disconnects things. | [Services & Ingress](../reference/services-and-ingress.md) |

### Controllers: same loop, different promises

| Controller | The invariant it keeps true |
|---|---|
| [Deployment](./glossary.md#deployment) → [ReplicaSet](./glossary.md#replicaset) | "N identical, interchangeable Pods of the current template exist." |
| StatefulSet | "N Pods exist, each with a stable name and its own storage." |
| DaemonSet | "Exactly one Pod runs on every matching node." |
| Job / CronJob | "This many Pods have succeeded." / "A Job is created on this schedule." |

→ To choose between them, see [Choosing a workload resource](../reference/deployments-and-rollouts.md#choosing-a-workload-resource).

### Where labels do the linking

| Selector on | Picks | If the labels don't match |
|---|---|---|
| ReplicaSet (from its Deployment) | The Pods it owns and counts | Rejected at apply: `selector does not match template labels`. Stray Pods that *do* match get adopted and counted. |
| [Service](./glossary.md#service) | The Pods that receive traffic | Empty [EndpointSlice](./glossary.md#endpointslice), "connection refused" |
| NetworkPolicy | The Pods a rule protects or allows | The rule silently applies to nothing |

## Life of a `kubectl apply`

One `kubectl apply` of a 3-replica Deployment sets off six steps. Each is a different component reacting to a change it watched on the API server, then writing its result back. No step calls the next one directly.

<ThemedImage
  alt="Sequence of a kubectl apply: kubectl sends the Deployment to the API server; the Deployment controller watches it and creates a ReplicaSet; the ReplicaSet controller creates three Pods; the scheduler binds each Pod to a node; the kubelet starts the containers and reports Ready; the EndpointSlice controller adds the Pod IPs. Every arrow starts or ends at the API server"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-mental-model-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-mental-model-1-dark.svg'),
  }}
/>

*Figure 0-2: The chain behind one `kubectl apply`. Amber is the API server, the only lifeline every arrow touches. Dashed arrows are watch events, solid arrows are writes. The numbers are the steps below.*

| # | Component | Watches | Writes | Stage |
|---|---|---|---|---|
| 1 | kube-apiserver | Your request | Validated Deployment into etcd | Admission |
| 2 | Deployment controller | New Deployment | A ReplicaSet for this Pod template | Reconcile |
| 3 | ReplicaSet controller | New ReplicaSet | 3 Pod objects (admission checks quota and Pod Security here) | Reconcile |
| 4 | [kube-scheduler](./glossary.md#scheduler) | Pods with no node | A binding: Pod → node | Scheduling |
| 5 | [kubelet](./glossary.md#kubelet) on that node | Pods bound to its node | Pulls the image, starts containers, reports `Running`, then `Ready` | Running |
| 6 | EndpointSlice controller | Pods turning Ready that match a Service | The Pod's IP into the Service's EndpointSlice | Routing |

## Which step broke?

The chain turns every symptom into a question: which step didn't happen? Find the step, then use [Troubleshooting](../reference/troubleshooting.md) for the command and the usual causes.

| Symptom | Step that broke | Component to question | Next |
|---|---|---|---|
| Deployment `0/3`, no Pods at all | 3: Pods rejected at admission | ReplicaSet controller's events | [Troubleshooting](../reference/troubleshooting.md#status--first-command--usual-causes) |
| `Pending` | 4: no node fits | kube-scheduler | [Troubleshooting](../reference/troubleshooting.md#status--first-command--usual-causes) |
| `ImagePullBackOff` | 5: image can't be pulled | kubelet + [container runtime](./glossary.md#container-runtime) | [Troubleshooting](../reference/troubleshooting.md#status--first-command--usual-causes) |
| `CrashLoopBackOff` | 5: container starts, then exits | Your application | [Troubleshooting](../reference/troubleshooting.md#exit-codes) |
| `Running`, but the Service returns nothing | 6: Pod not Ready, or labels don't match | EndpointSlice controller (via readiness and selectors) | [Troubleshooting](../reference/troubleshooting.md#timeout-vs-refused) |

→ [Figure S5-1](../scenarios/troubleshooting-drills.md#architecture) maps each step to a hands-on drill.

## 🧪 Lab

:::tip Lab 0 ★
**Requires:** [Standard lab setup](./local-setup.md#standard-lab-setup) · [Command Patterns](./command-patterns.md) (skim; the first pass only pastes commands) · [How the tiers work](./local-setup.md#lab-tiers).

**See the chain and the glue for yourself.**

**First pass: open 🟢 Guided and paste the commands.** This lab is a demo of the ideas above, not a test. The commands are taught in [Command Patterns](./command-patterns.md). Come back to the Goal tier once you've read it.

**Goal**

1. In [namespace](./glossary.md#namespace) `lab0`, create a Deployment `web` with `nginx:1.27` and 3 replicas.
2. Delete one Pod and watch a replacement appear. Which controller created it?
3. Trace ownership from a Pod up to the Deployment using `kubectl describe`.
4. Expose the Deployment as a Service on port 80 and list its endpoints.
5. Change the Service's selector to `app: wrong`. What happens to the endpoints, and what does a client see?

**Verify**

```bash
kubectl -n lab0 get pods                                         # 3 Running, one younger than the others
kubectl -n lab0 describe pod <pod> | grep "Controlled By"        # ReplicaSet/web-<hash>
kubectl -n lab0 describe rs | grep "Controlled By"               # Deployment/web
kubectl -n lab0 get endpointslices -l kubernetes.io/service-name=web   # 3 IPs, then <unset> after step 5
```

<details>
<summary>🟡 Hints</summary>

1. "Run N copies that heal themselves" in [Command Patterns](./command-patterns.md#run-something). Check the flags with `kubectl create deployment -h`.
2. `kubectl delete pod <name>` in one terminal, `kubectl get pods -w` in another. The new Pod shares the old one's name prefix.
3. `describe` prints a `Controlled By:` line. Follow it from the Pod to its ReplicaSet, then from the ReplicaSet up.
4. "Give Pods one stable name" in [Command Patterns](./command-patterns.md#expose-it). Endpoints live in `endpointslices`, labelled `kubernetes.io/service-name=<svc>`.
5. `kubectl patch service` with a new `spec.selector`. Test from a throwaway busybox Pod with `wget -qO- -T 3 http://web`.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the lab namespace.

   ```bash
   kubectl create namespace lab0
   ```

2. Create a Deployment with 3 replicas of nginx.

   ```bash
   kubectl -n lab0 create deployment web --image=nginx:1.27 --replicas=3
   ```

3. Wait until all 3 Pods are Ready.

   ```bash
   kubectl -n lab0 rollout status deployment/web
   ```

4. Stream Pod changes in the background so you see the replacement appear.

   ```bash
   kubectl -n lab0 get pods -w &
   ```

5. Delete the first Pod; the ReplicaSet controller sees 2 of 3 and creates one (step 3 of the chain).

   ```bash
   kubectl -n lab0 delete "$(kubectl -n lab0 get pods -o name | head -n 1)"
   ```

6. Stop the background watch.

   ```bash
   kill %1
   ```

7. Show which object owns a Pod.

   ```bash
   kubectl -n lab0 describe "$(kubectl -n lab0 get pods -o name | head -n 1)" | grep "Controlled By"
   ```

   ```text
   Controlled By:  ReplicaSet/web-69c6f74b8b
   ```

8. Show which object owns the ReplicaSet.

   ```bash
   kubectl -n lab0 describe rs | grep "Controlled By"
   ```

   ```text
   Controlled By:  Deployment/web
   ```

9. Create a Service that selects the Deployment's Pods by label (step 6).

   ```bash
   kubectl -n lab0 expose deployment web --port=80
   ```

10. List the Pod IPs the Service found.

    ```bash
    kubectl -n lab0 get endpointslices -l kubernetes.io/service-name=web
    ```

    ```text
    web-pz927   IPv4   80   10.244.0.8,10.244.0.5,10.244.0.6
    ```

11. Point the Service at a label no Pod carries.

    ```bash
    kubectl -n lab0 patch service web -p '{"spec":{"selector":{"app":"wrong"}}}'
    ```

12. Confirm the selector changed and the endpoints emptied.

    ```bash
    kubectl -n lab0 describe svc web | grep -E "Selector|Endpoints"
    ```

    ```text
    Selector:   app=wrong
    Endpoints:              <- empty: no Pod carries app=wrong
    ```

13. Call the Service from a throwaway Pod.

    ```bash
    kubectl -n lab0 run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://web
    ```

    ```text
    wget: can't connect to remote host (...): Connection refused
    ```

    The Pods are fine and the Service exists. Only the label link is gone.

14. Run the ✅ Check below, then delete everything the lab created.

    ```bash
    kubectl delete namespace lab0
    ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "3 Pods Ready"             "$(kubectl -n lab0 get deploy web -o jsonpath='{.status.readyReplicas}')" "3"
t "Pod owned by ReplicaSet"  "$(kubectl -n lab0 get pods -l app=web -o jsonpath='{.items[0].metadata.ownerReferences[0].kind}')" "ReplicaSet"
t "RS owned by Deployment"   "$(kubectl -n lab0 get rs -l app=web -o jsonpath='{.items[0].metadata.ownerReferences[0].kind}')" "Deployment"
t "selector now app=wrong"   "$(kubectl -n lab0 get svc web -o jsonpath='{.spec.selector.app}')" "wrong"
t "Service has no endpoints" "$(kubectl -n lab0 get endpointslices -l kubernetes.io/service-name=web -o jsonpath='{range .items[*].endpoints[*]}x{end}')" ""
```
:::

Next: [Lab 1-1](../reference/architecture.md#-lab) names the components behind each step, and [Lab 10-1](../reference/services-and-ingress.md#-lab) adds `targetPort` and Ingress failures.

## The 60-second interview answer

> "Kubernetes is declarative. I tell the API server what should exist, it stores that in etcd, and controllers spend their lives closing the gap between that and reality. So when I apply a Deployment, six things happen, and each one is a different component reacting to a change it watched on the API server. The API server validates and stores the Deployment. The Deployment controller creates a ReplicaSet for that Pod template. The ReplicaSet controller creates the Pods. The scheduler binds each Pod to a node. The kubelet on that node pulls the image, starts the containers and reports Ready. Finally, the EndpointSlice controller adds the Pod's IP to any Service whose selector matches its labels. Nothing calls anything directly: everything goes through the API server, and objects find each other only by labels. That's also how I debug. Pending means step four, ImagePullBackOff and CrashLoopBackOff mean step five, and a Service that returns nothing means step six: readiness or labels."
