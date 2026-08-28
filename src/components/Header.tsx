import React, { useState } from 'react';
import { BookOpen, Sparkles, HelpCircle, History, Calculator, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenHistory?: () => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, historyCount = 0 }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <header className="h-16 bg-blue-800 text-white flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-md sticky top-0 z-30">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-xs">
          <Calculator className="w-5 h-5 text-blue-800" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
            SmartMath 12
            <span className="font-normal text-blue-100 text-xs sm:text-sm">
              | Trợ lý soạn Ma trận & Đề kiểm tra KNTT (GDPT 2018)
            </span>
          </h1>
          <p className="text-[11px] text-blue-200 hidden md:block">
            Tự động sinh Ma trận • Bản đặc tả • Đề thi THPT • Đáp án & HDC • Mã TikZ
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="text-xs sm:text-sm bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition flex items-center gap-1.5 border border-blue-600/60 cursor-pointer"
            title="Xem các đề kiểm tra đã tạo trong phiên"
          >
            <History className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline font-medium">Lịch sử soạn đề</span>
            {historyCount > 0 && (
              <span className="flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-white text-blue-800 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-medium transition flex items-center gap-1 border border-blue-600/60 cursor-pointer"
          title="Quy chuẩn & Hướng dẫn sử dụng"
        >
          <HelpCircle className="w-4 h-4 text-blue-200" />
          <span className="hidden sm:inline">Quy chuẩn</span>
        </button>

        {/* User avatar badge */}
        <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-400/80 flex items-center justify-center text-xs font-bold text-white shadow-xs" title="Tài khoản Giáo viên">
          GV
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white text-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Quy chuẩn thiết kế Đề kiểm tra Toán 12 (GDPT 2018)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-950">
                <p className="font-bold mb-1.5 text-blue-900">🎯 Trọn bộ 4 sản phẩm chuẩn khảo thí:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-blue-900">
                  <li><strong>1. Bảng Ma trận đề:</strong> Phân phối số câu, tỷ lệ %, điểm số theo 4 mức độ nhận thức (NB - TH - VDT - VDC).</li>
                  <li><strong>2. Bản Đặc tả:</strong> Mô tả chi tiết yêu cầu cần đạt bám sát SGK Toán 12 Kết nối tri thức.</li>
                  <li><strong>3. Đề kiểm tra chuẩn THPT:</strong> Định dạng chuẩn đề thi quốc gia, công thức LaTeX và mã TikZ độc lập.</li>
                  <li><strong>4. Đáp án & HDC:</strong> Bảng đáp án nhanh, barem điểm từng phần và lời giải chi tiết từng bước.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Cấu trúc 4 phần của bài kiểm tra:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li><strong>Phần I (Trắc nghiệm 4 lựa chọn ABCD):</strong> 0,25 điểm/câu. Đáp án ngẫu nhiên phân bổ đều.</li>
                  <li><strong>Phần II (Trắc nghiệm Đúng/Sai):</strong> Mỗi câu 4 ý a, b, c, d. Thang điểm Bộ GD&ĐT: đúng 1 ý 0.1đ; 2 ý 0.25đ; 3 ý 0.5đ; 4 ý 1.0đ.</li>
                  <li><strong>Phần III (Trả lời ngắn):</strong> 0,25đ - 0,5đ/câu. Đáp số là số tối đa 4 ký tự.</li>
                  <li><strong>Phần IV (Tự luận):</strong> Dành cho đề kiểm tra định kỳ có thành phần tự luận.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Xuất file Word (.docx) chuẩn A4:</h4>
                <p className="text-xs text-slate-600">
                  Tải ngay trọn bộ 4 sản phẩm trong 1 file Word hoặc tải riêng từng tài liệu với font <strong>Times New Roman</strong>, bảng biểu ngay ngắn và công thức toán học sắc nét.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition cursor-pointer"
              >
                Đã hiểu & Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
