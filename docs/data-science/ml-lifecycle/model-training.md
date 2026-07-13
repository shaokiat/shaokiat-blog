---
sidebar_position: 4
---

# Model Training & Evaluation

By this point the hard work is done. The data is clean, the features are honest, and picking a model is a solved problem (see the [classification cheatsheet](../supervised/classification.md#cheatsheet)). What's left is discipline: validate the way production will look, search hyperparameters without fooling yourself, and touch the test set exactly once.

---

## Cheatsheet

| Decision | Default | Avoid | #1 failure mode |
|---|---|---|---|
| **First model** | Rule-based baseline, then logistic regression | Starting with the fanciest model | No baseline → no idea if 0.84 is good |
| **Validation split** | Time-based for anything temporal; stratified k-fold otherwise | Random k-fold on temporal data | Validating on the past, predicting the future |
| **Hyperparameter search** | Random search or Optuna, ~50 trials | Exhaustive grid search | Burning compute on a 6-D grid |
| **Search target** | CV score inside the training window | Tuning against the test set | Test set becomes a training signal |
| **Experiment tracking** | Log params + data hash + metrics per run | Notebook memory | "Which run was the good one?" |
| **Final evaluation** | Held-out test set, touched once, sliced by segment | Re-running until the number looks good | Silent failure on the machines that matter |

---

## Baseline First

> **Remember one thing:** a model score means nothing until you know what a dumb strategy scores.

Before training anything, score the two free baselines on the failure problem:

1. **The maintenance rule.** "Flag machines with an active temperature alarm or over 5,000 hours since last service": PR-AUC ≈ 0.24. This is what the model must beat by enough to justify its existence.
2. **Logistic regression on the final features.** PR-AUC 0.31, two minutes of work.

Now the tuned XGBoost's 0.46 has meaning: roughly double the maintenance rule, +50% over linear. Without those anchors, "0.46" is a number in a vacuum. And if the fancy model hadn't cleared the rule by much, the right ship decision would have been the CMMS query.

---

## Choosing the Validation Split

> **Remember one thing:** the validation split must simulate how the model will be used. For failure prediction, that means predicting the future, not a random 20%.

The mechanics of k-fold live in the [supervised intro](../supervised/index.md#cross-validation). This page is about choosing, because on this problem the obvious choice is wrong.

Training data is built from monthly snapshots (Jan–Jun). **Random stratified k-fold** shuffles all six months together, so the model trains on May machines and validates on February ones. It gets to "predict" the past with knowledge of the future: seasonal load patterns, the March line upgrade, the aging of the fleet. Production never gets that luxury.

**Worked example — the wrong split inflates AUC:**

| Validation scheme | Validation AUC | Production AUC (next month) |
|---|---|---|
| Random stratified 5-fold across all months | 0.87 | 0.79 |
| Train Jan–Apr → validate May → test Jun | 0.82 | 0.81 |

The random split reports 0.87 and delivers 0.79: a number you gave the plant manager and then missed. The time-based split reports 0.82 and delivers 0.81. **The lower validation number is the better validation.** Its job is to be honest, not flattering.

```python
# Time-based split: no sklearn splitter needed — filter on snapshot date
train = df[df.snapshot_date <  "2026-05-01"]
val   = df[df.snapshot_date == "2026-05-01"]
test  = df[df.snapshot_date == "2026-06-01"]   # touch once, at the very end
```

Random stratified k-fold remains correct when rows are genuinely exchangeable, with no time structure. That's why the supervised pages use it. Deciding which regime you're in is the actual skill.

---

## Hyperparameter Search

> **Remember one thing:** random search beats grid search at equal budget. 50 smart trials beat 500 exhaustive ones.

Opinions, in order:

- **Never full grid search.** A 5-values × 6-params grid is 15,625 fits, almost all spent on parameters that don't matter. Random search covers the same space better at any fixed budget because important parameters get 50 distinct values instead of 5.
- **Optuna (Bayesian) when fits are expensive.** It spends later trials near earlier winners; ~50 trials typically lands within noise of a 10× larger random search.
- **Search inside the training window only.** Tune on Jan–Apr/May from the split above. The Jun test set is not an input to any tuning decision. The moment it is, it stops measuring generalisation.
- **Know when to stop.** Tuning moved the failure XGBoost from PR-AUC 0.42 → 0.46 and plateaued ~trial 40. The next 0.04 lives in the features, not the hyperparameters. When the search flatlines, go back a page.

```python
import optuna

def objective(trial):
    params = {
        "max_depth": trial.suggest_int("max_depth", 3, 8),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.1, log=True),
        "subsample": trial.suggest_float("subsample", 0.6, 1.0),
    }
    model = xgb.XGBClassifier(**params, n_estimators=2000, early_stopping_rounds=50,
                              scale_pos_weight=9700/300, eval_metric="aucpr")
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    return model.best_score

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)
```

**Track every run.** MLflow, W&B, or a CSV. The tool matters less than what you log per run:

| Log | Why |
|---|---|
| Params + code version | Reproduce the winner |
| Training-data hash / snapshot range | "Did the data change or did the model?" |
| Validation metrics (all of them, sliced) | Compare runs honestly |
| The model artifact | The thing you actually deploy |

---

## Evaluate and Sign Off

> **Remember one thing:** one aggregate metric can hide a broken model. Slice it before you ship it.

Metric definitions and the threshold-as-business-decision worked example live on the [classification page](../supervised/classification.md#evaluation-metrics); this is the pre-ship discipline on top:

**Slice the metric.** Our failure model: overall PR-AUC 0.46, but on the CNC spindles PR-AUC 0.21. The model is guessing on the plant's most expensive machines (only 40 spindle failures to learn from) and the aggregate hid it. Decide explicitly: ship with a documented carve-out ("planners handle spindles on the old schedule"), or fix it. Don't discover it in production.

**Read the errors.** Pull 20 high-confidence false positives and false negatives and look at them. Ours showed a cluster of "false" positives that broke down on day 31–35, just outside the label window. The model was right early; the label definition was the disagreement. That's a framing conversation, not a modelling bug.

**Touch the test set once.** The Jun holdout gets scored one time, after all decisions are frozen. Score it, report it, done. Re-running against it after each tweak quietly turns it into a second validation set, and its number into fiction.

**Sign-off is a business conversation:** expected downtime hours prevented at the chosen threshold and inspection budget, known weak slices, and the [monitoring plan](./inference-and-production.md). Not an AUC in an email.

---

## The Five Rules

1. **No baseline, no meaning.** Score the dumb strategy first; the model must beat it by enough to justify existing.
2. **Validate the way production predicts.** Temporal problem, temporal split. The lower honest number beats the higher flattering one.
3. **Random beats grid.** 50 smart trials, inside the training window only. When the search flatlines, go back to the features.
4. **Log every run.** Params, data hash, sliced metrics, artifact. Future-you is the customer.
5. **Slice, read errors, then touch the test set once.** In that order, and the last one only once.

When a training decision feels ambiguous, one of these five settles it.
