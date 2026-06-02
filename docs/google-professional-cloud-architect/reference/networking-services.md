---
title: Networking Services
sidebar_label: Networking Services
sidebar_position: 7
---

# Networking Services

> Docs: [Google Cloud networking overview](https://cloud.google.com/products/networking)

## Load Balancing

Google Cloud load balancers are software-defined and managed globally. Choose based on traffic type (L4 vs L7), scope (global vs regional), and origin (external vs internal).

| Load Balancer | Layer | Scope | Traffic Type | Use Case |
|---|---|---|---|---|
| **Global External HTTP(S)** | L7 | Global | HTTP/HTTPS | Public web apps, URL-based routing, TLS termination |
| **Regional External HTTP(S)** | L7 | Regional | HTTP/HTTPS | Regional web apps with regional compliance requirements |
| **External TCP/UDP NLB** | L4 | Regional | TCP/UDP | Non-HTTP protocols, preserve client source IP |
| **External SSL Proxy** | L4 | Global | SSL | Non-HTTP SSL traffic (e.g., WebSockets) |
| **Internal HTTP(S)** | L7 | Regional | HTTP/HTTPS | Internal microservices, service-to-service traffic |
| **Internal TCP/UDP** | L4 | Regional | TCP/UDP | Internal non-HTTP services (e.g., internal databases) |

**Key rule for the exam:** "Global" + "HTTP(S)" = Global External HTTP(S) LB. This is the answer for any scenario involving worldwide users or CDN integration.

> Docs: [Cloud Load Balancing overview](https://cloud.google.com/load-balancing/docs/load-balancing-overview)

## Cloud CDN

Caches responses at Google's globally distributed edge Points of Presence (PoPs) to reduce origin load and latency for end users.

- Works with the **Global External HTTP(S) Load Balancer** (not regional)
- Cache keyed on URL, headers, and cookies (configurable)
- **Signed URLs / Signed Cookies** for time-limited access to private content
- **Cache invalidation** to purge stale content immediately

**Use when:** Serving static assets (images, JS, CSS, video), software downloads, or any content accessed repeatedly by geographically distributed users.

> Docs: [Cloud CDN overview](https://cloud.google.com/cdn/docs/overview)

## Cloud Armor

Web Application Firewall (WAF) and DDoS protection, integrated with the Global External HTTP(S) LB.

- **Pre-configured WAF rules** (OWASP Top 10, SQLi, XSS)
- **Custom rules** (IP allow/deny lists, geo-based blocking, rate limiting)
- **Adaptive protection** (ML-based DDoS detection and automatic rule suggestions)
- **reCAPTCHA integration** for bot mitigation

**Not a replacement for IAP** — Armor filters traffic at the network edge; IAP enforces identity-based access.

> Docs: [Cloud Armor overview](https://cloud.google.com/armor/docs/cloud-armor-overview)

## API Management: Apigee vs API Gateway vs Cloud Endpoints

| | Apigee | API Gateway | Cloud Endpoints |
|---|---|---|---|
| **Best for** | Enterprise, partner-facing APIs | Serverless backends (Cloud Run, Functions) | Internal APIs, gRPC, OpenAPI |
| **Features** | Full lifecycle management, developer portal, analytics, monetisation | Lightweight auth, rate limiting | Auth, monitoring, OpenAPI/gRPC |
| **Cost** | High (enterprise pricing) | Low | Low |
| **Use when** | External partners, complex API products, revenue-generating APIs | Simple serverless API management | Microservices internal API management |

**Exam signal:** "Third-party partners", "developer portal", "API monetisation" → **Apigee**. Simple backend API protection → **API Gateway**.

> Docs: [Apigee overview](https://cloud.google.com/apigee/docs/api-platform/get-started/what-apigee)  
> Docs: [API Gateway overview](https://cloud.google.com/api-gateway/docs/about-api-gateway)  
> Docs: [Cloud Endpoints overview](https://cloud.google.com/endpoints/docs/openapi/about-cloud-endpoints)

## Private Service Connect

Allows consumers to access Google APIs and managed services (or third-party services in other VPCs) via **private internal IPs**, without traffic traversing the public internet.

**Use cases:**
- Access Google APIs (BigQuery, Cloud Storage, Pub/Sub) from a VPC without a public IP or internet gateway
- Expose a service from one VPC to consumers in other VPCs with full network isolation
- Required in strict data sovereignty or compliance environments where all traffic must stay private

> Docs: [Private Service Connect overview](https://cloud.google.com/vpc/docs/private-service-connect)

## Cloud NAT

Provides outbound internet access for VM instances and GKE nodes that have **no external IP address**.

- Outbound only — no inbound connections initiated from the internet
- Managed, highly available (no VMs to manage)
- Does not apply to Cloud Run or Cloud Functions (they use serverless NAT automatically)

> Docs: [Cloud NAT overview](https://cloud.google.com/nat/docs/overview)

## Cloud DNS

Managed, authoritative DNS service. Supports public and private zones.

- **Private zones** — resolve internal hostnames within a VPC (e.g., `db.internal.example.com`)
- **DNS peering** — share private DNS zones across VPCs
- **Response policies** — DNS-level firewall to block or redirect resolution of specific domains

> Docs: [Cloud DNS overview](https://cloud.google.com/dns/docs/overview)

## Official Documentation

- [Load Balancing overview](https://cloud.google.com/load-balancing/docs/load-balancing-overview)
- [Cloud CDN overview](https://cloud.google.com/cdn/docs/overview)
- [Cloud Armor overview](https://cloud.google.com/armor/docs/cloud-armor-overview)
- [Apigee overview](https://cloud.google.com/apigee/docs/api-platform/get-started/what-apigee)
- [API Gateway overview](https://cloud.google.com/api-gateway/docs/about-api-gateway)
- [Private Service Connect overview](https://cloud.google.com/vpc/docs/private-service-connect)
- [Cloud NAT overview](https://cloud.google.com/nat/docs/overview)
- [Cloud DNS overview](https://cloud.google.com/dns/docs/overview)
