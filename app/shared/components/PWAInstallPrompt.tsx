'use client';

import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      backgroundColor: '#090809',
      color: '#fff',
      padding: '1rem',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      maxWidth: 300
    }}>
      <p style={{ margin: '0 0 1rem 0', fontSize: 14 }}>Install D&D Maker app for quick access!</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleInstall} style={{
          flex: 1,
          padding: '0.5rem 1rem',
          backgroundColor: '#E40712',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600
        }}>
          Install
        </button>
        <button onClick={handleDismiss} style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: '#E6E6E6',
          border: '1px solid #E6E6E6',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 14
        }}>
          Dismiss
        </button>
      </div>
    </div>
  );
}