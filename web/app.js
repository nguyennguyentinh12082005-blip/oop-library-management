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
  "Văn học",
  "Kỹ năng sống",
  "Ngoại ngữ",
  "Truyện",
  "Khoa học phổ thông",
  "Lịch sử - địa lý",
  "Khác"
];

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
    transactions: []
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

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  return state.documents.find((documentItem) => documentItem.id === id);
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
  const totalCopies = state.documents.reduce((sum, documentItem) => sum + Number(documentItem.quantity), 0);
  const overdue = state.loans.filter((loan) => loan.dueDate < todayISO()).length;
  const stats = [
    { label: "Đầu tài liệu", value: state.documents.length, tone: "cyan" },
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

function renderDocuments() {
  const keyword = plainText(byId("documentSearch").value.trim());
  const type = byId("documentTypeFilter").value;
  const rows = state.documents.filter((documentItem) => {
    const haystack = plainText(`${documentItem.id} ${documentItem.title} ${documentItem.author} ${documentItem.publisher}`);
    const matchKeyword = !keyword || haystack.includes(keyword);
    const matchType = type === "all" || documentItem.kind === type;
    return matchKeyword && matchType;
  });

  byId("documentCount").textContent = `${rows.length} mục`;
  byId("documentsTable").innerHTML = rows.map((documentItem) => `
    <tr>
      <td><strong>${escapeHtml(documentItem.id)}</strong></td>
      <td>${escapeHtml(documentItem.title)}<br><span class="muted">${escapeHtml(documentItem.author)} - ${escapeHtml(documentItem.publisher)}</span></td>
      <td>${escapeHtml(documentItem.kind)}</td>
      <td><span class="status ${documentItem.quantity > 0 ? "ok" : "warn"}">${escapeHtml(documentItem.quantity)}</span></td>
      <td>${escapeHtml(documentDetail(documentItem))}</td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="muted">Không có tài liệu phù hợp.</td></tr>`;
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

  const documents = state.documents.filter((documentItem) => isBorrowable(documentItem));
  byId("borrowDocumentSelect").innerHTML = documents.map((documentItem) => (
    `<option value="${escapeHtml(documentItem.id)}">${escapeHtml(documentItem.id)} - ${escapeHtml(documentItem.title)} (${escapeHtml(documentItem.quantity)})</option>`
  )).join("");

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
  const documentOptions = state.documents.map((documentItem) => (
    `<option value="${escapeHtml(documentItem.id)}">${escapeHtml(documentItem.id)} - ${escapeHtml(documentItem.title)} (${escapeHtml(documentItem.quantity)})</option>`
  )).join("");

  byId("importDocumentSelect").innerHTML = documentOptions;
  byId("exportDocumentSelect").innerHTML = documentOptions;
  byId("inventoryCount").textContent = `${state.documents.length} mục`;
  byId("inventoryTable").innerHTML = state.documents.map((documentItem) => `
    <tr>
      <td><strong>${escapeHtml(documentItem.id)}</strong></td>
      <td>${escapeHtml(documentItem.title)}<br><span class="muted">${escapeHtml(documentItem.author)} - ${escapeHtml(documentItem.publisher)}</span></td>
      <td>${escapeHtml(documentItem.kind)}</td>
      <td>${escapeHtml(documentItem.quantity)}</td>
      <td><span class="status ${documentItem.quantity > 0 ? "ok" : "warn"}">${documentItem.quantity > 0 ? "Còn tài liệu" : "Hết tài liệu"}</span></td>
    </tr>
  `).join("");
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
  const kind = byId("documentKind").value;
  const extra = byId("documentExtraFields");

  if (kind === KINDS.TEXTBOOK) {
    extra.innerHTML = `
      <label>Mã môn học <input name="maMonHoc" required></label>
      <label>Bộ môn <input name="boMon" required></label>
    `;
    return;
  }

  if (kind === KINDS.OTHER_BOOK) {
    extra.innerHTML = `
      <label>Loại sách khác
        <select name="loaiSachKhac" required>
          ${otherBookTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
        </select>
      </label>
    `;
    return;
  }

  if (kind === KINDS.MAGAZINE) {
    extra.innerHTML = `
      <div class="form-grid">
        <label>Số phát hành <input name="soPhatHanh" type="number" min="1" value="1" required></label>
        <label>Tháng phát hành <input name="thangPhatHanh" type="number" min="1" max="12" value="1" required></label>
      </div>
    `;
    return;
  }

  if (kind === KINDS.RESEARCH) {
    extra.innerHTML = `
      <label>Cơ quan chủ quản <input name="coQuanChuQuan" required></label>
      <label>Lĩnh vực <input name="linhVuc" required></label>
    `;
    return;
  }

  extra.innerHTML = "";
}

function handleDocumentSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();

  if (state.documents.some((documentItem) => documentItem.id === id)) {
    showToast("Mã tài liệu đã tồn tại.");
    return;
  }

  const extra = {};
  if (data.kind === KINDS.TEXTBOOK) {
    extra.maMonHoc = data.maMonHoc;
    extra.boMon = data.boMon;
  }
  if (data.kind === KINDS.OTHER_BOOK) {
    extra.loaiSachKhac = data.loaiSachKhac;
  }
  if (data.kind === KINDS.MAGAZINE) {
    extra.soPhatHanh = Number(data.soPhatHanh);
    extra.thangPhatHanh = Number(data.thangPhatHanh);
  }
  if (data.kind === KINDS.RESEARCH) {
    extra.coQuanChuQuan = data.coQuanChuQuan;
    extra.linhVuc = data.linhVuc;
  }

  state.documents.push({
    id,
    title: data.title.trim(),
    kind: data.kind,
    year: Number(data.year),
    quantity: Number(data.quantity),
    author: data.author.trim(),
    publisher: data.publisher.trim(),
    category: data.category.trim(),
    extra
  });

  saveState();
  form.reset();
  renderDocumentExtraFields();
  renderAll();
  showToast("Đã thêm tài liệu mới.");
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
  const reader = findReader(data.readerId);
  const documentItem = findDocument(data.documentId);

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

function handleImportSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const documentItem = findDocument(data.documentId);
  const quantity = Number(data.quantity);
  const unitPrice = Number(data.unitPrice);

  if (!documentItem) {
    showToast("Không tìm thấy tài liệu cần nhập.");
    return;
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
  renderAll();
  byId("importHint").textContent = `Số lượng hiện tại: ${documentItem.quantity}.`;
  showToast("Đã ghi nhận nhập tài liệu.");
}

function handleExportSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const documentItem = findDocument(data.documentId);
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

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.jump));
  });

  byId("documentSearch").addEventListener("input", renderDocuments);
  byId("documentTypeFilter").addEventListener("change", renderDocuments);
  byId("documentKind").addEventListener("change", renderDocumentExtraFields);
  byId("documentForm").addEventListener("submit", handleDocumentSubmit);
  byId("readerForm").addEventListener("submit", handleReaderSubmit);
  byId("staffForm").addEventListener("submit", handleStaffSubmit);
  byId("adminForm").addEventListener("submit", handleAdminSubmit);
  byId("borrowForm").addEventListener("submit", handleBorrowSubmit);
  byId("returnForm").addEventListener("submit", handleReturnSubmit);
  byId("importForm").addEventListener("submit", handleImportSubmit);
  byId("exportForm").addEventListener("submit", handleExportSubmit);
  byId("resetDataBtn").addEventListener("click", () => {
    state = sampleState();
    saveState();
    setDefaultDates();
    renderAll();
    showToast("Đã nạp lại dữ liệu mẫu.");
  });

  byId("loginForm").addEventListener("submit", handleLogin);
  byId("logoutBtn").addEventListener("click", handleLogout);
}

renderDocumentExtraFields();
setDefaultDates();
bindEvents();
