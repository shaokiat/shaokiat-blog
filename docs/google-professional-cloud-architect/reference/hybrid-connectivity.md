---
title: Hybrid Connectivity
sidebar_label: Hybrid Connectivity
sidebar_position: 4
---

# Hybrid Connectivity

> Docs: [Hybrid and multi-cloud networking overview](https://cloud.google.com/hybrid-connectivity)

## Connectivity Options at a Glance

| Option | Bandwidth | Latency | Path | SLA | Cost |
|---|---|---|---|---|---|
| **Cloud VPN (HA VPN)** | Up to 3 Gbps/tunnel | Variable | Public internet (encrypted) | 99.99% | Low |
| **Dedicated Interconnect** | 10 or 100 Gbps | Low, consistent | Private physical link | 99.99% | High |
| **Partner Interconnect** | 50 Mbps – 10 Gbps | Low | Via service provider | 99.99% (with redundant connections) | Medium |
| **Cross-Cloud Interconnect** | 10 or 100 Gbps | Low | Direct to another cloud | 99.99% | High |

## Decision Guide

**"Secure connectivity, limited budget, traffic not latency-sensitive"**
→ **HA VPN.** Two tunnels to a single Cloud VPN gateway for 99.99% SLA. Good for dev/test or smaller workloads.

**"High-throughput, consistent low-latency link to on-premises (e.g., data ingestion pipelines, healthcare SLAs)"**
→ **Dedicated Interconnect.** Direct physical connection to a Google peering facility. Use when VPN's variable latency or 3 Gbps cap is insufficient.

**"Need Interconnect but can't physically reach a Google peering facility"**
→ **Partner Interconnect.** Use a supported service provider. Flexible bandwidth tiers from 50 Mbps up.

**"Connecting GCP to AWS or Azure directly"**
→ **Cross-Cloud Interconnect.** Purpose-built for cloud-to-cloud private connectivity.

:::note Direct Peering
**Direct Peering** connects your network to Google's *public* network edge (PoPs) — it reaches Google Workspace, public APIs, and Google services only. It **cannot access your GCP VPC** and has no SLA. It is a common exam distractor; if the question involves on-prem to GCP VPC connectivity, always use Interconnect or VPN instead.
:::

## Choosing Between Dedicated and Partner Interconnect

Both provide private connectivity to your GCP VPC. The deciding factor is **physical colocation capability**.

| Question | Answer | Choose |
|---|---|---|
| Can you place your equipment in a [Google colocation facility](https://cloud.google.com/network-connectivity/docs/interconnect/concepts/choosing-colocation-facility)? | Yes | **Dedicated Interconnect** |
| Can you place your equipment in a [Google colocation facility](https://cloud.google.com/network-connectivity/docs/interconnect/concepts/choosing-colocation-facility)? | No | **Partner Interconnect** |
| Do you need > 10 Gbps per link? | Yes | **Dedicated Interconnect** (10 or 100 Gbps) |
| Do you need < 1 Gbps? | Yes | **Partner Interconnect** (50 Mbps – 10 Gbps tiers) |
| Is traffic volume / SLA requirement high but budget is a constraint? | Yes | **Partner Interconnect** (lower cost than Dedicated) |

**For healthcare / regulated workloads:** Either option keeps traffic off the public internet. Both satisfy HIPAA private connectivity requirements. Dedicated Interconnect is preferred when throughput and latency consistency are critical (e.g., large EHR record streaming pipelines).

## Shared VPC

Shared VPC lets a *host project* own and manage the VPC network while *service projects* use subnets from it. All firewall rules, routes, and peering are managed centrally.

**Use when:** Multiple teams or projects need network resources but network management must be centralised (e.g., a platform team owns networking; product teams deploy workloads).

> Docs: [Shared VPC overview](https://cloud.google.com/vpc/docs/shared-vpc)

## VPC Peering

Connects two VPCs (same or different org) so resources can communicate using internal IPs. Not transitive — if A peers with B and B peers with C, A cannot reach C.

**Use when:** Two separate VPCs need private connectivity without routing through a gateway. IP ranges must not overlap.

> Docs: [VPC Network Peering](https://cloud.google.com/vpc/docs/vpc-peering)

## GKE Enterprise (Anthos) — Managing GCP and AWS Clusters Together

GKE Enterprise (formerly Anthos) provides a **unified control plane** for Kubernetes clusters running anywhere — GCP, AWS, on-premises, or other clouds — managed from GCP.

### Two approaches for AWS clusters

| Approach | What it is | Control plane owner | When to use |
|---|---|---|---|
| **GKE Attached Clusters** | Register an existing EKS cluster into a GKE fleet | AWS (EKS manages the control plane) | You already have EKS and want fleet-level visibility, Config Sync, and Policy Controller without changing the cluster |
| **GKE on AWS** | GKE provisions and manages the full Kubernetes control plane on AWS EC2 nodes | GCP (GKE manages everything) | You want a fully GKE-managed cluster running on AWS infrastructure — same API as GKE on GCP |

**Exam signal:** "Existing EKS cluster" → **Attached Clusters**. "Provision a new cluster on AWS managed by GCP" → **GKE on AWS**.

### How to register an AWS cluster (Attached Clusters)

1. Enable the GKE Enterprise API in the GCP project
2. Register the EKS cluster into a **fleet** using `gcloud container attached clusters register` (or the console)
   - This installs the **Connect Agent** inside the EKS cluster — a lightweight workload that tunnels cluster API calls back to GCP
3. The cluster now appears in the GCP console under **Kubernetes Engine → Clusters**
4. Apply fleet features: Config Sync, Policy Controller, Cloud Logging/Monitoring

No network changes are required — the Connect Agent uses outbound HTTPS to reach GCP.

### What you can do once clusters are in the fleet

| Feature | What it does | Applied to |
|---|---|---|
| **Fleet management** | Single pane of glass — view all clusters (GKE + EKS) in one place | All registered clusters |
| **Config Sync** | Push Kubernetes manifests from a Git repo to every cluster automatically | All fleet clusters |
| **Policy Controller** | Enforce security/compliance policies (OPA/Gatekeeper) consistently across clouds | All fleet clusters |
| **Anthos Service Mesh** | mTLS, traffic management, and observability for services across clusters | Clusters with ASM installed |
| **Connect Gateway** | Access any fleet cluster's API server through GCP (no direct network path needed) | All registered clusters |
| **Cloud Logging / Monitoring** | Centralise logs and metrics from GKE and EKS into Cloud Operations | All fleet clusters |

### Full multi-cloud architecture

```
GCP Project (fleet host)
├── GKE cluster (GCP)          ← natively in fleet
├── GKE on AWS cluster         ← GKE-managed control plane on EC2
└── EKS cluster (Attached)     ← Connect Agent bridges to GCP
          ↑
   Config Sync syncs manifests from Git to all three clusters
   Policy Controller enforces the same RBAC + NetworkPolicy across all three
   Cloud Monitoring collects metrics from all three
```

**Use when the exam says:**
- "Manage GKE and EKS clusters with consistent policies" → **GKE Enterprise fleet + Policy Controller**
- "Deploy config changes to all clusters across clouds from a single place" → **Config Sync**
- "Unified observability for clusters in GCP and AWS" → **Cloud Monitoring + GKE Enterprise**
- "Register existing EKS without replacing it" → **GKE Attached Clusters**
- "Run a GKE cluster on AWS infrastructure" → **GKE on AWS**

> Docs: [GKE Enterprise overview](https://cloud.google.com/anthos/docs/concepts/overview)  
> Docs: [GKE Attached Clusters](https://cloud.google.com/kubernetes-engine/multi-cloud/docs/attached/eks/reference/supported-versions)  
> Docs: [GKE on AWS](https://cloud.google.com/kubernetes-engine/multi-cloud/docs/aws/concepts/about-aws)

## Redundancy Patterns for Dedicated Interconnect

For 99.99% SLA, Google requires:
- 2× Dedicated Interconnect connections
- In 2 different metropolitan areas (for metro-level redundancy)
- Each connection in a different colocation facility

A single Dedicated Interconnect connection provides 99.9% SLA only.

## Official Documentation

- [HA VPN overview](https://cloud.google.com/network-connectivity/docs/vpn/concepts/overview)
- [Dedicated Interconnect overview](https://cloud.google.com/network-connectivity/docs/interconnect/concepts/dedicated-overview)
- [Partner Interconnect overview](https://cloud.google.com/network-connectivity/docs/interconnect/concepts/partner-overview)
- [Choosing a hybrid connectivity product](https://cloud.google.com/hybrid-connectivity/docs/how-to/choose-product)
- [Shared VPC overview](https://cloud.google.com/vpc/docs/shared-vpc)
- [GKE Enterprise / Anthos overview](https://cloud.google.com/anthos/docs/concepts/overview)
- [GKE Attached Clusters (EKS)](https://cloud.google.com/kubernetes-engine/multi-cloud/docs/attached/eks/reference/supported-versions)
- [GKE on AWS](https://cloud.google.com/kubernetes-engine/multi-cloud/docs/aws/concepts/about-aws)
- [Fleet management overview](https://cloud.google.com/kubernetes-engine/docs/fleets-overview)
