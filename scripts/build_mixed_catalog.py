import json
import random
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
INPUT_CATALOG = REPO_ROOT / "web" / "gutenberg-catalog.js"
OUTPUT_CATALOG = REPO_ROOT / "web" / "gutenberg-catalog.js"

# ----------------- DATA FOR GENERATOR -----------------

VIETNAMESE_FIRST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
VIETNAMESE_MIDDLE_NAMES = ["Văn", "Thị", "Hữu", "Đức", "Minh", "Thành", "Hải", "Quang", "Anh", "Hoài", "Khánh", "Xuân", "Mạnh", "Kim", "Ngọc", "Thu"]
VIETNAMESE_LAST_NAMES = ["Thảo", "Quốc", "Hải", "Trí", "Dũng", "Thịnh", "Hà", "Tâm", "Bằng", "Hoàng", "Nam", "Khải", "Phong", "Sơn", "Lâm", "Hương", "Anh", "Vy", "Trang", "Đông"]

ACADEMIC_TITLES = ["PGS. TS.", "GS. TS.", "TS.", "ThS.", "ThS. Kỹ sư", "Kỹ sư", "PGS. TS. Kỹ sư"]

FACULTY_SUBJECTS = {
    "CNTT": {
        "chuyen_nganh": ["Lập trình hướng đối tượng C++", "Cấu trúc dữ liệu và Giải thuật", "Cơ sở dữ liệu nâng cao", "Hệ điều hành Unix/Linux", "An toàn và Bảo mật thông tin", "Mạng máy tính và truyền thông", "Điện toán đám mây", "Phân tích và Thiết kế hệ thống", "Xử lý ảnh số", "Thiết kế giao diện người dùng UI/UX"],
        "dai_cuong": ["Giới thiệu về Tin học văn phòng", "Nhập môn Lập trình máy tính", "Toán rời rạc cho ngành CNTT", "Đại số tuyến tính ứng dụng", "Giới thiệu khoa học máy tính"],
        "ung_dung": ["Ứng dụng Trí tuệ nhân tạo (AI) trong Y tế", "Phát triển ứng dụng di động Android/iOS", "Công nghệ phần mềm ứng dụng", "Nhập môn Học máy và khai phá dữ liệu", "Hệ thống IoT và thiết bị thông minh"],
        "ngoai_ngu": ["Tiếng Anh chuyên ngành Công nghệ thông tin", "Thuật ngữ tiếng Anh trong tin học", "Kỹ năng đọc dịch tài liệu kỹ thuật CNTT"]
    },
    "Cơ khí": {
        "chuyen_nganh": ["Nguyên lý và Chi tiết máy", "Công nghệ chế tạo máy", "Cơ học ứng dụng trong kỹ thuật", "Kỹ thuật đo lường và Dung sai", "Thiết kế khuôn mẫu nhựa", "Công nghệ hàn và ghép nối kim loại", "Thủy lực và khí nén công nghiệp"],
        "dai_cuong": ["Vẽ kỹ thuật cơ khí cơ bản", "Hình học họa hình cho kỹ sư", "Vật lý kỹ thuật đại cương", "Cơ học lý thuyết"],
        "ung_dung": ["Ứng dụng CAD/CAM/CAE trong thiết kế cơ khí", "Thiết kế robot tự hành", "Điều khiển CNC và gia công tự động", "Tự động hóa quá trình sản xuất"],
        "ngoai_ngu": ["Tiếng Anh chuyên ngành Cơ khí chế tạo", "Kỹ năng đọc bản vẽ cơ khí bằng tiếng Anh"]
    },
    "Điện - Điện tử": {
        "chuyen_nganh": ["Lý thuyết mạch điện", "Kỹ thuật vi xử lý và vi điều khiển", "Điện tử công suất", "Hệ thống điều khiển tự động", "Cơ điện tử căn bản", "Kỹ thuật số và thiết kế logic", "Cảm biến và kỹ thuật đo lường", "Hệ thống cung cấp điện"],
        "dai_cuong": ["Nhập môn kỹ thuật điện", "Vật lý bán dẫn đại cương", "Toán chuyên ngành điện điện tử"],
        "ung_dung": ["Ứng dụng vi xử lý trong điều khiển thiết bị", "Hệ thống nhà thông minh thông qua IoT", "Ứng dụng năng lượng mặt trời trong công nghiệp", "Thiết kế mạch in tự động với Altium"],
        "ngoai_ngu": ["Tiếng Anh chuyên ngành Điện - Điện tử", "Đọc hiểu sơ đồ mạch điện bằng tiếng Anh"]
    },
    "Kinh tế": {
        "chuyen_nganh": ["Quản trị doanh nghiệp sản xuất", "Nguyên lý kế toán tài chính", "Kinh tế vi mô nâng cao", "Kinh tế vĩ mô cho nhà quản lý", "Quản trị chuỗi cung ứng toàn cầu", "Tài chính doanh nghiệp căn bản", "Kinh tế lượng ứng dụng", "Nghiên cứu thị trường và hành vi người dùng"],
        "dai_cuong": ["Nhập môn kinh tế học", "Xác suất thống kê trong kinh doanh", "Lịch sử các thuyết kinh tế", "Pháp luật đại cương trong kinh tế"],
        "ung_dung": ["Ứng dụng phân tích dữ liệu trong kinh doanh", "Thương mại điện tử và tiếp thị số (Digital Marketing)", "Hệ thống thông tin quản lý doanh nghiệp MIS"],
        "ngoai_ngu": ["Tiếng Anh thương mại căn bản", "Kỹ năng giao tiếp tiếng Anh trong kinh doanh", "Tiếng Anh chuyên ngành tài chính kế toán"]
    },
    "May thời trang": {
        "chuyen_nganh": ["Công nghệ may trang phục cơ bản", "Thiết kế rập và nhảy size trang phục", "Vật liệu dệt may và kiểm thử", "Quản lý chất lượng sản phẩm may công nghiệp", "Thiết kế thời trang ứng dụng", "Lịch sử trang phục thế giới và Việt Nam"],
        "dai_cuong": ["Vẽ mỹ thuật cơ bản trong thời trang", "Cơ sở tạo hình trang phục"],
        "ung_dung": ["Ứng dụng phần mềm Gerber/Optitex trong thiết kế may", "Công nghệ in nhuộm và hoàn tất vải hiện đại", "Sản xuất tinh gọn (Lean) trong ngành may"],
        "ngoai_ngu": ["Tiếng Anh chuyên ngành Dệt may - Thời trang", "Đọc dịch tài liệu hướng dẫn may bằng tiếng Anh"]
    },
    "Xây dựng": {
        "chuyen_nganh": ["Sức bền vật liệu xây dựng", "Cơ học đất và Nền móng công trình", "Kết cấu bê tông cốt thép", "Kết cấu thép", "Cơ học kết cấu công trình", "Quy hoạch và kiến trúc đô thị", "Trắc địa công trình xây dựng", "Kỹ thuật thi công xây dựng"],
        "dai_cuong": ["Vẽ kỹ thuật xây dựng", "Nhập môn vẽ CAD ngành xây dựng", "Vật liệu xây dựng đại cương"],
        "ung_dung": ["Ứng dụng công nghệ BIM trong quản lý dự án xây dựng", "Tính toán kết cấu công trình với SAP2000", "Thi công xây dựng công trình ngầm đô thị"],
        "ngoai_ngu": ["Tiếng Anh chuyên ngành Xây dựng công trình", "Kỹ năng đọc bản vẽ kiến trúc xây dựng tiếng Anh"]
    }
}

