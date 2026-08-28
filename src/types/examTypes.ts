export type CognitiveLevel = 'NB' | 'TH' | 'VDT' | 'VDC';

export interface LevelDistribution {
  NB: number;   // Nhận biết
  TH: number;   // Thông hiểu
  VDT: number;  // Vận dụng thấp
  VDC: number;  // Vận dụng cao
}

export interface ExamStructureConfig {
  mcq_abcd: LevelDistribution;       // Trắc nghiệm nhiều lựa chọn
  mcq_true_false: LevelDistribution; // Trắc nghiệm đúng - sai (số câu)
  short_answer: LevelDistribution;   // Trả lời ngắn
  essay: {
    VDT: number;                     // Số câu tự luận Vận dụng
    VDC: number;                     // Số câu tự luận Vận dụng cao
  };
}

export interface ScoreWeightsConfig {
  mcq_abcd_per_question: number;     // Điểm mỗi câu ABCD (mặc định 0.25)
  mcq_tf_per_item: number;           // Điểm mỗi ý Đúng/Sai (mặc định 0.25)
  short_answer_per_question: number; // Điểm mỗi câu trả lời ngắn (mặc định 0.5 hoặc 0.25)
  essay_total_points: number;        // Tổng điểm phần tự luận nếu có (ví dụ 3.0)
}

export interface ExamHeaderInfo {
  schoolName: string;
  departmentName: string;
  examTitle: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  academicYear: string;
  examCode: string;
  teacherName: string;
}

export interface FullExamConfig {
  header: ExamHeaderInfo;
  selectedLessonIds: string[];
  scopeTitle: string;
  structure: ExamStructureConfig;
  scoreWeights: ScoreWeightsConfig;
  notes?: string;
}

// 1. Matrix table item (Bảng ma trận)
export interface MatrixRowItem {
  id: string;
  topicName: string;
  contentUnit: string;
  mcq_nb: number;
  mcq_th: number;
  mcq_vdt: number;
  mcq_vdc: number;
  tf_nb: number; // số ý
  tf_th: number;
  tf_vdt: number;
  tf_vdc: number;
  sa_nb: number;
  sa_th: number;
  sa_vdt: number;
  sa_vdc: number;
  essay_vdt: number;
  essay_vdc: number;
  totalPoints: number;
  percentageScore: number;
}

export interface ExamMatrix {
  title: string;
  rows: MatrixRowItem[];
  summary: {
    total_nb_points: number;
    total_th_points: number;
    total_vdt_points: number;
    total_vdc_points: number;
    total_score: number;
    ratio_nb: number; // %
    ratio_th: number; // %
    ratio_vdt: number; // %
    ratio_vdc: number; // %
  };
}

// 2. Specification table item (Bản đặc tả)
export interface SpecificationRowItem {
  id: string;
  order: number;
  topic: string;
  contentUnit: string;
  competencyStandard: string;
  questionTypes: {
    type: 'mcq_abcd' | 'mcq_true_false' | 'short_answer' | 'essay';
    level: CognitiveLevel;
    questionNumbers: string; // ví dụ: "Câu 1, Câu 2" hoặc "Câu 13 (ý a, b)"
    description: string;
  }[];
}

export interface ExamSpecification {
  title: string;
  items: SpecificationRowItem[];
}

// TikZ Graphic item
export interface TikZFigure {
  id: string;
  caption: string;
  tikzCode: string;
  previewType?: 'variation_table' | 'function_graph' | 'geometry_space' | 'statistics' | 'illustration';
  svgDataUrl?: string;
}

// 3. Question Item (Đề kiểm tra)
export interface McqAbcdQuestion {
  id: string;
  questionNumber: number;
  type: 'mcq_abcd';
  level: CognitiveLevel;
  content: string; // Chứa mã LaTeX
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  tikzFigures?: TikZFigure[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  solution: string; // Lời giải chi tiết
  points: number;
}

export interface TrueFalseSubItem {
  key: 'a' | 'b' | 'c' | 'd';
  content: string;
  level: CognitiveLevel;
  isCorrect: boolean; // true = Đúng, false = Sai
  explanation: string;
}

export interface McqTrueFalseQuestion {
  id: string;
  questionNumber: number;
  type: 'mcq_true_false';
  intro: string; // Lời dẫn
  items: TrueFalseSubItem[];
  tikzFigures?: TikZFigure[];
  points: number; // Tổng điểm cả câu
}

export interface ShortAnswerQuestion {
  id: string;
  questionNumber: number;
  type: 'short_answer';
  level: CognitiveLevel;
  content: string;
  correctAnswer: string; // Tối đa 4 ký tự: ví dụ "2,5", "-12", "0,75", "10"
  solution: string;
  tikzFigures?: TikZFigure[];
  points: number;
}

export interface EssayStep {
  stepDescription: string;
  stepPoints: number;
}

export interface EssayQuestion {
  id: string;
  questionNumber: number;
  type: 'essay';
  level: 'VDT' | 'VDC';
  content: string;
  solution: string;
  rubric: EssayStep[];
  tikzFigures?: TikZFigure[];
  points: number;
}

export interface ExamPaper {
  header: ExamHeaderInfo;
  partI_mcq: McqAbcdQuestion[];
  partII_true_false: McqTrueFalseQuestion[];
  partIII_short_answer: ShortAnswerQuestion[];
  partIV_essay: EssayQuestion[];
  totalQuestions: number;
  totalPoints: number;
}

// 4. Answer key & Grading Guide
export interface ExamAnswerKey {
  partI_keys: { questionNumber: number; level: CognitiveLevel; correctOption: 'A' | 'B' | 'C' | 'D'; points: number; solution: string }[];
  partII_keys: {
    questionNumber: number;
    subItems: { key: 'a' | 'b' | 'c' | 'd'; level: CognitiveLevel; isCorrect: boolean; explanation: string }[];
    scoringRule: string; // Chuẩn Bộ GD: Đúng 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ
  }[];
  partIII_keys: { questionNumber: number; level: CognitiveLevel; answer: string; points: number; solution: string }[];
  partIV_keys: { questionNumber: number; level: string; totalPoints: number; rubric: EssayStep[]; solution: string }[];
}

// Full product package returned by AI / generator
export interface ExamPackage {
  id: string;
  createdAt: string;
  config: FullExamConfig;
  matrix: ExamMatrix;
  specification: ExamSpecification;
  examPaper: ExamPaper;
  answerKey: ExamAnswerKey;
  tikzLibrary: TikZFigure[];
}
