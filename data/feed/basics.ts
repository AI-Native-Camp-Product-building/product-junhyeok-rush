import type { FeedItem, Block } from "@/lib/types";

// ─── Block 1: Agentic Loop ─── CodeReadingTask ───

const block1AgenticLoop: Block = {
  id: "agentic-loop",
  topicId: "agentic-loop",
  title: "Agentic Loop",
  explain: {
    markdown: `## Agentic Loop

Claude Code는 단순 코드 생성기가 아니라 **에이전틱 루프**로 동작합니다. 컨텍스트 수집(코드 읽기, 검색) → 행동(파일 편집, 명령 실행) → 검증(빌드, 테스트)의 사이클을 자율적으로 반복하며, 목표가 달성될 때까지 스스로 판단하고 행동합니다.

### 핵심 포인트
- **Read → Plan → Act → Verify** 사이클을 자율적으로 반복
- 한 번의 프롬프트로 여러 파일을 읽고, 수정하고, 빌드/테스트까지 수행
- 실패 시 스스로 원인을 분석하고 재시도하는 **자기 교정 능력** 보유`,
    keyPoints: [
      "Read → Plan → Act → Verify 사이클을 자율적으로 반복",
      "한 번의 프롬프트로 여러 파일을 읽고, 수정하고, 빌드/테스트까지 수행",
      "실패 시 스스로 원인을 분석하고 재시도하는 자기 교정 능력 보유",
    ],
  },
  execute: {
    taskType: "code-reading",
    code: `// Claude Code 에이전틱 루프 의사코드
async function agenticLoop(userPrompt: string) {
  let goal = parseGoal(userPrompt);
  let done = false;

  while (!done) {
    // Step 1: 컨텍스트 수집
    const context = await tools.read(relevantFiles);
    const searchResults = await tools.grep(codebase, patterns);

    // Step 2: 계획 & 행동
    const plan = await think(goal, context);
    for (const action of plan.actions) {
      await tools.execute(action); // Edit, Write, Bash 등
    }

    // Step 3: 검증
    const buildResult = await tools.bash("npm run build");
    const testResult = await tools.bash("npm test");

    if (buildResult.success && testResult.success) {
      done = true;
    } else {
      // 자기 교정: 에러 분석 후 재시도
      goal = refineGoal(goal, buildResult.errors);
    }
  }
}`,
    question:
      "위 코드에서 빌드가 실패했을 때 Claude Code는 어떻게 행동하나요?",
    answer: "에러를 분석하여 목표를 재정의(refineGoal)하고, while 루프를 통해 처음부터 다시 컨텍스트 수집 → 행동 → 검증 사이클을 반복합니다.",
    distractors: [
      "빌드 에러 로그를 사용자에게 출력하고 루프를 종료합니다",
      "실패한 테스트만 다시 실행하고, 코드 수정 없이 재시도합니다",
    ],
  },
  quiz: {
    questions: [
      {
        question: "Claude Code의 에이전틱 루프 3단계를 순서대로 말해보세요.",
        answer: "컨텍스트 수집(Read) → 행동(Act) → 검증(Verify)",
        distractors: [
          "입력(Input) → 처리(Process) → 출력(Output)",
          "분석(Analyze) → 생성(Generate) → 배포(Deploy)",
        ],
        hints: [
          "첫 번째는 코드를 '읽는' 단계입니다",
          "마지막은 결과를 '확인'하는 단계입니다",
        ],
      },
      {
        question:
          "Claude Code가 빌드 실패를 만나면 어떻게 행동하나요?",
        answer:
          "에러 메시지를 분석하고, 원인을 파악한 뒤, 코드를 수정하고 다시 빌드를 시도합니다. 이 과정을 성공할 때까지 반복합니다.",
        distractors: [
          "에러 로그를 사용자에게 보여주고 수동 수정을 요청합니다",
          "빌드를 중단하고 에러 메시지만 출력한 뒤 다음 명령을 기다립니다",
        ],
        hints: [
          "단순히 멈추지 않습니다",
          "스스로 '교정'하는 능력이 핵심입니다",
        ],
      },
      {
        question:
          "Claude Code가 일반 코드 자동완성 도구(예: Copilot)와 가장 다른 점은 무엇인가요?",
        answer:
          "코드 생성뿐 아니라 파일 읽기, 명령 실행, 빌드/테스트 검증까지 자율적으로 수행하는 에이전트라는 점입니다.",
        distractors: [
          "더 큰 언어 모델을 사용해서 코드 자동완성 품질이 높다는 점입니다",
          "IDE 내에서 인라인으로 코드 제안을 해주는 방식이 다릅니다",
        ],
        hints: [
          "'자율적'이라는 키워드가 핵심입니다",
          "도구를 직접 사용할 수 있다는 점을 생각해보세요",
        ],
      },
    ],
  },
};

