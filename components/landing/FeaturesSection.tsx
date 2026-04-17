import Link from "next/link";

export function FeaturesSection() {
  return (
    <section id="features" className="py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal space-y-3 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            <span className="font-mono text-accent-400">&gt;_</span> 핵심 기능
          </h2>
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            매일 아침 열면 오늘 학습할 콘텐츠가 준비되어 있습니다.
          </p>
        </div>

        <div className="reveal grid sm:grid-cols-2 gap-4">
          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-sm text-accent-400">
              /daily-feed
            </span>
            <h3 className="text-sm font-bold text-white">
              매일 큐레이션된 피드
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">
              매일 아침 새로운 Claude Code 콘텐츠가 피드 카드로 정리됩니다.
              요약, 핵심 포인트, 원문 링크까지 한눈에.
            </p>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-sm text-accent-400">
              --filter claude-code
            </span>
            <h3 className="text-sm font-bold text-white">AI 관련성 필터링</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              GPT-5.4 기반 필터가 노이즈를 제거하고 Claude Code에 직접
              관련된 콘텐츠만 남깁니다.
            </p>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-sm text-accent-400">
              quiz --start
            </span>
            <h3 className="text-sm font-bold text-white">이해도 확인 퀴즈</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              각 피드 카드에 퀴즈가 포함됩니다. 읽고 끝이 아니라 이해했는지
              바로 확인할 수 있습니다.
            </p>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-sm text-accent-400">
              11 channels
            </span>
            <h3 className="text-sm font-bold text-white">다양한 소스 통합</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              X, LinkedIn, YouTube, Reddit, GitHub 등 11개 채널을 하나의
              피드로 통합합니다. 직접 돌아다닐 필요 없습니다.
            </p>
          </div>
        </div>

        <div className="reveal mt-10 text-center">
          <Link
            href="/daily-feed"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-400 text-surface-950 font-bold text-sm rounded-lg hover:bg-accent-hover transition-colors"
          >
            <span className="font-mono">&gt;_</span> 피드 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
