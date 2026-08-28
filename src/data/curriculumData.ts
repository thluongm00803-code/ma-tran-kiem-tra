export interface LessonItem {
  id: string;
  code: string;
  name: string;
  chapterId: string;
  chapterName: string;
  semester: 1 | 2;
  description: string;
  standardCompetencies: string[];
}

export interface ChapterItem {
  id: string;
  name: string;
  semester: 1 | 2;
  bookVolume: 'Tập 1' | 'Tập 2';
  lessons: LessonItem[];
}

export const KNTT_GRADE12_CHAPTERS: ChapterItem[] = [
  {
    id: 'ch1',
    name: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
    semester: 1,
    bookVolume: 'Tập 1',
    lessons: [
      {
        id: 'bai-1',
        code: 'B1',
        name: 'Bài 1. Tính đơn điệu và cực trị của hàm số',
        chapterId: 'ch1',
        chapterName: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
        semester: 1,
        description: 'Xét tính đồng biến, nghịch biến của hàm số dựa vào dấu của đạo hàm cấp một; xác định các điểm cực trị (cực đại, cực tiểu) của hàm số.',
        standardCompetencies: [
          'Nhận biết tính đồng biến, nghịch biến của hàm số thông qua bảng biến thiên hoặc đồ thị.',
          'Tìm các khoảng đơn điệu và điểm cực trị của hàm đa thức bậc 3, hàm phân thức hữu tỉ $y=\\frac{ax+b}{cx+d}$ và $y=\\frac{ax^2+bx+c}{dx+e}$.',
          'Vận dụng đạo hàm tìm tham số $m$ để hàm số đơn điệu hoặc có cực trị thỏa mãn điều kiện cho trước.'
        ]
      },
      {
        id: 'bai-2',
        code: 'B2',
        name: 'Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số',
        chapterId: 'ch1',
        chapterName: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
        semester: 1,
        description: 'Định nghĩa GTLN, GTNN của hàm số trên một tập hợp; quy tắc tìm GTLN, GTNN trên đoạn $[a; b]$ và trên khoảng/nửa khoảng.',
        standardCompetencies: [
          'Nhận biết GTLN, GTNN của hàm số trên một tập số thực qua bảng biến thiên hoặc đồ thị.',
          'Tính GTLN, GTNN của hàm số trên đoạn $[a; b]$ bằng phương pháp đạo hàm.',
          'Vận dụng bài toán GTLN, GTNN vào bài toán thực tiễn tối ưu hóa (chi phí, diện tích, thể tích, lợi nhuận).'
        ]
      },
      {
        id: 'bai-3',
        code: 'B3',
        name: 'Bài 3. Đường tiệm cận của đồ thị hàm số',
        chapterId: 'ch1',
        chapterName: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
        semester: 1,
        description: 'Khái niệm đường tiệm cận đứng, tiệm cận ngang, tiệm cận xiên của đồ thị hàm số thông qua giới hạn tại vô cực và tại điểm gián đoạn.',
        standardCompetencies: [
          'Nhận biết đường tiệm cận đứng, tiệm cận ngang, tiệm cận xiên qua bảng biến thiên hoặc đồ thị.',
          'Tìm phương trình các đường tiệm cận của hàm số phân thức bậc nhất/bậc nhất $y=\\frac{ax+b}{cx+d}$ và bậc hai/bậc nhất $y=\\frac{ax^2+bx+c}{dx+e}$.',
          'Vận dụng tính chất tiệm cận giải các bài toán tương giao, khoảng cách, diện tích hình phẳng giới hạn bởi tiệm cận.'
        ]
      },
      {
        id: 'bai-4',
        code: 'B4',
        name: 'Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số',
        chapterId: 'ch1',
        chapterName: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
        semester: 1,
        description: 'Sơ đồ khảo sát hàm số bậc ba, hàm phân thức $y=\\frac{ax+b}{cx+d}$, $y=\\frac{ax^2+bx+c}{dx+e}$; tâm đối xứng, trục đối xứng của đồ thị.',
        standardCompetencies: [
          'Nhận dạng đồ thị, bảng biến thiên của hàm số bậc ba và hàm phân thức hữu tỉ.',
          'Khảo sát và vẽ hoàn chỉnh đồ thị hàm số.',
          'Vận dụng đồ thị biện luận số nghiệm của phương trình, bất phương trình có chứa tham số.'
        ]
      },
      {
        id: 'bai-5',
        code: 'B5',
        name: 'Bài 5. Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn',
        chapterId: 'ch1',
        chapterName: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
        semester: 1,
        description: 'Giải các bài toán tối ưu trong hình học, vật lí, kinh tế, đời sống (tối ưu hóa thể tích hộp, chi phí sản xuất, tốc độ thay đổi).',
        standardCompetencies: [
          'Mô hình hóa bài toán thực tiễn thành hàm số một biến $f(x)$.',
          'Vận dụng đạo hàm tìm điểm tối ưu (cực trị, GTLN, GTNN) phù hợp với điều kiện bài toán.',
          'Giải thích ý nghĩa thực tiễn của kết quả tìm được.'
        ]
      },
      {
        id: 'bai-cuoi-ch1',
        code: 'OT1',
        name: 'Bài tập cuối chương I',
        chapterId: 'ch1',
        chapterName: 'Chương I. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
        semester: 1,
        description: 'Tổng hợp toàn bộ kiến thức về đạo hàm, tính đơn điệu, cực trị, GTLN-GTNN, tiệm cận, đồ thị và ứng dụng thực tiễn.',
        standardCompetencies: [
          'Hệ thống hóa và vận dụng tổng hợp các kiến thức của Chương I để giải quyết các dạng toán tổng hợp và phân loại.'
        ]
      }
    ]
  },
  {
    id: 'ch2',
    name: 'Chương II. Vectơ và hệ tọa độ trong không gian',
    semester: 1,
    bookVolume: 'Tập 1',
    lessons: [
      {
        id: 'bai-6',
        code: 'B6',
        name: 'Bài 6. Vectơ trong không gian',
        chapterId: 'ch2',
        chapterName: 'Chương II. Vectơ và hệ tọa độ trong không gian',
        semester: 1,
        description: 'Định nghĩa vectơ trong không gian, các phép toán cộng, trừ vectơ, nhân vectơ với một số, tích vô hướng của hai vectơ, góc giữa hai vectơ.',
        standardCompetencies: [
          'Thực hiện các phép toán vectơ trong không gian (quy tắc 3 điểm, quy tắc hình hộp, quy tắc hình bình hành).',
          'Tính góc giữa hai vectơ và tích vô hướng của hai vectơ trong không gian.',
          'Vận dụng vectơ để chứng minh hai đường thẳng vuông góc, tính khoảng cách và góc.'
        ]
      },
      {
        id: 'bai-7',
        code: 'B7',
        name: 'Bài 7. Hệ trục tọa độ trong không gian',
        chapterId: 'ch2',
        chapterName: 'Chương II. Vectơ và hệ tọa độ trong không gian',
        semester: 1,
        description: 'Hệ trục tọa độ Oxyz trong không gian, tọa độ của một điểm, tọa độ của một vectơ, các vectơ đơn vị $\\vec{i}, \\vec{j}, \\vec{k}$.',
        standardCompetencies: [
          'Xác định tọa độ của điểm và vectơ trong hệ trục tọa độ Oxyz.',
          'Tìm tọa độ trung điểm đoạn thẳng, tọa độ trọng tâm tam giác trong không gian.'
        ]
      },
      {
        id: 'bai-8',
        code: 'B8',
        name: 'Bài 8. Biểu thức tọa độ của các phép toán vectơ',
        chapterId: 'ch2',
        chapterName: 'Chương II. Vectơ và hệ tọa độ trong không gian',
        semester: 1,
        description: 'Biểu thức tọa độ của phép cộng, trừ vectơ, nhân vectơ với số thực; biểu thức tọa độ của tích vô hướng, độ dài vectơ, khoảng cách giữa 2 điểm, góc giữa 2 vectơ.',
        standardCompetencies: [
          'Tính toán biểu thức tọa độ của các phép toán vectơ, độ dài vectơ, tích vô hướng.',
          'Tính khoảng cách giữa hai điểm, côsin góc giữa hai vectơ bằng tọa độ.',
          'Ứng dụng tọa độ giải các bài toán thực tiễn liên quan đến chuyển động, vận tốc và lực trong không gian 3 chiều.'
        ]
      },
      {
        id: 'bai-cuoi-ch2',
        code: 'OT2',
        name: 'Bài tập cuối chương II',
        chapterId: 'ch2',
        chapterName: 'Chương II. Vectơ và hệ tọa độ trong không gian',
        semester: 1,
        description: 'Tổng hợp kiến thức về vectơ và phương pháp tọa độ cơ bản trong không gian Oxyz.',
        standardCompetencies: [
          'Vận dụng tổng hợp hệ tọa độ Oxyz và các phép toán vectơ vào giải quyết các bài toán hình học không gian và thực tiễn.'
        ]
      }
    ]
  },
  {
    id: 'ch3',
    name: 'Chương III. Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm',
    semester: 1,
    bookVolume: 'Tập 1',
    lessons: [
      {
        id: 'bai-9',
        code: 'B9',
        name: 'Bài 9. Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm',
        chapterId: 'ch3',
        chapterName: 'Chương III. Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm',
        semester: 1,
        description: 'Khái niệm và cách tính khoảng biến thiên, khoảng tứ phân vị, giá trị ngoại lệ của mẫu số liệu ghép nhóm.',
        standardCompetencies: [
          'Đọc và lập bảng phân bố tần số ghép nhóm.',
          'Tính khoảng biến thiên $R$ và khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$ của mẫu số liệu ghép nhóm.',
          'Giải thích ý nghĩa của khoảng biến thiên và khoảng tứ phân vị trong việc đánh giá độ phân tán của mẫu số liệu.'
        ]
      },
      {
        id: 'bai-10',
        code: 'B10',
        name: 'Bài 10. Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm',
        chapterId: 'ch3',
        chapterName: 'Chương III. Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm',
        semester: 1,
        description: 'Công thức tính số trung bình, phương sai $s^2$ và độ lệch chuẩn $s$ của mẫu số liệu ghép nhóm; ý nghĩa thực tế.',
        standardCompetencies: [
          'Tính số trung bình $\\bar{x}$, phương sai $s^2$, độ lệch chuẩn $s$ của mẫu số liệu ghép nhóm.',
          'So sánh độ phân tán của hai mẫu số liệu ghép nhóm cùng đơn vị đo và cùng mức độ trung bình.',
          'Vận dụng các số đặc trưng phân tán vào phân tích số liệu thực tiễn (năng suất, điểm thi, chất lượng sản phẩm).'
        ]
      },
      {
        id: 'bai-cuoi-ch3',
        code: 'OT3',
        name: 'Bài tập cuối chương III',
        chapterId: 'ch3',
        chapterName: 'Chương III. Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm',
        semester: 1,
        description: 'Tổng hợp các số đặc trưng đo xu thế trung tâm và mức độ phân tán cho mẫu số liệu ghép nhóm.',
        standardCompetencies: [
          'Vận dụng toàn diện các số đặc trưng thống kê mô tả mẫu số liệu ghép nhóm để xử lý bài toán thực tiễn.'
        ]
      }
    ]
  },
  {
    id: 'ch4',
    name: 'Chương IV. Nguyên hàm và tích phân',
    semester: 2,
    bookVolume: 'Tập 2',
    lessons: [
      {
        id: 'bai-11',
        code: 'B11',
        name: 'Bài 11. Nguyên hàm',
        chapterId: 'ch4',
        chapterName: 'Chương IV. Nguyên hàm và tích phân',
        semester: 2,
        description: 'Định nghĩa nguyên hàm, các tính chất cơ bản của nguyên hàm, bảng nguyên hàm của các hàm số sơ cấp thường gặp.',
        standardCompetencies: [
          'Nhận biết khái niệm nguyên hàm và các tính chất: $\\int kf(x)dx = k\\int f(x)dx$, $\\int [f(x) \\pm g(x)]dx$.',
          'Sử dụng bảng nguyên hàm cơ bản để tìm họ nguyên hàm của hàm đa thức, lượng giác, mũ, logarit.',
          'Vận dụng phương pháp đổi biến số và từng phần để tìm nguyên hàm.'
        ]
      },
      {
        id: 'bai-12',
        code: 'B12',
        name: 'Bài 12. Tích phân',
        chapterId: 'ch4',
        chapterName: 'Chương IV. Nguyên hàm và tích phân',
        semester: 2,
        description: 'Định nghĩa tích phân theo công thức Newton-Leibniz, các tính chất của tích phân, phương pháp tính tích phân.',
        standardCompetencies: [
          'Tính tích phân bằng định nghĩa và công thức Newton-Leibniz.',
          'Áp dụng các tính chất của tích phân (cộng đoạn, bất biến đối với phép tịnh tiến, đổi cận).',
          'Tính tích phân bằng phương pháp đổi biến số và từng phần.'
        ]
      },
      {
        id: 'bai-13',
        code: 'B13',
        name: 'Bài 13. Ứng dụng hình học của tích phân trong thực tiễn',
        chapterId: 'ch4',
        chapterName: 'Chương IV. Nguyên hàm và tích phân',
        semester: 2,
        description: 'Tính diện tích hình phẳng giới hạn bởi các đường cong; tính thể tích khối tròn xoay; ứng dụng vật lí và thực tiễn.',
        standardCompetencies: [
          'Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số $y=f(x)$, trục hoành và hai đường thẳng $x=a, x=b$.',
          'Tính thể tích vật thể tròn xoay khi quay hình phẳng quanh trục tọa độ.',
          'Vận dụng tích phân giải các bài toán thực tiễn (quãng đường chuyển động $s(t) = \\int v(t)dt$, công sinh ra, lưu lượng chất lỏng).'
        ]
      },
      {
        id: 'bai-cuoi-ch4',
        code: 'OT4',
        name: 'Bài tập cuối chương IV',
        chapterId: 'ch4',
        chapterName: 'Chương IV. Nguyên hàm và tích phân',
        semester: 2,
        description: 'Tổng hợp kiến thức nguyên hàm, tích phân và ứng dụng.',
        standardCompetencies: [
          'Giải quyết các bài toán tích hợp về giải tích tích phân và mô hình hóa thực tế.'
        ]
      }
    ]
  },
  {
    id: 'ch5',
    name: 'Chương V. Phương pháp tọa độ trong không gian',
    semester: 2,
    bookVolume: 'Tập 2',
    lessons: [
      {
        id: 'bai-14',
        code: 'B14',
        name: 'Bài 14. Phương trình mặt phẳng',
        chapterId: 'ch5',
        chapterName: 'Chương V. Phương pháp tọa độ trong không gian',
        semester: 2,
        description: 'Vectơ pháp tuyến của mặt phẳng, phương trình tổng quát của mặt phẳng, vị trí tương đối giữa hai mặt phẳng.',
        standardCompetencies: [
          'Viết phương trình tổng quát của mặt phẳng đi qua 1 điểm có VTPT hoặc đi qua 3 điểm không thẳng hàng.',
          'Xét vị trí tương đối giữa hai mặt phẳng (song song, cắt nhau, trùng nhau, vuông góc).'
        ]
      },
      {
        id: 'bai-15',
        code: 'B15',
        name: 'Bài 15. Phương trình đường thẳng trong không gian',
        chapterId: 'ch5',
        chapterName: 'Chương V. Phương pháp tọa độ trong không gian',
        semester: 2,
        description: 'Vectơ chỉ phương của đường thẳng, phương trình tham số, phương trình chính tắc của đường thẳng; vị trí tương đối giữa hai đường thẳng, giữa đường thẳng và mặt phẳng.',
        standardCompetencies: [
          'Lập phương trình tham số, chính tắc của đường thẳng.',
          'Xét vị trí tương đối giữa hai đường thẳng, giữa đường thẳng và mặt phẳng.',
          'Tìm tọa độ giao điểm của đường thẳng và mặt phẳng.'
        ]
      },
      {
        id: 'bai-16',
        code: 'B16',
        name: 'Bài 16. Công thức tính góc và khoảng cách trong không gian',
        chapterId: 'ch5',
        chapterName: 'Chương V. Phương pháp tọa độ trong không gian',
        semester: 2,
        description: 'Góc giữa hai đường thẳng, góc giữa đường thẳng và mặt phẳng, góc giữa hai mặt phẳng; khoảng cách từ điểm đến mặt phẳng, khoảng cách giữa 2 mặt phẳng song song, đường chéo nhau.',
        standardCompetencies: [
          'Tính góc giữa hai đường thẳng, góc giữa đường thẳng và mặt phẳng, góc nhị diện.',
          'Tính khoảng cách từ một điểm đến mặt phẳng, khoảng cách giữa hai đường thẳng chéo nhau bằng phương pháp tọa độ.'
        ]
      },
      {
        id: 'bai-17',
        code: 'B17',
        name: 'Bài 17. Phương trình mặt cầu',
        chapterId: 'ch5',
        chapterName: 'Chương V. Phương pháp tọa độ trong không gian',
        semester: 2,
        description: 'Phương trình chính tắc và phương trình tổng quát của mặt cầu $(S)$; điều kiện để là mặt cầu; vị trí tương đối của mặt cầu với mặt phẳng và đường thẳng.',
        standardCompetencies: [
          'Xác định tâm và bán kính của mặt cầu từ phương trình.',
          'Lập phương trình mặt cầu thỏa mãn các điều kiện cho trước (biết tâm và bán kính, biết đường kính, đi qua các điểm).',
          'Vận dụng phương trình mặt cầu giải bài toán tiếp xúc, tương giao.'
        ]
      },
      {
        id: 'bai-cuoi-ch5',
        code: 'OT5',
        name: 'Bài tập cuối chương V',
        chapterId: 'ch5',
        chapterName: 'Chương V. Phương pháp tọa độ trong không gian',
        semester: 2,
        description: 'Tổng hợp hình học giải tích không gian Oxyz.',
        standardCompetencies: [
          'Vận dụng tổng hợp phương pháp tọa độ Oxyz vào mô hình hóa bài toán không gian thực tế (radar, GPS, kiến trúc).'
        ]
      }
    ]
  },
  {
    id: 'ch6',
    name: 'Chương VI. Xác suất có điều kiện',
    semester: 2,
    bookVolume: 'Tập 2',
    lessons: [
      {
        id: 'bai-18',
        code: 'B18',
        name: 'Bài 18. Xác suất có điều kiện',
        chapterId: 'ch6',
        chapterName: 'Chương VI. Xác suất có điều kiện',
        semester: 2,
        description: 'Khái niệm xác suất có điều kiện $P(A|B)$, công thức nhân xác suất cho hai biến cố $P(AB) = P(B)P(A|B)$, sơ đồ hình cây.',
        standardCompetencies: [
          'Hiểu và tính xác suất có điều kiện của một biến cố khi biết biến cố khác đã xảy ra.',
          'Sử dụng công thức nhân xác suất và sơ đồ hình cây để mô hình hóa bài toán xác suất.'
        ]
      },
      {
        id: 'bai-19',
        code: 'B19',
        name: 'Bài 19. Công thức xác suất toàn phần và công thức Bayes',
        chapterId: 'ch6',
        chapterName: 'Chương VI. Xác suất có điều kiện',
        semester: 2,
        description: 'Hệ biến cố đầy đủ, công thức xác suất toàn phần, công thức Bayes và ứng dụng trong y học, chuẩn đoán, kiểm định chất lượng.',
        standardCompetencies: [
          'Nhận biết hệ biến cố đầy đủ.',
          'Áp dụng công thức xác suất toàn phần để tính xác suất của biến cố.',
          'Sử dụng công thức Bayes để tính xác suất tiên nghiệm và hậu nghiệm trong các tình huống thực tiễn (xét nghiệm bệnh, tỉ lệ lỗi sản phẩm).'
        ]
      },
      {
        id: 'bai-cuoi-ch6',
        code: 'OT6',
        name: 'Bài tập cuối chương VI',
        chapterId: 'ch6',
        chapterName: 'Chương VI. Xác suất có điều kiện',
        semester: 2,
        description: 'Tổng hợp xác suất nâng cao lớp 12 GDPT 2018.',
        standardCompetencies: [
          'Vận dụng linh hoạt công thức xác suất toàn phần và công thức Bayes giải các bài toán thực tiễn phức tạp.'
        ]
      }
    ]
  }
];

