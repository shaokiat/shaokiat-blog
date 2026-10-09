"""Figures for docs/data-science/ml-lifecycle/model-training.md: model-training-1 (Figure L4-1).

Blue is training data, green is validation, amber is the test set."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ckad-doc/scripts"))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/data-science")
H = "#f6f8fa"
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
X = [40 + 140 * i for i in range(6)]

# ---- L4-1 random k-fold vs time-based split ----
P = [outer(10, 10, 880, 150, "RANDOM STRATIFIED 5-FOLD · VALIDATION 0.87 → PRODUCTION 0.79")]
for x, m in zip(X, MONTHS):
    P += [box(x, 44, 120, 56, m, "train + val", "blue"), tag(x + 42, 108, "val", "green")]
P.append(label(450, 148, "every fold validates on all months, so May data helps score February", halo=H))

P.append(outer(10, 180, 880, 170, "TIME-BASED SPLIT · VALIDATION 0.82 → PRODUCTION 0.81"))
for x, m in zip(X[:4], MONTHS[:4]):
    P.append(box(x, 214, 120, 56, m, "train", "blue"))
P += [box(X[4], 214, 120, 56, "May", "validate", "green"),
      box(X[5], 214, 120, 56, "Jun", "test · once", "amber"),
      arrow((40, 296), (860, 296)),
      label(450, 314, "time", halo=H),
      label(450, 338, "each stage only sees months before it, the way production does", halo=H)]
fig.save("model-training-1", 900, 360, "Two rows of six monthly snapshots. Top: random stratified 5-fold mixes validation rows into every month, giving 0.87 validation AUC but 0.79 in production. Bottom: time-based split trains on January to April, validates on May and tests once on June, giving 0.82 validation and 0.81 in production", P)
