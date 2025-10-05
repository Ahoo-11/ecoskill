import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useProfile } from '../../hooks/useProfile.jsx';
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';
import { useNavigate } from 'react-router-dom';
import { useChallenge } from '../../hooks/useChallenge.jsx';

export default function GettingStarted() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { account, connect, setSource } = useWallet();
  const { open, close, onConnected } = useWalletModal();
  const { challenge } = useChallenge();

  async function handleConnect() {
    const hasVeWorld = typeof window !== 'undefined' && (window.veworld || window.connex);
    try {
      if (hasVeWorld) {
        setSource('veworld');
        await connect();
        return;
      }
      onConnected?.(() => { try { close(); } catch (_) {} });
      open();
    } catch (err) {
      console.warn('[GettingStarted] connect failed', err);
      try { open(); } catch (_) {}
    }
  }

  const steps = [
    {
      id: 1,
      title: 'Connect your wallet',
      desc: 'Link VeWorld or WalletConnect to earn tokens for actions.',
      action: handleConnect,
      cta: account ? 'Wallet Connected' : 'Connect Wallet',
      disabled: !!account,
    },
    {
      id: 2,
      title: 'Complete today’s challenge',
      desc: 'Upload a proof photo and let AI verify your action.',
      action: () => navigate(challenge ? `/challenge/${challenge.id}/submit` : '/dashboard'),
      cta: 'Go to Challenge',
      disabled: false,
    },
    {
      id: 3,
      title: 'Track progress & redeem rewards',
      desc: 'See tokens, streak, and XP. Unlock badges as you learn.',
      action: () => navigate('/dashboard'),
      cta: 'View Stats',
      disabled: false,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">Getting Started</h3>
      <p className="text-slate-700">Welcome {user?.email || 'Eco Learner'}! Follow these steps to start earning tokens and XP.</p>
      <ul className="mt-4 space-y-3">
        {steps.map((s) => (
          <li key={s.id} className="flex items-start justify-between rounded-xl border border-emerald-100 p-3">
            <div>
              <p className="font-medium text-slate-800">{s.title}</p>
              <p className="text-sm text-slate-600">{s.desc}</p>
            </div>
            <Button variant={s.disabled ? 'secondary' : 'success'} disabled={s.disabled} onClick={s.action}>
              {s.cta}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}