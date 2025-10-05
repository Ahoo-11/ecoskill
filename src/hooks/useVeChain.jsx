import { useWallet } from '@vechain/dapp-kit-react';

export function useVeChain() {
  const wallet = useWallet();

  const isVeWorldInstalled =
    typeof window !== 'undefined' && (!!window.veworld || !!window.connex);

  return { wallet, isVeWorldInstalled };
}