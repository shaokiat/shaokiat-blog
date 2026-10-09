---
title: Predictive Maintenance
sidebar_label: Predictive Maintenance
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Scenario: Predictive Maintenance

> Builds on: [ML Project Lifecycle](../ml-lifecycle/index.md) · [EDA](../ml-lifecycle/eda.md) · [Data Preprocessing](../ml-lifecycle/data-preprocessing.md) · [Feature Engineering](../ml-lifecycle/feature-engineering.md) · [Model Training](../ml-lifecycle/model-training.md) · [Inference & Production](../ml-lifecycle/inference-and-production.md) · [Classification](../supervised/classification.md)

## Situation

A plant network runs 10,000 machines. About 300 break down without warning in any 30-day window, and each unplanned stop costs about $50,000 in lost production. Maintenance today is preventive: machines are serviced on a fixed calendar, so planners spend inspection hours on healthy machines while others fail between visits. The plant manager wants the inspection budget aimed at the machines most likely to fail next month.

| Strategy | When work happens | Failure it causes |
|---|---|---|
| **Reactive** | After a breakdown | Every failure is unplanned downtime |
| **Preventive** | On a fixed schedule | Healthy machines serviced; failures between visits missed |
| **Predictive** | When condition data says risk is high | Needs a model that's honest, monitored and proven |

## Requirements

| Requirement | Failure it prevents |
|---|---|
| A ranked monthly list sized to the inspection budget | A model nobody can act on |
| Features use only data from before the snapshot date | Validation AUC 0.99, production 0.65 (leakage) |
| Validation predicts the future, not a random 20% | Promising 0.87 and delivering 0.79 |
| Clearly beats the existing CMMS rule | Paying for a model that a query could replace |
| Explanations a planner can read per machine | Flags ignored because nobody trusts them |
| Drift monitoring from day one | 30 blind days before labels reveal decay |
| A measured impact number | "Flagged and didn't fail" claimed as savings |

## Architecture

<ThemedImage
  alt="Historian, CMMS and ERP feed a snapshot-filtered feature function and a serialized pipeline that scores 10,000 machines monthly; top-ranked machines are inspected, a control slice stays on the old schedule, monitoring watches scores and drift, and outcomes return as labels 30 days later"
  sources={{
    light: useBaseUrl('/img/data-science/fig-predictive-maintenance-1-light.svg'),
    dark: useBaseUrl('/img/data-science/fig-predictive-maintenance-1-dark.svg'),
  }}
/>

*Figure S1-1: Predictive maintenance as a monthly batch. Amber is the feature code and model artifact shared by training and scoring. Green is the planners' output. Grey is the held-out control group.*

## Techniques used

