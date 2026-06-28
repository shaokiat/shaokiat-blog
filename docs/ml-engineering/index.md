---

# Overview

A practical deep dive into building production-ready ML and AI systems with FastAPI — framed around real customer problems and FDE-style architectural thinking.

Every topic answers: *"A customer needed X — here's the architecture and tradeoffs."*

---

## Roadmap

### Tier 1 — Foundation

| # | Topic | What it covers |
|---|---|---|
| 0 | [API Fundamentals](./foundation/backend-fundamentals.md) | HTTP methods, status codes, request/response anatomy, REST conventions |
| 1 | [Routing & Validation](./foundation/routing-validation.md) | Path/query params, request bodies, Pydantic v2 models, response models |
| 2 | [Dependency Injection](./foundation/dependency-injection.md) | `Depends()`, sub-dependencies, DI for DB sessions, auth, config |
| 3 | [Async Foundations](./foundation/async-foundations.md) | `async def` vs `def`, event loop, threadpool executors for sync code |
| 4 | [Project Structure](./foundation/project-structure.md) | Router-based layout, schemas/services/repositories separation, pydantic-settings |
| 5 | [OpenAPI & Docs](./foundation/openapi-docs.md) | Auto-generated Swagger/ReDoc, schema metadata, versioned doc endpoints |
| 6 | [Auth Patterns](./foundation/auth-patterns.md) | JWT with OAuth2, API key auth, role-based access control via DI |

### Tier 2 — ML Integration

| # | Topic | What it covers |
|---|---|---|
| 7 | [Model Serving](./ml-integration/model-serving.md) | Lifespan model loading, single vs batch inference, state across workers |
| 8 | Background Tasks | `BackgroundTasks`, Celery/ARQ for distributed queues, job status polling |
| 9 | Streaming Responses | SSE for LLM token streaming, WebSocket endpoints, `StreamingResponse` |
| 10 | File & Data Ingestion | `UploadFile` for images/CSVs, chunked uploads, async S3 with aiobotocore |
| 11 | Async DB Integration | SQLAlchemy 2.0 async, asyncpg, pgvector for embedding search |
| 12 | LLM / Agent Endpoints | Wrapping Claude SDK / LangChain, tool-calling, streaming agent responses |

### Tier 3 — Production Engineering

| # | Topic | What it covers |
|---|---|---|
| 13 | Testing | `TestClient`, `AsyncClient`, `dependency_overrides`, integration tests |
| 14 | Observability | Structured JSON logging, OpenTelemetry tracing, Prometheus metrics |
| 15 | Containerisation & Deployment | Multi-stage Dockerfile, `/healthz` + `/readyz`, Cloud Run & GKE |
| 16 | Error Handling | Global exception handlers, custom error schemas, validation error formatting |
| 17 | Rate Limiting & Concurrency | `slowapi`, Redis-backed rate limiting, semaphore concurrency control |
| 18 | API Versioning | Prefix-based versioning, shared routers with overrides, deprecation headers |

---

> For GCP-native ML infrastructure (Vertex AI, pipelines, feature stores), see the [PCA Vertex AI reference](../google-professional-cloud-architect/reference/vertex-ai-genai.md).
