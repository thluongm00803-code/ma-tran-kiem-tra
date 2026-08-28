import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Regex to detect math expressions:
    // 1. $$...$$ or \[...\] for display mode
    // 2. $...$ or \(...\) for inline mode
    // Also protect against escaped \$ if any.

    let text = content;

    // First replace display math $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-2 overflow-x-auto py-1 text-center">${katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        })}</div>`;
      } catch (err) {
        return `<span class="text-red-500 font-mono">[Lỗi công thức: ${math}]</span>`;
      }
    });

    // Replace \[...\]
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
      try {
        return `<div class="my-2 overflow-x-auto py-1 text-center">${katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        })}</div>`;
      } catch (err) {
        return `<span class="text-red-500 font-mono">[Lỗi công thức: ${math}]</span>`;
      }
    });

    // Replace inline math $...$ (avoiding double $)
    text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (err) {
        return `<span class="text-red-500 font-mono">[Lỗi công thức: ${math}]</span>`;
      }
    });

    // Replace \(...\)
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (err) {
        return `<span class="text-red-500 font-mono">[Lỗi công thức: ${math}]</span>`;
      }
    });

    // Convert line breaks to <br/> if not wrapped in paragraphs
    const formattedText = text.replace(/\n/g, '<br/>');

    return formattedText;
  }, [content]);

  if (inline) {
    return (
      <span
        className={`inline leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <div
      className={`leading-relaxed text-slate-800 dark:text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
