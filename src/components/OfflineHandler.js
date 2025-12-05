'use client';

import { useState, useEffect } from 'react';

/**
 * OfflineHandler - Detects offline status and preserves form data
 *
 * Shows a banner when user goes offline
 * Automatically hides when connection is restored
 */
export default function OfflineHandler() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Show "back online" message briefly
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Show "back online" message
  if (!isOffline && wasOffline) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#d4edda',
        color: '#155724',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderBottom: '2px solid #c3e6cb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        animation: 'slideDown 0.3s ease-out'
      }}>
        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>✓</span>
        You're back online! Your changes have been preserved.
        <style jsx>{`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show offline banner
  if (isOffline) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#fff3cd',
        color: '#856404',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontWeight: '600',
        borderBottom: '2px solid #ffeaa7',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        animation: 'slideDown 0.3s ease-out'
      }}>
        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>⚠️</span>
        You're currently offline. Your changes will be saved locally and synced when you reconnect.
        <style jsx>{`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

/**
 * useOfflineStorage - Hook for offline-safe form data storage
 *
 * Automatically saves form data to localStorage
 * Returns saved data on component mount
 */
export function useOfflineStorage(key, initialValue = {}) {
  const [data, setData] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`offline_${key}`);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
    setIsLoaded(true);
  }, [key]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(`offline_${key}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving offline data:', error);
      }
    }
  }, [data, key, isLoaded]);

  const clearStorage = () => {
    try {
      localStorage.removeItem(`offline_${key}`);
      setData(initialValue);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  };

  return [data, setData, clearStorage, isLoaded];
}

/**
 * useOnlineStatus - Hook to check online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => setIsOnline(true);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return isOnline;
}
