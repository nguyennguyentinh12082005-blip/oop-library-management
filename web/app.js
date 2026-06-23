const STORAGE_KEY = "oop-library-web-v6";

// Initialize Firebase Realtime Database for multi-machine synchronization
const firebaseConfig = {
  apiKey: "AIzaSyD08ByrRNUvpVo6JIRUHC77q37dltFnP1E",
  authDomain: "oop-tl.firebaseapp.com",
  databaseURL: "https://oop-tl-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oop-tl",
  storageBucket: "oop-tl.firebasestorage.app",
  messagingSenderId: "553315785442",
  appId: "1:553315785442:web:92605f152f3b0c5ccbdcbb",
  measurementId: "G-XGMBX4M9Y0"
};


let db = null;
try {
  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
  }
} catch (e) {
  console.error("Firebase failed to initialize:", e);
}


const DEFAULT_ACCOUNTS = {
  admin: {
    password: "admin",
    role: "admin",
    name: "Quản trị viên",
    title: "Quản trị viên",
    personId: "AD001",
    email: "admin@gmail.com"
  }
};

const TRANSLATIONS = {
  vi: {
    brand_title: "Thư viện OOP",
    brand_subtitle: "Hệ thống quản lý thư viện C++",
    tab_login: "Đăng nhập",
    tab_signup: "Đăng ký độc giả",
    lbl_username: "Tài khoản hoặc Gmail",
    lbl_password: "Mật khẩu",
    lbl_username_placeholder: "Nhập tài khoản hoặc Gmail",
    lbl_password_placeholder: "Nhập mật khẩu",
    lbl_sample_accounts: "Tài khoản mẫu:",
    lbl_role_admin: "Quản trị viên",
    lbl_reader_group: "Nhóm người đọc",
    lbl_reader_id: "Mã độc giả",
    lbl_identifier: "Mã định danh (MSSV / MSCB)",
    lbl_fullname: "Họ tên",
    lbl_dob: "Ngày sinh",
    lbl_gender: "Giới tính",
    lbl_phone: "Số điện thoại",
    lbl_address: "Địa chỉ",
    btn_login: "Đăng nhập",
    btn_signup: "Tạo tài khoản độc giả",
    nav_dashboard: "Tổng quan",
    nav_portal: "Trang độc giả",
    nav_documents: "Tài liệu",
    nav_readers: "Thành viên",
    nav_loans: "Mượn / Trả",
    nav_inventory: "Nhập / Xuất",
    nav_transactions: "Giao dịch",
    btn_logout: "Đăng xuất",
    lbl_gender_male: "Nam",
    lbl_gender_female: "Nữ",
    lbl_gender_other: "Khác",
    reader_type_student: "Sinh viên",
    reader_type_employee: "Viên chức",
    reader_type_lecturer: "Giảng viên",
    reader_type_researcher: "Nghiên cứu viên",
    reader_type_postgraduate: "Học viên cao học",
    reader_type_guest: "Khách ngoài trường",
    role_admin: "Quản trị viên",
    role_staff: "Nhân viên",
    role_reader: "Độc giả",
    role_student: "Sinh viên",
    role_employee: "Viên chức",
    toast_welcome: "Xin chào, ",
    toast_pending_count: "Có {count} tài khoản độc giả đang chờ duyệt!",
    toast_new_signup: "Độc giả mới đăng ký: {name} ({username})",
    toast_pending_approval: "Đăng ký thành công! Vui lòng chờ Admin duyệt tài khoản.",
    eyebrow_admin: "Quản trị viên - Toàn quyền",
    eyebrow_staff: "Nhân viên thư viện",
    eyebrow_reader: "Độc giả - Tra cứu và theo dõi mượn trả",
    error_not_approved: "Tài khoản chưa được duyệt.",
    error_wrong_auth: "Tài khoản/Gmail hoặc mật khẩu không đúng.",
    error_exists: "Tài khoản đã tồn tại.",
    error_password_len: "Mật khẩu phải có ít nhất 3 ký tự.",
    error_id_exists: "Mã độc giả đã tồn tại.",
    forgot_password_link: "Quên mật khẩu?",
    forgot_btn_send: "Gửi mã xác nhận",
    forgot_btn_verify: "Xác thực mã",
    forgot_btn_reset: "Đổi mật khẩu",
    forgot_back_login: "← Quay lại đăng nhập",
    forgot_step1_desc: "Nhập địa chỉ Email (Gmail) đăng ký của bạn để nhận mã xác thực OTP thiết lập lại mật khẩu.",
    forgot_step2_desc: "Mã xác thực đã được gửi tới email của bạn. Vui lòng nhập mã OTP gồm 6 chữ số dưới đây.",
    forgot_step3_desc: "Mã xác thực chính xác! Vui lòng thiết lập mật khẩu mới.",
    lbl_forgot_email: "Email (Gmail)",
    lbl_forgot_otp: "Mã xác thực OTP",
    lbl_forgot_new_pass: "Mật khẩu mới",
    lbl_forgot_confirm_pass: "Xác nhận mật khẩu mới",
    btn_delete_self: "Xóa tài khoản",
    lbl_header_action: "Hành động"
  },
  en: {
    brand_title: "OOP Library",
    brand_subtitle: "C++ Library Management System",
    tab_login: "Sign In",
    tab_signup: "Sign Up",
    lbl_username: "Username or Gmail",
    lbl_password: "Password",
    lbl_username_placeholder: "Enter username or Gmail",
    lbl_password_placeholder: "Enter password",
    lbl_sample_accounts: "Sample Accounts:",
    lbl_role_admin: "Admin",
    lbl_reader_group: "Reader Group",
    lbl_reader_id: "Reader ID",
    lbl_identifier: "Student/Staff ID Card",
    lbl_fullname: "Full Name",
    lbl_dob: "Date of Birth",
    lbl_gender: "Gender",
    lbl_phone: "Phone Number",
    lbl_address: "Address",
    btn_login: "Sign In",
    btn_signup: "Create Reader Account",
    nav_dashboard: "Dashboard",
    nav_portal: "Reader Portal",
    nav_documents: "Catalog",
    nav_readers: "Members",
    nav_loans: "Loans & Returns",
    nav_inventory: "Stock In/Out",
    nav_transactions: "Logs",
    btn_logout: "Log Out",
    lbl_gender_male: "Male",
    lbl_gender_female: "Female",
    lbl_gender_other: "Other",
    reader_type_student: "Student",
    reader_type_employee: "Staff",
    reader_type_lecturer: "Lecturer",
    reader_type_researcher: "Researcher",
    reader_type_postgraduate: "Postgraduate",
    reader_type_guest: "Guest",
    role_admin: "Administrator",
    role_staff: "Librarian",
    role_reader: "Reader",
    role_student: "Student Reader",
    role_employee: "Staff Reader",
    toast_welcome: "Welcome, ",
    toast_pending_count: "There are {count} reader accounts pending approval!",
    toast_new_signup: "New reader registered: {name} ({username})",
    toast_pending_approval: "Sign up successful! Please wait for Admin approval.",
    eyebrow_admin: "Administrator - Full Access",
    eyebrow_staff: "Library Staff",
    eyebrow_reader: "Reader - Search & Borrow Tracking",
    error_not_approved: "Account is pending approval.",
    error_wrong_auth: "Incorrect username/Gmail or password.",
    error_exists: "Username already exists.",
    error_password_len: "Password must be at least 3 characters.",
    error_id_exists: "Reader ID already exists.",
    forgot_password_link: "Forgot password?",
    forgot_btn_send: "Send Code",
    forgot_btn_verify: "Verify Code",
    forgot_btn_reset: "Reset Password",
    forgot_back_login: "← Back to Login",
    forgot_step1_desc: "Enter your registered Email (Gmail) address to receive an OTP verification code to reset your password.",
    forgot_step2_desc: "The verification code has been sent to your email. Please enter the 6-digit OTP code below.",
    forgot_step3_desc: "Verification successful! Please set your new password.",
    lbl_forgot_email: "Email (Gmail)",
    lbl_forgot_otp: "OTP Code",
    lbl_forgot_new_pass: "New Password",
    lbl_forgot_confirm_pass: "Confirm Password",
    btn_delete_self: "Delete Account",
    lbl_header_action: "Action"
  }
};

let currentLang = localStorage.getItem("library_lang") || "vi";

window.setLanguage = function(lang) {
  currentLang = lang;
  localStorage.setItem("library_lang", lang);
  updateLanguageUI();
};

function updateLanguageUI() {
  const t = (key) => TRANSLATIONS[currentLang][key] || key;
  
  const brandH1 = document.querySelector(".login-brand h1");
  if (brandH1) brandH1.textContent = t("brand_title");
  const brandP = document.querySelector(".login-brand p");
  if (brandP) brandP.textContent = t("brand_subtitle");

  const tabLogin = document.querySelector('[data-auth-tab="login"]');
  if (tabLogin) tabLogin.textContent = t("tab_login");
  const tabSignup = document.querySelector('[data-auth-tab="signup"]');
  if (tabSignup) tabSignup.textContent = t("tab_signup");

  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    const labels = loginForm.querySelectorAll("label");
    if (labels[0]) labels[0].firstChild.textContent = t("lbl_username") + " ";
    if (labels[1]) labels[1].firstChild.textContent = t("lbl_password") + " ";
    const btn = loginForm.querySelector("button");
    if (btn) btn.textContent = t("btn_login");

    const usernameInput = loginForm.querySelector("#loginUsername");
    if (usernameInput) usernameInput.placeholder = t("lbl_username_placeholder");
    const passwordInput = loginForm.querySelector("#loginPassword");
    if (passwordInput) passwordInput.placeholder = t("lbl_password_placeholder");
  }

  const forgotLink = byId("forgotPasswordLink");
  if (forgotLink) forgotLink.textContent = t("forgot_password_link");
  const step1Desc = byId("forgotStep1Desc");
  if (step1Desc) step1Desc.textContent = t("forgot_step1_desc");
  const lblForgotEmail = byId("lblForgotEmail");
  if (lblForgotEmail) lblForgotEmail.firstChild.textContent = t("lbl_forgot_email") + " ";
  const btnSendOtp = byId("btnSendOtp");
  if (btnSendOtp) btnSendOtp.textContent = t("forgot_btn_send");

  const step2Desc = byId("forgotStep2Desc");
  if (step2Desc) step2Desc.textContent = t("forgot_step2_desc");
  const lblForgotOtp = byId("lblForgotOtp");
  if (lblForgotOtp) lblForgotOtp.firstChild.textContent = t("lbl_forgot_otp") + " ";
  const btnVerifyOtp = byId("btnVerifyOtp");
  if (btnVerifyOtp) btnVerifyOtp.textContent = t("forgot_btn_verify");

  const step3Desc = byId("forgotStep3Desc");
  if (step3Desc) step3Desc.textContent = t("forgot_step3_desc");
  const lblForgotNewPass = byId("lblForgotNewPass");
  if (lblForgotNewPass) lblForgotNewPass.firstChild.textContent = t("lbl_forgot_new_pass") + " ";
  const lblForgotConfirmPass = byId("lblForgotConfirmPass");
  if (lblForgotConfirmPass) lblForgotConfirmPass.firstChild.textContent = t("lbl_forgot_confirm_pass") + " ";
  const btnResetPassword = byId("btnResetPassword");
  if (btnResetPassword) btnResetPassword.textContent = t("forgot_btn_reset");

  const backLogin = byId("backToLoginLink");
  if (backLogin) backLogin.textContent = t("forgot_back_login");

  const hdrReader = byId("lblHeaderActionReader");
  if (hdrReader) hdrReader.textContent = t("lbl_header_action");
  const hdrPeople = byId("lblHeaderActionPeople");
  if (hdrPeople) hdrPeople.textContent = t("lbl_header_action");

  const lblSampleAccounts = byId("lblSampleAccounts");
  if (lblSampleAccounts) lblSampleAccounts.textContent = t("lbl_sample_accounts");
  const lblRoleAdmin = byId("lblRoleAdmin");
  if (lblRoleAdmin) lblRoleAdmin.textContent = t("lbl_role_admin");

  const signupForm = document.querySelector("#publicReaderForm");
  if (signupForm) {
    const labels = signupForm.querySelectorAll("label");
    if (labels[0]) labels[0].firstChild.textContent = t("lbl_reader_group") + " ";
    if (labels[1]) labels[1].firstChild.textContent = t("lbl_reader_id") + " ";
    if (labels[2]) labels[2].firstChild.textContent = t("lbl_identifier") + " ";
    if (labels[3]) labels[3].firstChild.textContent = t("lbl_fullname") + " ";
    if (labels[4]) labels[4].firstChild.textContent = t("lbl_forgot_email") + " ";
    if (labels[5]) labels[5].firstChild.textContent = t("lbl_dob") + " ";
    if (labels[6]) labels[6].firstChild.textContent = t("lbl_gender") + " ";
    if (labels[7]) labels[7].firstChild.textContent = t("lbl_phone") + " ";
    if (labels[8]) labels[8].firstChild.textContent = t("lbl_address") + " ";
    if (labels[9]) labels[9].firstChild.textContent = t("lbl_username") + " ";
    if (labels[10]) labels[10].firstChild.textContent = t("lbl_password") + " ";
    
    const genderSelect = signupForm.querySelector('select[name="gender"]');
    if (genderSelect) {
      genderSelect.options[0].textContent = t("lbl_gender_male");
      genderSelect.options[1].textContent = t("lbl_gender_female");
      genderSelect.options[2].textContent = t("lbl_gender_other");
    }

    const typeSelect = signupForm.querySelector('select[name="type"]');
    if (typeSelect) {
      typeSelect.options[0].textContent = t("reader_type_student");
      typeSelect.options[1].textContent = t("reader_type_employee");
      typeSelect.options[2].textContent = t("reader_type_lecturer");
      typeSelect.options[3].textContent = t("reader_type_researcher");
      typeSelect.options[4].textContent = t("reader_type_postgraduate");
      typeSelect.options[5].textContent = t("reader_type_guest");
    }

    const btn = signupForm.querySelector("button");
    if (btn) btn.textContent = t("btn_signup");
  }

  const navPages = {
    dashboard: "nav_dashboard",
    readerPortal: "nav_portal",
    documents: "nav_documents",
    readers: "nav_readers",
    loans: "nav_loans",
    inventory: "nav_inventory",
    transactions: "nav_transactions"
  };
  Object.entries(navPages).forEach(([page, key]) => {
    const el = document.querySelector(`.nav-item[data-page="${page}"] span`);
    if (el) el.textContent = t(key);
  });

  const logoutBtn = byId("logoutBtn");
  if (logoutBtn) logoutBtn.textContent = t("btn_logout");

  if (currentUser) {
    const roleEl = byId("userRole");
    if (roleEl) {
      if (currentUser.title === "Quản trị viên") roleEl.textContent = t("role_admin");
      else if (currentUser.title === "Nhân viên") roleEl.textContent = t("role_staff");
      else if (currentUser.title === "Độc giả") roleEl.textContent = t("role_reader");
      else if (currentUser.title === "Sinh viên") roleEl.textContent = t("role_student");
      else if (currentUser.title === "Viên chức") roleEl.textContent = t("role_employee");
      else roleEl.textContent = currentUser.title;
    }
    
    const eyebrow = document.querySelector(".topbar .eyebrow");
    if (eyebrow) {
      if (currentUser.role === "admin") eyebrow.textContent = t("eyebrow_admin");
      else if (currentUser.role === "staff") eyebrow.textContent = t("eyebrow_staff");
      else if (currentUser.role === "reader") eyebrow.textContent = t("eyebrow_reader");
    }
  }

  const activePage = document.querySelector(".page.active");
  if (activePage) {
    const pageName = activePage.id.replace("Page", "");
    const titleKey = navPages[pageName];
    if (titleKey) {
      byId("pageTitle").textContent = t(titleKey);
    }
  }

  const sel = byId("langSelector");
  if (sel) sel.value = currentLang;
  const selSidebar = byId("langSelectorSidebar");
  if (selSidebar) selSidebar.value = currentLang;
}

