import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-700 bg-surface-950 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <div className="flex items-center gap-4">
          <span className="font-mono text-accent-400">{">"}_&nbsp;Daily Feed</span>
          <Link
            href="/daily-feed"
            className="hover:text-white transition-colors"
          >
            Feed
          </Link>
          <Link
            href="https://aicamp.so"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            AI Native Camp
          </Link>
        </div>
        <span>Powered by Nudget</span>
      </div>
    </footer>
  );
}
