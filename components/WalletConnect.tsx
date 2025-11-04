'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatAddress } from '../lib/utils';

export function WalletConnect() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="wallet-info">
        <div className="wallet-address">
          <span className="connected-dot"></span>
          {formatAddress(address)}
        </div>
        <button onClick={() => disconnect()} className="disconnect-btn">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="connect-btn"
    >
      Connect Base Wallet
    </button>
  );
}

