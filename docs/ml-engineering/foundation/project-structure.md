---
sidebar_position: 4
---

# Project Structure

> **Customer framing:** A customer's FastAPI app started as a single file — as it grows to 20+ routes and 3 ML models, they need a layout that stays navigable and testable.

**Official docs:**
- [Bigger Applications — Multiple Files](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
- [APIRouter](https://fastapi.tiangolo.com/tutorial/bigger-applications/#apirouter)
- [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- [uv project layout](https://docs.astral.sh/uv/concepts/projects/)

---

## Recommended Layout

```
my-ml-api/
├── app/
│   ├── main.py               # creates FastAPI app, registers routers, lifespan
│   ├── routers/
│   │   ├── predict.py        # /predict endpoints
│   │   └── health.py         # /healthz, /readyz
│   ├── schemas/              # Pydantic request/response models
│   │   └── predict.py
│   ├── services/             # business logic — no FastAPI imports
│   │   └── inference.py
│   ├── repositories/         # DB access layer
│   │   └── predictions.py
│   └── core/
│       ├── config.py         # Settings via pydantic-settings
│       ├── lifespan.py       # startup/shutdown (model loading, DB pool)
│       └── deps.py           # shared Depends() callables
├── tests/
│   ├── conftest.py
│   └── test_predict.py
├── pyproject.toml
└── Dockerfile
```

### Layer responsibilities

| Layer | Lives in | Rule |
|---|---|---|
| Router | `routers/` | HTTP concerns only — parse input, call service, return response |
| Schema | `schemas/` | Pydantic models for request/response — no DB imports |
| Service | `services/` | Business logic — no FastAPI or DB imports |
| Repository | `repositories/` | DB queries only — no HTTP or business logic |
| Core | `core/` | Config, lifespan, shared dependencies |

:::info Best practice
Keeping these boundaries makes each layer testable in isolation — services can be unit tested without standing up an HTTP server.
:::

## APIRouter

Split routes by domain into routers, then include them in `main.py`.

```python
# app/routers/predict.py
from fastapi import APIRouter, Depends
from app.schemas.predict import PredictRequest, PredictResponse
from app.core.deps import get_current_user

router = APIRouter(prefix="/v1/predict", tags=["Inference"])

@router.post("/", response_model=PredictResponse)
def predict(payload: PredictRequest, user=Depends(get_current_user)):
    ...
```

```python
# app/main.py
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import predict, health

app = FastAPI(lifespan=lifespan)
app.include_router(predict.router)
app.include_router(health.router)
```

→ Centralise all `Depends()` callables in `core/deps.py` so routers don't import from each other. See [Dependency Injection — Global Dependencies](./dependency-injection.md#global-dependencies) for the pattern.

## Settings with pydantic-settings

```python
# app/core/config.py
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    model_path: str = "models/classifier.pkl"
    db_url: str
    api_key: str
    debug: bool = False

@lru_cache
def get_settings() -> Settings:
    return Settings()
```

`@lru_cache` ensures the settings object is constructed once — not on every request. Values are pulled from environment variables, with `.env` as a fallback.

```python
# inject into routes via DI
from app.core.config import get_settings
from fastapi import Depends

@router.get("/info")
def info(settings: Settings = Depends(get_settings)):
    return {"model": settings.model_path, "debug": settings.debug}
```

→ See [Dependency Injection — DI for Config Injection](./dependency-injection.md#di-for-config-injection) for how `Depends(get_settings)` works.

## Lifespan Events

Use lifespan to load models and open connections once at startup — not per request.

```python
# app/core/lifespan.py
from contextlib import asynccontextmanager
import joblib
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    app.state.model = joblib.load("models/classifier.pkl")
    app.state.db_pool = await create_db_pool()
    yield
    # shutdown
    await app.state.db_pool.close()
```

Access `app.state` inside routes via `request.app.state`:

```python
from fastapi import Request

@router.post("/predict")
def predict(payload: PredictRequest, request: Request):
    model = request.app.state.model
    ...
```

:::info Best practice
Never load a model inside a route handler — the cost is paid on every request. Load once in lifespan and access via `app.state`.
:::

→ See [Model Serving](../ml-integration/model-serving.md) for patterns around multi-model state, versioning, and readiness checks.

## When to Split vs Stay Flat

| Situation | Recommendation |
|---|---|
| < 5 routes, single domain | Keep flat — one `main.py` |
| 5–20 routes, 2–3 domains | Split into routers, keep schemas inline |
| 20+ routes or multiple ML models | Full layered layout above |
| Shared logic across multiple services | Extract to a shared internal package |

:::info Best practice
Don't pre-split for hypothetical future growth — restructure when the pain is real.
:::
