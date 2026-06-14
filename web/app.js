const STORAGE_KEY = "oop-library-web-v5";

const DEFAULT_ACCOUNTS = {
  admin: {
    password: "admin",
    role: "admin",
    name: "Quản trị viên",
    title: "Quản trị viên",
    personId: "AD001"
  }
};

const ROLE_HOME = {
  admin: "dashboard",
  staff: "dashboard",
  reader: "readerPortal"
};

const ROLE_PAGES = {
  admin: new Set(["dashboard", "documents", "readers", "loans", "inventory", "transactions"]),
  staff: new Set(["dashboard", "documents", "readers", "loans", "inventory", "transactions"]),
  reader: new Set(["readerPortal", "documents"])
};

let currentUser = null;

const KINDS = {
  TEXTBOOK: "Giáo trình",
  REFERENCE: "Sách tham khảo",
  OTHER_BOOK: "Sách khác",
  MAGAZINE: "Báo/tạp chí",
  RESEARCH: "Bài nghiên cứu"
};

const READER_TYPES = {
  STUDENT: "Sinh viên",
  STAFF: "Viên chức"
};

const otherBookTypes = [
  "Truyện",
  "Văn học",
  "Ngoại ngữ",
  "Khoa học phổ thông",
  "Lịch sử - địa lý",
  "Kỹ năng sống",
  "Luật",
  "Công nghệ thông tin",
  "Cơ khí chế tạo máy",
  "Cơ khí động lực",
  "Điện - Điện tử",
  "Xây dựng - Kiến trúc",
  "Kinh tế - Quản lý",
  "Y học - Sức khỏe",
  "Nông - Lâm - Ngư nghiệp",
  "Thực phẩm, Môi trường",
  "Khoa học xã hội",
  "Khoa học ứng dụng",
  "CN May - thời trang",
  "Nghệ thuật - Ẩm thực",
  "In - Truyền thông",
  "Thông tin Thư viện",
  "Khác"
];

