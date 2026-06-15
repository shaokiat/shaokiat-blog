---
sidebar_position: 5
---

# OpenAPI & Docs

> **Customer framing:** A customer hands their FastAPI service to a frontend team — they need accurate, example-rich docs without maintaining a separate spec file.

**Official docs:**
- [FastAPI OpenAPI metadata](https://fastapi.tiangolo.com/tutorial/metadata/)
- [Path operation configuration (tags, summary, description)](https://fastapi.tiangolo.com/tutorial/path-operation-configuration/)
- [Declare Request Example Data](https://fastapi.tiangolo.com/tutorial/schema-extra-example/)
- [OpenAPI Extensions](https://fastapi.tiangolo.com/how-to/extending-openapi/)
- [Separate OpenAPI schemas for input/output](https://fastapi.tiangolo.com/how-to/separate-openapi-schemas/)

---

## Auto-generated UI

FastAPI generates two doc UIs from the same OpenAPI spec with no configuration:

| URL | UI | Best for |
|---|---|---|
| `/docs` | Swagger UI | Interactive testing, request building |
| `/redoc` | ReDoc | Readable reference, sharing with stakeholders |
| `/openapi.json` | Raw spec | Importing into Postman, code generation |

## App-level Metadata

Set once in the `FastAPI()` constructor:

```python
from fastapi import FastAPI

app = FastAPI(
    title="ML Inference API",
    summary="Serves predictions from trained classifiers.",
    description="""
Endpoints for running inference, managing model versions, and monitoring health.

**Authentication:** All endpoints require a Bearer token.
    """,
    version="2.1.0",
    contact={"name": "ML Platform", "email": "ml-platform@company.com"},
    license_info={"name": "Apache 2.0"},
    terms_of_service="https://company.com/tos",
)
```

## Tags and Route Metadata

Tags group routes in the Swagger UI. Define tag descriptions separately for cleaner display.

```python
tags_metadata = [
    {"name": "Inference", "description": "Run model predictions."},
    {"name": "Health", "description": "Liveness and readiness probes."},
]

app = FastAPI(openapi_tags=tags_metadata)
```

Configure individual routes:

```python
@router.post(
    "/predict",
    tags=["Inference"],
    summary="Run inference",
    description="Accepts a feature vector and returns a prediction with optional confidence score.",
    response_description="Prediction result",
    deprecated=False,
)
def predict(payload: PredictRequest) -> PredictResponse:
    ...
```

## Request and Response Examples

Add examples directly on the Pydantic model using `model_config`:

```python
from pydantic import BaseModel

class PredictRequest(BaseModel):
    features: list[float]
    threshold: float = 0.5

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"features": [0.1, 0.4, 0.9], "threshold": 0.7}
            ]
        }
    }
```

For multiple named examples per endpoint, use `openapi_extra`:

```python
@router.post(
    "/predict",
    openapi_extra={
        "requestBody": {
            "content": {
                "application/json": {
                    "examples": {
                        "high_confidence": {
                            "summary": "High threshold",
                            "value": {"features": [0.9, 0.8], "threshold": 0.9},
                        },
                        "low_confidence": {
                            "summary": "Low threshold",
                            "value": {"features": [0.3, 0.2], "threshold": 0.3},
                        },
                    }
                }
            }
        }
    },
)
def predict(payload: PredictRequest): ...
```

:::info Best practice
Add at least one `json_schema_extra` example on every request model — it's the fastest way to let consumers understand the expected shape without reading code.
:::

## Versioned Doc Endpoints

Expose separate Swagger UIs per API version:

```python
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

app = FastAPI(docs_url=None, redoc_url=None)  # disable default docs

@app.get("/v1/docs", include_in_schema=False)
def v1_docs():
    return get_swagger_ui_html(openapi_url="/v1/openapi.json", title="API v1")

@app.get("/v1/openapi.json", include_in_schema=False)
def v1_schema():
    return get_openapi(title="ML API v1", version="1.0.0", routes=v1_router.routes)
```

## Disabling Docs in Production

```python
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
)
```

:::info Best practice
Never expose `/openapi.json` in production — the spec reveals your full API surface, parameter names, and internal model structure to anyone who finds it.
:::

→ See [Project Structure — Settings with pydantic-settings](./project-structure.md#settings-with-pydantic-settings) for how `settings.debug` is defined and injected.

## Hiding Routes from the Schema

Use `include_in_schema=False` for internal endpoints that shouldn't appear in public docs:

```python
@router.get("/healthz", include_in_schema=False)
def health():
    return {"status": "ok"}
```
