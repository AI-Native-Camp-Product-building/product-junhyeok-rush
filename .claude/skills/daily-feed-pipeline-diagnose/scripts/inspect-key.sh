#!/usr/bin/env bash
# Inspects an API key from .env.local without exposing the value.
# Usage: inspect-key.sh OPENAI_API_KEY [path-to-env-file]
# Outputs JSON: exists, prefix_class, prefix_sample, length, has_quotes,
#               has_leading_whitespace, has_trailing_whitespace, has_non_ascii

set -euo pipefail

KEY_NAME="${1:?key name required}"
ENV_FILE="${2:-.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  printf '{"key":"%s","exists":false,"error":"env_file_missing","path":"%s"}\n' "$KEY_NAME" "$ENV_FILE"
  exit 0
fi

# Extract value preserving original form (with possible quotes/whitespace)
RAW=$(awk -v k="$KEY_NAME" -F= 'BEGIN{found=0} $1==k {sub("^"k"=", ""); print; found=1; exit} END{if(!found)exit 1}' "$ENV_FILE" 2>/dev/null || true)

if [[ -z "${RAW+x}" ]] || [[ -z "$RAW" ]]; then
  printf '{"key":"%s","exists":false,"error":"key_not_found"}\n' "$KEY_NAME"
  exit 0
fi

# Detect surrounding quotes
HAS_QUOTES=false
STRIPPED="$RAW"
if [[ "$STRIPPED" =~ ^\".*\"$ ]] || [[ "$STRIPPED" =~ ^\'.*\'$ ]]; then
  HAS_QUOTES=true
  STRIPPED="${STRIPPED#\"}"
  STRIPPED="${STRIPPED%\"}"
  STRIPPED="${STRIPPED#\'}"
  STRIPPED="${STRIPPED%\'}"
fi

# Detect whitespace (before trimming)
HAS_LEADING_WS=false
HAS_TRAILING_WS=false
[[ "$STRIPPED" =~ ^[[:space:]] ]] && HAS_LEADING_WS=true
[[ "$STRIPPED" =~ [[:space:]]$ ]] && HAS_TRAILING_WS=true

# Trim for further analysis
TRIMMED=$(printf '%s' "$STRIPPED" | tr -d '[:space:]')
LEN=${#TRIMMED}

# Detect prefix class
PREFIX_CLASS="unknown"
case "$TRIMMED" in
  sk-proj-*)        PREFIX_CLASS="project" ;;
  sk-svcacct-*)     PREFIX_CLASS="service_account" ;;
  sk-None-*)        PREFIX_CLASS="placeholder_invalid" ;;
  sk-admin-*)       PREFIX_CLASS="admin" ;;
  sk-*)             PREFIX_CLASS="legacy_user" ;;
esac

PREFIX_SAMPLE="${TRIMMED:0:7}"

# Detect non-ASCII / non-printable
HAS_NON_ASCII=false
if printf '%s' "$TRIMMED" | LC_ALL=C grep -q '[^[:print:]]'; then
  HAS_NON_ASCII=true
fi

cat <<EOF
{
  "key": "$KEY_NAME",
  "exists": true,
  "prefix_class": "$PREFIX_CLASS",
  "prefix_sample": "$PREFIX_SAMPLE",
  "length": $LEN,
  "has_quotes": $HAS_QUOTES,
  "has_leading_whitespace": $HAS_LEADING_WS,
  "has_trailing_whitespace": $HAS_TRAILING_WS,
  "has_non_ascii": $HAS_NON_ASCII
}
EOF
