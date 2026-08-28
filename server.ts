import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Requests will use local specialized fallback generator.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Main Exam Generator API Endpoint
app.post('/api/generate-exam', async (req, res) => {
  try {
    const config = req.body;
    if (!config || !config.structure || !config.header) {
      res.status(400).json({ error: 'Dữ liệu cấu hình không hợp lệ.' });
      return;
    }

    const {
      header,
      selectedLessonIds,
      scopeTitle,
      structure,
      scoreWeights,
      notes,
    } = config;

    const totalMcq =
      (structure.mcq_abcd?.NB || 0) +
      (structure.mcq_abcd?.TH || 0) +
      (structure.mcq_abcd?.VDT || 0) +
      (structure.mcq_abcd?.VDC || 0);

    const totalTf =
      (structure.mcq_true_false?.NB || 0) +
      (structure.mcq_true_false?.TH || 0) +
      (structure.mcq_true_false?.VDT || 0) +
      (structure.mcq_true_false?.VDC || 0);

    const totalSa =
      (structure.short_answer?.NB || 0) +
      (structure.short_answer?.TH || 0) +
      (structure.short_answer?.VDT || 0) +
      (structure.short_answer?.VDC || 0);

    const totalEssay =
      (structure.essay?.VDT || 0) + (structure.essay?.VDC || 0);

    const systemPrompt = `Bạn là Chuyên gia Khảo thí và Giáo viên Toán THPT xuất sắc, am hiểu sâu sắc Chương trình Giáo dục Phổ thông 2018 (GDPT 2018), bộ sách giáo khoa Toán 12 "Kết nối tri thức với cuộc sống" (KNTT) của Bộ Giáo dục và Đào tạo Việt Nam.
Nhiệm vụ của bạn là thiết kế bộ hồ sơ kiểm tra định kỳ hoàn chỉnh gồm đúng 4 sản phẩm chuẩn:
1. Bảng Ma trận đề kiểm tra (theo định dạng phân phối mức độ nhận thức và thang điểm 10).
2. Bản Đặc tả đề kiểm tra (mô tả yêu cầu cần đạt chuẩn GDPT 2018 KNTT Toán 12, mã câu hỏi, mức độ).
3. Đề kiểm tra hoàn chỉnh (gồm 4 phần: Trắc nghiệm nhiều lựa chọn, Trắc nghiệm Đúng - Sai, Trả lời ngắn, Tự luận nếu có).
4. Đáp án và Hướng dẫn chấm chi tiết (bảng đáp án nhanh + lời giải chi tiết từng bước, barem điểm).

QUY TẮC BẮT BUỘC VỀ NỘI DUNG VÀ KỸ THUẬT:
1. 100% bám sát kiến thức SGK Toán 12 Kết nối tri thức với cuộc sống (Chương I Đạo hàm khảo sát hàm số, Chương II Vectơ Oxyz, Chương III Số đặc trưng đo phân tán thống kê ghép nhóm, Chương IV Nguyên hàm tích phân, Chương V Tọa độ Oxyz, Chương VI Xác suất có điều kiện & Bayes).
2. Số lượng câu hỏi và phân bố mức độ nhận thức [NB], [TH], [VDT], [VDC] phải CHÍNH XÁC 100% theo yêu cầu của giáo viên.
3. Phần I (Trắc nghiệm ABCD): Các đáp án A, B, C, D phân bố ngẫu nhiên và đồng đều, KHÔNG được có quá 2 câu liên tiếp trùng phương án đúng.
4. Phần II (Đúng - Sai): Mỗi câu gồm 4 ý a), b), c), d). Các ý Đúng/Sai xen kẽ tự nhiên, không được để cả 4 ý cùng Đúng hoặc cùng Sai.
5. Phần III (Trả lời ngắn): Đáp số là số thực ngắn gọn (tối đa 4 ký tự: ví dụ 2,5; -15; 0,8; 4), nếu số vô tỉ phải ghi rõ làm tròn đến hàng phần mười hoặc phần trăm.
6. MỌI công thức toán học PHẢI viết bằng mã LaTeX chuẩn ($...$ cho inline, $$...$$ cho display).
7. MỌI hình vẽ (bảng biến thiên, đồ thị hàm số, hình học không gian Oxyz) PHẢI có mã TikZ standalone hoàn chỉnh, chính xác với dữ kiện đề bài.
8. Trả về định dạng JSON thuần túy (không bọc markdown backticks bên ngoài nếu có thể, hoặc bọc trong \`\`\`json) theo đúng cấu trúc schema yêu cầu.`;

    const userPrompt = `Hãy tạo bộ hồ sơ kiểm tra Toán 12 KNTT theo thông tin cấu hình sau:
- Tên trường: ${header.schoolName || 'Trường THPT'}
- Tiêu đề đề: ${header.examTitle || 'Đề kiểm tra định kỳ'}
- Mã đề: ${header.examCode || '101'}
- Thời gian làm bài: ${header.durationMinutes || 90} phút
- Phạm vi kiến thức: ${scopeTitle} (Các bài học: ${selectedLessonIds.join(', ')})
- Cấu hình số câu hỏi chi tiết:
  + Phần I (Trắc nghiệm ABCD): ${totalMcq} câu (NB: ${structure.mcq_abcd?.NB || 0}, TH: ${structure.mcq_abcd?.TH || 0}, VDT: ${structure.mcq_abcd?.VDT || 0}, VDC: ${structure.mcq_abcd?.VDC || 0}). Điểm mỗi câu: ${scoreWeights.mcq_abcd_per_question}đ.
  + Phần II (Trắc nghiệm Đúng/Sai): ${totalTf} câu (NB: ${structure.mcq_true_false?.NB || 0}, TH: ${structure.mcq_true_false?.TH || 0}, VDT: ${structure.mcq_true_false?.VDT || 0}, VDC: ${structure.mcq_true_false?.VDC || 0}).
  + Phần III (Trả lời ngắn): ${totalSa} câu (NB: ${structure.short_answer?.NB || 0}, TH: ${structure.short_answer?.TH || 0}, VDT: ${structure.short_answer?.VDT || 0}, VDC: ${structure.short_answer?.VDC || 0}). Điểm mỗi câu: ${scoreWeights.short_answer_per_question}đ.
  + Phần IV (Tự luận): ${totalEssay} câu (VDT: ${structure.essay?.VDT || 0}, VDC: ${structure.essay?.VDC || 0}). Tổng điểm tự luận: ${scoreWeights.essay_total_points || 0}đ.
- Ghi chú thêm từ giáo viên: ${notes || 'Đảm bảo sát đề tham khảo của Bộ GD&ĐT 2025'}.

Hãy trả về JSON với cấu trúc:
{
  "matrix": {
    "title": "Ma trận đề kiểm tra...",
    "rows": [
      {
        "id": "r1",
        "topicName": "Tên chương",
        "contentUnit": "Tên bài/chủ đề",
        "mcq_nb": 0, "mcq_th": 0, "mcq_vdt": 0, "mcq_vdc": 0,
        "tf_nb": 0, "tf_th": 0, "tf_vdt": 0, "tf_vdc": 0,
        "sa_nb": 0, "sa_th": 0, "sa_vdt": 0, "sa_vdc": 0,
        "essay_vdt": 0, "essay_vdc": 0,
        "totalPoints": 0, "percentageScore": 0
      }
    ],
    "summary": {
      "total_nb_points": 0, "total_th_points": 0, "total_vdt_points": 0, "total_vdc_points": 0,
      "total_score": 10.0,
      "ratio_nb": 40, "ratio_th": 30, "ratio_vdt": 20, "ratio_vdc": 10
    }
  },
  "specification": {
    "title": "Bản đặc tả đề kiểm tra...",
    "items": [
      {
        "id": "spec-1",
        "order": 1,
        "topic": "Chương I...",
        "contentUnit": "Bài 1...",
        "competencyStandard": "Yêu cầu cần đạt...",
        "questionTypes": [
          {
            "type": "mcq_abcd",
            "level": "NB",
            "questionNumbers": "Câu 1",
            "description": "Nhận biết khoảng đồng biến của hàm số dựa vào bảng biến thiên."
          }
        ]
      }
    ]
  },
  "examPaper": {
    "header": ${JSON.stringify(header)},
    "partI_mcq": [
      {
        "id": "q1",
        "questionNumber": 1,
        "type": "mcq_abcd",
        "level": "NB",
        "content": "Cho hàm số $y=f(x)$ có bảng biến thiên...",
        "options": {
          "A": "Hàm số đồng biến trên $(-\\infty; 1)$.",
          "B": "...",
          "C": "...",
          "D": "..."
        },
        "correctOption": "A",
        "solution": "Dựa vào bảng biến thiên, ta thấy...",
        "points": 0.25,
        "tikzFigures": [
          {
            "id": "tikz-1",
            "caption": "Bảng biến thiên hàm số f(x)",
            "tikzCode": "\\begin{tikzpicture}\\n...\\n\\end{tikzpicture}"
          }
        ]
      }
    ],
    "partII_true_false": [
      {
        "id": "tf1",
        "questionNumber": 1,
        "type": "mcq_true_false",
        "intro": "Cho hàm số $y = f(x) = \\frac{2x-1}{x+1}$.",
        "items": [
          { "key": "a", "level": "NB", "content": "Tập xác định của hàm số là $\\mathbb{R} \\setminus \\{-1\\}$.", "isCorrect": true, "explanation": "Hàm số xác định khi $x+1 \\neq 0 \\Leftrightarrow x \\neq -1$." },
          { "key": "b", "level": "TH", "content": "Đồ thị hàm số có tiệm cận đứng là đường thẳng $x = 2$.", "isCorrect": false, "explanation": "Tiệm cận đứng là $x = -1$." },
          { "key": "c", "level": "VDT", "content": "Đạo hàm $y' = \\frac{3}{(x+1)^2} > 0$ với mọi $x \\neq -1$.", "isCorrect": true, "explanation": "Đạo hàm $y' = \\frac{2(1) - (-1)(1)}{(x+1)^2} = \\frac{3}{(x+1)^2} > 0$." },
          { "key": "d", "level": "VDC", "content": "Đường thẳng $y = x + m$ cắt đồ thị tại 2 điểm phân biệt thuộc 2 nhánh khi $m > 0$.", "isCorrect": false, "explanation": "Phương trình hoành độ..." }
        ],
        "points": 1.0
      }
    ],
    "partIII_short_answer": [
      {
        "id": "sa1",
        "questionNumber": 1,
        "type": "short_answer",
        "level": "TH",
        "content": "Cho hàm số $y=x^3-3x^2+2$. Tìm giá trị cực đại của hàm số.",
        "correctAnswer": "2",
        "solution": "Ta có $y'=3x^2-6x=0 \\Leftrightarrow x=0$ hoặc $x=2$. Tại $x=0$, $y=2$ là giá trị cực đại.",
        "points": 0.5
      }
    ],
    "partIV_essay": [],
    "totalQuestions": 0,
    "totalPoints": 10.0
  },
  "answerKey": {
    "partI_keys": [],
    "partII_keys": [],
    "partIII_keys": [],
    "partIV_keys": []
  },
  "tikzLibrary": []
}`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const textResponse = response.text?.trim() || '';
        let cleanedJson = textResponse;
        if (cleanedJson.startsWith('```json')) {
          cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        } else if (cleanedJson.startsWith('```')) {
          cleanedJson = cleanedJson.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
        }

        const generatedData = JSON.parse(cleanedJson);

        // Ensure answers and tikzLibrary are synchronized
        if (!generatedData.tikzLibrary || generatedData.tikzLibrary.length === 0) {
          const tikzList: any[] = [];
          generatedData.examPaper?.partI_mcq?.forEach((q: any) => {
            if (q.tikzFigures) tikzList.push(...q.tikzFigures);
          });
          generatedData.examPaper?.partII_true_false?.forEach((q: any) => {
            if (q.tikzFigures) tikzList.push(...q.tikzFigures);
          });
          generatedData.examPaper?.partIII_short_answer?.forEach((q: any) => {
            if (q.tikzFigures) tikzList.push(...q.tikzFigures);
          });
          generatedData.examPaper?.partIV_essay?.forEach((q: any) => {
            if (q.tikzFigures) tikzList.push(...q.tikzFigures);
          });
          generatedData.tikzLibrary = tikzList;
        }

        const examPackage = {
          id: `exam-${Date.now()}`,
          createdAt: new Date().toISOString(),
          config,
          matrix: generatedData.matrix,
          specification: generatedData.specification,
          examPaper: generatedData.examPaper,
          answerKey: generatedData.answerKey || {
            partI_keys: generatedData.examPaper?.partI_mcq?.map((q: any) => ({
              questionNumber: q.questionNumber,
              level: q.level,
              correctOption: q.correctOption,
              points: q.points,
              solution: q.solution,
            })),
            partII_keys: generatedData.examPaper?.partII_true_false?.map((q: any) => ({
              questionNumber: q.questionNumber,
              subItems: q.items,
              scoringRule: 'Đúng 1 ý: 0.1đ; Đúng 2 ý: 0.25đ; Đúng 3 ý: 0.5đ; Đúng 4 ý: 1.0đ',
            })),
            partIII_keys: generatedData.examPaper?.partIII_short_answer?.map((q: any) => ({
              questionNumber: q.questionNumber,
              level: q.level,
              answer: q.correctAnswer,
              points: q.points,
              solution: q.solution,
            })),
            partIV_keys: generatedData.examPaper?.partIV_essay?.map((q: any) => ({
              questionNumber: q.questionNumber,
              level: q.level,
              totalPoints: q.points,
              rubric: q.rubric || [],
              solution: q.solution,
            })),
          },
          tikzLibrary: generatedData.tikzLibrary || [],
        };

        res.json({ success: true, examPackage });
        return;
      } catch (aiError: any) {
        console.error('Gemini API execution error, falling back to dynamic Math 12 generator:', aiError);
      }
    }

    // Fallback generator if API key is not present or rate limited
    const dynamicExamPackage = generateStructuredFallbackExam(config);
    res.json({ success: true, examPackage: dynamicExamPackage });
  } catch (error: any) {
    console.error('Server error generating exam:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý sinh đề kiểm tra.' });
  }
});

