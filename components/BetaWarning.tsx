'use client';

import { useState, useEffect } from 'react';

export function BetaWarning() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the warning
    const dismissed = localStorage.getItem('beta-warning-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('beta-warning-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="beta-warning">
      <div className="beta-warning-content">
        <div className="beta-warning-icon">⚠️</div>
        <div className="beta-warning-text">
          <strong>Beta Version</strong>
          <span>Farcaster MiniAdv is currently in beta. Features may change and bugs may occur. Play at your own risk!</span>
        </div>
        <button onClick={handleDismiss} className="beta-warning-close">
          ✕
        </button>
      </div>
    </div>
  );
}

