---
sidebar_position: 6
---

# Auth Patterns

> **Customer framing:** A customer needs their ML API to be accessible to internal services via API keys and to end users via JWT — with role-based access on sensitive endpoints.

**Official docs:**
- [Security — First Steps](https://fastapi.tiangolo.com/tutorial/security/)
- [OAuth2 with Password and Bearer](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
- [HTTP Basic Auth](https://fastapi.tiangolo.com/advanced/security/http-basic-auth/)
- [API Key via header / query / cookie](https://fastapi.tiangolo.com/advanced/security/api-key/)
- [python-jose (JWT)](https://python-jose.readthedocs.io/en/latest/)
- [passlib (password hashing)](https://passlib.readthedocs.io/en/stable/)

---

## JWT with OAuth2PasswordBearer

The most common pattern for user-facing APIs. FastAPI extracts the token from the `Authorization: Bearer <token>` header.

```python
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def create_access_token(data: dict, expires_minutes: int = 30) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "role": payload.get("role", "user")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")
```

```python
# Login endpoint — issues the token
from fastapi.security import OAuth2PasswordRequestForm

@router.post("/auth/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
```

`get_current_user` is a reusable dependency — inject it into any route that requires authentication. → See [Dependency Injection — Sub-dependencies](./dependency-injection.md#sub-dependencies) for how FastAPI resolves the `oauth2_scheme → get_current_user` chain.

## API Key Auth

Simpler than JWT — best for internal services and machine-to-machine calls where user identity isn't needed.

```python
from fastapi.security.api_key import APIKeyHeader
from fastapi import Security, HTTPException
from app.core.config import get_settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

def verify_api_key(api_key: str = Security(api_key_header)) -> str:
    settings = get_settings()
    if api_key != settings.api_key:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

@router.post("/predict", dependencies=[Depends(verify_api_key)])
def predict(payload: PredictRequest):
    ...
```

| Auth method | Use when |
|---|---|
| JWT | End users, sessions, token expiry needed |
| API key | Internal services, CI pipelines, simple integrations |
| OAuth2 scopes | Fine-grained permissions within a JWT flow |

## Role-Based Access Control

Attach roles to the JWT payload, then enforce them via DI.

```python
from fastapi import Depends, HTTPException

def require_role(required_role: str):
    def checker(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return checker

@router.delete("/models/{model_id}", dependencies=[Depends(require_role("admin"))])
def delete_model(model_id: int):
    ...

@router.post("/predict")
def predict(payload: PredictRequest, user: dict = Depends(require_role("analyst"))):
    ...
```

For multiple allowed roles:

```python
def require_any_role(*roles: str):
    def checker(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return checker

@router.get("/reports", dependencies=[Depends(require_any_role("admin", "analyst"))])
def get_reports(): ...
```

:::info Best practice
RBAC logic belongs in a dependency, not inside the route handler — it stays reusable, testable via `dependency_overrides`, and automatically enforced at the DI layer.
:::

## OAuth2 Scopes

For more granular control, embed scopes in the token and verify per endpoint.

```python
from fastapi.security import SecurityScopes

def get_current_user(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
) -> dict:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    token_scopes = payload.get("scopes", [])
    for scope in security_scopes.scopes:
        if scope not in token_scopes:
            raise HTTPException(
                status_code=403,
                detail=f"Scope required: {scope}",
                headers={"WWW-Authenticate": f'Bearer scope="{security_scopes.scope_str}"'},
            )
    return payload

@router.get("/admin/models", dependencies=[Security(get_current_user, scopes=["models:write"])])
def list_admin_models(): ...
```

## Security Anti-patterns

| Anti-pattern | Why it's dangerous | Fix |
|---|---|---|
| Hardcoded secrets in source | Leaked via git history | Use env vars or a secret manager |
| Logging `Authorization` headers | Tokens in plaintext logs | Strip sensitive headers before logging |
| Long-lived tokens with no expiry | Stolen tokens are valid forever | Set `exp` claim, use refresh tokens |
| Returning `401` for wrong role | Leaks that the resource exists | Return `403` for auth, `404` to hide existence |
| Validating roles client-side only | Client-side checks are trivially bypassed | Always enforce on the server via DI |

→ See [API Fundamentals — 401 vs 403](./backend-fundamentals.md#401-vs-403--the-key-distinction) for the exact distinction between the two codes.
