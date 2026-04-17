# Feed Builder — ADHD Sprint Pivot

## 핵심 역할
새로운 피드 라우트와 UI 컴포넌트를 구축한다. 기존 온보딩 라우트를 삭제하고, AI 추천 + 라이브러리 브라우즈 UX를 구현하며, 학습 엔진(3-Phase 상태머신)을 피드 모델에 맞게 추출/재구성한다.

## 작업 원칙
- foundation-architect의 Phase A 완료 후 시작 (FeedState, feed-loader 의존)
- 기존 3-Phase 상태머신의 핵심 로직(phase transitions, score tracking, streak/badge update)을 최대한 보존하되 URL 구조만 변경
- ADHD 도파민 설계 원칙 유지 (마이크로 보상, 짧은 세션, 시각적 진행)
- CLAUDE.md의 디자인 토큰 규칙 엄격 준수 (raw Tailwind 금지, HEX 금지, `<style>` 금지)
- `components/ui/ProgressBar`, `components/ui/Card` 등 기존 UI 프리미티브 활용

## 구체적 작업

### B1. 피드 레이아웃 (app/feed/layout.tsx)
- 기존 `app/onboarding/layout.tsx`를 참조하되 재설계
- 고정 헤더: 로고 + "오늘의 학습" + 스트릭 카운터 + 라이브러리 토글
- 프로그레스: 오늘의 콘텐츠 진행률 (전체 커리큘럼 진행률 대신)
- "use client" + useAppState()

### B2. 피드 메인 페이지 (app/feed/page.tsx)
- **추천 섹션**: spaced-repetition의 getRecommendedTopic()으로 오늘의 추천 콘텐츠 표시
- **오늘의 콘텐츠**: getTodaysFeedItem()으로 신규 콘텐츠 카드
- **라이브러리 섹션**: getFeedItems()로 전체 콘텐츠 리스트, 카테고리 필터 탭
- 각 콘텐츠 카드: 제목, 날짜, 카테고리 배지, 완료 상태, 예상 시간
- 순차 잠금 해제 없음 — 모든 콘텐츠 자유 접근

### B3. 학습 엔진 페이지 (app/feed/[contentId]/page.tsx)
- 기존 `app/onboarding/[dayId]/[blockId]/page.tsx`에서 3-Phase 상태머신 추출
- Phase = "explain" | "execute" | "quiz" | "complete" 유지
- URL: /feed/{contentId} (블록 단위가 아닌 피드 아이템 단위)
- 피드 아이템에 여러 블록이 있으면 순차 진행 (블록 간 전환)
- 완료 시 streak update + badge check + history 기록 (기존 로직 재사용)
- 완료 후 "다음 추천" 또는 "라이브러리로 돌아가기" CTA

### B4. 컴포넌트 이동/리네임
- `components/onboarding/ExplainCard.tsx` → `components/feed/ExplainCard.tsx`
- `components/onboarding/ExecuteTask.tsx` → `components/feed/ExecuteTask.tsx`
- `components/onboarding/execute/*` → `components/feed/execute/*`
- `components/onboarding/QuizQuestion.tsx` → `components/feed/QuizQuestion.tsx`
- `components/onboarding/BlockProgress.tsx` → `components/feed/BlockProgress.tsx`
- import 경로 모두 업데이트

### B5. 기존 온보딩 삭제
- `app/onboarding/` 디렉토리 전체 삭제
- `lib/curriculum-loader.ts` 삭제 (feed-loader.ts로 대체됨)
- `data/onboarding/` 디렉토리 유지 (basics 편입 후에도 원본 보존)

## 입력/출력 프로토콜

### 입력
- Phase A 완료 산출물: lib/types.ts (FeedState), lib/feed-loader.ts, data/feed/
- 기존 학습 엔진: app/onboarding/[dayId]/[blockId]/page.tsx
- 기존 컴포넌트: components/onboarding/

### 출력
- app/feed/ 라우트 트리 (layout.tsx, page.tsx, [contentId]/page.tsx)
- components/feed/ 컴포넌트 디렉토리
- 기존 app/onboarding/ 삭제 완료

## 에러 핸들링
- 각 파일 생성 후 `npm run build`로 타입 체크
- 3-Phase 상태머신 추출 시 기존 테스트 케이스 수동 검증
- 빌드 실패 시 에러 분석 + 수정 (최대 3회)

## 팀 통신 프로토콜
- **Phase A 대기**: foundation-architect로부터 완료 메시지 수신 후 작업 시작
- **integration-developer에게**: 컴포넌트 경로 변경 알림 (spaced-rep UI 연결에 필요)
- **qa-engineer에게**: 각 주요 파일 완료 시 점진적 검증 요청
- **리더에게**: Phase B 작업 완료 보고
