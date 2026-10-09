---
title: Inference & Production
sidebar_label: Inference & Production
sidebar_position: 5
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Inference & Production

> Docs: [Model persistence](https://scikit-learn.org/stable/model_persistence.html) · [MLflow Model Registry](https://mlflow.org/docs/latest/model-registry.html) · [Vertex AI Model Monitoring](https://cloud.google.com/vertex-ai/docs/model-monitoring/overview)

## Overview

A model is a liability the moment it ships. Data drifts, pipelines skew, labels arrive late, and nothing errors. The metrics quietly rot. This page owns the decisions that keep a model alive. The serving implementation (endpoints, workers) lives in [AI Engineering's model serving page](../../ai-engineering/llm-inference/model-serving.md). The failure people hit is shipping and walking away: on the plant data, a serving pipeline that read duplicated telemetry cost 5 AUC points with no alert.

<ThemedImage
  alt="Two code paths feed the model different features and lose 5 AUC points silently; one shared feature function and one serialized pipeline keep scores matching training"
  sources={{
    light: useBaseUrl('/img/data-science/fig-inference-and-production-1-light.svg'),
    dark: useBaseUrl('/img/data-science/fig-inference-and-production-1-dark.svg'),
  }}
/>

*Figure L5-1: Training/serving skew and its fix. Amber is the code and artifact shared by training and serving. Grey is the divergent serving path. Green is scores that match training.*

## Key concepts

### Decisions at a glance

| Decision | Default | Avoid | #1 failure mode |
|---|---|---|---|
| **Batch vs online** | Batch, unless the decision is made mid-request | Building an API because it feels more "real" | Paying online-serving complexity for a monthly list |
| **Serialization** | Persist the whole `Pipeline`, pin versions | Pickling across library versions | Load fails, or worse, silently misbehaves |
| **Feature computation** | Same code path for training and serving | Reimplementing features in the serving layer | Training/serving skew |
| **Monitoring** | Score distribution + feature drift + volume, from day one | Waiting for labels to notice problems | 30 blind days |
| **Retraining** | Trigger on measured drift or decay | Retraining on a calendar because it feels safe | Automated retraining on leaked or broken data |
| **Proving impact** | Holdout group on the intervention | Claiming the model "saved" every flagged machine | Confusing prediction with causation |

### Batch vs online inference

The decision's latency sets the serving mode. Not the model, and not ambition.

| | Batch | Online (API) |
|---|---|---|
| **Prediction needed** | On a schedule | Mid-request, per event |
| **Latency** | Hours are fine | Milliseconds matter |
| **Infrastructure** | A scheduled job + a table | Service, scaling, uptime, on-call |
| **Failure mode** | Job fails → rerun it | Service down → product feature down |
| **Plant-floor examples** | Monthly inspection list, spare-parts planning | Emergency shutdown on a live sensor spike, real-time quality rejection |

The failure model is the easy call. Planners build next month's inspection schedule from a list, so a monthly batch job scoring all 10,000 machines into a table is the whole architecture. Many "we need a model API" requests are batch problems. A genuinely per-event decision is a service: hand off to [model serving](../../ai-engineering/llm-inference/model-serving.md).

### Serialization

Persist the entire pipeline, model plus preprocessing, and pin the library versions that wrote it.

| Rule | Failure it prevents |
|---|---|
| **Serialize the `Pipeline`**, not the classifier (`joblib.dump` of the object from [preprocessing](./data-preprocessing.md#the-pipeline-pattern)) | Serving reimplements imputation, scaling and encoding: instant [skew](#trainingserving-skew) |
| **Pin exact library versions** in the serving image, recorded next to the artifact | A pickle from scikit-learn 1.3 loaded under 1.5 crashes, or loads and predicts differently with no error |
| **Version the artifact**: `failure_model_2026-07`, data range, code commit, validation score | "Which model is in prod?" has no one-line answer |
| **Smoke-test at load**: score 100 known machines, compare to values saved at training | Silent corruption reaching the inspection list |

### Training/serving skew

Skew means features at inference are computed differently than at training. The model is fine, its inputs are subtly wrong, and nothing errors.

The plant version (Figure L5-1): training features came from the historian, cleaned and deduplicated. The serving job read the raw telemetry stream, where readings duplicate on gateway retry. Every served `vibration_trend` was inflated, and AUC dropped 5 points with no dashboard turning red.

| Defence, strongest first | How |
|---|---|
| **One code path** | The same snapshot-filtered [feature function](./feature-engineering.md#creating-features) runs in training and the batch job |
| **One artifact** | The serialized pipeline carries preprocessing with it |
| **Distribution checks** | Served feature distributions compared to training. Skew shows up as day-one "drift" |

### Monitoring and drift

Labels take 30 days to mature, by definition of the prediction window. Waiting for AUC means a month of blind damage. Monitor what's observable today.

| Monitor | Catches | Example alert |
|---|---|---|
| **Score distribution** | Almost everything, crudely | Mean failure score jumped 0.03 → 0.09 overnight |
| **Feature distributions vs training** (PSI or KS per feature) | Covariate drift, skew, upstream breakage | `hours_since_last_service` suddenly 40% nulls |
| **Volume and nulls** | Pipeline failures | Scored 6k machines, expected 10k |
| **Rolling label metrics** (as labels mature) | Real performance decay | May cohort PR-AUC 0.44 → 0.37 |

A rush order puts half the fleet on double shifts. Load and temperature distributions shift (**covariate drift**), and heavier duty changes how machines fail (**concept drift**: the same readings now mean different outcomes). Feature-drift alerts fire in week one. The label metric confirms a month later. One monitor is fast, the other is true.

| Retraining trigger | Result |
|---|---|
| Sustained drift on important features | ✅ Evidence |
| Matured-label metrics below the agreed floor | ✅ Evidence |
| A known world change (the rush order) | ✅ Evidence |
| Calendar, e.g. quarterly | ⚠️ Acceptable backstop only |
| Automated retraining with no validation gate | ❌ Promotes a leakage bug to production with a fresh timestamp |

Every retrain goes through the same [validation and sign-off](./model-training.md#evaluate-and-sign-off) as the first.

### Delayed labels and proving impact

Two traps at the end of the lifecycle share one answer.

| Trap | What goes wrong |
|---|---|
| **The feedback loop eats your labels** | Technicians service flagged machines, so some don't fail *because of the intervention*. They look like false positives, and a retrained model learns "high-risk profile → didn't fail" |
| **Prediction isn't impact** | "We flagged 120 machines and 80 didn't fail" doesn't mean 80 breakdowns prevented. Most may have run fine anyway |

The answer is a **[control group](../glossary.md#control-group)**: a random slice of flagged, non-critical machines that stay on the old schedule. Nobody runs a safety-critical asset to failure for science.

| Group | Failure rate |
|---|---|
| Flagged and serviced | 6% |
| Flagged and held out | 22% |

The program (model plus preventive maintenance) prevents 16 points of breakdowns. At $50,000 per unplanned stop, that prices the whole project. It also gives clean labels for retraining. For the GCP-native version (pipelines, registry, monitoring), see the [Vertex AI reference](../../google-professional-cloud-architect/reference/vertex-ai-genai.md).

## Gotchas

- **Saving only the classifier.** Serving must rebuild preprocessing and drifts from training. Serialize the whole pipeline.
- **Unpinned library versions.** A version bump can change predictions with no error. Pin and record versions with the artifact.
- **Monitoring only label metrics.** They arrive 30 days late. Watch scores, feature distributions and volume from day one.
- **Retraining on flagged-and-serviced outcomes.** Interventions look like false positives. Retrain on the control group's clean labels.
- **Reporting "flagged and didn't fail" as savings.** It's not causal. Compare against the held-out group.

## Scenario questions

**Q1 ★ A stakeholder asks for a real-time API for the monthly inspection list. What do you build?**

<details>
<summary>Model answer</summary>

- **Clarify:** when is the prediction consumed, and what latency does that decision need?
- **Observe:** planners build the schedule once a month from a list.
- **Hypothesise:** the API request is about the model feeling "real", not a latency need.
- **Fix:** a monthly batch job that scores all 10,000 machines into a table.
- **Prevent:** serving mode is set by the decision's latency. The trade-off is reworking it if a per-event use case appears later.

</details>

**Q2 ★★ AUC dropped 5 points after deployment. No errors anywhere. Walk me through it.**

<details>
<summary>Model answer</summary>

- **Clarify:** did training and serving compute features with the same code and the same sources?
- **Observe:** compare served feature distributions to training. `vibration_trend` is shifted up from day one.
- **Hypothesise:** skew. Serving reads raw telemetry with duplicate readings; training read the deduplicated historian. Less likely: real drift, which wouldn't appear on day one.
- **Fix:** point the batch job at the same feature function and source as training.
- **Prevent:** one code path, one artifact, and distribution checks against training. The trade-off is coupling the batch job to training code.

</details>

**Q3 ★★ Labels take 30 days. How do you know the model is healthy in week one?**

<details>
<summary>Model answer</summary>

- **Clarify:** what's the cost of a month of bad lists?
- **Observe:** score distribution, per-feature drift (PSI or KS) against training, and scored volume and nulls.
- **Hypothesise:** most breakages (pipeline bugs, skew, upstream changes) show in inputs before they show in labels.
- **Fix:** alert on those monitors from day one; add rolling label metrics as cohorts mature.
- **Prevent:** keep both. Input monitors are fast, label metrics are true. The trade-off is some false alarms from harmless drift.

</details>

**Q4 ★★★ The plant manager asks whether the model saved money. How do you answer?**

<details>
<summary>Model answer</summary>

- **Clarify:** saved compared to what? The old maintenance schedule?
- **Observe:** flagged-and-serviced machines fail at 6%, flagged-and-held-out at 22%.
- **Hypothesise:** "flagged and didn't fail" alone overstates savings, because many would have run fine anyway.
- **Fix:** report 16 points of breakdowns prevented among flagged machines, priced at $50,000 per unplanned stop.
- **Prevent:** hold out a control group from day one, on non-critical machines only. The trade-off is deliberately not servicing some at-risk machines.

</details>

## Summary

- **Batch by default.** Build an API only if the decision happens mid-request.
- **Ship the pipeline, pin the versions.** One artifact carries preprocessing; a smoke test proves it loaded intact.
- **One code path for features.** Training and serving call the same function, or skew is a matter of time.
- **Monitor inputs and scores.** Labels come 30 days late; distributions tell you today.
- **Hold out a control group from day one.** It keeps labels clean and makes impact provable.

---

**Next →** [Supervised Learning](../supervised/index.md)
