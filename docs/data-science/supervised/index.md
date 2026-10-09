---
title: Supervised Learning
sidebar_label: Supervised Learning
sidebar_position: 0
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Supervised Learning

> Docs: [scikit-learn supervised learning](https://scikit-learn.org/stable/supervised_learning.html) · [Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html) · [Ensembles](https://scikit-learn.org/stable/modules/ensemble.html) · [Validation curves](https://scikit-learn.org/stable/modules/learning_curve.html)

## Overview

Supervised learning trains a model on labelled input-output pairs and generalises the mapping to inputs it hasn't seen. This page owns the ideas every model shares: how to split data, [cross-validation](../start-here/glossary.md#cross-validation), the bias–variance trade-off, regularisation and ensembles. The two model pages build on it. The failure people hit is judging a model on the data it trained on, then watching it collapse on anything new.

## Key concepts

### Regression or classification

The target type picks the page.

| Problem | Target | Examples | Page |
|---|---|---|---|
| **Regression** | Continuous value | Demand forecast, house price, sensor reading | [Regression](./regression.md) (bike-rental demand) |
| **Classification** | Discrete class | Spam, diagnosis, machine failure | [Classification](./classification.md) (machine failure, 3% positive) |

### Train, validation, test

| Split | Purpose | Typical share |
|---|---|---|
| **Train** | The model learns its parameters here | 70–80% |
| **Validation** | Tune hyperparameters, compare models | 10–15% |
| **Test** | Final unbiased estimate. Touch once | 10–15% |

Use stratified splits for imbalanced classification. For temporal data, split by time: see [choosing the validation split](../ml-lifecycle/model-training.md#choosing-the-validation-split).

### Cross-validation

A single validation split wastes rows and gives a noisy estimate. K-fold cross-validation splits the training data into k folds (k = 5 by default), trains on k − 1 and validates on the held-out fold, rotating k times. Every row is used for both training and validation.

| Variant | Use when | Result on the wrong data |
|---|---|---|
| **K-fold** | Regression, rows exchangeable | — |
| **Stratified k-fold** | Classification: equal class ratios per fold | Plain k-fold on 3% positives leaves some folds with almost no failures |
| **TimeSeriesSplit** | Temporal data: always validate on later data | ❌ Random k-fold on monthly snapshots over-reports AUC by 0.08 ([why](../ml-lifecycle/model-training.md#choosing-the-validation-split)) |

Fit every scaler and encoder inside each fold, with a `Pipeline`. Fitting preprocessing on all the data first leaks validation information into training ([the pipeline pattern](../ml-lifecycle/data-preprocessing.md#the-pipeline-pattern)).

### Bias–variance trade-off

As a model gets more flexible, training error keeps falling. Validation error falls, bottoms out, then rises again.

<svg className="ml-diagram" viewBox="0 0 480 260" role="img" aria-label="Training error falls steadily as model complexity grows; validation error falls to a minimum then rises; the minimum is the sweet spot between underfitting and overfitting">
  <line className="axis-line" x1="50" y1="220" x2="450" y2="220" strokeWidth="1.5" />
  <line className="axis-line" x1="50" y1="20" x2="50" y2="220" strokeWidth="1.5" />
  <text className="axis-label" x="250" y="248" textAnchor="middle" fontSize="12" fontFamily="sans-serif">model complexity →</text>
  <text className="axis-label" x="22" y="120" textAnchor="middle" fontSize="12" fontFamily="sans-serif" transform="rotate(-90,22,120)">error</text>
  <polyline className="underfit-line" points="60,60 100,100 140,130 180,152 220,168 260,180 300,189 340,196 380,201 420,204 440,205" strokeWidth="2.5" fill="none" />
  <polyline className="overfit-line" points="60,52 100,90 140,118 180,134 220,140 260,138 300,128 340,112 380,92 420,70 440,58" strokeWidth="2.5" fill="none" />
  <circle className="highlight-pt" cx="220" cy="140" r="6" />
  <text className="highlight-label" x="220" y="126" textAnchor="middle" fontSize="12" fontFamily="sans-serif">sweet spot</text>
  <text className="underfit-label" x="440" y="196" textAnchor="end" fontSize="12" fontFamily="sans-serif">training</text>
  <text className="overfit-label" x="430" y="52" textAnchor="end" fontSize="12" fontFamily="sans-serif">validation</text>
  <text className="axis-label" x="110" y="36" textAnchor="middle" fontSize="12" fontFamily="sans-serif">underfit · high bias</text>
  <text className="axis-label" x="330" y="36" textAnchor="middle" fontSize="12" fontFamily="sans-serif">overfit · high variance</text>
</svg>

*Figure M0-1: Error against model complexity. Grey is training error, red is validation error, amber marks the complexity to pick.*

| | High bias (underfitting) | High variance (overfitting) |
|---|---|---|
| **Symptom** | High train error, high validation error | Low train error, high validation error |
| **Cause** | Model too simple | Model too flexible for the data |
| **Fix** | More features, more flexible model | Regularisation, more data, shallower trees, early stopping |

### Regularisation

Regularisation adds a penalty for complexity, moving a model left on Figure M0-1.

| Type | Penalty | Effect | Owner section |
|---|---|---|---|
| **L1 (Lasso)** | Sum of absolute weights | Drives some weights to exactly zero: feature selection | [Lasso](./regression.md#lasso-regression-l1) |
| **L2 (Ridge)** | Sum of squared weights | Shrinks all weights; stable with correlated features | [Ridge](./regression.md#ridge-regression-l2) |
| **ElasticNet** | L1 + L2 | Sparsity that keeps correlated groups together | [ElasticNet](./regression.md#elasticnet) |

Trees regularise differently: `max_depth`, minimum samples per leaf, and for boosting, learning rate plus [early stopping](../start-here/glossary.md#early-stopping).

### Ensembles: bagging vs boosting

Both combine many trees. They fix opposite problems.

<ThemedImage
  alt="Bagging trains deep trees in parallel on bootstrap samples and averages them; boosting trains shallow trees in sequence on residuals and sums them"
  sources={{
    light: useBaseUrl('/img/data-science/fig-supervised-1-light.svg'),
    dark: useBaseUrl('/img/data-science/fig-supervised-1-dark.svg'),
  }}
/>

*Figure M0-2: Bagging and boosting. Blue is a tree, grey is what each tree is trained on, amber is the combining step.*

| | Bagging (Random Forest) | Boosting (XGBoost, LightGBM, CatBoost) |
|---|---|---|
| **Trees** | Deep, independent, in parallel | Shallow, each fits the previous ensemble's errors |
| **Fixes** | Variance (overfitting) | Bias (underfitting) |
| **Tuning** | Works almost out of the box | Needs learning rate, depth and early stopping |
| **Typical result** | Strong baseline | Best tabular accuracy once tuned |
| **Failure mode** | Biased `feature_importances_` | No early stopping → overfit |

### Pages in this section

Each model page opens with a cheatsheet table and threads one running example through every model, so the trade-offs are directly comparable.

| Page | Running example | Covers |
|---|---|---|
| [Regression](./regression.md) | Bike-rental demand | Linear, Ridge/Lasso/ElasticNet, polynomial, trees, ensembles, SVR; RMSE vs MAE |
| [Classification](./classification.md) | Machine failure (3% positive) | Logistic regression, trees, ensembles, SVM, KNN, Naive Bayes, MLP; thresholds and imbalance |

For the stages around model choice (framing, preprocessing, features, production), see the [ML Project Lifecycle](../ml-lifecycle/index.md).

## Gotchas

- **Scoring on training data.** A memorising model looks perfect. Report validation or cross-validated scores only.
- **Tuning against the test set.** It stops being an unbiased estimate. Tune on validation; score the test set once.
- **Preprocessing before splitting.** Statistics leak across folds. Put every fitted step in a `Pipeline`.
- **Plain k-fold on rare classes or time series.** Folds lose positives, or validate on the past. Use stratified or time-based splits.
- **Adding regularisation to an underfit model.** It makes bias worse. Check which side of Figure M0-1 you're on first.

## Scenario questions

**Q1 ★ Training accuracy is 99%, validation is 72%. What's going on?**

<details>
<summary>Model answer</summary>

- **Clarify:** what model, how much data, and how was validation drawn?
- **Observe:** the gap between training and validation error is large; training error is near zero.
- **Hypothesise:** high variance. The model memorised the training set. Less likely: [leakage](../start-here/glossary.md#leakage) in training only, or a distribution shift between splits.
- **Fix:** regularise (shallower trees, stronger penalty, early stopping) or add data.
- **Prevent:** track training and validation curves together. The trade-off is a little training accuracy for generalisation.

</details>

**Q2 ★★ When would you pick Random Forest over XGBoost?**

<details>
<summary>Model answer</summary>

- **Clarify:** how much tuning time is there, and how much accuracy matters?
- **Observe:** on the machine-failure data, the untuned forest scores [PR-AUC](../start-here/glossary.md#pr-auc) 0.40; tuned XGBoost 0.46.
- **Hypothesise:** the forest reduces variance with almost no tuning. Boosting reduces bias but needs early stopping and a search.
- **Fix:** forest for a fast, robust baseline; boosting when the extra accuracy is worth the tuning bill.
- **Prevent:** always have the forest as the baseline boosting must beat. The trade-off is one more model to train.

</details>

**Q3 ★★ Why not just report one train/validation split?**

<details>
<summary>Model answer</summary>

- **Clarify:** how big is the data, and is it temporal?
- **Observe:** scores vary by a few points across different random splits.
- **Hypothesise:** a single split is a noisy estimate, and a lucky split flatters the model.
- **Fix:** k-fold (stratified for classification), or a [time-based split](../start-here/glossary.md#time-based-split) for temporal data, reporting the mean and spread.
- **Prevent:** cross-validation inside a pipeline as the default. The trade-off is k times the training cost.

</details>

## Summary

- **Generalisation is the goal.** Only scores on data the model didn't train on count.
- **Split the way you'll predict.** Stratified for rare classes, by time for temporal data.
- **Watch both error curves.** The gap between training and validation tells you bias from variance.
- **Regularisation moves you left.** Use it against variance, never against bias.
- **Bagging cancels variance, boosting cancels bias.** Forest for a robust baseline, boosting for the best tuned accuracy.

---

**Next →** [Regression](./regression.md)
