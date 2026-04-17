---
name: pivot-orchestrator
description: "ADHD Sprint 피봇을 실행하는 에이전트 팀 오케스트레이터. 온보딩→일일 트렌드 피드 전환을 4명 에이전트 팀으로 수행한다. '피봇 실행', '피봇 시작', '하네스 실행', 'pivot execute' 요청 시 반드시 이 스킬을 사용할 것."
---

# ADHD Sprint Pivot Orchestrator

온보딩 학습 플랫폼을 일일 트렌드 팔로잉 피드로 피봇하는 에이전트 팀을 조율한다.

## 실행 모드: 에이전트 팀

## 스펙 참조
`.omc/specs/deep-dive-pivot-daily-trend-following.md`

## 에이전트 구성

| 팀원 | 에이전트 정의 | 역할 | Phase |
|------|-------------|------|-------|
| foundation-architect | `.claude/agents/pivot-foundation-architect.md` | 타입/상태/로더 재설계 | A (선행) |
| feed-builder | `.claude/agents/pivot-feed-builder.md` | 피드 라우트/컴포넌트 구축 | B (병렬) |
| integration-developer | `.claude/agents/pivot-integration-developer.md` | 게이미피케이션/랜딩/파이프라인 적응 | B (병렬) |
| qa-engineer | `.claude/agents/pivot-qa-engineer.md` | 점진적 QA + 최종 검증 | A-C (전 과정) |

## 워크플로우

### Phase 0: 준비

1. 스펙 파일 존재 확인: `.omc/specs/deep-dive-pivot-daily-trend-following.md`
2. `_workspace/pivot/` 디렉토리 생성 (중간 산출물 저장용)
3. 현재 빌드 상태 확인: `npm run build` (기준선 — 피봇 전에 빌드가 통과해야 함)

### Phase 1: 팀 구성

팀을 생성한다. 모든 에이전트는 opus 모델을 사용한다.

```
TeamCreate(
  team_name: "pivot-team",
  members: [
    {
      name: "foundation-architect",
      agent_type: "pivot-foundation-architect",
      model: "opus",
      prompt: "당신은 ADHD Sprint 피봇의 Foundation Architect입니다.
        스펙을 읽으세요: .omc/specs/deep-dive-pivot-daily-trend-following.md
        에이전트 정의를 읽으세요: .claude/agents/pivot-foundation-architect.md

        Phase A 작업을 즉시 시작하세요:
        A1. lib/types.ts에서 OnboardingState → FeedState 교체
        A2. lib/state.ts에서 stateVersion 2 + migrateV1toV2 작성
        A3. lib/feed-loader.ts 생성 (날짜/카테고리 기반 API)
        A4. data/feed/ 디렉토리 구성 + day1.ts 콘텐츠 이동

        각 작업 후 npm run build로 타입 체크하세요.
        모든 작업 완료 시 리더와 다른 팀원에게 SendMessage로 알리세요."
    },
    {
      name: "feed-builder",
      agent_type: "pivot-feed-builder",
      model: "opus",
      prompt: "당신은 ADHD Sprint 피봇의 Feed Builder입니다.
        스펙을 읽으세요: .omc/specs/deep-dive-pivot-daily-trend-following.md
        에이전트 정의를 읽으세요: .claude/agents/pivot-feed-builder.md

        foundation-architect의 Phase A 완료 메시지를 기다리세요.
        완료 메시지를 받으면 Phase B 작업을 시작하세요:
        B1. app/feed/layout.tsx 생성
        B2. app/feed/page.tsx 생성 (추천 + 라이브러리)
        B3. app/feed/[contentId]/page.tsx 생성 (3-Phase 학습 엔진)
        B4. components/onboarding/ → components/feed/ 이동
        B5. app/onboarding/ 삭제

        기다리는 동안:
        - 기존 app/onboarding/[dayId]/[blockId]/page.tsx를 읽고 3-Phase 상태머신 로직 파악
        - 기존 components/onboarding/ 구조 파악
        - 새 피드 UI 설계 구상

        integration-developer와 spaced-rep UI 연결 인터페이스를 조율하세요."
    },
    {
      name: "integration-developer",
      agent_type: "pivot-integration-developer",
      model: "opus",
      prompt: "당신은 ADHD Sprint 피봇의 Integration Developer입니다.
        스펙을 읽으세요: .omc/specs/deep-dive-pivot-daily-trend-following.md
        에이전트 정의를 읽으세요: .claude/agents/pivot-integration-developer.md

        foundation-architect의 Phase A 완료 메시지를 기다리세요.
        완료 메시지를 받으면 Phase B 작업을 시작하세요:
        B6. lib/badges.ts 뱃지 재정의 (five-topics, all-core-topics)
        B7. spaced-repetition UI 연결 (feed-builder와 협업)
        B8-B9. 랜딩 페이지 업데이트 (components/landing/*)
        B10. 콘텐츠 파이프라인 호환성 검증

        기다리는 동안:
        - lib/badges.ts, lib/spaced-repetition.ts 현재 코드 파악
        - components/landing/* 현재 상태 파악
        - .claude/skills/sprint-pipeline/, daily-digest/ 스킬 파악

        feed-builder와 spaced-rep UI 연결 인터페이스를 조율하세요.
        파이프라인 호환성 보고서를 _workspace/pivot/pipeline-compat-report.md에 저장하세요."
    },
    {
      name: "qa-engineer",
      agent_type: "pivot-qa-engineer",
      model: "opus",
      prompt: "당신은 ADHD Sprint 피봇의 QA Engineer입니다.
        스펙을 읽으세요: .omc/specs/deep-dive-pivot-daily-trend-following.md
        에이전트 정의를 읽으세요: .claude/agents/pivot-qa-engineer.md

        점진적 QA를 수행하세요:
        1. foundation-architect 완료 시 → C1 타입 정합성 검증 + npm run build
        2. feed-builder 각 파일 완료 시 → C2 라우트/컴포넌트 검증
        3. integration-developer 완료 시 → C3 경계면 교차 검증
        4. 전체 완료 시 → C4 Acceptance Criteria + C5 디자인 규칙 최종 검증

        문제 발견 시 해당 에이전트에게 즉시 SendMessage로 보고하세요.
        최종 결과를 _workspace/pivot/qa-report.md에 저장하세요."
    }
  ]
)
```

