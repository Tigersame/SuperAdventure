'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatAddress } from '../lib/utils';

export function WalletConnect() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasWallet, setHasWallet] = useState(false);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      console.warn('Wallet connection error:', error);
    }
  }, [error]);

  useEffect(() => {
    // Check if wallet is available
    if (typeof window !== 'undefined') {
      try {
        setHasWallet(
          typeof window.ethereum !== 'undefined' ||
          connectors.some((connector) => connector.ready)
        );
      } catch (err) {
        // Ignore extension conflicts
        setHasWallet(false);
      }
    }
  }, [connectors]);

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

  if (!hasWallet) {
    return (
      <div className="wallet-info">
        <span className="wallet-unavailable">No wallet detected</span>
      </div>
    );
  }

  return (
    <div className="wallet-connect-wrapper">
      <button
        onClick={() => {
          if (connectors.length > 0) {
            try {
              connect({ connector: connectors[0] });
            } catch (err) {
              console.warn('Connection attempt failed:', err);
            }
          }
        }}
        disabled={isPending || connectors.length === 0}
        className="connect-btn"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <div className="wallet-error">
          Connection failed. Try refreshing or check wallet extension.
        </div>
      )}
    </div>
  );
}

