---
title: Google Professional Cloud Architect
sidebar_label: Overview
sidebar_position: 1
---

# Google Professional Cloud Architect

Notes for the PCA certification exam. Structure follows the [official exam guide](https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf). The **Google Cloud Well-Architected Framework** (operational excellence, security, reliability, performance optimization, cost optimization, sustainability) underpins all sections.

## Case Studies

Four published case studies appear in the exam. Understand the business and technical requirements of each before sitting the exam.

- [Altostrat Media](./case-studies/altostrat-media.md) — media library, generative AI, hybrid Kubernetes
- [Cymbal Retail](./case-studies/cymbal-retail.md) — omnichannel retail, traffic spikes, PCI-DSS
- [EHR Healthcare](./case-studies/ehr-healthcare.md) — healthcare SaaS migration, HIPAA compliance
- [KnightMotives Automotive](./case-studies/knightmotives-automotive.md) — connected vehicles, IoT telemetry, OTA updates

---

## Section 1: Designing and Planning a Cloud Solution Architecture (~25%)

### 1.1 Business Requirements
- Business use cases and product strategy
- Identifying functional and non-functional requirements
- Business continuity planning → [HA & DR](./reference/high-availability-dr.md)
- Cost optimization → [Cost Optimization](./reference/cost-optimization.md)
- Supporting the application design
- Integration patterns with external systems
- Movement of data
- Design decision trade-offs
- Workload disposition strategies (build, buy, modify, or deprecate)
- Success measurements: KPIs, ROI, metrics
- Security and compliance → [Security Controls](./reference/security-controls.md)
- Observability → [Observability](./reference/observability.md)

### 1.2 Technical Requirements
- **Google Cloud Well-Architected Framework** → [Well-Architected Framework](./reference/well-architected-framework.md)
- High availability and failover design → [HA & DR](./reference/high-availability-dr.md)
- Flexibility and scalability of cloud resources → [Compute Selection](./reference/compute-selection.md)
- Performance and latency
- **Gemini Cloud Assist** → [Vertex AI & GenAI](./reference/vertex-ai-genai.md)
- Backup and recovery → [Backup & Data Transfer](./reference/backup-and-recovery.md)

### 1.3 Network, Storage, and Compute Design

**AI and ML Solutions**
- Gemini LLMs, Agent Builder, Model Garden
- AI Hypercomputer for large-scale training

**Compute Selection**
- **Compute Engine (GCE):** IaaS, custom machine types, spot VMs, specialised workloads
- **GKE:** *Autopilot* (fully managed) vs. *Standard* (full node control)
- **Cloud Run:** Serverless containers, scales to zero
- **Cloud Run Functions:** Event-driven FaaS

**Storage Selection**
- **Cloud SQL:** Managed relational (MySQL, Postgres, SQL Server)
- **Cloud Spanner:** Global relational, horizontal scaling, strong consistency
- **Cloud Bigtable:** NoSQL wide-column, high throughput (IoT, time-series)
- **Firestore:** NoSQL document DB, real-time sync (mobile/web)
- **Cloud Storage:** Object storage; Standard, Nearline, Coldline, Archive classes → [Reference: Cloud Storage](./reference/cloud-storage.md)

**Data Processing**
- Pub/Sub, Dataflow, Dataproc, BigQuery, Eventarc → [Data Processing](./reference/data-processing.md)

**Networking**
- VPC, peering, firewalls, load balancers, routing, container networking
- **Shared VPC:** Host project owns network; service projects use it
- **Private Service Connect:** Private access to Google services and third-party APIs
- **Load Balancing:** Global (L7/HTTP) vs. Regional (L4/TCP/UDP)
- Cloud CDN, Cloud NAT, Cloud Armor, Cloud DNS

### 1.4 Migration Planning
- Migration methodologies: rehost, replatform, refactor, retire → [Migration](./reference/migration.md)
- Assessing and migrating systems and data (Migration Center, Migrate for Compute Engine, DMS) → [Migration](./reference/migration.md)
- Workload testing, network planning, dependency planning
- Software licence implications and financial impact

### 1.5 Future Solution Improvements
- Cloud and technology improvements
- Evolution of business needs
- Cloud-first design approach

---

## Section 2: Managing and Provisioning a Cloud Solution Infrastructure (~17.5%)

### 2.1 Network Topology Configuration
- **Hybrid Connectivity:** Cloud VPN, Dedicated Interconnect, Partner Interconnect → [Hybrid Connectivity](./reference/hybrid-connectivity.md)
- Multicloud networking: GCP-to-GCP and cross-cloud patterns
- VPC design, firewall rules, hierarchical firewall policies, Private Google Access → [VPC & Firewall](./reference/vpc-and-firewall.md)
- Load balancing → [Networking Services](./reference/networking-services.md)

### 2.2 Storage System Configuration
- Data storage allocation → [Database Selection](./reference/database-selection.md)
- Cloud Storage lifecycle management and object versioning → [Cloud Storage](./reference/cloud-storage.md)
- Data transfer services (Storage Transfer Service, Transfer Appliance, Datastream) → [Backup & Data Transfer](./reference/backup-and-recovery.md)
- Data protection: snapshots, automated backups, PITR → [Backup & Data Transfer](./reference/backup-and-recovery.md)

