"""Figures: mental-model-1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fig import *
W = "#ffffff"
cols = [("kubectl", "you", "blue"), ("kube-apiserver", "stores in etcd", "amber"), ("Deployment", "controller", "blue"),
        ("ReplicaSet", "controller", "blue"), ("kube-scheduler", "picks a node", "blue"), ("kubelet", "on the node", "blue"),
        ("EndpointSlice", "controller", "blue")]
X = [75 + i * 142 for i in range(7)]
P = []
for x, (t, s, k) in zip(X, cols):
    P += [box(x - 64, 16, 128, 56, t, s, k),
          f'<line x1="{x}" y1="74" x2="{x}" y2="560" stroke="{"#d97706" if k == "amber" else "#cbd5e1"}" stroke-width="{2 if k == "amber" else 1.5}" stroke-dasharray="{"" if k == "amber" else "5 4"}"/>']
A = X[1]
def step(n, y):
    return (f'<circle cx="{A}" cy="{y}" r="11" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>'
            f'<text x="{A}" y="{y+4}" text-anchor="middle" font-size="11" font-weight="700" fill="#713f12">{n}</text>')
# 1: kubectl -> API
P += [arrow((X[0], 112), (A - 13, 112)), label((X[0] + A) / 2, 104, "apply Deployment", halo=W), step(1, 112),
      label(A + 16, 131, "validate, store spec", "start", halo=W)]
rows = [(2, 2, "new Deployment", "create ReplicaSet"), (3, 3, "new ReplicaSet", "create 3 Pods"),
        (4, 4, "unscheduled Pods", "bind Pod → node"), (5, 5, "Pod bound here", "status: Running, Ready"),
        (6, 6, "Pod Ready", "add Pod IP")]
for i, (n, c, watch, write) in enumerate(rows):
    y = 180 + i * 78
    P += [arrow((A + 13, y), (X[c] - 4, y), dashed=True, width=1.2),
          label(X[c] - 8, y - 6, "watch: " + watch, "end", halo=W),
          arrow((X[c], y + 26), (A + 13, y + 26)),
          label(A + 18, y + 20, write, "start", halo=W), step(n, y + 26)]
P += [label(X[5] + 8, 431, "starts containers via runtime", "start", size=10, halo=W, italic=True)]
save("mental-model-1", 1000, 575,
     "Sequence of a kubectl apply: the API server stores the Deployment; the Deployment controller creates a ReplicaSet; the ReplicaSet controller creates Pods; the scheduler binds them to nodes; the kubelet starts containers and reports Ready; the EndpointSlice controller adds the Pod IPs. Every arrow starts or ends at the API server", P)
