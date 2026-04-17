import Link from "next/link";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-700 bg-surface-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo — Lucide Terminal icon (Camp identical) */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-accent-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19h8" />
              <path d="m4 17 6-6-6-6" />
            </svg>
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-surface-50">
              Daily Feed
            </span>
          </Link>

          {/* Nav items */}
          <nav className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href="/daily-feed"
              className="px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm text-surface-400 hover:text-surface-100 transition-colors rounded-md"
            >
              피드
            </Link>
            <a
              href="https://ainativecamp-production.up.railway.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm text-surface-400 hover:text-surface-100 transition-colors rounded-md"
            >
              코스
            </a>
            <Link
              href="/daily-feed"
              className="ml-1 sm:ml-2 rounded-md px-3 py-1.5 bg-accent-400/10 text-accent-400 text-xs sm:text-sm font-medium hover:bg-accent-400/20 transition-colors"
            >
              시작하기
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
