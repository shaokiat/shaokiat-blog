---
title: Glossary
sidebar_label: Glossary
sidebar_position: 6
---

import Link from "@docusaurus/Link";

# Glossary

> Docs: [scikit-learn glossary](https://scikit-learn.org/stable/glossary.html) · [Google ML glossary](https://developers.google.com/machine-learning/glossary)

One line per term. Follow the link for the full explanation.

## Framing

| Term | Definition | More |
|---|---|---|
| <Link id="snapshot-date" />**Snapshot date** | The moment you freeze time: features only from before it, the label only from after it. | [The snapshot date](./ml-lifecycle/index.md#the-snapshot-date) |
| <Link id="label-window" />**Label window** | The period after the snapshot date in which the outcome is observed (30 days here). | [The label](./ml-lifecycle/index.md#the-label) |
| <Link id="base-rate" />**Base rate** | The share of positive rows: 3% of machines fail per window. | [Start with the target](./ml-lifecycle/eda.md#start-with-the-target) |
| <Link id="baseline" />**Baseline** | The score of a simple strategy the model must beat, such as the CMMS rule. | [Baseline first](./ml-lifecycle/model-training.md#baseline-first) |

## Data

| Term | Definition | More |
|---|---|---|
| <Link id="leakage" />**Leakage** | Training data containing information the model won't have at prediction time. Scores too good, then collapses. | [The leakage bug](./ml-lifecycle/data-preprocessing.md#the-leakage-bug-that-scores-099) |
| <Link id="mcar-mar-mnar" />**MCAR / MAR / MNAR** | Missing completely at random; explained by other columns; depends on the missing value itself. | [Missing values](./ml-lifecycle/data-preprocessing.md#missing-values) |
| <Link id="missing-indicator" />**Missing indicator** | A 0/1 column recording that a value was imputed, so the gap's signal survives. | [Missing values](./ml-lifecycle/data-preprocessing.md#missing-values) |
| <Link id="target-encoding" />**Target encoding** | Replacing a category with its mean target. Must be out-of-fold or it leaks. | [Encoding categoricals](./ml-lifecycle/data-preprocessing.md#encoding-categoricals) |
| <Link id="pipeline" />**Pipeline** | One fitted object holding every preprocessing step plus the model. | [The pipeline pattern](./ml-lifecycle/data-preprocessing.md#the-pipeline-pattern) |
| <Link id="permutation-importance" />**Permutation importance** | The score drop when one column is shuffled. No drop means the model ignores it. | [Selecting features](./ml-lifecycle/feature-engineering.md#selecting-features) |
| <Link id="shap" />**SHAP** | Per-prediction attribution of a score to each feature. Describes the model, not causes. | [Explaining the model](./ml-lifecycle/feature-engineering.md#explaining-the-model) |

## Validation

| Term | Definition | More |
|---|---|---|
| <Link id="cross-validation" />**Cross-validation** | Rotating which fold is held out, so every row validates once. | [Cross-validation](./supervised/index.md#cross-validation) |
| <Link id="time-based-split" />**Time-based split** | Train on earlier periods, validate and test on later ones. | [Choosing the validation split](./ml-lifecycle/model-training.md#choosing-the-validation-split) |
| <Link id="bias-variance" />**Bias–variance** | Underfitting (too simple) vs overfitting (too flexible). | [Bias–variance trade-off](./supervised/index.md#biasvariance-trade-off) |
| <Link id="regularisation" />**Regularisation** | A penalty on complexity: L1 zeroes weights, L2 shrinks them. | [Regularisation](./supervised/index.md#regularisation) |
| <Link id="early-stopping" />**Early stopping** | Stop adding trees or epochs when the validation score stops improving. | [Gradient boosting](./supervised/regression.md#gradient-boosting) |

## Metrics

| Term | Definition | More |
|---|---|---|
| <Link id="precision-recall" />**Precision / recall** | Share of flags that were right / share of positives that were flagged. | [Evaluation metrics](./supervised/classification.md#evaluation-metrics) |
| <Link id="pr-auc" />**PR-AUC** | Precision averaged over all recall levels. The metric for rare positives. | [Evaluation metrics](./supervised/classification.md#evaluation-metrics) |
| <Link id="roc-auc" />**ROC-AUC** | How often a random positive outranks a random negative. Flattering on rare positives. | [Evaluation metrics](./supervised/classification.md#evaluation-metrics) |
| <Link id="threshold" />**Threshold** | The score above which a row is flagged. Set by the cost of misses vs false alarms. | [Evaluation metrics](./supervised/classification.md#evaluation-metrics) |
| <Link id="rmse-mae" />**RMSE / MAE** | Typical miss size; RMSE weights big misses more. | [Regression metrics](./supervised/regression.md#evaluation-metrics) |

## Models

| Term | Definition | More |
|---|---|---|
| <Link id="bagging" />**Bagging** | Many models on random subsets, averaged. Cuts variance. | [Bagging vs boosting](./supervised/index.md#ensembles-bagging-vs-boosting) |
| <Link id="boosting" />**Boosting** | Models in sequence, each fitting the last one's errors. Cuts bias. | [Bagging vs boosting](./supervised/index.md#ensembles-bagging-vs-boosting) |
| <Link id="calibration" />**Calibration** | Whether a score of 0.3 really means a 30% chance. | [Logistic regression](./supervised/classification.md#logistic-regression) |
| <Link id="class-weight" />**Class weight** | Up-weighting the rare class in the loss (`class_weight`, `scale_pos_weight`). | [Handling class imbalance](./supervised/classification.md#handling-class-imbalance) |

## Production

| Term | Definition | More |
|---|---|---|
| <Link id="training-serving-skew" />**Training/serving skew** | Features computed differently in serving than in training. Silent decay. | [Training/serving skew](./ml-lifecycle/inference-and-production.md#trainingserving-skew) |
| <Link id="covariate-drift" />**Covariate drift** | Input distributions shift after launch. | [Monitoring and drift](./ml-lifecycle/inference-and-production.md#monitoring-and-drift) |
| <Link id="concept-drift" />**Concept drift** | The same inputs now mean a different outcome. | [Monitoring and drift](./ml-lifecycle/inference-and-production.md#monitoring-and-drift) |
| <Link id="control-group" />**Control group** | A random slice that doesn't get the intervention, for clean labels and causal impact. | [Proving impact](./ml-lifecycle/inference-and-production.md#delayed-labels-and-proving-impact) |
