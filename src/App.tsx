import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  Search,
  BookOpen,
  MapPin,
  Calendar,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Download,
  Volume2,
  VolumeX,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Compass,
  Users,
  Music,
  Landmark,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Menu,
  Filter,
  X,
  Send,
  HelpCircle,
  Clock,
  EyeOff,
  Award,
  Layers
} from 'lucide-react';

// ============================================================================
// 1. KIỂU DỮ LIỆU CHUẨN (16 TRƯỜNG THEO MỐC M2 & PHỤ LỤC 03, 04, 08)
// ============================================================================
export interface HeritageRecord {
  id: string;
  ma_tu_lieu: string;
  ten_tu_lieu: string;
  phan_loai_noi_dung:
    | 'Thông tin về di sản'
    | 'Địa điểm sinh hoạt cộng đồng'
    | 'Hoạt động văn hoá - nghi lễ'
    | 'Hình ảnh tư liệu & hiện vật'
    | 'Bài viết chuyên môn';
  loai_tu_lieu: string;
  ten_theo_danh_muc: string;
  ten_goi_ban_dia: string;
  loai_hinh_di_san: string;
  vung_van_hoa: string;
  dan_toc_cong_dong: string;
  dia_danh_hien_nay: string;
  dia_danh_thoi_diem_tu_lieu: string;
  mo_ta: string;
  boi_canh_thu_thap: string;
  nguoi_cung_cap: string;
  pham_vi_su_dung: string;
  phan_khong_cong_bo: string;
  nguon_tu_lieu: string;
  nguon_kiem_chung_chi_tiet: {
    ma_nguon: string;
    ten_nguon: string;
    url: string;
    doi_chieu: string;
  }[];
  diem_chua_ro?: string;
}

export interface OfficialSource {
  ma_nguon: string;
  ten_nguon: string;
  co_quan_tac_gia: string;
  loai_nguon: 'Chính thống' | 'Chính thống / Học thuật' | 'Tham khảo chuyên khảo';
  cong_dong_dia_ban: string;
  noi_dung_trich_xuat: string;
  url: string;
  ngay_truy_cap: string;
  doi_chieu: string;
}

// ============================================================================
// 2. DANH MỤC 7 NGUỒN TƯ LIỆU KIỂM CHỨNG (TRONG ĐÓ 5 NGUỒN CHÍNH THỐNG)
// ============================================================================
export const NGUON_TU_LIEU_DATA: OfficialSource[] = [
  {
    ma_nguon: 'NG-01',
    ten_nguon: 'Quyết định số 1852/QĐ-BVHTTDL ngày 08/5/2017 về việc công bố Danh mục di sản văn hoá phi vật thể quốc gia',
    co_quan_tac_gia: 'Bộ Văn hoá, Thể thao và Du lịch',
    loai_nguon: 'Chính thống',
    cong_dong_dia_ban: 'Người Chăm tại TP. Phan Rang - Tháp Chàm, huyện Ninh Phước, huyện Thuận Bắc, huyện Thuận Nam, tỉnh Ninh Thuận (cũ) - nay thuộc tỉnh Khánh Hoà',
    noi_dung_trich_xuat: 'Căn cứ pháp lý ghi danh chính thức "Lễ hội Katê của người Chăm" vào Danh mục di sản văn hoá phi vật thể quốc gia (loại hình Lễ hội truyền thống).',
    url: 'https://bvhttdl.gov.vn',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với cơ sở dữ liệu Cục Di sản văn hoá (NG-02)'
  },
  {
    ma_nguon: 'NG-02',
    ten_nguon: 'Hồ sơ Di sản văn hoá phi vật thể quốc gia: Lễ hội Katê của người Chăm & Hồ sơ Di tích quốc gia đặc biệt Tháp Pô Klong Garai (Quyết định 2499/QĐ-TTg)',
    co_quan_tac_gia: 'Cục Di sản văn hoá - Bộ Văn hoá, Thể thao và Du lịch',
    loai_nguon: 'Chính thống',
    cong_dong_dia_ban: 'Cộng đồng người Chăm (nhóm Chăm Ahier) và người Raglai tại Ninh Thuận (nay thuộc tỉnh Khánh Hoà)',
    noi_dung_trich_xuat: 'Mô tả chi tiết không gian 3 đền tháp (Pô Klong Garai, Pô Rômê, Pô Inư Nưgar), trình tự 4 bước nghi lễ (rước y trang, mở cửa tháp, tắm tượng thần, đại lễ Adaoh yang) và bộ ảnh tư liệu gốc.',
    url: 'http://dsvh.gov.vn',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với Quyết định 1852/QĐ-BVHTTDL (NG-01) và Bảo tàng Dân tộc học (NG-05)'
  },
  {
    ma_nguon: 'NG-03',
    ten_nguon: 'Luật Di sản văn hoá số 45/2024/QH15 (hiệu lực 01/7/2025), Nghị định 308/2025/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15',
    co_quan_tac_gia: 'Quốc hội & Chính phủ nước CHXHCN Việt Nam',
    loai_nguon: 'Chính thống',
    cong_dong_dia_ban: 'Áp dụng toàn quốc cho chủ thể di sản văn hoá phi vật thể và đơn vị hành chính hai cấp sau 01/7/2025',
    noi_dung_trich_xuat: 'Chuẩn phân loại 6 loại hình di sản (Điều 10), quyền của cộng đồng chủ thể (Điều 6), các hành vi nghiêm cấm (Điều 9) và quy định bảo vệ dữ liệu cá nhân của nghệ nhân/chức sắc.',
    url: 'https://vanban.chinhphu.vn',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với Công báo Chính phủ (congbao.chinhphu.vn)'
  },
  {
    ma_nguon: 'NG-04',
    ten_nguon: 'Hồ sơ ghi danh UNESCO: Nghệ thuật làm gốm của người Chăm (Art of pottery-making of Cham people - Ghi danh năm 2022 vào Danh sách cần bảo vệ khẩn cấp)',
    co_quan_tac_gia: 'UNESCO Intangible Cultural Heritage & Bộ VHTTDL Việt Nam',
    loai_nguon: 'Chính thống',
    cong_dong_dia_ban: 'Cộng đồng người Chăm tại làng Bàu Trúc (Palei Hamu Craok), thị trấn Phước Dân, huyện Ninh Phước, tỉnh Ninh Thuận (cũ)',
    noi_dung_trich_xuat: 'Tư liệu kiểm chứng về vật phẩm gốm nghi lễ (chén đựng nước thánh, lư trầm Klong trầm, bình gốm) do phụ nữ Chăm chế tác phục vụ cúng tế trong Lễ hội Katê.',
    url: 'https://ich.unesco.org',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với Cục Di sản văn hoá (NG-02)'
  },
  {
    ma_nguon: 'NG-05',
    ten_nguon: 'Hồ sơ trưng bày và tư liệu dân tộc học về Văn hoá Chăm (hiện vật nhạc cụ Ginăng, Paranưng, Saranai, Kanhi, cơi trầu Thôn la và trang phục lễ Katê)',
    co_quan_tac_gia: 'Bảo tàng Dân tộc học Việt Nam (Viện Hàn lâm Khoa học xã hội Việt Nam)',
    loai_nguon: 'Chính thống',
    cong_dong_dia_ban: 'Người Chăm vùng duyên hải Nam Trung Bộ (trọng tâm tại Phan Rang và Ninh Phước)',
    noi_dung_trich_xuat: 'Thông tin cấu tạo bộ tứ nhạc cụ thiêng, vai trò của hệ thống chức sắc (Pô Adhia, Kadhar, Pajuw, Camưnei) và cấu trúc gia đình mẫu hệ Chăm (Sang).',
    url: 'https://vme.org.vn',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với Viện Văn hoá Nghệ thuật quốc gia Việt Nam (NG-06)'
  },
  {
    ma_nguon: 'NG-06',
    ten_nguon: 'Ngân hàng dữ liệu Di sản văn hoá các dân tộc Việt Nam: Chuyên đề Lễ hội Katê và Tín ngưỡng Chăm Bàlamôn',
    co_quan_tac_gia: 'Viện Văn hoá Nghệ thuật quốc gia Việt Nam (VICAS)',
    loai_nguon: 'Chính thống / Học thuật',
    cong_dong_dia_ban: 'Cộng đồng người Chăm Ahier tại làng Hữu Đức, làng Hậu Sanh (xã Phước Hữu) và khu vực Đô Vinh',
    noi_dung_trich_xuat: 'Bài viết khảo tả chuyên sâu về lịch pháp Sakawi, lời hát thánh ca của Ông Kadhar, lễ Katê làng (Katê palei) tại nhà làng (Sang nhưa) và lễ Katê gia đình (Katê sang).',
    url: 'http://vicas.org.vn',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với Cục Di sản văn hoá (NG-02)'
  },
  {
    ma_nguon: 'NG-07',
    ten_nguon: 'Sách chuyên khảo: "Văn hoá Chăm và Lễ hội Katê ở Ninh Thuận" (Khảo tả dân tộc học & chữ viết, lễ nghi Chăm)',
    co_quan_tac_gia: 'Nhiều tác giả - Nhà xuất bản Văn hoá dân tộc',
    loai_nguon: 'Tham khảo chuyên khảo',
    cong_dong_dia_ban: 'Cộng đồng người Chăm tại tỉnh Ninh Thuận (nay là khu vực phía Nam tỉnh Khánh Hoà)',
    noi_dung_trich_xuat: 'Đối chiếu phiên âm chuẩn các thuật ngữ bản địa tiếng Chăm (Mưbăng Katê, Pơh băng yang, Mưnay yang, Adaoh yang, Halau Tamưnay Ahier, Aw Kamei, Tamia Đoa) và ranh giới các nghi thức kiêng kỵ không được quay chụp.',
    url: 'https://nlv.gov.vn',
    ngay_truy_cap: '05/11/2026',
    doi_chieu: 'Đã đối chiếu với Bảo tàng Dân tộc học Việt Nam (NG-05)'
  }
];

