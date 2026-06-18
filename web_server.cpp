#include <algorithm>
#include <cctype>
#include <iomanip>
#include <iostream>
#include <map>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

#ifndef _WIN32
#error "This simple server is written for Windows Winsock."
#endif

#include <winsock2.h>
#include <ws2tcpip.h>

using namespace std;

class Date {
private:
    int day;
    int month;
    int year;

public:
    Date() : day(1), month(1), year(2026) {}
    Date(int d, int m, int y) : day(d), month(m), year(y) {}

    static Date parseISO(const string &value) {
        if (value.size() < 10) {
            return Date::today();
        }
        int y = stoi(value.substr(0, 4));
        int m = stoi(value.substr(5, 2));
        int d = stoi(value.substr(8, 2));
        return Date(d, m, y);
    }

    static Date today() {
        time_t now = time(nullptr);
        tm *local = localtime(&now);
        return Date(local->tm_mday, local->tm_mon + 1, local->tm_year + 1900);
    }

    string toISO() const {
        ostringstream out;
        out << setfill('0') << setw(4) << year << "-" << setw(2) << month << "-" << setw(2) << day;
        return out.str();
    }

    string toDisplay() const {
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

    Date addDays(int days) const {
        time_t value = toTimeT() + static_cast<time_t>(days) * 24 * 60 * 60;
        tm *local = localtime(&value);
        return Date(local->tm_mday, local->tm_mon + 1, local->tm_year + 1900);
    }

    int daysUntil(const Date &other) const {
        return static_cast<int>(difftime(other.toTimeT(), toTimeT()) / (24 * 60 * 60));
    }

    bool operator<(const Date &other) const {
        return toTimeT() < other.toTimeT();
    }

    bool operator<=(const Date &other) const {
        return toTimeT() <= other.toTimeT();
    }
};

string htmlEscape(const string &value) {
    string result;
    result.reserve(value.size());
    for (char ch : value) {
        switch (ch) {
        case '&':
            result += "&amp;";
            break;
        case '<':
            result += "&lt;";
            break;
        case '>':
            result += "&gt;";
            break;
        case '"':
            result += "&quot;";
            break;
        case '\'':
            result += "&#39;";
            break;
        default:
            result += ch;
            break;
        }
    }
    return result;
}

string urlDecode(const string &value) {
    string result;
    result.reserve(value.size());
    for (size_t i = 0; i < value.size(); ++i) {
        if (value[i] == '%' && i + 2 < value.size()) {
            string hex = value.substr(i + 1, 2);
            char decoded = static_cast<char>(strtol(hex.c_str(), nullptr, 16));
            result += decoded;
            i += 2;
        } else if (value[i] == '+') {
            result += ' ';
        } else {
            result += value[i];
        }
    }
    return result;
}

map<string, string> parseForm(const string &body) {
    map<string, string> fields;
    stringstream ss(body);
    string pair;
    while (getline(ss, pair, '&')) {
        size_t eq = pair.find('=');
        if (eq == string::npos) {
            continue;
        }
        string key = urlDecode(pair.substr(0, eq));
        string value = urlDecode(pair.substr(eq + 1));
        fields[key] = value;
    }
    return fields;
}

string field(const map<string, string> &fields, const string &key, const string &fallback = "") {
    auto it = fields.find(key);
    if (it == fields.end() || it->second.empty()) {
        return fallback;
    }
    return it->second;
}

int fieldInt(const map<string, string> &fields, const string &key, int fallback = 0) {
    try {
        return stoi(field(fields, key, to_string(fallback)));
    } catch (...) {
        return fallback;
    }
}

class NguoiDoc {
private:
    string maNguoi;
    string hoTen;
    string nhom;
    string soDienThoai;
    string diaChi;
    string maDinhDanh;
    Date ngayHetHan;
    int soSachDangMuon;
    int gioiHanMuon;

public:
    NguoiDoc(string ma, string ten, string loai, string sdt, string dc, string dinhDanh, Date hetHan)
        : maNguoi(move(ma)),
          hoTen(move(ten)),
          nhom(move(loai)),
          soDienThoai(move(sdt)),
          diaChi(move(dc)),
          maDinhDanh(move(dinhDanh)),
          ngayHetHan(hetHan),
          soSachDangMuon(0),
          gioiHanMuon(nhom == "Sinh viên" ? 5 : 10) {}

    const string &getMa() const { return maNguoi; }
    const string &getHoTen() const { return hoTen; }
    const string &getNhom() const { return nhom; }
    const string &getSoDienThoai() const { return soDienThoai; }
    const string &getDiaChi() const { return diaChi; }
    const string &getMaDinhDanh() const { return maDinhDanh; }
    Date getNgayHetHan() const { return ngayHetHan; }
    int getSoSachDangMuon() const { return soSachDangMuon; }
    int getGioiHanMuon() const { return gioiHanMuon; }

    bool duocPhepMuon() const {
        return Date::today() <= ngayHetHan && soSachDangMuon < gioiHanMuon;
    }

    bool laSinhVien() const {
        return nhom == "Sinh viên";
    }

    void tangSoSachMuon() {
        ++soSachDangMuon;
    }

    void giamSoSachMuon() {
        if (soSachDangMuon > 0) {
            --soSachDangMuon;
        }
    }
};

class TaiLieu {
protected:
    string maTaiLieu;
    string tenTaiLieu;
    string loaiTaiLieu;
    string tacGia;
    string nhaXuatBan;
    string theLoai;
    int namXuatBan;
    int soLuong;

public:
    TaiLieu(string ma, string ten, string loai, string tacGiaValue, string nxb, string theLoaiValue,
            int nam, int sl)
        : maTaiLieu(move(ma)),
          tenTaiLieu(move(ten)),
          loaiTaiLieu(move(loai)),
          tacGia(move(tacGiaValue)),
          nhaXuatBan(move(nxb)),
          theLoai(move(theLoaiValue)),
          namXuatBan(nam),
          soLuong(max(0, sl)) {}

