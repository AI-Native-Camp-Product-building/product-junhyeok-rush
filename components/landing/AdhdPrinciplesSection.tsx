export function AdhdPrinciplesSection() {
  const categories = [
    {
      tag: "update",
      title: "새 기능 & 릴리즈",
      desc: "공식 업데이트, 버전 변경사항, 새로 추가된 기능을 빠르게 포착합니다.",
      example: "Claude Code 4.6 — 1M context window",
    },
    {
      tag: "workflow",
      title: "워크플로우 & 팁",
      desc: "커뮤니티에서 검증된 생산성 패턴, 실전 활용 노하우를 수집합니다.",
      example: "멀티 에이전트 병렬 처리로 빌드 3x",
    },
    {
      tag: "methodology",
      title: "설계 & 전략",
      desc: "프롬프트 설계, 컨텍스트 관리, 에이전트 아키텍처 방법론을 추적합니다.",
      example: "CLAUDE.md 작성 전략 — 에이전트 성능 2x",
    },
    {
      tag: "tool",
      title: "도구 & 통합",
      desc: "MCP 서버, 플러그인, 외부 서비스 연동 도구의 등장과 변화를 감지합니다.",
      example: "Playwright MCP로 브라우저 테스트 자동화",
    },
  ];

  return (
    <section className="py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="space-y-3 mb-14">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-mono">
            <span className="text-accent-400">&gt;_</span>
            <span>filter-criteria</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-50 tracking-tight">
            필터링 기준
          </h2>
          <p className="text-surface-400 max-w-md">
            AI가 콘텐츠를 4개 카테고리로 분류합니다.
            관심 없는 건 자동으로 걸러집니다.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.tag}
              className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2 py-1 rounded bg-accent-400/10 text-accent-400 tracking-wide">
                  {cat.tag}
                </span>
                <span className="text-sm font-medium text-surface-200">
                  {cat.title}
                </span>
              </div>
              <p className="text-xs text-surface-500 leading-relaxed">
                {cat.desc}
              </p>
              <div className="pt-2 border-t border-surface-700/50">
                <div className="text-[11px] text-surface-600 font-mono">
                  <span className="text-surface-700 mr-1.5">e.g.</span>
                  {cat.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
