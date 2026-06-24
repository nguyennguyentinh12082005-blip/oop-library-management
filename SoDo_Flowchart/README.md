# Sơ đồ / Flowchart hệ thống Quản lý Thư viện

Tất cả sơ đồ trắng–đen, đường thẳng, có chú thích trên đường — vẽ đúng logic code (`web/app.js`, `web/index.html`).

## Cấu trúc folder
- `drawio/` — file nguồn **draw.io** (mở & sửa được tại https://app.diagrams.net hoặc draw.io desktop)
- `png/` — ảnh xuất sẵn (scale 2x) để chèn vào báo cáo

## Danh sách sơ đồ

| # | File PNG | File draw.io | Nội dung |
|---|----------|--------------|----------|
| 01 | `01_luong_xu_ly_doc_gia.png` | `flow_doc_gia.drawio` | **Luồng xử lý Độc giả** có nhánh ĐÚNG/SAI: Đăng ký (kiểm tra tài khoản/mật khẩu/mã DG) + Đăng nhập & hiển thị portal |
| 02 | `02_luong_xu_ly_quan_tri.png` | `flow_quan_tri.drawio` | **Luồng xử lý Quản trị** có nhánh ĐÚNG/SAI: Thêm tài liệu · Thêm người · Nhập kho (kiểm tra quyền admin, mã trùng, mật khẩu...) |
| 03 | `03_khoi_chuc_nang_doc_gia.png` | `khoi_doc_gia.drawio` | **Các khối chức năng Độc giả**: Tra cứu tài liệu · Xem sách trong thư viện · Xem lịch sử mượn trả |
| 04 | `04_khoi_chuc_nang_quan_tri.png` | `khoi_quan_tri.drawio` | **Các khối chức năng Quản trị**: Quản lý tài liệu · Quản lý con người · Quản lý nhập/xuất |
| 05 | `05_so_do_khoi_tong_quan.png` | (HTML gốc trong `report_assets/`) | Sơ đồ khối tổng quan hệ thống |
| 06 | `06_flowchart_muon.png` | (HTML gốc) | Flowchart nghiệp vụ **Mượn tài liệu** |
| 07 | `07_flowchart_tra.png` | (HTML gốc) | Flowchart nghiệp vụ **Trả tài liệu** |

## Bản đồ chức năng ↔ code

**Độc giả** (`ROLE_PAGES.reader = {readerPortal, documents}`)
- Tra cứu tài liệu → `documentsPage` (chỉ xem; mượn/trả bị `guardLibraryAction()` chặn)
- Xem sách trong thư viện → `readerLibraryTable` (lọc `quantity > 0`)
- Xem lịch sử mượn trả → `readerPortalInfo` + `readerPortalStats` + `readerLoansTable` + `readerTransactionsTable`

**Quản trị** (`ROLE_PAGES.admin = {dashboard, documents, readers, loans, inventory, transactions}`)
- Quản lý tài liệu → `documentsPage` (thêm/sửa/xóa, `deleteDocument()`)
- Quản lý con người → `readersPage` (đăng ký độc giả, thêm nhân viên/quản trị)
- Quản lý nhập/xuất → `inventoryPage` (`handleImportSubmit()`, xuất/thanh lý, tồn kho)
- *(Mượn/Trả `handleBorrowSubmit()/handleReturnSubmit()` có flowchart riêng — xem #06, #07)*