VIETNAMESE_PUBLISHERS = ["NXB Đại học Quốc gia TP.HCM", "NXB Giáo dục Việt Nam", "NXB Trẻ", "NXB Khoa học và Kỹ thuật", "NXB Kim Đồng", "NXB Hội Nhà Văn", "NXB Tổng hợp TP.HCM", "NXB Phụ Nữ", "NXB Chính trị Quốc gia Sự thật"]

RESEARCH_TOPICS = [
    "Nghiên cứu ứng dụng thuật toán học máy dự đoán hiệu năng động cơ",
    "Báo cáo đề tài khoa học cấp trường: Thiết kế robot tự hành tránh vật cản dùng LiDAR",
    "Luận văn thạc sĩ: Phân tích các yếu tố ảnh hưởng đến sự hài lòng của sinh viên HCMUTE",
    "Luận án tiến sĩ: Nghiên cứu phương pháp tối ưu hóa công suất lưới điện thông minh siêu nhỏ",
    "Nghiên cứu ứng dụng IoT giám sát nông nghiệp công nghệ cao tại Lâm Đồng",
    "Báo cáo đề tài khoa học: Chế tạo thiết bị hỗ trợ phục hồi chức năng tay",
    "Luận văn thạc sĩ: Xây dựng hệ thống quản lý thư viện tích hợp blockchain",
    "Luận án tiến sĩ: Nghiên cứu công nghệ may thông minh ứng dụng tự động hóa",
    "Nghiên cứu phát triển vật liệu polyme nanocomposite thân thiện với môi trường",
    "Báo cáo đề tài khoa học: Ứng dụng deep learning nhận diện biển số xe tại HCMUTE",
    "Luận văn thạc sĩ: Thiết kế hệ thống treo chủ động trên ô tô điện",
    "Luận án tiến sĩ: Tối ưu hóa chuỗi cung ứng xuất khẩu nông sản khu vực ĐBSCL"
]

