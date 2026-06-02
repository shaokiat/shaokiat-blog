---
title: KnightMotives Automotive
sidebar_label: KnightMotives Automotive
sidebar_position: 4
---

# Case Study: KnightMotives Automotive

## Company Overview

KnightMotives Automotive is a vehicle manufacturer building a connected vehicle platform. Their vehicles generate continuous telemetry from onboard sensors, and the company wants to use this data to offer predictive maintenance services, improve vehicle safety, and develop new software-defined vehicle features delivered over-the-air (OTA).

## Business Requirements

- Reduce vehicle downtime through predictive maintenance and proactive alerts
- Deliver new vehicle features and safety updates via OTA software updates
- Build a developer platform that enables third-party partners to create in-vehicle applications
- Improve customer satisfaction through personalised in-vehicle experiences
- Reduce warranty costs by detecting and resolving issues before they escalate
- Ensure data privacy and compliance with automotive regulations across global markets

## Technical Requirements

- Ingest high-volume, low-latency telemetry from millions of connected vehicles
- Support both real-time streaming (connected) and batch upload (intermittently connected) vehicles
- Process and store telemetry data for ML model training and real-time anomaly detection
- Deliver OTA updates reliably and safely to vehicles globally
- Expose a managed API platform for third-party developers
- Ensure secure, authenticated communication between vehicles and the cloud backend

## Key Architecture Considerations

### Vehicle Telemetry Ingestion
→ Reference: [Cloud Storage](../reference/cloud-storage.md)

- **Pub/Sub** for high-throughput, durable ingestion of real-time vehicle telemetry
- **Cloud IoT / MQTT broker** for authenticated device-to-cloud communication
- **Cloud Storage** as the landing zone for batch telemetry uploads from intermittently connected vehicles
- **Dataflow** for both streaming (real-time) and batch processing pipelines

### Data Storage and Analytics
→ Reference: [Database Selection](../reference/database-selection.md)

- **Bigtable** for low-latency time-series sensor data (sub-10ms reads for real-time anomaly detection)
- **BigQuery** as the analytics warehouse for historical telemetry, warranty analysis, and ML training datasets
- **Cloud Storage** as the raw data lake (long-term retention — use lifecycle policies to Archive)

### Predictive Maintenance (ML)
→ Reference: [Vertex AI & Generative AI](../reference/vertex-ai-genai.md)

- **Vertex AI Pipelines** for end-to-end ML lifecycle: data prep, training, evaluation, deployment
- **AI Hypercomputer / TPUs** for large-scale model training on vehicle sensor data
- **Vertex AI** model serving for real-time failure prediction and anomaly scoring
- **BigQuery ML** for simpler analytical models directly on the warehouse

### OTA Update Delivery
→ Reference: [Networking Services](../reference/networking-services.md)

- **Cloud Storage** for hosting OTA update packages
- **Cloud CDN** for globally distributed, low-latency delivery of large firmware packages
- Phased rollout strategy: canary → staged → full fleet

### Developer API Platform
→ Reference: [Networking Services — Apigee](../reference/networking-services.md#api-management-apigee-vs-api-gateway-vs-cloud-endpoints)

- **Apigee** for enterprise-grade API management: authentication, rate limiting, quotas, developer portal
- Separate API products for internal teams, OEM partners, and third-party developers

### Security and Compliance
→ Reference: [Security Controls](../reference/security-controls.md)

- **Workload Identity Federation** for authenticating vehicles without long-lived credentials
- **Cloud KMS** for encrypting sensitive telemetry and PII at rest
- **VPC Service Controls** to isolate vehicle data from other workloads
- **IAM** with least-privilege roles per team and partner
- Data sovereignty org policies for regions with strict automotive data regulations

## Exam Tips

- High-volume IoT telemetry = **Pub/Sub** (ingest) → **Bigtable** (real-time reads) + **BigQuery** (analytics)
- Real-time + batch hybrid ingest = Pub/Sub (streaming) + Cloud Storage batch upload, both → Dataflow
- Predictive maintenance = **Vertex AI Pipelines** + AI Hypercomputer for training
- OTA global delivery of large files = **Cloud Storage + Cloud CDN**
- Third-party developer API access = **Apigee** (enterprise answer when partner portals are mentioned)
- Vehicle authentication without long-lived keys = **Workload Identity Federation**
