---
title: Model Training & Evaluation
sidebar_label: Model Training & Evaluation
sidebar_position: 4
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Model Training & Evaluation

> Docs: [Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html) · [TimeSeriesSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html) · [Hyperparameter tuning](https://scikit-learn.org/stable/modules/grid_search.html) · [Optuna](https://optuna.readthedocs.io/) · [MLflow Tracking](https://mlflow.org/docs/latest/tracking.html)

## Overview

Training turns clean data and honest features into a model you can sign off. Picking the model is already solved by the [classification cheatsheet](../supervised/classification.md#cheatsheet). What's left is discipline: validate the way production predicts, tune without fooling yourself, and touch the test set exactly once. The failure people hit is a flattering validation number. On the machine-failure problem, a random split reported AUC 0.87 and production delivered 0.79.

<ThemedImage
  alt="Random 5-fold mixes validation rows into every month and over-reports; a time-based split trains on Jan to Apr, validates on May and tests once on Jun"
  sources={{
    light: useBaseUrl('/img/data-science/fig-model-training-1-light.svg'),
    dark: useBaseUrl('/img/data-science/fig-model-training-1-dark.svg'),
  }}
/>

*Figure L4-1: The same six monthly snapshots, split two ways. Blue is training data, green is validation, amber is the test set.*

## Key concepts

### Decisions at a glance

| Decision | Default | Avoid | #1 failure mode |
|---|---|---|---|
| **First model** | Rule-based baseline, then logistic regression | Starting with the fanciest model | No baseline → no idea if 0.84 is good |
| **Validation split** | Time-based for anything temporal; stratified k-fold otherwise | Random k-fold on temporal data | Validating on the past, predicting the future |
| **Hyperparameter search** | Random search or Optuna, ~50 trials | Exhaustive grid search | Burning compute on a 6-D grid |
| **Search target** | CV score inside the training window | Tuning against the test set | Test set becomes a training signal |
| **Experiment tracking** | Log params + data hash + metrics per run | Notebook memory | "Which run was the good one?" |
| **Final evaluation** | Held-out test set, touched once, sliced by segment | Re-running until the number looks good | Silent failure on the machines that matter |

### Baseline first

A model score means nothing until you know what a dumb strategy scores. Score the free baselines before training anything.

| Strategy | PR-AUC | What it tells you |
|---|---|---|
| **Maintenance rule**: active temperature alarm or over 5,000 hours since service | 0.24 | The bar the model must clear by enough to justify existing |
| **Logistic regression** on the final features | 0.31 | Two minutes of work. The linear ceiling |
| **Tuned XGBoost** | 0.46 | Roughly double the rule, +50% over linear |

Without the first two rows, 0.46 is a number in a vacuum. If XGBoost had barely cleared the rule, the right ship decision would have been the CMMS query.

### Choosing the validation split

The split must simulate how the model will be used. For failure prediction that means predicting the future, not a random 20%. The mechanics of k-fold live in the [supervised intro](../supervised/index.md#cross-validation). This section is about choosing.

Training data is monthly snapshots, Jan–Jun. Random stratified k-fold shuffles all six months together, so the model trains on May machines and validates on February ones. It learns seasonal load, the March line upgrade and fleet ageing from the future. Production never gets that.

| Validation scheme | Validation AUC | Production AUC (next month) | Result |
|---|---|---|---|
| Random stratified 5-fold across all months | 0.87 | 0.79 | ❌ Over-reports by 0.08. A number you gave the plant manager and then missed |
| Train Jan–Apr → validate May → test Jun | 0.82 | 0.81 | ✅ Lower, and honest |

The lower validation number is the better validation. Use random stratified k-fold only when rows are exchangeable, with no time structure. That's why the supervised pages use it. Deciding which regime you're in is the skill.

### Hyperparameter search

Random search beats grid search at equal budget, because the parameters that matter get 50 distinct values instead of 5.

| Approach | Budget | Result |
|---|---|---|
| Full grid, 5 values × 6 params | 15,625 fits | ❌ Almost all spent on parameters that don't matter |
| Random search | ~50 trials | ✅ Covers the space better at any fixed budget |
| Optuna (Bayesian) | ~50 trials | ✅ Use when fits are expensive. Later trials search near earlier winners |
| Any search scored on the Jun test set | — | ❌ The test set stops measuring generalisation |

Search inside the training window only. Tuning moved the failure XGBoost from [PR-AUC](../start-here/glossary.md#pr-auc) 0.42 to 0.46 and plateaued around trial 40. When the search flatlines, the next gain is in the [features](./feature-engineering.md), not the hyperparameters.

| Knob (XGBoost) | Setting here | Why |
|---|---|---|
| `max_depth` | search 3–8 | Main capacity control |
| `learning_rate` | search 0.01–0.1, log scale | Pairs with early stopping |
| `subsample` | search 0.6–1.0 | Row sampling against overfitting |
| `n_estimators` + `early_stopping_rounds` | 2000 + 50, stopped on the May set | Lets the data pick the tree count |
| `scale_pos_weight` | ≈ 32 (9,700 / 300) | Corrects the 3% base rate |
| `eval_metric` | `aucpr` | Matches the sign-off metric |

### Experiment tracking

MLflow, W&B or a CSV. The tool matters less than what each run logs.

| Log | Question it answers |
|---|---|
| Params + code version | Can I reproduce the winner? |
| Training-data hash or snapshot range | Did the data change, or the model? |
| Validation metrics, all of them, sliced | Which run is actually better? |
| The model artifact | What exactly did we deploy? |

### Evaluate and sign off

One aggregate metric can hide a broken model. Metric definitions and the threshold worked example live on the [classification page](../supervised/classification.md#evaluation-metrics). This is the pre-ship discipline on top.

| Step | On the failure model | What it catches |
|---|---|---|
| **Slice the metric** | Overall PR-AUC 0.46, CNC spindles 0.21 (only 40 spindle failures) | The model guessing on the most expensive machines |
| **Read the errors** | 20 high-confidence false positives broke down on day 31–35, just outside the label window | A label-definition disagreement, not a modelling bug |
| **Touch the test set once** | Jun scored one time, after every decision is frozen | A test set quietly turned into a second validation set |
| **Business sign-off** | Downtime hours prevented at the chosen threshold and inspection budget, known weak slices, the [monitoring plan](./inference-and-production.md) | An AUC in an email standing in for a decision |

A weak slice needs an explicit decision: ship with a documented carve-out ("planners handle spindles on the old schedule"), or fix it first.

## Gotchas

- **Random k-fold on monthly snapshots.** Validation leaks the future and over-reports. Split by [snapshot date](../start-here/glossary.md#snapshot-date).
- **[Early stopping](../start-here/glossary.md#early-stopping) on the test set.** The early-stopping set is a tuning input. Stop on validation (May), never on Jun.
- **Re-scoring the test set after each tweak.** Each look turns it into a validation set and its number into fiction. Freeze decisions, then score once.
- **Comparing runs on different data.** Without a data hash, a gain could be a new snapshot, not a better model. Log the snapshot range with every run.
- **Tuning past the plateau.** 200 trials buying 0.01 is noise. Go back to features.

## Scenario questions

**Q1 ★ Your tuned XGBoost scores PR-AUC 0.46. Is that good?**

<details>
<summary>Model answer</summary>

- **Clarify:** good compared to what? What does the plant do today?
- **Observe:** score the maintenance rule (0.24) and logistic regression (0.31) on the same split.
- **Hypothesise:** 0.46 could be strong or trivial. The [base rate](../start-here/glossary.md#base-rate) is 3%, so a random model scores about 0.03.
- **Fix:** report it as roughly double the current rule and +50% over linear.
- **Prevent:** baselines go in the first experiment log, before any model. The trade-off is half a day spent on models nobody will ship.

</details>

**Q2 ★★ Validation AUC was 0.87. The first month in production scored 0.79. Walk me through it.**

<details>
<summary>Model answer</summary>

- **Clarify:** is the data temporal, and how was the validation set drawn?
- **Observe:** the split was random stratified 5-fold across Jan–Jun snapshots. Rerun with train Jan–Apr, validate May: 0.82.
- **Hypothesise:** the random split let the model learn from later months to predict earlier ones. Less likely: real drift after launch.
- **Fix:** switch to a time-based split and re-tune inside the training window.
- **Prevent:** the split mirrors how production predicts. The honest number is lower, and the stakeholder hears it before launch.

</details>

**Q3 ★★ Tuning has run 200 trials for +0.01. A teammate wants a bigger grid. What do you say?**

<details>
<summary>Model answer</summary>

- **Clarify:** what's the variance between runs with different seeds?
- **Observe:** the Optuna history plateaued around trial 40, from 0.42 to 0.46.
- **Hypothesise:** the remaining 0.01 is within seed noise. The model has hit the ceiling of its features.
- **Fix:** stop tuning. Spend the time on features from the EDA decision log.
- **Prevent:** set a trial budget (~50) and a plateau rule up front. The trade-off is maybe leaving a real 0.005 on the table.

</details>

**Q4 ★★★ The model clears the bar overall, but the plant manager says it misses spindle failures. What do you do?**

<details>
<summary>Model answer</summary>

- **Clarify:** how costly is a missed spindle failure compared to other machines?
- **Observe:** slice PR-AUC by machine type. Spindles score 0.21 against 0.46 overall, from only 40 failures.
- **Hypothesise:** too few spindle failures to learn from, or spindle failures look different from the rest of the fleet.
- **Fix:** ship with a documented carve-out where planners keep spindles on the old schedule, or delay for more data or a spindle-specific feature.
- **Prevent:** sign-off always includes per-segment metrics. The trade-off is slower sign-off and more uncomfortable conversations.

</details>

## Summary

- **No baseline, no meaning.** The model must beat the dumb strategy by enough to justify existing.
- **Validate the way production predicts.** Temporal problem, temporal split. The lower honest number beats the higher flattering one.
- **Random beats grid.** About 50 trials, inside the training window only. When the search flatlines, go back to the features.
- **Log every run.** Params, data hash, sliced metrics and artifact, or you can't tell which run won.
- **Slice, read errors, then touch the test set once.** In that order, and the last one only once.

---

**Next →** [Inference & Production](./inference-and-production.md)
