#include <algorithm>
#include <ctime>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

using namespace std;

class Date {
private:
    int day;
    int month;
    int year;

public:
    Date() : day(1), month(1), year(1970) {}

    Date(int d, int m, int y) : day(d), month(m), year(y) {
        if (!isValid(d, m, y)) {
            throw invalid_argument("Ngay khong hop le");
        }
    }

    static bool isLeapYear(int y) {
        return (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
    }

    static int daysInMonth(int m, int y) {
        static const int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (m == 2 && isLeapYear(y)) {
            return 29;
        }
        if (m < 1 || m > 12) {
            return 0;
        }
        return days[m];
    }

    static bool isValid(int d, int m, int y) {
        return y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(m, y);
    }

    static Date parse(const string &text) {
        int d = 0;
        int m = 0;
        int y = 0;
        char sep1 = '\0';
        char sep2 = '\0';
        stringstream ss(text);

        if (!(ss >> d >> sep1 >> m >> sep2 >> y) || (sep1 != '/' && sep1 != '-') || sep1 != sep2) {
            throw invalid_argument("Dinh dang ngay phai la dd/mm/yyyy");
        }

        return Date(d, m, y);
    }

    static Date today() {
        time_t now = time(nullptr);
        tm *local = localtime(&now);
        return Date(local->tm_mday, local->tm_mon + 1, local->tm_year + 1900);
    }

    string toString() const {
        ostringstream out;
        out << setfill('0') << setw(2) << day << "/" << setw(2) << month << "/" << setw(4) << year;
        return out.str();
    }

    time_t toTimeT() const {
        tm value{};
        value.tm_mday = day;
        value.tm_mon = month - 1;
        value.tm_year = year - 1900;
        value.tm_hour = 12;
        value.tm_isdst = -1;
        return mktime(&value);
    }

    static Date fromTimeT(time_t value) {
        tm *local = localtime(&value);
        return Date(local->tm_mday, local->tm_mon + 1, local->tm_year + 1900);
    }

    Date addDays(int days) const {
        time_t value = toTimeT() + static_cast<time_t>(days) * 24 * 60 * 60;
        return fromTimeT(value);
    }

    int daysUntil(const Date &other) const {
        double diff = difftime(other.toTimeT(), toTimeT());
        return static_cast<int>(diff / (24 * 60 * 60));
    }

    bool operator<(const Date &other) const {
        return toTimeT() < other.toTimeT();
    }

    bool operator>(const Date &other) const {
        return toTimeT() > other.toTimeT();
    }

    bool operator<=(const Date &other) const {
        return !(*this > other);
    }
};

class Nguoi {
protected:
    string maNguoi;
    string hoTen;
    Date ngaySinh;
    string gioiTinh;
    string soDienThoai;
    string diaChi;

    void hienThiThongTinCoBan() const {
        cout << "Ma: " << maNguoi << '\n';
        cout << "Ho ten: " << hoTen << '\n';
        cout << "Ngay sinh: " << ngaySinh.toString() << '\n';
        cout << "Gioi tinh: " << gioiTinh << '\n';
        cout << "So dien thoai: " << soDienThoai << '\n';
        cout << "Dia chi: " << diaChi << '\n';
    }

public:
    Nguoi(const string &ma, const string &ten, const Date &sinh, const string &gt,
          const string &sdt, const string &dc)
        : maNguoi(ma), hoTen(ten), ngaySinh(sinh), gioiTinh(gt), soDienThoai(sdt), diaChi(dc) {}

    virtual ~Nguoi() = default;

    string getMa() const {
        return maNguoi;
    }

    string getHoTen() const {
        return hoTen;
    }

    void setHoTen(const string &value) {
        hoTen = value;
    }

    string getSoDienThoai() const {
        return soDienThoai;
    }

    void setSoDienThoai(const string &value) {
        soDienThoai = value;
    }

    virtual string loaiNguoi() const = 0;
    virtual void hienThiThongTin() const = 0;
};

class NguoiDoc : public Nguoi {
private:
    Date ngayDangKy;
    Date ngayHetHan;
    int soSachDangMuon;
    int gioiHanSachMuon;

public:
    NguoiDoc(const string &ma, const string &ten, const Date &sinh, const string &gt,
             const string &sdt, const string &dc, const Date &dangKy, const Date &hetHan,
             int gioiHan)
        : Nguoi(ma, ten, sinh, gt, sdt, dc),
          ngayDangKy(dangKy),
          ngayHetHan(hetHan),
          soSachDangMuon(0),
          gioiHanSachMuon(gioiHan) {}

    bool duocPhepMuonSach() const {
        return soSachDangMuon < gioiHanSachMuon && Date::today() <= ngayHetHan;
    }

    void tangSoSachMuon() {
        ++soSachDangMuon;
    }

    void giamSoSachMuon() {
        if (soSachDangMuon > 0) {
            --soSachDangMuon;
        }
    }

    int getSoSachDangMuon() const {
        return soSachDangMuon;
    }

    int getGioiHanSachMuon() const {
        return gioiHanSachMuon;
    }

    Date getNgayHetHan() const {
        return ngayHetHan;
    }

    void hienThiDocGiaCoBan() const {
        hienThiThongTinCoBan();
        cout << "Ngay dang ky: " << ngayDangKy.toString() << '\n';
        cout << "Ngay het han: " << ngayHetHan.toString() << '\n';
        cout << "So sach dang muon: " << soSachDangMuon << "/" << gioiHanSachMuon << '\n';
        cout << "Trang thai the: " << (Date::today() <= ngayHetHan ? "Con han" : "Het han") << '\n';
    }

