const BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini';

export async function chatCompletions({ messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens }) {
  if (!API_KEY) {
    throw new Error('Missing VITE_OPENROUTER_API_KEY environment variable');
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      // Optional but recommended headers per OpenRouter best practices
      'HTTP-Referer': window.location.origin,
      'X-Title': 'EcoSkill',
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const choice = data?.choices?.[0]?.message?.content || '';
  return { content: choice, raw: data };
}