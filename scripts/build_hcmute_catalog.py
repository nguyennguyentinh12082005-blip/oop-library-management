import html
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://thuvienso.hcmute.edu.vn"
TARGET_COUNT = int(os.environ.get("HCMUTE_LIMIT", "5600"))
OUTPUT = Path(__file__).resolve().parents[1] / "web" / "hcmute-catalog.js"
BROKEN_COVER_URLS = {
    "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260514/hcmute/ovanke/135x160/hcmute_1778745434.jpg",
}

CATEGORIES = [
    ("Giáo trình SPKT", "Giáo trình", "https://thuvienso.hcmute.edu.vn/giao-trinh-spkt/tat-ca-tai-lieu-giao-trinh-spkt-9191-0.html"),
    ("Luận văn, luận án", "Bài nghiên cứu", "https://thuvienso.hcmute.edu.vn/luan-van-luan-an/tat-ca-tai-lieu-luan-van-luan-an-9193-0.html"),
    ("Đồ án, khóa luận tốt nghiệp", "Bài nghiên cứu", "https://thuvienso.hcmute.edu.vn/do-an-khoa-luan-tot-nghiep/tat-ca-tai-lieu-do-an-khoa-luan-tot-nghiep-9194-0.html"),
    ("Tài liệu tham khảo", "Sách tham khảo", "https://thuvienso.hcmute.edu.vn/tai-lieu-tham-khao/tat-ca-tai-lieu-tai-lieu-tham-khao-846-0.html"),
    ("BC nghiên cứu khoa học", "Bài nghiên cứu", "https://thuvienso.hcmute.edu.vn/bc-nghien-cuu-khoa-hoc/tat-ca-tai-lieu-bc-nghien-cuu-khoa-hoc-9196-0.html"),
    ("Kỷ yếu hội thảo", "Báo/tạp chí", "https://thuvienso.hcmute.edu.vn/ky-yeu-hoi-thao/tat-ca-tai-lieu-ky-yeu-hoi-thao-9195-0.html"),
    ("Tạp chí khoa học", "Báo/tạp chí", "https://thuvienso.hcmute.edu.vn/tap-chi-khoa-hoc/tat-ca-tai-lieu-tap-chi-khoa-hoc-9192-0.html"),
    ("Luật", "Sách khác", "https://thuvienso.hcmute.edu.vn/luat/tat-ca-tai-lieu-luat-9605-0.html"),
    ("Cơ khí chế tạo máy", "Sách khác", "https://thuvienso.hcmute.edu.vn/co-khi-che-tao-may/tat-ca-tai-lieu-co-khi-che-tao-may-487-0.html"),
    ("Điện - Điện tử", "Sách khác", "https://thuvienso.hcmute.edu.vn/dien-dien-tu/tat-ca-tai-lieu-dien-dien-tu-479-0.html"),
    ("Cơ khí động lực", "Sách khác", "https://thuvienso.hcmute.edu.vn/co-khi-dong-luc/tat-ca-tai-lieu-co-khi-dong-luc-844-0.html"),
    ("Xây dựng - Kiến trúc", "Sách khác", "https://thuvienso.hcmute.edu.vn/xay-dung-kien-truc/tat-ca-tai-lieu-xay-dung-kien-truc-837-0.html"),
    ("Thực phẩm, Môi trường", "Sách khác", "https://thuvienso.hcmute.edu.vn/thuc-pham-moi-truong/tat-ca-tai-lieu-thuc-pham-moi-truong-9159-0.html"),
    ("Công nghệ thông tin", "Sách khác", "https://thuvienso.hcmute.edu.vn/cong-nghe-thong-tin/tat-ca-tai-lieu-cong-nghe-thong-tin-478-0.html"),
    ("Kinh tế - Quản lý", "Sách khác", "https://thuvienso.hcmute.edu.vn/kinh-te-quan-ly/tat-ca-tai-lieu-kinh-te-quan-ly-481-0.html"),
    ("In - Truyền thông", "Sách khác", "https://thuvienso.hcmute.edu.vn/in-truyen-thong/tat-ca-tai-lieu-in-truyen-thong-483-0.html"),
    ("CN May - thời trang", "Sách khác", "https://thuvienso.hcmute.edu.vn/cn-may-thoi-trang/tat-ca-tai-lieu-cn-may-thoi-trang-8011-0.html"),
    ("Nghệ thuật - Ẩm thực", "Sách khác", "https://thuvienso.hcmute.edu.vn/nghe-thuat-am-thuc/tat-ca-tai-lieu-nghe-thuat-am-thuc-9162-0.html"),
    ("Nông - Lâm - Ngư nghiệp", "Sách khác", "https://thuvienso.hcmute.edu.vn/nong-lam-ngu-nghiep/tat-ca-tai-lieu-nong-lam-ngu-nghiep-835-0.html"),
    ("Y học - Sức khỏe", "Sách khác", "https://thuvienso.hcmute.edu.vn/y-hoc-suc-khoe/tat-ca-tai-lieu-y-hoc-suc-khoe-834-0.html"),
    ("Khoa học xã hội", "Sách khác", "https://thuvienso.hcmute.edu.vn/khoa-hoc-xa-hoi/tat-ca-tai-lieu-khoa-hoc-xa-hoi-831-0.html"),
    ("Lịch sử - Địa lý - Du lịch", "Sách khác", "https://thuvienso.hcmute.edu.vn/lich-su-dia-ly-du-lich/tat-ca-tai-lieu-lich-su-dia-ly-du-lich-843-0.html"),
    ("Khoa học tự nhiên", "Sách khác", "https://thuvienso.hcmute.edu.vn/khoa-hoc-tu-nhien/tat-ca-tai-lieu-khoa-hoc-tu-nhien-480-0.html"),
    ("Văn học", "Sách khác", "https://thuvienso.hcmute.edu.vn/van-hoc/tat-ca-tai-lieu-van-hoc-8882-0.html"),
    ("Ngôn ngữ", "Sách khác", "https://thuvienso.hcmute.edu.vn/ngon-ngu/tat-ca-tai-lieu-ngon-ngu-482-0.html"),
    ("Khoa học ứng dụng", "Sách khác", "https://thuvienso.hcmute.edu.vn/khoa-hoc-ung-dung/tat-ca-tai-lieu-khoa-hoc-ung-dung-9197-0.html"),
    ("Thông tin Tuyển sinh", "Sách khác", "https://thuvienso.hcmute.edu.vn/thong-tin-tuyen-sinh/tat-ca-tai-lieu-thong-tin-tuyen-sinh-9891-0.html"),
    ("Thông tin Thư viện", "Sách khác", "https://thuvienso.hcmute.edu.vn/thong-tin-thu-vien/tat-ca-tai-lieu-thong-tin-thu-vien-828-0.html"),
    ("Thể loại khác", "Sách khác", "https://thuvienso.hcmute.edu.vn/the-loai-khac/tat-ca-tai-lieu-the-loai-khac-2052-0.html"),
]


