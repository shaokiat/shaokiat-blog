---
title: Resources & Scaling
sidebar_label: Resources & Scaling
sidebar_position: 7
---

# Resources & Scaling

:::danger[Core]
Drill until fluent: hands-on rounds test this directly. Phase 3 of the [Learning Path](../start-here/learning-path.md).
:::

> Docs: [Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) · [QoS classes](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/) · [LimitRange](https://kubernetes.io/docs/concepts/policy/limit-range/) · [ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/) · [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

## Overview

Every container can declare **requests** (what it is guaranteed, and what the scheduler reserves on a node) and **limits** (the most it may use). The two do different jobs. Requests decide where a Pod fits. Limits decide what happens when it misbehaves: too much CPU gets throttled, too much memory gets the container killed. Namespaces add guard rails on top: a **LimitRange** sets per-container defaults and bounds, and a **ResourceQuota** caps the namespace total. The **HorizontalPodAutoscaler** then scales replicas on usage measured *as a percentage of requests*, so an app without requests can't autoscale on utilization at all.

## Key concepts

Requests decide whether a Pod *fits* a node. Labels, taints and GPUs decide whether it's *allowed* there: → [Scheduling & Shutdown](./scheduling.md#placing-pods).

### Requests vs limits

| | Requests | Limits |
|---|---|---|
| Used by | Scheduler: sum of requests must fit the node | Kernel (cgroups) on the node, at runtime |
| CPU | Guaranteed share under contention | Hard cap. Excess use is **throttled**, never killed. |
| Memory | Guaranteed amount, used for eviction ranking | Hard cap. Excess use is **OOMKilled** (exit 137). |
| If unset | Defaults to the limit if one is set, else 0 | Unbounded |
| HPA | Utilization % is usage ÷ request | Not used |

Units: CPU in cores (`500m` = half a core); memory in bytes with binary suffixes (`256Mi`). `256M` is decimal and about 5% smaller.

### QoS classes

| Class | Rule | Evicted under node memory pressure |
|---|---|---|
| **Guaranteed** | Every container has CPU and memory requests equal to limits | Last |
| **Burstable** | At least one request or limit set, but not Guaranteed | Middle, heaviest users over their request first |
| **BestEffort** | No requests or limits anywhere in the Pod | First |

### LimitRange vs ResourceQuota

| | LimitRange | ResourceQuota |
|---|---|---|
| Scope | Each container or Pod in the namespace | Namespace total |
| Does | Injects default requests/limits, enforces min/max per container | Caps the sum of requests, limits and object counts |
| Enforced at | Admission, when the Pod is created | Admission, when the Pod is created |
| Failure | Pod rejected: `maximum cpu usage per Container is 1` | Pod rejected: `exceeded quota` |

Once a quota covers `requests.cpu`, every new Pod must declare a CPU request or be rejected. A LimitRange with defaults fixes that without touching every manifest.

### HorizontalPodAutoscaler

> desired replicas = current replicas × (current usage ÷ target usage), rounded up

| Setting | Default | Effect |
|---|---|---|
| `minReplicas` / `maxReplicas` | 1 / (required) | Hard bounds |
| Target | (required) | `Utilization` (% of request), `AverageValue` (absolute), or custom/external metrics |
| Tolerance | 10% | No change while within 10% of the target |
| Scale-down stabilization | 300 s | Uses the highest recommendation of the last 5 min. Prevents flapping. |
| Scale-up stabilization | 0 s | Scales up immediately |

HPA needs metrics-server (or a custom metrics adapter). It scales the Deployment's `replicas` field, so remove `replicas` from the Deployment manifest you apply, or each apply resets the count.

## kubectl essentials

Set and inspect resources:

```bash
kubectl set resources deployment web --requests=cpu=100m,memory=128Mi --limits=memory=256Mi
kubectl top pods --sort-by=cpu                          # needs metrics-server
kubectl top pods --containers
kubectl top nodes
kubectl describe node <node> | grep -A8 "Allocated resources"
kubectl get pod <pod> -o jsonpath='{.status.qosClass}{"\n"}'
```

Namespace guard rails and autoscaling:

```bash
kubectl create quota team-a --hard=requests.cpu=2,requests.memory=4Gi,limits.memory=8Gi,pods=20
kubectl describe quota                                  # used vs hard
kubectl describe limitrange
kubectl autoscale deployment web --min=2 --max=10 --cpu-percent=50   # kubectl 1.34+: --cpu=50% (old flag warns, still works)
kubectl get hpa -w
kubectl describe hpa web                                # events explain each scaling decision
```

A container with requests and a memory limit:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sized
spec:
  containers:
  - name: app
    image: nginx:1.27
    resources:
      requests: {cpu: 250m, memory: 128Mi}
      limits: {memory: 256Mi}              # no CPU limit: avoids throttling, see Q4
```

Namespace defaults and caps:

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: defaults
spec:
  limits:
  - type: Container
    defaultRequest: {cpu: 100m, memory: 128Mi}
    default: {memory: 256Mi}               # default *limit*
    max: {memory: 2Gi}                     # a CPU max here would also inject a CPU limit
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.memory: 16Gi
    pods: "30"
    persistentvolumeclaims: "10"
```

An HPA on CPU utilization, with slower scale-down:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - {type: Pods, value: 1, periodSeconds: 60}
```

## 🧪 Lab

:::tip Lab 3-2 ★★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) + metrics-server from [Cluster add-ons](../start-here/local-setup.md#cluster-add-ons) · [Services](./services-and-ingress.md#service-types) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Quota, defaults, then autoscaling under load.**

**Goal**

1. In namespace `lab3-2`, create the LimitRange and ResourceQuota above.
2. Create Deployment `web` (`registry.k8s.io/hpa-example`, port 80) without any resources. Check which QoS class and requests its Pod got.
3. Expose it on port 80, then create an HPA targeting 50% CPU, 1–5 replicas.
4. Generate load and watch the HPA scale out. Stop the load and note how long scale-in takes.

**Verify**

```bash
kubectl -n lab3-2 get pod -l app=web -o jsonpath='{.items[0].spec.containers[0].resources}{"\n"}'  # injected defaults
kubectl -n lab3-2 describe quota team-quota
kubectl -n lab3-2 get hpa web                     # TARGETS shows a real %, not <unknown>
```

<details>
<summary>🟡 Hints</summary>

1. No generator for LimitRange. Save both objects above in one file, separated by `---`, and apply it.
2. The QoS class is in the Pod's `.status.qosClass`. Resources it didn't ask for came from the LimitRange.
3. "Autoscale" in [Command Patterns](../start-here/command-patterns.md#configure-it).
4. A busybox loop calling `wget` against the Service makes load. Watch with `kubectl get hpa -w`.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the lab namespace.

   ```bash
   kubectl create namespace lab3-2
   ```

2. Create the LimitRange and ResourceQuota above, saved together as `limits.yaml`.

   ```bash
   kubectl -n lab3-2 apply -f limits.yaml
   ```

3. Create the CPU-heavy app with no resources set.

   ```bash
   kubectl -n lab3-2 create deployment web --image=registry.k8s.io/hpa-example --port=80
   ```

4. Read the Pod's QoS class: Burstable, because the LimitRange injected requests.

   ```bash
   kubectl -n lab3-2 get pod -l app=web -o jsonpath='{.items[0].status.qosClass}{"\n"}'
   ```

5. Put a Service in front of it.

   ```bash
   kubectl -n lab3-2 expose deployment web --port=80
   ```

6. Autoscale on 50% of the CPU request, between 1 and 5 replicas.

   ```bash
   kubectl -n lab3-2 autoscale deployment web --min=1 --max=5 --cpu-percent=50
   ```

7. Generate load from a second terminal; Ctrl-C to stop.

   ```bash
   kubectl -n lab3-2 run load --rm -it --image=busybox:1.36 --restart=Never -- \
     sh -c 'while true; do wget -q -O- http://web; done'
   ```

8. Watch utilisation climb above 50% and replicas grow within about a minute.

   ```bash
   kubectl -n lab3-2 get hpa web -w
   ```

   After stopping the load, scale-in waits for the 5-minute stabilization window.

9. Run the ✅ Check below, then delete everything the lab created.

   ```bash
   kubectl delete namespace lab3-2
   ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "LimitRange injected a request" "$(kubectl -n lab3-2 get pod -l app=web -o jsonpath='{.items[0].spec.containers[0].resources.requests.cpu}')" "100m"
t "QoS Burstable"                 "$(kubectl -n lab3-2 get pod -l app=web -o jsonpath='{.items[0].status.qosClass}')" "Burstable"
t "quota counts the Pods"         "$([ -n "$(kubectl -n lab3-2 get quota team-quota -o jsonpath='{.status.used.pods}')" ] && echo yes)" "yes"
t "HPA targets 50%"               "$(kubectl -n lab3-2 get hpa web -o jsonpath='{.spec.metrics[0].resource.target.averageUtilization}')" "50"
t "HPA sees CPU"                  "$(kubectl -n lab3-2 get hpa web -o jsonpath='{.status.currentMetrics[0].resource.current.averageUtilization}' | grep -c '^[0-9]')" "1"
t "HPA scaled out under load"     "$(kubectl -n lab3-2 get events --field-selector reason=SuccessfulRescale -o name | head -n 1 | grep -c .)" "1"
```
:::

## Gotchas

- **HPA shows `<unknown>`.** No metrics-server, or the target Pods have no CPU request, so utilization can't be computed.
- **CPU limits throttle even when the node is idle.** Latency rises while CPU usage looks modest. Many teams set CPU requests but no CPU limits.
- **Memory request below limit is overcommit.** Nodes can promise more than they have. Under pressure, Pods using more than their request are evicted first.
- **Quota rejects Pods, not Deployments.** The Deployment looks fine; its ReplicaSet can't create Pods. Look at `kubectl describe rs` events.
- **`M` vs `Mi`.** `128M` is 128,000,000 bytes; `128Mi` is 134,217,728.
- **HPA and VPA on the same metric fight.** Don't let both act on CPU for one workload.
- **JVMs and other runtimes size heaps from the node.** Old runtimes ignore cgroup limits and get OOMKilled. Set heap from the limit.

## Scenario questions

**Q1 ★ A Pod is `Pending` with `0/3 nodes are available: 3 Insufficient cpu`. The nodes are at 20% CPU usage. How?**

<details>
<summary>Model answer</summary>

- **Clarify:** how big is the request? Is this a new workload?
- **Observe:** `kubectl describe node` → "Allocated resources" shows requests near 100% even though `kubectl top nodes` shows low usage.
- **Hypothesise:** the scheduler places by *requests*, not usage. Other Pods reserved the capacity with generous requests they don't use.
- **Fix:** right-size requests across the cluster using observed usage, or add nodes (cluster autoscaler).
- **Prevent:** review requests against `kubectl top` or VPA recommendations regularly. Over-requesting is the most common source of wasted spend.

</details>

**Q2 ★★ A container restarts with `OOMKilled`. What do you do?**

<details>
<summary>Model answer</summary>

- **Clarify:** since when? After a traffic change or a new release?
- **Observe:** `kubectl describe pod` → `Last State: Terminated, Reason: OOMKilled, Exit Code: 137`. `kubectl top pod --containers` shows usage trending toward the limit.
- **Hypothesise:** the limit is too low for real load, a memory leak, or a runtime sizing its heap from the node rather than the limit.
- **Fix:** short term, raise the memory limit. Then check whether usage grows without bound (leak) or plateaus (limit too low).
- **Prevent:** set memory request = limit for critical services (predictable, Guaranteed QoS) and alert on usage above 80% of limit.

</details>

**Q3 ★★ `kubectl get hpa` shows `<unknown>/50%` and never scales. Why?**

<details>
<summary>Model answer</summary>

- **Clarify:** does `kubectl top pods` work in that namespace?
- **Observe:** `kubectl describe hpa` shows `failed to get cpu utilization: missing request for cpu`, or a metrics API error.
- **Hypothesise:** either metrics-server is missing or unhealthy, or the Pods have no CPU request, so a percentage can't be computed.
- **Fix:** add CPU requests to the Pod template (or a LimitRange default). Install or fix metrics-server.
- **Prevent:** a policy check that rejects HPAs targeting workloads without requests.

</details>

**Q4 ★★★ p99 latency spikes, but CPU usage never passes 40% of the limit. What's going on?**

<details>
<summary>Model answer</summary>

- **Clarify:** is there a CPU limit? Is the app multi-threaded?
- **Observe:** the container's `cpu.stat` shows `nr_throttled` and `throttled_usec` climbing (or the `container_cpu_cfs_throttled_periods_total` metric).
- **Hypothesise:** CPU limits are enforced per 100 ms period. A multi-threaded app can burn its whole quota in the first 20 ms of a period, then wait 80 ms. Average usage looks low while requests stall.
- **Fix:** remove the CPU limit and keep an accurate CPU request, or raise the limit well above peak.
- **Prevent:** the trade-off: without CPU limits a noisy neighbour can use idle CPU, but requests still guarantee everyone their share under contention. Most platforms accept that for latency-sensitive services.

</details>

## Summary

- **Requests place Pods; limits police them.** Scheduling uses requests, never usage.
- **CPU over limit is throttled; memory over limit is killed.** Exit 137 means OOMKilled.
- **QoS class sets eviction order.** Requests = limits for everything makes a Pod Guaranteed.
- **LimitRange defaults each container; ResourceQuota caps the namespace.** Quota rejections show on the ReplicaSet.
- **HPA scales on usage as a percentage of requests.** No request, no utilization, no autoscaling.

---

**Next in path →** [Scheduling & Shutdown](./scheduling.md)
