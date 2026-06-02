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
- Business continuity planning
- Cost optimization
- Supporting the application design
- Integration patterns with external systems
- Movement of data
- Design decision trade-offs
- Workload disposition strategies (build, buy, modify, or deprecate)
- Success measurements: KPIs, ROI, metrics
- Security and compliance
- Observability

### 1.2 Technical Requirements
- Familiarity with the **Google Cloud Well-Architected Framework**
- High availability and failover design
- Flexibility of cloud resources
- Scalability to meet growth requirements
- Performance and latency
- **Gemini Cloud Assist**
- Backup and recovery

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
- **Pub/Sub:** Async messaging, decoupling services
- **Dataflow:** Stream/batch processing (Apache Beam)
- **Dataproc:** Managed Hadoop/Spark
- **BigQuery:** Serverless data warehouse, SQL + ML

**Networking**
- VPC, peering, firewalls, load balancers, routing, container networking
- **Shared VPC:** Host project owns network; service projects use it
- **Private Service Connect:** Private access to Google services and third-party APIs
- **Load Balancing:** Global (L7/HTTP) vs. Regional (L4/TCP/UDP)
- Cloud CDN, Cloud NAT, Cloud Armor, Cloud DNS

### 1.4 Migration Planning
- Integrating solutions with existing systems
- Assessing and migrating systems and data (**Google Cloud Migration Center**)
- Migration methodologies: lift-and-shift, re-platform, re-architect
- Workload testing, network planning, dependency planning
- Software licence implications and financial impact

### 1.5 Future Solution Improvements
- Cloud and technology improvements
- Evolution of business needs
- Cloud-first design approach

---

## Section 2: Managing and Provisioning a Cloud Solution Infrastructure (~17.5%)

### 2.1 Network Topology Configuration
- **Hybrid Connectivity:**
  - **Cloud VPN:** IPsec tunnel over public internet
  - **Cloud Interconnect:** Dedicated (physical link) or Partner (via provider)
- Multicloud networking: GCP-to-GCP and cross-cloud patterns
- Security protection: firewall rules, intrusion protection, access control
- VPC design and load balancing (access to cloud, internet, and cloud-adjacent services)

### 2.2 Storage System Configuration
- Data storage allocation and provisioning
- Security and access management (IAM, signed URLs)
- Configuration for data transfer and latency
- Data retention, lifecycle management, and object versioning
- Data growth planning
- Data protection: backup and recovery

### 2.3 Compute System Configuration
- Compute resource provisioning (instance templates, MIGs)
- Compute volatility: spot vs. standard VMs
- Cloud-native network config for GCE, GKE, serverless, Google Cloud VMware Engine
- Infrastructure orchestration, patch management, Config Connector
- Container orchestration
- Serverless computing

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
- **CI/CD:** Cloud Build → Artifact Registry → Cloud Deploy (progressive delivery for GKE and Cloud Run)
- Troubleshooting and root cause analysis best practices
- Testing and validation of software and infrastructure
- Service catalogue and provisioning
- Disaster recovery

### 4.2 Business Process Analysis
- Stakeholder management, change management, team skills readiness
- Decision-making processes and customer success management
- **Cost optimisation (CapEx vs. OpEx):** Committed Use Discounts, rightsizing with Recommender, billing exports to BigQuery, sustained use discounts, spot VMs
- Business continuity

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
- Automation, change management, and continuous improvement

### 6.2 Google Cloud Observability Solutions
- **Monitoring and Logging:** Cloud Monitoring, Cloud Logging
- **Profiling and Benchmarking:** Cloud Profiler, Cloud Trace
- **Alerting Strategies:** SLI/SLO/SLA, error budgets, burn rate alerts

### 6.3 Deployment and Release Management
- Deployment strategies: rolling, blue/green, canary
- Traffic splitting (Cloud Run, GKE) and rollback procedures

### 6.4 Assisting with the Support of Deployed Solutions
- Incident response and escalation paths
- Diagnosing issues with Cloud Logging, Trace, Debugger

### 6.5 Evaluating Quality Control Measures
- SLO error budget management
- Capacity planning and post-mortem / blameless review process

### 6.6 Ensuring Reliability of Solutions in Production
- Chaos engineering, penetration testing, load testing
