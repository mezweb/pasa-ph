'use client';

import { useState } from 'react';

/**
 * Enhanced Empty State component with smart messaging
 *
 * Props:
 * - type: 'no-buyers', 'no-sellers', 'no-results', 'no-orders', 'no-requests', etc.
 * - region: Optional region/country for context-aware messages
 * - searchTerm: Optional search term for no-results states
 * - onWaitlist: Optional callback for waitlist signup
 * - suggestions: Optional array of alternative suggestions
 * - icon, title, description: Override defaults
 * - actionLabel, onAction: Primary action button
 * - secondaryLabel, onSecondary: Secondary action button
 */
export default function EmptyState({
  type = 'generic',
  region = null,
  searchTerm = null,
  onWaitlist = null,
  suggestions = [],
  icon = null,
  title = null,
  description = null,
  actionLabel = null,
  onAction = null,
  secondaryLabel = null,
  onSecondary = null
}) {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [email, setEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Define empty state configurations
  const emptyStates = {
    'no-buyers': {
      icon: '🌏',
      title: region ? `Quiet day in ${region}` : 'Quiet day here',
      description: region
        ? `No shoppers requesting items from ${region} right now. Be the first to help them out!`
        : 'No new requests yet. Check back soon for opportunities!',
      actionLabel: region && onWaitlist ? `Get notified when buyers appear in ${region}` : null,
      showWaitlist: true
    },
    'no-sellers': {
      icon: '✈️',
      title: region ? `No travelers heading to ${region} yet` : 'No travelers yet',
      description: region && suggestions.length > 0
        ? `Have you checked ${suggestions[0]}?`
        : 'Check back soon - new travelers join daily!',
      actionLabel: onWaitlist ? 'Notify me when a traveler appears' : null,
      showWaitlist: true
    },
    'no-results': {
      icon: '🔍',
      title: searchTerm ? `No results for "${searchTerm}"` : 'No results found',
      description: suggestions.length > 0
        ? `Try searching for "${suggestions[0]}" instead?`
        : 'Try adjusting your search terms or filters',
      actionLabel: null,
      showWaitlist: false
    },
    'no-orders': {
      icon: '📦',
      title: 'Your orders will appear here',
      description: 'Once shoppers purchase items, you\'ll see all the details right here.',
      actionLabel: null,
      showWaitlist: false
    },
    'no-requests': {
      icon: '🛍️',
      title: 'Take a break - no new requests',
      description: 'Check back soon for new shopper requests in your travel destinations!',
      actionLabel: 'Browse Marketplace',
      showWaitlist: false
    },
    'no-products': {
      icon: '🏪',
      title: 'This shop is taking a break',
      description: 'This traveler hasn\'t listed any items yet. Check back soon!',
      actionLabel: null,
      showWaitlist: false
    },
    'no-wishlist': {
      icon: '💝',
      title: 'Start adding items you love',
      description: 'Save your favorite finds here to easily request them later!',
      actionLabel: 'Browse Products',
      showWaitlist: false
    },
    'no-cart': {
      icon: '🛒',
      title: 'Your cart is waiting for something special',
      description: 'Find items from travelers and add them here to get started!',
      actionLabel: 'Start Shopping',
      showWaitlist: false
    },
    'generic': {
      icon: '📭',
      title: 'Quiet day here',
      description: 'Check back soon - exciting things are coming!',
      actionLabel: null,
      showWaitlist: false
    }
  };

  const config = emptyStates[type] || emptyStates.generic;

  // Override with custom props if provided
  const finalIcon = icon || config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionLabel = actionLabel || config.actionLabel;
  const showWaitlist = config.showWaitlist && onWaitlist;

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (onWaitlist) {
      onWaitlist(email, region);
    }
    setWaitlistSubmitted(true);
    setTimeout(() => {
      setShowWaitlistForm(false);
      setWaitlistSubmitted(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #eee',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Pasa Logo Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '12rem',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none'
      }}>
        📦
      </div>

      {/* Icon */}
      <div style={{
        fontSize: '4rem',
        marginBottom: '20px',
        opacity: 0.7,
        position: 'relative',
        zIndex: 1
      }}>
        {finalIcon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
        position: 'relative',
        zIndex: 1
      }}>
        {finalTitle}
      </h3>

      {/* Description */}
      {finalDescription && (
        <p style={{
          fontSize: '0.95rem',
          color: '#666',
          marginBottom: '25px',
          lineHeight: '1.6',
          maxWidth: '400px',
          margin: '0 auto 25px'
        }}>
          {finalDescription}
        </p>
      )}

      {/* Suggestions List */}
      {suggestions.length > 1 && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '15px 20px',
          marginBottom: '20px',
          maxWidth: '400px',
          margin: '0 auto 20px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#666',
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            Try these alternatives:
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center'
          }}>
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  // Suggestions can be clickable - parent component should handle
                  if (window.handleSuggestionClick) {
                    window.handleSuggestionClick(suggestion);
                  }
                }}
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  color: '#0070f3',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0070f3';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#0070f3';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#0070f3';
                  e.currentTarget.style.borderColor = '#ddd';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Button or Waitlist Form */}
      {finalActionLabel && !showWaitlistForm && (
        <button
          onClick={() => {
            if (showWaitlist) {
              setShowWaitlistForm(true);
            } else if (onAction) {
              onAction();
            }
          }}
          style={{
            background: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            minHeight: '44px',
            marginBottom: secondaryLabel ? '10px' : '0'
          }}
        >
          {finalActionLabel}
        </button>
      )}

      {/* Secondary Action */}
      {onSecondary && secondaryLabel && !showWaitlistForm && (
        <button
          onClick={onSecondary}
          style={{
            background: 'white',
            color: '#0070f3',
            border: '2px solid #0070f3',
            padding: '12px 28px',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            minHeight: '44px',
            marginLeft: secondaryLabel && finalActionLabel ? '10px' : '0',
            marginTop: !finalActionLabel ? '10px' : '0'
          }}
        >
          {secondaryLabel}
        </button>
      )}

      {/* Waitlist Form */}
      {showWaitlistForm && !waitlistSubmitted && (
        <form onSubmit={handleWaitlistSubmit} style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '400px',
          margin: '0 auto',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#666',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            📧 We'll notify you when there's activity!
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                flex: 1,
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            />
            <button
              type="submit"
              style={{
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Notify Me
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowWaitlistForm(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Waitlist Success */}
      {waitlistSubmitted && (
        <div style={{
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '12px',
          padding: '15px 20px',
          maxWidth: '400px',
          margin: '0 auto',
          color: '#155724',
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✓</span>
          You're on the waitlist! We'll notify you soon.
        </div>
      )}
    </div>
  );
}
