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

## Shared VPC

Shared VPC lets a *host project* own and manage the VPC network while *service projects* use subnets from it. All firewall rules, routes, and peering are managed centrally.

**Use when:** Multiple teams or projects need network resources but network management must be centralised (e.g., a platform team owns networking; product teams deploy workloads).

> Docs: [Shared VPC overview](https://cloud.google.com/vpc/docs/shared-vpc)

## VPC Peering

Connects two VPCs (same or different org) so resources can communicate using internal IPs. Not transitive — if A peers with B and B peers with C, A cannot reach C.

**Use when:** Two separate VPCs need private connectivity without routing through a gateway. IP ranges must not overlap.

> Docs: [VPC Network Peering](https://cloud.google.com/vpc/docs/vpc-peering)

## GKE Enterprise (Anthos) — Hybrid Kubernetes

GKE Enterprise (formerly Anthos) provides a unified control plane for Kubernetes clusters running anywhere: GCP, on-premises, other clouds.

**Key capabilities:**
- **Fleet management** — register clusters from any location into a single fleet
- **Config Sync** — GitOps-based policy and config delivery to all clusters
- **Policy Controller** — enforce security and compliance policies (based on OPA/Gatekeeper)
- **Anthos Service Mesh** — mTLS, traffic management, and observability across clusters
- **Connect Gateway** — access on-prem cluster API servers through GCP

**Use when:** The case study requires *Kubernetes both on-premises and in the cloud* with consistent policy enforcement, not two independently managed clusters.

> Docs: [GKE Enterprise overview](https://cloud.google.com/anthos/docs/concepts/overview)

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