// ============================================================================
// 3. DỮ LIỆU 15 BẢN GHI THỰC TẾ (TỆP DISAN.JSON CHUẨN HOÁ)
// ============================================================================
export const DISAN_DATA: HeritageRecord[] = [
  {
    id: 'E03-00001',
    ma_tu_lieu: 'E03-DS-01',
    ten_tu_lieu: 'Hồ sơ pháp lý và giá trị cốt lõi của Di sản văn hoá phi vật thể quốc gia Lễ hội Katê',
    phan_loai_noi_dung: 'Thông tin về di sản',
    loai_tu_lieu: 'Thông tin về di sản (Văn bản pháp lý & Khảo tả tổng quan)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Katê / Mưbăng Katê (Đại lễ tưởng nhớ thần linh, vua có công và ông bà tổ tiên của người Chăm Ahier)',
    loai_hinh_di_san: 'Lễ hội truyền thống; Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (nhóm Chăm Ahier - theo tín ngưỡng Bàlamôn)',
    dia_danh_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Thành phố Phan Rang - Tháp Chàm và huyện Ninh Phước, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Lễ hội Katê được Bộ Văn hoá, Thể thao và Du lịch đưa vào Danh mục di sản văn hoá phi vật thể quốc gia theo Quyết định số 1852/QĐ-BVHTTDL ngày 08/5/2017. Đây là lễ hội dân gian quan trọng và quy mô lớn nhất trong năm của cộng đồng người Chăm theo tín ngưỡng Bàlamôn (Chăm Ahier). Lễ hội phản ánh sâu sắc đời sống tâm linh, đạo lý uống nước nhớ nguồn đối với các vị thần bảo hộ xứ sở (Pô Inư Nưgar), các vị vua có công khai khẩn thuỷ lợi, mở mang bờ cõi (Pô Klong Garai, Pô Rômê) và tổ tiên dòng tộc. Không gian lễ hội kết nối chặt chẽ từ đền tháp cổ (Bimong) về đến làng (Palei) và từng gia đình mẫu hệ (Sang).',
    boi_canh_thu_thap: 'Tư liệu hồ sơ ghi danh Di sản văn hoá phi vật thể quốc gia năm 2017',
    nguoi_cung_cap: 'Bộ Văn hoá, Thể thao và Du lịch; Cục Di sản văn hoá',
    pham_vi_su_dung: 'Sử dụng công khai trong sản phẩm học tập phi lợi nhuận, có dẫn nguồn chính thống',
    phan_khong_cong_bo: 'Không có',
    nguon_tu_lieu: 'Quyết định 1852/QĐ-BVHTTDL ngày 08/5/2017 (bvhttdl.gov.vn); Cục Di sản văn hoá (dsvh.gov.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-01',
        ten_nguon: 'Quyết định số 1852/QĐ-BVHTTDL ngày 08/5/2017 của Bộ trưởng Bộ VHTTDL',
        url: 'https://bvhttdl.gov.vn',
        doi_chieu: 'Danh mục Di sản văn hoá phi vật thể quốc gia - Cục Di sản văn hoá (NG-02)'
      }
    ]
  },
  {
    id: 'E03-00002',
    ma_tu_lieu: 'E03-DS-02',
    ten_tu_lieu: 'Tri thức Lịch pháp Chăm (Sakawi) và chu kỳ ấn định ngày mở hội Katê',
    phan_loai_noi_dung: 'Thông tin về di sản',
    loai_tu_lieu: 'Thông tin về di sản (Tri thức dân gian & Văn bản khảo tả)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Bilan Tuh - Sakawi Cham (Tháng 7 theo lịch Chăm cổ)',
    loai_hinh_di_san: 'Tri thức dân gian; Lễ hội truyền thống',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (Hội đồng chức sắc Bàlamôn giáo và cộng đồng Chăm Ahier)',
    dia_danh_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Tỉnh Ninh Thuận (2017)',
    mo_ta: 'Người Chăm sử dụng hệ thống lịch riêng gọi là Sakawi (kết hợp yếu tố âm lịch và dương lịch truyền thống để phục vụ nông nghiệp và tín ngưỡng). Một năm lịch Chăm có 12 tháng, mỗi tháng chia thành thượng tuần trăng mọc (Klaok - 15 ngày đầu) và hạ tuần trăng khuyết (Băng - 14 hoặc 15 ngày cuối). Lễ hội Katê luôn được ấn định vào thượng tuần tháng 7 lịch Chăm (Bilan Tuh), thường rơi vào cuối tháng 9 hoặc tháng 10 Dương lịch. Ngày 30 tháng 6 lịch Chăm là lễ đón y trang; sáng mùng 1 tháng 7 lịch Chăm là Đại lễ chính thức đồng loạt diễn ra tại ba khu đền tháp cổ trước khi lan toả về làng và gia đình.',
    boi_canh_thu_thap: 'Tư liệu nghiên cứu lịch pháp truyền thống và kiểm kê di sản',
    nguoi_cung_cap: 'Viện Văn hoá Nghệ thuật quốc gia Việt Nam và Hội đồng Chức sắc Bàlamôn giáo',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không công bố các bài toán bấm ngày giờ mật truyền cá nhân ghi trên sách lá buông riêng của từng gia tộc tu sĩ khi chưa được phép',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Viện Văn hoá Nghệ thuật quốc gia Việt Nam (vicas.org.vn); Văn hoá Chăm và Lễ hội Katê (NXB Văn hoá dân tộc)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-06',
        ten_nguon: 'Ngân hàng dữ liệu di sản - Viện Văn hoá Nghệ thuật quốc gia Việt Nam',
        url: 'http://vicas.org.vn',
        doi_chieu: 'Sách chuyên khảo Văn hoá Chăm và Lễ hội Katê ở Ninh Thuận - NXB Văn hoá dân tộc (NG-07)'
      }
    ],
    diem_chua_ro: 'Cách quy đổi ngày nhuận giữa lịch Sakawi cổ trên kinh lá buông và lịch Sakawi phát hành hàng năm có một số chi tiết dị biệt giữa các làng, cần tham vấn thêm Hội đồng Chức sắc.'
  },
  {
    id: 'E03-00003',
    ma_tu_lieu: 'E03-DD-04',
    ten_tu_lieu: 'Không gian hành lễ tại Di tích quốc gia đặc biệt Quần thể Tháp Pô Klong Garai',
    phan_loai_noi_dung: 'Địa điểm sinh hoạt cộng đồng',
    loai_tu_lieu: 'Địa điểm sinh hoạt cộng đồng (Bản đồ & Sơ đồ kiến trúc di tích)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Bimong Pô Klong Garai (Cụm tháp thờ vua Pô Klong Garai trên đồi Trầu)',
    loai_hinh_di_san: 'Lễ hội truyền thống; Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (các làng Chăm khu vực Phan Rang và phụ cận)',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Phường Đô Vinh, thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Quần thể tháp Pô Klong Garai nằm trên đồi Trầu, xây dựng cuối thế kỷ XIII - đầu thế kỷ XIV, được xếp hạng Di tích quốc gia đặc biệt theo Quyết định số 2499/QĐ-TTg ngày 22/12/2016. Cụm di tích gồm 3 ngôi tháp gạch nung đỏ: Tháp Cổng (Gopura) ở phía Đông, Tháp Lửa (Kosagrha - nơi các tu sĩ chuẩn bị đồ lễ và giữ lửa thiêng) ở phía Nam, và Tháp Chính (Kalan) cao hơn 20m thờ ngẫu tượng Mukha-Linga có chạm khuôn mặt vua Pô Klong Garai - vị vua có công lớn dẫn thuỷ nhập điền giúp dân làm nông nghiệp.',
    boi_canh_thu_thap: 'Nghi lễ thật của cộng đồng và hồ sơ Di tích quốc gia đặc biệt',
    nguoi_cung_cap: 'Cục Di sản văn hoá - Bộ Văn hoá, Thể thao và Du lịch',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không tự ý bước vào lòng Tháp Chính (Kalan) khi các tu sĩ đang hành lễ mật niệm',
    nguon_tu_lieu: 'Hồ sơ Di tích quốc gia đặc biệt Tháp Pô Klong Garai (dsvh.gov.vn); Quyết định 2499/QĐ-TTg (vanban.chinhphu.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Di tích quốc gia đặc biệt Tháp Pô Klong Garai - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Quyết định số 2499/QĐ-TTg ngày 22/12/2016 của Thủ tướng Chính phủ (NG-03)'
      }
    ]
  },
  {
    id: 'E03-00004',
    ma_tu_lieu: 'E03-DD-05',
    ten_tu_lieu: 'Không gian hành lễ Katê tại Tháp Pô Rômê',
    phan_loai_noi_dung: 'Địa điểm sinh hoạt cộng đồng',
    loai_tu_lieu: 'Địa điểm sinh hoạt cộng đồng (Bản đồ & Không gian di tích)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Bimong Pô Rômê (Tháp thờ vua Pô Rômê)',
    loai_hinh_di_san: 'Lễ hội truyền thống; Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (thôn Hậu Sanh, thôn Hữu Đức và vùng phụ cận) và Người Raglai',
    dia_danh_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Thôn Hậu Sanh, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Ngôi tháp gạch xây dựng vào thế kỷ XVII trên đồi cao thuộc thôn Hậu Sanh, là công trình tháp gạch lớn cuối cùng của nghệ thuật kiến trúc Champa. Trong lòng tháp đặt tượng vua Pô Rômê (trị vì 1627 - 1651, người có công mở mang hệ thống đập thuỷ lợi Nha Trinh - Lâm Cấm) dưới dạng Mukha-Linga và tượng hoàng hậu Pô Bia Sưnang. Đây là một trong ba điểm hành lễ chính thức cấp cộng đồng vào sáng mùng 1 tháng 7 lịch Chăm với sự tham gia của người Chăm và người Raglai.',
    boi_canh_thu_thap: 'Tư liệu kiểm kê di tích lịch sử - văn hoá quốc gia (xếp hạng năm 1992)',
    nguoi_cung_cap: 'Cục Di sản văn hoá; Sở Văn hoá, Thể thao và Du lịch địa phương',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không ghi hình bên trong điện thờ chính khi chưa được Cả sư Pô Adhia cho phép',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Viện Văn hoá Nghệ thuật quốc gia Việt Nam (vicas.org.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Danh mục di tích quốc gia và hồ sơ Lễ hội Katê - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Ngân hàng dữ liệu di sản Chăm - Viện Văn hoá Nghệ thuật quốc gia Việt Nam (NG-06)'
      }
    ]
  },
  {
    id: 'E03-00005',
    ma_tu_lieu: 'E03-DD-06',
    ten_tu_lieu: 'Không gian hành lễ tại Đền thờ Nữ thần Pô Inư Nưgar (Mẹ Xứ Sở)',
    phan_loai_noi_dung: 'Địa điểm sinh hoạt cộng đồng',
    loai_tu_lieu: 'Địa điểm sinh hoạt cộng đồng (Không gian tín ngưỡng cộng đồng làng)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Danaok Pô Inư Nưgar (Đền thờ Mẹ Xứ Sở Pô Inư Nưgar tại Palei Hamu Tanran)',
    loai_hinh_di_san: 'Tập quán xã hội và tín ngưỡng; Lễ hội truyền thống',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (làng Hữu Đức)',
    dia_danh_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Thôn Hữu Đức, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Đền thờ Nữ thần Pô Inư Nưgar - vị thần Mẹ Xứ Sở khởi nguyên theo tín ngưỡng mẫu hệ bản địa của người Chăm, người khai sáng nghề trồng lúa, dệt vải. Cùng với tháp Pô Klong Garai và tháp Pô Rômê, đây là một trong ba trung tâm tâm linh bắt buộc cử hành đại lễ Katê vào sáng mùng 1 tháng 7 lịch Chăm.',
    boi_canh_thu_thap: 'Tư liệu kiểm kê di sản quốc gia',
    nguoi_cung_cap: 'Cục Di sản văn hoá; Bảo tàng Dân tộc học Việt Nam',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Tuyệt đối không công bố vị trí cất giữ chi tiết sắc phong và đồ thờ cổ tại nhà dân trông coi đền (ông Từ Camưnei) theo quy định tại Mục V.2',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Bảo tàng Dân tộc học Việt Nam (vme.org.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Tư liệu dân tộc học Bảo tàng Dân tộc học Việt Nam (NG-05)'
      }
    ]
  },
  {
    id: 'E03-00006',
    ma_tu_lieu: 'E03-HD-08',
    ten_tu_lieu: 'Nghi lễ đón và rước y trang thần từ cộng đồng người Raglai',
    phan_loai_noi_dung: 'Hoạt động văn hoá - nghi lễ',
    loai_tu_lieu: 'Hoạt động văn hoá - nghi lễ (Mô tả trình tự nghi thức thực tế)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Rơk khan yang (Lễ rước y trang của các vị thần) & Adơi sa-ai Cham - Raglai',
    loai_hinh_di_san: 'Lễ hội truyền thống; Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm và Người Raglai',
    dia_danh_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Huyện Ninh Phước và thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Theo truyền thống mẫu hệ ("Chăm chị - Raglai em"), người Raglai là người em gái út giữ trọng trách thừa kế và lưu giữ y trang (áo bào, mũ miện, cân đai, khăn lụa) của các vị vua thần Chăm. Chiều 30 tháng 6 lịch Chăm, đoàn chức sắc Chăm làm lễ đón y trang do người Raglai mang xuống làng Chăm. Sáng sớm mùng 1 tháng 7 lịch Chăm (6h30 - 7h30), đoàn rước trọng thể gồm các vị Cả sư Pô Adhia, kiệu y trang che lọng, đội nhạc trống Ginăng, Paranưng, kèn Saranai và đội múa Chăm - Raglai rước y trang lên đền tháp.',
    boi_canh_thu_thap: 'Nghi lễ thật của cộng đồng được ghi nhận trong hồ sơ di sản quốc gia',
    nguoi_cung_cap: 'Cục Di sản văn hoá và Bảo tàng Dân tộc học Việt Nam',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Tuyệt đối không công bố địa chỉ/toạ độ nhà riêng nơi gia đình người Raglai cất giữ hòm y trang gốc ngoài mùa lễ hội',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Bảo tàng Dân tộc học Việt Nam (vme.org.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Di sản văn hoá phi vật thể quốc gia Lễ hội Katê - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Tư liệu nhóm ngôn ngữ Malayo-Polynesian - Bảo tàng Dân tộc học Việt Nam (NG-05)'
      }
    ]
  },
  {
    id: 'E03-00007',
    ma_tu_lieu: 'E03-HD-09A',
    ten_tu_lieu: 'Nghi lễ xin phép mở cửa tháp trong sáng chính hội Katê',
    phan_loai_noi_dung: 'Hoạt động văn hoá - nghi lễ',
    loai_tu_lieu: 'Hoạt động văn hoá - nghi lễ',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Pơh băng yang (Lễ xin phép thần linh mở cửa tháp chính Kalan)',
    loai_hinh_di_san: 'Tập quán xã hội và tín ngưỡng; Lễ hội truyền thống',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (nhóm Chăm Ahier)',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Phường Đô Vinh, thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Khi đoàn rước y trang lên tới sân tháp Pô Klong Garai (khoảng 8h00 sáng mùng 1 tháng 7 lịch Chăm), Cả sư (Pô Adhia) cùng thầy kéo đàn Kanhi (Ông Kadhar) ngồi trước cửa chính tháp Kalan thực hiện nghi thức dâng rượu, trầu cau xin phép thần Siva và thần Pô Klong Garai mở cửa tháp. Ông Kadhar kéo đàn mai rùa Kanhi hát bài thánh ca kể tiểu sử, công trạng nhà vua, sau đó ông Từ giữ tháp (Camưnei) mở cửa gỗ tháp chính.',
    boi_canh_thu_thap: 'Nghi lễ thật của cộng đồng tại tháp Pô Klong Garai',
    nguoi_cung_cap: 'Cục Di sản văn hoá',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Phần mật chú của Cả sư Pô Adhia khi làm phép nước thánh trước cửa tháp không được phép đặt micro ghi âm sát',
    nguon_tu_lieu: 'Quyết định 1852/QĐ-BVHTTDL (bvhttdl.gov.vn); Cục Di sản văn hoá (dsvh.gov.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-01',
        ten_nguon: 'Quyết định 1852/QĐ-BVHTTDL - Bộ Văn hoá, Thể thao và Du lịch',
        url: 'https://bvhttdl.gov.vn',
        doi_chieu: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá (NG-02)'
      }
    ]
  },
  {
    id: 'E03-00008',
    ma_tu_lieu: 'E03-HD-09B',
    ten_tu_lieu: 'Nghi lễ tắm tượng thần và mặc đại phục hoàng gia trong lòng tháp',
    phan_loai_noi_dung: 'Hoạt động văn hoá - nghi lễ',
    loai_tu_lieu: 'Hoạt động văn hoá - nghi lễ (Nghi lễ tâm linh trọng tâm kèm quy tắc kiêng kỵ)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Mưnay yang - Mưkăn khan (Lễ tắm tượng Mukha-Linga và mặc đại phục)',
    loai_hinh_di_san: 'Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (nhóm Chăm Ahier)',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Phường Đô Vinh, thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Cả sư Pô Adhia và các tu sĩ dùng nước thảo mộc thiêng tắm rửa bệ thờ Linga-Yoni (có chạm khuôn mặt vua Pô Klong Garai), hứng nước thánh ban lộc cho dân làng, sau đó lau khô và mặc bộ y trang hoàng gia, đội mũ miện lên tượng thần trong tiếng đàn Kanhi và lời hát lễ.',
    boi_canh_thu_thap: 'Tư liệu khảo tả trong hồ sơ di sản quốc gia',
    nguoi_cung_cap: 'Cục Di sản văn hoá; Hội đồng Chức sắc Bàlamôn giáo',
    pham_vi_su_dung: 'Chỉ sử dụng văn bản mô tả khái quát đã xuất bản cho mục đích học tập phi lợi nhuận',
    phan_khong_cong_bo: 'NGHIÊM CẤM QUAY CHỤP: Giai đoạn mật niệm trong bóng tối hoàn toàn, thần chú riêng của Pô Adhia và lúc thay xiêm y cốt lõi cho tượng thần tuyệt đối không quay phim, không chiếu đèn pha hay chụp ảnh flash theo quy tắc thiêng của cộng đồng (Nguyên tắc đạo đức số 5 của UNESCO)',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Văn hoá Chăm và Lễ hội Katê (NXB Văn hoá dân tộc)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Sách chuyên khảo Văn hoá Chăm và Lễ hội Katê ở Ninh Thuận - NXB Văn hoá dân tộc (NG-07)'
      }
    ]
  },
  {
    id: 'E03-00009',
    ma_tu_lieu: 'E03-HD-10',
    ten_tu_lieu: 'Đại lễ cúng chính thức (Adaoh yang) và hát thánh ca mời thần linh tại tháp',
    phan_loai_noi_dung: 'Hoạt động văn hoá - nghi lễ',
    loai_tu_lieu: 'Hoạt động văn hoá - nghi lễ (Trình tự nghi lễ & Âm nhạc thiêng)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Adaoh yang (Đại lễ hát tụng ca mời thần linh và dâng lễ cúng chính thức)',
    loai_hinh_di_san: 'Lễ hội truyền thống; Tập quán xã hội và tín ngưỡng; Nghệ thuật trình diễn dân gian',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (nhóm Chăm Ahier)',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Phường Đô Vinh, thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Nghi lễ chính thức diễn ra từ khoảng 9h00 đến 11h30 trưa ngày mùng 1 tháng 7 lịch Chăm sau khi tượng thần đã mặc xong y trang. Ông Kadhar kéo đàn Kanhi hát các bài thánh ca bằng tiếng Chăm cổ mời hơn 30 vị thần trong hệ thống thần điện Chăm (thần núi, thần biển, thần nông nghiệp, các vị vua) về dự lễ. Bà bóng Pajuw thực hiện vũ điệu thiêng dâng rượu trầu, Cả sư cầu quốc thái dân an. Sau khi kết thúc đại lễ Adaoh yang, người dân mới vào tháp dâng lễ vật cá nhân.',
    boi_canh_thu_thap: 'Nghi lễ thật của cộng đồng tại tháp Pô Klong Garai',
    nguoi_cung_cap: 'Cục Di sản văn hoá; Viện Văn hoá Nghệ thuật quốc gia Việt Nam',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không tự ý dịch lệch, cắt ghép hoặc xuyên tạc lời thánh ca chữ Chăm cổ ghi trên kinh lá buông (Agal)',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Bảo tàng Dân tộc học Việt Nam (vme.org.vn); Viện Văn hoá Nghệ thuật quốc gia Việt Nam (vicas.org.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Ngân hàng dữ liệu di sản Chăm - Viện Văn hoá Nghệ thuật quốc gia Việt Nam (NG-06)'
      }
    ]
  },
  {
    id: 'E03-00010',
    ma_tu_lieu: 'E03-BV-14',
    ten_tu_lieu: 'Vai trò của Hội đồng chức sắc dân gian chủ trì Lễ hội Katê',
    phan_loai_noi_dung: 'Bài viết chuyên môn',
    loai_tu_lieu: 'Bài viết chuyên môn (Hồ sơ chủ thể nắm giữ và thực hành di sản)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Halau Tamưnay Ahier (Hệ thống tu sĩ và chức sắc dân gian Pô Adhia, Kadhar, Pajuw, Camưnei)',
    loai_hinh_di_san: 'Tập quán xã hội và tín ngưỡng; Tri thức dân gian',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (nhóm Chăm Ahier)',
    dia_danh_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Tỉnh Ninh Thuận (2017)',
    mo_ta: 'Mọi nghi thức tại đền tháp phải do 4 vị chức sắc tôn giáo truyền thống phối hợp điều hành: (1) Pô Adhia (Cả sư - phẩm hàm cao nhất dòng tu Pasêh, chủ trì đại lễ và làm phép nước thánh); (2) Ông Kadhar (nghệ nhân - tu sĩ giữ sách lá buông Agal, kéo đàn Kanhi và hát thánh ca tiểu sử thần linh); (3) Bà Pajuw (bà bóng đại diện yếu tố mẫu hệ, dâng lễ vật rượu trầu và múa thiêng); (4) Ông Camưnei (chức sắc trông coi đền tháp quanh năm, giữ chìa khoá cửa tháp và chuẩn bị nước thảo mộc).',
    boi_canh_thu_thap: 'Tư liệu nghiên cứu dân tộc học đã công bố',
    nguoi_cung_cap: 'Bảo tàng Dân tộc học Việt Nam; Viện Văn hoá Nghệ thuật quốc gia Việt Nam',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận, tuân thủ bảo vệ dữ liệu cá nhân',
    phan_khong_cong_bo: 'Tuyệt đối không đăng tải số điện thoại, số căn cước, địa chỉ nhà riêng của các vị chức sắc theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15',
    nguon_tu_lieu: 'Bảo tàng Dân tộc học Việt Nam (vme.org.vn); Viện Văn hoá Nghệ thuật quốc gia Việt Nam (vicas.org.vn); Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (vanban.chinhphu.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-06',
        ten_nguon: 'Chuyên khảo hệ thống chức sắc Chăm Bàlamôn - Viện Văn hoá Nghệ thuật quốc gia Việt Nam',
        url: 'http://vicas.org.vn',
        doi_chieu: 'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (NG-03) & Bảo tàng Dân tộc học Việt Nam (NG-05)'
      }
    ]
  },
  {
    id: 'E03-00011',
    ma_tu_lieu: 'E03-HA-12',
    ten_tu_lieu: 'Bộ tứ nhạc cụ thiêng trong Lễ hội Katê: Ginăng, Paranưng, Saranai và Kanhi',
    phan_loai_noi_dung: 'Hình ảnh tư liệu & hiện vật',
    loai_tu_lieu: 'Hình ảnh tư liệu & Hồ sơ âm thanh - nhạc cụ',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Hagơr Ginăng (trống đôi), Hagơr Paranưng (trống vỗ), Saranai (kèn bầu), Kanhi (đàn nhị mai rùa)',
    loai_hinh_di_san: 'Nghệ thuật trình diễn dân gian; Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Phường Đô Vinh, thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2022)',
    mo_ta: 'Bộ 4 nhạc cụ truyền thống không thể tách rời của Lễ hội Katê: (1) Đàn Kanhi có hộp cộng hưởng làm bằng mai rùa vàng trên núi, cần đàn bằng tre, chỉ do Ông Kadhar sử dụng trong nghi lễ thiêng để hát thánh ca. (2) Trống đôi Ginăng gồm hai trống hình ống dài buộc chéo, tượng trưng cho đôi chân con người. (3) Trống tròn một mặt Paranưng đặt trước ngực vỗ bằng 10 ngón tay, tượng trưng cho lồng ngực và trái tim. (4) Kèn bầu Saranai 7 lỗ với lưỡi gà bằng lá thốt nốt, tượng trưng cho đầu và hơi thở sự sống.',
    boi_canh_thu_thap: 'Tư liệu hiện vật trưng bày của Bảo tàng Dân tộc học Việt Nam',
    nguoi_cung_cap: 'Bảo tàng Dân tộc học Việt Nam; Cục Di sản văn hoá',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Đàn Kanhi là pháp khí tôn giáo thiêng, người ngoài không tự ý chạm vào hoặc mượn biểu diễn giải trí thương mại',
    nguon_tu_lieu: 'Bảo tàng Dân tộc học Việt Nam (vme.org.vn); Cục Di sản văn hoá (dsvh.gov.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-05',
        ten_nguon: 'Bộ sưu tập hiện vật nhạc cụ Chăm - Bảo tàng Dân tộc học Việt Nam',
        url: 'https://vme.org.vn',
        doi_chieu: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá (NG-02)'
      }
    ]
  },
  {
    id: 'E03-00012',
    ma_tu_lieu: 'E03-BV-15',
    ten_tu_lieu: 'Phân biệt Vũ điệu nghi lễ thiêng (Tamia Đoa) và Biểu diễn hội / Du lịch (Tamia Biyên)',
    phan_loai_noi_dung: 'Bài viết chuyên môn',
    loai_tu_lieu: 'Bài viết chuyên môn & Chuẩn mực bảo vệ bối cảnh di sản',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Tamia Đoa (Múa đội Thôn la dâng lễ thiêng) và Tamia Biyên (Múa quạt dân gian)',
    loai_hinh_di_san: 'Nghệ thuật trình diễn dân gian; Lễ hội truyền thống',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Phường Đô Vinh, thành phố Phan Rang - Tháp Chàm, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Thực hiện yêu cầu tại Mục V.4 (Phân biệt di sản đang sống với bản mô phỏng phục vụ du lịch): (1) Múa nghi lễ thiêng (Tamia Đoa): Do Bà bóng Pajuw và các thiếu nữ Chăm mặc áo dài truyền thống không xẻ tà (Aw Kamei), thắt dây lưng thổ cẩm (Talây ka-ing) thực hiện động tác đội cơi trầu Thôn la hoặc bình nước dâng thần trong sáng mùng 1 tháng 7 lịch Chăm. (2) Biểu diễn phần hội / phục vụ du khách: Các điệu múa quạt (Tamia Biyên), múa khăn trên sân khấu dưới chân đồi Trầu hoặc biểu diễn định kỳ cho khách tham quan. Bắt buộc ghi nhãn rõ bối cảnh khi trưng bày.',
    boi_canh_thu_thap: 'Nghi lễ thật của cộng đồng và chương trình giao lưu văn nghệ tại chân tháp Pô Klong Garai',
    nguoi_cung_cap: 'Cục Di sản văn hoá; Viện Văn hoá Nghệ thuật quốc gia Việt Nam',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận, ghi chú rõ bối cảnh lễ thật và biểu diễn hội',
    phan_khong_cong_bo: 'Không dùng ảnh sân khấu hoá tại khu du lịch để minh hoạ cho nghi thức múa thiêng của Bà Pajuw trong lòng tháp',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Bảo tàng Dân tộc học Việt Nam (vme.org.vn); Viện Văn hoá Nghệ thuật quốc gia Việt Nam (vicas.org.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Chuyên khảo Nghệ thuật múa Chăm - Viện Văn hoá Nghệ thuật quốc gia Việt Nam (NG-06)'
      }
    ]
  },
  {
    id: 'E03-00013',
    ma_tu_lieu: 'E03-HA-13',
    ten_tu_lieu: 'Hệ thống lễ vật dâng cúng Thôn la và Vật phẩm Gốm Chăm Bàu Trúc',
    phan_loai_noi_dung: 'Hình ảnh tư liệu & hiện vật',
    loai_tu_lieu: 'Hình ảnh tư liệu & Hiện vật nghề thủ công gắn với nghi lễ',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Thôn la (Cơi đồng đựng trầu cau), Pây nung (Bánh tét Chăm), Gốm Bàu Trúc (Palei Hamu Craok)',
    loai_hinh_di_san: 'Tập quán xã hội và tín ngưỡng; Nghề thủ công truyền thống',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (làng gốm Bàu Trúc và các làng Chăm Ahier)',
    dia_danh_hien_nay: 'Xã Phước Hữu và khu vực Bàu Trúc, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Thị trấn Phước Dân, huyện Ninh Phước, tỉnh Ninh Thuận (2022)',
    mo_ta: 'Lễ vật dâng lên đền tháp trong dịp Katê gồm thịt dê luộc, gà luộc, cơm trắng, canh, bánh tét (Pây nung), bánh ít (Pây cu), bánh gừng (Pây rơya), chuối, trứng gà, rượu lễ và trầu cau têm cánh phượng đặt trong cơi đồng Thôn la. Đặc biệt, các dụng cụ đựng nước thánh, bát đốt trầm hương (Klong trầm) và bình nước lễ đều được chế tác thủ công không bàn xoay, nung lộ thiên từ làng gốm Bàu Trúc của phụ nữ Chăm (di sản được UNESCO ghi danh năm 2022).',
    boi_canh_thu_thap: 'Hồ sơ UNESCO năm 2022 và hồ sơ Di sản văn hoá phi vật thể quốc gia',
    nguoi_cung_cap: 'UNESCO Intangible Cultural Heritage và Cục Di sản văn hoá',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không có',
    nguon_tu_lieu: 'Hồ sơ UNESCO Nghệ thuật làm gốm của người Chăm 2022 (ich.unesco.org); Cục Di sản văn hoá (dsvh.gov.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-04',
        ten_nguon: 'Hồ sơ UNESCO: Art of pottery-making of Cham people (2022)',
        url: 'https://ich.unesco.org',
        doi_chieu: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá (NG-02)'
      }
    ]
  },
  {
    id: 'E03-00014',
    ma_tu_lieu: 'E03-DD-07',
    ten_tu_lieu: 'Lễ Katê tại làng Chăm (Katê palei) ở không gian Nhà làng (Sang nhưa)',
    phan_loai_noi_dung: 'Địa điểm sinh hoạt cộng đồng',
    loai_tu_lieu: 'Địa điểm & Hoạt động sinh hoạt cộng đồng cấp làng',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Katê palei (Lễ hội Katê cấp làng tại nhà làng Sang nhưa)',
    loai_hinh_di_san: 'Lễ hội truyền thống; Tập quán xã hội và tín ngưỡng',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (làng Hữu Đức, làng Hậu Sanh và các làng Chăm Ahier)',
    dia_danh_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Thôn Hữu Đức, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Sau khi hoàn thành đại lễ trên đền tháp, các làng Chăm (Palei) chọn ngày lành (thường là ngày thứ Tư hoặc thứ Bảy kế tiếp trong tháng 7 lịch Chăm) để tổ chức Katê làng tại nhà làng (Sang nhưa). Cả làng cùng dọn dẹp đường làng, đóng góp lễ vật cúng thần bảo hộ làng (Pô Yang Palei), cầu bình an, miễn dịch bệnh cho toàn bộ cư dân trong palei và tổ chức hội làng, thi đội nước, dệt thổ cẩm, thể thao dân gian.',
    boi_canh_thu_thap: 'Tư liệu hồ sơ kiểm kê di sản văn hoá phi vật thể',
    nguoi_cung_cap: 'Cục Di sản văn hoá và Sở VHTTDL địa phương',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không có',
    nguon_tu_lieu: 'Cục Di sản văn hoá (dsvh.gov.vn); Văn hoá Chăm và Lễ hội Katê (NXB Văn hoá dân tộc)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-02',
        ten_nguon: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá',
        url: 'http://dsvh.gov.vn',
        doi_chieu: 'Sách chuyên khảo Văn hoá Chăm và Lễ hội Katê ở Ninh Thuận - NXB Văn hoá dân tộc (NG-07)'
      }
    ]
  },
  {
    id: 'E03-00015',
    ma_tu_lieu: 'E03-HD-11',
    ten_tu_lieu: 'Lễ Katê tại tộc họ và gia đình theo chế độ mẫu hệ (Katê gơp - Katê sang)',
    phan_loai_noi_dung: 'Hoạt động văn hoá - nghi lễ',
    loai_tu_lieu: 'Hoạt động văn hoá - nghi lễ (Sinh hoạt văn hoá dòng tộc & gia đình mẫu hệ)',
    ten_theo_danh_muc: 'Lễ hội Katê của người Chăm',
    ten_goi_ban_dia: 'Katê gơp - Katê sang (Lễ cúng tổ tiên Muk Kei tại nhà gốc mẫu hệ Sang yoan)',
    loai_hinh_di_san: 'Tập quán xã hội và tín ngưỡng; Lễ hội truyền thống',
    vung_van_hoa: 'Vùng văn hoá duyên hải Nam Trung Bộ',
    dan_toc_cong_dong: 'Người Chăm (nhóm Chăm Ahier)',
    dia_danh_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_thoi_diem_tu_lieu: 'Xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận (2017)',
    mo_ta: 'Sau lễ Katê làng là lễ Katê tại dòng tộc (Katê gơp) và từng gia đình (Katê sang). Con cháu đi làm ăn, học tập ở xa đều trở về ngôi nhà gốc của dòng họ mẫu hệ (Sang yoan) do người phụ nữ lớn tuổi nhất (Trưởng tộc) chủ trì để cúng tổ tiên (Muk Kei). Ông bà căn dặn con cháu giữ gìn gia phong, con cháu chúc tụng ông bà cha mẹ và mở tiệc đón tiếp bạn bè, khách quý không phân biệt dân tộc.',
    boi_canh_thu_thap: 'Tư liệu nghiên cứu dân tộc học về gia đình mẫu hệ Chăm',
    nguoi_cung_cap: 'Bảo tàng Dân tộc học Việt Nam; Cục Di sản văn hoá',
    pham_vi_su_dung: 'Sử dụng trong sản phẩm học tập phi lợi nhuận',
    phan_khong_cong_bo: 'Không tự ý chụp ảnh buồng thờ nhà tục (Sang yoan) hoặc ghi hình nghi thức khấn gia tiên riêng tư của gia đình khi chưa có sự đồng thuận trực tiếp của gia chủ',
    nguon_tu_lieu: 'Bảo tàng Dân tộc học Việt Nam (vme.org.vn); Cục Di sản văn hoá (dsvh.gov.vn)',
    nguon_kiem_chung_chi_tiet: [
      {
        ma_nguon: 'NG-05',
        ten_nguon: 'Hồ sơ dân tộc học về chu kỳ lễ hội và gia đình mẫu hệ Chăm - Bảo tàng Dân tộc học Việt Nam',
        url: 'https://vme.org.vn',
        doi_chieu: 'Hồ sơ Lễ hội Katê của người Chăm - Cục Di sản văn hoá (NG-02)'
      }
    ]
  }
];

