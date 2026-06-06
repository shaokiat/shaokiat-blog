---
title: VPC and Firewall Design
sidebar_label: VPC & Firewall
sidebar_position: 8
---

# VPC and Firewall Design

> Docs: [VPC network overview](https://cloud.google.com/vpc/docs/vpc)

## VPC Fundamentals

A GCP VPC is **global** — a single VPC spans all regions. Subnets are **regional**, not zonal. Resources in different regions on the same VPC communicate privately without extra configuration.

Key properties:
- **Auto mode** — one subnet auto-created per region (`10.128.0.0/9`). Quick to set up, but limited control. Avoid in production.
- **Custom mode** — you define subnets, CIDR ranges, and regions. Required for production and Shared VPC.
- Subnets can have **secondary ranges** — used by GKE for Pod and Service IPs (alias IP ranges).

## Firewall Rules

GCP firewalls are **stateful** and applied at the VM network interface level, not at the subnet boundary.

| Property | Options |
|---|---|
| **Direction** | Ingress (inbound) or Egress (outbound) |
| **Action** | Allow or Deny |
| **Priority** | 0–65535 — lower number wins. Default rules are priority 65534/65535. |
| **Target** | All instances, network tag, or service account |
| **Source/Destination** | IP range, network tag, or service account |

**Network tags** are the most common targeting mechanism — attach a tag to a VM (e.g. `web-server`) and create firewall rules targeting that tag. More flexible than IP ranges when VMs scale dynamically.

**Service account targeting** — more secure than tags (tags can be self-assigned by any project member with the right IAM role; service accounts cannot).

## Hierarchical Firewall Policies

Defined at the **organisation or folder level** and applied down the resource hierarchy. Rules at a higher level take precedence and cannot be overridden by project-level rules.

Use for: enforcing baseline security rules across all projects (e.g. deny all ingress on port 22 from the internet at the org level, regardless of what individual teams configure).

> Docs: [Hierarchical firewall policies](https://cloud.google.com/vpc/docs/firewall-policies)

## Default Firewall Rules

Every new VPC includes these default rules (priority 65534):
- Allow ingress from all VMs in the same network (`10.128.0.0/9`)
- Allow ingress SSH (22) and RDP (3389) from anywhere — **remove these in production**
- Allow ingress ICMP from anywhere
- Deny all other ingress (priority 65535 — lowest priority, acts as implicit deny)

## VPC Flow Logs

Captures a sample of network flows (src/dst IP, port, protocol, bytes, packets) for VMs in a subnet. Used for:
- Network monitoring and troubleshooting
- Security forensics and anomaly detection
- Feeding into BigQuery or Chronicle for analysis

Enable per subnet. Does not capture all packets — uses sampling.

> Docs: [VPC Flow Logs](https://cloud.google.com/vpc/docs/flow-logs)

## Private Google Access

Allows VMs **without an external IP** to reach Google APIs and services (Cloud Storage, BigQuery, etc.) over internal IPs, without a NAT gateway or internet route.

Enable per subnet. Required if VMs are fully private but still need to call Google APIs.

> Docs: [Private Google Access](https://cloud.google.com/vpc/docs/private-google-access)

## Exam Tips

- "Enforce a firewall rule that cannot be overridden by individual teams" → **Hierarchical Firewall Policy** at org/folder level
- "VM needs to call Cloud Storage but has no public IP" → enable **Private Google Access** on the subnet (not Cloud NAT — NAT is for outbound internet, not Google APIs)
- Firewall rules are **not subnet-level** — they target VMs by tag or service account regardless of subnet
- Custom mode VPC is always the right answer for production — never recommend auto mode

## Official Documentation

- [VPC network overview](https://cloud.google.com/vpc/docs/vpc)
- [Firewall rules overview](https://cloud.google.com/vpc/docs/firewalls)
- [Hierarchical firewall policies](https://cloud.google.com/vpc/docs/firewall-policies)
- [VPC Flow Logs](https://cloud.google.com/vpc/docs/flow-logs)
- [Private Google Access](https://cloud.google.com/vpc/docs/private-google-access)
