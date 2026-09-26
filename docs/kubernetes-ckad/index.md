---
title: Kubernetes (CKAD)
sidebar_label: Overview
---

# Kubernetes (CKAD)

Notes for Kubernetes interviews, using the [CKAD curriculum](https://github.com/cncf/curriculum) as the syllabus. The exam is performance-based: you solve tasks in a live cluster with `kubectl`, so every reference page pairs concepts with commands and a hands-on lab. Start with [Architecture](./reference/architecture.md). Every other page is one controller reconciling one kind of desired state.

## Scenarios

Interview-style systems that combine several reference pages. Explain each one end to end before the interview.

- [ML Model Serving](./scenarios/ml-model-serving.md): slow model load, startup probes, HPA, safe rollouts
- [Nightly Retraining Pipeline](./scenarios/nightly-retraining-pipeline.md): CronJob, PVC for artifacts, `concurrencyPolicy: Forbid`
- [Zero-Downtime Release](./scenarios/zero-downtime-release.md): rolling, canary and blue/green releases, rollback
- [Multi-Tenant Platform](./scenarios/multi-tenant-platform.md): namespaces, ResourceQuota, RBAC, NetworkPolicy
- [Troubleshooting Drills](./scenarios/troubleshooting-drills.md): Pending, CrashLoopBackOff, ImagePullBackOff, OOMKilled, Service with no endpoints

**Fundamentals:** [Architecture](./reference/architecture.md) · [kubectl Cheatsheet](./reference/kubectl-cheatsheet.md)

---

## Domain 1: Application Design and Build (20%)

- Define, build and modify container images
- Choose the right workload resource: Deployment, DaemonSet, Job, CronJob → [Deployments & Rollouts](./reference/deployments-and-rollouts.md) · [Jobs & CronJobs](./reference/jobs-and-cronjobs.md)
- Multi-container Pod patterns: init, sidecar, ambassador, adapter → [Pods & Multi-Container](./reference/pods-and-multi-container.md)
- Persistent and ephemeral volumes → [Storage](./reference/storage.md)

---

## Domain 2: Application Deployment (20%)

- Rolling updates and rollback → [Deployments & Rollouts](./reference/deployments-and-rollouts.md)
- Blue/green and canary with Kubernetes primitives → [Deployments & Rollouts](./reference/deployments-and-rollouts.md)
- Deploy existing packages with **Helm** → [Helm & Kustomize](./reference/helm-and-kustomize.md)
- Patch manifests per environment with **Kustomize** → [Helm & Kustomize](./reference/helm-and-kustomize.md)

---

## Domain 3: Application Observability and Maintenance (15%)

- API deprecations: group/version, `kubectl api-resources`, `kubectl explain` → [Architecture](./reference/architecture.md)
- Probes and health checks: startup, readiness, liveness → [Probes & Observability](./reference/probes-and-observability.md)
- Built-in CLI monitoring: `kubectl top`, events, `get -w` → [Probes & Observability](./reference/probes-and-observability.md)
- Container logs → [Probes & Observability](./reference/probes-and-observability.md)
- Debugging → [Troubleshooting](./reference/troubleshooting.md)

---

## Domain 4: Application Environment, Configuration and Security (25%)

- Extend Kubernetes with **CRDs** and **Operators** → [Security](./reference/security.md)
- Authentication, authorization (RBAC) and admission control → [Security](./reference/security.md)
- Requests, limits and ResourceQuotas → [Resources & Scaling](./reference/resources-and-scaling.md)
- **ConfigMaps** and **Secrets** → [Config & Secrets](./reference/config-and-secrets.md)
- **ServiceAccounts** and **SecurityContexts** → [Security](./reference/security.md)

---

## Domain 5: Services and Networking (20%)

- NetworkPolicies → [Network Policy](./reference/network-policy.md)
- Provide and troubleshoot access to applications via Services → [Services & Ingress](./reference/services-and-ingress.md)
- Expose applications with Ingress rules → [Services & Ingress](./reference/services-and-ingress.md)

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
