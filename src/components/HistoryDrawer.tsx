import React from 'react';
import { History, X, Clock, FileText, ArrowRight, Trash2, Download } from 'lucide-react';
import { ExamPackage } from '../types/examTypes';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: ExamPackage[];
  currentId: string | null;
  onSelect: (pkg: ExamPackage) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyList,
  currentId,
  onSelect,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white">
              <History className="w-4 h-4 text-blue-100" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Lịch sử tạo đề trong phiên</h3>
              <p className="text-[11px] text-blue-200">{historyList.length} bộ đề đã lưu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-blue-200 hover:text-white hover:bg-blue-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
          {historyList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có lịch sử tạo đề nào trong phiên này.
            </div>
          ) : (
            historyList.map((pkg) => {
              const isCurrent = pkg.id === currentId;
              const time = new Date(pkg.createdAt).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    onSelect(pkg);
                    onClose();
                  }}
                  className={`p-3 rounded-lg border transition cursor-pointer bg-white ${
                    isCurrent
                      ? 'border-blue-600 ring-1 ring-blue-500 shadow-xs'
                      : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">
                      {pkg.examPaper.header.examTitle || 'Đề kiểm tra Toán 12'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {time}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mb-2 line-clamp-1">
                    {pkg.config.scopeTitle}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      Mã: <strong>{pkg.examPaper.header.examCode || '101'}</strong> •{' '}
                      {pkg.examPaper.header.durationMinutes} phút
                    </span>
                    <span className="text-blue-700 font-semibold flex items-center gap-1">
                      {isCurrent ? 'Đang xem' : 'Mở xem'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {historyList.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded hover:bg-rose-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 cursor-pointer shadow-xs transition"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
