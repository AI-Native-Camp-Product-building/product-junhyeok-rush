#!/usr/bin/env bash
# Probes OpenAI API directly with the key from .env.local.
# Reports HTTP status + error code/message excerpt without leaking the key.
# Usage: probe-openai.sh [model] [path-to-env-file]

set -euo pipefail

MODEL="${1:-gpt-4o-mini}"
ENV_FILE="${2:-.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  printf '{"error":"env_file_missing","path":"%s"}\n' "$ENV_FILE"
  exit 1
fi

# Extract OPENAI_API_KEY without printing it.
KEY=$(awk -F= '/^OPENAI_API_KEY=/ {sub(/^OPENAI_API_KEY=/, ""); gsub(/^["\047]|["\047]$/, ""); print; exit}' "$ENV_FILE" | tr -d '[:space:]')

if [[ -z "$KEY" ]]; then
  printf '{"error":"key_empty_or_missing"}\n'
  exit 1
fi

TMP_MODELS=$(mktemp -t openai-probe-models.XXXXXX)
TMP_CHAT=$(mktemp -t openai-probe-chat.XXXXXX)
trap 'rm -f "$TMP_MODELS" "$TMP_CHAT"' EXIT

# Probe 1: lightweight auth check
MODELS_HTTP=$(curl -sS -o "$TMP_MODELS" -w "%{http_code}" \
  --max-time 15 \
  https://api.openai.com/v1/models \
  -H "Authorization: Bearer $KEY" \
  || echo "000")

# Probe 2: actual model used by the app
CHAT_HTTP=$(curl -sS -o "$TMP_CHAT" -w "%{http_code}" \
  --max-time 30 \
  https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}],\"max_tokens\":1}" \
  || echo "000")

extract_field() {
  local file="$1" field="$2"
  if command -v jq &>/dev/null; then
    jq -r ".error.${field} // \"none\"" "$file" 2>/dev/null || echo "parse_failed"
  else
    grep -o "\"${field}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" "$file" 2>/dev/null \
      | head -1 | sed -E 's/.*:[[:space:]]*"([^"]*)".*/\1/' || echo "none"
  fi
}

excerpt() {
  local s="$1"
  printf '%s' "$s" | head -c 200 | tr '\n' ' ' | sed 's/"/\\"/g'
}

MODELS_CODE=$(extract_field "$TMP_MODELS" "code")
MODELS_TYPE=$(extract_field "$TMP_MODELS" "type")
MODELS_MSG=$(extract_field "$TMP_MODELS" "message")
CHAT_CODE=$(extract_field "$TMP_CHAT" "code")
CHAT_TYPE=$(extract_field "$TMP_CHAT" "type")
CHAT_MSG=$(extract_field "$TMP_CHAT" "message")

cat <<EOF
{
  "models_endpoint": {
    "status": $MODELS_HTTP,
    "error_code": "$MODELS_CODE",
    "error_type": "$MODELS_TYPE",
    "message_excerpt": "$(excerpt "$MODELS_MSG")"
  },
  "chat_endpoint": {
    "model": "$MODEL",
    "status": $CHAT_HTTP,
    "error_code": "$CHAT_CODE",
    "error_type": "$CHAT_TYPE",
    "message_excerpt": "$(excerpt "$CHAT_MSG")"
  }
}
EOF
