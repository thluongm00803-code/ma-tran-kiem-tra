import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
  TableLayoutType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ExamPackage, CognitiveLevel } from '../types/examTypes';

const FONT_FAMILY = 'Times New Roman';
const PRIMARY_COLOR = '1E40AF'; // Blue 800
const HEADER_BG = 'F1F5F9'; // Slate 100

// Helper to convert simple latex formulas to readable math unicode in Word
function cleanMathForWord(text: string): string {
  if (!text) return '';
  let str = text;
  // Replace common LaTeX symbols with unicode characters
  str = str
    .replace(/\\vec\{([a-zA-Z0-9]+)\}/g, '$1\u20D7')
    .replace(/\\overrightarrow\{([a-zA-Z0-9]+)\}/g, '$1\u20D7')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt\[(\d+)\]\{([^{}]+)\}/g, '$1√($2)')
    .replace(/\\in\b/g, '∈')
    .replace(/\\notin\b/g, '∉')
    .replace(/\\subset\b/g, '⊂')
    .replace(/\\cap\b/g, '∩')
    .replace(/\\cup\b/g, '∪')
    .replace(/\\infty\b/g, '∞')
    .replace(/\\pm\b/g, '±')
    .replace(/\\le\b|\\leq\b/g, '≤')
    .replace(/\\ge\b|\\geq\b/g, '≥')
    .replace(/\\ne\b|\\neq\b/g, '≠')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\int\b/g, '∫')
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\\gamma\b/g, 'γ')
    .replace(/\\delta\b/g, 'δ')
    .replace(/\\Delta\b/g, 'Δ')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\lambda\b/g, 'λ')
    .replace(/\\mu\b/g, 'μ')
    .replace(/\\sigma\b/g, 'σ')
    .replace(/\\theta\b/g, 'θ')
    .replace(/\\times\b/g, '×')
    .replace(/\\cdot\b/g, '·')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^\{([^}]+)\}/g, '^($1)')
    .replace(/\_\{([^}]+)\}/g, '_($1)')
    .replace(/\$/g, ''); // strip dollar signs

  return str;
}

// Level name helper
function getLevelLabel(level: CognitiveLevel | string): string {
  switch (level) {
    case 'NB':
      return '[NB - Nhận biết]';
    case 'TH':
      return '[TH - Thông hiểu]';
    case 'VDT':
      return '[VDT - Vận dụng]';
    case 'VDC':
      return '[VDC - Vận dụng cao]';
    default:
      return `[${level}]`;
  }
}

// Standard header table for exam paper
function createHeaderTable(pkg: ExamPackage, titleSuffix: string = ''): Table {
  const { header } = pkg.config;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (header.departmentName || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO').toUpperCase(),
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (header.schoolName || 'TRƯỜNG THPT CHU VĂN AN').toUpperCase(),
                    font: FONT_FAMILY,
                    bold: true,
                    size: 21,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '--------------------',
                    font: FONT_FAMILY,
                    size: 18,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Mã đề: ${header.examCode || '101'}`,
                    font: FONT_FAMILY,
                    bold: true,
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: (header.examTitle || 'ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TOÁN 12').toUpperCase() +
                      (titleSuffix ? ` - ${titleSuffix.toUpperCase()}` : ''),
                    font: FONT_FAMILY,
                    bold: true,
                    size: 22,
                    color: PRIMARY_COLOR,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'BỘ SGK: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG - GDPT 2018',
                    font: FONT_FAMILY,
                    italics: true,
                    size: 19,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Năm học: ${header.academicYear || '2024 - 2025'} | Thời gian làm bài: ${header.durationMinutes || 90} phút`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `(Đề thi gồm có các phần: Trắc nghiệm ABCD, Đúng - Sai, Trả lời ngắn & Tự luận)`,
                    font: FONT_FAMILY,
                    italics: true,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Student info box
function createStudentInfoSection(): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 180, after: 120 },
      children: [
        new TextRun({
          text: 'Họ và tên thí sinh: .................................................................... Số báo danh: ....................... Lớp: ..............',
          font: FONT_FAMILY,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: '------------------------------------------------------------------------------------------------------------------',
          font: FONT_FAMILY,
          color: '94A3B8',
          size: 16,
        }),
      ],
    }),
  ];
}

