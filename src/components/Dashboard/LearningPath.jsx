import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { useLessons } from '../../hooks/useLessons.jsx';

export default function LearningPath() {
  const navigate = useNavigate();
  const { lessons, loading, error } = useLessons();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">Your Learning Path</h3>
      {loading && (
        <div className="text-sm text-slate-500">Loading lessons…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{String(error.message || error)}</div>
      )}
      <ul className="space-y-3">
        {(lessons || []).map((l) => (
          <li key={l.id} className="flex items-center justify-between rounded-xl border border-emerald-100 p-3">
            <span className="font-medium text-slate-800">{l.title}</span>
            <div className="flex items-center gap-2">
              <span className={
                l.status === 'completed'
                  ? 'text-emerald-600'
                  : l.status === 'active'
                  ? 'text-yellow-600'
                  : 'text-slate-500'
              }>
                {l.status}
              </span>
              {l.status === 'active' ? (
                <Button variant="primary" size="sm" onClick={() => navigate(`/lesson/${l.id}`)}>Start</Button>
              ) : (
                <Button variant="secondary" size="sm" disabled>
                  {l.status === 'completed' ? 'Done' : 'Locked'}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}