---
title: Vertex AI and Generative AI
sidebar_label: Vertex AI & GenAI
sidebar_position: 5
---

# Vertex AI and Generative AI

> Docs: [Vertex AI overview](https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform)

## Services at a Glance

| Service | What It Does |
|---|---|
| **Gemini on Vertex AI** | Google's multimodal LLM (text, image, audio, video) via API |
| **Model Garden** | Browse, evaluate, and deploy 150+ models (Google + open-source) |
| **Agent Builder** | Build RAG-powered search apps and conversational AI agents |
| **Vertex AI Pipelines** | Orchestrate end-to-end ML workflows (based on Kubeflow Pipelines) |
| **Vertex AI Model Registry** | Version, track, and manage deployed models |
| **Vertex AI Explainability** | Feature attributions and explanations for model predictions |
| **AI Hypercomputer** | Infrastructure for large-scale distributed ML training (TPUs, GPUs) |
| **Recommendations AI** | Pre-built personalised product recommendations for retail |
| **Model Armor** | Safety filters and guardrails applied to LLM inputs/outputs |
| **Imagen** | Text-to-image and image-editing model; generates, edits, and upscales images |

## Pre-built AI APIs (no ML expertise needed)

| API | Use Case |
|---|---|
| **Vision API** | Image labelling, OCR, SafeSearch, face detection, landmark recognition |
| **Video Intelligence API** | Scene detection, object tracking, transcription, explicit content detection in video |
| **Natural Language API** | Entity recognition, sentiment analysis, content classification |
| **Speech-to-Text v2 (Chirp 2)** | Audio transcription — best accuracy across 100+ languages, streaming with word-level timestamps |
| **Text-to-Speech** | Synthesise natural-sounding speech; WaveNet and Neural2 voices |
| **Document AI** | Structured data extraction from documents (invoices, forms) |
| **Translation API** | Text translation across 100+ languages |

### Vision API vs Imagen — Key Distinction

| | Vision API | Imagen |
|---|---|---|
| Direction | Image **in** → analysis out | Text prompt **in** → image out |
| Task | Classify, label, detect objects in existing images | Generate, edit, or upscale images |
| Use case | Content moderation, OCR, catalogue tagging | Creative assets, product visualisation, synthetic data |
| Exam signal | "Detect", "classify", "extract text from" images | "Generate", "create", "edit" images |

