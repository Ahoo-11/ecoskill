import { useState } from 'react';
import { chatCompletions } from '../lib/openrouter.js';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function askTutor(userMessage, userProfile) {
    setLoading(true);
    setError(null);
    try {
      const systemPrompt = `You are an expert sustainability tutor. User profile: ${JSON.stringify(
        userProfile || {}
      )} Provide personalized, actionable advice. Keep responses under 100 words. Be encouraging and positive.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: String(userMessage || '') },
      ];

      const { content } = await chatCompletions({ messages });
      return content;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function verifyImage(prompt, imageUrl, userProfile) {
    setLoading(true);
    setError(null);
    try {
      const systemPrompt = `You are a sustainability verification assistant. Profile: ${JSON.stringify(
        userProfile || {}
      )} Analyze provided description and image context.`;
      // Note: openrouter chatCompletions currently uses text; we include image URL context in text.
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${prompt}\nImage URL: ${imageUrl}` },
      ];
      const { content } = await chatCompletions({ messages });
      return content;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { askTutor, verifyImage, loading, error };
}