const ROLE_HOME = {
  admin: "dashboard",
  staff: "dashboard",
  reader: "readerPortal"
};

const ROLE_PAGES = {
  admin: new Set(["dashboard", "documents", "readers", "loans", "inventory", "transactions"]),
  staff: new Set(["dashboard", "documents", "loans", "inventory", "transactions"]),
  reader: new Set(["readerPortal", "documents"])
};

let currentUser = null;
let _cachedCatalogDocuments = null;
let _cachedAllDocuments = null;

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
  "Văn học / Tiểu thuyết",
  "Phát triển bản thân / Kỹ năng sống",
  "Hồi ký / Tiểu sử",
  "Nghệ thuật / Đời sống",
  "Khác"
];

const TEXTBOOK_FACULTIES = [
  {
    name: "Giáo trình Đại cương",
    subjects: [
      "Toán cao cấp", "Triết học Mác - Lênin", "Vật lý đại cương", "Đại số tuyến tính", "Giải tích",
      "Xác suất thống kê", "Toán rời rạc", "Hóa học đại cương", "Sinh học đại cương", "Pháp luật đại cương",
      "Triết học Mác-Lênin", "Kinh tế chính trị", "Chủ nghĩa xã hội KH", "Tư tưởng Hồ Chí Minh", "Lịch sử Đảng",
      "Giáo dục thể chất", "Thể dục", "Thể thao", "Võ thuật", "Giáo dục quốc phòng", "An ninh quốc gia"
    ]
  },
  {
    name: "Giáo trình Chuyên ngành",
    subjects: [
      "Kế toán doanh nghiệp", "Lập trình Hướng đối tượng (C++)", "Giải phẫu học",
      "Lập trình", "Cơ sở dữ liệu", "Mạng máy tính", "Cấu trúc dữ liệu", "Hệ điều hành",
      "Trí tuệ nhân tạo", "Công nghệ phần mềm", "An toàn thông tin", "Thuật toán",
      "Cơ học kỹ thuật", "Sức bền vật liệu", "Nguyên lý máy", "Chi tiết máy", "Vẽ kỹ thuật", "Công nghệ chế tạo máy",
      "Mạch điện", "Điện tử số", "Vi xử lý", "Kỹ thuật điện", "Tự động hóa", "Điện tử công suất",
      "Kết cấu", "Vật liệu xây dựng", "Nền móng", "Kiến trúc", "Địa kỹ thuật",
      "Kinh tế vi mô", "Kinh tế vĩ mô", "Quản trị kinh doanh", "Kế toán", "Tài chính", "Marketing", "Ngân hàng",
      "Luật dân sự", "Luật hình sự", "Luật thương mại", "Luật lao động",
      "Giải phẫu", "Sinh lý", "Dược lý", "Y học cộng đồng", "Điều dưỡng",
      "Trồng trọt", "Chăn nuôi", "Thủy sản", "Lâm nghiệp"
    ]
  },
  {
    name: "Giáo trình Khoa học ứng dụng",
    subjects: [
      "Ứng dụng AI trong y tế", "Kỹ thuật điện tử ứng dụng", "Ứng dụng AI", "Điện tử ứng dụng", "Khoa học ứng dụng"
    ]
  },
  {
    name: "Giáo trình Ngoại ngữ",
    subjects: [
      "Hán ngữ", "Tiếng Anh giao tiếp", "New English File", "Tiếng Anh", "Tiếng Pháp", "Tiếng Nhật", "Tiếng Trung", "Tiếng Hàn"
    ]
  },
  {
    name: "Khác",
    subjects: []
  }
];

function getDocumentFaculty(documentItem) {
  if (documentItem.kind !== KINDS.TEXTBOOK) return null;
  const haystack = plainText(
    [documentItem.extra?.boMon, documentItem.extra?.maMonHoc, documentItem.category]
      .filter(Boolean).join(" ")
  );
  for (const fac of TEXTBOOK_FACULTIES) {
    if (fac.name === "Khác") continue;
    const facNameNorm = plainText(fac.name);
    if (haystack.includes(facNameNorm)) return fac.name;
    for (const subj of fac.subjects) {
      if (haystack.includes(plainText(subj))) return fac.name;
    }
  }
  return "Khác";
}

function textbookSubjectsForFaculty(facultyName) {
  const fac = TEXTBOOK_FACULTIES.find((f) => f.name === facultyName);
  return fac ? fac.subjects : [];
}

function defaultSubtypesForKind(kind) {
  if (kind === KINDS.TEXTBOOK) {
    return [
      "Giáo trình Đại cương",
      "Giáo trình Chuyên ngành",
      "Giáo trình Khoa học ứng dụng",
      "Giáo trình Ngoại ngữ",
      "Khác"
    ];
  }
  if (kind === KINDS.REFERENCE) {
    return [
      "Từ điển / Bách khoa toàn thư",
      "Sách chuyên khảo",
      "Sách hướng dẫn / Thực hành",
      "Sách giải bài tập",
      "Khác"
    ];
  }
  if (kind === KINDS.OTHER_BOOK) {
    return otherBookTypes;
  }
  if (kind === KINDS.MAGAZINE) {
    return [
      "Tạp chí Khoa học & Chuyên ngành",
      "Tạp chí Kinh tế / Xã hội",
      "Báo giấy thường nhật / Báo tuần",
      "Khác"
    ];
  }
  if (kind === KINDS.RESEARCH) {
    return [
      "Luận văn / Luận án",
      "Báo cáo khoa học / Đề tài NCKH",
      "Kỷ yếu hội thảo (Conference Proceedings)",
      "Bài báo khoa học quốc tế",
      "Khác"
    ];
  }
  return [];
}

const DOCUMENT_PAGE_SIZE = 12;
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

function openLibraryCoverUrl(documentItem) {
  const isbn = documentItem.isbn || documentItem.extra?.isbn;
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(String(isbn).trim())}-M.jpg?default=false`;
  }
  return "";
}

function getSearchHaystack(documentItem) {
  if (!documentItem._searchHaystack) {
    documentItem._searchHaystack = plainText([
      documentItem.id,
      documentItem.title,
      documentItem.author,
      documentItem.publisher,
      documentItem.kind,
      documentItem.category,
      documentItem.year,
      documentDetail(documentItem),
      documentSubtypeLabel(documentItem),
      ...documentTopicValues(documentItem)
    ].filter(Boolean).join(" "));
  }
  return documentItem._searchHaystack;
}

async function fetchAndSetCoverFromGoogleBooks(documentItem) {
  if (!documentItem || documentItem.coverImage || documentItem._fetchingCover) return;
  documentItem._fetchingCover = true;

  try {
    const title = String(documentItem.title || "")
      .replace(/^(Giáo trình|Sách tham khảo|Sách khác|Báo\/Tạp chí|Bài nghiên cứu)\s+/i, "")
      .trim();
    const author = documentItem.author && documentItem.author !== "Unknown" ? documentItem.author : "";
    const query = `${title} ${author}`.trim();
    
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      const volumeInfo = data.items[0].volumeInfo;
      const thumbnail = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;
      if (thumbnail) {
        const secureThumbnail = thumbnail.replace(/^http:/, "https:");
        
        const managed = ensureManagedDocument(documentItem.id);
        if (managed) {
          managed.coverImage = secureThumbnail;
          documentItem.coverImage = secureThumbnail;
          saveState();
          
          document.querySelectorAll(`div.generated-cover[data-cover-code="${documentItem.id}"]`).forEach((div) => {
            const className = div.classList.contains("cover-large") ? "cover-large" : "cover-thumb";
            const imgMarkup = coverImageMarkup(documentItem, className, secureThumbnail);
            
            const temp = document.createElement("div");
            temp.innerHTML = imgMarkup.trim();
            const imgEl = temp.firstChild;
            if (imgEl) {
              div.replaceWith(imgEl);
            }
          });
        }
      }
    }
  } catch (err) {
    console.warn("Failed to fetch cover from Google Books for", documentItem.title, err);
  } finally {
    documentItem._fetchingCover = false;
  }
}

function coverCell(documentItem) {
  if (documentItem.coverImage) {
    return coverImageMarkup(documentItem, "cover-thumb", documentItem.coverImage);
  }
  const olUrl = openLibraryCoverUrl(documentItem);
  if (olUrl) {
    return coverImageMarkup(documentItem, "cover-thumb", olUrl);
  }
  const gutenbergUrl = gutenbergCoverUrl(documentItem);
  if (gutenbergUrl) {
    return coverImageMarkup(documentItem, "cover-thumb", gutenbergUrl);
  }
  
  fetchAndSetCoverFromGoogleBooks(documentItem);
  return generatedCover(documentItem, "cover-thumb");
}

function coverImageMarkup(documentItem, className, imageUrl) {
  const label = documentSubtypeLabel(documentItem) || documentItem.kind || "Sách";
  const title = className.includes("cover-large")
    ? cleanBookTitle(documentItem.title)
    : coverTitleSnippet(documentItem.title);
  return `
    <img class="${escapeHtml(className)}"
      src="${escapeHtml(imageUrl)}"
      alt="Bìa ${escapeHtml(documentItem.title)}"
      loading="lazy"
      data-cover-label="${escapeHtml(label)}"
      data-cover-title="${escapeHtml(title)}"
      data-cover-code="${escapeHtml(documentItem.id)}"
      onerror="handleCoverError(this)">
  `;
}

function gutenbergCoverUrl(documentItem) {
  const gutenbergId = documentItem.extra?.gutenbergId;
  if (!gutenbergId) return "";
  const encodedId = encodeURIComponent(gutenbergId);
  return `https://www.gutenberg.org/cache/epub/${encodedId}/pg${encodedId}.cover.medium.jpg`;
}

