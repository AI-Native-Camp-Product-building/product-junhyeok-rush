"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface CelebrationAnimationProps {
  show: boolean;
  type?: "confetti" | "badge" | "streak";
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  "var(--color-accent-400)",
  "var(--color-accent-500)",
  "var(--color-accent-300)",
  "var(--color-spark-400)",
  "var(--color-spark-500)",
  "var(--color-streak-400)",
  "var(--color-streak-500)",
];

const BADGE_EMOJI = "🏅";
const FIRE_EMOJI = "🔥";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 1.2,
    duration: 1.8 + Math.random() * 1.2,
    size: 6 + Math.floor(Math.random() * 8),
    rotation: Math.random() * 360,
  }));
}

export default function CelebrationAnimation({
  show,
  type = "confetti",
  onComplete,
}: CelebrationAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particles = useRef<Particle[]>(makeParticles(30));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      particles.current = makeParticles(30);
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3000);
    } else {
      setVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, onComplete]);

  if (!mounted || !visible) return null;

  const content = (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {type === "confetti" && (
        <>
          {particles.current.map((p) => (
            <div
              key={p.id}
              className="confetti-particle absolute top-0"
              style={
                {
                  left: `${p.x}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  "--rot": `${p.rotation}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </>
      )}

      {type === "badge" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="badge-burst text-8xl">{BADGE_EMOJI}</div>
        </div>
      )}

      {type === "streak" && (
        <>
          {particles.current.map((p) => (
            <div
              key={p.id}
              className="fire-particle absolute top-0 text-2xl select-none"
              style={{
                left: `${p.x}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            >
              {FIRE_EMOJI}
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="streak-counter-anim text-7xl font-black text-streak-400">
              🔥
            </div>
          </div>
        </>
      )}


    </div>
  );

  return createPortal(content, document.body);
}