작업을 등록한다:

```
TaskCreate(tasks: [
  // Phase A — Foundation (선행 작업)
  { title: "A1: FeedState 타입 정의", description: "lib/types.ts — OnboardingState→FeedState, FeedItem, FeedCategory 타입", assignee: "foundation-architect" },
  { title: "A2: 상태 마이그레이션", description: "lib/state.ts — stateVersion 2, migrateV1toV2, getInitialState 업데이트", assignee: "foundation-architect" },
  { title: "A3: 피드 로더 작성", description: "lib/feed-loader.ts — getFeedItems, getFeedItem, getFeedBlock, getTodaysFeedItem 등", assignee: "foundation-architect" },
  { title: "A4: 데이터 마이그레이션", description: "data/feed/ 구성, day1.ts를 basics.ts로 이동", assignee: "foundation-architect" },

  // Phase A QA
  { title: "C1: 타입 정합성 검증", description: "FeedState 초기화, 마이그레이션 보존, 로더 타입, npm run build", assignee: "qa-engineer", depends_on: ["A1: FeedState 타입 정의", "A2: 상태 마이그레이션", "A3: 피드 로더 작성", "A4: 데이터 마이그레이션"] },

  // Phase B — Feed Builder (A 완료 후)
  { title: "B1: 피드 레이아웃", description: "app/feed/layout.tsx — 헤더, 스트릭, 프로그레스", assignee: "feed-builder", depends_on: ["C1: 타입 정합성 검증"] },
  { title: "B2: 피드 메인 페이지", description: "app/feed/page.tsx — 추천 + 라이브러리 + 카테고리 필터", assignee: "feed-builder", depends_on: ["C1: 타입 정합성 검증"] },
  { title: "B3: 학습 엔진 페이지", description: "app/feed/[contentId]/page.tsx — 3-Phase 상태머신 추출", assignee: "feed-builder", depends_on: ["C1: 타입 정합성 검증"] },
  { title: "B4: 컴포넌트 이동", description: "components/onboarding/ → components/feed/ + import 업데이트", assignee: "feed-builder", depends_on: ["B3: 학습 엔진 페이지"] },
  { title: "B5: 온보딩 삭제", description: "app/onboarding/ 디렉토리 삭제, curriculum-loader.ts 삭제", assignee: "feed-builder", depends_on: ["B4: 컴포넌트 이동"] },

  // Phase B — Integration (A 완료 후, 병렬)
  { title: "B6: 뱃지 재정의", description: "lib/badges.ts — five-topics, all-core-topics 재정의", assignee: "integration-developer", depends_on: ["C1: 타입 정합성 검증"] },
  { title: "B7: Spaced-Rep UI 연결", description: "getRecommendedTopic() → 피드 추천 섹션 연결", assignee: "integration-developer", depends_on: ["B2: 피드 메인 페이지"] },
  { title: "B8: 랜딩 페이지 업데이트", description: "components/landing/* — CTA, 기능, 커리큘럼 섹션 피봇 반영", assignee: "integration-developer", depends_on: ["C1: 타입 정합성 검증"] },
  { title: "B9: 파이프라인 호환성 검증", description: "sprint-pipeline, daily-digest, module-build 스킬 호환성 확인 + 보고", assignee: "integration-developer", depends_on: ["A3: 피드 로더 작성"] },

  // Phase C — Final QA
  { title: "C2: 라우트/컴포넌트 검증", description: "use client, href, import, 빌드 검증", assignee: "qa-engineer", depends_on: ["B5: 온보딩 삭제"] },
  { title: "C3: 경계면 교차 검증", description: "AppState↔loader, loader↔components, badges↔state, spaced-rep↔UI, streak↔engine, 랜딩↔라우트", assignee: "qa-engineer", depends_on: ["B7: Spaced-Rep UI 연결", "B6: 뱃지 재정의", "B8: 랜딩 페이지 업데이트"] },
  { title: "C4: Acceptance Criteria 검증", description: "스펙의 10개 수락 기준 최종 확인", assignee: "qa-engineer", depends_on: ["C2: 라우트/컴포넌트 검증", "C3: 경계면 교차 검증"] },
  { title: "C5: 디자인 규칙 검증", description: "raw Tailwind, HEX, <style>, ProgressBar/Card 인라인 등", assignee: "qa-engineer", depends_on: ["C4: Acceptance Criteria 검증"] }
])
```