CONFERENCE_NAMES = [
    "Kỷ yếu hội thảo Khoa học Giáo dục Kỹ thuật toàn quốc - HCMUTE",
    "Conference Proceedings: International Conference on Green Technology and Sustainable Development (GTSD)",
    "Kỷ yếu Hội nghị nghiên cứu khoa học sinh viên phân khoa Công nghệ",
    "Conference on Advanced Mechanical Engineering and Automation Proceedings"
]

JOURNAL_NAMES = [
    "Tạp chí Khoa học Giáo dục Kỹ thuật (Journal of Technical Education Science) - Số 82",
    "Tạp chí Khoa học Giáo dục Kỹ thuật (Journal of Technical Education Science) - Số 83",
    "Tạp chí Khoa học Giáo dục Kỹ thuật (Journal of Technical Education Science) - Số 84",
    "Tạp chí Phát triển Khoa học & Công nghệ - Đại học Quốc gia TP.HCM",
    "Bản tin Khoa học và Công nghệ HCMUTE - Quý 1 năm 2026",
    "Tạp chí Nghiên cứu Công nghệ và Đổi mới Sáng tạo kỹ thuật"
]

VIETNAMESE_CLASSICS = [
    ("Truyện Kiều", "Nguyễn Du", "Văn học cổ điển Việt Nam", "Văn học / Tiểu thuyết"),
    ("Lão Hạc", "Nam Cao", "Tuyển tập truyện ngắn hiện thực", "Văn học / Tiểu thuyết"),
    ("Chí Phèo", "Nam Cao", "Tuyển tập văn học hiện thực phê phán", "Văn học / Tiểu thuyết"),
    ("Tắt đèn", "Ngô Tất Tố", "Tiểu thuyết hiện thực phê phán Việt Nam", "Văn học / Tiểu thuyết"),
    ("Số đỏ", "Vũ Trọng Phụng", "Tiểu thuyết trào phúng nổi tiếng", "Văn học / Tiểu thuyết"),
    ("Dế Mèn phiêu lưu ký", "Tô Hoài", "Truyện thiếu nhi kinh điển Việt Nam", "Văn học / Tiểu thuyết"),
    ("Đất rừng phương Nam", "Đoàn Giỏi", "Truyện ký về miền Nam bộ", "Văn học / Tiểu thuyết"),
    ("Kính vạn hoa", "Nguyễn Nhật Ánh", "Truyện dài học trò nhiều tập", "Văn học / Tiểu thuyết"),
    ("Cho tôi xin một vé đi tuổi thơ", "Nguyễn Nhật Ánh", "Truyện dài về thời niên thiếu", "Văn học / Tiểu thuyết"),
    ("Mắt biếc", "Nguyễn Nhật Ánh", "Tiểu thuyết lãng mạn Việt Nam", "Văn học / Tiểu thuyết"),
    ("Cánh đồng bất tận", "Nguyễn Ngọc Tư", "Tuyển tập truyện ngắn Nam Bộ", "Văn học / Tiểu thuyết"),
    ("Nỗi buồn chiến tranh", "Bảo Ninh", "Tiểu thuyết chiến tranh Việt Nam", "Văn học / Tiểu thuyết"),
    ("Bỉ vỏ", "Nguyên Hồng", "Tiểu thuyết hiện thực xã hội", "Văn học / Tiểu thuyết"),
    ("Vợ nhặt", "Kim Lân", "Truyện ngắn nạn đói năm 1945", "Văn học / Tiểu thuyết"),
    ("Chiếc thuyền ngoài xa", "Nguyễn Minh Châu", "Tuyển tập truyện ngắn sau chiến tranh", "Văn học / Tiểu thuyết")
]

VIETNAMESE_NON_FICTION = [
    ("Hồi ký chiến trường: Đường vào Dinh Độc Lập", "Trần Văn Bản", "Hồi ký chiến tranh lịch sử", "Hồi ký / Tiểu sử"),
    ("Tiểu sử cuộc đời Đại tướng Võ Nguyên Giáp", "Nhóm tác giả lịch sử", "Tiểu sử nhân vật quân sự vĩ đại", "Hồi ký / Tiểu sử"),
    ("Hồi ký của một nhà báo kỹ thuật", "Lê Văn Chí", "Hồi ký cuộc đời và sự nghiệp", "Hồi ký / Tiểu sử"),
    ("Nghệ thuật ẩm thực ba miền Việt Nam", "Nguyễn Thị Kim", "Sách dạy nấu ăn truyền thống", "Nghệ thuật / Đời sống"),
    ("Sổ tay cắm hoa và trang trí nhà cửa", "Phan Hoàng Yến", "Hướng dẫn cắm hoa nghệ thuật", "Nghệ thuật / Đời sống"),
    ("Kỹ thuật nhiếp ảnh phong cảnh và chân dung", "Trần Thế", "Sách hướng dẫn chụp ảnh nghệ thuật", "Nghệ thuật / Đời sống"),
    ("Bí quyết giao tiếp thông minh và đắc nhân tâm", "Nguyễn Hữu Trí", "Kỹ năng sống và nghệ thuật ứng xử", "Phát triển bản thân / Kỹ năng sống"),
    ("Hạt giống tâm hồn: Nuôi dưỡng lòng dũng cảm", "Nhiều dịch giả", "Sách hạt giống tâm hồn nuôi dưỡng tâm trí", "Phát triển bản thân / Kỹ năng sống"),
    ("Quản lý thời gian hiệu quả cho người bận rộn", "Phạm Hải", "Sách phát triển kỹ năng làm việc", "Phát triển bản thân / Kỹ năng sống")
]

