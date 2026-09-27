---
title: Mock Interview
sidebar_label: Mock Interview
sidebar_position: 7
---

# Scenario: Mock Interview

> Builds on: [Troubleshooting](../reference/troubleshooting.md) · [Deployments & Rollouts](../reference/deployments-and-rollouts.md) · [Probes & Observability](../reference/probes-and-observability.md) · [Network Policy](../reference/network-policy.md) · [Capstone](./capstone-deploy-an-app.md)

**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) (plain kind). Tasks 1–4 each use their own namespace.

## Situation

Four tasks, 50 minutes, the way a hands-on round runs: a short prompt, a clock, and someone watching how you work. Nothing on this page hints at the answer until you open a collapsed block. Run each setup script, start a timer, and talk out loud as if the interviewer were listening. Only open **Model solution** after the success check passes or the time runs out.

## Requirements

What the interviewer scores on every task:

| Scored | Looks like | Failure it reveals |
|---|---|---|
| Clarifies the goal | Asks what "working" means before typing | Fixing the wrong thing fast |
| Observes before acting | `get`, `describe`, events, then a hypothesis | Restarting Pods to "see what happens" |
| Fixes at the owner | Deployment, Secret, Service; never a Pod | A fix the controller undoes |
| Proves it | Runs the success check and reads the result aloud | "It should work now" |
| Names a prevention | One lasting control and its cost | Treating the incident as done at the fix |

## How to run it

