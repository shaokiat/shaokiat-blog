"""Figures for docs/data-science/ml-lifecycle/: lifecycle-1 (L0-1), lifecycle-2 (L0-2), data-preprocessing-1 (L2-1),
inference-and-production-1 (L5-1).

L0-1: amber is framing, blue the other stages. L0-2: blue is the feature window, green a known label, grey an unknown one.

L2-1: blue is the running machine, grey is the stopped machine, green is the correct feature window, amber is the leaking one.
L5-1: blue is a component, amber is the shared code and artifact, grey is the divergent path."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ckad-doc/scripts"))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/data-science")
H = "#f6f8fa"

# ---- L2-1 the leakage bug: a query-time window crosses the snapshot date ----
# 30 days = 170 px. Snapshot 1 May, breakdown 12 May, dashboard query run 10 Jun.
SNAP, BREAK, QUERY = 470, 532, 697
dash = lambda x, y1, y2, c: raw(f'<line x1="{x}" y1="{y1}" x2="{x}" y2="{y2}" stroke="{c}" stroke-width="1.5" stroke-dasharray="5 4"/>')
P = [outer(10, 10, 880, 290, "ONE FAILED MACHINE"),
     arrow((200, 50), (860, 50)), label(860, 40, "time", anchor="end"),
     dash(SNAP, 40, 268, "#3a6f9a"), label(SNAP, 284, "snapshot · 1 May", halo=H, weight=600),
     dash(BREAK, 40, 120, "#94a3b8"), label(BREAK + 4, 40, "breakdown · 12 May", anchor="start", halo=H),
     dash(QUERY, 140, 268, "#d97706"), label(QUERY + 6, 284, "query run · 10 Jun", anchor="start", halo=H),
     label(40, 95, "Machine", anchor="start", weight=600, color="#1e3a4f"),
     box(200, 74, BREAK - 200, 36, "running", None, "blue"),
     box(BREAK, 74, QUERY - BREAK, 36, "stopped · vibration 0", None, "grey"),
     label(40, 165, "Correct feature", anchor="start", weight=600, color="#1e3a4f"),
     box(SNAP - 170, 144, 170, 36, "30 days to snapshot", None, "green"),
     label(40, 235, "Dashboard feature", anchor="start", weight=600, color="#1e3a4f"),
     box(QUERY - 170, 214, 170, 36, "30 days to query run", None, "amber")]
fig.save("data-preprocessing-1", 900, 310, "Timeline for one failed machine. The correct feature window covers the 30 days before the 1 May snapshot. The dashboard window covers the 30 days before the query ran on 10 June, which is almost entirely after the 12 May breakdown, when vibration was zero", P)

# ---- L5-1 training/serving skew vs one code path ----
P = [outer(10, 10, 880, 170, "SKEW · TWO CODE PATHS")]
P += [box(40, 50, 170, 50, "Historian", "cleaned, deduplicated", "blue"),
      box(260, 50, 190, 50, "Training features", "notebook code", "blue"),
      box(40, 116, 170, 50, "Raw telemetry", "duplicates on retry", "grey"),
      box(260, 116, 190, 50, "Serving features", "reimplemented", "grey"),
      box(520, 82, 150, 50, "Model", "Pipeline artifact", "blue"),
      box(720, 82, 150, 50, "Scores", "AUC −5 pts, no error", "grey"),
      arrow((212, 75), (258, 75)), arrow((212, 141), (258, 141)),
      arrow((452, 75), (486, 75), (486, 100), (518, 100)),
      arrow((452, 141), (486, 141), (486, 114), (518, 114)),
      arrow((672, 107), (718, 107))]
P += [outer(10, 200, 880, 170, "ONE CODE PATH"),
      box(40, 240, 170, 50, "Training job", "historical snapshots", "blue"),
      box(40, 306, 170, 50, "Monthly batch job", "snapshot = today", "blue"),
      box(260, 266, 190, 56, "build_features", "(events, snapshot_date)", "amber"),
      box(520, 266, 150, 56, "Pipeline", "one serialized artifact", "amber"),
      box(720, 266, 150, 56, "Scores", "match training", "green"),
      arrow((212, 265), (236, 265), (236, 286), (258, 286)),
      arrow((212, 331), (236, 331), (236, 302), (258, 302)),
      arrow((452, 294), (518, 294)), arrow((672, 294), (718, 294))]
fig.save("inference-and-production-1", 900, 380, "Top: training features come from the cleaned historian and serving features are reimplemented on raw telemetry, so the model gets different inputs and loses 5 AUC points with no error. Bottom: the training job and the monthly batch job call the same build_features function and the same serialized Pipeline", P)

# ---- L0-1 the lifecycle loop ----
STAGES = [("Frame", "decision + label"), ("Explore", "EDA decision log"), ("Preprocess", "leak-free pipeline"),
          ("Features", "build, then delete"), ("Train", "honest validation"), ("Deploy", "monitor + prove")]
P = [outer(10, 10, 880, 170, "ML PROJECT LIFECYCLE")]
for i, (t, s) in enumerate(STAGES):
    x = 30 + i * 143
    P.append(box(x, 46, 124, 58, t, s, "amber" if i == 0 else "blue"))
    if i:
        P.append(arrow((x - 19, 75), (x - 2, 75)))
P += [arrow((30 + 5 * 143 + 62, 106), (30 + 5 * 143 + 62, 146), (30 + 143 + 62, 146), (30 + 143 + 62, 106), dashed=True),
      label(450, 141, "drift or decay → back to explore, retrain", halo=H)]
fig.save("lifecycle-1", 900, 190, "Six stages in a row: frame, explore, preprocess, features, train, deploy. A dashed arrow loops from deploy back to explore for drift and retraining", P)

# ---- L0-2 snapshot dates build the training set ----
X0, OBS, PRED, STEP = 150, 216, 72, 74   # 2.4 px per day: 90-day observation, 30-day prediction, monthly step
P = [outer(10, 10, 880, 300, "ONE ROW PER MACHINE PER SNAPSHOT")]
rows = [("Snapshot 1 Jan", 0, "green", "breakdown or not"), ("Snapshot 1 Feb", 1, "green", "breakdown or not"),
        ("Snapshot 1 Mar", 2, "green", "breakdown or not"), ("Scoring · today", 5, "grey", "unknown yet")]
for r, (name, k, kind, sub) in enumerate(rows):
    y, s = 48 + r * 58, X0 + OBS + k * STEP
    P += [label(30, y + 25, name, anchor="start", weight=600, color="#1e3a4f"),
          box(s - OBS, y, OBS, 38, "features", "90 days of events", "blue"),
          box(s, y, PRED, 38, "label", None, kind),
          raw(f'<line x1="{s}" y1="{y - 6}" x2="{s}" y2="{y + 44}" stroke="#d97706" stroke-width="2"/>')]
P += [label(450, 290, "amber line = snapshot date · features only from before it, label only from the 30 days after", halo=H)]
fig.save("lifecycle-2", 900, 320, "Four rows. Three historical snapshots, one month apart, each with a 90-day feature window before the snapshot date and a 30-day label window after it. A fourth row scores today: features from the last 90 days, label not yet known", P)
