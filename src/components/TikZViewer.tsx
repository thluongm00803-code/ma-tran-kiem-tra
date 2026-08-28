import React, { useState } from 'react';
import { Copy, Check, Code, Image as ImageIcon, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { TikZFigure } from '../types/examTypes';

interface TikZViewerProps {
  figure: TikZFigure;
  className?: string;
}

export const TikZViewer: React.FC<TikZViewerProps> = ({ figure, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [showFullDoc, setShowFullDoc] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getFullStandaloneCode = () => {
    return `% ==========================================
% MÃ TIKZ ĐỘC LẬP (STANDALONE) - TOÁN 12 KNTT
% Biên dịch bằng TeXLive, MikTeX hoặc Overleaf
% ==========================================
\\documentclass[tikz,border=6mm]{standalone}
\\usepackage[utf8]{vietnam}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\usetikzlibrary{arrows.meta,calc,intersections,patterns,angles,quotes,3d}

\\begin{document}
${figure.tikzCode}
\\end{document}`;
  };

  const handleCopy = async () => {
    const textToCopy = showFullDoc ? getFullStandaloneCode() : figure.tikzCode;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className={`my-4 border border-slate-200 rounded-lg bg-white shadow-xs overflow-hidden ${className}`}>
      <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-800 text-white text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Hình minh họa / Bảng biến thiên (TikZ)
            </h4>
            {figure.caption && (
              <p className="text-[11px] text-slate-500 font-medium">{figure.caption}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFullDoc(!showFullDoc)}
            className="text-xs px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition cursor-pointer shadow-xs"
            title="Chuyển đổi giữa mã tikzpicture và mã file .tex hoàn chỉnh"
          >
            {showFullDoc ? 'Chỉ mã TikZ' : 'Mã .tex đầy đủ'}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`text-xs px-2.5 py-1 rounded font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy mã TikZ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            title={expanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto relative">
        <div className="absolute top-2 right-2 text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase font-sans">
          LaTeX / TikZ Standalone
        </div>
        <pre
          className={`leading-relaxed transition-all ${
            expanded ? 'max-h-[500px]' : 'max-h-44'
          } overflow-y-auto pr-8`}
        >
          <code>{showFullDoc ? getFullStandaloneCode() : figure.tikzCode}</code>
        </pre>
      </div>

      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Code className="w-3.5 h-3.5 text-blue-500" />
          Tương thích 100% với TeXLive, MikTeX, Overleaf, LaTeX2HTML
        </span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:underline cursor-pointer font-medium"
        >
          {expanded ? 'Thu gọn mã' : 'Xem toàn bộ mã'}
        </button>
      </div>
    </div>
  );
};