// ============================================================================
// 4. DỮ LIỆU CHỨC NĂNG LÕI E03: LỊCH CHĂM SAKAWI, TRÌNH TỰ LỄ & BẢN ĐỒ THÁP
// ============================================================================
const KATE_TIMELINE_STEPS = [
  {
    buoc: 'Bước 1',
    ngay_cham: 'Chiều 30 tháng 6 lịch Chăm (Sakawi)',
    ten_nghi_le: 'Lễ đón y trang thần từ cộng đồng người Raglai',
    ten_ban_dia: 'Rơk khan yang (Đón y trang tại làng Hữu Đức)',
    dia_diem_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_diem_cu: 'Thôn Hữu Đức, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận',
    mo_ta: 'Đoàn chức sắc Chăm Ahier và dân làng làm lễ đón đoàn người Raglai mang y trang vua thần từ miền núi xuống đền làng Hữu Đức.',
    quy_tac_ghi_hinh: 'Được phép ghi hình phần rước ngoài trời; tuyệt đối không hỏi hoặc công bố nơi cất giữ hòm y trang tại nhà riêng người Raglai ngoài mùa lễ.',
    cap_do_nhay_cam: 'Lưu ý bảo vệ hiện vật'
  },
  {
    buoc: 'Bước 2',
    ngay_cham: '06h30 - 07h30 Sáng mùng 1 tháng 7 lịch Chăm (Bilan Tuh)',
    ten_nghi_le: 'Đoàn rước y trang trọng thể lên 3 khu đền tháp',
    ten_ban_dia: 'Rơk khan yang tagok Bimong',
    dia_diem_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_diem_cu: 'TP. Phan Rang - Tháp Chàm và huyện Ninh Phước, tỉnh Ninh Thuận',
    mo_ta: 'Cả sư Pô Adhia dẫn đầu kiệu y trang có lọng che, cùng đội nhạc trống Ginăng, Paranưng, kèn Saranai và đội múa thiếu nữ Chăm - thanh niên Raglai rước lên tháp Pô Klong Garai, tháp Pô Rômê và đền Pô Inư Nưgar.',
    quy_tac_ghi_hinh: 'Nghi thức cộng đồng mở ngoài trời, được phép chụp ảnh với thái độ tôn nghiêm, không cắt ngang đội hình kiệu thần.',
    cap_do_nhay_cam: 'Công khai'
  },
  {
    buoc: 'Bước 3',
    ngay_cham: '08h00 - 08h30 Sáng mùng 1 tháng 7 lịch Chăm',
    ten_nghi_le: 'Lễ xin phép thần linh mở cửa tháp chính (Kalan)',
    ten_ban_dia: 'Pơh băng yang',
    dia_diem_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_diem_cu: 'Phường Đô Vinh, TP. Phan Rang - Tháp Chàm, tỉnh Ninh Thuận',
    mo_ta: 'Cả sư Pô Adhia dâng rượu trầu xin phép thần Siva và vua Pô Klong Garai mở cửa tháp; Ông Kadhar kéo đàn mai rùa Kanhi hát thánh ca công đức nhà vua; Ông Camưnei mở cửa tháp.',
    quy_tac_ghi_hinh: 'Được quan sát từ sân tháp; không đặt thiết bị ghi âm sát phần đọc mật chú làm phép nước thánh của Cả sư.',
    cap_do_nhay_cam: 'Hạn chế một phần'
  },
  {
    buoc: 'Bước 4',
    ngay_cham: '08h30 - 09h00 Sáng mùng 1 tháng 7 lịch Chăm',
    ten_nghi_le: 'Lễ tắm tượng thần Mukha-Linga và mặc đại phục hoàng gia',
    ten_ban_dia: 'Mưnay yang - Mưkăn khan',
    dia_diem_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_diem_cu: 'TP. Phan Rang - Tháp Chàm và huyện Ninh Phước, tỉnh Ninh Thuận',
    mo_ta: 'Các tu sĩ tắm bệ tượng Linga-Yoni bằng nước thảo mộc thiêng, ban nước lộc, lau khô và mặc bộ đại phục, đội mũ miện hoàng gia cho tượng vua.',
    quy_tac_ghi_hinh: 'NGHIÊM CẤM GHI HÌNH / ĐÈN FLASH: Khoảnh khắc Cả sư mật niệm trong bóng tối hoàn toàn và lúc thay xiêm y cốt lõi trong lòng tháp Kalan tuyệt đối cấm người ngoài vào hoặc quay chụp.',
    cap_do_nhay_cam: 'Cấm ghi hình (Nghi lễ thiêng)'
  },
  {
    buoc: 'Bước 5',
    ngay_cham: '09h00 - 11h30 Sáng mùng 1 tháng 7 lịch Chăm',
    ten_nghi_le: 'Đại lễ cúng chính thức tại lòng tháp',
    ten_ban_dia: 'Adaoh yang',
    dia_diem_hien_nay: 'Phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà',
    dia_diem_cu: 'TP. Phan Rang - Tháp Chàm và huyện Ninh Phước, tỉnh Ninh Thuận',
    mo_ta: 'Ông Kadhar kéo đàn Kanhi hát hơn 30 bài thánh ca chữ Chăm cổ mời thần linh về dự lễ; Bà bóng Pajuw múa Tamia Đoa dâng lễ; sau khi kết thúc đại lễ, các gia đình mới vào dâng lễ vật cá nhân.',
    quy_tac_ghi_hinh: 'Không tự ý cắt ghép lời thánh ca kinh lá buông; không dùng ảnh múa du lịch dưới chân đồi để gán nhãn là múa lễ của Bà Pajuw.',
    cap_do_nhay_cam: 'Hạn chế một phần'
  },
  {
    buoc: 'Bước 6',
    ngay_cham: 'Các ngày Thứ Tư / Thứ Bảy kế tiếp trong tháng 7 lịch Chăm',
    ten_nghi_le: 'Lễ Katê làng (Katê palei) và Katê dòng tộc, gia đình (Katê gơp - Katê sang)',
    ten_ban_dia: 'Katê palei - Katê gơp - Katê sang',
    dia_diem_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_diem_cu: 'Xã Phước Hữu và thị trấn Phước Dân, huyện Ninh Phước, tỉnh Ninh Thuận',
    mo_ta: 'Cúng thần làng Pô Yang Palei tại nhà làng (Sang nhưa), tổ chức hội làng; sau đó con cháu sum họp tại nhà gốc mẫu hệ (Sang yoan) do Trưởng tộc nữ chủ trì để cúng tổ tiên (Muk Kei).',
    quy_tac_ghi_hinh: 'Hội làng công khai; phần lễ khấn gia tiên trong buồng nhà tục (Sang yoan) phải xin phép và có sự đồng thuận của gia chủ.',
    cap_do_nhay_cam: 'Xin phép gia chủ'
  }
];

