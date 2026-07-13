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
| **What shape is each feature?** | Histograms, log-scale for counts/hours | Skew, bimodality, impossible values | Trusting `df.describe()` means on skewed data |
| **Where are the gaps?** | Missingness rate and pattern per column | Structure in what's missing | Treating all gaps as random noise |
| **Which machines fail?** | Failure rate by segment | Segments with 3× the base rate | Reporting one global rate |
| **What predicts too well?** | Feature-vs-target separation | Leaks disguised as signal | Celebrating instead of auditing |
| **Is the data stable?** | Distributions by month | Shifts, pipeline changes, regime breaks | Training across an undetected break |

---

## Start With the Target

> **Remember one thing:** ten minutes on the label beats ten hours on the features. If the target is broken, everything downstream is decoration.

Before any feature work, interrogate the label the [framing stage](./index.md#2-what-exactly-is-the-label) defined:

```python
df.failed.value_counts(normalize=True)   # base rate: 0.03
df.groupby(df.snapshot_date.dt.to_period("M")).failed.mean()  # stable ~3% per month?
```

Three checks on the plant data:

1. **Base rate: 3%.** This single number sets the metric ([PR-AUC, never accuracy](../supervised/classification.md#running-example-machine-failure)), the imbalance handling, and stakeholder expectations.
2. **Base rate by month.** Ours runs 2.7–3.3%: stable. A month at 8% means a data bug or a real event (a heatwave, a bad parts batch), and either one changes the project.
3. **Label sanity.** We found 14 machines marked failed that logged production output *after* their breakdown date. Fourteen rows won't move the model. The broken join with the ERP that produced them might. Trace it before modelling.

:::warning[The label is a query someone wrote]
"Failed" is not a fact of nature. It's the output of a definition and a join between the CMMS and the ERP, written by a person, and it inherits their bugs. Auditing it first is the cheapest insurance in the whole lifecycle.
:::

---

## Distributions, One Feature at a Time

> **Remember one thing:** `df.describe()` lies on skewed data. The mean of `load_cycles_30d` is 41,000; the median is 3,400. Plot everything.

```python
df.load_cycles_30d.hist(bins=50)              # a wall at zero
np.log1p(df.load_cycles_30d).hist(bins=50)    # bimodal: single-shift vs 24/7 lines
```

What the histograms bought us on the plant data:

- **`load_cycles_30d`** looks like a wall at zero until you log it. Then it's cleanly bimodal: single-shift machines and 24/7 production lines are different populations, which becomes a segment hypothesis, not just a transform decision.
- **`machine_age_days`** has three negative values. Impossible, therefore a bug (an ERP install-date error): logged for the [preprocessing page](./data-preprocessing.md#outliers) to fix at the source.
- **The 24/7 tail** is real data, the plant's most critical assets. Noted so nobody "cleans" it later.

EDA finds the shape. The *fixes* (transforms, capping, imputation) are [preprocessing decisions](./data-preprocessing.md): keep the two jobs separate, and hand findings across in writing.

---

## Missingness Has a Pattern

> **Remember one thing:** don't just count the gaps. Ask which machines have them.

```python
df.isna().mean().sort_values(ascending=False)   # rate per column
df.groupby(df.oil_analysis_score.isna()).failed.mean()  # 0.08 vs 0.027
```

Two columns are missing values on the plant data, and they are not the same problem. `vibration_rms_30d` is missing for 0.3% of rows scattered randomly across March: a sensor-gateway outage, ignorable. `oil_analysis_score` is missing for 11%, and every one of those machines was installed in the last 90 days (the first oil-sample cycle hasn't run yet). That's structure, and the failure-rate split (8% missing vs 2.7% present) says the gap itself predicts failure. Reliability engineers know why: new machines fail more. That's the infant-mortality end of the bathtub curve, and the missingness flag just encoded it.

The mechanism taxonomy (MCAR/MAR/MNAR) and the imputation menu live on the [preprocessing page](./data-preprocessing.md#missing-values). EDA's job is the diagnosis: for each gappy column, *which machines* are missing it and *does the target differ*. Two groupbys per column, and the imputation strategy writes itself.

---

## Segments: Which Machines Actually Fail

> **Remember one thing:** one global failure rate hides the three different fleets inside your plant.

```python
df.groupby("duty_cycle").failed.mean()   # continuous 0.055, single-shift 0.015
df.groupby(pd.cut(df.machine_age_days, [0, 90, 2000, 5000])).failed.mean()
```

The plant data's segment table, the single most useful EDA artifact for the maintenance planners:

| Segment | Failure rate | vs base (3%) |
|---|---|---|
| Continuous (24/7) duty | 5.5% | 1.8× |
| Single shift | 1.5% | 0.5× |
| First 90 days after install | 8% | 2.7× |
| Pumps | 1.2% | 0.4× |

Each row is a hypothesis for the [feature page](./feature-engineering.md) (duty cycle and machine age will be strong features) and a slice for the [evaluation stage](./model-training.md#evaluate-and-sign-off) (the model must be checked on the CNC spindles separately). These numbers are also your sanity anchors: when a model says a freshly-serviced single-shift pump is at 0.9 failure risk, one of you is wrong, and it's probably the model.

---

## Relationships and the Leak Scan

> **Remember one thing:** in EDA, "wow" and "uh-oh" are the same signal. A feature that separates classes beautifully is a leak until proven otherwise.

```python
df.corr(numeric_only=True).failed.sort_values()   # quick target-correlation scan
df.groupby("failed").avg_vibration_last_30d.describe() # near-perfect separation? audit it
```

Scan feature-vs-target relationships in one pass. On the plant data, most features correlate weakly with failure (|r| under 0.2), which is normal. Real signal on hard problems is diffuse. One column stood out: `avg_vibration_last_30d` separated failed machines almost perfectly.

That column became [the AUC 0.99 leakage bug](./data-preprocessing.md#the-leakage-bug-that-scores-099). EDA is where it should have been caught: the habit is a standing **leak scan**, where any feature with suspicious separation gets its lineage traced before it's allowed near a model. Ask where the column came from, when it's computed, and whether it could know the future.

Also check feature-vs-feature correlation. The vibration windows correlate at 0.9+, which previews the [Ridge/ElasticNet decision](../supervised/regression.md#ridge-regression-l2) before any model is trained.

---

## Stability Over Time

> **Remember one thing:** your training data spans months. Anything that shifted during that window will shift again after you ship.

```python
df.groupby(df.snapshot_date.dt.to_period("M")).load_cycles_30d.median()
```

Plot key feature medians and the base rate by month. On the plant data this caught one thing worth catching: `vibration_rms_30d` drops in March (the gateway outage again) and a slow upward drift in load as order volume grew. Neither killed the project. Both went into the notes, because the [drift monitors](./inference-and-production.md#monitoring-and-drift) built at the production stage should watch exactly the things that already moved during training.

A regime break in the training window (a line upgrade, a new shift pattern) is worse than drift after shipping: it means your training rows aren't all from the same world, and it's an argument for the [time-based validation split](./model-training.md#choosing-the-validation-split).

---

## The Deliverable: A Decision Log, Not a Notebook

> **Remember one thing:** nobody reads your notebook. They read your conclusions.

The 200-cell notebook is scaffolding. What survives is half a page:

| Finding | Decision | Owner page |
|---|---|---|
| Base rate 3%, stable by month | PR-AUC as metric, `scale_pos_weight` ≈ 32 | [Training](./model-training.md) |
| `load_cycles_30d` bimodal, log-normal | `log1p` transform for linear models | [Preprocessing](./data-preprocessing.md) |
| `oil_analysis_score` missing = new installs, 8% failure | Impute + indicator, never drop | [Preprocessing](./data-preprocessing.md) |
| `avg_vibration_last_30d` separates too well | Leak. Rebuild from raw sensor events | [Preprocessing](./data-preprocessing.md) |
| 24/7 duty 5.5%, first-90-days 8% | Feature hypotheses + evaluation slices | [Features](./feature-engineering.md), [Training](./model-training.md) |
| 3 negative ages, 14 label conflicts | Fix at source before training | Data owners |

Every row is a finding tied to a decision and a home. That table is what you present, and it's the test of whether the EDA was worth the day: no decisions, no EDA.

:::tip[Practice on real data]
This series uses a fictional plant so the numbers can teach cleanly. To run the lifecycle on real data, two classics map directly onto these pages: the [AI4I 2020 Predictive Maintenance Dataset](https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset) (10,000 machines, ~3.4% failure rate, an almost exact match for this series) and the [UCI Bike Sharing Dataset](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset) for the [regression page](../supervised/regression.md). Every technique in this section applies verbatim.
:::

---

## The Five Rules

1. **Target first.** Base rate, stability, label sanity. A broken label wastes everything downstream.
2. **Plot, don't describe.** Means lie on skewed data. Histograms don't.
3. **Ask which machines, not how many.** Missingness and failure rates by segment, never just overall.
4. **Run the leak scan.** Any feature that separates too well gets its lineage traced before it touches a model.
5. **Ship a decision log.** Half a page of finding → decision → owner. The notebook is scaffolding.

If a plot doesn't produce a row in the decision log, it was tourism.
