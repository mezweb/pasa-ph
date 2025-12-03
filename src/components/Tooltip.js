'use client';

import { useState } from 'react';

export default function Tooltip({ text, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)',
      marginBottom: '8px'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      marginTop: '8px'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)',
      marginRight: '8px'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)',
      marginLeft: '8px'
    }
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <span
          style={{
            position: 'absolute',
            ...positions[position],
            background: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {text}
          <span
            style={{
              position: 'absolute',
              ...(position === 'top' && {
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #333'
              }),
              ...(position === 'bottom' && {
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #333'
              }),
              ...(position === 'left' && {
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '6px solid #333'
              }),
              ...(position === 'right' && {
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '6px solid #333'
              })
            }}
          />
        </span>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
