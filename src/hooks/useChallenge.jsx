import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.jsx';

// Challenge data access: fetch active challenge and create submissions
export function useChallenge() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ecoskill_challenges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (err) throw err;
      setChallenge(data || null);
      return data || null;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ecoskill_challenges')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (err) throw err;
      return data || null;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubmission = useCallback(async ({ challengeId, imageUrl, note, aiResult }) => {
    if (!user?.id) throw new Error('Not authenticated');
    const payload = {
      user_id: user.id,
      challenge_id: challengeId,
      image_url: imageUrl,
      note: note || null,
      status: aiResult?.verified ? 'verified' : aiResult?.confidence >= 70 ? 'pending' : 'rejected',
      confidence: aiResult?.confidence ?? null,
      reason: aiResult?.reason ?? null,
      tokens_awarded: aiResult?.verified ? (aiResult?.reward_tokens || null) : null,
    };
    const { data, error: err } = await supabase
      .from('ecoskill_submissions')
      .insert(payload)
      .select('*')
      .single();
    if (err) throw err;
    return data;
  }, [user?.id]);

  useEffect(() => {
    // auto-load today's challenge on mount
    fetchToday();
  }, [fetchToday]);

  return { challenge, loading, error, fetchToday, fetchById, createSubmission };
}