    virtual ~TaiLieu() = default;
    const string &getMa() const { return maTaiLieu; }
    const string &getTen() const { return tenTaiLieu; }
    const string &getLoai() const { return loaiTaiLieu; }
    const string &getTacGia() const { return tacGia; }
    const string &getNhaXuatBan() const { return nhaXuatBan; }
    const string &getTheLoai() const { return theLoai; }
    int getNamXuatBan() const { return namXuatBan; }
    int getSoLuong() const { return soLuong; }

    bool capNhatSoLuong(int thayDoi) {
        if (soLuong + thayDoi < 0) {
            return false;
        }
        soLuong += thayDoi;
        return true;
    }

    virtual bool coTheMuonVe() const { return true; }
    virtual int tinhHanMuon(const NguoiDoc &nguoiDoc) const = 0;
    virtual string chiTiet() const = 0;
};

class GiaoTrinh : public TaiLieu {
private:
    string maMonHoc;
    string boMon;

public:
    GiaoTrinh(string ma, string ten, string tacGia, string nxb, string theLoai, int nam, int sl,
              string mon, string boMonValue)
        : TaiLieu(move(ma), move(ten), "Giáo trình", move(tacGia), move(nxb), move(theLoai), nam, sl),
          maMonHoc(move(mon)),
          boMon(move(boMonValue)) {}

    int tinhHanMuon(const NguoiDoc &) const override { return 180; }
    string chiTiet() const override { return maMonHoc + " - " + boMon; }
};

class SachThamKhao : public TaiLieu {
public:
    SachThamKhao(string ma, string ten, string tacGia, string nxb, string theLoai, int nam, int sl)
        : TaiLieu(move(ma), move(ten), "Sách tham khảo", move(tacGia), move(nxb), move(theLoai), nam, sl) {}

    int tinhHanMuon(const NguoiDoc &nguoiDoc) const override {
        return nguoiDoc.laSinhVien() ? 15 : 90;
    }

    string chiTiet() const override { return theLoai.empty() ? "Sách tra cứu, tham khảo chuyên ngành" : theLoai; }
};

class SachKhac : public TaiLieu {
private:
    string loaiSachKhac;

public:
    SachKhac(string ma, string ten, string tacGia, string nxb, string theLoai, int nam, int sl, string loaiKhac)
        : TaiLieu(move(ma), move(ten), "Sách khác", move(tacGia), move(nxb), move(theLoai), nam, sl),
          loaiSachKhac(move(loaiKhac)) {}

    int tinhHanMuon(const NguoiDoc &nguoiDoc) const override {
        return nguoiDoc.laSinhVien() ? 7 : 30;
    }

    string chiTiet() const override { return loaiSachKhac; }
};

class BaoTapChi : public TaiLieu {
private:
    int soPhatHanh;
    int thangPhatHanh;

public:
    BaoTapChi(string ma, string ten, string tacGia, string nxb, string theLoai, int nam, int sl,
              int soPH, int thangPH)
        : TaiLieu(move(ma), move(ten), "Báo/tạp chí", move(tacGia), move(nxb), move(theLoai), nam, sl),
          soPhatHanh(soPH),
          thangPhatHanh(thangPH) {}

    bool coTheMuonVe() const override { return false; }
    int tinhHanMuon(const NguoiDoc &) const override { return 0; }
    string chiTiet() const override {
        return "Số " + to_string(soPhatHanh) + ", tháng " + to_string(thangPhatHanh) + " - chỉ đọc tại chỗ";
    }
};

class BaiNghienCuu : public TaiLieu {
private:
    string coQuanChuQuan;
    string linhVuc;

public:
    BaiNghienCuu(string ma, string ten, string tacGia, string nxb, string theLoai, int nam, int sl,
                 string coQuan, string linhVucValue)
        : TaiLieu(move(ma), move(ten), "Bài nghiên cứu", move(tacGia), move(nxb), move(theLoai), nam, sl),
          coQuanChuQuan(move(coQuan)),
          linhVuc(move(linhVucValue)) {}

    bool coTheMuonVe() const override { return false; }
    int tinhHanMuon(const NguoiDoc &) const override { return 0; }
    string chiTiet() const override { return coQuanChuQuan + " - " + linhVuc + " - tra cứu tại chỗ"; }
};

class GiaoDich {
private:
    string maGiaoDich;
    string loai;
    Date ngay;
    string maNhanVien;
    string noiDung;
    double soTien;

public:
    GiaoDich(string ma, string loaiValue, Date ngayValue, string nv, string nd, double tien)
        : maGiaoDich(move(ma)),
          loai(move(loaiValue)),
          ngay(ngayValue),
          maNhanVien(move(nv)),
          noiDung(move(nd)),
          soTien(tien) {}

