"""Figures for docs/genai-agents/case-studies/: accident-cases-1 … accident-cases-8. Written to static/img/case-studies/.

Architecture figures (3–7) colour by role: blue write path / processing, amber read path / LLM,
green storage, grey dashed human review, grey solid external source."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/case-studies")
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


# ======== Text-to-SQL with web search: text-to-sql-1 … text-to-sql-7 (C2-5 is Mermaid on the page) ========
# Colour by role: amber LLM step, blue code, green data store / returns, grey external (web, user),
# dashed grey failure or caveat path.

# ---- C2-1 the order to work through it ----
areas = [("Framing", "year · unit · definition", "trust · access", "amber", "definitions"),
         ("Decomposition", "required facts", "mapped to sources", "amber", "fact-to-source map"),
         ("Architecture", "components", "control flow", "blue", "components"),
         ("Guardrails", "checks", "success measures", "blue", "checks + metrics"),
         ("Delivery", "v1 scope", "upgrade triggers", "blue", "v1 + triggers")]
P = [outer(10, 10, 980, 170, "CASE STUDY BREAKDOWN · WORK LEFT TO RIGHT")]
for i, (t, s, s2, k, out) in enumerate(areas):
    x = 30 + i * 192
    P += [box(x, 46, 168, 76, t, s, k, sub2=s2), label(x + 84, 148, "→ " + out, color="#52606d", weight="600")]
    if i < 4:
        P.append(arrow((x + 170, 84), (x + 190, 84)))
fig.save("text-to-sql-1", 1000, 190, "Five areas in order: problem framing, decomposition, architecture, guardrails and evaluation, delivery, each with the output it produces; framing and decomposition are highlighted", P)

# ---- C2-2 ReAct loop ----
P = [box(20, 100, 140, 64, "User query", "plain English", "grey"),
     box(220, 100, 170, 64, "Thought", "LLM picks next step", "amber"),
     box(450, 100, 170, 64, "Action", "web_search or run_sql", "blue"),
     box(680, 100, 170, 64, "Observation", "tool result", "green"),
     box(680, 16, 170, 48, "Answer", None, "amber"),
     arrow((162, 132), (218, 132)), arrow((392, 132), (448, 132)), arrow((622, 132), (678, 132)),
     arrow((765, 166), (765, 206), (305, 206), (305, 166)), label(535, 200, "back to Thought: until done or step cap", halo=W),
     arrow((305, 98), (305, 40), (678, 40)), label(490, 34, "done", halo=W)]
fig.save("text-to-sql-2", 870, 225, "ReAct loop: the user query goes to a Thought step, which picks an Action, web search or run SQL; the Observation returns to Thought until the model is done or hits the step cap, then it answers", P)

# ---- C2-3 plan-and-execute ----
P = [box(20, 76, 120, 64, "User query", None, "grey"),
     box(180, 76, 160, 64, "Planner", "LLM, full plan upfront", "amber"),
     box(380, 76, 150, 64, "Validate plan", "code", "blue"),
     boundary(570, 30, 260, 156, "EXECUTOR · BY DEPENDENCY"),
     box(590, 58, 220, 48, "1 · Web fact", "the reference value", "blue"),
     box(590, 122, 220, 48, "2 · SQL using it", "value bound as parameter", "blue"),
     arrow((700, 108), (700, 120)),
     box(870, 80, 110, 56, "Answer", None, "amber"),
     arrow((142, 108), (178, 108)), arrow((342, 108), (378, 108)), arrow((532, 108), (568, 108)), arrow((832, 108), (868, 108)),
     box(570, 220, 260, 52, "Replanner", "only when a step fails", "amber", dashed=True),
     arrow((700, 188), (700, 218), dashed=True, color=GREY), label(708, 207, "step fails", "start", halo=W),
     arrow((568, 246), (260, 246), (260, 142), dashed=True, color=GREY), label(414, 240, "new plan", halo=W)]
fig.save("text-to-sql-3", 1000, 285, "Plan-and-execute: the planner writes the full plan upfront, code validates it, and the executor runs steps by dependency, the web fact first and then the SQL that uses it; a failed step goes to a replanner", P)

# ---- C2-4 where the SQL gets written ----
def slot(i, span=1):
    return 30 + i * 164, 140 + (span - 1) * 164
P = [boundary(10, 10, 1000, 120, "OPTION A · SQL AT PLANNING"),
     boundary(10, 150, 1000, 120, "OPTION B · FEED BACK BEFORE SQL")]
A = [("Planner", "plan + SQL", "amber", 1, "with placeholder"), ("Web fact", "typed value", "amber", 1, None),
     ("Checks", "code", "blue", 1, None), ("Bind and run SQL", "no LLM", "blue", 2, None), ("Answer", None, "amber", 1, None)]
B = [("Planner", "SQL intent", "amber", 1, None), ("Web fact", "typed value", "amber", 1, None), ("Checks", "code", "blue", 1, None),
     ("SQL writer", "LLM", "amber", 1, "sees fact metadata"), ("Run SQL", "value bound", "blue", 1, None), ("Answer", None, "amber", 1, None)]
for y, row in ((40, A), (180, B)):
    i = 0
    for t, s, k, span, s2 in row:
        x, w = slot(i, span)
        P.append(box(x, y, w, 70, t, s, k, sub2=s2))
        if i + span < 6:
            P.append(arrow((x + w + 2, y + 35), (x + w + 22, y + 35)))
        i += span
fig.save("text-to-sql-4", 1020, 280, "Two options side by side: in option A the planner writes SQL with a placeholder upfront and code binds the checked web value; in option B a separate SQL writer LLM step writes the query after seeing the checked fact's metadata", P)

# ---- C2-6 system overview ----
CX, CW = 380, 240
def spine(y, t, s, k):
    return box(CX, y, CW, 64, t, s, k)
P = [spine(20, "User", "question in plain English", "grey"),
     spine(110, "Planner", "agent · schema tools only", "amber"),
     spine(220, "Web fact", "code search + 1 LLM extraction", "amber"),
     spine(330, "Checks", "source · range · definition", "blue"),
     spine(440, "SQL writer", "LLM · uses fact metadata", "amber"),
     spine(550, "SQL validator", "read-only · columns · placeholder", "blue"),
     spine(660, "Execute", "bind value · run SQL", "blue"),
     spine(770, "Answer", "result + provenance", "amber"),
     box(40, 220, 200, 64, "Web", "trusted sources only", "grey"),
     box(760, 330, 200, 76, "Database", "read-only role", "green"),
     arrow((500, 86), (500, 108)),
     arrow((500, 176), (500, 218)), label(508, 202, "needs web", "start", halo=W),
     arrow((500, 286), (500, 328)),
     arrow((500, 396), (500, 438)), label(508, 422, "pass", "start", halo=W),
     arrow((500, 506), (500, 548)),
     arrow((500, 616), (500, 658)), label(508, 642, "pass", "start", halo=W),
     arrow((500, 726), (500, 768)),
     arrow((242, 252), (378, 252), both=True), label(310, 246, "allowlist", halo=W),
     arrow((622, 130), (860, 130), (860, 328), both=True), label(742, 124, "schema discovery", halo=W),
     arrow((622, 692), (860, 692), (860, 408)), label(742, 686, "read-only", halo=W),
     arrow((622, 156), (700, 156), (700, 456), (622, 456)), label(708, 300, "no web", "start", halo=W),
     arrow((622, 600), (660, 600), (660, 488), (622, 488)), label(668, 548, "retry, max 1", "start", halo=W),
     arrow((378, 362), (300, 362), (300, 794), (378, 794), dashed=True, color=GREY), label(339, 356, "fail", halo=W),
     arrow((378, 582), (330, 582), (330, 814), (378, 814), dashed=True, color=GREY), label(354, 576, "fail", halo=W),
     label(290, 640, "caveat", "end", halo=W, italic=True),
     boundary(20, 856, 960, 34, "UNDER EVERY STEP · SHARED STATE + AUDIT LOG", dashed=True)]
fig.save("text-to-sql-6", 1000, 900, "System overview: the user's question goes to the planner, which reads the database schema; when it needs the web, the web fact step searches trusted sources and extracts one typed fact, checks verify it, and the SQL writer, validator and execute steps run the query on the read-only database; failed checks or an invalid query after one retry go to the answer as a caveat; shared state and an audit log sit under every step", P)

# ---- C2-7 LangGraph node graph ----
def node(x, y, w, name, kind, t):
    return pod(x, y, w, 58, name, None, kind, tag=t)
P = [tag(20, 60, "START", "grey"),
     node(100, 40, 140, "planner", "amber", "AGENT"),
     node(290, 40, 120, "route", "grey", "EDGE"),
     node(470, 40, 140, "web_fact", "amber", "LLM"),
     node(660, 40, 130, "checks", "blue", "FUNCTION"),
     node(100, 180, 140, "schema_tools", "blue", "TOOLS"),
     node(290, 180, 130, "sql_writer", "amber", "LLM"),
     node(470, 180, 140, "sql_validator", "blue", "FUNCTION"),
     node(660, 180, 130, "execute_sql", "blue", "FUNCTION"),
     node(840, 180, 130, "answer", "amber", "LLM"),
     tag(1010, 200, "END", "grey"),
     arrow((76, 69), (98, 69)), arrow((242, 69), (288, 69)),
     arrow((170, 100), (170, 178), both=True),
     arrow((412, 69), (468, 69)), label(440, 61, "needs web", halo=W),
     arrow((612, 69), (658, 69)),
     arrow((340, 100), (340, 178)), label(332, 140, "no web", "end", halo=W),
     arrow((725, 100), (725, 140), (390, 140), (390, 178)), label(560, 134, "pass", halo=W),
     arrow((422, 209), (468, 209)), arrow((612, 209), (658, 209)), arrow((792, 209), (838, 209)), arrow((972, 209), (1008, 209)),
     arrow((520, 240), (520, 272), (355, 272), (355, 240)), label(438, 266, "retry, max 1", halo=W),
     arrow((580, 240), (580, 292), (905, 292), (905, 240), dashed=True, color=GREY), label(742, 286, "fail", halo=W),
     arrow((792, 69), (905, 69), (905, 178), dashed=True, color=GREY), label(848, 61, "fail", halo=W)]
fig.save("text-to-sql-7", 1060, 305, "LangGraph node graph: START to the planner agent node, which calls schema tools; a conditional edge routes to web_fact and checks when the web is needed, otherwise straight to sql_writer; sql_validator retries the writer once, then execute_sql, answer and END; failed checks or validation go to answer", P)
