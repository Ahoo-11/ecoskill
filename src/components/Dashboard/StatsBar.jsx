import { useProfile } from '../../hooks/useProfile.jsx';
import { Button } from '../ui/Button.jsx';

export default function StatsBar() {
  const { profile, awardTokens, incrementStreak, addXp } = useProfile();
  const stats = [
    { label: 'Tokens', value: profile?.tokens ?? 0, emoji: '🪙' },
    { label: 'Streak', value: profile?.streak ?? 0, emoji: '🔥' },
    { label: 'XP', value: profile?.xp ?? 0, emoji: '⭐' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 text-center shadow-soft">
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button variant="success" onClick={() => awardTokens(100)}>+100 Tokens</Button>
        <Button variant="secondary" onClick={() => incrementStreak(1)}>+1 Streak</Button>
        <Button variant="primary" onClick={() => addXp(50)}>+50 XP</Button>
      </div>
    </div>
  );
}