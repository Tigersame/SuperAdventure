// Suppress wallet extension conflict warnings
// These are harmless browser extension conflicts, not app errors

if (typeof window !== 'undefined') {
  // Suppress console errors from wallet extensions
  const originalError = console.error;
  const originalWarn = console.warn;

  const shouldSuppress = (message: string): boolean => {
    const suppressedMessages = [
      'Cannot set property ethereum',
      'TrustedScript',
      'TrustedString',
      'Receiving end does not exist',
      'MetaMask encountered an error',
      'Port connected',
      'Could not establish connection',
    ];

    return suppressedMessages.some((msg) => message.includes(msg));
  };

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (!shouldSuppress(message)) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, args);
    }
  };

  // Handle unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    if (
      message.includes('Receiving end does not exist') ||
      message.includes('Could not establish connection')
    ) {
      event.preventDefault(); // Suppress these extension errors
    }
  });
}

