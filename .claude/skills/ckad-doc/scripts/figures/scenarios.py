"""Figures: ml-model-serving-1, nightly-retraining-pipeline-1, zero-downtime-release-1, multi-tenant-platform-1, troubleshooting-drills-1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fig import *
H = "#f6f8fa"
# ---- S1-1 ML model serving ----
P = [box(20, 180, 110, 64, "Client", "POST /predict"),
     box(20, 330, 125, 64, "Model bucket", "models/v7/"),
     outer(160, 10, 830, 420, "CLUSTER"),
     box(180, 180, 120, 64, "Ingress", "/predict"),
     box(330, 180, 130, 64, "Service", "Ready Pods only"),
     boundary(490, 40, 485, 375, "NAMESPACE · ML-SERVING"),
     box(510, 66, 200, 56, "HPA", "CPU 60% of request · 2–10"),
     box(740, 66, 215, 56, "PodDisruptionBudget", "minAvailable: 1"),
     boundary(510, 150, 445, 185, "POD × N · DEPLOYMENT, MAXUNAVAILABLE 0", fill="#f6f8fa"),
     box(530, 190, 190, 64, "init: fetch-model", "bucket → emptyDir", "amber"),
     box(760, 190, 180, 64, "model-server", "loads /models"),
     label(850, 280, "startupProbe: 10 min budget"),
     label(850, 296, "liveness: /healthz only"),
     arrow((132, 212), (178, 212)), label(155, 204, "HTTPS", halo=H),
     arrow((302, 212), (328, 212)),
     arrow((462, 212), (508, 212)),
     arrow((722, 222), (758, 222)),
     arrow((610, 124), (610, 148)), label(618, 141, "scales", "start", halo="#eef2f6"),
     arrow((847, 124), (847, 148)), label(855, 141, "limits evictions", "start", halo="#eef2f6"),
     arrow((147, 380), (625, 380), (625, 256)), label(390, 372, "download once per Pod start", halo=H)]
save("ml-model-serving-1", 1000, 440, "ML model serving: Ingress and Service route to model-server Pods; an init container downloads the model from a bucket into an emptyDir; an HPA scales the Deployment and a PodDisruptionBudget limits evictions", P)

# ---- S2-1 nightly retraining ----
P = [outer(10, 10, 980, 290, "NAMESPACE · ML-TRAINING"),
     box(30, 80, 210, 72, "CronJob retrain", "0 2 * * * · Asia/Singapore", "amber", sub2="concurrencyPolicy: Forbid"),
     box(290, 80, 190, 72, "Job retrain-29012", "backoffLimit: 2", sub2="activeDeadline: 4h"),
     boundary(530, 40, 260, 240, "POD", fill="#eef2f6"),
     box(545, 80, 230, 56, "init: fetch-data", "bucket → /data"),
     box(545, 180, 230, 64, "train", "reads /data, writes /out"),
     box(820, 180, 150, 64, "PVC", "RWO · 100Gi · Retain", "green"),
     arrow((242, 116), (288, 116)), label(265, 108, "02:00", halo=H),
     arrow((482, 116), (528, 116)), label(505, 108, "retries", halo=H),
     arrow((660, 138), (660, 178)),
     arrow((777, 212), (818, 212), both=True), label(797, 204, "mount", halo=H),
     box(820, 330, 150, 64, "Model registry", "models/v8/"),
     arrow((660, 246), (660, 362), (818, 362)), label(740, 354, "push model"),
     label(30, 326, "WHAT FORBID DOES WHEN A RUN OVERRUNS", "start", size=10, color="#52606d", weight="600"),
     arrow((30, 400), (600, 400), head=False, color="#94a3b8")]
for x, t in [(60, "Mon 02:00"), (250, "Tue 02:00"), (440, "Wed 02:00")]:
    P += [f'<line x1="{x}" y1="394" x2="{x}" y2="406" stroke="#94a3b8" stroke-width="1.5"/>', label(x, 419, t, size=10, color="#52606d")]
P += ['<rect x="60" y="336" width="230" height="24" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>', label(175, 352, "Monday's run overruns", color="#713f12", weight="600", size=10.5),
      '<rect x="250" y="366" width="120" height="24" rx="6" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/>', label(310, 382, "Tue: skipped", size=10.5, weight="600"),
      '<rect x="440" y="336" width="150" height="24" rx="6" fill="#e3f1e8" stroke="#2d7a52" stroke-width="1.2"/>', label(515, 352, "Wed runs", color="#1f5c3d", weight="600", size=10.5)]
save("nightly-retraining-pipeline-1", 1000, 430, "Nightly retraining: a CronJob creates a Job at 02:00, whose Pod fetches data, trains on a PVC and pushes the model to a registry; with concurrencyPolicy Forbid, a run that overruns causes the next scheduled run to be skipped", P)

# ---- S3-1 zero-downtime release ----
def dots(x, y, n, kind):
    f, s, _ = KIND[kind]
    return [f'<circle cx="{x + i*20}" cy="{y}" r="7" fill="{f}" stroke="{s}" stroke-width="1.5"/>' for i in range(n)]
P = [outer(10, 10, 480, 380, "BLUE/GREEN · SWITCH THE SELECTOR"),
     box(145, 50, 210, 64, "Service web", "selector: version=green", "amber"),
     box(30, 220, 200, 64, "Deployment web-blue", "v1 · idle, kept warm", "grey"),
     box(270, 220, 200, 64, "Deployment web-green", "v2 · live", "green"),
     arrow((300, 116), (370, 218)), label(345, 160, "100%", "start", color="#1f5c3d", weight="600"),
     arrow((200, 116), (130, 218), dashed=True), label(155, 160, "0%", "end", weight="600"),
     *dots(70, 310, 6, "grey"), *dots(310, 310, 6, "green"),
     label(250, 356, "Rollback: set the selector back to blue. Instant."),
     label(250, 372, "Cost: double capacity during the release."),
     outer(510, 10, 480, 380, "CANARY · SPLIT BY REPLICA COUNT"),
     box(645, 50, 210, 64, "Service web", "selector: app=web", "amber"),
     box(530, 220, 200, 64, "Deployment web-stable", "v1 · 9 replicas"),
     box(770, 220, 200, 64, "Deployment web-canary", "v2 · 1 replica", "green"),
     arrow((700, 116), (630, 218)), label(655, 160, "≈ 90%", "end", weight="600"),
     arrow((800, 116), (870, 218)), label(845, 160, "≈ 10%", "start", color="#1f5c3d", weight="600"),
     *dots(545, 310, 9, "blue"), *dots(860, 310, 1, "green"),
     label(750, 356, "Rollback: scale the canary to 0."),
     label(750, 372, "Exact percentages need Gateway API or a mesh.")]
save("zero-downtime-release-1", 1000, 400, "Two release strategies: blue/green switches a Service selector between two Deployments; canary puts both versions behind one selector and splits traffic by replica count", P)

# ---- S4-1 multi-tenant ----
P = [outer(10, 10, 980, 420, "CLUSTER"),
     boundary(330, 40, 340, 84, "NAMESPACE · INGRESS"),
     box(380, 62, 240, 48, "Ingress controller", None)]
for ox, t in [(0, "A"), (490, "B")]:
    P += [boundary(30 + ox, 160, 450, 255, f"NAMESPACE · TEAM-{t} · POD SECURITY: RESTRICTED"),
          box(50 + ox, 195, 200, 52, "RoleBinding", f"group team-{t.lower()} → edit"),
          box(270 + ox, 195, 190, 52, "ResourceQuota", "cpu 20 · memory 64Gi"),
          box(50 + ox, 260, 200, 52, "LimitRange", "default requests"),
          box(270 + ox, 260, 190, 52, "NetworkPolicy", "deny all · allow ns + ingress")]
    for i in range(3):
        P.append(pod(60 + ox + i * 125, 330, 110, 64, f"svc-{i+1}"))
P += [arrow((450, 112), (255, 158)), label(338, 128, "allowed", halo=H),
      arrow((550, 112), (745, 158)), label(662, 128, "allowed", halo=H),
      arrow((392, 362), (548, 362), dashed=True, color="#d97706", width=2, head=False),
      label(470, 352, "✕ blocked", color="#713f12", weight="600", halo="#eef2f6")]
save("multi-tenant-platform-1", 1000, 440, "Multi-tenant cluster: each team namespace has a RoleBinding, ResourceQuota, LimitRange, default-deny NetworkPolicy and restricted Pod Security; the shared ingress controller may reach both namespaces, but traffic between team namespaces is blocked", P)

# ---- S5-1 where each drill breaks ----
stages = [("Admission", "API server"), ("Scheduling", "scheduler"), ("Image pull", "kubelet + runtime"),
          ("Config", "kubelet"), ("Run", "your process"), ("Readiness", "kubelet probes"), ("Routing", "Service + proxy")]
status = [(["no Pods"], "describe rs", "1"), (["Pending"], "describe pod", "2"), (["ImagePullBackOff"], "describe pod", "3"),
          (["CreateContainer-", "ConfigError"], "describe pod", "4"), (["CrashLoopBackOff", "OOMKilled"], "logs --previous", "5, 6"),
          (["0/1 Ready"], "describe pod", "7"), (["refused /", "timeout"], "describe svc", "8")]
P = [outer(10, 10, 1030, 270, "POD LIFECYCLE · WHERE EACH DRILL BREAKS")]
for i, ((t, s_), (lines, cmd, d)) in enumerate(zip(stages, status)):
    x = 25 + i * 145
    P += [box(x, 50, 125, 60, t, s_),
          f'<line x1="{x+62.5}" y1="114" x2="{x+62.5}" y2="134" stroke="#d97706" stroke-width="1.2" stroke-dasharray="3 3"/>']
    P += [label(x + 62.5, 150 + j * 16, ln, color="#713f12", weight="600") for j, ln in enumerate(lines)]
    P += [label(x + 62.5, 204, cmd, size=11), label(x + 62.5, 240, "drill " + d, size=11, color="#52606d", weight="600")]
    if i < 6:
        P.append(arrow((x + 127, 80), (x + 143, 80)))
save("troubleshooting-drills-1", 1050, 290, "The Pod lifecycle from admission to Service routing, with the failure status each stage produces, the first command to run, and the drill that exercises it", P)
