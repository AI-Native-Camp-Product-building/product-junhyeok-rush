---
name: daily-feed-pipeline-diagnose
description: Daily Feed 파이프라인의 OpenAI/Nudget API 호출 실패(401/403/429/5xx/타임아웃)를 결정론적으로 진단한다. /api/daily-feed가 500을 반환하거나, content-filter/nudget-transformer/quiz-generator에서 "401 You didn't provide an API key", "Incorrect API key provided", "You exceeded your current quota", "ECONNREFUSED" 같은 에러가 보이거나, .env.local의 OPENAI_API_KEY/NUDGET_API_KEY가 의심스러울 때 반드시 이 스킬을 사용한다. 시크릿 값을 노출하지 않고 prefix·길이·포맷만 검사하며, 직접 curl probe로 가설을 검증하고 증상→원인→수정 매트릭스로 결론을 도출한다.
---

# Daily Feed Pipeline Diagnose

Daily Feed 파이프라인의 외부 API 의존성 장애를 결정론적으로 진단한다.

## 사용 시점

다음 신호 중 하나라도 보이면 즉시 트리거:

- `GET /api/daily-feed`가 500 응답
- `lib/content-filter.ts`, `lib/nudget-transformer.ts`, `lib/quiz-generator.ts` 어디든 OpenAI 호출이 catch 블록으로 빠짐
- 서버 로그에 `Content filter failed`, `Transform API failed`, `Quiz generation failed`, `Nudget API error`
- 401/403/429/5xx 응답이 외부 API에서 옴
- 페이지가 dev mock으로 폴백 (`mockFeedItems` 사용 신호)

## 진단 프로토콜

진단은 5단계로 진행한다. 각 단계는 read-only이며, 단계 간 의존이 있다. 단계를 건너뛰지 않는다.

### Phase A — 환경 무결성 (no network)

키 값을 노출하지 않고 형태만 검사한다.

```bash
bash .claude/skills/daily-feed-pipeline-diagnose/scripts/inspect-key.sh OPENAI_API_KEY
bash .claude/skills/daily-feed-pipeline-diagnose/scripts/inspect-key.sh NUDGET_API_KEY
```

스크립트는 JSON으로 다음을 보고:
- `exists`: 키가 .env.local에 정의되었는가
- `prefix_class`: `project` (`sk-proj-`) / `service_account` (`sk-svcacct-`) / `legacy_user` (`sk-`) / `placeholder_invalid` (`sk-None-`) / `unknown`
- `prefix_sample`: 첫 7자 (시크릿 아님)
- `length`: 문자 길이
- `has_quotes`, `has_leading_whitespace`, `has_trailing_whitespace`, `has_non_ascii`

이 단계만으로 식별 가능한 결함:
- `length < 40` → 잘림 또는 placeholder
- `has_quotes: true` → `OPENAI_API_KEY="sk-..."` 형태. Next.js dev server는 따옴표를 그대로 키에 포함시켜 전송함. 따옴표 제거 필요.
- `has_leading_whitespace`, `has_trailing_whitespace: true` → 줄바꿈/탭 오염
- `has_non_ascii: true` → 복붙 오염 (smart quotes, zero-width space 등)
- `prefix_class: placeholder_invalid` → `sk-None-...` 같은 IDE/CI 자동 생성 placeholder

Phase A에서 결함이 확정되면 Phase B로 가지 않고 바로 Phase D 수정 단계로 점프.

### Phase B — 직접 API Probe (network)

키가 형태상 정상이면 OpenAI에 직접 요청해본다.

```bash
bash .claude/skills/daily-feed-pipeline-diagnose/scripts/probe-openai.sh gpt-4o-mini
```

스크립트는 두 엔드포인트를 친다:
1. `GET /v1/models` (가장 가벼운 호출, 인증만 검증)
2. `POST /v1/chat/completions` with `gpt-4o-mini` (앱과 동일 모델)

각각 HTTP status, OpenAI error.code, error.message excerpt를 JSON으로 보고. 키 값은 출력에 포함되지 않는다.

해석 매트릭스는 아래 "Phase C: 진단 매트릭스" 참조.

### Phase C — 진단 매트릭스

