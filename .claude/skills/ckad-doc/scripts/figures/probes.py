"""Figures: probes-and-observability-1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fig import *
P = []
def band(x1, x2, y, kind, text, dashed=False):
    f, s, t = KIND[kind]
    d = ' stroke-dasharray="4 3"' if dashed else ""
    fill = "none" if dashed else f
    return (f'<rect x="{x1}" y="{y-14}" width="{x2-x1}" height="28" rx="6" fill="{fill}" stroke="{s}" stroke-width="1.2"{d}/>'
            + (f'<text x="{(x1+x2)/2:g}" y="{y+4}" text-anchor="middle" font-size="10.5" font-weight="600" fill="{t if not dashed else MUTED}">{e(text)}</text>' if text else ""))
rows = [(90, "startupProbe", "gates the other two"), (160, "readinessProbe", "controls traffic"),
        (230, "livenessProbe", "controls restarts"), (300, "In Service endpoints?", "result of readiness")]
P.append(outer(10, 10, 960, 380, "ONE CONTAINER'S LIFE · TIME →"))
for y, t, sub in rows:
    P += [label(30, y - 2, t, "start", size=13, color="#1e3a4f", weight="700"), label(30, y + 14, sub, "start")]
P += [band(220, 400, 90, "grey", "failing, within 30 × 10s budget"), band(400, 440, 90, "green", "pass"),
      label(450, 94, "stops after first success", "start"), band(870, 950, 90, "grey", "again")]
P += [band(220, 400, 160, "grey", "not run yet", dashed=True), band(400, 560, 160, "green", "passing"),
      band(560, 660, 160, "amber", "failing"), band(660, 860, 160, "green", "passing"), band(870, 950, 160, "grey", "", dashed=True)]
P += [band(220, 400, 230, "grey", "not run yet", dashed=True), band(400, 770, 230, "green", "passing"),
      band(770, 860, 230, "amber", "3 failures"), band(870, 950, 230, "grey", "", dashed=True)]
P += [band(220, 400, 300, "grey", "no traffic"), band(400, 560, 300, "green", "receiving traffic"),
      band(560, 660, 300, "amber", "removed"), band(660, 860, 300, "green", "receiving traffic"), band(870, 950, 300, "grey", "no traffic")]
P += ['<line x1="400" y1="52" x2="400" y2="330" stroke="#3a6f9a" stroke-width="1.2" stroke-dasharray="4 3"/>',
      '<line x1="865" y1="52" x2="865" y2="330" stroke="#d97706" stroke-width="1.2" stroke-dasharray="4 3"/>',
      label(400, 48, "startup passes", color="#1e3a4f", weight="600"),
      label(865, 48, "kubelet restarts the container", "end", color="#713f12", weight="600"),
      label(610, 350, "Readiness fails → removed, not restarted", color="#713f12"),
      label(950, 350, "Liveness fails → restarted", "end", color="#713f12"),
      arrow((220, 372), (950, 372)), label(220, 366, "container starts", "start", size=10, color="#52606d")]
save("probes-and-observability-1", 980, 400,
     "Probe timeline: the startup probe fails until the app is up, then readiness and liveness begin; a readiness failure removes the Pod from Service endpoints without restarting it; three liveness failures make the kubelet restart the container", P)