// ─── Block 2: CLAUDE.md ─── DebuggingTask ───

const block2ClaudeMd: Block = {
  id: "claude-md",
  topicId: "claude-md",
  title: "CLAUDE.md",
  explain: {
    markdown: `## CLAUDE.md

CLAUDE.md는 Claude Code에게 프로젝트별 지시사항을 전달하는 마크다운 파일입니다. 프로젝트 루트, 홈 디렉토리, 하위 디렉토리 등 3계층으로 구성되며, 코딩 규칙, 아키텍처 결정, 빌드 명령어 등을 명시해 일관된 작업을 보장합니다.

### 핵심 포인트
- **3계층 구조**: ~/.claude/CLAUDE.md (글로벌) → 프로젝트 루트 CLAUDE.md → 하위 디렉토리 CLAUDE.md
- **/init** 명령으로 프로젝트 분석 후 자동 생성 가능
- **자동 메모리**(auto memory) 기능으로 Claude가 학습한 내용을 자동 저장`,
    keyPoints: [
      "3계층 구조: ~/.claude/CLAUDE.md (글로벌) → 프로젝트 루트 CLAUDE.md → 하위 디렉토리 CLAUDE.md",
      "/init 명령으로 프로젝트 분석 후 자동 생성 가능",
      "자동 메모리(auto memory) 기능으로 Claude가 학습한 내용을 자동 저장",
    ],
  },
  execute: {
    taskType: "debugging",
    buggyCode: `# CLAUDE.md - 프로젝트 설정

## 빌드 명령어
- 빌드: npm run biuld
- 테스트: npm run test
- 린트: npm run lint

## 코딩 규칙
- TypeScript strict 모드 사용
- 컴포넌트는 PascalCase, 유틸은 camelCase
- 테스트 파일은 __tests__/ 디렉토리에 배치

## 우선순위
이 파일은 ~/.claude/CLAUDE.md보다 우선하며,
하위 디렉토리의 CLAUDE.md보다 우선합니다.`,
    correctCode: `# CLAUDE.md - 프로젝트 설정

## 빌드 명령어
- 빌드: npm run build
- 테스트: npm run test
- 린트: npm run lint

## 코딩 규칙
- TypeScript strict 모드 사용
- 컴포넌트는 PascalCase, 유틸은 camelCase
- 테스트 파일은 __tests__/ 디렉토리에 배치

## 우선순위
이 파일은 ~/.claude/CLAUDE.md보다 우선하지만,
하위 디렉토리의 CLAUDE.md가 이 파일보다 우선합니다.`,
    bugDescription:
      "두 가지 버그가 있습니다: (1) 빌드 명령어에 오타 — 'biuld' → 'build', (2) 우선순위 설명이 틀림 — 하위 디렉토리 CLAUDE.md가 프로젝트 루트보다 '더 높은' 우선순위를 가집니다 (더 구체적인 위치가 우선).",
    hints: [
      "빌드 명령어의 철자를 꼼꼼히 확인하세요",
      "CLAUDE.md 3계층에서 더 구체적인 위치의 파일이 더 높은 우선순위를 가집니다",
    ],
  },
  quiz: {
    questions: [
      {
        question:
          "CLAUDE.md의 3계층 우선순위를 높은 것부터 나열해보세요.",
        answer:
          "하위 디렉토리 CLAUDE.md → 프로젝트 루트 CLAUDE.md → ~/.claude/CLAUDE.md (글로벌). 더 구체적인 위치가 더 높은 우선순위를 가집니다.",
        distractors: [
          "~/.claude/CLAUDE.md (글로벌) → 프로젝트 루트 → 하위 디렉토리 순으로, 글로벌 설정이 항상 우선합니다",
          "프로젝트 루트 CLAUDE.md → 하위 디렉토리 → ~/.claude/CLAUDE.md 순으로, 루트가 가장 높습니다",
        ],
        hints: [
          "CSS의 specificity와 비슷한 원리입니다",
          "더 가까운 파일이 이깁니다",
        ],
      },
      {
        question:
          "CLAUDE.md를 자동으로 생성하는 슬래시 명령어는 무엇인가요?",
        answer: "/init",
        distractors: ["/setup", "/create"],
        hints: ["프로젝트를 '초기화'하는 명령어입니다", "4글자입니다"],
      },
    ],
  },
};

