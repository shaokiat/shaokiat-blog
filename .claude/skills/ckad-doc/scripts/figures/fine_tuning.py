"""Figures for docs/ai-engineering/fine-tuning/: lora-1. Written to static/img/ai-engineering/.

Grey is frozen, amber is trained, blue is the input and the sum, green is the output."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fig
from fig import *
fig.OUT = str(fig.REPO / "static/img/ai-engineering")
H = "#f6f8fa"

# ---- FT2-1 one linear layer with LoRA ----
P = [outer(10, 10, 900, 260, "ONE LINEAR LAYER WITH LoRA"),
     box(30, 110, 110, 60, "Input x", "d = 4096", "blue"),
     box(220, 46, 370, 64, "W · frozen", "4096 × 4096 ≈ 16.8M weights", "grey"),
     box(220, 170, 110, 64, "A · trained", "8 × 4096", "amber"),
     box(350, 170, 110, 64, "B · trained", "4096 × 8", "amber"),
     box(480, 170, 110, 64, "Scale", "× alpha / r", "blue"),
     box(640, 116, 48, 48, "+", None, "blue"),
     box(730, 110, 160, 60, "Output", "Wx + scaled B(Ax)", "green"),
     arrow((142, 140), (180, 140), (180, 78), (218, 78)),
     arrow((180, 140), (180, 202), (218, 202)),
     arrow((332, 202), (348, 202)),
     arrow((462, 202), (478, 202)),
     arrow((592, 78), (664, 78), (664, 114)),
     arrow((592, 202), (664, 202), (664, 166)),
     arrow((690, 140), (728, 140)),
     label(340, 254, "rank r = 8 · A + B ≈ 65k trained weights, about 0.4% of W", halo=H)]
fig.save("lora-1", 920, 280, "One linear layer with LoRA: the input goes through the frozen weight matrix W and, in parallel, through two small trained matrices A and B of rank 8 and a scale of alpha over r; the two paths are summed to give the output", P)