> Docs: [Vision API](https://cloud.google.com/vision/docs/features-list) · [Imagen on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview)

### Audio — Speech APIs

| API | When to Use |
|---|---|
| **Speech-to-Text v2 (Chirp 2)** | Long-form transcription, multilingual support, noisy audio, call centre recordings; streaming with word-level timestamps |
| **Text-to-Speech** | Synthesise narration, IVR prompts, accessibility features |

**Exam signal:** "Transcribe audio/video files" → Speech-to-Text. "Voice-enable an IVR" → Text-to-Speech + Dialogflow CX. "High accuracy across many languages" → Chirp model.

> Docs: [Speech-to-Text overview](https://cloud.google.com/speech-to-text/docs/overview) · [Text-to-Speech overview](https://cloud.google.com/text-to-speech/docs/overview)

## Decision Guide

**"Build a chatbot / conversational assistant with access to our content"**
→ **Vertex AI Agent Builder.** Combines Gemini with RAG (Retrieval-Augmented Generation) over your data sources (Cloud Storage, BigQuery, websites). No ML expertise needed.

**"Fine-tune or use a large language model for custom tasks"**
→ **Gemini via Vertex AI** for Google models, or browse **Model Garden** for open-source alternatives (Llama, Mistral, etc.) that can be deployed on managed endpoints.

**"Automate our ML training → evaluation → deployment pipeline"**
→ **Vertex AI Pipelines.** Define pipeline steps as components; schedule, monitor, and reuse pipelines. Integrates with Cloud Storage, BigQuery, and the Model Registry.

**"Train very large models (billions of parameters) on GPU/TPU clusters"**
→ **AI Hypercomputer.** Tightly coupled GPU/TPU clusters with high-bandwidth networking (InfiniBand). Supports distributed training frameworks (JAX, PyTorch, TensorFlow).

**"Detect and filter harmful content in user-generated or AI-generated content"**
→ **Video Intelligence API** (for video), **Vision API SafeSearch** (for images), **Model Armor** (for LLM input/output guardrails).

**"Explain why the model made a specific prediction (auditability requirement)"**
→ **Vertex AI Explainability.** Provides feature attributions (SHAP, Integrated Gradients) for tabular, image, and text models.

**"Generate images from text descriptions or edit existing images"**
→ **Imagen on Vertex AI.** Use for product visualisation, creative asset generation, or synthetic training data. Not Vision API (which analyses, not generates).

**"Transcribe call recordings or meeting audio at scale"**
→ **Speech-to-Text v2 (Chirp 2).** Handles noisy audio and 100+ languages. Pair with Natural Language API if you need entity extraction or sentiment from the transcript.

**"Add product recommendations to a retail platform quickly"**
→ **Recommendations AI.** Pre-built and tuned for e-commerce; faster to implement than custom Vertex AI models. Use custom Vertex AI when you need full control over the model.

**"Apply safety guardrails to prompts and responses from any LLM"**
→ **Model Armor.** Works as a layer on top of any model, detecting prompt injection, jailbreaks, and unsafe content categories.

**"Use an open-source model (Llama, Mistral) or specialised model without managing infrastructure"**
→ **Model Garden.** Deploy a managed endpoint in a few clicks; no custom training needed. Use Model Garden when the task is well-served by an existing model and you want to avoid training costs.

**"Let employees query internal knowledge bases or research documents conversationally"**
→ **NotebookLM Enterprise.** Grounds responses in your uploaded sources and cites them. No coding required. Use Vertex AI Agent Builder instead when you need programmatic API access or custom retrieval logic.

## Gemini Cloud Assist

An AI assistant built directly into the Google Cloud Console, gcloud CLI, and Cloud Shell. It helps architects, developers, and operators with:

- **Explaining resources** — ask "what does this Cloud Run service do?" and get a contextual summary
- **Generating configurations** — describe what you want in natural language; Gemini Cloud Assist produces Terraform, gcloud commands, or YAML
- **Troubleshooting** — paste an error message or describe a problem; receive guided remediation steps
- **Log analysis** — summarise recent log activity or help write log queries

**Exam context:** Gemini Cloud Assist appears in Section 1.2 (Technical Requirements) and Section 5.1 (Advising Teams). Exam questions about it typically ask when it would help an operations team — the answer is *accelerating operational tasks like troubleshooting, writing IaC, and understanding unfamiliar resources*, not for building custom AI features (use Vertex AI for that).

> Docs: [Gemini Cloud Assist overview](https://cloud.google.com/gemini/docs/discover/overview)

---

## Conversational AI and Agent Services

These three services are the most commonly confused in the exam. The right choice depends on how much customisation you need and what the user interaction model looks like.

### Gemini on Vertex AI

Gemini is Google's multimodal foundation model, accessible via API through Vertex AI. It processes and generates text, code, images, audio, and video.

**Intended purpose:** The underlying intelligence layer. You call Gemini directly when you need a general-purpose LLM capability — summarisation, translation, code generation, question answering over a prompt — and you are building the surrounding application logic yourself.

**Key variants:**
- **Gemini 2.0 Flash** — low latency, high throughput, cost-efficient for high-volume tasks
- **Gemini 2.0 Pro** — best reasoning and complex instruction following
- **Gemini 2.0 Flash-Lite** — cheapest option for simple classification or extraction tasks

**When to use over Agent Builder:** When you need raw LLM access, are building a custom orchestration layer, or need multimodal inputs (e.g., analysing video frames alongside text).

> Docs: [Gemini on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/overview)

---

### Vertex AI Agent Builder

A managed platform for building **RAG-powered search applications** and **multi-turn conversational agents** without writing orchestration code.

**Intended purpose:** Grounding LLM responses in *your* data. Agent Builder connects Gemini to your data sources (Cloud Storage documents, BigQuery tables, websites, third-party connectors) so it can answer questions with citations from your content rather than relying solely on training knowledge.

**Two main capabilities:**

| Capability | What It Does |
|---|---|
| **Search** | Enterprise search over your documents and data with LLM-generated summaries |
| **Conversation (Agent)** | Multi-turn chatbot grounded in your content; can call tools and APIs |

**Key features:**
- Built-in chunking, embedding, and vector indexing of your documents
- Grounding with citations — responses link back to source documents
- Multi-agent orchestration via **Agent Engine** for complex workflows
- No need to manage a vector database manually

**When to use over raw Gemini:** When the requirement is *"answer questions based on our content / knowledge base"* or *"build a support chatbot with access to our documentation"*. Agent Builder handles the RAG plumbing; you don't build it yourself.

> Docs: [Vertex AI Agent Builder](https://cloud.google.com/generative-ai-app-builder/docs/introduction)

---

### Dialogflow CX

A dedicated platform for building **structured, flow-based conversational agents** — voice IVR systems, contact centre bots, and complex multi-turn dialogue with strict conversation control.

**Intended purpose:** Conversations that follow defined paths with explicit states, intents, and transitions. Built for enterprise contact centres and voice interfaces where the dialogue structure must be precisely controlled and audited.

**Key features:**
- Visual flow builder — design conversation states and transitions graphically
- **Intent detection** — classify user utterances into defined categories
- **Entity extraction** — pull structured data (dates, names, order numbers) from natural language
- Native integration with **CCAI (Contact Center AI)** and telephony systems
- Supports voice (via Telephony Gateway) and text channels

**Dialogflow CX vs Agent Builder — When to Choose:**

| | Dialogflow CX | Agent Builder |
|---|---|---|
| Conversation structure | Explicit flows and states | Open-ended, LLM-driven |
| Grounding in documents | Limited | Core feature (RAG) |
| Voice / telephony | Native | Limited |
| Contact centre use case | Yes | Not primary use |
| Dev skill required | Flow design + intents | Minimal (managed) |
| Best when | Regulated, auditable dialogue; voice IVR | Knowledge base Q&A; support chatbots |

> Docs: [Dialogflow CX overview](https://cloud.google.com/dialogflow/cx/docs/basics)

---

## Gemini Enterprise Features

Gemini Enterprise is the Google Workspace tier that includes advanced AI capabilities for productivity workflows.

### AI Agents in Workspace

Gemini AI Agents automate multi-step workflows across Google Workspace apps (Docs, Sheets, Drive, Gmail). They can be triggered by events (new email, sheet update) and execute actions across apps.

**Exam context:** When the requirement is *"automate repetitive knowledge-worker tasks without writing custom code"* — Gemini Workspace Agents. When you need a custom API-integrated agent or data grounding — Vertex AI Agent Builder.

| | Gemini Workspace Agents | Vertex AI Agent Builder |
|---|---|---|
| Target user | Business user / low-code | Developer |
| Integration | Google Workspace apps | Any API or data source |
| Grounding | Drive/Docs content | Cloud Storage, BigQuery, web |
| Custom logic | Limited | Full (code, tools, APIs) |

> Docs: [Gemini for Google Workspace](https://workspace.google.com/products/gemini/)

### NotebookLM Enterprise

An AI-powered research tool that grounds responses strictly in documents you upload (PDFs, Docs, Slides, URLs). It generates summaries, answers questions with citations, and creates audio overviews of your sources.

**Exam signal:** "Employees need to query internal policy documents / research papers without hallucination" → NotebookLM Enterprise. Responses are scoped to uploaded sources and include source citations — minimises hallucination risk.

**NotebookLM vs Agent Builder:**
- **NotebookLM** — no-code, end-user product, sources are uploaded directly; best for knowledge workers
- **Agent Builder** — developer API, supports dynamic data connectors (BigQuery, GCS, websites), best for production apps

> Docs: [NotebookLM](https://notebooklm.google.com/) · [NotebookLM Enterprise](https://workspace.google.com/products/notebooklm/)

---

## Model Garden Integration

Model Garden is the Vertex AI hub for discovering and deploying pre-trained models without custom training.

**What's available:**
- **Google models** — Gemini, Imagen, Chirp, MedLM, Codey
- **Open-source models** — Llama 3, Mistral, Falcon, Stable Diffusion (deployed on managed endpoints)
- **Third-party models** — Anthropic Claude, AI21, etc. (via Model Garden partner hub)

**Integration patterns:**

| Pattern | How |
|---|---|
| **Managed endpoint** | One-click deploy → call via Vertex AI Prediction API (no infra management) |
| **Fine-tuning** | Start from a Model Garden base model, fine-tune on your data, deploy to registry |
| **Batch prediction** | Run inference over large datasets without a persistent endpoint |
| **Model evaluation** | Compare multiple Model Garden models on your benchmark dataset before choosing |

**Exam signal:** "Use Llama 3 without managing GPU instances" → Model Garden managed endpoint. "Fine-tune an open-source LLM on proprietary data" → Model Garden + Vertex AI custom training. "Evaluate which model fits our accuracy/cost requirements" → Model Garden evaluation.

> Docs: [Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models)

---

## Vertex AI Pipelines vs Custom Training Jobs

| | Pipelines | Custom Training |
|---|---|---|
| Use for | Multi-step ML workflows | Single training run |
| Reproducibility | High (versioned, tracked) | Manual |
| Scheduling | Built-in | Manual / Cloud Scheduler |
| Best when | Continuous retraining needed | One-off experimentation |

## Official Documentation

- [Vertex AI overview](https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform)
- [Gemini on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/overview)
- [Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models)
- [Vertex AI Agent Builder](https://cloud.google.com/generative-ai-app-builder/docs/introduction)
- [Dialogflow CX overview](https://cloud.google.com/dialogflow/cx/docs/basics)
- [Vertex AI Pipelines](https://cloud.google.com/vertex-ai/docs/pipelines/introduction)
- [Vertex AI Explainability](https://cloud.google.com/vertex-ai/docs/explainable-ai/overview)
- [AI Hypercomputer](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-ai-hypercomputer)
- [Model Armor](https://cloud.google.com/security-command-center/docs/model-armor-overview)
- [Recommendations AI](https://cloud.google.com/recommendations-ai/docs/overview)
- [Pre-built AI APIs](https://cloud.google.com/products/ai)
- [Imagen on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview)
- [Speech-to-Text overview](https://cloud.google.com/speech-to-text/docs/overview)
- [Text-to-Speech overview](https://cloud.google.com/text-to-speech/docs/overview)
- [NotebookLM Enterprise](https://workspace.google.com/products/notebooklm/)
- [Gemini for Google Workspace](https://workspace.google.com/products/gemini/)
