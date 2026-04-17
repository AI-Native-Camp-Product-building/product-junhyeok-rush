export function ProblemSection() {
  return (
    <section className="py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal space-y-3 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            <span className="font-mono text-accent-400">&gt;_</span> 왜
            필요한가
          </h2>
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Claude Code 생태계는 매주 바뀝니다. 따라가지 못하면 뒤처집니다.
          </p>
        </div>

        <div className="reveal grid sm:grid-cols-3 gap-4">
          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-xs text-accent-400">
              update --weekly
            </span>
            <h3 className="text-sm font-bold text-white">
              매주 새 기능 출시
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">
              hooks, MCP, sub-agent, 새 플래그가 매주 나옵니다. 놓치면
              비효율적인 워크플로우가 굳어집니다.
            </p>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-xs text-accent-400">
              channels: 11+
            </span>
            <h3 className="text-sm font-bold text-white">소스가 분산됨</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              X, LinkedIn, YouTube, Reddit, GitHub. 하나하나 확인할 시간이
              없습니다.
            </p>
          </div>

          <div className="bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3">
            <span className="font-mono text-xs text-accent-400">
              --overflow
            </span>
            <h3 className="text-sm font-bold text-white">정보 과부하</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              쏟아지는 정보 속에서 핵심만 빠르게 파악하는 필터가 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
