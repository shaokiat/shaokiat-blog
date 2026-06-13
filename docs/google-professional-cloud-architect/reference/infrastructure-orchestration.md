---
title: Infrastructure Orchestration
sidebar_label: Infrastructure Orchestration
sidebar_position: 10
---

# Infrastructure Orchestration

> Docs: [Infrastructure as Code on Google Cloud](https://cloud.google.com/docs/terraform)

## Infrastructure as Code (IaC)

### Terraform

The standard IaC tool for GCP. Defines infrastructure in HCL (HashiCorp Configuration Language); manages resource lifecycle (create, update, destroy) via a state file.

- **`terraform plan`** — preview changes before applying
- **`terraform apply`** — create or update resources to match config
- **`terraform destroy`** — tear down all managed resources
- **Remote state** — store state in a Cloud Storage bucket for team collaboration and locking

Google provides the **Google Cloud Terraform provider** and a library of pre-built modules (VPC, GKE, Cloud SQL) via the [Cloud Foundation Toolkit](https://cloud.google.com/foundation-toolkit).

**Use when:** Managing long-lived infrastructure (VPCs, clusters, databases) that needs version control, code review, and repeatable deployments.

> Docs: [Terraform on Google Cloud](https://cloud.google.com/docs/terraform)

### Config Connector

A Kubernetes operator that lets you manage GCP resources using **Kubernetes-style YAML manifests**. GCP resources (Cloud SQL, Pub/Sub, BigQuery) are represented as Kubernetes custom resources, and Config Connector reconciles them with the real GCP state.

**Use when:** Your team is already GKE-native and wants to manage GCP resource dependencies (e.g. a database that a Kubernetes workload depends on) in the same GitOps workflow as application manifests.

> Docs: [Config Connector overview](https://cloud.google.com/config-connector/docs/overview)

### Terraform vs. Config Connector

| | **Terraform** | **Config Connector** |
|---|---|---|
| **Config format** | HCL (`.tf` files) | Kubernetes YAML (CRDs) |
| **Scope** | Any GCP resource, multi-cloud, non-GKE infra | GCP services managed via Kubernetes YAML alongside app workloads |
| **Drift detection** | On next `plan` (manual or scheduled) | Continuous — controller reconciles on any drift |

**Use Terraform when:**
- Managing infrastructure outside of or independent from GKE (VPCs, Cloud SQL, IAM, multi-cloud)
- Your team works in a classic CI/CD pipeline and doesn't have a running GKE cluster
- You need multi-environment promotion with explicit plan/apply gates

**Use Config Connector when:**
- You want to manage GCP services (Cloud SQL, IAM, Pub/Sub, BigQuery, etc.) using the **same Kubernetes YAML and `kubectl` workflow** as your application workloads — one language, one tool, one pipeline
- You want a single GitOps workflow (`kubectl apply`) for both app and infra
- Continuous drift reconciliation is more important than explicit plan previews

> Docs: [Choosing between Terraform and Config Connector](https://cloud.google.com/config-connector/docs/how-to/import-export/export#choosing-between-terraform-and-config-connector)

---

## Compute Engine Provisioning Primitives

### Instance Templates

A reusable specification for a VM — machine type, boot disk image, network, labels, startup script. Used as the basis for Managed Instance Groups.

- Changes to a template do **not** automatically update existing VMs — you must update the MIG or roll out a new template version.

> Docs: [Instance templates](https://cloud.google.com/compute/docs/instance-templates)

### Managed Instance Groups (MIGs)

A group of identical VMs created from an instance template. Managed Instance Groups provide:

| Feature | Detail |
|---|---|
| **Autoscaling** | Scale in/out based on CPU, load balancer utilisation, Pub/Sub queue depth, or custom metrics |
| **Autohealing** | Health checks detect unhealthy VMs and automatically recreate them |
| **Rolling updates** | Update VM template gradually with configurable max surge and max unavailable |
| **Multi-zone** | Spread VMs across zones in a region for HA |
| **Stateful MIGs** | Preserve disk and network interface across VM restarts — for stateful workloads |

**Unmanaged Instance Groups** — a flat group of VMs you manage individually; used to attach heterogeneous VMs to a load balancer. No autoscaling or autohealing.

> Docs: [Managed instance groups](https://cloud.google.com/compute/docs/instance-groups)

---

## Patch Management and OS Configuration

### VM Manager (OS Config)

Google's managed service for OS-level configuration and patching across Compute Engine VMs.

- **Patch management** — define patch jobs that apply OS updates across a fleet of VMs on a schedule
- **OS inventory** — view installed packages and versions across all VMs from a central dashboard
- **OS policies** — enforce desired state configuration (install a package, write a file, run a script) using OS Config agents

**Use when:** The exam mentions *fleet-level patch compliance*, *OS vulnerability management*, or *consistent configuration across many VMs* without managing a separate configuration management tool.

> Docs: [VM Manager overview](https://cloud.google.com/compute/docs/manage-os)

---

## Container Orchestration Patterns

### GKE Workload Provisioning

Beyond cluster creation, key provisioning concepts for GKE:

- **Node pools** — groups of nodes with the same machine type/config within a cluster; different workloads run on different node pools (e.g. CPU pool for web, GPU pool for ML)
- **Cluster autoscaler** — adds/removes nodes based on pending pod demand
- **Horizontal Pod Autoscaler (HPA)** — scales pod replicas based on CPU/memory or custom metrics
- **Vertical Pod Autoscaler (VPA)** — adjusts CPU/memory requests for pods based on actual usage
- **PodDisruptionBudgets** — guarantee minimum available replicas during node drain or rolling updates

### Serverless Compute Provisioning

- **Cloud Run** — no provisioning; specify min/max instances and concurrency. Use min instances > 0 to avoid cold starts.
- **Cloud Run Functions** — configure memory (128MB–32GB), timeout, and concurrency. 2nd gen functions run on Cloud Run under the hood.

## Exam Tips

- "Self-service provisioning with guardrails" → **Terraform modules** with approved templates + Org Policy constraints
- "Manage GCP resources alongside Kubernetes workloads in GitOps" → **Config Connector**
- "Auto-replace unhealthy VMs" → **MIG with autohealing** (health check + recreate action)
- "Patch all VMs in the org on a schedule" → **VM Manager patch jobs**
- "Scale based on Pub/Sub queue depth" → **MIG autoscaling with custom metric** (Pub/Sub subscription/num_undelivered_messages)

## Official Documentation

- [Terraform on Google Cloud](https://cloud.google.com/docs/terraform)
- [Config Connector overview](https://cloud.google.com/config-connector/docs/overview)
- [Instance templates](https://cloud.google.com/compute/docs/instance-templates)
- [Managed instance groups](https://cloud.google.com/compute/docs/instance-groups)
- [VM Manager overview](https://cloud.google.com/compute/docs/manage-os)
- [GKE cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)