def page_url(base_url, page):
    if page == 0:
        return base_url
    parsed = urllib.parse.urlparse(base_url)
    query = urllib.parse.urlencode({
        "vt": "moinhat",
        "ft": "all",
        "fft": "all",
        "fl": "all",
        "catetl": "0",
        "subcatetl": "0",
        "page": page + 1,
    })
    return urllib.parse.urlunparse(parsed._replace(query=query))


def fetch_page(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
    }
    last_error = None
    for attempt in range(1, 4):
        try:
            request = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read().decode("utf-8", errors="ignore")
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc
            time.sleep(0.8 * attempt)
    raise last_error


def attr(tag, name):
    match = re.search(rf"(?:^|\s){name}\s*=\s*['\"]([^'\"]+)['\"]", tag, re.I)
    return html.unescape(match.group(1)).strip() if match else ""


def absolute_url(value):
    if not value:
        return ""
    if value.startswith("http"):
        return value
    return urllib.parse.urljoin(BASE + "/", value)


def infer_year(cover_url):
    match = re.search(r"thumbnail/(\d{4})/", cover_url)
    return int(match.group(1)) if match else 2026


def other_book_subtype(title, category):
    text = f"{title} {category}".lower()
    if any(word in text for word in ["truyện", "truyen", "tiểu thuyết", "tieu thuyet", "cổ tích", "co tich"]):
        return "Truyện"
    if any(word in text for word in ["văn học", "van hoc", "thơ", "tho ", "tác phẩm", "tac pham"]):
        return "Văn học"
    if any(word in text for word in ["kỹ năng", "ky nang", "kĩ năng", "ki nang", "giao tiếp", "lanh dao", "lãnh đạo"]):
        return "Kỹ năng sống"
    if any(word in text for word in ["ngôn ngữ", "ngoại ngữ", "tiếng anh", "english", "japanese", "chinese", "french"]):
        return "Ngoại ngữ"
    if any(word in text for word in ["khoa học tự nhiên", "vật lý", "hóa học", "sinh học", "toán", "khoa học phổ thông"]):
        return "Khoa học phổ thông"
    if any(word in text for word in ["lịch sử", "địa lý", "du lịch", "lich su", "dia ly", "du lich"]):
        return "Lịch sử - địa lý"
    return category if category else "Khác"