// ─── Block 3: Tool Use ─── ConceptMatchingTask ───

const block3ToolUse: Block = {
  id: "tool-use",
  topicId: "tool-use",
  title: "Tool Use",
  explain: {
    markdown: `## Tool Use

Claude Code는 Read, Write, Edit, Bash, Glob, Grep 등 내장 도구를 사용해 코드베이스와 상호작용합니다. 파일을 읽고 쓰고, 터미널 명령을 실행하고, 패턴으로 파일을 검색하는 등 개발자가 하는 모든 작업을 도구를 통해 수행합니다.

### 핵심 포인트
- **Read/Write/Edit**: 파일 읽기, 새 파일 생성, 기존 파일 부분 수정
- **Bash**: 터미널 명령 실행 (빌드, 테스트, git 등)
- **Glob/Grep**: 파일명 패턴 검색과 파일 내용 검색`,
    keyPoints: [
      "Read/Write/Edit: 파일 읽기, 새 파일 생성, 기존 파일 부분 수정",
      "Bash: 터미널 명령 실행 (빌드, 테스트, git 등)",
      "Glob/Grep: 파일명 패턴 검색과 파일 내용 검색",
    ],
  },
  execute: {
    taskType: "concept-matching",
    pairs: [
      { left: "Read", right: "파일의 내용을 읽어서 컨텍스트에 로드" },
      { left: "Write", right: "새 파일을 생성하거나 기존 파일 전체를 덮어쓰기" },
      { left: "Edit", right: "기존 파일의 특정 부분만 정확하게 수정" },
      { left: "Bash", right: "터미널 명령 실행 (npm, git, 빌드 등)" },
      { left: "Glob", right: "와일드카드 패턴으로 파일명 검색 (예: **/*.ts)" },
      { left: "Grep", right: "정규식으로 파일 내용 검색" },
    ],
    instructions:
      "왼쪽의 Claude Code 도구 이름과 오른쪽의 설명을 올바르게 연결하세요.",
  },
  quiz: {
    questions: [
      {
        question:
          "파일 내용을 검색할 때 사용하는 도구와 파일명을 검색할 때 사용하는 도구를 각각 말해보세요.",
        answer: "파일 내용 검색은 Grep, 파일명 검색은 Glob입니다.",
        distractors: [
          "파일 내용 검색은 Glob, 파일명 검색은 Grep입니다",
          "둘 다 Bash 도구의 find와 grep 명령어로 수행합니다",
        ],
        hints: [
          "리눅스의 grep 명령어를 떠올려보세요",
          "glob은 와일드카드 패턴 매칭입니다",
        ],
      },
      {
        question:
          "기존 파일의 일부분만 수정할 때 Write 대신 사용해야 하는 도구는 무엇인가요?",
        answer:
          "Edit 도구입니다. Write는 전체 파일을 덮어쓰지만, Edit는 특정 부분만 정확하게 수정합니다.",
        distractors: [
          "Patch 도구입니다. diff 형식으로 변경사항을 적용합니다",
          "Replace 도구입니다. 정규식으로 텍스트를 치환합니다",
        ],
        hints: [
          "파일 '전체'가 아니라 '일부'를 바꾸는 도구입니다",
          "이름이 4글자입니다",
        ],
      },
      {
        question:
          "Claude Code가 npm install이나 git commit 같은 터미널 명령을 실행할 때 사용하는 도구는 무엇인가요?",
        answer: "Bash 도구입니다.",
        distractors: ["Shell 도구입니다", "Terminal 도구입니다"],
        hints: [
          "셸 명령을 실행하는 도구입니다",
          "리눅스 셸의 이름과 같습니다",
        ],
      },
    ],
  },
};

