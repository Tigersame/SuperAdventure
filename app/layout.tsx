'use client';

import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../lib/wagmi';
import { ErrorBoundary } from './error-boundary';
import './globals.css';
import Script from 'next/script';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <html lang="en">
      <head>
        <Script
          id="suppress-wallet-errors"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                const originalError = console.error;
                const originalWarn = console.warn;
                const suppressed = [
                  'Cannot set property ethereum',
                  'TrustedScript',
                  'TrustedString',
                  'Receiving end does not exist',
                  'MetaMask encountered an error',
                  'Port connected',
                  'Could not establish connection'
                ];
                const shouldSuppress = (msg) => suppressed.some(s => (msg || '').includes(s));
                console.error = function(...args) {
                  if (!shouldSuppress(args[0]?.toString())) originalError.apply(console, args);
                };
                console.warn = function(...args) {
                  if (!shouldSuppress(args[0]?.toString())) originalWarn.apply(console, args);
                };
                window.addEventListener('unhandledrejection', (e) => {
                  const msg = e.reason?.message || e.reason?.toString() || '';
                  if (shouldSuppress(msg)) e.preventDefault();
                });
              })();
            `,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </WagmiProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

