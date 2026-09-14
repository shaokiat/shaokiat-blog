---
sidebar_position: 1
---

# Model Serving

Reference: [FastAPI lifespan](https://fastapi.tiangolo.com/advanced/events/) | [Pydantic v2](https://docs.pydantic.dev/latest/)

This page assumes the upstream decisions are already made — that online serving beats a batch job, and that the `.pkl` you're loading is a versioned, full-pipeline artifact. Those decisions (batch vs online, serialization pitfalls, drift monitoring) live in [Inference & Production](../../data-science/ml-lifecycle/inference-and-production.md) on the data science side.

## Model Loading

Load models once at startup via lifespan — never on each request.

```python
# app/core/lifespan.py
from contextlib import asynccontextmanager
import joblib
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = joblib.load("models/classifier.pkl")
    app.state.scaler = joblib.load("models/scaler.pkl")
    yield
    # release GPU memory, close connections here if needed
```

Access in routes via the request object:

```python
from fastapi import Request

@router.post("/predict")
def predict(payload: PredictRequest, request: Request):
    model = request.app.state.model
    ...
```

## Request / Response Schemas

Use Pydantic models for validation and auto-generated OpenAPI docs.

```python
# app/models/predict.py
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    features: list[float] = Field(..., min_length=1)
    model_version: str = "latest"

class PredictResponse(BaseModel):
    prediction: float
    confidence: float | None = None
    model_version: str
```

## Batching

Batching amortises inference cost — useful when throughput matters more than individual latency.

```python
import asyncio
from collections import deque

_queue: deque = deque()
_batch_size = 32
_batch_timeout = 0.05  # seconds

async def batch_worker():
    while True:
        await asyncio.sleep(_batch_timeout)
        if not _queue:
            continue
        batch = [_queue.popleft() for _ in range(min(_batch_size, len(_queue)))]
        inputs = [item["input"] for item in batch]
        results = model.predict_batch(inputs)
        for item, result in zip(batch, results):
            item["future"].set_result(result)

@router.post("/predict")
async def predict(payload: PredictRequest):
    future = asyncio.get_event_loop().create_future()
    _queue.append({"input": payload.features, "future": future})
    result = await future
    return PredictResponse(prediction=result, model_version="v1")
```

For production batching, prefer a dedicated queue (Redis + worker) over in-process queues.

## Health & Readiness Endpoints

```python
@router.get("/health")
def health():
    return {"status": "ok"}

@router.get("/ready")
def ready(request: Request):
    if not hasattr(request.app.state, "model"):
        raise HTTPException(status_code=503, detail="model not loaded")
    return {"status": "ready"}
```

`/health` — process is alive. `/ready` — model is loaded and can serve traffic. Use both when deploying to Kubernetes or Cloud Run.
