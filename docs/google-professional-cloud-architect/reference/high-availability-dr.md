---
title: High Availability and Disaster Recovery
sidebar_label: HA & DR
sidebar_position: 11
---

# High Availability and Disaster Recovery

> Docs: [Disaster recovery planning guide](https://cloud.google.com/architecture/dr-scenarios-planning-guide)

## Key Definitions

| Term | Definition |
|---|---|
| **RTO** (Recovery Time Objective) | Maximum acceptable downtime — how long until the service must be restored |
| **RPO** (Recovery Point Objective) | Maximum acceptable data loss — how far back in time can you afford to lose data |
| **SLA** | Contractual uptime commitment made to customers |
| **Availability** | Expressed as a percentage; each additional "9" is 10× harder to achieve |

| Availability | Max downtime/year |
|---|---|
| 99% | ~87 hours |
| 99.9% | ~8.7 hours |
| 99.99% | ~52 minutes |
| 99.999% | ~5 minutes |

## HA: Zones vs Regions

- **Multi-zone** — deploy across 2–3 zones within the same region. Protects against single zone failure. Lower latency and cost.
- **Multi-region** — deploy across 2+ regions. Protects against full regional outage. Higher cost and latency.

Most applications need multi-zone for HA. Multi-region is required only when a regional GCP outage would breach SLA or compliance requirements.

## DR Standby Patterns

| Pattern | Description | RTO | RPO | Cost |
|---|---|---|---|---|
| **Cold standby** | Backup data exists; resources are not running. Restore from scratch on failure. | Hours | Hours | Lowest |
| **Warm standby** | Scaled-down replica running in a secondary region; promoted on failure. | Minutes | Minutes | Medium |
| **Hot standby** | Full-scale replica actively serving traffic; failover is instantaneous. | Seconds | Near-zero | Highest |

Choose cold when budget is the priority and RTO hours are acceptable. Choose hot only when the business requires near-zero downtime and cost is secondary.

## GCP HA Patterns by Service

| Service | HA Mechanism |
|---|---|
| **Compute Engine** | Regional MIG — spread instances across zones; autohealing replaces failed VMs |
| **Cloud SQL** | HA configuration — standby instance in a second zone; automatic failover in ~60s |
| **Cloud Spanner** | Multi-region config — synchronously replicated across regions; 99.999% SLA |
| **Cloud Storage** | Multi-region or dual-region buckets — data replicated across geographic locations |
| **GKE** | Regional cluster — control plane and nodes span 3 zones; nodes replaced automatically |
| **Cloud Run** | Global; automatically distributed across zones within a region |
| **Pub/Sub** | Fully managed; globally replicated by default |
| **BigQuery** | Geo-redundant by default within a multi-region location |

## Health Checks and Failover

- **Load balancer health checks** — LB removes unhealthy backends from the pool automatically
- **MIG autohealing health checks** — recreates VMs that fail the health check
- **Cloud SQL failover** — promoted automatically when primary fails; clients reconnect via the same connection string

## Cloud DNS and Failover Routing

Use **routing policies** on Cloud DNS to implement failover:
- **Failover policy** — primary/secondary records; secondary only active when primary health check fails
- **Weighted round-robin** — distribute traffic across multiple endpoints with configurable weights

> Docs: [Cloud DNS routing policies](https://cloud.google.com/dns/docs/configure-routing-policies)

## Exam Tips

- RTO = time to recover; RPO = data loss tolerance. Low RTO → warm/hot standby. Low RPO → synchronous replication (Spanner) or frequent snapshots.
- "99.99% SLA" across regions → **Cloud Spanner** multi-region or **Cloud Storage** multi-region; not Cloud SQL single-region (only 99.95%)
- Warm standby is the most common exam answer — balances cost with acceptable RTO/RPO
- Never use cold standby when RPO = zero; it always involves data loss

## Official Documentation

- [Disaster recovery planning guide](https://cloud.google.com/architecture/dr-scenarios-planning-guide)
- [Cloud SQL HA](https://cloud.google.com/sql/docs/mysql/high-availability)
- [GKE regional clusters](https://cloud.google.com/kubernetes-engine/docs/concepts/regional-clusters)
- [Cloud DNS routing policies](https://cloud.google.com/dns/docs/configure-routing-policies)
