# CHƯƠNG 5. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 5.1. Kết luận

Đồ án Hệ thống quản lý thư viện đã hoàn thành các mục tiêu đặt ra ban đầu, xây dựng được một phần mềm mô phỏng đầy đủ các nghiệp vụ cơ bản của một thư viện và đồng thời vận dụng trọn vẹn các kỹ thuật của Lập trình hướng đối tượng.

Về kết quả đạt được, hệ thống được tổ chức theo ba nhánh kế thừa chính: nhóm Con người (lớp cơ sở `Nguoi`, dẫn xuất thành độc giả, nhân viên, quản trị viên), nhóm Tài liệu (lớp cơ sở `TaiLieu`, dẫn xuất thành giáo trình, sách tham khảo, sách khác, báo/tạp chí, bài nghiên cứu) và nhóm Giao dịch (mượn, trả, nhập kho, xuất kho). Trên nền kiến trúc này, chương trình xử lý được các quy tắc nghiệp vụ thực tế: giới hạn số lượng mượn theo từng đối tượng độc giả, chặn mượn tài liệu chỉ-đọc-tại-chỗ (sách tham khảo, báo/tạp chí, bài nghiên cứu), tự động cập nhật số lượng tồn kho khi mượn/trả và tính tiền phạt khi trả trễ hạn. Sản phẩm được triển khai ở ba dạng: ứng dụng console C++ (`main.cpp`), web server C++ trên Winsock (`web_server.cpp`), và bản web tĩnh chạy bằng `localStorage` được deploy tự động lên GitHub Pages, có chức năng đăng nhập, đăng ký và phân quyền (độc giả chỉ truy cập được phạm vi của mình, các thao tác quản lý bị chặn ở cả phía giao diện và phía xử lý).

Về mặt vận dụng OOP, đồ án đã áp dụng đầy đủ bốn tính chất cốt lõi: tính trừu tượng qua các lớp cơ sở với hàm thuần ảo định nghĩa khung chung; tính đóng gói để bảo vệ trạng thái dữ liệu (tồn kho, tài khoản); tính kế thừa để tái sử dụng thuộc tính và hành vi giữa các lớp; và tính đa hình để hệ thống tự động xử lý đúng quy tắc cho từng loại tài liệu và độc giả mà không cần phân nhánh `if/else` thủ công. Ngoài ra, đồ án còn sử dụng template cho cấu trúc danh sách tổng quát và con trỏ thông minh (smart pointer) để quản lý bộ nhớ an toàn, tránh rò rỉ bộ nhớ.

Về hạn chế, hệ thống chưa có cơ sở dữ liệu bền vững: bản C++ lưu dữ liệu trên bộ nhớ tạm, bản web lưu trên `localStorage` của trình duyệt, do đó hai phiên bản hoạt động độc lập và chưa đồng bộ. Cơ chế bảo mật còn ở mức cơ bản, và một số tham số nghiệp vụ (mức phạt, hạn mức mượn) đang được gán cứng trong mã nguồn nên hệ thống chưa thật linh hoạt.

## 5.2. Hướng phát triển

Đồ án có thể được mở rộng theo các hướng sau:

- Tích hợp hệ quản trị cơ sở dữ liệu (MySQL/SQLite) để lưu trữ dữ liệu lâu dài thay cho bộ nhớ tạm và `localStorage`.
- Nâng phần lõi C++ thành một backend API để bản web giao tiếp theo mô hình client–server chuẩn mực, đồng bộ dữ liệu giữa các phiên bản.
- Đưa các tham số nghiệp vụ (mức phạt, hạn mức mượn) ra phần cấu hình, cho phép quản trị viên tùy chỉnh trên giao diện thay vì sửa mã nguồn.
- Bổ sung các tính năng nâng cao: dashboard thống kê, chức năng đặt trước tài liệu khi hết hàng, và nhắc hạn trả qua email.
- Tăng cường bảo mật (mã hóa mật khẩu, xác thực bằng JWT cho bản web) và viết kiểm thử tự động (unit test).

## 5.3. Tổng kết

Đồ án Hệ thống quản lý thư viện đã đáp ứng được yêu cầu của môn học, vừa cho ra một sản phẩm chạy được với các nghiệp vụ sát thực tế, vừa thể hiện rõ việc vận dụng các nguyên lý của Lập trình hướng đối tượng vào thiết kế phần mềm. Nhờ kiến trúc phân lớp rõ ràng và khả năng mở rộng tốt, hệ thống có thể tiếp tục được phát triển và bổ sung tính năng mới mà không ảnh hưởng đến cấu trúc sẵn có, tạo nền tảng cho việc nâng cấp thành một ứng dụng hoàn chỉnh hơn trong tương lai.
