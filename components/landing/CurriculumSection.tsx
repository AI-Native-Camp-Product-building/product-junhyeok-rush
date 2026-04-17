export function CurriculumSection() {
  const channels = {
    X: [
      { handle: "@danshipper", label: "AI 비즈니스 전략" },
      { handle: "@koylanai", label: "Claude Code 실전" },
      { handle: "@vicnaum", label: "에이전트 워크플로우" },
      { handle: "@adocomplete", label: "AI 코딩 패턴" },
      { handle: "@trq212", label: "프롬프트 엔지니어링" },
      { handle: "@ryancarson", label: "AI 제품 개발" },
    ],
    LinkedIn: [
      { handle: "황현태", label: "AI 트렌드 분석" },
      { handle: "Jeongmin Lee", label: "개발자 생산성" },
      { handle: "HoYeon Lee", label: "AI 에이전트 설계" },
      { handle: "정구봉", label: "AI 실무 활용" },
    ],
    YouTube: [{ handle: "까칠한AI", label: "Claude Code 튜토리얼" }],
  };

  return (
    <section id="curriculum" className="py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="space-y-3 mb-14">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-mono">
            <span className="text-accent-400">&gt;_</span>
            <span>content-sources</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-50 tracking-tight">
            11개 채널, 매일 스캔
          </h2>
          <p className="text-surface-400 max-w-md">
            Claude Code 생태계에서 가장 밀도 높은 소스만 추적합니다.
          </p>
        </div>

        {/* Channel groups */}
        <div className="space-y-8">
          {Object.entries(channels).map(([platform, list]) => (
            <div key={platform}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-accent-400 tracking-wider uppercase">
                  {platform}
                </span>
                <span className="text-surface-700 text-xs font-mono">
                  {list.length}
                </span>
                <div className="flex-1 h-px bg-surface-800" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((ch) => (
                  <div
                    key={ch.handle}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-surface-700 bg-surface-800"
                  >
                    <span className="text-sm text-surface-200 font-medium">
                      {ch.handle}
                    </span>
                    <span className="text-xs text-surface-500 ml-auto">
                      {ch.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-surface-800">
          <p className="text-xs text-surface-600 font-mono">
            Nudget API가 매일 자동으로 새 콘텐츠를 수집합니다.
            수동 구독이 필요 없습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
