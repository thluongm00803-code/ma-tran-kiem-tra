import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Settings2,
  School,
  Clock,
  FileText,
  Percent,
} from 'lucide-react';
import {
  KNTT_GRADE12_CHAPTERS,
  PRESET_SCOPES,
  ChapterItem,
  LessonItem,
} from '../data/curriculumData';
import {
  FullExamConfig,
  ExamStructureConfig,
  ScoreWeightsConfig,
  ExamHeaderInfo,
} from '../types/examTypes';

interface ExamConfigFormProps {
  onGenerate: (config: FullExamConfig) => void;
  isGenerating: boolean;
}

export const ExamConfigForm: React.FC<ExamConfigFormProps> = ({
  onGenerate,
  isGenerating,
}) => {
  // Preset scope selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('scope-ch1');
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([
    'bai-1',
    'bai-2',
    'bai-3',
    'bai-4',
    'bai-5',
    'bai-cuoi-ch1',
  ]);
  const [isCustomLessonMode, setIsCustomLessonMode] = useState<boolean>(false);
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>(['ch1']);

  // Structure config
  const [structure, setStructure] = useState<ExamStructureConfig>({
    mcq_abcd: { NB: 6, TH: 4, VDT: 2, VDC: 0 }, // 12 câu = 3.0đ
    mcq_true_false: { NB: 1, TH: 2, VDT: 1, VDC: 0 }, // 4 câu = 4.0đ
    short_answer: { NB: 1, TH: 2, VDT: 2, VDC: 1 }, // 6 câu = 3.0đ
    essay: { VDT: 0, VDC: 0 },
  });

  // Score weights
  const [scoreWeights, setScoreWeights] = useState<ScoreWeightsConfig>({
    mcq_abcd_per_question: 0.25,
    mcq_tf_per_item: 0.25, // 1 câu 4 ý = 1.0đ
    short_answer_per_question: 0.5,
    essay_total_points: 0,
  });

  // Header info
  const [headerInfo, setHeaderInfo] = useState<ExamHeaderInfo>({
    schoolName: 'Trường THPT Chuyên / THPT',
    departmentName: 'Sở Giáo dục và Đào tạo',
    examTitle: 'Đề kiểm tra định kỳ môn Toán 12',
    subject: 'Toán học',
    grade: 'Lớp 12',
    durationMinutes: 90,
    academicYear: '2024 - 2025',
    examCode: '101',
    teacherName: 'Giáo viên Toán 12',
  });

  const [notes, setNotes] = useState<string>('Bám sát cấu trúc đề minh họa mới của Bộ GD&ĐT GDPT 2018');
  const [showAdvanceWeights, setShowAdvanceWeights] = useState(false);
  const [showLessonPicker, setShowLessonPicker] = useState(false);

  // Apply scope preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') {
      setIsCustomLessonMode(true);
      setShowLessonPicker(true);
      return;
    }
    setIsCustomLessonMode(false);
    const preset = PRESET_SCOPES.find((p) => p.id === presetId);
    if (preset) {
      setSelectedLessonIds(preset.lessonIds);
    }
  };

  // Toggle single lesson
  const toggleLesson = (lessonId: string) => {
    setIsCustomLessonMode(true);
    setSelectedPresetId('custom');
    if (selectedLessonIds.includes(lessonId)) {
      if (selectedLessonIds.length > 1) {
        setSelectedLessonIds(selectedLessonIds.filter((id) => id !== lessonId));
      }
    } else {
      setSelectedLessonIds([...selectedLessonIds, lessonId]);
    }
  };

  // Toggle entire chapter
  const toggleChapterAll = (chapter: ChapterItem) => {
    setIsCustomLessonMode(true);
    setSelectedPresetId('custom');
    const chapterLessonIds = chapter.lessons.map((l) => l.id);
    const allSelected = chapterLessonIds.every((id) => selectedLessonIds.includes(id));

    if (allSelected) {
      const remaining = selectedLessonIds.filter((id) => !chapterLessonIds.includes(id));
      setSelectedLessonIds(remaining.length > 0 ? remaining : [chapterLessonIds[0]]);
    } else {
      const combined = Array.from(new Set([...selectedLessonIds, ...chapterLessonIds]));
      setSelectedLessonIds(combined);
    }
  };

  const toggleExpandChapter = (chId: string) => {
    if (expandedChapterIds.includes(chId)) {
      setExpandedChapterIds(expandedChapterIds.filter((id) => id !== chId));
    } else {
      setExpandedChapterIds([...expandedChapterIds, chId]);
    }
  };

  // Standard exam templates presets
  const applyStructureTemplate = (type: 'tn_thpt_2025' | 'dinh_ky_tu_luan' | 'mot_tiet_trac_nghiem') => {
    if (type === 'tn_thpt_2025') {
      // 12 ABCD + 4 Đúng Sai + 6 Trả lời ngắn = 10.0đ
      setStructure({
        mcq_abcd: { NB: 6, TH: 4, VDT: 2, VDC: 0 },
        mcq_true_false: { NB: 1, TH: 2, VDT: 1, VDC: 0 },
        short_answer: { NB: 1, TH: 2, VDT: 2, VDC: 1 },
        essay: { VDT: 0, VDC: 0 },
      });
      setScoreWeights({
        mcq_abcd_per_question: 0.25,
        mcq_tf_per_item: 0.25,
        short_answer_per_question: 0.5,
        essay_total_points: 0,
      });
      setHeaderInfo((prev) => ({ ...prev, durationMinutes: 90 }));
    } else if (type === 'dinh_ky_tu_luan') {
      // 16 câu ABCD (4đ) + 2 câu Đúng Sai (2đ) + 2 câu Trả lời ngắn (1đ) + 2 câu Tự luận (3đ) = 10.0đ
      setStructure({
        mcq_abcd: { NB: 8, TH: 6, VDT: 2, VDC: 0 },
        mcq_true_false: { NB: 1, TH: 1, VDT: 0, VDC: 0 },
        short_answer: { NB: 0, TH: 1, VDT: 1, VDC: 0 },
        essay: { VDT: 1, VDC: 1 },
      });
      setScoreWeights({
        mcq_abcd_per_question: 0.25,
        mcq_tf_per_item: 0.25,
        short_answer_per_question: 0.5,
        essay_total_points: 3.0,
      });
      setHeaderInfo((prev) => ({ ...prev, durationMinutes: 45 }));
    } else if (type === 'mot_tiet_trac_nghiem') {
      // 20 câu ABCD (5đ) + 3 câu Đúng Sai (3đ) + 4 câu Trả lời ngắn (2đ) = 10.0đ
      setStructure({
        mcq_abcd: { NB: 10, TH: 6, VDT: 3, VDC: 1 },
        mcq_true_false: { NB: 1, TH: 1, VDT: 1, VDC: 0 },
        short_answer: { NB: 1, TH: 1, VDT: 1, VDC: 1 },
        essay: { VDT: 0, VDC: 0 },
      });
      setScoreWeights({
        mcq_abcd_per_question: 0.25,
        mcq_tf_per_item: 0.25,
        short_answer_per_question: 0.5,
        essay_total_points: 0,
      });
      setHeaderInfo((prev) => ({ ...prev, durationMinutes: 45 }));
    }
  };

  // Calculations
  const calcResults = useMemo(() => {
    const totalMcq =
      structure.mcq_abcd.NB +
      structure.mcq_abcd.TH +
      structure.mcq_abcd.VDT +
      structure.mcq_abcd.VDC;

    const totalTf =
      structure.mcq_true_false.NB +
      structure.mcq_true_false.TH +
      structure.mcq_true_false.VDT +
      structure.mcq_true_false.VDC;

    const totalSa =
      structure.short_answer.NB +
      structure.short_answer.TH +
      structure.short_answer.VDT +
      structure.short_answer.VDC;

    const totalEssay = structure.essay.VDT + structure.essay.VDC;

    const totalQuestions = totalMcq + totalTf + totalSa + totalEssay;

    // Points calculation
    const mcqPoints = totalMcq * scoreWeights.mcq_abcd_per_question;
    const tfPoints = totalTf * (scoreWeights.mcq_tf_per_item * 4); // 4 ý mỗi câu
    const saPoints = totalSa * scoreWeights.short_answer_per_question;
    const essayPoints = totalEssay > 0 ? scoreWeights.essay_total_points : 0;

    const totalPoints = mcqPoints + tfPoints + saPoints + essayPoints;

    // Cognitive levels calculation
    const countNB =
      structure.mcq_abcd.NB +
      structure.mcq_true_false.NB +
      structure.short_answer.NB;

    const countTH =
      structure.mcq_abcd.TH +
      structure.mcq_true_false.TH +
      structure.short_answer.TH;

    const countVDT =
      structure.mcq_abcd.VDT +
      structure.mcq_true_false.VDT +
      structure.short_answer.VDT +
      structure.essay.VDT;

    const countVDC =
      structure.mcq_abcd.VDC +
      structure.mcq_true_false.VDC +
      structure.short_answer.VDC +
      structure.essay.VDC;

    const totalLevelItems = countNB + countTH + countVDT + countVDC;
    const pctNB = totalLevelItems > 0 ? Math.round((countNB / totalLevelItems) * 100) : 0;
    const pctTH = totalLevelItems > 0 ? Math.round((countTH / totalLevelItems) * 100) : 0;
    const pctVDT = totalLevelItems > 0 ? Math.round((countVDT / totalLevelItems) * 100) : 0;
    const pctVDC = totalLevelItems > 0 ? Math.max(0, 100 - pctNB - pctTH - pctVDT) : 0;

    return {
      totalMcq,
      totalTf,
      totalSa,
      totalEssay,
      totalQuestions,
      mcqPoints,
      tfPoints,
      saPoints,
      essayPoints,
      totalPoints,
      countNB,
      countTH,
      countVDT,
      countVDC,
      pctNB,
      pctTH,
      pctVDT,
      pctVDC,
    };
  }, [structure, scoreWeights]);

  // Scope title helper
  const currentScopeTitle = useMemo(() => {
    if (!isCustomLessonMode) {
      const preset = PRESET_SCOPES.find((p) => p.id === selectedPresetId);
      if (preset) return preset.name;
    }
    return `Tùy biến (${selectedLessonIds.length} bài học)`;
  }, [isCustomLessonMode, selectedPresetId, selectedLessonIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLessonIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bài học.');
      return;
    }

    const config: FullExamConfig = {
      header: headerInfo,
      selectedLessonIds,
      scopeTitle: currentScopeTitle,
      structure,
      scoreWeights,
      notes,
    };

    onGenerate(config);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-blue-800 p-4 sm:p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white">
            <Sliders className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold leading-tight text-white">
              Cấu hình Ma trận & Đề kiểm tra
            </h2>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Toán 12 • SGK Kết nối tri thức với cuộc sống (GDPT 2018)
            </p>
          </div>
        </div>
        <span className="text-[11px] bg-blue-700 text-blue-100 px-2.5 py-1 rounded font-medium border border-blue-600">
          Chuẩn Bộ GD&ĐT
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5">
        {/* ==================================================== */}
        {/* BƯỚC 1: CHỌN BÀI KIỂM TRA */}
        {/* ==================================================== */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase text-slate-500 block">
              Bước 1: Chọn phạm vi kiến thức
            </label>
            <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Đã chọn: {selectedLessonIds.length} bài
            </span>
          </div>

          {/* Quick preset scope selector */}
          <div className="space-y-2">
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800 font-medium"
            >
              <optgroup label="Theo từng Chương (Toán 12 KNTT)">
                {PRESET_SCOPES.filter((p) => p.category === 'chapter').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Đề định kỳ Học kỳ / Tốt nghiệp THPT">
                {PRESET_SCOPES.filter((p) => p.category === 'term').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <option value="custom">Tự chọn danh sách bài học cụ thể (Tùy biến)...</option>
            </select>
          </div>

          {/* Expandable Lesson Picker */}
          <div className="mt-2 border border-slate-200 rounded overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowLessonPicker(!showLessonPicker)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                {showLessonPicker
                  ? 'Thu gọn danh mục 6 chương SGK Toán 12'
                  : 'Xem & Chọn chi tiết từng bài học trong 6 chương'}
              </span>
              {showLessonPicker ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {showLessonPicker && (
              <div className="p-3 border-t border-slate-200 space-y-2.5 max-h-72 overflow-y-auto bg-white">
                {KNTT_GRADE12_CHAPTERS.map((ch) => {
                  const isExpanded = expandedChapterIds.includes(ch.id);
                  const chLessonIds = ch.lessons.map((l) => l.id);
                  const selectedInCh = chLessonIds.filter((id) => selectedLessonIds.includes(id));
                  const isAllChSelected = selectedInCh.length === chLessonIds.length;
                  const isSomeSelected = selectedInCh.length > 0 && !isAllChSelected;

                  return (
                    <div key={ch.id} className="border border-slate-200 rounded overflow-hidden">
                      <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between gap-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isAllChSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = isSomeSelected;
                            }}
                            onChange={() => toggleChapterAll(ch)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => toggleExpandChapter(ch.id)}
                            className="text-left font-bold text-xs text-slate-800 hover:text-blue-700 truncate flex-1 cursor-pointer"
                          >
                            {ch.name}
                          </button>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {selectedInCh.length}/{ch.lessons.length} bài
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="p-2 space-y-1 bg-white">
                          {ch.lessons.map((lesson) => {
                            const isChecked = selectedLessonIds.includes(lesson.id);
                            return (
                              <label
                                key={lesson.id}
                                className={`flex items-start gap-2 p-1.5 rounded text-xs transition cursor-pointer ${
                                  isChecked
                                    ? 'bg-blue-50/80 text-blue-900 font-medium'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleLesson(lesson.id)}
                                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-slate-900">{lesson.name}</div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">
                                    {lesson.description}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================== */}
        {/* BƯỚC 2: CẤU HÌNH ĐỀ & MA TRẬN */}
        {/* ==================================================== */}
        <section className="pt-2 border-t border-slate-200">
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Bước 2: Cấu hình ma trận
          </label>

          {/* Quick Structure Preset Templates */}
          <div className="mb-3 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-600">
              Chọn mẫu cấu trúc chuẩn:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => applyStructureTemplate('tn_thpt_2025')}
                className="p-1.5 rounded border border-blue-300 hover:border-blue-600 bg-blue-50/70 text-left transition cursor-pointer text-[11px]"
              >
                <div className="font-bold text-blue-900 truncate">TN THPT 2025</div>
                <div className="text-[10px] text-slate-500">12+4+6 (10đ)</div>
              </button>

              <button
                type="button"
                onClick={() => applyStructureTemplate('dinh_ky_tu_luan')}
                className="p-1.5 rounded border border-slate-200 hover:border-blue-500 bg-slate-50 text-left transition cursor-pointer text-[11px]"
              >
                <div className="font-bold text-slate-800 truncate">Định kỳ + TL</div>
                <div className="text-[10px] text-slate-500">16+2+2+2 (10đ)</div>
              </button>

              <button
                type="button"
                onClick={() => applyStructureTemplate('mot_tiet_trac_nghiem')}
                className="p-1.5 rounded border border-slate-200 hover:border-blue-500 bg-slate-50 text-left transition cursor-pointer text-[11px]"
              >
                <div className="font-bold text-slate-800 truncate">1 Tiết TN</div>
                <div className="text-[10px] text-slate-500">20+3+4 (10đ)</div>
              </button>
            </div>
          </div>

          {/* Matrix Input Table */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-2 font-semibold text-slate-700">Hình thức</th>
                  <th className="p-2 font-semibold text-center text-slate-700">NB</th>
                  <th className="p-2 font-semibold text-center text-slate-700">TH</th>
                  <th className="p-2 font-semibold text-center text-slate-700">VD</th>
                  <th className="p-2 font-semibold text-center text-slate-700">VDC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Hàng 1: Trắc nghiệm ABCD */}
                <tr>
                  <td className="p-2 bg-slate-50 font-medium text-slate-800">
                    Trắc nghiệm ABCD (4 lựa chọn)
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={structure.mcq_abcd.NB}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_abcd: {
                            ...structure.mcq_abcd,
                            NB: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={structure.mcq_abcd.TH}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_abcd: {
                            ...structure.mcq_abcd,
                            TH: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={structure.mcq_abcd.VDT}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_abcd: {
                            ...structure.mcq_abcd,
                            VDT: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={structure.mcq_abcd.VDC}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_abcd: {
                            ...structure.mcq_abcd,
                            VDC: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                </tr>

                {/* Hàng 2: Trắc nghiệm Đúng - Sai */}
                <tr>
                  <td className="p-2 bg-slate-50 font-medium text-slate-800">
                    Đúng - Sai (4 ý)
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={structure.mcq_true_false.NB}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_true_false: {
                            ...structure.mcq_true_false,
                            NB: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={structure.mcq_true_false.TH}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_true_false: {
                            ...structure.mcq_true_false,
                            TH: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={structure.mcq_true_false.VDT}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_true_false: {
                            ...structure.mcq_true_false,
                            VDT: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={structure.mcq_true_false.VDC}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          mcq_true_false: {
                            ...structure.mcq_true_false,
                            VDC: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                </tr>

                {/* Hàng 3: Trả lời ngắn */}
                <tr>
                  <td className="p-2 bg-slate-50 font-medium text-slate-800">
                    Trả lời ngắn
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={structure.short_answer.NB}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          short_answer: {
                            ...structure.short_answer,
                            NB: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={structure.short_answer.TH}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          short_answer: {
                            ...structure.short_answer,
                            TH: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={structure.short_answer.VDT}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          short_answer: {
                            ...structure.short_answer,
                            VDT: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={structure.short_answer.VDC}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          short_answer: {
                            ...structure.short_answer,
                            VDC: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                </tr>

                {/* Hàng 4: Tự luận */}
                <tr>
                  <td className="p-2 bg-slate-50 font-medium text-slate-800">
                    Tự luận (nếu có)
                  </td>
                  <td className="p-1 text-center text-slate-300">-</td>
                  <td className="p-1 text-center text-slate-300">-</td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={structure.essay.VDT}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          essay: {
                            ...structure.essay,
                            VDT: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={structure.essay.VDC}
                      onChange={(e) =>
                        setStructure({
                          ...structure,
                          essay: {
                            ...structure.essay,
                            VDC: Math.max(0, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-full text-center border border-slate-300 rounded p-1 font-bold outline-none focus:border-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Bar */}
          <div className="mt-3 flex justify-between items-center text-sm font-bold bg-blue-50 p-2.5 rounded text-blue-800 border border-blue-100">
            <span>Tổng cộng: {calcResults.totalQuestions} câu</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal text-slate-500">
                (NB: {calcResults.pctNB}% • TH: {calcResults.pctTH}% • VD: {calcResults.pctVDT + calcResults.pctVDC}%)
              </span>
              <span>Điểm: {calcResults.totalPoints.toFixed(1)} / 10.0</span>
            </div>
          </div>

          {/* Toggle advance score weights */}
          <div className="mt-2 text-xs">
            <button
              type="button"
              onClick={() => setShowAdvanceWeights(!showAdvanceWeights)}
              className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {showAdvanceWeights ? 'Ẩn tùy chỉnh hệ số điểm' : 'Tùy chỉnh thang điểm / hệ số'}
            </button>

            {showAdvanceWeights && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Điểm mỗi câu ABCD:
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={scoreWeights.mcq_abcd_per_question}
                    onChange={(e) =>
                      setScoreWeights({
                        ...scoreWeights,
                        mcq_abcd_per_question: parseFloat(e.target.value) || 0.25,
                      })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Điểm mỗi câu Trả lời ngắn:
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={scoreWeights.short_answer_per_question}
                    onChange={(e) =>
                      setScoreWeights({
                        ...scoreWeights,
                        short_answer_per_question: parseFloat(e.target.value) || 0.5,
                      })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Điểm mỗi ý Đúng/Sai:
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={scoreWeights.mcq_tf_per_item}
                    onChange={(e) =>
                      setScoreWeights({
                        ...scoreWeights,
                        mcq_tf_per_item: parseFloat(e.target.value) || 0.25,
                      })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Tổng điểm phần Tự luận:
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={scoreWeights.essay_total_points}
                    onChange={(e) =>
                      setScoreWeights({
                        ...scoreWeights,
                        essay_total_points: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================================================== */}
        {/* THÔNG TIN TIÊU ĐỀ ĐỀ KIỂM TRA */}
        {/* ==================================================== */}
        <section className="pt-2 border-t border-slate-200">
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Thông tin đề kiểm tra (Header chuẩn)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="font-medium text-slate-600 block mb-1">Tên trường THPT:</label>
              <input
                type="text"
                value={headerInfo.schoolName}
                onChange={(e) => setHeaderInfo({ ...headerInfo, schoolName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Trường THPT Chu Văn An"
              />
            </div>
            <div>
              <label className="font-medium text-slate-600 block mb-1">Tiêu đề đề thi:</label>
              <input
                type="text"
                value={headerInfo.examTitle}
                onChange={(e) => setHeaderInfo({ ...headerInfo, examTitle: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Đề kiểm tra Giữa học kỳ I môn Toán 12"
              />
            </div>
            <div>
              <label className="font-medium text-slate-600 block mb-1">Thời gian làm bài:</label>
              <select
                value={headerInfo.durationMinutes}
                onChange={(e) =>
                  setHeaderInfo({ ...headerInfo, durationMinutes: parseInt(e.target.value) || 90 })
                }
                className="w-full p-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={45}>45 phút (Kiểm tra 1 tiết)</option>
                <option value={60}>60 phút</option>
                <option value={90}>90 phút (Chuẩn thi Tốt nghiệp THPT)</option>
                <option value={120}>120 phút</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-slate-600 block mb-1">Mã đề thi:</label>
              <input
                type="text"
                value={headerInfo.examCode}
                onChange={(e) => setHeaderInfo({ ...headerInfo, examCode: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="101"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Ghi chú thêm cho AI:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ví dụ: Đảm bảo có câu toán thực tế tối ưu hóa thể tích..."
            />
          </div>
        </section>

        {/* ==================================================== */}
        {/* NÚT TẠO ĐỀ */}
        {/* ==================================================== */}
        <div className="mt-auto pt-2 border-t border-slate-200 flex flex-col gap-2">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full font-bold py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition ${
              isGenerating
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ĐANG TẠO MA TRẬN & ĐỀ KIỂM TRA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>TẠO ĐỀ VỚI GEMINI AI</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Nội dung bám sát Chương trình GDPT 2018 - Toán 12 KNTT
          </p>
        </div>
      </form>
    </div>
  );
};
