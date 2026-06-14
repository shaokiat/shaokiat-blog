---
title: CI/CD and Deployment
sidebar_label: CI/CD & Deployment
sidebar_position: 15
---

# CI/CD and Deployment

> Docs: [CI/CD on Google Cloud](https://cloud.google.com/docs/ci-cd)

## SDLC Stages on GCP

The exam maps the Software Development Lifecycle to GCP services at each stage:

| Stage | What Happens | GCP Services |
|---|---|---|
| **Develop** | Write and review code | Cloud Shell, Cloud Code (IDE plugin), Cloud Source Repositories / GitHub |
| **Build & Test** | Compile, run unit + integration tests, produce artefacts | **Cloud Build** |
| **Store** | Version and store container images and packages | **Artifact Registry** |
| **Release** | Promote through dev → staging → prod with approval gates | **Cloud Deploy** |
| **Rollout** | Progressive delivery — canary/blue-green traffic shifting | Cloud Deploy + Cloud Run traffic splits / GKE |
| **Provision** | Spin up infrastructure for each environment | **Terraform**, Config Connector |

> Docs: [DevOps on Google Cloud](https://cloud.google.com/devops)

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

## Testing Strategies

### Test types and where they run

| Test Type | Purpose | When It Runs | Where It Runs |
|---|---|---|---|
| **Unit tests** | Test individual functions in isolation | On every commit, before the image is built | **Local** (fast feedback) + **Cloud Build** (enforcement gate) |
| **Integration tests** | Test interactions between services/dependencies | After image is built; deployed to a test/staging env | **Cloud Build** step using GCP emulators, or against a real staging environment |
| **Acceptance tests** (UAT) | Validate business requirements against a staging environment | After integration tests pass; before promoting to prod | **Staging environment** — Cloud Build post-deploy step or manual sign-off |
| **Smoke tests** | Quick sanity check that core paths work after a deploy | Immediately after each promotion (staging → prod) | **Cloud Deploy `verifyConfig`** hook, or a Cloud Build step after rollout |
| **Load tests** | Validate performance under traffic | On-demand, before major releases | External tools (Locust, k6, JMeter) against a staging Cloud Run or GKE service |

### Pipeline stage breakdown

```
Local dev      →  Cloud Build (CI)  →  Test env       →  Staging env        →  Prod
─────────────────────────────────────────────────────────────────────────────────────
Unit tests        Unit tests            Integration        Acceptance tests      Smoke tests
(fast feedback)   (enforced gate)       tests              (UAT sign-off)        (post-deploy)
Linting                                 Smoke tests
```

**Key rules:**
- **Unit tests run twice** — locally for fast feedback, then in Cloud Build as a hard gate. Cloud Build fails the build if they don't pass, blocking promotion.
- **Integration tests never run locally against prod APIs** — use GCP emulators (Pub/Sub, Bigtable, Spanner, Firestore) in Cloud Build, or deploy to a dedicated test environment with its own GCP project.
- **Acceptance tests require a stable environment** — run in staging (not the ephemeral build), where the full stack is deployed and realistic data exists.
- **Smoke tests run in every environment post-deploy** — they are lightweight (a few critical paths only) and must be non-destructive so they're safe to run in prod.
- **Load tests never run in prod** — always against staging to avoid affecting real users.

### Environment-to-test mapping (exam signal)

| Environment | Tests That Run Here |
|---|---|
| **Dev (local)** | Unit tests, linting |
| **Cloud Build (CI)** | Unit tests (gate), static analysis, container scan (Binary Authorization) |
| **Test / Dev GCP project** | Integration tests (with emulators or real services), smoke tests post-deploy |
| **Staging GCP project** | Acceptance tests, load tests, smoke tests post-deploy |
| **Prod GCP project** | Smoke tests only (non-destructive, post-deploy) |

**Emulators for integration testing** — GCP provides local emulators (Pub/Sub, Bigtable, Spanner, Firestore) so integration tests run without hitting production APIs. Run them as a service container step in Cloud Build.

**Use when the exam says:**
- "Run tests before deploying to production" → Cloud Build step in the pipeline (unit + integration)
- "Validate business requirements before going live" → acceptance tests in staging
- "Test against real GCP services without incurring cost" → GCP emulators in Cloud Build
- "Validate the deployment didn't break anything" → smoke test via Cloud Deploy `verifyConfig` hook
- "Prevent untested code from reaching prod" → Cloud Build gate + Cloud Deploy approval

> Docs: [Testing strategies on GCP](https://cloud.google.com/architecture/devops/devops-tech-test-automation)

## GitHub → Cloud Run: Automatic Deployment Workflow

The canonical GCP pattern for auto-deploying commits to Cloud Run from GitHub.

### One-time setup

1. **Enable APIs** — Cloud Build, Cloud Run, Artifact Registry
2. **Connect GitHub repo to Cloud Build** — in the Cloud Build console, link your GitHub account and select the repository (installs the Cloud Build GitHub App)
3. **Create a build trigger** — filter by branch (`^dev$`), point to `cloudbuild.yaml` in the repo root; this trigger fires on every push to `dev`
4. **Grant Cloud Build service account permissions:**
   - `roles/run.admin` — to deploy Cloud Run services
   - `roles/iam.serviceAccountUser` — to act as the Cloud Run runtime service account
   - `roles/artifactregistry.writer` — to push images

### `cloudbuild.yaml` steps (dev branch)

```yaml
steps:
  # 1. Run unit tests
  - name: 'python:3.11'
    entrypoint: 'pytest'
    args: ['tests/unit']

  # 2. Build container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '$_IMAGE', '.']

  # 3. Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '$_IMAGE']

  # 4. Deploy to Cloud Run (dev)
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-service-dev'
      - '--image=$_IMAGE'
      - '--region=asia-southeast1'
      - '--platform=managed'

substitutions:
  _IMAGE: 'asia-southeast1-docker.pkg.dev/$PROJECT_ID/my-repo/my-service:$COMMIT_SHA'
```

### What happens on every `git push` to `dev`

```
git push origin dev
       ↓
Cloud Build trigger fires
       ↓
cloudbuild.yaml runs:
  Step 1 — unit tests (fail fast; pipeline stops if tests fail)
  Step 2 — docker build (tags image with $COMMIT_SHA)
  Step 3 — docker push → Artifact Registry
  Step 4 — gcloud run deploy → Cloud Run (dev service)
       ↓
Cloud Run deploys new revision, shifts 100% traffic to it
```

**`$COMMIT_SHA`** — Cloud Build injects this automatically; tagging images by commit SHA makes every build traceable and rollback trivial.

### Promoting to staging / prod (Cloud Deploy)

For environments beyond dev, swap the `gcloud run deploy` step for **Cloud Deploy**:

1. Create a Cloud Deploy **delivery pipeline** with stages: `dev → staging → prod`
2. Cloud Build creates a Cloud Deploy **release** (instead of deploying directly)
3. Cloud Deploy promotes dev → staging automatically; staging → prod requires **manual approval**

| Approach | When to use |
|---|---|
| `gcloud run deploy` in `cloudbuild.yaml` | Dev only — fast, simple, no approval needed |
| Cloud Deploy pipeline | Multi-environment with promotion gates and rollback |

**Exam signal:** If the question mentions "automatic deploy on push" → Cloud Build trigger. If it mentions "approval before prod" → Cloud Deploy approval gate.

> Docs: [Deploying to Cloud Run using Cloud Build](https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run)

## Audit Trails for Builds and Images

Four services combine to answer: *who built what, from what source, what's in it, and who deployed it.*

| Service | What It Records | Exam Signal |
|---|---|---|
| **Cloud Audit Logs** | Every API call — who triggered a build, who pushed an image, who deployed to Cloud Run/GKE | "Who deployed this revision?" / "Track all changes to prod" |
| **Cloud Build logs + provenance** | Full build log per build ID; SLSA provenance (proves the image was built by Cloud Build from a specific commit) | "Prove where an image came from" / "SLSA compliance" |
| **Artifact Analysis** (Container Analysis) | Vulnerability scan results (CVEs) and attestations stored as metadata on each image digest in Artifact Registry | "Scan images for vulnerabilities" / "Know what's in an image" |
| **Artifact Registry** | Immutable image digests, tags, push/pull history per image | "Trace which image version is running" / "Prevent tag mutation" |

### How the services connect

```
git push → Cloud Build trigger
              ↓
         Cloud Build runs build
         ├── Build log saved to Cloud Logging + Cloud Storage (by build ID)
         ├── SLSA provenance generated (links image digest → commit SHA → build job)
         └── Image pushed to Artifact Registry (tagged by $COMMIT_SHA)
                   ↓
         Artifact Analysis scans image for CVEs
         └── Scan results + attestations stored as metadata on image digest
                   ↓
         Cloud Deploy promotes image
         └── Cloud Audit Logs records every promotion, approval, and rollout
```

### Key concepts

**SLSA Provenance** — Cloud Build can generate a signed provenance document per build, proving:
- Which source repo and commit triggered the build
- Which Cloud Build project and job ran it
- The exact image digest produced

This is the GCP answer to "how do you prove this image wasn't tampered with between build and deploy?"

**Artifact Registry image digest vs tag** — tags are mutable (`:latest` can point to different images over time); digests (`sha256:abc…`) are immutable. Audit trails should reference digests, not tags.

**Cloud Audit Logs log types for CI/CD:**
- *Admin Activity* — build trigger created, IAM role granted to Cloud Build SA (always on)
- *Data Access* — image pulled from Artifact Registry, build log read (must be explicitly enabled)

**Use when the exam says:**
- "Prove an image was built from a specific commit" → **SLSA provenance** (Cloud Build)
- "Who deployed this image to prod and when?" → **Cloud Audit Logs** (Data Access + Admin Activity)
- "Know what vulnerabilities exist in a running container" → **Artifact Analysis**
- "Ensure only scanned, attested images are deployed" → **Binary Authorization** (see below)

> Docs: [SLSA provenance on Cloud Build](https://cloud.google.com/build/docs/securing-builds/view-build-provenance)  
> Docs: [Artifact Analysis overview](https://cloud.google.com/artifact-analysis/docs/artifact-analysis)  
> Docs: [Cloud Audit Logs for Cloud Build](https://cloud.google.com/build/docs/securing-builds/audit-logs)

## Config Sync

**Config Sync** is a GitOps operator (part of **Anthos Config Management / GKE Enterprise**) that runs inside GKE clusters and continuously pulls Kubernetes manifests from a Git repo, keeping every cluster's state in sync with what's committed in Git.

- **Pull model** — the Config Sync operator polls the repo; no external system pushes to the cluster
- **Continuous reconciliation** — if someone manually edits a resource in the cluster (drift), Config Sync detects and corrects it
- **Fleet-wide** — a single repo can govern dozens of clusters; each cluster pulls the same (or environment-specific) config

### What Config Sync manages

Config Sync is for **cluster configuration**, not application image versions:

- Namespaces and resource quotas
- RBAC roles and bindings
- NetworkPolicies
- Ingress / Gateway configs
- CRDs and cluster-scoped resources
- Policy configs (OPA/Gatekeeper constraints)

### Config Sync vs Cloud Deploy

| | Config Sync | Cloud Deploy |
|---|---|---|
| **Model** | Pull — cluster watches Git continuously | Push — you trigger a release explicitly |
| **What it manages** | Cluster config: namespaces, RBAC, policies, manifests | Application releases: new container image versions |
| **Trigger** | Any Git commit to the watched branch/path | `gcloud deploy releases create` (from Cloud Build) |
| **Approval gates** | None — Git is the source of truth | Manual approval before promoting to each stage |
| **Rollback** | Revert the Git commit; Config Sync re-syncs old state | One-click rollback to previous release |
| **Multi-cluster** | Designed for fleet-wide config delivery | Targets can span multiple clusters per stage |
| **Exam signal** | "Enforce consistent config across clusters" / "GitOps for cluster state" | "Promote app version through environments with approval" |

**They are complementary:** Config Sync manages cluster base config; Cloud Deploy ships new application image versions into those clusters.

### How they fit together in a full pipeline

```
GitHub repo (manifests)          GitHub repo (app code)
        ↓                                 ↓
  Config Sync                       Cloud Build
  (pull, continuous)                (CI: build + test)
        ↓                                 ↓
  GKE cluster config             Artifact Registry
  (namespaces, RBAC,                    ↓
   policies stay in sync)         Cloud Deploy
                                  (promote: dev → staging → prod)
                                        ↓
                                  GKE / Cloud Run
                                  (new app revision)
```

**Use when the exam says:**
- "Enforce consistent Kubernetes config across a fleet of clusters" → **Config Sync**
- "Prevent config drift in GKE clusters" → **Config Sync**
- "GitOps workflow for cluster policies and RBAC" → **Config Sync**
- "Promote a new container image through environments with approval" → **Cloud Deploy**
- "Declaratively manage GCP resources alongside Kubernetes manifests" → **Config Connector** (see infrastructure-orchestration reference)

> Docs: [Config Sync overview](https://cloud.google.com/kubernetes-engine/docs/add-on/config-sync/overview)  
> Docs: [Anthos Config Management](https://cloud.google.com/anthos-config-management/docs/overview)

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
- "Enforce consistent config / prevent drift across GKE clusters" → **Config Sync**
- Cloud Deploy requires manual approval gates for prod — the exam tests whether you know this is a feature, not a limitation
- Config Sync and Cloud Deploy are complementary — config sync manages cluster state, Cloud Deploy manages app versions

## Official Documentation

- [Cloud Build overview](https://cloud.google.com/build/docs/overview)
- [Artifact Registry overview](https://cloud.google.com/artifact-registry/docs/overview)
- [Cloud Deploy overview](https://cloud.google.com/deploy/docs/overview)
- [Binary Authorization overview](https://cloud.google.com/binary-authorization/docs/overview)
- [Cloud Run traffic splitting](https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration)
- [Config Sync overview](https://cloud.google.com/kubernetes-engine/docs/add-on/config-sync/overview)
- [Anthos Config Management](https://cloud.google.com/anthos-config-management/docs/overview)
