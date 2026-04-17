export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal space-y-3 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            <span className="font-mono text-accent-400">&gt;_</span> 어떻게
            동작하는가
          </h2>
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            3단계 파이프라인. 수집부터 학습까지 자동화됩니다.
          </p>
        </div>

        <div className="reveal space-y-4">
          <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 flex items-start gap-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-900 border border-surface-700 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-accent-400">
                01
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">수집</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                11개 채널(X, LinkedIn, YouTube, Reddit, GitHub 등)에서 Nudget
                API가 Claude Code 관련 콘텐츠를 자동 수집합니다.
              </p>
              <span className="inline-block font-mono text-[11px] text-accent-400 mt-1">
                nudget collect --channels 11
              </span>
            </div>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 flex items-start gap-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-900 border border-surface-700 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-accent-400">
                02
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">필터</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                GPT-5.4가 교육적 가치와 관련성을 평가하여 Claude Code 핵심
                콘텐츠만 선별합니다. 노이즈는 자동 제거.
              </p>
              <span className="inline-block font-mono text-[11px] text-accent-400 mt-1">
                filter --relevance claude-code --quality high
              </span>
            </div>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 flex items-start gap-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-900 border border-surface-700 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-accent-400">
                03
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">학습</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                요약 + 핵심 포인트 + 원문 링크 + 퀴즈로 구성된 피드 카드.
                하루 30분이면 메타를 따라잡습니다.
              </p>
              <span className="inline-block font-mono text-[11px] text-accent-400 mt-1">
                learn --time 30m --format feed-card
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