// 1. Matrix Document Section
function buildMatrixDocx(pkg: ExamPackage): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 150 },
      children: [
        new TextRun({
          text: 'I. MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN LỚP 12',
          font: FONT_FAMILY,
          bold: true,
          size: 26,
          color: PRIMARY_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Phạm vi: ${pkg.config.scopeTitle} | Thang điểm: 10,0 điểm`,
          font: FONT_FAMILY,
          italics: true,
          size: 22,
        }),
      ],
    })
  );

  const headerCells = [
    'TT',
    'Chương / Chủ đề',
    'Nội dung / Đơn vị kiến thức',
    'Nhiều lựa chọn (NB-TH-VD-VDC)',
    'Đúng - Sai (Số ý)',
    'Trả lời ngắn (Số câu)',
    'Tự luận (VD-VDC)',
    'Tổng điểm (%)',
  ];

  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: headerCells.map(
        (title) =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: title,
                    font: FONT_FAMILY,
                    bold: true,
                    size: 19,
                  }),
                ],
              }),
            ],
          })
      ),
    }),
  ];

  pkg.matrix.rows.forEach((row, idx) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${idx + 1}`, font: FONT_FAMILY, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.topicName, font: FONT_FAMILY, bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: row.contentUnit, font: FONT_FAMILY, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${row.mcq_nb} / ${row.mcq_th} / ${row.mcq_vdt} / ${row.mcq_vdc}`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${row.tf_nb} / ${row.tf_th} / ${row.tf_vdt} / ${row.tf_vdc}`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${row.sa_nb} / ${row.sa_th} / ${row.sa_vdt} / ${row.sa_vdc}`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${row.essay_vdt} / ${row.essay_vdc}`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${row.totalPoints.toFixed(2)}đ (${row.percentageScore}%)`,
                    font: FONT_FAMILY,
                    bold: true,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  });

  // Summary Row
  const { summary } = pkg.matrix;
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 3,
          shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'TỔNG CỘNG THEO MỨC ĐỘ NHẬN THỨC:',
                  font: FONT_FAMILY,
                  bold: true,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          columnSpan: 4,
          shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Nhận biết: ${summary.ratio_nb}% | Thông hiểu: ${summary.ratio_th}% | Vận dụng: ${summary.ratio_vdt}% | VDC: ${summary.ratio_vdc}%`,
                  font: FONT_FAMILY,
                  bold: true,
                  size: 20,
                  color: PRIMARY_COLOR,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${summary.total_score.toFixed(1)} điểm (100%)`,
                  font: FONT_FAMILY,
                  bold: true,
                  size: 20,
                  color: PRIMARY_COLOR,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    })
  );

  return elements;
}

// 2. Specification Document Section
function buildSpecificationDocx(pkg: ExamPackage): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 150 },
      children: [
        new TextRun({
          text: 'II. BẢN ĐẶC TẢ ĐỀ KIỂM TRA MÔN TOÁN 12 (GDPT 2018)',
          font: FONT_FAMILY,
          bold: true,
          size: 26,
          color: PRIMARY_COLOR,
        }),
      ],
    })
  );

  const specRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'STT', font: FONT_FAMILY, bold: true, size: 19 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Chủ đề / Đơn vị KT', font: FONT_FAMILY, bold: true, size: 19 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 46, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Mức độ đánh giá / Yêu cầu cần đạt chuẩn GDPT 2018',
                  font: FONT_FAMILY,
                  bold: true,
                  size: 19,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Hình thức & Mức độ', font: FONT_FAMILY, bold: true, size: 19 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Số câu / Vị trí', font: FONT_FAMILY, bold: true, size: 19 })],
            }),
          ],
        }),
      ],
    }),
  ];

  pkg.specification.items.forEach((item, idx) => {
    item.questionTypes.forEach((qt, qIdx) => {
      specRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: qIdx === 0 ? `${idx + 1}` : '', font: FONT_FAMILY, size: 20 })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: qIdx === 0 ? `${item.topic}\n- ${item.contentUnit}` : '',
                      font: FONT_FAMILY,
                      bold: qIdx === 0,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cleanMathForWord(qt.description || item.competencyStandard),
                      font: FONT_FAMILY,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${getLevelLabel(qt.level)}`,
                      font: FONT_FAMILY,
                      bold: true,
                      size: 19,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: qt.questionNumbers,
                      font: FONT_FAMILY,
                      bold: true,
                      size: 20,
                      color: PRIMARY_COLOR,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });
  });

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: specRows,
    })
  );

  return elements;
}

