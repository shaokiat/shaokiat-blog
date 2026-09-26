"""Figures: config-and-secrets-1, security-1, services-and-ingress-1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fig import *

# ---- Figure 7-1: ConfigMap/Secret injection ----
P = [outer(10, 20, 260, 340, "SOURCE OBJECTS"),
     box(30, 70, 220, 64, "ConfigMap app-config", "LOG_LEVEL=info"),
     box(30, 230, 220, 64, "Secret db-creds", "base64, not encrypted"),
     outer(340, 20, 610, 340, "POD"),
     box(400, 66, 240, 72, "Environment variables", "copied once at container start", "amber"),
     box(400, 226, 240, 72, "Mounted files", "/etc/config/LOG_LEVEL", "green", sub2="kubelet refreshes, ~1 min"),
     box(700, 66, 230, 232, "app container", "reads env and files"),
     arrow((252, 102), (290, 102), head=False), arrow((252, 262), (290, 262), head=False),
     arrow((290, 102), (290, 262), head=False),
     arrow((290, 102), (398, 102)), arrow((290, 262), (398, 262)),
     label(345, 94, "env / envFrom", halo="#f6f8fa"), label(345, 254, "volume", halo="#f6f8fa"),
     arrow((642, 102), (698, 102)), arrow((642, 262), (698, 262)),
     label(520, 162, "Edit the ConfigMap → no change", color="#713f12", weight="600"),
     label(520, 177, "until the container restarts"),
     label(520, 322, "Edit the ConfigMap → files change", color="#1f5c3d", weight="600"),
     label(520, 337, "in place (not with subPath)")]
save("config-and-secrets-1", 960, 380,
     "A ConfigMap and a Secret reach a container two ways: as environment variables copied once at start, or as mounted files the kubelet refreshes", P)

# ---- Figure 9-1: RBAC ----
P = [box(20, 70, 170, 64, "User jane", "from cert or OIDC"),
     label(105, 156, "Users are not API objects"),
     outer(220, 20, 720, 290, "NAMESPACE · TEAM-A"),
     box(245, 200, 190, 64, "ServiceAccount ci-bot", "identity for Pods"),
     box(480, 110, 180, 64, "RoleBinding", "subjects → roleRef", "amber"),
     box(730, 56, 190, 64, "Role deployer", "rules: verbs on resources"),
     box(730, 186, 190, 90, "deployments, pods", "get · list · create · update", "green", sub2="in team-a only"),
     arrow((192, 102), (478, 130)), label(335, 108, "subject", halo="#f6f8fa"),
     arrow((437, 232), (478, 158)), label(470, 212, "subject", "start", halo="#f6f8fa"),
     arrow((662, 136), (728, 94)), label(702, 142, "roleRef", halo="#f6f8fa"),
     arrow((825, 122), (825, 184)), label(833, 158, "grants", "start", halo="#f6f8fa"),
     box(480, 346, 180, 64, "ClusterRole view", "defined cluster-wide"),
     arrow((570, 176), (570, 344), dashed=True),
     label(580, 322, "roleRef may name a ClusterRole:", "start"),
     label(580, 337, "permissions still stop at team-a", "start")]
save("security-1", 960, 420,
     "RBAC: a RoleBinding connects subjects (a user or a ServiceAccount) to a Role, whose rules grant verbs on resources inside one namespace; a RoleBinding may also reference a ClusterRole, still scoped to the namespace", P)

# ---- Figure 10-1: request path ----
P = [box(20, 172, 110, 66, "Client", "shop.example.com"),
     outer(150, 10, 935, 380, "CLUSTER"),
     box(180, 172, 130, 66, "Ingress", "host + path rules"),
     box(370, 172, 150, 66, "Service api", "selector app=api", "amber"),
     box(580, 172, 150, 66, "EndpointSlice", "Ready Pod IPs :8080"),
     boundary(790, 40, 285, 330, "NAMESPACE · SHOP", fill="#eef2f6"),
     arrow((132, 205), (178, 205)), label(155, 197, "HTTPS", halo="#f6f8fa"),
     arrow((312, 205), (368, 205)), label(340, 197, "/api"),
     arrow((522, 205), (578, 205)), label(550, 197, "resolves"),
     arrow((732, 205), (760, 205), head=False), arrow((760, 105), (760, 205), head=False),
     arrow((760, 105), (828, 105)), arrow((760, 205), (828, 205))]
for y, name, sub, k, t in [(70, "api-7d4f-x2k", "10.244.1.5 · Ready", "green", "app=api"),
                           (170, "api-7d4f-m9p", "10.244.2.7 · Ready", "green", "app=api"),
                           (270, "web-5c9b-q7m", "no matching label", "grey", "app=web")]:
    P += [pod(830, y, 230, 70, name, sub, k), tag(830 + 230 - (7 * len(t) + 14) - 8, y + 6, t, "amber" if k == "green" else "grey")]
P += ['<rect x="786" y="94" width="8" height="22" rx="2" fill="#52606d"/>',
      '<rect x="786" y="194" width="8" height="22" rx="2" fill="#52606d"/>',
      label(790, 234, "NetworkPolicy", size=10, color="#52606d", weight="600"),
      label(790, 247, "gate", size=10, color="#52606d"),
      label(180, 312, "The Service finds Pods only by label.", "start", color="#713f12", weight="600"),
      label(180, 329, "No name, IP or ownership link exists. A typo in either label", "start"),
      label(180, 344, "means an empty EndpointSlice and no traffic.", "start")]
save("services-and-ingress-1", 1100, 400,
     "Request path: client to Ingress to Service to EndpointSlice to Pods; the Service selects Pods only by label, and NetworkPolicy gates traffic entering the namespace", P)
