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

## Pre-built AI APIs (no ML expertise needed)

| API | Use Case |
|---|---|
| **Vision API** | Image labelling, OCR, SafeSearch, face detection |
| **Video Intelligence API** | Scene detection, object tracking, explicit content detection in video |
| **Natural Language API** | Entity recognition, sentiment analysis, content classification |
| **Speech-to-Text / Text-to-Speech** | Audio transcription and synthesis |
| **Document AI** | Structured data extraction from documents (invoices, forms) |
| **Translation API** | Text translation across 100+ languages |

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

**"Add product recommendations to a retail platform quickly"**
→ **Recommendations AI.** Pre-built and tuned for e-commerce; faster to implement than custom Vertex AI models. Use custom Vertex AI when you need full control over the model.

**"Apply safety guardrails to prompts and responses from any LLM"**
→ **Model Armor.** Works as a layer on top of any model, detecting prompt injection, jailbreaks, and unsafe content categories.

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
- [Vertex AI Pipelines](https://cloud.google.com/vertex-ai/docs/pipelines/introduction)
- [Vertex AI Explainability](https://cloud.google.com/vertex-ai/docs/explainable-ai/overview)
- [AI Hypercomputer](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-ai-hypercomputer)
- [Model Armor](https://cloud.google.com/security-command-center/docs/model-armor-overview)
- [Recommendations AI](https://cloud.google.com/recommendations-ai/docs/overview)
- [Pre-built AI APIs](https://cloud.google.com/products/ai)
