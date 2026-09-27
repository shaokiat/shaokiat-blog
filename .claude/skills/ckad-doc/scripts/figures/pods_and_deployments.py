"""Figures: pods-and-multi-container-1, deployments-and-rollouts-1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fig import *

# ---- Figure 2-1: multi-container patterns ----
P = []
def panel(x0, y0, title):
    P.append(outer(x0, y0, 455, 250, title))
    P.append(boundary(x0 + 20, y0 + 36, 415 if "INIT" in title or "SIDECAR" in title else 300, 194, "POD"))

x0, y0 = 10, 10
panel(x0, y0, "INIT CONTAINER · RUNS TO COMPLETION FIRST")
P += [box(x0+40, y0+80, 150, 64, "init: migrate", "exits 0, then gone", "amber"),
      box(x0+265, y0+80, 150, 64, "app", "starts only after init"),
      arrow((x0+192, y0+112), (x0+263, y0+112)), label(x0+227, y0+104, "exit 0"),
      label(x0+40, y0+180, "Init fails → Init:CrashLoopBackOff.", "start"),
      label(x0+40, y0+196, "The app container never starts.", "start")]

x0 = 495
panel(x0, y0, "SIDECAR · HELPER FOR THE APP'S WHOLE LIFE")
P += [box(x0+40, y0+64, 140, 56, "app", "writes log files"),
      box(x0+265, y0+64, 150, 56, "log-shipper", "tails, ships logs", "amber"),
      box(x0+150, y0+146, 150, 50, "emptyDir", "shared volume", "grey"),
      arrow((x0+110, y0+122), (x0+110, y0+171), (x0+148, y0+171)), label(x0+100, y0+150, "write", "end"),
      arrow((x0+302, y0+171), (x0+340, y0+171), (x0+340, y0+122)), label(x0+350, y0+150, "read", "start"),
      label(x0+40, y0+218, "Native form: initContainer + restartPolicy: Always", "start")]

x0, y0 = 10, 280
panel(x0, y0, "AMBASSADOR · PROXIES OUTBOUND CALLS")
P += [box(x0+36, y0+100, 110, 56, "app", "calls localhost"),
      box(x0+190, y0+100, 120, 56, "ambassador", "routes, retries, TLS", "amber"),
      box(x0+345, y0+100, 100, 56, "Redis", "sharded cluster"),
      arrow((x0+148, y0+128), (x0+188, y0+128)), label(x0+168, y0+120, ":6379", halo="#eef2f6"),
      arrow((x0+312, y0+128), (x0+343, y0+128)),
      label(x0+36, y0+196, "The proxy knows the topology.", "start")]

x0 = 495
panel(x0, y0, "ADAPTER · TRANSLATES THE APP'S OUTPUT")
P += [box(x0+36, y0+100, 110, 56, "app", "custom /status"),
      box(x0+190, y0+100, 120, 56, "exporter", "serves /metrics", "amber"),
      box(x0+345, y0+100, 100, 56, "Prometheus", "scrapes :9100"),
      arrow((x0+148, y0+128), (x0+188, y0+128)), label(x0+168, y0+120, "raw", halo="#eef2f6"),
      arrow((x0+343, y0+128), (x0+312, y0+128)),
      label(x0+36, y0+196, "Outside world sees a standard format.", "start")]
save("pods-and-multi-container-1", 960, 540,
     "Four multi-container Pod patterns: init container runs before the app; sidecar shares a volume with the app; ambassador proxies outbound calls; adapter translates the app's output", P)

# ---- Figure 5-1: Deployment -> ReplicaSet -> Pods + rolling update ----
P = [outer(10, 10, 470, 380, "OWNERSHIP · MID-ROLLOUT SNAPSHOT"),
     box(150, 44, 190, 64, "Deployment web", "replicas: 3 · image: v2", "amber"),
     box(30, 166, 200, 64, "ReplicaSet web-7d4f", "v1 · scaling down to 0", "grey"),
     box(260, 166, 200, 64, "ReplicaSet web-5c9b", "v2 · scaling up to 3"),
     arrow((200, 110), (140, 164)), arrow((290, 110), (350, 164)),
     label(245, 142, "owns", halo="#f6f8fa")]
for x, k, t in [(40, "grey", "v1"), (140, "grey", "v1"), (270, "green", "v2"), (370, "green", "v2")]:
    P.append(pod(x, 290, 80, 60, t, "Ready", k))
P += [arrow((110, 232), (82, 288)), arrow((150, 232), (178, 288)),
      arrow((340, 232), (312, 288)), arrow((380, 232), (408, 288)),
      label(245, 376, "Each Pod's ownerReference points at its ReplicaSet.")]

P.append(outer(500, 10, 450, 380, "ROLLING UPDATE · MAXSURGE 1 · MAXUNAVAILABLE 0"))
steps = [(3, 0), (3, 1), (2, 1), (2, 2), (1, 2), (1, 3), (0, 3)]
P.append('<rect x="709" y="96" width="56" height="240" rx="10" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="5 3"/>')
P.append(label(737, 88, "snapshot", color="#713f12", weight="600"))
for i, (o, n) in enumerate(steps):
    cx = 551 + i * 62
    for j in range(o + n):
        fill, st = ("#eef2f6", "#94a3b8") if j < o else ("#e3f1e8", "#2d7a52")
        P.append(f'<circle cx="{cx}" cy="{296 - j*34}" r="13" fill="{fill}" stroke="{st}" stroke-width="1.5"/>')
    P.append(label(cx, 326, f"{o} · {n}", size=11))
    P.append(label(cx, 358, f"step {i}", size=10, color="#52606d"))
P += ['<circle cx="530" cy="56" r="7" fill="#eef2f6" stroke="#94a3b8" stroke-width="1.5"/>', label(544, 60, "v1 Pod (old ReplicaSet)", "start"),
      '<circle cx="720" cy="56" r="7" fill="#e3f1e8" stroke="#2d7a52" stroke-width="1.5"/>', label(734, 60, "v2 Pod (new ReplicaSet)", "start"),
      label(725, 378, "Never fewer than 3 Ready. Never more than 4 in total.")]
save("deployments-and-rollouts-1", 960, 400,
     "A Deployment owns two ReplicaSets during a rolling update; the old one scales down as the new one scales up, one Pod at a time", P)
