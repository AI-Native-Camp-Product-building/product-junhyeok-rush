# Nudget API 레퍼런스

## 인증
```
Header: X-API-Key: <your-api-key>
Base URL: https://nudget.app/api
```

## 핵심 엔드포인트 (MVP용)

### GET /digests/today
오늘의 디제스트를 가져온다.

응답:
```typescript
interface DigestResponse {
  id: string;
  userId: string;
  title: string;
  content: string;              // AI 요약 전체 텍스트
  itemCount: number;
  sections: DigestSection[];    // 렌즈/그룹별 섹션
  executiveSummary: string;
  digestMode: 'verbose' | 'compact' | 'links';
  createdAt: string;
  items: DigestContentItem[];   // 개별 콘텐츠 아이템 목록
}

interface DigestSection {
  groupName: string;
  isLens: boolean;
  itemCount: number;
  content: string;
}

interface DigestContentItem {
  // content item + OG metadata + subscription reference
}
```

### GET /subscriptions/{id}/contents
구독별 수집 아이템 (페이지네이션).

Query params: `page`, `limit`, `sort`

### GET /content-items/{id}
개별 아이템 상세.

응답: url, title, AI summary, metadata (OG tags), extractedContent, status

### GET /content-items
필터로 아이템 목록 조회.

Query params: `status` (pending/ready/done/archived/error), `source` (read_later/subscription)

### GET /subscriptions
모든 구독 목록.

## 사용자 설정

### PATCH /user-settings
```json
{
  "digestTime": "HH:mm",
  "digestMode": "verbose",
  "language": "ko",
  "timezone": "Asia/Seoul"
}
```

## 구독 목록 (현재 사용자)

| 채널 | 플랫폼 | 수집 아이템 수 |
|------|--------|-------------|
| @trq212 | X | 42 |
| 까칠한AI | YouTube | 44 |
| 황현태 | LinkedIn | 25 |
| @koylanai | X | 68 |
| @vicnaum | X | 28 |
| @adocomplete | X | 47 |
| @danshipper | X | 212 |
| @ryancarson | X | 115 |
| Jeongmin Lee | LinkedIn | 29 |
| HoYeon Lee | LinkedIn | 12 |
| 정구봉 | LinkedIn | 23 |
| **총계** | | **~645** |

## 제한사항
- Pro plan: 50 구독, 600 AI 요약/월
- 웹훅 없음 — polling 기반
- API rate limit 미문서화
- 공개 콘텐츠만 수집 가능 (로그인 필요 페이지 불가)

## MCP 서버
```json
{
  "mcpServers": {
    "nudget": {
      "type": "http",
      "url": "https://nudget.app/api/mcp",
      "headers": { "X-API-Key": "${NUDGET_API_KEY}" }
    }
  }
}
```