    virtual string loaiNguoiDoc() const = 0;
    virtual int hanMuonGiaoTrinh() const = 0;
    virtual int hanMuonSachThamKhao() const = 0;
    virtual int hanMuonSachKhac() const = 0;
};

class SinhVien : public NguoiDoc {
private:
    string mssv;

public:
    SinhVien(const string &ma, const string &ten, const Date &sinh, const string &gt,
             const string &sdt, const string &dc, const Date &dangKy, const Date &hetHan,
             const string &mssvValue)
        : NguoiDoc(ma, ten, sinh, gt, sdt, dc, dangKy, hetHan, 5), mssv(mssvValue) {}

    string loaiNguoi() const override {
        return "Sinh vien";
    }

    string loaiNguoiDoc() const override {
        return "Sinh vien";
    }

    int hanMuonGiaoTrinh() const override {
        return 180;
    }

    int hanMuonSachThamKhao() const override {
        return 15;
    }

    int hanMuonSachKhac() const override {
        return 7;
    }

    void hienThiThongTin() const override {
        cout << "\n[Sinh vien]\n";
        hienThiDocGiaCoBan();
        cout << "MSSV: " << mssv << '\n';
    }
};

class VienChuc : public NguoiDoc {
private:
    string mscb;

public:
    VienChuc(const string &ma, const string &ten, const Date &sinh, const string &gt,
             const string &sdt, const string &dc, const Date &dangKy, const Date &hetHan,
             const string &mscbValue)
        : NguoiDoc(ma, ten, sinh, gt, sdt, dc, dangKy, hetHan, 10), mscb(mscbValue) {}

    string loaiNguoi() const override {
        return "Vien chuc";
    }

    string loaiNguoiDoc() const override {
        return "Vien chuc";
    }

    int hanMuonGiaoTrinh() const override {
        return 180;
    }

    int hanMuonSachThamKhao() const override {
        return 90;
    }

    int hanMuonSachKhac() const override {
        return 30;
    }

    void hienThiThongTin() const override {
        cout << "\n[Vien chuc]\n";
        hienThiDocGiaCoBan();
        cout << "MSCB: " << mscb << '\n';
    }
};

class NhanVien : public Nguoi {
private:
    string chucVu;
    double luong;
    string caLamViec;

public:
    NhanVien(const string &ma, const string &ten, const Date &sinh, const string &gt,
             const string &sdt, const string &dc, const string &cv, double luongValue,
             const string &ca)
        : Nguoi(ma, ten, sinh, gt, sdt, dc), chucVu(cv), luong(luongValue), caLamViec(ca) {}

    string loaiNguoi() const override {
        return "Nhan vien";
    }

    double tinhLuong() const {
        return luong;
    }

    void phanCaLam(const string &ca) {
        caLamViec = ca;
    }

    void hienThiThongTin() const override {
        cout << "\n[Nhan vien]\n";
        hienThiThongTinCoBan();
        cout << "Chuc vu: " << chucVu << '\n';
        cout << "Luong: " << fixed << setprecision(0) << tinhLuong() << '\n';
        cout << "Ca lam viec: " << caLamViec << '\n';
    }
};

class QuanTriVien : public Nguoi {
private:
    string username;
    string password;
    string quyenTruyCap;

public:
    QuanTriVien(const string &ma, const string &ten, const Date &sinh, const string &gt,
                const string &sdt, const string &dc, const string &user, const string &pass,
                const string &quyen)
        : Nguoi(ma, ten, sinh, gt, sdt, dc), username(user), password(pass), quyenTruyCap(quyen) {}

    string loaiNguoi() const override {
        return "Quan tri vien";
    }

    void phanQuyen(const string &quyen) {
        quyenTruyCap = quyen;
    }

    void khoiPhucMatKhau(const string &matKhauMoi) {
        password = matKhauMoi;
    }

    void hienThiThongTin() const override {
        cout << "\n[Quan tri vien]\n";
        hienThiThongTinCoBan();
        cout << "Username: " << username << '\n';
        cout << "Password: ********\n";
        cout << "Quyen truy cap: " << quyenTruyCap << '\n';
    }
};

class TaiLieu {
private:
    string maTaiLieu;
    string tenTaiLieu;
    int namXuatBan;
    int soLuong;
    string trangThai;
    string tacGia;
    string nhaXuatBan;
    string theLoai;

protected:
    void hienThiTaiLieuCoBan() const {
        cout << "Ma tai lieu: " << maTaiLieu << '\n';
        cout << "Ten tai lieu: " << tenTaiLieu << '\n';
        cout << "Nam xuat ban: " << namXuatBan << '\n';
        cout << "So luong: " << soLuong << '\n';
        cout << "Trang thai: " << trangThai << '\n';
        cout << "Tac gia: " << tacGia << '\n';
        cout << "Nha xuat ban: " << nhaXuatBan << '\n';
        cout << "The loai: " << theLoai << '\n';
    }

public:
    TaiLieu(const string &ma, const string &ten, int nam, int sl, const string &tg,
            const string &nxb, const string &tl)
        : maTaiLieu(ma),
          tenTaiLieu(ten),
          namXuatBan(nam),
          soLuong(max(0, sl)),
          trangThai(sl > 0 ? "Con san" : "Het"),
          tacGia(tg),
          nhaXuatBan(nxb),
          theLoai(tl) {}

    virtual ~TaiLieu() = default;

    string getMa() const {
        return maTaiLieu;
    }

    string getTenTaiLieu() const {
        return tenTaiLieu;
    }

    int getSoLuong() const {
        return soLuong;
    }

    string getTrangThai() const {
        return trangThai;
    }

    bool capNhatSoLuong(int thayDoi) {
        if (soLuong + thayDoi < 0) {
            return false;
        }
        soLuong += thayDoi;
        trangThai = soLuong > 0 ? "Con san" : "Het";
        return true;
    }

    virtual string loaiTaiLieu() const = 0;
    virtual bool coTheMuonVe() const {
        return true;
    }
    virtual int tinhHanMuon(const NguoiDoc &nguoiDoc) const = 0;
    virtual void hienThiThongTin() const = 0;
};

class Sach : public TaiLieu {
public:
    Sach(const string &ma, const string &ten, int nam, int sl, const string &tg,
         const string &nxb, const string &tl)
        : TaiLieu(ma, ten, nam, sl, tg, nxb, tl) {}