| Task | Prompt | Time | Namespace |
|---|---|---|---|
| [1](#task-1-this-namespaces-app-is-down-fix-it) | "This namespace's app is down. Fix it." | 15 min | `mock1` |
| [2](#task-2-deploy-this-image-with-3-replicas-health-checks-and-resource-limits-and-expose-it) | "Deploy this image with 3 replicas, health checks and resource limits, and expose it." | 15 min | `mock2` |
| [3](#task-3-ship-a-new-version-with-zero-downtime-then-roll-back) | "Ship a new version with zero downtime, then roll back." | 10 min | `mock3` |
| [4](#task-4-only-the-frontend-may-talk-to-the-api-prove-it) | "Only the frontend may talk to the API. Prove it." | 10 min | `mock4` |

Every success check prints one `PASS` or `FAIL` line per requirement. A network check can fail in the first second or two after a Service or Pod changes, while kube-proxy catches up: rerun it once before debugging. Delete each namespace when you're done with it.

## Walkthrough

### Task 1: "This namespace's app is down. Fix it."

**Time:** 15 minutes. **Done when:** `http://shop` answers with the nginx welcome page from inside the namespace.

**Setup**

```bash
kubectl create namespace mock1
kubectl -n mock1 apply -f - <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: shop-db
stringData:
  username: shop
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shop
spec:
  replicas: 2
  selector:
    matchLabels: {app: shop}
  template:
    metadata:
      labels: {app: shop}
    spec:
      containers:
      - name: web
        image: nginx:1.27-alpnie
        ports: [{containerPort: 80}]
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef: {name: shop-db, key: password}
---
apiVersion: v1
kind: Service
metadata:
  name: shop
spec:
  selector: {app: shop}
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: v1
kind: Pod
metadata:
  name: c
spec:
  containers:
  - name: c
    image: busybox:1.36
    command: ["sleep", "3600"]
EOF
```

Don't read the manifest. In the interview you'd only see the namespace.

**✅ Success check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "2 Pods Ready"      "$(kubectl -n mock1 get deploy shop -o jsonpath='{.status.readyReplicas}')" "2"
t "shop answers"      "$(kubectl -n mock1 exec c -- wget -qO- -T 3 http://shop | grep -o '<title>.*</title>')" "<title>Welcome to nginx!</title>"
```

<details>
<summary>🗣 Say out loud</summary>

- "First I'll define done: the Service answers from inside the namespace."
- "STATUS tells me the stage. I'll fix stages in order, because a later stage can't be seen until the earlier one passes."
- After each fix: "Same command again, to confirm, and to see what the next failure is."
- At the end: "Three separate faults. What would have caught each one before production?"

</details>

<details>
<summary>Model solution</summary>

1. **Overview.** `kubectl -n mock1 get pods` → both `shop` Pods `ImagePullBackOff`. Image pull is the kubelet's step 5.

   ```bash
   kubectl -n mock1 get events --field-selector type=Warning -o custom-columns=REASON:.reason,MESSAGE:.message
   ```

   ```text
   Failed   Failed to pull image "nginx:1.27-alpnie": rpc error: code = NotFound desc = ...
            docker.io/library/nginx:1.27-alpnie: not found
   ```

   `NotFound` is a tag typo, not credentials. Fix it on the Deployment:

   ```bash
   kubectl -n mock1 set image deployment/shop web=nginx:1.27-alpine
   ```

2. **Next status.** The new Pod shows `CreateContainerConfigError`. `describe` names the cause:

   ```text
   Error: couldn't find key password in Secret mock1/shop-db
   ```

   `kubectl -n mock1 get secret shop-db -o jsonpath='{.data}'` shows only `username`. The app needs the password, so the Secret is what's incomplete:

   ```bash
   kubectl -n mock1 patch secret shop-db -p '{"stringData":{"password":"s3cr3t"}}'
   kubectl -n mock1 rollout status deployment/shop
   ```

   The Pod starts on its own once the key exists; no restart needed.

3. **Pods are Ready, the Service still refuses.**

   ```bash
   kubectl -n mock1 exec c -- wget -qO- -T 3 http://shop          # Connection refused
   kubectl -n mock1 describe svc shop | grep -E "TargetPort|Endpoints"
   ```

   ```text
   TargetPort:               8080/TCP
   Endpoints:                10.244.0.76:8080,10.244.0.77:8080
   ```

   Endpoints are listed, so selector and readiness are fine. The Pods refuse on 8080 because nginx listens on 80:

   ```bash
   kubectl -n mock1 patch svc shop --type=json -p '[{"op":"replace","path":"/spec/ports/0/targetPort","value":80}]'
   ```

   Give kube-proxy a second, then run the success check.

**Prevent:** CI that resolves every image tag before merge, config and workload shipped in one release so a key can't be missing, and named ports (`targetPort: http`).

**Common mistakes**

| Mistake | Why it costs you |
|---|---|
| Deleting the Pods after fixing the tag | Nothing changes. The Deployment's new ReplicaSet already replaces them. |
| `kubectl edit pod` to fix the image | The ReplicaSet's template still has the typo. New Pods come back broken. |
| Removing the `DB_PASSWORD` env var | The Pod starts, and the app then fails at runtime without its credential |
| Declaring victory at `2/2 Running` | The Service is still broken. Test the thing the user uses. |

</details>

### Task 2: "Deploy this image with 3 replicas, health checks and resource limits, and expose it."

**Time:** 15 minutes. **The image:** `registry.k8s.io/e2e-test-images/agnhost:2.53`. Started with args `netexec --http-port=8080`, it serves HTTP on 8080, with `/healthz`, `/readyz` and `/hostname`. **Done when:** a Pod in `mock2` can call `http://api/hostname`.

**Setup**

```bash
kubectl create namespace mock2
kubectl -n mock2 run c --image=busybox:1.36 --restart=Never -- sleep 3600
```

**✅ Success check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
d="kubectl -n mock2 get deploy api -o jsonpath"
t "3 Pods Ready"        "$($d='{.status.readyReplicas}')" "3"
t "readiness probe"     "$([ -n "$($d='{..readinessProbe}')" ] && echo set)" "set"
t "liveness probe"      "$([ -n "$($d='{..livenessProbe}')" ] && echo set)" "set"
t "memory limit"        "$([ -n "$($d='{..resources.limits.memory}')" ] && echo set)" "set"
t "CPU request"         "$([ -n "$($d='{..resources.requests.cpu}')" ] && echo set)" "set"
t "3 Ready endpoints"   "$(kubectl -n mock2 get endpointslices -l kubernetes.io/service-name=api -o jsonpath='{range .items[*].endpoints[*]}{.conditions.ready}{" "}{end}')" "true true true "
t "Service answers"     "$(kubectl -n mock2 exec c -- wget -qO- -T 3 http://api/hostname | cut -c1-4)" "api-"
```

<details>
<summary>🗣 Say out loud</summary>

- "I'll generate the skeleton rather than type it, then add what the generator can't set."
- Why each probe points where it does, and what would happen if they were swapped.
- Why each resource number, and whether you'd set a CPU limit.
- "I'll prove it through the Service, not by looking at `get pods`."

</details>

<details>
<summary>Model solution</summary>

Generate, then edit: `kubectl -n mock2 create deployment api --image=registry.k8s.io/e2e-test-images/agnhost:2.53 --replicas=3 --port=8080 --dry-run=client -o yaml > api.yaml`. Add args, probes and resources, and append the Service:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: mock2
spec:
  replicas: 3
  selector:
    matchLabels: {app: api}
  template:
    metadata:
      labels: {app: api}
    spec:
      containers:
      - name: api
        image: registry.k8s.io/e2e-test-images/agnhost:2.53
        args: ["netexec", "--http-port=8080"]
        ports: [{name: http, containerPort: 8080}]
        resources:
          requests: {cpu: 100m, memory: 64Mi}
          limits: {memory: 128Mi}
        readinessProbe:
          httpGet: {path: /readyz, port: http}
          periodSeconds: 5
        livenessProbe:
          httpGet: {path: /healthz, port: http}
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: mock2
spec:
  selector: {app: api}
  ports:
  - {port: 80, targetPort: http}
```

```bash
kubectl apply -f api.yaml
kubectl -n mock2 rollout status deployment/api
kubectl -n mock2 exec c -- wget -qO- -T 3 http://api/hostname      # api-578d6f7998-c6ttx
```

`args` not `command`: the image's entrypoint is `/agnhost`, so only the subcommand is passed (→ [What `--` does](../start-here/command-patterns.md#what----does)). The Service could also be `kubectl expose deployment api --port=80 --target-port=http`.

**Common mistakes**

| Mistake | Why it costs you |
|---|---|
| `kubectl create deployment ... -- netexec --http-port=8080` | `create deployment` sets `command`, replacing `/agnhost`: `RunContainerError`, `exec: "netexec": executable file not found in $PATH`. |
| Liveness pointed at `/readyz` | Anything that makes the app unready also restarts it |
| A CPU limit equal to a tiny request | Throttling under load looks like a slow app. Say why you did or didn't set one. |
| `targetPort: 80` | Endpoints listed, connections refused (the four-ports table) |
| No `requests` at all | BestEffort QoS, first to be evicted, and no HPA possible later |

</details>

### Task 3: "Ship a new version with zero downtime, then roll back."

**Time:** 10 minutes. `web` runs `nginx:1.27`. Ship `nginx:1.28` without a single failed request, then roll back to 1.27. **Done when:** the `probe` Pod, which calls `web` five times a second, logs no `FAIL` from the moment 1.28 starts rolling out.

**Setup**

```bash
kubectl create namespace mock3
kubectl -n mock3 create deployment web --image=nginx:1.27 --replicas=3
kubectl -n mock3 expose deployment web --port=80
kubectl -n mock3 rollout status deployment/web
kubectl -n mock3 run probe --image=busybox:1.36 --restart=Never -- sh -c \
  'while true; do if wget -qO- -T 1 http://web >/dev/null 2>&1; then echo ok; else echo FAIL; fi; sleep 0.2; done'
```

**✅ Success check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
T=$(kubectl -n mock3 get rs -l app=web -o jsonpath='{.items[?(@.spec.template.spec.containers[0].image=="nginx:1.28")].metadata.creationTimestamp}' | tr ' ' '\n' | sort | head -n 1)
t "1.28 was shipped"     "$([ -n "$T" ] && echo yes)" "yes"
t "no failed requests"   "$(kubectl -n mock3 logs probe --timestamps | awk -v t="$T" '$1 >= t && $2 == "FAIL"' | wc -l | tr -d ' ')" "0"
t "probe saw traffic"    "$([ "$(kubectl -n mock3 logs probe | grep -c ok)" -gt 100 ] && echo yes)" "yes"
t "back on 1.27"         "$(kubectl -n mock3 get deploy web -o jsonpath='{.spec.template.spec.containers[0].image}')" "nginx:1.27"
t "rolled out and back"  "$([ "$(kubectl -n mock3 get rs -l app=web --no-headers | wc -l)" -ge 2 ] && echo yes)" "yes"
t "3 Pods Ready"         "$(kubectl -n mock3 get deploy web -o jsonpath='{.status.readyReplicas}')" "3"
```

<details>
<summary>🗣 Say out loud</summary>

- "What's missing before I touch the image? Zero downtime is a property of the Deployment, not of the command I run."
- The two ways a rolling update drops requests: new Pods getting traffic too early, old Pods leaving too late.
- "How will I prove it, rather than assert it?"

</details>

<details>
<summary>Model solution</summary>

The starting Deployment has no readiness probe and default strategy. A plain `set image` works most of the time, but in testing it dropped 6 of 141 requests across four rollouts. Harden the Deployment first, as its own rollout:

```bash
kubectl -n mock3 patch deployment web --type=strategic -p '{"spec":{
  "strategy":{"rollingUpdate":{"maxSurge":1,"maxUnavailable":0}},
  "minReadySeconds":5,
  "template":{"spec":{"containers":[{"name":"nginx",
    "readinessProbe":{"httpGet":{"path":"/","port":80},"periodSeconds":2},
    "lifecycle":{"preStop":{"sleep":{"seconds":5}}}}]}}}}'
kubectl -n mock3 rollout status deployment/web
```

| Setting | Stops |
|---|---|
| `maxUnavailable: 0` | Capacity dropping below 3 |
| Readiness probe | Traffic to a Pod before nginx listens |
| `preStop` sleep 5 | Traffic to a Pod after SIGTERM, while kube-proxy catches up (→ [termination sequence](../reference/scheduling.md#the-termination-sequence)) |
| `minReadySeconds: 5` | Counting a Pod that crashes right after turning Ready |

Then ship, and roll back:

```bash
kubectl -n mock3 set image deployment/web nginx=nginx:1.28
kubectl -n mock3 rollout status deployment/web
kubectl -n mock3 rollout undo deployment/web
kubectl -n mock3 rollout status deployment/web
kubectl -n mock3 logs probe | grep -c FAIL          # 0
```

In testing, the same four rollouts with these settings dropped 0 requests. The hardening rollout itself can drop one: the old Pods it replaces have no `preStop` yet. That's why it goes first, before the release, and why the check only counts failures from the moment 1.28 ships.

**Common mistakes**

| Mistake | Why it costs you |
|---|---|
| Shipping first, hardening after | The first rollout already dropped requests. The probe log remembers. |
| Hardening and shipping in one patch | That rollout replaces old Pods that have no `preStop`, so the release itself is unprotected |
| "Zero downtime" with no proof | The interviewer asked you to prove it. The probe log is the proof. |
| Forgetting the Git side | `rollout undo` makes the live object drift from Git. Say you'd revert there too. |

</details>

### Task 4: "Only the frontend may talk to the API. Prove it."

**Time:** 10 minutes. **Done when:** the `frontend` Pods can call `http://api/hostname`, the `other` Pod can't, and you've shown both.

**Setup**

```bash
kubectl create namespace mock4
kubectl -n mock4 create deployment api --image=registry.k8s.io/e2e-test-images/agnhost:2.53 \
  --port=8080 -- /agnhost netexec --http-port=8080
kubectl -n mock4 expose deployment api --port=80 --target-port=8080
kubectl -n mock4 create deployment frontend --image=busybox:1.36 -- sleep 3600
kubectl -n mock4 run other --image=busybox:1.36 --restart=Never -- sleep 3600
```

**✅ Success check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "frontend allowed" "$(kubectl -n mock4 exec deploy/frontend -- wget -qO- -T 3 http://api/hostname | cut -c1-4)" "api-"
t "other blocked"    "$(kubectl -n mock4 exec other -- wget -qO- -T 3 http://api/hostname 2>&1 | grep -o 'timed out')" "timed out"
t "a policy exists"  "$(kubectl -n mock4 get netpol -o name | wc -l | tr -d ' ')" "1"
```

<details>
<summary>🗣 Say out loud</summary>

- "Before: show that both clients get through, so the test is meaningful."
- Which Pods the policy selects, which direction it restricts, and which port it names.
- "What identifies the frontend here, and who else could claim that identity?"

</details>

<details>
<summary>Model solution</summary>

Prove the baseline first: both `kubectl -n mock4 exec deploy/frontend -- wget -qO- -T 3 http://api/hostname` and the same from `other` print `api-...`.

One ingress policy on the API. No egress rules, so DNS keeps working:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-frontend
  namespace: mock4
spec:
  podSelector:
    matchLabels: {app: api}          # protects the API Pods
  policyTypes: [Ingress]
  ingress:
  - from:
    - podSelector:
        matchLabels: {app: frontend} # create deployment labelled them app=frontend
    ports:
    - {protocol: TCP, port: 8080}    # the Pod's port, not the Service's 80
```

```bash
kubectl -n mock4 exec deploy/frontend -- wget -qO- -T 3 http://api/hostname   # api-6f4dd7cb7f-qnc2r
kubectl -n mock4 exec other -- wget -qO- -T 3 http://api/hostname            # wget: download timed out
```

A timeout, not a refusal: the policy drops packets. Now the interviewer's follow-up:

```bash
kubectl -n mock4 run intruder --image=busybox:1.36 --restart=Never -l app=frontend -- sleep 3600
kubectl -n mock4 exec intruder -- wget -qO- -T 3 http://api/hostname         # api-...: allowed
```

Labels are the identity. Anyone who can create Pods in `mock4` can claim `app=frontend`. The lasting control is RBAC on Pod creation, or an identity-aware mesh (mTLS with ServiceAccount identities).

**Common mistakes**

| Mistake | Why it costs you |
|---|---|
| `port: 80` in the policy | Policies see Pod ports after the Service's translation. Nothing gets through. |
| Default-deny egress with no DNS allow | Every client fails with a lookup timeout, including the frontend |
| `namespaceSelector` and `podSelector` as two list items | OR, not AND: every Pod in matching namespaces gets in |
| Testing only the allowed path | Half a proof. The blocked path is the requirement. |

</details>

## How I'd explain this in an interview

> "For a hands-on round I use the same loop on every task. First I pin down what done looks like, as a command I can run: the Service answers, three endpoints are Ready, the probe log shows no failures. Then I observe before I touch anything. Get, describe, events, and I quote the line that names the cause. I fix at the owning object, the Deployment or the Secret or the Service, never a Pod, because the controller would undo that. After every change I rerun the same command, both to confirm the fix and to reveal the next fault, since failures stack and a later stage stays invisible until the earlier one passes. And I finish with prevention and its cost. Named ports would have prevented the targetPort bug. A readiness probe and preStop hook make every rollout safe, at the price of slightly slower rollouts. Labels as identity are only as strong as the RBAC on who can create Pods."

## Follow-up questions

**★★ You fixed Task 1's image tag, but `get pods` still shows two `ImagePullBackOff` Pods next to the new one. Is your fix wrong?**

<details>
<summary>Model answer</summary>

- **Clarify:** did the Pod template change, and is a new ReplicaSet scaling up?
- **Observe:** `kubectl -n mock1 get rs` shows the old ReplicaSet still at 2 and the new one at 1, and the new Pod has moved on to `CreateContainerConfigError`.
- **Hypothesise:** the rollout is working. The default `maxUnavailable: 25%` rounds down to 0 at 2 replicas, so old Pods leave only when new ones are Ready. The next fault is blocking that.
- **Fix:** fix the next stage (the Secret key). The old Pods disappear as the new ones turn Ready.
- **Prevent:** judge progress with `rollout status` and `get rs`, not by counting Pods.

</details>

**★★★ Task 3 passed. The interviewer asks: "Would this still be zero-downtime for a service with long-lived connections, like WebSockets?"**

<details>
<summary>Model answer</summary>

- **Clarify:** how long do connections live, and can clients reconnect transparently?
- **Observe:** `preStop` and the grace period cover draining in-flight *requests*. A WebSocket can stay open for hours, longer than any sensible grace period.
- **Hypothesise:** at SIGKILL the connection drops no matter what. The question is whether the client notices.
- **Fix:** the app handles SIGTERM by telling clients to reconnect, the client reconnects with backoff, and `terminationGracePeriodSeconds` is sized to that drain rather than to one request.
- **Prevent:** the trade-off: long grace periods make every rollout and node drain slow. Accept reconnects as normal behaviour and design clients for it.

</details>
