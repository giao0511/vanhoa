import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Load heritage records from src/disan.json for grounding
const disanDataPath = path.resolve(__dirname, 'src', 'disan.json');
let disanRecords: any[] = [];
try {
  const fileContent = fs.readFileSync(disanDataPath, 'utf-8');
  disanRecords = JSON.parse(fileContent);
} catch (e) {
  console.error('Error reading disan.json:', e);
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Heritage Q&A API Endpoint
app.post('/api/gemini/qa', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Câu hỏi không hợp lệ.' });
      return;
    }

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      res.status(400).json({ error: 'Nội dung câu hỏi đang để trống.' });
      return;
    }

    // System instruction strictly enforces answering ONLY from disan.json data
    const systemInstruction = `Bạn là Trợ lý Tri thức số Di sản Văn hóa E03 - Lễ hội Katê của đồng bào Chăm Ahier (Bàlamôn) và đồng bào Raglai tại duyên hải Nam Trung Bộ (tập trung tại phường Đô Vinh và xã Phước Hữu, tỉnh Ninh Thuận).
DỰ ÁN XÃ HỘI PHI LỢI NHUẬN: Chương trình Thực tập sinh Đợt 15 (IMTA TECH x FPT Polytechnic) - Nhóm 1 - Sinh viên Trần Trung Hiếu (MSV: PH73027).

NGUYÊN TẮC BẢO VỆ DI SẢN & PHÁP LÝ BẮT BUỘC:
1. Bạn CHỈ ĐƯỢC PHÉP trả lời HOÀN TOÀN dựa trên tệp dữ liệu di sản 15 bản ghi dưới đây. TUYỆT ĐỐI KHÔNG tự sáng tạo hoặc suy đoán thông tin ngoài tệp dữ liệu.
2. NẾU câu hỏi KHÔNG có trong dữ liệu 15 bản ghi (hoặc hỏi về đề tài khác, người khác, phong tục khác không có trong danh sách), bạn BẮT BUỘC phải mở đầu hoặc thông báo rõ ràng bằng cụm từ:
"Chưa có tư liệu trong cơ sở dữ liệu di sản E03." Sau đó nêu ngắn gọn gợi ý người dùng hỏi về các chủ đề có sẵn trong tư liệu (Tháp Po Klong Garai, Tháp Po Rome, Lễ Mở cửa tháp, Rước y phục người Raglai, Nhạc cụ Ginang - Baranưng - Saranai, Trang phục Awa Baoh Diet, Thầy Cả sư Po Adhia, v.v.).
3. Khi câu hỏi CÓ THÔNG TIN trong dữ liệu, câu trả lời BẮT BUỘC PHẢI BAO GỒM ĐẦY ĐỦ 4 TRƯỜNG DỮ LIỆU ĐẶC THÙ sau (được trình bày định dạng rõ ràng, đẹp mắt):
- [Tên bản ghi]: Nêu chính xác tên bản ghi có trong tư liệu
- [Cộng đồng]: Chỉ rõ cộng đồng liên quan (Cộng đồng người Chăm Ahier hoặc cộng đồng phối lễ người Raglai)
- [Địa danh]:
  + Địa danh hiện nay (mô hình 2 cấp): Tỉnh Ninh Thuận - Phường Đô Vinh HOẶC Tỉnh Ninh Thuận - Xã Phước Hữu
  + Địa danh tại thời điểm tư liệu cũ: (Ghi chính xác địa danh lịch sử có trong bản ghi)
- [Nội dung giải đáp chi tiết]: Trình bày chi tiết, chuẩn xác từ trường noi_dung_mo_ta, chu_the_thuc_hien, hien_vat_nhac_cu, y_nghia_gia_tri
- [Nguồn tư liệu kiểm chứng]: Ghi rõ nguồn kiểm chứng từ bản ghi
4. Tuân thủ Luật Bảo vệ dữ liệu cá nhân 2025: Tuyệt đối không hiển thị thông tin cá nhân nhạy cảm (SĐT, địa chỉ nhà riêng) của các vị chức sắc hay nghệ nhân.
5. Tuyệt đối không dùng hoặc khuyên dùng ảnh AI cho con người hay nghi lễ thiêng.

DỮ LIỆU DI SẢN GỐC (15 BẢN GHI):
${JSON.stringify(disanRecords, null, 2)}`;

    let reply = '';
    const hasValidKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY');

    if (hasValidKey) {
      try {
        const response = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: trimmedQuestion,
            config: {
              systemInstruction: systemInstruction,
            },
          }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 7000))
        ]);

        reply = response.text || '';
      } catch (geminiErr) {
        console.warn('Gemini API call timed out or failed, utilizing dataset matcher:', geminiErr);
      }
    }

    if (!reply) {
      // Local fallback matcher strictly grounded in disan.json
      const qLower = trimmedQuestion.toLowerCase();
      const isOutOfScope =
        qLower.includes('nước mỹ') ||
        qLower.includes('tổng thống') ||
        qLower.includes('thời tiết') ||
        qLower.includes('iphone') ||
        qLower.includes('bóng đá') ||
        qLower.includes('bitcoin') ||
        qLower.includes('ai là người sáng lập');

      if (isOutOfScope) {
        reply = 'Chưa có tư liệu trong cơ sở dữ liệu di sản E03. Xin vui lòng đặt câu hỏi liên quan đến Lễ hội Katê, tháp Po Klong Garai (Đô Vinh), tháp Po Rome (Phước Hữu), nghi thức rước y phục người Raglai hoặc các hiện vật, bài ca nghi lễ trong hồ sơ.';
      } else {
        let matched = disanRecords.find(r => 
          qLower.includes(r.id.toLowerCase()) || 
          qLower.includes(r.ten_ban_ghi.toLowerCase()) ||
          (qLower.includes('nhạc cụ') && r.id === 'DS-KATE-09') ||
          (qLower.includes('saranai') && r.id === 'DS-KATE-09') ||
          (qLower.includes('ginang') && r.id === 'DS-KATE-09') ||
          (qLower.includes('mở cửa tháp') && r.id === 'DS-KATE-06') ||
          (qLower.includes('raglai') && r.id === 'DS-KATE-04') ||
          (qLower.includes('po klong garai') && r.id === 'DS-KATE-02') ||
          (qLower.includes('po rome') && r.id === 'DS-KATE-03') ||
          (qLower.includes('thời gian') && r.id === 'DS-KATE-01') ||
          (qLower.includes('ý nghĩa') && r.id === 'DS-KATE-01')
        );

        if (!matched) {
          for (const r of disanRecords) {
            const tokens = r.chu_de.toLowerCase().split(' ').filter((t: string) => t.length > 3);
            if (tokens.some((t: string) => qLower.includes(t))) {
              matched = r;
              break;
            }
          }
        }

        if (matched) {
          reply = `📌 THÔNG TIN DI SẢN XÁC THỰC:

• [Tên bản ghi]: ${matched.ten_ban_ghi} (${matched.id})
• [Cộng đồng]: ${matched.cong_dong}
• [Địa danh]:
  - Địa danh hiện nay (mô hình 2 cấp): ${matched.dia_danh_hien_nay}
  - Địa danh tại thời điểm tư liệu cũ: ${matched.dia_danh_thoi_diem_cu}

📖 [Nội dung giải đáp chi tiết]:
${matched.noi_dung_mo_ta}

✨ [Ý nghĩa giá trị & Hiện vật]:
- Ý nghĩa: ${matched.y_nghia_gia_tri}
- Hiện vật / Nhạc cụ: ${matched.hien_vat_nhac_cu}
- Chủ thể thực hiện: ${matched.chu_the_thuc_hien}
- Thời gian: ${matched.thoi_gian_dien_ra}

🔍 [Nguồn tư liệu kiểm chứng]:
${matched.nguon_kiem_chung}

⚖️ [Quyền công bố]: ${matched.gioi_han_quyen_cong_bo} (Tuân thủ Luật BVBDCN 2025; Không sử dụng ảnh do AI sinh cho con người hay nghi lễ).`;
        } else {
          reply = 'Chưa có tư liệu trong cơ sở dữ liệu di sản E03. Xin vui lòng đặt câu hỏi liên quan đến Lễ hội Katê, tháp Po Klong Garai (Đô Vinh), tháp Po Rome (Phước Hữu), nghi thức rước y phục người Raglai hoặc các hiện vật, bài ca nghi lễ trong hồ sơ.';
        }
      }
    }

    res.json({
      success: true,
      answer: reply,
      source: hasValidKey ? 'gemini-3.8-flash' : 'disan-grounding-engine',
    });
  } catch (error: any) {
    console.error('Gemini QA API Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi xảy ra khi xử lý truy vấn AI.',
    });
  }
});

// Provide records API if needed
app.get('/api/disan/records', (req, res) => {
  res.json(disanRecords);
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
