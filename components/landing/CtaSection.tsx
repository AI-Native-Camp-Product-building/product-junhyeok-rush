import Link from "next/link";

export function CtaSection() {
  return (
    <section className="bg-surface-950 py-14 md:py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-sm font-mono text-accent-400 mb-6">
          {">"}_&nbsp;오늘의 피드를 확인하세요
        </p>

        <Link
          href="/daily-feed"
          className="inline-block px-8 py-3 rounded-lg bg-accent-400 text-surface-950 text-sm font-semibold hover:bg-accent-hover hover:text-surface-950 transition-colors"
        >
          Daily Feed 열기
        </Link>
      </div>
    </section>
  );
}
