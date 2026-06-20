#!/usr/bin/env python3
"""Keep only 2 curated books per category (10 total), splice into app.js, prune covers."""
import json, os, sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "web", "app.js")
COVERS_DIR = os.path.join(ROOT, "web", "assets", "covers")
harvested = json.load(open(os.path.join(ROOT, "scripts", "harvested_books.json"), encoding="utf-8"))
by_id = {x["id"]: x for x in harvested}

# (id, optional cleaned title)
SELECT = [
    ("GT001", None),
    ("GT002", "The C++ Programming Language"),
    ("TK001", None),
    ("TK005", None),
    ("SK002", "Tôi thấy hoa vàng trên cỏ xanh"),
    ("SK005", "Nhà giả kim"),
    ("BC001", "Scientific American: Mathematical Puzzles & Diversions"),
    ("BC008", "Evolution (Scientific American)"),
    ("NC001", "Deep Learning"),
    ("NC010", "Pattern Recognition and Machine Learning"),
]

docs = []
keep_files = set()
for code, new_title in SELECT:
    rec = dict(by_id[code])
    if new_title:
        rec["title"] = new_title
    docs.append(rec)
    keep_files.add(code + ".jpg")

# Splice into app.js
s = open(APP, encoding="utf-8").read()
i = s.index("    documents: [")
j = s.index("\n    loans:", i)
close = s.rindex("    ],", i, j)
end = close + len("    ],")
lines = ["    documents: ["]
for k, d in enumerate(docs):
    comma = "," if k < len(docs) - 1 else ""
    lines.append("      " + json.dumps(d, ensure_ascii=False) + comma)
lines.append("    ],")
open(APP, "w", encoding="utf-8").write(s[:i] + "\n".join(lines) + s[end:])
print(f"Spliced {len(docs)} documents into app.js")

# Prune cover files
removed = 0
for f in os.listdir(COVERS_DIR):
    if f.endswith(".jpg") and f not in keep_files:
        os.remove(os.path.join(COVERS_DIR, f))
        removed += 1
print(f"Kept {len(keep_files)} covers, removed {removed}")
for d in docs:
    print("  -", d["id"], "|", d["kind"], "|", d["title"][:45])