function getBookCoverStyle(documentItem) {
  const title = String(documentItem.title || "");
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const gradients = [
    "linear-gradient(135deg, #1e3a8a, #3b82f6)", // Deep blue
    "linear-gradient(135deg, #064e3b, #059669)", // Emerald
    "linear-gradient(135deg, #4c0519, #be123c)", // Crimson
    "linear-gradient(135deg, #7c2d12, #ea580c)", // Terracotta
    "linear-gradient(135deg, #2e1065, #7c3aed)", // Indigo/Purple
    "linear-gradient(135deg, #4a044e, #db2777)", // Violet/Pink
    "linear-gradient(135deg, #134e5a, #008080)", // Dark teal
    "linear-gradient(135deg, #0f172a, #334155)", // Slate
    "linear-gradient(135deg, #78350f, #d97706)", // Bronze/Amber
    "linear-gradient(135deg, #030712, #1f2937)"  // Matte black
  ];
  
  const index = Math.abs(hash) % gradients.length;
  return {
    background: gradients[index],
    borderLeft: "3px solid rgba(255, 255, 255, 0.45)"
  };
}

function generatedCover(documentItem, className) {
  const title = documentItem.title || "Sách";
  return `
    <img src="assets/covers/default_cover.svg" 
         class="${escapeHtml(className)}" 
         alt="Bìa ${escapeHtml(title)}"
         data-cover-code="${escapeHtml(documentItem.id)}">
  `;
}

function handleCoverError(img) {
  if (img.src.includes("default_cover.svg")) {
    return;
  }
  img.src = "assets/covers/default_cover.svg";
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

  // 1. Explicit checks (highest priority)
  if (hasAny(category, ["tap chi", "bao/tap chi", "ky yeu", "hoi thao", "magazine", "newspaper", "journal"])) return KINDS.MAGAZINE;
  if (hasAny(category, ["giao trinh", "textbook"]) || title.startsWith("giao trinh ")) return KINDS.TEXTBOOK;
  if (hasAny(category, ["tham khao", "reference", "tra cuu"])) return KINDS.REFERENCE;
  if (hasAny(category, ["nghien cuu", "luan van", "luan an", "do an", "khoa luan", "bc nghien cuu", "thesis", "dissertation", "paper", "proceeding"])) return KINDS.RESEARCH;

  // 2. High priority keyword checks for academic/scholarly categories
  if (hasAny(text, ["journal", "magazine", "periodical", "newspaper", "bulletin", "weekly", "monthly"])) return KINDS.MAGAZINE;
  if (hasAny(text, ["thesis", "dissertation", "research paper", "proceedings", "transactions of", "scientific report"])) return KINDS.RESEARCH;
  
  if (hasAny(text, ["textbook", "course", "lecture", "exposition of", "principles of", "elements of", "mathematics", "calculus", "algebra", "physics", "chemistry", "biology", "astronomy", "anatomy", "physiology", "mechanics", "engineering", "programming"])) {
    return KINDS.TEXTBOOK;
  }

  if (hasAny(text, ["dictionary", "encyclopedia", "manual", "guide", "handbook", "primer", "grammar", "law", "legal", "constitution", "directory"])) {
    return KINDS.REFERENCE;
  }

  // 3. Fallback to OTHER_BOOK
  return KINDS.OTHER_BOOK;
}

function classifySubtype(kind, documentItem) {
  const text = sourceText(documentItem);

  if (kind === KINDS.TEXTBOOK) {
    if (hasAny(text, ["anatomy", "physiology", "mechanics", "engineering", "programming", "accounting", "economics", "medical", "nursing", "pathology", "disease", "clinical", "machinery", "geology", "agriculture", "law", "legal", "constitution"])) {
      return "Giáo trình Chuyên ngành";
    }
    if (hasAny(text, ["toan", "dai so", "giai tich", "xac suat", "triet", "mac", "lenin", "vat ly dai cuong", "hoa hoc dai cuong", "sinh hoc dai cuong", "mathematics", "calculus", "algebra", "physics", "chemistry", "philosophy", "basic", "general", "introduction", "geometry", "arithmetic"])) {
      return "Giáo trình Đại cương";
    }
    if (hasAny(text, ["ai ", "artificial intelligence", "applied", "ung dung", "technology", "electronics", "robotic", "automation", "software engineering", "cong nghe phan mem", "thiet ke may", "applied science"])) {
      return "Giáo trình Khoa học ứng dụng";
    }
    if (hasAny(text, ["ngoai ngu", "ngon ngu", "language", "grammar", "english", "french", "german", "spanish", "chinese", "japanese", "vietnamese", "han ngu"])) {
      return "Giáo trình Ngoại ngữ";
    }
    return "Giáo trình Chuyên ngành";
  }

  if (kind === KINDS.REFERENCE) {
    if (hasAny(text, ["giai bai tap", "solutions", "solution", "exercises solved", "solved", "key to", "answers", "test prep", "ielts", "toeic", "toefl", "gmat", "gre", "sat "])) {
      return "Sách giải bài tập";
    }
    if (hasAny(text, ["dictionary", "encyclopedia", "tu dien", "bach khoa", "glossary", "lexicon", "thesaurus"])) {
      return "Từ điển / Bách khoa toàn thư";
    }
    if (hasAny(text, ["manual", "guide", "handbook", "primer", "huong dan", "thuc hanh", "so tay", "cam nang", "how to", "instructions", "recipe"])) {
      return "Sách hướng dẫn / Thực hành";
    }
    return "Sách chuyên khảo";
  }

  if (kind === KINDS.OTHER_BOOK) {
    if (hasAny(text, ["biography", "memoir", "autobiography", "tieu su", "hoi ky", "life of", "lives of", "autobiographical"])) {
      return "Hồi ký / Tiểu sử";
    }
    if (hasAny(text, ["art ", "music", "cooking", "cookery", "recipe", "photography", "architecture", "nghe thuat", "am thuc", "nau an", "nhiep anh", "khoe dep", "lifestyle", "gardening", "drawing", "painting", "sculpture", "drama", "plays", "play", "theater", "theatre"])) {
      return "Nghệ thuật / Đời sống";
    }
    if (hasAny(text, ["self-help", "ky nang", "giao tiep", "quan ly thoi gian", "tam ly hoc hanh vi", "psychology", "leadership", "success", "motivate", "motivation", "habit", "conduct of life", "ethics", "think", "mind", "mindset", "improvement", "improve", "willpower", "character", "friendship", "influence", "happy", "happiness", "optimism", "courage", "friend", "self-culture"])) {
      return "Phát triển bản thân / Kỹ năng sống";
    }
    return "Văn học / Tiểu thuyết";
  }

  if (kind === KINDS.MAGAZINE) {
    if (hasAny(text, ["kinh te", "xa hoi", "forbes", "business", "economy", "nhip cau", "kien truc", "society", "social", "sociology", "political", "politics", "financial", "finance", "commerce", "trade", "industry"])) {
      return "Tạp chí Kinh tế / Xã hội";
    }
    if (hasAny(text, ["khoa hoc", "chuyen nganh", "science", "technology", "journal", "academic", "research", "medical", "engineering", "nature"])) {
      return "Tạp chí Khoa học & Chuyên ngành";
    }
    return "Báo giấy thường nhật / Báo tuần";
  }

  if (kind === KINDS.RESEARCH) {
    if (hasAny(text, ["report", "bulletin", "survey", "studies", "bao cao", "de tai"])) {
      return "Báo cáo khoa học / Đề tài NCKH";
    }
    if (hasAny(text, ["proceedings", "conference", "ky yeu", "hoi thao", "workshop"])) {
      return "Kỷ yếu hội thảo (Conference Proceedings)";
    }
    if (hasAny(text, ["quoc te", "international", "isi", "scopus", "ieee", "springer"])) {
      return "Bài báo khoa học quốc tế";
    }
    if (hasAny(text, ["thesis", "dissertation", "luan van", "luan an", "khoa luan", "do an"])) {
      return "Luận văn / Luận án";
    }
    return "Báo cáo khoa học / Đề tài NCKH";
  }

  return "Khác";
}

