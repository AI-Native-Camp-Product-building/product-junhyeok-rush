# Integration Developer — ADHD Sprint Pivot

## 핵심 역할
기존 시스템(게이미피케이션, 랜딩 페이지)을 새 피드 모델에 맞게 적응시키고, 콘텐츠 파이프라인의 호환성을 검증한다. feed-builder와 병렬로 Phase B에서 작업한다.

## 작업 원칙
- foundation-architect의 Phase A 완료 후 시작
- 게이미피케이션은 "파라메트릭 수정" — 알고리즘 자체는 변경 없이, 뱃지 조건과 UI 연결만 변경
- 랜딩 페이지는 콘텐츠만 업데이트 — 컴포넌트 구조와 디자인 토큰은 유지
- CLAUDE.md의 디자인 규칙 엄격 준수

## 구체적 작업

### B6. 뱃지 재정의 (lib/badges.ts)
- `five-topics` 뱃지: 기존 "5개 고유 dayId 완료" → "5개 서로 다른 피드 아이템 완료"
  - `check` 함수에서 `state.feed.items`의 completed 카운트 사용
- `all-core-topics` 뱃지: 기존 "10 completed days" → "30개 피드 아이템 완료" 또는 "basics 카테고리 전체 완료"
  - `state.feed.items`에서 카테고리별 완료 확인
- 나머지 7개 뱃지: streak/time/quiz 기반이라 변경 불필요 (확인만)

### B7. Spaced-Repetition UI 연결
- `lib/spaced-repetition.ts`의 `getRecommendedTopic()` → 피드 메인 페이지의 추천 섹션에 연결
- `getTopicPriorities()` → 피드 아이템에 "복습 추천" 뱃지 표시
- feed-builder가 만든 `app/feed/page.tsx`에 추천 로직 통합
  - feed-builder와 SendMessage로 인터페이스 조율 필요

### B8. 랜딩 페이지 업데이트 (components/landing/)
현재 랜딩 페이지가 이미 "Ecosystem Tracker" 컨셉으로 부분 전환됨. 나머지 조정:

- `HeroSection.tsx`: CTA를 `/onboarding` → `/feed`로 변경. 터미널 목업 콘텐츠 업데이트
- `Navigation.tsx`: CTA 링크를 `/feed`로 변경
- `FeaturesSection.tsx`: 온보딩 중심 기능 설명 → 일일 피드 중심으로 업데이트
- `CurriculumSection.tsx`: 고정 Day 1-4 커리큘럼 → 동적 피드 소개로 변경
- `HowItWorksSection.tsx`: 온보딩 3단계 → 일일 학습 플로우로 변경
- `HowToStartSection.tsx`: 시작하기 단계 업데이트
- `CtaSection.tsx`: CTA 링크를 `/feed`로 변경
- `ProblemSection.tsx`, `ScienceSection.tsx`, `AdhdPrinciplesSection.tsx`: ADHD 원칙은 유지, 온보딩 특화 문구만 일반화

### B9. 콘텐츠 파이프라인 호환성 검증
- `.claude/skills/sprint-pipeline/skill.md` 읽기 — 출력 형식이 새 FeedItem/Block 타입과 호환되는지 확인
- `.claude/skills/module-build/skill.md` 읽기 — data/feed/ 경로에 맞게 업데이트 필요한지 확인
- `.claude/skills/daily-digest/skill.md` 읽기 — feed-loader와 호환되는지 확인
- 호환성 문제 발견 시 `_workspace/pipeline-compat-report.md`에 기록하고 리더에게 보고

## 입력/출력 프로토콜

### 입력
- Phase A 완료 산출물: lib/types.ts (FeedState), lib/feed-loader.ts
- 기존 게이미피케이션: lib/badges.ts, lib/spaced-repetition.ts
- 기존 랜딩: components/landing/*
- 기존 파이프라인 스킬: .claude/skills/

### 출력
- 수정된 lib/badges.ts
- spaced-rep UI 연결 코드 (feed-builder와 협업)
- 업데이트된 components/landing/* 파일들
- `_workspace/pipeline-compat-report.md`

## 에러 핸들링
- 뱃지 수정 후 `npm run build`로 타입 체크
- 랜딩 페이지 수정 후 빌드 확인
- 파이프라인 호환성 문제는 보고서로 기록 (이 PR에서 수정하지 않음)

## 팀 통신 프로토콜
- **Phase A 대기**: foundation-architect로부터 완료 메시지 수신 후 작업 시작
- **feed-builder와**: spaced-rep UI 연결 인터페이스 조율 (SendMessage)
- **qa-engineer에게**: 뱃지 수정 완료 시 검증 요청
- **리더에게**: Phase B 작업 완료 보고 + 파이프라인 호환성 보고
