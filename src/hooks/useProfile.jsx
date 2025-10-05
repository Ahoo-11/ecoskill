import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.jsx';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('ecoskill_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;

        if (!data) {
          // Attempt to create a default row for this user (requires RLS policy)
          const defaults = {
            id: user.id,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: null,
            tokens: 0,
            streak: 0,
            xp: 0,
          };
          const { data: inserted, error: insertErr } = await supabase
            .from('ecoskill_profiles')
            .insert(defaults)
            .select('*')
            .maybeSingle();
          if (insertErr) {
            // If insert fails due to RLS, just proceed without creating
            if (active) {
              setProfile(null);
            }
          } else if (active) {
            setProfile(inserted);
          }
        } else if (active) {
          setProfile(data);
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load profile');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      active = false;
    };
  }, [user]);

  async function refresh() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('ecoskill_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      setProfile(data || null);
    } catch (err) {
      setError(err.message || 'Failed to refresh profile');
    } finally {
      setLoading(false);
    }
  }

  async function updateFields(fields) {
    if (!user) return null;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('ecoskill_profiles')
        .update(fields)
        .eq('id', user.id)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function awardTokens(amount = 0) {
    const amt = Number(amount) || 0;
    const next = (profile?.tokens || 0) + amt;
    return updateFields({ tokens: next });
  }

  async function incrementStreak(by = 1) {
    const inc = Number(by) || 0;
    const next = (profile?.streak || 0) + inc;
    return updateFields({ streak: next });
  }

  async function addXp(by = 0) {
    const inc = Number(by) || 0;
    const next = (profile?.xp || 0) + inc;
    return updateFields({ xp: next });
  }

  return useMemo(
    () => ({ profile, loading, error, refresh, updateFields, awardTokens, incrementStreak, addXp }),
    [profile, loading, error]
  );
}