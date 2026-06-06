---
title: Backup, Recovery, and Data Transfer
sidebar_label: Backup & Data Transfer
sidebar_position: 9
---

# Backup, Recovery, and Data Transfer

> Docs: [Google Cloud backup and DR](https://cloud.google.com/backup-disaster-recovery/docs/concepts/backup-dr)

## Backup by Service

| Service | Backup Mechanism |
|---|---|
| **Compute Engine** | Persistent disk snapshots (manual or scheduled) |
| **Cloud SQL** | Automated daily backups + on-demand backups; point-in-time recovery (PITR) via binary logs |
| **Cloud Spanner** | Managed backups (up to 7 days by default); import/export to Cloud Storage |
| **Bigtable** | Managed backups within an instance; export to Cloud Storage via Dataflow |
| **Firestore** | Managed exports to Cloud Storage; scheduled backups (preview) |
| **GKE** | Backup for GKE — backs up workload state and PersistentVolumes to Cloud Storage |

## Compute Engine Snapshots

Snapshots are incremental, stored in Cloud Storage, and can be used to restore a disk or create new VM images.

- **Scheduled snapshots** — define a snapshot schedule policy attached to a disk; automates retention
- **Snapshot chains** — only changed blocks are stored after the first full snapshot
- Cross-region snapshots for DR — store snapshot in a different region from the source disk

> Docs: [Persistent disk snapshots](https://cloud.google.com/compute/docs/disks/snapshots)

## Cloud SQL Backup and PITR

- Automated backups run daily in a configurable window; retained for up to 365 days
- **Point-in-time recovery (PITR)** — restore to any second within the retention window using binary logs; enabled by default on Cloud SQL for MySQL and Postgres
- Cross-region replicas can be promoted to primary in a DR scenario

> Docs: [Cloud SQL backups](https://cloud.google.com/sql/docs/mysql/backup-recovery/backups)

## Cloud Backup and DR Service

A managed service for centralised backup policy management across GCE VMs, databases (SQL Server, MySQL, SAP HANA), VMware, and GKE.

Use when: you need **centralised backup governance** across multiple services and teams rather than configuring backups service-by-service.

> Docs: [Backup and DR Service](https://cloud.google.com/backup-disaster-recovery/docs/concepts/backup-dr)

---

## Data Transfer Services

For moving large volumes of data *into* GCP.

| Service | Best For | How It Works |
|---|---|---|
| **Storage Transfer Service** | Online transfer from S3, Azure Blob, HTTP/HTTPS sources, or another GCS bucket | Managed transfer jobs; scheduled or one-time; handles large datasets over the network |
| **Transfer Appliance** | Offline transfer of very large datasets (hundreds of TB to PB) | Google ships a physical appliance; you load data locally, ship it back; Google uploads to GCS |
| **BigQuery Data Transfer Service** | Scheduled imports into BigQuery from SaaS sources (Google Ads, YouTube, Salesforce, S3, Redshift) | Connector-based; no pipeline code required |
| **gsutil / gcloud storage** | Ad-hoc transfers, scripted migrations, small-to-medium datasets | CLI tools; parallelised with `-m` flag |
| **Datastream** | CDC (Change Data Capture) from MySQL, Postgres, Oracle, SQL Server into BigQuery or GCS | Real-time replication of database changes; no batch jobs |

### Choosing a Transfer Service

**"Migrate data from AWS S3 or Azure Blob to GCS"**
→ **Storage Transfer Service.** Handles authentication to source cloud, parallel transfers, and scheduling.

**"Petabyte-scale migration with limited bandwidth"**
→ **Transfer Appliance.** Network transfer of PBs would take months; physical appliance is faster.

**"Keep BigQuery in sync with a SaaS tool like Google Ads or Salesforce"**
→ **BigQuery Data Transfer Service.** Pre-built connectors; no custom pipeline needed.

**"Replicate production database changes in real time to BigQuery for analytics"**
→ **Datastream.** CDC-based replication preserves change history and avoids full re-exports.

> Docs: [Storage Transfer Service](https://cloud.google.com/storage-transfer/docs/overview)  
> Docs: [Transfer Appliance](https://cloud.google.com/transfer-appliance/docs/4.0/overview)  
> Docs: [BigQuery Data Transfer Service](https://cloud.google.com/bigquery/docs/dts-introduction)  
> Docs: [Datastream overview](https://cloud.google.com/datastream/docs/overview)

## Official Documentation

- [Backup and DR Service](https://cloud.google.com/backup-disaster-recovery/docs/concepts/backup-dr)
- [Persistent disk snapshots](https://cloud.google.com/compute/docs/disks/snapshots)
- [Cloud SQL backups](https://cloud.google.com/sql/docs/mysql/backup-recovery/backups)
- [Storage Transfer Service](https://cloud.google.com/storage-transfer/docs/overview)
- [Transfer Appliance](https://cloud.google.com/transfer-appliance/docs/4.0/overview)
- [BigQuery Data Transfer Service](https://cloud.google.com/bigquery/docs/dts-introduction)
- [Datastream overview](https://cloud.google.com/datastream/docs/overview)
