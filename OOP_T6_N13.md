ĐỀ TÀI HỆ THỐNG QUẢN LÝ THƯ VIỆN OOP

Xác định các object trong bài

Gồm 3 nhóm đối tượng lớn chính: con người , Tài Liệu ,giao dịch


| **Tên lớp đối tượng**Tên lớp đối tượng | **Thuộc tính**huộc tính | **Phương thức đề xuất**Phương thức đề xuất | **Đặc tính OOP áp dụng**Đặc tính OOP áp dụng | **chức năng**chức năng |
| --- | --- | --- | --- | --- |
| Người (Lớp cha) | maNguoi, hoTen, ngaySinh, gioiTinh, soDienThoai, diaChi | hienThiThongTin() | • Tính Trừu Tượng: Khai báo làm Lớp trừu tượng (abstract class).<br> • Tính Đóng Gói: Để thuộc tính protected/private, truy xuất qua Getter/Setter. | Làm khung thiết kế mẫu chung, lưu trữ thông tin cá nhân cơ bản của toàn bộ con người tương tác với thư viện. |
| Người đọc (Lớp con) | ngayDangKy (Date), ngayHetHan (Date), soSachDangMuon (int) | duocPhepMuonSach(): boolean, tangSoSachMuon(): void, hienThiThongTin(): void | • Tính Kế Thừa: Kế thừa thuộc tính từ Nguoi.<br> • Tính Đa Hình: Ghi đè phương thức hiển thị thông tin độc giả. | Quản lý thời hạn thẻ độc giả và giới hạn số sách tối đa được mượn cùng lúc để tránh thất thoát. |
| Nhân viên (Lớp con) | chucVu (String), luong (double), caLamViec (String) | tinhLuong(): double, phanCaLam(): void, hienThiThongTin(): void | • Tính Kế Thừa: Kế thừa từ Nguoi.<br> • Tính Đa Hình: Ghi đè để hiển thị thông tin ca trực và lương của nhân viên. | Quản lý thông tin công việc, tiền lương và sắp xếp ca trực làm việc cho thủ thư thư viện. |
| Quản trị viên (Lớp con) | username (String), password (String), quyenTruyCap (String) | phanquyen(): void, khoiPhucMatKhau(): void, hienThiThongTin(): void | • Tính Kế Thừa: Kế thừa từ Nguoi.<br> • Tính Đa Hình: Ghi đè hiển thị thông tin tài khoản admin. | Phục vụ đăng nhập bảo mật hệ thống, quản lý tài khoản và phân quyền tác vụ trong thư viện. |
| Tài liệu (Lớp cha) | maTaiLieu, tenTaiLieu, namXuatBan, soLuong, trangThai, tacGia, nhaXuatBan, theLoai | capNhatSoLuong(int) | • Tính Trừu Tượng: Khai báo làm Lớp trừu tượng (abstract class).<br> • Tính Đóng Gói: Đóng gói thuộc tính bằng Getter/Setter. | Làm khung thiết kế mẫu chung cho mọi ấn phẩm, tài nguyên được lưu hành trong thư viện. |
| Sách (Lớp con) | Không thêm (đã kế thừa đầy đủ) | quanLySoLuong(): void | • Tính Kế Thừa: Kế thừa toàn bộ từ TaiLieu. | Quản lý số lượng và trạng thái chi tiết của từng đầu sách giấy trong thư viện. |
| Báo, tạp chí (Lớp con) | soPhatHanh (int), thangPhatHanh (int) | docTaiCho(): void | • Tính Kế Thừa: Kế thừa từ TaiLieu. | Quản lý ấn phẩm định kỳ phát hành theo tháng và quy định bắt buộc chỉ đọc tại chỗ. |
| Giáo trình (Lớp con) | maMonHoc (String), boMon (String) | kiemTraHocPhan(): boolean | • Tính Kế Thừa: Kế thừa từ TaiLieu. | Phân loại giáo trình học tập phục vụ chuyên sâu cho từng môn học và bộ môn cụ thể. |
| Các bài nghiên cứu (Lớp con) | coQuanChuQuan (String), linhVuc (String) | traCuuNghienCuu(): void | • Tính Kế Thừa: Kế thừa từ TaiLieu. | Quản lý đề tài luận văn, luận án và tài liệu nghiên cứu khoa học chuyên sâu. |
| Giao dịch (Lớp cha) | maGiaoDich, ngayGiaoDich, maNhanVienThucHien | thucHienGiaoDich() | • Tính Trừu Tượng: Khai báo làm Lớp trừu tượng (abstract class).<br> • Tính Đóng Gói: Đóng gói thuộc tính bằng Getter/Setter. | Làm khuôn mẫu chung để theo dõi dòng tiền và tài liệu lưu thông trong các tiến trình nghiệp vụ. |
| Mượn (Lớp con) | ngayHenTra (Date) | ghiNhanNgayMuon(): void, kiemTraQuaHan(): boolean | • Tính Kế Thừa: Kế thừa từ GiaoDich. | mượn trả |
| Trả (Lớp con) | tienPhat (double) | tinhTienPhat(): double, xacNhanTraSach(): void | • Tính Kế Thừa: Kế thừa từ GiaoDich. | Lưu vết thời điểm hẹn trả sách để hệ thống phát hiện các trường hợp độc giả mượn quá hạn. |
| Nhập (Lớp con) | nhaCungCap (String), donGiaNhap (double) | tinhTongChiPhi(): double | • Tính Kế Thừa: Kế thừa từ GiaoDich. | Lưu trữ nguồn gốc xuất xứ của tài liệu mới nhập và tổng chi phí mua sắm sách của thư viện.<br>Xử lý trả sách trễ hạn, tính toán phí phạt thực tế và hoàn trả lại số lượng sách vào kho. |
| Xuất (Lớp con) | lyDoXuat (String), donGiaThanhLy (double) | loaiBoTaiLieu(): void | • Tính Kế Thừa: Kế thừa từ GiaoDich. | Lưu vết lý do thanh lý sách lỗi thời hoặc hỏng rách và ghi nhận doanh thu thanh lý sách cũ. |


