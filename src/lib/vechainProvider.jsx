import PropTypes from 'prop-types';
import { DAppKitProvider } from '@vechain/dapp-kit-react';

export default function VeChainProvider({ children }) {
  // DAppKit expects `node` prop; infer genesis from URL when not provided
  const nodeUrl = import.meta.env.VITE_VECHAIN_NODE_URL || 'https://mainnet.vechain.org/';
  const inferredGenesis = nodeUrl.includes('testnet') ? 'test' : 'main';
  const genesis = import.meta.env.VITE_VECHAIN_GENESIS || inferredGenesis;
  const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

  const walletConnectOptions = walletConnectProjectId
    ? {
        projectId: walletConnectProjectId,
        metadata: {
          name: 'EcoSkill',
          description: 'EcoSkill dApp',
          url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
          icons: [typeof window !== 'undefined' ? `${window.location.origin}/vite.svg` : ''],
        },
      }
    : undefined;

  const allowedWallets = walletConnectOptions ? ['veworld', 'wallet-connect'] : ['veworld'];

  return (
    <DAppKitProvider
      node={nodeUrl}
      genesis={genesis}
      usePersistence={true}
      allowedWallets={allowedWallets}
      walletConnectOptions={walletConnectOptions}
      logLevel="DEBUG"
    >
      {children}
    </DAppKitProvider>
  );
}

VeChainProvider.propTypes = {
  children: PropTypes.node,
};