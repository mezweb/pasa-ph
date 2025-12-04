'use client';

import { useState, useEffect } from 'react';

export default function ScamWarningTooltip() {
  const [showWarning, setShowWarning] = useState(false);
  const [currentWarning, setCurrentWarning] = useState(0);

  const warnings = [
    {
      icon: '⚠️',
      title: 'Stay on Platform',
      message: 'Never communicate outside Pasa.ph. All transactions must go through our secure platform.',
      color: '#ff6b6b'
    },
    {
      icon: '💳',
      title: 'No Direct Payments',
      message: 'Never accept direct payments outside Pasa.ph. Always use our escrow system for protection.',
      color: '#f39c12'
    },
    {
      icon: '🚫',
      title: 'Verify IDs',
      message: 'Only work with verified users. Check for verification badges before accepting requests.',
      color: '#e91e63'
    },
    {
      icon: '📱',
      title: 'Report Suspicious Activity',
      message: 'If someone asks you to go off-platform or seems suspicious, report them immediately.',
      color: '#9c27b0'
    }
  ];

  useEffect(() => {
    // Show first warning after 30 seconds
    const initialTimer = setTimeout(() => {
      setShowWarning(true);
    }, 30000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (showWarning) {
      // Rotate warnings every 5 minutes
      const rotationTimer = setInterval(() => {
        setCurrentWarning((prev) => (prev + 1) % warnings.length);
      }, 300000);

      // Auto-hide after 15 seconds
      const hideTimer = setTimeout(() => {
        setShowWarning(false);
      }, 15000);

      return () => {
        clearInterval(rotationTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showWarning, warnings.length]);

  if (!showWarning) return null;

  const warning = warnings[currentWarning];

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      maxWidth: '350px',
      background: 'white',
      border: `3px solid ${warning.color}`,
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      zIndex: 9999,
      animation: 'slideInRight 0.5s ease-out'
    }}>
      {/* Header */}
      <div style={{
        background: warning.color,
        color: 'white',
        padding: '15px',
        borderRadius: '9px 9px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>{warning.icon}</span>
          <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {warning.title}
          </span>
        </div>

        <button
          onClick={() => setShowWarning(false)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: '15px',
        fontSize: '0.9rem',
        color: '#333',
        lineHeight: '1.6'
      }}>
        {warning.message}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 15px',
        background: '#f9f9f9',
        borderRadius: '0 0 9px 9px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #eee'
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: '#999'
        }}>
          Safety tip {currentWarning + 1} of {warnings.length}
        </span>

        <button
          onClick={() => {
            // Link to safety guidelines
            window.open('/trust-and-safety', '_blank');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: warning.color,
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Learn More →
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
