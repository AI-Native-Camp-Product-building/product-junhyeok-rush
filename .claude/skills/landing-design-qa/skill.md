---
name: landing-design-qa
description: "랜딩페이지 디자인 검수 + 개선 파이프라인. 모든 섹션의 톤앤매너, 타이포그래피, 컬러, 스페이싱, 카피를 감사하고 일관된 프리미엄 디자인으로 개선한다. '디자인 검수', '디자인 리뷰', '톤앤매너 통일', '랜딩 디자인 개선', '디자인 QA' 요청 시 이 스킬을 사용할 것."
---

# Landing Design QA — 디자인 검수 + 개선 파이프라인

## 실행 모드: 서브 에이전트 파이프라인

감사(audit) → 개선(polish) → 검증(verify) 순서로 실행한다.

## 워크플로우

### Phase 1: 디자인 감사

```
Agent(
  subagent_type: "design-auditor",
  model: "opus",
  prompt: "components/landing/ 하위의 모든 .tsx 파일을 읽고 디자인 감사를 수행하라.
    .claude/agents/design-auditor.md를 읽고 감사 기준을 따르라.
    globals.css도 읽어서 커스텀 클래스를 이해하라.
    결과를 _workspace/design_audit.md에 저장하라.
    
    감사 리포트 형식:
    # 디자인 감사 리포트
    ## Critical (즉시 수정 필요)
    ## Warning (개선 권장)
    ## Info (참고)
    각 항목: [섹션] 이슈 설명 → 개선 방안"
)
```

### Phase 2: 디자인 개선

```
Agent(
  subagent_type: "design-polisher",
  model: "opus",
  prompt: "_workspace/design_audit.md를 읽고 디자인 이슈를 수정하라.
    .claude/agents/design-polisher.md를 읽고 작업 원칙을 따르라.
    CLAUDE.md의 디자인 규칙을 절대적으로 준수하라.
    수정 후 npm run build로 빌드 검증하라.
    변경 내역을 _workspace/design_changes.md에 기록하라."
)
```

### Phase 3: 최종 검증

빌드 성공 확인 + 디자인 규칙 위반 없는지 Grep으로 검증.

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 빌드 실패 | polisher가 자체 수정 |
| 감사와 규칙 충돌 | CLAUDE.md 디자인 규칙 우선 |

## 테스트 시나리오

### 정상 흐름
1. 감사: 톤 불일치 3건, 스페이싱 이슈 2건 발견
2. 개선: 5건 모두 수정
3. 검증: 빌드 성공, 디자인 규칙 위반 0건
