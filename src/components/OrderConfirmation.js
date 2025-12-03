'use client';

import { useEffect, useState } from 'react';

export default function OrderConfirmation({ orderId, show, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        padding: '20px'
      }}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Animation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-20px',
                fontSize: `${20 + Math.random() * 20}px`,
                animation: `confetti ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                opacity: 0
              }}
            >
              {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '20px',
            animation: 'bounce 0.6s ease-out'
          }}>
            🎉
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#0070f3'
          }}>
            Salamat! Order Received! 🇵🇭
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '10px'
          }}>
            Your order is confirmed and ready to fly to you!
          </p>

          <div style={{
            background: '#f0f7ff',
            padding: '15px',
            borderRadius: '10px',
            marginTop: '20px',
            marginBottom: '25px'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
              Order Number
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#0070f3',
              fontFamily: 'monospace'
            }}>
              #{orderId}
            </div>
          </div>

          <div style={{
            fontSize: '0.95rem',
            color: '#888',
            lineHeight: '1.6',
            marginBottom: '25px'
          }}>
            ✈️ Your traveler will bring your item soon!<br />
            📧 Check your email for tracking updates
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            style={{
              background: '#0070f3',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              minHeight: '44px',
              width: '100%'
            }}
          >
            Track My Order
          </button>
        </div>

        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(500px) rotate(720deg);
              opacity: 0;
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
