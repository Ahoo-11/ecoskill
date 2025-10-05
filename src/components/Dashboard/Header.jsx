import { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useProfile } from '../../hooks/useProfile.jsx';
import { Flame, User } from 'lucide-react';
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';
import { Button } from '../ui/Button.jsx';

export default function Header() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { account, connect, disconnect, setSource, isConnected } = useWallet();
  const { open, close, onConnected } = useWalletModal();
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Eco Learner';
  const hasVeWorld = typeof window !== 'undefined' && (window.veworld || window.connex);
  const wcEnabled = !!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  const autoConnectTriedRef = useRef(false);
  const connected = Boolean(isConnected || account);

  // Attempt auto-connect once if VeWorld is detected but user is not connected
  useEffect(() => {
    async function tryAutoConnect() {
      if (autoConnectTriedRef.current) return;
      if (!hasVeWorld || connected) return;
      autoConnectTriedRef.current = true;
      try {
        console.debug('[VeChain] Auto-connect: veworld detected, attempting connect');
        setSource('veworld');
        await connect();
        console.debug('[VeChain] Auto-connect: success');
      } catch (err) {
        console.warn('[VeChain] Auto-connect failed:', err);
      }
    }
    tryAutoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVeWorld, connected]);

  async function handleConnect() {
    try {
      console.debug('[VeChain] Connect clicked');
      const hasVeWorld = typeof window !== 'undefined' && (window.veworld || window.connex);
      console.debug('[VeChain] Detected wallet injection:', { hasVeWorld, veworld: !!window.veworld, connex: !!window.connex });

      // Prefer direct connect when extension is detected
      if (hasVeWorld) {
        console.debug('[VeChain] Attempting direct connect via setSource("veworld")');
        try {
          setSource('veworld');
          await connect();
          console.debug('[VeChain] Direct connect succeeded');
          return;
        } catch (err) {
          console.warn('[VeChain] Direct connect failed, falling back to modal:', err);
        }
      }

      // Fallback: open the modal UI (supports wallet-connect as well)
      console.debug('[VeChain] Opening wallet modal');
      onConnected?.(() => {
        console.debug('[VeChain] Modal reported connected, closing modal');
        try { close(); } catch (_) { /* noop */ }
      });
      open();
    } catch (error) {
      console.error('[VeChain] Unexpected connect error:', error);
    }
  }

  async function handleConnectWC() {
    try {
      console.debug('[VeChain] WalletConnect clicked');
      setSource('wallet-connect');
      onConnected?.(() => {
        console.debug('[VeChain] WalletConnect connected, closing modal');
        try { close(); } catch (_) { /* noop */ }
      });
      open();
    } catch (error) {
      console.error('[VeChain] WalletConnect connect error:', error);
    }
  }

  async function handleDisconnect() {
    try {
      console.debug('[VeChain] Disconnect clicked');
      await disconnect();
    } catch (error) {
      console.error('[VeChain] Disconnect error:', error);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white">🌿</span>
        <div>
          <p className="text-sm text-emerald-500">Hi {name}!</p>
          <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700">
          <Flame className="h-5 w-5" />
          <span className="font-semibold">7-day streak</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-emerald-700">
          <span className="text-sm">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Wallet'}</span>
          {connected ? (
            <Button size="sm" variant="secondary" onClick={handleDisconnect}>Disconnect</Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={handleConnect}>Connect Wallet</Button>
              {wcEnabled && (
                <Button size="sm" variant="secondary" onClick={handleConnectWC}>Connect via WalletConnect</Button>
              )}
            </>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white">
          <User className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}