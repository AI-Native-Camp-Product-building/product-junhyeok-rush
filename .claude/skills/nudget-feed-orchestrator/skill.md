---
name: nudget-feed-orchestrator
description: "Nudget Feed MVP 빌드를 오케스트레이션하는 스킬. 5명 에이전트 팀(foundation→design+feed+pipeline+QA)을 조율하여 일일 Claude Code 학습 피드 서비스를 구축한다. '피드 빌드', 'nudget feed', 'MVP 구현', '하네스 실행' 요청 시 반드시 이 스킬을 사용할 것."
---

# Nudget Feed Orchestrator

Nudget API 기반 일일 Claude Code 학습 피드 서비스 MVP를 구축하는 에이전트 팀 오케스트레이터.

## 실행 모드: 파이프라인 + 에이전트 팀

- Phase A: foundation-architect (sub-agent, 순차)
- Phase B: design-migrator + feed-builder + pipeline-engineer + qa-inspector (Agent Team, 병렬)

## Spec 참조

Spec: `.omc/specs/deep-dive-nudget-claude-code-feed.md`
Trace: `.omc/specs/deep-dive-trace-nudget-claude-code-feed.md`

## 에이전트 구성

| 에이전트 | Phase | 타입 | 역할 | 출력 |
|---------|-------|------|------|------|
| nf-foundation-architect | A (blocking) | sub-agent | 타입, API scaffold, Nudget client | lib/daily-feed-types.ts, lib/nudget-client.ts, app/api/daily-feed/ |
| nf-design-migrator | B (parallel) | team member | Camp 디자인 전환 | globals.css, tailwind.config.ts, layout.tsx, components/ |
| nf-feed-builder | B (parallel) | team member | 피드 카드 + 퀴즈 UI | components/daily-feed/, app/daily-feed/ |
| nf-pipeline-engineer | B (parallel) | team member | LLM 필터링 + 퀴즈 생성 | lib/content-filter.ts, lib/quiz-generator.ts, API route impl |
| nf-qa-inspector | B (incremental) | team member | 점진적 검증 | _workspace/nudget-feed/qa-report.md |

## 워크플로우

### Phase 0: 준비
1. Spec 파일 존재 확인: `.omc/specs/deep-dive-nudget-claude-code-feed.md`
2. `_workspace/nudget-feed/` 디렉토리 생성
3. 기존 빌드 확인: `npm run build` (baseline)
4. `.env.local` 존재 여부 확인 — 없으면 사용자에게 Nudget API key 요청

### Phase A: Foundation (Sub-agent)

foundation-architect를 sub-agent로 실행한다 (단독 작업, 팀 불필요).

```
Agent(
  subagent_type: "nf-foundation-architect",
  model: "opus",
  prompt: "Spec에 따라 Nudget Feed MVP의 기반을 구축하라.
    1. lib/daily-feed-types.ts — DailyFeedItem, QuizQuestion, FeedCategory 타입
    2. lib/nudget-client.ts — Nudget API 클라이언트 (fetch wrapper, X-API-Key 인증)
    3. app/api/daily-feed/route.ts — GET handler scaffold (Nudget digest fetch)
    4. app/api/daily-feed/filter/route.ts — POST handler scaffold (LLM 필터링)
    5. .env.example — NUDGET_API_KEY, OPENAI_API_KEY
    Spec: Read('.omc/specs/deep-dive-nudget-claude-code-feed.md')
    산출물을 _workspace/nudget-feed/phase-a-complete.md에 요약하라."
)
```

Phase A 완료 확인: `_workspace/nudget-feed/phase-a-complete.md` 존재 + `lib/daily-feed-types.ts` 존재.

### Phase B: Build (Agent Team — 4명 병렬)

