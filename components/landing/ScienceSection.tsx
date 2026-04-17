export function ScienceSection() {
  return (
    <section className="py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="space-y-3 mb-14">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-mono">
            <span className="text-accent-400">&gt;_</span>
            <span>why-ai-filter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-50 tracking-tight">
            왜 AI 필터링인가
          </h2>
          <p className="text-surface-400 max-w-md">
            정보 과부하 시대. 직접 찾는 건 비효율입니다.
          </p>
        </div>

        {/* Pipeline visualization */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {/* Step 1: Raw */}
          <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-surface-600">01</span>
              <span className="text-xs font-mono text-surface-500">수집</span>
            </div>
            <div className="text-4xl font-bold text-surface-200 tracking-tight font-mono">
              645<span className="text-surface-600">+</span>
            </div>
            <p className="text-xs text-surface-500 leading-relaxed">
              11개 채널에서 매일 수집되는
              <br />
              원본 아이템 수
            </p>
          </div>

          {/* Step 2: Filter */}
          <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-surface-600">02</span>
              <span className="text-xs font-mono text-surface-500">필터</span>
            </div>
            <div className="text-4xl font-bold text-accent-400 tracking-tight font-mono">
              GPT-5.4
            </div>
            <p className="text-xs text-surface-500 leading-relaxed">
              Claude Code 관련 콘텐츠만
              <br />
              자동 선별 + 중복 제거
            </p>
          </div>

          {/* Step 3: Output */}
          <div className="rounded-xl border border-accent-400/20 bg-surface-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-surface-600">03</span>
              <span className="text-xs font-mono text-accent-400">결과</span>
            </div>
            <div className="text-4xl font-bold text-accent-400 tracking-tight font-mono">
              5-10
            </div>
            <p className="text-xs text-surface-500 leading-relaxed">
              요약 + 핵심 포인트 + 퀴즈로
              <br />
              변환된 피드 카드
            </p>
          </div>
        </div>

        {/* Comparison */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-5">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-surface-600 uppercase tracking-wider">
                직접 팔로우
              </div>
              <p className="text-sm text-surface-400 leading-relaxed">
                11개 채널 순회, 중복 확인, 관련성 판단.
                <br />
                <span className="text-surface-200">매일 2시간+ 소요.</span>
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-accent-400 uppercase tracking-wider">
                Nudget Feed
              </div>
              <p className="text-sm text-surface-400 leading-relaxed">
                AI가 선별한 5-10개 카드만 확인.
                <br />
                <span className="text-surface-200">하루 30분이면 충분.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
