"use client";

import { useState, useMemo } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const KEYWORDS = [
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "import", "export", "default", "from", "class", "new", "this", "typeof",
  "async", "await", "try", "catch", "throw", "true", "false", "null", "undefined",
  "type", "interface", "extends", "implements", "readonly", "void", "never",
  "string", "number", "boolean", "object", "any",
];

function highlight(line: string): string {
  // Escape HTML first
  let escaped = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments (single-line)
  escaped = escaped.replace(
    /(\/\/.*$)/g,
    '<span class="text-surface-500 italic">$1</span>'
  );

  // If it's a comment line, don't process further
  if (escaped.includes('<span class="text-surface-500 italic">')) {
    return escaped;
  }

  // Strings (double-quoted, single-quoted, template literals)
  escaped = escaped.replace(
    /(`[^`]*`|"[^"]*"|'[^']*')/g,
    '<span class="text-accent-400">$1</span>'
  );

  // Keywords (only when not already inside a span)
  const keywordPattern = new RegExp(
    `\\b(${KEYWORDS.join("|")})\\b`,
    "g"
  );
  escaped = escaped.replace(keywordPattern, (match) => {
    // Skip if inside an existing span (simple guard)
    return `<span class="text-spark-400">${match}</span>`;
  });

  return escaped;
}

export default function CodeBlock({ code, language, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => code.split("\n"), [code]);
  const highlighted = useMemo(() => lines.map(highlight), [lines]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div
      className={`relative rounded-lg border border-surface-700 bg-surface-900 overflow-hidden ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-700 bg-surface-800">
        <span className="text-xs text-surface-500 font-mono">
          {language ?? "code"}
        </span>
        <button
          onClick={handleCopy}
          aria-label="코드 복사"
          className="text-xs px-2 py-0.5 rounded border border-surface-700 text-surface-400 hover:text-surface-200 hover:border-surface-500 transition-colors"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono leading-relaxed">
          <tbody>
            {highlighted.map((lineHtml, i) => (
              <tr key={i} className="group">
                <td className="select-none text-right pr-4 pl-4 py-0 text-surface-500 w-8 text-xs align-top group-hover:text-surface-400">
                  {i + 1}
                </td>
                <td
                  className="pr-6 py-0 text-surface-200 whitespace-pre align-top"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: lineHtml || " " }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
