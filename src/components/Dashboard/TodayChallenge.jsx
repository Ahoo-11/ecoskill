import { Button } from '../ui/Button.jsx';
import { useChallenge } from '../../hooks/useChallenge.jsx';
import { useNavigate } from 'react-router-dom';

export default function TodayChallenge() {
  const navigate = useNavigate();
  const { challenge, loading, error } = useChallenge();

  const title = challenge?.title || 'Today’s Challenge';
  const description = challenge?.description || 'No challenge available yet.';
  const reward = challenge?.reward_tokens;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {loading ? (
            <p className="mt-1 text-slate-700">Loading...</p>
          ) : error ? (
            <p className="mt-1 text-red-600">{String(error.message || error)}</p>
          ) : (
            <>
              <p className="mt-1 text-slate-700">{description}</p>
              {reward != null && <p className="mt-2 text-emerald-700">Reward: +{reward} tokens</p>}
            </>
          )}
        </div>
        <Button
          variant="success"
          disabled={!challenge || loading}
          onClick={() => navigate(challenge ? `/challenge/${challenge.id}/submit` : '/dashboard')}
        >
          {challenge ? 'Complete Now' : 'Refresh Later'}
        </Button>
      </div>
    </div>
  );
}