### 2.3 Compute System Configuration
- Compute resource provisioning: instance templates, MIGs, autoscaling, autohealing → [Infrastructure Orchestration](./reference/infrastructure-orchestration.md)
- Compute volatility: spot vs. standard VMs → [Compute Selection](./reference/compute-selection.md)
- Infrastructure orchestration: Terraform, Config Connector, VM Manager patch jobs → [Infrastructure Orchestration](./reference/infrastructure-orchestration.md)
- Container orchestration: GKE node pools, HPA, VPA → [Infrastructure Orchestration](./reference/infrastructure-orchestration.md)
- Compute selection: GCE, GKE, Cloud Run, Functions → [Compute Selection](./reference/compute-selection.md)

### 2.4 Leveraging Vertex AI for End-to-End ML Workflows
- **Vertex AI Pipelines:** Automate and orchestrate the ML lifecycle
- Vertex AI data integration
- **AI Hypercomputer:** GPUs/TPUs for training and serving; large-scale model training; optimising consumption models

### 2.5 Configuring Prebuilt Solutions or APIs with Vertex AI
- Differentiating Google AI APIs: Search, Conversation, Vision, Image, Video, Audio
- **Gemini Enterprise features:** AI Agents and NotebookLM for workflow enhancement
- Integrating models from **Model Garden** into solutions

---

## Section 3: Designing for Security and Compliance (~17.5%)

### 3.1 Security Design
- **IAM:** Primitive, Predefined, and Custom roles; least-privilege principle
- **Resource Hierarchy:** Organisation → Folder → Project → Resource
- **Data Security:** Cloud KMS (CMEK), Secret Manager
- **Separation of Duties (SoD)**
- **Security Controls:** Cloud Audit Logs, VPC Service Controls, Context-Aware Access, Organisation Policy, Hierarchical Firewall Policy
- **Secure Remote Access:** IAP, service account impersonation, Chrome Enterprise Premium, Workload Identity Federation
- **Securing the Software Supply Chain**
- **Securing AI:** Model Armor, Sensitive Data Protection, secure model deployment

### 3.2 Compliance Design
- Legislation and regulation: HIPAA, COPPA, GDPR, data sovereignty
- Commercial: PCI-DSS (credit cards), PII handling
- Industry certifications: SOC 2, ISO 27001
- Audit logging: Cloud Audit Logs (Admin Activity, Data Access, System Events)

---

## Section 4: Analyzing and Optimizing Technical and Business Processes (~15%)

### 4.1 Technical Process Analysis
- **SDLC:** Development, testing, release, rollout, and provisioning stages
- **CI/CD:** Cloud Build → Artifact Registry → Cloud Deploy → [CI/CD & Deployment](./reference/ci-cd.md)
- Troubleshooting and root cause analysis best practices → [Observability](./reference/observability.md)
- Testing and validation of software and infrastructure → [CI/CD & Deployment](./reference/ci-cd.md)
- Disaster recovery → [HA & DR](./reference/high-availability-dr.md)

### 4.2 Business Process Analysis
- Stakeholder management, change management, team skills readiness
- Decision-making processes and customer success management
- **Cost optimisation (CapEx vs. OpEx):** CUDs, rightsizing, billing exports, spot VMs → [Cost Optimization](./reference/cost-optimization.md)
- Business continuity → [HA & DR](./reference/high-availability-dr.md)

---

## Section 5: Managing Implementation (~12.5%)

### 5.1 Advising Development and Operations Teams
- Application and infrastructure deployment
- **API management best practices (Apigee)**
- Testing frameworks: load, unit, integration
- Data and system migration tooling
- **Gemini Cloud Assist**

### 5.2 Interacting with Google Cloud Programmatically
- Cloud Shell Editor, Cloud Code, Cloud Shell Terminal
- **Google Cloud SDKs:** gcloud, gsutil, bq
- **Cloud Emulators:** Bigtable, Spanner, Pub/Sub, Firestore
- **Infrastructure as Code:** Terraform
- Google API client libraries and best practices

---

## Section 6: Ensuring Solution and Operations Excellence (~12.5%)

### 6.1 Well-Architected Framework — Operational Excellence Pillar
- Automation, change management, and continuous improvement → [Well-Architected Framework](./reference/well-architected-framework.md)

### 6.2 Google Cloud Observability Solutions
- Cloud Monitoring, Cloud Logging, Cloud Trace, Cloud Profiler, Error Reporting → [Observability](./reference/observability.md)
- SLI/SLO/SLA, error budgets, burn rate alerts → [Observability](./reference/observability.md)

### 6.3 Deployment and Release Management
- Deployment strategies: rolling, blue/green, canary → [CI/CD & Deployment](./reference/ci-cd.md)
- Traffic splitting (Cloud Run, GKE) and rollback procedures → [CI/CD & Deployment](./reference/ci-cd.md)

### 6.4 Assisting with the Support of Deployed Solutions
- Incident response and escalation paths
- Diagnosing issues with Cloud Logging, Trace, Debugger → [Observability](./reference/observability.md)

### 6.5 Evaluating Quality Control Measures
- SLO error budget management → [Observability](./reference/observability.md)
- Capacity planning and post-mortem / blameless review process

### 6.6 Ensuring Reliability of Solutions in Production
- Chaos engineering, penetration testing, load testing → [HA & DR](./reference/high-availability-dr.md)