    void quanLySoLuong(int thayDoi) {
        capNhatSoLuong(thayDoi);
    }
};

class GiaoTrinh : public Sach {
private:
    string maMonHoc;
    string boMon;

public:
    GiaoTrinh(const string &ma, const string &ten, int nam, int sl, const string &tg,
              const string &nxb, const string &tl, const string &maMon, const string &boMonValue)
        : Sach(ma, ten, nam, sl, tg, nxb, tl), maMonHoc(maMon), boMon(boMonValue) {}

    string loaiTaiLieu() const override {
        return "Giao trinh";
    }

    bool kiemTraHocPhan(const string &maMon) const {
        return maMonHoc == maMon;
    }

    int tinhHanMuon(const NguoiDoc &nguoiDoc) const override {
        return nguoiDoc.hanMuonGiaoTrinh();
    }

    void hienThiThongTin() const override {
        cout << "\n[Giao trinh]\n";
        hienThiTaiLieuCoBan();
        cout << "Ma mon hoc: " << maMonHoc << '\n';
        cout << "Bo mon: " << boMon << '\n';
    }
};

class SachThamKhao : public Sach {
public:
    SachThamKhao(const string &ma, const string &ten, int nam, int sl, const string &tg,
                 const string &nxb, const string &tl)
        : Sach(ma, ten, nam, sl, tg, nxb, tl) {}

    string loaiTaiLieu() const override {
        return "Sach tham khao";
    }

    int tinhHanMuon(const NguoiDoc &nguoiDoc) const override {
        return nguoiDoc.hanMuonSachThamKhao();
    }

    void hienThiThongTin() const override {
        cout << "\n[Sach tham khao]\n";
        hienThiTaiLieuCoBan();
    }
};

class SachKhac : public Sach {
private:
    string loaiSachKhac;

public:
    SachKhac(const string &ma, const string &ten, int nam, int sl, const string &tg,
             const string &nxb, const string &tl, const string &loaiKhac)
        : Sach(ma, ten, nam, sl, tg, nxb, tl), loaiSachKhac(loaiKhac) {}

    string loaiTaiLieu() const override {
        return "Sach khac";
    }

    int tinhHanMuon(const NguoiDoc &nguoiDoc) const override {
        return nguoiDoc.hanMuonSachKhac();
    }

    void hienThiThongTin() const override {
        cout << "\n[Sach khac]\n";
        hienThiTaiLieuCoBan();
        cout << "Loai sach khac: " << loaiSachKhac << '\n';
    }
};

class BaoTapChi : public TaiLieu {
private:
    int soPhatHanh;
    int thangPhatHanh;

public:
    BaoTapChi(const string &ma, const string &ten, int nam, int sl, const string &tg,
              const string &nxb, const string &tl, int soPH, int thangPH)
        : TaiLieu(ma, ten, nam, sl, tg, nxb, tl), soPhatHanh(soPH), thangPhatHanh(thangPH) {}

    string loaiTaiLieu() const override {
        return "Bao tap chi";
    }

    bool coTheMuonVe() const override {
        return false;
    }

    int tinhHanMuon(const NguoiDoc &) const override {
        return 0;
    }

    void docTaiCho() const {
        cout << "Bao/tap chi chi doc tai cho.\n";
    }

    void hienThiThongTin() const override {
        cout << "\n[Bao tap chi]\n";
        hienThiTaiLieuCoBan();
        cout << "So phat hanh: " << soPhatHanh << '\n';
        cout << "Thang phat hanh: " << thangPhatHanh << '\n';
        docTaiCho();
    }
};

class BaiNghienCuu : public TaiLieu {
private:
    string coQuanChuQuan;
    string linhVuc;

public:
    BaiNghienCuu(const string &ma, const string &ten, int nam, int sl, const string &tg,
                 const string &nxb, const string &tl, const string &coQuan, const string &linhVucValue)
        : TaiLieu(ma, ten, nam, sl, tg, nxb, tl), coQuanChuQuan(coQuan), linhVuc(linhVucValue) {}

    string loaiTaiLieu() const override {
        return "Bai nghien cuu";
    }

    bool coTheMuonVe() const override {
        return false;
    }

    int tinhHanMuon(const NguoiDoc &) const override {
        return 0;
    }

    void traCuuNghienCuu() const {
        cout << "Tra cuu linh vuc: " << linhVuc << '\n';
    }

    void hienThiThongTin() const override {
        cout << "\n[Bai nghien cuu]\n";
        hienThiTaiLieuCoBan();
        cout << "Co quan chu quan: " << coQuanChuQuan << '\n';
        cout << "Linh vuc: " << linhVuc << '\n';
    }
};

class GiaoDich {
protected:
    string maGiaoDich;
    Date ngayGiaoDich;
    string maNhanVienThucHien;

    void hienThiGiaoDichCoBan() const {
        cout << "Ma giao dich: " << maGiaoDich << '\n';
        cout << "Ngay giao dich: " << ngayGiaoDich.toString() << '\n';
        cout << "Ma nhan vien thuc hien: " << maNhanVienThucHien << '\n';
    }

public:
    GiaoDich(const string &ma, const Date &ngay, const string &maNhanVien)
        : maGiaoDich(ma), ngayGiaoDich(ngay), maNhanVienThucHien(maNhanVien) {}

    virtual ~GiaoDich() = default;

    string getMa() const {
        return maGiaoDich;
    }

    virtual string loaiGiaoDich() const = 0;
    virtual void thucHienGiaoDich() const = 0;
    virtual void hienThiThongTin() const = 0;
};

class Muon : public GiaoDich {
private:
    string maNguoiDoc;
    string maTaiLieu;
    Date ngayHenTra;

public:
    Muon(const string &ma, const Date &ngay, const string &maNhanVien,
         const string &maDocGia, const string &maTL, const Date &henTra)
        : GiaoDich(ma, ngay, maNhanVien),
          maNguoiDoc(maDocGia),
          maTaiLieu(maTL),
          ngayHenTra(henTra) {}

