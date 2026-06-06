---
title: Observability
sidebar_label: Observability
sidebar_position: 17
---

# Observability

> Docs: [Google Cloud Observability overview](https://cloud.google.com/stackdriver/docs)

## The Three Pillars of Observability

| Pillar | GCP Service | What It Answers |
|---|---|---|
| **Metrics** | Cloud Monitoring | Is the system healthy? How is it performing? |
| **Logs** | Cloud Logging | What happened, and when? |
| **Traces** | Cloud Trace | Where is the latency in a request? |

Cloud Profiler (CPU/memory profiling) and Error Reporting add depth beyond the three pillars.

## Cloud Monitoring

Collects metrics from GCP services, VMs, Kubernetes, and custom applications. Key concepts:

- **Metrics** — time-series data (CPU utilisation, request count, latency). GCP services emit metrics automatically; custom metrics via the Monitoring API or OpenTelemetry.
- **Dashboards** — visualise metrics; pre-built dashboards for GCE, GKE, Cloud SQL, etc.
- **Uptime checks** — probe an HTTP/HTTPS/TCP endpoint at regular intervals; alert if it fails
- **Managed Service for Prometheus** — run Prometheus-compatible monitoring inside GKE without managing the Prometheus server

> Docs: [Cloud Monitoring overview](https://cloud.google.com/monitoring/docs/monitoring-overview)

## Cloud Logging

Centralised log management for all GCP services and custom applications.

**Log buckets** — logs are stored in named buckets with configurable retention (1–3650 days). Default buckets: `_Required` (400-day retention, cannot be changed) and `_Default` (30-day retention, configurable).

**Log sinks** — export logs to other destinations:
- **Cloud Storage** — long-term archival
- **BigQuery** — SQL analysis over log data
- **Pub/Sub** — stream logs to external SIEM (Splunk, Datadog)
- **Another log bucket** — centralise logs across projects

**Log-based metrics** — create custom Monitoring metrics from log patterns (e.g. count of `ERROR` log entries per minute).

**Log exclusion filters** — reduce log ingestion costs by dropping high-volume, low-value logs before they are stored.

> Docs: [Cloud Logging overview](https://cloud.google.com/logging/docs/overview)

## Cloud Trace

Distributed tracing service that tracks requests as they flow through microservices.

- Automatically instruments App Engine, Cloud Run, and Cloud Functions
- Manual instrumentation via OpenTelemetry SDK for other services
- Shows end-to-end latency breakdown per service call
- Identifies which service in a chain is causing tail latency

> Docs: [Cloud Trace overview](https://cloud.google.com/trace/docs/overview)

## Cloud Profiler

Continuous CPU and memory profiling of production applications with minimal overhead (~0.5% CPU).

- Flame graphs show which functions consume the most CPU or allocate the most memory
- Supports Go, Java, Node.js, Python
- No restarts required — attaches to a running application

> Docs: [Cloud Profiler overview](https://cloud.google.com/profiler/docs/about-profiler)

## Error Reporting

Aggregates and deduplicates application errors from Cloud Logging. Groups stack traces into error groups, shows occurrence count and affected users, and can alert on new errors.

> Docs: [Error Reporting overview](https://cloud.google.com/error-reporting/docs/overview)

## SLI, SLO, and SLA

| Term | Definition | Example |
|---|---|---|
| **SLI** (Service Level Indicator) | A measurable metric that quantifies reliability | 99th-percentile latency; request success rate |
| **SLO** (Service Level Objective) | The target value or range for an SLI | 99.9% of requests succeed; p99 latency < 500ms |
| **SLA** (Service Level Agreement) | A contractual commitment; breach triggers penalties | Customer receives a credit if monthly uptime < 99.9% |
| **Error budget** | The allowed failure headroom implied by the SLO | At 99.9% SLO, you have 43.8 min/month of allowed downtime |

**Error budgets drive engineering decisions:**
- Error budget healthy → can take risks (deploy more often, run experiments)
- Error budget depleted → freeze risky changes; prioritise reliability work

## Alerting

**Alert policies** define the condition (metric threshold, log match) and the notification channel (email, PagerDuty, Pub/Sub, Slack).

**Burn rate alerts** — instead of alerting when SLO is breached (too late), alert when error budget is being consumed *faster than expected*:
- A burn rate of 1 = consuming budget at exactly the sustainable rate
- A burn rate of 14.4 over 1 hour = budget depleted in 5 days → page immediately
- Common pattern: fast burn (1h window, high multiplier) + slow burn (6h window, lower multiplier)

> Docs: [SLO monitoring and burn rate alerts](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/alerting-on-budget-burn-rate)

## Exam Tips

- "Unified observability across GCP and on-premises Prometheus" → **Managed Service for Prometheus**
- "Export logs to an external SIEM" → **Log sink → Pub/Sub** → SIEM (not a direct integration)
- "Alert before the SLO is breached" → **burn rate alert**, not threshold on the SLI metric
- "Analyse logs with SQL" → **Log sink → BigQuery**
- Cloud Trace is for **latency** (where is the slowness?); Cloud Profiler is for **resource usage** (what is consuming CPU/memory?)

## Official Documentation

- [Cloud Monitoring overview](https://cloud.google.com/monitoring/docs/monitoring-overview)
- [Cloud Logging overview](https://cloud.google.com/logging/docs/overview)
- [Cloud Trace overview](https://cloud.google.com/trace/docs/overview)
- [Cloud Profiler overview](https://cloud.google.com/profiler/docs/about-profiler)
- [SLO monitoring](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring)
- [Burn rate alerting](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/alerting-on-budget-burn-rate)
- [Managed Service for Prometheus](https://cloud.google.com/stackdriver/docs/managed-prometheus)
