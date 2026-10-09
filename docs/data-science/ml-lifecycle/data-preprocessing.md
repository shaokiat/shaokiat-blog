---
title: Data Preprocessing
sidebar_label: Data Preprocessing
sidebar_position: 2
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Data Preprocessing

> Docs: [Preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html) · [Imputation](https://scikit-learn.org/stable/modules/impute.html) · [Pipelines and ColumnTransformer](https://scikit-learn.org/stable/modules/compose.html) · [Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html)

## Overview

Preprocessing turns the [EDA decision log](./eda.md#the-deliverable-a-decision-log) into fixes: missing values, outliers, skew, scaling and encoding. The techniques are simple. The discipline is the hard part, because every step is a chance to leak the future into training data. On the machine-failure problem, one leaked column scored validation AUC 0.99 and production 0.65.

<ThemedImage
  alt="A dashboard feature computed over the 30 days before the query ran covers the days after the machine broke down, when vibration was zero"
  sources={{
    light: useBaseUrl('/img/data-science/fig-data-preprocessing-1-light.svg'),
    dark: useBaseUrl('/img/data-science/fig-data-preprocessing-1-dark.svg'),
  }}
/>

*Figure L2-1: The same "last 30 days" feature, computed two ways. Green is the correct window, ending at the snapshot. Amber is the dashboard's window, ending when the query ran. Grey is the machine after breakdown.*

## Key concepts

### Decisions at a glance

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

### The raw material

The machine feature matrix as it arrives from the plant historian and the ERP. Every column has a problem, and each section below fixes one.

| Column | Type | What's wrong |
|---|---|---|
| `load_cycles_30d` | numeric | Spans 0 to 2.1M. Median 3,400, 24/7 lines 60× that |
| `oil_analysis_score` | numeric | Missing for 11% of rows: every machine installed under 90 days ago |
| `vibration_rms_30d` | numeric | Missing for 0.3%: a March sensor-gateway outage, random |
| `machine_age_days` | numeric | Three rows are negative (ERP install-date bug) |
| `machine_type` | categorical, 3 values | Nothing. The only innocent column |
| `machine_model` | categorical, 400 values | 180 models have under 10 units in the fleet |
| `avg_vibration_last_30d` | numeric | Scores AUC 0.99. That's the problem |

### The leakage bug that scores 0.99

Every feature uses only data from before the [snapshot date](./index.md#the-snapshot-date). The label comes only from after it. `avg_vibration_last_30d` broke that rule.

The column came from an old dashboard query that computed "last 30 days" at query time. For broken-down machines that window runs past the breakdown, where vibration is zero (Figure L2-1). The model learned "quiet machine means failed". That is the label, restated. Production scores running machines, so the signal doesn't exist there.

| Symptom | Seen here |
|---|---|
| One feature with dominant importance | `avg_vibration_last_30d` far ahead of the rest |
| Validation score too good for the problem | AUC 0.99 on a problem where engineers can't call failures |
| Collapse after launch | Production AUC 0.65 one month later |

The fix is structural, not a reminder. One feature-building function takes `snapshot_date` and filters `event_time < snapshot_date` on every table. Dashboard queries, historian views and "convenient existing columns" are the usual carriers, because none were built with a [snapshot date](../glossary.md#snapshot-date) in mind. Rebuild a suspect feature from raw events through that function and watch the score drop to something honest.

### Missing values

Why a value is missing matters more than what you fill it with. Diagnose the mechanism first: compare the failure rate with the value missing vs present.

| Mechanism | Meaning | Plant example | So what |
|---|---|---|---|
| **MCAR** | Missing completely at random | The March gateway outage | Anything works. Impute and move on |
| **MAR** | Explained by other observed columns | `oil_analysis_score` missing = machine under 90 days old | Impute, keep the indicator |
| **MNAR** | Depends on the unobserved value itself | Operators skip logging readings on machines they think are fine | The gap *is* the signal. Indicator mandatory |

Machines missing `oil_analysis_score` fail at 8% vs 2.7%. That gap is the infant-mortality end of the bathtub curve. Impute-and-forget erases it.

| Strategy | Use when | Result on the plant data |
|---|---|---|
| Drop rows | Almost never | ❌ Deletes exactly the new installs failing at 8%, and the same gaps still arrive at inference |
| Median / mode impute ([`SimpleImputer`](https://scikit-learn.org/stable/modules/generated/sklearn.impute.SimpleImputer.html)) | Default | ⚠️ Works, but loses the "new install" signal |
| Impute + indicator (`add_indicator=True`) | The gap has meaning (MAR/MNAR) | ✅ `oil_analysis_missing` lands in the top 10 features |
| KNN or iterative (MICE) impute | Small data, correlated features | ➖ Buys nothing once the indicator exists. Trees barely care about the filled value |
| Own "missing" category | Categoricals, always | ✅ |

### Outliers

Extreme is not wrong. The tail is often the equipment the plant cares about most.

| Detection method | How | Verdict |
|---|---|---|
| **IQR rule** | Flag outside Q1 − 1.5·IQR to Q3 + 1.5·IQR | Solid default, univariate |
| **Z-score** | Flag beyond 3 standard deviations | Self-defeating: outliers inflate the σ used to find them |
| **Robust z (MAD)** | Same idea, median and MAD instead of mean and σ | Use this over plain z |
| **Isolation Forest / LOF** | Model-based, multivariate | Finds weird *combinations*, like high load with zero vibration (a dead sensor). See [Anomaly Detection](../landscape.md#anomaly-detection) |

Detection is the easy half. The decision depends on whether the value is possible and which model consumes it.

| Value | Model | Action | Result |
|---|---|---|---|
| Impossible (negative `machine_age_days`) | Any | Fix at the source table | ✅ ERP install-date bug corrected |
| Real tail (24/7 lines in `load_cycles_30d`) | Trees, boosting | Leave it alone | ✅ Splits compare ranks, not magnitudes |
| Real tail | Linear, SVM, KNN, MLP | Log transform, winsorise at 1st/99th percentile, or `RobustScaler` | ✅ Keeps the row, bounds its leverage |
| Real tail | Any | Delete past 3σ | ❌ Deletes the highest-throughput machines, the reason the project exists |

Blind 3σ removal fails twice on imbalanced data. Skewed features put honest rows past 3σ, and the minority class is unusual by definition. It quietly deletes the failing 3% you're trying to predict.

### Skew and scaling

Transforms fix the shape of one feature. Scalers fix the units across features. Trees need neither.

| Transform | Use when | Tool |
|---|---|---|
| **log(x+1)** | Right-skewed counts and hours | `np.log1p` in a [`FunctionTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.FunctionTransformer.html) |
| **Box-Cox / Yeo-Johnson** | Let the data pick the power. Yeo-Johnson handles zero and negatives | [`PowerTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PowerTransformer.html) |
| **Quantile → normal** | Tails that defeat log; only rank matters | [`QuantileTransformer`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.QuantileTransformer.html) |

| Scaler | Mechanism | Use when |
|---|---|---|
| [`StandardScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) | Subtract mean, divide by σ | Default |
| [`RobustScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) | Subtract median, divide by IQR | You kept your outliers |
| [`MinMaxScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html) | Squash to 0–1 | Bounded inputs wanted. One outlier crushes the rest into a corner |

Linear models, SVM, KNN and MLP need scaling (marked per model on the [supervised pages](../supervised/index.md)). Trees and boosting don't. That's why scaling belongs in the model's [pipeline](#the-pipeline-pattern), not baked into "the data".

On the plant data: `log1p` on load cycles, then `RobustScaler` across the numeric block, for the logistic baseline only. The log transform alone is worth 4 AUC points to the linear model. XGBoost skips both and scores the same.

### Encoding categoricals

Cardinality picks the encoder. [Target encoding](../glossary.md#target-encoding) leaks by default unless it's out-of-fold.

| Encoder | Use when | Plant example | Result |
|---|---|---|---|
| [**One-hot**](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html) | Up to ~15 unordered categories | `machine_type` → 3 columns | ✅ |
| One-hot | Hundreds of categories | `machine_model` → 400 columns | ❌ 400 near-empty columns; 180 models have under 10 units |
| [**Ordinal**](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OrdinalEncoder.html) | A true order exists | `size_class` S < M < L | ✅ |
| Ordinal | No order exists | `machine_model` | ❌ Invents a ranking |
| [**Target encoding**](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.TargetEncoder.html), out-of-fold | Hundreds of categories | `machine_model` → mean failure rate of its units | ✅ One dense column that captures "this model is a lemon" |
| Target encoding on all rows | — | A model with one failed unit encodes as 1.0 | ❌ The label, laundered through a feature |

sklearn's `TargetEncoder` (1.3+) encodes out-of-fold on `fit_transform` and smooths low-count categories toward the global mean. Set `handle_unknown="ignore"` on one-hot encoders. Production will send a machine model that didn't exist at training time.

### The pipeline pattern

Every step above learns something from data: the median, the scaler quantiles, the encoding table. Each must be learned from training data only, inside every CV fold (the [rule from the supervised intro](../supervised/index.md#cross-validation)). A `Pipeline` with a `ColumnTransformer` makes that structural instead of manual.

| Column group | Steps, in order |
|---|---|
| Numeric (`load_cycles_30d`, `machine_age_days`, `oil_analysis_score`) | `SimpleImputer(strategy="median", add_indicator=True)` → `log1p` → `RobustScaler` |
| Low-cardinality (`machine_type`, `duty_cycle`) | `OneHotEncoder(handle_unknown="ignore")` |
| High-cardinality (`machine_model`) | `TargetEncoder` |
| Model | `LogisticRegression(class_weight="balanced")` |

Cross-validating the whole pipeline refits every step inside each fold. The same object is what gets [serialized for production](./inference-and-production.md#serialization), so nobody reimplements the preprocessing in serving code. That reimplementation is where [training/serving skew](./inference-and-production.md#trainingserving-skew) starts.

## Gotchas

- **Imputing or scaling before the split.** Validation rows contribute to the statistics. Fit every step inside the pipeline, inside the fold.
- **Trusting a convenient existing column.** Dashboard and historian columns ignore the snapshot date. Rebuild features from raw events through the snapshot-filtered function.
- **Dropping rows with missing values.** It deletes a segment, and the same gaps arrive at inference anyway. Impute and keep an indicator.
- **Target encoding on the full dataset.** Each row's encoding contains its own label. Use out-of-fold encoding.
- **One-hot without `handle_unknown="ignore"`.** The first new machine model in production crashes the batch job.

## Scenario questions

**Q1 ★★ Validation AUC was 0.99. One month in production it's 0.65. What happened?**

<details>
<summary>Model answer</summary>

- **Clarify:** is 0.99 plausible for this problem? Can the maintenance engineers predict failures that well?
- **Observe:** feature importance shows `avg_vibration_last_30d` far ahead of everything else. Its lineage is a dashboard query computed at query time.
- **Hypothesise:** the feature window crosses the snapshot date and sees post-breakdown zeros. Less likely: a real shift after launch, which would not explain 0.99.
- **Fix:** rebuild the feature from raw sensor events, filtered to before the snapshot date, and retrain.
- **Prevent:** one feature-building function with `snapshot_date` as an argument, used for every feature. The trade-off is giving up quick reuse of existing dashboard columns.

</details>

**Q2 ★★ A teammate removes every row beyond 3σ before training. Is that OK?**

<details>
<summary>Model answer</summary>

- **Clarify:** which columns, and which model consumes them?
- **Observe:** the rows removed are mostly 24/7 production lines in `load_cycles_30d`, and they're over-represented among failures.
- **Hypothesise:** the "outliers" are real, and the most valuable machines in the plant.
- **Fix:** keep the rows. Log-transform or winsorise for the linear baseline; do nothing for XGBoost. Fix only impossible values at the source.
- **Prevent:** an outlier is treated only after it's classified as an error or as real. The trade-off is slower cleaning.

</details>

**Q3 ★★ How would you encode `machine_model`, which has 400 values?**

<details>
<summary>Model answer</summary>

- **Clarify:** how many units per model, and will new models appear in production?
- **Observe:** 180 of the 400 models have under 10 units.
- **Hypothesise:** one-hot gives 400 sparse columns. Ordinal invents an order. Plain target encoding leaks each row's own label.
- **Fix:** out-of-fold target encoding with smoothing, inside the pipeline.
- **Prevent:** an unknown-category rule for models first seen in production. The trade-off is a less interpretable column.

</details>

**Q4 ★★★ The scaler was fit on all the data before the split. The CV score looks fine. Does it matter?**

<details>
<summary>Model answer</summary>

- **Clarify:** which other steps were fit outside the folds?
- **Observe:** refit inside a pipeline and compare. For the scaler alone the difference is usually small. For target encoding or imputation with indicators it can be large.
- **Hypothesise:** the scaler is a minor leak. The real risk is the habit, because the next fitted step leaks more.
- **Fix:** move every fitted step into one `Pipeline` and cross-validate the whole object.
- **Prevent:** the pipeline is also the production artifact, so training and serving can't diverge. The trade-off is less freedom to poke at intermediate data in a notebook.

</details>

## Summary

- **The snapshot date is law.** Every feature from before it, every label from after it, enforced in one function.
- **Missingness is signal.** Diagnose why, impute the value, keep the flag.
- **Extreme is not wrong.** The tail is usually your most critical equipment. Tame it, don't delete it.
- **Fit on train, always.** Anything learned is learned inside the pipeline, inside the fold.
- **Audit miracles.** An AUC that makes you smile is a leak until its lineage is traced.

---

**Next →** [Feature Engineering & Selection](./feature-engineering.md)