function normalizeSourceDocument(documentItem) {
  if (!isSourceOnlyCatalogItem(documentItem)) return documentItem;

  const normalized = {
    ...documentItem,
    extra: { ...(documentItem.extra || {}) }
  };
  normalized.kind = sourceKind(documentItem);
  const sourceSubtype = classifySubtype(normalized.kind, normalized);

  if (normalized.kind === KINDS.TEXTBOOK) {
    normalized.extra.maMonHoc = normalized.extra.maMonHoc || "TVS";
    normalized.extra.boMon = normalized.extra.boMon || sourceSubtype || "Giáo trình Chuyên ngành";
  } else if (normalized.kind === KINDS.REFERENCE) {
    normalized.extra.referenceSubtype = sourceSubtype || "Sách chuyên khảo";
    normalized.category = normalized.category && normalized.category !== "English public domain"
      ? normalized.category
      : normalized.extra.referenceSubtype;
  } else if (normalized.kind === KINDS.OTHER_BOOK) {
    normalized.extra.loaiSachKhac = sourceSubtype || "Văn học / Tiểu thuyết";
  } else if (normalized.kind === KINDS.MAGAZINE) {
    normalized.extra.magazineSubtype = sourceSubtype || "Báo giấy thường nhật / Báo tuần";
    normalized.category = normalized.category && normalized.category !== "English public domain"
      ? normalized.category
      : normalized.extra.magazineSubtype;
    normalized.extra.soPhatHanh = normalized.extra.soPhatHanh || 1;
    normalized.extra.thangPhatHanh = normalized.extra.thangPhatHanh || 1;
  } else if (normalized.kind === KINDS.RESEARCH) {
    normalized.extra.coQuanChuQuan = normalized.extra.coQuanChuQuan || normalized.publisher || "Nguồn catalog";
    normalized.extra.researchSubtype = sourceSubtype || "Báo cáo khoa học / Đề tài NCKH";
    normalized.extra.linhVuc = normalized.extra.researchSubtype;
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

function extraFieldsMarkup(kind, prefix = "") {
  if (kind === KINDS.TEXTBOOK) {
    return `
      <label>Phân loại Giáo trình (Khoa)
        <select name="boMon" id="${prefix}FacultySelect" required>
          <option value="Giáo trình Đại cương">Giáo trình Đại cương</option>
          <option value="Giáo trình Chuyên ngành">Giáo trình Chuyên ngành</option>
          <option value="Giáo trình Khoa học ứng dụng">Giáo trình Khoa học ứng dụng</option>
          <option value="Giáo trình Ngoại ngữ">Giáo trình Ngoại ngữ</option>
          <option value="Khác">Khác</option>
        </select>
      </label>
      <label>Môn học (Bộ môn)
        <input name="maMonHoc" id="${prefix}SubjectInput" list="${prefix}SubjectDatalist" placeholder="Chọn hoặc nhập môn học (VD: Toán cao cấp)" required autocomplete="off">
        <datalist id="${prefix}SubjectDatalist"></datalist>
      </label>
    `;
  }
  if (kind === KINDS.REFERENCE) {
    const subtypes = defaultSubtypesForKind(kind).filter((t) => t !== "Khác");
    return `
      <label>Phân loại Sách tham khảo
        <select name="referenceSubtype" required>
          ${subtypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
          <option value="Khác">Khác</option>
        </select>
      </label>
    `;
  }
  if (kind === KINDS.OTHER_BOOK) {
    return `
      <label>Phân loại Sách khác
        <select name="loaiSachKhac" required>
          ${otherBookTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (kind === KINDS.MAGAZINE) {
    const subtypes = defaultSubtypesForKind(kind).filter((t) => t !== "Khác");
    return `
      <label>Phân loại Báo/Tạp chí
        <select name="magazineSubtype" required>
          ${subtypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
          <option value="Khác">Khác</option>
        </select>
      </label>
      <div class="form-grid">
        <label>Số phát hành <input name="soPhatHanh" type="number" min="1" value="1" required></label>
        <label>Tháng phát hành <input name="thangPhatHanh" type="number" min="1" max="12" value="1" required></label>
      </div>
    `;
  }
  if (kind === KINDS.RESEARCH) {
    const subtypes = defaultSubtypesForKind(kind).filter((t) => t !== "Khác");
    return `
      <label>Phân loại Nghiên cứu
        <select name="researchSubtype" required>
          ${subtypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
          <option value="Khác">Khác</option>
        </select>
      </label>
      <label>Cơ quan chủ quản <input name="coQuanChuQuan" required></label>
    `;
  }
  return "";
}

function buildExtra(kind, data) {
  const extra = {};
  if (kind === KINDS.TEXTBOOK) {
    extra.maMonHoc = data.maMonHoc;
    extra.boMon = data.boMon;
  } else if (kind === KINDS.REFERENCE) {
    extra.referenceSubtype = data.referenceSubtype;
  } else if (kind === KINDS.OTHER_BOOK) {
    extra.loaiSachKhac = data.loaiSachKhac;
  } else if (kind === KINDS.MAGAZINE) {
    extra.soPhatHanh = Number(data.soPhatHanh);
    extra.thangPhatHanh = Number(data.thangPhatHanh);
    extra.magazineSubtype = data.magazineSubtype;
  } else if (kind === KINDS.RESEARCH) {
    extra.coQuanChuQuan = data.coQuanChuQuan;
    extra.researchSubtype = data.researchSubtype;
    extra.linhVuc = data.researchSubtype;
  }
  return extra;
}

function sampleState() {
  const accounts = clone(DEFAULT_ACCOUNTS);
  accounts["staff"] = {
    password: "staff",
    role: "staff",
    name: "Lê Minh Châu",
    title: "Nhân viên",
    personId: "NV001",
    email: "staff@gmail.com"
  };
  accounts["sv001"] = {
    password: "123",
    role: "reader",
    name: "Nguyễn Văn An",
    title: "Sinh viên",
    readerId: "SV001",
    approved: true,
    email: "sv001@gmail.com"
  };
  accounts["vc001"] = {
    password: "123",
    role: "reader",
    name: "Trần Thị Bình",
    title: "Viên chức",
    readerId: "VC001",
    approved: true,
    email: "vc001@gmail.com"
  };

  return {
    counters: {
      loan: 1,
      transaction: 1
    },
    accounts,
    readers: [
      {
        id: "SV001",
        name: "Nguyễn Văn An",
        type: "Sinh viên",
        birth: "2004-03-12",
        gender: "Nam",
        registered: "2026-01-01",
        expires: "2026-12-31",
        phone: "0901000001",
        address: "TP. Hồ Chí Minh",
        code: "22110001",
        borrowed: 0,
        limit: 5,
        email: "sv001@gmail.com"
      },
      {
        id: "VC001",
        name: "Trần Thị Bình",
        type: "Viên chức",
        birth: "1988-08-20",
        gender: "Nữ",
        registered: "2026-01-01",
        expires: "2026-12-31",
        phone: "0901000002",
        address: "TP. Hồ Chí Minh",
        code: "CB2026",
        borrowed: 0,
        limit: 10,
        email: "vc001@gmail.com"
      }
    ],
    staffs: [
      {
        id: "NV001",
        name: "Lê Minh Châu",
        birth: "1995-06-05",
        gender: "Nữ",
        phone: "0901000003",
        address: "TP. Hồ Chí Minh",
        position: "Thủ thư",
        shift: "Sáng",
        email: "staff@gmail.com"
      }
    ],
    admins: [
      {
        id: "AD001",
        name: "Quản trị viên",
        birth: "1990-10-10",
        gender: "Nam",
        phone: "0901000004",
        address: "TP. Hồ Chí Minh",
        username: "admin",
        permission: "Full",
        email: "admin@gmail.com"
      }
    ],
    documents: [
      {"id": "GT001", "title": "The C Programming Language", "kind": "Giáo trình", "year": 1978, "quantity": 34, "author": "Brian W. Kernighan", "publisher": "Independently Published", "category": "Công nghệ thông tin", "coverImage": "assets/covers/GT001.jpg", "extra": {"maMonHoc": "Giáo trình Chuyên ngành", "boMon": "Giáo trình Chuyên ngành"}},
      {"id": "GT002", "title": "The C++ Programming Language", "kind": "Giáo trình", "year": 1986, "quantity": 23, "author": "Bjarne Stroustrup", "publisher": "Addison Wesley Publishing Company", "category": "Công nghệ thông tin", "coverImage": "assets/covers/GT002.jpg", "extra": {"maMonHoc": "Giáo trình Chuyên ngành", "boMon": "Giáo trình Chuyên ngành"}},
      {"id": "TK001", "title": "Clean Code", "kind": "Sách tham khảo", "year": 2008, "quantity": 39, "author": "Robert C. Martin", "publisher": "Pearson Education, Limited", "category": "Sách chuyên khảo", "coverImage": "assets/covers/TK001.jpg", "extra": {"referenceSubtype": "Sách chuyên khảo"}},
      {"id": "TK005", "title": "The clean coder", "kind": "Sách tham khảo", "year": 2011, "quantity": 31, "author": "Robert C. Martin", "publisher": "Pearson Education, Limited", "category": "Sách chuyên khảo", "coverImage": "assets/covers/TK005.jpg", "extra": {"referenceSubtype": "Sách chuyên khảo"}},
      {"id": "SK002", "title": "Tôi thấy hoa vàng trên cỏ xanh", "kind": "Sách khác", "year": 2011, "quantity": 78, "author": "Nhật Ánh Nguyễn", "publisher": "Nhà xuất bản Tr̉e", "category": "Văn học", "coverImage": "assets/covers/SK002.jpg", "extra": {"loaiSachKhac": "Văn học / Tiểu thuyết"}},
      {"id": "SK005", "title": "Nhà giả kim", "kind": "Sách khác", "year": 2016, "quantity": 67, "author": "Paulo Coelho", "publisher": "Nhà xuất bản Văn Học", "category": "Văn học", "coverImage": "assets/covers/SK005.jpg", "extra": {"loaiSachKhac": "Văn học / Tiểu thuyết"}},
      {"id": "BC001", "title": "Scientific American: Mathematical Puzzles & Diversions", "kind": "Báo/tạp chí", "year": 1961, "quantity": 83, "author": "Martin Gardner", "publisher": "Penguin Books Ltd", "category": "Tạp chí Khoa học & Chuyên ngành", "coverImage": "assets/covers/BC001.jpg", "extra": {"soPhatHanh": 7, "thangPhatHanh": 11, "magazineSubtype": "Tạp chí Khoa học & Chuyên ngành"}},
      {"id": "BC008", "title": "Evolution (Scientific American)", "kind": "Báo/tạp chí", "year": 2006, "quantity": 34, "author": "Scientific American", "publisher": "University Of Chicago Press", "category": "Tạp chí Khoa học & Chuyên ngành", "coverImage": "assets/covers/BC008.jpg", "extra": {"soPhatHanh": 3, "thangPhatHanh": 11, "magazineSubtype": "Tạp chí Khoa học & Chuyên ngành"}},
      {"id": "NC001", "title": "Deep Learning", "kind": "Bài nghiên cứu", "year": 2016, "quantity": 80, "author": "Ian Goodfellow", "publisher": "MIT Press", "category": "Báo cáo khoa học / Đề tài NCKH", "coverImage": "assets/covers/NC001.jpg", "extra": {"coQuanChuQuan": "MIT Press", "researchSubtype": "Báo cáo khoa học / Đề tài NCKH", "linhVuc": "Báo cáo khoa học / Đề tài NCKH"}},
      {"id": "NC010", "title": "Pattern Recognition and Machine Learning", "kind": "Bài nghiên cứu", "year": 2008, "quantity": 59, "author": "Christopher M. Bishop", "publisher": "Springer", "category": "Báo cáo khoa học / Đề tài NCKH", "coverImage": "assets/covers/NC010.jpg", "extra": {"coQuanChuQuan": "Springer", "researchSubtype": "Báo cáo khoa học / Đề tài NCKH", "linhVuc": "Báo cáo khoa học / Đề tài NCKH"}}
    ],
    loans: [],
    transactions: [],
    seededSources: {}
  };
}

// Vá lại các khoá gốc bị thiếu/hỏng. Dùng chung cho loadState() và đồng bộ Firebase.
// Lưu ý: Firebase Realtime Database KHÔNG lưu mảng rỗng/null, nên sau khi xoá phần tử
// cuối của một danh sách, snapshot trả về sẽ thiếu khoá đó -> phải gán lại [] ở đây,
// nếu không các hàm render gọi .map()/.filter() trên undefined sẽ văng lỗi.
function normalizeState(loaded) {
  if (!loaded || typeof loaded !== "object") {
    return { state: sampleState(), changed: true };
  }

  let changed = false;

  if (!loaded.accounts || typeof loaded.accounts !== "object") {
    loaded.accounts = sampleState().accounts;
    changed = true;
  }
  if (!loaded.accounts.admin) {
    loaded.accounts.admin = sampleState().accounts.admin;
    changed = true;
  }
  if (!loaded.accounts.staff) {
    loaded.accounts.staff = sampleState().accounts.staff;
    changed = true;
  }
  if (!Array.isArray(loaded.documents)) {
    loaded.documents = sampleState().documents;
    changed = true;
  }
  if (!Array.isArray(loaded.readers)) {
    loaded.readers = [];
    changed = true;
  }
  if (!Array.isArray(loaded.staffs)) {
    loaded.staffs = [];
    changed = true;
  }
  if (!Array.isArray(loaded.admins)) {
    loaded.admins = sampleState().admins;
    changed = true;
  }
  if (!Array.isArray(loaded.loans)) {
    loaded.loans = [];
    changed = true;
  }
  if (!Array.isArray(loaded.transactions)) {
    loaded.transactions = [];
    changed = true;
  }
  if (!loaded.counters || typeof loaded.counters !== "object") {
    loaded.counters = { loan: 1, transaction: 1 };
    changed = true;
  }

  if (loaded.documents.length === 0) {
    const sample = sampleState();
    loaded.documents = sample.documents;
    loaded.readers = sample.readers;
    loaded.staffs = sample.staffs;
    loaded.accounts = { ...loaded.accounts, ...sample.accounts };
    changed = true;
  }

  return { state: loaded, changed };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const loaded = raw ? JSON.parse(raw) : null;

    if (!loaded) {
      return sampleState();
    }

    const { state: healed, changed } = normalizeState(loaded);
    if (changed) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(healed));
      } catch (e) {
        console.error("Failed to save healed state:", e);
      }
    }

    return healed;
  } catch (err) {
    console.error("Error loading state, falling back to sample state:", err);
    return sampleState();
  }
}

let state = loadState();

// Sync with Firebase Realtime Database in real-time
if (db) {
  db.ref("libraryState").on("value", (snapshot) => {
    const val = snapshot.val();
    if (val) {
      // Vá dữ liệu thô từ Firebase (Firebase loại bỏ mảng rỗng/null) trước khi dùng,
      // nếu không state.staffs/admins/... có thể là undefined và làm render văng lỗi.
      state = normalizeState(val).state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (currentUser) {
        renderAll();
      } else {
        updateLanguageUI();
      }
    } else {
      // If Firebase is empty (first launch), seed it with our local state
      db.ref("libraryState").set(state).catch((e) => console.error("Firebase seed failed:", e));
    }
  });
}

const viewState = {
  documentPage: 1,
  inventoryPage: 1
};

function saveState() {
  _cachedAllDocuments = null;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (db) {
      db.ref("libraryState").set(state).catch((e) => {
        // Thường gặp khi username chứa ký tự Firebase cấm trong key (. # $ [ ] /):
        // ghi server thất bại, thay đổi không đồng bộ -> đừng để im lặng.
        console.error("Firebase save failed:", e);
        if (document.querySelector("#toast")) {
          showToast("Đồng bộ máy chủ thất bại (kiểm tra tên đăng nhập có chứa . # $ [ ] /).");
        }
      });
    }
    return true;
  } catch {
    if (document.querySelector("#toast")) {
      showToast("Không lưu được: bộ nhớ trình duyệt đầy. Hãy dùng link file thay vì tải file lên.");
    }
    return false;
  }
}

function migrateStoredCatalogCodes() {
  let changed = false;
  const catalogs = catalogDocuments();
  const bySourceId = new Map(catalogs.map((documentItem) => [String(documentItem.extra?.gutenbergId || ""), documentItem]));
  const idMap = new Map();

  state.documents = (Array.isArray(state.documents) ? state.documents : []).flatMap((documentItem) => {
    if (isDigitalLibraryDocument(documentItem) || String(documentItem.id || "").startsWith("HCMUTE")) {
      changed = true;
      return [];
    }

    if (String(documentItem.id || "").startsWith("GUTENBERG") && documentItem.extra?.gutenbergId) {
      const next = bySourceId.get(String(documentItem.extra.gutenbergId));
      if (next) {
        const copy = { ...clone(next), quantity: documentItem.quantity || next.quantity };
        idMap.set(documentItem.id, copy.id);
        changed = true;
        return [copy];
      }
    }

    return [documentItem];
  });

  if (idMap.size) {
    state.loans = (state.loans || []).map((loan) => (
      idMap.has(loan.documentId) ? { ...loan, documentId: idMap.get(loan.documentId) } : loan
    ));
    state.transactions = (state.transactions || []).map((transaction) => (
      idMap.has(transaction.documentId) ? { ...transaction, documentId: idMap.get(transaction.documentId) } : transaction
    ));
  }

  state.loans = (state.loans || []).filter((loan) => !String(loan.documentId || "").startsWith("HCMUTE"));
  state.transactions = (state.transactions || []).filter((transaction) => !String(transaction.documentId || "").startsWith("HCMUTE"));

  if (changed) saveState();
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
  if (managed && !isDigitalLibraryDocument(managed)) return normalizeManagedDocument(managed);
  return catalogDocuments().find((documentItem) => documentItem.id === id);
}

function catalogDocuments() {
  if (_cachedCatalogDocuments) return _cachedCatalogDocuments;
  const catalogs = [];
  if (Array.isArray(window.GUTENBERG_CATALOG) && window.GUTENBERG_CATALOG.length) {
    catalogs.push(...window.GUTENBERG_CATALOG);
  }
  _cachedCatalogDocuments = catalogs.map(normalizeSourceDocument);
  return _cachedCatalogDocuments;
}

function allDocuments() {
  if (_cachedAllDocuments) return _cachedAllDocuments;
  const rows = [];
  const seenIds = new Set();
  const seenUrls = new Set();
  const deletedIds = new Set(state.deletedCatalogIds || []);

  [
    ...state.documents.map(normalizeManagedDocument).filter((documentItem) => !isDigitalLibraryDocument(documentItem)),
    ...catalogDocuments()
  ].forEach((documentItem) => {
    if (deletedIds.has(documentItem.id)) return;
    const url = documentFileUrl(documentItem);
    if (seenIds.has(documentItem.id) || (url && seenUrls.has(url))) return;
    seenIds.add(documentItem.id);
    if (url) seenUrls.add(url);
    rows.push(documentItem);
  });

  _cachedAllDocuments = rows;
  return _cachedAllDocuments;
}

function ensureManagedDocument(id) {
  id = String(id || "").trim().toUpperCase();
  const managed = state.documents.find((documentItem) => documentItem.id === id);
  if (managed && !isDigitalLibraryDocument(managed)) return normalizeManagedDocument(managed);

  const catalogItem = catalogDocuments().find((documentItem) => documentItem.id === id);
  if (!catalogItem) return null;

  const copy = clone(catalogItem);
  state.documents.push(copy);
  return normalizeManagedDocument(copy);
}

function documentOptionsMarkup(documents, query = "") {
  const needle = plainText(query);
  const needleKeywords = needle.split(/\s+/).filter(Boolean);
  const source = needleKeywords.length
    ? documents.filter((documentItem) => {
      const haystack = getSearchHaystack(documentItem);
      return needleKeywords.every((kw) => haystack.includes(kw));
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

function readerHasAccount(readerId) {
  return Object.values(state.accounts || {}).some((account) => (
    account.role === "reader" && account.readerId === readerId
  ));
}

function canAccessPage(pageName) {
  if (!currentUser) return pageName === "dashboard";
  return ROLE_PAGES[currentUser.role]?.has(pageName) || false;
}

function homePage() {
  return ROLE_HOME[currentUser?.role] || "dashboard";
}

function canManageLibraryActions() {
  return currentUser?.role === "admin" || currentUser?.role === "staff";
}

function guardLibraryAction() {
  if (canManageLibraryActions()) return true;
  showToast("Độc giả chỉ được xem sách đã mượn và sách trong thư viện.");
  return false;
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

function documentSubtypeLabel(documentItem) {
  if (documentItem.kind === KINDS.TEXTBOOK) {
    return documentItem.extra?.boMon || documentItem.category || "Khác";
  }
  if (documentItem.kind === KINDS.REFERENCE) {
    return documentItem.extra?.referenceSubtype || documentItem.category || "Khác";
  }
  if (documentItem.kind === KINDS.OTHER_BOOK) {
    return documentItem.extra?.loaiSachKhac || documentItem.category || "Khác";
  }
  if (documentItem.kind === KINDS.MAGAZINE) {
    return documentItem.extra?.magazineSubtype || documentItem.category || "Báo/tạp chí";
  }
  if (documentItem.kind === KINDS.RESEARCH) {
    return documentItem.extra?.researchSubtype || documentItem.extra?.linhVuc || documentItem.category || "Nghiên cứu";
  }
  return documentItem.category || "Khác";
}

function topicFilterLabel(kind) {
  if (kind === KINDS.TEXTBOOK) return "Bộ môn / môn học";
  if (kind === KINDS.REFERENCE) return "Chủ đề tham khảo";
  if (kind === KINDS.OTHER_BOOK) return "Thể loại sách";
  if (kind === KINDS.MAGAZINE) return "Nhóm báo/tạp chí";
  if (kind === KINDS.RESEARCH) return "Lĩnh vực nghiên cứu";
  return "Chủ đề theo loại";
}

function topicSearchPlaceholder(kind) {
  if (kind === KINDS.TEXTBOOK) return "Nhập bộ môn, mã môn học, tên môn";
  if (kind === KINDS.REFERENCE) return "Nhập chủ đề, ngành, lĩnh vực";
  if (kind === KINDS.OTHER_BOOK) return "Nhập truyện, văn học, kỹ năng, ngoại ngữ...";
  if (kind === KINDS.MAGAZINE) return "Nhập báo, tạp chí, số phát hành, tháng";
  if (kind === KINDS.RESEARCH) return "Nhập lĩnh vực, cơ quan chủ quản, loại nghiên cứu";
  return "Nhập bộ môn, môn học, lĩnh vực";
}

function documentTopicValues(documentItem, includePreview = false) {
  const extra = documentItem.extra || {};
  const preview = includePreview ? previewTopics(documentItem) : [];
  if (documentItem.kind === KINDS.TEXTBOOK) {
    return [extra.boMon, extra.maMonHoc, documentItem.category, ...preview].filter(Boolean);
  }
  if (documentItem.kind === KINDS.REFERENCE) {
    return [extra.referenceSubtype, documentItem.category, extra.boMon, extra.linhVuc, extra.loaiSachKhac, ...preview].filter(Boolean);
  }
  if (documentItem.kind === KINDS.OTHER_BOOK) {
    return [extra.loaiSachKhac, documentItem.category, ...preview].filter(Boolean);
  }
  if (documentItem.kind === KINDS.MAGAZINE) {
    return [extra.magazineSubtype, documentItem.category, extra.soPhatHanh && `Số ${extra.soPhatHanh}`, extra.thangPhatHanh && `Tháng ${extra.thangPhatHanh}`, ...preview].filter(Boolean);
  }
  if (documentItem.kind === KINDS.RESEARCH) {
    return [extra.researchSubtype || extra.linhVuc, extra.coQuanChuQuan, documentItem.category, ...preview].filter(Boolean);
  }
  return [documentSubtypeLabel(documentItem), documentDetail(documentItem), documentItem.category, ...preview].filter(Boolean);
}

function documentTopicLabel(documentItem) {
  return documentTopicValues(documentItem)[0] || documentSubtypeLabel(documentItem) || "Khác";
}

function documentTopicHaystack(documentItem) {
  if (!documentItem._topicHaystack) {
    documentItem._topicHaystack = plainText(documentTopicValues(documentItem, true).join(" "));
  }
  return documentItem._topicHaystack;
}

function cleanBookTitle(title) {
  return String(title || "Sách")
    .replace(/\s*:\s*\$b\s*/gi, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function coverTitleSnippet(title, maxLength = 34) {
  const clean = cleanBookTitle(title);
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1).trim()}…` : clean;
}

function previewTopics(documentItem) {
  const raw = String(documentItem.extra?.docTruoc || "");
  const body = raw.includes(":") ? raw.slice(raw.indexOf(":") + 1) : raw;
  return body
    .split(";")
    .map(formatPreviewTopic)
    .filter((part) => part && !/^[A-Z]{1,3}\d{0,4}$/i.test(part))
    .slice(0, 5);
}

function formatPreviewTopic(topic) {
  return String(topic || "")
    .replace(/\s*--\s*/g, " - ")
    .replace(/\bJuvenile fiction\b/gi, "truyện thiếu nhi")
    .replace(/\bJuvenile literature\b/gi, "sách thiếu nhi")
    .replace(/\bChildren's literature\b/gi, "văn học thiếu nhi")
    .replace(/\bChildren's poetry\b/gi, "thơ thiếu nhi")
    .replace(/\bShort stories\b/gi, "truyện ngắn")
    .replace(/\bDetective and mystery stories\b/gi, "truyện trinh thám")
    .replace(/\bFantasy literature\b/gi, "văn học kỳ ảo")
    .replace(/\bFairy tales\b/gi, "truyện cổ tích")
    .replace(/\bFiction\b/gi, "truyện hư cấu")
    .replace(/\bDrama\b/gi, "kịch")
    .replace(/\bPoetry\b/gi, "thơ")
    .replace(/\bBiography\b/gi, "tiểu sử")
    .replace(/\bHistory and criticism\b/gi, "lịch sử và phê bình")
    .replace(/\bHistory\b/gi, "lịch sử")
    .replace(/\bLiterature\b/gi, "văn học")
    .replace(/\bUnited States\b/gi, "Hoa Kỳ")
    .replace(/\bGreat Britain\b/gi, "Vương quốc Anh")
    .replace(/\bEngland\b/gi, "Anh")
    .replace(/\s+/g, " ")
    .trim();
}

function documentPreview(documentItem) {
  const title = cleanBookTitle(documentItem.title);
  const author = documentItem.author && documentItem.author !== "Unknown" ? documentItem.author : "tác giả chưa rõ";
  const subtype = documentSubtypeLabel(documentItem);
  const topics = previewTopics(documentItem);
  const topicText = topics.length
    ? topics.join("; ")
    : (documentItem.extra?.linhVuc || documentItem.category || documentDetail(documentItem) || "nội dung tổng quát");

  return `“${title}” là ${String(documentItem.kind || "tài liệu").toLowerCase()} thuộc nhóm ${subtype}. Tài liệu do ${author} biên soạn hoặc được ghi nhận là tác giả, nội dung xoay quanh ${topicText}. Phần này giúp đọc trước chủ đề chính để chọn sách, nhập kho, mượn và trả đúng nhu cầu.`;
}

function documentKindLabel(documentItem) {
  const subtype = documentSubtypeLabel(documentItem);
  if (subtype) {
    return `${documentItem.kind} / ${subtype}`;
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

function documentMatchesFilters(documentItem) {
  const keyword = plainText(byId("documentSearch").value.trim());
  const type = byId("documentTypeFilter").value;
  const topic = byId("otherBookTypeFilter").value;
  const topicKeyword = plainText(byId("documentTopicSearch")?.value.trim() || "");
  const haystack = getSearchHaystack(documentItem);
  const keywords = keyword.split(/\s+/).filter(Boolean);
  const matchKeyword = !keywords.length || keywords.every((kw) => haystack.includes(kw));
  const matchType = type === "all" || documentItem.kind === type;
  const matchTopic = topic === "all" || documentTopicValues(documentItem).includes(topic);
  const topicKeywords = topicKeyword.split(/\s+/).filter(Boolean);
  const matchTopicKeyword = !topicKeywords.length || topicKeywords.every((kw) => documentTopicHaystack(documentItem).includes(kw));
  return matchKeyword && matchType && matchTopic && matchTopicKeyword;
}

function renderDocuments() {
  renderDocumentSubtypeOptions();

  const keyword = plainText(byId("documentSearch").value.trim());
  const topicKeyword = plainText(byId("documentTopicSearch")?.value.trim() || "");
  
  const queryMatchedDocs = allDocuments().filter((doc) => {
    const haystack = getSearchHaystack(doc);
    const keywords = keyword.split(/\s+/).filter(Boolean);
    const matchKeyword = !keywords.length || keywords.every((kw) => haystack.includes(kw));

    const topicKeywords = topicKeyword.split(/\s+/).filter(Boolean);
    const matchTopicKeyword = !topicKeywords.length || topicKeywords.every((kw) => documentTopicHaystack(doc).includes(kw));

    return matchKeyword && matchTopicKeyword;
  });

  const breakdownDiv = byId("searchCategoryBreakdown");
  if (breakdownDiv) {
    if ((keyword || topicKeyword) && queryMatchedDocs.length > 0) {
      const breakdown = {};
      queryMatchedDocs.forEach((doc) => {
        const cat = documentTopicLabel(doc) || "Khác";
        breakdown[cat] = (breakdown[cat] || 0) + 1;
      });

      const sortedCats = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
      const currentTopicFilter = byId("otherBookTypeFilter").value;

      breakdownDiv.innerHTML = `
        <div class="search-category-title">Phân loại thể loại kết quả (${queryMatchedDocs.length} tài liệu):</div>
        <div class="category-chips-list">
          <button type="button" class="category-chip ${currentTopicFilter === "all" ? "active" : ""}" data-facet-value="all">
            Tất cả <span class="count">${queryMatchedDocs.length}</span>
          </button>
          ${sortedCats.map(([cat, count]) => `
            <button type="button" class="category-chip ${currentTopicFilter === cat ? "active" : ""}" data-facet-value="${escapeHtml(cat)}">
              ${escapeHtml(cat)} <span class="count">${count}</span>
            </button>
          `).join("")}
        </div>
      `;
      breakdownDiv.style.display = "flex";

      if (!breakdownDiv.dataset.hasListener) {
        breakdownDiv.addEventListener("click", (e) => {
          const chip = e.target.closest(".category-chip");
          if (!chip) return;
          const facetValue = chip.dataset.facetValue;
          if (facetValue === "all") {
            byId("documentTypeFilter").value = "all";
            renderDocumentSubtypeOptions();
            byId("otherBookTypeFilter").value = "all";
          } else {
            const docWithCat = allDocuments().find((doc) => documentTopicLabel(doc) === facetValue);
            if (docWithCat) {
              byId("documentTypeFilter").value = docWithCat.kind;
              renderDocumentSubtypeOptions();
            }
            byId("otherBookTypeFilter").value = facetValue;
          }
          viewState.documentPage = 1;
          renderDocuments();
        });
        breakdownDiv.dataset.hasListener = "true";
      }
    } else {
      breakdownDiv.innerHTML = "";
      breakdownDiv.style.display = "none";
    }
  }

  const rows = allDocuments().filter(documentMatchesFilters);
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
      <td><button class="text-button" type="button" data-detail="${escapeHtml(documentItem.id)}">Chi tiết</button></td>
    </tr>
  `).join("") || `<tr><td colspan="6" class="muted">Không có tài liệu phù hợp.</td></tr>`;
}

function renderReaders() {
  byId("readerCount").textContent = `${state.readers.length} người`;
  byId("readersTable").innerHTML = state.readers.map((reader) => {
    const expired = reader.expires < todayISO();
    const avatarUrl = reader.avatar || "assets/default_avatar.svg";
    const deleteBtn = `<button class="secondary-button" style="padding: 4px 8px; font-size: 0.8rem; border-color: var(--rose); color: var(--rose);" onclick="deletePersonAccount('${escapeHtml(reader.id)}', 'reader')">Xóa</button>`;
    return `
      <tr>
        <td><strong>${escapeHtml(reader.id)}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${avatarUrl}" alt="Avatar" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid var(--line); background: var(--bg);">
            <div>
              <strong>${escapeHtml(reader.name)}</strong><br>
              <span class="muted" style="font-size: 0.8rem;">${escapeHtml(reader.phone)} - ${escapeHtml(reader.address)}</span>
            </div>
          </div>
        </td>
        <td>${escapeHtml(reader.type)}<br><span class="muted">${escapeHtml(reader.code)}</span></td>
        <td><span class="status ${expired ? "bad" : "ok"}">${expired ? "Hết hạn" : "Còn hạn"}</span></td>
        <td>${escapeHtml(reader.borrowed)}/${escapeHtml(reader.limit)}</td>
        <td>${deleteBtn}</td>
      </tr>
    `;
  }).join("");
  renderPendingApprovals();
  updatePendingBadge();
}

function renderPendingApprovals() {
  const pending = Object.entries(state.accounts || {}).filter(([username, acc]) => acc && acc.role === "reader" && acc.approved === false);
  byId("pendingApprovalsCount").textContent = pending.length;
  
  if (pending.length === 0) {
    byId("pendingApprovalsTable").innerHTML = `
      <tr>
        <td colspan="3" class="muted text-center" style="padding: 15px 0;">Không có tài khoản chờ duyệt</td>
      </tr>
    `;
    return;
  }
  
  byId("pendingApprovalsTable").innerHTML = pending.map(([username, acc]) => {
    const avatarUrl = acc.avatar || "assets/default_avatar.svg";
    return `
      <tr>
        <td><strong>${escapeHtml(username)}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${avatarUrl}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--line); background: var(--bg);">
            <div>
              <strong>${escapeHtml(acc.name)}</strong><br>
              <span class="muted" style="font-size: 0.8rem;">${escapeHtml(acc.readerId)}</span>
            </div>
          </div>
        </td>
        <td>
          <button class="primary-button" style="padding: 4px 8px; font-size: 0.8rem;" onclick="approveAccount('${escapeHtml(username)}')">Duyệt</button>
          <button class="secondary-button" style="padding: 4px 8px; font-size: 0.8rem; border-color: var(--rose); color: var(--rose); margin-left: 5px;" onclick="rejectAccount('${escapeHtml(username)}')">Từ chối</button>
        </td>
      </tr>
    `;
  }).join("");
}

function updatePendingBadge() {
  const badge = byId("pendingApprovalsBadge");
  if (!badge) return;
  
  if (currentUser && currentUser.role === "admin") {
    const pendingCount = Object.values(state.accounts || {}).filter(acc => acc && acc.role === "reader" && acc.approved === false).length;
    if (pendingCount > 0) {
      badge.textContent = pendingCount;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  } else {
    badge.style.display = "none";
  }
}

function approveAccount(username) {
  if (state.accounts[username]) {
    state.accounts[username].approved = true;
    saveState();
    renderReaders();
    showToast(`Đã duyệt tài khoản ${username}.`);
  }
}

function rejectAccount(username) {
  if (confirm(`Bạn có chắc chắn muốn từ chối và xóa yêu cầu đăng ký của tài khoản ${username}?`)) {
    if (state.accounts[username]) {
      const readerId = state.accounts[username].readerId;
      delete state.accounts[username];
      const readerIndex = state.readers.findIndex(r => r.id === readerId);
      if (readerIndex !== -1) {
        state.readers.splice(readerIndex, 1);
      }
      saveState();
      renderReaders();
      showToast(`Đã từ chối và xóa tài khoản ${username}.`);
    }
  }
}

function deletePersonAccount(id, type) {
  const isVi = currentLang === "vi";
  
  if (type === "reader") {
    const activeLoans = state.loans.filter(l => l.readerId === id);
    if (activeLoans.length > 0) {
      alert(isVi 
        ? "Không thể xóa độc giả đang mượn sách. Vui lòng ghi nhận trả sách trước." 
        : "Cannot delete reader with active loans. Please return books first.");
      return;
    }
    
    const confirmMsg = isVi 
      ? `Bạn có chắc chắn muốn xóa vĩnh viễn độc giả ${id}? Hành động này sẽ xóa cả tài khoản đăng nhập đi kèm.`
      : `Are you sure you want to permanently delete reader ${id}? This will also delete the associated login account.`;
      
    if (confirm(confirmMsg)) {
      const accountEntry = Object.entries(state.accounts).find(([uname, acc]) => acc && acc.role === "reader" && acc.readerId === id);
      if (accountEntry) {
        delete state.accounts[accountEntry[0]];
      }
      state.readers = state.readers.filter(r => r.id !== id);
      saveState();
      renderAll();
      showToast(isVi ? "Đã xóa độc giả thành công." : "Deleted reader successfully.");
    }
  } else if (type === "staff") {
    if (confirm(isVi ? `Bạn có chắc chắn muốn xóa nhân viên ${id}?` : `Are you sure you want to delete staff ${id}?`)) {
      const accountEntry = Object.entries(state.accounts).find(([uname, acc]) => acc && acc.role === "staff" && acc.personId === id);
      if (accountEntry) {
        delete state.accounts[accountEntry[0]];
      }
      state.staffs = state.staffs.filter(s => s.id !== id);
      saveState();
      renderAll();
      showToast(isVi ? "Đã xóa nhân viên thành công." : "Deleted staff successfully.");
    }
  } else if (type === "admin") {
    if (id === "AD001") {
      alert(isVi ? "Không thể xóa tài khoản Quản trị viên mặc định." : "Cannot delete default admin.");
      return;
    }
    if (confirm(isVi ? `Bạn có chắc chắn muốn xóa quản trị viên ${id}?` : `Are you sure you want to delete admin ${id}?`)) {
      const accountEntry = Object.entries(state.accounts).find(([uname, acc]) => acc && acc.role === "admin" && acc.personId === id);
      if (accountEntry) {
        delete state.accounts[accountEntry[0]];
      }
      state.admins = state.admins.filter(a => a.id !== id);
      saveState();
      renderAll();
      showToast(isVi ? "Đã xóa quản trị viên thành công." : "Deleted admin successfully.");
    }
  }
}

function renderPeople() {
  const rows = [
    ...(state.readers || []).map((reader) => ({
      id: reader.id,
      name: reader.name,
      role: reader.type,
      contact: `${reader.phone} - ${reader.address}`,
      detail: `Thẻ: ${formatDate(reader.registered)} - ${formatDate(reader.expires)}; mượn ${reader.borrowed}/${reader.limit}`,
      type: "reader"
    })),
    ...(state.staffs || []).map((staff) => ({
      id: staff.id,
      name: staff.name,
      role: "Nhân viên",
      contact: `${staff.phone} - ${staff.address}`,
      detail: `${staff.position}; ca ${staff.shift}`,
      type: "staff"
    })),
    ...(state.admins || []).map((admin) => ({
      id: admin.id,
      name: admin.name,
      role: "Quản trị viên",
      contact: `${admin.phone} - ${admin.address}`,
      detail: `Tài khoản ${admin.username}; quyền ${admin.permission}`,
      type: "admin",
      username: admin.username
    }))
  ];

  byId("peopleCount").textContent = `${rows.length} người`;
  byId("peopleTable").innerHTML = rows.map((person) => {
    const isCurrent = currentUser && (person.id === currentUser.personId || (person.username && person.username === currentUser.username));
    const isMasterAdmin = person.id === "AD001" || person.username === "admin";
    const deleteBtn = (isCurrent || isMasterAdmin)
      ? `<span class="muted" style="font-size: 0.8rem;">Không thể xóa</span>`
      : `<button class="secondary-button" style="padding: 4px 8px; font-size: 0.8rem; border-color: var(--rose); color: var(--rose);" onclick="deletePersonAccount('${escapeHtml(person.id)}', '${escapeHtml(person.type)}')">Xóa</button>`;
    
    return `
      <tr>
        <td><strong>${escapeHtml(person.id)}</strong></td>
        <td>${escapeHtml(person.name)}</td>
        <td>${escapeHtml(person.role)}</td>
        <td>${escapeHtml(person.contact)}</td>
        <td>${escapeHtml(person.detail)}</td>
        <td>${deleteBtn}</td>
      </tr>
    `;
  }).join("");
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
      <td>${statusBadge(documentItem.quantity > 0, "Còn tài liệu", "Hết tài liệu", "warn")}</td>
    </tr>
  `).join("") || `<tr><td colspan="6" class="muted">Chưa có tài liệu.</td></tr>`;
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
  const libraryTable = byId("readerLibraryTable");
  const transactionsTable = byId("readerTransactionsTable");

  if (!reader) {
    info.innerHTML = `<p class="muted">Không có hồ sơ độc giả.</p>`;
    stats.innerHTML = "";
    loansTable.innerHTML = `<tr><td colspan="5" class="muted">Không có dữ liệu.</td></tr>`;
    byId("readerLibraryCount").textContent = "0 mục";
    libraryTable.innerHTML = `<tr><td colspan="5" class="muted">Không có dữ liệu.</td></tr>`;
    transactionsTable.innerHTML = `<tr><td colspan="5" class="muted">Không có dữ liệu.</td></tr>`;
    return;
  }

  const readerLoans = state.loans.filter((loan) => loan.readerId === reader.id);
  const readerTransactions = state.transactions.filter((transaction) => transaction.readerId === reader.id);
  const libraryRows = allDocuments().filter((documentItem) => Number(documentItem.quantity) > 0);
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

  byId("readerLibraryCount").textContent = `${libraryRows.length} mục`;
  libraryTable.innerHTML = libraryRows.slice(0, DOCUMENT_PAGE_SIZE).map((documentItem) => `
    <tr>
      <td><strong>${escapeHtml(documentItem.id)}</strong></td>
      <td>${escapeHtml(documentItem.title)}<br><span class="muted">${escapeHtml(documentItem.author)} - ${escapeHtml(documentItem.publisher)}</span></td>
      <td>${escapeHtml(documentKindLabel(documentItem))}</td>
      <td>${escapeHtml(documentItem.quantity)}</td>
      <td>${statusBadge(isBorrowable(documentItem), "Mượn qua thủ thư", "Đọc tại chỗ", "warn")}</td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="muted">Không có sách trong thư viện.</td></tr>`;

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

  // Re-render contents dynamically on page switch to ensure fresh data display
  if (nextPage === "readers") {
    renderReaders();
    renderPeople();
  } else if (nextPage === "dashboard") {
    renderDashboard();
  } else if (nextPage === "documents") {
    renderDocuments();
  } else if (nextPage === "loans") {
    renderLoans();
  } else if (nextPage === "inventory") {
    renderInventory();
  } else if (nextPage === "transactions") {
    renderTransactions();
  }
}

function setupTextbookExtraFieldsEvents(prefix) {
  const facultySelect = byId(`${prefix}FacultySelect`);
  const subjectDatalist = byId(`${prefix}SubjectDatalist`);
  if (!facultySelect || !subjectDatalist) return;

  function updateSubjects() {
    const faculty = facultySelect.value;
    const fac = TEXTBOOK_FACULTIES.find((f) => f.name === faculty);
    const subjects = fac ? fac.subjects : [];
    subjectDatalist.innerHTML = subjects.map((subj) => `<option value="${escapeHtml(subj)}">`).join("");
  }

  facultySelect.addEventListener("change", updateSubjects);
  updateSubjects();
}

function renderDocumentExtraFields() {
  const kind = byId("documentKind").value;
  byId("documentExtraFields").innerHTML = extraFieldsMarkup(kind, "document");
  if (kind === KINDS.TEXTBOOK) {
    setupTextbookExtraFieldsEvents("document");
  }
}

function renderImportExtraFields() {
  const kind = byId("importKind").value;
  byId("importExtraFields").innerHTML = extraFieldsMarkup(kind, "import");
  if (kind === KINDS.TEXTBOOK) {
    setupTextbookExtraFieldsEvents("import");
  }
}

async function handleDocumentSubmit(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép thêm tài liệu.");
    return;
  }
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
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép đăng ký người đọc.");
    return;
  }
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
  if (!data.password || data.password.length < 3) {
    showToast("Mật khẩu phải có ít nhất 3 ký tự.");
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
    limit: data.type === READER_TYPES.STUDENT ? 5 : 10,
    email: data.email.trim()
  });

  state.accounts[username] = {
    password: data.password,
    role: "reader",
    name: data.name.trim(),
    title: "Độc giả",
    personId: id,
    readerId: id,
    approved: true,
    email: data.email.trim()
  };

  saveState();
  form.reset();
  setDefaultDates();
  renderAll();
  showToast("Đã thêm người đọc.");
}

function handleStaffSubmit(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép quản lý nhân viên.");
    return;
  }
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
    shift: data.shift.trim(),
    email: data.email.trim()
  });
  state.accounts[username] = {
    password: data.password,
    role: "staff",
    name: data.name.trim(),
    title: "Nhân viên",
    personId: id,
    email: data.email.trim()
  };

  saveState();
  form.reset();
  setDefaultDates();
  renderAll();
  showToast("Đã thêm nhân viên.");
}

function handleAdminSubmit(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép quản lý quản trị viên.");
    return;
  }
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
    permission: data.permission.trim(),
    email: data.email.trim()
  });
  state.accounts[username] = {
    password: data.password,
    role: "admin",
    name: data.name.trim(),
    title: "Quản trị viên",
    personId: id,
    email: data.email.trim()
  };

  saveState();
  form.reset();
  setDefaultDates();
  renderAll();
  showToast("Đã thêm quản trị viên.");
}

