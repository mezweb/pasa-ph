'use client';

import { useState, useEffect } from 'react';

export default function ExchangeRateTicker() {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    // Mock exchange rates (in production, use real API like exchangerate-api.com)
    const mockRates = [
      { from: 'USD', to: 'PHP', rate: 56.50, change: '+0.15' },
      { from: 'JPY', to: 'PHP', rate: 0.38, change: '-0.02' },
      { from: 'EUR', to: 'PHP', rate: 61.20, change: '+0.30' },
      { from: 'GBP', to: 'PHP', rate: 71.80, change: '+0.25' },
      { from: 'SGD', to: 'PHP', rate: 42.15, change: '-0.10' },
      { from: 'AUD', to: 'PHP', rate: 37.90, change: '+0.18' },
      { from: 'KRW', to: 'PHP', rate: 0.043, change: '0.00' },
      { from: 'AED', to: 'PHP', rate: 15.38, change: '+0.05' }
    ];

    setRates(mockRates);

    // Update rates every 30 seconds (simulated)
    const interval = setInterval(() => {
      setRates(prev => prev.map(rate => ({
        ...rate,
        rate: (rate.rate + (Math.random() - 0.5) * 0.1).toFixed(2),
        change: ((Math.random() - 0.5) * 0.5).toFixed(2)
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'white',
      border: '1px solid #eaeaea',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '10px 15px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>💱</span>
        <span>Live Exchange Rates</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.75rem',
          opacity: 0.9,
          background: 'rgba(255,255,255,0.2)',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          Updated now
        </span>
      </div>

      {/* Scrolling ticker */}
      <div style={{
        overflow: 'hidden',
        padding: '12px 0',
        background: 'white'
      }}>
        <div
          style={{
            display: 'flex',
            gap: '30px',
            animation: 'scroll 30s linear infinite',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Duplicate rates for seamless loop */}
          {[...rates, ...rates].map((rate, index) => (
            <div
              key={index}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                {rate.from}/{rate.to}
              </span>
              <span style={{ fontWeight: '600' }}>
                ₱{rate.rate}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: parseFloat(rate.change) >= 0 ? '#4caf50' : '#f44336',
                fontWeight: '600'
              }}>
                {parseFloat(rate.change) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(rate.change))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
