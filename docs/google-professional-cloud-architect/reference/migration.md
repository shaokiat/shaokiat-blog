---
title: Migration Strategies and Tools
sidebar_label: Migration
sidebar_position: 13
---

# Migration Strategies and Tools

> Docs: [Migration to Google Cloud](https://cloud.google.com/architecture/migration-to-gcp-getting-started)

## Migration Strategies (The 4Rs)

| Strategy | What It Means | When to Use |
|---|---|---|
| **Rehost** (Lift and Shift) | Move workloads to GCP with no changes — same OS, same app, same config | Speed is the priority; modernisation can come later |
| **Replatform** (Lift and Reshape) | Minor changes to take advantage of managed services — e.g. move from self-managed MySQL to Cloud SQL | Reduce ops overhead without rewriting the app |
| **Refactor / Re-architect** | Redesign the app for cloud-native patterns — containers, microservices, serverless | Long-term cost and scalability benefits; requires significant investment |
| **Retire / Replace** | Decommission the workload or replace with a SaaS product | No longer needed, or a better SaaS alternative exists |

**Exam signal:** "Minimise migration effort / time" → Rehost. "Reduce long-term ops overhead" → Replatform. "Scale globally / modernise architecture" → Refactor.

## Migration Phases

```
Assess → Plan → Migrate → Optimise
```

1. **Assess** — discover and inventory workloads; evaluate dependencies, licensing, and TCO
2. **Plan** — define migration waves, network topology, identity federation, landing zone
3. **Migrate** — execute migrations service by service; validate in parallel
4. **Optimise** — right-size, apply CUDs, implement monitoring, improve architecture

## Migration Tools

### Google Cloud Migration Center

Centralised platform for discovering, assessing, and planning migrations. Collects inventory from on-premises systems and provides:
- Dependency mapping between workloads
- Fit assessment for GCP (suitability for different migration strategies)
- TCO and cost estimates for GCP alternatives

> Docs: [Migration Center overview](https://cloud.google.com/migration-center/docs/migration-center-overview)

### Migrate for Compute Engine (formerly Velostrata)

Migrates VMware, physical, and cloud VMs to Compute Engine with minimal downtime. Supports:
- **Test clones** — spin up a GCE copy of the VM for testing without cutting over
- **Cutover** — switch production traffic to GCE; the source VM is the fallback

> Docs: [Migrate for Compute Engine](https://cloud.google.com/migrate/compute-engine/docs/4.11/concepts/overview)

### Database Migration Service (DMS)

Managed, minimal-downtime database migrations to Cloud SQL and AlloyDB. Supports:
- MySQL → Cloud SQL for MySQL
- Postgres → Cloud SQL for Postgres / AlloyDB
- SQL Server → Cloud SQL for SQL Server
- Uses CDC (Change Data Capture) to keep source and destination in sync during migration; cutover when lag is near zero

> Docs: [Database Migration Service](https://cloud.google.com/database-migration/docs/overview)

### BigQuery Migration Service

Migrates data warehouse workloads to BigQuery:
- **Schema and data migration** from Teradata, Redshift, Snowflake, Hive
- **SQL translation** — converts Teradata SQL, HiveQL, or Redshift SQL to BigQuery SQL syntax

> Docs: [BigQuery Migration Service](https://cloud.google.com/bigquery/docs/migration-intro)

### Migrate to Containers (Migrate for Anthos)

Converts existing VMs (VMware, GCE, AWS, Azure) into containers running on GKE. Extracts the app layer from the VM without rewriting code.

> Docs: [Migrate to Containers overview](https://cloud.google.com/migrate/containers/docs/concepts/overview)

## Landing Zone

A **landing zone** is a pre-configured GCP environment (org structure, networking, IAM, billing) that workloads migrate into. Defined using Terraform (often using the [Cloud Foundation Fabric](https://github.com/GoogleCloudPlatform/cloud-foundation-fabric) or [Terraform Example Foundation](https://github.com/terraform-google-modules/terraform-example-foundation)).

Key decisions in a landing zone:
- Resource hierarchy (folders for environments, BUs, or both)
- Shared VPC topology
- Identity and federation (Cloud Identity, Workload Identity Federation)
- Logging and monitoring setup

## Exam Tips

- "Minimal downtime database migration" → **Database Migration Service** (CDC-based cutover)
- "Assess dependencies before migrating" → **Migration Center**
- "Migrate VMs to GCE with testing" → **Migrate for Compute Engine**
- "Move VMs to containers" → **Migrate to Containers**
- Questions about migration strategy almost always have a "rehost first, modernise later" correct answer when time is constrained

## Official Documentation

- [Migration to Google Cloud overview](https://cloud.google.com/architecture/migration-to-gcp-getting-started)
- [Migration Center overview](https://cloud.google.com/migration-center/docs/migration-center-overview)
- [Migrate for Compute Engine](https://cloud.google.com/migrate/compute-engine/docs/4.11/concepts/overview)
- [Database Migration Service](https://cloud.google.com/database-migration/docs/overview)
- [BigQuery Migration Service](https://cloud.google.com/bigquery/docs/migration-intro)
