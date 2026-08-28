/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExamConfigForm } from './components/ExamConfigForm';
import { ExamPreview } from './components/ExamPreview';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExamPackage, FullExamConfig } from './types/examTypes';

export default function App() {
  const [currentExamPackage, setCurrentExamPackage] = useState<ExamPackage | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examHistory, setExamHistory] = useState<ExamPackage[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<FullExamConfig | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate exam handler
  const handleGenerate = async (config: FullExamConfig) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setCurrentConfig(config);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      if (data.success && data.examPackage) {
        setCurrentExamPackage(data.examPackage);
        setExamHistory((prev) => [data.examPackage, ...prev.filter((p) => p.id !== data.examPackage.id)]);
      } else {
        throw new Error(data.error || 'Không thể tạo đề kiểm tra');
      }
    } catch (err: any) {
      console.error('Lỗi khi tạo đề kiểm tra:', err);
      setErrorMessage(
        err.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate with existing config
  const handleRegenerate = () => {
    if (currentConfig) {
      handleGenerate(currentConfig);
    } else if (currentExamPackage?.config) {
      handleGenerate(currentExamPackage.config);
    }
  };

  // Auto-generate a default exam on first load
  useEffect(() => {
    const defaultConfig: FullExamConfig = {
      header: {
        schoolName: 'Trường THPT Chu Văn An',
        departmentName: 'Sở Giáo dục và Đào tạo',
        examTitle: 'Đề kiểm tra định kỳ môn Toán 12',
        subject: 'Toán học',
        grade: 'Lớp 12',
        durationMinutes: 90,
        academicYear: '2024 - 2025',
        examCode: '101',
        teacherName: 'Giáo viên Toán 12',
      },
      selectedLessonIds: [
        'bai-1',
        'bai-2',
        'bai-3',
        'bai-4',
        'bai-5',
        'bai-cuoi-ch1',
      ],
      scopeTitle: 'Chương I. Đạo hàm và Khảo sát đồ thị hàm số',
      structure: {
        mcq_abcd: { NB: 6, TH: 4, VDT: 2, VDC: 0 },
        mcq_true_false: { NB: 1, TH: 2, VDT: 1, VDC: 0 },
        short_answer: { NB: 1, TH: 2, VDT: 2, VDC: 1 },
        essay: { VDT: 0, VDC: 0 },
      },
      scoreWeights: {
        mcq_abcd_per_question: 0.25,
        mcq_tf_per_item: 0.25,
        short_answer_per_question: 0.5,
        essay_total_points: 0,
      },
      notes: 'Bám sát SGK Toán 12 KNTT và định dạng đề mới nhất 2025 của Bộ GD&ĐT',
    };

    handleGenerate(defaultConfig);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans antialiased">
      {/* Top Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={examHistory.length}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs sm:text-sm flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">⚠️ <strong>Thông báo lỗi:</strong> {errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 font-bold hover:text-rose-800 px-2 py-0.5 rounded hover:bg-rose-100 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Config Form (5 cols on large screens) */}
          <div className="lg:col-span-5 w-full">
            <ExamConfigForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: 4-Product Preview (7 cols on large screens) */}
          <div className="lg:col-span-7 w-full">
            <ExamPreview
              examPackage={currentExamPackage}
              isLoading={isGenerating}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={examHistory}
        currentId={currentExamPackage?.id || null}
        onSelect={(pkg) => {
          setCurrentExamPackage(pkg);
          setCurrentConfig(pkg.config);
        }}
        onClear={() => {
          setExamHistory([]);
          setIsHistoryOpen(false);
        }}
      />
    </div>
  );
}
