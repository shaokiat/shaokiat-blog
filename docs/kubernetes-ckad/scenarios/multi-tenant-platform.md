---
title: Multi-Tenant Platform
sidebar_label: Multi-Tenant Platform
sidebar_position: 4
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Scenario: Multi-Tenant Platform

> Builds on: [Security](../reference/security.md) · [Resources & Scaling](../reference/resources-and-scaling.md) · [Network Policy](../reference/network-policy.md)

## Situation

Five product teams are moving onto one shared cluster to cut costs. Each team deploys its own services. Security has three worries: a team reading another team's Secrets, a compromised Pod reaching other teams' databases, and privileged containers. Operations has one: last month a runaway load test in one team's namespace used every node and evicted other teams' Pods.

## Requirements

| Requirement | Failure it prevents |
|---|---|
| Teams manage only their own workloads | Team A deletes or reads Team B's Deployments and Secrets |
| Fair share of cluster capacity | One team's load test evicting everyone else |
| Every Pod declares resources | Unbounded BestEffort Pods, HPAs without requests |
| No network path between teams unless agreed | A compromised Pod scanning other teams' services |
| No privileged or root containers | A container escape reaching the node |
| New team onboarding in minutes, identical every time | Hand-built namespaces drifting from policy |

## Architecture

<ThemedImage
  alt="A cluster with an ingress namespace and two team namespaces; each team namespace has a RoleBinding, ResourceQuota, LimitRange, a default-deny NetworkPolicy and restricted Pod Security; the ingress controller may reach both teams, but traffic from team A to team B is blocked"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-multi-tenant-platform-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-multi-tenant-platform-1-dark.svg'),
  }}
/>

*Figure S4-1: Namespace-per-team isolation. Blue are the guard-rail objects stamped into every namespace, green are the team's workloads, amber is the cross-team path the guard rails block.*

## Kubernetes resources used

