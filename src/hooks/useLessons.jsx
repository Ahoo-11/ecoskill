import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.jsx';
import { useProfile } from './useProfile.jsx';

// Lessons data access and simple progress management
export function useLessons() {
  const { user } = useAuth();
  const { addXp, awardTokens } = useProfile();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: lessonRows, error: lessonsErr }, { data: progressRows, error: progressErr }] = await Promise.all([
        supabase.from('ecoskill_lessons').select('*').order('id', { ascending: true }),
        user?.id
          ? supabase.from('ecoskill_lesson_progress').select('*').eq('user_id', user.id)
          : Promise.resolve({ data: [], error: null })
      ]);
      if (lessonsErr) throw lessonsErr;
      if (progressErr) throw progressErr;

      const sampleLessons = [
        { id: 1, title: 'Intro to Sustainability', reward_tokens: 50, reward_xp: 20 },
        { id: 2, title: 'Waste Reduction Basics', reward_tokens: 50, reward_xp: 20 },
        { id: 3, title: 'Carbon Footprint 101', reward_tokens: 50, reward_xp: 20 },
      ];
      const rows = Array.isArray(lessonRows) && lessonRows.length ? lessonRows : sampleLessons;
      const progressMap = new Map((progressRows || []).map((p) => [p.lesson_id, p]));
      const combined = (rows || []).map((l, idx) => {
        const progress = progressMap.get(l.id);
        // simple status heuristic: completed if progress says so; otherwise first lesson active, others locked
        const status = progress?.status || (idx === 0 ? 'active' : 'locked');
        return { ...l, progress, status };
      });
      setLessons(combined);
      return combined;
    } catch (e) {
      setError(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: lesson, error: lErr }, { data: progress, error: pErr }] = await Promise.all([
        supabase.from('ecoskill_lessons').select('*').eq('id', id).maybeSingle(),
        user?.id
          ? supabase
              .from('ecoskill_lesson_progress')
              .select('*')
              .eq('user_id', user.id)
              .eq('lesson_id', id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null })
      ]);
      if (lErr) throw lErr;
      if (pErr) throw pErr;
      const sample = { id, title: 'Sustainability Basics', reward_tokens: 50, reward_xp: 20, questions: null };
      return { lesson: lesson || sample, progress };
    } catch (e) {
      setError(e);
      const sample = { id, title: 'Sustainability Basics', reward_tokens: 50, reward_xp: 20, questions: null };
      return { lesson: sample, progress: null };
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const startLesson = useCallback(async (id) => {
    if (!user?.id) throw new Error('Not authenticated');
    const payload = { user_id: user.id, lesson_id: id, status: 'active', current_index: 0 };
    const { data, error: err } = await supabase
      .from('ecoskill_lesson_progress')
      .upsert(payload, { onConflict: 'user_id,lesson_id' })
      .select('*')
      .maybeSingle();
    if (err) throw err;
    return data;
  }, [user?.id]);

  const completeLesson = useCallback(async (id, rewards) => {
    if (!user?.id) throw new Error('Not authenticated');
    const earnedXp = Number(rewards?.reward_xp || 0);
    const earnedTokens = Number(rewards?.reward_tokens || 0);
    const payload = {
      user_id: user.id,
      lesson_id: id,
      status: 'completed',
      earned_xp: earnedXp,
      earned_tokens: earnedTokens,
      current_index: null,
    };
    const { data, error: err } = await supabase
      .from('ecoskill_lesson_progress')
      .upsert(payload, { onConflict: 'user_id,lesson_id' })
      .select('*')
      .maybeSingle();
    if (err) throw err;
    // Award locally to profile (optimistic)
    if (earnedXp) await addXp(earnedXp);
    if (earnedTokens) await awardTokens(earnedTokens);
    return data;
  }, [user?.id, addXp, awardTokens]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return useMemo(
    () => ({ lessons, loading, error, fetchAll, fetchById, startLesson, completeLesson }),
    [lessons, loading, error, fetchAll, fetchById, startLesson, completeLesson]
  );
}