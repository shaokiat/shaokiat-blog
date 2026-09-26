---
title: Network Policy
sidebar_label: Network Policy
sidebar_position: 11
---

# Network Policy

> Docs: [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) · [Declare Network Policy](https://kubernetes.io/docs/tasks/administer-cluster/declare-network-policy/)

## Overview

By default every Pod can reach every other Pod in the cluster, across all namespaces. A **NetworkPolicy** turns that into an allow-list for the Pods it selects. Once any policy selects a Pod for a direction (ingress or egress), only traffic that some policy explicitly allows gets through in that direction. Policies are enforced by the CNI plugin, not by Kubernetes itself. On a CNI without NetworkPolicy support they are accepted and silently ignored. The standard pattern is default-deny per namespace, then small allow policies per flow. The classic trap is that a default egress deny also blocks DNS, so everything fails with name-resolution errors. On the [request path](./services-and-ingress.md) policies act on Pod-to-Pod traffic, after the Service has picked an endpoint.

## Key concepts

### How selection works

| Situation | Ingress to the Pod | Egress from the Pod |
|---|---|---|
| No policy selects the Pod | All allowed | All allowed |
| A policy selects it with `policyTypes: [Ingress]` | Only what some policy allows | All allowed |
| A policy selects it with `policyTypes: [Ingress, Egress]` | Only what's allowed | Only what's allowed, **including DNS** |
| Several policies select it | The union of their allows | The union of their allows |

Policies only add allows. There is no deny rule and no ordering. For a connection to succeed when both sides are locked down, the client needs an egress allow **and** the server needs an ingress allow.

### Peer selectors

| `from` / `to` entry | Matches |
|---|---|
| `podSelector` | Pods with these labels **in the policy's namespace** |
| `namespaceSelector` | All Pods in namespaces with these labels |
| `namespaceSelector` + `podSelector` in **one** entry | Pods with these labels in those namespaces (AND) |
| `ipBlock` | CIDR ranges, usually for traffic leaving the cluster |

The AND/OR difference is one dash:

| YAML | Result |
|---|---|
| `- namespaceSelector: {matchLabels: {team: a}}`<br/>`  podSelector: {matchLabels: {app: web}}` | One entry: `web` Pods in team-a namespaces (AND) |
| `- namespaceSelector: {matchLabels: {team: a}}`<br/>`- podSelector: {matchLabels: {app: web}}` | Two entries: **any** Pod in team-a namespaces, **or** `web` Pods in this namespace (OR). Usually a bug. |

Every namespace carries the label `kubernetes.io/metadata.name: <name>`, so you can select a namespace by name without adding labels.

### Ports

`ports` refer to the **Pod's** port (the Service's `targetPort`), not the Service port. Policies see traffic after the Service IP has been translated to a Pod IP.

## kubectl essentials

There is no `kubectl create networkpolicy`. Keep the skeletons below ready, and test with labelled throwaway Pods:

```bash
kubectl get networkpolicy                                  # short name: netpol
kubectl describe netpol allow-frontend                     # human-readable allow rules
kubectl get pods --show-labels
kubectl get ns --show-labels                               # namespace labels for namespaceSelector

# test as a Pod carrying specific labels; -T 3 makes blocked traffic fail fast
kubectl run test --rm -it --image=busybox:1.36 --restart=Never -l app=frontend -- wget -qO- -T 3 http://api
kubectl run test --rm -it --image=busybox:1.36 --restart=Never -- nslookup api
```

Default deny, both directions, for every Pod in the namespace:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}                  # every Pod in the namespace
  policyTypes: [Ingress, Egress]   # no rules listed = nothing allowed
```

Allow DNS for every Pod. Needed as soon as egress is denied:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
spec:
  podSelector: {}
  policyTypes: [Egress]
  egress:
  - to:
    - namespaceSelector:
        matchLabels: {kubernetes.io/metadata.name: kube-system}
      podSelector:
        matchLabels: {k8s-app: kube-dns}
    ports:
    - {protocol: UDP, port: 53}
    - {protocol: TCP, port: 53}
```

