---
sidebar_position: 0
---

# Supervised Learning

Supervised learning trains a model on **labeled input-output pairs**. The model learns a mapping `f(X) → y` and generalises that mapping to unseen inputs.

Two sub-problems based on the target type:

| Problem | Target `y` | Examples |
|---|---|---|
| **Regression** | Continuous value | House price, demand forecast, sensor reading |
| **Classification** | Discrete class label | Spam/not-spam, disease diagnosis, machine-failure prediction |

---

## Core Concepts

### Training, Validation, Test Split

| Split | Purpose |
|---|---|
| **Train** | Model learns parameters from this data |
| **Validation** | Tune hyperparameters, compare models |
| **Test** | Final unbiased evaluation. Touch once |

Typical split: 70 / 15 / 15 or 80 / 10 / 10. Use **stratified** splits for imbalanced classification.

### Cross-Validation

When data is limited, a single validation split wastes rows and gives a noisy estimate. **K-fold cross-validation** splits the training data into k folds (k=5 is the default), trains on k−1 and validates on the held-out fold, rotating k times. Every row gets used for both training and validation.

| Variant | Use when |
|---|---|
| **K-fold** | Default for regression |
| **Stratified k-fold** | Classification: keeps class ratios equal per fold |
| **TimeSeriesSplit** | Temporal data: always validate on later data than you train on |

The one rule: fit your scaler/encoder *inside* each fold (use a sklearn `Pipeline`). Fitting preprocessing on all the data first leaks validation information into training.

### Bias–Variance Tradeoff

| | High Bias (Underfitting) | High Variance (Overfitting) |
|---|---|---|
| **Symptom** | High train error, high test error | Low train error, high test error |
| **Cause** | Model too simple | Model too complex |
| **Fix** | More features, more complex model | Regularisation, more data, pruning |

### Regularisation

Adds a penalty to the loss function to shrink model complexity.

| Type | Penalty | Effect |
|---|---|---|
| **L1 (Lasso)** | Sum of absolute weights | Sparse weights: drives some to zero (feature selection) |
| **L2 (Ridge)** | Sum of squared weights | Shrinks all weights, handles correlated features |
| **ElasticNet** | L1 + L2 combined | Balanced sparsity and shrinkage |

---

Choosing and training a model is one stage of a real project. For the stages around it (framing, preprocessing, features, production), see the [ML Project Lifecycle](../ml-lifecycle/index.md), which carries this section's machine-failure example end to end.

## Pages in This Section

Each page opens with a **cheatsheet table** (model → when to reach for it → #1 failure mode) and threads a single **running example** through every model, so the trade-offs are directly comparable instead of abstract. Per model you get a one-line memory hook, a minimal sklearn snippet, and how it performed on the shared problem.

| Page | Running example | What it covers |
|---|---|---|
| [Regression](./regression.md) | Bike-rental demand | Linear, Ridge/Lasso/ElasticNet, trees, boosting, SVR; RMSE vs MAE with worked numbers |
| [Classification](./classification.md) | Machine failure (3% positive class) | Logistic Regression, trees, ensembles, SVM, KNN, Naive Bayes, MLP; worked confusion matrices and threshold tuning |