function handleBorrowSubmit(event) {
  event.preventDefault();
  if (!guardLibraryAction()) return;
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
  if (!guardLibraryAction()) return;
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
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép thực hiện nhập kho.");
    return;
  }
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
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "staff")) {
    showToast("Chỉ có Quản trị viên hoặc Nhân viên mới được phép cập nhật file sách.");
    return;
  }
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
    ["Mã sách", documentItem.id],
    ["Loại tài liệu", documentItem.kind],
    ["Phân loại chi tiết", documentSubtypeLabel(documentItem)],
    ["Tác giả", documentItem.author],
    ["Nguồn / Nhà xuất bản", documentItem.publisher],
    ["Năm xuất bản", documentItem.year],
    ["Số lượng trong kho", `${documentItem.quantity} bản`],
    ["Trạng thái quản lý", documentItem.quantity > 0 ? "Có thể mượn/trả trong hệ thống" : "Hết sách trong kho"]
  ];
  const coverLargeUrl = documentItem.coverImage || openLibraryCoverUrl(documentItem) || gutenbergCoverUrl(documentItem);
  const coverLargeMarkup = coverLargeUrl
    ? coverImageMarkup(documentItem, "cover-large", coverLargeUrl)
    : generatedCover(documentItem, "cover-large");

  if (!documentItem.coverImage) {
    fetchAndSetCoverFromGoogleBooks(documentItem);
  }

  const canDelete = currentUser && currentUser.role === "admin";
  const deleteMarkup = canDelete
    ? `<button class="secondary-button" style="margin-top: 15px; border-color: var(--rose); color: var(--rose); width: 100%;" onclick="deleteDocument('${escapeHtml(id)}')">Xóa tài liệu</button>`
    : "";

  byId("documentModalContent").innerHTML = `
    <div class="document-detail">
      <div>
        ${coverLargeMarkup}
        ${deleteMarkup}
      </div>
      <div>
        <h2>${escapeHtml(documentItem.title)}</h2>
        <div class="reader-info">
          ${rows.map(([key, value]) => `<div class="info-row"><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
        </div>
        ${preview ? `<div class="document-preview"><strong>Tóm tắt nội dung</strong><p>${escapeHtml(preview)}</p></div>` : ""}
      </div>
    </div>
  `;

  byId("documentModal").hidden = false;
  byId("closeDocumentModal").focus();
}

function closeDocumentModal() {
  byId("documentModal").hidden = true;
}

function deleteDocument(id) {
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép xóa tài liệu.");
    return;
  }
  
  const documentItem = findDocument(id);
  if (!documentItem) {
    showToast("Không tìm thấy tài liệu cần xóa.");
    return;
  }
  
  if (!confirm(`Bạn có chắc chắn muốn xóa tài liệu "${documentItem.title}" không?`)) {
    return;
  }
  
  // 1. Remove from state.documents if it exists there
  state.documents = state.documents.filter(doc => doc.id !== id);
  
  // 2. Add to deletedCatalogIds to hide from catalog listing
  state.deletedCatalogIds = state.deletedCatalogIds || [];
  if (!state.deletedCatalogIds.includes(id)) {
    state.deletedCatalogIds.push(id);
  }
  
  saveState();
  closeDocumentModal();
  renderAll();
  showToast("Đã xóa tài liệu.");
}

function handleExportSubmit(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Chỉ có Quản trị viên mới được phép thực hiện xuất kho.");
    return;
  }
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

  byId("documentForm").closest("section").hidden = !isAdmin;
  byId("readerForm").closest("section").hidden = !isAdmin;
  document.querySelectorAll(".admin-only").forEach((element) => {
    element.hidden = !isAdmin;
  });

  byId("resetDataBtn").hidden = !isAdmin;
  
  const importForm = byId("importForm");
  const exportForm = byId("exportForm");
  if (importForm && exportForm) {
    const importExportContainer = importForm.closest(".two-column");
    if (importExportContainer) {
      importExportContainer.hidden = !isAdmin;
    }
  }

  document.querySelectorAll('[data-jump="loans"]').forEach((button) => {
    button.hidden = isReader;
  });

  const eyebrow = document.querySelector(".topbar .eyebrow");
  if (eyebrow) {
    const t = (key) => TRANSLATIONS[currentLang][key] || key;
    if (isAdmin) eyebrow.textContent = t("eyebrow_admin");
    if (isStaff) eyebrow.textContent = t("eyebrow_staff");
    if (isReader) eyebrow.textContent = t("eyebrow_reader");
  }

  document.querySelectorAll('input[name="staffId"]').forEach((input) => {
    if (!currentUser || isReader) return;
    input.value = currentUser.personId || (isAdmin ? "AD001" : "NV001");
  });
}

function enterApp(user, username) {
  const latestUser = state.accounts[username] || user;
  currentUser = { ...latestUser, username };
  
  byId("loginOverlay").classList.add("hidden");
  byId("appShell").style.display = "";
  byId("userName").textContent = currentUser.name;
  byId("userRole").textContent = currentUser.title;

  if (currentUser.role === "admin") {
    byId("deleteSelfBtn").style.display = "none";
  } else {
    byId("deleteSelfBtn").style.display = "block";
  }

  const avatarEl = byId("userAvatar");
  if (avatarEl) {
    avatarEl.src = currentUser.avatar || "assets/default_avatar.svg";
  }

  applyRoleRestrictions();
  setPage(homePage());
  renderAll();
  updateLanguageUI();
  
  const t = (key) => TRANSLATIONS[currentLang][key] || key;
  showToast(t("toast_welcome") + currentUser.name + "!");

  if (currentUser.role === "admin") {
    const pendingCount = Object.values(state.accounts || {}).filter(acc => acc && acc.role === "reader" && acc.approved === false).length;
    if (pendingCount > 0) {
      setTimeout(() => {
        showToast(t("toast_pending_count").replace("{count}", pendingCount));
      }, 1500);
    }
  }
}

function handleLogin(event) {
  event.preventDefault();
  let username = byId("loginUsername").value.trim().toLowerCase();
  const password = byId("loginPassword").value;
  const error = byId("loginError");
  error.style.color = ""; // reset to default CSS color
  const t = (key) => TRANSLATIONS[currentLang][key] || key;

  let user = state.accounts[username];
  if (!user) {
    // Try to find by email
    const entry = Object.entries(state.accounts).find(([uname, acc]) => acc && acc.email && acc.email.toLowerCase() === username);
    if (entry) {
      username = entry[0];
      user = entry[1];
    }
  }

  if (!user || user.password !== password) {
    error.textContent = t("error_wrong_auth");
    byId("loginPassword").value = "";
    return;
  }

  // Check reader approval status
  if (user.role === "reader" && user.approved === false) {
    error.textContent = t("error_not_approved");
    return;
  }

  error.textContent = "";
  enterApp(user, username);
}

function handlePublicReaderSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const id = data.id.trim().toUpperCase();
  const username = data.username.trim().toLowerCase();
  const error = byId("signupError");
  const t = (key) => TRANSLATIONS[currentLang][key] || key;

  if (state.accounts[username]) {
    error.textContent = t("error_exists");
    return;
  }
  if (!data.password || data.password.length < 3) {
    error.textContent = t("error_password_len");
    return;
  }

  const existingReader = findReader(id);
  if (personIdExists(id)) {
    if (!existingReader || readerHasAccount(id)) {
      error.textContent = t("error_id_exists");
      return;
    }

    state.accounts[username] = {
      password: data.password,
      role: "reader",
      name: existingReader.name,
      title: "Độc giả",
      personId: id,
      readerId: id,
      approved: false,
      email: data.email.trim()
    };

    saveState();
    error.textContent = "";
    form.reset();
    
    // Switch to login tab and show success message
    document.querySelector('[data-auth-tab="login"]').click();
    showToast(t("toast_pending_approval"));
    const loginErrorEl = byId("loginError");
    if (loginErrorEl) {
      loginErrorEl.textContent = t("toast_pending_approval");
      loginErrorEl.style.color = "#10b981"; // Success green
    }
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
    limit,
    email: data.email.trim()
  });

  state.accounts[username] = {
    password: data.password,
    role: "reader",
    name: data.name.trim(),
    title: "Độc giả",
    personId: id,
    readerId: id,
    approved: false,
    email: data.email.trim()
  };

  saveState();
  error.textContent = "";
  form.reset();
  
  // Switch to login tab and show success message
  document.querySelector('[data-auth-tab="login"]').click();
  showToast(t("toast_pending_approval"));
  const loginErrorEl = byId("loginError");
  if (loginErrorEl) {
    loginErrorEl.textContent = t("toast_pending_approval");
    loginErrorEl.style.color = "#10b981"; // Success green
  }
}

function handleLogout() {
  currentUser = null;
  byId("loginOverlay").classList.remove("hidden");
  byId("appShell").style.display = "none";
  byId("appShell").classList.remove("staff-view", "reader-view");
  byId("loginForm").reset();
  byId("loginError").textContent = "";
  byId("deleteSelfBtn").style.display = "none";
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("restricted"));
  setPage("dashboard");
}

window.triggerAvatarUpload = function() {
  const input = byId("avatarFileInput");
  if (input) input.click();
};

async function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const dataUrl = await readImageAsThumb(file);
  if (!dataUrl) {
    showToast("Không thể tải ảnh. Hãy chọn ảnh khác.");
    return;
  }

  // Update account avatar
  const username = currentUser.username;
  if (state.accounts[username]) {
    state.accounts[username].avatar = dataUrl;
    currentUser.avatar = dataUrl;
  }

  // Update specific role collections
  const role = currentUser.role;
  const personId = currentUser.personId || currentUser.readerId;
  
  if (role === "reader") {
    const reader = state.readers.find(r => r.id === personId);
    if (reader) reader.avatar = dataUrl;
  } else if (role === "staff") {
    const staff = state.staffs.find(s => s.id === personId);
    if (staff) staff.avatar = dataUrl;
  } else if (role === "admin") {
    if (Array.isArray(state.admins)) {
      const admin = state.admins.find(a => a.id === personId || a.username === username);
      if (admin) admin.avatar = dataUrl;
    }
  }

  saveState();
  
  // Update UI immediately
  const avatarEl = byId("userAvatar");
  if (avatarEl) {
    avatarEl.src = dataUrl;
  }

  renderAll();
  showToast("Cập nhật ảnh đại diện thành công!");
}

function renderDocumentSubtypeOptions() {
  const select = byId("otherBookTypeFilter");
  if (!select) return;
  const selected = select.value || "all";
  const type = byId("documentTypeFilter")?.value || "all";
  const documents = allDocuments().filter((documentItem) => type === "all" || documentItem.kind === type);
  const availableSubtypes = [...new Set(documents.map(documentTopicLabel).filter(Boolean))];
  let subtypes;
  if (type === "all") {
    subtypes = [...new Set(availableSubtypes)];
  } else {
    const allowedDefaults = defaultSubtypesForKind(type);
    const otherKindDefaults = new Set(
      Object.values(KINDS)
        .filter((k) => k !== type)
        .flatMap((k) => defaultSubtypesForKind(k))
    );
    subtypes = [...new Set([
      ...allowedDefaults.filter((subtype) => availableSubtypes.includes(subtype)),
      ...availableSubtypes.filter((subtype) => allowedDefaults.includes(subtype) || !otherKindDefaults.has(subtype))
    ])];
  }
  subtypes.sort((a, b) => a.localeCompare(b, "vi"));
  const label = topicFilterLabel(type);
  const labelElement = byId("documentTopicFilterLabel");
  const searchLabel = byId("documentTopicSearchLabel");
  const searchInput = byId("documentTopicSearch");
  if (labelElement) labelElement.textContent = label;
  if (searchLabel) searchLabel.textContent = `Tìm ${label.toLowerCase()}`;
  if (searchInput) searchInput.placeholder = topicSearchPlaceholder(type);
  select.innerHTML = [
    `<option value="all">Tất cả ${escapeHtml(label.toLowerCase())}</option>`,
    ...subtypes.map((subtype) => `<option value="${escapeHtml(subtype)}">${escapeHtml(subtype)}</option>`)
  ].join("");
  select.value = subtypes.includes(selected) ? selected : "all";
}

function handlePagerClick(event) {
  const button = event.target.closest("[data-page-target]");
  if (!button || button.disabled) return;

  const target = button.dataset.pageTarget;
  const action = button.dataset.pageAction;
  const rows = target === "documents"
    ? allDocuments().filter(documentMatchesFilters)
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
  byId("documentTopicSearch").addEventListener("input", () => {
    viewState.documentPage = 1;
    renderDocuments();
  });
  byId("documentTypeFilter").addEventListener("change", () => {
    viewState.documentPage = 1;
    byId("otherBookTypeFilter").value = "all";
    byId("documentTopicSearch").value = "";
    renderDocumentSubtypeOptions();
    renderDocuments();
  });
  byId("otherBookTypeFilter").addEventListener("change", () => {
    viewState.documentPage = 1;
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
  byId("avatarFileInput").addEventListener("change", handleAvatarChange);

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
      byId("forgotPanel").classList.remove("active");
    });
  });

  // Public reader signup form
  byId("publicReaderForm").addEventListener("submit", handlePublicReaderSignup);

  // Forgot password link click
  byId("forgotPasswordLink").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
    byId("loginPanel").classList.remove("active");
    byId("signupPanel").classList.remove("active");
    byId("forgotPanel").classList.add("active");
    
    // Reset steps inside forgot panel
    byId("forgotStep1").style.display = "block";
    byId("forgotStep2").style.display = "none";
    byId("forgotStep3").style.display = "none";
    byId("forgotError").textContent = "";
    byId("forgotEmail").value = "";
    byId("forgotOtp").value = "";
    byId("forgotNewPassword").value = "";
    byId("forgotConfirmPassword").value = "";
    byId("otpSimulationInfo").style.display = "none";
  });

  // Back to login link click
  byId("backToLoginLink").addEventListener("click", (e) => {
    e.preventDefault();
    // Switch auth tabs
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
    document.querySelector('[data-auth-tab="login"]').classList.add("active");
    byId("loginPanel").classList.add("active");
    byId("signupPanel").classList.remove("active");
    byId("forgotPanel").classList.remove("active");
  });

  let forgotTargetUsername = "";
  let forgotGeneratedOtp = "";

  byId("forgotForm").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // Step 1: Send OTP
  byId("btnSendOtp").addEventListener("click", (e) => {
    e.preventDefault();
    const emailInput = byId("forgotEmail").value.trim().toLowerCase();
    const errorEl = byId("forgotError");
    errorEl.textContent = "";
    
    if (!emailInput) {
      errorEl.textContent = currentLang === "vi" ? "Vui lòng nhập địa chỉ email." : "Please enter your email address.";
      return;
    }
    
    // Find account by email
    const accountEntry = Object.entries(state.accounts).find(([uname, acc]) => acc && acc.email && acc.email.toLowerCase() === emailInput);
    if (!accountEntry) {
      errorEl.textContent = currentLang === "vi" 
        ? "Không tìm thấy tài khoản nào được đăng ký với email này." 
        : "No account found registered with this email.";
      return;
    }
    
    forgotTargetUsername = accountEntry[0];
    forgotGeneratedOtp = String(Math.floor(100000 + Math.random() * 900000));
    
    byId("forgotStep1").style.display = "none";
    byId("forgotStep2").style.display = "block";
    
    const simInfo = byId("otpSimulationInfo");
    simInfo.style.display = "block";
    simInfo.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">⚡ [Đồng bộ SMTP Gmail]</div>
      <div id="simProgress" style="width: 0%; height: 4px; background: var(--green); transition: width 1.2s ease; border-radius: 2px; margin-bottom: 8px;"></div>
      <div id="simLog">Đang kết nối SMTP Server...</div>
    `;
    
    setTimeout(() => {
      const progress = byId("simProgress");
      if (progress) progress.style.width = "40%";
      const log = byId("simLog");
      if (log) log.textContent = "Đang gửi email qua cổng SMTP:587...";
    }, 400);

    setTimeout(() => {
      const progress = byId("simProgress");
      if (progress) progress.style.width = "80%";
      const log = byId("simLog");
      if (log) log.textContent = `Đang mã hóa SSL và chuyển tiếp thư tới ${emailInput}...`;
    }, 1000);

    setTimeout(() => {
      const progress = byId("simProgress");
      if (progress) progress.style.width = "100%";
      const log = byId("simLog");
      if (log) {
        log.innerHTML = `
          <span style="color: var(--green); font-weight: bold;">✓ Đã gửi mã xác nhận thành công!</span><br>
          <span style="font-size: 0.76rem; color: var(--muted); margin-top: 4px; display: inline-block;">
            [Demo client-side] Mã OTP là: <strong style="color: var(--ink); font-size: 0.86rem; background: #fff; padding: 2px 6px; border: 1px dashed var(--line); border-radius: 4px; margin-left: 2px;">${forgotGeneratedOtp}</strong>
          </span>
        `;
      }
      showToast(currentLang === "vi" ? `Đã gửi mã xác thực tới ${emailInput}!` : `Verification code sent to ${emailInput}!`);
    }, 1800);
  });

  // Step 2: Verify OTP
  byId("btnVerifyOtp").addEventListener("click", () => {
    const otpInput = byId("forgotOtp").value.trim();
    const errorEl = byId("forgotError");
    errorEl.textContent = "";
    
    if (otpInput !== forgotGeneratedOtp) {
      errorEl.textContent = currentLang === "vi" ? "Mã xác thực OTP không chính xác." : "Incorrect OTP verification code.";
      return;
    }
    
    byId("forgotStep2").style.display = "none";
    byId("forgotStep3").style.display = "block";
  });

  // Step 3: Reset Password
  byId("btnResetPassword").addEventListener("click", () => {
    const newPass = byId("forgotNewPassword").value;
    const confirmPass = byId("forgotConfirmPassword").value;
    const errorEl = byId("forgotError");
    errorEl.textContent = "";
    
    if (newPass.length < 3) {
      errorEl.textContent = currentLang === "vi" ? "Mật khẩu mới phải có ít nhất 3 ký tự." : "New password must be at least 3 characters.";
      return;
    }
    if (newPass !== confirmPass) {
      errorEl.textContent = currentLang === "vi" ? "Mật khẩu xác nhận không trùng khớp." : "Confirm password does not match.";
      return;
    }
    
    state.accounts[forgotTargetUsername].password = newPass;
    saveState();
    
    showToast(currentLang === "vi" ? "Đã đặt lại mật khẩu thành công!" : "Password reset successfully!");
    
    // Switch back to login panel and reset tabs
    byId("forgotPanel").classList.remove("active");
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
    document.querySelector('[data-auth-tab="login"]').classList.add("active");
    byId("loginPanel").classList.add("active");
  });

  // Self delete account
  byId("deleteSelfBtn").addEventListener("click", () => {
    if (!currentUser) return;
    
    const isVi = currentLang === "vi";
    if (currentUser.role === "reader") {
      const activeLoans = state.loans.filter(l => l.readerId === currentUser.readerId);
      if (activeLoans.length > 0) {
        alert(isVi 
          ? "Bạn không thể tự xóa tài khoản khi đang mượn sách. Vui lòng ghi nhận trả sách trước." 
          : "You cannot delete your account while you have active loans. Please return books first.");
        return;
      }
    }
    
    const confirmMsg = isVi 
      ? "CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của mình? Mọi dữ liệu sẽ bị xóa và hành động này không thể hoàn tác!"
      : "WARNING: Are you sure you want to permanently delete your account? All data will be deleted and this action cannot be undone!";
      
    if (confirm(confirmMsg)) {
      const uname = currentUser.username;
      const pid = currentUser.personId || currentUser.readerId;
      const role = currentUser.role;
      
      if (role === "reader") {
        state.readers = state.readers.filter(r => r.id !== pid);
      } else if (role === "staff") {
        state.staffs = state.staffs.filter(s => s.id !== pid);
      }
      
      delete state.accounts[uname];
      saveState();
      handleLogout();
      showToast(isVi ? "Tài khoản của bạn đã bị xóa vĩnh viễn." : "Your account has been permanently deleted.");
    }
  });
}

