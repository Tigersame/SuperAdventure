import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// For local testing, we'll use standard connectors
// In production, replace with Farcaster MiniKit connector
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected({
      target: 'metaMask', // Specifically target MetaMask to avoid conflicts
    }),
  ],
  ssr: false, // Disable SSR for wallet connections
});

