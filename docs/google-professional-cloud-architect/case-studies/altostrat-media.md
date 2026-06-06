---
title: Altostrat Media
sidebar_label: Altostrat Media
sidebar_position: 1
---

# Case Study: Altostrat Media

> Official case study: [Altostrat Media Case Study PDF](https://services.google.com/fh/files/misc/v6.1_pca_altostrat_media_case_study_english.pdf)
>
> Sample questions walkthrough: [Altostrat Media — PCA Question Bank (YouTube)](https://www.youtube.com/watch?v=ZMaBgxe91Yw)

## What This Case Study Is About

Altostrat is a media company with a large library of audio and video content (podcasts, interviews, news, documentaries). Their platform already runs on GCP (GKE, Cloud Storage, BigQuery, Cloud Run Functions) but they have legacy on-premises systems for content ingestion and archival that are being migrated.

The core theme is **adding generative AI to an existing GCP environment** — personalisation, conversational AI, content intelligence (summarisation, metadata extraction, harmful content detection) — alongside hybrid connectivity and cost optimisation.

## Existing Environment (Know This for the Exam)

| Layer | Current Setup |
|---|---|
| Compute | GKE for media platform; Cloud Run Functions for event-driven tasks |
| Storage | Cloud Storage for all media assets |
| Analytics | BigQuery as primary data warehouse |
| Identity | Google Identity + third-party IdPs |
| Monitoring | Cloud Monitoring + open-source Prometheus |
| On-premises | Legacy content ingestion and archival workflows |

## Key Requirements to Focus On

### Generative AI and Content Intelligence
→ Reference: [Vertex AI & Generative AI](../reference/vertex-ai-genai.md)

- **Conversational AI / chatbot** for 24/7 user support → **Vertex AI Agent Builder** or **Dialogflow CX**
- **Automated media summarisation** for diverse audio and video formats → **Gemini LLMs via Vertex AI**
- **Metadata extraction** from media assets using NLP and computer vision → **Video Intelligence API**, **Natural Language API**, or **Vertex AI multimodal models**
- **Harmful content detection** → **Video Intelligence API** (SafeSearch), **Cloud Vision API**, or **Model Armor**
- **Explainable / auditable AI** — decisions must be explainable → **Vertex AI Explainability**

### Hybrid and Kubernetes
→ Reference: [Hybrid Connectivity](../reference/hybrid-connectivity.md) · [Compute Selection](../reference/compute-selection.md)

- Secure, high-performance connectivity for on-premises data ingestion → **Cloud Interconnect** (not VPN — performance requirement)
- Kubernetes both on-premises and in the cloud → **GKE Enterprise (Anthos)** — unified control plane across environments

### CI/CD and Deployment
- Modernise CI/CD for containerised workloads with a centralised platform → **Cloud Build + Artifact Registry + Cloud Deploy**

### Storage Cost Optimisation
→ Reference: [Cloud Storage](../reference/cloud-storage.md)

- Growing media volumes need cost-efficient storage tiers → **Cloud Storage lifecycle policies** to auto-transition to Nearline → Coldline → Archive based on access frequency

### Identity and Observability
→ Reference: [Security Controls](../reference/security-controls.md)

- Mixed identity providers (Google Identity + third-party) → **Identity Platform** or **Workload Identity Federation**
- Prometheus already in use → **Cloud Monitoring with Managed Service for Prometheus** for unified observability without replacing existing tooling

## Exam Tips

- "Conversational AI / chatbot" → **Agent Builder** or **Dialogflow CX**
- "Auditable and explainable AI" → **Vertex AI Explainability**
- Hybrid Kubernetes (on-prem + cloud) → **GKE Enterprise / Anthos**, not two separate GKE clusters
- High-performance hybrid ingestion → **Dedicated Interconnect**, not Cloud VPN
- Prometheus already in use → **Managed Service for Prometheus** (keep existing tooling, don't rip and replace)
- Storage cost optimisation for media = **lifecycle policies** (not just picking a cheaper class manually)
