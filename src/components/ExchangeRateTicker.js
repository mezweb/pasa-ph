'use client';

import { useState, useEffect } from 'react';

export default function ExchangeRateTicker() {
  const [rates, setRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState('now');
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to generate new rates
  const generateNewRates = () => {
    return [
      { from: 'USD', to: 'PHP', rate: (56.50 + (Math.random() - 0.5) * 0.5).toFixed(2), change: ((Math.random() - 0.5) * 0.5).toFixed(2) },
      { from: 'JPY', to: 'PHP', rate: (0.38 + (Math.random() - 0.5) * 0.02).toFixed(2), change: ((Math.random() - 0.5) * 0.05).toFixed(2) },
      { from: 'EUR', to: 'PHP', rate: (61.20 + (Math.random() - 0.5) * 0.5).toFixed(2), change: ((Math.random() - 0.5) * 0.5).toFixed(2) },
      { from: 'GBP', to: 'PHP', rate: (71.80 + (Math.random() - 0.5) * 0.5).toFixed(2), change: ((Math.random() - 0.5) * 0.5).toFixed(2) },
      { from: 'SGD', to: 'PHP', rate: (42.15 + (Math.random() - 0.5) * 0.3).toFixed(2), change: ((Math.random() - 0.5) * 0.3).toFixed(2) },
      { from: 'AUD', to: 'PHP', rate: (37.90 + (Math.random() - 0.5) * 0.3).toFixed(2), change: ((Math.random() - 0.5) * 0.3).toFixed(2) },
      { from: 'KRW', to: 'PHP', rate: (0.043 + (Math.random() - 0.5) * 0.002).toFixed(3), change: ((Math.random() - 0.5) * 0.01).toFixed(3) },
      { from: 'AED', to: 'PHP', rate: (15.38 + (Math.random() - 0.5) * 0.2).toFixed(2), change: ((Math.random() - 0.5) * 0.2).toFixed(2) }
    ];
  };

  // Manual update function
  const handleManualUpdate = () => {
    setIsUpdating(true);

    // Simulate API call with slight delay
    setTimeout(() => {
      const newRates = generateNewRates();
      setRates(newRates);
      setLastUpdated(new Date());
      setTimeAgo('now');
      setIsUpdating(false);
    }, 300);
  };

  // Initialize rates
  useEffect(() => {
    const initialRates = generateNewRates();
    setRates(initialRates);
  }, []);

  // Update time ago display
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffSeconds = Math.floor((now - lastUpdated) / 1000);

      if (diffSeconds < 5) {
        setTimeAgo('now');
      } else if (diffSeconds < 60) {
        setTimeAgo(`${diffSeconds}s ago`);
      } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else {
        const hours = Math.floor(diffSeconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Auto-update rates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newRates = generateNewRates();
      setRates(newRates);
      setLastUpdated(new Date());
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
        <button
          onClick={handleManualUpdate}
          disabled={isUpdating}
          style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            opacity: isUpdating ? 0.6 : 0.9,
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: 'none',
            color: 'white',
            cursor: isUpdating ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            if (!isUpdating) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.opacity = '0.9';
          }}
          title="Click to refresh rates"
        >
          <span style={{
            display: 'inline-block',
            animation: isUpdating ? 'spin 1s linear infinite' : 'none'
          }}>
            🔄
          </span>
          <span>Updated {timeAgo}</span>
        </button>
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
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
