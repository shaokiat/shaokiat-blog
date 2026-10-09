---
title: Data Science
sidebar_label: Overview
---

# Data Science

Study notes for applied machine learning, written for interviews: every page ends in scenario questions answered out loud, and every number comes from one of two running examples. The pages are for reading, not running. Start with the [Learning Path](./start-here/learning-path.md); look terms up in the [Glossary](./start-here/glossary.md).

## Running examples

- **Machine failure** — 10,000 machines, 3% fail in any 30-day window. Used by the [ML Project Lifecycle](./ml-lifecycle/index.md) and [Classification](./supervised/classification.md).
- **Bike-rental demand** — hourly rentals from weather and time. Used by [Regression](./supervised/regression.md).

---

## Section 1: ML Project Lifecycle

### 1.1 Frame the problem → [ML Project Lifecycle](./ml-lifecycle/index.md)
- The decision, the label and the snapshot date → [The snapshot date](./ml-lifecycle/index.md#the-snapshot-date)
- Rule baseline vs model → [Is ML needed?](./ml-lifecycle/index.md#is-ml-needed)

### 1.2 Explore → [Exploratory Data Analysis](./ml-lifecycle/eda.md)
- Label audit → [Start with the target](./ml-lifecycle/eda.md#start-with-the-target)
- Leak scan → [Relationships and the leak scan](./ml-lifecycle/eda.md#relationships-and-the-leak-scan)
- Deliverable → [Decision log](./ml-lifecycle/eda.md#the-deliverable-a-decision-log)

### 1.3 Preprocess → [Data Preprocessing](./ml-lifecycle/data-preprocessing.md)
- Leakage → [The leakage bug that scores 0.99](./ml-lifecycle/data-preprocessing.md#the-leakage-bug-that-scores-099)
- Missing values, outliers, scaling, encoding → [Missing values](./ml-lifecycle/data-preprocessing.md#missing-values) · [Outliers](./ml-lifecycle/data-preprocessing.md#outliers) · [Encoding](./ml-lifecycle/data-preprocessing.md#encoding-categoricals)
- One fitted object → [The pipeline pattern](./ml-lifecycle/data-preprocessing.md#the-pipeline-pattern)

### 1.4 Features → [Feature Engineering & Selection](./ml-lifecycle/feature-engineering.md)
- Windows and ratios → [Creating features](./ml-lifecycle/feature-engineering.md#creating-features)
- Deletion → [Selecting features](./ml-lifecycle/feature-engineering.md#selecting-features)
- SHAP → [Explaining the model](./ml-lifecycle/feature-engineering.md#explaining-the-model)

### 1.5 Train and evaluate → [Model Training & Evaluation](./ml-lifecycle/model-training.md)
- Baselines → [Baseline first](./ml-lifecycle/model-training.md#baseline-first)
- Time-based splits → [Choosing the validation split](./ml-lifecycle/model-training.md#choosing-the-validation-split)
- Sign-off → [Evaluate and sign off](./ml-lifecycle/model-training.md#evaluate-and-sign-off)

### 1.6 Production → [Inference & Production](./ml-lifecycle/inference-and-production.md)
- Batch vs online → [Batch vs online inference](./ml-lifecycle/inference-and-production.md#batch-vs-online-inference)
- Skew and drift → [Training/serving skew](./ml-lifecycle/inference-and-production.md#trainingserving-skew) · [Monitoring and drift](./ml-lifecycle/inference-and-production.md#monitoring-and-drift)
- Impact → [Delayed labels and proving impact](./ml-lifecycle/inference-and-production.md#delayed-labels-and-proving-impact)

## Section 2: Models

### 2.1 Shared concepts → [Supervised Learning](./supervised/index.md)
- Splits and cross-validation → [Cross-validation](./supervised/index.md#cross-validation)
- Bias–variance → [Bias–variance trade-off](./supervised/index.md#biasvariance-trade-off)
- Ensembles → [Bagging vs boosting](./supervised/index.md#ensembles-bagging-vs-boosting)

### 2.2 Regression → [Regression](./supervised/regression.md)
- Metrics → [Evaluation metrics](./supervised/regression.md#evaluation-metrics)
- Penalties → [Ridge](./supervised/regression.md#ridge-regression-l2) · [Lasso](./supervised/regression.md#lasso-regression-l1) · [ElasticNet](./supervised/regression.md#elasticnet)

### 2.3 Classification → [Classification](./supervised/classification.md)
- Thresholds → [Evaluation metrics](./supervised/classification.md#evaluation-metrics)
- Imbalance → [Handling class imbalance](./supervised/classification.md#handling-class-imbalance)

### 2.4 Beyond supervised → [Model Landscape](./landscape.md)
- Unsupervised → [Clustering](./landscape.md#clustering) · [Anomaly detection](./landscape.md#anomaly-detection)
- Deep learning and RL → [Deep learning](./landscape.md#deep-learning) · [Reinforcement learning](./landscape.md#reinforcement-learning)

---

Serving the model behind an API lives in [AI Engineering](../ai-engineering/index.md). This section owns the decisions; that one owns the code.
