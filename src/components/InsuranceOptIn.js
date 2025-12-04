'use client';

import { useState } from 'react';

export default function InsuranceOptIn({ orderValue = 0, onSelect }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'none',
      name: 'No Insurance',
      icon: '🚫',
      price: 0,
      coverage: 0,
      features: [
        'Standard Pasa.ph buyer protection',
        'Escrow payment security',
        'Dispute resolution support'
      ],
      recommended: false
    },
    {
      id: 'basic',
      name: 'Travel Protection',
      icon: '✈️',
      price: Math.max(50, Math.ceil(orderValue * 0.02)),
      coverage: orderValue,
      features: [
        'Lost/damaged items during transit',
        'Flight delays or cancellations',
        'Customs confiscation coverage',
        '24/7 claims support',
        'Hassle-free claims process'
      ],
      recommended: orderValue >= 2000
    },
    {
      id: 'premium',
      name: 'Full Coverage',
      icon: '🛡️',
      price: Math.max(100, Math.ceil(orderValue * 0.04)),
      coverage: orderValue * 1.5,
      features: [
        'All Travel Protection benefits',
        'Extended coverage up to 150% of item value',
        'Trip interruption coverage',
        'Emergency replacement guarantee',
        'No-questions-asked refund policy',
        'Priority claims processing (24h)'
      ],
      recommended: orderValue >= 5000
    }
  ];

  const handleSelect = (plan) => {
    setSelectedPlan(plan.id);
    onSelect && onSelect(plan);
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #eaeaea',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🛡️</span>
          <span>Protect Your Purchase</span>
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          Optional insurance to cover unforeseen circumstances during international shipping
        </p>
      </div>

      {/* Plans */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleSelect(plan)}
            style={{
              position: 'relative',
              padding: '20px',
              border: `2px solid ${selectedPlan === plan.id ? '#0070f3' : '#eaeaea'}`,
              borderRadius: '12px',
              background: selectedPlan === plan.id ? '#f0f9ff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (selectedPlan !== plan.id) {
                e.currentTarget.style.borderColor = '#bbdefb';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlan !== plan.id) {
                e.currentTarget.style.borderColor = '#eaeaea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {/* Recommended badge */}
            {plan.recommended && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#ff9800',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                RECOMMENDED
              </div>
            )}

            {/* Icon & Name */}
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '10px'
            }}>
              {plan.icon}
            </div>

            <div style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              {plan.name}
            </div>

            {/* Price */}
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: plan.price === 0 ? '#4caf50' : '#0070f3',
              marginBottom: '4px'
            }}>
              {plan.price === 0 ? 'Free' : `₱${plan.price.toLocaleString()}`}
            </div>

            {plan.coverage > 0 && (
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                marginBottom: '15px'
              }}>
                Coverage up to ₱{plan.coverage.toLocaleString()}
              </div>
            )}

            {/* Features */}
            <div style={{
              borderTop: '1px solid #eee',
              paddingTop: '15px'
            }}>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '0.85rem',
                color: '#666',
                lineHeight: '1.8'
              }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ color: '#4caf50', flexShrink: 0 }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selected indicator */}
            {selectedPlan === plan.id && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: '#0070f3',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                ✓ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div style={{
        padding: '15px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bbdefb',
        fontSize: '0.85rem',
        color: '#0070f3',
        lineHeight: '1.6'
      }}>
        <strong>ℹ️ How it works:</strong> If you choose insurance, the cost is added to your order total.
        In case of loss, damage, or other covered incidents, simply file a claim and we'll process your refund within 5 business days.
      </div>

      {/* Claims record */}
      <div style={{
        marginTop: '15px',
        padding: '12px',
        background: '#e8f5e9',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.85rem',
        color: '#2e7d32'
      }}>
        <span style={{ fontSize: '1.2rem' }}>📊</span>
        <div>
          <strong>98.5% claim approval rate</strong> • Over 15,000 protected orders
        </div>
      </div>
    </div>
  );
}
