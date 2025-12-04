'use client';

import { useState } from 'react';

export default function TravelerPledge({ isOpen, onAccept, onClose }) {
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setScrolledToBottom(true);
    }
  };

  const pledges = [
    {
      icon: '✅',
      title: 'Honest Communication',
      description: 'I will provide accurate item descriptions, prices, and delivery timelines to all buyers.'
    },
    {
      icon: '📦',
      title: 'Quality Assurance',
      description: 'I will inspect items for authenticity and quality before purchasing and delivering them.'
    },
    {
      icon: '⏰',
      title: 'Timely Delivery',
      description: 'I will meet agreed delivery dates or proactively communicate any delays to buyers.'
    },
    {
      icon: '💬',
      title: 'Professional Communication',
      description: 'I will respond to buyer messages within 24 hours and maintain respectful communication.'
    },
    {
      icon: '🛡️',
      title: 'Safe Handling',
      description: 'I will package items securely and handle them with care during transport.'
    },
    {
      icon: '🚫',
      title: 'No Prohibited Items',
      description: 'I will not transport illegal, prohibited, or dangerous goods as defined by Philippine and international law.'
    },
    {
      icon: '📱',
      title: 'Platform-Only Transactions',
      description: 'I will complete all transactions through Pasa.ph to ensure buyer protection and escrow security.'
    },
    {
      icon: '🤝',
      title: 'Trust & Integrity',
      description: 'I will act with honesty and integrity, treating every buyer fairly and professionally.'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤝</div>
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Traveler Pledge
          </h2>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            As a Pasa.ph traveler, I pledge to uphold these principles to maintain trust and safety in our community
          </p>
        </div>

        {/* Scrollable content */}
        <div
          onScroll={handleScroll}
          style={{
            flex: 1,
            padding: '30px',
            overflowY: 'auto'
          }}
        >
          {/* Introduction */}
          <div style={{
            padding: '20px',
            background: '#f0f9ff',
            borderRadius: '12px',
            marginBottom: '25px',
            border: '1px solid #bbdefb'
          }}>
            <div style={{
              fontSize: '0.95rem',
              color: '#0070f3',
              lineHeight: '1.7'
            }}>
              <strong>Why This Matters:</strong> Pasa.ph is built on trust. By accepting this pledge,
              you commit to maintaining the highest standards of service, ensuring every buyer has a
              positive experience.
            </div>
          </div>

          {/* Pledge items */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginBottom: '25px'
          }}>
            {pledges.map((pledge, idx) => (
              <div key={idx} style={{
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '12px',
                border: '1px solid #eee',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    {pledge.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {pledge.title}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#666',
                      lineHeight: '1.6'
                    }}>
                      {pledge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consequences section */}
          <div style={{
            padding: '20px',
            background: '#fff3e0',
            borderRadius: '12px',
            border: '1px solid #ffe0b2',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#e65100',
              marginBottom: '10px'
            }}>
              ⚠️ Violation Consequences
            </div>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '0.85rem',
              color: '#666',
              lineHeight: '1.8'
            }}>
              <li>First violation: Warning and account review</li>
              <li>Second violation: Temporary suspension (7-30 days)</li>
              <li>Severe/repeated violations: Permanent account termination</li>
              <li>Fraudulent activity: Legal action and law enforcement referral</li>
            </ul>
          </div>

          {/* Scroll indicator */}
          {!scrolledToBottom && (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              color: '#999',
              fontSize: '0.85rem',
              animation: 'bounce 2s infinite'
            }}>
              ↓ Scroll to read all terms ↓
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #eaeaea',
          background: '#fafafa'
        }}>
          {/* Checkbox agreement */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '20px',
            cursor: 'pointer',
            padding: '15px',
            background: 'white',
            borderRadius: '8px',
            border: '2px solid ' + (agreed ? '#4caf50' : '#e0e0e0'),
            transition: 'all 0.2s'
          }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!scrolledToBottom}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                cursor: scrolledToBottom ? 'pointer' : 'not-allowed'
              }}
            />
            <div style={{
              flex: 1,
              fontSize: '0.9rem',
              color: '#333',
              lineHeight: '1.6'
            }}>
              I have read and understand the Traveler Pledge. I agree to uphold these principles
              and understand the consequences of violations. I will conduct all transactions with
              honesty, integrity, and professionalism.
            </div>
          </label>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '15px'
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                color: '#666',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => agreed && onAccept()}
              disabled={!agreed}
              style={{
                flex: 2,
                padding: '14px',
                background: agreed ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' : '#ccc',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: agreed ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: agreed ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (agreed) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = agreed ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none';
              }}
            >
              {agreed ? '✓ I Accept the Pledge' : 'Please Read & Check Above'}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </div>
  );
}
