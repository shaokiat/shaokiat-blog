---
title: Exploratory Data Analysis
sidebar_label: Exploratory Data Analysis
sidebar_position: 1
---

# Exploratory Data Analysis

> Docs: [pandas group by](https://pandas.pydata.org/docs/user_guide/groupby.html) · [Missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html) · [Visualization](https://pandas.pydata.org/docs/user_guide/visualization.html) · Real data: [AI4I 2020 Predictive Maintenance](https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset), [UCI Bike Sharing](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset)

## Overview

EDA is hypothesis generation with a deadline. Every plot either changes a decision downstream or gets deleted. Timebox it: a day on a new problem, half a day on a familiar one. The output is a half-page decision log, not the notebook. The failure people hit is tourism: a 200-cell notebook with no decisions in it, and a broken label discovered in week three.

## Key concepts

### Decisions at a glance

| Question | Look at | You're hunting for | #1 failure mode |
|---|---|---|---|
| **Is the target sane?** | Base rate, label counts over time | Impossible labels, base-rate jumps | Modelling a broken label for two weeks |
| **What shape is each feature?** | Histograms, log scale for counts and hours | Skew, bimodality, impossible values | Trusting `describe()` means on skewed data |
| **Where are the gaps?** | Missingness rate and pattern per column | Structure in what's missing | Treating all gaps as random noise |
| **Which machines fail?** | Failure rate by segment | Segments with 3× the base rate | Reporting one global rate |
| **What predicts too well?** | Feature-vs-target separation | Leaks disguised as signal | Celebrating instead of auditing |
| **Is the data stable?** | Distributions by month | Shifts, pipeline changes, regime breaks | Training across an undetected break |

### Start with the target

Ten minutes on the label beats ten hours on the features. "Failed" is not a fact of nature. It's a definition from the [framing stage](./index.md#the-label) plus a join between the CMMS and the ERP, and it inherits their bugs.

| Check | On the plant data | Decision it drives |
|---|---|---|
| **Base rate** | 3% | Metric ([PR-AUC, never accuracy](../supervised/classification.md#running-example-machine-failure)), imbalance handling, stakeholder expectations |
| **Base rate by month** | 2.7–3.3%, stable | None needed. A month at 8% would mean a data bug or a real event, and either changes the project |
| **Label sanity** | 14 machines marked failed logged output *after* their breakdown date | Trace the broken ERP join before modelling. Fourteen rows won't move the model; the join might |

### Distributions, one feature at a time

`describe()` lies on skewed data. The mean of `load_cycles_30d` is 41,000; the median is 3,400. Plot every feature, on a log scale for counts and hours.

<svg className="ml-diagram wide" viewBox="0 0 640 240" role="img" aria-label="Two histograms of load cycles: raw values pile up in one bar at zero with a long tail; on a log scale they split into two humps, single-shift machines and 24/7 lines">
  <line className="axis-line" x1="40" y1="200" x2="300" y2="200" strokeWidth="1.5" />
  <line className="axis-line" x1="40" y1="30" x2="40" y2="200" strokeWidth="1.5" />
  <line className="axis-line" x1="360" y1="200" x2="620" y2="200" strokeWidth="1.5" />
  <line className="axis-line" x1="360" y1="30" x2="360" y2="200" strokeWidth="1.5" />
  <text className="axis-label" x="170" y="20" textAnchor="middle" fontSize="12" fontFamily="sans-serif">raw load_cycles_30d</text>
  <text className="axis-label" x="490" y="20" textAnchor="middle" fontSize="12" fontFamily="sans-serif">log(1 + load_cycles_30d)</text>
  <rect className="pt-blue" x="44" y="40" width="18" height="160" />
  <rect className="pt-blue" x="64" y="182" width="18" height="18" />
  <rect className="pt-blue" x="84" y="192" width="18" height="8" />
  <rect className="pt-blue" x="104" y="195" width="18" height="5" />
  <rect className="pt-blue" x="124" y="197" width="18" height="3" />
  <rect className="pt-blue" x="144" y="198" width="18" height="2" />
  <rect className="pt-blue" x="164" y="198" width="18" height="2" />
  <rect className="pt-blue" x="184" y="199" width="18" height="1" />
  <rect className="pt-blue" x="204" y="199" width="18" height="1" />
  <rect className="pt-blue" x="224" y="199" width="18" height="1" />
  <rect className="pt-blue" x="244" y="199" width="18" height="1" />
  <rect className="pt-blue" x="264" y="199" width="18" height="1" />
  <rect className="pt-blue" x="364" y="196" width="18" height="4" />
  <rect className="pt-blue" x="384" y="190" width="18" height="10" />
  <rect className="pt-blue" x="404" y="178" width="18" height="22" />
  <rect className="pt-blue" x="424" y="155" width="18" height="45" />
  <rect className="pt-blue" x="444" y="130" width="18" height="70" />
  <rect className="pt-blue" x="464" y="138" width="18" height="62" />
  <rect className="pt-blue" x="484" y="165" width="18" height="35" />
  <rect className="pt-blue" x="504" y="185" width="18" height="15" />
  <rect className="pt-blue" x="524" y="188" width="18" height="12" />
  <rect className="pt-blue" x="544" y="175" width="18" height="25" />
  <rect className="pt-blue" x="564" y="158" width="18" height="42" />
  <rect className="pt-blue" x="584" y="170" width="18" height="30" />
  <rect className="pt-blue" x="604" y="188" width="18" height="12" />
  <text className="axis-label" x="200" y="80" textAnchor="middle" fontSize="12" fontFamily="sans-serif">median 3,400</text>
  <text className="axis-label" x="200" y="98" textAnchor="middle" fontSize="12" fontFamily="sans-serif">mean 41,000</text>
  <text className="axis-label" x="453" y="122" textAnchor="middle" fontSize="12" fontFamily="sans-serif">single-shift</text>
  <text className="axis-label" x="573" y="150" textAnchor="middle" fontSize="12" fontFamily="sans-serif">24/7 lines</text>
  <text className="axis-label" x="170" y="222" textAnchor="middle" fontSize="12" fontFamily="sans-serif">0 → 2.1M cycles</text>
  <text className="axis-label" x="490" y="222" textAnchor="middle" fontSize="12" fontFamily="sans-serif">log scale</text>
  <text className="axis-label" x="20" y="115" textAnchor="middle" fontSize="12" fontFamily="sans-serif" transform="rotate(-90,20,115)">machines</text>
</svg>

*Figure L1-1: The same column, plotted raw and on a log scale. Only the log view shows two populations.*

| Feature | What the histogram showed | Handed to |
|---|---|---|
| `load_cycles_30d` | A wall at zero, then bimodal on a log scale: single-shift vs 24/7 lines | A segment hypothesis, and a [transform decision](./data-preprocessing.md#skew-and-scaling) |
| `machine_age_days` | Three negative values. Impossible, so an ERP bug | [Outlier handling](./data-preprocessing.md#outliers): fix at source |
| 24/7 tail | Real data, the plant's most critical assets | A note so nobody "cleans" it later |

EDA finds the shape. Fixes are [preprocessing decisions](./data-preprocessing.md). Keep the two jobs separate and hand findings across in writing.

### Missingness has a pattern

Don't just count the gaps. Ask which machines have them, and whether the target differs.

| Column | Missing | Which machines | Failure rate missing vs present | Verdict |
|---|---|---|---|---|
| `vibration_rms_30d` | 0.3% | Scattered across March: a sensor-gateway outage | No difference | Random. Ignorable |
| `oil_analysis_score` | 11% | Every machine installed in the last 90 days | 8% vs 2.7% | Structure. The gap predicts failure (infant mortality on the bathtub curve) |

The mechanism taxonomy (MCAR/MAR/MNAR) and the imputation menu live on the [preprocessing page](./data-preprocessing.md#missing-values). EDA's job is the diagnosis.

### Segments: which machines actually fail

One global failure rate hides the different fleets inside the plant. The segment table is the most useful EDA artifact for the maintenance planners.

<svg className="ml-diagram" viewBox="0 0 480 220" role="img" aria-label="Failure rate by segment against the 3% base rate: first 90 days 8%, 24/7 duty 5.5%, single shift 1.5%, pumps 1.2%">
  <text className="axis-label" x="170" y="42" textAnchor="end" fontSize="12" fontFamily="sans-serif">First 90 days</text>
  <rect className="pt-orange" x="180" y="24" width="260" height="26" />
  <text className="axis-label" x="446" y="42" fontSize="12" fontFamily="sans-serif">8%</text>
  <text className="axis-label" x="170" y="84" textAnchor="end" fontSize="12" fontFamily="sans-serif">24/7 duty</text>
  <rect className="pt-orange" x="180" y="66" width="178.75" height="26" />
  <text className="axis-label" x="364.75" y="84" fontSize="12" fontFamily="sans-serif">5.5%</text>
  <text className="axis-label" x="170" y="126" textAnchor="end" fontSize="12" fontFamily="sans-serif">Single shift</text>
  <rect className="pt-blue" x="180" y="108" width="48.75" height="26" />
  <text className="axis-label" x="234.75" y="126" fontSize="12" fontFamily="sans-serif">1.5%</text>
  <text className="axis-label" x="170" y="168" textAnchor="end" fontSize="12" fontFamily="sans-serif">Pumps</text>
  <rect className="pt-blue" x="180" y="150" width="39" height="26" />
  <text className="axis-label" x="225" y="168" fontSize="12" fontFamily="sans-serif">1.2%</text>
  <line className="axis-line" x1="277.5" y1="16" x2="277.5" y2="190" strokeWidth="1.5" strokeDasharray="5,4" />
  <text className="axis-label" x="277.5" y="208" textAnchor="middle" fontSize="12" fontFamily="sans-serif">base rate 3%</text>
</svg>

*Figure L1-2: Failure rate by segment. Orange segments fail above the 3% base rate, blue below.*

Each bar is a hypothesis for the [feature page](./feature-engineering.md) and a slice for [sign-off](./model-training.md#evaluate-and-sign-off). The bars are also sanity anchors. When a model scores a freshly serviced single-shift pump at 0.9, one of you is wrong, and it's probably the model.

### Relationships and the leak scan

In EDA, "wow" and "uh-oh" are the same signal. A feature that separates classes beautifully is a leak until proven otherwise.

<svg className="ml-diagram wide" viewBox="0 0 640 240" role="img" aria-label="Two feature distributions split by outcome. Vibration trend: failed and healthy machines overlap, a real but partial signal. Average vibration last 30 days: every failed machine sits at zero, far from the healthy ones, a near-perfect split that turned out to be leakage">
  <line className="axis-line" x1="30" y1="200" x2="300" y2="200" strokeWidth="1.5" />
  <line className="axis-line" x1="30" y1="30" x2="30" y2="200" strokeWidth="1.5" />
  <line className="axis-line" x1="340" y1="200" x2="610" y2="200" strokeWidth="1.5" />
  <line className="axis-line" x1="340" y1="30" x2="340" y2="200" strokeWidth="1.5" />
  <text className="axis-label" x="165" y="20" textAnchor="middle" fontSize="12" fontFamily="sans-serif">vibration_trend: overlap</text>
  <text className="axis-label" x="475" y="20" textAnchor="middle" fontSize="12" fontFamily="sans-serif">avg_vibration_last_30d: clean split</text>
  <path className="pt-blue" d="M40,200 C90,200 100,50 140,50 C180,50 190,200 240,200 Z" opacity="0.55" />
  <path className="pt-orange" d="M110,200 C150,200 160,110 190,110 C220,110 230,200 270,200 Z" opacity="0.55" />
  <path className="pt-orange" d="M350,200 C356,200 358,40 364,40 C370,40 372,200 378,200 Z" opacity="0.55" />
  <path className="pt-blue" d="M430,200 C480,200 490,70 525,70 C560,70 570,200 610,200 Z" opacity="0.55" />
  <text className="class0-label" x="120" y="44" fontSize="12" fontFamily="sans-serif">ran</text>
  <text className="highlight-label" x="210" y="104" fontSize="12" fontFamily="sans-serif">failed</text>
  <text className="highlight-label" x="372" y="52" fontSize="12" fontFamily="sans-serif">failed ≈ 0</text>
  <text className="class0-label" x="515" y="62" fontSize="12" fontFamily="sans-serif">ran</text>
  <text className="axis-label" x="165" y="222" textAnchor="middle" fontSize="12" fontFamily="sans-serif">real signal: keep</text>
  <text className="axis-label" x="475" y="222" textAnchor="middle" fontSize="12" fontFamily="sans-serif">too good: trace lineage</text>
</svg>

*Figure L1-3: Each feature's distribution split by outcome. Blue is machines that ran, orange is machines that failed. Overlap is what real signal looks like; a clean split is a leak until its lineage is traced.*

| Scan | On the plant data | Verdict |
|---|---|---|
| Feature vs target | Most features correlate weakly (\|r\| under 0.2) | Normal. Real signal on hard problems is diffuse |
| Feature vs target | `avg_vibration_last_30d` separates failures almost perfectly | ❌ [The AUC 0.99 leakage bug](./data-preprocessing.md#the-leakage-bug-that-scores-099). Trace its lineage before it nears a model |
| Feature vs feature | Vibration windows correlate at 0.9+ | Previews the [Ridge/ElasticNet decision](../supervised/regression.md#ridge-regression-l2) |

For any suspicious feature, ask three things: where the column came from, when it's computed, and whether it could know the future.

### Stability over time

Anything that shifted during the training window will shift again after you ship. Plot key feature medians and the [base rate](../glossary.md#base-rate) by month.

| Finding | What it is | Where it goes |
|---|---|---|
| `vibration_rms_30d` dips in March | The gateway outage again | Drift monitor list |
| Load drifts upward | Order volume growing | [Drift monitors](./inference-and-production.md#monitoring-and-drift) |
| A regime break (line upgrade, new shift pattern) | Training rows from two different worlds | An argument for the [time-based split](./model-training.md#choosing-the-validation-split) |

### The deliverable: a decision log

Nobody reads your notebook. They read your conclusions. Every row ties a finding to a decision and an owner page.

| Finding | Decision | Owner page |
|---|---|---|
| Base rate 3%, stable by month | PR-AUC as metric, `scale_pos_weight` ≈ 32 | [Training](./model-training.md) |
| `load_cycles_30d` bimodal, log-normal | `log1p` transform for linear models | [Preprocessing](./data-preprocessing.md) |
| `oil_analysis_score` missing = new installs, 8% failure | Impute + indicator, never drop | [Preprocessing](./data-preprocessing.md) |
| `avg_vibration_last_30d` separates too well | Leak. Rebuild from raw sensor events | [Preprocessing](./data-preprocessing.md) |
| 24/7 duty 5.5%, first 90 days 8% | Feature hypotheses + evaluation slices | [Features](./feature-engineering.md), [Training](./model-training.md) |
| 3 negative ages, 14 label conflicts | Fix at source before training | Data owners |

If a plot doesn't produce a row here, it was tourism.

## Gotchas

- **Starting with features.** A broken label wastes everything downstream. Audit the target first.
- **Reading means off `describe()`.** Skewed columns hide their shape. Plot histograms on a log scale.
- **Counting missing values without grouping.** The rate hides the pattern. Split the failure rate by missing vs present.
- **Celebrating a perfect separator.** It's usually a leak. Trace the column's lineage before it reaches a model.
- **Fixing data inside EDA.** Fixes made in the notebook don't reach production. Log the finding; preprocessing owns the fix.

## Scenario questions

**Q1 ★ You have one day of EDA on a new failure dataset. What do you look at first?**

<details>
<summary>Model answer</summary>

- **Clarify:** how is "failed" defined, and which systems produce the label?
- **Observe:** the base rate (3%), the base rate by month (stable 2.7–3.3%), and any impossible labels (14 machines producing output after breakdown).
- **Hypothesise:** the label join with the ERP is the likeliest source of trouble.
- **Fix:** trace and fix the join before any feature work.
- **Prevent:** the label audit is the first row of every decision log. The trade-off is an hour less on features.

</details>

**Q2 ★★ One feature separates failed machines almost perfectly. Your manager is thrilled. What do you do?**

<details>
<summary>Model answer</summary>

- **Clarify:** where does the column come from, and when is it computed?
- **Observe:** `avg_vibration_last_30d` comes from a dashboard query, computed at query time, not at the [snapshot date](../glossary.md#snapshot-date).
- **Hypothesise:** the window crosses the breakdown, so the feature sees the outcome.
- **Fix:** mark it as a leak in the decision log; preprocessing rebuilds it from raw events.
- **Prevent:** a standing leak scan where every suspicious separator gets its lineage traced. The trade-off is telling the manager the good news isn't real.

</details>

**Q3 ★★ `oil_analysis_score` is missing for 11% of rows. A colleague proposes dropping them. Your view?**

<details>
<summary>Model answer</summary>

- **Clarify:** which machines are missing it?
- **Observe:** all of them were installed in the last 90 days. They fail at 8% vs 2.7%.
- **Hypothesise:** the gap encodes machine newness. It isn't random noise.
- **Fix:** keep the rows; preprocessing imputes and adds a missing-indicator.
- **Prevent:** every gappy column gets the missing-vs-present failure split. The trade-off is two more groupbys per column.

</details>

**Q4 ★★★ The base rate is 3% every month except April, which is 8%. How do you proceed?**

<details>
<summary>Model answer</summary>

- **Clarify:** did anything change in April: plant, data pipeline, label definition?
- **Observe:** check whether the spike sits in one site or segment, and whether the label join or a source system changed.
- **Hypothesise:** a data bug (duplicated failure records, a changed join) or a real event (heatwave, a bad parts batch).
- **Fix:** a bug gets fixed at source. A real event gets documented and the training window or validation split reconsidered.
- **Prevent:** base rate by month is a standing check, and later a production monitor. The trade-off is delaying modelling until April is explained.

</details>

## Summary

- **Target first.** Base rate, stability, label sanity. A broken label wastes everything downstream.
- **Plot, don't describe.** Means lie on skewed data. Histograms don't.
- **Ask which machines, not how many.** Missingness and failure rates by segment, never just overall.
- **Run the leak scan.** Any feature that separates too well gets its lineage traced before it touches a model.
- **Ship a decision log.** Half a page of finding → decision → owner. The notebook is scaffolding.

---

**Next →** [Data Preprocessing](./data-preprocessing.md)
