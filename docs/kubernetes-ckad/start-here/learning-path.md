---
title: "Learning Path: Interview Prep"
sidebar_label: Learning Path
sidebar_position: 4
---

# Learning Path: Interview Prep

> Docs: [Kubernetes concepts](https://kubernetes.io/docs/concepts/) · [kubectl reference](https://kubernetes.io/docs/reference/kubectl/)

The reference pages are sorted by topic; this page sorts them by what a hands-on interview asks first. Work through the phases in order. Each phase ends with labs that prove it with a ✅ Check, so you know when to move on. Every page ends with a **Next in path →** link that follows this order. Badges at the top of each page say how much it matters: 🔥 Core (drill until fluent), 📘 Know (explain it and do the lab once), 👀 Skim (read for context).

**Short on time?** Do phases 1–4 and 8. They cover what most hands-on rounds test: deploy, configure, expose, debug and release an app while talking through it.

## Phases

| # | Phase | Pages | Labs | Time |
|---|---|---|---|---|
| 1 | **Foundations** | [Mental Model](./mental-model.md) · [Local Setup](./local-setup.md) with [add-ons](./local-setup.md#cluster-add-ons) · [Command Patterns](./command-patterns.md) · [Architecture](../reference/architecture.md) (skim) | [Lab 0](./mental-model.md#-lab) · [Lab 1-1](../reference/architecture.md#-lab) | 3 h |
| 2 | **Run an app** | [Pods](../reference/pods-and-multi-container.md) (phases, restartPolicy) · [Deployments & Rollouts](../reference/deployments-and-rollouts.md) · [Services & Ingress](../reference/services-and-ingress.md) · [Container Images](../reference/container-images.md) | [Lab 5-1](../reference/deployments-and-rollouts.md#-lab) · [Lab 5-2](../reference/deployments-and-rollouts.md#lab-5-2) · [Lab 10-1](../reference/services-and-ingress.md#-lab) · [Lab 10-2](../reference/services-and-ingress.md#lab-10-2) · [Lab 15-1](../reference/container-images.md#-lab) | 5 h |
| 3 | **Configure it** | [Config & Secrets](../reference/config-and-secrets.md) · [Resources & Scaling](../reference/resources-and-scaling.md) · [Scheduling & Shutdown](../reference/scheduling.md) · [Probes & Observability](../reference/probes-and-observability.md) | [Lab 7-1](../reference/config-and-secrets.md#-lab) · [Lab 8-1](../reference/resources-and-scaling.md#-lab) · [Lab 16-1](../reference/scheduling.md#-lab) · [Lab 12-1](../reference/probes-and-observability.md#-lab) | 5 h |
| 4 | **Debug it** | [Troubleshooting](../reference/troubleshooting.md) · [Troubleshooting Drills](../scenarios/troubleshooting-drills.md) · [Capstone](../scenarios/capstone-deploy-an-app.md), attempt 1: untimed, solutions open | [Lab 13-1](../reference/troubleshooting.md#-lab) · Drills 1–8 · Capstone | 4 h |
| 5 | **Other workloads** | [Jobs & CronJobs](../reference/jobs-and-cronjobs.md) · [Storage](../reference/storage.md) · [multi-container patterns](../reference/pods-and-multi-container.md#multi-container-patterns) | [Lab 3-1](../reference/jobs-and-cronjobs.md#-lab) · [Lab 4-1](../reference/storage.md#-lab) · [Lab 2-1](../reference/pods-and-multi-container.md#-lab) | 3 h |
| 6 | **Isolation & security** | [Network Policy](../reference/network-policy.md) · [Security](../reference/security.md) · [Multi-Tenant Platform](../scenarios/multi-tenant-platform.md) | [Lab 11-1](../reference/network-policy.md#-lab) · [Lab 9-1](../reference/security.md#-lab) | 3 h |
| 7 | **Packaging** | [Helm & Kustomize](../reference/helm-and-kustomize.md) | [Lab 6-1](../reference/helm-and-kustomize.md#-lab) · [Lab 6-2](../reference/helm-and-kustomize.md#lab-6-2) | 1.5 h |
| 8 | **Interview mode** | [ML Model Serving](../scenarios/ml-model-serving.md) · [Nightly Retraining](../scenarios/nightly-retraining-pipeline.md) · [Zero-Downtime Release](../scenarios/zero-downtime-release.md): rehearse each "How I'd explain" out loud · [Capstone](../scenarios/capstone-deploy-an-app.md), attempt 2: 40 min, solutions closed · [Mock Interview](../scenarios/mock-interview.md) | Capstone · Mock tasks 1–4 · Drills again at the 🔴 tier | 5 h |

Total: about 30 hours. [Glossary](./glossary.md) and the [kubectl Cheatsheet](../reference/kubectl-cheatsheet.md) are for lookup, not reading in order.

## How to use a phase

| Step | Done when |
|---|---|
| Read the 🔥 and 📘 pages in the phase | You can say each page's Summary lines without looking |
| Do each lab at the highest tier you can | Its ✅ Check prints only `PASS` |
| Answer the page's Scenario questions out loud | You reach Prevent without opening the model answer |
| Drop a tier next time | The 🟢 Guided commands feel predictable |

A lab you can only pass at 🟢 Guided is a lab to repeat. Phase 8 assumes 🔴 Challenge on everything 🔥.

---

**Next in path →** [Architecture](../reference/architecture.md) (skim), then Phase 2.
