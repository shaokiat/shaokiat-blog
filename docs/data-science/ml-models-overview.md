---
sidebar_position: 1
---

# Machine Learning Overview

A map of the major ML model classes, when to use each, and what problems they solve.

Every section answers: _"What kind of problem is this model class built for?"_

---

## Learning Paradigms

Before picking a model, identify the learning paradigm — it narrows your choices immediately.

| Paradigm            | Data you have                         | Goal                                                        |
| ------------------- | ------------------------------------- | ----------------------------------------------------------- |
| **Supervised**      | Labeled input-output pairs            | Predict a label or value for new inputs                     |
| **Unsupervised**    | Unlabeled data only                   | Find structure, patterns, or groups                         |
| **Semi-supervised** | Mostly unlabeled + small labeled set  | Leverage unlabeled data to improve supervised learning      |
| **Reinforcement**   | Rewards from environment interactions | Learn a policy that maximises cumulative reward             |
| **Self-supervised** | Unlabeled data with synthetic labels  | Pre-train representations (foundation models, transformers) |

---

## Supervised Learning

Labeled data, predict a value or a class. This section has its own deep-dive pages — each with a cheatsheet table, a running example, and per-model decision guidance — so the details live there, not here:

- **[Regression](./supervised/regression.md)** — target is continuous (price, demand, sensor reading). Covers Linear/Ridge/Lasso/ElasticNet, polynomial, trees, Random Forest, gradient boosting, SVR. Rule of thumb: start linear, and on tabular data expect gradient boosting to win once tuned.
- **[Classification](./supervised/classification.md)** — target is a class label (spam, churn, fraud). Covers Logistic Regression, trees, ensembles, SVM, KNN, Naive Bayes, MLP. Rule of thumb: start with logistic regression, never report plain accuracy on imbalanced data.

See also the [Supervised Learning intro](./supervised/index.md) for train/validation/test splits, cross-validation, bias–variance, and regularisation.

Picking the model is one stage of a project. For everything around it — problem framing, preprocessing, feature engineering, training discipline, and production — see the **[ML Project Lifecycle](./ml-lifecycle/index.md)** section, which follows one churn problem end to end.

---

## Unsupervised Learning

### Clustering

Groups data points without predefined labels.

| Algorithm                         | When to use                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| **K-Means**                       | Known number of clusters, spherical clusters, large datasets |
| **DBSCAN**                        | Unknown K, arbitrary shapes, handles noise/outliers          |
| **Hierarchical (Agglomerative)**  | Small datasets, want a dendrogram, unknown K                 |
| **Gaussian Mixture Models (GMM)** | Soft cluster assignments, elliptical cluster shapes          |

### Dimensionality Reduction

Reduces features while preserving information.

| Algorithm        | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| **PCA**          | Linear compression, remove correlated features, preprocessing       |
| **t-SNE**        | 2D/3D visualisation of high-dimensional data                        |
| **UMAP**         | Faster than t-SNE, better preserves global structure, visualisation |
| **Autoencoders** | Non-linear compression, anomaly detection via reconstruction error  |

### Anomaly Detection

Identifies data points that deviate significantly from the norm.

| Algorithm                              | When to use                                                |
| -------------------------------------- | ---------------------------------------------------------- |
| **Isolation Forest**                   | Fast, scales well, tree-based, no distribution assumptions |
| **One-Class SVM**                      | High-dimensional space, known normal distribution          |
| **Autoencoder (reconstruction error)** | Complex data (images, sequences), unsupervised             |
| **LOF (Local Outlier Factor)**         | Density-based, detects local anomalies                     |

---

## Ensemble Methods

Combine multiple models to reduce variance, bias, or both.

| Method       | Mechanism                                                  | Examples                              |
| ------------ | ---------------------------------------------------------- | ------------------------------------- |
| **Bagging**  | Train models in parallel on random subsets; average output | Random Forest                         |
| **Boosting** | Train models sequentially; each corrects prior errors      | XGBoost, LightGBM, AdaBoost, CatBoost |
| **Stacking** | Train a meta-learner on predictions of base models         | Custom pipelines                      |

**Rule of thumb:** Bagging reduces variance (fixes overfitting). Boosting reduces bias (fixes underfitting).

---

## Deep Learning

Neural networks with multiple layers. Required when data is high-dimensional and unstructured (images, text, audio) or when tabular model accuracy plateaus.

| Architecture                      | Best for                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| **Feedforward (MLP)**             | Tabular data, classification/regression when features are rich |
| **CNN (Convolutional)**           | Images, spatial data, time series with local patterns          |
| **RNN / LSTM / GRU**              | Sequential data, time series, NLP before transformers          |
| **Transformer**                   | NLP, vision (ViT), multimodal; state of the art for most tasks |
| **GAN**                           | Generative tasks — image synthesis, data augmentation          |
| **VAE (Variational Autoencoder)** | Generative modelling with latent space control                 |
| **Diffusion Models**              | High-quality image/audio generation (e.g. Stable Diffusion)    |

---

## Reinforcement Learning

An agent learns a **policy** by taking actions in an environment and receiving rewards.

| Algorithm class               | Approach                                  | Examples            |
| ----------------------------- | ----------------------------------------- | ------------------- |
| **Model-free (value-based)**  | Learns Q-values; derives policy from them | DQN, Double DQN     |
| **Model-free (policy-based)** | Directly optimises the policy             | REINFORCE, PPO, A3C |
| **Actor-Critic**              | Combines value and policy; lower variance | A2C, SAC, TD3       |
| **Model-based**               | Builds a world model; plans inside it     | AlphaZero, Dreamer  |

Use RL when: reward signal is available, environment is simulatable, and the optimal policy isn't known upfront.

---

## Choosing a Model — Decision Guide

```
Is your data labeled?
├── Yes → Supervised
│   ├── Target is continuous? → Regression
│   └── Target is categorical? → Classification
│       ├── Tabular data → Gradient Boosting (XGBoost/LightGBM) first
│       ├── Images → CNN or Vision Transformer
│       └── Text → Transformer (BERT, etc.)
└── No → Unsupervised
    ├── Want groups? → Clustering (K-Means / DBSCAN)
    ├── Want compression? → PCA / Autoencoder
    └── Want to find outliers? → Isolation Forest / Autoencoder

Is data partially labeled?
└── Semi-supervised (self-training, pseudo-labeling, contrastive learning)

Is there an environment with rewards?
└── Reinforcement Learning
```

---

## What's Next

Each model class has its own depth. Written so far:

| Page | What it covers |
|---|---|
| [Regression Models](./supervised/regression.md) | Linear, Ridge/Lasso/ElasticNet, trees, boosting, SVR — with a running bike-rental example |
| [Classification Models](./supervised/classification.md) | Logistic Regression through MLP, worked confusion matrices, class imbalance — running churn example |
| [ML Project Lifecycle](./ml-lifecycle/index.md) | Everything around the model: framing, preprocessing, features, training discipline, production |

Planned: Clustering (K-Means internals, choosing K, silhouette), Dimensionality Reduction (PCA math, t-SNE vs UMAP), Neural Networks & Deep Learning (backprop, CNNs, Transformers), Anomaly Detection (Isolation Forest, autoencoders, threshold selection).
