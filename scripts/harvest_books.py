#!/usr/bin/env python3
"""Harvest real books with verified covers from OpenLibrary for each library category.

Output:
  - web/assets/covers/<CODE>.jpg   (downloaded, validated JPEG)
  - scripts/harvested_books.json   (document records to splice into app.js)
"""
import json, os, sys, time, urllib.parse, urllib.request, random

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS_DIR = os.path.join(ROOT, "web", "assets", "covers")
OUT_JSON = os.path.join(ROOT, "scripts", "harvested_books.json")
os.makedirs(COVERS_DIR, exist_ok=True)

random.seed(42)
TARGET = 28  # per category

UA = {"User-Agent": "oop-library-school-project/1.0 (contact: student@example.com)"}

def http_get(url, timeout=25):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def search_ol(query, limit=40):
    fields = "title,author_name,cover_i,first_publish_year,language,publisher"
    url = ("https://openlibrary.org/search.json?q="
           + urllib.parse.quote(query)
           + f"&limit={limit}&fields={fields}")
    for attempt in range(3):
        try:
            return json.loads(http_get(url))
        except Exception as e:
            time.sleep(1.5 * (attempt + 1))
    print(f"  ! search failed: {query}", file=sys.stderr)
    return {"docs": []}

def download_cover(cover_id, dest):
    url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
    for attempt in range(3):
        try:
            data = http_get(url, timeout=30)
            if len(data) > 4000 and data[:3] == b"\xff\xd8\xff":
                with open(dest, "wb") as f:
                    f.write(data)
                return len(data)
            return 0
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return 0

# (kind, prefix, category, extra builder, publisher default, queries)
def gt_extra(d):  return {"maMonHoc": d["_subject"], "boMon": "Giáo trình Chuyên ngành"}
def tk_extra(d):  return {"referenceSubtype": "Sách chuyên khảo"}
def sk_extra(d):  return {"loaiSachKhac": d["_subject"]}
def bc_extra(d):  return {"soPhatHanh": random.randint(1, 12), "thangPhatHanh": random.randint(1, 12), "magazineSubtype": "Tạp chí Khoa học & Chuyên ngành"}
def nc_extra(d):  return {"coQuanChuQuan": d.get("publisher") or "Viện nghiên cứu", "researchSubtype": "Báo cáo khoa học / Đề tài NCKH", "linhVuc": d["_subject"]}