def extra_for(kind, category, title):
    if kind == "Giáo trình":
        return {"maMonHoc": "HCMUTE", "boMon": category}
    if kind == "Sách khác":
        return {"loaiSachKhac": other_book_subtype(title, category)}
    if kind == "Báo/tạp chí":
        return {"soPhatHanh": 1, "thangPhatHanh": 1}
    if kind == "Bài nghiên cứu":
        return {
            "coQuanChuQuan": "Trường Đại học Sư phạm Kỹ thuật TP.HCM",
            "linhVuc": category,
        }
    return {}


def parse_documents(source_html, category, kind):
    items = []
    pattern = re.compile(r"<a\b[^>]*href=['\"]([^'\"]*/doc/[^'\"]+\.html)['\"][^>]*>(.*?)</a>", re.I | re.S)
    for match in pattern.finditer(source_html):
        inner = match.group(2)
        img_match = re.search(r"<img\b[^>]*>", inner, re.I)
        img = img_match.group(0) if img_match else ""
        title = attr(img, "alt") or re.sub(r"<[^>]+>", " ", inner)
        title = " ".join(html.unescape(title).split())
        cover = absolute_url(attr(img, "src"))
        link = absolute_url(match.group(1))
        if not title or not cover or not link or "onerror" in cover or cover in BROKEN_COVER_URLS:
            continue
        items.append({
            "title": title,
            "kind": kind,
            "year": infer_year(cover),
            "quantity": 1,
            "author": "HCMUTE",
            "publisher": "Thư viện số HCMUTE",
            "category": category,
            "coverImage": cover,
            "fileUrl": link,
            "fileName": "Mở nguồn",
            "extra": extra_for(kind, category, title),
        })
    return items


def main():
    docs = []
    seen = set()
    active = [{"category": c, "kind": k, "url": u, "page": 0, "misses": 0} for c, k, u in CATEGORIES]

    while len(docs) < TARGET_COUNT and active:
        source = active.pop(0)
        url = page_url(source["url"], source["page"])
        try:
            source_html = fetch_page(url)
            items = parse_documents(source_html, source["category"], source["kind"])
        except Exception as exc:
            print(f"Skip {url}: {exc}", flush=True)
            items = []

        added = 0
        for item in items:
            if item["fileUrl"] in seen:
                continue
            seen.add(item["fileUrl"])
            docs.append(item)
            added += 1
            if len(docs) >= TARGET_COUNT:
                break

        source["page"] += 1
        source["misses"] = 0 if added else source["misses"] + 1
        if len(docs) < TARGET_COUNT and source["misses"] < 8:
            active.append(source)

        print(f"Collected {len(docs)}/{TARGET_COUNT}; active categories: {len(active)}", flush=True)
        time.sleep(0.15)

    if not docs:
        raise RuntimeError("No documents collected; keeping the existing catalog file unchanged.")

    catalog = [{"id": f"HCMUTE{index + 1:05d}", **item} for index, item in enumerate(docs[:TARGET_COUNT])]
    content = (
        "/* Generated by scripts/build_hcmute_catalog.py from https://thuvienso.hcmute.edu.vn/. */\n"
        f"window.HCMUTE_CATALOG = {json.dumps(catalog, ensure_ascii=False, separators=(',', ':'))};\n"
    )
    OUTPUT.write_text(content, encoding="utf-8")

    counts = {}
    for item in catalog:
        counts[item["kind"]] = counts.get(item["kind"], 0) + 1
    print(f"Wrote {len(catalog)} documents to {OUTPUT}", flush=True)
    print(json.dumps(counts, ensure_ascii=True), flush=True)


if __name__ == "__main__":
    main()
