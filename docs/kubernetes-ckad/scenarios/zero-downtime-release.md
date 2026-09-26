---
title: Zero-Downtime Release
sidebar_label: Zero-Downtime Release
sidebar_position: 3
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Scenario: Zero-Downtime Release

> Builds on: [Deployments & Rollouts](../reference/deployments-and-rollouts.md) · [Services & Ingress](../reference/services-and-ingress.md) · [Probes & Observability](../reference/probes-and-observability.md)

## Situation

A checkout API runs 6 replicas behind an Ingress. Every deploy produces a short burst of 502s, and last quarter a release with a bad config took checkout down for 20 minutes because nobody noticed until customers complained. The team wants deploys that users never notice, and a way to expose risky releases to a small share of traffic first.

## Requirements

| Requirement | Failure it prevents |
|---|---|
| No errors during a normal rollout | 502 bursts while Pods start and stop |
| Capacity never drops below 6 during a release | Latency spikes when fewer Pods take full traffic |
| Instant, complete rollback for risky releases | A 20-minute outage while someone works out what changed |
| Expose risky changes to around 10% of users first | A bad release reaching everyone at once |
| No new tooling required for the basic path | Blocking the fix on a service-mesh project |

## Architecture

<ThemedImage
  alt="Left: blue/green, where Service web selects version=green so all traffic goes to web-green while web-blue stays idle for rollback. Right: canary, where Service web selects app=web so traffic splits by replica count between web-stable with 9 replicas and web-canary with 1"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-zero-downtime-release-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-zero-downtime-release-1-dark.svg'),
  }}
/>

*Figure S3-1: Blue/green and canary with core primitives. Amber is the Service selector, the one field you change. Green is the new version, grey the idle old version, blue the stable version still serving.*

## Kubernetes resources used