1. 팀 생성:
```
TeamCreate(
  team_name: "nudget-feed-team",
  members: [
    {
      name: "design-migrator",
      agent_type: "nf-design-migrator",
      model: "opus",
      prompt: "Camp 디자인 시스템으로 전환하라. 3-Tier 실행:
        Tier A: globals.css + tailwind.config.ts 토큰 교체 (surface-*, dopamine-*→accent-*)
        Tier B: app/layout.tsx Geist 폰트 로딩
        Tier C: bezel-card→flat card, terminal motif, landing 컴포넌트
        Camp 토큰 상세: Read('.claude/skills/nudget-feed-orchestrator/references/camp-design-tokens.md')
        각 Tier 완료 시 qa-inspector에게 SendMessage."
    },
    {
      name: "feed-builder",
      agent_type: "nf-feed-builder",
      model: "opus",
      prompt: "일일 피드 카드 UI + 퀴즈 인터랙션을 구축하라.
        타입 참조: Read('lib/daily-feed-types.ts')
        1. components/daily-feed/ — FeedCard, FeedCardList, CategoryFilter, QuizCard, FeedHeader, SourceBadge
        2. app/daily-feed/layout.tsx + page.tsx + [itemId]/page.tsx
        Camp 디자인 토큰 사용 (accent-*, surface-*). design-migrator의 토큰 완료 알림 대기.
        API 데이터: fetch('/api/daily-feed')로 DailyFeedItem[] 조회.
        각 컴포넌트 완료 시 qa-inspector에게 SendMessage."
    },
    {
      name: "pipeline-engineer",
      agent_type: "nf-pipeline-engineer",
      model: "opus",
      prompt: "Nudget → Claude Code 콘텐츠 파이프라인을 구현하라.
        타입 참조: Read('lib/daily-feed-types.ts')
        Nudget client: Read('lib/nudget-client.ts')
        1. lib/content-filter.ts — OpenAI GPT-5.4 필터링 (관련성+카테고리)
        2. lib/quiz-generator.ts — OpenAI GPT-5.4 퀴즈 MCQ 생성
        3. lib/nudget-transformer.ts — Nudget → DailyFeedItem 변환
        4. lib/feed-cache.ts — 날짜 기반 in-memory 캐시
        5. app/api/daily-feed/route.ts 구현 (foundation scaffold 위에)
        6. app/api/daily-feed/filter/route.ts 구현
        openai npm 패키지 사용 (GPT-5.4 모델). npm install 필요하면 실행.
        완료 시 feed-builder에게 API 응답 shape SendMessage.
        완료 시 qa-inspector에게 SendMessage."
    },
    {
      name: "qa-inspector",
      agent_type: "nf-qa-inspector",
      model: "opus",
      prompt: "점진적 QA를 수행하라. 각 팀원의 완료 알림을 받을 때마다 해당 모듈을 검증한다.
        체크리스트:
        C1: API↔UI 타입 교차 검증 (pipeline + feed-builder 완료 후)
        C2: 라우트 경로 정합성 (feed-builder 완료 후)
        C3: 디자인 일관성 (design-migrator 완료 후)
        C4: npm run build 성공 (모든 태스크 완료 후)
        C5: AC 완성도 (최종)
        발견 즉시 해당 에이전트에게 구체적 수정 요청.
        결과를 _workspace/nudget-feed/qa-report.md에 기록."
    }
  ]
)
```

2. 작업 등록:
```
TaskCreate(tasks: [
  { title: "B1: 디자인 토큰 교체", description: "globals.css + tailwind.config.ts 토큰 교체", assignee: "design-migrator" },
  { title: "B2: 폰트 교체", description: "Geist 폰트 로딩 + CSS 적용", assignee: "design-migrator" },
  { title: "B3: 구조적 정렬", description: "bezel-card→flat, terminal motif, landing 컴포넌트", assignee: "design-migrator", depends_on: ["B1"] },
  { title: "B4: 피드 카드 컴포넌트", description: "FeedCard, SourceBadge, CategoryFilter 구현", assignee: "feed-builder" },
  { title: "B5: 피드 페이지", description: "daily-feed layout + page + list", assignee: "feed-builder", depends_on: ["B4"] },
  { title: "B6: 퀴즈 UI", description: "QuizCard + MCQ 인터랙션 + 상세 페이지", assignee: "feed-builder" },
  { title: "B7: 콘텐츠 필터 파이프라인", description: "GPT-5.4 필터링 + 변환", assignee: "pipeline-engineer" },
  { title: "B8: 퀴즈 생성기", description: "GPT-5.4 MCQ 생성", assignee: "pipeline-engineer" },
  { title: "B9: 캐싱 + API Route 구현", description: "캐시 레이어 + route handler 완성", assignee: "pipeline-engineer", depends_on: ["B7", "B8"] },
  { title: "C1: API↔UI 타입 검증", description: "API 응답 shape vs 컴포넌트 props", assignee: "qa-inspector", depends_on: ["B5", "B9"] },
  { title: "C2: 라우트 경로 검증", description: "파일 경로 vs href/Link", assignee: "qa-inspector", depends_on: ["B5"] },
  { title: "C3: 디자인 일관성", description: "Camp 토큰 적용 + raw 컬러 감지", assignee: "qa-inspector", depends_on: ["B3"] },
  { title: "C4: 빌드 검증", description: "npm run build 성공", assignee: "qa-inspector", depends_on: ["B3", "B5", "B9"] },
  { title: "C5: AC 완성도", description: "5개 AC 항목 충족 여부", assignee: "qa-inspector", depends_on: ["C1", "C2", "C3", "C4"] }
])
```

