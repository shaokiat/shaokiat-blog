---
title: Feature Engineering & Selection
sidebar_label: Feature Engineering & Selection
sidebar_position: 3
---

# Feature Engineering & Selection

> Docs: [Feature selection](https://scikit-learn.org/stable/modules/feature_selection.html) · [Permutation importance](https://scikit-learn.org/stable/modules/permutation_importance.html) · [Mutual information](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_classif.html) · [SHAP](https://shap.readthedocs.io/)

## Overview

Features are where domain knowledge enters the model. Gradient boosting with mediocre features loses to logistic regression with great ones, so these are the highest-leverage hours in the project. The second half of the job is deletion. Every feature you keep is a column you must compute correctly, monitor for drift and explain to the planners, forever. The failure people hit is the opposite instinct: adding features until the score moves, and shipping 60 columns for a 0.01 gain.

## Key concepts

### Decisions at a glance

| Task | Default technique | Avoid | #1 failure mode |
|---|---|---|---|
| **Sensor features** | Rolling windows relative to snapshot date | Calendar-period aggregates ("this month") | Window extending past the snapshot date → leakage |
| **Trends** | Ratio of short window to long window | Fitting per-machine regressions | Divide-by-zero on new installs |
| **Quick relevance screen** | Correlation / mutual information vs target | Treating the screen as final selection | Killing features that only work in interactions |
| **Selection with a model** | Lasso (linear) or permutation importance (trees) | Impurity-based `feature_importances_` | High-cardinality bias in impurity importance |
| **Explaining predictions** | SHAP (global + per-machine) | Reading causality into attributions | "Feature X causes failure" from a correlation |

### Creating features

Every feature is an aggregation over a window that ends at the [snapshot date](./index.md#the-snapshot-date). The raw plant data is event tables: sensor readings, alarms, work orders. Features count back from the snapshot.

| Feature | Window | Why it works |
|---|---|---|
| `error_alarms_last_30d` | 30 days | Recent distress |
| `vibration_trend` | mean(last 30d) / mean(last 90d) | Rising vibration means bearing wear. The single best failure feature |
| `hours_since_last_service` | as of snapshot | Overdue maintenance |
| `pct_failed_starts_90d` | 90 days | Starting friction |
| `machine_age_days` | install → snapshot | New machines fail differently (bathtub curve) |

Two patterns cover most tabular feature engineering.

| Pattern | Example | Result |
|---|---|---|
| **Windowed aggregates**: count, sum, mean over 7/30/90-day lookbacks | Alarms in the last 30 days | ✅ Several windows of one sensor are fine; [selection](#selecting-features) keeps the useful ones |
| **Ratios and trends**: short window / long window | `vibration_trend = 1.6`: up 60% on this machine's own baseline | ✅ Comparable across a small pump and a big press |
| Raw sensor magnitude | Mean vibration, absolute | ❌ Every machine has its own normal, so it isn't comparable across the fleet |
| Ratio with no denominator guard | New installs have no 90-day history | ❌ Divide-by-zero. Impute 1.0 ("no trend") plus the [missing-indicator](./data-preprocessing.md#missing-values) |
| Calendar aggregate ("this month") | Vibration in May, for a 1 May snapshot | ❌ Crosses the snapshot date. The [0.99 leak](./data-preprocessing.md#the-leakage-bug-that-scores-099) again |

The safety is structural. One function takes the event tables and `snapshot_date`, and its first step filters to events before the snapshot. Training data is that function run at many historical snapshots. Production scoring is the same function run at today's date. One code path is how you avoid [training/serving skew](./inference-and-production.md#trainingserving-skew).

### Selecting features

Selection is mostly deletion. The goal is the smallest feature set that keeps the score. We built about 60 candidates (5 sensor and event types × several windows × ratios).

| Tier | Method | Cost | Use it for | Watch out for |
|---|---|---|---|---|
| **Filter** | Correlation or mutual information vs target; feature-vs-feature correlation | Cheap | Dead weight and redundant pairs (`vibration_last_30d` vs `_28d`: 0.99, keep one) | A feature useless alone can be vital in interaction. Rising vibration matters only when temperature also climbs |
| **Embedded** | [Lasso](../supervised/regression.md#lasso-regression-l1) for linear; permutation importance for trees | One fit | The main selection pass | Built-in `feature_importances_` favours high-cardinality features ([same warning](../supervised/classification.md#random-forest-classifier)) |
| **Wrapper** | Recursive feature elimination | N refits | Small feature counts with cheap models | Rarely worth the compute |

[Permutation importance](../glossary.md#permutation-importance) shuffles one column and measures the score drop. No drop means the model wasn't using it.

| Knob (`permutation_importance`) | Setting here | Why |
|---|---|---|
| Data | The validation set | Importance on training data rewards overfitting |
| `scoring` | `average_precision` | Matches the PR-AUC sign-off metric |
| `n_repeats` | 10 | Averages out shuffle noise |
| Deletion threshold | Mean drop under 0.001 | Candidates for removal |

| Feature set | PR-AUC | Result |
|---|---|---|
| All 60 candidates | 0.46 | ❌ 60 pipelines to monitor for 0.01 |
| 18 survivors | 0.45 | ✅ Fewer drift monitors, faster scoring, a feature list that fits on one slide |

### Explaining the model

[SHAP](../glossary.md#shap) tells you what the model used, not what causes failures. The planners won't act on a score they can't interrogate, so explain at two levels.

| Level | Method | Example | Use it for |
|---|---|---|---|
| **Global** | Permutation importance or mean \|SHAP\| | Top signals: vibration trend, error alarms, hours since service | Sanity check with reliability engineers. A top feature with no engineering sense is a leak before it's genius |
| **Per machine** | SHAP values for one prediction (`TreeExplainer` for tree ensembles) | 0.83 because vibration is up 60% (+0.31) and two overheat alarms in 14 days (+0.22), despite a recent service (−0.12) | The sentence a planner reads before dispatching a technician |

Say the caveat in every readout. "Alarms drive failures" is a statement about the model, not the machine. Well-monitored machines may throw more alarms, and the model may use alarms as a monitoring-coverage proxy. Whether preventive maintenance works needs an experiment: see [proving impact](./inference-and-production.md#delayed-labels-and-proving-impact).

## Gotchas

- **Windows aligned to calendar periods.** "This month" crosses the [snapshot date](../glossary.md#snapshot-date). Count back from the snapshot instead.
- **Reimplementing features for serving.** Two code paths drift apart. Call one feature function from training and the batch job.
- **Trusting `feature_importances_`.** Impurity importance inflates high-cardinality columns. Use permutation importance on the validation set.
- **Selecting with a filter alone.** Correlation screens kill interaction features. Confirm with a model-based method.
- **Reading SHAP as causation.** Attributions describe the model. Test interventions with a [control group](../glossary.md#control-group).

## Scenario questions

**Q1 ★ Would you feed the model raw vibration or vibration trend?**

<details>
<summary>Model answer</summary>

- **Clarify:** do machines of different types share a vibration scale?
- **Observe:** each machine has its own normal. A pump's healthy reading can be a press's alarm level.
- **Hypothesise:** raw magnitude mostly encodes machine type. Change against the machine's own baseline encodes wear.
- **Fix:** use mean(last 30d) / mean(last 90d), guarded for new installs.
- **Prevent:** prefer ratios to the machine's own history for any sensor. The trade-off is a less intuitive feature for planners.

</details>

**Q2 ★★ 60 features give [PR-AUC](../glossary.md#pr-auc) 0.46. 18 give 0.45. Which do you ship?**

<details>
<summary>Model answer</summary>

- **Clarify:** is 0.01 outside the run-to-run noise?
- **Observe:** compare across seeds; check the weak slices on both sets.
- **Hypothesise:** the 42 extra columns buy noise-level gains and add 42 things to monitor.
- **Fix:** ship the 18.
- **Prevent:** at equal score, the smaller set wins by default. The trade-off is a possible real 0.01 left on the table.

</details>

**Q3 ★★ The top feature by `feature_importances_` is `machine_model`. Do you trust it?**

<details>
<summary>Model answer</summary>

- **Clarify:** how was `machine_model` encoded, and with how many categories?
- **Observe:** run permutation importance on the validation set and compare the ranking.
- **Hypothesise:** impurity importance favours high-cardinality features. Or the [target encoding](../glossary.md#target-encoding) leaked if it wasn't out-of-fold.
- **Fix:** rank by permutation importance; check the encoder is out-of-fold.
- **Prevent:** permutation importance is the default ranking. The trade-off is extra compute per evaluation.

</details>

**Q4 ★★★ A planner reads the SHAP chart and asks: should we cut alarm thresholds to reduce failures?**

<details>
<summary>Model answer</summary>

- **Clarify:** what decision would they change, and on which machines?
- **Observe:** SHAP says the model leans on `error_alarms_last_30d`. It says nothing about what happens if alarms change.
- **Hypothesise:** alarms may be a symptom of wear, or a proxy for how well a machine is monitored.
- **Fix:** explain that attribution is not causation; changing thresholds would also change the feature the model relies on.
- **Prevent:** causal questions go to a controlled experiment. The trade-off is weeks of waiting instead of an answer from a chart.

</details>

## Summary

- **Every window ends at the snapshot date.** One shared function filters it, for training and serving alike.
- **Ratios beat raw magnitudes.** A trend against the machine's own baseline is comparable across the fleet.
- **Selection is deletion.** At equal score, the smaller set wins. Every survivor is a permanent liability.
- **Permutation, not impurity.** Built-in importances flatter high-cardinality features.
- **Surprising top features are leaks.** Check the ranking with a reliability engineer before celebrating it.

---

**Next →** [Model Training & Evaluation](./model-training.md)
