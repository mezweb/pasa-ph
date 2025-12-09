'use client';

import { useState, useEffect } from 'react';

export default function MotivationalGoal({
  currentEarnings = 0,
  flightCost = 50000,
  goalName = "Pay off your flight ticket",
  darkMode = false
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  const progress = Math.min((currentEarnings / flightCost) * 100, 100);
  const remaining = Math.max(flightCost - currentEarnings, 0);
  const isComplete = currentEarnings >= flightCost;

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isComplete]);

  return (
    <div style={{
      background: isComplete
        ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        : darkMode ? '#2d2d2d' : 'white',
      border: isComplete ? 'none' : `1px solid ${darkMode ? '#444' : '#eaeaea'}`,
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.5s ease',
      color: darkMode && !isComplete ? '#e0e0e0' : 'inherit'
    }}>
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `confetti 2s ease-out ${i * 0.1}s`,
                fontSize: '1.5rem'
              }}
            >
              {['🎉', '🎊', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div>
          <div style={{
            fontSize: '0.85rem',
            color: isComplete ? 'white' : '#666',
            marginBottom: '4px',
            opacity: isComplete ? 0.9 : 1
          }}>
            🎯 Your Goal
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: isComplete ? 'white' : '#333'
          }}>
            {goalName}
          </div>
        </div>
        <div style={{
          background: isComplete ? 'rgba(255,255,255,0.3)' : '#f0f9ff',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: isComplete ? 'white' : '#0077b6'
        }}>
          {progress.toFixed(0)}%
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '20px',
        background: isComplete ? 'rgba(255,255,255,0.3)' : '#f0f0f0',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '15px',
        position: 'relative'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: isComplete
            ? 'white'
            : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          transition: 'width 0.8s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: progress > 20 ? '8px' : '0'
        }}>
          {progress > 20 && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 'bold',
              color: isComplete ? '#11998e' : 'white'
            }}>
              {progress.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      {isComplete ? (
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '15px 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Goal Achieved!
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            You've earned enough to cover your flight!
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>
                Current Earnings
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2e7d32' }}>
                ₱{currentEarnings.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>
                Flight Cost
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#666' }}>
                ₱{flightCost.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Motivational message - Feature 16: Changed "Almost there!" from red to green */}
          <div style={{
            background: remaining <= 5000 ? (darkMode ? '#1e4620' : '#e8f5e9') : (darkMode ? '#1a2332' : '#f0f9ff'),
            border: `1px solid ${remaining <= 5000 ? '#2e7d32' : '#0070f3'}`,
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: remaining <= 5000 ? '#2e7d32' : '#0070f3',
              marginBottom: '4px'
            }}>
              {remaining <= 5000 ? '🎉 Almost there!' : '💪 Keep going!'}
            </div>
            <div style={{ fontSize: '0.85rem', color: darkMode ? '#ccc' : '#666' }}>
              You're <strong style={{ color: remaining <= 5000 ? '#2e7d32' : '#0070f3' }}>
                ₱{remaining.toLocaleString()}
              </strong> away from your goal!
            </div>
          </div>
        </div>
      )}

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
