"""Figures for docs/ml-engineering/rag/case-studies/: accident-cases-1 … accident-cases-8. Written to static/img/rag/.

Architecture figures (3–7) colour by role: blue write path / processing, amber read path / LLM,
green storage, grey dashed human review, grey solid external source."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/rag")
H, W = "#f6f8fa", "#ffffff"

# ---- C1-1 the order to work through it ----
areas = [("Framing", "goal · users · I/O", "data · risk", "amber", "refined problem"),
         ("Decomposition", "capabilities", "which are RAG", "amber", "capability table"),
         ("Architecture", "write path", "read path", "blue", "components"),
         ("Guardrails", "grounding · access", "metrics", "blue", "rules + metrics"),
         ("Delivery", "phases", "gates", "blue", "roadmap")]
P = [outer(10, 10, 980, 170, "CASE STUDY BREAKDOWN · WORK LEFT TO RIGHT")]
for i, (t, s, s2, k, out) in enumerate(areas):
    x = 30 + i * 192
    P += [box(x, 46, 168, 76, t, s, k, sub2=s2), label(x + 84, 148, "→ " + out, color="#52606d", weight="600")]
    if i < 4:
        P.append(arrow((x + 170, 84), (x + 190, 84)))
fig.save("accident-cases-1", 1000, 190, "Five areas in order: framing, decomposition, architecture, guardrails and evaluation, delivery, each with the output it produces", P)

# ---- C1-2 bias feedback loop ----
P = [outer(10, 10, 740, 190, "FEEDBACK LOOP"),
     box(40, 46, 180, 64, "Policing", "more in an area"),
     box(290, 46, 180, 64, "Incidents", "more recorded"),
     box(540, 46, 180, 64, "Scores", "rise for residents", "amber"),
     arrow((222, 78), (288, 78)), arrow((472, 78), (538, 78)),
     arrow((630, 112), (630, 160), (130, 160), (130, 112)), label(380, 152, "scores justify more policing", halo=H)]
fig.save("accident-cases-2", 760, 210, "Feedback loop: more policing in an area leads to more recorded incidents, which raise scores for residents, which justify more policing", P)

GREY = "#94a3b8"

# ---- C1-3 big picture: two paths, shared storage ----
P = [boundary(20, 20, 630, 130, "WRITE PATH · RUNS IN THE BACKGROUND"),
     box(40, 56, 180, 68, "Legacy system", "DB · notes", "grey", sub2="PDFs · photos"),
     box(270, 56, 180, 68, "Ingestion", "sync · OCR", "blue", sub2="link entities"),
     boundary(20, 170, 630, 130, "READ PATH · LIVE, PER QUESTION"),
     box(40, 206, 150, 68, "Officer", "asks in chat", "amber"),
     box(240, 206, 180, 68, "Chatbot", "LLM, self-hosted", "amber"),
     box(470, 206, 160, 68, "Retrieval", "SQL · vectors · rules", "blue"),
     boundary(690, 20, 290, 280, "STORAGE"),
     box(710, 46, 250, 52, "SQL store", "exact facts", "green"),
     box(710, 108, 250, 52, "Vector index", "similar cases", "green"),
     box(710, 170, 250, 52, "Workflow catalog", "exact, versioned", "green"),
     box(710, 232, 250, 52, "Procedures index", "follow-up questions", "green"),
     arrow((222, 90), (268, 90)),
     arrow((452, 90), (688, 90)),
     arrow((192, 240), (238, 240), both=True),
     arrow((422, 240), (468, 240), both=True),
     arrow((632, 240), (688, 240), both=True),
     boundary(20, 320, 960, 34, "ACROSS EVERY LAYER · ACCESS CONTROL · AUDIT LOGS · EVALUATION", dashed=True)]
fig.save("accident-cases-3", 1000, 365, "Big picture: a background write path from the legacy system through ingestion into storage, and a live read path from officer to chatbot to retrieval, both sharing a storage layer of SQL store, vector index, workflow catalog and procedures index; access control, audit logs and evaluation span every layer", P)

# ---- C1-4 ingestion pipeline, top-down ----
stages = [("1 · Capture changes", "CDC and file watcher"), ("2 · Extract content", "OCR, vision, layout parsing"),
          ("3 · Clean and normalize", "codes, dates, addresses"), ("4 · Resolve entities", "link people and vehicles"),
          ("5 · Build case documents", "one record per case"), ("6 · Index", "SQL, embeddings, metadata")]
P = [outer(10, 10, 760, 520, "WRITE PATH · INGESTION PIPELINE")]
ys = [46 + i * 80 for i in range(6)]
for i, ((t, s), y) in enumerate(zip(stages, ys)):
    P.append(box(160, y, 300, 56, t, s, "green" if i == 5 else "blue"))
    if i < 5:
        P.append(arrow((310, y + 58), (310, y + 78)))
P += [box(560, 190, 180, 64, "Human review", "low confidence", "grey", dashed=True),
      arrow((462, ys[1] + 28), (650, ys[1] + 28), (650, 188), dashed=True, color=GREY), label(556, ys[1] + 20, "low confidence", halo=H),
      arrow((462, ys[3] + 28), (650, ys[3] + 28), (650, 256), dashed=True, color=GREY), label(556, ys[3] + 20, "uncertain match", halo=H)]
fig.save("accident-cases-4", 780, 540, "Ingestion pipeline in six stages, top to bottom: capture changes, extract content, clean and normalize, resolve entities, build case documents, index; low-confidence extractions and uncertain entity matches go to human review", P)

# ---- C1-5 data model ----
def table(x, y, w, title, fields, kind):
    f, s, tc = KIND[kind]
    h = 34 + 16 * len(fields)
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{f}" stroke="{s}" stroke-width="1.5"/>',
           label(x + 12, y + 20, title, "start", size=12.5, color=tc, weight="700"),
           f'<line x1="{x}" y1="{y+28}" x2="{x+w}" y2="{y+28}" stroke="{s}" stroke-width="1"/>']
    out += [label(x + 12, y + 46 + 16 * i, fd, "start", size=10.5) for i, fd in enumerate(fields)]
    return "\n".join(out), h
items = {
 "CASES": (50, 40, ["case_id PK", "incident_type", "occurred_at", "location", "status", "access_level"], "blue"),
 "CASE_ENTITIES": (390, 40, ["case_id FK", "entity_id FK", "role"], "blue"),
 "ENTITIES": (730, 40, ["entity_id PK", "entity_type", "license_or_plate", "display_name"], "blue"),
 "DOCUMENTS": (50, 230, ["document_id PK", "case_id FK", "doc_type", "file_uri"], "grey"),
 "EXTRACTIONS": (730, 230, ["document_id FK", "field_name", "value", "confidence", "entity_id FK"], "amber"),
 "CHUNKS": (50, 390, ["chunk_id PK", "case_id FK", "document_id FK", "chunk_type", "chunk_text", "embedding"], "green"),
}
P = []
for name, (x, y, fields, k) in items.items():
    s, h = table(x, y, 220, name, fields, k); P.append(s)
P += [arrow((272, 80), (388, 80)), label(330, 72, "involves", halo=W),
      arrow((728, 80), (612, 80)), label(670, 72, "appears in", halo=W),
      arrow((160, 172), (160, 228)), label(168, 204, "has", "start", halo=W),
      arrow((272, 270), (728, 270)), label(500, 262, "yields", halo=W),
      arrow((840, 140), (840, 228)), label(848, 190, "resolved to", "start", halo=W),
      arrow((160, 330), (160, 388)), label(168, 364, "source of", "start", halo=W),
      arrow((48, 110), (30, 110), (30, 440), (48, 440)),
      tag(858, 235, "the bridge")]
fig.save("accident-cases-5", 1000, 535, "Data model: CASES and ENTITIES are joined by CASE_ENTITIES; CASES have DOCUMENTS, which yield EXTRACTIONS resolved to ENTITIES; CHUNKS belong to CASES and come from DOCUMENTS", P)

# ---- C1-6 query planning and fusion ----
P = [box(370, 20, 220, 50, "Officer message", None, "amber"),
     box(330, 110, 300, 60, "Query planner", "LLM outputs a structured plan", "amber"),
     box(30, 230, 200, 60, "Vector search", "similar meaning", "blue"),
     box(265, 230, 200, 60, "Keyword search", "exact terms, IDs", "blue"),
     box(500, 230, 200, 60, "Entity lookup", "SQL, exact history", "blue"),
     box(735, 230, 200, 60, "Workflow rules", "decision table", "blue"),
     box(30, 340, 435, 60, "Fuse similar cases", "group by case · RRF · rerank", "green"),
     box(500, 340, 200, 60, "Entity history", "kept separate", "green"),
     box(735, 340, 200, 60, "Workflow", "catalog lookup by ID", "green"),
     box(200, 450, 560, 60, "Hydrate and answer", "SQL facts · LLM cites sources", "amber"),
     arrow((480, 72), (480, 108)),
     arrow((480, 172), (480, 200), (365, 200), (365, 228)),
     arrow((480, 200), (130, 200), (130, 228)),
     arrow((480, 200), (600, 200), (600, 228)),
     arrow((600, 200), (835, 200), (835, 228)),
     arrow((130, 292), (130, 338)), arrow((365, 292), (365, 338)), arrow((600, 292), (600, 338)), arrow((835, 292), (835, 338)),
     arrow((247, 402), (247, 448)), arrow((600, 402), (600, 448)),
     arrow((835, 402), (835, 480), (762, 480))]
fig.save("accident-cases-6", 960, 520, "Query planning: the planner turns the officer's message into vector search, keyword search, entity lookup and workflow rules; vector and keyword results are fused into ranked similar cases, while entity history and the workflow chosen by rules stay separate, and all three feed hydration and the answer", P)

# ---- C1-7 conversation loop ----
P = [box(20, 60, 150, 76, "Officer", "new message", "amber"),
     box(220, 60, 190, 76, "1 · Planner", "LLM call", "amber", sub2="returns state updates"),
     box(460, 60, 190, 76, "Code", "validate · merge", "blue", sub2="rerun what changed"),
     box(700, 60, 190, 76, "2 · Answer", "LLM call", "amber", sub2="from sectioned context"),
     arrow((172, 98), (218, 98)), arrow((412, 98), (458, 98)), arrow((652, 98), (698, 98)),
     arrow((795, 58), (795, 30), (95, 30), (95, 58)), label(445, 24, "cited reply · next turn", halo=W),
     box(220, 200, 190, 68, "Stores", "SQL · vectors", "green", sub2="catalog · procedures"),
     box(460, 200, 190, 68, "Case state", "fields · recent turns", "green", sub2="summary · per case"),
     box(700, 200, 190, 68, "Audit log", "plan · IDs · reply", "green", sub2="every turn"),
     arrow((520, 138), (520, 170), (315, 170), (315, 198), both=True),
     arrow((580, 138), (580, 198), both=True),
     arrow((795, 138), (795, 198))]
fig.save("accident-cases-7", 910, 285, "Conversation loop: each officer message goes to the planner LLM call, which returns state updates; code validates and merges them into the case state and reruns only what changed against the stores; the answer LLM call replies from sectioned context; every turn is written to the audit log", P)

# ---- C1-8 phases ----
P = [outer(10, 10, 1000, 140, "DELIVERY · EACH GATE MUST PASS BEFORE THE NEXT PHASE"),
     box(30, 50, 180, 72, "Phase 1", "intake", "amber", sub2="+ workflow guidance"),
     box(240, 50, 170, 72, "Gate", "officer adoption", "grey", sub2="relevance feedback"),
     box(440, 50, 170, 72, "Phase 2", "similar case search"),
     box(640, 50, 170, 72, "Gate", "governance agreed", "grey", sub2="access · audit · review"),
     box(840, 50, 150, 72, "Phase 3", "entity history", "blue", sub2="+ flags", dashed=True),
     arrow((212, 86), (238, 86)), arrow((412, 86), (438, 86)), arrow((612, 86), (638, 86)), arrow((812, 86), (838, 86))]
fig.save("accident-cases-8", 1020, 160, "Three delivery phases separated by gates: intake and procedures, then similar case search after officer adoption and relevance feedback, then entity history and flags after governance is agreed", P)
