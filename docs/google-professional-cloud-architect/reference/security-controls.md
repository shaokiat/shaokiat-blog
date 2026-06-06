---
title: Security Controls
sidebar_label: Security Controls
sidebar_position: 6
---

# Security Controls

> Docs: [Google Cloud security overview](https://cloud.google.com/docs/security/overview/whitepaper)

## Controls at a Glance

| Control | What It Protects | Layer |
|---|---|---|
| **IAM** | Who can do what on which resource | Identity |
| **Organization Policy** | What can be done at org/folder/project level | Preventive |
| **VPC Service Controls** | Which services can be accessed from which network/identity | Data exfiltration |
| **Cloud KMS / CMEK** | Data at rest (encryption keys) | Data |
| **Secret Manager** | Credentials, API keys, certificates | Data |
| **Cloud Audit Logs** | Who did what, when | Visibility |
| **Workload Identity Federation** | External workloads authenticating to GCP | Identity |
| **Identity-Aware Proxy (IAP)** | Access to web apps and VMs over HTTPS | Access |
| **Security Command Center** | Centralised threat detection and findings | Detection |

## IAM Roles

| Type | Description | When to Use |
|---|---|---|
| **Primitive** | Owner, Editor, Viewer — broad project-level access | Avoid in production |
| **Predefined** | Fine-grained roles per service (e.g., `roles/storage.objectViewer`) | Default choice |
| **Custom** | You define the exact set of permissions | When predefined is too broad or too narrow |

**Least privilege principle:** Grant the minimum role needed, scoped to the lowest resource level possible (resource > project > folder > org).

## Cloud KMS and CMEK

By default, Google manages encryption keys (GMEK). **CMEK** lets you supply your own keys via **Cloud KMS**.

- **CMEK** — your key stored in Cloud KMS; Google's services use it to encrypt your data. Revoking the key makes the data inaccessible.
- **CSEK** (Customer-Supplied Encryption Keys) — you supply the key directly to the API; Google never stores it. Available for GCS and Compute Engine only.
- **Cloud HSM** — keys backed by hardware security modules (FIPS 140-2 Level 3). Required for some compliance frameworks.
- **Cloud External Key Manager (EKM)** — keys stored outside GCP (in your own KMS); GCP calls your KMS to wrap/unwrap data keys.

**Exam signal:** HIPAA, PCI-DSS, or "customer controls encryption keys" → always recommend CMEK over default GMEK.

> Docs: [Cloud KMS overview](https://cloud.google.com/kms/docs/key-management-service)

## VPC Service Controls

Creates a **security perimeter** around Google Cloud APIs and services. Requests from outside the perimeter (even with valid IAM credentials) are denied.

**Use for:**
- Preventing data exfiltration (e.g., a compromised SA can't copy data to an external project)
- Isolating sensitive environments (payment processing, PHI data)
- Enforcing that BigQuery data can only be accessed from a trusted VPC

**Not a replacement for IAM** — IAM controls *who* can access; VPC SC controls *from where*.

> Docs: [VPC Service Controls overview](https://cloud.google.com/vpc-service-controls/docs/overview)

## Cloud Audit Logs

Three log types relevant to compliance:

| Log Type | What It Captures | Enabled by Default |
|---|---|---|
| **Admin Activity** | API calls that modify resources (create, delete, IAM changes) | Yes, always |
| **Data Access** | API calls that read config or data (e.g., reading a GCS object) | No — must enable |
| **System Events** | GCP-initiated changes (e.g., live migration) | Yes, always |

**Exam signal:** "Audit all access to PHI / PII / payment data" → enable **Data Access audit logs** for the relevant services. Admin Activity alone is not sufficient.

> Docs: [Cloud Audit Logs overview](https://cloud.google.com/logging/docs/audit)

## Workload Identity Federation

Allows external workloads (GitHub Actions, AWS services, on-prem systems, vehicles) to authenticate to GCP **without a service account key file**.

How it works: external identity token → Workload Identity Pool → short-lived GCP access token.

**Use instead of:** exporting and distributing service account JSON keys, which are long-lived and hard to rotate.

> Docs: [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)

## Identity-Aware Proxy (IAP)

Enforces access control for web apps and SSH/RDP to VMs based on identity and context (device, location), without requiring a VPN.

**Use when:** Employees need to access internal tools or GCE VMs securely over the internet without exposing them publicly.

> Docs: [Identity-Aware Proxy overview](https://cloud.google.com/iap/docs/concepts-overview)

## Organization Policy

Preventive guardrails that *restrict what can be configured*, regardless of IAM permissions. Examples:
- Prevent service account key creation
- Restrict which regions resources can be deployed to
- Enforce uniform bucket-level access on Cloud Storage
- Disable public IP on VM instances

> Docs: [Organization Policy overview](https://cloud.google.com/resource-manager/docs/organization-policy/overview)

## Security Command Center (SCC)

Security Command Center is Google Cloud's **centralised security and risk management platform**. It aggregates findings from across your GCP environment into a single pane of glass, covering vulnerability detection, threat detection, and compliance posture.

> Docs: [Security Command Center overview](https://cloud.google.com/security-command-center/docs/overview)

### Tiers

| Tier | What's Included |
|---|---|
| **Standard** | Free. Basic asset discovery, Security Health Analytics (critical/high findings only), IAM anomalies |
| **Premium** | Paid. All Standard features + Event Threat Detection, Container Threat Detection, Web Security Scanner, VM Manager, compliance reporting (PCI-DSS, HIPAA, CIS) |
| **Enterprise** | Paid. All Premium features + multi-cloud support (AWS, Azure), Attack Path Simulation, toxic combination detection, integrated case management |

**Exam signal:** If the scenario mentions *continuous compliance reporting*, *threat detection across the org*, or *multi-cloud security posture* → SCC Premium or Enterprise.

### Key Built-in Services

**Security Health Analytics**
Continuously scans your GCP resources for misconfigurations and policy violations. Examples of findings it raises:
- Public Cloud Storage buckets
- Firewall rules allowing unrestricted SSH/RDP (port 22/3389 open to `0.0.0.0/0`)
- Service accounts with Owner or Editor roles
- Logging disabled on a project
- MFA not enforced on Cloud Identity accounts

**Event Threat Detection**
Analyses Cloud Logging and Cloud Audit Log streams in near real-time to detect active threats. Detects:
- Cryptomining (unusual compute resource usage patterns)
- Data exfiltration (large unexpected data transfers)
- Brute force attacks on GCE SSH
- Compromised service account credentials being used from unexpected locations
- Anomalous IAM grant changes

**Container Threat Detection**
Monitors GKE node-level activity for runtime threats:
- Added binary executed inside a container
- Reverse shell launched from a container
- Unexpected child process spawned by a container

**Web Security Scanner**
Crawls and scans App Engine, GKE, and Compute Engine web applications for common vulnerabilities:
- Cross-site scripting (XSS)
- Mixed HTTP/HTTPS content
- Outdated/insecure libraries
- Flash injection

**VM Manager**
Patch management and vulnerability scanning for Compute Engine VMs:
- OS patch compliance reporting
- OS inventory (installed packages and versions)
- OS vulnerability assessment against CVE databases

### Attack Path Simulation (Enterprise)

Simulates how an attacker could move laterally through your environment given current IAM bindings, network rules, and exposed services. Outputs a prioritised list of high-value attack paths so you fix the most impactful misconfigurations first.

### Findings, Assets, and Posture

- **Findings** — individual security issues raised by SCC's detectors or integrated third-party tools. Each finding has a severity (CRITICAL, HIGH, MEDIUM, LOW) and a state (ACTIVE, INACTIVE).
- **Assets** — inventory of all GCP resources SCC has discovered across your org.
- **Security Posture** — define a desired security state as a policy; SCC tracks drift from it and raises violations.

### Integration Points

SCC integrates with:
- **Pub/Sub** — export findings to Pub/Sub for custom alerting or SIEM ingestion (Splunk, Chronicle)
- **Cloud Logging** — all findings are also written as log entries
- **Chronicle (Google SIEM)** — native integration for security investigation and threat hunting
- **Jira / ServiceNow** — for ticketing integration in Enterprise tier

### SCC vs Other Security Controls

| | SCC | Cloud Audit Logs | VPC Service Controls |
|---|---|---|---|
| **Purpose** | Detect misconfigs and active threats | Record what happened | Prevent unauthorised access |
| **Layer** | Detection / visibility | Forensics / compliance | Preventive |
| **Scope** | Whole org, all resources | Per-service API activity | API-level perimeter |
| **Action** | Raises findings → you remediate | Immutable log record | Blocks requests at time of access |

Use all three together: VPC SC *prevents* exfiltration, Audit Logs *record* all access, and SCC *detects* when something looks wrong.

## Context-Aware Access (BeyondCorp Enterprise)

Extends IAP to enforce access decisions based on **identity AND device context**, not just identity alone. A user's request is evaluated against:
- User identity (who they are)
- Device posture (is it corp-managed? Does it have a screen lock? Is the OS patched?)
- Network context (are they on a trusted network?)

**Use when:** The exam mentions *"zero-trust access"*, *"employees accessing internal apps from unmanaged devices"*, or *"enforce device policy without a VPN"*.

> Docs: [BeyondCorp Enterprise overview](https://cloud.google.com/beyondcorp-enterprise/docs/overview)

## Sensitive Data Protection (formerly Cloud DLP)

Discovers, classifies, and protects sensitive data (PII, PCI, PHI) across GCP storage services and streaming data.

**Key capabilities:**
- **Inspection** — scan Cloud Storage, BigQuery, Datastore, and Pub/Sub for sensitive data types (credit card numbers, SSNs, email addresses, IBAN, custom regex patterns)
- **De-identification** — transform sensitive values before storing or sharing:
  - **Masking** — replace characters with `*`
  - **Tokenisation** — replace with a surrogate token (reversible with a key)
  - **Encryption** — format-preserving encryption
  - **Bucketing / generalisation** — replace exact values with ranges (e.g. age 27 → "20–30")
- **Risk analysis** — measure re-identification risk in a dataset

**Use when:** The exam mentions *"find and mask PII before loading to BigQuery"*, *"ensure credit card numbers are not stored in raw form"*, or *"classify data across our data lake"*.

> Docs: [Sensitive Data Protection overview](https://cloud.google.com/sensitive-data-protection/docs/overview)

## Securing the Software Supply Chain

Ensures only verified, trusted code and images reach production.

**Binary Authorization** — policy-based control that requires container images to be **attested** (cryptographically signed) before they can be deployed to GKE or Cloud Run. Integrates with:
- **Cloud Build** — creates attestations after a successful build and security scan
- **Artifact Registry** — stores both images and attestations
- **Container Analysis** — vulnerability scanning; can block deployment if critical CVEs are present

**Artifact Registry vulnerability scanning** — automatically scans pushed Docker images for known CVEs; findings visible in SCC and Artifact Registry console.

**SLSA (Supply chain Levels for Software Artifacts)** — a security framework for hardening the build process. GCP's Cloud Build supports SLSA provenance generation (proof of where and how a build was produced).

**Use when:** The exam mentions *"ensure only approved images are deployed"*, *"prevent deploying images with critical vulnerabilities"*, or *"secure the CI/CD pipeline"*.

> Docs: [Binary Authorization overview](https://cloud.google.com/binary-authorization/docs/overview)  
> Docs: [Artifact Registry vulnerability scanning](https://cloud.google.com/artifact-registry/docs/analysis)

## Compliance Quick Reference

| Regulation | Key Controls |
|---|---|
| **HIPAA (PHI)** | CMEK + Data Access Audit Logs + VPC Service Controls + Cloud Healthcare API |
| **PCI-DSS (card data)** | VPC Service Controls + CMEK + Secret Manager + Audit Logs + tokenisation |
| **GDPR (EU personal data)** | Data residency org policy + CMEK + Audit Logs + data deletion workflows |
| **SOC 2** | Audit Logs + IAM least privilege + Security Command Center findings |

## Official Documentation

- [IAM overview](https://cloud.google.com/iam/docs/overview)
- [Cloud KMS overview](https://cloud.google.com/kms/docs/key-management-service)
- [CMEK overview](https://cloud.google.com/kms/docs/cmek)
- [Secret Manager overview](https://cloud.google.com/secret-manager/docs/overview)
- [VPC Service Controls overview](https://cloud.google.com/vpc-service-controls/docs/overview)
- [Cloud Audit Logs overview](https://cloud.google.com/logging/docs/audit)
- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [Identity-Aware Proxy overview](https://cloud.google.com/iap/docs/concepts-overview)
- [Organization Policy overview](https://cloud.google.com/resource-manager/docs/organization-policy/overview)
- [Security Command Center](https://cloud.google.com/security-command-center/docs/overview)
- [BeyondCorp Enterprise overview](https://cloud.google.com/beyondcorp-enterprise/docs/overview)
- [Sensitive Data Protection overview](https://cloud.google.com/sensitive-data-protection/docs/overview)
- [Binary Authorization overview](https://cloud.google.com/binary-authorization/docs/overview)
