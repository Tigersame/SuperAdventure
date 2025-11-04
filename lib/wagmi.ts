import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Suppress wallet extension conflict warnings
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Filter out known wallet extension conflicts
    if (
      message.includes('Cannot set property ethereum') ||
      message.includes('TrustedScript') ||
      message.includes('TrustedString') ||
      message.includes('Receiving end does not exist') ||
      message.includes('MetaMask encountered an error')
    ) {
      return; // Silently ignore these extension conflicts
    }
    originalError.apply(console, args);
  };
}

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

