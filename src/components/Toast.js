'use client';

import { useEffect, useState } from 'react';

/**
 * Toast notification component for success, error, warning, and info messages
 *
 * Props:
 * - type: 'success', 'error', 'warning', 'info'
 * - message: The message to display
 * - duration: Duration in ms before auto-dismiss (default: 3000)
 * - onClose: Callback when toast is closed
 * - position: 'top-right', 'top-center', 'bottom-right', 'bottom-center' (default: 'top-right')
 */
export default function Toast({
  type = 'success',
  message,
  duration = 3000,
  onClose,
  position = 'top-right'
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  if (!isVisible) return null;

  const toastConfigs = {
    success: {
      icon: '✓',
      bgColor: '#d4edda',
      borderColor: '#c3e6cb',
      textColor: '#155724',
      iconBg: '#28a745'
    },
    error: {
      icon: '✕',
      bgColor: '#f8d7da',
      borderColor: '#f5c6cb',
      textColor: '#721c24',
      iconBg: '#dc3545'
    },
    warning: {
      icon: '⚠',
      bgColor: '#fff3cd',
      borderColor: '#ffeaa7',
      textColor: '#856404',
      iconBg: '#ffc107'
    },
    info: {
      icon: 'ℹ',
      bgColor: '#d1ecf1',
      borderColor: '#bee5eb',
      textColor: '#0c5460',
      iconBg: '#17a2b8'
    }
  };

  const config = toastConfigs[type] || toastConfigs.success;

  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 9999,
        animation: isExiting ? 'slideOut 0.3s ease-out forwards' : 'slideIn 0.3s ease-out',
        minWidth: '300px',
        maxWidth: '500px'
      }}
    >
      <div style={{
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative'
      }}>
        {/* Icon */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: config.iconBg,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {config.icon}
        </div>

        {/* Message */}
        <div style={{
          flex: 1,
          color: config.textColor,
          fontSize: '0.95rem',
          fontWeight: '600',
          lineHeight: '1.4'
        }}>
          {message}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: config.textColor,
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            flexShrink: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ×
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * ToastContainer - Manages multiple toasts
 */
export function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
      {toasts.map((toast, index) => (
        <div key={toast.id || index} style={{ marginTop: index > 0 ? '10px' : '0' }}>
          <Toast
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            position={toast.position}
            onClose={() => onRemove && onRemove(toast.id || index)}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * useToast hook for easy toast management
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000, position = 'top-right') => {
    const id = Date.now();
    const newToast = { id, message, type, duration, position };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration + 300); // Add 300ms for exit animation
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
    success: (message, duration, position) => showToast(message, 'success', duration, position),
    error: (message, duration, position) => showToast(message, 'error', duration, position),
    warning: (message, duration, position) => showToast(message, 'warning', duration, position),
    info: (message, duration, position) => showToast(message, 'info', duration, position)
  };
}