    string loaiGiaoDich() const override {
        return "Muon";
    }

    Date getNgayHenTra() const {
        return ngayHenTra;
    }

    bool kiemTraQuaHan(const Date &ngayKiemTra) const {
        return ngayHenTra < ngayKiemTra;
    }

    void ghiNhanNgayMuon() const {
        cout << "Ngay muon: " << ngayGiaoDich.toString() << ", hen tra: " << ngayHenTra.toString() << '\n';
    }

    void thucHienGiaoDich() const override {
        ghiNhanNgayMuon();
    }

    void hienThiThongTin() const override {
        cout << "\n[Giao dich muon]\n";
        hienThiGiaoDichCoBan();
        cout << "Ma nguoi doc: " << maNguoiDoc << '\n';
        cout << "Ma tai lieu: " << maTaiLieu << '\n';
        cout << "Ngay hen tra: " << ngayHenTra.toString() << '\n';
    }
};

class Tra : public GiaoDich {
private:
    string maNguoiDoc;
    string maTaiLieu;
    Date ngayHenTra;
    double tienPhat;

public:
    Tra(const string &ma, const Date &ngay, const string &maNhanVien,
        const string &maDocGia, const string &maTL, const Date &henTra)
        : GiaoDich(ma, ngay, maNhanVien),
          maNguoiDoc(maDocGia),
          maTaiLieu(maTL),
          ngayHenTra(henTra),
          tienPhat(tinhTienPhat()) {}

    string loaiGiaoDich() const override {
        return "Tra";
    }

    double tinhTienPhat() const {
        int soNgayTre = max(0, ngayHenTra.daysUntil(ngayGiaoDich));
        return soNgayTre * 5000.0;
    }

    void xacNhanTraSach() const {
        cout << "Da xac nhan tra tai lieu " << maTaiLieu << " cua doc gia " << maNguoiDoc << ".\n";
    }

    void thucHienGiaoDich() const override {
        xacNhanTraSach();
    }

    void hienThiThongTin() const override {
        cout << "\n[Giao dich tra]\n";
        hienThiGiaoDichCoBan();
        cout << "Ma nguoi doc: " << maNguoiDoc << '\n';
        cout << "Ma tai lieu: " << maTaiLieu << '\n';
        cout << "Ngay hen tra: " << ngayHenTra.toString() << '\n';
        cout << "Tien phat: " << fixed << setprecision(0) << tienPhat << '\n';
    }
};

class Nhap : public GiaoDich {
private:
    string maTaiLieu;
    string nhaCungCap;
    int soLuongNhap;
    double donGiaNhap;

public:
    Nhap(const string &ma, const Date &ngay, const string &maNhanVien,
         const string &maTL, const string &ncc, int sl, double donGia)
        : GiaoDich(ma, ngay, maNhanVien),
          maTaiLieu(maTL),
          nhaCungCap(ncc),
          soLuongNhap(sl),
          donGiaNhap(donGia) {}

    string loaiGiaoDich() const override {
        return "Nhap";
    }

    double tinhTongChiPhi() const {
        return soLuongNhap * donGiaNhap;
    }

    void thucHienGiaoDich() const override {
        cout << "Tong chi phi nhap: " << fixed << setprecision(0) << tinhTongChiPhi() << '\n';
    }

    void hienThiThongTin() const override {
        cout << "\n[Giao dich nhap]\n";
        hienThiGiaoDichCoBan();
        cout << "Ma tai lieu: " << maTaiLieu << '\n';
        cout << "Nha cung cap: " << nhaCungCap << '\n';
        cout << "So luong nhap: " << soLuongNhap << '\n';
        cout << "Don gia nhap: " << fixed << setprecision(0) << donGiaNhap << '\n';
        cout << "Tong chi phi: " << fixed << setprecision(0) << tinhTongChiPhi() << '\n';
    }
};

class Xuat : public GiaoDich {
private:
    string maTaiLieu;
    string lyDoXuat;
    int soLuongXuat;
    double donGiaThanhLy;

public:
    Xuat(const string &ma, const Date &ngay, const string &maNhanVien,
         const string &maTL, const string &lyDo, int sl, double donGia)
        : GiaoDich(ma, ngay, maNhanVien),
          maTaiLieu(maTL),
          lyDoXuat(lyDo),
          soLuongXuat(sl),
          donGiaThanhLy(donGia) {}

    string loaiGiaoDich() const override {
        return "Xuat";
    }

    double tinhDoanhThuThanhLy() const {
        return soLuongXuat * donGiaThanhLy;
    }

    void loaiBoTaiLieu() const {
        cout << "Da ghi nhan thanh ly tai lieu " << maTaiLieu << ".\n";
    }

    void thucHienGiaoDich() const override {
        loaiBoTaiLieu();
    }

    void hienThiThongTin() const override {
        cout << "\n[Giao dich xuat]\n";
        hienThiGiaoDichCoBan();
        cout << "Ma tai lieu: " << maTaiLieu << '\n';
        cout << "Ly do xuat: " << lyDoXuat << '\n';
        cout << "So luong xuat: " << soLuongXuat << '\n';
        cout << "Don gia thanh ly: " << fixed << setprecision(0) << donGiaThanhLy << '\n';
        cout << "Doanh thu thanh ly: " << fixed << setprecision(0) << tinhDoanhThuThanhLy() << '\n';
    }
};

template <typename T>
class DanhSach {
private:
    vector<shared_ptr<T>> items;

public:
    bool them(const shared_ptr<T> &item) {
        if (!item || timTheoMa(item->getMa()) != nullptr) {
            return false;
        }
        items.push_back(item);
        return true;
    }

