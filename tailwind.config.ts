import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', '"Noto Sans KR"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', "monospace"],
      },
      colors: {
        accent: {
          50: "#f0fdff",
          100: "#e0faff",
          200: "#c0f0fb",
          300: "#a8e8f5",
          400: "#c0f0fb",
          500: "#a8e8f5",
          600: "#7dd4e8",
          700: "#5cb8d4",
          800: "#3a9cbd",
          900: "#2a7d9e",
          950: "#1a5e7f",
          hover: "#ffea00",
          glow: "rgba(192, 240, 251, 0.3)",
        },
        spark: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        streak: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        surface: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#3f3f46",
          700: "#27272a",
          800: "#18181b",
          900: "#111113",
          950: "#0a0a0b",
        },
        reward: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        error: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
        code: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
        foreground: "#fafafa",
        muted: "#71717a",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        progressFill: {
          from: { width: "0" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(var(--rot, 360deg))", opacity: "0" },
        },
        badgeBurst: {
          "0%": { transform: "scale(0.2) rotate(-20deg)", opacity: "0" },
          "40%": { transform: "scale(1.3) rotate(8deg)", opacity: "1" },
          "60%": { transform: "scale(0.95) rotate(-4deg)" },
          "80%": { transform: "scale(1.08) rotate(2deg)" },
          "90%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "0" },
        },
        fireFall: {
          "0%": { transform: "translateY(-30px) scale(1)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) scale(0.6)", opacity: "0" },
        },
        streakPop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "30%": { transform: "scale(1.4)", opacity: "1" },
          "60%": { transform: "scale(0.9)" },
          "80%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        streakPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        badgeShine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)" },
          "25%": { transform: "scaleY(1.05) scaleX(0.97)" },
          "50%": { transform: "scaleY(0.95) scaleX(1.03)" },
          "75%": { transform: "scaleY(1.02) scaleX(0.98)" },
        },
        scrollDown: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(8px)" },
          "60%": { transform: "translateY(4px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-mid": "float 5s ease-in-out infinite 1s",
        "float-fast": "float 4s ease-in-out infinite 0.5s",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "progress-fill": "progressFill 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "confetti-fall": "confettiFall 2s linear forwards",
        "badge-burst": "badgeBurst 3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fire-fall": "fireFall 2s linear forwards",
        "streak-pop": "streakPop 3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "streak-pulse": "streakPulse 2s ease-in-out infinite",
        "badge-shine": "badgeShine 3s linear infinite",
        flicker: "flicker 0.8s ease-in-out infinite",
        "scroll-down": "scrollDown 2s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
