import { writeFile } from "node:fs/promises";

const BASE = "https://thuvienso.hcmute.edu.vn";
const TARGET_COUNT = Number(process.env.HCMUTE_LIMIT || 5600);
const CONCURRENCY = Number(process.env.HCMUTE_CONCURRENCY || 1);
const OUTPUT = new URL("../web/hcmute-catalog.js", import.meta.url);
const BROKEN_COVER_URLS = new Set([
  "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260514/hcmute/ovanke/135x160/hcmute_1778745434.jpg"
]);

const categories = [
  ["Giáo trình SPKT", "Giáo trình", "https://thuvienso.hcmute.edu.vn/giao-trinh-spkt/tat-ca-tai-lieu-giao-trinh-spkt-9191-0.html"],
  ["Luận văn, luận án", "Bài nghiên cứu", "https://thuvienso.hcmute.edu.vn/luan-van-luan-an/tat-ca-tai-lieu-luan-van-luan-an-9193-0.html"],
  ["Đồ án, khóa luận tốt nghiệp", "Bài nghiên cứu", "https://thuvienso.hcmute.edu.vn/do-an-khoa-luan-tot-nghiep/tat-ca-tai-lieu-do-an-khoa-luan-tot-nghiep-9194-0.html"],
  ["Tài liệu tham khảo", "Sách tham khảo", "https://thuvienso.hcmute.edu.vn/tai-lieu-tham-khao/tat-ca-tai-lieu-tai-lieu-tham-khao-846-0.html"],
  ["BC nghiên cứu khoa học", "Bài nghiên cứu", "https://thuvienso.hcmute.edu.vn/bc-nghien-cuu-khoa-hoc/tat-ca-tai-lieu-bc-nghien-cuu-khoa-hoc-9196-0.html"],
  ["Kỷ yếu hội thảo", "Báo/tạp chí", "https://thuvienso.hcmute.edu.vn/ky-yeu-hoi-thao/tat-ca-tai-lieu-ky-yeu-hoi-thao-9195-0.html"],
  ["Tạp chí khoa học", "Báo/tạp chí", "https://thuvienso.hcmute.edu.vn/tap-chi-khoa-hoc/tat-ca-tai-lieu-tap-chi-khoa-hoc-9192-0.html"],
  ["Luật", "Sách khác", "https://thuvienso.hcmute.edu.vn/luat/tat-ca-tai-lieu-luat-9605-0.html"],
  ["Cơ khí chế tạo máy", "Sách khác", "https://thuvienso.hcmute.edu.vn/co-khi-che-tao-may/tat-ca-tai-lieu-co-khi-che-tao-may-487-0.html"],
  ["Điện - Điện tử", "Sách khác", "https://thuvienso.hcmute.edu.vn/dien-dien-tu/tat-ca-tai-lieu-dien-dien-tu-479-0.html"],
  ["Cơ khí động lực", "Sách khác", "https://thuvienso.hcmute.edu.vn/co-khi-dong-luc/tat-ca-tai-lieu-co-khi-dong-luc-844-0.html"],
  ["Xây dựng - Kiến trúc", "Sách khác", "https://thuvienso.hcmute.edu.vn/xay-dung-kien-truc/tat-ca-tai-lieu-xay-dung-kien-truc-837-0.html"],
  ["Thực phẩm, Môi trường", "Sách khác", "https://thuvienso.hcmute.edu.vn/thuc-pham-moi-truong/tat-ca-tai-lieu-thuc-pham-moi-truong-9159-0.html"],
  ["Công nghệ thông tin", "Sách khác", "https://thuvienso.hcmute.edu.vn/cong-nghe-thong-tin/tat-ca-tai-lieu-cong-nghe-thong-tin-478-0.html"],
  ["Kinh tế - Quản lý", "Sách khác", "https://thuvienso.hcmute.edu.vn/kinh-te-quan-ly/tat-ca-tai-lieu-kinh-te-quan-ly-481-0.html"],
  ["In - Truyền thông", "Sách khác", "https://thuvienso.hcmute.edu.vn/in-truyen-thong/tat-ca-tai-lieu-in-truyen-thong-483-0.html"],
  ["CN May - thời trang", "Sách khác", "https://thuvienso.hcmute.edu.vn/cn-may-thoi-trang/tat-ca-tai-lieu-cn-may-thoi-trang-8011-0.html"],
  ["Nghệ thuật - Ẩm thực", "Sách khác", "https://thuvienso.hcmute.edu.vn/nghe-thuat-am-thuc/tat-ca-tai-lieu-nghe-thuat-am-thuc-9162-0.html"],
  ["Nông - Lâm - Ngư nghiệp", "Sách khác", "https://thuvienso.hcmute.edu.vn/nong-lam-ngu-nghiep/tat-ca-tai-lieu-nong-lam-ngu-nghiep-835-0.html"],
  ["Y học - Sức khỏe", "Sách khác", "https://thuvienso.hcmute.edu.vn/y-hoc-suc-khoe/tat-ca-tai-lieu-y-hoc-suc-khoe-834-0.html"],
  ["Khoa học xã hội", "Sách khác", "https://thuvienso.hcmute.edu.vn/khoa-hoc-xa-hoi/tat-ca-tai-lieu-khoa-hoc-xa-hoi-831-0.html"],
  ["Lịch sử - Địa lý - Du lịch", "Sách khác", "https://thuvienso.hcmute.edu.vn/lich-su-dia-ly-du-lich/tat-ca-tai-lieu-lich-su-dia-ly-du-lich-843-0.html"],
  ["Khoa học tự nhiên", "Sách khác", "https://thuvienso.hcmute.edu.vn/khoa-hoc-tu-nhien/tat-ca-tai-lieu-khoa-hoc-tu-nhien-480-0.html"],
  ["Văn học", "Sách khác", "https://thuvienso.hcmute.edu.vn/van-hoc/tat-ca-tai-lieu-van-hoc-8882-0.html"],
  ["Ngôn ngữ", "Sách khác", "https://thuvienso.hcmute.edu.vn/ngon-ngu/tat-ca-tai-lieu-ngon-ngu-482-0.html"],
  ["Khoa học ứng dụng", "Sách khác", "https://thuvienso.hcmute.edu.vn/khoa-hoc-ung-dung/tat-ca-tai-lieu-khoa-hoc-ung-dung-9197-0.html"],
  ["Thông tin Tuyển sinh", "Sách khác", "https://thuvienso.hcmute.edu.vn/thong-tin-tuyen-sinh/tat-ca-tai-lieu-thong-tin-tuyen-sinh-9891-0.html"],
  ["Thông tin Thư viện", "Sách khác", "https://thuvienso.hcmute.edu.vn/thong-tin-thu-vien/tat-ca-tai-lieu-thong-tin-thu-vien-828-0.html"],
  ["Thể loại khác", "Sách khác", "https://thuvienso.hcmute.edu.vn/the-loai-khac/tat-ca-tai-lieu-the-loai-khac-2052-0.html"]
];

