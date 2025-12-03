'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function RoleToggle() {
  const { viewMode, setViewMode } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    const newMode = viewMode === 'buyer' ? 'seller' : 'buyer';
    setViewMode(newMode);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px',
      background: '#f0f0f0',
      borderRadius: '25px',
      cursor: 'pointer',
      userSelect: 'none'
    }}
    onClick={handleToggle}
    >
      <div style={{
        position: 'relative',
        width: '140px',
        height: '32px',
        background: viewMode === 'buyer' ? '#e3f2fd' : '#fff3e0',
        borderRadius: '20px',
        transition: 'background 0.3s ease'
      }}>
        {/* Slider */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: viewMode === 'buyer' ? '2px' : 'calc(50%)',
          width: 'calc(50% - 2px)',
          height: 'calc(100% - 4px)',
          background: viewMode === 'buyer' ? '#0070f3' : '#ff9800',
          borderRadius: '18px',
          transition: 'left 0.3s ease, background 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />

        {/* Labels */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          pointerEvents: 'none'
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: viewMode === 'buyer' ? 'white' : '#666',
            transition: 'color 0.3s ease',
            zIndex: 1
          }}>
            🛒 Buyer
          </span>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: viewMode === 'seller' ? 'white' : '#666',
            transition: 'color 0.3s ease',
            zIndex: 1
          }}>
            ✈️ Traveler
          </span>
        </div>
      </div>
    </div>
  );
}