// ─── Block 4: Context Window ─── SequenceOrderingTask ───

const block4ContextWindow: Block = {
  id: "context-window",
  topicId: "context-window",
  title: "Context Window",
  explain: {
    markdown: `## Context Window

Claude Code의 컨텍스트 윈도우는 대화 중 기억할 수 있는 토큰의 한계입니다. 긴 대화나 큰 파일을 다루면 컨텍스트가 가득 차 성능이 저하됩니다. /compact로 요약하고, /clear로 초기화하며, 효율적으로 토큰을 관리하는 것이 핵심입니다.

### 핵심 포인트
- **/compact**: 대화 내용을 요약해 컨텍스트 공간 확보
- **/clear**: 대화 기록 완전 초기화로 새 시작
- **/cost**: 현재 세션의 토큰 사용량과 비용 확인`,
    keyPoints: [
      "/compact: 대화 내용을 요약해 컨텍스트 공간 확보",
      "/clear: 대화 기록 완전 초기화로 새 시작",
      "/cost: 현재 세션의 토큰 사용량과 비용 확인",
    ],
  },
  execute: {
    taskType: "sequence-ordering",
    items: [
      "긴 작업 수행 중 응답 속도가 느려지는 것을 감지",
      "/cost 명령으로 현재 토큰 사용량 확인",
      "/compact 명령으로 대화 내용을 핵심만 남기고 요약",
      "요약 후 /cost로 토큰 사용량이 줄었는지 확인",
      "필요시 /clear로 완전히 새 세션 시작",
    ],
    instructions:
      "Claude Code에서 컨텍스트 윈도우를 효율적으로 관리하는 단계를 올바른 순서로 배열하세요.",
  },
  quiz: {
    questions: [
      {
        question:
          "대화가 길어져서 Claude의 응답이 느려졌을 때, 대화 내용을 유지하면서 토큰을 줄이는 명령어는?",
        answer: "/compact",
        distractors: ["/summarize", "/reduce"],
        hints: [
          "'압축'한다는 의미입니다",
          "대화를 '요약'하는 명령어입니다",
        ],
      },
      {
        question: "/compact와 /clear의 차이점은 무엇인가요?",
        answer:
          "/compact는 대화를 요약해서 핵심만 유지하지만, /clear는 대화 기록을 완전히 삭제하고 새로 시작합니다.",
        distractors: [
          "/compact는 이전 대화를 파일로 저장하고, /clear는 캐시만 삭제합니다",
          "/compact는 마지막 5개 메시지만 남기고, /clear는 CLAUDE.md 설정까지 초기화합니다",
        ],
        hints: [
          "/compact는 내용을 '보존'합니다",
          "/clear는 모든 것을 '지웁니다'",
        ],
      },
    ],
  },
};

// ─── Block 5: Slash Commands ─── FillInBlankTask ───