# ----------------- HELPER GENERATORS -----------------

def gen_vietnamese_name(is_academic=False):
    first = random.choice(VIETNAMESE_FIRST_NAMES)
    middle = random.choice(VIETNAMESE_MIDDLE_NAMES)
    last = random.choice(VIETNAMESE_LAST_NAMES)
    name = f"{first} {middle} {last}"
    if is_academic and random.random() < 0.8:
        title = random.choice(ACADEMIC_TITLES)
        return f"{title} {name}"
    return name

# ----------------- MAIN SCRIPT -----------------

def main():
    print("Step 1: Reading existing English books from current gutenberg-catalog.js...")
    english_books = []
    if INPUT_CATALOG.exists():
        try:
            content = INPUT_CATALOG.read_text(encoding="utf-8")
            # Strip window.GUTENBERG_CATALOG = 
            json_str = content.strip()
            if json_str.startswith("window.GUTENBERG_CATALOG ="):
                json_str = json_str[len("window.GUTENBERG_CATALOG ="):]
            if json_str.endswith(";"):
                json_str = json_str[:-1]
            existing_books = json.loads(json_str.strip())
            
            # Find the actual English books in the file
            for book in existing_books:
                # Gutenberg books typically have publisher = "Project Gutenberg"
                if book.get("publisher") == "Project Gutenberg" or book.get("category") == "English public domain":
                    english_books.append(book)
            print(f"Loaded {len(english_books)} Gutenberg books from existing file.")
        except Exception as e:
            print(f"Error reading existing catalog: {e}. Will mock English books.")

    # If we couldn't load enough English books, we mock them
    if len(english_books) < 1000:
        print("Mocking English books because existing catalog didn't have enough.")
        mock_en_titles = [
            ("A Study in Scarlet", "Doyle, Arthur Conan", "Sherlock Holmes", "Truyện"),
            ("Pride and Prejudice", "Austen, Jane", "English classic novel", "Văn học"),
            ("The Great Gatsby", "Fitzgerald, F. Scott", "American classic novel", "Văn học"),
            ("Alice's Adventures in Wonderland", "Carroll, Lewis", "Children's fantasy story", "Truyện"),
            ("The Adventures of Tom Sawyer", "Twain, Mark", "Adventure fiction story", "Truyện"),
            ("Romeo and Juliet", "Shakespeare, William", "Classic tragedy drama play", "Văn học"),
            ("Principles of Economics", "Marshall, Alfred", "Economics textbook foundation", "Khoa học phổ thông"),
            ("Elements of Calculus", "Smyth, William", "Mathematics algebra course textbook", "Khoa học phổ thông"),
            ("English Grammar Manual", "Nesfield, John C.", "English language vocabulary handbook", "Ngoại ngữ"),
            ("Pocket Guide to Astronomy", "Lockyer, Norman", "Science handbook about stars", "Khoa học phổ thông")
        ]
        
        while len(english_books) < 1000:
            title, author, tags, loai = random.choice(mock_en_titles)
            num = len(english_books) + 1
            english_books.append({
                "id": f"TVS{9000 + num:05d}",
                "title": f"{title} (Vol. {num // 10 + 1})",
                "kind": "Sách khác",
                "year": random.choice([2020, 2021, 2022, 2023, 2024, 2025, 2026]),
                "quantity": random.randint(3, 15),
                "author": author,
                "publisher": "Project Gutenberg",
                "category": "English public domain",
                "coverImage": "",
                "fileUrl": "",
                "fileName": "",
                "extra": {
                    "loaiSachKhac": loai,
                    "nguon": "Project Gutenberg public domain metadata",
                    "gutenbergId": f"{10000 + num}",
                    "docTruoc": f"Mô tả/chủ đề: English book about {tags}. Category: {loai}."
                }
            })

    # Cut to exactly 1000 English books
    english_books = english_books[:1000]
    # Update IDs to make them TVS09001 to TVS10000
    for i, book in enumerate(english_books):
        book["id"] = f"TVS{9001 + i:05d}"
        book["publisher"] = "Project Gutenberg"
        book["category"] = "English public domain"
        if "nguon" not in book.get("extra", {}):
            book["extra"] = book.get("extra", {})
        book["extra"]["nguon"] = "Project Gutenberg"

    print(f"Prepared {len(english_books)} English books.")

    # ----------------- GENERATING 5000 HCMUTE DIGITAL LIBRARY BOOKS -----------------
    print("Step 2: Generating 5000 HCMUTE Digital Library books...")
    hcmute_books = []

    # Target distributions:
    # 2500 Textbooks (Giáo trình)
    # 1000 References (Sách tham khảo)
    # 1000 Research (Bài nghiên cứu)
    # 500 Magazines (Báo/tạp chí)

    faculty_list = list(FACULTY_SUBJECTS.keys())

    # 1. 2500 Textbooks (Giáo trình)
    for i in range(2500):
        fac = random.choice(faculty_list)
        sub_type = random.choice(["chuyen_nganh", "dai_cuong", "ung_dung", "ngoai_ngu"])
        subj = random.choice(FACULTY_SUBJECTS[fac][sub_type])
        
        # Format title based on type to trigger correct classification in app.js
        title_prefix = "Giáo trình" if sub_type != "ngoai_ngu" else "Giáo trình Ngoại ngữ"
        if "Giáo trình" not in subj:
            title = f"{title_prefix} {subj}"
        else:
            title = subj
            
        author = gen_vietnamese_name(is_academic=True)
        pub = random.choice(["NXB Đại học Quốc gia TP.HCM", "NXB Giáo dục Việt Nam", "Thư viện số HCMUTE"])
        
        book_id = f"TVS{1 + len(hcmute_books):05d}"
        
        hcmute_books.append({
            "id": book_id,
            "title": title,
            "kind": "Giáo trình",
            "year": random.choice([2021, 2022, 2023, 2024, 2025, 2026]),
            "quantity": random.randint(5, 25),
            "author": author,
            "publisher": pub,
            "category": f"Giáo trình {fac}",
            "coverImage": "",
            "fileUrl": f"https://thuvienso.hcmute.edu.vn/doc-truoc/pdf/{book_id}.pdf",
            "fileName": "Mở nguồn",
            "extra": {
                "boMon": f"Bộ môn {fac}",
                "maMonHoc": f"LH-{random.randint(1000, 9999)}",
                "nguon": "Thư viện số HCMUTE",
                "docTruoc": f"Đọc trước tóm tắt giáo trình {title} giảng dạy tại khoa {fac} trường Đại học Sư phạm Kỹ thuật TP.HCM."
            }
        })

    # 2. 1000 Reference Books (Sách tham khảo)
    ref_subtypes = [
        ("Sách giải bài tập", ["giai bai tap", "giai nhanh", "huong dan giai"]),
        ("Từ điển / Bách khoa toàn thư", ["tu dien", "bach khoa", "tra cuu"]),
        ("Sách hướng dẫn / Thực hành", ["huong dan thuc hanh", "so tay thuc hanh", "cam nang"]),
        ("Sách chuyên khảo", ["chuyen khao", "nghien cuu chuyen sau"])
    ]

    for i in range(1000):
        fac = random.choice(faculty_list)
        sub_label, keywords = random.choice(ref_subtypes)
        kw = random.choice(keywords)
        
        # e.g., "Sổ tay thực hành Lập trình hướng đối tượng C++"
        fac_subj = random.choice(FACULTY_SUBJECTS[fac]["chuyen_nganh"])
        title = f"{kw.capitalize()} {fac_subj.replace('Giáo trình ', '')}"
        
        author = gen_vietnamese_name(is_academic=True)
        pub = random.choice(["NXB Khoa học và Kỹ thuật", "NXB Trẻ", "Thư viện số HCMUTE"])
        
        book_id = f"TVS{1 + len(hcmute_books):05d}"
        
        hcmute_books.append({
            "id": book_id,
            "title": title,
            "kind": "Sách tham khảo",
            "year": random.choice([2020, 2021, 2022, 2023, 2024, 2025, 2026]),
            "quantity": random.randint(2, 12),
            "author": author,
            "publisher": pub,
            "category": "Sách tham khảo kỹ thuật",
            "coverImage": "",
            "fileUrl": f"https://thuvienso.hcmute.edu.vn/doc-truoc/pdf/{book_id}.pdf",
            "fileName": "Mở nguồn",
            "extra": {
                "referenceSubtype": sub_label,
                "boMon": f"Bộ môn {fac}",
                "nguon": "Thư viện số HCMUTE",
                "docTruoc": f"Tài liệu tham khảo chuyên ngành {fac} - {title}. Thích hợp làm tài liệu tra cứu bổ sung."
            }
        })

    # 3. 1000 Research Papers/Theses (Bài nghiên cứu)
    research_subtypes = [
        ("Báo cáo khoa học / Đề tài NCKH", "bao cao de tai", ["Đề tài NCKH cấp trường", "Báo cáo khoa học"]),
        ("Kỷ yếu hội thảo (Conference Proceedings)", "proceedings", ["Kỷ yếu hội thảo"]),
        ("Bài báo khoa học quốc tế", "quoc te", ["Bài báo khoa học quốc tế", "Nghiên cứu quốc tế"]),
        ("Luận văn / Luận án", "luan van", ["Luận văn thạc sĩ", "Luận án tiến sĩ"])
    ]

    for i in range(1000):
        sub_label, trigger, prefixes = random.choice(research_subtypes)
        prefix = random.choice(prefixes)
        
        fac = random.choice(faculty_list)
        topic_base = random.choice(FACULTY_SUBJECTS[fac]["chuyen_nganh"] + FACULTY_SUBJECTS[fac]["ung_dung"])
        topic_base = topic_base.replace("Giáo trình ", "").replace("Lập trình ", "")
        
        title = f"{prefix}: {random.choice(['Nghiên cứu', 'Thiết kế', 'Tối ưu hóa', 'Phát triển'])} {topic_base.lower()}"
        author = gen_vietnamese_name(is_academic=True)
        pub = "Trường Đại học Sư phạm Kỹ thuật TP.HCM" if sub_label != "Bài báo khoa học quốc tế" else "IEEE / Springer Publisher"
        
        book_id = f"TVS{1 + len(hcmute_books):05d}"
        
        hcmute_books.append({
            "id": book_id,
            "title": title,
            "kind": "Bài nghiên cứu",
            "year": random.choice([2022, 2023, 2024, 2025, 2026]),
            "quantity": random.randint(1, 5),
            "author": author,
            "publisher": pub,
            "category": "Bài báo & Đề tài NCKH",
            "coverImage": "",
            "fileUrl": f"https://thuvienso.hcmute.edu.vn/doc-truoc/pdf/{book_id}.pdf",
            "fileName": "Mở nguồn",
            "extra": {
                "researchSubtype": sub_label,
                "coQuanChuQuan": pub,
                "linhVuc": f"Kỹ thuật {fac}",
                "nguon": "Thư viện số HCMUTE",
                "docTruoc": f"Đề tài nghiên cứu khoa học thuộc khoa {fac} HCMUTE. Tiêu đề: {title}."
            }
        })

    # 4. 500 Magazines/Journals (Báo/tạp chí)
    for i in range(500):
        book_id = f"TVS{1 + len(hcmute_books):05d}"
        
        if random.random() < 0.4:
            title = f"Bản tin nội bộ HCMUTE - Số {random.randint(1, 12)} năm {random.choice([2024, 2025, 2026])}"
            subtype = "Báo giấy thường nhật / Báo tuần"
            category = "Báo tuần"
            pub = "Đại học Sư phạm Kỹ thuật TP.HCM"
        else:
            title = f"Tạp chí Khoa học Giáo dục Kỹ thuật (JTES) - Số {random.randint(150, 200)}/2026"
            subtype = "Tạp chí Khoa học & Chuyên ngành"
            category = "Tạp chí khoa học"
            pub = "Trường Đại học Sư phạm Kỹ thuật TP.HCM"
            
        hcmute_books.append({
            "id": book_id,
            "title": title,
            "kind": "Báo/tạp chí",
            "year": 2026,
            "quantity": random.randint(3, 10),
            "author": "Hội đồng biên tập HCMUTE",
            "publisher": pub,
            "category": category,
            "coverImage": "",
            "fileUrl": f"https://thuvienso.hcmute.edu.vn/doc-truoc/pdf/{book_id}.pdf",
            "fileName": "Mở nguồn",
            "extra": {
                "magazineSubtype": subtype,
                "soPhatHanh": random.randint(1, 12),
                "thangPhatHanh": random.randint(1, 12),
                "nguon": "Thư viện số HCMUTE",
                "docTruoc": f"Ấn bản {title} phân phối chính thức tại thư viện số Đại học Sư phạm Kỹ thuật TP.HCM."
            }
        })

    print(f"Generated {len(hcmute_books)} HCMUTE books successfully.")

    # ----------------- GENERATING 4000 VIETNAMESE INTERNET BOOKS -----------------
    print("Step 3: Generating 4000 Vietnamese books from the internet...")
    vn_books = []

    # Distribution:
    # 3000 Sách khác (Văn học, Kỹ năng sống, Nghệ thuật, Hồi ký)
    # 500 Sách tham khảo (Giải bài tập, Học tốt phổ thông, từ điển)
    # 500 Báo/tạp chí (Báo Tuổi Trẻ, Thanh Niên, Tạp chí Kinh tế...)

    sub_labels = [
        "Văn học / Tiểu thuyết",
        "Phát triển bản thân / Kỹ năng sống",
        "Hồi ký / Tiểu sử",
        "Nghệ thuật / Đời sống"
    ]

    for i in range(3000):
        subtype = random.choice(sub_labels)
        book_id = f"TVS{5001 + len(vn_books):05d}"
        
        if subtype == "Văn học / Tiểu thuyết":
            if random.random() < 0.2 and len(VIETNAMESE_CLASSICS) > 0:
                base_title, base_author, desc, _ = random.choice(VIETNAMESE_CLASSICS)
                title = f"{base_title} - Tuyển tập chọn lọc" if random.random() < 0.5 else base_title
                author = base_author
            else:
                title = f"Tuyển tập {random.choice(['truyện ngắn', 'thơ ca', 'tiểu thuyết', 'ký sự'])} Việt Nam hiện đại"
                author = gen_vietnamese_name()
                desc = "Tác phẩm văn học nổi tiếng trên văn đàn Việt Nam"
                
            pub = random.choice(["NXB Văn Học", "NXB Trẻ", "NXB Hội Nhà Văn"])
            
        elif subtype == "Phát triển bản thân / Kỹ năng sống":
            if random.random() < 0.3:
                base_title, base_author, desc, _ = random.choice([x for x in VIETNAMESE_NON_FICTION if x[3] == subtype])
                title = base_title
                author = base_author
            else:
                skills = ["Quản lý tài chính cá nhân", "Tư duy phản biện", "Kỹ năng thuyết trình trước đám đông", "Nghệ thuật đàm phán thành công", "Xây dựng sự tự tin và lòng kiêu hãnh", "Phương pháp tự học hiệu quả"]
                title = f"Bí quyết {random.choice(skills).lower()} - Hành trình đến thành công"
                author = gen_vietnamese_name()
                desc = "Sách hướng dẫn phát triển kỹ năng mềm bản thân"
                
            pub = random.choice(["NXB Trẻ", "NXB Tổng hợp TP.HCM", "NXB Phụ Nữ"])
            
        elif subtype == "Hồi ký / Tiểu sử":
            if random.random() < 0.3:
                base_title, base_author, desc, _ = random.choice([x for x in VIETNAMESE_NON_FICTION if x[3] == subtype])
                title = base_title
                author = base_author
            else:
                figures = ["nhân vật lịch sử Việt Nam", "doanh nhân công nghệ nổi tiếng", "nhà khoa học vĩ đại thế giới", "các thế hệ thủ thư Việt Nam"]
                title = f"Hồi ký và cuộc đời của {random.choice(figures)}"
                author = gen_vietnamese_name()
                desc = "Sách hồi ký lịch sử danh nhân"
                
            pub = random.choice(["NXB Chính trị Quốc gia Sự thật", "NXB Tổng hợp TP.HCM"])
            
        else: # Nghệ thuật / Đời sống
            if random.random() < 0.3:
                base_title, base_author, desc, _ = random.choice([x for x in VIETNAMESE_NON_FICTION if x[3] == subtype])
                title = base_title
                author = base_author
            else:
                lifes = ["Ẩm thực truyền thống Việt Nam", "Kỹ thuật cắm hoa hiện đại", "Cẩm nang làm vườn và trồng hoa cảnh", "Kiến trúc và thiết kế nhà ở nông thôn Việt Nam"]
                title = f"Hướng dẫn {random.choice(lifes).lower()}"
                author = gen_vietnamese_name()
                desc = "Sách hướng dẫn nghệ thuật đời sống"
                
            pub = random.choice(["NXB Mỹ Thuật", "NXB Trẻ", "NXB Phụ Nữ"])

        vn_books.append({
            "id": book_id,
            "title": title,
            "kind": "Sách khác",
            "year": random.choice([2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]),
            "quantity": random.randint(4, 15),
            "author": author,
            "publisher": pub,
            "category": subtype,
            "coverImage": "",
            "fileUrl": f"https://sachonline.com.vn/doc-truoc/{book_id}",
            "fileName": "Mở nguồn",
            "extra": {
                "loaiSachKhac": subtype,
                "nguon": "Sách tiếng Việt internet",
                "docTruoc": f"Đọc thử tác phẩm '{title}' của tác giả {author}. Bản điện tử sưu tầm trên internet."
            }
        })

    # 2. 500 Reference Books (Sách tham khảo)
    school_subjects = ["Toán học", "Ngữ văn", "Vật lý", "Hóa học", "Tiếng Anh", "Lịch sử", "Địa lý", "Sinh học"]
    school_grades = ["lớp 10", "lớp 11", "lớp 12", "ôn thi THPT Quốc gia"]

    for i in range(500):
        book_id = f"TVS{5001 + len(vn_books):05d}"
        
        ref_type = random.choice(["Sách giải bài tập", "Sách hướng dẫn / Thực hành", "Từ điển / Bách khoa toàn thư"])
        
        if ref_type == "Từ điển / Bách khoa toàn thư":
            langs = ["Việt - Anh", "Anh - Việt", "Việt - Trung", "Việt - Nhật", "Tiếng Việt thông dụng"]
            title = f"Từ điển {random.choice(langs)} bỏ túi cho học sinh sinh viên"
            author = "Nhóm biên soạn Từ điển ngôn ngữ"
        else:
            subj = random.choice(school_subjects)
            grade = random.choice(school_grades)
            prefix = "Giải nhanh bài tập" if ref_type == "Sách giải bài tập" else "Cẩm nang học tốt và ôn luyện"
            title = f"{prefix} môn {subj} {grade}"
            author = f"Thầy {gen_vietnamese_name()}"
            
        vn_books.append({
            "id": book_id,
            "title": title,
            "kind": "Sách tham khảo",
            "year": random.choice([2022, 2023, 2024, 2025, 2026]),
            "quantity": random.randint(5, 20),
            "author": author,
            "publisher": "NXB Giáo dục Việt Nam",
            "category": "Sách tham khảo phổ thông",
            "coverImage": "",
            "fileUrl": f"https://sachonline.com.vn/doc-truoc/{book_id}",
            "fileName": "Mở nguồn",
            "extra": {
                "referenceSubtype": ref_type,
                "nguon": "Sách tiếng Việt internet",
                "docTruoc": f"Tài liệu tham khảo '{title}' phục vụ học tập và ôn thi cho học sinh trung học phổ thông."
            }
        })

    # 3. 500 Magazines/Newspapers (Báo/tạp chí)
    mag_names = [
        ("Báo Tuổi Trẻ", "Báo giấy thường nhật / Báo tuần"),
        ("Báo Thanh Niên", "Báo giấy thường nhật / Báo tuần"),
        ("Tạp chí Hoa Học Trò", "Báo giấy thường nhật / Báo tuần"),
        ("Tạp chí Kinh tế Sài Gòn", "Tạp chí Kinh tế / Xã hội"),
        ("Tạp chí Tia Sáng", "Tạp chí Khoa học & Chuyên ngành"),
        ("Tạp chí Đẹp", "Báo giấy thường nhật / Báo tuần")
    ]

    for i in range(500):
        book_id = f"TVS{5001 + len(vn_books):05d}"
        mag_base, subtype = random.choice(mag_names)
        
        issue_no = random.randint(100, 1000)
        title = f"{mag_base} - Số phát hành {issue_no} năm 2026"
        
        vn_books.append({
            "id": book_id,
            "title": title,
            "kind": "Báo/tạp chí",
            "year": 2026,
            "quantity": random.randint(5, 15),
            "author": f"Ban biên tập {mag_base}",
            "publisher": f"Tòa soạn {mag_base}",
            "category": mag_base,
            "coverImage": "",
            "fileUrl": f"https://sachonline.com.vn/doc-truoc/{book_id}",
            "fileName": "Mở nguồn",
            "extra": {
                "magazineSubtype": subtype,
                "soPhatHanh": issue_no % 100 + 1,
                "thangPhatHanh": random.randint(1, 12),
                "nguon": "Sách tiếng Việt internet",
                "docTruoc": f"Báo phát hành định kỳ '{title}'. Phân phối chính thức trên các sạp báo toàn quốc."
            }
        })

    print(f"Generated {len(vn_books)} Vietnamese internet books successfully.")

    # ----------------- COMBINING ALL -----------------
    print("Step 4: Combining catalogs...")
    full_catalog = hcmute_books + vn_books + english_books

    print(f"Total books in mixed catalog: {len(full_catalog)}")
    assert len(full_catalog) == 10000, f"Catalog length is {len(full_catalog)}, must be 10000"

    print("Step 5: Writing mixed catalog to gutenberg-catalog.js...")
    content = (
        "/* Generated by scripts/build_mixed_catalog.py representing mixed library data. */\n"
        f"window.GUTENBERG_CATALOG = {json.dumps(full_catalog, ensure_ascii=False, separators=(',', ':'))};\n"
    )
    OUTPUT_CATALOG.write_text(content, encoding="utf-8")
    print(f"Successfully wrote mixed catalog to {OUTPUT_CATALOG}")

    # Stat kinds in catalog
    counts = {}
    sources = {}
    for item in full_catalog:
        k = item["kind"]
        counts[k] = counts.get(k, 0) + 1
        src = item["extra"]["nguon"]
        sources[src] = sources.get(src, 0) + 1
        
    print("\nKind distributions:")
    print(json.dumps(counts, ensure_ascii=True, indent=2))
    print("\nSource distributions:")
    print(json.dumps(sources, ensure_ascii=True, indent=2))

if __name__ == "__main__":
    main()