// 3. Exam Paper Section
function buildExamPaperDocx(pkg: ExamPackage): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const { examPaper } = pkg;

  // Header Table + Student info
  elements.push(createHeaderTable(pkg));
  elements.push(...createStudentInfoSection());

  // PART I: MCQ ABCD
  if (examPaper.partI_mcq && examPaper.partI_mcq.length > 0) {
    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN',
            font: FONT_FAMILY,
            bold: true,
            size: 23,
            color: PRIMARY_COLOR,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu 1 đến câu ${examPaper.partI_mcq.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất.`,
            font: FONT_FAMILY,
            italics: true,
            size: 21,
          }),
        ],
      })
    );

    examPaper.partI_mcq.forEach((q) => {
      elements.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `Câu ${q.questionNumber} ${getLevelLabel(q.level)}: `,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: cleanMathForWord(q.content),
              font: FONT_FAMILY,
              size: 22,
            }),
          ],
        })
      );

      // If there's TikZ code attached
      if (q.tikzFigures && q.tikzFigures.length > 0) {
        q.tikzFigures.forEach((fig) => {
          elements.push(
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: `[Hình minh họa TikZ: ${fig.caption || 'Hình vẽ/Bảng biến thiên'}]`,
                  font: FONT_FAMILY,
                  italics: true,
                  size: 19,
                  color: '2563EB',
                }),
              ],
            })
          );
        });
      }

      // Options A, B, C, D in a neat 2-column or 4-option row
      elements.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: 'A. ', font: FONT_FAMILY, bold: true, size: 22 }),
            new TextRun({ text: `${cleanMathForWord(q.options.A)}    `, font: FONT_FAMILY, size: 22 }),
            new TextRun({ text: 'B. ', font: FONT_FAMILY, bold: true, size: 22 }),
            new TextRun({ text: `${cleanMathForWord(q.options.B)}    `, font: FONT_FAMILY, size: 22 }),
            new TextRun({ text: 'C. ', font: FONT_FAMILY, bold: true, size: 22 }),
            new TextRun({ text: `${cleanMathForWord(q.options.C)}    `, font: FONT_FAMILY, size: 22 }),
            new TextRun({ text: 'D. ', font: FONT_FAMILY, bold: true, size: 22 }),
            new TextRun({ text: `${cleanMathForWord(q.options.D)}`, font: FONT_FAMILY, size: 22 }),
          ],
        })
      );
    });
  }

  // PART II: TRUE / FALSE
  if (examPaper.partII_true_false && examPaper.partII_true_false.length > 0) {
    const startQ = (examPaper.partI_mcq?.length || 0) + 1;
    const endQ = (examPaper.partI_mcq?.length || 0) + examPaper.partII_true_false.length;

    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 250, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI',
            font: FONT_FAMILY,
            bold: true,
            size: 23,
            color: PRIMARY_COLOR,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu ${startQ} đến câu ${endQ}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`,
            font: FONT_FAMILY,
            italics: true,
            size: 21,
          }),
        ],
      })
    );

    examPaper.partII_true_false.forEach((q) => {
      elements.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: `Câu ${q.questionNumber}: `,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: cleanMathForWord(q.intro),
              font: FONT_FAMILY,
              size: 22,
            }),
          ],
        })
      );

      if (q.tikzFigures && q.tikzFigures.length > 0) {
        q.tikzFigures.forEach((fig) => {
          elements.push(
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: `[Hình minh họa TikZ: ${fig.caption || 'Hình vẽ/Bảng biến thiên'}]`,
                  font: FONT_FAMILY,
                  italics: true,
                  size: 19,
                  color: '2563EB',
                }),
              ],
            })
          );
        });
      }

      q.items.forEach((sub) => {
        elements.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${sub.key}) `,
                font: FONT_FAMILY,
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: `${getLevelLabel(sub.level)} `,
                font: FONT_FAMILY,
                italics: true,
                size: 19,
                color: '475569',
              }),
              new TextRun({
                text: cleanMathForWord(sub.content),
                font: FONT_FAMILY,
                size: 22,
              }),
            ],
          })
        );
      });
    });
  }

  // PART III: SHORT ANSWER
  if (examPaper.partIII_short_answer && examPaper.partIII_short_answer.length > 0) {
    const startQ =
      (examPaper.partI_mcq?.length || 0) + (examPaper.partII_true_false?.length || 0) + 1;
    const endQ =
      (examPaper.partI_mcq?.length || 0) +
      (examPaper.partII_true_false?.length || 0) +
      examPaper.partIII_short_answer.length;

    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 250, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN',
            font: FONT_FAMILY,
            bold: true,
            size: 23,
            color: PRIMARY_COLOR,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: `Thí sinh trả lời từ câu ${startQ} đến câu ${endQ}. Viết câu trả lời vào ô quy định (số tối đa 4 ký tự).`,
            font: FONT_FAMILY,
            italics: true,
            size: 21,
          }),
        ],
      })
    );

    examPaper.partIII_short_answer.forEach((q) => {
      elements.push(
        new Paragraph({
          spacing: { before: 120, after: 100 },
          children: [
            new TextRun({
              text: `Câu ${q.questionNumber} ${getLevelLabel(q.level)}: `,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: cleanMathForWord(q.content),
              font: FONT_FAMILY,
              size: 22,
            }),
          ],
        })
      );
    });
  }

  // PART IV: ESSAY (IF ANY)
  if (examPaper.partIV_essay && examPaper.partIV_essay.length > 0) {
    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 250, after: 120 },
        children: [
          new TextRun({
            text: 'PHẦN IV. TỰ LUẬN',
            font: FONT_FAMILY,
            bold: true,
            size: 23,
            color: PRIMARY_COLOR,
          }),
        ],
      })
    );

    examPaper.partIV_essay.forEach((q) => {
      elements.push(
        new Paragraph({
          spacing: { before: 120, after: 100 },
          children: [
            new TextRun({
              text: `Câu ${q.questionNumber} (${q.points} điểm) ${getLevelLabel(q.level)}: `,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: cleanMathForWord(q.content),
              font: FONT_FAMILY,
              size: 22,
            }),
          ],
        })
      );
    });
  }

  // Footer note
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({
          text: '-------------------------- HẾT --------------------------',
          font: FONT_FAMILY,
          bold: true,
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Cán bộ coi thi không giải thích gì thêm.',
          font: FONT_FAMILY,
          italics: true,
          size: 19,
        }),
      ],
    })
  );

  return elements;
}

// 4. Answer Key & Grading Guide Section
function buildAnswerKeyDocx(pkg: ExamPackage): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const { answerKey } = pkg;

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 250, after: 150 },
      children: [
        new TextRun({
          text: 'III. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT',
          font: FONT_FAMILY,
          bold: true,
          size: 26,
          color: PRIMARY_COLOR,
        }),
      ],
    })
  );

  // 1. Quick answer table for Part I
  if (answerKey.partI_keys && answerKey.partI_keys.length > 0) {
    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 150, after: 100 },
        children: [
          new TextRun({
            text: '1. Bảng đáp án Phần I - Trắc nghiệm nhiều phương án lựa chọn',
            font: FONT_FAMILY,
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    const part1Rows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Câu', font: FONT_FAMILY, bold: true, size: 20 })],
              }),
            ],
          }),
          ...answerKey.partI_keys.map(
            (k) =>
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `${k.questionNumber}`, font: FONT_FAMILY, bold: true, size: 20 })],
                  }),
                ],
              })
          ),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Đáp án', font: FONT_FAMILY, bold: true, size: 20 })],
              }),
            ],
          }),
          ...answerKey.partI_keys.map(
            (k) =>
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${k.correctOption}`,
                        font: FONT_FAMILY,
                        bold: true,
                        size: 21,
                        color: PRIMARY_COLOR,
                      }),
                    ],
                  }),
                ],
              })
          ),
        ],
      }),
    ];

    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: part1Rows,
      })
    );
  }

  // 2. Part II True/False answers
  if (answerKey.partII_keys && answerKey.partII_keys.length > 0) {
    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: '2. Bảng đáp án Phần II - Trắc nghiệm Đúng / Sai',
            font: FONT_FAMILY,
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    const tfRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: ['Câu hỏi', 'Lệnh hỏi a)', 'Lệnh hỏi b)', 'Lệnh hỏi c)', 'Lệnh hỏi d)', 'Quy tắc tính điểm'].map(
          (h) =>
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: h, font: FONT_FAMILY, bold: true, size: 20 })],
                }),
              ],
            })
        ),
      }),
    ];

    answerKey.partII_keys.forEach((k) => {
      tfRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Câu ${k.questionNumber}`, font: FONT_FAMILY, bold: true, size: 20 })],
                }),
              ],
            }),
            ...k.subItems.map(
              (sub) =>
                new TableCell({
                  shading: {
                    type: ShadingType.CLEAR,
                    fill: sub.isCorrect ? 'ECFDF5' : 'FEF2F2',
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: sub.isCorrect ? 'ĐÚNG' : 'SAI',
                          font: FONT_FAMILY,
                          bold: true,
                          size: 20,
                          color: sub.isCorrect ? '059669' : 'DC2626',
                        }),
                      ],
                    }),
                  ],
                })
            ),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: k.scoringRule || 'Đúng 1 ý: 0,1đ; 2 ý: 0,25đ; 3 ý: 0,5đ; 4 ý: 1,0đ',
                      font: FONT_FAMILY,
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });

    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tfRows,
      })
    );
  }

  // 3. Part III Short answer keys
  if (answerKey.partIII_keys && answerKey.partIII_keys.length > 0) {
    elements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: '3. Bảng đáp án Phần III - Trả lời ngắn',
            font: FONT_FAMILY,
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    const saRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Câu', font: FONT_FAMILY, bold: true, size: 20 })],
              }),
            ],
          }),
          ...answerKey.partIII_keys.map(
            (k) =>
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `${k.questionNumber}`, font: FONT_FAMILY, bold: true, size: 20 })],
                  }),
                ],
              })
          ),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Đáp số', font: FONT_FAMILY, bold: true, size: 20 })],
              }),
            ],
          }),
          ...answerKey.partIII_keys.map(
            (k) =>
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${k.answer}`,
                        font: FONT_FAMILY,
                        bold: true,
                        size: 21,
                        color: PRIMARY_COLOR,
                      }),
                    ],
                  }),
                ],
              })
          ),
        ],
      }),
    ];

    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: saRows,
      })
    );
  }

  // 4. Detailed Step-by-Step Solutions
  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [
        new TextRun({
          text: '4. Hướng dẫn giải chi tiết từng câu',
          font: FONT_FAMILY,
          bold: true,
          size: 24,
          color: PRIMARY_COLOR,
        }),
      ],
    })
  );

  // Detailed solutions for Part I
  if (answerKey.partI_keys && answerKey.partI_keys.length > 0) {
    answerKey.partI_keys.forEach((k) => {
      elements.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `Câu ${k.questionNumber} (Chọn ${k.correctOption}): `,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
              color: PRIMARY_COLOR,
            }),
            new TextRun({
              text: cleanMathForWord(k.solution || 'Xem lý thuyết SGK.'),
              font: FONT_FAMILY,
              size: 21,
            }),
          ],
        })
      );
    });
  }

  // Detailed solutions for Part II
  if (answerKey.partII_keys && answerKey.partII_keys.length > 0) {
    answerKey.partII_keys.forEach((k) => {
      elements.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          children: [
            new TextRun({
              text: `Câu ${k.questionNumber}:`,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
              color: PRIMARY_COLOR,
            }),
          ],
        })
      );
      k.subItems.forEach((sub) => {
        elements.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: `- Ý ${sub.key}) [${sub.isCorrect ? 'Đúng' : 'Sai'}]: `,
                font: FONT_FAMILY,
                bold: true,
                size: 21,
                color: sub.isCorrect ? '059669' : 'DC2626',
              }),
              new TextRun({
                text: cleanMathForWord(sub.explanation),
                font: FONT_FAMILY,
                size: 21,
              }),
            ],
          })
        );
      });
    });
  }

  // Detailed solutions for Part III
  if (answerKey.partIII_keys && answerKey.partIII_keys.length > 0) {
    answerKey.partIII_keys.forEach((k) => {
      elements.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `Câu ${k.questionNumber} (Đáp số: ${k.answer}): `,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
              color: PRIMARY_COLOR,
            }),
            new TextRun({
              text: cleanMathForWord(k.solution || ''),
              font: FONT_FAMILY,
              size: 21,
            }),
          ],
        })
      );
    });
  }

  // Detailed solutions & Rubric for Part IV Essay
  if (answerKey.partIV_keys && answerKey.partIV_keys.length > 0) {
    answerKey.partIV_keys.forEach((k) => {
      elements.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: `Câu ${k.questionNumber} (Tự luận - ${k.totalPoints} điểm):`,
              font: FONT_FAMILY,
              bold: true,
              size: 22,
              color: PRIMARY_COLOR,
            }),
          ],
        }),
        new Paragraph({
          indent: { left: 300 },
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `Lời giải tổng quát: ${cleanMathForWord(k.solution)}`,
              font: FONT_FAMILY,
              size: 21,
            }),
          ],
        })
      );

      if (k.rubric && k.rubric.length > 0) {
        elements.push(
          new Paragraph({
            indent: { left: 300 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'Barem điểm chi tiết:',
                font: FONT_FAMILY,
                bold: true,
                italics: true,
                size: 20,
              }),
            ],
          })
        );

        k.rubric.forEach((step) => {
          elements.push(
            new Paragraph({
              indent: { left: 600 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: `+ ${cleanMathForWord(step.stepDescription)}: `,
                  font: FONT_FAMILY,
                  size: 20,
                }),
                new TextRun({
                  text: `(${step.stepPoints} điểm)`,
                  font: FONT_FAMILY,
                  bold: true,
                  size: 20,
                  color: '059669',
                }),
              ],
            })
          );
        });
      }
    });
  }

  return elements;
}

