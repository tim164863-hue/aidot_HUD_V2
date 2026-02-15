// Gemini AI Service
// API key sourced from VITE_GEMINI_API_KEY env var - never hardcoded

import { ApiError } from '@/services/api';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Rate limiter for Gemini requests
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1000; // 1 request per second minimum

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now - lastRequestTime < MIN_INTERVAL_MS) return false;
  lastRequestTime = now;
  return true;
}

function validateInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new ApiError('Invalid input: message must be a non-empty string', 400, 'INVALID_INPUT');
  }
  // Trim and limit length
  return input.trim().slice(0, 10000);
}

export const generateSummary = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) return 'API key not configured. Set VITE_GEMINI_API_KEY in .env';
  if (!checkRateLimit()) return 'Rate limited. Please wait a moment.';

  const validated = validateInput(prompt);

  try {
    const res = await fetch(
      `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: validated }] }],
        }),
      }
    );

    if (!res.ok) throw new ApiError('Gemini API error', res.status);

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Error generating summary.';
  }
};

export const chatStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  if (!GEMINI_API_KEY) {
    onChunk('API key not configured. Set VITE_GEMINI_API_KEY in .env');
    return;
  }
  if (!checkRateLimit()) {
    onChunk('Rate limited. Please wait a moment.');
    return;
  }

  const validated = validateInput(message);

  try {
    const res = await fetch(
      `${GEMINI_BASE}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: validated }] }],
        }),
      }
    );

    if (!res.ok) throw new ApiError('Gemini stream error', res.status);
    if (!res.body) {
      onChunk('No stream body received.');
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            fullText += text;
            onChunk(fullText);
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }
  } catch (error) {
    console.error('Gemini Stream Error:', error);
    onChunk('Error during streaming response.');
  }
};
