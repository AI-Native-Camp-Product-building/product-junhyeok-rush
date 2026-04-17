import type { DailyFeedItem } from "./daily-feed-types";

/**
 * Returns YYYY-MM-DD in Asia/Seoul KST. Mirrors server's getKstDateKey()
 * in lib/feed-cache.ts so mock dates match what real data would use.
 */
function kstDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Dev-only fallback data. Dates are computed at call time so mock never goes
 * stale. Only used when /api/daily-feed fails in development. Production
 * builds surface a real error UI instead.
 */
export function getMockFeedItems(): DailyFeedItem[] {
  const today = kstDate(0);
  const yesterday = kstDate(-1);
  const dayBefore = kstDate(-2);

  return [
    {
      id: "mock-claude-code-sub-agents",
      date: today,
      title: "Claude Code Sub-Agents로 병렬 작업 자동화하기",
      summary:
        "Claude Code의 sub-agent 기능이 정식 출시되었습니다. 하나의 세션에서 여러 에이전트를 동시에 실행하여 대규모 리팩토링, 테스트 생성, 코드 리뷰를 병렬로 처리할 수 있습니다.",
      keyPoints: [
        "Task 도구로 sub-agent를 생성하고 독립적인 작업을 위임",
        "각 sub-agent는 자체 컨텍스트 윈도우를 가져 토큰 효율 극대화",
        "팀 모드에서 최대 5개 에이전트가 동시에 작업 가능",
      ],
      sourceUrl: "https://docs.anthropic.com/en/docs/claude-code/sub-agents",
      sourceType: "rss",
      sourceName: "Anthropic Docs",
      category: "update",
      quiz: [
        {
          id: "q1-sub-agents",
          question: "Claude Code에서 sub-agent를 생성할 때 사용하는 도구는?",
          answer: "Task 도구",
          distractors: ["Bash 도구", "Agent 도구", "Spawn 도구"],
          explanation:
            "Task 도구를 통해 sub-agent를 생성하고, 각 에이전트에게 독립적인 작업을 위임할 수 있습니다.",
        },
        {
          id: "q2-sub-agents",
          question: "Sub-agent가 메인 에이전트와 독립적인 컨텍스트를 가지는 이유는?",
          answer: "토큰 효율을 극대화하고 작업 간 간섭을 방지하기 위해",
          distractors: [
            "보안상 각 에이전트의 접근 권한을 분리하기 위해",
            "서로 다른 AI 모델을 사용할 수 있게 하기 위해",
            "에이전트 간 통신 비용을 줄이기 위해",
          ],
        },
      ],
      nudgetContentId: "nc-sub-agents-001",
    },
    {
      id: "mock-claude-hooks-best-practices",
      date: today,
      title: "Hooks 실전 패턴: CI/CD 파이프라인 자동화",
      summary:
        "커뮤니티에서 공유된 Hooks 활용 패턴 모음입니다. PreToolUse로 위험 명령을 사전 차단하고, PostToolUse로 자동 포매팅과 린트를 적용하는 실전 설정을 다룹니다.",
      keyPoints: [
        "PreToolUse + jq 조합으로 rm -rf, DROP TABLE 등 위험 명령 자동 차단",
        "PostToolUse에서 prettier --write로 수정 파일 자동 포매팅",
        "SessionStart에서 .env 로드 + git pull로 환경 자동 동기화",
      ],
      sourceUrl: "https://x.com/anthropic_eng/status/example123",
      sourceType: "x",
      sourceName: "@anthropic_eng",
      category: "workflow",
      quiz: [
        {
          id: "q1-hooks-patterns",
          question:
            "위험한 셸 명령을 사전에 차단하려면 어떤 Hook 이벤트를 사용해야 하나요?",
          answer: "PreToolUse",
          distractors: ["PostToolUse", "SessionStart", "OnError"],
          explanation:
            "PreToolUse는 도구 실행 전에 트리거되므로, 명령을 검증하고 위험하면 차단할 수 있습니다.",
        },
      ],
      nudgetContentId: "nc-hooks-patterns-001",
    },
    {
      id: "mock-prompt-engineering-claude-code",
      date: yesterday,
      title: "Claude Code 프롬프트 엔지니어링 가이드",
      summary:
        "효과적인 Claude Code 프롬프트 작성법에 대한 공식 가이드입니다. 구체적인 지시, 컨텍스트 제공, 단계적 분해가 핵심이며, CLAUDE.md와 결합하면 일관된 결과를 얻을 수 있습니다.",
      keyPoints: [
        "모호한 요청보다 구체적인 파일명, 함수명, 기대 동작을 명시",
        "큰 작업은 여러 단계로 분해하여 순차적으로 요청",
        "CLAUDE.md에 프로젝트 컨벤션을 기록하면 매번 반복 설명 불필요",
      ],
      sourceUrl: "https://www.youtube.com/watch?v=example456",
      sourceType: "youtube",
      sourceName: "Anthropic",
      category: "methodology",
      nudgetContentId: "nc-prompt-eng-001",
    },
    {
      id: "mock-mcp-server-toolkit",
      date: yesterday,
      title: "MCP 서버 빌드 툴킷 오픈소스 공개",
      summary:
        "Model Context Protocol 서버를 빠르게 구축할 수 있는 Python/TypeScript 툴킷이 공개되었습니다. 외부 API, 데이터베이스, 사내 도구를 Claude Code에 연결하는 커스텀 MCP 서버를 쉽게 만들 수 있습니다.",
      keyPoints: [
        "FastMCP(Python)와 @anthropic-ai/mcp-sdk(TS) 두 가지 SDK 제공",
        "데코레이터 패턴으로 도구 정의 → 자동 JSON Schema 생성",
        "로컬 stdio와 원격 HTTP 전송 모두 지원",
      ],
      sourceUrl: "https://www.linkedin.com/posts/example789",
      sourceType: "linkedin",
      sourceName: "Anthropic Engineering",
      category: "tool",
      quiz: [
        {
          id: "q1-mcp-toolkit",
          question: "MCP 서버의 Python SDK 이름은?",
          answer: "FastMCP",
          distractors: ["PyMCP", "MCPython", "AnthropicMCP"],
          explanation:
            "FastMCP는 데코레이터 기반으로 MCP 도구를 쉽게 정의할 수 있는 Python SDK입니다.",
        },
      ],
      nudgetContentId: "nc-mcp-toolkit-001",
    },
    {
      id: "mock-claude-code-vim-mode",
      date: dayBefore,
      title: "Claude Code Vim 모드와 키바인딩 커스터마이징",
      summary:
        "Claude Code에서 Vim 스타일 키바인딩을 설정하는 방법과 커스텀 키맵 파일 작성법을 소개합니다. ~/.claude/keybindings.json으로 자신만의 워크플로우를 구축하세요.",
      keyPoints: [
        "~/.claude/keybindings.json에서 키바인딩 커스터마이징 가능",
        "Chord 바인딩(연속 키 입력)으로 복잡한 매크로 설정",
        "Escape 키로 입력 취소, Ctrl+C로 실행 중 작업 중단",
      ],
      sourceUrl: "https://example.com/vim-mode-guide",
      sourceType: "rss",
      sourceName: "Claude Code Blog",
      category: "workflow",
      nudgetContentId: "nc-vim-mode-001",
    },
  ];
}