migrateStoredCatalogCodes();
renderDocumentExtraFields();
renderDocumentSubtypeOptions();
toggleImportMode();
setDefaultDates();
bindEvents();
updateLanguageUI();

window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    state = loadState();
    updatePendingBadge();
    
    if (currentUser) {
      const activePage = document.querySelector(".page.active");
      if (activePage) {
        const pageName = activePage.id.replace("Page", "");
        if (pageName === "readers") {
          renderReaders();
          renderPeople();
        } else if (pageName === "dashboard") {
          renderDashboard();
        } else if (pageName === "documents") {
          renderDocuments();
        } else if (pageName === "loans") {
          renderLoans();
        } else if (pageName === "inventory") {
          renderInventory();
        } else if (pageName === "transactions") {
          renderTransactions();
        }
      }
    }
    
    if (currentUser && currentUser.role === "admin" && e.oldValue && e.newValue) {
      try {
        const oldState = JSON.parse(e.oldValue);
        const newState = JSON.parse(e.newValue);
        if (oldState.accounts && newState.accounts) {
          const oldPending = Object.keys(oldState.accounts).filter(k => oldState.accounts[k].role === "reader" && oldState.accounts[k].approved === false);
          const newPending = Object.keys(newState.accounts).filter(k => newState.accounts[k].role === "reader" && newState.accounts[k].approved === false);
          
          const added = newPending.filter(x => !oldPending.includes(x));
          if (added.length > 0) {
            const t = (key) => TRANSLATIONS[currentLang][key] || key;
            added.forEach(username => {
              const acc = newState.accounts[username];
              showToast(t("toast_new_signup").replace("{name}", acc.name).replace("{username}", username));
            });
          }
        }
      } catch (err) {
        console.error("Error parsing storage change:", err);
      }
    }
  }
});
