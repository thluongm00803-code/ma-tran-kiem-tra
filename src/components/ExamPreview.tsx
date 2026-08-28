import React, { useState } from 'react';
import {
  FileText,
  Table as TableIcon,
  CheckCircle2,
  Sparkles,
  Download,
  RefreshCw,
  Copy,
  Check,
  Code,
  Layers,
  ChevronDown,
  Printer,
  BookCheck,
  Sliders,
} from 'lucide-react';
import { ExamPackage, CognitiveLevel } from '../types/examTypes';
import { MathRenderer } from './MathRenderer';
import { TikZViewer } from './TikZViewer';
import {
  exportAllToDocx,
  exportMatrixToDocx,
  exportSpecificationToDocx,
  exportExamPaperToDocx,
  exportAnswerKeyToDocx,
} from '../services/docxExport';

interface ExamPreviewProps {
  examPackage: ExamPackage | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

export const ExamPreview: React.FC<ExamPreviewProps> = ({
  examPackage,
  isLoading,
  onRegenerate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'matrix' | 'spec' | 'paper' | 'answers' | 'tikz'
  >('paper');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedQuickAns, setCopiedQuickAns] = useState(false);

  const getLevelBadge = (level: CognitiveLevel | string) => {
    switch (level) {
      case 'NB':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            [NB - Nhận biết]
          </span>
        );
      case 'TH':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            [TH - Thông hiểu]
          </span>
        );
      case 'VDT':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            [VDT - Vận dụng]
          </span>
        );
      case 'VDC':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            [VDC - Vận dụng cao]
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
            [{level}]
          </span>
        );
    }
  };

  const handleExport = async (type: 'all' | 'matrix' | 'spec' | 'paper' | 'answers') => {
    if (!examPackage) return;
    setIsExporting(true);
    try {
      if (type === 'all') await exportAllToDocx(examPackage);
      if (type === 'matrix') await exportMatrixToDocx(examPackage);
      if (type === 'spec') await exportSpecificationToDocx(examPackage);
      if (type === 'paper') await exportExamPaperToDocx(examPackage);
      if (type === 'answers') await exportAnswerKeyToDocx(examPackage);
    } catch (err) {
      console.error('Lỗi khi xuất Word docx:', err);
      alert('Có lỗi xảy ra khi tạo file Word. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-10 min-h-[500px] flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full animate-ping" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          AI Gemini đang thiết kế bộ hồ sơ kiểm tra Toán 12
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
          Đang xây dựng Ma trận chuẩn, Bản đặc tả chi tiết GDPT 2018, Đề thi Toán 12 KNTT (công thức LaTeX & mã TikZ), Đáp án và Hướng dẫn chấm...
        </p>
      </div>
    );
  }

  if (!examPackage) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs p-10 min-h-[500px] flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
          Chưa có đề kiểm tra nào được tạo
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6">
          Vui lòng chọn bài học từ SGK Toán 12 KNTT và cấu hình số câu theo các mức độ nhận thức ở cột bên trái, sau đó nhấn nút <strong>"Tạo đề kiểm tra bằng AI Gemini"</strong>.
        </p>
      </div>
    );
  }

  const { matrix, specification, examPaper, answerKey, tikzLibrary } = examPackage;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Top Action Bar */}
      <div className="bg-slate-800 p-3 sm:p-4 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white">
              {examPaper.header.examTitle || 'Bộ hồ sơ Đề kiểm tra Toán 12'}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900 text-blue-200 border border-blue-700">
              Mã: {examPaper.header.examCode || '101'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {examPackage.config.scopeTitle} • Thời gian: {examPaper.header.durationMinutes} phút • Thang điểm 10,0
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-slate-600 cursor-pointer shadow-xs"
            title="Sinh đề khác với cùng cấu hình hiện tại"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tạo lại đề</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition border border-slate-600 cursor-pointer hidden md:flex shadow-xs"
            title="In đề kiểm tra"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Docx Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất file .docx</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white text-slate-800 shadow-xl border border-slate-200 z-50 p-1.5 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleExport('all')}
                  className="w-full text-left px-3 py-2 rounded font-bold text-blue-700 hover:bg-blue-50 flex items-center justify-between cursor-pointer"
                >
                  <span>Tải trọn bộ 4 sản phẩm (A4)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Full</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => handleExport('matrix')}
                  className="w-full text-left px-3 py-1.5 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <TableIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>1. Chỉ tải Ma trận đề (.docx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('spec')}
                  className="w-full text-left px-3 py-1.5 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>2. Chỉ tải Bản đặc tả (.docx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('paper')}
                  className="w-full text-left px-3 py-1.5 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>3. Chỉ tải Đề kiểm tra (.docx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('answers')}
                  className="w-full text-left px-3 py-1.5 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <BookCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>4. Chỉ tải Đáp án & HDC (.docx)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-slate-50 border-b border-slate-200 px-2 flex items-center gap-0.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('paper')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'paper'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Đề kiểm tra</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            {examPaper.totalQuestions ||
              (examPaper.partI_mcq?.length || 0) +
                (examPaper.partII_true_false?.length || 0) +
                (examPaper.partIII_short_answer?.length || 0) +
                (examPaper.partIV_essay?.length || 0)}{' '}
            câu
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>1. Ma trận đề</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('spec')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'spec'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Bản đặc tả</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('answers')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'answers'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <BookCheck className="w-4 h-4" />
          <span>4. Đáp án & HD chấm</span>
        </button>

        {tikzLibrary && tikzLibrary.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('tikz')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tikz'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Mã TikZ ({tikzLibrary.length})</span>
          </button>
        )}
      </div>

      {/* Main Preview Content Area */}
      <div className="p-4 sm:p-6 max-h-[calc(100vh-210px)] overflow-y-auto">
        {/* ==================================================== */}
        {/* TAB 1: BẢNG MA TRẬN ĐỀ */}
        {/* ==================================================== */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
                BẢNG MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN 12
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Bộ sách: Kết nối tri thức với cuộc sống • Phạm vi: {examPackage.config.scopeTitle}
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 text-center w-10">TT</th>
                    <th className="p-2.5 border-r border-slate-200">Chủ đề / Đơn vị kiến thức</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">
                      Nhiều lựa chọn (NB-TH-VD-VDC)
                    </th>
                    <th className="p-2.5 border-r border-slate-200 text-center">
                      Đúng - Sai (Số ý)
                    </th>
                    <th className="p-2.5 border-r border-slate-200 text-center">
                      Trả lời ngắn (Số câu)
                    </th>
                    <th className="p-2.5 border-r border-slate-200 text-center">
                      Tự luận (VD-VDC)
                    </th>
                    <th className="p-2.5 text-center">Tổng điểm (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {matrix.rows.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center font-bold border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{row.topicName}</div>
                        <div className="text-[11px] text-slate-500">{row.contentUnit}</div>
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                        {row.mcq_nb} / {row.mcq_th} / {row.mcq_vdt} / {row.mcq_vdc}
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                        {row.tf_nb} / {row.tf_th} / {row.tf_vdt} / {row.tf_vdc}
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                        {row.sa_nb} / {row.sa_th} / {row.sa_vdt} / {row.sa_vdc}
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 font-mono">
                        {row.essay_vdt} / {row.essay_vdc}
                      </td>
                      <td className="p-2.5 text-center font-bold text-blue-700">
                        {row.totalPoints.toFixed(2)}đ ({row.percentageScore}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={2} className="p-3 text-right border-r border-slate-200">
                      TỔNG CỘNG THEO MỨC ĐỘ NHẬN THỨC:
                    </td>
                    <td colSpan={4} className="p-3 text-center border-r border-slate-200 text-blue-800">
                      Nhận biết: {matrix.summary.ratio_nb}% • Thông hiểu: {matrix.summary.ratio_th}% • Vận dụng: {matrix.summary.ratio_vdt}% • VDC: {matrix.summary.ratio_vdc}%
                    </td>
                    <td className="p-3 text-center text-blue-700 text-sm">
                      {matrix.summary.total_score.toFixed(1)} điểm (100%)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: BẢN ĐẶC TẢ ĐỀ */}
        {/* ==================================================== */}
        {activeTab === 'spec' && (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
                BẢN ĐẶC TẢ ĐỀ KIỂM TRA MÔN TOÁN 12 (GDPT 2018)
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Chuẩn kiến thức kỹ năng & Yêu cầu cần đạt bộ sách Kết nối tri thức với cuộc sống
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 text-center w-10">STT</th>
                    <th className="p-2.5 border-r border-slate-200 w-48">Chủ đề / Đơn vị KT</th>
                    <th className="p-2.5 border-r border-slate-200">
                      Yêu cầu cần đạt chuẩn GDPT 2018
                    </th>
                    <th className="p-2.5 border-r border-slate-200 text-center w-28">Mức độ</th>
                    <th className="p-2.5 text-center w-28">Số câu / Vị trí</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {specification.items.map((item, idx) => (
                    <React.Fragment key={item.id || idx}>
                      {item.questionTypes.map((qt, qIdx) => (
                        <tr key={qIdx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">
                            {qIdx === 0 ? idx + 1 : ''}
                          </td>
                          <td className="p-2.5 border-r border-slate-200">
                            {qIdx === 0 ? (
                              <>
                                <div className="font-bold text-slate-900">{item.topic}</div>
                                <div className="text-[11px] text-slate-500">{item.contentUnit}</div>
                              </>
                            ) : null}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 leading-relaxed">
                            <MathRenderer
                              content={qt.description || item.competencyStandard}
                              inline
                            />
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            {getLevelBadge(qt.level)}
                          </td>
                          <td className="p-2.5 text-center font-bold text-blue-700">
                            {qt.questionNumbers}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: ĐỀ KIỂM TRA HOÀN CHỈNH */}
        {/* ==================================================== */}
        {activeTab === 'paper' && (
          <div className="space-y-6">
            {/* Header chuẩn THPT */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                <div className="sm:border-r border-slate-200 sm:pr-4">
                  <div className="text-xs uppercase text-slate-600 font-semibold">
                    {examPaper.header.departmentName || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 uppercase">
                    {examPaper.header.schoolName || 'TRƯỜNG THPT CHU VĂN AN'}
                  </div>
                  <div className="mt-1 inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-bold">
                    MÃ ĐỀ THI: {examPaper.header.examCode || '101'}
                  </div>
                </div>

                <div className="sm:pl-2">
                  <div className="text-sm sm:text-base font-bold text-blue-900 uppercase">
                    {examPaper.header.examTitle || 'ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TOÁN 12'}
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    BỘ SGK: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - GDPT 2018
                  </div>
                  <div className="text-xs text-slate-700 mt-0.5">
                    Thời gian làm bài: <strong>{examPaper.header.durationMinutes} phút</strong> (Không kể thời gian phát đề)
                  </div>
                </div>
              </div>

              {/* Student info line */}
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap gap-4 justify-between">
                <span>Họ và tên thí sinh: ..........................................................................</span>
                <span>Số báo danh: .......................</span>
                <span>Lớp: .................</span>
              </div>
            </div>

            {/* PHẦN I: TRẮC NGHIỆM ABCD */}
            {examPaper.partI_mcq && examPaper.partI_mcq.length > 0 && (
              <div className="space-y-4">
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-blue-950">
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                    PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN
                  </h4>
                  <p className="text-xs text-blue-900/80 mt-0.5">
                    Thí sinh trả lời từ câu 1 đến câu {examPaper.partI_mcq.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất.
                  </p>
                </div>

                <div className="space-y-4">
                  {examPaper.partI_mcq.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                          Câu {q.questionNumber}.
                        </span>
                        <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
                          <MathRenderer content={q.content} />
                        </div>
                        {getLevelBadge(q.level)}
                      </div>

                      {/* TikZ Figure if attached */}
                      {q.tikzFigures &&
                        q.tikzFigures.map((fig) => (
                          <TikZViewer key={fig.id} figure={fig} />
                        ))}

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs sm:text-sm">
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => (
                          <div
                            key={optKey}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-1.5"
                          >
                            <span className="font-bold text-blue-700 min-w-4">
                              {optKey}.
                            </span>
                            <div className="text-slate-800">
                              <MathRenderer content={q.options[optKey]} inline />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN II: TRẮC NGHIỆM ĐÚNG - SAI */}
            {examPaper.partII_true_false && examPaper.partII_true_false.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200 text-teal-950">
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                    PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI
                  </h4>
                  <p className="text-xs text-teal-900/80 mt-0.5">
                    Thí sinh trả lời từ câu{' '}
                    {(examPaper.partI_mcq?.length || 0) + 1} đến câu{' '}
                    {(examPaper.partI_mcq?.length || 0) + examPaper.partII_true_false.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.
                  </p>
                </div>

                <div className="space-y-4">
                  {examPaper.partII_true_false.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition shadow-2xs space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                          Câu {q.questionNumber}.
                        </span>
                        <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
                          <MathRenderer content={q.intro} />
                        </div>
                      </div>

                      {q.tikzFigures &&
                        q.tikzFigures.map((fig) => (
                          <TikZViewer key={fig.id} figure={fig} />
                        ))}

                      <div className="space-y-2 pl-2 sm:pl-4">
                        {q.items.map((sub) => (
                          <div
                            key={sub.key}
                            className="flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-900">
                                {sub.key})
                              </span>
                              <div className="text-slate-800">
                                <MathRenderer content={sub.content} inline />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getLevelBadge(sub.level)}
                              <div className="flex gap-1 text-[11px] font-bold">
                                <span className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-600">
                                  Đ
                                </span>
                                <span className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-600">
                                  S
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN III: TRẢ LỜI NGẮN */}
            {examPaper.partIII_short_answer && examPaper.partIII_short_answer.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-950">
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                    PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN
                  </h4>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    Thí sinh viết câu trả lời vào các ô quy định (kết quả là số, tối đa 4 ký tự).
                  </p>
                </div>

                <div className="space-y-4">
                  {examPaper.partIII_short_answer.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 flex-1">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                            Câu {q.questionNumber}.
                          </span>
                          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                            <MathRenderer content={q.content} />
                          </div>
                        </div>
                        {getLevelBadge(q.level)}
                      </div>

                      {q.tikzFigures &&
                        q.tikzFigures.map((fig) => (
                          <TikZViewer key={fig.id} figure={fig} />
                        ))}

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Đáp số:</span>
                        <div className="w-24 h-8 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center font-mono text-slate-400">
                          [.....]
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN IV: TỰ LUẬN */}
            {examPaper.partIV_essay && examPaper.partIV_essay.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-rose-950">
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                    PHẦN IV. TỰ LUẬN
                  </h4>
                  <p className="text-xs text-rose-900/80 mt-0.5">
                    Thí sinh trình bày lời giải chi tiết và các bước tính toán vào giấy làm bài.
                  </p>
                </div>

                <div className="space-y-4">
                  {examPaper.partIV_essay.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-rose-300 transition shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                            Câu {q.questionNumber} ({q.points} điểm).
                          </span>
                          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                            <MathRenderer content={q.content} />
                          </div>
                        </div>
                        {getLevelBadge(q.level)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center py-6 border-t border-slate-200 text-xs text-slate-500">
              <div className="font-bold text-slate-700 tracking-wider">
                ------------------------- HẾT -------------------------
              </div>
              <div className="italic mt-1">Cán bộ coi thi không giải thích gì thêm.</div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ĐÁP ÁN & HƯỚNG DẪN CHẤM */}
        {/* ==================================================== */}
        {activeTab === 'answers' && (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
                ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Kèm lời giải chi tiết, phương pháp giải và barem điểm từng bước
              </p>
            </div>

            {/* 1. Quick answer table Part I */}
            {answerKey.partI_keys && answerKey.partI_keys.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    1. Bảng đáp án nhanh Phần I (Trắc nghiệm ABCD):
                  </h4>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-center border-collapse">
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr className="bg-slate-100 font-bold text-slate-700">
                        <td className="p-2 font-sans font-bold text-slate-900 border-r border-slate-200">
                          Câu
                        </td>
                        {answerKey.partI_keys.map((k) => (
                          <td key={k.questionNumber} className="p-2 border-r border-slate-200">
                            {k.questionNumber}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-blue-50/50 font-bold text-blue-800 text-sm">
                        <td className="p-2 font-sans font-bold text-slate-900 border-r border-slate-200 text-xs">
                          Đáp án
                        </td>
                        {answerKey.partI_keys.map((k) => (
                          <td key={k.questionNumber} className="p-2 border-r border-slate-200">
                            {k.correctOption}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Part II True/False answers */}
            {answerKey.partII_keys && answerKey.partII_keys.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  2. Bảng đáp án Phần II (Đúng / Sai):
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-2 border-r border-slate-200">Câu hỏi</th>
                        <th className="p-2 border-r border-slate-200">Lệnh hỏi a)</th>
                        <th className="p-2 border-r border-slate-200">Lệnh hỏi b)</th>
                        <th className="p-2 border-r border-slate-200">Lệnh hỏi c)</th>
                        <th className="p-2 border-r border-slate-200">Lệnh hỏi d)</th>
                        <th className="p-2">Quy tắc tính điểm Bộ GD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {answerKey.partII_keys.map((k) => (
                        <tr key={k.questionNumber} className="hover:bg-slate-50">
                          <td className="p-2 font-bold border-r border-slate-200">
                            Câu {k.questionNumber}
                          </td>
                          {k.subItems.map((sub) => (
                            <td
                              key={sub.key}
                              className={`p-2 border-r border-slate-200 font-bold ${
                                sub.isCorrect
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                            </td>
                          ))}
                          <td className="p-2 text-[11px] text-slate-600 text-left">
                            {k.scoringRule || 'Đúng 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Part III Short Answer */}
            {answerKey.partIII_keys && answerKey.partIII_keys.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  3. Bảng đáp án Phần III (Trả lời ngắn):
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-center border-collapse">
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr className="bg-slate-100 font-bold text-slate-700">
                        <td className="p-2 font-sans font-bold text-slate-900 border-r border-slate-200">
                          Câu
                        </td>
                        {answerKey.partIII_keys.map((k) => (
                          <td key={k.questionNumber} className="p-2 border-r border-slate-200">
                            {k.questionNumber}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-amber-50/50 font-bold text-amber-800 text-sm">
                        <td className="p-2 font-sans font-bold text-slate-900 border-r border-slate-200 text-xs">
                          Đáp số
                        </td>
                        {answerKey.partIII_keys.map((k) => (
                          <td key={k.questionNumber} className="p-2 border-r border-slate-200">
                            {k.answer}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Detailed solutions */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 uppercase">
                4. Lời giải chi tiết và hướng dẫn chấm:
              </h4>

              {/* Part I Solutions */}
              {answerKey.partI_keys && answerKey.partI_keys.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg">
                    Phần I: Trắc nghiệm ABCD
                  </div>
                  {answerKey.partI_keys.map((k) => (
                    <div
                      key={k.questionNumber}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed"
                    >
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span>Câu {k.questionNumber}:</span>
                        <span className="text-blue-700 bg-blue-100 px-2 py-0.2 rounded font-bold">
                          Chọn {k.correctOption}
                        </span>
                        {getLevelBadge(k.level)}
                      </div>
                      <div className="text-slate-700 pl-2 border-l-2 border-blue-200">
                        <MathRenderer content={k.solution || 'Xem lý thuyết SGK.'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Part II Solutions */}
              {answerKey.partII_keys && answerKey.partII_keys.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg">
                    Phần II: Trắc nghiệm Đúng - Sai
                  </div>
                  {answerKey.partII_keys.map((k) => (
                    <div
                      key={k.questionNumber}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed space-y-2"
                    >
                      <div className="font-bold text-slate-900">
                        Câu {k.questionNumber}:
                      </div>
                      <div className="space-y-1.5 pl-2 border-l-2 border-teal-200">
                        {k.subItems.map((sub) => (
                          <div key={sub.key}>
                            <span
                              className={`font-bold mr-1 ${
                                sub.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              - Ý {sub.key}) [{sub.isCorrect ? 'ĐÚNG' : 'SAI'}]:
                            </span>
                            <MathRenderer content={sub.explanation} inline />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Part III Solutions */}
              {answerKey.partIII_keys && answerKey.partIII_keys.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg">
                    Phần III: Trả lời ngắn
                  </div>
                  {answerKey.partIII_keys.map((k) => (
                    <div
                      key={k.questionNumber}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed"
                    >
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span>Câu {k.questionNumber}:</span>
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.2 rounded font-bold font-mono">
                          Đáp số: {k.answer}
                        </span>
                        {getLevelBadge(k.level)}
                      </div>
                      <div className="text-slate-700 pl-2 border-l-2 border-amber-200">
                        <MathRenderer content={k.solution} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Part IV Solutions & Rubric */}
              {answerKey.partIV_keys && answerKey.partIV_keys.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg">
                    Phần IV: Tự luận & Barem điểm
                  </div>
                  {answerKey.partIV_keys.map((k) => (
                    <div
                      key={k.questionNumber}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed space-y-2"
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>
                          Câu {k.questionNumber} ({k.totalPoints} điểm)
                        </span>
                        {getLevelBadge(k.level)}
                      </div>
                      <div className="text-slate-800 pl-2 border-l-2 border-rose-200">
                        <div className="font-semibold text-slate-700 mb-1">Lời giải tổng quát:</div>
                        <MathRenderer content={k.solution} />
                      </div>

                      {k.rubric && k.rubric.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <div className="font-bold text-slate-800 mb-1">Barem điểm chấm chi tiết:</div>
                          <div className="space-y-1 pl-2">
                            {k.rubric.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start justify-between gap-2">
                                <div className="text-slate-700">
                                  + <MathRenderer content={step.stepDescription} inline />
                                </div>
                                <span className="font-bold text-emerald-700 whitespace-nowrap">
                                  {step.stepPoints}đ
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: MÃ TIKZ / LATEX STANDALONE */}
        {/* ==================================================== */}
        {activeTab === 'tikz' && (
          <div className="space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
                THƯ VIỆN MÃ TIKZ ĐỘC LẬP (STANDALONE)
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Dành cho giáo viên biên dịch đồ thị, bảng biến thiên trên Overleaf / LaTeX
              </p>
            </div>

            {tikzLibrary.map((fig) => (
              <TikZViewer key={fig.id} figure={fig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
