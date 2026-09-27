---
title: Kubernetes (CKAD)
sidebar_label: Overview
---

# Kubernetes (CKAD)

New to Kubernetes? Work through **Start Here** in order: [Mental Model](./start-here/mental-model.md) → [Local Setup](./start-here/local-setup.md) → [Command Patterns](./start-here/command-patterns.md). Every Lab has three tiers (🔴 Challenge, 🟡 Hints, 🟢 Guided), so pick your level.

Notes for Kubernetes interviews, using the [CKAD curriculum](https://github.com/cncf/curriculum) as the syllabus. The exam is performance-based: you solve tasks in a live cluster with `kubectl`, so every reference page pairs concepts with commands and a hands-on lab.

## Scenarios

Interview-style systems that combine several reference pages. Explain each one end to end before the interview.

- [ML Model Serving](./scenarios/ml-model-serving.md): slow model load, startup probes, HPA, safe rollouts
- [Nightly Retraining Pipeline](./scenarios/nightly-retraining-pipeline.md): CronJob, PVC for artifacts, `concurrencyPolicy: Forbid`
- [Zero-Downtime Release](./scenarios/zero-downtime-release.md): rolling, canary and blue/green releases, rollback
- [Multi-Tenant Platform](./scenarios/multi-tenant-platform.md): namespaces, ResourceQuota, RBAC, NetworkPolicy
- [Troubleshooting Drills](./scenarios/troubleshooting-drills.md): Pending, CrashLoopBackOff, ImagePullBackOff, OOMKilled, Service with no endpoints

**Fundamentals:** [Mental Model](./start-here/mental-model.md) · [Command Patterns](./start-here/command-patterns.md) · [Architecture](./reference/architecture.md) · [kubectl Cheatsheet](./reference/kubectl-cheatsheet.md)

---

## Domain 1: Application Design and Build (20%)

- Define, build and modify container images → [Container Images](./reference/container-images.md#what-goes-in-the-dockerfile) · [imagePullPolicy](./reference/container-images.md#imagepullpolicy) · [Lab 15-1](./reference/container-images.md#-lab)
- Choose the right workload resource: Deployment, DaemonSet, StatefulSet, Job, CronJob → [Deployments & Rollouts](./reference/deployments-and-rollouts.md#choosing-a-workload-resource) · [Jobs & CronJobs](./reference/jobs-and-cronjobs.md#job-fields)
- Multi-container Pod patterns: init, sidecar, ambassador, adapter → [Pods & Multi-Container](./reference/pods-and-multi-container.md#multi-container-patterns) · [native sidecars](./reference/pods-and-multi-container.md#native-sidecars-vs-plain-extra-containers)
- Persistent and ephemeral volumes → [Storage](./reference/storage.md#volume-types-by-lifetime) · [PV, PVC and StorageClass](./reference/storage.md#pv-pvc-and-storageclass) · [access modes](./reference/storage.md#access-modes)

---

## Domain 2: Application Deployment (20%)

- Rolling updates and rollback → [Deployments & Rollouts](./reference/deployments-and-rollouts.md#rollout-strategy)
- Blue/green and canary with Kubernetes primitives → [Release strategies](./reference/deployments-and-rollouts.md#release-strategies-with-core-primitives) · [Lab 5-2](./reference/deployments-and-rollouts.md#lab-5-2) · [Zero-Downtime Release](./scenarios/zero-downtime-release.md)
- Deploy existing packages with **Helm** → [Helm & Kustomize](./reference/helm-and-kustomize.md#helm-terms) · [Lab 6-2](./reference/helm-and-kustomize.md#lab-6-2)
- Patch manifests per environment with **Kustomize** → [Helm & Kustomize](./reference/helm-and-kustomize.md#kustomize-features)

---

## Domain 3: Application Observability and Maintenance (15%)

- API deprecations → [API groups and versions](./reference/architecture.md#api-groups-and-versions) · [finding deprecated APIs](./reference/probes-and-observability.md#api-deprecations)
- Probes and health checks: startup, readiness, liveness → [Probes & Observability](./reference/probes-and-observability.md#the-three-probes)
- Built-in CLI monitoring: `kubectl top`, events, `get -w` → [Built-in monitoring](./reference/probes-and-observability.md#built-in-monitoring)
- Container logs → [Probes & Observability](./reference/probes-and-observability.md#kubectl-essentials)
- Debugging → [Troubleshooting](./reference/troubleshooting.md#status--first-command--usual-causes) · [Troubleshooting Drills](./scenarios/troubleshooting-drills.md)

---

## Domain 4: Application Environment, Configuration and Security (25%)

- Extend Kubernetes with **CRDs** and **Operators** → [Security](./reference/security.md#crds-and-operators)
- Authentication, authorization (RBAC) and admission control → [Request pipeline](./reference/security.md#the-request-pipeline) · [RBAC](./reference/security.md#rbac-objects) · [Pod Security Admission](./reference/security.md#pod-security-admission)
- Requests, limits and ResourceQuotas → [Requests vs limits](./reference/resources-and-scaling.md#requests-vs-limits) · [LimitRange vs ResourceQuota](./reference/resources-and-scaling.md#limitrange-vs-resourcequota) · [Scheduling & Shutdown](./reference/scheduling.md#placing-pods)
- **ConfigMaps** and **Secrets** → [Config & Secrets](./reference/config-and-secrets.md#configmap-vs-secret) · [injection methods](./reference/config-and-secrets.md#injection-methods)
- **ServiceAccounts** and **SecurityContexts** → [ServiceAccounts](./reference/security.md#serviceaccounts) · [SecurityContext](./reference/security.md#securitycontext)

---

## Domain 5: Services and Networking (20%)

- NetworkPolicies → [How selection works](./reference/network-policy.md#how-selection-works) · [peer selectors](./reference/network-policy.md#peer-selectors)
- Provide and troubleshoot access to applications via Services → [Service types](./reference/services-and-ingress.md#service-types) · [the four ports](./reference/services-and-ingress.md#the-four-ports)
- Expose applications with Ingress rules → [Ingress vs Gateway API](./reference/services-and-ingress.md#ingress-vs-gateway-api) · [Lab 10-2](./reference/services-and-ingress.md#lab-10-2)

---

## Resources

| Resource | Use it for |
|---|---|
| [CNCF CKAD page](https://www.cncf.io/training/certification/ckad/) · [Official curriculum](https://github.com/cncf/curriculum) | The authoritative domain list and weights |
| [Kubernetes docs](https://kubernetes.io/docs/) | The only site open during the exam. Learn to search it fast |
| [killer.sh CKAD simulator](https://killer.sh/ckad) | Timed practice harder than the real exam |
| [bmuschko/ckad-crash-course](https://github.com/bmuschko/ckad-crash-course) | Concise exercises per domain |
| [dgkanatsios/CKAD-exercises](https://github.com/dgkanatsios/CKAD-exercises) | Drill imperative commands until they are muscle memory |
| [bmuschko/ckad-prep](https://github.com/bmuschko/ckad-prep) | Scenario-style exercise sequences |
| [Learnk8s: troubleshooting deployments](https://learnkube.com/troubleshooting-deployments) | A visual debugging flowchart |
| [KodeKloud CKAD course](https://kodekloud.com/) | Video course with browser-based labs |
