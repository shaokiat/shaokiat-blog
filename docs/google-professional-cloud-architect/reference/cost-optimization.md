---
title: Cost Optimization
sidebar_label: Cost Optimization
sidebar_position: 16
---

# Cost Optimization

> Docs: [Cost optimisation on Google Cloud](https://cloud.google.com/architecture/framework/cost-optimization)

## CapEx vs. OpEx

Cloud computing shifts infrastructure spend from **CapEx (Capital Expenditure)** to **OpEx (Operating Expenditure)**:

| Model | Definition | Cloud equivalent |
|---|---|---|
| **CapEx** | Upfront investment in owned assets — servers, data centre hardware | On-premises infrastructure; reserved hardware purchases |
| **OpEx** | Ongoing operating costs — pay as you use | GCP on-demand pricing; billed monthly |

**Why this matters for the exam:**
- "Reduce upfront capital costs" → migrate to GCP (CapEx → OpEx shift)
- "Predictable monthly spend" → Committed Use Discounts (CUDs) — you keep OpEx but get a discount for a usage commitment
- "Eliminate data centre refresh cycles" → cloud removes hardware CapEx entirely

The exam often uses the CapEx/OpEx framing as justification for a cloud migration decision — recognise it as the financial rationale, not a technical constraint.

> Docs: [Total cost of ownership](https://cloud.google.com/architecture/framework/cost-optimization/total-cost-of-ownership)

## Pricing Model Basics

GCP uses **on-demand pricing** by default — pay per second with no upfront commitment. Discounts stack on top of on-demand rates.

| Discount Type | How It Works | Applies To |
|---|---|---|
| **Sustained Use Discounts (SUDs)** | Automatic discount for VMs running >25% of the month — up to 30% off | GCE and Dataproc only; automatic, no action needed |
| **Committed Use Discounts (CUDs)** | Commit to a resource level for 1 or 3 years; up to 57% off | GCE, GKE, Cloud SQL, Cloud Run, AlloyDB |
| **Spot VMs** | Deeply discounted VMs (up to 91% off) that GCP may preempt with 30s notice | GCE, GKE node pools |

### CUD Types

| Type | What You Commit To | Flexibility |
|---|---|---|
| **Resource-based CUD** | Specific machine type (vCPUs + memory) in a region | Low — tied to machine type |
| **Spend-based CUD** | Dollar amount of hourly spend | High — applies to any machine type in the family |

Spend-based CUDs are more flexible but give a smaller discount. Use resource-based when you know exactly which machine types you'll run.

## Rightsizing

**Cloud Recommender** analyses VM CPU/memory utilisation and recommends:
- **Downsize** — if average CPU is consistently below 50%, recommend a smaller machine type
- **Idle VM** — if CPU is near 0%, recommend stopping or deleting

Apply recommendations from the Recommender API or directly in the Cloud Console under *Active Assist*.

> Docs: [VM rightsizing recommendations](https://cloud.google.com/compute/docs/instances/apply-machine-type-recommendations-for-instances)

## Billing and Cost Visibility

### Billing Exports to BigQuery

Export detailed billing data (line-item charges, labels, SKUs) to BigQuery for analysis.

- **Standard export** — daily export of charges
- **Detailed export** — includes resource-level cost breakdown; needed for showback/chargeback

Build dashboards in Looker Studio or run SQL queries to answer: *Which team/project is spending the most? Which SKU drove this month's spike?*

> Docs: [Cloud Billing data to BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery)

### Budgets and Alerts

Set a **billing budget** on a billing account, project, or folder with alert thresholds (e.g. alert at 50%, 90%, 100% of budget). Alerts are sent via email or Pub/Sub.

**Budgets do not stop spending** — they only alert. To enforce a hard cap, configure a Pub/Sub alert that triggers a Cloud Function to disable billing on the project.

> Docs: [Set budgets and budget alerts](https://cloud.google.com/billing/docs/how-to/budgets)

## Cost Allocation

Use **labels** on GCP resources (VMs, GCS buckets, BigQuery datasets) to tag them by team, environment, or cost centre. Labels flow through to billing exports, enabling per-team showback.

Best practice:
- Define a labelling taxonomy at the organisation level (e.g. `env: prod/staging/dev`, `team: platform/data/frontend`)
- Enforce mandatory labels via Organisation Policy constraints

## Storage Cost Optimisation

- Use **Cloud Storage lifecycle policies** to auto-transition objects to cheaper classes over time → [Cloud Storage reference](./cloud-storage.md)
- Use **BigQuery partitioning** to reduce query cost (only scan the partitions you need)
- Enable **BigQuery table expiry** on temporary or staging datasets

## Unattended Projects and Resources

**Unattended Project Recommender** — identifies projects with no human activity for 30+ days. Review and delete to eliminate waste.

**Idle resource recommenders** — also flags:
- Unattached persistent disks
- Idle IP addresses
- Idle load balancers

## Exam Tips

- "Predictable, steady-state workload" → **CUD** (1 or 3 year)
- "Fault-tolerant batch / ML training" → **Spot VMs** (up to 91% off, handle preemption)
- "Allocate cloud costs to individual teams" → **Labels + billing export to BigQuery**
- "Alert team when spend exceeds budget" → **Billing budget with Pub/Sub notification**
- SUDs are automatic — never say a customer needs to "enable" them; they apply automatically to eligible VMs

## Official Documentation

- [Cost optimisation framework](https://cloud.google.com/architecture/framework/cost-optimization)
- [Committed Use Discounts](https://cloud.google.com/compute/docs/instances/signing-up-committed-use-discounts)
- [Spot VMs](https://cloud.google.com/compute/docs/instances/spot)
- [VM rightsizing recommendations](https://cloud.google.com/compute/docs/instances/apply-machine-type-recommendations-for-instances)
- [Cloud Billing export to BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery)
- [Budgets and alerts](https://cloud.google.com/billing/docs/how-to/budgets)
