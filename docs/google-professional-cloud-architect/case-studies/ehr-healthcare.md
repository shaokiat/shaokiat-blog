---
title: EHR Healthcare
sidebar_label: EHR Healthcare
sidebar_position: 3
---

# Case Study: EHR Healthcare

## Company Overview

EHR Healthcare is a leading provider of electronic health record software to the medical industry. They are currently hosting their software on-premises and need to migrate to Google Cloud to scale their business and comply with evolving regulations.

## Business Requirements

- Onboard new healthcare provider clients more quickly
- Provide a minimum 99.9% uptime SLA to clients
- Reduce operational costs with infrastructure that scales up/down based on demand
- Ensure compliance with HIPAA and other healthcare data regulations
- Expand into new geographic regions

## Technical Requirements

- Maintain legacy connections to on-premises systems during migration
- Provide consistent high-throughput connectivity between on-premises and GCP
- Provide data streaming ingest from legacy systems
- Provide self-service provisioning for development teams
- Create a unified logging platform for all systems
- Create an enterprise-grade disaster recovery plan with failover capability

## Key Architecture Considerations

### Compliance (HIPAA)
→ Reference: [Security Controls](../reference/security-controls.md)

- All PHI (Protected Health Information) must be encrypted at rest and in transit
- Use **Cloud KMS** with **CMEK** — customer must control the encryption keys
- Enable **Cloud Audit Logs (Data Access)** for all PHI-touching services
- Use **VPC Service Controls** to prevent data exfiltration
- **Cloud Healthcare API** for HL7v2 / FHIR data ingestion and storage

### Hybrid Connectivity
→ Reference: [Hybrid Connectivity](../reference/hybrid-connectivity.md)

- **Cloud Interconnect (Dedicated or Partner)** for consistent high-throughput on-prem connectivity — not Cloud VPN (too variable for healthcare SLA requirements)
- Use **Shared VPC** to centralise network management across environments

### High Availability and DR
→ Reference: [Database Selection](../reference/database-selection.md)

- Multi-regional deployment for 99.9%+ SLA
- **Cloud SQL** with read replicas and failover for relational data
- **Cloud Spanner** if strong consistency across regions is needed
- Define RTO/RPO targets and implement warm or hot standby

### Data Streaming
- **Pub/Sub** for ingesting streaming data from legacy systems
- **Dataflow** for processing and transforming HL7/FHIR data streams

### Self-Service Provisioning
- **Terraform** with approved module templates + org policies and **IAM** constraints to enforce guardrails

## Exam Tips

- "HIPAA" → CMEK + Data Access Audit Logs + VPC Service Controls (all three, not just one)
- High-throughput on-prem link → **Dedicated Interconnect**, not Cloud VPN
- "Strong consistency across regions" for health records → **Cloud Spanner** over Cloud SQL
- "Onboard clients faster" → self-service IaC templates (Terraform) + CI/CD pipelines