const block5SlashCommands: Block = {
  id: "slash-commands",
  topicId: "slash-commands",
  title: "Slash Commands",
  explain: {
    markdown: `## Slash Commands

슬래시 명령어는 Claude Code에서 자주 쓰는 작업을 빠르게 실행하는 단축키입니다. /init으로 프로젝트 초기화, /review로 코드 리뷰, /pr로 풀리퀘스트 생성 등 개발 워크플로우의 핵심 작업을 한 단어로 실행할 수 있습니다.

### 핵심 포인트
- **/init**: CLAUDE.md 자동 생성으로 프로젝트 초기화
- **/review**: 현재 변경사항에 대한 코드 리뷰 수행
- **/pr**: 변경사항을 분석해 풀리퀘스트 자동 생성`,
    keyPoints: [
      "/init: CLAUDE.md 자동 생성으로 프로젝트 초기화",
      "/review: 현재 변경사항에 대한 코드 리뷰 수행",
      "/pr: 변경사항을 분석해 풀리퀘스트 자동 생성",
    ],
  },
  execute: {
    taskType: "fill-in-blank",
    codeTemplate: `# Claude Code 슬래시 명령어 활용 시나리오

## 1단계: 프로젝트 초기화
> 새 프로젝트를 시작할 때 CLAUDE.md를 자동 생성합니다.
명령어: /___

## 2단계: 코드 리뷰 요청
> 기능 구현 후 변경사항에 대한 리뷰를 받습니다.
명령어: /___

## 3단계: PR 생성
> 리뷰를 반영한 후 풀리퀘스트를 자동 생성합니다.
명령어: /___

## 보너스: 명령어 목록 확인
> 사용 가능한 슬래시 명령어를 모두 보려면?
입력: ___`,
    blanks: [
      {
        position: 0,
        correct: "init",
        options: ["init", "setup", "new", "start"],
      },
      {
        position: 1,
        correct: "review",
        options: ["review", "check", "inspect", "lint"],
      },
      {
        position: 2,
        correct: "pr",
        options: ["pr", "pull-request", "merge", "push"],
      },
      {
        position: 3,
        correct: "/",
        options: ["/", "/help", "/list", "/commands"],
      },
    ],
  },
  quiz: {
    questions: [
      {
        question:
          "프로젝트를 처음 시작할 때 CLAUDE.md를 자동 생성하는 명령어는?",
        answer: "/init",
        distractors: ["/new", "/start"],
        hints: [
          "'초기화'를 의미합니다",
          "프로젝트 셋업 시 가장 먼저 실행",
        ],
      },
      {
        question:
          "현재 코드 변경사항에 대해 리뷰를 받고 싶을 때 사용하는 명령어는?",
        answer: "/review",
        distractors: ["/check", "/inspect"],
        hints: ["코드 '검토'를 영어로 하면?", "6글자입니다"],
      },
      {
        question:
          "사용 가능한 슬래시 명령어 목록을 보려면 어떻게 하나요?",
        answer:
          "프롬프트에 /를 입력하면 사용 가능한 명령어 목록이 자동완성으로 표시됩니다.",
        distractors: [
          "/help 명령어를 입력하면 전체 명령어 목록이 출력됩니다",
          "/list-commands로 설치된 모든 명령어를 확인할 수 있습니다",
        ],
        hints: [
          "특별한 명령어가 필요하지 않습니다",
          "그냥 슬래시만 입력해보세요",
        ],
      },
    ],
  },
};

// ─── Block 6: Permissions & Safety ─── CodeReadingTask ───

