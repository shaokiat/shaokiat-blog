---
title: CI/CD and Deployment
sidebar_label: CI/CD & Deployment
sidebar_position: 15
---

# CI/CD and Deployment

> Docs: [CI/CD on Google Cloud](https://cloud.google.com/docs/ci-cd)

## The GCP CI/CD Toolchain

```
Code → Cloud Build → Artifact Registry → Cloud Deploy → GKE / Cloud Run
```

| Tool | Role |
|---|---|
| **Cloud Build** | Build and test — compiles code, runs tests, produces artefacts |
| **Artifact Registry** | Store and manage — Docker images, Maven, npm, Python, Go packages |
| **Cloud Deploy** | Deploy and promote — progressive delivery across environments |

## Cloud Build

Fully managed CI service. Triggered by:
- Push to a branch in Cloud Source Repositories, GitHub, or GitLab
- Manual or scheduled invocation
- Pub/Sub message

A **build config** (`cloudbuild.yaml`) defines build steps — each step runs in a Docker container. Steps run sequentially by default; parallel steps are supported.

**Key features:**
- Built-in integrations with GKE, Cloud Run, and Artifact Registry
- Build triggers with branch/tag filters and substitution variables
- Private pools for builds that need access to VPC resources

> Docs: [Cloud Build overview](https://cloud.google.com/build/docs/overview)

## Artifact Registry

Central repository for all build artefacts. Supports multiple formats in the same service:

| Format | Use Case |
|---|---|
| Docker | Container images for GKE, Cloud Run |
| Maven / Gradle | Java dependencies |
| npm | Node.js packages |
| Python (PyPI) | Python packages |
| Generic | Binary files, Helm charts |

**Use over Container Registry (now deprecated):** Artifact Registry replaced GCR; it supports non-container formats and regional repos.

> Docs: [Artifact Registry overview](https://cloud.google.com/artifact-registry/docs/overview)

## Cloud Deploy

Managed continuous delivery service. Defines a **delivery pipeline** with ordered **stages** (e.g. dev → staging → prod), each targeting a **deployment target** (GKE cluster, Cloud Run service, or Anthos cluster).

- **Releases** — a specific version of your app, referenced by Artifact Registry image digest
- **Rollouts** — the deployment of a release to a specific target; can require manual approval
- **Approval gates** — require a human to approve before promoting to the next stage (e.g. prod)
- **Rollback** — one-click rollback to the previous release

> Docs: [Cloud Deploy overview](https://cloud.google.com/deploy/docs/overview)

## Deployment Strategies

| Strategy | How It Works | Risk | Rollback |
|---|---|---|---|
| **Rolling** | Replace old instances gradually, N at a time | Low blast radius | Slow — roll forward to previous version |
| **Blue/Green** | Run two identical environments; switch traffic at the load balancer | Zero downtime cutover | Instant — flip traffic back to blue |
| **Canary** | Send a small % of traffic to the new version; ramp up if metrics are healthy | Minimal user impact | Fast — redirect remaining traffic back |

**GKE:** Rolling updates are the default (`RollingUpdate` strategy in Deployment spec). Blue/green and canary require traffic splitting via a service mesh or Ingress.

**Cloud Run:** Native traffic splitting — specify `--traffic` percentages across revisions, enabling canary and blue/green natively.

## Binary Authorization

Policy-based control that ensures only **verified, signed container images** are deployed to GKE or Cloud Run. Part of securing the software supply chain.

- You define an **attestation** (a cryptographic signature) that must exist on an image before it can be deployed
- Attestations are created by trusted authorities (e.g. Cloud Build after a successful security scan)
- Integrates with Artifact Registry and Container Analysis (vulnerability scanning)

**Use when:** The exam mentions *"ensure only approved images are deployed"* or *"secure the software supply chain"*.

> Docs: [Binary Authorization overview](https://cloud.google.com/binary-authorization/docs/overview)

## Exam Tips

- "Centralised CI/CD for containerised workloads" → Cloud Build + Artifact Registry + Cloud Deploy
- "Zero-downtime deployment with instant rollback" → **Blue/Green**
- "Gradually roll out to a subset of users first" → **Canary**
- "Ensure only scanned images are deployed" → **Binary Authorization**
- Cloud Deploy requires manual approval gates for prod — the exam tests whether you know this is a feature, not a limitation

## Official Documentation

- [Cloud Build overview](https://cloud.google.com/build/docs/overview)
- [Artifact Registry overview](https://cloud.google.com/artifact-registry/docs/overview)
- [Cloud Deploy overview](https://cloud.google.com/deploy/docs/overview)
- [Binary Authorization overview](https://cloud.google.com/binary-authorization/docs/overview)
- [Cloud Run traffic splitting](https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration)
