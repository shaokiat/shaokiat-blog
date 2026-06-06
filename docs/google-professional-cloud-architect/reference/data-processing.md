---
title: Data Processing and Pipelines
sidebar_label: Data Processing
sidebar_position: 12
---

# Data Processing and Pipelines

> Docs: [Data analytics products](https://cloud.google.com/products/data-analytics)

## Services at a Glance

| Service | Type | Best For |
|---|---|---|
| **Pub/Sub** | Messaging / event streaming | Decoupling services, ingesting high-volume event streams |
| **Dataflow** | Stream + batch processing | Managed Apache Beam pipelines; unified streaming/batch |
| **Dataproc** | Managed Hadoop/Spark | Existing Spark/Hadoop workloads, ML with Spark MLlib |
| **BigQuery** | Analytics data warehouse | SQL analytics, reporting, ML on large datasets |
| **Eventarc** | Event routing | Trigger Cloud Run / Cloud Functions from GCP events |
| **Looker / Looker Studio** | BI and visualisation | Dashboards and reports on BigQuery or other sources |

## Pub/Sub

Fully managed, globally distributed messaging service. Producers publish messages to a **topic**; consumers receive them via a **subscription**.

**Push vs Pull subscriptions:**
- **Pull** — consumer calls the API to retrieve messages. Suitable for batch consumers or when the consumer controls the rate.
- **Push** — Pub/Sub delivers messages to a specified HTTPS endpoint (e.g. Cloud Run URL). Suitable for event-driven serverless architectures.

**Key properties:**
- At-least-once delivery by default; **exactly-once delivery** available on pull subscriptions
- **Message ordering** — enable ordering keys to guarantee ordered delivery per key
- **Dead-letter topics** — messages that fail after N delivery attempts are forwarded to a DLT for inspection
- **Pub/Sub Lite** — cheaper, zonal, lower durability; use only for very high throughput workloads where you can tolerate occasional message loss

> Docs: [Pub/Sub overview](https://cloud.google.com/pubsub/docs/overview)

## Dataflow

Managed execution environment for **Apache Beam** pipelines. The same pipeline code runs in both streaming and batch modes — you change the runner, not the logic.

- **Streaming** — continuous processing of unbounded data (e.g. IoT telemetry, clickstreams)
- **Batch** — finite dataset processing (e.g. nightly ETL, log analysis)
- Autoscales workers based on throughput; no cluster to manage
- **Dataflow templates** — pre-built pipelines for common patterns (Pub/Sub → BigQuery, GCS → BigQuery, etc.)
- **Windowing** — group streaming events by time windows (tumbling, sliding, session) for aggregations

**Use over Dataproc when:** You are building new pipelines, want fully managed autoscaling, or need a unified streaming + batch model.

> Docs: [Dataflow overview](https://cloud.google.com/dataflow/docs/overview)

## Dataproc

Managed Hadoop and Spark clusters. Spin up in ~90 seconds; pay only while the cluster runs.

- **Use when:** You have existing Spark or Hadoop jobs, use Spark MLlib, or need Hive, Pig, or Presto
- **Use Dataflow instead when:** You are writing new pipelines and don't need the Spark ecosystem
- **Ephemeral clusters** — spin up, run a job, shut down. More cost-effective than long-running clusters.
- Integrates with Cloud Storage (as HDFS replacement), BigQuery, and Dataproc Metastore (Hive-compatible)

> Docs: [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)

## BigQuery

Serverless, columnar analytics data warehouse. Separates compute from storage — you pay for queries and storage independently.

**Key features:**
- **Partitioning** — divide tables by date/timestamp or integer range to reduce query cost (only relevant partitions scanned)
- **Clustering** — sort data within partitions by one or more columns; improves filter and aggregation performance
- **Streaming inserts** — write rows in real time (via Pub/Sub → Dataflow → BigQuery or direct API)
- **BigQuery ML** — train and run ML models with SQL; no data movement to Vertex AI needed for simple models
- **External tables** — query data in Cloud Storage, Google Sheets, or Bigtable without loading it into BigQuery

> Docs: [BigQuery overview](https://cloud.google.com/bigquery/docs/introduction)

## Eventarc

Routes events from GCP services (Cloud Storage, Pub/Sub, Cloud Audit Logs, etc.) to event consumers (Cloud Run, Cloud Run Functions, GKE workflows) without custom polling or glue code.

**Use when:** You want to trigger a Cloud Run service when a file lands in Cloud Storage, or when a BigQuery job completes, without writing a Pub/Sub subscriber yourself.

> Docs: [Eventarc overview](https://cloud.google.com/eventarc/docs/overview)

## Common Pipeline Patterns

**IoT / real-time telemetry:**
```
Device → Pub/Sub → Dataflow (stream) → Bigtable (low-latency reads)
                                     → BigQuery (analytics)
```

**Batch ETL / data warehouse load:**
```
Cloud Storage → Dataflow (batch) → BigQuery
Cloud Storage → BigQuery load job (simpler, no transformation)
```

**Event-driven microservices:**
```
Service A → Pub/Sub topic → Pub/Sub push subscription → Cloud Run (Service B)
```

**CDC (database replication):**
```
Cloud SQL / Postgres → Datastream → BigQuery (real-time analytics replica)
```

## Exam Tips

- "Unified streaming and batch" → **Dataflow** (Apache Beam)
- "Existing Spark jobs" → **Dataproc**
- "High-throughput event ingestion" → **Pub/Sub**
- "Trigger Cloud Run on a GCS file upload" → **Eventarc** (not a custom Pub/Sub subscriber)
- BigQuery is **not** for OLTP — no row-level transactions, optimised for full-table scans

## Official Documentation

- [Pub/Sub overview](https://cloud.google.com/pubsub/docs/overview)
- [Dataflow overview](https://cloud.google.com/dataflow/docs/overview)
- [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)
- [BigQuery overview](https://cloud.google.com/bigquery/docs/introduction)
- [Eventarc overview](https://cloud.google.com/eventarc/docs/overview)
