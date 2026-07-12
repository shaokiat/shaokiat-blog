---
sidebar_position: 5
---

# Inference & Production

Your model is a liability the moment it ships. Data drifts, pipelines skew, labels arrive late, and nobody will tell you it's broken. The metrics just quietly rot. This page covers the decisions that keep a model alive; the serving implementation (FastAPI, workers, endpoints) lives in [ML Engineering](../../ml-engineering/index.md).

---

## Cheatsheet

| Decision | Default | Avoid | #1 failure mode |
|---|---|---|---|
| **Batch vs online** | Batch, unless the decision is made mid-request | Building an API because it feels more "real" | Paying online-serving complexity for a monthly list |
| **Serialization** | Persist the whole `Pipeline`, pin versions | Pickling across library versions | `joblib.load` fails — or worse, silently misbehaves |
| **Feature computation** | Same code path for training and serving | Reimplementing features in the serving layer | Training/serving skew |
| **Monitoring** | Score distribution + feature drift + volume, from day one | Waiting for labels to notice problems | 30 blind days |
| **Retraining** | Trigger on measured drift/decay | Retraining on a calendar because it feels safe | Automated retraining on leaked/broken data |
| **Proving impact** | Holdout group + A/B on the intervention | Claiming the model "saved" every flagged customer | Confusing prediction with causation |

---

## Batch vs Online Inference

> **Remember one thing:** the decision's latency sets the serving mode. Not the model, and not ambition.

| | Batch | Online (API) |
|---|---|---|
| **Prediction needed** | On a schedule | Mid-request, per event |
| **Latency** | Hours are fine | Milliseconds matter |
| **Infrastructure** | A scheduled job + a table | Service, scaling, uptime, on-call |
| **Failure mode** | Job fails → rerun it | Service down → product feature down |
| **Churn-type examples** | Monthly retention list, credit review | Fraud-at-checkout, dynamic pricing, live recommendations |

Our churn model is the easy call: the retention team works the list monthly, so a **monthly batch job** scoring all active customers into a table is the whole architecture. No API, no uptime SLO, no scaling question. A surprising fraction of "we need a model API" requests are actually batch problems wearing ambition.

If the decision genuinely is per-request (fraud at checkout), you're building a service. That's the hand-off to [ML Engineering's model serving page](../../ml-engineering/ml-integration/model-serving.md): lifespan loading, batch endpoints, worker state.

---

## Serialization: the .pkl File Will Bite You

> **Remember one thing:** persist the entire Pipeline, model plus preprocessing, and pin the library versions that wrote it.

```python
import joblib
joblib.dump(model, "churn_model_2026-07.joblib")   # the WHOLE Pipeline from preprocessing.md
```

The rules that make that one line safe:

- **Serialize the `Pipeline`, not the classifier.** If you save only the XGBoost step, the serving side must reimplement imputation, scaling, and encoding: instant [skew](#training-serving-skew).
- **Pickles are not portable across versions.** A model saved under scikit-learn 1.3 and loaded under 1.5 may crash. Or worse, load and predict differently with no error. Pin exact versions in the serving image and record them next to the artifact.
- **Version the artifact** (`churn_model_2026-07.joblib`, data range, code commit, validation score). "Which model is in prod?" must have a one-line answer.
- Smoke-test at load: score 100 known rows, assert outputs match the values saved at training time. Three lines that catch an entire class of silent corruption. (This is the counterpart to the startup loading in [ML Engineering's serving page](../../ml-engineering/ml-integration/model-serving.md).)

---

## Training/Serving Skew

Skew = the features at inference time are computed *differently* than they were at training time. The model is fine; its inputs are subtly wrong; the metrics decay and nothing errors.

Classic churn version: training features came from the analytics warehouse, with cleaned and deduplicated events. The serving job reads the raw production table, where events are duplicated on retry. Every serving-side `usage_trend` is inflated. AUC drops 5 points and no dashboard turns red.

Defenses, in order of strength:

1. **One code path.** The same `build_features(events, snapshot_date)` function from the [feature page](./feature-engineering.md#creating-features) runs in both training and the batch job. This is the single strongest argument for that structure.
2. **One artifact.** The serialized Pipeline carries preprocessing with it (above).
3. **Distribution checks.** Compare served feature distributions against training distributions (below). Skew shows up as day-one "drift".

---

## Monitoring and Drift

> **Remember one thing:** you won't know true performance for 30 days. Monitor the inputs and scores, which you can see today.

Churn labels arrive 30 days late by definition. Waiting for AUC to alert you means a full month of blind damage. Monitor what's observable immediately:

| Monitor | Catches | Example alert |
|---|---|---|
| **Score distribution** | Almost everything, crudely | Mean churn score jumped 0.08 → 0.19 overnight |
| **Feature distributions vs training** (PSI/KS per feature) | Covariate drift, skew, upstream breakage | `days_since_last_login` suddenly 40% nulls |
| **Volume & nulls** | Pipeline failures | Scored 6k customers, expected 10k |
| **Rolling label metrics** (as labels mature) | Real performance decay | May cohort PR-AUC 0.44 → 0.37 |

The drift narrative on our data: marketing launches a discounted annual plan and thousands of monthly customers convert. `billing_cycle` and `tenure` distributions shift (**covariate drift**), and the discount changes churn behaviour itself (**concept drift**: same features now mean different outcomes). Feature-drift alerts fire in week one; the label-metric confirmation lands a month later. Both monitors earn their keep. One is fast, the other is true.

**Retraining triggers.** Retrain on evidence, not faith: sustained drift on important features, matured-label metrics below the agreed floor, or a known world change like that pricing launch. Calendar retraining (say, quarterly) is an acceptable backstop. But automated retraining without validation gates is how a leakage bug gets promoted to production with a fresh timestamp. Every retrain goes through the same [validation and sign-off](./model-training.md#evaluate-and-sign-off) as the first train.

---

## Delayed Labels and Proving Impact

Two traps at the very end of the lifecycle:

**The feedback loop eats your labels.** The retention team calls the customers the model flags, so some flagged customers stay *because of the intervention*. Naively those look like false positives, and a model retrained on that data learns "high-risk profile → didn't churn". Your own success poisons the training signal.

**Prediction isn't impact.** "We flagged 120 churners and 80 stayed" does not mean the model saved 80 customers — most might have stayed anyway.

Both have the same answer: a **control group**. Hold out a random slice of high-scoring customers who get no intervention. That gives you clean labels for retraining, and the causal number for the business: flagged-and-called churn at 22% vs flagged-and-held-out at 31% means the program (model plus offer) saves 9 points, and at $200 per save you can price the whole project. That's the number that gets the next ML project funded. An AUC never is.

For the GCP-native version of this stage (Vertex AI pipelines, model registry, monitoring), see the [Vertex AI reference](../../google-professional-cloud-architect/reference/vertex-ai-genai.md).

---

## The Five Rules

1. **Batch by default.** An API only if the decision happens mid-request.
2. **Ship the Pipeline, pin the versions.** One artifact carries the preprocessing; a smoke test proves it loaded intact.
3. **One code path for features.** Training and serving call the same function, or skew is a matter of time.
4. **Monitor inputs and scores.** Labels come 30 days late; distributions tell you today.
5. **Hold out a control group from day one.** It keeps labels clean and makes impact provable. Prediction isn't impact.

When a production decision feels ambiguous, one of these five settles it.
