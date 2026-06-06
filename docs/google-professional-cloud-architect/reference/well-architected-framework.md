---
title: Google Cloud Well-Architected Framework
sidebar_label: Well-Architected Framework
sidebar_position: 14
---

# Google Cloud Well-Architected Framework

> Docs: [Google Cloud Well-Architected Framework](https://cloud.google.com/architecture/framework)

The Well-Architected Framework provides guidance for designing, building, and operating cloud workloads. The PCA exam explicitly requires familiarity with its six pillars — they underpin every architectural decision.

## The Six Pillars

### 1. Operational Excellence
Design for automation, observability, and continuous improvement.

- Automate deployment, testing, and remediation (IaC, CI/CD)
- Invest in observability: metrics, logs, traces, alerts
- Use runbooks and post-mortems to systematically improve reliability
- Manage changes through version-controlled pipelines, not manual intervention

### 2. Security
Protect data, systems, and assets while meeting compliance requirements.

- Apply least-privilege IAM; use the resource hierarchy to enforce boundaries
- Encrypt data at rest (CMEK) and in transit (TLS)
- Use VPC Service Controls and org policies as preventive controls
- Continuously monitor with Security Command Center
- Secure the software supply chain (Binary Authorization, Artifact Registry)

### 3. Reliability
Ensure workloads perform their intended function correctly and consistently.

- Design for failure: multi-zone deployments, health checks, autohealing
- Define and measure SLIs/SLOs; use error budgets to balance velocity and stability
- Implement DR with defined RTO/RPO; test failover regularly
- Use chaos engineering and load testing to validate resilience

### 4. Performance Efficiency (Performance Optimization)
Use GCP resources efficiently and maintain performance as demand changes.

- Select the right compute type for the workload (GKE vs Cloud Run vs GCE)
- Use managed services to offload undifferentiated infrastructure management
- Cache aggressively (Cloud CDN, Memorystore) to reduce latency
- Autoscale to match supply with demand; avoid over-provisioning

### 5. Cost Optimization
Avoid unnecessary spend and maximise the value of every dollar.

- Right-size resources using Recommender
- Use Committed Use Discounts for predictable workloads; Spot VMs for fault-tolerant batch
- Implement billing exports to BigQuery and set budget alerts
- Apply labels consistently for cost allocation; review unattended projects

### 6. Sustainability
Minimise the environmental footprint of cloud workloads.

- Prefer managed services and serverless (Google handles hardware efficiency)
- Use carbon-free energy regions where possible (Cloud Region Picker)
- Right-size to avoid idle resources consuming energy
- Reduce data redundancy and unnecessary storage

## How the Pillars Appear in the Exam

The exam rarely tests a pillar in isolation — most questions implicitly require you to balance multiple pillars. Common trade-offs:

| Trade-off | Pillars in tension |
|---|---|
| Redundant multi-region deployment vs. cost | Reliability vs. Cost Optimization |
| Encrypting all data with CMEK vs. performance overhead | Security vs. Performance |
| Automated patching with brief restarts vs. uptime | Operational Excellence vs. Reliability |
| Spot VMs for batch jobs vs. job failure risk | Cost Optimization vs. Reliability |

When you see a question asking for the "most appropriate" architecture, the correct answer usually satisfies the **primary requirement** (e.g. security) without unnecessarily sacrificing a secondary pillar (e.g. adding CMEK when the question says cost is the top concern may be wrong).

## Official Documentation

- [Google Cloud Well-Architected Framework](https://cloud.google.com/architecture/framework)
- [Reliability pillar](https://cloud.google.com/architecture/framework/reliability)
- [Security pillar](https://cloud.google.com/architecture/framework/security)
- [Cost optimisation pillar](https://cloud.google.com/architecture/framework/cost-optimization)
- [Operational excellence pillar](https://cloud.google.com/architecture/framework/operational-excellence)
- [Performance optimisation pillar](https://cloud.google.com/architecture/framework/performance-optimization)
- [Sustainability pillar](https://cloud.google.com/architecture/framework/sustainability)