Allow the frontend to reach the API on its container port, from this namespace and from the ingress controller's namespace:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels: {app: api}        # the Pods being protected
  policyTypes: [Ingress]
  ingress:
  - from:
    - podSelector:
        matchLabels: {app: frontend}
    - namespaceSelector:
        matchLabels: {kubernetes.io/metadata.name: ingress-system}
    ports:
    - {protocol: TCP, port: 8080}
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-egress-to-api
spec:
  podSelector:
    matchLabels: {app: frontend}
  policyTypes: [Egress]
  egress:
  - to:
    - podSelector:
        matchLabels: {app: api}
    ports:
    - {protocol: TCP, port: 8080}
```

## 🧪 Lab

:::tip Lab 11-1 ★★★
See [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Lock a namespace down, then open exactly one path.**

kind's default CNI (kindnet) enforces NetworkPolicy. On minikube, start with `--cni=calico`.

**Goal**

1. In namespace `lab11`, create Deployment `api` (`registry.k8s.io/e2e-test-images/agnhost:2.53`, command `/agnhost netexec --http-port=8080`) and a Service `api` on port 80 → 8080.
2. Confirm a Pod labelled `app=frontend` and an unlabelled Pod can both reach `http://api/hostname`.
3. Apply `default-deny`. Test again. What error do you get, and why?
4. Apply `allow-dns`, `allow-frontend` and `frontend-egress-to-api`. Only the frontend should get through.

**Verify**

```bash
kubectl -n lab11 run fe --rm -it --image=busybox:1.36 --restart=Never -l app=frontend -- wget -qO- -T 3 http://api/hostname   # api-...
kubectl -n lab11 run other --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname          # timeout
```

<details>
<summary>🟡 Hints</summary>

1. Same as Lab 10-1 steps 1–2.
2. `kubectl run -h`: `-l` sets labels on the Pod you run.
3. There's no NetworkPolicy generator. Save the skeletons above as files. With egress denied, what does a Pod need before it can even find `api`?
4. `kubectl apply -f` accepts several `-f` flags. A connection needs an egress allow on the client **and** an ingress allow on the server.

</details>

<details>
<summary>🟢 Guided</summary>

```bash
# create the lab namespace
kubectl create namespace lab11
# run agnhost serving HTTP on 8080
kubectl -n lab11 create deployment api --image=registry.k8s.io/e2e-test-images/agnhost:2.53 \
  --port=8080 -- /agnhost netexec --http-port=8080
# put a Service in front: 80 -> 8080
kubectl -n lab11 expose deployment api --port=80 --target-port=8080
# call it as a frontend-labelled Pod: works
kubectl -n lab11 run fe --rm -it --image=busybox:1.36 --restart=Never -l app=frontend -- wget -qO- -T 3 http://api/hostname
# call it as an unlabelled Pod: also works, because nothing is denied yet
kubectl -n lab11 run other --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname

# deny all ingress and egress for every Pod (the default-deny skeleton above, saved as default-deny.yaml)
kubectl -n lab11 apply -f default-deny.yaml
# try the frontend again
kubectl -n lab11 run fe --rm -it --image=busybox:1.36 --restart=Never -l app=frontend -- wget -qO- -T 3 http://api/hostname
#   wget: download timed out. It never got past DNS: egress to kube-dns is denied too.
#   nslookup api fails the same way ("no servers could be reached").

# allow DNS, and the frontend -> api path in both directions (allow-frontend.yaml holds both of those policies)
kubectl -n lab11 apply -f allow-dns.yaml -f allow-frontend.yaml
# frontend: succeeds
kubectl -n lab11 run fe --rm -it --image=busybox:1.36 --restart=Never -l app=frontend -- wget -qO- -T 3 http://api/hostname
# unlabelled Pod: times out, because only app=frontend is allowed in
kubectl -n lab11 run other --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname

# delete everything the lab created
kubectl delete namespace lab11
```

</details>
:::

## Gotchas