| Resource | Role here | Reference |
|---|---|---|
| Deployment rolling update | The default path for every release | [Deployments & Rollouts](../reference/deployments-and-rollouts.md#rollout-strategy) |
| Readiness probe + `preStop` | No traffic to Pods that aren't ready or are shutting down | [Probes & Observability](../reference/probes-and-observability.md) |
| Service label selector | The switch for blue/green; the pool for canary | [Services & Ingress](../reference/services-and-ingress.md) |
| PodDisruptionBudget | Keeps capacity during node maintenance, not just deploys | [Architecture](../reference/architecture.md) |
| Two Deployments | Blue/green and canary both need both versions running at once | [Deployments & Rollouts](../reference/deployments-and-rollouts.md#release-strategies-with-core-primitives) |

## Walkthrough

### 1. Fix the rolling update first

The 502s come from shutdown, not startup. When a Pod is deleted, the kubelet sends SIGTERM while kube-proxy and the Ingress controller are still removing the Pod from their endpoints. For a second or two, requests still arrive at a process that has stopped accepting them.

| Setting | Value | What it fixes |
|---|---|---|
| `maxUnavailable` | 0 | Capacity never drops below 6 |
| `maxSurge` | 1 (or 25%) | Speed vs extra cost during the rollout |
| `readinessProbe` | Real `/ready` endpoint | New Pods get traffic only when they can serve |
| `preStop` sleep | 10 s | Pod keeps serving while endpoints update everywhere |
| App SIGTERM handling | Finish in-flight requests, then exit | No connections dropped mid-request |
| `terminationGracePeriodSeconds` | 45 | Longer than preStop + drain, so nothing is SIGKILLed |
| `minReadySeconds` | 10 | A Pod that crashes right after becoming Ready doesn't count |

With these, the rolling update is the everyday path. The rest of this page is for releases risky enough to need more.

### 2. Blue/green for instant, complete rollback

Run both versions at full size. The Service selects one by a `version` label. Cutting over is one patch; rolling back is the same patch in reverse, with no Pods starting.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-green
spec:
  replicas: 6
  selector:
    matchLabels: {app: web, version: green}
  template:
    metadata:
      labels: {app: web, version: green}
    spec:
      containers:
      - name: web
        image: nginx:1.28
        ports: [{name: http, containerPort: 80}]
        readinessProbe:
          httpGet: {path: /, port: http}
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector: {app: web, version: blue}      # still on blue
  ports:
  - {port: 80, targetPort: http}
```

```bash
kubectl rollout status deployment/web-green                                   # all 6 Ready first
kubectl patch service web -p '{"spec":{"selector":{"app":"web","version":"green"}}}'
# rollback: the same patch with "blue"
kubectl scale deployment web-blue --replicas=0                                # only after green has proven itself
```

### 3. Canary for gradual exposure

Both Deployments carry `app: web`, and the Service selects only `app: web`. Traffic splits roughly by replica count: 9 stable + 1 canary ≈ 10% to the canary.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-canary
spec:
  replicas: 1
  selector:
    matchLabels: {app: web, track: canary}
  template:
    metadata:
      labels: {app: web, track: canary}   # app=web puts it behind the shared Service
    spec:
      containers:
      - name: web
        image: nginx:1.28
        ports: [{name: http, containerPort: 80}]
        readinessProbe:
          httpGet: {path: /, port: http}
```

Promote by updating the stable Deployment's image and scaling the canary to 0. Abort by scaling the canary to 0.

| Canary method | Precision | Needs |
|---|---|---|
| Replica ratio (this page) | Coarse: 1 of 10 = 10%, 1 of 3 = 33% | Nothing extra |
| Ingress controller canary annotations | Percent or header-based | Controller support |
| Gateway API `HTTPRoute` weights | Exact percentages, standard API | A Gateway controller |
| Service mesh / Argo Rollouts | Weights plus automated metric analysis | Extra platform components |

### 4. Decide per release

| Release | Strategy | Why |
|---|---|---|
| Routine code change | Rolling update | Cheap, safe with the fixes in step 1 |
| Big bang change, versions can't coexist | Blue/green | Instant, complete switch and rollback |
| Risky change, versions can coexist | Canary | Limits blast radius while you watch metrics |
| Database schema change | Expand/contract across releases | → [Deployments & Rollouts Q4](../reference/deployments-and-rollouts.md#scenario-questions) |

## How I'd explain this in an interview

> "First I'd separate the two problems. The 502s on every deploy are a shutdown race: SIGTERM arrives while endpoints are still being removed. So the fix is a preStop sleep, proper SIGTERM handling in the app, and a grace period longer than both. Add maxUnavailable zero and a real readiness probe, and ordinary rolling updates become invisible. That covers most releases for free. For risky ones I'd use core primitives before adding tools. Blue/green is two Deployments and a Service selector switch: instant cut-over, instant rollback, at the cost of double capacity. Canary is two Deployments behind one selector, so traffic splits by replica count. It's cheap but coarse, and if we need exact percentages or automatic analysis, that's when Gateway API weights or Argo Rollouts earn their place. The last incident was really a detection problem, so whichever strategy we use, promotion has to be gated on error-rate and latency metrics, not on someone watching."

## Follow-up questions

**★★ Canary traffic by replica count is uneven for long-lived connections. Why?**

<details>
<summary>Model answer</summary>

- **Clarify:** HTTP/1.1 keep-alive, HTTP/2 or gRPC clients?
- **Observe:** kube-proxy balances *connections*, not requests. A client that holds one connection sends all its requests to one Pod.
- **Hypothesise:** a few heavy clients pinned to stable Pods make the canary's real share differ from 10%.
- **Fix:** balance at L7: an Ingress, Gateway or mesh that spreads requests across Pods, or client-side load balancing for gRPC.
- **Prevent:** measure the canary's actual share of requests, not its replica share.

</details>

**★★ The canary has a higher error rate. How do you roll back, and what did users see?**

<details>
<summary>Model answer</summary>

- **Clarify:** how long was it live, and what share of traffic did it get?
- **Observe:** only requests routed to the canary failed, roughly 10% of traffic for that window.
- **Hypothesise:** blast radius = traffic share × time live. That's the point of a canary.
- **Fix:** `kubectl scale deployment web-canary --replicas=0`. The stable Deployment was never touched, so nothing else changes.
- **Prevent:** automate the abort: an analysis step (Argo Rollouts, Flagger) that compares canary and stable metrics and scales the canary down without a human.

</details>

**★★★ Blue/green doubles cost. How would you reduce it?**

<details>
<summary>Model answer</summary>

- **Clarify:** how long must the old version stay ready for rollback?
- **Observe:** the cost is the idle color, and only during the release window.
- **Hypothesise:** you pay for instant rollback. Shorten the window or shrink the idle side.
- **Fix:** scale green up only for the release, keep blue for a fixed bake time (say 30 minutes), then scale it to 0. Or keep blue at reduced size and let the HPA scale it back up if you switch back, trading rollback speed for cost.
- **Prevent:** reserve blue/green for releases that need it; canary or rolling costs almost nothing extra.

</details>