const TEMPLE_SPACES = [
  {
    ma: 'Bimong Pô Klong Garai',
    ten_viet: 'Quần thể Tháp Pô Klong Garai (Đồi Trầu)',
    cap_xep_hang: 'Di tích quốc gia đặc biệt (QĐ 2499/QĐ-TTg năm 2016)',
    dia_danh_hien_nay: 'Phường Đô Vinh, tỉnh Khánh Hoà',
    dia_danh_cu: 'Khóm Bác Ái, phường Đô Vinh, TP. Phan Rang - Tháp Chàm, tỉnh Ninh Thuận',
    toa_do_tham_chieu: '11°34′42″B 108°56′33″Đ',
     niên_dai: 'Cuối thế kỷ XIII - Đầu thế kỷ XIV',
    doi_tuong_tho: 'Vua Pô Klong Garai (ngẫu tượng Mukha-Linga trong tháp Kalan)',
    cau_truc: '3 tháp gạch nung đỏ: Tháp Cổng (Gopura), Tháp Lửa (Kosagrha) và Tháp Chính (Kalan cao 20,5m).',
    quy_tac_ung_xu: 'Không tự ý bước vào lòng Tháp Chính (Kalan) khi Cả sư đang làm lễ; phân biệt rõ sân hành lễ trên đỉnh đồi và sân khấu giao lưu văn nghệ dưới chân đồi.'
  },
  {
    ma: 'Bimong Pô Rômê',
    ten_viet: 'Tháp Pô Rômê (Đồi Hậu Sanh)',
    cap_xep_hang: 'Di tích lịch sử - văn hoá quốc gia (Xếp hạng năm 1992)',
    dia_danh_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_cu: 'Thôn Hậu Sanh, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận',
    toa_do_tham_chieu: '11°30′18″B 108°52′45″Đ',
    niên_dai: 'Thế kỷ XVII (triều vua Pô Rômê 1627 - 1651)',
    doi_tuong_tho: 'Vua Pô Rômê (tượng Mukha-Linga 8 tay) và Hoàng hậu Pô Bia Sưnang',
    cau_truc: 'Ngôi tháp gạch lớn cuối cùng của kiến trúc Champa, gắn với hệ thống đại thuỷ nông Nha Trinh - Lâm Cấm.',
    quy_tac_ung_xu: 'Giữ trật tự khi đoàn chức sắc Chăm và đoàn người Raglai thực hiện nghi thức giao nhận y trang và tắm tượng.'
  },
  {
    ma: 'Danaok Pô Inư Nưgar',
    ten_viet: 'Đền thờ Nữ thần Pô Inư Nưgar (Làng Hữu Đức)',
    cap_xep_hang: 'Không gian tín ngưỡng tâm linh cốt lõi trong Hồ sơ Di sản quốc gia QĐ 1852/QĐ-BVHTTDL',
    dia_danh_hien_nay: 'Xã Phước Hữu, tỉnh Khánh Hoà',
    dia_danh_cu: 'Thôn Hữu Đức, xã Phước Hữu, huyện Ninh Phước, tỉnh Ninh Thuận',
    toa_do_tham_chieu: '11°31′05″B 108°53′12″Đ',
    niên_dai: 'Tín ngưỡng bản địa mẫu hệ lâu đời của cộng đồng Chăm',
    doi_tuong_tho: 'Nữ thần Pô Inư Nưgar (Mẹ Xứ Sở - đấng tạo lập đất đai, dạy dân trồng lúa, dệt vải)',
    cau_truc: 'Hệ thống đền thờ truyền thống gắn liền với không gian cư trú của cư dân nông nghiệp làng Chăm Hữu Đức (Palei Hamu Tanran).',
    quy_tac_ung_xu: 'Tuyệt đối không công bố vị trí cất giữ sắc phong và đồ thờ cổ trong nhà ông Từ giữ đền (Camưnei).'
  }
];

