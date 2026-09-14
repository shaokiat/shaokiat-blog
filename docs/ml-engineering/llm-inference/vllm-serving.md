---
sidebar_position: 2
---

# vLLM

> **Customer framing:** A customer needs to self-host an open-weight LLM on their own GPUs, serve many concurrent users, and keep tail latency predictable — here is the architecture and the knobs that move it.

**Official docs:**
- [vLLM docs](https://docs.vllm.ai/en/latest/)
- [Engine arguments](https://docs.vllm.ai/en/latest/configuration/engine_args.html)
- [Optimization and tuning](https://docs.vllm.ai/en/latest/configuration/optimization.html)
- [OpenAI-compatible server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html)
- [PagedAttention paper (SOSP '23)](https://arxiv.org/abs/2309.06180)

---

## The Bottleneck: Memory Bandwidth, Not Compute

LLM decoding is **memory-bandwidth bound**. Every forward pass has to stream the entire set of model weights from VRAM into the GPU's compute cores, because on-chip memory holds tens of MB and the model is tens to hundreds of GB. There is no way to keep the weights resident, so they are re-read on every pass.

That read cost is **fixed no matter how many sequences ride along in the pass**. One sequence per pass means you pay full price for one token. Thirty-two sequences means you pay the same price for thirty-two tokens.

:::info Best practice
Batching is amortisation, not parallelism. It does not make the GPU faster — it stops you from paying for a full weight read to produce a single token.
:::

### Weights vs KV cache

These are the two things in VRAM and they behave nothing alike. Confusing them is the most common source of bad capacity planning.

| | Model weights | KV cache |
|---|---|---|
| What it is | Learned parameters (`W_Q`/`W_K`/`W_V`/`W_O`, MLP matrices, embeddings) | Key/Value vectors produced per sequence as it is processed |
| Varies per request? | No — identical for every user and every token | Yes — unique per sequence, grows with each token |
| Lifetime | Loaded once at server startup, resident for the process | Allocated when a sequence is admitted, freed when it finishes |
| Shared across a pass? | Yes — one read serves every sequence in the batch | No — each sequence attends only over its own cache |
| Scaling | Fixed. Does not grow with batch size | Grows with concurrent sequences × their length |

The consequence: **weights set your floor, KV cache sets your ceiling.** Weights decide whether the model fits at all; KV cache decides how many users fit at once. Every throughput knob below is really a KV-cache knob.

## Prefill vs Decode

One forward pass = one weight read = **one new token per active sequence**. Every request splits into two phases that behave nothing alike.

**Prefill** processes the whole prompt in a single pass. The prompt tokens are all known upfront, so there is no autoregressive dependency to respect — the pass computes KV for all of them at once and emits the first output token.

**Decode** then runs one pass per output token, forever. Token N+1 needs token N to exist, so a sequence cannot run ahead of itself. A 1000-token prompt with a 200-token answer is 1 prefill pass and 200 decode passes.

```text
prompt = 1000 tokens                          answer = 200 tokens
┌───────────────────┐
│                   │
│   prefill step    │ ─→  ▪  ▪  ▪  ▪  ▪  ▪  ▪  ▪ … (×200)
│  (whole prompt,   │          decode steps
│   1000 tokens)    │       (1 token per step)
└───────────────────┘
   1 pass, GPU saturated        200 passes, GPU starved
```

| | Prefill | Decode |
|---|---|---|
| Tokens per pass, per sequence | The entire prompt | Exactly 1 |
| Passes per request | 1 (or a few, if chunked) | One per output token |
| Bound by | Compute — plenty of work per weight read | Memory bandwidth — one token per weight read |
| Batching helps? | Barely. Already saturates the GPU | Enormously. This is what batching is for |
| Latency metric it owns | TTFT (time to first token) | ITL (inter-token latency) |
| KV cache | Writes the whole prompt's cache | Appends one token's worth, reads all of it |

Almost every design decision below follows from this asymmetry:

- Decode is the phase that wastes bandwidth, so **batching targets decode**.
- One big prefill can hog a pass and stall everyone's decode, so **chunked prefill** exists.
- The prefill for a repeated prompt prefix is pure waste, so **prefix caching** exists.

:::info Best practice
Report TTFT and ITL separately, never a single "latency" number. They are produced by different phases, bound by different resources, and fixed by different flags.
:::

## TTFT vs ITL

The two phases produce two different user-visible latencies. They move in opposite directions under almost every knob, which is why a single "latency" number is useless for tuning.

| | TTFT — time to first token | ITL — inter-token latency |
|---|---|---|
| Measures | Queue wait + prefill of the whole prompt | Time between consecutive output tokens, once streaming |
| Phase | Prefill | Decode |
| Scales with | Prompt length, and how loaded the queue is | Batch occupancy and model size, **not** prompt length |
| User feels it as | "Did it hear me?" — the spinner before text appears | How fast the text types out |
| Typical target | Under ~1s for chat, looser for batch jobs | Faster than reading speed, roughly 50ms or better |

Related: **TPOT** (time per output token) is ITL averaged over a request, and end-to-end latency is `TTFT + ITL × output tokens`. For a long answer, ITL dominates the total even though TTFT dominates the first impression.

**What moves which**

| Change | TTFT | ITL |
|---|---|---|
| Raise `--max-num-batched-tokens` | Better — prefills clear faster | Worse — big prefills crowd out decode |
| Raise `--max-num-seqs` | Worse under load — longer queue | Worse — more sequences share each pass |
| Enable chunked prefill | Slightly worse for the long prompt | Much better for everyone else |
| Enable prefix caching | Much better on repeated prefixes | Unchanged |

:::info Best practice
Pick which one your workload sells. Chat products defend p99 TTFT; agent and summarisation pipelines defend ITL, because the user is waiting on a long completion, not a first word. Throughput is what you spend to buy either.
:::

## Static vs Continuous Batching

**Static batching** forms a fixed group of requests and runs passes until *every* member finishes. Sequences complete at wildly different times, but a finished sequence's slot stays occupied and idle until the slowest one is done. A batch of 32 where 31 replies are short and one is 2000 tokens spends most of its life reading full-price weights to generate one token.

**Continuous (in-flight) batching** removes the group entirely. A scheduler runs an unbroken loop of passes; the instant a sequence finishes, its slot is backfilled from the queue on the very next pass.

| | Static | Continuous |
|---|---|---|
| Membership | Fixed at batch formation | Sequences join and leave every iteration |
| Finished sequence | Holds its slot until the batch ends | Evicted immediately, slot refilled |
| Padding | All padded to the longest member | None |
| New request | Waits for the current batch to drain | Admitted on the next pass if memory allows |

What continuous batching does **not** do is reduce weight reads — the same number of passes still happen per token generated. The gain is purely utilisation: each fixed-cost read leaves the GPU with a full slate of sequences instead of a half-empty one.

:::info Best practice
Static batching wastes utilisation on idle slots. Continuous batching wastes nothing on slots — which just moves the real limit onto KV cache memory, which is what PagedAttention exists to fix.
:::

→ See [Model Serving](./model-serving.md#batching) for hand-rolled batching when you serve a classical model, where compute, not bandwidth, is the constraint.

**Args**

| Flag | Default | What it does |
|---|---|---|
| `--max-num-seqs` | 1024 (V1) | Ceiling on sequences running concurrently in one pass |
| `--max-num-batched-tokens` | 8192 (V1) | Ceiling on tokens per pass, prefill + decode combined |
| `--scheduling-policy` | `fcfs` | `fcfs`, or `priority` to admit by a per-request `priority` field |

Both ceilings are ceilings, not targets: the scheduler runs below them whenever KV cache is the tighter constraint, which is most of the time. Each gets its own section below.

Two flags from older guides are gone in the V1 engine: `--num-scheduler-steps` (multi-step scheduling) and swap-based preemption via `--swap-space`. V1 preempts by recomputing a sequence rather than swapping its blocks to host memory.

## PagedAttention

Once slots are always full, the only thing capping concurrency is how many sequences' KV caches fit in VRAM. Naive serving makes that far worse than it needs to be: it allocates one contiguous block per sequence sized for the maximum possible length, so a 20-token reply reserves room for 4096.

PagedAttention treats the KV cache like OS virtual memory. Split it into fixed-size blocks, allocate on demand, and map logical token positions to physical blocks through a block table.

- **No internal fragmentation.** Nothing is reserved for a worst case that rarely happens, so the same GPU holds several times more concurrent sequences.
- **Sharing across sequences.** Identical prefixes (a system prompt, or `n>1` samples from one prompt) point at the same physical blocks, copy-on-write.
- **Preemption is cheap.** Under memory pressure the scheduler swaps or recomputes a sequence's blocks instead of failing the request.

**Args**

| Flag | Default | What it does |
|---|---|---|
| `--gpu-memory-utilization` | 0.9 | Fraction of VRAM claimed. Whatever is left after weights becomes KV cache |
| `--max-model-len` | model's max | Longest context per sequence. The biggest single lever on per-sequence KV cache |
| `--kv-cache-dtype` | `auto` | `fp8` roughly halves KV cache bytes per token on supported hardware |
| `--block-size` | 16 | Tokens per KV block. Smaller cuts fragmentation, grows block-table overhead. Rarely tuned |

These four decide how many sequences fit, and therefore what `--max-num-seqs` is actually allowed to reach:

```text
concurrent sequences ≈ KV cache bytes / (avg sequence length × bytes per token)
```

vLLM prints its own version of this at startup — the `GPU KV cache size: N tokens` and `Maximum concurrency for M tokens per request: Nx` lines. Read them before touching any flag. If reported concurrency is already below `--max-num-seqs`, raising `--max-num-seqs` does nothing at all.

Continuous batching and PagedAttention are one idea in two halves: keep every pass full, and make "full" mean as many sequences as possible. Everything below is tuning on top of those two.

## Chunked Prefill

Split a long prompt's prefill into chunks and interleave them with other sequences' decode steps, instead of running the prefill as one blocking step.

Without it, one long prompt spikes latency for every other concurrent user. With it, the cost is spread across iterations. This is the answer to "how do you keep tail latency stable under mixed short/long prompt traffic" in a multi-tenant deployment.

**Args**

| Flag | Default | What it does |
|---|---|---|
| `--enable-chunked-prefill` | on (V1) | Allows a prefill to be split across passes. `--no-enable-chunked-prefill` turns it off |
| `--max-num-batched-tokens` | 8192 | Effectively the chunk size — the prefill takes whatever token budget decode did not |
| `--long-prefill-token-threshold` | — | Prompt length above which a request counts as "long" |
| `--max-long-partial-prefills` | 1 | How many *long* prompts may be mid-prefill at once. The fairness knob under mixed traffic |

:::info Best practice
Chunked prefill plus a tuned `max_num_batched_tokens` is the cheapest tail-latency fix available. Reach for it before adding GPUs.
:::

## Parallelism

| Mode | Flag | Splits | Use when |
|---|---|---|---|
| Tensor parallel | `--tensor-parallel-size 4` | Each layer's weight matrices across GPUs | Model does not fit on one GPU, or you want lower per-token latency. Needs fast intra-node links (NVLink) |
| Pipeline parallel | `--pipeline-parallel-size 2` | Layers into stages, one stage per GPU/node | Scaling across nodes where tensor parallel's all-reduce traffic would dominate |

Rule of thumb: tensor parallel within a well-connected node, pipeline parallel across nodes. Set `--tensor-parallel-size` to a divisor of the model's attention head count, or it will not shard.

**Args**

| Flag | Default | What it does |
|---|---|---|
| `--tensor-parallel-size` | 1 | GPUs to shard each layer across |
| `--pipeline-parallel-size` | 1 | Pipeline stages to split layers into |
| `--data-parallel-size` | 1 | Independent replicas of the whole model, each with its own KV cache |

Parallelism is also a KV cache knob: tensor parallel splits the cache across GPUs too, so 4-way TP gives roughly 4× the KV cache room, not just room for bigger weights.

## Quantization

```bash
vllm serve RedHatAI/Meta-Llama-3.1-8B-Instruct-quantized.w4a16 \
  --quantization compressed-tensors
```

| Method | Precision | Hardware | Notes |
|---|---|---|---|
| **AWQ** | 4-bit weights | Any recent NVIDIA | Activation-aware, low accuracy loss, safe default |
| **GPTQ** | 4-bit weights | Any recent NVIDIA | Older, very widely available checkpoints |
| **FP8** | 8-bit weights + activations | H100 / Ada or newer | Near-lossless, best throughput per point of accuracy |
| **INT8 / W8A8** | 8-bit weights + activations | Ampere or newer | More aggressive, more accuracy risk |

**Args**

| Flag | Default | What it does |
|---|---|---|
| `--quantization` | inferred | Override the method. Usually unnecessary — vLLM reads it from the checkpoint's config |
| `--kv-cache-dtype` | `auto` | `fp8` quantizes the KV cache itself, independent of weight quantization |

Quantization is often what decides whether a useful model fits on the hardware the customer is allowed to buy. It also frees memory that becomes KV cache, so throughput gains are larger than the weight savings alone suggest. Quantizing weights and the KV cache are separate decisions — on a long-context workload, `--kv-cache-dtype fp8` alone can buy more concurrency than 4-bit weights.

## Automatic Prefix Caching

Cache the KV blocks of a shared prefix and reuse them across requests instead of recomputing.

**Args**

| Flag | Default | What it does |
|---|---|---|
| `--enable-prefix-caching` | on (V1) | Reuses KV blocks of a matching prefix. `--no-enable-prefix-caching` disables |
| `--block-size` | 16 | Cache-hit granularity — a prefix is reused in whole blocks, never partial ones |

Wins are largest when requests share a long stable head: a fixed system prompt, few-shot examples, a document re-queried many times, or multi-turn chat where each turn re-sends the history. Design prompts so the stable part comes **first** — a timestamp at the top of the prompt destroys the whole cache hit.

:::info Best practice
Put variable content (user query, retrieved chunks) last. Prefix caching only reuses an exact matching prefix from position zero.
:::

## Sizing a Deployment

Given a scenario, work in this order. Memory does not choose your settings — the use case does, and memory tells you what it costs.

**1. Name the traffic profile.** Latency-optimized (interactive chat, a user watching a spinner) or throughput-optimized (batch jobs, internal pipelines). This sets no number yet. It decides which way you lean in step 7.

**2. Add up the fixed costs.** Everything here is spent before KV cache gets a byte.

| Cost | How to get it | Scales with |
|---|---|---|
| Model weights | params × bytes per param (8B × FP16 ≈ 16GB) | Nothing. Fixed for the life of the server |
| Activation memory | vLLM's startup profiler reports it | `--max-num-batched-tokens`, not KV settings |

**3. Set `--max-model-len` from the use case.** Take the realistic worst-case context the application must handle, not the model's native max and not whatever happens to fit. This is a product decision. If memory cannot afford it, the answer is more memory — a bigger GPU, higher `--gpu-memory-utilization`, more `--tensor-parallel-size` — not silently truncating what users are allowed to send.

**4. Compute the KV cache budget.**

```text
KV budget = (--gpu-memory-utilization × total VRAM)
          − model weights
          − activation memory
```

Activation memory is transient per-step scratch; KV cache is persistent per-sequence state. They are separate pools. Headroom in one is not headroom in the other.

**5. Compute the worst-case concurrency ceiling.**

```text
ceiling = KV budget ÷ (per-sequence KV cost at --max-model-len)
```

This is the pessimistic floor of what you can serve: how many sequences fit *if every one of them runs to full length at once*. PagedAttention does not raise this number. What it does is let real traffic — where most sequences are far shorter than the max — run at concurrency well above it, because memory is consumed per token actually generated.

**6. Set `--max-num-seqs` from expected demand, checked against the ceiling.** Start from peak concurrent users plus a buffer. How large a buffer is safe depends on the gap between typical and worst-case length:

| Situation | Buffer |
|---|---|
| Ceiling ≫ demand, and typical length ≪ `--max-model-len` | Generous. Memory is not the binding constraint, unused slots cost nothing |
| Ceiling near demand, or typical length near `--max-model-len` | Conservative. Real traffic will reach the ceiling and the scheduler will start preempting |

It is a ceiling, not a target — actual concurrency is decided pass by pass from live KV usage. If raising it does not raise observed concurrency, you are memory-bound: quantize, cut `--max-model-len`, or add GPUs.

**7. Tune `--max-num-batched-tokens` last, against latency.** Bounded from both sides:

- **Floor:** at least the number of sequences decoding simultaneously, since each needs one token of budget per step. Below that, decode itself starves.
- **Ceiling:** your per-step latency tolerance. More work per pass means worse ITL for everyone sharing the pass.
- **2–4k:** better ITL, worse TTFT on long prompts (finer chunking).
- **16k+:** better TTFT and prefill throughput, worse ITL for concurrent decode.

Verify it against measured *activation* memory, not KV headroom — this flag competes with KV cache rather than drawing from the same spare pool.

:::warning
Whenever `--max-num-batched-tokens` < `--max-model-len`, chunked prefill must be on. Without it, any prompt longer than the token budget cannot be scheduled at all and the request fails.
:::

### max-model-len vs max-num-batched-tokens

The two most commonly confused flags. They are not comparable quantities.

| | `--max-model-len` | `--max-num-batched-tokens` |
|---|---|---|
| Scope | Per sequence | Per pass, across all sequences in it |
| Governs | Total length (prompt + output) one sequence may reach over its lifetime | Total token-work allowed in one forward pass |
| Shared? | No — every sequence gets its own full budget | Yes — one pool the whole pass draws from |
| Relationship | Legitimately *larger* than the batched-token budget. That is normal, and is exactly what chunked prefill exists to handle | |

### Worked example: legal document review

Internal tool. 12 concurrent users at peak, documents of 6,000–10,000 tokens with rare filings up to 20,000, short answers under 500 tokens. Users tolerate slowness but not rejected or hung requests. One L4 (24GB), 8B model in FP16.

| Step | Decision |
|---|---|
| 1. Profile | Throughput-optimized, but rejection-sensitive |
| 2. Fixed costs | Weights ≈ 16GB, activations ≈ 2GB (profiled) |
| 3. `--max-model-len` | **20000** — the firm requires that rare large filings are never rejected |
| 4. KV budget | `24 × 0.85 = 20.4GB` − `16GB` weights − `2GB` activations = **2.4GB** |
| 5. Ceiling | 20k tokens ≈ 20MB per sequence → `2.4GB ÷ 20MB` ≈ **120 sequences** worst case |
| 6. `--max-num-seqs` | **20** — demand is 12; typical length (6–10k) sits close enough to the 20k max that the conservative buffer wins over chasing the 120 ceiling |
| 7. `--max-num-batched-tokens` | **10000**, with chunked prefill on — stops one 20k filing from monopolising a pass and freezing every other lawyer's request |

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --max-model-len 20000 \
  --max-num-seqs 20 \
  --max-num-batched-tokens 10000 \
  --gpu-memory-utilization 0.85 \
  --enable-chunked-prefill
```

:::info Best practice
The use case sets `--max-model-len` and target concurrency. Memory (weights → activations → KV cache) tells you what that costs and caps `--max-num-seqs`. `--max-num-batched-tokens` comes last and separately, tuned against latency tolerance and the need to stop one request starving the rest.
:::

## Running It

Offline batch inference:

```python
from vllm import LLM, SamplingParams

llm = LLM(model="Qwen/Qwen2.5-7B-Instruct", gpu_memory_utilization=0.85)
params = SamplingParams(temperature=0.7, top_p=0.9, max_tokens=256)

for output in llm.generate(["Explain PagedAttention in one paragraph."], params):
    print(output.outputs[0].text)
```

OpenAI-compatible server — what you actually deploy:

```bash
vllm serve Qwen/Qwen2.5-7B-Instruct \
  --max-num-seqs 128 \
  --max-num-batched-tokens 4096 \
  --gpu-memory-utilization 0.85 \
  --enable-chunked-prefill \
  --enable-prefix-caching \
  --port 8000
```

Any OpenAI client then points at `http://localhost:8000/v1`. For real numbers, use the built-in benchmark rather than a single curl:

```bash
vllm bench serve \
  --model Qwen/Qwen2.5-7B-Instruct \
  --dataset-name random --num-prompts 200 \
  --random-input-len 1024 --random-output-len 256
```

It reports throughput, TTFT, and inter-token latency percentiles — the three numbers every tuning decision above is actually trading against.

:::info Best practice
Tune against p99 TTFT and p99 inter-token latency, not mean throughput. Means hide exactly the stalls users complain about.
:::

## Quick Reference

| Concept | Flag / param | What it controls |
|---|---|---|
| KV cache paging | `--block-size` | Fragmentation vs block-table overhead |
| Context ceiling | `--max-model-len` | KV cache bytes per sequence — the main concurrency lever |
| Admission order | `--scheduling-policy` | FCFS vs per-request priority |
| Long-prompt fairness | `--max-long-partial-prefills`, `--long-prefill-token-threshold` | How many long prefills may run at once |
| Concurrency cap | `--max-num-seqs` | Max concurrent sequences |
| Token budget per step | `--max-num-batched-tokens` | Prefill vs decode balance |
| Long-prompt handling | `--enable-chunked-prefill` | Tail latency under mixed traffic |
| Memory ceiling | `--gpu-memory-utilization` | Weights + KV cache footprint |
| Multi-GPU, one node | `--tensor-parallel-size` | Fits large models, cuts latency |
| Multi-node scaling | `--pipeline-parallel-size` | Cross-node scaling on weak interconnect |
| Precision | `--quantization` | Memory + throughput vs accuracy |
| Shared-prefix reuse | `--enable-prefix-caching` | Avoids recomputing repeated context |
