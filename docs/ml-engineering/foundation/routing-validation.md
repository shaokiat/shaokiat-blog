---
sidebar_position: 1
---

# Routing & Validation

> **Customer framing:** A customer exposes an ML inference API — they need strict input validation, clear error messages, and self-documenting endpoints without writing boilerplate.

**Official docs:**
- [Path Parameters](https://fastapi.tiangolo.com/tutorial/path-params/)
- [Query Parameters](https://fastapi.tiangolo.com/tutorial/query-params/)
- [Request Body](https://fastapi.tiangolo.com/tutorial/body/)
- [Response Model](https://fastapi.tiangolo.com/tutorial/response-model/)
- [Pydantic v2 Models](https://docs.pydantic.dev/latest/concepts/models/)
- [Pydantic Field Validators](https://docs.pydantic.dev/latest/concepts/validators/)
- [Status Codes](https://fastapi.tiangolo.com/tutorial/response-status-code/)

---

## Path Parameters

FastAPI extracts path parameters by name and coerces them to the declared type. Invalid types return a `422` automatically.

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/models/{model_id}/predict")
def predict(model_id: int):
    return {"model_id": model_id}
```

Use `Literal` to constrain to a fixed set of values:

```python
from typing import Literal

@router.get("/models/{version}")
def get_model(version: Literal["v1", "v2"]):
    ...
```

## Query Parameters

Any function parameter not in the path is treated as a query parameter. Use `Optional` or a default value to make it optional.

```python
from typing import Annotated
from fastapi import Query

@router.get("/predictions")
def list_predictions(
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: int = 0,
    label: str | None = None,
):
    ...
```

`Query(ge=1, le=100)` adds server-side validation and documents constraints in the OpenAPI schema.

## Request Bodies

Declare a Pydantic model as the parameter type — FastAPI reads the JSON body and validates it.

```python
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    features: list[float] = Field(..., min_length=1, max_length=512)
    model_version: str = "latest"
    threshold: float = Field(default=0.5, ge=0.0, le=1.0)

@router.post("/predict")
def predict(payload: PredictRequest):
    return {"received": len(payload.features)}
```

## Pydantic v2 Field Validators

Use `@field_validator` for single-field logic and `@model_validator` for cross-field rules.

```python
from pydantic import BaseModel, field_validator, model_validator

class PredictRequest(BaseModel):
    features: list[float]
    top_k: int = 1
    threshold: float = 0.5

    @field_validator("features")
    @classmethod
    def features_not_empty(cls, v: list[float]) -> list[float]:
        if not v:
            raise ValueError("features must not be empty")
        return v

    @model_validator(mode="after")
    def top_k_within_range(self) -> "PredictRequest":
        if self.top_k > len(self.features):
            raise ValueError("top_k cannot exceed number of features")
        return self
```

## Custom Types with Annotated

`Annotated` lets you attach constraints and metadata to a type, keeping models clean and reusable.

```python
from typing import Annotated
from pydantic import BaseModel, Field

FeatureVector = Annotated[list[float], Field(min_length=1, max_length=512)]
Score = Annotated[float, Field(ge=0.0, le=1.0)]

class PredictRequest(BaseModel):
    features: FeatureVector
    threshold: Score = 0.5
```

:::info Best practice
Define shared types like `FeatureVector` once in `app/schemas/types.py` and import them across models — constraints are enforced consistently without repetition.
:::

## Response Models

Declare `response_model` to control what gets serialized — strips fields the caller shouldn't see.

```python
class PredictResponse(BaseModel):
    prediction: float
    confidence: float | None = None
    model_version: str

@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    return {
        "prediction": 0.92,
        "confidence": 0.87,
        "model_version": "v2",
        "internal_trace_id": "abc123",  # stripped — not in PredictResponse
    }
```

Use `response_model_exclude_unset=True` to omit fields that weren't explicitly set — useful for partial update responses.

```python
@router.patch("/config", response_model=ConfigResponse, response_model_exclude_unset=True)
def update_config(updates: ConfigUpdate):
    ...
```

## HTTP Status Codes

FastAPI defaults to `200 OK`. Override with `status_code` and raise errors with `HTTPException`.

```python
from fastapi import HTTPException, status

@router.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
def submit_job(payload: JobRequest):
    ...

@router.delete("/models/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model(model_id: int):
    ...

@router.get("/models/{model_id}")
def get_model(model_id: int):
    model = db.get(model_id)
    if not model:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
    return model
```

:::info Best practice
Use `fastapi.status` constants (e.g. `status.HTTP_404_NOT_FOUND`) instead of raw integers — they're self-documenting and caught by IDE autocomplete.
:::

→ See [API Fundamentals — HTTP Status Codes](./backend-fundamentals.md#http-status-codes) for the full reference on what each code means and when to use it.
