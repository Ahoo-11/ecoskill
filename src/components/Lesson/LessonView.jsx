import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { useLessons } from '../../hooks/useLessons.jsx';
import { useAI } from '../../hooks/useAI.jsx';
import { useProfile } from '../../hooks/useProfile.jsx';

// Minimal lesson flow: intro + 3 MCQ questions + summary
export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchById, startLesson, completeLesson } = useLessons();
  const { askTutor } = useAI();
  const { profile } = useProfile();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0); // 0 intro, 1..N questions, N+1 summary
  const [score, setScore] = useState(0);
  const [aiIntro, setAiIntro] = useState('');

  const questions = useMemo(() => {
    const q = lesson?.questions;
    if (Array.isArray(q) && q.length) return q;
    // fallback sample questions
    return [
      { q: 'Which of these reduces waste?', options: ['Single-use plastics', 'Composting', 'Throwing away leftovers', 'Leaving lights on'], answer: 1 },
      { q: 'Best practice to cut energy use?', options: ['Open fridge often', 'LED bulbs', 'Keep AC on all day', 'Windows open with heating'], answer: 1 },
      { q: 'Carbon footprint mainly measures…', options: ['Water use', 'Plastic use', 'Greenhouse gas emissions', 'Paper recycled'], answer: 2 },
    ];
  }, [lesson?.questions]);

  const totalSteps = (questions?.length || 0) + 2; // intro + questions + summary
  const progress = Math.min(Math.round((step / (totalSteps - 1)) * 100), 100);

  useEffect(() => {
    let active = true;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const { lesson: l } = await fetchById(Number(id));
        if (!active) return;
        setLesson(l || { title: 'Sustainability Basics', reward_tokens: 50, reward_xp: 20 });
        await startLesson(Number(id));
        // Generate a short personalized intro using AI
        const pref = profile?.preferences || null;
        const prompt = `Give a 2-sentence personalized intro for the lesson "${(l?.title || 'Sustainability Basics')}" with actionable motivation. ${pref ? `User preferences: ${JSON.stringify(pref)}` : ''}`;
        try {
          const intro = await askTutor(prompt, profile);
          if (active && intro) setAiIntro(String(intro).slice(0, 300));
        } catch (_) {
          // Non-blocking if AI fails
        }
      } catch (e) {
        if (active) setError(e.message || 'Failed to load lesson');
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [id, fetchById, startLesson]);

  async function onFinish() {
    try {
      await completeLesson(Number(id), { reward_tokens: lesson?.reward_tokens || 50, reward_xp: lesson?.reward_xp || 20 });
      navigate('/dashboard');
    } catch (e) {
      // stay on page; show error inline
      setError(e.message || 'Failed to complete');
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl p-6"><div className="rounded-2xl border border-emerald-100 bg-white p-4">Loading lesson…</div></div>;
  }
  if (error) {
    return <div className="mx-auto max-w-2xl p-6"><div className="rounded-2xl border border-red-200 bg-white p-4 text-red-600">{String(error)}</div></div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{lesson?.title || 'Lesson'}</h2>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Exit</Button>
      </div>
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>

      {step === 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-slate-700">Quick lesson on sustainability. Answer a few questions to earn rewards.</p>
          {aiIntro && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-slate-800">
              <p className="text-sm"><strong>AI Tip:</strong> {aiIntro}</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={() => setStep(1)}>Start</Button>
          </div>
        </div>
      )}

      {step > 0 && step <= questions.length && (
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="mb-3 text-slate-800">{questions[step - 1].q}</p>
          <div className="grid gap-2">
            {questions[step - 1].options.map((opt, idx) => (
              <button
                key={idx}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left hover:bg-emerald-100"
                onClick={() => {
                  if (idx === questions[step - 1].answer) setScore((s) => s + 1);
                  setStep((s) => s + 1);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === questions.length + 1 && (
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-slate-800">Nice work! You scored {score}/{questions.length}.</p>
          <p className="text-slate-600">Earn rewards and keep your streak going.</p>
          <div className="mt-4 flex justify-end">
            <Button variant="success" onClick={() => setStep((s) => s + 1)}>Continue</Button>
          </div>
        </div>
      )}

      {step === questions.length + 2 && (
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-slate-800">Rewards ready: +{lesson?.reward_tokens || 50} tokens, +{lesson?.reward_xp || 20} XP.</p>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={onFinish}>Finish</Button>
          </div>
        </div>
      )}
    </div>
  );
}