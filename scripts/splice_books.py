#!/usr/bin/env python3
"""Splice harvested_books.json into web/app.js, replacing the documents: [...] array."""
import json, os, sys, re

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "web", "app.js")
docs = json.load(open(os.path.join(ROOT, "scripts", "harvested_books.json"), encoding="utf-8"))

s = open(APP, encoding="utf-8").read()

start_marker = "    documents: ["
i = s.index(start_marker)
# find the matching close: the first "\n    ],\n    loans:" after start
j = s.index("\n    loans:", i)
# back up to the "    ],"
close = s.rindex("    ],", i, j)
end = close + len("    ],")

# Build JS for the array, 4-space base indent for keys inside objects
lines = ["    documents: ["]
for k, d in enumerate(docs):
    obj = json.dumps(d, ensure_ascii=False)
    comma = "," if k < len(docs) - 1 else ""
    lines.append("      " + obj + comma)
lines.append("    ],")
block = "\n".join(lines)

new = s[:i] + block + s[end:]
open(APP, "w", encoding="utf-8").write(new)
print(f"Spliced {len(docs)} documents into app.js")