| Guard rail | Object | Reference |
|---|---|---|
| Who can do what | RoleBinding from the team's IdP group to the built-in `edit` ClusterRole | [Security](../reference/security.md#rbac-objects) |
| How much they can use | ResourceQuota | [Resources & Scaling](../reference/resources-and-scaling.md#limitrange-vs-resourcequota) |
| Defaults for every container | LimitRange | [Resources & Scaling](../reference/resources-and-scaling.md#limitrange-vs-resourcequota) |
| Who can talk to whom | NetworkPolicies: default deny, same namespace, ingress, DNS | [Network Policy](../reference/network-policy.md) |
| What a Pod may do on the node | Pod Security Admission `restricted` | [Security](../reference/security.md#pod-security-admission) |
| Isolation unit | Namespace | [Architecture](../reference/architecture.md) |

## Walkthrough

**1. A namespace per team, with Pod Security on.** Labels on the namespace enforce the `restricted` standard for every Pod.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: team-a
  labels:
    team: a
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/warn: restricted
```

**2. Access through groups, not people.** Bind the team's identity-provider group to the built-in `edit` ClusterRole with a RoleBinding. The permissions apply only inside `team-a`. `edit` can read Secrets in its own namespace, which is fine because it's their namespace. Nobody gets cluster-wide write.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: team-a-edit
  namespace: team-a
subjects:
- kind: Group
  name: team-a-developers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: edit
  apiGroup: rbac.authorization.k8s.io
```

**3. Capacity: a quota caps the namespace, a LimitRange fills in defaults.** The quota is what stops the runaway load test. The LimitRange makes sure Pods without resources still get requests, so the quota can count them and the HPA can use them.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute
  namespace: team-a
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 64Gi
    limits.memory: 96Gi
    pods: "100"
    services.loadbalancers: "0"        # external exposure only through the shared Ingress
---
apiVersion: v1
kind: LimitRange
metadata:
  name: defaults
  namespace: team-a
spec:
  limits:
  - type: Container
    defaultRequest: {cpu: 100m, memory: 128Mi}
    default: {memory: 512Mi}
```

**4. Network: deny by default, then open what the platform needs.** Four policies per namespace: default deny both ways, DNS egress, traffic within the namespace, and ingress from the shared controller. Anything cross-team is an explicit extra policy that both teams review.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: team-a
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: team-a
spec:
  podSelector: {}
  policyTypes: [Egress]
  egress:
  - to:
    - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: kube-system}}
      podSelector: {matchLabels: {k8s-app: kube-dns}}
    ports: [{protocol: UDP, port: 53}, {protocol: TCP, port: 53}]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-same-namespace
  namespace: team-a
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
  ingress: [{from: [{podSelector: {}}]}]
  egress: [{to: [{podSelector: {}}]}]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-ingress
  namespace: team-a
spec:
  podSelector: {}
  policyTypes: [Ingress]
  ingress:
  - from:
    - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: ingress}}
```

**5. Stamp it out.** All of the above is one Kustomize base with the team name as a variable (→ [Helm & Kustomize](../reference/helm-and-kustomize.md)), applied by CI or a GitOps controller when a team is added. Onboarding is a pull request. Drift is corrected on the next sync.

**6. Know the limits.** Namespaces give *soft* multi-tenancy: tenants share nodes, the kernel, the API server and cluster-scoped objects (CRDs, ClusterRoles). That fits teams in one company. For untrusted tenants (external customers running their own code), add sandboxed runtimes (gVisor, Kata), dedicated node pools with taints, virtual clusters, or separate clusters.

## How I'd explain this in an interview

> "I'd make the namespace the tenant boundary and put four guard rails in every one, created from the same template. Identity: a RoleBinding from the team's IdP group to the built-in edit ClusterRole, so they're admins of their namespace and nothing else. Capacity: a ResourceQuota caps the total, which would have stopped last month's load test, and a LimitRange gives every container default requests, so quotas and HPAs work even when people forget. Network: default deny both ways, then DNS, same-namespace traffic and the ingress controller. Cross-team calls become explicit policies. Node safety: Pod Security Admission set to restricted, so no root or privileged containers. It's all one Kustomize base applied through GitOps, so onboarding is a pull request and nothing drifts. The trade-off I'd be upfront about: this is soft multi-tenancy. Teams still share nodes and the control plane, which is fine inside one company. For hostile tenants I'd add sandboxed runtimes or give them separate clusters."

## Follow-up questions

**★★ A team needs to call another team's API. How do you allow it without opening everything?**

<details>
<summary>Model answer</summary>

- **Clarify:** which Pods call which service, on which port? Is it permanent?
- **Observe:** both namespaces deny by default, so both sides need a rule.
- **Hypothesise:** an egress rule in the caller's namespace and an ingress rule in the callee's, each selecting only the specific Pods and port.
- **Fix:** the callee's ingress policy uses `namespaceSelector` (`kubernetes.io/metadata.name: team-a`) AND `podSelector` (`app: checkout`) in one entry, on the container port. The caller gets a matching egress rule. Both go through each team's review.
- **Prevent:** keep cross-team policies in the callee's repo so the owner of the exposed service approves access.

</details>

**★★ A team's Pods are rejected with `exceeded quota`, but the cluster has spare capacity. What do you tell them?**

<details>
<summary>Model answer</summary>

- **Clarify:** do they need more for a real reason, or are their requests inflated?
- **Observe:** `kubectl describe quota` shows used vs hard. `kubectl top pods` vs requests shows whether requests match usage.
- **Hypothesise:** quota counts requests, not usage. Over-requesting uses up the quota while nodes sit idle.
- **Fix:** right-size requests first, then raise the quota if real demand is higher. Quotas are a fairness contract, not a hardware limit.
- **Prevent:** show each team its request-vs-usage ratio. Over-requesting is usually the problem, not the quota.

</details>

**★★★ Could a team still escape its namespace? Where are the gaps?**

<details>
<summary>Model answer</summary>

- **Clarify:** what's the threat model: careless teams or malicious code?
- **Observe:** namespaces don't isolate cluster-scoped resources, the nodes, or the API server's capacity.
- **Hypothesise:** gaps include a kernel exploit from a container (shared kernel), node-level resource contention that quotas don't cover (disk I/O, network bandwidth), noisy API usage, and any ClusterRole someone was granted by mistake.
- **Fix:** restricted Pod Security closes most escape paths, sandboxed runtimes close more, dedicated tainted node pools remove noisy neighbours, and API Priority and Fairness protects the API server. Audit ClusterRoleBindings regularly.
- **Prevent:** match isolation to the threat: internal teams get namespaces; untrusted code gets separate clusters.

</details>