- **Egress deny kills DNS.** Apps log `could not resolve host`; `nslookup` says `no servers could be reached`; busybox `wget` just times out. Always ship `allow-dns` with an egress deny.
- **The CNI must support it.** Flannel alone ignores policies. The objects apply fine and change nothing.
- **One dash changes AND to OR.** Read `from` entries carefully. `kubectl describe netpol` spells out the result.
- **Ports are Pod ports.** Allowing port 80 when the Service maps 80 → 8080 blocks everything.
- **`podSelector` in a peer is namespace-local.** To allow Pods from another namespace, add a `namespaceSelector` in the same entry.
- **The ingress controller is a client too.** After a default deny, allow its namespace or external traffic stops.
- **Policies are namespaced.** A default deny must be created in every namespace you want locked down.

## Scenario questions

**Q1 ★ After applying a default-deny policy, every app in the namespace fails with "could not resolve host". Why?**

<details>
<summary>Model answer</summary>

- **Clarify:** does the policy cover egress as well as ingress?
- **Observe:** `kubectl get netpol -o yaml` shows `policyTypes: [Ingress, Egress]` with no egress rules. `nslookup` from a Pod fails.
- **Hypothesise:** egress deny also blocks DNS queries to kube-dns in `kube-system`. Every hostname lookup fails before any connection is attempted.
- **Fix:** add an egress policy allowing UDP and TCP 53 to `k8s-app: kube-dns` in `kube-system`.
- **Prevent:** a namespace template that always ships default-deny and allow-dns together.

</details>

**Q2 ★★ Allow the API to receive traffic only from the ingress controller and Pods in its own namespace.**

<details>
<summary>Model answer</summary>

- **Clarify:** which namespace runs the ingress controller? Which port does the API container listen on?
- **Observe:** namespaces carry `kubernetes.io/metadata.name`, so no custom labels are needed.
- **Hypothesise:** one ingress policy selecting `app: api` with two `from` entries (OR): `podSelector: {}` for the same namespace and a `namespaceSelector` for the controller's namespace.
- **Fix:** apply it on the container port and test from both sides and from a third namespace.
- **Prevent:** keep policies next to the app's manifests so they deploy and get reviewed together.

</details>

**Q3 ★★ A policy is applied but has no effect: blocked traffic still flows. What's wrong?**

<details>
<summary>Model answer</summary>

- **Clarify:** which CNI does the cluster run? Is this the first policy in the cluster?
- **Observe:** check the CNI's DaemonSet in `kube-system`. `kubectl describe netpol` shows which Pods it selects; compare with `kubectl get pods --show-labels`.
- **Hypothesise:** the CNI doesn't enforce policies (plain Flannel), the `podSelector` matches no Pods, or the traffic is allowed by a second policy (they union).
- **Fix:** move to a CNI that enforces policy (Calico, Cilium), fix the selector, or narrow the other policy.
- **Prevent:** a connectivity test in CI that proves a denied path is actually denied.

</details>

**Q4 ★★★ Design network isolation for a cluster shared by several teams.**

<details>
<summary>Model answer</summary>

- **Clarify:** may teams ever call each other? Which shared services exist (ingress, monitoring, DNS)?
- **Observe:** NetworkPolicies are namespaced and additive, so the baseline must exist in every namespace.
- **Hypothesise:** per team namespace: default-deny both directions, allow-dns, allow same-namespace traffic, allow from the ingress controller and monitoring namespaces. Cross-team calls are explicit, reviewed policies.
- **Fix:** create the baseline automatically with each namespace (a namespace controller, Kyverno generate rules, or the platform's namespace template).
- **Prevent:** trade-off: namespaced policies can be edited by the team that owns the namespace. For guard rails teams can't loosen, use the CNI's cluster-wide policies (Calico GlobalNetworkPolicy, Cilium clusterwide) or AdminNetworkPolicy. → See [Multi-Tenant Platform](../scenarios/multi-tenant-platform.md).

</details>

## Summary

- **No policy means allow all.** Selecting a Pod for a direction flips it to allow-list.
- **Policies union; there is no deny rule.** Default-deny is just a policy with no allows.
- **Egress deny blocks DNS.** Allow UDP/TCP 53 to kube-dns every time.
- **One entry ANDs, two entries OR.** Watch the dash.
- **Enforcement is the CNI's job.** Verify it with a real connection test, not by reading YAML.
