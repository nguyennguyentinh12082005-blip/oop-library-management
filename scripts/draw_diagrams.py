# -*- coding: utf-8 -*-
"""Ve flowchart + DFD bam theo cau truc web (app.js) - dinh tuyen vuong goc, ro rang."""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Polygon, FancyArrowPatch, Ellipse, Rectangle

OUT_DIR = r"E:\LTHDT_OOP\TL CK\report_assets"
os.makedirs(OUT_DIR, exist_ok=True)
plt.rcParams["font.family"] = "DejaVu Sans"

C_START = "#2E7D32"
C_PROC = "#1565C0"
C_DEC = "#F9A825"
C_REJ = "#C62828"
C_STORE = "#6A1B9A"
C_ENT = "#37474F"
C_READER = "#00897B"


# ---------- primitives ----------
def box(ax, cx, cy, w, h, text, color=C_PROC, fs=10, rounded=True, tc="white"):
    style = "round,pad=0.02,rounding_size=0.10" if rounded else "square,pad=0.02"
    ax.add_patch(FancyBboxPatch((cx - w/2, cy - h/2), w, h, boxstyle=style,
                 linewidth=1.4, edgecolor="black", facecolor=color, alpha=0.96))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs, color=tc, weight="bold")
    return dict(cx=cx, cy=cy, w=w, h=h)


def diamond(ax, cx, cy, w, h, text, color=C_DEC, fs=9):
    pts = [(cx, cy + h/2), (cx + w/2, cy), (cx, cy - h/2), (cx - w/2, cy)]
    ax.add_patch(Polygon(pts, closed=True, linewidth=1.4, edgecolor="black",
                 facecolor=color, alpha=0.96))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs, color="black", weight="bold")
    return dict(cx=cx, cy=cy, w=w, h=h)


def oval(ax, cx, cy, w, h, text, color=C_START, fs=10):
    ax.add_patch(Ellipse((cx, cy), w, h, linewidth=1.4, edgecolor="black",
                 facecolor=color, alpha=0.96))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs, color="white", weight="bold")
    return dict(cx=cx, cy=cy, w=w, h=h)


def store(ax, cx, cy, w, h, text, color=C_STORE, fs=8.5):
    ax.add_patch(Rectangle((cx - w/2, cy - h/2), w, h, linewidth=1.3,
                 edgecolor="black", facecolor=color, alpha=0.92))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs, color="white", weight="bold")
    return dict(cx=cx, cy=cy, w=w, h=h)


def _seg(ax, x1, y1, x2, y2, color, ls="-"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-",
                 linewidth=1.3, color=color, linestyle=ls))


def _head(ax, x1, y1, x2, y2, color):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>",
                 mutation_scale=14, linewidth=1.3, color=color, shrinkA=0, shrinkB=1))