// 5. TikZ Library Appendix for TeX users
function buildTikZAppendixDocx(pkg: ExamPackage): (Paragraph | Table)[] {
  if (!pkg.tikzLibrary || pkg.tikzLibrary.length === 0) return [];

  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 150 },
      children: [
        new TextRun({
          text: 'IV. PHỤ LỤC MÃ NGUỒN TIKZ (DÀNH CHO BIÊN DỊCH LATEX)',
          font: FONT_FAMILY,
          bold: true,
          size: 24,
          color: PRIMARY_COLOR,
        }),
      ],
    })
  );

  pkg.tikzLibrary.forEach((fig, index) => {
    elements.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({
            text: `Hình ${index + 1}: ${fig.caption || 'Hình vẽ toán học TikZ'}`,
            font: FONT_FAMILY,
            bold: true,
            size: 21,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: fig.tikzCode,
            font: 'Courier New',
            size: 18,
            color: '334155',
          }),
        ],
      })
    );
  });

  return elements;
}

// ==========================================
// EXPORT METHODS
// ==========================================

export async function exportAllToDocx(pkg: ExamPackage) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT_FAMILY, size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // ~2cm
          },
        },
        children: [
          ...buildMatrixDocx(pkg),
          new Paragraph({ pageBreakBefore: true }),
          ...buildSpecificationDocx(pkg),
          new Paragraph({ pageBreakBefore: true }),
          ...buildExamPaperDocx(pkg),
          new Paragraph({ pageBreakBefore: true }),
          ...buildAnswerKeyDocx(pkg),
          ...(pkg.tikzLibrary && pkg.tikzLibrary.length > 0
            ? [new Paragraph({ pageBreakBefore: true }), ...buildTikZAppendixDocx(pkg)]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(
    blob,
    `De_Kiem_Tra_Toan_12_KNTT_${pkg.config.header.examCode || '101'}_Day_Du_4_San_Pham.docx`
  );
}

export async function exportMatrixToDocx(pkg: ExamPackage) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
        },
        children: [...buildMatrixDocx(pkg)],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Ma_Tran_De_Toan_12_KNTT_${pkg.config.header.examCode || '101'}.docx`);
}

export async function exportSpecificationToDocx(pkg: ExamPackage) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
        },
        children: [...buildSpecificationDocx(pkg)],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Ban_Dac_Ta_De_Toan_12_KNTT_${pkg.config.header.examCode || '101'}.docx`);
}

export async function exportExamPaperToDocx(pkg: ExamPackage) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
        },
        children: [...buildExamPaperDocx(pkg)],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `De_Kiem_Tra_Toan_12_KNTT_${pkg.config.header.examCode || '101'}.docx`);
}

export async function exportAnswerKeyToDocx(pkg: ExamPackage) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
        },
        children: [...buildAnswerKeyDocx(pkg)],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Dap_An_Huong_Dan_Cham_Toan_12_KNTT_${pkg.config.header.examCode || '101'}.docx`);
}