    shared_ptr<T> timTheoMa(const string &ma) const {
        for (const auto &item : items) {
            if (item->getMa() == ma) {
                return item;
            }
        }
        return nullptr;
    }

    bool xoaTheoMa(const string &ma) {
        auto oldSize = items.size();
        items.erase(remove_if(items.begin(), items.end(),
                              [&](const shared_ptr<T> &item) { return item->getMa() == ma; }),
                    items.end());
        return items.size() != oldSize;
    }

    bool empty() const {
        return items.empty();
    }

    const vector<shared_ptr<T>> &getAll() const {
        return items;
    }

    void hienThiTatCa() const {
        if (items.empty()) {
            cout << "Danh sach rong.\n";
            return;
        }

        for (const auto &item : items) {
            item->hienThiThongTin();
            cout << "------------------------------\n";
        }
    }
};

struct PhieuMuonDangMo {
    string maNguoiDoc;
    string maTaiLieu;
    Date ngayMuon;
    Date ngayHenTra;
};

string readLine(const string &prompt) {
    cout << prompt;
    string value;
    getline(cin, value);
    return value;
}

string readNonEmpty(const string &prompt) {
    while (true) {
        string value = readLine(prompt);
        if (!value.empty()) {
            return value;
        }
        cout << "Gia tri khong duoc de trong.\n";
    }
}

int readInt(const string &prompt, int minValue, int maxValue = numeric_limits<int>::max()) {
    while (true) {
        string value = readLine(prompt);
        stringstream ss(value);
        int number = 0;
        char extra = '\0';
        if (ss >> number && !(ss >> extra) && number >= minValue && number <= maxValue) {
            return number;
        }
        cout << "Vui long nhap so nguyen trong khoang [" << minValue << ", " << maxValue << "].\n";
    }
}

double readDouble(const string &prompt, double minValue) {
    while (true) {
        string value = readLine(prompt);
        stringstream ss(value);
        double number = 0;
        char extra = '\0';
        if (ss >> number && !(ss >> extra) && number >= minValue) {
            return number;
        }
        cout << "Vui long nhap so thuc >= " << minValue << ".\n";
    }
}

Date readDate(const string &prompt) {
    while (true) {
        string value = readLine(prompt);
        try {
            return Date::parse(value);
        } catch (const exception &) {
            cout << "Ngay khong hop le. Dinh dang dung: dd/mm/yyyy.\n";
        }
    }
}

Date readOptionalDate(const string &prompt, const Date &defaultValue) {
    while (true) {
        string value = readLine(prompt);
        if (value.empty()) {
            return defaultValue;
        }
        try {
            return Date::parse(value);
        } catch (const exception &) {
            cout << "Ngay khong hop le. Dinh dang dung: dd/mm/yyyy.\n";
        }
    }
}

string taoMaGiaoDich(int &counter) {
    ostringstream out;
    out << "GD" << setfill('0') << setw(4) << counter++;
    return out.str();
}

void nhapThongTinNguoiCoBan(string &ma, string &ten, Date &sinh, string &gt, string &sdt, string &dc) {
    ma = readNonEmpty("Ma nguoi: ");
    ten = readNonEmpty("Ho ten: ");
    sinh = readDate("Ngay sinh (dd/mm/yyyy): ");
    gt = readNonEmpty("Gioi tinh: ");
    sdt = readNonEmpty("So dien thoai: ");
    dc = readNonEmpty("Dia chi: ");
}

void nhapThongTinTaiLieuCoBan(string &ma, string &ten, int &nam, int &sl, string &tg, string &nxb, string &tl) {
    ma = readNonEmpty("Ma tai lieu: ");
    ten = readNonEmpty("Ten tai lieu: ");
    nam = readInt("Nam xuat ban: ", 1900, 2100);
    sl = readInt("So luong: ", 0);
    tg = readNonEmpty("Tac gia: ");
    nxb = readNonEmpty("Nha xuat ban: ");
    tl = readNonEmpty("The loai: ");
}

string chonLoaiSachKhac() {
    cout << "\nCac loai trong muc Sach khac:\n";
    cout << "1. Van hoc\n";
    cout << "2. Ky nang song\n";
    cout << "3. Ngoai ngu\n";
    cout << "4. Truyen\n";
    cout << "5. Khoa hoc pho thong\n";
    cout << "6. Lich su - dia ly\n";
    cout << "7. Khac (nhap tay)\n";

    int choice = readInt("Chon loai sach khac: ", 1, 7);
    switch (choice) {
    case 1:
        return "Van hoc";
    case 2:
        return "Ky nang song";
    case 3:
        return "Ngoai ngu";
    case 4:
        return "Truyen";
    case 5:
        return "Khoa hoc pho thong";
    case 6:
        return "Lich su - dia ly";
    case 7:
        return readNonEmpty("Nhap loai sach khac: ");
    default:
        return "Khac";
    }
}

bool themNguoiDoc(DanhSach<Nguoi> &dsNguoi, DanhSach<NguoiDoc> &dsNguoiDoc) {
    cout << "\n1. Sinh vien\n2. Vien chuc\n";
    int loai = readInt("Chon loai nguoi doc: ", 1, 2);

    string ma;
    string ten;
    Date sinh;
    string gt;
    string sdt;
    string dc;
    nhapThongTinNguoiCoBan(ma, ten, sinh, gt, sdt, dc);

    if (dsNguoi.timTheoMa(ma) != nullptr) {
        cout << "Ma nguoi da ton tai.\n";
        return false;
    }

    Date dangKy = readDate("Ngay dang ky the (dd/mm/yyyy): ");
    Date hetHan = readDate("Ngay het han the (dd/mm/yyyy): ");

    shared_ptr<NguoiDoc> nguoiDoc;
    if (loai == 1) {
        string mssv = readNonEmpty("MSSV: ");
        nguoiDoc = make_shared<SinhVien>(ma, ten, sinh, gt, sdt, dc, dangKy, hetHan, mssv);
    } else {
        string mscb = readNonEmpty("MSCB: ");
        nguoiDoc = make_shared<VienChuc>(ma, ten, sinh, gt, sdt, dc, dangKy, hetHan, mscb);
    }

    dsNguoiDoc.them(nguoiDoc);
    dsNguoi.them(nguoiDoc);
    cout << "Da them nguoi doc.\n";
    return true;
}

bool themNhanVien(DanhSach<Nguoi> &dsNguoi) {
    string ma;
    string ten;
    Date sinh;
    string gt;
    string sdt;
    string dc;
    nhapThongTinNguoiCoBan(ma, ten, sinh, gt, sdt, dc);

    if (dsNguoi.timTheoMa(ma) != nullptr) {
        cout << "Ma nguoi da ton tai.\n";
        return false;
    }

    string chucVu = readNonEmpty("Chuc vu: ");
    double luong = readDouble("Luong: ", 0);
    string ca = readNonEmpty("Ca lam viec: ");
    dsNguoi.them(make_shared<NhanVien>(ma, ten, sinh, gt, sdt, dc, chucVu, luong, ca));
    cout << "Da them nhan vien.\n";
    return true;
}

bool themQuanTriVien(DanhSach<Nguoi> &dsNguoi) {
    string ma;
    string ten;
    Date sinh;
    string gt;
    string sdt;
    string dc;
    nhapThongTinNguoiCoBan(ma, ten, sinh, gt, sdt, dc);

    if (dsNguoi.timTheoMa(ma) != nullptr) {
        cout << "Ma nguoi da ton tai.\n";
        return false;
    }

    string username = readNonEmpty("Username: ");
    string password = readNonEmpty("Password: ");
    string quyen = readNonEmpty("Quyen truy cap: ");
    dsNguoi.them(make_shared<QuanTriVien>(ma, ten, sinh, gt, sdt, dc, username, password, quyen));
    cout << "Da them quan tri vien.\n";
    return true;
}

bool themTaiLieu(DanhSach<TaiLieu> &dsTaiLieu) {
    cout << "\n1. Giao trinh\n2. Sach tham khao\n3. Sach khac\n4. Bao/tap chi\n5. Bai nghien cuu\n";
    int loai = readInt("Chon loai tai lieu: ", 1, 5);

    string ma;
    string ten;
    int nam = 0;
    int sl = 0;
    string tg;
    string nxb;
    string tl;
    nhapThongTinTaiLieuCoBan(ma, ten, nam, sl, tg, nxb, tl);

    if (dsTaiLieu.timTheoMa(ma) != nullptr) {
        cout << "Ma tai lieu da ton tai.\n";
        return false;
    }

    shared_ptr<TaiLieu> taiLieu;
    switch (loai) {
    case 1: {
        string maMon = readNonEmpty("Ma mon hoc: ");
        string boMon = readNonEmpty("Bo mon: ");
        taiLieu = make_shared<GiaoTrinh>(ma, ten, nam, sl, tg, nxb, tl, maMon, boMon);
        break;
    }
    case 2:
        taiLieu = make_shared<SachThamKhao>(ma, ten, nam, sl, tg, nxb, tl);
        break;
    case 3: {
        string loaiSachKhac = chonLoaiSachKhac();
        taiLieu = make_shared<SachKhac>(ma, ten, nam, sl, tg, nxb, tl, loaiSachKhac);
        break;
    }
    case 4: {
        int soPH = readInt("So phat hanh: ", 1);
        int thangPH = readInt("Thang phat hanh: ", 1, 12);
        taiLieu = make_shared<BaoTapChi>(ma, ten, nam, sl, tg, nxb, tl, soPH, thangPH);
        break;
    }
    case 5: {
        string coQuan = readNonEmpty("Co quan chu quan: ");
        string linhVuc = readNonEmpty("Linh vuc: ");
        taiLieu = make_shared<BaiNghienCuu>(ma, ten, nam, sl, tg, nxb, tl, coQuan, linhVuc);
        break;
    }
    default:
        return false;
    }

    dsTaiLieu.them(taiLieu);
    cout << "Da them tai lieu.\n";
    return true;
}

vector<PhieuMuonDangMo>::iterator timPhieuMuon(vector<PhieuMuonDangMo> &phieuMuons,
                                               const string &maNguoiDoc,
                                               const string &maTaiLieu) {
    return find_if(phieuMuons.begin(), phieuMuons.end(), [&](const PhieuMuonDangMo &phieu) {
        return phieu.maNguoiDoc == maNguoiDoc && phieu.maTaiLieu == maTaiLieu;
    });
}

void muonTaiLieu(DanhSach<NguoiDoc> &dsNguoiDoc, DanhSach<TaiLieu> &dsTaiLieu,
                 DanhSach<GiaoDich> &dsGiaoDich, vector<PhieuMuonDangMo> &phieuMuons,
                 int &counter) {
    string maNguoiDoc = readNonEmpty("Ma nguoi doc: ");
    auto nguoiDoc = dsNguoiDoc.timTheoMa(maNguoiDoc);
    if (!nguoiDoc) {
        cout << "Khong tim thay nguoi doc.\n";
        return;
    }

    if (!nguoiDoc->duocPhepMuonSach()) {
        cout << "Nguoi doc khong duoc phep muon: the het han hoac vuot gioi han sach.\n";
        return;
    }

    string maTaiLieu = readNonEmpty("Ma tai lieu: ");
    auto taiLieu = dsTaiLieu.timTheoMa(maTaiLieu);
    if (!taiLieu) {
        cout << "Khong tim thay tai lieu.\n";
        return;
    }

    if (!taiLieu->coTheMuonVe()) {
        cout << "Tai lieu nay chi duoc doc/tra cuu tai cho.\n";
        return;
    }

    if (taiLieu->getSoLuong() <= 0) {
        cout << "Tai lieu da het so luong.\n";
        return;
    }

    if (timPhieuMuon(phieuMuons, maNguoiDoc, maTaiLieu) != phieuMuons.end()) {
        cout << "Nguoi doc dang muon tai lieu nay roi.\n";
        return;
    }

    string maNhanVien = readNonEmpty("Ma nhan vien thuc hien: ");
    Date ngayMuon = readOptionalDate("Ngay muon (bo trong = hom nay): ", Date::today());
    int soNgayMuon = taiLieu->tinhHanMuon(*nguoiDoc);
    Date ngayHenTra = ngayMuon.addDays(soNgayMuon);

    taiLieu->capNhatSoLuong(-1);
    nguoiDoc->tangSoSachMuon();
    phieuMuons.push_back({maNguoiDoc, maTaiLieu, ngayMuon, ngayHenTra});

    auto giaoDich = make_shared<Muon>(taoMaGiaoDich(counter), ngayMuon, maNhanVien,
                                      maNguoiDoc, maTaiLieu, ngayHenTra);
    dsGiaoDich.them(giaoDich);

    cout << "Muon thanh cong. Han muon: " << soNgayMuon << " ngay, hen tra: "
         << ngayHenTra.toString() << ".\n";
}

void traTaiLieu(DanhSach<NguoiDoc> &dsNguoiDoc, DanhSach<TaiLieu> &dsTaiLieu,
                DanhSach<GiaoDich> &dsGiaoDich, vector<PhieuMuonDangMo> &phieuMuons,
                int &counter) {
    string maNguoiDoc = readNonEmpty("Ma nguoi doc: ");
    string maTaiLieu = readNonEmpty("Ma tai lieu: ");

    auto it = timPhieuMuon(phieuMuons, maNguoiDoc, maTaiLieu);
    if (it == phieuMuons.end()) {
        cout << "Khong tim thay phieu muon dang mo.\n";
        return;
    }

    auto nguoiDoc = dsNguoiDoc.timTheoMa(maNguoiDoc);
    auto taiLieu = dsTaiLieu.timTheoMa(maTaiLieu);
    if (!nguoiDoc || !taiLieu) {
        cout << "Du lieu nguoi doc hoac tai lieu khong con ton tai.\n";
        return;
    }

    string maNhanVien = readNonEmpty("Ma nhan vien thuc hien: ");
    Date ngayTra = readOptionalDate("Ngay tra (bo trong = hom nay): ", Date::today());

    taiLieu->capNhatSoLuong(1);
    nguoiDoc->giamSoSachMuon();

    auto giaoDich = make_shared<Tra>(taoMaGiaoDich(counter), ngayTra, maNhanVien,
                                     maNguoiDoc, maTaiLieu, it->ngayHenTra);
    dsGiaoDich.them(giaoDich);
    int soNgayTre = max(0, it->ngayHenTra.daysUntil(ngayTra));
    double tienPhat = soNgayTre * 5000.0;
    phieuMuons.erase(it);

    cout << "Tra thanh cong. So ngay tre: " << soNgayTre
         << ", tien phat: " << fixed << setprecision(0) << tienPhat << ".\n";
}

void nhapThemTaiLieu(DanhSach<TaiLieu> &dsTaiLieu, DanhSach<GiaoDich> &dsGiaoDich, int &counter) {
    string maTaiLieu = readNonEmpty("Ma tai lieu can nhap: ");
    auto taiLieu = dsTaiLieu.timTheoMa(maTaiLieu);
    if (!taiLieu) {
        cout << "Khong tim thay tai lieu.\n";
        return;
    }

    int soLuong = readInt("So luong nhap: ", 1);
    double donGia = readDouble("Don gia nhap: ", 0);
    string nhaCungCap = readNonEmpty("Nha cung cap: ");
    string maNhanVien = readNonEmpty("Ma nhan vien thuc hien: ");
    Date ngay = readOptionalDate("Ngay nhap (bo trong = hom nay): ", Date::today());

    taiLieu->capNhatSoLuong(soLuong);
    auto giaoDich = make_shared<Nhap>(taoMaGiaoDich(counter), ngay, maNhanVien,
                                      maTaiLieu, nhaCungCap, soLuong, donGia);
    dsGiaoDich.them(giaoDich);
    cout << "Nhap thanh cong. So luong hien tai: " << taiLieu->getSoLuong() << ".\n";
}

void xuatTaiLieu(DanhSach<TaiLieu> &dsTaiLieu, DanhSach<GiaoDich> &dsGiaoDich, int &counter) {
    string maTaiLieu = readNonEmpty("Ma tai lieu can xuat/thanh ly: ");
    auto taiLieu = dsTaiLieu.timTheoMa(maTaiLieu);
    if (!taiLieu) {
        cout << "Khong tim thay tai lieu.\n";
        return;
    }

    int soLuong = readInt("So luong xuat: ", 1, taiLieu->getSoLuong());
    double donGia = readDouble("Don gia thanh ly: ", 0);
    string lyDo = readNonEmpty("Ly do xuat: ");
    string maNhanVien = readNonEmpty("Ma nhan vien thuc hien: ");
    Date ngay = readOptionalDate("Ngay xuat (bo trong = hom nay): ", Date::today());

    taiLieu->capNhatSoLuong(-soLuong);
    auto giaoDich = make_shared<Xuat>(taoMaGiaoDich(counter), ngay, maNhanVien,
                                      maTaiLieu, lyDo, soLuong, donGia);
    dsGiaoDich.them(giaoDich);
    cout << "Xuat thanh cong. So luong hien tai: " << taiLieu->getSoLuong() << ".\n";
}

void hienThiPhieuMuonDangMo(const vector<PhieuMuonDangMo> &phieuMuons) {
    if (phieuMuons.empty()) {
        cout << "Khong co phieu muon dang mo.\n";
        return;
    }

    for (const auto &phieu : phieuMuons) {
        cout << "\nMa nguoi doc: " << phieu.maNguoiDoc << '\n';
        cout << "Ma tai lieu: " << phieu.maTaiLieu << '\n';
        cout << "Ngay muon: " << phieu.ngayMuon.toString() << '\n';
        cout << "Ngay hen tra: " << phieu.ngayHenTra.toString() << '\n';
        cout << "Trang thai: " << (phieu.ngayHenTra < Date::today() ? "Qua han" : "Dang muon") << '\n';
        cout << "------------------------------\n";
    }
}


void napDuLieuMau(DanhSach<Nguoi> &dsNguoi, DanhSach<NguoiDoc> &dsNguoiDoc, DanhSach<TaiLieu> &dsTaiLieu) {
    auto sv = make_shared<SinhVien>("SV001", "Nguyen Van An", Date(12, 3, 2004), "Nam",
                                    "0901000001", "TP HCM", Date(1, 1, 2026), Date(31, 12, 2026),
                                    "22110001");
    auto vc = make_shared<VienChuc>("VC001", "Tran Thi Binh", Date(20, 8, 1988), "Nu",
                                    "0901000002", "TP HCM", Date(1, 1, 2026), Date(31, 12, 2026),
                                    "CB2026");
    dsNguoiDoc.them(sv);
    dsNguoiDoc.them(vc);
    dsNguoi.them(sv);
    dsNguoi.them(vc);
    dsNguoi.them(make_shared<NhanVien>("NV001", "Le Minh Chau", Date(5, 6, 1995), "Nu",
                                       "0901000003", "TP HCM", "Thu thu", 9000000, "Sang"));
    dsNguoi.them(make_shared<QuanTriVien>("AD001", "Pham Quang Duy", Date(10, 10, 1990), "Nam",
                                          "0901000004", "TP HCM", "admin", "admin123", "Full"));

    dsTaiLieu.them(make_shared<GiaoTrinh>("GT001", "Lap trinh huong doi tuong C++", 2024, 8,
                                          "Tran Van Tuan", "NXB Giao Duc", "Cong nghe thong tin",
                                          "OOP101", "Khoa hoc may tinh"));
    dsTaiLieu.them(make_shared<SachThamKhao>("TK001", "Cau truc du lieu va giai thuat", 2023, 5,
                                             "Nguyen Duc Nghia", "NXB DHQG", "Cong nghe thong tin"));
    dsTaiLieu.them(make_shared<SachKhac>("SK001", "Ky nang hoc tap dai hoc", 2022, 4,
                                         "Nhieu tac gia", "NXB Tre", "Ky nang", "Ky nang song"));
    dsTaiLieu.them(make_shared<BaoTapChi>("BC001", "Tap chi Khoa hoc Tre", 2026, 12,
                                          "Toa soan", "NXB Tre", "Tap chi", 6, 6));
    dsTaiLieu.them(make_shared<BaiNghienCuu>("NC001", "Ung dung AI trong thu vien", 2025, 2,
                                             "Nhom nghien cuu A", "HUTECH", "Tri tue nhan tao",
                                             "HUTECH", "AI"));
}

void hienThiMenu() {
    cout << "\n========== HE THONG QUAN LY THU VIEN ==========\n";
    cout << "1. Them nguoi doc\n";
    cout << "2. Them nhan vien\n";
    cout << "3. Them quan tri vien\n";
    cout << "4. Them tai lieu\n";
    cout << "5. Hien thi tat ca nguoi\n";
    cout << "6. Hien thi danh sach nguoi doc\n";
    cout << "7. Hien thi tai lieu\n";
    cout << "8. Muon tai lieu\n";
    cout << "9. Tra tai lieu\n";
    cout << "10. Nhap them tai lieu\n";
    cout << "11. Xuat/thanh ly tai lieu\n";
    cout << "12. Hien thi giao dich\n";
    cout << "13. Hien thi phieu muon dang mo\n";
    cout << "0. Thoat\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    DanhSach<Nguoi> dsNguoi;
    DanhSach<NguoiDoc> dsNguoiDoc;
    DanhSach<TaiLieu> dsTaiLieu;
    DanhSach<GiaoDich> dsGiaoDich;
    vector<PhieuMuonDangMo> phieuMuons;
    int counterGiaoDich = 1;

    napDuLieuMau(dsNguoi, dsNguoiDoc, dsTaiLieu);

    while (true) {
        hienThiMenu();
        int choice = readInt("Chon chuc nang: ", 0, 13);

        switch (choice) {
        case 1:
            themNguoiDoc(dsNguoi, dsNguoiDoc);
            break;
        case 2:
            themNhanVien(dsNguoi);
            break;
        case 3:
            themQuanTriVien(dsNguoi);
            break;
        case 4:
            themTaiLieu(dsTaiLieu);
            break;
        case 5:
            dsNguoi.hienThiTatCa();
            break;
        case 6:
            dsNguoiDoc.hienThiTatCa();
            break;
        case 7:
            dsTaiLieu.hienThiTatCa();
            break;
        case 8:
            muonTaiLieu(dsNguoiDoc, dsTaiLieu, dsGiaoDich, phieuMuons, counterGiaoDich);
            break;
        case 9:
            traTaiLieu(dsNguoiDoc, dsTaiLieu, dsGiaoDich, phieuMuons, counterGiaoDich);
            break;
        case 10:
            nhapThemTaiLieu(dsTaiLieu, dsGiaoDich, counterGiaoDich);
            break;
        case 11:
            xuatTaiLieu(dsTaiLieu, dsGiaoDich, counterGiaoDich);
            break;
        case 12:
            dsGiaoDich.hienThiTatCa();
            break;
        case 13:
            hienThiPhieuMuonDangMo(phieuMuons);
            break;
        case 0:
            cout << "Ket thuc chuong trinh.\n";
            return 0;
        default:
            cout << "Lua chon khong hop le.\n";
            break;
        }
    }
}
