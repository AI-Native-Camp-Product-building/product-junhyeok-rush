"use client";

import { useCallback } from "react";
import type { ExplainContent } from "@/lib/types";
import { useAppState } from "@/lib/state-context";
import ThumbsReaction from "@/components/feedback/ThumbsReaction";

interface ExplainCardProps {
  content: ExplainContent;
  onComplete: () => void;
  onSkip: () => void;
  blockId: string;
}

/** Minimal markdown-to-HTML: headings, bold, inline code, code blocks, lists */
function markdownToHtml(md: string): string {
  let html = md;

  // Fenced code blocks (```...```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) =>
      `<pre class="font-mono text-sm bg-surface-900 border border-surface-700 rounded-lg p-4 overflow-x-auto my-4"><code>${code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</code></pre>`
  );

  // Headings
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-lg font-bold text-surface-100 mt-6 mb-2">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-xl font-bold text-surface-50 mt-6 mb-3">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-2xl font-bold text-surface-50 mt-6 mb-3">$1</h1>'
  );

  // Bold
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-surface-100">$1</strong>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="font-mono text-sm bg-surface-900 px-1.5 py-0.5 rounded text-accent-400">$1</code>'
  );

  // Unordered lists
  html = html.replace(
    /^[-*] (.+)$/gm,
    '<li class="ml-4 list-disc text-surface-200 leading-relaxed">$1</li>'
  );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li[^>]*>.*<\/li>\n?)+/g,
    (block) => `<ul class="my-3 space-y-1">${block}</ul>`
  );

  // Paragraphs: wrap remaining plain lines
  html = html.replace(
    /^(?!<[huplr])((?!<).+)$/gm,
    '<p class="text-surface-200 leading-relaxed mb-3">$1</p>'
  );

  return html;
}

export default function ExplainCard({
  content,
  onComplete,
  onSkip,
  blockId,
}: ExplainCardProps) {
  const { updateState } = useAppState();

  const handleSkip = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        skippedBlocks: prev.feedback.skippedBlocks.includes(blockId)
          ? prev.feedback.skippedBlocks
          : [...prev.feedback.skippedBlocks, blockId],
      },
    }));
    onSkip();
  }, [updateState, blockId, onSkip]);

  const htmlContent = markdownToHtml(content.markdown);

  return (
    <div className="space-y-6">
      {/* Header with skip button */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSkip}
          className="text-sm text-surface-400 hover:text-surface-200 transition-colors px-3 py-1 rounded-md border border-surface-700 hover:border-surface-500"
        >
          이미 알아요
        </button>
      </div>

      {/* Markdown content */}
      <div
        className="prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Key points */}
      {content.keyPoints.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">
            핵심 포인트
          </h4>
          {content.keyPoints.map((point, i) => (
            <div
              key={i}
              className="bg-surface-800 border-l-4 border-accent-400 rounded-r-lg px-4 py-3"
            >
              <p className="text-sm text-surface-200 leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Content reaction */}
      <ThumbsReaction contentId={blockId} className="pt-2" />

      {/* Continue button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onComplete}
          className="px-6 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors"
        >
          다음 단계로
        </button>
      </div>
    </div>
  );
}