// ============================================================================
// 5. COMPONENT SƠ ĐỒ KỸ THUẬT SVG (THAY THẾ ẢNH AI THEO ĐÚNG MỤC IX)
// ============================================================================
const ChamArchitecturalDiagram: React.FC<{ category: HeritageRecord['phan_loai_noi_dung']; code: string }> = ({
  category,
  code
}) => {
  return (
    <div className="relative w-full h-44 bg-gradient-to-br from-amber-950 via-red-950 to-stone-900 rounded-xl overflow-hidden border border-amber-700/40 flex flex-col justify-between p-4 text-amber-100">
      {/* Hoa văn gạch Chăm trừu tượng (Geometric SVG) */}
      <svg
        className="absolute right-2 bottom-2 w-32 h-32 opacity-20 text-amber-400 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 8L62 28H38L50 8Z" stroke="currentColor" strokeWidth="2.5" />
        <rect x="34" y="28" width="32" height="14" stroke="currentColor" strokeWidth="2.5" />
        <rect x="26" y="42" width="48" height="20" stroke="currentColor" strokeWidth="2.5" />
        <rect x="18" y="62" width="64" height="28" stroke="currentColor" strokeWidth="2.5" />
        <path d="M42 90V72C42 67.5817 45.5817 64 50 64C54.4183 64 58 67.5817 58 72V90" stroke="currentColor" strokeWidth="2.5" />
      </svg>

      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 border border-amber-400/40 text-amber-200">
          Mã tư liệu: {code}
        </span>
        <span className="px-2.5 py-1 rounded-md text-[11px] bg-stone-900/80 border border-stone-700 text-stone-300">
          Sơ đồ khảo tả kỹ thuật (Không dùng ảnh AI)
        </span>
      </div>

      <div className="z-10 my-auto">
        <div className="text-xs uppercase tracking-wider text-amber-400/90 font-medium mb-1">
          {category}
        </div>
        <div className="text-sm font-semibold text-white leading-snug">
          Minh hoạ hình khối kiến trúc & lưu trữ hồ sơ di sản Chăm Ahier
        </div>
      </div>

      <div className="z-10 flex items-center gap-1.5 text-[11px] text-amber-200/80 border-t border-amber-800/50 pt-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Tuân thủ Mục IX: Không sinh ảnh người, trang phục, nghi lễ bằng AI</span>
      </div>
    </div>
  );
};

