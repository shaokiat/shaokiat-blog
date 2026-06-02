---
title: Database Selection
sidebar_label: Database Selection
sidebar_position: 3
---

# Database Selection

> Docs: [Choose a database](https://cloud.google.com/products/databases)

## Options at a Glance

| Service | Type | Best For |
|---|---|---|
| **Cloud SQL** | Managed relational (MySQL, Postgres, SQL Server) | Standard OLTP, regional, < ~64TB |
| **Cloud Spanner** | Distributed relational (proprietary) | Global OLTP, strong consistency, horizontal scale |
| **AlloyDB** | Managed Postgres-compatible | High-performance OLTP + analytics on Postgres |
| **Cloud Bigtable** | NoSQL wide-column | High-throughput time-series, IoT, sub-10ms reads at petabyte scale |
| **Firestore** | NoSQL document | Mobile/web apps, real-time sync, hierarchical data |
| **BigQuery** | Serverless analytics DWH | SQL analytics, ML, not for OLTP |
| **Memorystore (Redis / Valkey)** | In-memory cache | Session data, leaderboards, rate limiting, sub-ms reads |
| **Spanner Graph** | Graph + relational | Fraud detection, knowledge graphs, relationship traversal |

## Decision Guide

**"Relational database, single region, standard workload"**
→ **Cloud SQL.** Drop-in replacement for MySQL/Postgres/SQL Server. Supports read replicas and cross-region replicas for DR.

**"Global relational database with strong consistency and horizontal scale"**
→ **Cloud Spanner.** The answer when the exam says *global*, *multi-region*, or *strongly consistent at scale*. Expensive — don't recommend it for single-region workloads.

**"High-performance Postgres with built-in HTAP (analytics on live data)"**
→ **AlloyDB.** Up to 4× faster than Cloud SQL for OLTP, with a columnar engine for analytics queries on the same data.

**"High-throughput writes and reads on time-series / IoT sensor data"**
→ **Cloud Bigtable.** Designed for billions of rows with consistent sub-10ms latency. Schema design matters — rows are keyed by a single row key; design it to avoid hotspots.

**"Mobile or web app that needs real-time data sync"**
→ **Firestore.** Offline support, real-time listeners, and a document model suit client-side apps well.

**"Analytical queries over large historical datasets"**
→ **BigQuery.** Not an OLTP database — no row-level transactions. Optimised for full-table scans and aggregations.

**"Reduce database load for frequently read data (sessions, cart, counters)"**
→ **Memorystore (Redis).** Sub-millisecond reads from memory. Use it as a cache in front of Cloud SQL or Spanner, not as primary storage.

## Cloud SQL vs Cloud Spanner — When to Choose

| Factor | Cloud SQL | Cloud Spanner |
|---|---|---|
| Consistency | Strong (single-region) | Strong (globally) |
| Scale | Vertical + read replicas | Horizontal (automatic) |
| Regions | Single primary region | Multi-region natively |
| Cost | Lower | Significantly higher |
| Use when | Standard app DB | Global app, can't accept regional failover lag |

## Bigtable Row Key Design

Bigtable performance depends entirely on row key design. Common patterns:
- **Reverse domain** (`com.example.user`) — avoids hotspots
- **Salted prefix** — distribute writes across tablets
- **Avoid monotonically increasing keys** (timestamps as-is) — causes write hotspots on the last tablet

> See: [Bigtable schema design best practices](https://cloud.google.com/bigtable/docs/schema-design)

## Official Documentation

- [Cloud SQL overview](https://cloud.google.com/sql/docs/introduction)
- [Cloud Spanner overview](https://cloud.google.com/spanner/docs/overview)
- [AlloyDB overview](https://cloud.google.com/alloydb/docs/overview)
- [Cloud Bigtable overview](https://cloud.google.com/bigtable/docs/overview)
- [Firestore overview](https://cloud.google.com/firestore/docs/overview)
- [BigQuery overview](https://cloud.google.com/bigquery/docs/introduction)
- [Memorystore for Redis overview](https://cloud.google.com/memorystore/docs/redis/redis-overview)
- [Database migration guide](https://cloud.google.com/architecture/migration-to-gcp-getting-started)
