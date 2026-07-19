---
sidebar_position: 3
---

# Feature Engineering & Selection

Features are where domain knowledge enters the model. Gradient boosting with mediocre features loses to logistic regression with great ones. These are the highest-leverage hours in the project.

The second half of the job is deletion. Most features you create won't earn their keep. Every one you keep is a column you must compute correctly, monitor for drift, and explain to the maintenance planners, forever.

---

## Cheatsheet

| Task | Default technique | Avoid | #1 failure mode |
|---|---|---|---|
| **Sensor features** | Rolling windows relative to snapshot date | Calendar-period aggregates ("this month") | Window extending past the snapshot date → leakage |
| **Trends** | Ratio of short window to long window | Fitting per-machine regressions | Divide-by-zero on new installs |
| **Quick relevance screen** | Correlation / mutual information vs target | Treating the screen as final selection | Killing features that only work in interactions |
| **Selection with a model** | Lasso (linear) or permutation importance (trees) | Impurity-based `feature_importances_` | High-cardinality bias in impurity importance |
| **Explaining predictions** | SHAP (global + per-machine) | Reading causality into attributions | "Feature X causes failure" from a correlation |

---

## Creating Features

> **Remember one thing:** every feature is an aggregation over a window that ends at the snapshot date. No exceptions, no "just this once".

The raw plant data isn't a feature matrix. It's event tables: sensor readings from the historian, error alarms, maintenance work orders. Features are aggregations of those events over windows **counting back from the snapshot date** (defined on the [lifecycle intro](./index.md#3-what-is-the-snapshot-date)):

| Feature | Window | Why it works |
|---|---|---|
| `error_alarms_last_30d` | 30 days | Recent distress |
| `vibration_trend` | mean(last 30d) / mean(last 90d) | Rising vibration means bearing wear. The single best failure feature |
| `hours_since_last_service` | as-of snapshot | Overdue maintenance |
| `pct_failed_starts_90d` | 90 days | Starting friction |
| `machine_age_days` | install → snapshot | New machines fail differently (bathtub curve) |

Two patterns cover most of tabular feature engineering:

- **Windowed aggregates.** Count/sum/mean of events over 7/30/90-day lookbacks. Multiple windows of the same sensor are fine; [selection](#selecting-features) keeps the useful ones.
- **Ratios and trends.** `short_window / long_window` turns two absolute numbers into a direction. `vibration_trend = 1.6` means "vibration up 60% vs this machine's own baseline", comparable across a small pump and a big press. Raw vibration never is: every machine has its own normal. Guard the denominator: new installs have no 90-day history (impute 1.0 = "no trend", plus the missing-indicator from [preprocessing](./data-preprocessing.md#missing-values)).

The discipline that makes this safe is structural, same as preprocessing:

```python
def build_features(events: pd.DataFrame, snapshot_date: pd.Timestamp) -> pd.DataFrame:
    past = events[events.event_time < snapshot_date]   # the leakage guard
    last_30d = past[past.event_time >= snapshot_date - pd.Timedelta(days=30)]
    ...
```

One function, `snapshot_date` as an argument, the filter on line one. Training data is this function run at many historical snapshots. Production scoring is the same function run at today's date. Same code path, which is how you avoid [training/serving skew](./inference-and-production.md#trainingserving-skew) later.

---

## Selecting Features

> **Remember one thing:** selection is mostly deletion. The goal is the smallest feature set that keeps the score, not the biggest set that raises it.

We built ~60 candidate features (5 sensor and event types × several windows × ratios). Three tiers of selection effort:

**1. Filter (cheap, first pass).** Correlation or mutual information of each feature vs the target, plus feature-vs-feature correlation to spot redundant pairs (`vibration_last_30d` vs `vibration_last_28d`: 0.99 correlated, keep one). Kills the dead weight fast. Don't over-trust it: a feature can be useless alone and vital in interaction. Rising vibration only predicts failure when temperature is also climbing, and that interaction is the tree models' bread and butter.

**2. Embedded (use what training gives you).** For linear models, [Lasso](../supervised/regression.md#lasso-regression-l1) does selection as it fits. For trees, ignore the built-in `feature_importances_` (biased toward high-cardinality features, [same warning](../supervised/classification.md#random-forest-classifier) as the supervised pages) and use **permutation importance**: shuffle one column, measure the score drop. No drop means the model wasn't using it.

```python
from sklearn.inspection import permutation_importance

r = permutation_importance(model, X_val, y_val, n_repeats=10, scoring="average_precision")
dead = X_val.columns[r.importances_mean < 0.001]   # candidates for deletion
```

**3. Wrapper (expensive, rarely worth it).** Recursive feature elimination refits the model N times. Skip it unless the feature count is small and the model is cheap.

**On the plant data:** 60 candidates → 18 survivors, PR-AUC 0.45 vs 0.46 with all 60. That 0.01 buys: fewer sensor pipelines to monitor for drift, faster scoring, and a feature list that fits on one slide. Take that trade every time.

---

## Explaining the Model

> **Remember one thing:** SHAP tells you what the model used, not what causes failures. Attribution is not causation.

The maintenance planners won't act on a score they can't interrogate. Two levels:

- **Global.** Permutation importance or mean |SHAP| ranking: "the model's top signals are vibration trend, error alarms, hours since service." This is the sanity check with the reliability engineers. If the top feature makes no engineering sense, suspect leakage before genius.
- **Per-machine.** SHAP decomposes one prediction: *this* machine is 0.83 because vibration is up 60% (+0.31) and it threw two overheat alarms in 14 days (+0.22), despite a recent service (−0.12). That sentence is what the planner reads before dispatching a technician.

```python
import shap

explainer = shap.TreeExplainer(model)          # fast path for tree ensembles
shap_values = explainer.shap_values(X_scored)  # one row of attributions per machine
```

The caveat to say out loud in every readout: SHAP attributes the model's behaviour. "Alarms drive failures" is a statement about the model, not the machine. Maybe failing machines throw alarms; maybe well-monitored machines do and the model uses it as a monitoring-coverage proxy. Deciding whether preventive maintenance actually works needs an experiment, not an attribution: see [measuring live impact](./inference-and-production.md#delayed-labels-and-proving-impact).

---

## The Five Rules

1. **Every window ends at the snapshot date.** The filter lives in one shared function, used by training and serving alike.
2. **Ratios beat raw magnitudes.** A trend against the machine's own baseline is comparable across the fleet; a raw sensor value isn't.
3. **Selection is deletion.** At equal score, the smaller feature set wins. Every survivor is a permanent liability.
4. **Permutation, not impurity.** The built-in importances flatter high-cardinality features.
5. **Surprising top features are leaks.** Sanity-check the ranking with a reliability engineer before celebrating it.

When a feature decision feels ambiguous, one of these five settles it.
