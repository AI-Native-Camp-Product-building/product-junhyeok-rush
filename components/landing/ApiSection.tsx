"use client";

import { useState } from "react";

export function ApiSection() {
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function issueKey() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", { method: "POST" });
      if (!res.ok) throw new Error(`Failed to issue key (HTTP ${res.status})`);
      const data = await res.json();
      setKey(data.key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be blocked — silent fail, user can copy manually.
    }
  }

  const exampleCurl = `curl -H "X-API-Key: ${key ?? "<your-key>"}" \\
  https://rush-theta.vercel.app/api/insights`;

  const exampleResponse = `{
  "date": "2026-04-09",
  "channels": {
    "total": 13,
    "items": [
      {
        "id": "5cf0ff88-5c51-4a2d-ae99-8fd91d7fb08f",
        "name": "Twitter: @danshipper",
        "url": "https://x.com/danshipper",
        "platform": "twitter",
        "active": true,
        "itemsCollected": 239,
        "lastCheckedAt": "2026-04-09T07:05:07.236Z"
      }
      // ... 12 more channels
    ]
  },
  "insights": {
    "total": 10,
    "items": [
      {
        "id": "feed-2bce3512",
        "title": "Claude Code Agent SDK 멀티 에이전트 패턴",
        "summary": "...",
        "keyPoints": ["...", "...", "..."],
        "category": "workflow",
        "source": {
          "name": "Twitter: @danshipper",
          "type": "x",
          "url": "https://x.com/..."
        }
      }
      // ... 9 more insights
    ]
  },
  "meta": {
    "totalRawItems": 33,
    "totalFilteredItems": 10,
    "generatedAt": "2026-04-09T10:33:29.000Z"
  }
}`;

  return (
    <section id="api" className="py-24 border-t border-surface-800">
      <div className="max-w-4xl mx-auto px-6 space-y-10 reveal">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-mono">
            <span className="text-accent-400">&gt;_</span>
            <span>api</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-50">
            에이전트용 API
          </h2>
          <p className="text-surface-400 max-w-2xl leading-relaxed">
            구독 중인 채널 목록과 오늘의 큐레이션 인사이트를 단일 JSON으로 반환합니다.
            AI 에이전트가 그대로 소비할 수 있도록 스키마가 고정되어 있고, Nudget 11채널에서 수집된 raw 콘텐츠를 OpenAI 필터로 정제한 결과입니다.
          </p>
        </div>

        {/* Key issuance card */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-700">
            <span className="text-accent-400 font-mono text-sm">&gt;_</span>
            <span className="text-surface-500 font-mono text-xs">
              POST /api/keys
            </span>
          </div>
          <div className="p-5 font-mono text-[13px] space-y-4">
            {!key ? (
              <>
                <div className="text-surface-400 leading-relaxed">
                  버튼을 클릭하면 즉시 API 키가 발급됩니다. 회원가입 불필요, 단일 호출.
                </div>
                <button
                  onClick={issueKey}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-accent-400 text-surface-950 text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "발급 중..." : "API 키 발급"}
                </button>
                {error && (
                  <div className="text-xs text-[color:var(--color-error,#ef4444)]">
                    {error}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-surface-500 text-[11px] uppercase tracking-wider">
                  Your API Key
                </div>
                <div className="p-3 rounded-lg border border-accent-400/30 bg-surface-900/50 break-all text-accent-400 text-xs">
                  {key}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={copyKey}
                    className="px-3 py-1.5 rounded-md border border-surface-600 text-surface-200 text-xs hover:bg-surface-700 transition-colors"
                  >
                    {copied ? "복사됨 ✓" : "복사"}
                  </button>
                  <span className="text-surface-500 text-[11px]">
                    이 페이지를 닫기 전에 복사하세요. 키는 다시 표시되지 않습니다.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Endpoint usage card */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-700">
            <span className="text-accent-400 font-mono text-sm">&gt;_</span>
            <span className="text-surface-500 font-mono text-xs">
              GET /api/insights
            </span>
          </div>
          <div className="p-5 font-mono text-[12px] space-y-4 overflow-x-auto">
            <div>
              <div className="text-surface-500 text-[11px] uppercase tracking-wider mb-2">
                Request
              </div>
              <pre className="text-surface-300 leading-relaxed whitespace-pre-wrap">
                {exampleCurl}
              </pre>
            </div>
            <div className="pt-3 border-t border-surface-700/50">
              <div className="text-surface-500 text-[11px] uppercase tracking-wider mb-2">
                Response
              </div>
              <pre className="text-surface-400 text-[11px] leading-relaxed whitespace-pre-wrap">
                {exampleResponse}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
