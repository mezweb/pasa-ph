'use client';

import { useState } from 'react';

export default function TierBenefitsModal({ tier = 'Gold', isOpen, onClose }) {
  if (!isOpen) return null;

  const tierData = {
    Standard: {
      color: '#9e9e9e',
      gradient: 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)',
      price: 'Free',
      features: [
        { icon: '✓', text: 'Accept basic requests', included: true },
        { icon: '✓', text: 'Standard marketplace access', included: true },
        { icon: '✓', text: 'Basic seller profile', included: true },
        { icon: '✓', text: '10% service fee per order', included: true },
        { icon: '✗', text: 'Priority in search results', included: false },
        { icon: '✗', text: 'Exclusive high-value requests', included: false },
        { icon: '✗', text: 'Reduced service fee (8%)', included: false },
        { icon: '✗', text: 'Featured seller badge', included: false }
      ]
    },
    Gold: {
      color: '#ffa726',
      gradient: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
      price: '₱299/month',
      features: [
        { icon: '✓', text: 'All Standard features', included: true },
        { icon: '✓', text: 'Priority in search results', included: true },
        { icon: '✓', text: 'Access to premium requests', included: true },
        { icon: '✓', text: 'Reduced service fee (8%)', included: true },
        { icon: '✓', text: 'Gold seller badge', included: true },
        { icon: '✓', text: 'Advanced analytics dashboard', included: true },
        { icon: '✗', text: 'Exclusive VIP requests', included: false },
        { icon: '✗', text: 'Personal account manager', included: false }
      ]
    },
    Diamond: {
      color: '#42a5f5',
      gradient: 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)',
      price: '₱999/month',
      features: [
        { icon: '✓', text: 'All Gold features', included: true },
        { icon: '✓', text: 'Exclusive VIP requests (₱10k+ value)', included: true },
        { icon: '✓', text: 'Ultra-reduced service fee (5%)', included: true },
        { icon: '✓', text: 'Diamond seller badge', included: true },
        { icon: '✓', text: 'Personal account manager', included: true },
        { icon: '✓', text: 'Priority customer support', included: true },
        { icon: '✓', text: 'Featured on homepage', included: true },
        { icon: '✓', text: 'Early access to new features', included: true }
      ]
    }
  };

  const currentTier = tierData[tier] || tierData.Gold;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div style={{
          background: currentTier.gradient,
          color: 'white',
          padding: '30px',
          borderRadius: '16px 16px 0 0',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
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

          {/* Tier badge */}
          <div style={{
            fontSize: '3rem',
            marginBottom: '10px'
          }}>
            {tier === 'Diamond' ? '💎' : tier === 'Gold' ? '⭐' : '🥉'}
          </div>

          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {tier} Membership
          </h2>

          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            opacity: 0.9
          }}>
            {currentTier.price}
          </div>

          {tier !== 'Standard' && (
            <div style={{
              fontSize: '0.85rem',
              opacity: 0.8,
              marginTop: '8px'
            }}>
              Billed monthly • Cancel anytime
            </div>
          )}
        </div>

        {/* Features list */}
        <div style={{ padding: '30px' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333'
          }}>
            What's Included:
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {currentTier.features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: feature.included ? '#f0f9ff' : '#f9f9f9',
                  borderRadius: '8px',
                  border: `1px solid ${feature.included ? '#e0f2fe' : '#eee'}`,
                  opacity: feature.included ? 1 : 0.5
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: feature.included ? '#4caf50' : '#999',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {feature.icon}
                </div>
                <span style={{
                  fontSize: '0.95rem',
                  color: feature.included ? '#333' : '#999',
                  textDecoration: feature.included ? 'none' : 'line-through'
                }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Upgrade section */}
          {tier !== 'Diamond' && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: '#fff9e6',
              borderRadius: '12px',
              border: '2px solid #ffc107',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#f57c00',
                marginBottom: '10px'
              }}>
                {tier === 'Standard' ? '✨ Upgrade to unlock more!' : '💎 Go Diamond for maximum benefits!'}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '15px'
              }}>
                {tier === 'Standard'
                  ? 'Upgrade to Gold to access premium requests and earn more'
                  : 'Diamond members earn 5% more per order and get exclusive VIP requests'}
              </div>
              <button
                onClick={() => {
                  onClose();
                  // Navigate to upgrade page
                  window.location.href = '/upgrade';
                }}
                style={{
                  background: tier === 'Standard' ? currentTier.gradient : tierData.Diamond.gradient,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {tier === 'Standard' ? 'Upgrade to Gold' : 'Upgrade to Diamond'}
              </button>
            </div>
          )}

          {/* Compare tiers link */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <a
              href="/membership-tiers"
              style={{
                color: '#0070f3',
                fontSize: '0.9rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Compare all membership tiers →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
