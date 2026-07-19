---
sidebar_position: 2
---

# Data Preprocessing

Every preprocessing step is a chance to leak the future into your training data. The techniques here are simple. The discipline is the hard part, and it's what separates a production model from a notebook model.

---

## Cheatsheet

| Problem | Default fix | Avoid | #1 failure mode |
|---|---|---|---|
| **Missing values (numeric)** | Median impute + missing-indicator column | Dropping rows | Imputing before splitting |
| **Missing values (categorical)** | "missing" as its own category | Mode imputation on high-missingness columns | Erasing the signal in the gap |
| **Outliers** | Investigate first; cap if real, fix if error | Blind 3σ removal | Deleting your most critical machines |
| **Skewed features** | Log / Yeo-Johnson transform | Raw count and hour features into linear models | One 24/7 line dominating the fit |
| **Scaling** | `StandardScaler`; `RobustScaler` if outliers | Scaling tree models (pointless) | Fitting the scaler on all data |
| **Low-cardinality categoricals** | One-hot | Ordinal encoding of unordered categories | Inventing an order that isn't there |
| **High-cardinality categoricals** | Target encoding, out-of-fold | One-hot into 1,000 columns | Target encoding without CV |
| **All of the above** | Inside a sklearn `Pipeline` | Manual fit/transform bookkeeping | Any step fit outside the pipeline |

---

## The Raw Material

The machine feature matrix as it arrives from the plant historian and the ERP. Every column has a problem, and each section below fixes one:

| Column | Type | What's wrong |
|---|---|---|
| `load_cycles_30d` | numeric | Spans 0 to 2.1M. Median 3,400, 24/7 lines 60× that |
| `oil_analysis_score` | numeric | Missing for 11% of rows: every machine installed under 90 days ago |
| `vibration_rms_30d` | numeric | Missing for 0.3%: a March sensor-gateway outage, random |
| `machine_age_days` | numeric | Three rows are negative (ERP install-date bug) |
| `machine_type` | categorical, 3 values | Nothing. The only innocent column |
| `machine_model` | categorical, 400 values | 180 models have under 10 units in the fleet |
| `avg_vibration_last_30d` | numeric | Scores AUC 0.99. That's the problem. See below |

This page assumes the [EDA stage](./eda.md) already ran: distributions plotted, missingness diagnosed, segment rates known, and every suspicious column flagged in the decision log. Preprocessing is where those findings become fixes.

---

## The Leakage Bug That Scores 0.99

That `avg_vibration_last_30d` column came from an old dashboard query. Validation AUC: **0.99**. Production, one month later: **0.65**.

The bug: the dashboard computed "last 30 days" at query time. For broken-down machines that window extends past the breakdown, and a stopped machine's vibration is zero. So the model learned "quiet machine means failed". That's not a prediction. It's the label, restated. In production, scoring running machines before they fail, the signal doesn't exist.

