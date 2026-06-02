---
title: Compute Selection
sidebar_label: Compute Selection
sidebar_position: 2
---

# Compute Selection

> Docs: [Choosing a compute option](https://cloud.google.com/blog/products/compute/choosing-the-right-compute-option-in-gcp-a-decision-tree)

## Options at a Glance

| Service | Type | When to Use |
|---|---|---|
| **Compute Engine** | IaaS VMs | Full OS control, lift-and-shift, GPUs, custom machine types |
| **GKE Standard** | Kubernetes | Containers, full node control, specific node configurations |
| **GKE Autopilot** | Managed Kubernetes | Containers, hands-off node management, per-pod billing |
| **GKE Enterprise** | Multi-cluster Kubernetes | Kubernetes across on-prem + cloud under one control plane |
| **Cloud Run** | Serverless containers | HTTP/gRPC services, variable traffic, scales to zero |
| **Cloud Run Functions** | FaaS | Single-purpose event-driven tasks, Pub/Sub/Storage triggers |
| **Cloud VMware Engine** | Managed VMware | Migrate existing VMware workloads without re-architecture |

## Decision Guide

**"Full control over the OS / kernel"**
→ **Compute Engine.** Needed for legacy apps, licensing-tied software, GPU workloads, or Windows-specific dependencies.

**"Run containers, but I want to manage the nodes myself"**
→ **GKE Standard.** Gives you control over node pools, machine types, and OS images.

**"Run containers without managing nodes or VMs"**
→ **GKE Autopilot.** Google manages node provisioning; you define pod specs. Billed per pod CPU/memory, not per node.

**"Kubernetes that spans on-premises and GCP under one control plane"**
→ **GKE Enterprise (formerly Anthos).** Unified fleet management, policy enforcement, and service mesh across clusters in any location. Required when the case study mentions *hybrid Kubernetes* or *consistent policy across environments*.

**"Stateless HTTP microservice with variable or spiky traffic"**
→ **Cloud Run.** Scales to zero, no idle cost, request-based billing. Supports containers up to 32GB RAM.

**"Trigger a function in response to a cloud event (Pub/Sub message, file upload, HTTP)"**
→ **Cloud Run Functions.** Best for lightweight event handlers, glue code, and webhooks.

**"Lift VMware workloads to GCP with zero code changes"**
→ **Cloud VMware Engine (GCVE).** Runs VMware vSphere natively on GCP hardware.

## GKE Autopilot vs Standard — Key Differences

| | Autopilot | Standard |
|---|---|---|
| Node management | Google | You |
| Billing | Per pod | Per node |
| Node customisation | Limited | Full |
| Cost at low utilisation | Lower | Higher (pay for idle nodes) |
| Cost at high utilisation | Can be higher | Predictable |

## Spot and Preemptible VMs

- **Spot VMs** — up to 91% cheaper; can be preempted with 30s notice. Use for fault-tolerant batch jobs, Dataflow workers, ML training.
- **Preemptible VMs** — older version of Spot; max 24-hour lifetime. Being phased out in favour of Spot VMs.
- Do **not** use for: databases, stateful services, anything requiring guaranteed uptime.

## Official Documentation

- [Compute Engine overview](https://cloud.google.com/compute/docs/overview)
- [GKE overview](https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview)
- [GKE Autopilot overview](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview)
- [GKE Enterprise / Anthos](https://cloud.google.com/anthos/docs/concepts/overview)
- [Cloud Run overview](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Cloud Run Functions overview](https://cloud.google.com/functions/docs/concepts/overview)
- [Cloud VMware Engine](https://cloud.google.com/vmware-engine/docs/overview)
- [Spot VMs](https://cloud.google.com/compute/docs/instances/spot)