### Phase B 팀원 간 통신 규칙

```
design-migrator ──완료 알림──→ feed-builder  (새 토큰명 목록)
design-migrator ──Tier 완료──→ qa-inspector  (디자인 검증 요청)
pipeline-engineer ──API shape──→ feed-builder  (데이터 계약)
pipeline-engineer ──구현 완료──→ qa-inspector  (타입 검증 요청)
feed-builder ──컴포넌트 완료──→ qa-inspector  (라우트+UI 검증 요청)
qa-inspector ──수정 요청──→ 해당 에이전트  (파일:라인 + 수정 방법)
```

### Phase C: 통합 및 완료

1. 모든 팀원의 작업 완료 대기 (TaskGet으로 상태 확인)
2. qa-inspector의 최종 리포트 Read: `_workspace/nudget-feed/qa-report.md`
3. 리더가 최종 `npm run build` 실행하여 확인
4. QA 리포트에서 실패 항목이 있으면:
   - 해당 에이전트에게 SendMessage로 수정 요청
   - 수정 후 qa-inspector에게 재검증 요청
   - 최대 2회 반복
5. 팀원들에게 종료 요청 (SendMessage)
6. TeamDelete
7. `_workspace/nudget-feed/` 보존

### Phase D: 사용자 보고

사용자에게 결과 요약:
- 생성된 파일 목록
- AC 달성도 (5/5 또는 N/5)
- 미완료 항목과 후속 조치
- `npm run dev` 실행 안내

## 데이터 흐름

```
[Spec] → [foundation-architect] → types + API scaffolds
                                        ↓
         ┌→ [design-migrator]   → Camp tokens + fonts + structure
         │
[Team] → ├→ [feed-builder]     → Feed UI + Quiz UI
         │        ↑ API shape
         ├→ [pipeline-engineer] → Filter + Quiz gen + Cache + API impl
         │
         └→ [qa-inspector]     → Incremental QA (C1-C5)
                                        ↓
                                  qa-report.md
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| foundation-architect 실패 | 에러 분석 후 재실행. 2회 실패 시 사용자에게 보고 |
| 팀원 1명 중지 | SendMessage로 상태 확인 → 재시작 또는 다른 팀원이 인수 |
| npm run build 실패 | qa-inspector가 에러 추적 → 해당 에이전트에게 수정 요청 |
| Nudget API key 미설정 | Phase 0에서 사용자에게 요청. 없으면 mock 데이터로 진행 |
| 팀원 간 데이터 충돌 | 출처 병기, qa-inspector가 중재 |

## 테스트 시나리오

### 정상 흐름
1. Phase 0: Spec 확인, _workspace 생성, baseline 빌드 성공
2. Phase A: foundation-architect가 타입 + API scaffolds 생성 (~10분)
3. Phase B: 4명 병렬 작업 시작
   - design-migrator: 3-Tier 디자인 전환 (~15분)
   - feed-builder: 6개 컴포넌트 + 3개 페이지 (~20분)
   - pipeline-engineer: 필터+퀴즈+캐시+API (~20분)
   - qa-inspector: 점진적 검증 (타 팀원 완료 시마다)
4. Phase C: 최종 빌드 성공, QA 리포트 통과
5. Phase D: 사용자에게 결과 보고

### 에러 흐름
1. Phase B에서 pipeline-engineer의 OpenAI API 호출 실패 (OPENAI_API_KEY 미설정)
2. qa-inspector가 C1 검증 시 발견
3. pipeline-engineer에게 SendMessage: "OPENAI_API_KEY 환경변수 확인 필요"
4. pipeline-engineer가 .env.local 확인 → 사용자에게 키 설정 요청
5. 키 설정 후 파이프라인 재실행
6. 나머지 QA 항목 통과