| Technique | Role here | Reference |
|---|---|---|
| Decision, label and snapshot date | Fix what's predicted, for whom, and which data is allowed | [Lifecycle](../ml-lifecycle/index.md#the-snapshot-date) |
| Label audit and leak scan | Catch a broken join and a too-good feature before modelling | [EDA](../ml-lifecycle/eda.md#relationships-and-the-leak-scan) |
| Impute + missing indicator | Keep new installs, the 8% failure segment | [Preprocessing](../ml-lifecycle/data-preprocessing.md#missing-values) |
| Out-of-fold target encoding | Encode 400 machine models without leaking labels | [Preprocessing](../ml-lifecycle/data-preprocessing.md#encoding-categoricals) |
| Windowed ratios (`vibration_trend`) | Comparable wear signal across the fleet | [Features](../ml-lifecycle/feature-engineering.md#creating-features) |
| Time-based validation split | Honest estimate on monthly snapshots | [Training](../ml-lifecycle/model-training.md#choosing-the-validation-split) |
| XGBoost with `scale_pos_weight` and early stopping | Best ranking on a 3% positive class | [Classification](../supervised/classification.md#gradient-boosting-classifiers) |
| Cost-based threshold | Turn scores into an inspection list | [Classification](../supervised/classification.md#evaluation-metrics) |
| SHAP per machine | The sentence a planner reads before dispatching | [Features](../ml-lifecycle/feature-engineering.md#explaining-the-model) |
| Drift monitors and a control group | Catch decay early; prove impact | [Production](../ml-lifecycle/inference-and-production.md#monitoring-and-drift) |

## Walkthrough

**1. Frame the decision.** A monthly ranked list for limited inspection hours. That sets batch scoring, a ranking metric (PR-AUC) and a threshold driven by cost. The label: an unplanned breakdown in the 30 days after the [snapshot date](../glossary.md#snapshot-date), planned stops excluded.

**2. Score the rule first.** The CMMS rule (temperature alarm or over 5,000 hours since service) scores [PR-AUC](../glossary.md#pr-auc) 0.24. That's the bar.

**3. Audit before modelling.** The [base rate](../glossary.md#base-rate) is 3% and stable by month. 14 machines were marked failed after producing output, a broken ERP join fixed at source. `avg_vibration_last_30d` separated failures almost perfectly; its lineage was a query-time dashboard window, so it was rebuilt from raw events.

**4. Build leak-free features.** One function takes the event tables and the snapshot date and filters to events before it. About 60 candidates (alarms, service hours, failed starts, vibration trend) were cut to 18 with [permutation importance](../glossary.md#permutation-importance), at a cost of 0.01 PR-AUC.

**5. Validate the way production predicts.**

| Step | Result |
|---|---|
| Random 5-fold across Jan–Jun | ❌ 0.87 validation, 0.79 in production |
| Train Jan–Apr, validate May, test Jun once | ✅ 0.82 validation, 0.81 in production |
| Logistic regression baseline | PR-AUC 0.31 |
| Tuned XGBoost (~50 Optuna trials, early stopping) | PR-AUC 0.46, about double the rule |

**6. Slice before signing off.** CNC spindles score only 0.21 (40 failures). They ship with a documented carve-out: planners keep spindles on the old schedule.

**7. Pick the threshold from costs.** An inspection costs $500, a breakdown $50,000. Threshold 0.25 flags 150 per 2,000 machines and catches 48 of 60 failures, against 30 at 0.5.

**8. Ship a batch job, not an API.** One serialized pipeline with pinned versions, the same feature function as training, and a smoke test on 100 known machines at load.

**9. Monitor and prove.** Score distribution, per-feature drift and volume from day one; matured PR-AUC monthly. A random slice of flagged, non-critical machines stays on the old schedule: serviced machines fail at 6%, held-out at 22%.

## How I'd explain this in an interview

> "I'd start from the decision, not the model: planners need a monthly ranked list for a fixed inspection budget, so this is a batch ranking problem scored on PR-AUC, with the threshold set by cost. The label is an unplanned breakdown in the 30 days after a snapshot date, and the snapshot date is the rule that keeps leakage out. Every feature comes from one function that only sees events before it. That rule paid off: an old dashboard column scored AUC 0.99 because its window ran past the breakdown, and rebuilding it from raw events fixed that. I validated on time, training on January to April and testing on June once, because a random split over-reported by eight points. Tuned XGBoost scored 0.46 PR-AUC against 0.24 for the existing maintenance rule. At a $500 inspection against a $50,000 breakdown, I set the threshold low and accepted lots of false alarms. In production I monitor inputs from day one, because labels take 30 days, and I hold out a control group to measure impact: 6% failures among serviced machines against 22% in the control. The trade-off I'd call out is that control group. Proving the value means deliberately not servicing some at-risk machines, so I'd restrict it to non-critical assets."

## Follow-up questions

**Q1 ★★ Why not train a real-time model on streaming sensor data instead?**

<details>
<summary>Model answer</summary>

- **Clarify:** is there a decision that needs a prediction within seconds?
- **Observe:** inspections are scheduled monthly; nobody acts on a score mid-shift.
- **Hypothesise:** real-time adds serving, uptime and on-call cost with no change to the decision.
- **Fix:** monthly batch now. A separate real-time anomaly alarm only if a per-event shutdown decision appears.
- **Prevent:** serving mode follows decision latency. The trade-off is slower reaction to a sudden fault between runs.

</details>

**Q2 ★★ A rush order puts half the fleet on double shifts. What happens to the model?**

<details>
<summary>Model answer</summary>

- **Clarify:** how long will the new regime last?
- **Observe:** load and temperature drift alerts fire in week one; matured PR-AUC drops a month later.
- **Hypothesise:** [covariate drift](../glossary.md#covariate-drift) (inputs shift) and [concept drift](../glossary.md#concept-drift) (the same readings now mean higher risk).
- **Fix:** retrain on recent snapshots once enough labels mature, through the same validation and sign-off as the first model.
- **Prevent:** drift-triggered retraining with gates, never automatic promotion. The trade-off is a weaker model for a few weeks.

</details>

**Q3 ★★★ After six months, the model's precision seems to fall. Planners say flagged machines "never fail". What's going on?**

<details>
<summary>Model answer</summary>

- **Clarify:** are flagged machines being serviced, and is the retraining data including them?
- **Observe:** flagged-and-serviced machines rarely fail; in the [control group](../glossary.md#control-group), flagged machines fail at 22%.
- **Hypothesise:** the feedback loop. Interventions prevent failures, so serviced machines look like false positives.
- **Fix:** measure precision on the control group, and retrain on control-group labels or mark serviced machines as censored.
- **Prevent:** keep the control group permanently. The trade-off is a small, continuing cost of unserviced at-risk machines.

</details>
