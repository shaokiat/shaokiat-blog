"""Figures for docs/data-science/supervised/: supervised-1 (M0-2).

M0-2: blue is a tree, grey is what passes between trees, amber is the combining step."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ckad-doc/scripts"))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/data-science")
H = "#f6f8fa"

# ---- M0-1 bagging vs boosting ----
P = [outer(10, 10, 880, 230, "BAGGING · RANDOM FOREST · TREES IN PARALLEL"),
     box(30, 104, 130, 50, "Training data", None, "blue")]
for i in range(3):
    y = 44 + i * 62
    P += [box(220, y, 150, 50, "Bootstrap " + str(i + 1), "random rows + features", "grey"),
          box(420, y, 150, 50, "Deep tree " + str(i + 1), "low bias, high variance", "blue"),
          arrow((162, 129), (190, 129), (190, y + 25), (218, y + 25)),
          arrow((372, y + 25), (418, y + 25)),
          arrow((572, y + 25), (610, y + 25), (610, 129), (638, 129))]
P += [box(640, 100, 220, 58, "Average or vote", "cancels variance", "amber")]

P += [outer(10, 260, 880, 150, "BOOSTING · XGBOOST · TREES IN SEQUENCE")]
xs = [30, 200, 370, 540]
names = [("Shallow tree 1", "rough fit"), ("Shallow tree 2", "fits tree 1's errors"), ("Shallow tree 3", "fits what's left"), ("… tree N", "until early stop")]
for i, (t, s) in enumerate(names):
    P.append(box(xs[i], 300, 140, 54, t, s, "blue"))
    if i:
        P += [arrow((xs[i] - 28, 327), (xs[i] - 2, 327)), label(xs[i] - 15, 376, "residuals", halo=H)]
P += [box(700, 298, 160, 58, "Weighted sum", "cancels bias", "amber"),
      arrow((682, 327), (698, 327)),
      label(450, 398, "early stopping picks how many trees · each one adds learning_rate × its fit", halo=H)]
fig.save("supervised-1", 900, 420, "Top: bagging trains deep trees in parallel on bootstrap samples and averages them, cancelling variance. Bottom: boosting trains shallow trees in sequence, each fitting the residuals of the ensemble so far, and sums them, cancelling bias", P)