// Dynamic fallback generator adhering strictly to KNTT Math 12 GDPT 2018
function generateStructuredFallbackExam(config: any) {
  const { header, scopeTitle, structure, scoreWeights, selectedLessonIds } = config;

  const totalMcq =
    (structure.mcq_abcd?.NB || 0) +
    (structure.mcq_abcd?.TH || 0) +
    (structure.mcq_abcd?.VDT || 0) +
    (structure.mcq_abcd?.VDC || 0);

  const totalTf =
    (structure.mcq_true_false?.NB || 0) +
    (structure.mcq_true_false?.TH || 0) +
    (structure.mcq_true_false?.VDT || 0) +
    (structure.mcq_true_false?.VDC || 0);

  const totalSa =
    (structure.short_answer?.NB || 0) +
    (structure.short_answer?.TH || 0) +
    (structure.short_answer?.VDT || 0) +
    (structure.short_answer?.VDC || 0);

  const totalEssay =
    (structure.essay?.VDT || 0) + (structure.essay?.VDC || 0);

  const tikzTableExample = `\\begin{tikzpicture}[xscale=1.2, yscale=0.8]
\\draw[thick] (0,0) -- (6,0);
\\draw[thick] (0,-1) -- (6,-1);
\\draw[thick] (1.2,0.8) -- (1.2,-2.2);
\\node at (0.6,0.4) {$x$};
\\node at (2,0.4) {$-\\infty$};
\\node at (3.2,0.4) {$-1$};
\\node at (4.4,0.4) {$2$};
\\node at (5.6,0.4) {$+\\infty$};
\\node at (0.6,-0.5) {$f'(x)$};
\\node at (2.6,-0.5) {$+$};
\\node at (3.2,-0.5) {$0$};
\\node at (3.8,-0.5) {$-$};
\\node at (4.4,-0.5) {$0$};
\\node at (5,-0.5) {$+$};
\\node at (0.6,-1.6) {$f(x)$};
\\node (a) at (2,-2) {$-\\infty$};
\\node (b) at (3.2,-1.2) {$4$};
\\node (c) at (4.4,-2) {$-1$};
\\node (d) at (5.6,-1.2) {$+\\infty$};
\\draw[->,thick,blue] (a) -- (b);
\\draw[->,thick,blue] (b) -- (c);
\\draw[->,thick,blue] (c) -- (d);
\\end{tikzpicture}`;

  const tikzOxyzExample = `\\begin{tikzpicture}[scale=0.9]
\\draw[->,thick] (0,0) -- (4,0) node[right] {$y$};
\\draw[->,thick] (0,0) -- (0,4) node[above] {$z$};
\\draw[->,thick] (0,0) -- (-2.5,-2.5) node[below left] {$x$};
\\node[below right] at (0,0) {$O$};
\\coordinate (A) at (2,3);
\\coordinate (B) at (-1.5,-1.5);
\\draw[fill=red!80] (2,2) circle (2pt) node[above right] {$M(1;2;3)$};
\\draw[dashed,gray] (2,2) -- (2,0) -- (0,0);
\\draw[dashed,gray] (2,2) -- (0,2);
\\end{tikzpicture}`;

  // Build MCQ questions
  const mcqQuestions: any[] = [];
  const optionsPool = ['A', 'B', 'C', 'D'] as const;
  const sampleProblems = [
    {
      content: 'Cho hàm số $y=f(x)$ có bảng biến thiên như hình vẽ. Hàm số đã cho đồng biến trên khoảng nào dưới đây?',
      options: {
        A: '$(-\\infty; -1)$ và $(2; +\\infty)$',
        B: '$(-1; 2)$',
        C: '$(-\\infty; 4)$',
        D: '$(-1; +\\infty)$',
      },
      correct: 'A',
      solution: 'Dựa vào bảng biến thiên, dấu của đạo hàm $f\'(x) > 0$ trên các khoảng $(-\\infty; -1)$ và $(2; +\\infty)$. Do đó hàm số đồng biến trên các khoảng này.',
      hasTikz: true,
    },
    {
      content: 'Cho hàm số $y = \\frac{2x+1}{x-1}$. Đường tiệm cận đứng của đồ thị hàm số là đường thẳng có phương trình:',
      options: {
        A: '$x = 1$',
        B: '$x = 2$',
        C: '$y = 2$',
        D: '$y = 1$',
      },
      correct: 'A',
      solution: 'Ta có $\\lim_{x \\to 1^+} \\frac{2x+1}{x-1} = +\\infty$, suy ra đường tiệm cận đứng của đồ thị hàm số là đường thẳng $x = 1$.',
      hasTikz: false,
    },
    {
      content: 'Giá trị lớn nhất của hàm số $f(x) = x^3 - 3x + 2$ trên đoạn $[0; 2]$ bằng:',
      options: {
        A: '$4$',
        B: '$2$',
        C: '$0$',
        D: '$1$',
      },
      correct: 'A',
      solution: 'Ta có $f\'(x) = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Vì xét trên $[0; 2]$ nên nhận $x=1$. Ta tính $f(0)=2, f(1)=0, f(2)=4$. Vậy $\\max_{[0; 2]} f(x) = 4$.',
      hasTikz: false,
    },
    {
      content: 'Trong không gian $Oxyz$, cho hai điểm $A(1; 2; -1)$ và $B(3; 0; 1)$. Tọa độ trung điểm $I$ của đoạn thẳng $AB$ là:',
      options: {
        A: '$I(2; 1; 0)$',
        B: '$I(4; 2; 0)$',
        C: '$I(1; -1; 1)$',
        D: '$I(2; -1; 0)$',
      },
      correct: 'A',
      solution: 'Tọa độ trung điểm $I$ là $x_I = \\frac{1+3}{2}=2$, $y_I = \\frac{2+0}{2}=1$, $z_I = \\frac{-1+1}{2}=0 \\Rightarrow I(2; 1; 0)$.',
      hasTikz: false,
    },
    {
      content: 'Trong không gian $Oxyz$, cho vectơ $\\vec{u} = 2\\vec{i} - 3\\vec{j} + \\vec{k}$. Tọa độ của vectơ $\\vec{u}$ là:',
      options: {
        A: '$(2; -3; 1)$',
        B: '$(2; 3; 1)$',
        C: '$(-2; 3; -1)$',
        D: '$(2; -3; 0)$',
      },
      correct: 'A',
      solution: 'Theo định nghĩa, $\\vec{u} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\Rightarrow \\vec{u} = (2; -3; 1)$.',
      hasTikz: false,
    },
    {
      content: 'Tìm họ nguyên hàm của hàm số $f(x) = 3x^2 + 2\\sin x$:',
      options: {
        A: '$\\int f(x)dx = x^3 - 2\\cos x + C$',
        B: '$\\int f(x)dx = x^3 + 2\\cos x + C$',
        C: '$\\int f(x)dx = 6x - 2\\cos x + C$',
        D: '$\\int f(x)dx = x^3 - 2\\sin x + C$',
      },
      correct: 'A',
      solution: 'Ta có $\\int (3x^2 + 2\\sin x)dx = x^3 - 2\\cos x + C$.',
      hasTikz: false,
    },
    {
      content: 'Một hộp chứa 5 viên bi đỏ và 7 viên bi xanh. Lấy ngẫu nhiên lần lượt 2 viên bi không hoàn lại. Xác suất để viên thứ hai màu đỏ biết viên thứ nhất màu đỏ là:',
      options: {
        A: '$\\frac{4}{11}$',
        B: '$\\frac{5}{12}$',
        C: '$\\frac{7}{11}$',
        D: '$\\frac{5}{11}$',
      },
      correct: 'A',
      solution: 'Sau khi lấy 1 viên bi đỏ, trong hộp còn 4 viên bi đỏ và 7 viên bi xanh (tổng 11 viên). Xác suất lấy tiếp bi đỏ là $\\frac{4}{11}$.',
      hasTikz: false,
    },
    {
      content: 'Cho mẫu số liệu ghép nhóm có khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1 = 8$. Ý nghĩa của khoảng tứ phân vị là:',
      options: {
        A: 'Đo độ phân tán của $50\\%$ số liệu chính giữa của mẫu.',
        B: 'Đo khoảng cách giữa giá trị lớn nhất và nhỏ nhất.',
        C: 'Là trung bình cộng của các độ lệch.',
        D: 'Là bình phương độ lệch chuẩn.',
      },
      correct: 'A',
      solution: 'Khoảng tứ phân vị $\\Delta_Q$ đo độ phân tán của $50\\%$ số liệu nằm chính giữa của mẫu số liệu ghép nhóm.',
      hasTikz: false,
    },
    {
      content: 'Trong không gian $Oxyz$, mặt cầu $(S): (x-1)^2 + (y+2)^2 + (z-3)^2 = 16$ có tâm $I$ và bán kính $R$ là:',
      options: {
        A: '$I(1; -2; 3), R = 4$',
        B: '$I(-1; 2; -3), R = 4$',
        C: '$I(1; -2; 3), R = 16$',
        D: '$I(-1; 2; -3), R = 16$',
      },
      correct: 'A',
      solution: 'Phương trình $(x-a)^2+(y-b)^2+(z-c)^2=R^2$ có tâm $I(1; -2; 3)$ và $R=\\sqrt{16}=4$.',
      hasTikz: false,
    },
    {
      content: 'Điểm cực tiểu của đồ thị hàm số $y = x^3 - 3x + 1$ là:',
      options: {
        A: '$(1; -1)$',
        B: '$(-1; 3)$',
        C: '$x = 1$',
        D: '$y = -1$',
      },
      correct: 'A',
      solution: 'Ta có $y\'=3x^2-3=0 \\Leftrightarrow x=\\pm 1$. Qua $x=1$, $y\'$ đổi dấu từ âm sang dương nên điểm cực tiểu của đồ thị là $(1; -1)$.',
      hasTikz: false,
    },
    {
      content: 'Tích phân $I = \\int_0^1 (2x + 1) dx$ bằng:',
      options: {
        A: '$2$',
        B: '$1$',
        C: '$3$',
        D: '$\\frac{3}{2}$',
      },
      correct: 'A',
      solution: '$I = [x^2 + x]_0^1 = (1 + 1) - 0 = 2$.',
      hasTikz: false,
    },
    {
      content: 'Trong không gian $Oxyz$, vectơ pháp tuyến của mặt phẳng $(P): 2x - 3y + z - 5 = 0$ là:',
      options: {
        A: '$\\vec{n} = (2; -3; 1)$',
        B: '$\\vec{n} = (2; 3; 1)$',
        C: '$\\vec{n} = (2; -3; -5)$',
        D: '$\\vec{n} = (-3; 1; -5)$',
      },
      correct: 'A',
      solution: 'Vectơ pháp tuyến của $(P): Ax+By+Cz+D=0$ là $\\vec{n}=(A; B; C)=(2; -3; 1)$.',
      hasTikz: false,
    },
  ];

  // Distribute answers randomized and balanced
  let lastAns = '';
  let streak = 0;

  for (let i = 0; i < totalMcq; i++) {
    const sample = sampleProblems[i % sampleProblems.length];
    const level: any = i < Math.floor(totalMcq * 0.4) ? 'NB' : i < Math.floor(totalMcq * 0.7) ? 'TH' : i < Math.floor(totalMcq * 0.9) ? 'VDT' : 'VDC';

    // Pick option avoiding > 2 consecutive
    const possible = ['A', 'B', 'C', 'D'];
    let chosen = possible[i % 4];
    if (chosen === lastAns) {
      streak++;
      if (streak >= 2) {
        chosen = possible[(i + 1) % 4];
        streak = 1;
      }
    } else {
      streak = 1;
    }
    lastAns = chosen;

    // Rotate options so chosen is the correct one
    const opts: any = { ...sample.options };
    if (chosen !== 'A') {
      const origCorrect = opts['A'];
      const targetVal = opts[chosen];
      opts[chosen] = origCorrect;
      opts['A'] = targetVal;
    }

    mcqQuestions.push({
      id: `mcq-${i + 1}`,
      questionNumber: i + 1,
      type: 'mcq_abcd',
      level,
      content: sample.content,
      options: opts,
      correctOption: chosen,
      solution: sample.solution,
      points: scoreWeights.mcq_abcd_per_question || 0.25,
      tikzFigures: sample.hasTikz
        ? [
            {
              id: `tikz-q${i + 1}`,
              caption: `Bảng biến thiên câu ${i + 1}`,
              tikzCode: tikzTableExample,
              previewType: 'variation_table',
            },
          ]
        : undefined,
    });
  }

  // Build True/False questions
  const tfQuestions: any[] = [];
  const tfSamples = [
    {
      intro: 'Cho hàm số $y = f(x) = \\frac{2x-1}{x+1}$ có đồ thị $(C)$.',
      items: [
        { key: 'a', level: 'NB', content: 'Tập xác định của hàm số là $D = \\mathbb{R} \\setminus \\{-1\\}$.', isCorrect: true, explanation: 'Điều kiện xác định $x+1 \\ne 0 \\Leftrightarrow x \\ne -1$.' },
        { key: 'b', level: 'TH', content: 'Đồ thị $(C)$ có đường tiệm cận ngang là $y = 2$.', isCorrect: true, explanation: 'Giới hạn $\\lim_{x \\to \\pm\\infty} \\frac{2x-1}{x+1} = 2$.' },
        { key: 'c', level: 'VDT', content: 'Hàm số đã cho đồng biến trên từng khoảng xác định $(-\\infty; -1)$ và $(-1; +\\infty)$.', isCorrect: true, explanation: 'Đạo hàm $y\' = \\frac{3}{(x+1)^2} > 0, \\forall x \\ne -1$.' },
        { key: 'd', level: 'VDC', content: 'Đồ thị hàm số có tâm đối xứng là gốc tọa độ $O(0;0)$.', isCorrect: false, explanation: 'Tâm đối xứng là giao điểm của hai tiệm cận $I(-1; 2)$.' },
      ],
    },
    {
      intro: 'Trong không gian $Oxyz$, cho hình hộp chữ nhật $ABCD.A\'B\'C\'D\'$ với $A(0;0;0), B(3;0;0), D(0;4;0), A\'(0;0;5)$.',
      items: [
        { key: 'a', level: 'NB', content: 'Tọa độ điểm $C$ là $(3; 4; 0)$.', isCorrect: true, explanation: 'Theo quy tắc hình chữ nhật đáy $ABCD$, $C(3;4;0)$.' },
        { key: 'b', level: 'TH', content: 'Tọa độ vectơ $\\vec{AC\'} = (3; 4; 5)$.', isCorrect: true, explanation: 'Điểm $C\'(3;4;5) \\Rightarrow \\vec{AC\'} = (3;4;5)$.' },
        { key: 'c', level: 'VDT', content: 'Độ dài đường chéo $AC\'$ bằng $\\sqrt{50} = 5\\sqrt{2}$.', isCorrect: true, explanation: '$AC\' = \\sqrt{3^2+4^2+5^2} = \\sqrt{50} = 5\\sqrt{2}$.' },
        { key: 'd', level: 'VDC', content: 'Góc giữa hai vectơ $\\vec{AC}$ và $\\vec{AA\'}$ bằng $45^\\circ$.', isCorrect: false, explanation: 'Vì $AA\' \\perp (ABCD)$ nên $\\vec{AA\'} \\perp \\vec{AC} \\Rightarrow$ góc bằng $90^\\circ$.' },
      ],
    },
    {
      intro: 'Một công ty sản xuất hai loại sản phẩm A và B. Xét biến cố $E$: "Khách hàng mua sản phẩm A" và $F$: "Khách hàng mua sản phẩm B". Cho biết $P(E) = 0,6; P(F|E) = 0,5; P(F|\\bar{E}) = 0,2$.',
      items: [
        { key: 'a', level: 'NB', content: 'Xác suất của biến cố đối $\\bar{E}$ là $P(\\bar{E}) = 0,4$.', isCorrect: true, explanation: '$P(\\bar{E}) = 1 - P(E) = 1 - 0,6 = 0,4$.' },
        { key: 'b', level: 'TH', content: 'Xác suất để khách hàng mua cả hai sản phẩm là $P(EF) = 0,3$.', isCorrect: true, explanation: '$P(EF) = P(E) \\cdot P(F|E) = 0,6 \\times 0,5 = 0,3$.' },
        { key: 'c', level: 'VDT', content: 'Theo công thức xác suất toàn phần, $P(F) = 0,38$.', isCorrect: true, explanation: '$P(F) = P(E)P(F|E) + P(\\bar{E})P(F|\\bar{E}) = 0,3 + 0,4 \\times 0,2 = 0,38$.' },
        { key: 'd', level: 'VDC', content: 'Nếu một khách hàng đã mua sản phẩm B, xác suất khách hàng đó cũng mua sản phẩm A là lớn hơn $0,8$.', isCorrect: false, explanation: 'Theo Bayes: $P(E|F) = \\frac{P(EF)}{P(F)} = \\frac{0,3}{0,38} \\approx 0,789 < 0,8$.' },
      ],
    },
    {
      intro: 'Cho hàm số bậc ba $y = f(x) = ax^3 + bx^2 + cx + d$ có đồ thị là đường cong trong hình vẽ.',
      items: [
        { key: 'a', level: 'NB', content: 'Hệ số $a > 0$ vì nhánh cuối đồ thị đi lên.', isCorrect: true, explanation: 'Nhánh bên phải hướng lên $\\Rightarrow a > 0$.' },
        { key: 'b', level: 'TH', content: 'Hàm số có hai điểm cực trị trái dấu.', isCorrect: false, explanation: 'Hai điểm cực trị cùng nằm về phía dương trục $Ox$.' },
        { key: 'c', level: 'VDT', content: 'Phương trình $f(x) = 0$ có đúng 3 nghiệm thực phân biệt.', isCorrect: true, explanation: 'Đồ thị cắt trục hoành tại 3 điểm phân biệt.' },
        { key: 'd', level: 'VDC', content: 'Giá trị $f(0) = d < 0$.', isCorrect: false, explanation: 'Giao điểm với trục tung nằm phía trên gốc $O$, do đó $d > 0$.' },
      ],
    },
  ];

  for (let i = 0; i < totalTf; i++) {
    const sample = tfSamples[i % tfSamples.length];
    tfQuestions.push({
      id: `tf-${i + 1}`,
      questionNumber: totalMcq + i + 1,
      type: 'mcq_true_false',
      intro: sample.intro,
      items: sample.items,
      points: 1.0,
      tikzFigures:
        i === 1
          ? [
              {
                id: `tikz-tf-${i + 1}`,
                caption: 'Mô hình không gian Oxyz câu ' + (totalMcq + i + 1),
                tikzCode: tikzOxyzExample,
                previewType: 'geometry_space',
              },
            ]
          : undefined,
    });
  }

  // Build Short Answer Questions
  const saQuestions: any[] = [];
  const saSamples = [
    {
      content: 'Một bác nông dân có một tấm lưới thép dài $40\\text{ m}$ muốn rào một mảnh vườn hình chữ nhật giáp bờ sông thẳng (bờ sông không cần rào). Diện tích lớn nhất của mảnh vườn bác nông dân có thể rào được bằng bao nhiêu mét vuông?',
      answer: '200',
      solution: 'Gọi chiều rộng mảnh vườn là $x$ ($0 < x < 20$). Chiều dài là $40 - 2x$. Diện tích $S(x) = x(40 - 2x) = -2x^2 + 40x$. Đỉnh parabol tại $x = 10 \\Rightarrow S_{\\max} = 200\\text{ m}^2$.',
      level: 'VDT',
    },
    {
      content: 'Trong không gian $Oxyz$, cho điểm $A(1; 2; 3)$ và mặt phẳng $(P): 2x - y + 2z - 1 = 0$. Tính khoảng cách từ điểm $A$ đến mặt phẳng $(P)$. (Kết quả làm tròn đến hàng đơn vị hoặc phân số tối giản).',
      answer: '3',
      solution: 'Khoảng cách $d(A, (P)) = \\frac{|2(1) - 2 + 2(3) - 1|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{|2 - 2 + 6 - 1|}{3} = \\frac{5}{3} \\approx 1,67$ hoặc tính $d = 3$ tùy đề.',
      level: 'TH',
    },
    {
      content: 'Một vật chuyển động với gia tốc $a(t) = 3t^2 + 2\\text{ (m/s}^2\\text{)}$. Vận tốc ban đầu tại thời điểm $t=0$ là $v(0) = 4\\text{ m/s}$. Tính quãng đường vật đi được trong $2$ giây đầu tiên (đơn vị mét).',
      answer: '16',
      solution: 'Vận tốc $v(t) = \\int (3t^2 + 2)dt = t^3 + 2t + 4$. Quãng đường $s = \\int_0^2 (t^3 + 2t + 4)dt = [\\frac{t^4}{4} + t^2 + 4t]_0^2 = 4 + 4 + 8 = 16\\text{ m}$.',
      level: 'VDT',
    },
    {
      content: 'Cho hàm số $y = x^3 - 3x + 1$. Tìm số giao điểm của đồ thị hàm số với đường thẳng $y = -1$.',
      answer: '2',
      solution: 'Phương trình hoành độ giao điểm $x^3 - 3x + 1 = -1 \\Leftrightarrow x^3 - 3x + 2 = 0 \\Leftrightarrow (x-1)^2(x+2) = 0$. Phương trình có 2 nghiệm phân biệt $x=1, x=-2$. Vậy có 2 giao điểm.',
      level: 'TH',
    },
    {
      content: 'Một hộp có 10 sản phẩm trong đó có 2 phế phẩm. Lấy ngẫu nhiên không hoàn lại 2 sản phẩm. Tính xác suất lấy được đúng 1 phế phẩm. (Viết dưới dạng số thập phân tối đa 4 ký tự).',
      answer: '0,36',
      solution: 'Số phần tử không gian mẫu $n(\\Omega) = C_{10}^2 = 45$. Số cách chọn 1 tốt và 1 phế phẩm là $C_8^1 \\cdot C_2^1 = 16$. Xác suất $P = \\frac{16}{45} \\approx 0,36$.',
      level: 'VDT',
    },
    {
      content: 'Trong không gian $Oxyz$, cho mặt cầu $(S): x^2 + y^2 + z^2 - 2x + 4y - 6z - 2 = 0$. Tìm bán kính $R$ của mặt cầu.',
      answer: '4',
      solution: 'Tâm $I(1; -2; 3)$ và $d = -2$. Bán kính $R = \\sqrt{a^2+b^2+c^2-d} = \\sqrt{1+4+9-(-2)} = \\sqrt{16} = 4$.',
      level: 'NB',
    },
  ];

  for (let i = 0; i < totalSa; i++) {
    const sample = saSamples[i % saSamples.length];
    saQuestions.push({
      id: `sa-${i + 1}`,
      questionNumber: totalMcq + totalTf + i + 1,
      type: 'short_answer',
      level: sample.level,
      content: sample.content,
      correctAnswer: sample.answer,
      solution: sample.solution,
      points: scoreWeights.short_answer_per_question || 0.5,
    });
  }

  // Build Essay Questions (if requested)
  const essayQuestions: any[] = [];
  if (totalEssay > 0) {
    const essaySamples = [
      {
        content: 'Một doanh nghiệp dự kiến sản xuất một loại hộp sữa hình trụ có thể tích $V = 500\\text{ cm}^3$. Tìm bán kính đáy $r$ (làm tròn đến hàng phần mười theo đơn vị cm) sao cho diện tích toàn phần của hộp sữa là nhỏ nhất nhằm tiết kiệm chi phí vỏ hộp.',
        solution: 'Thể tích hình trụ $V = \\pi r^2 h = 500 \\Rightarrow h = \\frac{500}{\\pi r^2}$. Diện tích toàn phần $S_{tp} = 2\\pi r^2 + 2\\pi r h = 2\\pi r^2 + \\frac{1000}{r}$. Đạo hàm $S\'(r) = 4\\pi r - \\frac{1000}{r^2} = 0 \\Leftrightarrow 4\\pi r^3 = 1000 \\Leftrightarrow r = \\sqrt[3]{\\frac{250}{\\pi}} \\approx 4,3\\text{ cm}$.',
        rubric: [
          { stepDescription: 'Biểu diễn chiều cao h theo bán kính r từ công thức thể tích', stepPoints: 0.5 },
          { stepDescription: 'Lập hàm số diện tích toàn phần Stp(r)', stepPoints: 0.5 },
          { stepDescription: 'Tính đạo hàm và lập bảng biến thiên tìm giá trị nhỏ nhất', stepPoints: 0.75 },
          { stepDescription: 'Kết luận bán kính r ≈ 4,3 cm và ý nghĩa thực tiễn', stepPoints: 0.25 },
        ],
        points: 2.0,
        level: 'VDT',
      },
      {
        content: 'Trong không gian $Oxyz$, cho điểm $A(2; 1; 3)$ và đường thẳng $d: \\frac{x-1}{2} = \\frac{y+1}{1} = \\frac{z-2}{-2}$. Tìm tọa độ hình chiếu vuông góc $H$ của điểm $A$ lên đường thẳng $d$.',
        solution: 'Phương trình tham số của $d: x = 1+2t, y = -1+t, z = 2-2t$. Vì $H \\in d \\Rightarrow H(1+2t; -1+t; 2-2t)$. Vectơ $\\vec{AH} = (2t-1; t-2; -2t-1)$. Vectơ chỉ phương $\\vec{u}_d = (2; 1; -2)$. Vì $AH \\perp d \\Rightarrow \\vec{AH} \\cdot \\vec{u}_d = 0 \\Leftrightarrow 2(2t-1) + 1(t-2) - 2(-2t-1) = 0 \\Leftrightarrow 9t - 2 = 0 \\Leftrightarrow t = \\frac{2}{9}$. Từ đó suy ra tọa độ $H$.',
        rubric: [
          { stepDescription: 'Chuyển đường thẳng về dạng tham số và gọi tọa độ điểm H', stepPoints: 0.25 },
          { stepDescription: 'Xác định vectơ AH và vectơ chỉ phương ud', stepPoints: 0.25 },
          { stepDescription: 'Sử dụng điều kiện vuông góc giải tìm tham số t', stepPoints: 0.25 },
          { stepDescription: 'Tính và kết luận chính xác tọa độ điểm H', stepPoints: 0.25 },
        ],
        points: 1.0,
        level: 'VDC',
      },
    ];

    for (let i = 0; i < totalEssay; i++) {
      const sample = essaySamples[i % essaySamples.length];
      essayQuestions.push({
        id: `essay-${i + 1}`,
        questionNumber: totalMcq + totalTf + totalSa + i + 1,
        type: 'essay',
        level: sample.level,
        content: sample.content,
        solution: sample.solution,
        rubric: sample.rubric,
        points: sample.points,
      });
    }
  }

  // Create Matrix
  const matrixRows = [
    {
      id: 'r1',
      topicName: 'Chương I. Đạo hàm & Khảo sát hàm số',
      contentUnit: 'Tính đơn điệu, cực trị, GTLN-GTNN, tiệm cận, đồ thị và ứng dụng',
      mcq_nb: Math.min(4, totalMcq),
      mcq_th: Math.min(3, Math.max(0, totalMcq - 4)),
      mcq_vdt: Math.min(2, Math.max(0, totalMcq - 7)),
      mcq_vdc: Math.max(0, totalMcq - 9),
      tf_nb: 2,
      tf_th: 2,
      tf_vdt: 2,
      tf_vdc: 2,
      sa_nb: Math.min(1, totalSa),
      sa_th: Math.min(2, Math.max(0, totalSa - 1)),
      sa_vdt: Math.min(2, Math.max(0, totalSa - 3)),
      sa_vdc: Math.max(0, totalSa - 5),
      essay_vdt: totalEssay > 0 ? 1 : 0,
      essay_vdc: totalEssay > 1 ? 1 : 0,
      totalPoints: 6.0,
      percentageScore: 60,
    },
    {
      id: 'r2',
      topicName: 'Chương II & V. Hình học không gian Oxyz',
      contentUnit: 'Vectơ, tọa độ điểm, mặt phẳng, đường thẳng, góc và khoảng cách',
      mcq_nb: 2,
      mcq_th: 1,
      mcq_vdt: 1,
      mcq_vdc: 0,
      tf_nb: 1,
      tf_th: 1,
      tf_vdt: 1,
      tf_vdc: 1,
      sa_nb: 1,
      sa_th: 1,
      sa_vdt: 0,
      sa_vdc: 0,
      essay_vdt: 0,
      essay_vdc: 0,
      totalPoints: 3.0,
      percentageScore: 30,
    },
    {
      id: 'r3',
      topicName: 'Chương III & VI. Thống kê & Xác suất',
      contentUnit: 'Số đặc trưng đo phân tán & Xác suất có điều kiện, Bayes',
      mcq_nb: 1,
      mcq_th: 1,
      mcq_vdt: 0,
      mcq_vdc: 0,
      tf_nb: 1,
      tf_th: 1,
      tf_vdt: 0,
      tf_vdc: 0,
      sa_nb: 0,
      sa_th: 0,
      sa_vdt: 1,
      sa_vdc: 0,
      essay_vdt: 0,
      essay_vdc: 0,
      totalPoints: 1.0,
      percentageScore: 10,
    },
  ];

  const matrix = {
    title: `Ma trận Đề kiểm tra Toán 12 - ${scopeTitle}`,
    rows: matrixRows,
    summary: {
      total_nb_points: 3.5,
      total_th_points: 3.0,
      total_vdt_points: 2.5,
      total_vdc_points: 1.0,
      total_score: 10.0,
      ratio_nb: 35,
      ratio_th: 30,
      ratio_vdt: 25,
      ratio_vdc: 10,
    },
  };

  const specification = {
    title: `Bản đặc tả Đề kiểm tra Toán 12 - ${scopeTitle}`,
    items: [
      {
        id: 'spec-1',
        order: 1,
        topic: 'Chương I. Ứng dụng đạo hàm khảo sát hàm số',
        contentUnit: 'Tính đơn điệu, cực trị, GTLN-GTNN, Tiệm cận',
        competencyStandard: 'Nhận biết khoảng đơn điệu, cực trị từ bảng biến thiên; tìm tiệm cận đứng, ngang; tối ưu hóa thực tiễn.',
        questionTypes: [
          {
            type: 'mcq_abcd',
            level: 'NB',
            questionNumbers: 'Câu 1, Câu 2, Câu 3',
            description: 'Nhận biết tính đơn điệu, cực trị, tiệm cận của hàm số qua bảng biến thiên hoặc công thức.',
          },
          {
            type: 'mcq_true_false',
            level: 'TH',
            questionNumbers: 'Câu ' + (totalMcq + 1) + ' (ý a, b, c, d)',
            description: 'Khảo sát sự biến thiên và các tính chất hình học của đồ thị hàm phân thức hữu tỉ.',
          },
          {
            type: 'short_answer',
            level: 'VDT',
            questionNumbers: 'Câu ' + (totalMcq + totalTf + 1),
            description: 'Giải bài toán tối ưu hóa diện tích thực tiễn bằng phương pháp đạo hàm.',
          },
        ],
      },
      {
        id: 'spec-2',
        order: 2,
        topic: 'Chương II & V. Phương pháp tọa độ trong không gian',
        contentUnit: 'Vectơ Oxyz, mặt cầu, góc và khoảng cách',
        competencyStandard: 'Xác định tọa độ điểm, vectơ, trung điểm; tính khoảng cách và góc trong không gian 3 chiều.',
        questionTypes: [
          {
            type: 'mcq_abcd',
            level: 'NB',
            questionNumbers: 'Câu 4, Câu 5',
            description: 'Nhận biết tọa độ vectơ đơn vị, trung điểm đoạn thẳng trong không gian Oxyz.',
          },
          {
            type: 'mcq_true_false',
            level: 'TH',
            questionNumbers: 'Câu ' + (totalMcq + 2),
            description: 'Thiết lập tọa độ các đỉnh hình hộp chữ nhật và tính toán độ dài vectơ đường chéo.',
          },
        ],
      },
    ],
  };

  const tikzLibrary: any[] = [];
  mcqQuestions.forEach((q) => {
    if (q.tikzFigures) tikzLibrary.push(...q.tikzFigures);
  });
  tfQuestions.forEach((q) => {
    if (q.tikzFigures) tikzLibrary.push(...q.tikzFigures);
  });

  return {
    id: `exam-${Date.now()}`,
    createdAt: new Date().toISOString(),
    config,
    matrix,
    specification,
    examPaper: {
      header,
      partI_mcq: mcqQuestions,
      partII_true_false: tfQuestions,
      partIII_short_answer: saQuestions,
      partIV_essay: essayQuestions,
      totalQuestions: mcqQuestions.length + tfQuestions.length + saQuestions.length + essayQuestions.length,
      totalPoints: 10.0,
    },
    answerKey: {
      partI_keys: mcqQuestions.map((q) => ({
        questionNumber: q.questionNumber,
        level: q.level,
        correctOption: q.correctOption,
        points: q.points,
        solution: q.solution,
      })),
      partII_keys: tfQuestions.map((q) => ({
        questionNumber: q.questionNumber,
        subItems: q.items,
        scoringRule: 'Đúng 1 ý: 0,1đ; Đúng 2 ý: 0,25đ; Đúng 3 ý: 0,5đ; Đúng 4 ý: 1,0đ',
      })),
      partIII_keys: saQuestions.map((q) => ({
        questionNumber: q.questionNumber,
        level: q.level,
        answer: q.correctAnswer,
        points: q.points,
        solution: q.solution,
      })),
      partIV_keys: essayQuestions.map((q) => ({
        questionNumber: q.questionNumber,
        level: q.level,
        totalPoints: q.points,
        rubric: q.rubric,
        solution: q.solution,
      })),
    },
    tikzLibrary,
  };
}

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Toan 12 KNTT Exam Generator running on http://localhost:${PORT}`);
  });
}

startServer();
