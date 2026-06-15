---
sidebar_position: 2
---

# Dependency Injection

> **Customer framing:** A customer's API needs shared resources (DB connections, auth context, feature flags) injected cleanly into handlers without global state.

**Official docs:**
- [Dependencies — First Steps](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [Sub-dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/sub-dependencies/)
- [Dependencies with yield (scoped)](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/)
- [Global dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/global-dependencies/)
- [Dependencies in path operation decorators](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-in-path-operation-decorators/)

---

## Depends() Basics

Any callable — function, class, or coroutine — can be a dependency. FastAPI resolves and injects it before the handler runs.

```python
from fastapi import Depends, APIRouter

router = APIRouter()

def get_settings():
    return {"model_version": "v2", "threshold": 0.5}

@router.get("/config")
def read_config(settings: dict = Depends(get_settings)):
    return settings
```

FastAPI inspects the dependency's signature and injects *its* parameters too — recursively.

## Sub-dependencies

Dependencies can depend on other dependencies. FastAPI builds the graph and resolves in the right order.

```python
from fastapi import Depends, Header, HTTPException

def get_token(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    return authorization.removeprefix("Bearer ")

def get_current_user(token: str = Depends(get_token)) -> dict:
    user = verify_jwt(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

@router.get("/me")
def read_me(user: dict = Depends(get_current_user)):
    return user
```

`get_current_user` depends on `get_token` — FastAPI resolves the chain automatically.

→ See [Auth Patterns](./auth-patterns.md) for the full JWT implementation of `get_current_user`.

## Scoped Dependencies with yield

Use `yield` to create resources that are opened before the handler and closed after the response.

```python
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import AsyncSessionLocal

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/predictions")
async def list_predictions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prediction))
    return result.scalars().all()
```

:::info Best practice
One DB session per request, closed when the response is sent. Never share a session across requests or store it on `app.state`.
:::

## Dependency Caching

By default, FastAPI caches a dependency's return value within a single request — if two handlers both depend on `get_current_user`, it only runs once.

```python
def get_current_user(token: str = Depends(get_token)) -> dict:
    return verify_jwt(token)
```

Disable caching when you need a fresh value each call:

```python
@router.get("/fresh")
def handler(user: dict = Depends(get_current_user, use_cache=False)):
    ...
```

## Global Dependencies

Apply a dependency to every route in a router or the entire app — useful for auth, rate limiting, or logging.

```python
from fastapi import FastAPI, Depends

app = FastAPI(dependencies=[Depends(verify_api_key)])

# or scoped to a router
router = APIRouter(dependencies=[Depends(verify_api_key)])
```

Dependencies in decorators run but their return value isn't injected — use this for side-effect-only deps.

```python
@router.post("/predict", dependencies=[Depends(check_rate_limit)])
def predict(payload: PredictRequest):
    ...
```

## DI for Config Injection

Inject settings via DI instead of importing a global — makes overriding in tests trivial.

```python
from functools import lru_cache
from app.core.config import Settings

@lru_cache
def get_settings() -> Settings:
    return Settings()

@router.get("/info")
def info(settings: Settings = Depends(get_settings)):
    return {"model_path": settings.model_path}
```

→ See [Project Structure — Settings with pydantic-settings](./project-structure.md#settings-with-pydantic-settings) for the full `Settings` class definition and env var wiring.

## Testing with dependency_overrides

Swap any dependency in tests without touching production code:

```python
from fastapi.testclient import TestClient
from app.main import app

def override_get_current_user():
    return {"id": 1, "role": "admin"}

app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

def test_protected_route():
    response = client.get("/me")
    assert response.status_code == 200
    assert response.json()["role"] == "admin"
```

:::info Best practice
Always clean up `dependency_overrides` after each test — use a `pytest` fixture with `yield` and clear in teardown to avoid state leaking across test cases.
:::
