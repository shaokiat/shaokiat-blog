"""Figures: container-images-1, resources-and-scaling-1 (termination), capstone-deploy-an-app-1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fig import *

# ---- Figure 15-1: Dockerfile -> image -> node -> container ----
P = [outer(10, 10, 960, 330, "FROM DOCKERFILE TO RUNNING CONTAINER")]
P += [box(30, 70, 150, 70, "Dockerfile", "FROM · COPY · USER", sub2="ENTRYPOINT · CMD", kind="grey"),
      arrow((182, 105), (228, 105)), label(205, 97, "build")]
# image: a stack of layers plus config
P.append(boundary(230, 44, 210, 196, "IMAGE myapp:0.1"))
for i, (t, k) in enumerate([("config: USER 10001", "amber"), ("layer: app.py", "blue"),
                            ("layer: /venv", "blue"), ("layer: python:3.13-slim", "blue")]):
    P.append(box(246, 70 + i * 40, 178, 32, t, kind=k))
P.append(label(335, 232, "read-only layers + run config", size=10.5))
# two paths to the node
P += [box(520, 60, 170, 60, "Registry", "docker.io · ghcr.io"),
      arrow((442, 90), (518, 90)), label(480, 82, "push"),
      arrow((442, 200), (706, 200)), label(574, 192, "kind load docker-image", halo="#f6f8fa"),
      label(574, 216, "copies straight into the node", size=10.5)]
P.append(boundary(708, 44, 246, 280, "NODE"))
P += [box(726, 70, 210, 56, "kubelet", "reads imagePullPolicy", kind="amber"),
      box(726, 170, 210, 56, "containerd", "the node's image store"),
      pod(756, 256, 150, 52, "container", "ENTRYPOINT + CMD", "green", tag="RUNS"),
      arrow((831, 128), (831, 168)), label(840, 152, "pull if needed", "start"),
      arrow((831, 228), (831, 254)), label(840, 245, "start", "start"),
      label(614, 150, "pulled by containerd", "start", halo="#f6f8fa"), arrow((605, 122), (605, 176), (724, 190), dashed=True)]
P.append(label(30, 300, "Always: pull on every start.", "start", color="#713f12"))
P.append(label(30, 318, "IfNotPresent: use the node's copy. Never: node copy or fail.", "start", color="#713f12"))
save("container-images-1", 980, 350,
     "An image built from a Dockerfile is a stack of read-only layers plus run config. It reaches the node either through a registry pull, which the kubelet triggers according to imagePullPolicy, or by kind load, which copies it straight into containerd. The kubelet then starts the container with the image's ENTRYPOINT and CMD", P)

# ---- Figure 16-1: Pod termination sequence ----
def band(x1, x2, y, kind, text, dashed=False):
    f, s, t = KIND[kind]
    d = ' stroke-dasharray="4 3"' if dashed else ""
    fill = "none" if dashed else f
    return (f'<rect x="{x1}" y="{y-14}" width="{x2-x1}" height="28" rx="6" fill="{fill}" stroke="{s}" stroke-width="1.2"{d}/>'
            + (f'<text x="{(x1+x2)/2:g}" y="{y+4}" text-anchor="middle" font-size="10.5" font-weight="600" fill="{t if not dashed else MUTED}">{e(text)}</text>' if text else ""))
X0, SEC = 300, 21          # x of t=0, pixels per second
def t(s): return X0 + s * SEC
P = [outer(10, 10, 960, 330, "DELETING ONE POD · TIME →  (preStop 5s · grace period 30s)")]
lanes = [(80, "Service endpoints", "kube-proxy, Ingress update"),
         (150, "preStop hook", "kubelet runs it first"),
         (220, "App process", "PID 1 in the container"),
         (290, "Grace period", "terminationGracePeriodSeconds")]
for y, a, b in lanes:
    P += [label(30, y - 2, a, "start", size=13, color="#1e3a4f", weight="700"), label(30, y + 14, b, "start")]
P += [band(t(-3), t(0), 80, "green", "serving"), band(t(0), t(2), 80, "amber", "race"),
      band(t(2), t(30), 80, "grey", "removed: no new traffic")]
P += [band(t(0), t(5), 150, "amber", "sleep 5"), band(t(5), t(30), 150, "grey", "", dashed=True)]
P += [band(t(-3), t(5), 220, "green", "serving requests"), band(t(5), t(12), 220, "green", "drain, exit 0"),
      band(t(12), t(30), 220, "grey", "gone", dashed=True)]
P += [band(t(0), t(30), 290, "blue", "30s budget covers preStop + drain"), ]
for s, txt, col in [(0, "delete", "#1e3a4f"), (5, "SIGTERM", "#713f12"), (30, "SIGKILL if still running", "#713f12")]:
    P.append(f'<line x1="{t(s)}" y1="52" x2="{t(s)}" y2="310" stroke="{"#d97706" if s else "#3a6f9a"}" stroke-width="1.2" stroke-dasharray="4 3"/>')
    P.append(label(t(s), 48, txt, "end" if s == 30 else "middle", color=col, weight="600"))
P.append(label(t(1), 108, "traffic still arrives", color="#713f12", size=10.5))
save("scheduling-1", 980, 340,
     "Timeline of deleting a Pod: at time zero the Pod is removed from Service endpoints while the kubelet runs a 5 second preStop sleep; for about two seconds traffic still arrives because proxies have not updated; after preStop the kubelet sends SIGTERM, the app drains and exits; if it were still running at the end of the 30 second grace period it would get SIGKILL", P)

# ---- Figure S6-1: capstone architecture ----
P = [outer(10, 10, 960, 400, "KIND CLUSTER ckad")]
P += [box(30, 60, 140, 60, "Laptop", "curl myapp.localhost", kind="grey"),
      arrow((172, 90), (218, 90)), label(195, 82, ":80")]
P.append(boundary(220, 44, 170, 92, "NS ingress-nginx"))
P.append(box(236, 70, 138, 52, "ingress-nginx", "controller", kind="amber"))
P.append(boundary(410, 44, 550, 350, "NAMESPACE capstone"))
P += [box(428, 70, 130, 52, "Ingress myapp", "host myapp.localhost", kind="amber"),
      arrow((376, 96), (426, 96)),
      box(600, 70, 130, 52, "Service myapp", "80 → http (8080)", kind="amber"),
      arrow((560, 96), (598, 96)),
      box(790, 70, 150, 52, "HPA myapp", "2–5 replicas @ 50% CPU"),
      box(790, 170, 150, 52, "Deployment myapp", "maxUnavailable 0"),
      arrow((865, 124), (865, 168)), label(874, 150, "scales", "start")]
for i, x in enumerate([430, 560, 690]):
    P.append(pod(x, 250, 118, 64, "myapp:0.2", "ready · UID 10001", "green"))
P += [arrow((665, 124), (665, 170), (489, 170), (489, 248)), arrow((665, 170), (619, 170), (619, 248)),
      arrow((665, 170), (749, 170), (749, 248)), label(540, 162, "Ready endpoints", halo="#f6f8fa"),
      arrow((865, 224), (865, 282), (810, 282), dashed=True), label(874, 256, "owns", "start"),
      box(430, 336, 150, 44, "ConfigMap", "GREETING", kind="grey"),
      box(640, 336, 150, 44, "Secret", "API_KEY", kind="grey"),
      arrow((505, 334), (505, 316), dashed=True), arrow((715, 334), (715, 316), dashed=True),
      label(514, 328, "envFrom", "start", size=10), label(724, 328, "secretKeyRef", "start", size=10)]
P.append(label(30, 190, "kind load docker-image", "start", size=11, color="#1e3a4f", weight="600"))
P.append(label(30, 206, "puts myapp:0.x on the node", "start"))
P.append(label(30, 240, "Load generator Pod", "start", size=11, color="#1e3a4f", weight="600"))
P.append(label(30, 256, "wget loop → Service myapp", "start"))
save("capstone-deploy-an-app-1", 980, 420,
     "Capstone architecture: curl on the laptop reaches ingress-nginx on port 80, which routes host myapp.localhost through Ingress myapp to Service myapp and on to Ready myapp Pods. An HPA scales the Deployment between 2 and 5 replicas; each Pod reads GREETING from a ConfigMap and API_KEY from a Secret", P)
