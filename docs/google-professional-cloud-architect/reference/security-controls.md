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
