import json
import os
import re
import tarfile
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from tempfile import gettempdir

TARGET_COUNT = int(os.environ.get("GUTENBERG_LIMIT", "10000"))
REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT = REPO_ROOT / "web" / "gutenberg-catalog.js"
FEED_URL = "https://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2"
FEED_CACHE = Path(os.environ.get("GUTENBERG_RDF_CACHE", Path(gettempdir()) / "rdf-files.tar.bz2"))

NS = {
    "dcterms": "http://purl.org/dc/terms/",
    "pgterms": "http://www.gutenberg.org/2009/pgterms/",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
}


def ensure_feed():
    if FEED_CACHE.exists() and FEED_CACHE.stat().st_size > 1_000_000:
        return FEED_CACHE

    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; OOP library catalog builder)",
        "Accept": "application/octet-stream",
    }
    request = urllib.request.Request(FEED_URL, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=240) as response:
            FEED_CACHE.write_bytes(response.read())
    except (urllib.error.URLError, TimeoutError) as exc:
        raise RuntimeError(f"Cannot download Project Gutenberg RDF feed: {exc}") from exc
    return FEED_CACHE


def clean_text(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def plain_text(value):
    return clean_text(value).lower()


def first_text(node, selector):
    found = node.find(selector, NS)
    return clean_text(found.text if found is not None else "")


def all_text(node, selector):
    return [clean_text(item.text) for item in node.findall(selector, NS) if clean_text(item.text)]


def escape_xml(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def data_url_svg(title, author, index, label):
    colors = [
        ("#176b87", "#f3fbfd"),
        ("#7c2d12", "#fff7ed"),
        ("#365314", "#f7fee7"),
        ("#4c1d95", "#faf5ff"),
        ("#1f2937", "#f9fafb"),
        ("#0f766e", "#ecfeff"),
        ("#7f1d1d", "#fef2f2"),
        ("#164e63", "#ecfeff"),
    ]
    bg, fg = colors[index % len(colors)]
    short_title = clean_text(title)[:52]
    short_author = clean_text(author)[:36]
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480">
  <rect width="360" height="480" rx="18" fill="{bg}"/>
  <rect x="28" y="32" width="304" height="416" rx="12" fill="{fg}" opacity=".12"/>
  <text x="38" y="78" fill="{fg}" font-family="Arial, sans-serif" font-size="17" font-weight="700">{escape_xml(label.upper())}</text>
  <foreignObject x="38" y="120" width="284" height="178">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;color:{fg};font-size:31px;font-weight:700;line-height:1.12;word-wrap:break-word;">{escape_xml(short_title)}</div>
  </foreignObject>
  <foreignObject x="38" y="334" width="284" height="62">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;color:{fg};font-size:18px;line-height:1.2;word-wrap:break-word;">{escape_xml(short_author)}</div>
  </foreignObject>
  <text x="38" y="426" fill="{fg}" font-family="Arial, sans-serif" font-size="15">Public domain catalog</text>
</svg>"""
    return "data:image/svg+xml;charset=utf-8," + urllib.parse.quote(svg)


def subtype_for(subjects, title):
    text = plain_text(f"{title} {' '.join(subjects)}")
    if any(word in text for word in ["fiction", "adventure", "fairy", "tale", "stories", "novel", "children"]):
        return "Truyện"
    if any(word in text for word in ["poetry", "poems", "drama", "plays", "literature", "essays"]):
        return "Văn học"
    if any(word in text for word in ["language", "grammar", "dictionary", "english", "french", "german", "spanish"]):
        return "Ngoại ngữ"
    if any(word in text for word in ["history", "geography", "travel", "biography", "memoir"]):
        return "Lịch sử - địa lý"
    if any(word in text for word in ["science", "mathematics", "physics", "chemistry", "biology", "nature", "astronomy"]):
        return "Khoa học phổ thông"
    if any(word in text for word in ["self-help", "conduct of life", "psychology", "ethics", "leadership"]):
        return "Kỹ năng sống"
    if any(word in text for word in ["law", "legal", "constitution"]):
        return "Luật"
    return "Văn học"


def preview_for(subjects, subtype):
    if subjects:
        return "Mô tả/chủ đề: " + "; ".join(subjects[:4])
    return f"Mô tả/chủ đề: sách tiếng Anh public domain, nhóm {subtype}. Quản lý như bản in trong thư viện."


def score_book(subjects, title):
    text = plain_text(f"{title} {' '.join(subjects)}")
    score = 0
    if any(word in text for word in ["fiction", "novel", "stories", "story", "adventure", "fairy", "children"]):
        score += 100
    if any(word in text for word in ["literature", "poetry", "drama", "plays"]):
        score += 40
    if any(word in text for word in ["english", "language", "history", "science", "law"]):
        score += 10
    return score


def catalog_quantity(book, index):
    text = plain_text(f"{book['title']} {' '.join(book['subjects'])}")
    quantity = 4 + (index % 7)
    if book["score"] >= 100:
        quantity += 8
    elif book["score"] >= 40:
        quantity += 4
    if any(word in text for word in ["dictionary", "grammar", "science", "history", "mathematics", "law"]):
        quantity += 3
    if any(word in text for word in ["sherlock", "austen", "dickens", "shakespeare", "peter pan"]):
        quantity += 5
    return min(quantity, 30)


def parse_book(member_name, member_file):
    try:
        root = ET.parse(member_file).getroot()
    except ET.ParseError:
        return None

    ebook = root.find("pgterms:ebook", NS)
    if ebook is None:
        return None

    language = first_text(ebook, "dcterms:language/rdf:Description/rdf:value")
    rights = first_text(ebook, "dcterms:rights")
    if language.lower() != "en" or "public domain" not in rights.lower():
        return None

    title = first_text(ebook, "dcterms:title")
    if not title:
        return None

    creators = all_text(ebook, "dcterms:creator/pgterms:agent/pgterms:name")
    subjects = all_text(ebook, "dcterms:subject/rdf:Description/rdf:value")
    author = "; ".join(creators) or "Project Gutenberg"
    source_id = Path(member_name).stem.replace("pg", "")
    subtype = subtype_for(subjects, title)

    return {
        "title": title,
        "author": author,
        "subjects": subjects,
        "sourceId": source_id,
        "subtype": subtype,
        "score": score_book(subjects, title),
    }


def convert_book(book, index):
    return {
        "id": f"TVS{index:05d}",
        "title": book["title"],
        "kind": "Sách khác",
        "year": 2026,
        "quantity": catalog_quantity(book, index),
        "author": book["author"],
        "publisher": "Project Gutenberg",
        "category": "English public domain",
        "coverImage": "",
        "fileUrl": "",
        "fileName": "",
        "extra": {
            "loaiSachKhac": book["subtype"],
            "nguon": "Project Gutenberg public domain metadata",
            "gutenbergId": book["sourceId"],
            "docTruoc": preview_for(book["subjects"], book["subtype"]),
        },
    }


def main():
    feed_path = ensure_feed()
    candidates = []

    with tarfile.open(feed_path, "r:bz2") as archive:
        members = (member for member in archive if member.isfile() and member.name.endswith(".rdf"))
        for member in members:
            file_obj = archive.extractfile(member)
            if file_obj is None:
                continue

            item = parse_book(member.name, file_obj)
            if item:
                candidates.append(item)
                if len(candidates) % 1000 == 0:
                    print(f"Read {len(candidates)} English public-domain records", flush=True)

    if len(candidates) < TARGET_COUNT:
        raise RuntimeError(f"Only collected {len(candidates)} books, need {TARGET_COUNT}.")

    candidates.sort(key=lambda item: (-item["score"], item["title"].lower(), item["sourceId"]))
    catalog = [convert_book(item, index + 1) for index, item in enumerate(candidates[:TARGET_COUNT])]

    content = (
        "/* Generated by scripts/build_gutenberg_catalog.py from Project Gutenberg RDF metadata. */\n"
        f"window.GUTENBERG_CATALOG = {json.dumps(catalog, ensure_ascii=False, separators=(',', ':'))};\n"
    )
    OUTPUT.write_text(content, encoding="utf-8")

    counts = {}
    for item in catalog:
        subtype = item["extra"]["loaiSachKhac"]
        counts[subtype] = counts.get(subtype, 0) + 1
    print(f"Wrote {len(catalog)} books to {OUTPUT}", flush=True)
    print(json.dumps(counts, ensure_ascii=True), flush=True)


if __name__ == "__main__":
    main()