### Phase 2: 실행 모니터링

리더는 팀 실행을 모니터링한다:

1. **Phase A 모니터링**: foundation-architect가 A1-A4 완료 → qa-engineer가 C1 검증
2. **Phase B 모니터링**: feed-builder와 integration-developer 병렬 작업. 진행 상황은 TaskGet으로 확인
3. **교착 상태 감지**: 팀원이 유휴 상태가 되면 자동 알림. SendMessage로 지시 또는 작업 재할당
4. **빌드 실패 대응**: qa-engineer가 빌드 실패 보고 시, 해당 에이전트에게 수정 지시

### Phase 3: 통합 및 최종 검증

1. 모든 팀원의 작업 완료 대기 (TaskGet으로 상태 확인)
2. qa-engineer의 최종 QA 보고서 수집: `_workspace/pivot/qa-report.md`
3. integration-developer의 파이프라인 보고서 수집: `_workspace/pivot/pipeline-compat-report.md`
4. `npm run build` 최종 실행
5. 결과 요약 보고

### Phase 4: 정리

1. 팀원들에게 종료 요청 (SendMessage)
2. 팀 정리 (TeamDelete)
3. `_workspace/pivot/` 보존
4. 사용자에게 결과 요약:
   - 변경된 파일 목록
   - 빌드 상태
   - Acceptance Criteria 통과 현황
   - 파이프라인 호환성 이슈 (있는 경우)
   - 다음 단계 권장 사항

## 데이터 전달 프로토콜

| 전달 | 방식 | 내용 |
|------|------|------|
| Phase A 완료 통지 | SendMessage (foundation → all) | "Phase A 완료. lib/types.ts, lib/state.ts, lib/feed-loader.ts, data/feed/ 준비됨" |
| spaced-rep 인터페이스 | SendMessage (integration ↔ feed-builder) | getRecommendedTopic() 반환값 형태, UI 연결 위치 |
| QA 피드백 | SendMessage (qa → 해당 에이전트) | 빌드 에러, 타입 불일치, 경계면 문제 |
| 중간 산출물 | 파일 기반 (_workspace/pivot/) | QA 보고서, 파이프라인 호환성 보고서 |

## 에러 핸들링

| 에러 유형 | 대응 |
|----------|------|
| 빌드 실패 | 해당 에이전트에게 에러 메시지 전달, 1회 재시도 후 재실패 시 리더 개입 |
| 타입 불일치 | foundation-architect에게 스키마 수정 요청 |
| 경계면 불일치 | 양쪽 에이전트 모두에게 보고, 조율 |
| 팀원 교착 | SendMessage로 상태 확인 → 작업 분할 또는 재할당 |
| 3회 재시도 초과 | 문제를 _workspace/pivot/blockers.md에 기록하고 사용자에게 보고 |

## 테스트 시나리오

### 정상 흐름
1. Phase A: foundation-architect가 타입/상태/로더 4개 작업 완료 → qa C1 통과
2. Phase B: feed-builder(5개 작업)와 integration-developer(4개 작업) 병렬 실행
3. Phase C: qa-engineer가 C2-C5 순차 검증 → 전부 통과
4. 최종: npm run build 성공, Acceptance Criteria 10/10 통과

### 에러 흐름
1. Phase A에서 타입 에러 발생 → qa가 foundation에게 보고 → foundation이 수정 → qa 재검증
2. Phase B에서 feed-builder의 3-Phase 추출 시 import 에러 → qa가 보고 → feed-builder가 수정
3. 경계면: spaced-rep 반환값과 feed page의 기대값 불일치 → qa가 양쪽에 보고 → 조율 후 수정