Các tính chất của OOP

2.1. Tính Đóng gói 

	Trong hệ thống quản lý thư viện, thông tin như mã sách, tên sách, số lượng, mã độc giả, tên độc giả nên để ở phạm vi private.


### **1. Tính Trừu tượng (Abstraction)**1. Tính Trừu tượng (Abstraction)

Tính trừu tượng giúp ẩn đi các chi tiết phức tạp và chỉ phơi bày những giao diện cốt lõi. Trong đề tài này, bạn nên xây dựng các **Lớp trừu tượng (Abstract Class)**Lớp trừu tượng (Abstract Class) đóng vai trò làm bản thiết kế (Blueprint) cho các lớp con. Một lớp trừu tượng yêu cầu phải có ít nhất một hàm ảo thuần túy (pure virtual function).

**Lớp trừu tượng**ớp trừu tượng NguoiDoc **(Người đọc):** (Người đọc): Chứa các phương thức ảo thuần túy như virtual void nhapThongTin() = 0; hoặc virtual void tinhHanMuon() = 0;. Lớp này không thể khởi tạo đối tượng trực tiếp.

**Lớp trừu tượng**ớp trừu tượng Sach **(Sách):** (Sách): Chứa các thuộc tính chung và phương thức ảo thuần túy như virtual void hienThiThongTin() = 0;.

### **2. Tính Kế thừa (Inheritance)**2. Tính Kế thừa (Inheritance)

Tính kế thừa cho phép định nghĩa các lớp mới dựa trên những lớp đã tồn tại để tái sử dụng và tổ chức mã nguồn. Dựa theo yêu cầu đề bài, chúng ta sẽ sử dụng Kế thừa phân cấp (Hierarchical Inheritance).

**Kế thừa từ**ế thừa từ NguoiDoc**:**: Đối tượng mượn sách bao gồm 2 nhóm.

Lớp SinhVien (Sinh viên): Kế thừa NguoiDoc, bổ sung thêm Mã số sinh viên (MSSV).

Lớp VienChuc (Viên chức): Kế thừa NguoiDoc, bổ sung thêm Mã số cán bộ (MSCB).

**Kế thừa từ**ế thừa từ Sach**:**: Sách được chia làm 3 loại.

Lớp GiaoTrinh (Giáo trình)

Lớp SachThamKhao (Sách tham khảo)

Lớp SachKhac (Sách khác)

### **3. Tính Đa hình (Polymorphism)**3. Tính Đa hình (Polymorphism)

Tính đa hình ở thời điểm chạy (Run Time Polymorphism) được thực hiện thông qua **Hàm ảo (Virtual Functions)**Hàm ảo (Virtual Functions). Hàm ảo là hàm được khai báo ở lớp cơ sở với từ khóa virtual và được định nghĩa lại (Override) ở các lớp dẫn xuất.

Bạn sẽ áp dụng tính đa hình mạnh mẽ nhất vào chức năng **tính hạn mượn sách**tính hạn mượn sách, vì mỗi đối tượng lại có quy tắc khác nhau:

Hàm tinhHanMuon() sẽ được gọi đa hình:

Đối với **Giáo trình**Giáo trình: Cả Sinh viên và Nhân viên đều có hạn là 6 tháng.

Đối với **Sách tham khảo**Sách tham khảo: Sinh viên là 15 ngày, Nhân viên là 90 ngày.

Đối với **Sách khác**Sách khác: Sinh viên là 7 ngày, Nhân viên là 30 ngày.

### **4. Tính Đóng gói (Encapsulation)**4. Tính Đóng gói (Encapsulation)

Thuộc tính của các lớp cần được bảo vệ bằng các Access Modifiers (Phạm vi truy cập).

Sử dụng private hoặc protected cho các dữ liệu như: họ tên, số điện thoại, MSSV/MSCB (với độc giả) ; mã sách, tên sách, số lượng, nhà xuất bản (với sách).

Sử dụng public cho các phương thức truy xuất (getter/setter) và các hàm nhập/xuất dữ liệu, bởi chúng có thể được truy cập từ bên ngoài lớp.

### **5. Sử dụng Khuôn mẫu (Templates) - Mở rộng**5. Sử dụng Khuôn mẫu (Templates) - Mở rộng

Templates cho phép viết code sử dụng các kiểu dữ liệu tham số hóa (parameterized data types), giúp tạo ra một cấu trúc khung duy nhất thay vì viết nhiều hàm/lớp lặp lại.

Bạn có thể dùng **Class Template**Class Template để tạo ra một lớp quản lý danh sách (ví dụ: DanhSach<T>). Khi đó, DanhSach<NguoiDoc> sẽ dùng để quản lý danh sách độc giả, và DanhSach<Sach> sẽ dùng để quản lý kho sách mà không cần phải code lại hai cấu trúc danh sách riêng biệt.

### **Tổng hợp Các Chức Năng Yêu Cầu Của Hệ Thống**Tổng hợp Các Chức Năng Yêu Cầu Của Hệ Thống


