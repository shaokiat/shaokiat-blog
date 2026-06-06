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

---

## Apigee — Deep Dive

Apigee is Google Cloud's **full-lifecycle API management platform**. It sits as a proxy layer between API consumers (external partners, mobile apps, third-party developers) and your backend services, handling everything from security enforcement to traffic shaping to developer onboarding.

> Docs: [Apigee overview](https://cloud.google.com/apigee/docs/api-platform/get-started/what-apigee)

### Core Concepts

**API Proxy**
The fundamental unit in Apigee. An API proxy is a facade that sits in front of your backend service. Consumers call the proxy URL; Apigee applies policies, then forwards the request to the backend. Your backend URL is never exposed directly.

```
Consumer → Apigee API Proxy → Backend Service (Cloud Run, GKE, on-prem)
```

**API Product**
A bundle of one or more API proxies packaged with an access quota and plan. A single backend API can be packaged into multiple products — e.g. a "Free" product (100 calls/day) and a "Premium" product (unlimited calls). Developers subscribe to products, not proxies directly.

**Developer Portal**
A self-service website where external developers can discover APIs, read documentation, register apps, and obtain API keys. Apigee generates the portal from your API specs (OpenAPI/Swagger) automatically.

**App and API Key**
When a developer registers on the portal, they create an *App* and receive an API key. The key is tied to an API product and its quota. Apigee validates the key on every inbound request.

### Policy Framework

Apigee enforces behaviour through **policies** attached to the request or response flow. Policies are applied without changing backend code.

| Policy Category | Examples |
|---|---|
| **Security** | OAuth 2.0 token validation, API key verification, JWT validation, HMAC signature |
| **Traffic management** | Quota (per API key), Spike Arrest (rate limiting), Concurrent Rate Limit |
| **Mediation** | JSON ↔ XML transformation, payload masking, header manipulation, SOAP-to-REST |
| **Extension** | Call external services, JavaScript/Python custom logic, cache lookup/population |
| **Threat protection** | JSON/XML threat protection (malformed payload rejection), RegEx threat protection |

### Environments and Environment Groups

Apigee uses **environments** (e.g. `dev`, `staging`, `prod`) to deploy different versions of an API proxy. An **environment group** maps hostnames to environments, so `api-dev.example.com` routes to `dev` and `api.example.com` routes to `prod`.

### OAuth 2.0 and Security Flows

Apigee has built-in support for all standard OAuth 2.0 grant types:

| Grant Type | Use Case |
|---|---|
| **Client Credentials** | Machine-to-machine (M2M), no user involved — common for partner integrations |
| **Authorization Code** | User-delegated access — web and mobile apps acting on behalf of a user |
| **Implicit** | Legacy browser-based flows (now discouraged) |
| **Resource Owner Password** | Direct credential exchange (avoid unless legacy requirement) |

Apigee acts as the **OAuth authorization server** — it issues, validates, and revokes tokens without your backend needing to implement OAuth logic.

### Analytics and Monetisation

- **Built-in analytics dashboard** — tracks API traffic, latency, error rates, and quota usage per developer and product
- **Custom reports** — slice analytics by proxy, app, developer, or environment
- **Monetisation** (Apigee X) — define billing models (pay-per-call, revenue sharing, freemium) and generate invoices for API usage directly from the platform

### Apigee X vs Apigee Hybrid

| | Apigee X | Apigee Hybrid |
|---|---|---|
| **Runtime location** | Fully managed on Google Cloud | Runtime runs in your own Kubernetes cluster (on-prem or another cloud) |
| **Management plane** | Google Cloud | Google Cloud |
| **Use when** | All workloads on GCP | Data residency requirements, on-prem backends, low-latency to on-prem |
| **Ops overhead** | Low | Higher (you manage the runtime cluster) |

### When Apigee Appears in Case Studies

The exam uses Apigee when a scenario includes any of:

- **External partner or developer ecosystem** — third parties need access to your APIs with different tiers, quotas, or contracts
- **API monetisation** — charging for API usage or managing revenue-sharing agreements
- **Legacy SOAP-to-REST** — exposing an old SOAP backend as a modern REST API without changing the backend
- **Centralised API governance across teams** — one team owns API security policy; product teams just deploy proxies
- **Developer self-service portal** — developers discover, subscribe to, and test APIs without involving your engineering team

**KnightMotives example:** Third-party developers building in-vehicle apps need access to vehicle telemetry APIs. Apigee provides separate API products (with different quotas) for OEM partners vs. independent developers, a self-service portal, and OAuth-based authentication — all without changes to the backend data services.

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
- [Apigee API proxies](https://cloud.google.com/apigee/docs/api-platform/fundamentals/understanding-apis-and-api-proxies)
- [Apigee policies reference](https://cloud.google.com/apigee/docs/api-platform/reference/policies/reference-overview-policy)
- [Apigee X vs Hybrid](https://cloud.google.com/apigee/docs/api-platform/get-started/compare-apigee-products)
- [Apigee monetisation](https://cloud.google.com/apigee/docs/api-platform/monetization/basics)
- [API Gateway overview](https://cloud.google.com/api-gateway/docs/about-api-gateway)
- [Private Service Connect overview](https://cloud.google.com/vpc/docs/private-service-connect)
- [Cloud NAT overview](https://cloud.google.com/nat/docs/overview)
- [Cloud DNS overview](https://cloud.google.com/dns/docs/overview)