const block6Permissions: Block = {
  id: "permissions",
  topicId: "permissions",
  title: "Permissions & Safety",
  explain: {
    markdown: `## Permissions & Safety

Claude Code는 3단계 권한 시스템으로 안전하게 동작합니다. 읽기 전용 작업은 자동 허용, 파일 수정은 확인 요청, 위험한 명령은 명시적 승인이 필요합니다. Shift+Tab으로 권한을 빠르게 부여하고, 설정으로 신뢰하는 도구를 자동 허용할 수 있습니다.

### 핵심 포인트
- **3단계**: 자동 허용(읽기) → 확인 요청(쓰기) → 명시적 승인(위험 명령)
- **Shift+Tab**: 권한 요청에 빠르게 승인하는 단축키
- **allowedTools** 설정으로 신뢰하는 도구를 영구 자동 허용 가능`,
    keyPoints: [
      "3단계: 자동 허용(읽기) → 확인 요청(쓰기) → 명시적 승인(위험 명령)",
      "Shift+Tab: 권한 요청에 빠르게 승인하는 단축키",
      "allowedTools 설정으로 신뢰하는 도구를 영구 자동 허용 가능",
    ],
  },
  execute: {
    taskType: "code-reading",
    code: `// .claude/settings.json — 권한 설정 예시
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)"
    ]
  },
  "allowedTools": [
    "Edit",
    "Write",
    "Bash(npm run *)",
    "Bash(git *)"
  ]
}

// 사용자가 Claude에게 다음을 요청:
// "node_modules를 삭제하고 npm install을 다시 실행해줘"
//
// Claude의 실행 계획:
// 1. Bash("rm -rf node_modules")
// 2. Bash("npm install")`,
    question:
      "위 설정에서 Claude가 'rm -rf node_modules'를 실행하려 할 때 어떤 일이 발생하나요?",
    answer:
      "deny 목록에 'Bash(rm -rf *)'가 있으므로 'rm -rf node_modules' 명령은 차단됩니다. 반면 'npm install'은 allowedTools의 'Bash(npm run *)' 패턴과 일치하지 않지만, 'npm install'은 별도 권한 확인을 요청합니다.",
    distractors: [
      "allowedTools에 Bash가 포함되어 있으므로 모든 Bash 명령이 자동 허용됩니다",
      "rm -rf는 위험 명령이지만 node_modules 대상이므로 확인 후 실행 가능합니다",
    ],
  },
  quiz: {
    questions: [
      {
        question:
          "Claude Code 권한 요청을 세션 동안 자동 허용하는 키보드 단축키는?",
        answer: "Shift+Tab",
        distractors: ["Ctrl+Enter", "Alt+A"],
        hints: [
          "Tab 키와 관련이 있습니다",
          "Shift를 함께 누릅니다",
        ],
      },
      {
        question:
          "Claude Code에서 파일 읽기(Read)는 왜 별도 권한 요청 없이 실행되나요?",
        answer:
          "읽기 전용 작업은 시스템을 변경하지 않으므로 안전한 작업으로 분류되어 자동 허용됩니다.",
        distractors: [
          "Read 도구는 기본적으로 allowedTools에 등록되어 있어서 별도 설정이 필요 없습니다",
          "파일 읽기는 사용자가 처음 한 번 승인하면 이후 모든 세션에서 영구 허용됩니다",
        ],
        hints: [
          "'변경'이 없는 작업입니다",
          "안전하다고 판단되는 이유를 생각해보세요",
        ],
      },
    ],
  },
};

// ─── Block 7: Hooks ─── ConceptMatchingTask ───

