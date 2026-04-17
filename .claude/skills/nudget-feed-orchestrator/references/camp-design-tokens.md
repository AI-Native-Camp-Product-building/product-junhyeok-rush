# AI Native Camp 디자인 토큰 레퍼런스

AI Native Camp(https://ainativecamp-production.up.railway.app/)에서 추출한 정확한 디자인 토큰.

## 컬러 토큰

### 배경/표면
| Token | Camp Value | Current Value | CSS Variable |
|-------|-----------|---------------|-------------|
| background | `#0a0a0b` | `#020617` | `--surface-950` |
| surface-1 | `#111113` | `#0f172a` | `--surface-900` |
| surface-2 (card) | `#18181b` | `#1e293b` | `--surface-800` |
| surface-3 (hover/border) | `#27272a` | `#334155` | `--surface-700` |
| surface-4 (divider) | `#3f3f46` | — | `--surface-600` |

### 텍스트
| Token | Camp Value | Usage |
|-------|-----------|-------|
| foreground | `#fafafa` | 주 텍스트 |
| muted | `#71717a` | 보조 텍스트, 라벨 |

### 액센트
| Token | Camp Value | Usage |
|-------|-----------|-------|
| accent (primary) | `#c0f0fb` | 주 액센트 — 링크, 강조, 인터랙티브 |
| accent-hover | `#ffea00` | 호버 플래시 — 버튼/링크 호버 시 |
| accent-glow | `rgba(192, 240, 251, 0.3)` | 버튼 글로우 shadow |

### 시맨틱 (변경 불필요)
| Token | Value | Note |
|-------|-------|------|
| success | `#22c55e` | 현재 streak-500과 동일 |
| error | `#ef4444` | 현재 error-500과 동일 |

## 타이포그래피

| Property | Camp Value | Current Value |
|----------|-----------|---------------|
| Sans font | **Geist** (100-900 weight) | Noto Sans KR |
| Mono font | **Geist Mono** | JetBrains Mono |
| Body size | 16px | 16px |
| Smoothing | antialiased | antialiased |
| Hero heading | 48px / 700 / lh 66px / ls -1.2px | — |

### Geist 폰트 설치
```typescript
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});
```

한국어 본문: Geist가 CJK 지원하지 않으므로 fallback chain 필요.
```css
--font-sans: 'Geist', 'Noto Sans KR', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
```

## 카드 스타일

### Camp flat card (glass-card-static)
```css
background: #18181b;
border: 1px solid #27272a;
border-radius: 12px;
padding: 24px;
/* NO gradients, NO blur, NO shadow */
```

### 현재 bezel-card (교체 대상)
```css
/* 삭제 대상 */
background: linear-gradient(145deg, rgba(30,41,59,0.6), rgba(15,23,42,0.8));
backdrop-filter: blur(20px);
border-radius: 16px;
```

## 네비게이션
```css
/* sticky frosted glass nav */
position: sticky;
top: 0;
z-index: 50;
border-bottom: 1px solid var(--surface-700);
background: rgba(10, 10, 11, 0.8);
backdrop-filter: blur(20px);
```

## 터미널 모티프
- `>_` 프리픽스를 로고/섹션 헤더에 사용
- 코드/명령어: `font-mono text-accent` (라이트 블루 모노스페이스)
- 슬래시 커맨드: `/command-name` 스타일링

## 버튼 스타일

### Primary (active/selected)
```css
background: #c0f0fb;
color: #0a0a0b;
border-radius: 6px;
padding: 6px 12px;
```

### Pill (inactive filter)
```css
background: transparent;
color: #c0f0fb;
border-radius: 6px;
```

### CTA glow
```css
box-shadow: 0 4px 20px rgba(192, 240, 251, 0.3);
```

## 배경 그라디언트 메시
```css
.gradient-mesh {
  background:
    radial-gradient(80% 50% at 50% -10%, rgba(192,240,251,0.06), transparent),
    radial-gradient(60% 40% at 100% 100%, rgba(255,234,0,0.03), transparent);
}
```

## 토큰 리네이밍 맵

globals.css와 tailwind.config.ts에서 다음과 같이 교체:

| 기존 토큰 | 새 토큰 | 값 |
|----------|---------|-----|
| `dopamine-50` | `accent-50` | `#fdf4ff` → `#f0fdff` |
| `dopamine-100` | `accent-100` | `#fae8ff` → `#e0faff` |
| `dopamine-200` | `accent-200` | `#f5d0fe` → `#c0f0fb` |
| `dopamine-300` | `accent-300` | `#f0abfc` → `#a8e8f5` |
| `dopamine-400` | `accent-400` | `#e879f9` → `#c0f0fb` |
| `dopamine-500` | `accent-500` | `#d946ef` → `#a8e8f5` |
| `dopamine-600` | `accent-600` | `#c026d3` → `#7dd4e8` |
| `dopamine-700` | `accent-700` | `#a21caf` → `#5cb8d4` |
| `dopamine-800` | `accent-800` | `#86198f` → `#3a9cbd` |
| `dopamine-900` | `accent-900` | `#701a75` → `#2a7d9e` |
| `dopamine-950` | `accent-950` | `#4a044e` → `#1a5e7f` |

이후 모든 컴포넌트에서 `dopamine-*` → `accent-*` 일괄 교체.