def label(ax, x, y, text, color, fs=7.5):
    ax.text(x, y, text, ha="center", va="center", fontsize=fs, color=color,
            bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none", alpha=0.9))


def arrow(ax, x1, y1, x2, y2, text="", color="black", fs=7.5, lx=None, ly=None):
    """Mui ten thang, cam dung diem."""
    _head(ax, x1, y1, x2, y2, color)
    if text:
        label(ax, lx if lx is not None else (x1+x2)/2,
              ly if ly is not None else (y1+y2)/2, text, color, fs)


def ortho(ax, x1, y1, x2, y2, midx, text="", color="black", fs=7.2, lx=None, ly=None):
    """Dinh tuyen ngang-doc-ngang qua truc x = midx, cam dung canh dich."""
    _seg(ax, x1, y1, midx, y1, color)
    _seg(ax, midx, y1, midx, y2, color)
    _head(ax, midx, y2, x2, y2, color)
    if text:
        label(ax, lx if lx is not None else midx, ly if ly is not None else (y1+y2)/2,
              text, color, fs)


def canvas(xlim, ylim, scale=0.62):
    fig, ax = plt.subplots(figsize=(xlim*scale, ylim*scale))
    ax.set_xlim(0, xlim); ax.set_ylim(0, ylim); ax.axis("off")
    return fig, ax


def save(fig, name):
    p = os.path.join(OUT_DIR, name)
    fig.savefig(p, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("Saved", p)


# =================================================================
# 1. LUU DO TONG QUAT (dang nhap -> phan quyen) - vong lap o ben phai
# =================================================================
fig, ax = canvas(15, 15)
oval(ax, 6, 14.2, 3.0, 0.8, "Mở web")
b_login = box(ax, 6, 13.0, 4.2, 0.8, "Màn hình đăng nhập", C_PROC, 9.5)
d_acc = diamond(ax, 6, 11.3, 3.6, 1.7, "Đã có\ntài khoản?", C_DEC, 9)
b_signup = box(ax, 11.3, 11.3, 3.6, 1.1, "Đăng ký độc giả\n(tạo account reader)", C_READER, 8.8)
b_auth = box(ax, 6, 9.5, 4.8, 0.9, "Xác thực username + mật khẩu", C_PROC, 9)
d_pw = diamond(ax, 6, 7.8, 3.6, 1.7, "Đúng\nmật khẩu?", C_DEC, 9)
b_err = box(ax, 11.3, 7.8, 3.0, 0.8, "Báo lỗi đăng nhập", C_REJ, 9)
b_role = box(ax, 6, 6.1, 5.2, 0.9, "applyRoleRestrictions()\nphân quyền theo role", C_PROC, 9)
d_role = diamond(ax, 6, 4.3, 3.6, 1.7, "role =\nreader?", C_DEC, 9)
box(ax, 2.6, 2.1, 3.8, 1.6, "TRANG ĐỘC GIẢ\n• Trang độc giả\n• Tài liệu (tra cứu)", C_READER, 9)
box(ax, 9.4, 2.1, 5.4, 1.7,
    "DASHBOARD (admin / staff)\n• Tài liệu • Độc giả • Mượn/Trả\n• Kho • Giao dịch", C_PROC, 9)

arrow(ax, 6, 13.8, 6, 13.42)                          # mo web -> login
arrow(ax, 6, 12.6, 6, 12.18)                          # login -> co tk?
arrow(ax, 7.8, 11.3, 9.5, 11.3, "Không", C_REJ, ly=11.6)   # -> signup
arrow(ax, 6, 10.45, 6, 9.97, "Có", C_PROC, lx=6.35)        # -> xac thuc
arrow(ax, 6, 9.05, 6, 8.67)                                 # xac thuc -> dung mk?
arrow(ax, 7.8, 7.8, 9.8, 7.8, "Không", C_REJ, ly=8.1)      # -> bao loi
arrow(ax, 6, 6.95, 6, 6.57, "Có", C_PROC, lx=6.35)         # -> phan quyen
arrow(ax, 6, 5.65, 6, 5.18)                                 # phan quyen -> role?
arrow(ax, 4.2, 3.9, 3.0, 3.0, "Có", C_READER, lx=3.2, ly=3.7)
arrow(ax, 7.8, 3.9, 9.0, 3.0, "Không (admin/staff)", C_PROC, lx=9.6, ly=3.7)
# signup -> phan quyen (auto dang nhap): di ben phai, xuong, cam vao canh phai box role
ortho(ax, 11.3, 10.75, 8.6, 6.1, midx=13.6, text="auto đăng nhập", color=C_READER, lx=13.6, ly=8.5)
# bao loi -> quay lai login (thu lai): di ben phai ngoai cung
ortho(ax, 12.8, 7.8, 8.1, 13.0, midx=14.3, text="thử lại", color=C_REJ, lx=14.3, ly=10.5)
save(fig, "fig_flow_tongquat.png")


# =================================================================
# 2. FLOWCHART MUON (5 dieu kien) - giu nguyen layout dep
# =================================================================
fig, ax = canvas(13, 18)
oval(ax, 4.2, 17.2, 3.0, 0.8, "Bắt đầu")
box(ax, 4.2, 16.0, 4.8, 0.8, "Nhân viên chọn độc giả + tài liệu", C_PROC, 8.8)
ys_d = [14.3, 11.9, 9.5, 7.1, 4.7]
texts_d = ["Thẻ còn hạn?\nexpires ≥ ngày mượn", "borrowed\n< limit?",
           "isBorrowable?\n(GT / STK / Sách khác)", "quantity\n> 0?", "Chưa mượn\nTL này?"]
fs_d = [8, 8.5, 7.8, 8.5, 8.3]
for y, t, f in zip(ys_d, texts_d, fs_d):
    diamond(ax, 4.2, y, 3.8, 1.7, t, C_DEC, f)
box(ax, 4.2, 2.9, 5.4, 1.0, "days = loanDays(reader, doc)\n(đa hình theo loại)", C_PROC, 8.5)
box(ax, 4.2, 1.3, 5.8, 1.1,
    "Tạo loan(PM) • quantity−1 • borrowed+1\nthêm transaction \"Mượn\"", C_PROC, 8.3)

rej = ["Thẻ đã hết hạn", "Vượt giới hạn mượn", "Chỉ đọc / tra cứu tại chỗ",
       "Hết số lượng", "Đang mượn tài liệu này"]
for y, t in zip(ys_d, rej):
    box(ax, 10.4, y, 3.6, 0.8, t, C_REJ, 8.3)

arrow(ax, 4.2, 16.8, 4.2, 16.42)
arrow(ax, 4.2, 15.6, 4.2, 15.18)
for i in range(len(ys_d) - 1):
    arrow(ax, 4.2, ys_d[i] - 0.85, 4.2, ys_d[i+1] + 0.85, "Có", C_PROC, lx=4.55)
arrow(ax, 4.2, ys_d[-1] - 0.85, 4.2, 3.42, "Có", C_PROC, lx=4.55)
arrow(ax, 4.2, 2.4, 4.2, 1.87)
for y in ys_d:
    arrow(ax, 6.1, y, 8.58, y, "Không", C_REJ, ly=y + 0.3)
save(fig, "fig_flow_muon.png")


# =================================================================
# 3. FLOWCHART TRA - duong di gon, cam dung
# =================================================================
fig, ax = canvas(13, 13)
oval(ax, 4.0, 12.3, 3.0, 0.8, "Bắt đầu")
box(ax, 4.0, 11.1, 4.6, 0.8, "Chọn phiếu mượn (loanId)", C_PROC, 9)
diamond(ax, 4.0, 9.4, 3.6, 1.7, "Tìm thấy\nphiếu mượn?", C_DEC, 8.5)
box(ax, 9.6, 9.4, 3.4, 0.8, "Không có phiếu để trả", C_REJ, 8.5)
box(ax, 4.0, 7.5, 5.4, 1.0, "lateDays = max(0,\nngày trả − dueDate)", C_PROC, 8.8)
diamond(ax, 4.0, 5.6, 3.6, 1.7, "lateDays\n> 0 ?", C_DEC, 8.5)
box(ax, 9.4, 5.6, 3.6, 0.9, "fine = lateDays × 5.000đ", C_REJ, 8.5)
box(ax, 4.0, 3.8, 3.2, 0.8, "fine = 0", C_PROC, 9)
b_fin = box(ax, 6.7, 2.2, 6.4, 1.1,
            "quantity+1 • borrowed−1 • xóa loan\nthêm transaction \"Trả\" (amount = fine)", C_PROC, 8.3)
oval(ax, 6.7, 0.7, 3.0, 0.8, "Kết thúc")

arrow(ax, 4.0, 11.9, 4.0, 11.52)
arrow(ax, 4.0, 10.7, 4.0, 10.27)
arrow(ax, 5.8, 9.4, 7.88, 9.4, "Không", C_REJ, ly=9.7)
arrow(ax, 4.0, 8.55, 4.0, 8.02, "Có", C_PROC, lx=4.35)
arrow(ax, 4.0, 7.0, 4.0, 6.47)
arrow(ax, 5.8, 5.6, 7.58, 5.6, "Có", C_REJ, ly=5.9)
arrow(ax, 4.0, 4.75, 4.0, 4.22, "Không", C_PROC, lx=4.55)
# fine=0 -> ghi nhan (cam canh tren box, x=4.0)
arrow(ax, 4.0, 3.4, 4.0, 2.76)
# fine>0 -> ghi nhan (xuong, cam canh tren box, x=9.4)
ortho(ax, 9.4, 5.15, 9.4, 2.76, midx=9.4, color=C_REJ)
arrow(ax, 6.7, 1.65, 6.7, 1.12)
save(fig, "fig_flow_tra.png")


# =================================================================
# 4. DFD MUC NGU CANH - mui ten 2 chieu tach ro
# =================================================================
fig, ax = canvas(15, 10)
oval(ax, 7.5, 5.0, 4.8, 2.4, "0\nHỆ THỐNG QUẢN LÝ\nTHƯ VIỆN (Web)", C_PROC, 11)
box(ax, 2.0, 8.3, 3.0, 1.0, "ĐỘC GIẢ", C_ENT, 11, rounded=False)
box(ax, 2.0, 1.7, 3.2, 1.0, "NHÂN VIÊN\n(Thủ thư)", C_ENT, 10, rounded=False)
box(ax, 13.0, 5.0, 3.0, 1.0, "QUẢN TRỊ VIÊN", C_ENT, 10, rounded=False)
store(ax, 7.5, 0.8, 7.2, 0.85, "Kho dữ liệu: localStorage (oop-library-web-v5)", C_STORE, 8.5)

# Doc gia <-> he thong (2 mui ten tach ro)
arrow(ax, 3.4, 8.0, 5.6, 6.4, "yêu cầu mượn/trả, tra cứu", C_ENT, 7.3, lx=3.7, ly=7.9)
arrow(ax, 6.1, 6.0, 3.0, 7.7, "tài liệu, hạn trả, lịch sử", C_PROC, 7.3, lx=5.0, ly=6.7)
# Nhan vien <-> he thong
arrow(ax, 3.5, 2.0, 5.6, 3.7, "xử lý mượn/trả, nhập/xuất", C_ENT, 7.3, lx=3.9, ly=2.1)
arrow(ax, 6.1, 4.0, 3.2, 2.3, "kết quả, thống kê", C_PROC, 7.3, lx=5.2, ly=3.4)
# Quan tri <-> he thong
arrow(ax, 11.5, 5.5, 9.9, 5.4, "quản lý tài khoản, phân quyền", C_ENT, 7.3, lx=10.7, ly=6.1)
arrow(ax, 9.9, 4.6, 11.5, 4.6, "dữ liệu hệ thống", C_PROC, 7.3, ly=4.2)
# he thong <-> kho (doc/ghi)
arrow(ax, 6.9, 3.8, 6.9, 1.25, "ghi state", C_STORE, 7.3, lx=5.9)
arrow(ax, 8.1, 1.25, 8.1, 3.8, "đọc state", C_STORE, 7.3, lx=9.1)
save(fig, "fig_dfd_context.png")


# =================================================================
# 5. DFD MUC 1 - dinh tuyen vuong goc, moi process thang hang voi kho chinh
# =================================================================
fig, ax = canvas(17, 12.5)
PX, PR = 7.1, 8.6      # tam process, canh phai process
SX, SL = 14.3, 12.2    # tam store, canh trai store
EX, ER = 1.7, 3.1      # tam entity, canh phai entity

# entities
box(ax, EX, 10.6, 2.8, 0.9, "ĐỘC GIẢ", C_ENT, 9.5, rounded=False)
box(ax, EX, 6.2, 2.8, 0.9, "NHÂN VIÊN", C_ENT, 9.5, rounded=False)
box(ax, EX, 1.5, 2.8, 0.9, "QUẢN TRỊ VIÊN", C_ENT, 8.8, rounded=False)
# processes (thang hang voi kho chinh)
oval(ax, PX, 11.0, 3.0, 1.2, "1.0\nĐăng nhập &\nphân quyền", C_PROC, 8.5)
oval(ax, PX, 8.7, 3.0, 1.2, "2.0\nQuản lý tài liệu", C_PROC, 9)
oval(ax, PX, 6.4, 3.0, 1.2, "3.0\nMượn / Trả", C_PROC, 9)
oval(ax, PX, 4.0, 3.0, 1.2, "4.0\nNhập / Xuất kho", C_PROC, 8.8)
oval(ax, PX, 1.5, 3.0, 1.2, "5.0\nQuản lý người dùng", C_PROC, 8.3)
# stores
store(ax, SX, 11.0, 4.2, 0.85, "D1 | accounts", C_STORE, 8.3)
store(ax, SX, 8.7, 4.2, 0.85, "D3 | documents", C_STORE, 8.3)
store(ax, SX, 6.4, 4.2, 0.85, "D4 | loans (phiếu mượn)", C_STORE, 8.3)
store(ax, SX, 4.0, 4.2, 0.85, "D5 | transactions", C_STORE, 8.3)
store(ax, SX, 1.5, 4.2, 0.85, "D2 | readers/staffs/admins", C_STORE, 8.0)
ax.text(SX, 12.1, "localStorage state", ha="center", fontsize=8.5,
        style="italic", color=C_STORE, weight="bold")

# entity -> process
arrow(ax, ER, 10.7, 5.6, 11.0, "đăng nhập", C_ENT, 7, lx=4.4, ly=11.2)
arrow(ax, ER, 10.4, 5.6, 8.9, "tra cứu", C_ENT, 7, lx=4.4, ly=9.5)
arrow(ax, ER, 6.5, 5.6, 8.5, "thêm tài liệu", C_ENT, 7, lx=4.4, ly=7.8)
arrow(ax, ER, 6.2, 5.6, 6.4, "mượn / trả", C_ENT, 7, ly=6.55)
arrow(ax, ER, 5.9, 5.6, 4.1, "nhập / xuất", C_ENT, 7, lx=4.4, ly=4.9)
arrow(ax, ER, 1.5, 5.6, 1.5, "tạo người dùng", C_ENT, 7, ly=1.8)

# process -> store CHINH (ngang, thang hang)
arrow(ax, PR, 11.0, SL, 11.0, "đọc/ghi", C_PROC, 7, ly=11.25)
arrow(ax, PR, 8.7, SL, 8.7, "CRUD tài liệu", C_PROC, 7, ly=8.95)
arrow(ax, PR, 6.4, SL, 6.4, "ghi phiếu", C_PROC, 7, ly=6.65)
arrow(ax, PR, 4.0, SL, 4.0, "ghi giao dịch", C_PROC, 7, ly=4.25)
arrow(ax, PR, 1.5, SL, 1.5, "hồ sơ người", C_PROC, 7, ly=1.75)

# process -> store PHU (vuong goc, kenh truc rieng de khong chong)
ortho(ax, PR, 6.7, SL, 8.4, midx=9.7, text="cập nhật SL", color="#0D47A1", lx=9.7, ly=7.7)   # 3.0 -> D3
ortho(ax, PR, 6.1, SL, 4.3, midx=10.1, text="GD Mượn/Trả", color="#0D47A1", lx=10.5, ly=5.2)  # 3.0 -> D5
ortho(ax, PR, 4.3, SL, 8.2, midx=10.5, text="cập nhật SL", color="#0D47A1", lx=10.5, ly=5.6)  # 4.0 -> D3
ortho(ax, PR, 1.8, SL, 10.8, midx=11.7, text="ghi account", color="#0D47A1", lx=11.7, ly=3.0) # 5.0 -> D1
save(fig, "fig_dfd_level1.png")


# =================================================================
# 6. SO DO DOI TUONG / MO HINH DU LIEU - quan he cam dung
# =================================================================
def entity(ax, x, ytop, w, title, fields, color):
    fh = 0.42
    h = fh * (len(fields) + 1)
    ax.add_patch(Rectangle((x, ytop - h), w, h, linewidth=1.4, edgecolor="black", facecolor="white"))
    ax.add_patch(Rectangle((x, ytop - fh), w, fh, linewidth=1.4, edgecolor="black", facecolor=color))
    ax.text(x + w/2, ytop - fh/2, title, ha="center", va="center", color="white", fontsize=9, weight="bold")
    for i, f in enumerate(fields):
        ax.text(x + 0.12, ytop - fh*(i+1) - fh/2, f, ha="left", va="center", fontsize=7.6, color="black")
    return dict(x=x, ytop=ytop, w=w, h=h, ybot=ytop - h, xr=x + w, cx=x + w/2, cy=ytop - h/2)


fig, ax = canvas(16, 12.5)
e_acc = entity(ax, 0.4, 11.8, 3.5, "Account (tài khoản)",
               ["username (PK)", "password", "role: admin/staff/reader",
                "name, title", "personId → người", "readerId"], C_ENT)
e_read = entity(ax, 6.2, 11.8, 4.0, "Reader (độc giả)",
                ["id (PK)", "name, type (SV/VC)", "birth, gender, phone", "address",
                 "code (MSSV/MSCB)", "registered, expires", "borrowed, limit (5/10)"], C_READER)
e_doc = entity(ax, 12.0, 11.8, 3.8, "Document (tài liệu)",
               ["id (PK)", "title, kind (5 loại)", "year, quantity", "author, publisher",
                "category", "extra {...} theo loại", "coverImage / fileUrl"], "#AD1457")
e_staff = entity(ax, 0.4, 6.6, 3.5, "Staff (nhân viên)",
                 ["id (PK)", "name, position", "salary, shift", "username"], C_PROC)
e_admin = entity(ax, 0.4, 3.4, 3.5, "Admin (quản trị)",
                 ["id (PK)", "name, ...", "username", "permission"], C_PROC)
e_loan = entity(ax, 6.2, 6.2, 4.0, "Loan (phiếu mượn)",
                ["id PM (PK)", "readerId (FK → Reader)", "documentId (FK → Document)",
                 "borrowDate", "dueDate"], "#00838F")
e_tran = entity(ax, 11.8, 5.4, 4.0, "Transaction (giao dịch)",
                ["id GD (PK)", "type: Mượn/Trả/Nhập/Xuất", "date, staffId",
                 "readerId, documentId", "quantity, unitPrice", "amount (phạt/chi phí)"], "#5D4037")

# Account 1-1 Reader (canh phai acc -> canh trai reader)
arrow(ax, e_acc["xr"], 10.3, e_read["x"], 10.3, "1 – 1 (personId)", C_ENT, 7.3, ly=10.6)
# Reader 1-n Loan (canh duoi reader -> canh tren loan)
arrow(ax, 8.2, e_read["ybot"], 8.2, e_loan["ytop"], "1 – n", C_READER, 7.5, lx=8.7)
# Loan n-1 Document (canh phai loan -> canh trai doc, vuong goc)
ortho(ax, e_loan["xr"], 5.0, e_doc["x"], 9.0, midx=11.3, text="n – 1 (documentId)",
      color="#00838F", lx=11.3, ly=7.0)
# Transaction ghi nhan Document (canh tren transaction -> canh duoi doc)
arrow(ax, 13.8, e_tran["ytop"], 13.8, e_doc["ybot"], "ghi nhận", "#5D4037", 7.3, lx=14.6)

ax.text(8.0, 0.5, "Tất cả đối tượng nằm trong một state JSON duy nhất, lưu ở local[\"oop-library-web-v5\"].",
        ha="center", fontsize=9, style="italic", color=C_STORE, weight="bold")
save(fig, "fig_object_model.png")

print("DONE")