const block7Hooks: Block = {
  id: "hooks",
  topicId: "hooks",
  title: "Hooks",
  explain: {
    markdown: `## Hooks

Hooks는 Claude Code의 특정 이벤트에 자동으로 실행되는 셸 명령입니다. PreToolUse(도구 사용 전), PostToolUse(도구 사용 후), SessionStart(세션 시작 시) 등의 타이밍에 포매터 실행, 린트 체크, 알림 전송 같은 자동화를 설정할 수 있습니다.

### 핵심 포인트
- **PreToolUse**: 도구 실행 전 (검증, 차단 가능)
- **PostToolUse**: 도구 실행 후 (포매팅, 린트 자동 실행)
- **SessionStart/SessionEnd**: 세션 시작/종료 시 환경 설정`,
    keyPoints: [
      "PreToolUse: 도구 실행 전 (검증, 차단 가능)",
      "PostToolUse: 도구 실행 후 (포매팅, 린트 자동 실행)",
      "SessionStart/SessionEnd: 세션 시작/종료 시 환경 설정",
    ],
  },
  execute: {
    taskType: "concept-matching",
    pairs: [
      {
        left: "PreToolUse",
        right: "도구 실행 전 — 위험 명령 차단, 입력값 검증",
      },
      {
        left: "PostToolUse",
        right: "도구 실행 후 — 코드 포매팅, 린트 자동 실행",
      },
      {
        left: "SessionStart",
        right: "세션 시작 시 — 환경 변수 로드, 상태 초기화",
      },
      {
        left: "SessionEnd",
        right: "세션 종료 시 — 로그 저장, 정리 작업 수행",
      },
      {
        left: "settings.json",
        right: "Hooks 설정을 작성하는 JSON 설정 파일",
      },
    ],
    instructions:
      "왼쪽의 Hook 이벤트(또는 설정 파일)와 오른쪽의 역할/용도를 올바르게 연결하세요.",
  },
  quiz: {
    questions: [
      {
        question:
          "파일 수정 후 자동으로 코드 포매터를 실행하려면 어떤 Hook 이벤트를 사용해야 하나요?",
        answer:
          "PostToolUse 이벤트를 사용합니다. Write나 Edit 도구 사용 후에 트리거됩니다.",
        distractors: [
          "PreToolUse 이벤트를 사용합니다. 도구 실행 전에 포매팅을 준비합니다",
          "OnFileChange 이벤트를 사용합니다. 파일이 변경될 때마다 자동 트리거됩니다",
        ],
        hints: [
          "도구 사용 '후'에 실행되는 이벤트입니다",
          "Post가 붙은 이벤트입니다",
        ],
      },
      {
        question:
          "위험한 명령어를 사전에 차단하려면 어떤 Hook 이벤트를 사용해야 하나요?",
        answer:
          "PreToolUse 이벤트를 사용합니다. 도구 실행 전에 검증하고 차단할 수 있습니다.",
        distractors: [
          "PostToolUse 이벤트에서 실행된 명령을 되돌리는 방식으로 차단합니다",
          "SecurityCheck 이벤트를 사용합니다. 보안 관련 명령을 자동 감지합니다",
        ],
        hints: [
          "도구 사용 '전'에 실행됩니다",
          "Pre가 붙은 이벤트입니다",
        ],
      },
      {
        question: "Hooks 설정은 어디에 작성하나요?",
        answer:
          "settings.json 파일의 hooks 섹션에 작성합니다. 프로젝트별(.claude/settings.json) 또는 글로벌(~/.claude/settings.json)로 설정 가능합니다.",
        distractors: [
          "CLAUDE.md 파일의 hooks 블록에 마크다운 형식으로 작성합니다",
          ".claude/hooks/ 디렉토리에 각 이벤트별 셸 스크립트 파일을 생성합니다",
        ],
        hints: [
          "JSON 설정 파일입니다",
          "settings라는 이름의 파일입니다",
        ],
      },
    ],
  },
};

// ─── Basics Feed Item (from Day 1) ───

export const basicsItem: FeedItem = {
  id: "basics-claude-code-fundamentals",
  date: "2026-04-01",
  category: "basics",
  title: "Claude Code 핵심 기능 마스터",
  description:
    "에이전틱 루프, 도구 사용, 컨텍스트 관리, 슬래시 명령어, 권한 시스템, Hooks까지 — Claude Code의 7가지 핵심 기능을 실습과 퀴즈로 익힙니다.",
  source: "ADHD Sprint 기초 커리큘럼",
  blocks: [
    block1AgenticLoop,
    block2ClaudeMd,
    block3ToolUse,
    block4ContextWindow,
    block5SlashCommands,
    block6Permissions,
    block7Hooks,
  ],
  status: "available",
};