| /v1/models | /v1/chat | 에러 코드 / 메시지 단서 | 근본 원인 | 수정 |
|---|---|---|---|---|
| 200 | 200 | — | 키 정상. 앱 측 문제 (env 미로드, dev server stale) | dev server 재시작, `process.env.OPENAI_API_KEY`가 진짜로 로드됐는지 확인 |
| 401 | 401 | `invalid_api_key` / "Incorrect API key provided" | 키가 무효 (오타·rotated·삭제) | platform.openai.com에서 키 회전 |
| 401 | 401 | "You didn't provide an API key" | Authorization 헤더가 비어 도착 | 키가 빈 문자열. .env.local 재확인, 따옴표 이슈 |
| 401 | 401 | `invalid_request_error` | 키 형식 손상 (공백·따옴표·non-ASCII) | Phase A 결과로 어떤 결함인지 식별, 수정 |
| 401 | 401 | `mismatched_organization` | 키-조직 불일치 | OpenAI-Organization 헤더 추가 또는 올바른 키 사용 |
| 200 | 401 | `model_not_found` | 모델 접근 권한 없음 (gpt-4o-mini tier 미달성) | OpenAI 계정 tier 확인, 결제 활성화 |
| 200 | 429 | `insufficient_quota` | 잔고 소진 | platform.openai.com에서 결제 정보 추가 |
| 200 | 429 | `rate_limit_exceeded` | 일시적 rate limit | 백오프 후 재시도, RPM/TPM tier 확인 |
| 200 | 5xx | OpenAI 측 incident | OpenAI 장애 | status.openai.com 확인, 재시도 |
| timeout | timeout | — | 네트워크/방화벽 차단 | 프록시·방화벽·DNS 점검 |

### Phase D — 수정 실행

진단된 원인에 따라 수정 단계를 사용자에게 제시한다. **사용자 승인 없이 .env.local을 수정하지 않는다.** 코드 수정은 사용자가 결정한다.

수정 후 **반드시 dev server를 재시작**한다 (Next.js는 .env.local 변경을 자동 감지하지 않음).

```bash
# 기존 dev server 종료 후
npm run dev
```

### Phase E — 검증

수정 후 다음 명령으로 결과 검증:

```bash
# 1. Probe 재실행 — 401이 사라졌는지
bash .claude/skills/daily-feed-pipeline-diagnose/scripts/probe-openai.sh gpt-4o-mini

# 2. API 엔드포인트 직접 호출 — 200 + 실제 콘텐츠 확인
curl -sS -o /tmp/feed.json -w "HTTP %{http_code}\n" http://localhost:3000/api/daily-feed
jq '.totalRaw, .totalFiltered, .items | length, .items[0].date' /tmp/feed.json
```

기대 결과:
- HTTP 200
- `totalRaw > 0` (Nudget이 콘텐츠를 반환)
- `totalFiltered > 0` (필터가 통과시킴)
- `items[0].date`가 KST 오늘 날짜 문자열

`degraded` 신호를 응답에 포함하도록 schema가 확장된 경우 그 필드도 false인지 확인.

## 보고서 작성

진단이 끝나면 `_workspace/diag-YYYYMMDD-HHMM.md`에 보고서를 저장한다. 형식은 `feed-pipeline-diagnostician` 에이전트의 출력 프로토콜 참조.

## 시크릿 보호 (반복 강조)

**다음 명령은 절대 실행하지 않는다:**
- `echo $OPENAI_API_KEY`
- `printenv OPENAI_API_KEY`
- `cat .env.local`
- `grep -v ^# .env.local`
- 키를 인자로 받는 어떤 명령도 stdout으로 결과를 노출

**허용되는 검사:**
- `awk -F= '/^OPENAI_API_KEY=/ ...'` 이후 결과를 길이/prefix만 측정
- `curl` 호출 시 `-H "Authorization: Bearer $KEY"` 사용 (curl 자체는 키를 화면에 띄우지 않음)
- 스크립트가 임시 파일에 응답을 저장한 뒤 jq로 error 필드만 추출, 임시 파일은 `rm`

## 트리거 검증

### Should-trigger
- "daily-feed가 500이야 왜지?"
- "OpenAI 401 떴는데 키는 맞는 것 같은데"
- "/api/daily-feed가 자꾸 mock으로 빠져"
- "content filter가 fallback으로 떨어지는데 진단해줘"
- "OPENAI_API_KEY가 이상한 것 같은데 안 노출하고 점검할 수 있어?"
- "Nudget API 호출이 실패해"
- "transform API failed 로그가 떠"

### Should-NOT-trigger (near-miss)
- "OpenAI SDK 사용법 알려줘" → 문서 조회
- "lib/content-filter.ts 코드 리뷰해줘" → code-reviewer
- "OpenAI 모델 비교해줘" → 일반 질의
- "Daily Feed 디자인 개선해줘" → designer
- "lib/quiz-generator.ts에 새 모델 추가해줘" → executor