:::danger[The snapshot-date rule]
Every feature uses only data from before the [snapshot date](./index.md#3-what-is-the-snapshot-date). The label comes only from after it. Enforce this in code: one feature-building function that takes `snapshot_date` and filters `event_time < snapshot_date` on every table. Never rely on people remembering. Dashboard queries, historian views, and "convenient existing columns" are the usual carriers, because none of them were built with a snapshot date in mind.
:::

How to catch it: one feature with dominant importance, validation numbers too good for the problem, or a model that beats the maintenance engineers' intuition by a mile. When you see a miracle, rebuild the feature from raw sensor events with the snapshot filter and watch the AUC drop to something honest.

---

## Missing Values

> **Remember one thing:** *why* a value is missing matters more than what you fill it with.

### Diagnose the mechanism first

Three mechanisms, and the plant data has all of them:

| Mechanism | Meaning | Plant example | So what |
|---|---|---|---|
| **MCAR** | Missing completely at random | The March gateway outage | Anything works. Impute and move on |
| **MAR** | Explained by other observed columns | `oil_analysis_score` missing = machine under 90 days old | Impute, keep the indicator |
| **MNAR** | Depends on the unobserved value itself | Operators skip logging readings on machines they think are fine | The gap *is* the signal. Indicator mandatory |

The diagnostic habit: compare failure rates with the value missing vs present. Machines missing `oil_analysis_score` fail at 8% vs 2.7%. That gap is information (the infant-mortality end of the bathtub curve). Impute-and-forget erases it.

### Then pick a strategy

| Strategy | Use when | Tool |
|---|---|---|
| Drop rows | Almost never | — |
| Median / mode impute | Default | [`SimpleImputer`](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html) |
| Impute + indicator | The gap has meaning (MAR/MNAR) | `SimpleImputer(add_indicator=True)` |
| KNN impute | Small data, correlated features | [`KNNImputer`](https://scikit-learn.org/stable/modules/generated/sklearn.impute.KNNImputer.html) |
| Iterative (MICE) | Maximum fidelity, small data | [`IterativeImputer`](https://scikit-learn.org/stable/modules/generated/sklearn.impute.IterativeImputer.html) |
| Own "missing" category | Categoricals, always | explicit fill |

```python
from sklearn.impute import SimpleImputer

imputer = SimpleImputer(strategy="median", add_indicator=True)
```

**On the plant data:** median impute, indicators on. The `oil_analysis_missing` flag lands in the top 10 features. It's a cleaner "new install" signal than machine age itself. The fancy imputers buy nothing here: once the indicator exists, tree models barely care what the filled value is.

:::note[Why not drop rows?]
Dropping the 11% deletes exactly the new installs, the segment failing at 8% that the model most needs to learn. And the same gaps will arrive at inference time. A model that never saw missing values will do something undefined with them.
:::

---

## Outliers

> **Remember one thing:** extreme is not wrong. The tail is often the equipment the plant cares about most.

### Detecting

| Method | How | Verdict |
|---|---|---|
| **IQR rule** | Flag outside `[Q1 − 1.5·IQR, Q3 + 1.5·IQR]` | Solid default, univariate |
| **Z-score** | Flag `\|z\| > 3` | Self-defeating: outliers inflate the σ used to find them |
| **Robust z (MAD)** | Same idea, median/MAD instead of mean/σ | Use this over plain z |
| **Isolation Forest / LOF** | Model-based, multivariate | Finds weird *combinations*. See [Anomaly Detection](../index.md#anomaly-detection) |

Univariate rules find weird values. Multivariate methods find weird machines ("high load but zero vibration" is a dead sensor, not a healthy machine). Detection is the easy half; the decision is what to do next.

### Treating

```
Is the value physically possible?
├── No (negative machine age) → it's an error. Fix at the source
└── Yes → it's real data. Does your model care?
    ├── Trees/boosting → no. Leave it alone
    └── Linear/SVM/KNN/MLP → tame it, don't delete it:
        ├── Log transform → compresses the tail
        ├── Winsorise (cap at 1st/99th pct) → keeps the row, bounds the leverage
        └── RobustScaler → scales by median/IQR
```

**On the plant data:** the `load_cycles_30d` tail is the 24/7 production lines. Highest-throughput machines, the ones whose downtime costs the most, the reason this project exists. Deleting "outliers" here deletes the equipment that matters. Keep every row: log transform for the linear baseline, nothing for XGBoost. The negative `machine_age_days` rows are the other kind, an ERP install-date bug, fixed at the source table.

:::warning[Blind 3σ removal is a trap twice over]
Skewed features put plenty of honest rows past 3σ. And on imbalanced problems the minority class is statistically unusual by definition. Aggressive outlier removal quietly deletes the failing machines, the 3% you're trying to predict.
:::

---

## Skew and Scaling

> **Remember one thing:** transforms fix the *shape* of one feature; scalers fix the *units* across features. Trees need neither.

Two distinct operations that get conflated:

### 1. Transforms fix shape

Counts, hours, and cycle totals are right-skewed, basically always. A linear model on raw `load_cycles_30d` spends its coefficient on the 24/7 tail and learns nothing about the range where most machines live.

| Transform | Use when | Tool |
|---|---|---|
| **log(x+1)** | Right-skewed counts and hours | `np.log1p` in a [`FunctionTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.FunctionTransformer.html) |
| **Box-Cox / Yeo-Johnson** | Let the data pick the power (Yeo-Johnson handles zero and negatives) | [`PowerTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html) |
| **Quantile → normal** | Tails that defeat log; only rank matters | [`QuantileTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.QuantileTransformer.html) |

### 2. Scalers fix units

`machine_age_days` runs 0–5,000, `pct_failed_starts` runs 0–1. Any model that computes distances or penalises weights uniformly breaks on that.

| Scaler | Mechanism | Use when |
|---|---|---|
| [`StandardScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) | (x − mean)/σ | Default |
| [`RobustScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) | (x − median)/IQR | You kept your outliers |
| [`MinMaxScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html) | Squash to [0, 1] | Bounded inputs wanted. One outlier crushes the rest into a corner |

:::tip[Who needs scaling]
Linear models, SVM, KNN, MLP: always (marked per model on the [supervised pages](../supervised/index.md)). Trees and boosting: never. Splits compare ranks, not magnitudes. This is why scaling belongs in the model's [Pipeline](#the-pipeline-pattern-non-negotiable), not baked into "the data".
:::

**On the plant data:** `log1p` on load cycles, then `RobustScaler` across the numeric block (the kept 24/7 tail rules out plain standardisation), for the logistic baseline only. The log transform alone is worth 4 AUC points to the linear model. XGBoost skips both steps and scores identically either way.

---

## Encoding Categoricals

> **Remember one thing:** cardinality picks the encoder. And target encoding is leakage-by-default unless it's out-of-fold.

| Encoder | Use when | Plant example | Tool |
|---|---|---|---|
| **One-hot** | Up to ~15 unordered categories | `machine_type` → 3 columns | [`OneHotEncoder`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html) |
| **Ordinal** | A true order exists | `size_class` S < M < L | [`OrdinalEncoder`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html) |
| **Target encoding** | Hundreds of categories | `machine_model`, 400 values | [`TargetEncoder`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.TargetEncoder.html) |

One-hot on 400 machine models gives you 400 near-empty columns (180 models have under 10 units). Ordinal invents a ranking that doesn't exist. Target encoding replaces each model with its units' mean failure rate: one dense, informative column that captures "this model is a lemon".

:::danger[Target encoding is the second leak on this page]
Encode a machine model using all its units and each row's encoding contains its own label. A model with one failed unit encodes as 1.0. That's the label, laundered through a feature. Validation looks great; production doesn't. The fix is out-of-fold encoding: each row encoded from other folds only. sklearn's `TargetEncoder` does this on `fit_transform`, and smooths low-count categories toward the global mean.
:::

```python
from sklearn.preprocessing import TargetEncoder  # sklearn ≥ 1.3

encoder = TargetEncoder()  # out-of-fold + smoothing by default
```

Set `handle_unknown="ignore"` on one-hot encoders. Production will send a machine model that didn't exist at training time, and the model should shrug, not crash.

---

## The Pipeline Pattern (Non-Negotiable)

> **Remember one thing:** if a step is fit outside the Pipeline, you have a leakage bug. You just haven't measured it yet.

Every step above learns something from data: the median, the scaler quantiles, the encoding table. Each must be learned from training data only, inside every CV fold (the [rule from the supervised intro](../supervised/index.md#cross-validation)). Doing that by hand across 5 folds and a dozen columns is how bugs happen. `Pipeline` + `ColumnTransformer` makes it structural:

```python
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import (FunctionTransformer, OneHotEncoder,
                                   RobustScaler, TargetEncoder)

numeric = Pipeline([
    ("impute", SimpleImputer(strategy="median", add_indicator=True)),
    ("log",    FunctionTransformer(np.log1p, feature_names_out="one-to-one")),
    ("scale",  RobustScaler()),
])

preprocess = ColumnTransformer([
    ("num",       numeric, ["load_cycles_30d", "machine_age_days", "oil_analysis_score"]),
    ("cat_small", OneHotEncoder(handle_unknown="ignore"), ["machine_type", "duty_cycle"]),
    ("cat_large", TargetEncoder(), ["machine_model"]),
])

model = Pipeline([("prep", preprocess),
                  ("clf", LogisticRegression(class_weight="balanced"))])
model.fit(X_train, y_train)   # every statistic learned from train only
```

`cross_val_score(model, ...)` now refits everything inside each fold automatically. And this exact object is what gets [serialized for production](./inference-and-production.md#serialization-the-pkl-file-will-bite-you), so there's no "reimplement the preprocessing in the serving code" step. That step is where [training/serving skew](./inference-and-production.md#trainingserving-skew) is born.

---

## The Five Rules

The whole page compresses to five lines:

1. **The snapshot date is law.** Every feature from before it, every label from after it, enforced in code.
2. **Missingness is signal.** Diagnose why. Impute the value, keep the flag.
3. **Extreme is not wrong.** The tail is usually your most critical equipment. Tame it, don't delete it.
4. **Fit on train, always.** If it's learned, it's learned inside the Pipeline, inside the fold.
5. **Audit miracles.** An AUC that makes you smile is a leak until proven otherwise.

When a preprocessing decision feels ambiguous, one of these five settles it.