const HCMUTE_SOURCE = [
  ["HCMUTE001", "Thực nghiệm quá trình tạo ngã rẽ trên thân ống kim loại", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260609/hcmute/ovanke/80x100/4761780968301.jpg", "https://thuvienso.hcmute.edu.vn/doc/thuc-nghiem-qua-trinh-tao-nga-re-tren-than-ong-kim-loai-1051690.html", "Nghiên cứu khoa học"],
  ["HCMUTE002", "Thiết kế hệ thống điều khiển thiết bị điện trong gia đình qua mạng Ethernet và phần mềm Android", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260608/hcmute/ovanke/80x100/8821780904401.jpg", "https://thuvienso.hcmute.edu.vn/doc/thiet-ke-he-thong-dieu-khien-thiet-bi-dien-trong-gia-dinh-qua-mang-ethernet-va-phan-mem-android-1051689.html", "Điện - điện tử"],
  ["HCMUTE003", "Xây dựng mô hình nghịch lưu 3 pha 5 bậc diode kẹp điều khiển bằng card DSP F28335", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260602/hcmute/ovanke/80x100/5221780363801.jpg", "https://thuvienso.hcmute.edu.vn/doc/xay-dung-mo-hinh-nghich-luu-3-pha-5-bac-diode-kep-dieu-khien-bang-card-dsp-f28335-1051640.html", "Điện - điện tử"],
  ["HCMUTE004", "Nghiên cứu ảnh những ảnh hưởng của các Tiktoker đến ý định mua mỹ phẩm của sinh viên tại Thành phố Hồ Chí Minh", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260526/hcmute/ovanke/80x100/8481779785401.jpg", "https://thuvienso.hcmute.edu.vn/doc/nghien-cuu-anh-nhung-anh-huong-cua-cac-tiktoker-den-y-dinh-mua-my-pham-cua-sinh-vien-tai-thanh-pho-h-1049855.html", "Kinh tế - xã hội"],
  ["HCMUTE005", "Các yếu tố ảnh hưởng đến quyết định thuê chỗ ở của sinh viên đại học ở Thủ Đức cũ", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260525/hcmute/ovanke/80x100/7001779695701.jpg", "https://thuvienso.hcmute.edu.vn/doc/cac-yeu-to-anh-huong-den-quyet-dinh-thue-cho-o-cua-sinh-vien-dai-hoc-o-thu-duc-cu-1049035.html", "Kinh tế - xã hội"],
  ["HCMUTE006", "Nghiên cứu các nhân tố tác động đến sự chấp nhận chuyển đổi số của các doanh nghiệp vừa và nhỏ - SV2025-139", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/4171779439801.jpg", "https://thuvienso.hcmute.edu.vn/doc/nghien-cuu-cac-nhan-to-tac-dong-den-su-chap-nhan-chuyen-doi-so-cua-cac-doanh-nghiep-vua-va-nho-sv2-1047121.html", "Chuyển đổi số"],
  ["HCMUTE007", "Thiết kế, chế tạo mô hình đóng mấu chốt cho khung thép chữ nhật - SV2025-298", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/5741779438602.jpg", "https://thuvienso.hcmute.edu.vn/doc/thiet-ke-che-tao-mo-hinh-dong-mau-chot-cho-khung-thep-chu-nhat-sv2025-298-1047118.html", "Cơ khí"],
  ["HCMUTE008", "Tác động của khuyến mãi chớp nhoáng đến quyết định mua hàng ngẫu hứng trên sàn thương mại điện tử - SV2025-127", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/6921779438301.jpg", "https://thuvienso.hcmute.edu.vn/doc/tac-dong-cua-khuyen-mai-chop-nhoang-den-quyet-dinh-mua-hang-ngau-hung-tren-san-thuong-mai-dien-tu-1047117.html", "Thương mại điện tử"],
  ["HCMUTE009", "Nghiên cứu ảnh hưởng của tôi lặp đến độ cứng và tổ chức tế vi của thép C45 khi nhiệt luyện - SV2025-289", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/3741779438002.jpg", "https://thuvienso.hcmute.edu.vn/doc/nghien-cuu-anh-huong-cua-toi-lap-den-do-cung-va-to-chuc-te-vi-cua-thep-c45-khi-nhiet-luyen-sv2025-1047116.html", "Vật liệu"],
  ["HCMUTE010", "Nghiên cứu chế tạo mô hình hàn ống tự động - SV2025-348", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/3911779437701.jpg", "https://thuvienso.hcmute.edu.vn/doc/nghien-cuu-che-tao-mo-hinh-han-ong-tu-dong-sv2025-348-1047115.html", "Cơ khí"],
  ["HCMUTE011", "Chế tạo mô hình tạo hình mặt cong bằng phương pháp chấn - SV2025-344", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/8101779437402.jpg", "https://thuvienso.hcmute.edu.vn/doc/che-tao-mo-hinh-tao-hinh-mat-cong-bang-phuong-phap-chan-sv2025-344-1047114.html", "Cơ khí"],
  ["HCMUTE012", "Nghiên cứu, lựa chọn loại nút giao thông phù hợp với giao thông Việt Nam - SV2025-253", "https://thuvienso.hcmute.edu.vn/images/libedu/document/thumbnail/2026/20260522/hcmute/ovanke/80x100/441779437101.jpg", "https://thuvienso.hcmute.edu.vn/doc/nghien-cuu-lua-chon-loai-nut-giao-thong-phu-hop-voi-giao-thong-viet-nam-sv2025-253-1047113.html", "Giao thông"]
];

const HCMUTE_DOCUMENTS = HCMUTE_SOURCE.map(([id, title, coverImage, fileUrl, linhVuc]) => ({
  id,
  title,
  kind: KINDS.RESEARCH,
  year: 2026,
  quantity: 1,
  author: "HCMUTE",
  publisher: "Thư viện số HCMUTE",
  category: "Tài liệu số",
  coverImage,
  fileUrl,
  fileName: "Mở nguồn",
  extra: {
    coQuanChuQuan: "Trường Đại học Sư phạm Kỹ thuật TP.HCM",
    linhVuc
  }
}));

const DOCUMENT_PAGE_SIZE = 120;
const DOCUMENT_OPTION_LIMIT = 250;

const todayISO = () => new Date().toISOString().slice(0, 10);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function addDays(dateText, days) {
  const date = new Date(`${dateText}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(startText, endText) {
  const start = new Date(`${startText}T12:00:00`);
  const end = new Date(`${endText}T12:00:00`);
  return Math.floor((end - start) / 86400000);
}

function formatDate(dateText) {
  if (!dateText) return "";
  const [year, month, day] = dateText.split("-");
  return `${day}/${month}/${year}`;
}

function money(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function plainText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function statusBadge(ok, okText, badText, badClass = "bad") {
  return `<span class="status ${ok ? "ok" : badClass}">${escapeHtml(ok ? okText : badText)}</span>`;
}

function coverCell(documentItem) {
  if (documentItem.coverImage) {
    return `<img class="cover-thumb" src="${escapeHtml(documentItem.coverImage)}" alt="Bìa ${escapeHtml(documentItem.title)}" loading="lazy" onerror="handleCoverError(this)">`;
  }
  if (isSourceOnlyCatalogItem(documentItem)) {
    return generatedCover(documentItem, "cover-thumb");
  }
  return `<span class="cover-thumb" aria-hidden="true"></span>`;
}

function generatedCover(documentItem, className) {
  const title = documentItem.title || "Sách";
  const label = documentItem.kind === KINDS.OTHER_BOOK ? documentDetail(documentItem) : documentItem.kind;
  return `
    <div class="${escapeHtml(className)} generated-cover" aria-label="Bìa ${escapeHtml(title)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(title)}</strong>
    </div>
  `;
}

function handleCoverError(img) {
  const row = img.closest("tr");
  if (row) {
    row.remove();
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.className = img.className || "cover-thumb";
  placeholder.setAttribute("aria-hidden", "true");
  img.replaceWith(placeholder);
}

function documentFileUrl(documentItem) {
  return documentItem.fileUrl || documentItem.fileData || "";
}

function isSourceOnlyCatalogItem(documentItem) {
  const url = documentFileUrl(documentItem);
  const fileName = String(documentItem.fileName || "");
  return Boolean(documentItem.extra?.nguon)
    || /^https?:\/\/thuvienso\.hcmute\.edu\.vn\//i.test(url)
    || (fileName === "Mở nguồn" && /^https?:\/\//i.test(url));
}

function isDigitalLibraryDocument(documentItem) {
  const url = documentFileUrl(documentItem);
  const publisher = plainText(documentItem.publisher || "");
  return /^https?:\/\/thuvienso\.hcmute\.edu\.vn\//i.test(url)
    || publisher.includes("thu vien so hcmute");
}

function sourceText(documentItem) {
  return plainText([
    documentItem.id,
    documentItem.title,
    documentItem.kind,
    documentItem.author,
    documentItem.publisher,
    documentItem.category,
    documentItem.extra?.loaiSachKhac,
    documentItem.extra?.linhVuc,
    documentItem.extra?.boMon,
    documentItem.extra?.docTruoc
  ].filter(Boolean).join(" "));
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function sourceKind(documentItem) {
  const text = sourceText(documentItem);
  const title = plainText(documentItem.title || "");
  const category = plainText(`${documentItem.kind || ""} ${documentItem.category || ""} ${documentItem.extra?.linhVuc || ""} ${documentItem.extra?.boMon || ""}`);

  if (hasAny(category, ["tap chi", "bao/tap chi", "ky yeu", "hoi thao"])) return KINDS.MAGAZINE;
  if (hasAny(category, ["giao trinh"]) || title.startsWith("giao trinh ")) return KINDS.TEXTBOOK;
  if (hasAny(category, ["tham khao", "reference"])) return KINDS.REFERENCE;
  if (hasAny(category, ["nghien cuu", "luan van", "luan an", "do an", "khoa luan", "bc nghien cuu"])
    || hasAny(title, ["nghien cuu ", "bao cao ", "luan van ", "luan an ", "do an ", "khoa luan "])) {
    return KINDS.RESEARCH;
  }
  if (hasAny(text, ["tap chi", "journal", "magazine", "ky yeu hoi thao"])) return KINDS.MAGAZINE;
  return KINDS.OTHER_BOOK;
}

function sourceOtherBookType(documentItem) {
  const text = sourceText(documentItem);

  if (hasAny(text, ["truyen", "fiction", "novel", "stories", "story", "fairy", "adventure", "children"])) return "Truyện";
  if (hasAny(text, ["van hoc", "literature", "poetry", "poems", "drama", "plays", "essays"])) return "Văn học";
  if (hasAny(text, ["ngoai ngu", "ngon ngu", "language", "grammar", "dictionary", "english", "french", "german", "spanish"])) return "Ngoại ngữ";
  if (hasAny(text, ["lich su", "dia ly", "du lich", "history", "geography", "travel", "biography", "memoir"])) return "Lịch sử - địa lý";
  if (hasAny(text, ["ky nang", "self-help", "conduct of life", "psychology", "ethics", "leadership"])) return "Kỹ năng sống";
  if (hasAny(text, ["luat", "law", "legal", "constitution"])) return "Luật";
  if (hasAny(text, ["cong nghe thong tin", "tin hoc", "computer", "software", "programming", "lap trinh", "java", "python", "ai ", "artificial intelligence", "information retrieval"])) return "Công nghệ thông tin";
  if (hasAny(text, ["co khi che tao may", "manufacturing", "machine design", "cnc", "han ", "welding"])) return "Cơ khí chế tạo máy";
  if (hasAny(text, ["co khi dong luc", "o to", "automotive", "engine", "vehicle"])) return "Cơ khí động lực";
  if (hasAny(text, ["dien - dien tu", "dien tu", "electrical", "electronics", "vhdl", "plc", "mach so", "vi mach"])) return "Điện - Điện tử";
  if (hasAny(text, ["xay dung", "kien truc", "construction", "architecture"])) return "Xây dựng - Kiến trúc";
  if (hasAny(text, ["kinh te", "quan ly", "business", "management", "marketing", "commerce", "finance"])) return "Kinh tế - Quản lý";
  if (hasAny(text, ["y hoc", "suc khoe", "medical", "health", "medicine", "breastfeeding"])) return "Y học - Sức khỏe";
  if (hasAny(text, ["nong - lam - ngu", "nong nghiep", "lam nghiep", "ngu nghiep", "agriculture", "forestry", "fishery"])) return "Nông - Lâm - Ngư nghiệp";
  if (hasAny(text, ["thuc pham", "moi truong", "food", "environment"])) return "Thực phẩm, Môi trường";
  if (hasAny(text, ["khoa hoc xa hoi", "social science", "sociology", "education"])) return "Khoa học xã hội";
  if (hasAny(text, ["khoa hoc ung dung", "applied science", "engineering", "technology"])) return "Khoa học ứng dụng";
  if (hasAny(text, ["may - thoi trang", "thoi trang", "garment", "fashion", "textile"])) return "CN May - thời trang";
  if (hasAny(text, ["nghe thuat", "am thuc", "art", "cookery", "cooking", "music"])) return "Nghệ thuật - Ẩm thực";
  if (hasAny(text, ["in - truyen thong", "truyen thong", "printing", "communication", "media"])) return "In - Truyền thông";
  if (hasAny(text, ["thong tin thu vien", "library", "catalog", "bibliography"])) return "Thông tin Thư viện";
  if (hasAny(text, ["khoa hoc tu nhien", "science", "mathematics", "physics", "chemistry", "biology", "nature", "astronomy"])) return "Khoa học phổ thông";
  return "Khác";
}

function normalizeSourceDocument(documentItem) {
  if (!isSourceOnlyCatalogItem(documentItem)) return documentItem;

  const normalized = {
    ...documentItem,
    extra: { ...(documentItem.extra || {}) }
  };
  normalized.kind = sourceKind(documentItem);

  if (normalized.kind === KINDS.TEXTBOOK) {
    normalized.extra.maMonHoc = normalized.extra.maMonHoc || "HCMUTE";
    normalized.extra.boMon = normalized.extra.boMon || normalized.category || "Giáo trình";
  } else if (normalized.kind === KINDS.REFERENCE) {
    normalized.category = normalized.category || "Tài liệu tham khảo";
  } else if (normalized.kind === KINDS.OTHER_BOOK) {
    normalized.extra.loaiSachKhac = sourceOtherBookType(normalized);
  } else if (normalized.kind === KINDS.MAGAZINE) {
    normalized.extra.soPhatHanh = normalized.extra.soPhatHanh || 1;
    normalized.extra.thangPhatHanh = normalized.extra.thangPhatHanh || 1;
  } else if (normalized.kind === KINDS.RESEARCH) {
    normalized.extra.coQuanChuQuan = normalized.extra.coQuanChuQuan || normalized.publisher || "Nguồn catalog";
    normalized.extra.linhVuc = normalized.extra.linhVuc || normalized.category || "Nghiên cứu";
  }

  normalized.fileName = "";
  return normalized;
}

function normalizeManagedDocument(documentItem) {
  const normalized = normalizeSourceDocument(documentItem);
  if (normalized === documentItem) return documentItem;
  Object.assign(documentItem, normalized);
  documentItem.extra = normalized.extra;
  return documentItem;
}

function fileCell(documentItem) {
  if (isSourceOnlyCatalogItem(documentItem)) return `<span class="file-pill" title="Chưa có file nội bộ">Chưa có file nội bộ</span>`;
  const url = documentFileUrl(documentItem);
  if (!url) return `<span class="file-pill" title="Chưa có file nội bộ">Chưa có file nội bộ</span>`;
  const label = escapeHtml(documentItem.fileName || "Mở file");
  return `<a class="file-pill ready" href="${escapeHtml(url)}" target="_blank" rel="noopener" title="${label}">${label}</a>`;
}

function fileStatusText(documentItem) {
  if (isSourceOnlyCatalogItem(documentItem) || !documentFileUrl(documentItem)) {
    return "Chưa có file nội bộ. Sách vẫn được quản lý như bản in: tra cứu bằng mã, nhập kho, mượn và trả.";
  }
  return `File nội bộ: ${documentItem.fileName || "Đã có file"}.`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Downscale an uploaded image to a small JPEG data URL so localStorage stays light.
function readImageAsThumb(file, maxSize = 480) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extraFieldsMarkup(kind) {
  if (kind === KINDS.TEXTBOOK) {
    return `
      <label>Mã môn học <input name="maMonHoc" required></label>
      <label>Bộ môn <input name="boMon" required></label>
    `;
  }
  if (kind === KINDS.OTHER_BOOK) {
    return `
      <label>Loại sách khác
        <select name="loaiSachKhac" required>
          ${otherBookTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (kind === KINDS.MAGAZINE) {
    return `
      <div class="form-grid">
        <label>Số phát hành <input name="soPhatHanh" type="number" min="1" value="1" required></label>
        <label>Tháng phát hành <input name="thangPhatHanh" type="number" min="1" max="12" value="1" required></label>
      </div>
    `;
  }
  if (kind === KINDS.RESEARCH) {
    return `
      <label>Cơ quan chủ quản <input name="coQuanChuQuan" required></label>
      <label>Lĩnh vực <input name="linhVuc" required></label>
    `;
  }
  return "";
}

function buildExtra(kind, data) {
  const extra = {};
  if (kind === KINDS.TEXTBOOK) {
    extra.maMonHoc = data.maMonHoc;
    extra.boMon = data.boMon;
  } else if (kind === KINDS.OTHER_BOOK) {
    extra.loaiSachKhac = data.loaiSachKhac;
  } else if (kind === KINDS.MAGAZINE) {
    extra.soPhatHanh = Number(data.soPhatHanh);
    extra.thangPhatHanh = Number(data.thangPhatHanh);
  } else if (kind === KINDS.RESEARCH) {
    extra.coQuanChuQuan = data.coQuanChuQuan;
    extra.linhVuc = data.linhVuc;
  }
  return extra;
}

function sampleState() {
  return {
    counters: {
      loan: 1,
      transaction: 1
    },
    accounts: clone(DEFAULT_ACCOUNTS),
    readers: [],
    staffs: [],
    admins: [
      {
        id: "AD001",
        name: "Quản trị viên",
        birth: "1990-10-10",
        gender: "Nam",
        phone: "0901000004",
        address: "TP. Hồ Chí Minh",
        username: "admin",
        permission: "Full"
      }
    ],
    documents: [],
    loans: [],
    transactions: [],
    seededSources: {}
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : sampleState();
  } catch {
    return sampleState();
  }
}

let state = loadState();
const viewState = {
  documentPage: 1,
  inventoryPage: 1
};

function seedHcmuteDocuments() {
  state.documents = Array.isArray(state.documents) ? state.documents : [];
  state.seededSources = state.seededSources || {};
  if (state.seededSources.hcmute202606) return;

  const existingIds = new Set(state.documents.map((documentItem) => documentItem.id));
  HCMUTE_DOCUMENTS.forEach((documentItem) => {
    if (!existingIds.has(documentItem.id)) {
      state.documents.push(clone(documentItem));
    }
  });

  state.seededSources.hcmute202606 = true;
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    if (document.querySelector("#toast")) {
      showToast("Không lưu được: bộ nhớ trình duyệt đầy. Hãy dùng link file thay vì tải file lên.");
    }
    return false;
  }
}

function nextId(prefix, key) {
  const value = state.counters[key]++;
  return `${prefix}${String(value).padStart(4, "0")}`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function byId(id) {
  return document.getElementById(id);
}

function findReader(id) {
  return state.readers.find((reader) => reader.id === id);
}

function findDocument(id) {
  const managed = state.documents.find((documentItem) => documentItem.id === id);
  if (managed) return normalizeManagedDocument(managed);
  return catalogDocuments().find((documentItem) => documentItem.id === id);
}

function catalogDocuments() {
  const catalogs = [];
  if (Array.isArray(window.GUTENBERG_CATALOG) && window.GUTENBERG_CATALOG.length) {
    catalogs.push(...window.GUTENBERG_CATALOG);
  }
  return catalogs.map(normalizeSourceDocument);
}

function allDocuments() {
  const rows = [];
  const seenIds = new Set();
  const seenUrls = new Set();

  [
    ...state.documents.map(normalizeManagedDocument).filter((documentItem) => !isDigitalLibraryDocument(documentItem)),
    ...catalogDocuments()
  ].forEach((documentItem) => {
    const url = documentFileUrl(documentItem);
    if (seenIds.has(documentItem.id) || (url && seenUrls.has(url))) return;
    seenIds.add(documentItem.id);
    if (url) seenUrls.add(url);
    rows.push(documentItem);
  });

  return rows;
}

function ensureManagedDocument(id) {
  id = String(id || "").trim().toUpperCase();
  const managed = state.documents.find((documentItem) => documentItem.id === id);
  if (managed) return normalizeManagedDocument(managed);

  const catalogItem = catalogDocuments().find((documentItem) => documentItem.id === id);
  if (!catalogItem) return null;

  const copy = clone(catalogItem);
  state.documents.push(copy);
  return normalizeManagedDocument(copy);
}

function documentOptionsMarkup(documents, query = "") {
  const needle = plainText(query);
  const source = needle
    ? documents.filter((documentItem) => {
      const haystack = plainText(`${documentItem.id} ${documentItem.title} ${documentItem.author}`);
      return haystack.includes(needle);
    })
    : documents;
  return source.slice(0, DOCUMENT_OPTION_LIMIT).map((documentItem) => (
    `<option value="${escapeHtml(documentItem.id)}">${escapeHtml(documentItem.title)} (${escapeHtml(documentItem.quantity)})</option>`
  )).join("");
}

function refreshDocumentDatalist(inputId, datalistId, documents = allDocuments()) {
  const input = byId(inputId);
  const datalist = byId(datalistId);
  if (!input || !datalist) return;
  datalist.innerHTML = documentOptionsMarkup(documents, input.value);
}

function personIdExists(id) {
  return state.readers.some((reader) => reader.id === id)
    || state.staffs.some((staff) => staff.id === id)
    || state.admins.some((admin) => admin.id === id);
}

function currentReaderProfile() {
  if (!currentUser || currentUser.role !== "reader") return null;
  return findReader(currentUser.readerId);
}

function canAccessPage(pageName) {
  if (!currentUser) return pageName === "dashboard";
  return ROLE_PAGES[currentUser.role]?.has(pageName) || false;
}

function homePage() {
  return ROLE_HOME[currentUser?.role] || "dashboard";
}

function isBorrowable(documentItem) {
  return [KINDS.TEXTBOOK, KINDS.REFERENCE, KINDS.OTHER_BOOK].includes(documentItem.kind);
}

function loanDays(reader, documentItem) {
  if (documentItem.kind === KINDS.TEXTBOOK) return 180;
  if (documentItem.kind === KINDS.REFERENCE) return reader.type === READER_TYPES.STUDENT ? 15 : 90;
  if (documentItem.kind === KINDS.OTHER_BOOK) return reader.type === READER_TYPES.STUDENT ? 7 : 30;
  return 0;
}

function documentDetail(documentItem) {
  if (documentItem.kind === KINDS.TEXTBOOK) {
    return `${documentItem.extra.maMonHoc || ""} - ${documentItem.extra.boMon || ""}`;
  }
  if (documentItem.kind === KINDS.OTHER_BOOK) {
    return documentItem.extra.loaiSachKhac || "Khác";
  }
  if (documentItem.kind === KINDS.MAGAZINE) {
    return `Số ${documentItem.extra.soPhatHanh || ""}, tháng ${documentItem.extra.thangPhatHanh || ""}`;
  }
  if (documentItem.kind === KINDS.RESEARCH) {
    return `${documentItem.extra.coQuanChuQuan || ""} - ${documentItem.extra.linhVuc || ""}`;
  }
  return documentItem.category;
}

function documentPreview(documentItem) {
  if (documentItem.extra?.docTruoc) return documentItem.extra.docTruoc;
  if (documentItem.extra?.linhVuc) {
    return `Mô tả/chủ đề: tài liệu thuộc lĩnh vực ${documentItem.extra.linhVuc}. Dùng thông tin này để tra cứu, nhập kho và quản lý mượn/trả.`;
  }
  if (isSourceOnlyCatalogItem(documentItem)) {
    return `Mô tả/chủ đề: ${documentItem.kind} thuộc thể loại ${documentItem.category || documentDetail(documentItem)}. Dùng thông tin này để tra cứu, nhập kho và quản lý mượn/trả.`;
  }
  return "";
}

function documentKindLabel(documentItem) {
  const detail = documentDetail(documentItem);
  if (documentItem.kind === KINDS.OTHER_BOOK && detail) {
    return `${documentItem.kind} / ${detail}`;
  }
  return documentItem.kind;
}

function transactionNote(transaction) {
  const documentItem = findDocument(transaction.documentId);
  const documentName = documentItem ? documentItem.title : transaction.documentId;

  if (transaction.type === "Nhập") {
    return `${documentName} - nhập ${transaction.quantity} bản từ ${transaction.supplier}`;
  }
  if (transaction.type === "Xuất") {
    return `${documentName} - xuất ${transaction.quantity} bản (${transaction.reason})`;
  }

  const reader = findReader(transaction.readerId);
  const readerName = reader ? reader.name : transaction.readerId;
  return `${readerName || ""} - ${documentName || ""}`;
}

function renderStats() {
  const documents = allDocuments();
  const totalCopies = documents.reduce((sum, documentItem) => sum + Number(documentItem.quantity), 0);
  const overdue = state.loans.filter((loan) => loan.dueDate < todayISO()).length;
  const stats = [
    { label: "Đầu tài liệu", value: documents.length, tone: "cyan" },
    { label: "Tổng bản sách", value: totalCopies, tone: "green" },
    { label: "Người đọc", value: state.readers.length, tone: "amber" },
    { label: "Quá hạn", value: overdue, tone: "rose" }
  ];

  byId("statsGrid").innerHTML = stats.map((item) => `
    <article class="stat-card" data-tone="${item.tone}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </article>
  `).join("");
}

function renderDashboardLists() {
  const openLoans = state.loans.slice(0, 4);
  byId("openLoansList").innerHTML = openLoans.length ? openLoans.map((loan) => {
    const reader = findReader(loan.readerId);
    const documentItem = findDocument(loan.documentId);
    const late = loan.dueDate < todayISO();
    return `
      <article class="loan-item">
        <strong>${escapeHtml(documentItem ? documentItem.title : loan.documentId)}</strong>
        <span>${escapeHtml(reader ? reader.name : loan.readerId)} - hẹn trả ${escapeHtml(formatDate(loan.dueDate))}</span>
        <span class="status ${late ? "bad" : "ok"}">${late ? "Quá hạn" : "Đang mượn"}</span>
      </article>
    `;
  }).join("") : `<p class="muted">Không có phiếu mượn đang mở.</p>`;

  const recent = state.transactions.slice(-5).reverse();
  byId("recentTransactions").innerHTML = recent.length ? recent.map((transaction) => `
    <article class="activity-item">
      <strong>${escapeHtml(transaction.id)} - ${escapeHtml(transaction.type)}</strong>
      <span>${escapeHtml(formatDate(transaction.date))} - ${escapeHtml(transactionNote(transaction))}</span>
    </article>
  `).join("") : `<p class="muted">Chưa có giao dịch.</p>`;
}

function pageCount(total) {
  return Math.max(1, Math.ceil(total / DOCUMENT_PAGE_SIZE));
}

function clampPage(page, total) {
  return Math.min(Math.max(1, page), pageCount(total));
}

function pageRows(rows, page) {
  const start = (page - 1) * DOCUMENT_PAGE_SIZE;
  return rows.slice(start, start + DOCUMENT_PAGE_SIZE);
}

function renderPager(id, page, total, target) {
  const pager = byId(id);
  if (!pager) return;
  const totalPages = pageCount(total);
  pager.innerHTML = `
    <button type="button" class="pager-button" data-page-target="${target}" data-page-action="first" ${page <= 1 ? "disabled" : ""}>Đầu</button>
    <button type="button" class="pager-button" data-page-target="${target}" data-page-action="prev" ${page <= 1 ? "disabled" : ""}>Trước</button>
    <span class="pager-info">Trang ${escapeHtml(page)} / ${escapeHtml(totalPages)}</span>
    <button type="button" class="pager-button" data-page-target="${target}" data-page-action="next" ${page >= totalPages ? "disabled" : ""}>Sau</button>
    <button type="button" class="pager-button" data-page-target="${target}" data-page-action="last" ${page >= totalPages ? "disabled" : ""}>Cuối</button>
  `;
}

function renderDocuments() {
  const keyword = plainText(byId("documentSearch").value.trim());
  const type = byId("documentTypeFilter").value;
  const otherType = byId("otherBookTypeFilter").value;
  const rows = allDocuments().filter((documentItem) => {
    const haystack = plainText(`${documentItem.id} ${documentItem.title} ${documentItem.author} ${documentItem.publisher} ${documentDetail(documentItem)}`);
    const matchKeyword = !keyword || haystack.includes(keyword);
    const matchType = type === "all" || documentItem.kind === type;
    const matchOtherType = otherType === "all"
      || (documentItem.kind === KINDS.OTHER_BOOK && documentDetail(documentItem) === otherType);
    return matchKeyword && matchType && matchOtherType;
  });
  viewState.documentPage = clampPage(viewState.documentPage, rows.length);
  const visibleRows = pageRows(rows, viewState.documentPage);
  const start = rows.length ? (viewState.documentPage - 1) * DOCUMENT_PAGE_SIZE + 1 : 0;
  const end = rows.length ? start + visibleRows.length - 1 : 0;

  byId("documentCount").textContent = `${rows.length} mục, đang xem ${start}-${end}`;
  renderPager("documentPager", viewState.documentPage, rows.length, "documents");
  byId("documentsTable").innerHTML = visibleRows.map((documentItem) => `
    <tr>
      <td>${coverCell(documentItem)}</td>
      <td><strong>${escapeHtml(documentItem.id)}</strong></td>
      <td>${escapeHtml(documentItem.title)}<br><span class="muted">${escapeHtml(documentItem.author)} - ${escapeHtml(documentItem.publisher)}</span></td>
      <td>${escapeHtml(documentKindLabel(documentItem))}</td>
      <td>${statusBadge(documentItem.quantity > 0, documentItem.quantity, documentItem.quantity, "warn")}</td>
      <td>${fileCell(documentItem)}</td>
      <td><button class="text-button" type="button" data-detail="${escapeHtml(documentItem.id)}">Chi tiết</button></td>
    </tr>
  `).join("") || `<tr><td colspan="7" class="muted">Không có tài liệu phù hợp.</td></tr>`;
}

function renderReaders() {
  byId("readerCount").textContent = `${state.readers.length} người`;
  byId("readersTable").innerHTML = state.readers.map((reader) => {
    const expired = reader.expires < todayISO();
    return `
      <tr>
        <td><strong>${escapeHtml(reader.id)}</strong></td>
        <td>${escapeHtml(reader.name)}<br><span class="muted">${escapeHtml(reader.phone)} - ${escapeHtml(reader.address)}</span></td>
        <td>${escapeHtml(reader.type)}<br><span class="muted">${escapeHtml(reader.code)}</span></td>
        <td><span class="status ${expired ? "bad" : "ok"}">${expired ? "Hết hạn" : "Còn hạn"}</span></td>
        <td>${escapeHtml(reader.borrowed)}/${escapeHtml(reader.limit)}</td>
      </tr>
    `;
  }).join("");
}

function renderPeople() {
  const rows = [
    ...state.readers.map((reader) => ({
      id: reader.id,
      name: reader.name,
      role: reader.type,
      contact: `${reader.phone} - ${reader.address}`,
      detail: `Thẻ: ${formatDate(reader.registered)} - ${formatDate(reader.expires)}; mượn ${reader.borrowed}/${reader.limit}`
    })),
    ...state.staffs.map((staff) => ({
      id: staff.id,
      name: staff.name,
      role: "Nhân viên",
      contact: `${staff.phone} - ${staff.address}`,
      detail: `${staff.position}; ca ${staff.shift}; lương ${money(staff.salary)}`
    })),
    ...state.admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      role: "Quản trị viên",
      contact: `${admin.phone} - ${admin.address}`,
      detail: `Tài khoản ${admin.username}; quyền ${admin.permission}`
    }))
  ];

  byId("peopleCount").textContent = `${rows.length} người`;
  byId("peopleTable").innerHTML = rows.map((person) => `
    <tr>
      <td><strong>${escapeHtml(person.id)}</strong></td>
      <td>${escapeHtml(person.name)}</td>
      <td>${escapeHtml(person.role)}</td>
      <td>${escapeHtml(person.contact)}</td>
      <td>${escapeHtml(person.detail)}</td>
    </tr>
  `).join("");
}

function renderLoanSelects() {
  byId("borrowReaderSelect").innerHTML = state.readers.map((reader) => (
    `<option value="${escapeHtml(reader.id)}">${escapeHtml(reader.id)} - ${escapeHtml(reader.name)} (${escapeHtml(reader.type)})</option>`
  )).join("");

  const documents = allDocuments().filter((documentItem) => isBorrowable(documentItem));
  refreshDocumentDatalist("borrowDocumentInput", "borrowDocumentSelect", documents);

  byId("returnLoanSelect").innerHTML = state.loans.map((loan) => {
    const reader = findReader(loan.readerId);
    const documentItem = findDocument(loan.documentId);
    return `<option value="${escapeHtml(loan.id)}">${escapeHtml(loan.id)} - ${escapeHtml(reader?.name || loan.readerId)} / ${escapeHtml(documentItem?.title || loan.documentId)}</option>`;
  }).join("") || `<option value="">Không có phiếu đang mở</option>`;
}

function renderLoans() {
  byId("loanCount").textContent = `${state.loans.length} phiếu`;
  byId("loansTable").innerHTML = state.loans.map((loan) => {
    const reader = findReader(loan.readerId);
    const documentItem = findDocument(loan.documentId);
    const late = loan.dueDate < todayISO();
    return `
      <tr>
        <td><strong>${escapeHtml(loan.id)}</strong></td>
        <td>${escapeHtml(reader ? reader.name : loan.readerId)}</td>
        <td>${escapeHtml(documentItem ? documentItem.title : loan.documentId)}</td>
        <td>${escapeHtml(formatDate(loan.borrowDate))}</td>
        <td>${escapeHtml(formatDate(loan.dueDate))}</td>
        <td><span class="status ${late ? "bad" : "ok"}">${late ? "Quá hạn" : "Đang mượn"}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6" class="muted">Không có phiếu mượn đang mở.</td></tr>`;

  renderLoanSelects();
}

function renderInventory() {
  const documents = allDocuments();
  viewState.inventoryPage = clampPage(viewState.inventoryPage, documents.length);
  const visibleRows = pageRows(documents, viewState.inventoryPage);

  refreshDocumentDatalist("importDocumentInput", "importDocumentSelect", documents);
  refreshDocumentDatalist("exportDocumentInput", "exportDocumentSelect", documents);
  refreshDocumentDatalist("fileDocumentInput", "fileDocumentSelect", documents);
  const start = documents.length ? (viewState.inventoryPage - 1) * DOCUMENT_PAGE_SIZE + 1 : 0;
  const end = documents.length ? start + visibleRows.length - 1 : 0;
  byId("inventoryCount").textContent = `${documents.length} mục, đang xem ${start}-${end}`;
  renderPager("inventoryPager", viewState.inventoryPage, documents.length, "inventory");
  byId("inventoryTable").innerHTML = visibleRows.map((documentItem) => `
    <tr>
      <td>${coverCell(documentItem)}</td>
      <td><strong>${escapeHtml(documentItem.id)}</strong></td>
      <td>${escapeHtml(documentItem.title)}<br><span class="muted">${escapeHtml(documentItem.author)} - ${escapeHtml(documentItem.publisher)}</span></td>
      <td>${escapeHtml(documentKindLabel(documentItem))}</td>
      <td>${escapeHtml(documentItem.quantity)}</td>
      <td>${fileCell(documentItem)}</td>
      <td>${statusBadge(documentItem.quantity > 0, "Còn tài liệu", "Hết tài liệu", "warn")}</td>
    </tr>
  `).join("") || `<tr><td colspan="7" class="muted">Chưa có tài liệu.</td></tr>`;
}

function renderTransactions() {
  byId("transactionCount").textContent = `${state.transactions.length} giao dịch`;
  byId("transactionsTable").innerHTML = state.transactions.slice().reverse().map((transaction) => `
    <tr>
      <td><strong>${escapeHtml(transaction.id)}</strong></td>
      <td>${escapeHtml(transaction.type)}</td>
      <td>${escapeHtml(formatDate(transaction.date))}</td>
      <td>${escapeHtml(transaction.staffId)}</td>
      <td>${escapeHtml(transactionNote(transaction))}</td>
      <td>${transaction.amount ? money(transaction.amount) : "-"}</td>
    </tr>
  `).join("") || `<tr><td colspan="6" class="muted">Chưa có giao dịch.</td></tr>`;
}

function renderReaderPortal() {
  const reader = currentReaderProfile();
  const info = byId("readerPortalInfo");
  const stats = byId("readerPortalStats");
  const loansTable = byId("readerLoansTable");
  const transactionsTable = byId("readerTransactionsTable");

  if (!reader) {
    info.innerHTML = `<p class="muted">Không có hồ sơ độc giả.</p>`;
    stats.innerHTML = "";
    loansTable.innerHTML = `<tr><td colspan="5" class="muted">Không có dữ liệu.</td></tr>`;
    transactionsTable.innerHTML = `<tr><td colspan="5" class="muted">Không có dữ liệu.</td></tr>`;
    return;
  }

  const readerLoans = state.loans.filter((loan) => loan.readerId === reader.id);
  const readerTransactions = state.transactions.filter((transaction) => transaction.readerId === reader.id);
  const overdue = readerLoans.filter((loan) => loan.dueDate < todayISO()).length;

  info.innerHTML = `
    <div class="info-row"><span>Mã độc giả</span><strong>${escapeHtml(reader.id)}</strong></div>
    <div class="info-row"><span>Họ tên</span><strong>${escapeHtml(reader.name)}</strong></div>
    <div class="info-row"><span>Nhóm</span><strong>${escapeHtml(reader.type)}</strong></div>
    <div class="info-row"><span>Thẻ hết hạn</span><strong>${escapeHtml(formatDate(reader.expires))}</strong></div>
  `;

  stats.innerHTML = `
    <div class="stat-row"><span>Đang mượn</span><strong>${escapeHtml(reader.borrowed)}/${escapeHtml(reader.limit)}</strong></div>
    <div class="stat-row"><span>Quá hạn</span><strong>${escapeHtml(overdue)}</strong></div>
    <div class="stat-row"><span>Giao dịch</span><strong>${escapeHtml(readerTransactions.length)}</strong></div>
  `;

  byId("readerLoanCount").textContent = `${readerLoans.length} phiếu`;
  loansTable.innerHTML = readerLoans.map((loan) => {
    const documentItem = findDocument(loan.documentId);
    const late = loan.dueDate < todayISO();
    return `
      <tr>
        <td><strong>${escapeHtml(loan.id)}</strong></td>
        <td>${escapeHtml(documentItem ? documentItem.title : loan.documentId)}</td>
        <td>${escapeHtml(formatDate(loan.borrowDate))}</td>
        <td>${escapeHtml(formatDate(loan.dueDate))}</td>
        <td><span class="status ${late ? "bad" : "ok"}">${late ? "Quá hạn" : "Đang mượn"}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="5" class="muted">Không có tài liệu đang mượn.</td></tr>`;

  byId("readerTransactionCount").textContent = `${readerTransactions.length} giao dịch`;
  transactionsTable.innerHTML = readerTransactions.slice().reverse().map((transaction) => {
    const documentItem = findDocument(transaction.documentId);
    return `
      <tr>
        <td><strong>${escapeHtml(transaction.id)}</strong></td>
        <td>${escapeHtml(transaction.type)}</td>
        <td>${escapeHtml(formatDate(transaction.date))}</td>
        <td>${escapeHtml(documentItem ? documentItem.title : transaction.documentId)}</td>
        <td>${transaction.amount ? money(transaction.amount) : "-"}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="5" class="muted">Chưa có giao dịch.</td></tr>`;
}

function renderAll() {
  renderStats();
  renderDashboardLists();
  renderDocuments();
  renderReaders();
  renderPeople();
  renderLoans();
  renderInventory();
  renderTransactions();
  renderReaderPortal();
}

function setPage(pageName) {
  const nextPage = canAccessPage(pageName) ? pageName : homePage();
  const page = byId(`${nextPage}Page`);
  if (!page) return;

  document.querySelectorAll(".page").forEach((pageItem) => pageItem.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));

  page.classList.add("active");
  byId("pageTitle").textContent = page.dataset.title || "";
  document.querySelector(`[data-page="${nextPage}"]`)?.classList.add("active");
}

function renderDocumentExtraFields() {
  byId("documentExtraFields").innerHTML = extraFieldsMarkup(byId("documentKind").value);
}

function renderImportExtraFields() {
  byId("importExtraFields").innerHTML = extraFieldsMarkup(byId("importKind").value);
}

async function handleDocumentSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();

  if (allDocuments().some((documentItem) => documentItem.id === id)) {
    showToast("Mã tài liệu đã tồn tại.");
    return;
  }

  const documentItem = {
    id,
    title: data.title.trim(),
    kind: data.kind,
    year: Number(data.year),
    quantity: Number(data.quantity),
    author: data.author.trim(),
    publisher: data.publisher.trim(),
    category: data.category.trim(),
    extra: buildExtra(data.kind, data)
  };

  await attachFiles(documentItem, form);

  state.documents.push(documentItem);
  saveState();
  form.reset();
  renderDocumentExtraFields();
  renderAll();
  showToast("Đã thêm tài liệu mới.");
}

// Read cover image (downscaled) and book file from a form into the document object.
async function attachFiles(documentItem, form) {
  const coverFile = form.coverImage?.files?.[0];
  if (coverFile) documentItem.coverImage = await readImageAsThumb(coverFile);

  const bookFile = form.bookFile?.files?.[0];
  if (bookFile) {
    documentItem.fileName = bookFile.name;
    documentItem.fileData = await readFileAsDataURL(bookFile);
  }

  const url = form.fileUrl?.value?.trim();
  if (url) {
    documentItem.fileUrl = url;
    if (!documentItem.fileName) documentItem.fileName = url.split("/").pop() || "Mở file";
  }
}

function handleReaderSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();

  if (personIdExists(id)) {
    showToast("Mã người đã tồn tại.");
    return;
  }

  state.readers.push({
    id,
    name: data.name.trim(),
    type: data.type,
    birth: data.birth,
    gender: data.gender,
    registered: data.registered,
    expires: data.expires,
    phone: data.phone.trim(),
    address: data.address.trim(),
    code: data.code.trim(),
    borrowed: 0,
    limit: data.type === READER_TYPES.STUDENT ? 5 : 10
  });


  saveState();
  form.reset();
  setDefaultDates();
  renderAll();
  showToast("Đã thêm người đọc.");
}

function handleStaffSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();
  const username = data.username.trim().toLowerCase();

  if (personIdExists(id)) {
    showToast("Mã người đã tồn tại.");
    return;
  }
  if (state.accounts[username]) {
    showToast("Tài khoản đã tồn tại.");
    return;
  }

  state.staffs.push({
    id,
    name: data.name.trim(),
    birth: data.birth,
    gender: data.gender,
    phone: data.phone.trim(),
    address: data.address.trim(),
    position: data.position.trim(),
    salary: Number(data.salary),
    shift: data.shift.trim()
  });
  state.accounts[username] = {
    password: data.password,
    role: "staff",
    name: data.name.trim(),
    title: "Nhân viên",
    personId: id
  };

  saveState();
  form.reset();
  setDefaultDates();
  renderAll();
  showToast("Đã thêm nhân viên.");
}

function handleAdminSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();
  const username = data.username.trim().toLowerCase();

  if (personIdExists(id)) {
    showToast("Mã người đã tồn tại.");
    return;
  }
  if (state.accounts[username]) {
    showToast("Tài khoản đã tồn tại.");
    return;
  }

  state.admins.push({
    id,
    name: data.name.trim(),
    birth: data.birth,
    gender: data.gender,
    phone: data.phone.trim(),
    address: data.address.trim(),
    username,
    permission: data.permission.trim()
  });
  state.accounts[username] = {
    password: data.password,
    role: "admin",
    name: data.name.trim(),
    title: "Quản trị viên",
    personId: id
  };

  saveState();
  form.reset();
  setDefaultDates();
  renderAll();
  showToast("Đã thêm quản trị viên.");
}

function handleBorrowSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  data.documentId = String(data.documentId || "").trim().toUpperCase();
  const reader = findReader(data.readerId);
  const documentItem = ensureManagedDocument(data.documentId);

  if (!reader || !documentItem) {
    showToast("Dữ liệu người đọc hoặc tài liệu không hợp lệ.");
    return;
  }
  if (reader.expires < data.borrowDate) {
    showToast("Thẻ người đọc đã hết hạn.");
    return;
  }
  if (reader.borrowed >= reader.limit) {
    showToast("Người đọc đã vượt giới hạn mượn.");
    return;
  }
  if (!isBorrowable(documentItem)) {
    showToast("Tài liệu này chỉ đọc hoặc tra cứu tại chỗ.");
    return;
  }
  if (documentItem.quantity <= 0) {
    showToast("Tài liệu đã hết số lượng.");
    return;
  }
  if (state.loans.some((loan) => loan.readerId === reader.id && loan.documentId === documentItem.id)) {
    showToast("Người đọc đang mượn tài liệu này.");
    return;
  }

  const days = loanDays(reader, documentItem);
  const loan = {
    id: nextId("PM", "loan"),
    readerId: reader.id,
    documentId: documentItem.id,
    borrowDate: data.borrowDate,
    dueDate: addDays(data.borrowDate, days)
  };

  documentItem.quantity -= 1;
  reader.borrowed += 1;
  state.loans.push(loan);
  state.transactions.push({
    id: nextId("GD", "transaction"),
    type: "Mượn",
    date: data.borrowDate,
    staffId: data.staffId.trim(),
    readerId: reader.id,
    documentId: documentItem.id,
    amount: 0
  });

  saveState();
  renderAll();
  byId("borrowHint").textContent = `Hạn mượn ${days} ngày, hẹn trả ${formatDate(loan.dueDate)}.`;
  showToast("Đã ghi nhận mượn tài liệu.");
}

function handleReturnSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const loanIndex = state.loans.findIndex((loan) => loan.id === data.loanId);

  if (loanIndex < 0) {
    showToast("Không có phiếu mượn để trả.");
    return;
  }

  const loan = state.loans[loanIndex];
  const reader = findReader(loan.readerId);
  const documentItem = findDocument(loan.documentId);
  const lateDays = Math.max(0, daysBetween(loan.dueDate, data.returnDate));
  const fine = lateDays * 5000;

  if (documentItem) documentItem.quantity += 1;
  if (reader) reader.borrowed = Math.max(0, reader.borrowed - 1);

  state.loans.splice(loanIndex, 1);
  state.transactions.push({
    id: nextId("GD", "transaction"),
    type: "Trả",
    date: data.returnDate,
    staffId: data.staffId.trim(),
    readerId: loan.readerId,
    documentId: loan.documentId,
    amount: fine
  });

  saveState();
  renderAll();
  byId("returnHint").textContent = `Trễ ${lateDays} ngày, tiền phạt ${money(fine)} VND.`;
  showToast("Đã xác nhận trả tài liệu.");
}

async function handleImportSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const quantity = Number(data.quantity);
  const unitPrice = Number(data.unitPrice);
  let documentItem;

  if (data.importMode === "new") {
    const id = data.id.trim().toUpperCase();
    if (allDocuments().some((item) => item.id === id)) {
      showToast("Mã tài liệu đã tồn tại.");
      return;
    }
    documentItem = {
      id,
      title: data.title.trim(),
      kind: data.kind,
      year: Number(data.year),
      quantity: 0,
      author: data.author.trim(),
      publisher: data.publisher.trim(),
      category: data.category.trim(),
      extra: buildExtra(data.kind, data)
    };
    await attachFiles(documentItem, form);
    state.documents.push(documentItem);
  } else {
    data.documentId = String(data.documentId || "").trim().toUpperCase();
    documentItem = ensureManagedDocument(data.documentId);
    if (!documentItem) {
      showToast("Không tìm thấy tài liệu cần nhập.");
      return;
    }
  }

  documentItem.quantity += quantity;
  state.transactions.push({
    id: nextId("GD", "transaction"),
    type: "Nhập",
    date: data.date,
    staffId: data.staffId.trim(),
    documentId: documentItem.id,
    quantity,
    unitPrice,
    supplier: data.supplier.trim(),
    amount: quantity * unitPrice
  });

  saveState();
  form.reset();
  toggleImportMode();
  setDefaultDates();
  renderAll();
  byId("importHint").textContent = `Số lượng hiện tại: ${documentItem.quantity}.`;
  showToast("Đã ghi nhận nhập tài liệu.");
}

function toggleImportMode() {
  const newMode = byId("importMode").value === "new";
  byId("importExistingFields").hidden = newMode;
  byId("importNewFields").hidden = !newMode;
  byId("importDocumentInput").disabled = newMode;
  byId("importNewFields").querySelectorAll("input, select").forEach((el) => {
    el.disabled = !newMode;
  });
  if (newMode) renderImportExtraFields();
}

async function handleDocumentFileSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const documentItem = ensureManagedDocument(form.documentId.value);
  if (!documentItem) {
    showToast("Không tìm thấy tài liệu.");
    return;
  }

  const bookFile = form.bookFile.files[0];
  const url = form.fileUrl.value.trim();
  if (!bookFile && !url) {
    showToast("Hãy chọn file hoặc nhập link.");
    return;
  }

  if (bookFile) {
    documentItem.fileName = bookFile.name;
    documentItem.fileData = await readFileAsDataURL(bookFile);
    documentItem.fileUrl = "";
  }
  if (url) {
    documentItem.fileUrl = url;
    if (!bookFile) documentItem.fileName = url.split("/").pop() || "Mở file";
  }

  saveState();
  form.reset();
  renderAll();
  byId("fileUpdateHint").textContent = `Đã cập nhật file cho ${documentItem.title}.`;
  showToast("Đã cập nhật file sách.");
}

function openDocumentModal(id) {
  const documentItem = findDocument(id);
  if (!documentItem) return;
  const preview = documentPreview(documentItem);

  const rows = [
    ["Mã tài liệu", documentItem.id],
    ["Loại", documentItem.kind],
    ["Tác giả", documentItem.author],
    ["Nhà xuất bản", documentItem.publisher],
    ["Năm xuất bản", documentItem.year],
    ["Thể loại", documentItem.category],
    ["Số lượng", documentItem.quantity],
    ["Thông tin riêng", documentDetail(documentItem)]
  ];

  byId("documentModalContent").innerHTML = `
    <div class="document-detail">
      <div>
        ${documentItem.coverImage
          ? `<img class="cover-large" src="${escapeHtml(documentItem.coverImage)}" alt="Bìa ${escapeHtml(documentItem.title)}">`
          : isSourceOnlyCatalogItem(documentItem)
            ? generatedCover(documentItem, "cover-large")
            : `<div class="cover-large"></div>`}
      </div>
      <div>
        <h2>${escapeHtml(documentItem.title)}</h2>
        <div class="reader-info">
          ${rows.map(([key, value]) => `<div class="info-row"><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
        </div>
        ${preview ? `<div class="document-preview"><strong>Thông tin xem trước</strong><p>${escapeHtml(preview)}</p></div>` : ""}
        <p class="form-note">${escapeHtml(fileStatusText(documentItem))}</p>
      </div>
    </div>
  `;

  byId("documentModal").hidden = false;
  byId("closeDocumentModal").focus();
}

function closeDocumentModal() {
  byId("documentModal").hidden = true;
}

function handleExportSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  data.documentId = String(data.documentId || "").trim().toUpperCase();
  const documentItem = ensureManagedDocument(data.documentId);
  const quantity = Number(data.quantity);
  const unitPrice = Number(data.unitPrice);

  if (!documentItem) {
    showToast("Không tìm thấy tài liệu cần xuất.");
    return;
  }
  if (quantity > documentItem.quantity) {
    showToast("Số lượng xuất vượt quá tồn kho.");
    return;
  }

  documentItem.quantity -= quantity;
  state.transactions.push({
    id: nextId("GD", "transaction"),
    type: "Xuất",
    date: data.date,
    staffId: data.staffId.trim(),
    documentId: documentItem.id,
    quantity,
    unitPrice,
    reason: data.reason.trim(),
    amount: quantity * unitPrice
  });

  saveState();
  renderAll();
  byId("exportHint").textContent = `Số lượng hiện tại: ${documentItem.quantity}.`;
  showToast("Đã ghi nhận xuất tài liệu.");
}

function setDefaultDates() {
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    if (!input.value) input.value = todayISO();
  });
  const expires = document.querySelector('#readerForm input[name="expires"]');
  if (expires && expires.value === todayISO()) {
    expires.value = `${new Date().getFullYear()}-12-31`;
  }
}

function applyRoleRestrictions() {
  const role = currentUser?.role;
  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isReader = role === "reader";
  const canManageLibrary = isAdmin || isStaff;

  byId("appShell").classList.toggle("staff-view", currentUser && !isAdmin);
  byId("appShell").classList.toggle("reader-view", isReader);

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("restricted", !canAccessPage(button.dataset.page));
  });

  byId("documentForm").closest("section").hidden = !canManageLibrary;
  byId("readerForm").closest("section").hidden = !canManageLibrary;
  document.querySelectorAll(".admin-only").forEach((element) => {
    element.hidden = !isAdmin;
  });

  byId("resetDataBtn").hidden = !isAdmin;
  document.querySelectorAll('[data-jump="loans"]').forEach((button) => {
    button.hidden = isReader;
  });

  const eyebrow = document.querySelector(".topbar .eyebrow");
  if (eyebrow) {
    if (isAdmin) eyebrow.textContent = "Quản trị viên - Toàn quyền";
    if (isStaff) eyebrow.textContent = "Nhân viên thư viện";
    if (isReader) eyebrow.textContent = "Độc giả - Tra cứu và theo dõi mượn trả";
  }

  document.querySelectorAll('input[name="staffId"]').forEach((input) => {
    if (!currentUser || isReader) return;
    input.value = currentUser.personId || (isAdmin ? "AD001" : "NV001");
  });
}

function handleLogin(event) {
  event.preventDefault();
  const username = byId("loginUsername").value.trim().toLowerCase();
  const password = byId("loginPassword").value;
  const error = byId("loginError");

  const user = state.accounts[username];
  if (!user || user.password !== password) {
    error.textContent = "Tài khoản hoặc mật khẩu không đúng.";
    byId("loginPassword").value = "";
    return;
  }

  currentUser = { ...user, username };
  error.textContent = "";
  byId("loginOverlay").classList.add("hidden");
  byId("appShell").style.display = "";
  byId("userName").textContent = currentUser.name;
  byId("userRole").textContent = currentUser.title;

  applyRoleRestrictions();
  setPage(homePage());
  renderAll();
  showToast("Xin chào, " + currentUser.name + "!");
}

function handlePublicReaderSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();
  const username = data.username.trim().toLowerCase();
  const error = byId("signupError");

  if (personIdExists(id)) {
    error.textContent = "Mã độc giả đã tồn tại.";
    return;
  }
  if (state.accounts[username]) {
    error.textContent = "Tài khoản đã tồn tại.";
    return;
  }
  if (!data.password || data.password.length < 3) {
    error.textContent = "Mật khẩu phải có ít nhất 3 ký tự.";
    return;
  }

  const today = todayISO();
  const expiresDate = `${new Date().getFullYear()}-12-31`;
  const readerType = data.type;
  const limit = readerType === READER_TYPES.STUDENT ? 5 : 10;

  state.readers.push({
    id,
    name: data.name.trim(),
    type: readerType,
    birth: data.birth,
    gender: data.gender,
    registered: today,
    expires: expiresDate,
    phone: data.phone.trim(),
    address: data.address.trim(),
    code: data.code.trim(),
    borrowed: 0,
    limit
  });

  state.accounts[username] = {
    password: data.password,
    role: "reader",
    name: data.name.trim(),
    title: "Độc giả",
    personId: id,
    readerId: id
  };

  saveState();
  error.textContent = "";
  form.reset();
  showToast("Đăng ký thành công! Hãy đăng nhập với tài khoản vừa tạo.");

  // Switch back to login tab
  document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
  document.querySelector('[data-auth-tab="login"]').classList.add("active");
  byId("loginPanel").classList.add("active");
  byId("signupPanel").classList.remove("active");
}

function handleLogout() {
  currentUser = null;
  byId("loginOverlay").classList.remove("hidden");
  byId("appShell").style.display = "none";
  byId("appShell").classList.remove("staff-view", "reader-view");
  byId("loginForm").reset();
  byId("loginError").textContent = "";
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("restricted"));
  setPage("dashboard");
}

function renderOtherBookTypeOptions() {
  const select = byId("otherBookTypeFilter");
  if (!select) return;
  select.innerHTML = [
    `<option value="all">Tất cả</option>`,
    ...otherBookTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
  ].join("");
}

function handlePagerClick(event) {
  const button = event.target.closest("[data-page-target]");
  if (!button || button.disabled) return;

  const target = button.dataset.pageTarget;
  const action = button.dataset.pageAction;
  const rows = target === "documents"
    ? allDocuments().filter((documentItem) => {
      const keyword = plainText(byId("documentSearch").value.trim());
      const type = byId("documentTypeFilter").value;
      const otherType = byId("otherBookTypeFilter").value;
      const haystack = plainText(`${documentItem.id} ${documentItem.title} ${documentItem.author} ${documentItem.publisher} ${documentDetail(documentItem)}`);
      const matchKeyword = !keyword || haystack.includes(keyword);
      const matchType = type === "all" || documentItem.kind === type;
      const matchOtherType = otherType === "all"
        || (documentItem.kind === KINDS.OTHER_BOOK && documentDetail(documentItem) === otherType);
      return matchKeyword && matchType && matchOtherType;
    })
    : allDocuments();
  const key = target === "documents" ? "documentPage" : "inventoryPage";
  const totalPages = pageCount(rows.length);

  if (action === "first") viewState[key] = 1;
  if (action === "prev") viewState[key] -= 1;
  if (action === "next") viewState[key] += 1;
  if (action === "last") viewState[key] = totalPages;
  viewState[key] = clampPage(viewState[key], rows.length);

  if (target === "documents") renderDocuments();
  if (target === "inventory") renderInventory();
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.jump));
  });

  byId("documentSearch").addEventListener("input", () => {
    viewState.documentPage = 1;
    renderDocuments();
  });
  byId("documentTypeFilter").addEventListener("change", () => {
    viewState.documentPage = 1;
    if (byId("documentTypeFilter").value !== KINDS.OTHER_BOOK) {
      byId("otherBookTypeFilter").value = "all";
    }
    renderDocuments();
  });
  byId("otherBookTypeFilter").addEventListener("change", () => {
    viewState.documentPage = 1;
    if (byId("otherBookTypeFilter").value !== "all") {
      byId("documentTypeFilter").value = KINDS.OTHER_BOOK;
    }
    renderDocuments();
  });
  byId("documentPager").addEventListener("click", handlePagerClick);
  byId("inventoryPager").addEventListener("click", handlePagerClick);
  byId("documentKind").addEventListener("change", renderDocumentExtraFields);
  byId("documentForm").addEventListener("submit", handleDocumentSubmit);
  byId("readerForm").addEventListener("submit", handleReaderSubmit);
  byId("staffForm").addEventListener("submit", handleStaffSubmit);
  byId("adminForm").addEventListener("submit", handleAdminSubmit);
  byId("borrowForm").addEventListener("submit", handleBorrowSubmit);
  byId("borrowDocumentInput").addEventListener("input", () => {
    refreshDocumentDatalist("borrowDocumentInput", "borrowDocumentSelect", allDocuments().filter((documentItem) => isBorrowable(documentItem)));
  });
  byId("returnForm").addEventListener("submit", handleReturnSubmit);
  byId("importForm").addEventListener("submit", handleImportSubmit);
  byId("importMode").addEventListener("change", toggleImportMode);
  byId("importKind").addEventListener("change", renderImportExtraFields);
  byId("importDocumentInput").addEventListener("input", () => refreshDocumentDatalist("importDocumentInput", "importDocumentSelect"));
  byId("exportForm").addEventListener("submit", handleExportSubmit);
  byId("exportDocumentInput").addEventListener("input", () => refreshDocumentDatalist("exportDocumentInput", "exportDocumentSelect"));
  byId("documentFileForm").addEventListener("submit", handleDocumentFileSubmit);
  byId("fileDocumentInput").addEventListener("input", () => refreshDocumentDatalist("fileDocumentInput", "fileDocumentSelect"));

  byId("documentsTable").addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail]");
    if (button) openDocumentModal(button.dataset.detail);
  });

  byId("closeDocumentModal").addEventListener("click", closeDocumentModal);
  byId("documentModal").addEventListener("click", (event) => {
    if (event.target === byId("documentModal")) closeDocumentModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !byId("documentModal").hidden) closeDocumentModal();
  });

  byId("resetDataBtn").addEventListener("click", () => {
    state = sampleState();
    saveState();
    setDefaultDates();
    renderAll();
    showToast("Đã nạp lại dữ liệu mẫu.");
  });

  byId("loginForm").addEventListener("submit", handleLogin);
  byId("logoutBtn").addEventListener("click", handleLogout);

  // Auth tab switching (login / signup)
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.authTab;
      byId("loginPanel").classList.toggle("active", target === "login");
      byId("signupPanel").classList.toggle("active", target === "signup");
    });
  });

  // Public reader signup form
  byId("publicReaderForm").addEventListener("submit", handlePublicReaderSignup);
}

renderDocumentExtraFields();
renderOtherBookTypeOptions();
toggleImportMode();
setDefaultDates();
bindEvents();
