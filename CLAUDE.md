# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Daily Feed — Nudget API를 통해 매일 업데이트되는 Claude Code 지식/방법론을 간소화된 피드 카드(요약 + 핵심 포인트 + 원문 링크 + 퀴즈)로 제공하는 서비스. AI Native Camp(https://ainativecamp-production.up.railway.app/) 온보딩 완료 유저 대상. Camp 디자인 시스템 채택.

## Commands

```bash
npm run dev      # 개발 서버 (Turbopack, localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint
```

테스트 러너 미설정. 빌드 성공 여부로 타입 검증.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, TypeScript strict
- **Tailwind CSS v4** (`@theme inline` in globals.css + tailwind.config.ts 병행)
- **OpenAI SDK** (`openai` npm) — 콘텐츠 필터링(`gpt-4o-mini`) + 변환/퀴즈 생성(`gpt-4o`)
- **zod** — LLM 응답 런타임 검증
- **Nudget API** (`X-API-Key` 인증) — 콘텐츠 소스 (11개 채널)
- **localStorage** — 클라이언트 상태 (게이미피케이션, 진도)
- **Next.js API Routes** — 서버사이드 Nudget/OpenAI 프록시
- **Vercel** 배포
- Path alias: `@/*` = 프로젝트 루트

## Architecture

### 두 가지 피드 시스템
- `/daily-feed` — **활성** Nudget 기반 동적 피드 (매일 새 콘텐츠)
- `/feed` — **레거시** 정적 학습 커리큘럼 (하드코딩된 3-Phase 블록)

### Daily Feed 파이프라인
```
Nudget API → lib/nudget-client.ts (fetch)
  → lib/sanitize-input.ts (untrusted 입력 truncate + prompt-injection guard)
  → lib/content-filter.ts (gpt-4o-mini 관련성 판별, zod 검증)
  → lib/nudget-transformer.ts (gpt-4o DailyFeedItem 변환, zod 검증)
  → lib/quiz-generator.ts (gpt-4o MCQ 생성, zod 검증)
  → lib/feed-cache.ts (KST 날짜 기반 캐시 + single-flight)
  → app/api/daily-feed/route.ts (API 응답)
  → app/daily-feed/page.tsx (UI 렌더링)
```

### 타입 시스템
- `lib/daily-feed-types.ts` — **활성** 타입: `DailyFeedItem`, `QuizQuestion`, `FeedCategory`, `DailyFeedResponse`
- `lib/types.ts` — **레거시** 타입: `FeedItem`, `Block`, `ExecuteContent` (3-Phase용)

### 상태 관리 패턴
`lib/state.ts` (localStorage CRUD) → `lib/state-context.tsx` (React Context + `useAppState()` hook). 모든 `"use client"` 컴포넌트에서 `useAppState()`로 접근. `stateVersion: 2` — V1→V2 자동 마이그레이션 포함.

### 게이미피케이션 (V1.1 대기)
- `lib/streak.ts` — 스트릭 계산
- `lib/badges.ts` — 9개 뱃지
- `lib/spaced-repetition.ts` — 토픽 우선순위
- 현재 daily-feed에서는 미사용. V1.1에서 재활성화 예정.

### API Routes
- `app/api/daily-feed/route.ts` — GET: Nudget digest fetch → filter → transform → quiz → cache → respond. `dynamic = "force-dynamic"` + 자체 in-memory 캐시(KST 일자 키, single-flight, 50개 cap).
- `app/api/daily-feed/filter/route.ts` — POST: **501 Not Implemented** 스캐폴드 (pipeline-engineer 본 구현 시 활성화).

### 환경변수
```
NUDGET_API_KEY    — Nudget API 인증
OPENAI_API_KEY    — gpt-4o-mini(필터) / gpt-4o(변환·퀴즈) 호출
```

## Design Tokens — Camp Design System

AI Native Camp 디자인 시스템 채택 (arctic-blue 터미널 미학).

### 브랜드 컬러
- `accent` (arctic blue 스케일, `#c0f0fb` 기준) — 주요 브랜드
- `accent-hover` (`#ffea00`, yellow flash) — 호버 상태
- `accent-glow` (`rgba(192, 240, 251, 0.3)`) — 버튼 글로우
- `spark` (orange) — 보조 액센트
- `streak` (green) — 스트릭/성공

### 표면 컬러 (zinc 기반)
- `surface-950` (`#0a0a0b`) — canonical dark background
- `surface-800` (`#18181b`) — 카드 배경
- `surface-700` (`#27272a`) — 보더

### 시맨틱 컬러
- `reward` (amber), `error` (red), `code` (blue)

### 폰트
- `font-sans` = Geist → Noto Sans KR → system-ui (CJK fallback chain)
- `font-mono` = Geist Mono → JetBrains Mono → monospace

### 디자인 규칙 (MUST follow)
- NEVER use raw Tailwind colors (red-*, blue-*, amber-*, green-*, teal-*, pink-*, purple-*, yellow-*). 반드시 디자인 토큰 사용.
- NEVER use HEX literals in className or style attributes. CSS 변수 또는 토큰 클래스 사용.
- NEVER use `<style>` blocks in components. 모든 keyframe과 유틸리티 클래스는 `globals.css`에 정의.
- NEVER reimplement ProgressBar inline. `components/ui/ProgressBar`의 `<ProgressBar>` 사용.
- NEVER reimplement Card styles inline. `components/ui/Card`의 `<Card>` 사용.
- `bg-surface-950`이 canonical dark background.
- `white/XX` 투명도 유틸리티 (text-white/50, bg-white/5 등)는 토큰 요구에서 면제.
- Camp 터미널 모티프: `>_` 프리픽스를 헤더/라벨에 장식적 사용, 코드는 `font-mono text-accent-400`.
- 카드 스타일: `bg-surface-800 border border-surface-700 rounded-xl` (NO gradients, NO blur).

## Legacy Systems

### 레거시 피드 (`/feed`)
`data/feed/basics.ts`에 하드코딩된 FeedItem 1개 (7블록, 3-Phase). `lib/feed-loader.ts`로 접근. `components/feed/`에 ExplainCard, ExecuteTask, QuizQuestion 등 9개 컴포넌트. 수정 불필요.

### 레거시 플러그인
`skills/`, `hooks/`, `data/curriculum.json`, `data/commands.json`, `.claude-plugin/`, `scripts/` — 기존 Claude Code 플러그인 파일. 직접 수정하지 않음.

## Conventions

- 한국어 UI (모든 사용자 대면 문자열)
- 모든 페이지/인터랙티브 컴포넌트는 `"use client"`
- `lib/daily-feed-types.ts`에 새 타입 정의 (레거시 `lib/types.ts` 수정 금지)
- API key는 서버사이드(API Routes)에서만 접근 — 클라이언트 노출 금지
- `lang="ko"` HTML 속성