const decodeEntities = (text) => String(text || "")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, "\"")
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/\s+/g, " ")
  .trim();

function pageUrl(baseUrl, page) {
  if (page === 0) return baseUrl;

  const url = new URL(baseUrl);
  url.searchParams.set("vt", "moinhat");
  url.searchParams.set("ft", "all");
  url.searchParams.set("fft", "all");
  url.searchParams.set("fl", "all");
  url.searchParams.set("catetl", "0");
  url.searchParams.set("subcatetl", "0");
  url.searchParams.set("page", String(page + 1));
  return url.href;
}

function absoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return new URL(url.replace(/^\//, ""), `${BASE}/`).href;
}

function attr(html, name) {
  const match = html.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function inferYear(coverUrl) {
  const match = coverUrl.match(/thumbnail\/(\d{4})\//);
  return match ? Number(match[1]) : 2026;
}

function otherBookSubtype(title, category) {
  const text = `${title} ${category}`.toLowerCase();
  if (["truyện", "truyen", "tiểu thuyết", "tieu thuyet", "cổ tích", "co tich"].some((word) => text.includes(word))) return "Truyện";
  if (["văn học", "van hoc", "thơ", "tho ", "tác phẩm", "tac pham"].some((word) => text.includes(word))) return "Văn học";
  if (["kỹ năng", "ky nang", "kĩ năng", "ki nang", "giao tiếp", "lãnh đạo", "lanh dao"].some((word) => text.includes(word))) return "Kỹ năng sống";
  if (["ngôn ngữ", "ngoại ngữ", "tiếng anh", "english", "japanese", "chinese", "french"].some((word) => text.includes(word))) return "Ngoại ngữ";
  if (["khoa học tự nhiên", "vật lý", "hóa học", "sinh học", "toán", "khoa học phổ thông"].some((word) => text.includes(word))) return "Khoa học phổ thông";
  if (["lịch sử", "địa lý", "du lịch", "lich su", "dia ly", "du lich"].some((word) => text.includes(word))) return "Lịch sử - địa lý";
  return category || "Khác";
}

function extraFor(kind, category, title) {
  if (kind === "Giáo trình") return { maMonHoc: "HCMUTE", boMon: category };
  if (kind === "Sách khác") return { loaiSachKhac: otherBookSubtype(title, category) };
  if (kind === "Báo/tạp chí") return { soPhatHanh: 1, thangPhatHanh: 1 };
  if (kind === "Bài nghiên cứu") {
    return {
      coQuanChuQuan: "Trường Đại học Sư phạm Kỹ thuật TP.HCM",
      linhVuc: category
    };
  }
  return {};
}

function parseDocuments(html, category, kind) {
  const documents = [];
  const anchorPattern = /<a\b[^>]*href=["']([^"']*\/doc\/[^"']+\.html)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let anchorMatch;

  while ((anchorMatch = anchorPattern.exec(html))) {
    const img = anchorMatch[2].match(/<img\b[^>]*>/i)?.[0] || "";
    const title = attr(img, "alt") || decodeEntities(anchorMatch[2].replace(/<[^>]+>/g, " "));
    const coverImage = absoluteUrl(attr(img, "src"));
    const fileUrl = absoluteUrl(anchorMatch[1]);

    if (!title || !fileUrl || !coverImage || coverImage.includes("onerror") || BROKEN_COVER_URLS.has(coverImage)) continue;

    documents.push({
      title,
      kind,
      year: inferYear(coverImage),
      quantity: 1,
      author: "HCMUTE",
      publisher: "Thư viện số HCMUTE",
      category,
      coverImage,
      fileUrl,
      fileName: "Mở nguồn",
      extra: extraFor(kind, category, title)
    });
  }

  return documents;
}

async function fetchPage(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "accept": "text/html,application/xhtml+xml",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(800 * attempt);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const documents = [];
  const seen = new Set();
  const active = categories.map(([category, kind, url]) => ({ category, kind, url, page: 0, misses: 0 }));

  while (documents.length < TARGET_COUNT && active.length) {
    const batch = active.splice(0, Math.min(CONCURRENCY, active.length));
    const results = await Promise.all(batch.map(async (source) => {
      const url = pageUrl(source.url, source.page);
      try {
        const html = await fetchPage(url);
        return { source, items: parseDocuments(html, source.category, source.kind), url };
      } catch (error) {
        console.warn(`Skip ${url}: ${error.message}`);
        return { source, items: [], url };
      }
    }));

    for (const result of results) {
      let added = 0;
      for (const item of result.items) {
        if (seen.has(item.fileUrl)) continue;
        seen.add(item.fileUrl);
        documents.push(item);
        added += 1;
        if (documents.length >= TARGET_COUNT) break;
      }

      result.source.page += 1;
      result.source.misses = added ? 0 : result.source.misses + 1;
      if (documents.length < TARGET_COUNT && result.source.misses < 10) active.push(result.source);
    }

    console.log(`Collected ${documents.length}/${TARGET_COUNT}; active categories: ${active.length}`);
    await sleep(250);
  }

  const withIds = documents.slice(0, TARGET_COUNT).map((item, index) => ({
    id: `HCMUTE${String(index + 1).padStart(5, "0")}`,
    ...item
  }));

  const content = [
    "/* Generated by scripts/build-hcmute-catalog.mjs from https://thuvienso.hcmute.edu.vn/. */",
    `window.HCMUTE_CATALOG = ${JSON.stringify(withIds)};`,
    ""
  ].join("\n");

  if (!withIds.length) {
    throw new Error("No documents collected; keeping the existing catalog file unchanged.");
  }

  await writeFile(OUTPUT, content, "utf8");

  const counts = withIds.reduce((acc, item) => {
    acc[item.kind] = (acc[item.kind] || 0) + 1;
    return acc;
  }, {});
  console.log(`Wrote ${withIds.length} documents to ${OUTPUT.pathname}`);
  console.log(counts);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
