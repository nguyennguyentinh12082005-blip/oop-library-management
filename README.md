# OOP Library Management

Du an quan ly thu vien cho bai cuoi ky Lap trinh huong doi tuong. Repo co ban web tinh trong thu muc `web/`, du lieu mau chay tren trinh duyet bang `localStorage`, va workflow deploy tu dong len GitHub Pages.

## Cach chay web local

Chay static server trong thu muc `web`:

```powershell
cd "E:\LTHDT_OOP\TL CK\web"
python -m http.server 4173
```

Mo trinh duyet tai:

```text
http://127.0.0.1:4173/index.html
```

## Tai khoan mac dinh

- Quan tri vien: `admin`
- Mat khau: `admin`

Doc gia co the tu dang ky tai man hinh **Dang ky doc gia**. Admin co the tao ho so doc gia, nhan vien, va quan tri vien trong muc **Con nguoi**.

## Cac thay doi da lam

### Phan quyen doc gia

- Doc gia chi thay duoc hai trang: **Trang doc gia** va **Tai lieu**.
- An trang/nut **Muon / Tra** voi tai khoan doc gia.
- Chan cung cac form quan ly neu doc gia co gang submit bang devtools.
- Cac hanh dong bi chan gom: them tai lieu, them doc gia/nhan vien/admin, muon, tra, nhap, xuat, cap nhat file sach.

### Trang doc gia

- Them bang **Sach trong thu vien** vao trang doc gia.
- Doc gia xem duoc sach/tai lieu con so luong trong kho.
- Bang hien thi ma sach, ten sach, loai, so luong, va trang thai:
  - `Muon qua thu thu` voi sach co the muon.
  - `Doc tai cho` voi bao/tap chi hoac bai nghien cuu.
- Doc gia van xem duoc danh sach tai lieu dang muon va lich su giao dich cua minh.

### Tim kiem va loc sach theo chu de

- Cai tien man hinh **Tai lieu** de tim kiem dung hon theo tung loai sach.
- Bo loc **Chu de theo loai** tu doi noi dung theo loai tai lieu dang chon:
  - **Giao trinh**: loc theo bo mon, ma mon hoc, ten mon.
  - **Sach tham khao**: loc theo chu de/nganh/lĩnh vực tham khao.
  - **Sach khac**: loc theo the loai nhu truyen, van hoc, ky nang, ngoai ngu.
  - **Bao/tap chi**: loc theo bao, tap chi, so phat hanh, thang.
  - **Bai nghien cuu**: loc theo linh vuc nghien cuu, co quan chu quan.
- Them o **Tim trong chu de** de tim sau trong chu de/mo ta cua tai lieu, rieng voi o tim chung theo ma, ten, tac gia.

### Tao tai khoan doc gia

- Sua loi admin/nhan vien tao nguoi doc nhung khong tao duoc tai khoan dang nhap.
- Form **Dang ky nguoi doc** trong trang quan ly nay da tao luon account role `reader` tu username/password.
- Sua luong dang ky cong khai:
  - Dang ky doc gia xong tu dong dang nhap vao app.
  - Neu ho so doc gia da ton tai nhung chua co account, he thong tao account cho ho so do.
  - Neu ma doc gia da co account, he thong bao ma doc gia da ton tai.

### Anh bia sach

- Du lieu Project Gutenberg trong `web/gutenberg-catalog.js` khong co anh bia that (`coverImage` rong).
- App tu lay anh bia that tu Project Gutenberg bang `gutenbergId` theo mau URL `https://www.gutenberg.org/cache/epub/{id}/pg{id}.cover.medium.jpg`.
- Neu Project Gutenberg khong co anh bia hoac anh bi loi, app fallback ve bia gia.
- Bia gia hien thi ten sach rut gon thay vi chi hien ma `TVS...`.
- Ma `TVS...` van duoc hien nho o dong phu de nguoi dung biet ma tai lieu.

### Man hinh dang nhap

- Sua loi khung dang nhap bi tran va hien thanh cuon ngang/doc.
- Giam kich thuoc logo va padding cua card dang nhap.
- Them responsive cho man hinh nho/thap.
- An phan goi y tai khoan khi man hinh thap de form dang nhap gon hon.

### Kiem tra da thuc hien

- Chay `node --check web\app.js` de kiem tra cu phap JavaScript.
- Test luong admin tao doc gia co username/password, dang xuat, dang nhap bang tai khoan doc gia.
- Test doc gia chi thay **Trang doc gia** va **Tai lieu**.
- Test bang **Sach trong thu vien** render danh sach tai lieu con trong kho.

## Deploy

Repo co workflow `.github/workflows/deploy.yml`. Khi push len nhanh `main`, GitHub Actions se deploy thu muc `web/` len GitHub Pages.

Neu can deploy lai thu cong, vao tab **Actions** tren GitHub, chon **Deploy to GitHub Pages**, roi bam **Run workflow**.
