---
---

# Overview

A practical deep dive into building production-ready LLM inference and RAG systems with FastAPI — framed around real customer problems and FDE-style architectural thinking.

Every topic answers: *"A customer needed X — here's the architecture and tradeoffs."*

---

## Roadmap

### LLM Inference

| # | Topic | What it covers |
|---|---|---|
| 1 | [Model Serving](./llm-inference/model-serving.md) | Lifespan model loading, single vs batch inference, state across workers |
| 2 | [vLLM](./llm-inference/vllm-serving.md) | PagedAttention, continuous batching, chunked prefill, prefix caching, quantization |
| 3 | Streaming Responses | SSE for LLM token streaming, WebSocket endpoints, `StreamingResponse` |
| 4 | Background Tasks | `BackgroundTasks`, Celery/ARQ for distributed queues, job status polling |
| 5 | LLM / Agent Endpoints | Wrapping Claude SDK / LangChain, tool-calling, streaming agent responses |

### RAG

| # | Topic | What it covers |
|---|---|---|
| 6 | [RAG](./rag/index.md) | Pipeline map, when RAG beats long context, the four failure points |
| 7 | [Ingestion & Indexing](./rag/ingestion-and-indexing.md) | Parsing/OCR, chunking, embeddings, multi-tenant metadata, HNSW vs IVFFlat |
| 8 | [Retrieval](./rag/retrieval.md) | Hybrid search, BM25, RRF, metadata filtering, reranking, agentic retrieval |
| 9 | [Evaluation & Guardrails](./rag/evaluation.md) | Recall@k and MRR, RAGAS, how much eval is enough, escalation thresholds |
| 10 | [Production](./rag/production.md) | Latency budget, corpus scaling, tenant isolation, airgapped deployment |

### Archive — FastAPI Foundations

Kept as local drafts. They are not published to the site; open them in the repo or run the dev server to read them.

| Topic | What it covers |
|---|---|
| API Fundamentals | HTTP methods, status codes, request/response anatomy, REST conventions |
| Routing & Validation | Path/query params, request bodies, Pydantic v2 models, response models |
| Dependency Injection | `Depends()`, sub-dependencies, DI for DB sessions, auth, config |
| Async Foundations | `async def` vs `def`, event loop, threadpool executors for sync code |
| Project Structure | Router-based layout, schemas/services/repositories separation, pydantic-settings |
| OpenAPI & Docs | Auto-generated Swagger/ReDoc, schema metadata, versioned doc endpoints |
| Auth Patterns | JWT with OAuth2, API key auth, role-based access control via DI |

---

> For GCP-native ML infrastructure (Vertex AI, pipelines, feature stores), see the [PCA Vertex AI reference](../google-professional-cloud-architect/reference/vertex-ai-genai.md).
