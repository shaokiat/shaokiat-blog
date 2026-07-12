---
sidebar_position: 3
---

# Feature Engineering & Selection

Features are where domain knowledge enters the model. Gradient boosting with mediocre features loses to logistic regression with great ones. These are the highest-leverage hours in the project.

The second half of the job is deletion. Most features you create won't earn their keep. Every one you keep is a column you must compute correctly, monitor for drift, and explain to the retention team, forever.

---

## Cheatsheet

| Task | Default technique | Avoid | #1 failure mode |
|---|---|---|---|
| **Behavioural features** | Rolling windows relative to snapshot date | Calendar-period aggregates ("this month") | Window extending past the snapshot date → leakage |
| **Trends** | Ratio of short window to long window | Fitting per-customer regressions | Divide-by-zero on new customers |
| **Quick relevance screen** | Correlation / mutual information vs target | Treating the screen as final selection | Killing features that only work in interactions |
| **Selection with a model** | Lasso (linear) or permutation importance (trees) | Impurity-based `feature_importances_` | High-cardinality bias in impurity importance |
| **Explaining predictions** | SHAP (global + per-customer) | Reading causality into attributions | "Feature X causes churn" from a correlation |

---

## Creating Features

> **Remember one thing:** every feature is an aggregation over a window that ends at the snapshot date. No exceptions, no "just this once".

The raw churn data isn't a feature matrix. It's event tables: usage logs, support tickets, payments. Features are aggregations of those events over windows **counting back from the snapshot date** (defined on the [lifecycle intro](./index.md#3-what-is-the-snapshot-date)):

| Feature | Window | Why it works |
|---|---|---|
| `tickets_last_30d` | 30 days | Recent frustration |
| `usage_trend` | mean(last 30d) / mean(last 90d) | Decline signal — the single best churn feature |
| `days_since_last_login` | as-of snapshot | Disengagement |
| `pct_failed_payments_90d` | 90 days | Billing friction |
| `tenure_days` | signup → snapshot | New customers churn differently |

Two patterns cover most of tabular feature engineering:

- **Windowed aggregates.** Count/sum/mean of events over 7/30/90-day lookbacks. Multiple windows of the same event are fine; [selection](#selecting-features) keeps the useful ones.
- **Ratios and trends.** `short_window / long_window` turns two absolute numbers into a direction. `usage_trend = 0.4` means "usage down 60% vs their own baseline", comparable across a basic user and an enterprise account. Raw usage never is. Guard the denominator: new customers have no 90-day history (impute 1.0 = "no trend", plus the missing-indicator from [preprocessing](./data-preprocessing.md#missing-values)).

The discipline that makes this safe is structural, same as preprocessing:

```python
def build_features(events: pd.DataFrame, snapshot_date: pd.Timestamp) -> pd.DataFrame:
    past = events[events.event_time < snapshot_date]   # the leakage guard
    last_30d = past[past.event_time >= snapshot_date - pd.Timedelta(days=30)]
    ...
```

One function, `snapshot_date` as an argument, the filter on line one. Training data is this function run at many historical snapshots. Production scoring is the same function run at today's date. Same code path, which is how you avoid [training/serving skew](./inference-and-production.md#training-serving-skew) later.

---

## Selecting Features

> **Remember one thing:** selection is mostly deletion. The goal is the smallest feature set that keeps the score, not the biggest set that raises it.

We built ~60 candidate features (5 event types × several windows × ratios). Three tiers of selection effort:

**1. Filter (cheap, first pass).** Correlation or mutual information of each feature vs the target, plus feature-vs-feature correlation to spot redundant pairs (`usage_last_30d` vs `usage_last_28d`: 0.99 correlated, keep one). Kills the dead weight fast. Don't over-trust it: a feature can be useless alone and vital in interaction. Tickets only predict churn when usage is also falling, and that interaction is the tree models' bread and butter.

**2. Embedded (use what training gives you).** For linear models, [Lasso](../supervised/regression.md#lasso-regression-l1) does selection as it fits. For trees, ignore the built-in `feature_importances_` (biased toward high-cardinality features, [same warning](../supervised/classification.md#random-forest-classifier) as the supervised pages) and use **permutation importance**: shuffle one column, measure the score drop. No drop means the model wasn't using it.

```python
from sklearn.inspection import permutation_importance

r = permutation_importance(model, X_val, y_val, n_repeats=10, scoring="average_precision")
dead = X_val.columns[r.importances_mean < 0.001]   # candidates for deletion
```

**3. Wrapper (expensive, rarely worth it).** Recursive feature elimination refits the model N times. Skip it unless the feature count is small and the model is cheap.

**On the churn data:** 60 candidates → 18 survivors, PR-AUC 0.45 vs 0.46 with all 60. That 0.01 buys: fewer pipelines to monitor for drift, faster scoring, and a feature list that fits on one slide. Take that trade every time.

---

## Explaining the Model

> **Remember one thing:** SHAP tells you what the model used, not what causes churn. Attribution is not causation.

The retention team won't act on a score they can't interrogate. Two levels:

- **Global.** Permutation importance or mean |SHAP| ranking: "the model's top signals are usage trend, tickets, tenure." This is the sanity check with domain experts. If the top feature makes no business sense, suspect leakage before genius.
- **Per-customer.** SHAP decomposes one prediction: *this* customer is 0.83 because usage fell 60% (+0.31) and two tickets in 14 days (+0.22), despite three-year tenure (−0.12). That sentence is what the retention agent reads before the call.

```python
import shap

explainer = shap.TreeExplainer(model)          # fast path for tree ensembles
shap_values = explainer.shap_values(X_scored)  # one row of attributions per customer
```

The caveat to say out loud in every readout: SHAP attributes the model's behaviour. "Tickets drive churn" is a statement about the model, not the world. Maybe unhappy customers file tickets; maybe engaged ones do and the model uses it as an engagement proxy. Deciding whether the retention offer works needs an experiment, not an attribution: see [measuring live impact](./inference-and-production.md#delayed-labels-and-proving-impact).

---

## The Five Rules

1. **Every window ends at the snapshot date.** The filter lives in one shared function, used by training and serving alike.
2. **Ratios beat raw magnitudes.** A trend is comparable across customer sizes; a raw count isn't.
3. **Selection is deletion.** At equal score, the smaller feature set wins. Every survivor is a permanent liability.
4. **Permutation, not impurity.** The built-in importances flatter high-cardinality features.
5. **Surprising top features are leaks.** Sanity-check the ranking with a domain expert before celebrating it.

When a feature decision feels ambiguous, one of these five settles it.
