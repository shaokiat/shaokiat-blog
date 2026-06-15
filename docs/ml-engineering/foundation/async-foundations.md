---
sidebar_position: 3
---

# Async Foundations

> **Customer framing:** A customer's inference API stalls under load — the fix requires understanding when FastAPI actually runs code concurrently and when it doesn't.

**Official docs:**
- [Concurrency and async/await](https://fastapi.tiangolo.com/async/)
- [Python asyncio docs](https://docs.python.org/3/library/asyncio.html)
- [run_in_executor (threadpool)](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor)
- [asyncio.to_thread](https://docs.python.org/3/library/asyncio-task.html#asyncio.to_thread)

---

## async def vs def

FastAPI treats `async def` and `def` routes differently:

| Route type | How FastAPI runs it | When to use |
|---|---|---|
| `async def` | Runs directly on the event loop | I/O-bound: DB calls, HTTP requests, file reads |
| `def` | Runs in a threadpool executor | CPU-bound: model inference, image processing, heavy compute |

:::info Best practice
Use `async def` only when you actually `await` something. Using it for CPU-bound work (e.g. model inference) blocks the event loop and stalls all other requests.
:::

```python
# wrong — blocks the event loop during inference
@router.post("/predict")
async def predict(payload: PredictRequest):
    result = model.run(payload.features)  # CPU-bound, no await
    return result

# correct — runs in threadpool, event loop stays free
@router.post("/predict")
def predict(payload: PredictRequest):
    result = model.run(payload.features)
    return result
```

## The Event Loop

Python's asyncio runs on a single thread. It processes tasks by switching between them at `await` points — there is no parallelism, only concurrency.

```
Event loop (single thread):
  Task A: await db.query()  →  suspend, switch to Task B
  Task B: await http.get()  →  suspend, switch to Task C
  Task C: return result     →  resume Task A
```

A blocking call (no `await`) holds the thread for its entire duration — nothing else runs.

## Blocking Calls to Watch For

These common operations block the event loop if called inside `async def`:

| Blocking | Non-blocking alternative |
|---|---|
| `time.sleep(n)` | `await asyncio.sleep(n)` |
| `requests.get(url)` | `await httpx.AsyncClient().get(url)` |
| `psycopg2` (sync driver) | `asyncpg` or SQLAlchemy async |
| `open(file).read()` | `aiofiles.open(file).read()` |
| `model.predict()` (CPU) | `await asyncio.to_thread(model.predict, x)` |

## Running Sync Code Safely

When you must call a blocking function inside an `async` context, offload it to a threadpool:

```python
import asyncio

# asyncio.to_thread — simplest option (Python 3.9+)
@router.post("/predict")
async def predict(payload: PredictRequest):
    result = await asyncio.to_thread(model.run, payload.features)
    return PredictResponse(prediction=result)

# run_in_executor — more control over which executor
import concurrent.futures

_executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)

@router.post("/predict")
async def predict(payload: PredictRequest):
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(_executor, model.run, payload.features)
    return PredictResponse(prediction=result)
```

Use a dedicated `ThreadPoolExecutor` when you want to cap the number of concurrent CPU-bound tasks.

## await Mechanics

`await` suspends the current coroutine and yields control back to the event loop. The event loop can run other tasks while waiting.

```python
async def fetch_features(user_id: str) -> list[float]:
    # suspend here — event loop processes other requests
    row = await db.fetchone("SELECT features FROM users WHERE id=$1", user_id)
    return row["features"]
```

Only `async def` functions can be awaited. You cannot `await` a regular function.

## Concurrency Limits for Inference

Threadpool concurrency doesn't translate to faster ML inference — multiple threads compete for the same GIL. Use a semaphore to cap simultaneous inference calls:

```python
import asyncio

_inference_sem = asyncio.Semaphore(4)  # max 4 concurrent inference calls

@router.post("/predict")
async def predict(payload: PredictRequest):
    async with _inference_sem:
        result = await asyncio.to_thread(model.run, payload.features)
    return PredictResponse(prediction=result)
```

:::info Best practice
Requests beyond the semaphore limit queue up rather than crashing with OOM. Set the limit based on available CPU cores and model memory footprint.
:::

## Common Mistakes

```python
# 1. Mixing sync DB driver in async handler — blocks the event loop
async def handler(db=Depends(get_sync_db)):
    rows = db.execute("SELECT ...")  # use an async driver instead

# 2. Sleeping in async code without await
async def handler():
    time.sleep(1)  # blocks — use await asyncio.sleep(1)

# 3. Using async def for pure CPU work with no awaits
async def handler():
    result = heavy_numpy_computation()  # should be plain def

# 4. Creating a new event loop inside an async context
async def handler():
    loop = asyncio.new_event_loop()  # wrong — already inside a running loop
```

→ See [Dependency Injection — Scoped Dependencies](./dependency-injection.md#scoped-dependencies-with-yield) for how to properly inject async DB sessions.