export interface ExamScopePreset {
  id: string;
  name: string;
  category: 'lesson' | 'chapter' | 'term';
  lessonIds: string[];
  description: string;
}

export const PRESET_SCOPES: ExamScopePreset[] = [
  {
    id: 'scope-ch1',
    name: 'Cả Chương I: Đạo hàm & Khảo sát hàm số (Tập 1)',
    category: 'chapter',
    lessonIds: ['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-cuoi-ch1'],
    description: 'Bao gồm toàn bộ 5 bài học và bài tập cuối chương I'
  },
  {
    id: 'scope-ch2',
    name: 'Cả Chương II: Vectơ & Tọa độ trong không gian (Tập 1)',
    category: 'chapter',
    lessonIds: ['bai-6', 'bai-7', 'bai-8', 'bai-cuoi-ch2'],
    description: 'Bao gồm vectơ không gian, hệ tọa độ Oxyz và biểu thức tọa độ'
  },
  {
    id: 'scope-ch3',
    name: 'Cả Chương III: Số đặc trưng đo phân tán số liệu ghép nhóm (Tập 1)',
    category: 'chapter',
    lessonIds: ['bai-9', 'bai-10', 'bai-cuoi-ch3'],
    description: 'Bao gồm khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn'
  },
  {
    id: 'scope-midterm-1',
    name: 'Đề kiểm tra Giữa Học kỳ I (Chương I + Nửa Chương II)',
    category: 'term',
    lessonIds: ['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'bai-7'],
    description: 'Trọng tâm Chương I (70%) và khởi đầu Chương II Vectơ trong không gian (30%)'
  },
  {
    id: 'scope-final-1',
    name: 'Đề kiểm tra Cuối Học kỳ I (Toàn bộ Chương I, II, III)',
    category: 'term',
    lessonIds: ['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'bai-7', 'bai-8', 'bai-9', 'bai-10'],
    description: 'Tổng hợp kiến thức toàn bộ Học kỳ 1: Khảo sát hàm số (50%), Vectơ Oxyz (30%), Thống kê mẫu ghép nhóm (20%)'
  },
  {
    id: 'scope-ch4',
    name: 'Cả Chương IV: Nguyên hàm & Tích phân (Tập 2)',
    category: 'chapter',
    lessonIds: ['bai-11', 'bai-12', 'bai-13', 'bai-cuoi-ch4'],
    description: 'Nguyên hàm, tích phân và ứng dụng hình học/thực tiễn'
  },
  {
    id: 'scope-ch5',
    name: 'Cả Chương V: Phương pháp tọa độ Oxyz (Tập 2)',
    category: 'chapter',
    lessonIds: ['bai-14', 'bai-15', 'bai-16', 'bai-17', 'bai-cuoi-ch5'],
    description: 'Mặt phẳng, đường thẳng, góc & khoảng cách, mặt cầu'
  },
  {
    id: 'scope-ch6',
    name: 'Cả Chương VI: Xác suất có điều kiện & Bayes (Tập 2)',
    category: 'chapter',
    lessonIds: ['bai-18', 'bai-19', 'bai-cuoi-ch6'],
    description: 'Xác suất có điều kiện, xác suất toàn phần, công thức Bayes'
  },
  {
    id: 'scope-midterm-2',
    name: 'Đề kiểm tra Giữa Học kỳ II (Chương IV + Nửa Chương V)',
    category: 'term',
    lessonIds: ['bai-11', 'bai-12', 'bai-13', 'bai-14', 'bai-15'],
    description: 'Nguyên hàm - tích phân (60%) và Mặt phẳng, Đường thẳng Oxyz (40%)'
  },
  {
    id: 'scope-final-2',
    name: 'Đề kiểm tra Cuối Học kỳ II / Đề chuẩn Cấu trúc Tốt nghiệp THPT 2025',
    category: 'term',
    lessonIds: [
      'bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5',
      'bai-6', 'bai-7', 'bai-8',
      'bai-9', 'bai-10',
      'bai-11', 'bai-12', 'bai-13',
      'bai-14', 'bai-15', 'bai-16', 'bai-17',
      'bai-18', 'bai-19'
    ],
    description: 'Cấu trúc ma trận chuẩn Bộ GD&ĐT GDPT 2018 Toán 12 bao trùm toàn cấp'
  }
];
