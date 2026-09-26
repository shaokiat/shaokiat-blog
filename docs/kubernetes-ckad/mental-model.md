---
title: "Mental Model: How Kubernetes Thinks"
sidebar_label: "Start Here: Mental Model"
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Mental Model: How Kubernetes Thinks

> Docs: [Kubernetes objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/) · [Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) · [Labels and selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)

Read this page first. Every other page in this section is a detail of one idea explained here: the big idea, five concepts, the six-step chain behind every `kubectl apply`, and how to tell which step broke.

## The big idea

You never tell Kubernetes *what to do*. You tell it *what should exist*, and it works out the steps. A manifest is a statement of desired state ("3 replicas of nginx:1.27"). It's stored, and controllers compare it with actual state forever, acting whenever the two differ. There's no "run" command that finishes. There's only a gap that keeps being closed.

That's why a deleted Pod comes back, why a failed node's Pods reappear elsewhere, and why an edit to a live object disappears on the next apply. None of these are special features. They're all the same loop.

→ See [Figure 1-2: the reconciliation loop](./reference/architecture.md#overview) in Architecture.

## Five core concepts

| Concept | One sentence | What it explains | Detail |
|---|---|---|---|
| **The API server is the hub** | Every component reads and writes through it; only it touches etcd. | No component calls another. If the API server is down, nothing new happens, but running apps keep running. | [Components](./reference/architecture.md#components) |
| **spec vs status** | You write `spec` (desired), controllers write `status` (actual). | Debugging is comparing the two and asking which controller should have closed the gap. | [Where a change lives](./reference/architecture.md#where-a-change-lives) |
| **Pods are disposable** | The smallest unit, replaced rather than repaired, with a new IP each time. | Why you never edit a Pod, and why nothing should address a Pod IP. | [Pods & Multi-Container](./reference/pods-and-multi-container.md) |
| **Controllers are one pattern** | Each keeps one invariant true, using the same watch-diff-act loop. | Deployments, Jobs and DaemonSets differ in the promise, not the mechanism. | Table below |
| **Labels are the only glue** | Objects find each other by label selector, never by name or ownership. | A typo in a label silently disconnects things. | [Services & Ingress](./reference/services-and-ingress.md) |

### Controllers: same loop, different promises

| Controller | The invariant it keeps true |
|---|---|
| Deployment → ReplicaSet | "N identical, interchangeable Pods of the current template exist." |
| StatefulSet | "N Pods exist, each with a stable name and its own storage." |
| DaemonSet | "Exactly one Pod runs on every matching node." |
| Job / CronJob | "This many Pods have succeeded." / "A Job is created on this schedule." |

→ To choose between them, see [Choosing a workload resource](./reference/deployments-and-rollouts.md#choosing-a-workload-resource).

### Where labels do the linking

| Selector on | Picks | If the labels don't match |
|---|---|---|
| ReplicaSet (from its Deployment) | The Pods it owns and counts | Rejected at apply: `selector does not match template labels`. Stray Pods that *do* match get adopted and counted. |
| Service | The Pods that receive traffic | Empty EndpointSlice, "connection refused" |
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

*Figure 0-1: The chain behind one `kubectl apply`. Amber is the API server, the only lifeline every arrow touches. Dashed arrows are watch events, solid arrows are writes. The numbers are the steps below.*

| # | Component | Watches | Writes | Stage |
|---|---|---|---|---|
| 1 | kube-apiserver | Your request | Validated Deployment into etcd | Admission |
| 2 | Deployment controller | New Deployment | A ReplicaSet for this Pod template | Reconcile |
| 3 | ReplicaSet controller | New ReplicaSet | 3 Pod objects (admission checks quota and Pod Security here) | Reconcile |
| 4 | kube-scheduler | Pods with no node | A binding: Pod → node | Scheduling |
| 5 | kubelet on that node | Pods bound to its node | Pulls the image, starts containers, reports `Running`, then `Ready` | Running |
| 6 | EndpointSlice controller | Pods turning Ready that match a Service | The Pod's IP into the Service's EndpointSlice | Routing |

## Which step broke?

The chain turns every symptom into a question: which step didn't happen? Find the step, then use [Troubleshooting](./reference/troubleshooting.md) for the command and the usual causes.

| Symptom | Step that broke | Component to question | Next |
|---|---|---|---|
| Deployment `0/3`, no Pods at all | 3: Pods rejected at admission | ReplicaSet controller's events | [Troubleshooting](./reference/troubleshooting.md#status--first-command--usual-causes) |
| `Pending` | 4: no node fits | kube-scheduler | [Troubleshooting](./reference/troubleshooting.md#status--first-command--usual-causes) |
| `ImagePullBackOff` | 5: image can't be pulled | kubelet + container runtime | [Troubleshooting](./reference/troubleshooting.md#status--first-command--usual-causes) |
| `CrashLoopBackOff` | 5: container starts, then exits | Your application | [Troubleshooting](./reference/troubleshooting.md#exit-codes) |
| `Running`, but the Service returns nothing | 6: Pod not Ready, or labels don't match | EndpointSlice controller (via readiness and selectors) | [Troubleshooting](./reference/troubleshooting.md#timeout-vs-refused) |

→ [Figure S5-1](./scenarios/troubleshooting-drills.md#architecture) maps each step to a hands-on drill.

## 🧪 Lab

:::tip Lab 0 ★
**See the chain and the glue for yourself.**

Needs a local cluster: `kind create cluster` (or `minikube start`).

1. In namespace `lab0`, create a Deployment `web` with `nginx:1.27` and 3 replicas.
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
<summary>Solution</summary>

```bash
kubectl create namespace lab0
kubectl -n lab0 create deployment web --image=nginx:1.27 --replicas=3
kubectl -n lab0 rollout status deployment/web

# 2. self-healing: the ReplicaSet controller sees 2 of 3 and creates one (step 3 of the chain)
kubectl -n lab0 get pods -w &
kubectl -n lab0 delete "$(kubectl -n lab0 get pods -o name | head -n 1)"
kill %1

# 3. ownership: Pod -> ReplicaSet -> Deployment
kubectl -n lab0 describe "$(kubectl -n lab0 get pods -o name | head -n 1)" | grep "Controlled By"
#   Controlled By:  ReplicaSet/web-69c6f74b8b
kubectl -n lab0 describe rs | grep "Controlled By"
#   Controlled By:  Deployment/web

# 4. the Service finds Pods by label (step 6)
kubectl -n lab0 expose deployment web --port=80
kubectl -n lab0 get endpointslices -l kubernetes.io/service-name=web
#   web-pz927   IPv4   80   10.244.0.8,10.244.0.5,10.244.0.6

# 5. break the glue
kubectl -n lab0 patch service web -p '{"spec":{"selector":{"app":"wrong"}}}'
kubectl -n lab0 describe svc web | grep -E "Selector|Endpoints"
#   Selector:   app=wrong
#   Endpoints:              <- empty: no Pod carries app=wrong
kubectl -n lab0 run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://web
#   wget: can't connect to remote host (...): Connection refused
# The Pods are fine and the Service exists. Only the label link is gone.

kubectl delete namespace lab0
```

</details>
:::

Next: [Lab 1-1](./reference/architecture.md#-lab) names the components behind each step, and [Lab 10-1](./reference/services-and-ingress.md#-lab) adds `targetPort` and Ingress failures.

## The 60-second interview answer

> "Kubernetes is declarative. I tell the API server what should exist, it stores that in etcd, and controllers spend their lives closing the gap between that and reality. So when I apply a Deployment, six things happen, and each one is a different component reacting to a change it watched on the API server. The API server validates and stores the Deployment. The Deployment controller creates a ReplicaSet for that Pod template. The ReplicaSet controller creates the Pods. The scheduler binds each Pod to a node. The kubelet on that node pulls the image, starts the containers and reports Ready. Finally, the EndpointSlice controller adds the Pod's IP to any Service whose selector matches its labels. Nothing calls anything directly: everything goes through the API server, and objects find each other only by labels. That's also how I debug. Pending means step four, ImagePullBackOff and CrashLoopBackOff mean step five, and a Service that returns nothing means step six: readiness or labels."
