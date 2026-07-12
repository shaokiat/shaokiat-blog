---
sidebar_position: 1
---

# Exploratory Data Analysis

EDA is not tourism. Wandering through plots until something looks interesting is how notebooks grow to 200 cells with no decisions in them. EDA is hypothesis generation with a deadline: every plot should either change a decision downstream or get deleted.

Timebox it. A day of focused EDA on a new problem, half a day on a familiar one. The output is a written list of findings and decisions, not the notebook itself.

---

## Cheatsheet

| Question | Look at | You're hunting for | #1 failure mode |
|---|---|---|---|
| **Is the target sane?** | Base rate, label counts over time | Impossible labels, base-rate jumps | Modelling a broken label for two weeks |
| **What shape is each feature?** | Histograms, log-scale for money/counts | Skew, bimodality, impossible values | Trusting `df.describe()` means on skewed data |
| **Where are the gaps?** | Missingness rate and pattern per column | Structure in what's missing | Treating all gaps as random noise |
| **Who churns?** | Target rate by segment | Segments with 3× the base rate | Reporting one global rate |
| **What predicts too well?** | Feature-vs-target separation | Leaks disguised as signal | Celebrating instead of auditing |
| **Is the data stable?** | Distributions by month | Shifts, pipeline changes, regime breaks | Training across an undetected break |

---

## Start With the Target

> **Remember one thing:** ten minutes on the label beats ten hours on the features. If the target is broken, everything downstream is decoration.

