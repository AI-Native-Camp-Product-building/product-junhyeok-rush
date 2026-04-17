import Link from "next/link";

export function HowToStartSection() {
  return (
    <section id="start" className="bg-surface-950 py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-mono text-accent-400 mb-3">
          {">"}_&nbsp;prerequisites
        </p>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-10">
          시작하기
        </h2>

        <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-4">
            <span className="font-mono text-accent-400 text-sm mt-0.5">01</span>
            <div>
              <p className="text-sm text-white">
                AI Native Camp 코스 완료
              </p>
              <Link
                href="https://aicamp.so"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-400 hover:text-accent-hover transition-colors"
              >
                aicamp.so →
              </Link>
            </div>
          </div>

          <div className="border-t border-surface-700" />

          <div className="flex items-start gap-4">
            <span className="font-mono text-accent-400 text-sm mt-0.5">02</span>
            <div>
              <p className="text-sm text-white">
                Daily Feed 접속
              </p>
              <Link
                href="/daily-feed"
                className="text-xs text-accent-400 hover:text-accent-hover transition-colors"
              >
                /daily-feed →
              </Link>
            </div>
          </div>

          <div className="border-t border-surface-700" />

          <div className="flex items-start gap-4">
            <span className="font-mono text-accent-400 text-sm mt-0.5">03</span>
            <p className="text-sm text-white">
              매일 30분 투자
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