CATEGORIES = [
    dict(kind="Giáo trình", prefix="GT", category="Công nghệ thông tin", extra=gt_extra,
         pub="NXB Giáo Dục", subject="Giáo trình Chuyên ngành",
         queries=["C++ programming","Java programming","Python programming","data structures algorithms",
                  "operating systems concepts","computer networks","database systems","discrete mathematics",
                  "calculus textbook","linear algebra","physics for scientists engineers","digital logic design",
                  "software engineering","computer organization architecture","object oriented programming",
                  "compiler design","theory of computation","probability statistics","web development textbook",
                  "introduction to programming"]),
    dict(kind="Sách tham khảo", prefix="TK", category="Sách chuyên khảo", extra=tk_extra,
         pub="NXB Đại học Quốc gia", subject="Sách chuyên khảo",
         queries=["clean code","design patterns software","refactoring","computer vision",
                  "natural language processing","cryptography","information security","data science handbook",
                  "cloud computing","distributed systems","computer graphics","human computer interaction",
                  "the C programming language","effective java","code complete","pragmatic programmer",
                  "mathematics handbook","statistics reference","database design","unix programming"]),
    dict(kind="Sách khác", prefix="SK", category="Văn học", extra=sk_extra,
         pub="NXB Văn học", subject="Văn học / Tiểu thuyết", prefer_lang="vie",
         queries=["Nguyen Nhat Anh","Nha gia kim Paulo Coelho","Mat biec","Tuoi tho du doi",
                  "Dac nhan tam","atomic habits","rich dad poor dad","the alchemist","Sherlock Holmes",
                  "Jules Verne","Harry Potter","Doraemon","Truyen Kieu Nguyen Du","Hoang tu be",
                  "Toi thay hoa vang tren co xanh","Murakami Norwegian Wood","Le Petit Prince",
                  "self help motivation","ky nang giao tiep","tu duy nhanh va cham"]),
    dict(kind="Báo/tạp chí", prefix="BC", category="Tạp chí Khoa học & Chuyên ngành", extra=bc_extra,
         pub="Scientific American", subject="Tạp chí Khoa học & Chuyên ngành",
         queries=["Scientific American","National Geographic","Reader's Digest","Time almanac",
                  "Popular Science","Popular Mechanics","Smithsonian","Discover magazine","New Scientist",
                  "Communications of the ACM","IEEE Spectrum","Newsweek","Forbes magazine","Wired magazine",
                  "world almanac","Guinness world records","yearbook science","periodical science",
                  "National Geographic kids","astronomy magazine"]),
    dict(kind="Bài nghiên cứu", prefix="NC", category="Báo cáo khoa học / Đề tài NCKH", extra=nc_extra,
         pub="MIT Press", subject="Báo cáo khoa học / Đề tài NCKH",
         queries=["Deep Learning Goodfellow","Artificial Intelligence Modern Approach",
                  "Pattern Recognition and Machine Learning","Introduction to Information Retrieval",
                  "Reinforcement Learning Sutton","Neural Networks deep learning","Convex Optimization",
                  "Computer Vision algorithms applications","Speech and Language Processing","Bioinformatics",
                  "Quantum computing","Robotics modern","Data mining concepts","Graph theory",
                  "Number theory","Computational complexity","The Elements of Statistical Learning",
                  "Econometrics analysis","Genetics molecular biology","Climate change science"]),
]

seen = set()   # global dedupe by (title.lower, author.lower)
documents = []
cover_report = []

for cat in CATEGORIES:
    picked = 0
    counter = 0
    print(f"\n=== {cat['kind']} (target {TARGET}) ===")
    prefer = cat.get("prefer_lang")
    # two passes: first prefer language, then fill with anything
    for require_lang in ([True, False] if prefer else [False]):
        for q in cat["queries"]:
            if picked >= TARGET:
                break
            data = search_ol(q, limit=25)
            time.sleep(0.3)
            for doc in data.get("docs", []):
                if picked >= TARGET:
                    break
                ci = doc.get("cover_i")
                title = (doc.get("title") or "").strip()
                authors = doc.get("author_name") or []
                author = authors[0].strip() if authors else "Nhiều tác giả"
                if not ci or not title:
                    continue
                if require_lang and prefer not in (doc.get("language") or []):
                    continue
                key = (title.lower()[:60], author.lower())
                if key in seen:
                    continue
                counter += 1
                code = f"{cat['prefix']}{counter:03d}"
                dest = os.path.join(COVERS_DIR, code + ".jpg")
                size = download_cover(ci, dest)
                time.sleep(0.4)
                if size == 0:
                    if os.path.exists(dest):
                        os.remove(dest)
                    continue
                seen.add(key)
                picked += 1
                pubs = doc.get("publisher") or []
                publisher = (pubs[0] if pubs else cat["pub"])[:60]
                year = doc.get("first_publish_year") or random.randint(2008, 2024)
                d = {"_subject": cat["subject"], "publisher": publisher}
                rec = {
                    "id": code,
                    "title": title[:120],
                    "kind": cat["kind"],
                    "year": int(year),
                    "quantity": random.randint(20, 90),
                    "author": author[:80],
                    "publisher": publisher,
                    "category": cat["category"],
                    "coverImage": f"assets/covers/{code}.jpg",
                    "extra": cat["extra"]({**doc, **d}),
                }
                documents.append(rec)
                cover_report.append((code, size, title[:50]))
                print(f"  + {code} [{size//1000}KB] {title[:50]}")
        if picked >= TARGET:
            break
    print(f"  => {cat['kind']}: {picked} books")

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(documents, f, ensure_ascii=False, indent=2)

print(f"\nTOTAL {len(documents)} books -> {OUT_JSON}")
