// Deep redaction utility for stripping sensitive data

const SENSITIVE_KEYS = new Set([
  'apikey', 'api_key', 'bottoken', 'bot_token', 'token',
  'password', 'secret', 'auth_token', 'authtoken',
  'private_key', 'privatekey', 'access_token', 'accesstoken',
  'refresh_token', 'refreshtoken', 'client_secret', 'clientsecret',
]);

// Patterns that look like secrets in string values
const SECRET_PATTERNS = [
  /^sk-[a-zA-Z0-9]{20,}$/,           // OpenAI-style
  /^nvapi-[a-zA-Z0-9_-]{20,}$/,      // NVIDIA API keys
  /^ghp_[a-zA-Z0-9]{20,}$/,          // GitHub PAT
  /^gho_[a-zA-Z0-9]{20,}$/,          // GitHub OAuth
  /^xox[bpsa]-[a-zA-Z0-9-]{20,}$/,   // Slack tokens
  /^[0-9]+:AA[A-Za-z0-9_-]{30,}$/,   // Telegram bot tokens
  /^BSA[a-zA-Z0-9]{20,}$/,           // Brave Search API
  /^[a-f0-9]{40,}$/,                 // Generic hex tokens (40+ chars)
  /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,  // JWT tokens
];

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[.\-_]/g, '');
  return SENSITIVE_KEYS.has(normalized);
}

function looksLikeSecret(value: string): boolean {
  if (typeof value !== 'string' || value.length < 16) return false;
  return SECRET_PATTERNS.some(p => p.test(value));
}

export function redact(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return looksLikeSecret(obj) ? '[REDACTED]' : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redact(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (isSensitiveKey(key)) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'string' && looksLikeSecret(value)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redact(value);
      }
    }
    return result;
  }

  return obj;
}

/** Redact secrets from a plain text string (for transcript content) */
export function redactString(text: string): string {
  if (typeof text !== 'string') return text;
  let result = text;
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(new RegExp(pattern.source, 'g'), '[REDACTED]');
  }
  return result;
}