Before any feature work, interrogate the label the [framing stage](./index.md#2-what-exactly-is-the-label) defined:

```python
df.churned.value_counts(normalize=True)   # base rate: 0.08
df.groupby(df.snapshot_date.dt.to_period("M")).churned.mean()  # stable ~8% per month?
```

Three checks on the churn data:

1. **Base rate: 8%.** This single number sets the metric ([PR-AUC, never accuracy](../supervised/classification.md#running-example-customer-churn)), the imbalance handling, and stakeholder expectations.
2. **Base rate by month.** Ours runs 7.6–8.5%: stable. A month at 15% means a pipeline bug or a business event, and either one changes the project.
3. **Label sanity.** We found 14 customers marked churned who had invoices *after* their churn date. Fourteen rows won't move the model. The broken join that produced them might. Trace it before modelling.

:::warning[The label is a query someone wrote]
"Churned" is not a fact of nature. It's the output of a definition and a join, written by a person, and it inherits their bugs. Auditing it first is the cheapest insurance in the whole lifecycle.
:::

---

## Distributions, One Feature at a Time

> **Remember one thing:** `df.describe()` lies on skewed data. The mean of `usage_30d` is 41,000; the median is 3,400. Plot everything.

```python
df.usage_30d.hist(bins=50)              # a wall at zero
np.log1p(df.usage_30d).hist(bins=50)    # bimodal: light users vs power users
```

What the histograms bought us on the churn data:

- **`usage_30d`** looks like a wall at zero until you log it. Then it's cleanly bimodal: light users and power users are different populations, which becomes a segment hypothesis, not just a transform decision.
- **`tenure_days`** has three negative values. Impossible, therefore a bug: logged for the [preprocessing page](./data-preprocessing.md#outliers) to fix at the source.
- **The enterprise tail** is real data, our best customers. Noted so nobody "cleans" it later.

EDA finds the shape. The *fixes* (transforms, capping, imputation) are [preprocessing decisions](./data-preprocessing.md): keep the two jobs separate, and hand findings across in writing.

---

## Missingness Has a Pattern

> **Remember one thing:** don't just count the gaps. Ask who has them.

```python
df.isna().mean().sort_values(ascending=False)   # rate per column
df.groupby(df.payment_history_score.isna()).churned.mean()  # 0.22 vs 0.07
```

Two columns are missing values on the churn data, and they are not the same problem. `days_since_last_login` is missing for 0.3% of rows scattered randomly across March: a logging outage, ignorable. `payment_history_score` is missing for 11%, and every one of those customers is under 90 days old. That's structure, and the churn-rate split (22% missing vs 7% present) says the gap itself predicts churn.

The mechanism taxonomy (MCAR/MAR/MNAR) and the imputation menu live on the [preprocessing page](./data-preprocessing.md#missing-values). EDA's job is the diagnosis: for each gappy column, *who* is missing it and *does the target differ*. Two groupbys per column, and the imputation strategy writes itself.

---

## Segments: Who Actually Churns

> **Remember one thing:** one global churn rate hides the three different businesses inside your customer base.

```python
df.groupby("billing_cycle").churned.mean()   # monthly 0.14, annual 0.03
df.groupby(pd.cut(df.tenure_days, [0, 90, 365, 3000])).churned.mean()
```

The churn data's segment table, the single most useful EDA artifact for the retention team:

| Segment | Churn rate | vs base (8%) |
|---|---|---|
| Monthly billing | 14% | 1.8× |
| Annual billing | 3% | 0.4× |
| First 90 days | 22% | 2.8× |
| Enterprise tier | 4% | 0.5× |

Each row is a hypothesis for the [feature page](./feature-engineering.md) (billing cycle and tenure will be strong features) and a slice for the [evaluation stage](./model-training.md#evaluate-and-sign-off) (the model must be checked on enterprise separately). These numbers are also your sanity anchors: when a model says a three-year annual enterprise customer is 0.9 churn risk, one of you is wrong, and it's probably the model.

---

## Relationships and the Leak Scan

> **Remember one thing:** in EDA, "wow" and "uh-oh" are the same signal. A feature that separates classes beautifully is a leak until proven otherwise.

```python
df.corr(numeric_only=True).churned.sort_values()   # quick target-correlation scan
df.groupby("churned").avg_usage_last_30d.describe() # near-perfect separation? audit it
```

Scan feature-vs-target relationships in one pass. On the churn data, most features correlate weakly with churn (|r| under 0.2), which is normal. Real signal on hard problems is diffuse. One column stood out: `avg_usage_last_30d` separated churners almost perfectly.

That column became [the AUC 0.99 leakage bug](./data-preprocessing.md#the-leakage-bug-that-scores-099). EDA is where it should have been caught: the habit is a standing **leak scan**, where any feature with suspicious separation gets its lineage traced before it's allowed near a model. Ask where the column came from, when it's computed, and whether it could know the future.

Also check feature-vs-feature correlation. The usage lags correlate at 0.9+, which previews the [Ridge/ElasticNet decision](../supervised/regression.md#ridge-regression-l2) before any model is trained.

---

## Stability Over Time

> **Remember one thing:** your training data spans months. Anything that shifted during that window will shift again after you ship.

```python
df.groupby(df.snapshot_date.dt.to_period("M")).usage_30d.median()
```

Plot key feature medians and the base rate by month. On the churn data this caught one thing worth catching: `days_since_last_login` jumps in March (the logging outage again) and a slow upward drift in usage as the product grew. Neither killed the project. Both went into the notes, because the [drift monitors](./inference-and-production.md#monitoring-and-drift) built at the production stage should watch exactly the things that already moved during training.

A regime break in the training window (a pricing change, a new product tier) is worse than drift after shipping: it means your training rows aren't all from the same world, and it's an argument for the [time-based validation split](./model-training.md#choosing-the-validation-split).

---

## The Deliverable: A Decision Log, Not a Notebook

> **Remember one thing:** nobody reads your notebook. They read your conclusions.

The 200-cell notebook is scaffolding. What survives is half a page:

| Finding | Decision | Owner page |
|---|---|---|
| Base rate 8%, stable by month | PR-AUC as metric, `scale_pos_weight` ≈ 11 | [Training](./model-training.md) |
| `usage_30d` bimodal, log-normal | `log1p` transform for linear models | [Preprocessing](./data-preprocessing.md) |
| `payment_history_score` missing = new customers, 22% churn | Impute + indicator, never drop | [Preprocessing](./data-preprocessing.md) |
| `avg_usage_last_30d` separates too well | Leak. Rebuild from raw events | [Preprocessing](./data-preprocessing.md) |
| Monthly billing 14%, first-90-days 22% | Feature hypotheses + evaluation slices | [Features](./feature-engineering.md), [Training](./model-training.md) |
| 3 negative tenures, 14 label conflicts | Fix at source before training | Data owners |

Every row is a finding tied to a decision and a home. That table is what you present, and it's the test of whether the EDA was worth the day: no decisions, no EDA.

:::tip[Practice on real data]
This series uses a fictional dataset so the numbers can teach cleanly. To run the lifecycle on real data, two Kaggle/UCI classics map directly onto these pages: [Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) for the churn narrative (note its churn rate is ~26%, far more balanced than our 8%) and the [UCI Bike Sharing Dataset](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) for the [regression page](../supervised/regression.md). Every technique in this section applies verbatim.
:::

---

## The Five Rules

1. **Target first.** Base rate, stability, label sanity. A broken label wastes everything downstream.
2. **Plot, don't describe.** Means lie on skewed data. Histograms don't.
3. **Ask who, not how many.** Missingness and churn rates by segment, never just overall.
4. **Run the leak scan.** Any feature that separates too well gets its lineage traced before it touches a model.
5. **Ship a decision log.** Half a page of finding → decision → owner. The notebook is scaffolding.

If a plot doesn't produce a row in the decision log, it was tourism.
