import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { useChallenge } from '../../hooks/useChallenge.jsx';
import { useProfile } from '../../hooks/useProfile.jsx';
import { useAI } from '../../hooks/useAI.jsx';
import { supabase } from '../../lib/supabase.js';

export default function ChallengeSubmit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchById, createSubmission } = useChallenge();
  const { profile, refresh, awardTokens } = useProfile();
  const { verifyImage } = useAI();

  const [challenge, setChallenge] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const c = await fetchById(id);
      setChallenge(c);
    })();
  }, [id, fetchById]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl('');
  };

  async function uploadImage(file) {
    const bucket = 'challenge-proof';
    const path = `${id}/${Date.now()}_${file.name}`;
    const { data, error: err } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      cacheControl: '3600',
    });
    if (err) throw err;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrlData?.publicUrl;
  }

  async function verifyWithAI(imageUrl) {
    const prompt = `You are an objective verifier. Analyze the image and user's note for challenge: "${challenge?.title}". Return STRICT JSON with keys: verified (boolean), confidence (number 0-100), reason (string), reward_tokens (number). No prose.`;
    const reply = await verifyImage(prompt, imageUrl, profile);
    let parsed = null;
    try {
      parsed = JSON.parse((reply || '').trim());
    } catch (_) {
      // fallback parse if model did not return JSON
      const confidenceMatch = /confidence\s*[:=-]\s*(\d{1,3})/i.exec(reply || '');
      parsed = {
        verified: (confidenceMatch ? Number(confidenceMatch[1]) : 80) >= 75,
        confidence: confidenceMatch ? Number(confidenceMatch[1]) : 80,
        reason: (reply || 'AI verified').slice(0, 200),
        reward_tokens: challenge?.reward_tokens || null,
      };
    }
    // Ensure reward tokens present when verified
    if (parsed?.verified && !parsed.reward_tokens && challenge?.reward_tokens) {
      parsed.reward_tokens = challenge.reward_tokens;
    }
    return parsed;
  }

  async function onSubmit() {
    try {
      setLoading(true);
      setError('');
      if (!imageFile) throw new Error('Please select an image');
      const imageUrl = await uploadImage(imageFile);
      const aiResult = await verifyWithAI(imageUrl);
      const submission = await createSubmission({ challengeId: id, imageUrl, note, aiResult });
      // If verified, award tokens locally for immediate feedback
      if (aiResult?.verified && aiResult?.reward_tokens) {
        try { await awardTokens(Number(aiResult.reward_tokens)); } catch (_) {}
      }
      // Refresh profile to reflect any server-side changes
      await refresh();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Submit Challenge</h1>
      {challenge && (
        <p className="mt-1 text-slate-700">{challenge.title} — Reward: {challenge.reward_tokens} tokens</p>
      )}
      {error && <p className="mt-3 text-red-600">{error}</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-slate-800 mb-2">Upload Photo</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>
        {previewUrl && (
          <div className="mt-2">
            <img src={previewUrl} alt="Preview" className="rounded-lg shadow-soft max-h-64" />
          </div>
        )}
        <div>
          <label className="block text-slate-800 mb-2">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3"
            rows={3}
            placeholder="Describe your action"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/dashboard')} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit} disabled={loading || !imageFile}>
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </div>
      </div>
    </div>
  );
}