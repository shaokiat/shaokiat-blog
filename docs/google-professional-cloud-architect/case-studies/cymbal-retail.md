---
title: Cymbal Retail
sidebar_label: Cymbal Retail
sidebar_position: 2
---

# Case Study: Cymbal Retail

## Company Overview

Cymbal Retail is a large omnichannel retailer operating physical stores, a web storefront, and a mobile app. They are modernising their e-commerce platform on Google Cloud to improve customer experience, handle peak shopping traffic, and leverage generative AI for personalised shopping and inventory optimisation.

## Business Requirements

- Handle large traffic spikes during peak shopping events (Black Friday, seasonal sales) without outages
- Improve personalisation and product recommendation quality using AI
- Unify customer data across online and in-store channels for a single customer view
- Reduce time to deploy new features and promotions
- Optimise inventory management and reduce supply chain costs
- Ensure PCI-DSS compliance for all payment processing

## Technical Requirements

- Scale web and mobile backends elastically to handle traffic spikes
- Migrate legacy monolithic application to a microservices architecture
- Build a real-time product recommendation engine
- Create a unified data warehouse integrating POS, e-commerce, and supply chain data
- Implement a CI/CD pipeline for rapid feature deployment
- Ensure secure handling of payment card and customer PII data

## Key Architecture Considerations

### Scalable E-Commerce Backend
→ Reference: [Compute Selection](../reference/compute-selection.md) · [Networking Services](../reference/networking-services.md)

- **GKE Autopilot** or **Cloud Run** for containerised microservices — scales automatically during traffic spikes
- **Global HTTP(S) Load Balancer + Cloud Armor** for traffic management and DDoS/WAF protection
- **Cloud Spanner** or **Cloud SQL** (with read replicas) for transactional product catalogue and order data
- **Memorystore (Redis)** for session caching and cart data to reduce database load

→ Reference: [Database Selection](../reference/database-selection.md)

### Personalisation and AI
→ Reference: [Vertex AI & Generative AI](../reference/vertex-ai-genai.md)

- **Vertex AI** for training and serving custom product recommendation models
- **Recommendations AI** for out-of-the-box personalised product recommendations
- **Gemini models** via Vertex AI for generative features: AI shopping assistant, product description generation
- **BigQuery** for analysing customer behaviour and running A/B tests on recommendation strategies

### Unified Data Platform
- **BigQuery** as the central data warehouse: integrates POS, e-commerce, inventory, and supply chain data
- **Dataflow** for streaming real-time sales and inventory events into BigQuery
- **Pub/Sub** as the event backbone between microservices (order placed, inventory updated, shipment dispatched)
- **Looker** for business intelligence dashboards

### CI/CD and Rapid Deployment
- **Cloud Build + Artifact Registry + Cloud Deploy** for automated build, test, and progressive rollout pipelines
- Blue/green or canary deployments on GKE/Cloud Run for zero-downtime feature releases

### Security and PCI-DSS Compliance
→ Reference: [Security Controls](../reference/security-controls.md)

- **VPC Service Controls** to isolate payment processing environments
- **Cloud KMS** for encrypting cardholder data at rest
- **Secret Manager** for storing payment gateway credentials and API keys
- **Cloud Audit Logs** for all access to payment and PII data
- Tokenisation: never store raw card data; use a PCI-compliant payment gateway

## Exam Tips

- Handling traffic spikes = **GKE Autopilot or Cloud Run** + Global HTTP(S) Load Balancer
- "PCI-DSS compliance" = VPC Service Controls + Cloud KMS + Audit Logs + tokenisation
- Omnichannel unified data = BigQuery data warehouse + Dataflow streaming pipeline
- Product recommendations = Recommendations AI (faster to ship) or Vertex AI (custom models)
- "Microservices migration" = Cloud Run or GKE + Pub/Sub as event bus between services