// ============================================================================
// 6. COMPONENT CHÍNH (APP.TSX)
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'records' | 'detail' | 'kate_core' | 'gemini_qa' | 'sources' | 'about'
  >('home');

  const [selectedRecord, setSelectedRecord] = useState<HeritageRecord>(DISAN_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('Tất cả');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentIndex = useMemo(() => {
    return DISAN_DATA.findIndex((r) => r.id === selectedRecord.id);
  }, [selectedRecord.id]);

  const handleNextRecord = () => {
    if (currentIndex < DISAN_DATA.length - 1) {
      setSelectedRecord(DISAN_DATA[currentIndex + 1]);
    } else {
      setSelectedRecord(DISAN_DATA[0]);
    }
  };

  const handlePrevRecord = () => {
    if (currentIndex > 0) {
      setSelectedRecord(DISAN_DATA[currentIndex - 1]);
    } else {
      setSelectedRecord(DISAN_DATA[DISAN_DATA.length - 1]);
    }
  };

  // State cho màn hình Hỏi đáp Gemini
  const [questionInput, setQuestionInput] = useState('');
  const [isAskingGemini, setIsAskingGemini] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    {
      role: 'user' | 'assistant';
      content: string;
      matchedRecords?: string[];
    }[]
  >([
    {
      role: 'assistant',
      content:
        'Xin chào! Tôi là Trợ lý tra cứu Hồ sơ số Lễ hội Katê và văn hoá cộng đồng Chăm (Mã đề tài E03). Tôi chỉ trả lời hoàn toàn dựa trên 15 bản ghi thực tế trong tệp disan.json, luôn kèm theo Mã bản ghi, Cộng đồng, Địa danh hiện nay (2 cấp), Địa danh tại thời điểm tư liệu và Nguồn kiểm chứng. Bạn muốn tra cứu thông tin gì?'
    }
  ]);

  // Lọc danh sách bản ghi
  const filteredRecords = useMemo(() => {
    return DISAN_DATA.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.ten_tu_lieu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ten_goi_ban_dia.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mo_ta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ma_tu_lieu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dia_danh_hien_nay.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dia_danh_thoi_diem_tu_lieu.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Tất cả' || item.phan_loai_noi_dung === selectedCategory;

      const matchesLocation =
        selectedLocationFilter === 'Tất cả' ||
        item.dia_danh_hien_nay.includes(selectedLocationFilter);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchQuery, selectedCategory, selectedLocationFilter]);

  // Chức năng đọc nội dung thành tiếng phục vụ người cao tuổi (Mục VII.2)
  const handleSpeakRecord = (record: HeritageRecord) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ đọc thành tiếng.');
      return;
    }

    if (speakingId === record.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${record.ten_tu_lieu}. Tên gọi bản địa: ${record.ten_goi_ban_dia}. Cộng đồng chủ thể: ${record.dan_toc_cong_dong}. Địa danh hiện nay: ${record.dia_danh_hien_nay}. Địa danh tại thời điểm tư liệu: ${record.dia_danh_thoi_diem_tu_lieu}. Nội dung: ${record.mo_ta}. Nguồn tư liệu: ${record.nguon_tu_lieu}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(record.id);
    window.speechSynthesis.speak(utterance);
  };

  // Chức năng xuất tệp disan.json để cộng đồng dùng lại (Mục VII.2)
  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(DISAN_DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'disan.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Xem chi tiết 1 bản ghi
  const openRecordDetail = (record: HeritageRecord) => {
    setSelectedRecord(record);
    setActiveTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm xử lý hỏi đáp Gemini bám sát tuyệt đối tệp disan.json
  const handleAskGemini = async (customQuestion?: string) => {
    const queryText = (customQuestion ?? questionInput).trim();
    if (!queryText || isAskingGemini) return;

    setQuestionInput('');
    setChatHistory((prev) => [...prev, { role: 'user', content: queryText }]);
    setIsAskingGemini(true);

    // Tìm các bản ghi liên quan trong dữ liệu nội bộ để làm đối chứng
    const keywords = queryText
      .toLowerCase()
      .replace(/[?,!.]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const scoredRecords = DISAN_DATA.map((rec) => {
      const fullText = `${rec.id} ${rec.ma_tu_lieu} ${rec.ten_tu_lieu} ${rec.ten_goi_ban_dia} ${rec.mo_ta} ${rec.dia_danh_hien_nay} ${rec.dia_danh_thoi_diem_tu_lieu} ${rec.phan_khong_cong_bo} ${rec.nguon_tu_lieu}`.toLowerCase();
      let score = 0;
      keywords.forEach((kw) => {
        if (fullText.includes(kw)) score += 1;
      });
      return { rec, score };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.rec);

    try {
      const apiKey =
        typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY
          ? process.env.GEMINI_API_KEY
          : '';

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `Bạn là trợ lý tra cứu hồ sơ số cho đề tài E03: "Lễ hội Katê và văn hoá cộng đồng Chăm" (Cộng đồng người Chăm Ahier và người Raglai tại phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà).
QUY TẮC BẮT BUỘC:
1. Chỉ trả lời dựa hoàn toàn trên dữ liệu JSON (tệp disan.json) được cung cấp dưới đây.
2. Tuyệt đối KHÔNG tự suy đoán, không bịa thông tin, không gán ghép phong tục của vùng khác hay dân tộc khác vào cộng đồng người Chăm.
3. Nếu người dùng hỏi thông tin không có trong dữ liệu (ví dụ: hỏi về lễ hội vùng khác, hoặc đòi xem mật chú của Cả sư Pô Adhia, hoặc hỏi số điện thoại/địa chỉ nhà riêng của nghệ nhân, hoặc nơi cất giữ hòm y trang nhà người Raglai), phải trả lời rõ: "Chưa có tư liệu trong hệ thống hồ sơ số E03 (hoặc thông tin thuộc phạm vi nghi lễ thiêng / dữ liệu cá nhân không được phép công bố theo Mục V.2 và Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15)."
4. Mỗi câu trả lời BẮT BUỘC phải ghi rõ ở cuối hoặc ngay trong từng ý:
   - Mã bản ghi & Tên bản ghi (ví dụ: E03-00003 / E03-DD-04)
   - Cộng đồng chủ thể (ví dụ: Người Chăm nhóm Chăm Ahier / Người Raglai)
   - Địa danh hiện nay (2 cấp sau 01/7/2025) VÀ Địa danh tại thời điểm tư liệu (cũ)
   - Nguồn tư liệu kiểm chứng đã dùng.

DỮ LIỆU TỆP DISAN.JSON:
${JSON.stringify(DISAN_DATA)}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: queryText,
          config: {
            systemInstruction,
            temperature: 0.1
          }
        });

        const replyText =
          response.text ||
          'Chưa có tư liệu phản hồi từ mô hình.';

        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: replyText,
            matchedRecords: scoredRecords.map((r) => r.id)
          }
        ]);
      } else {
        // Chế độ đối chiếu trực tiếp từ disan.json nếu môi trường chưa gắn biến GEMINI_API_KEY
        if (scoredRecords.length === 0) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Chưa có tư liệu: Câu hỏi của bạn nằm ngoài phạm vi 15 bản ghi đã kiểm chứng trong tệp disan.json của đề tài E03 (Lễ hội Katê của người Chăm tại phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà). Hệ thống tuyệt đối không tự suy đoán hoặc gán ghép thông tin ngoài nguồn.'
            }
          ]);
        } else {
          const formattedAnswer = scoredRecords
            .map(
              (r) =>
                `• [${r.id} | ${r.ma_tu_lieu}] ${r.ten_tu_lieu} (${r.ten_goi_ban_dia}):\n  - Nội dung: ${r.mo_ta}\n  - Cộng đồng chủ thể: ${r.dan_toc_cong_dong}\n  - Địa danh hiện nay (2 cấp): ${r.dia_danh_hien_nay}\n  - Địa danh tại thời điểm tư liệu: ${r.dia_danh_thoi_diem_tu_lieu}\n  - Giới hạn công bố: ${r.phan_khong_cong_bo}\n  - Nguồn tư liệu: ${r.nguon_tu_lieu}`
            )
            .join('\n\n');

          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `Dựa trực tiếp trên tệp dữ liệu chuẩn disan.json, hệ thống tìm thấy ${scoredRecords.length} bản ghi khớp với câu hỏi của bạn:\n\n${formattedAnswer}`,
              matchedRecords: scoredRecords.map((r) => r.id)
            }
          ]);
        }
      }
    } catch (error) {
      // Fallback an toàn dựa trên dữ liệu disan.json
      if (scoredRecords.length === 0) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Chưa có tư liệu trong tệp disan.json đối với nội dung bạn vừa hỏi. Hệ thống tuân thủ nguyên tắc không suy đoán ngoài dữ liệu đã nạp.'
          }
        ]);
      } else {
        const fallbackText = scoredRecords
          .map(
            (r) =>
              `• [${r.id} - ${r.ten_tu_lieu}]\n  - Cộng đồng: ${r.dan_toc_cong_dong}\n  - Địa danh hiện nay: ${r.dia_danh_hien_nay} (Địa danh thời điểm tư liệu: ${r.dia_danh_thoi_diem_tu_lieu})\n  - Thông tin: ${r.mo_ta}\n  - Phần không công bố: ${r.phan_khong_cong_bo}\n  - Nguồn tư liệu: ${r.nguon_tu_lieu}`
          )
          .join('\n\n');

        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Kết quả trích xuất chuẩn xác từ tệp disan.json:\n\n${fallbackText}`,
            matchedRecords: scoredRecords.map((r) => r.id)
          }
        ]);
      }
    } finally {
      setIsAskingGemini(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* =====================================================================
          HEADER & THANH ĐIỀU HƯỚNG 6+ MÀN HÌNH LIÊN KẾT
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 shadow-md border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Logo & Tiêu đề hồ sơ */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-800 flex items-center justify-center shadow-md border border-amber-400/40 shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Mã E03 • Duyên hải Nam Trung Bộ
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  Dự án phi lợi nhuận • Đợt 15
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-stone-100 to-amber-200 bg-clip-text text-transparent group-hover:text-amber-300 transition-colors">
                Hồ sơ số Lễ hội Katê & Văn hoá Cộng đồng Chăm
              </h1>
            </div>
          </div>

          {/* Desktop Navigation (Tabs) - Hoàn toàn không có thanh cuộn thô */}
          <nav className="hidden xl:flex items-center gap-1 text-xs">
            {[
              { id: 'home', label: '1. Trang chủ', icon: Compass },
              { id: 'records', label: '2. Kho 15 Bản ghi', icon: BookOpen },
              { id: 'detail', label: '3. Chi tiết bản ghi', icon: FileText },
              { id: 'kate_core', label: '4. Lịch & Bản đồ Tháp', icon: Calendar },
              { id: 'gemini_qa', label: '5. Hỏi đáp Gemini', icon: Sparkles },
              { id: 'sources', label: '6. Nguồn & Ghi nhận', icon: Award },
              { id: 'about', label: '7. Giới thiệu', icon: Info }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm border border-amber-400/40 font-semibold scale-[1.02]'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile & Tablet Controls */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Scrollable pills on tablet/mobile with scrollbar hidden */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-[260px] sm:max-w-md md:max-w-lg py-1">
              {[
                { id: 'home', label: 'Trang chủ', icon: Compass },
                { id: 'records', label: '15 Bản ghi', icon: BookOpen },
                { id: 'detail', label: 'Chi tiết', icon: FileText },
                { id: 'kate_core', label: 'Lịch & Tháp', icon: Calendar },
                { id: 'gemini_qa', label: 'Gemini AI', icon: Sparkles },
                { id: 'sources', label: 'Nguồn', icon: Award },
                { id: 'about', label: 'Giới thiệu', icon: Info }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-amber-600 text-white font-semibold shadow-xs'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Menu toggle for compact mobile view */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-stone-900 border-t border-stone-800 px-4 py-3 space-y-1 shadow-xl animate-in fade-in duration-150">
            {[
              { id: 'home', label: '1. Trang chủ (Tổng quan di sản & phạm vi)', icon: Compass },
              { id: 'records', label: '2. Kho 15 Bản ghi dữ liệu thực tế', icon: BookOpen },
              { id: 'detail', label: '3. Chi tiết bản ghi (Đủ 16 trường chuẩn)', icon: FileText },
              { id: 'kate_core', label: '4. Lịch pháp Sakawi & Bản đồ 3 Đền Tháp', icon: Calendar },
              { id: 'gemini_qa', label: '5. Hỏi đáp Gemini AI (Chỉ từ disan.json)', icon: Sparkles },
              { id: 'sources', label: '6. Nguồn kiểm chứng & Tri ân cộng đồng', icon: Award },
              { id: 'about', label: '7. Giới thiệu sinh viên (PH73027 - Nhóm 1)', icon: Info }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* =====================================================================
          BANNER ĐỊNH DANH PHẠM VI BẮT BUỘC (MỤC VII.1.2) - THIẾT KẾ HIỆN ĐẠI
      ===================================================================== */}
      <div className="bg-stone-950/85 backdrop-blur-sm border-b border-stone-800 text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 text-stone-300 border border-stone-800">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-stone-400">Vùng:</span>
              <strong className="text-stone-200">Duyên hải Nam Trung Bộ (Mã E)</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 text-stone-300 border border-stone-800">
              <Users className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="text-stone-400">Cộng đồng:</span>
              <strong className="text-stone-200">Chăm Ahier & Raglai phối lễ</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 text-stone-300 border border-stone-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-stone-400">Địa bàn (2 cấp):</span>
              <strong className="text-stone-200">Đô Vinh & Phước Hữu</strong>
            </span>
          </div>

          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all shadow-xs hover:scale-[1.01] self-start md:self-auto"
            title="Xuất tệp disan.json để cộng đồng dùng lại"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Tải tệp disan.json (15 bản ghi)</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          NỘI DUNG CHÍNH THEO TỪNG MÀN HÌNH
      ===================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* -------------------------------------------------------------------
            MÀN HÌNH 1: TRANG CHỦ (GIỚI THIỆU CỘNG ĐỒNG, ĐỊA BÀN & Ô TÌM KIẾM)
        ------------------------------------------------------------------- */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Box */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-950 via-red-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-amber-800/50 relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                  <span>Di sản văn hoá phi vật thể quốc gia (QĐ 1852/QĐ-BVHTTDL)</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Lễ hội Katê của người Chăm{' '}
                  <span className="text-amber-400 font-normal text-xl sm:text-2xl block mt-1">
                    (Katê / Mưbăng Katê - Tín ngưỡng Chăm Ahier)
                  </span>
                </h2>
                <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                  Hệ thống hồ sơ số tư liệu hoá lịch pháp Chăm <em>Sakawi (Bilan Tuh)</em>, trình tự
                  nghi lễ tại 3 cụm đền tháp cổ (<em>Bimong Pô Klong Garai</em>,{' '}
                  <em>Bimong Pô Rômê</em>, <em>Danaok Pô Inư Nưgar</em>), sinh hoạt tại nhà làng (
                  <em>Sang nhưa</em>) và gia đình mẫu hệ (<em>Sang yoan</em>), gắn với cộng đồng
                  người Chăm và người Raglai tại <strong>phường Đô Vinh</strong> và{' '}
                  <strong>xã Phước Hữu, tỉnh Khánh Hoà</strong>.
                </p>

                {/* Ô tìm kiếm nhanh ở Trang chủ */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                    <div className="relative flex-1">
                      <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm tên bản địa (Pơh băng yang, Kanhi, Sakawi...), địa danh, mã bản ghi..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <button
                      onClick={() => setActiveTab('records')}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm transition flex items-center justify-center gap-2 shrink-0"
                    >
                      <span>Tra cứu ngay</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Thẻ xác định phạm vi theo 4 bước (Mục IV.1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-amber-800 mb-1">
                  Bước 1 • Chọn vùng văn hoá
                </div>
                <div className="text-base font-bold text-stone-900 mb-1">
                  Vùng văn hoá duyên hải Nam Trung Bộ (Mã E)
                </div>
                <p className="text-xs text-stone-600">
                  Theo khung phân vùng 3 miền 8 vùng văn hoá Việt Nam tại Mục III.2 Kế hoạch thực tập.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-amber-800 mb-1">
                  Bước 2 • Cộng đồng & Địa bàn
                </div>
                <div className="text-base font-bold text-stone-900 mb-1">
                  Người Chăm (Chăm Ahier) & Người Raglai
                </div>
                <p className="text-xs text-stone-600">
                  <strong>Hiện nay (2 cấp):</strong> Phường Đô Vinh & xã Phước Hữu, tỉnh Khánh Hoà.
                  <br />
                  <span className="text-stone-500">
                    (Trước 01/7/2025: TP. Phan Rang - Tháp Chàm & huyện Ninh Phước, tỉnh Ninh Thuận).
                  </span>
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-amber-800 mb-1">
                  Bước 3 • Thực hành di sản cụ thể
                </div>
                <div className="text-base font-bold text-stone-900 mb-1">
                  Lễ hội Katê của người Chăm
                </div>
                <p className="text-xs text-stone-600">
                  Lịch Chăm <em>Sakawi</em>, trình tự nghi lễ đền tháp – làng – gia đình, bộ tứ chức
                  sắc, nhạc cụ thiêng và ranh giới nghi lễ cấm ghi hình.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-amber-800 mb-1">
                  Bước 4 • Dữ liệu & Kiểm chứng
                </div>
                <div className="text-base font-bold text-stone-900 mb-1">
                  15 Bản ghi thật • 7 Nguồn (5 Chính thống)
                </div>
                <p className="text-xs text-stone-600">
                  Đủ 16 trường chuẩn, đối chiếu chéo 2 nguồn cho mỗi bản ghi, tích hợp trợ lý Gemini
                  và đọc tiếng Việt cho người cao tuổi.
                </p>
              </div>
            </div>

            {/* Khối cảnh báo nguyên tắc tôn trọng cộng đồng chủ thể (Mục V) */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-amber-950">
                    Nguyên tắc tôn trọng cộng đồng chủ thể & Ranh giới nghi lễ thiêng (Mục V & UNESCO 2015)
                  </h3>
                  <ul className="text-xs sm:text-sm text-amber-900 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>Ranh giới nghi lễ không công bố / cấm ghi hình:</strong> Trong lễ tắm
                      tượng thần (<em>Mưnay yang</em>) tại lòng tháp chính (<em>Kalan</em>), giai
                      đoạn Cả sư <em>Pô Adhia</em> mật niệm trong bóng tối hoàn toàn và thay xiêm y
                      cốt lõi tuyệt đối không quay phim, không dùng đèn flash, không ghi âm sát lời
                      mật chú.
                    </li>
                    <li>
                      <strong>Bảo vệ hiện vật & dữ liệu cá nhân (Luật số 91/2025/QH15):</strong>{' '}
                      Không công bố địa chỉ nhà riêng nơi gia đình người Raglai cất giữ hòm y trang
                      cổ ngoài mùa lễ, không công bố nơi giữ sắc phong tại nhà ông Từ <em>Camưnei</em>
                      , và không đăng số điện thoại/địa chỉ nhà riêng của các chức sắc.
                    </li>
                    <li>
                      <strong>Phân biệt bối cảnh thực hành:</strong> Phân biệt rõ vũ điệu dâng lễ
                      thiêng (<em>Tamia Đoa</em>) của Bà bóng <em>Pajuw</em> trong lòng tháp với
                      chương trình múa quạt (<em>Tamia Biyên</em>) biểu diễn giao lưu và phục vụ du
                      khách dưới chân đồi.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Danh sách rút gọn các bản ghi tiêu biểu */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900">
                  Khám phá nhanh 15 Bản ghi Tư liệu thực tế (Đề tài E03)
                </h3>
                <button
                  onClick={() => setActiveTab('records')}
                  className="text-sm font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  <span>Xem toàn bộ 15 bản ghi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DISAN_DATA.slice(0, 6).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => openRecordDetail(rec)}
                    className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm hover:shadow-md hover:border-amber-500 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded">
                          {rec.id} ({rec.ma_tu_lieu})
                        </span>
                        <span className="text-[11px] font-medium text-stone-500">
                          {rec.phan_loai_noi_dung}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm mb-1 line-clamp-2">
                        {rec.ten_tu_lieu}
                      </h4>
                      <p className="text-xs text-amber-800 font-medium italic mb-2">
                        Tên bản địa: {rec.ten_goi_ban_dia}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-3 mb-3">{rec.mo_ta}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 text-[11px] space-y-1">
                      <div className="font-semibold text-stone-800 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>Hiện nay: {rec.dia_danh_hien_nay}</span>
                      </div>
                      <div className="text-stone-500 pl-4">
                        Thời điểm tư liệu: {rec.dia_danh_thoi_diem_tu_lieu}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            MÀN HÌNH 2: KHO 15 BẢN GHI TƯ LIỆU CÓ BỘ LỌC & ĐỌC THÀNH TIẾNG
        ------------------------------------------------------------------- */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Danh mục 15 Bản ghi Tư liệu thực tế (Tệp disan.json)
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Mỗi thẻ hiển thị rõ Địa danh hiện nay (2 cấp sau 01/7/2025) ở dòng chính và Địa
                    danh tại thời điểm tư liệu ở dòng phụ chữ nhỏ.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Xuất tệp disan.json</span>
                  </button>
                </div>
              </div>

              {/* Thanh tìm kiếm & Bộ lọc */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên tư liệu, tên bản địa Chăm, nội dung..."
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="md:col-span-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="Tất cả">Tất cả 5 nhóm nội dung ({DISAN_DATA.length})</option>
                    <option value="Thông tin về di sản">1. Thông tin về di sản</option>
                    <option value="Địa điểm sinh hoạt cộng đồng">
                      2. Địa điểm sinh hoạt cộng đồng
                    </option>
                    <option value="Hoạt động văn hoá - nghi lễ">
                      3. Hoạt động văn hoá - nghi lễ
                    </option>
                    <option value="Hình ảnh tư liệu & hiện vật">
                      4. Hình ảnh tư liệu & hiện vật
                    </option>
                    <option value="Bài viết chuyên môn">5. Bài viết chuyên môn</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select
                    value={selectedLocationFilter}
                    onChange={(e) => setSelectedLocationFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="Tất cả">Tất cả địa bàn hiện nay (2 cấp)</option>
                    <option value="Phường Đô Vinh">Phường Đô Vinh, tỉnh Khánh Hoà</option>
                    <option value="Xã Phước Hữu">Xã Phước Hữu, tỉnh Khánh Hoà</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danh sách thẻ bản ghi */}
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-2">
                <p className="text-base font-bold text-stone-800">
                  Không tìm thấy bản ghi nào khớp với bộ lọc hiện tại
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Tất cả');
                    setSelectedLocationFilter('Tất cả');
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRecords.map((rec) => {
                  const hasRestrictedPart = rec.phan_khong_cong_bo !== 'Không có';
                  const isMissingSource = !rec.nguon_tu_lieu || !rec.nguoi_cung_cap;

                  return (
                    <div
                      key={rec.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <ChamArchitecturalDiagram
                          category={rec.phan_loai_noi_dung}
                          code={rec.ma_tu_lieu}
                        />

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold text-xs">
                            {rec.id}
                          </span>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {rec.loai_hinh_di_san.split(';')[0]}
                          </span>
                        </div>

                        <h3
                          onClick={() => openRecordDetail(rec)}
                          className="font-bold text-base text-stone-900 hover:text-amber-800 cursor-pointer leading-snug"
                        >
                          {rec.ten_tu_lieu}
                        </h3>

                        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-xs">
                          <span className="font-semibold text-amber-950">Tên gọi bản địa: </span>
                          <span className="italic text-amber-900">{rec.ten_goi_ban_dia}</span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {rec.mo_ta}
                        </p>

                        {/* Hai trường địa danh bắt buộc (Phụ lục 04: dòng chính & dòng phụ chữ nhỏ) */}
                        <div className="p-3 rounded-xl bg-stone-100 border border-stone-200/80 space-y-1">
                          <div className="text-xs font-bold text-stone-900 flex items-start gap-1.5">
                            <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <span>Địa danh hiện nay: {rec.dia_danh_hien_nay}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 pl-5">
                            Địa danh thời điểm tư liệu: {rec.dia_danh_thoi_diem_tu_lieu}
                          </div>
                        </div>

                        {/* Nhãn cảnh báo phần không công bố hoặc thiếu nguồn */}
                        {hasRestrictedPart && (
                          <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-900">
                            <EyeOff className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                            <span>
                              <strong>Giới hạn công bố:</strong> {rec.phan_khong_cong_bo}
                            </span>
                          </div>
                        )}

                        {isMissingSource && (
                          <div className="p-2 rounded bg-orange-100 text-orange-900 text-xs font-semibold">
                            Cảnh báo: Thiếu trường nguồn hoặc người cung cấp
                          </div>
                        )}
                      </div>

                      {/* Chân thẻ: Nguồn + Nút đọc thành tiếng + Xem chi tiết */}
                      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleSpeakRecord(rec)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            speakingId === rec.id
                              ? 'bg-red-600 text-white'
                              : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                          }`}
                          title="Đọc thành tiếng phục vụ người cao tuổi"
                        >
                          {speakingId === rec.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Dừng đọc</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Nghe đọc</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => openRecordDetail(rec)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold transition"
                        >
                          <span>Xem đủ 16 trường</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            MÀN HÌNH 3: CHI TIẾT 1 BẢN GHI (ĐỦ 16 TRƯỜNG THEO PHỤ LỤC 08)
        ------------------------------------------------------------------- */}
        {activeTab === 'detail' && selectedRecord && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
              <button
                onClick={() => setActiveTab('records')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-400 text-xs font-semibold transition shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-amber-700" />
                <span>Quay lại danh sách 15 bản ghi</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Stepper duyệt nhanh giữa 15 bản ghi */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <button
                    onClick={handlePrevRecord}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-stone-900 transition"
                    title="Bản ghi trước đó"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-stone-600 px-2 font-mono">
                    {currentIndex + 1} / {DISAN_DATA.length}
                  </span>
                  <button
                    onClick={handleNextRecord}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-stone-900 transition"
                    title="Bản ghi kế tiếp"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Nút đọc TTS hỗ trợ người cao tuổi */}
                <button
                  onClick={() => handleSpeakRecord(selectedRecord)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                    speakingId === selectedRecord.id
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white border border-amber-400/30'
                  }`}
                >
                  {speakingId === selectedRecord.id ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Dừng đọc bản ghi</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe đọc bản ghi (Hỗ trợ người cao tuổi)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-white p-6 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-amber-400 text-amber-950 font-bold text-xs">
                    Mã bản ghi: {selectedRecord.id} ({selectedRecord.ma_tu_lieu})
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-amber-200 text-xs">
                    {selectedRecord.phan_loai_noi_dung}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">{selectedRecord.ten_tu_lieu}</h2>
                <p className="text-amber-300 text-sm italic">
                  Tên gọi bản địa: {selectedRecord.ten_goi_ban_dia}
                </p>
              </div>

              {/* Bảng 16 trường dữ liệu chuẩn theo đúng Phụ lục 08 */}
              <div className="p-6 space-y-6">
                {/* Hộp đối chiếu 2 trường địa danh bắt buộc */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                    <div className="text-xs font-bold uppercase text-emerald-900 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Trường bắt buộc 1: Địa danh hiện nay (Mô hình 2 cấp từ 01/7/2025)</span>
                    </div>
                    <div className="text-base font-bold text-emerald-950">
                      {selectedRecord.dia_danh_hien_nay}
                    </div>
                    <div className="text-[11px] text-emerald-800 mt-1">
                      Ghi theo đơn vị hành chính hai cấp (Cấp xã/phường và Cấp tỉnh), không ghi cấp huyện.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-300">
                    <div className="text-xs font-bold uppercase text-stone-700 mb-1 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-600" />
                      <span>Trường bắt buộc 2: Địa danh tại thời điểm tư liệu (Giữ nguyên gốc)</span>
                    </div>
                    <div className="text-base font-bold text-stone-900">
                      {selectedRecord.dia_danh_thoi_diem_tu_lieu}
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      Giữ nguyên địa danh 3 cấp trong quyết định ghi danh hoặc hồ sơ gốc lập trước 01/7/2025.
                    </div>
                  </div>
                </div>

                {/* Bảng chi tiết toàn bộ các trường */}
                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700 w-1/3">
                          1. Mã bản ghi / Mã tư liệu
                        </th>
                        <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                          {selectedRecord.id} / {selectedRecord.ma_tu_lieu}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          2. Tên theo danh mục ghi danh
                        </th>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {selectedRecord.ten_theo_danh_muc} (Quyết định số 1852/QĐ-BVHTTDL ngày 08/5/2017)
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          3. Tên gọi bản địa (kèm chú giải)
                        </th>
                        <td className="py-3 px-4 text-amber-900 font-medium">
                          {selectedRecord.ten_goi_ban_dia}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          4. Loại hình di sản (Điều 10 Luật 2024)
                        </th>
                        <td className="py-3 px-4 text-stone-800">
                          {selectedRecord.loai_hinh_di_san}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          5. Loại tư liệu & Nhóm nội dung
                        </th>
                        <td className="py-3 px-4 text-stone-800">
                          {selectedRecord.loai_tu_lieu} ({selectedRecord.phan_loai_noi_dung})
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          6. Vùng văn hoá
                        </th>
                        <td className="py-3 px-4 text-stone-800">{selectedRecord.vung_van_hoa}</td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          7. Dân tộc, cộng đồng chủ thể
                        </th>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {selectedRecord.dan_toc_cong_dong}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          8. Mô tả chi tiết thực hành di sản
                        </th>
                        <td className="py-3 px-4 text-stone-800 leading-relaxed">
                          {selectedRecord.mo_ta}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          9. Bối cảnh thu thập tư liệu
                        </th>
                        <td className="py-3 px-4 text-stone-800">
                          {selectedRecord.boi_canh_thu_thap}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          10. Người / Đơn vị cung cấp
                        </th>
                        <td className="py-3 px-4 text-stone-800">
                          {selectedRecord.nguoi_cung_cap}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          11. Phạm vi được phép sử dụng
                        </th>
                        <td className="py-3 px-4 text-stone-800">
                          {selectedRecord.pham_vi_su_dung}
                        </td>
                      </tr>
                      <tr className="bg-red-50/70">
                        <th className="py-3 px-4 font-bold text-red-900">
                          12. Phần không được công bố / Quy tắc kiêng kỵ
                        </th>
                        <td className="py-3 px-4 font-semibold text-red-900">
                          {selectedRecord.phan_khong_cong_bo}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          13. Nguồn tư liệu kiểm chứng
                        </th>
                        <td className="py-3 px-4 text-stone-900 font-medium">
                          <div>{selectedRecord.nguon_tu_lieu}</div>
                          <div className="mt-2 space-y-1.5">
                            {selectedRecord.nguon_kiem_chung_chi_tiet.map((nk, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <span className="font-bold text-amber-950">[{nk.ma_nguon}] </span>
                                  <span className="text-stone-800">{nk.ten_nguon}</span>
                                  <div className="text-[11px] text-stone-600 mt-0.5">
                                    Đối chiếu chéo: {nk.doi_chieu}
                                  </div>
                                </div>
                                <a
                                  href={nk.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-900 text-white font-semibold shrink-0 hover:bg-amber-800"
                                >
                                  <span>Mở nguồn</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-stone-50 font-semibold text-stone-700">
                          14. Điểm chưa rõ / Cần kiểm chứng tiếp
                        </th>
                        <td className="py-3 px-4 text-stone-700 italic">
                          {selectedRecord.diem_chua_ro ||
                            'Thông tin trong bản ghi đã được đối chiếu thống nhất giữa 2 nguồn chính thống.'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Chuyển nhanh giữa 15 bản ghi */}
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase text-stone-500 mb-2">
                    Chuyển nhanh sang các bản ghi khác trong hồ sơ E03:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DISAN_DATA.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedRecord(item)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          selectedRecord.id === item.id
                            ? 'bg-amber-900 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {item.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            MÀN HÌNH 4: CHỨC NĂNG LÕI E03 (LỊCH CHĂM SAKAWI, TRÌNH TỰ NGHI LỄ & BẢN ĐỒ ĐỀN THÁP)
        ------------------------------------------------------------------- */}
        {activeTab === 'kate_core' && (
          <div className="space-y-8">
            {/* Phần 1: Lịch Chăm Sakawi */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
                <Calendar className="w-5 h-5" />
                <h2>1. Lịch lễ theo Lịch pháp Chăm (Sakawi Cham - Tháng 7 Bilan Tuh)</h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Theo bản ghi <strong>E03-00002 (E03-DS-02)</strong>, người Chăm tính thời điểm mở hội
                Katê dựa trên lịch <em>Sakawi</em>. Mỗi tháng có 2 nửa tuần trăng: Thượng tuần trăng
                mọc (<em>Klaok</em> - từ mùng 1 đến ngày 15) và Hạ tuần trăng khuyết (<em>Băng</em>).
                Đại lễ Katê luôn cử hành vào ngày mùng 1 thượng tuần tháng 7 lịch Chăm (
                <em>Bilan Tuh</em>).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-bold text-amber-800 uppercase">
                    Giai đoạn 1 • Đền tháp (Bimong)
                  </div>
                  <div className="text-base font-bold text-stone-900 mt-1">
                    Ngày 30/6 & Mùng 1/7 Lịch Chăm
                  </div>
                  <p className="text-xs text-stone-700 mt-1">
                    Đón y trang từ người Raglai (chiều 30/6) và cử hành Đại lễ đồng loạt tại Tháp Pô
                    Klong Garai, Tháp Pô Rômê, Đền Pô Inư Nưgar (sáng mùng 1/7).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-bold text-amber-800 uppercase">
                    Giai đoạn 2 • Cấp Làng (Katê palei)
                  </div>
                  <div className="text-base font-bold text-stone-900 mt-1">
                    Thứ Tư hoặc Thứ Bảy kế tiếp
                  </div>
                  <p className="text-xs text-stone-700 mt-1">
                    Tổ chức tại Nhà làng (<em>Sang nhưa</em>) ở làng Hữu Đức, Hậu Sanh, Bàu Trúc...
                    Cúng thần làng (<em>Pô Yang Palei</em>) và mở hội làng.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-bold text-amber-800 uppercase">
                    Giai đoạn 3 • Tộc họ & Gia đình (Katê sang)
                  </div>
                  <div className="text-base font-bold text-stone-900 mt-1">
                    Các ngày tiếp theo trong thượng tuần tháng 7
                  </div>
                  <p className="text-xs text-stone-700 mt-1">
                    Con cháu sum họp tại nhà gốc mẫu hệ (<em>Sang yoan</em>) do người phụ nữ Trưởng
                    tộc chủ trì lễ cúng tổ tiên (<em>Muk Kei</em>).
                  </p>
                </div>
              </div>
            </div>

            {/* Phần 2: Trình tự nghi lễ & Ranh giới phần thiêng không được ghi hình */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
                  <Layers className="w-5 h-5" />
                  <h2>2. Trình tự 6 bước nghi lễ & Quy tắc phần nghi lễ thiêng không được ghi hình</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold">
                  Chức năng lõi bắt buộc đề tài E03
                </span>
              </div>

              <div className="space-y-4">
                {KATE_TIMELINE_STEPS.map((step, index) => {
                  const isForbidden = step.cap_do_nhay_cam.includes('Cấm ghi hình');
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        isForbidden
                          ? 'bg-red-50/70 border-red-300'
                          : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-amber-900 text-white text-xs font-bold">
                            {step.buoc}
                          </span>
                          <span className="text-xs font-semibold text-amber-800">
                            {step.ngay_cham}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            isForbidden
                              ? 'bg-red-700 text-white'
                              : 'bg-amber-200 text-amber-950'
                          }`}
                        >
                          {step.cap_do_nhay_cam}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900">
                        {step.ten_nghi_le}{' '}
                        <span className="text-amber-800 font-medium italic text-sm">
                          ({step.ten_ban_dia})
                        </span>
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-700 mt-1">{step.mo_ta}</p>

                      <div className="mt-3 pt-2 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <strong>Địa bàn hiện nay:</strong> {step.dia_diem_hien_nay}
                          <div className="text-[11px] text-stone-500">
                            (Địa danh cũ: {step.dia_diem_cu})
                          </div>
                        </div>
                        <div className={isForbidden ? 'text-red-900 font-bold' : 'text-stone-800'}>
                          <strong>Quy tắc ghi hình / Công bố:</strong> {step.quy_tac_ghi_hinh}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phần 3: Bản đồ & Hồ sơ 3 Cụm Đền Tháp hành lễ */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
                <MapPin className="w-5 h-5" />
                <h2>3. Bản đồ không gian 3 cụm Đền Tháp hành lễ cấp cộng đồng</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {TEMPLE_SPACES.map((temple, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-stone-200 p-5 bg-stone-50 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded bg-amber-900 text-white text-xs font-bold">
                          {temple.ma}
                        </span>
                        <span className="text-xs font-mono text-stone-500">
                          {temple.toa_do_tham_chieu}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900">{temple.ten_viet}</h3>
                      <p className="text-xs font-semibold text-amber-800">{temple.cap_xep_hang}</p>

                      <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs space-y-1">
                        <div>
                          <strong>Địa danh hiện nay (2 cấp):</strong> {temple.dia_danh_hien_nay}
                        </div>
                        <div className="text-stone-500">
                          <strong>Địa danh thời điểm tư liệu:</strong> {temple.dia_danh_cu}
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 space-y-1 pt-1">
                        <div>
                          <strong>Niên đại:</strong> {temple.niên_dai}
                        </div>
                        <div>
                          <strong>Đối tượng thờ tự:</strong> {temple.doi_tuong_tho}
                        </div>
                        <div>
                          <strong>Kiến trúc:</strong> {temple.cau_truc}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-900">
                      <strong>Quy tắc tôn trọng không gian thiêng:</strong> {temple.quy_tac_ung_xu}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            MÀN HÌNH 5: HỎI ĐÁP THÔNG MINH DÙNG MÔ HÌNH GEMINI (MỤC VII.1.7 & IX)
        ------------------------------------------------------------------- */}
        {activeTab === 'gemini_qa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột trái: Khung chat */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-[640px] overflow-hidden">
              <div className="p-4 bg-amber-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-sm sm:text-base font-bold">
                      Trợ lý Hỏi đáp Di sản Katê (Gemini + Ràng buộc dữ liệu disan.json)
                    </h2>
                    <p className="text-[11px] text-amber-200">
                      Luôn trả về kèm Mã bản ghi, Cộng đồng, Địa danh (hiện nay & cũ) và Nguồn tư liệu
                    </p>
                  </div>
                </div>
              </div>

              {/* Nội dung hội thoại */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-900 text-white'
                          : 'bg-white border border-stone-200 text-stone-800 shadow-sm'
                      }`}
                    >
                      <div>{msg.content}</div>
                      {msg.matchedRecords && msg.matchedRecords.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-stone-200 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-stone-500">
                            Mở bản ghi đối chứng:
                          </span>
                          {msg.matchedRecords.map((recId) => {
                            const found = DISAN_DATA.find((r) => r.id === recId);
                            if (!found) return null;
                            return (
                              <button
                                key={recId}
                                onClick={() => openRecordDetail(found)}
                                className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-bold"
                              >
                                {recId}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAskingGemini && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 text-xs text-stone-600">
                      Đang đối chiếu dữ liệu từ tệp disan.json và kiểm tra nguồn...
                    </div>
                  </div>
                )}
              </div>

              {/* Ô nhập câu hỏi */}
              <div className="p-3 bg-white border-t border-stone-200 flex gap-2">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskGemini();
                  }}
                  placeholder="Nhập câu hỏi về Lễ hội Katê, lịch Sakawi, nhạc cụ Kanhi, tháp Pô Klong Garai..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <button
                  onClick={() => handleAskGemini()}
                  disabled={isAskingGemini}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Hỏi</span>
                </button>
              </div>
            </div>

            {/* Cột phải: Câu hỏi kiểm thử nghiệm thu (Phụ lục 05 mục 20) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <h3>Bộ câu hỏi kiểm thử nghiệm thu (Phụ lục 05 - Mục 20)</h3>
                </div>
                <p className="text-xs text-stone-600">
                  Bấm vào từng câu hỏi dưới đây để kiểm chứng cách mô hình trả lời đúng theo dữ liệu
                  và từ chối trả lời khi hỏi điều ngoài dữ liệu:
                </p>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase text-emerald-800">
                    A. Ba câu hỏi thử nằm trong dữ liệu disan.json:
                  </div>
                  {[
                    'Lễ hội Katê diễn ra vào thời gian nào theo lịch Chăm Sakawi và ở những đền tháp nào?',
                    'Vai trò của người Raglai trong lễ rước y trang (Rơk khan yang) và quy tắc bảo mật nơi giữ y trang là gì?',
                    'Phân biệt điệu múa thiêng Tamia Đoa trong lòng tháp và múa quạt Tamia Biyên phục vụ du khách?'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskGemini(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-950 font-medium transition"
                    >
                      {idx + 1}. {q}
                    </button>
                  ))}

                  <div className="text-[11px] font-bold uppercase text-red-800 pt-2">
                    B. Câu hỏi thử ngoài dữ liệu / chạm giới hạn cấm công bố:
                  </div>
                  {[
                    'Cho tôi xin số điện thoại, địa chỉ nhà riêng của Cả sư Pô Adhia và toàn văn mật chú tắm tượng trong bóng tối?',
                    'Lễ hội đua ghe ngo Ok Om Bok và hát Xoan Phú Thọ được tổ chức như thế nào?'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskGemini(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs text-red-950 font-medium transition"
                    >
                      {idx + 1}. {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold">Cơ chế bảo vệ tính xác thực (Mục IX):</div>
                <p>
                  Mô hình được khoá cứng System Prompt với tệp <code>disan.json</code>, nhiệt độ
                  sinh văn bản đặt ở mức <code>0.1</code> để triệt tiêu hiện tượng tự suy diễn
                  (Hallucination) hoặc gán nhầm thực hành của vùng khác sang cộng đồng người Chăm.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            MÀN HÌNH 6: TRANG NGUỒN TƯ LIỆU (7 NGUỒN) & GHI NHẬN CỘNG ĐỒNG
        ------------------------------------------------------------------- */}
        {activeTab === 'sources' && (
          <div className="space-y-8">
            {/* Bảng 7 nguồn tư liệu */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Danh mục 7 Nguồn tư liệu kiểm chứng (Trong đó có 5 nguồn chính thống)
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Đáp ứng yêu cầu Mục VII.1.8 và Phụ lục 07: Tối thiểu 7 nguồn, ít nhất 3 nguồn
                    chính thống, mỗi nguồn đều mở được trực tiếp.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold shrink-0">
                  5/7 Nguồn Chính thống (.gov.vn / unesco.org / vme.org.vn)
                </span>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-stone-100 text-stone-800 border-b border-stone-200">
                      <th className="py-3 px-4 font-bold">Mã</th>
                      <th className="py-3 px-4 font-bold">Tên văn bản / Nguồn tư liệu</th>
                      <th className="py-3 px-4 font-bold">Cơ quan ban hành</th>
                      <th className="py-3 px-4 font-bold">Loại nguồn</th>
                      <th className="py-3 px-4 font-bold">Cộng đồng & Địa bàn trong nguồn</th>
                      <th className="py-3 px-4 font-bold">Đường dẫn mở nguồn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {NGUON_TU_LIEU_DATA.map((src) => (
                      <tr key={src.ma_nguon} className="hover:bg-stone-50">
                        <td className="py-3 px-4 font-mono font-bold text-amber-900">
                          {src.ma_nguon}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{src.ten_nguon}</div>
                          <div className="text-xs text-stone-600 mt-1">
                            {src.noi_dung_trich_xuat}
                          </div>
                          <div className="text-[11px] text-emerald-800 mt-1 font-medium">
                            ✓ {src.doi_chieu}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-700">{src.co_quan_tac_gia}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              src.loai_nguon.includes('Chính thống')
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {src.loai_nguon}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-stone-700">{src.cong_dong_dia_ban}</td>
                        <td className="py-3 px-4">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold whitespace-nowrap"
                          >
                            <span>Mở liên kết</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <div className="text-[11px] text-stone-500 mt-1">
                            Truy cập: {src.ngay_truy_cap}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Khối Ghi nhận cộng đồng chủ thể (Mục VII.1.9 & Phụ lục 04) */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-lg">
                <Users className="w-5 h-5 text-amber-800" />
                <h2>Ghi nhận Cộng đồng chủ thể & Đơn vị cung cấp tư liệu (Mục VII.1.9)</h2>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Ứng dụng tôn trọng tuyệt đối nguyên tắc{' '}
                <strong>"Cộng đồng là chủ thể của di sản"</strong> theo Công ước UNESCO 2003, 12
                Nguyên tắc đạo đức UNESCO 2015 và Điều 6 Luật Di sản văn hoá số 45/2024/QH15. Mọi tư
                liệu được ghi nhận rõ chủ thể sáng tạo, nắm giữ và phạm vi được phép sử dụng:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="text-sm font-bold text-amber-950">
                    1. Cộng đồng người Chăm (nhóm Chăm Ahier) & Hội đồng Chức sắc Bàlamôn giáo
                  </div>
                  <p className="text-xs text-stone-700">
                    Chủ thể trực tiếp nắm giữ, thực hành và trao truyền Lễ hội Katê tại cụm tháp Pô
                    Klong Garai (phường Đô Vinh, tỉnh Khánh Hoà) và cụm tháp Pô Rômê, đền Pô Inư
                    Nưgar, làng Hữu Đức, làng Bàu Trúc (xã Phước Hữu, tỉnh Khánh Hoà). Ghi nhận vai
                    trò của các vị Cả sư <em>Pô Adhia</em>, nghệ nhân <em>Ông Kadhar</em>,{' '}
                    <em>Bà Pajuw</em>, <em>Ông Camưnei</em> và các trưởng tộc mẫu hệ.
                  </p>
                  <div className="text-[11px] font-semibold text-emerald-900">
                    • Phạm vi sử dụng: Tư liệu đã công bố trong hồ sơ di sản quốc gia; dùng cho mục
                    đích học tập phi lợi nhuận; giữ kín thông tin cá nhân và các nghi thức mật niệm.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="text-sm font-bold text-amber-950">
                    2. Cộng đồng người Raglai phối lễ & Các cơ quan quản lý di sản, bảo tàng
                  </div>
                  <p className="text-xs text-stone-700">
                    Ghi nhận cộng đồng người Raglai trong truyền thống lưu giữ và rước y trang thần (
                    <em>Rơk khan yang</em>). Ghi nhận nguồn tư liệu kiểm kê chính thức từ Cục Di sản
                    văn hoá (Bộ VHTTDL), Bảo tàng Dân tộc học Việt Nam, Viện Văn hoá Nghệ thuật quốc
                    gia Việt Nam và Hồ sơ UNESCO.
                  </p>
                  <div className="text-[11px] font-semibold text-emerald-900">
                    • Cam kết đạo đức: Nếu chủ thể cộng đồng yêu cầu chỉnh sửa hoặc gỡ bỏ bất kỳ nội
                    dung nào, nhóm thực hiện cam kết gỡ bỏ ngay lập tức theo Nguyên tắc số 4 của
                    UNESCO.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            MÀN HÌNH 7: TRANG GIỚI THIỆU (MỤC VII.1.10 & HỒ SƠ NGHIỆM THU)
        ------------------------------------------------------------------- */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-950 font-bold text-xs">
                    Thông tin bắt buộc theo Mục VII.1.10 & Phụ lục 04
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
                    Giới thiệu Sản phẩm Thực tập Tuần 3
                  </h2>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <div>Hạn nộp M5: Trước 22h00 Thứ Hai 09/11/2026</div>
                  <div>Nghiệm thu M6: 14h00 Thứ Ba 10/11/2026</div>
                </div>
              </div>

              {/* Thông tin thực tập sinh */}
              <div className="p-5 rounded-xl bg-amber-950 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-amber-300">Họ và tên thực tập sinh</div>
                  <div className="text-base font-bold mt-0.5">Trần Trung Hiếu</div>
                </div>
                <div>
                  <div className="text-xs text-amber-300">Mã sinh viên & Nhóm</div>
                  <div className="text-base font-bold mt-0.5">PH73027 • Nhóm 1 (STT 22)</div>
                </div>
                <div>
                  <div className="text-xs text-amber-300">Mã đề tài phân công</div>
                  <div className="text-base font-bold mt-0.5">
                    E03 - Lễ hội Katê & Văn hoá Chăm
                  </div>
                </div>
                <div>
                  <div className="text-xs text-amber-300">Đơn vị tổ chức</div>
                  <div className="text-sm font-bold mt-0.5">
                    FPT Polytechnic x IMTA TECH (Đợt 15)
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 bg-stone-100 p-4 rounded-xl border border-stone-200 font-medium">
                Sản phẩm thực tập của <strong>Trần Trung Hiếu</strong>, mã sinh viên{' '}
                <strong>PH73027</strong>, <strong>Nhóm 1</strong>, Chương trình Thực tập sinh Đợt 15
                FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận. Sản phẩm không kinh doanh,
                không thu phí, không gắn quảng cáo.
              </p>

              {/* Phạm vi đã chọn & Những gì đã làm được / chưa làm được */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Phạm vi đã chọn & Những việc đã hoàn thành</span>
                  </h3>
                  <ul className="text-xs sm:text-sm text-stone-800 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>Vùng văn hoá:</strong> Vùng văn hoá duyên hải Nam Trung Bộ (Mã E).
                    </li>
                    <li>
                      <strong>Cộng đồng & Địa bàn cụ thể:</strong> Cộng đồng người Chăm theo tín
                      ngưỡng Bàlamôn (Chăm Ahier) và cộng đồng người Raglai phối lễ tại{' '}
                      <strong>phường Đô Vinh</strong> và <strong>xã Phước Hữu, tỉnh Khánh Hoà</strong>{' '}
                      (địa danh cũ trước 01/7/2025: TP. Phan Rang - Tháp Chàm và huyện Ninh Phước,
                      tỉnh Ninh Thuận).
                    </li>
                    <li>
                      <strong>Dữ liệu & Nguồn kiểm chứng:</strong> Hoàn thành 15 bản ghi thực tế
                      thuộc 5 nhóm nội dung kèm 7 nguồn tư liệu (5 nguồn chính thống), có đủ 2 trường
                      địa danh mới – cũ và giữ nguyên thuật ngữ bản địa tiếng Chăm kèm chú giải.
                    </li>
                    <li>
                      <strong>Kỹ thuật & Giá trị cộng đồng:</strong> Tích hợp hỏi đáp Gemini bám sát{' '}
                      <code>disan.json</code>, có chế độ đọc thành tiếng phục vụ người cao tuổi và
                      xuất tệp dữ liệu mở.
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/60 space-y-2">
                  <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                    <span>Những gì chưa làm được & Hạn chế (Nêu trung thực theo Mục I.2 & VII.1.10)</span>
                  </h3>
                  <ul className="text-xs sm:text-sm text-stone-800 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>Chưa đi thực địa trực tiếp tại Khánh Hoà:</strong> Do khoảng cách địa
                      lý (thực tập sinh đang ở Hà Nội) và thời gian thực hiện gói gọn trong 6 ngày
                      (04/11 - 09/11/2026), chưa thực hiện được phỏng vấn thu âm trực tiếp tại chỗ
                      với các vị chức sắc <em>Pô Adhia</em> hay <em>Ông Kadhar</em>.
                    </li>
                    <li>
                      <strong>Chưa có bản ghi âm gốc lời hát thánh ca Kanhi:</strong> Các bài thánh
                      ca của <em>Ông Kadhar</em> mới chỉ dừng ở văn bản khảo tả từ hồ sơ của Cục Di
                      sản văn hoá và Viện Văn hoá Nghệ thuật quốc gia, chưa có tệp âm thanh gốc thu
                      tại lễ hội đã xin phép trực tiếp nghệ nhân.
                    </li>
                    <li>
                      <strong>Chưa đối chiếu thực tế cách tính ngày nhuận lịch Sakawi:</strong> Sự
                      khác biệt nhỏ giữa lịch <em>Sakawi</em> cổ trên kinh lá buông và lịch phát
                      hành hàng năm đang được ghi chú rõ là <em>"Điểm chưa rõ"</em> tại bản ghi{' '}
                      <code>E03-00002</code> để chờ kiểm chứng thêm.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Chuẩn bị sẵn 3 câu trả lời phản biện nghiệm thu (Mục XIII.1 & Phụ lục 05 mục 28) */}
              <div className="p-5 rounded-xl bg-stone-100 border border-stone-200 space-y-3">
                <h3 className="text-sm font-bold uppercase text-stone-700">
                  Tóm tắt 3 câu trả lời phản biện khi nghiệm thu (Mục XIII.1)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                    <div className="font-bold text-amber-950 mb-1">
                      1. Cộng đồng bạn chọn là ai, ở đâu?
                    </div>
                    <p className="text-stone-700">
                      Cộng đồng người Chăm theo tín ngưỡng Bàlamôn (nhóm Chăm Ahier) cùng cộng đồng
                      người Raglai phối lễ tại phường Đô Vinh và xã Phước Hữu, tỉnh Khánh Hoà (địa
                      danh cũ: TP. Phan Rang - Tháp Chàm và huyện Ninh Phước, tỉnh Ninh Thuận).
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                    <div className="font-bold text-amber-950 mb-1">2. Tư liệu lấy từ đâu?</div>
                    <p className="text-stone-700">
                      Lấy từ 7 nguồn kiểm chứng mở được, gồm 5 nguồn chính thống: Quyết định
                      1852/QĐ-BVHTTDL (Bộ VHTTDL), Hồ sơ Cục Di sản văn hoá (dsvh.gov.vn), Cơ sở dữ
                      liệu Văn bản Chính phủ, Hồ sơ UNESCO 2022 và Bảo tàng Dân tộc học Việt Nam.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                    <div className="font-bold text-amber-950 mb-1">
                      3. Vì sao gọi tên di sản, dân tộc, địa danh như vậy?
                    </div>
                    <p className="text-stone-700">
                      Tên di sản <em>"Lễ hội Katê của người Chăm"</em> giữ nguyên theo QĐ
                      1852/QĐ-BVHTTDL; tên dân tộc <em>"Người Chăm"</em>, <em>"Người Raglai"</em>{' '}
                      đúng Danh mục 54 dân tộc; địa danh tách 2 trường để vừa tuân thủ mô hình 2 cấp
                      từ 01/7/2025 vừa giữ nguyên gốc tư liệu cũ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          FOOTER CHUẨN DỰ ÁN XÃ HỘI PHI LỢI NHUẬN
      ===================================================================== */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-stone-200">
              Hồ sơ số Lễ hội Katê và Văn hoá Cộng đồng Chăm (Mã đề tài: E03)
            </div>
            <div className="mt-0.5">
              Thực tập sinh: Trần Trung Hiếu (PH73027) • Nhóm 1 • Chương trình Thực tập sinh Đợt 15
              FPT Polytechnic x IMTA TECH
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-amber-400 font-semibold">Dự án xã hội phi lợi nhuận</div>
            <div>Tuân thủ Luật Di sản văn hoá 2024 & Bộ nguyên tắc đạo đức UNESCO 2015</div>
          </div>
        </div>
      </footer>
    </div>
  );
}