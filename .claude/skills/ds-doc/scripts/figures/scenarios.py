"""Figures for docs/data-science/scenarios/: predictive-maintenance-1 (S1-1).

Blue is a component, amber is the shared feature code and model artifact, green is the planner's output, grey is the held-out control group."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ckad-doc/scripts"))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/data-science")
H = "#f6f8fa"

P = [outer(10, 10, 880, 340, "PREDICTIVE MAINTENANCE · MONTHLY BATCH"),
     boundary(26, 40, 170, 230, "SOURCES"),
     box(40, 66, 142, 50, "Historian", "sensor readings", "blue"),
     box(40, 132, 142, 50, "CMMS", "work orders, failures", "blue"),
     box(40, 198, 142, 50, "ERP", "install dates, models", "blue"),
     box(236, 116, 160, 62, "build_features", "events before snapshot", "amber"),
     box(436, 116, 150, 62, "Pipeline", "preprocess + XGBoost", "amber"),
     box(626, 116, 120, 62, "Scores", "10,000 machines", "blue"),
     box(626, 214, 120, 50, "Monitoring", "drift, volume, PR-AUC", "blue"),
     box(780, 72, 96, 50, "Inspect", "top-ranked", "green"),
     box(780, 160, 96, 50, "Control", "old schedule", "grey"),
     arrow((184, 91), (210, 91), (210, 137), (234, 137)),
     arrow((184, 157), (234, 157)),
     arrow((184, 223), (210, 223), (210, 167), (234, 167)),
     arrow((398, 147), (434, 147)), arrow((588, 147), (624, 147)),
     arrow((748, 135), (764, 135), (764, 97), (778, 97)),
     arrow((748, 160), (764, 160), (764, 185), (778, 185)),
     arrow((686, 180), (686, 212)),
     path("M 828 212 L 828 310 L 300 310 L 300 180", dashed=True),
     label(560, 304, "30 days later: outcomes become labels · control group gives clean labels and the impact number", halo=H)]
fig.save("predictive-maintenance-1", 900, 360, "Historian, CMMS and ERP feed a snapshot-filtered feature function and a serialized pipeline that scores 10,000 machines monthly. Top-ranked machines go to inspection, a random slice of flagged machines stays on the old schedule as a control group, monitoring watches scores and drift, and outcomes return as labels 30 days later", P)