    const string &getMa() const { return maGiaoDich; }
    const string &getLoai() const { return loai; }
    Date getNgay() const { return ngay; }
    const string &getMaNhanVien() const { return maNhanVien; }
    const string &getNoiDung() const { return noiDung; }
    double getSoTien() const { return soTien; }
};

template <typename T>
class DanhSach {
private:
    vector<shared_ptr<T>> items;

public:
    bool them(const shared_ptr<T> &item) {
        if (!item || timTheoMa(item->getMa())) {
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

    vector<shared_ptr<T>> &tatCa() { return items; }
    const vector<shared_ptr<T>> &tatCa() const { return items; }
};

struct PhieuMuon {
    string maPhieu;
    string maNguoiDoc;
    string maTaiLieu;
    Date ngayMuon;
    Date ngayHenTra;
};

class LibrarySystem {
private:
    DanhSach<NguoiDoc> nguoiDocs;
    DanhSach<TaiLieu> taiLieus;
    vector<GiaoDich> giaoDichs;
    vector<PhieuMuon> phieuMuons;
    int counterPhieuMuon = 1;
    int counterGiaoDich = 1;
    string thongBao = "Dữ liệu mẫu đã sẵn sàng.";

    string nextPhieuMuonId() {
        ostringstream out;
        out << "PM" << setfill('0') << setw(4) << counterPhieuMuon++;
        return out.str();
    }

    string nextGiaoDichId() {
        ostringstream out;
        out << "GD" << setfill('0') << setw(4) << counterGiaoDich++;
        return out.str();
    }

public:
    LibrarySystem() {
        napDuLieuMau();
    }

    void napDuLieuMau() {
        nguoiDocs = DanhSach<NguoiDoc>();
        taiLieus = DanhSach<TaiLieu>();
        giaoDichs.clear();
        phieuMuons.clear();
        counterPhieuMuon = 1;
        counterGiaoDich = 1;

        nguoiDocs.them(make_shared<NguoiDoc>("SV001", "Nguyễn Văn An", "Sinh viên", "0901000001",
                                             "TP. Hồ Chí Minh", "22110001", Date(31, 12, 2026)));
        nguoiDocs.them(make_shared<NguoiDoc>("VC001", "Trần Thị Bình", "Viên chức", "0901000002",
                                             "TP. Hồ Chí Minh", "CB2026", Date(31, 12, 2026)));

        taiLieus.them(make_shared<GiaoTrinh>("GT001", "Lập trình hướng đối tượng C++", "Trần Văn Tuấn",
                                             "NXB Giáo Dục", "Công nghệ thông tin", 2024, 8,
                                             "Lập trình Hướng đối tượng (C++)", "Giáo trình Chuyên ngành"));
        taiLieus.them(make_shared<SachThamKhao>("TK001", "Cấu trúc dữ liệu và giải thuật", "Nguyễn Đức Nghĩa",
                                                "NXB Đại học Quốc gia", "Sách chuyên khảo", 2023, 5));
        taiLieus.them(make_shared<SachKhac>("SK001", "Kỹ năng học tập đại học", "Nhiều tác giả",
                                            "NXB Trẻ", "Kỹ năng", 2022, 4, "Phát triển bản thân / Kỹ năng sống"));
        taiLieus.them(make_shared<BaoTapChi>("BC001", "Tạp chí Khoa học Trẻ", "Tòa soạn",
                                             "NXB Trẻ", "Tạp chí Khoa học & Chuyên ngành", 2026, 12, 6, 6));
        taiLieus.them(make_shared<BaiNghienCuu>("NC001", "Ứng dụng AI trong thư viện", "Nhóm nghiên cứu A",
                                                "HUTECH", "Báo cáo khoa học / Đề tài NCKH", 2025, 2, "HUTECH", "Báo cáo khoa học / Đề tài NCKH"));

        thongBao = "Đã nạp lại dữ liệu mẫu.";
    }

    string getThongBao() const { return thongBao; }
    const DanhSach<NguoiDoc> &getNguoiDocs() const { return nguoiDocs; }
    const DanhSach<TaiLieu> &getTaiLieus() const { return taiLieus; }
    const vector<GiaoDich> &getGiaoDichs() const { return giaoDichs; }
    const vector<PhieuMuon> &getPhieuMuons() const { return phieuMuons; }

    void themNguoiDoc(const map<string, string> &form) {
        string ma = field(form, "ma");
        if (ma.empty()) {
            thongBao = "Mã người đọc không được để trống.";
            return;
        }
        if (nguoiDocs.timTheoMa(ma)) {
            thongBao = "Mã người đọc đã tồn tại.";
            return;
        }

        nguoiDocs.them(make_shared<NguoiDoc>(
            ma,
            field(form, "hoTen", "Chưa đặt tên"),
            field(form, "nhom", "Sinh viên"),
            field(form, "soDienThoai", "Chưa có"),
            field(form, "diaChi", "Chưa có"),
            field(form, "maDinhDanh", "Chưa có"),
            Date::parseISO(field(form, "ngayHetHan", Date::today().toISO()))));

        thongBao = "Đã thêm người đọc " + ma + ".";
    }

    void themTaiLieu(const map<string, string> &form) {
        string ma = field(form, "ma");
        string loai = field(form, "loai", "Giáo trình");
        if (ma.empty()) {
            thongBao = "Mã tài liệu không được để trống.";
            return;
        }
        if (taiLieus.timTheoMa(ma)) {
            thongBao = "Mã tài liệu đã tồn tại.";
            return;
        }

        string ten = field(form, "ten", "Chưa đặt tên");
        string tacGia = field(form, "tacGia", "Chưa rõ");
        string nxb = field(form, "nhaXuatBan", "Chưa rõ");
        string theLoai = field(form, "theLoai", "Chưa phân loại");
        int nam = fieldInt(form, "nam", 2026);
        int soLuong = fieldInt(form, "soLuong", 1);

        if (loai == "Giáo trình") {
            taiLieus.them(make_shared<GiaoTrinh>(ma, ten, tacGia, nxb, theLoai, nam, soLuong,
                                                 field(form, "maMonHoc", "Môn học"),
                                                 field(form, "boMon", "Bộ môn")));
        } else if (loai == "Sách tham khảo") {
            taiLieus.them(make_shared<SachThamKhao>(ma, ten, tacGia, nxb, theLoai, nam, soLuong));
        } else if (loai == "Sách khác") {
            taiLieus.them(make_shared<SachKhac>(ma, ten, tacGia, nxb, theLoai, nam, soLuong,
                                                field(form, "loaiSachKhac", "Khác")));
        } else if (loai == "Báo/tạp chí") {
            taiLieus.them(make_shared<BaoTapChi>(ma, ten, tacGia, nxb, theLoai, nam, soLuong,
                                                fieldInt(form, "soPhatHanh", 1),
                                                fieldInt(form, "thangPhatHanh", 1)));
        } else {
            taiLieus.them(make_shared<BaiNghienCuu>(ma, ten, tacGia, nxb, theLoai, nam, soLuong,
                                                   field(form, "coQuanChuQuan", "Chưa rõ"),
                                                   field(form, "linhVuc", "Chưa rõ")));
        }

        thongBao = "Đã thêm tài liệu " + ma + ".";
    }

    void muonTaiLieu(const map<string, string> &form) {
        string maNguoi = field(form, "maNguoiDoc");
        string maTaiLieu = field(form, "maTaiLieu");
        auto nguoiDoc = nguoiDocs.timTheoMa(maNguoi);
        auto taiLieu = taiLieus.timTheoMa(maTaiLieu);

        if (!nguoiDoc || !taiLieu) {
            thongBao = "Không tìm thấy người đọc hoặc tài liệu.";
            return;
        }
        if (!nguoiDoc->duocPhepMuon()) {
            thongBao = "Người đọc hết hạn thẻ hoặc đã vượt giới hạn mượn.";
            return;
        }
        if (!taiLieu->coTheMuonVe()) {
            thongBao = "Tài liệu này chỉ được đọc hoặc tra cứu tại chỗ.";
            return;
        }
        if (taiLieu->getSoLuong() <= 0) {
            thongBao = "Tài liệu đã hết số lượng.";
            return;
        }

        for (const auto &phieu : phieuMuons) {
            if (phieu.maNguoiDoc == maNguoi && phieu.maTaiLieu == maTaiLieu) {
                thongBao = "Người đọc đang mượn tài liệu này.";
                return;
            }
        }

        Date ngayMuon = Date::parseISO(field(form, "ngayMuon", Date::today().toISO()));
        int hanMuon = taiLieu->tinhHanMuon(*nguoiDoc);
        Date ngayHenTra = ngayMuon.addDays(hanMuon);

        taiLieu->capNhatSoLuong(-1);
        nguoiDoc->tangSoSachMuon();
        string maPhieu = nextPhieuMuonId();
        phieuMuons.push_back({maPhieu, maNguoi, maTaiLieu, ngayMuon, ngayHenTra});
        giaoDichs.emplace_back(nextGiaoDichId(), "Mượn", ngayMuon, field(form, "maNhanVien", "NV001"),
                               nguoiDoc->getHoTen() + " mượn " + taiLieu->getTen(), 0);
        thongBao = "Mượn thành công. Hẹn trả ngày " + ngayHenTra.toDisplay() + ".";
    }

    void traTaiLieu(const map<string, string> &form) {
        string maPhieu = field(form, "maPhieu");
        auto it = find_if(phieuMuons.begin(), phieuMuons.end(), [&](const PhieuMuon &phieu) {
            return phieu.maPhieu == maPhieu;
        });

        if (it == phieuMuons.end()) {
            thongBao = "Không tìm thấy phiếu mượn đang mở.";
            return;
        }

        auto nguoiDoc = nguoiDocs.timTheoMa(it->maNguoiDoc);
        auto taiLieu = taiLieus.timTheoMa(it->maTaiLieu);
        Date ngayTra = Date::parseISO(field(form, "ngayTra", Date::today().toISO()));
        int soNgayTre = max(0, it->ngayHenTra.daysUntil(ngayTra));
        double tienPhat = soNgayTre * 5000.0;

        if (nguoiDoc) {
            nguoiDoc->giamSoSachMuon();
        }
        if (taiLieu) {
            taiLieu->capNhatSoLuong(1);
        }

        string noiDung = (nguoiDoc ? nguoiDoc->getHoTen() : it->maNguoiDoc) + " trả " +
                         (taiLieu ? taiLieu->getTen() : it->maTaiLieu);
        giaoDichs.emplace_back(nextGiaoDichId(), "Trả", ngayTra, field(form, "maNhanVien", "NV001"),
                               noiDung, tienPhat);
        phieuMuons.erase(it);
        thongBao = "Trả thành công. Tiền phạt: " + to_string(static_cast<int>(tienPhat)) + " VND.";
    }
};

string css() {
    return R"CSS(
    :root{--bg:#eef2f6;--card:#fff;--ink:#172033;--muted:#66758a;--line:#d9e1ec;--blue:#2563eb;--green:#078461;--amber:#b66b16;--rose:#bd2f55;--side:#172333;--soft:#f7f9fc;--shadow:0 14px 32px rgba(24,32,47,.1)}
    *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Segoe UI,Arial,sans-serif;letter-spacing:0}button,input,select{font:inherit}
    .shell{display:grid;grid-template-columns:270px minmax(0,1fr);min-height:100vh}.side{position:sticky;top:0;height:100vh;background:var(--side);color:white;padding:20px;display:flex;flex-direction:column}.brand{display:flex;gap:12px;align-items:center;border-bottom:1px solid rgba(255,255,255,.12);padding-bottom:20px}.mark{display:grid;place-items:center;width:44px;height:44px;border-radius:8px;background:#f2b84b;color:#172333;font-weight:900}.brand span{display:block;color:#c6d1df;font-size:.84rem;margin-top:3px}.nav{display:grid;gap:8px;margin-top:24px}.nav a{color:#dbe5f2;text-decoration:none;padding:11px 12px;border-radius:8px}.nav a:hover,.nav a.active{background:#203149;color:#fff}.foot{margin-top:auto;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:14px;background:rgba(255,255,255,.06)}
    main{padding:26px}.top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.eyebrow{margin:0 0 7px;color:var(--blue);font-size:.76rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}h1{margin:0;font-size:2rem}h2{margin:0;font-size:1.08rem}.actions{display:flex;gap:10px;flex-wrap:wrap}.btn{border:0;border-radius:8px;background:var(--blue);color:white;padding:10px 14px;font-weight:800;text-decoration:none;display:inline-block}.btn.secondary{background:#fff;color:var(--ink);border:1px solid var(--line)}
    .notice{border:1px solid #bed2ff;background:#edf4ff;color:#1d4ed8;border-radius:8px;padding:12px 14px;margin-bottom:16px;font-weight:700}.hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:16px;margin-bottom:16px}.summary{background:#fff;border:1px solid var(--line);border-radius:8px;padding:22px;box-shadow:var(--shadow);display:grid;grid-template-columns:1fr 230px;gap:16px;align-items:center}.summary p{color:var(--muted);line-height:1.55}.art{height:150px;border-radius:8px;background:linear-gradient(135deg,#e8f0ff,#fff);display:grid;place-items:center;color:#2563eb;font-weight:900;font-size:4rem}.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.stat{background:#fff;border:1px solid var(--line);border-top:4px solid var(--blue);border-radius:8px;padding:18px;box-shadow:var(--shadow)}.stat span{color:var(--muted);font-weight:800;font-size:.82rem}.stat strong{display:block;font-size:2rem;margin-top:8px}.stat.green{border-top-color:var(--green)}.stat.amber{border-top-color:var(--amber)}.stat.rose{border-top-color:var(--rose)}
    .grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(320px,.6fr);gap:16px;margin-bottom:16px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.panel{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px;box-shadow:var(--shadow)}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.count{border-radius:999px;background:#edf2f8;color:#475569;font-weight:900;font-size:.78rem;padding:5px 10px}
    .table-wrap{overflow:auto;border:1px solid var(--line);border-radius:8px}table{width:100%;border-collapse:collapse;background:white}th,td{padding:12px 11px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:#f4f7fb;color:#536176;font-size:.76rem;text-transform:uppercase}tr:last-child td{border-bottom:0}.muted{color:var(--muted)}.status{display:inline-block;border-radius:999px;padding:4px 9px;font-size:.78rem;font-weight:900}.ok{background:#e4f6ef;color:#05734e}.warn{background:#fff1d1;color:#87520a}.bad{background:#ffe4eb;color:#a52245}
    form{display:grid;gap:12px}label{display:grid;gap:6px;color:#435269;font-size:.82rem;font-weight:850}input,select{width:100%;min-height:40px;border:1px solid var(--line);border-radius:8px;padding:9px 10px;background:white}.form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.submit{border:0;border-radius:8px;background:var(--blue);color:#fff;min-height:42px;font-weight:900}.mini-list{display:grid;gap:10px}.item{border-top:1px solid var(--line);padding-top:10px}.item:first-child{border-top:0;padding-top:0}.oop{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.tag{display:inline-block;border-radius:999px;background:#e8f0ff;color:#2563eb;font-size:.75rem;font-weight:900;padding:4px 10px}.tree{background:var(--soft);border-radius:8px;padding:10px;font-family:Consolas,monospace;color:#304057}
    @media(max-width:1050px){.shell{grid-template-columns:1fr}.side{position:static;height:auto}.hero,.summary,.grid,.grid.two,.oop{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.foot{display:none}}@media(max-width:680px){main{padding:16px}.top,.actions{display:grid;justify-content:stretch}.stats,.form-grid{grid-template-columns:1fr}}
    )CSS";
}

string selected(const string &current, const string &value) {
    return current == value ? " selected" : "";
}

string option(const string &value, const string &label, const string &current = "") {
    return "<option value=\"" + htmlEscape(value) + "\"" + selected(current, value) + ">" + htmlEscape(label) + "</option>";
}

string renderPage(const LibrarySystem &system) {
    const auto &nguoiDocs = system.getNguoiDocs().tatCa();
    const auto &taiLieus = system.getTaiLieus().tatCa();
    const auto &phieuMuons = system.getPhieuMuons();
    const auto &giaoDichs = system.getGiaoDichs();

    int tongSach = 0;
    for (const auto &tl : taiLieus) {
        tongSach += tl->getSoLuong();
    }

    ostringstream html;
    html << "<!doctype html><html lang='vi'><head><meta charset='utf-8'>"
         << "<meta name='viewport' content='width=device-width,initial-scale=1'>"
         << "<title>Quản lý thư viện OOP C++</title><style>" << css() << "</style></head><body>";

    html << "<div class='shell'><aside class='side'><div class='brand'><div class='mark'>TV</div>"
         << "<div><strong>Thư viện OOP</strong><span>Website chạy bằng C++</span></div></div>"
         << "<nav class='nav'><a class='active' href='#tongquan'>Tổng quan</a><a href='#tailieu'>Tài liệu</a>"
         << "<a href='#nguoidoc'>Người đọc</a><a href='#muontra'>Mượn / Trả</a>"
         << "<a href='#giaodich'>Giao dịch</a><a href='#oop'>Mô hình OOP</a></nav>"
         << "<div class='foot'><span>Tệp chính</span><strong>web_server.cpp</strong></div></aside><main>";

    html << "<header class='top' id='tongquan'><div><p class='eyebrow'>Hệ thống quản lý thư viện</p>"
         << "<h1>Quản lý thư viện</h1></div><div class='actions'>"
         << "<a class='btn' href='#muontra'>Mượn sách</a>"
         << "<form method='post' action='/reset'><button class='btn secondary' type='submit'>Nạp lại mẫu</button></form>"
         << "</div></header>";

    html << "<div class='notice'>" << htmlEscape(system.getThongBao()) << "</div>";

    html << "<section class='hero'><div class='summary'><div><p class='eyebrow'>Bài OOP C++</p>"
         << "<h2>Giao diện web xử lý bằng C++</h2>"
         << "<p>Trang này không dùng Java. Mỗi biểu mẫu gửi về chương trình C++ để thêm tài liệu, thêm người đọc, mượn và trả sách.</p>"
         << "</div><div class='art'>C++</div></div><div class='stats'>"
         << "<article class='stat'><span>Đầu tài liệu</span><strong>" << taiLieus.size() << "</strong></article>"
         << "<article class='stat green'><span>Tổng bản sách</span><strong>" << tongSach << "</strong></article>"
         << "<article class='stat amber'><span>Người đọc</span><strong>" << nguoiDocs.size() << "</strong></article>"
         << "<article class='stat rose'><span>Phiếu đang mở</span><strong>" << phieuMuons.size() << "</strong></article>"
         << "</div></section>";

    html << "<section class='grid' id='tailieu'><div class='panel'><div class='head'><h2>Kho tài liệu</h2>"
         << "<span class='count'>" << taiLieus.size() << " mục</span></div><div class='table-wrap'><table><thead><tr>"
         << "<th>Mã</th><th>Tên tài liệu</th><th>Loại</th><th>Số lượng</th><th>Chi tiết</th></tr></thead><tbody>";
    for (const auto &tl : taiLieus) {
        html << "<tr><td><strong>" << htmlEscape(tl->getMa()) << "</strong></td><td>"
             << htmlEscape(tl->getTen()) << "<br><span class='muted'>" << htmlEscape(tl->getTacGia())
             << " - " << htmlEscape(tl->getNhaXuatBan()) << "</span></td><td>" << htmlEscape(tl->getLoai())
             << "</td><td><span class='status " << (tl->getSoLuong() > 0 ? "ok" : "warn") << "'>"
             << tl->getSoLuong() << "</span></td><td>" << htmlEscape(tl->chiTiet()) << "</td></tr>";
    }
    html << "</tbody></table></div></div>";

    html << "<div class='panel'><div class='head'><h2>Thêm tài liệu</h2></div><form method='post' action='/add-document'>"
         << "<label>Loại tài liệu<select name='loai'>"
         << option("Giáo trình", "Giáo trình") << option("Sách tham khảo", "Sách tham khảo")
         << option("Sách khác", "Sách khác") << option("Báo/tạp chí", "Báo/tạp chí")
         << option("Bài nghiên cứu", "Bài nghiên cứu") << "</select></label>"
         << "<label>Mã tài liệu<input name='ma' required></label>"
         << "<label>Tên tài liệu<input name='ten' required></label><div class='form-grid'>"
         << "<label>Năm xuất bản<input name='nam' type='number' value='2026'></label>"
         << "<label>Số lượng<input name='soLuong' type='number' value='1' min='0'></label></div>"
         << "<label>Tác giả<input name='tacGia' required></label>"
         << "<label>Nhà xuất bản<input name='nhaXuatBan' required></label>"
         << "<label>Thể loại<input name='theLoai' required></label>"
         << "<div class='form-grid'><label>Môn học (Bộ môn)<input name='maMonHoc' placeholder='VD: Lập trình Hướng đối tượng (C++)'></label>"
         << "<label>Phân loại / Khoa<input name='boMon' placeholder='VD: Giáo trình Chuyên ngành'></label></div>"
         << "<label>Thể loại phụ (Dành cho Sách khác / Sách tham khảo / Báo / Nghiên cứu)<select name='loaiSachKhac'>"
         << option("Văn học / Tiểu thuyết", "Văn học / Tiểu thuyết")
         << option("Phát triển bản thân / Kỹ năng sống", "Phát triển bản thân / Kỹ năng sống")
         << option("Hồi ký / Tiểu sử", "Hồi ký / Tiểu sử")
         << option("Nghệ thuật / Đời sống", "Nghệ thuật / Đời sống")
         << option("Từ điển / Bách khoa toàn thư", "Từ điển / Bách khoa toàn thư")
         << option("Sách chuyên khảo", "Sách chuyên khảo")
         << option("Sách hướng dẫn / Thực hành", "Sách hướng dẫn / Thực hành")
         << option("Sách giải bài tập", "Sách giải bài tập")
         << option("Tạp chí Khoa học & Chuyên ngành", "Tạp chí Khoa học & Chuyên ngành")
         << option("Tạp chí Kinh tế / Xã hội", "Tạp chí Kinh tế / Xã hội")
         << option("Báo giấy thường nhật / Báo tuần", "Báo giấy thường nhật / Báo tuần")
         << option("Luận văn / Luận án", "Luận văn / Luận án")
         << option("Báo cáo khoa học / Đề tài NCKH", "Báo cáo khoa học / Đề tài NCKH")
         << option("Kỷ yếu hội thảo (Conference Proceedings)", "Kỷ yếu hội thảo (Conference Proceedings)")
         << option("Bài báo khoa học quốc tế", "Bài báo khoa học quốc tế")
         << option("Khác", "Khác") << "</select></label>"
          << "<div class='form-grid'><label>Số phát hành<input name='soPhatHanh' type='number' value='1'></label>"
          << "<label>Tháng phát hành<input name='thangPhatHanh' type='number' value='1'></label></div>"
          << "<div class='form-grid'><label>Cơ quan chủ quản<input name='coQuanChuQuan' placeholder='VD: HUTECH'></label>"
          << "<label>Lĩnh vực nghiên cứu<input name='linhVuc' placeholder='VD: Báo cáo khoa học / Đề tài NCKH'></label></div>"
          << "<button class='submit' type='submit'>Thêm tài liệu</button></form></div></section>";

    html << "<section class='grid' id='nguoidoc'><div class='panel'><div class='head'><h2>Danh sách người đọc</h2>"
         << "<span class='count'>" << nguoiDocs.size() << " người</span></div><div class='table-wrap'><table><thead><tr>"
         << "<th>Mã</th><th>Họ tên</th><th>Nhóm</th><th>Thẻ</th><th>Sách đang mượn</th></tr></thead><tbody>";
    for (const auto &nd : nguoiDocs) {
        bool conHan = Date::today() <= nd->getNgayHetHan();
        html << "<tr><td><strong>" << htmlEscape(nd->getMa()) << "</strong></td><td>" << htmlEscape(nd->getHoTen())
             << "<br><span class='muted'>" << htmlEscape(nd->getSoDienThoai()) << " - " << htmlEscape(nd->getDiaChi())
             << "</span></td><td>" << htmlEscape(nd->getNhom()) << "<br><span class='muted'>" << htmlEscape(nd->getMaDinhDanh())
             << "</span></td><td><span class='status " << (conHan ? "ok" : "bad") << "'>"
             << (conHan ? "Còn hạn" : "Hết hạn") << "</span></td><td>" << nd->getSoSachDangMuon()
             << "/" << nd->getGioiHanMuon() << "</td></tr>";
    }
    html << "</tbody></table></div></div><div class='panel'><div class='head'><h2>Thêm người đọc</h2></div>"
         << "<form method='post' action='/add-reader'><label>Nhóm người đọc<select name='nhom'>"
         << option("Sinh viên", "Sinh viên") << option("Viên chức", "Viên chức") << "</select></label>"
         << "<label>Mã người đọc<input name='ma' required></label><label>Họ tên<input name='hoTen' required></label>"
         << "<div class='form-grid'><label>Số điện thoại<input name='soDienThoai'></label>"
         << "<label>Ngày hết hạn<input name='ngayHetHan' type='date' value='2026-12-31'></label></div>"
         << "<label>Địa chỉ<input name='diaChi'></label><label>MSSV / MSCB<input name='maDinhDanh'></label>"
         << "<button class='submit' type='submit'>Thêm người đọc</button></form></div></section>";

    html << "<section class='grid two' id='muontra'><div class='panel'><div class='head'><h2>Mượn tài liệu</h2></div>"
         << "<form method='post' action='/borrow'><label>Người đọc<select name='maNguoiDoc'>";
    for (const auto &nd : nguoiDocs) {
        html << option(nd->getMa(), nd->getMa() + " - " + nd->getHoTen());
    }
    html << "</select></label><label>Tài liệu<select name='maTaiLieu'>";
    for (const auto &tl : taiLieus) {
        html << option(tl->getMa(), tl->getMa() + " - " + tl->getTen() + " (" + to_string(tl->getSoLuong()) + ")");
    }
    html << "</select></label><div class='form-grid'><label>Mã nhân viên<input name='maNhanVien' value='NV001'></label>"
         << "<label>Ngày mượn<input name='ngayMuon' type='date' value='" << Date::today().toISO() << "'></label></div>"
         << "<button class='submit' type='submit'>Ghi nhận mượn</button></form></div>";

    html << "<div class='panel'><div class='head'><h2>Trả tài liệu</h2></div><form method='post' action='/return'>"
         << "<label>Phiếu mượn<select name='maPhieu'>";
    for (const auto &phieu : phieuMuons) {
        html << option(phieu.maPhieu, phieu.maPhieu + " - " + phieu.maNguoiDoc + " / " + phieu.maTaiLieu);
    }
    html << "</select></label><div class='form-grid'><label>Mã nhân viên<input name='maNhanVien' value='NV001'></label>"
         << "<label>Ngày trả<input name='ngayTra' type='date' value='" << Date::today().toISO() << "'></label></div>"
         << "<button class='submit' type='submit'>Xác nhận trả</button></form></div></section>";

    html << "<section class='panel'><div class='head'><h2>Phiếu mượn đang mở</h2><span class='count'>"
         << phieuMuons.size() << " phiếu</span></div><div class='table-wrap'><table><thead><tr>"
         << "<th>Mã phiếu</th><th>Người đọc</th><th>Tài liệu</th><th>Ngày mượn</th><th>Hẹn trả</th><th>Trạng thái</th></tr></thead><tbody>";
    for (const auto &phieu : phieuMuons) {
        bool quaHan = phieu.ngayHenTra < Date::today();
        html << "<tr><td><strong>" << phieu.maPhieu << "</strong></td><td>" << htmlEscape(phieu.maNguoiDoc)
             << "</td><td>" << htmlEscape(phieu.maTaiLieu) << "</td><td>" << phieu.ngayMuon.toDisplay()
             << "</td><td>" << phieu.ngayHenTra.toDisplay() << "</td><td><span class='status "
             << (quaHan ? "bad" : "ok") << "'>" << (quaHan ? "Quá hạn" : "Đang mượn") << "</span></td></tr>";
    }
    if (phieuMuons.empty()) {
        html << "<tr><td colspan='6' class='muted'>Không có phiếu mượn đang mở.</td></tr>";
    }
    html << "</tbody></table></div></section>";

    html << "<section class='panel' id='giaodich'><div class='head'><h2>Lịch sử giao dịch</h2><span class='count'>"
         << giaoDichs.size() << " giao dịch</span></div><div class='table-wrap'><table><thead><tr>"
         << "<th>Mã</th><th>Loại</th><th>Ngày</th><th>Nhân viên</th><th>Nội dung</th><th>Phạt / Chi phí</th></tr></thead><tbody>";
    for (auto it = giaoDichs.rbegin(); it != giaoDichs.rend(); ++it) {
        html << "<tr><td><strong>" << it->getMa() << "</strong></td><td>" << htmlEscape(it->getLoai())
             << "</td><td>" << it->getNgay().toDisplay() << "</td><td>" << htmlEscape(it->getMaNhanVien())
             << "</td><td>" << htmlEscape(it->getNoiDung()) << "</td><td>"
             << static_cast<int>(it->getSoTien()) << " VND</td></tr>";
    }
    if (giaoDichs.empty()) {
        html << "<tr><td colspan='6' class='muted'>Chưa có giao dịch.</td></tr>";
    }
    html << "</tbody></table></div></section>";

    html << "<section class='oop' id='oop'><article class='panel'><span class='tag'>Trừu tượng</span><h2>Người</h2>"
         << "<p class='muted'>Người đọc được đóng gói thông tin và kiểm tra quyền mượn.</p><div class='tree'>Nguoi -> NguoiDoc</div></article>"
         << "<article class='panel'><span class='tag'>Kế thừa</span><h2>Tài liệu</h2><p class='muted'>Giáo trình, sách tham khảo, sách khác, báo/tạp chí, bài nghiên cứu.</p><div class='tree'>TaiLieu -> SachKhac</div></article>"
         << "<article class='panel'><span class='tag'>Đa hình</span><h2>Hạn mượn</h2><p class='muted'>Hàm tinhHanMuon() thay đổi theo người đọc và loại sách.</p><div class='tree'>virtual int tinhHanMuon()</div></article>"
         << "<article class='panel'><span class='tag'>Template</span><h2>DanhSach&lt;T&gt;</h2><p class='muted'>Dùng lại cấu trúc danh sách cho người đọc và tài liệu.</p><div class='tree'>them() - timTheoMa()</div></article></section>";

    html << "</main></div></body></html>";
    return html.str();
}

string redirectResponse() {
    return "HTTP/1.1 303 See Other\r\nLocation: /\r\nContent-Length: 0\r\n\r\n";
}

string htmlResponse(const string &html) {
    ostringstream response;
    response << "HTTP/1.1 200 OK\r\n"
             << "Content-Type: text/html; charset=utf-8\r\n"
             << "Content-Length: " << html.size() << "\r\n"
             << "Connection: close\r\n\r\n"
             << html;
    return response.str();
}

void sendAll(SOCKET client, const string &data) {
    const char *buffer = data.c_str();
    int remaining = static_cast<int>(data.size());
    while (remaining > 0) {
        int sent = send(client, buffer, remaining, 0);
        if (sent <= 0) {
            break;
        }
        buffer += sent;
        remaining -= sent;
    }
}

string readRequest(SOCKET client) {
    string request;
    char buffer[4096];
    int received = 0;
    do {
        received = recv(client, buffer, sizeof(buffer), 0);
        if (received > 0) {
            request.append(buffer, buffer + received);
        }
        if (request.find("\r\n\r\n") != string::npos) {
            size_t contentLengthPos = request.find("Content-Length:");
            if (contentLengthPos == string::npos) {
                break;
            }
            size_t lineEnd = request.find("\r\n", contentLengthPos);
            int contentLength = stoi(request.substr(contentLengthPos + 15, lineEnd - (contentLengthPos + 15)));
            size_t bodyStart = request.find("\r\n\r\n") + 4;
            if (request.size() >= bodyStart + static_cast<size_t>(contentLength)) {
                break;
            }
        }
    } while (received > 0);
    return request;
}

void handleClient(SOCKET client, LibrarySystem &system) {
    string request = readRequest(client);
    if (request.empty()) {
        closesocket(client);
        return;
    }

    string firstLine = request.substr(0, request.find("\r\n"));
    string method;
    string path;
    stringstream line(firstLine);
    line >> method >> path;

    string body;
    size_t bodyStart = request.find("\r\n\r\n");
    if (bodyStart != string::npos) {
        body = request.substr(bodyStart + 4);
    }

    if (method == "POST") {
        auto form = parseForm(body);
        if (path == "/add-reader") {
            system.themNguoiDoc(form);
        } else if (path == "/add-document") {
            system.themTaiLieu(form);
        } else if (path == "/borrow") {
            system.muonTaiLieu(form);
        } else if (path == "/return") {
            system.traTaiLieu(form);
        } else if (path == "/reset") {
            system.napDuLieuMau();
        }
        sendAll(client, redirectResponse());
    } else {
        sendAll(client, htmlResponse(renderPage(system)));
    }

    closesocket(client);
}

int main(int argc, char **argv) {
    int port = 8080;
    if (argc >= 2) {
        port = stoi(argv[1]);
    }

    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        cerr << "Khong the khoi tao Winsock.\n";
        return 1;
    }

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (serverSocket == INVALID_SOCKET) {
        cerr << "Khong the tao socket.\n";
        WSACleanup();
        return 1;
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    serverAddr.sin_port = htons(static_cast<u_short>(port));

    if (bind(serverSocket, reinterpret_cast<sockaddr *>(&serverAddr), sizeof(serverAddr)) == SOCKET_ERROR) {
        cerr << "Cong " << port << " dang duoc su dung. Hay chon cong khac.\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    if (listen(serverSocket, SOMAXCONN) == SOCKET_ERROR) {
        cerr << "Khong the lang nghe ket noi.\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    LibrarySystem system;
    cout << "Website C++ dang chay tai http://127.0.0.1:" << port << "\n";
    cout << "Nhan Ctrl+C de dung server.\n";

    while (true) {
        SOCKET client = accept(serverSocket, nullptr, nullptr);
        if (client == INVALID_SOCKET) {
            continue;
        }
        handleClient(client, system);
    }

    closesocket(serverSocket);
    WSACleanup();
    return 0;
}
