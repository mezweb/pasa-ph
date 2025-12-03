'use client';

import { useState } from 'react';

export default function RequestCard({
  request,
  onAccept,
  isSelected = false,
  onSelect,
  showBulkSelect = false,
  tier = 'Standard'
}) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const isExclusive = tier === 'Gold' || tier === 'Diamond';
  const isAccepted = request.status === 'Accepted';

  // Calculate urgency (days remaining)
  const getDaysRemaining = () => {
    if (!request.neededBy) return null;
    const today = new Date();
    const neededDate = new Date(request.neededBy);
    const diffTime = neededDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isUrgent = daysRemaining !== null && daysRemaining <= 3;

  return (
    <>
      <div
        style={{
          background: 'white',
          border: isAccepted ? '2px solid #2e7d32' : isSelected ? '2px solid #0070f3' : '1px solid #eaeaea',
          borderRadius: '12px',
          padding: '20px',
          position: 'relative',
          boxShadow: isAccepted ? '0 0 10px rgba(46, 125, 50, 0.5)' : isExclusive ? '0 4px 12px rgba(212, 175, 55, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.2s',
          cursor: showBulkSelect ? 'pointer' : 'default'
        }}
        onClick={() => showBulkSelect && onSelect && onSelect(request.id)}
      >
        {/* Badges Row */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          {isExclusive && (
            <span style={{
              background: '#d4af37',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              💎 EXCLUSIVE
            </span>
          )}
          {isUrgent && (
            <span style={{
              background: '#ff4d4f',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              padding: '3px 8px',
              borderRadius: '4px',
              animation: 'pulse 2s infinite'
            }}>
              ⚡ URGENT
            </span>
          )}
        </div>

        {/* Bulk Select Checkbox */}
        {showBulkSelect && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect && onSelect(request.id);
              }}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
          </div>
        )}

        {/* Product Image */}
        {request.image && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowPhotoModal(true);
            }}
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '15px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <img
              src={request.image}
              alt={request.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              🔍 Click to expand
            </div>
          </div>
        )}

        {/* Title */}
        <h4 style={{ margin: '0 0 10px', fontSize: '1.1rem', paddingRight: showBulkSelect ? '0' : '80px' }}>
          {request.title}
        </h4>

        {/* Item Specifications */}
        {(request.color || request.capacity || request.quantity) && (
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '10px'
          }}>
            {request.color && (
              <div style={{
                background: '#f0f9ff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#0077b6',
                fontWeight: '500'
              }}>
                🎨 {request.color}
              </div>
            )}
            {request.capacity && (
              <div style={{
                background: '#f0f9ff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#0077b6',
                fontWeight: '500'
              }}>
                📦 {request.capacity}
              </div>
            )}
            {request.quantity && (
              <div style={{
                background: '#f0f9ff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#0077b6',
                fontWeight: '500'
              }}>
                ✕ {request.quantity}
              </div>
            )}
          </div>
        )}

        {/* Weight Display */}
        {request.weight && (
          <div style={{
            background: '#fff3e0',
            padding: '6px 12px',
            borderRadius: '6px',
            marginBottom: '10px',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#e65100', fontWeight: '600' }}>
              ⚖️ Approx. Weight: {request.weight}kg
            </span>
          </div>
        )}

        {/* Route + Delivery Location */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>
            <span style={{ fontWeight: '600' }}>Route:</span> {request.from} → {request.to}
          </div>
          {request.deliveryLocation && (
            <div style={{ color: '#666', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: '600' }}>📍 Delivery:</span>{' '}
              <span style={{ color: '#0070f3', fontWeight: '500' }}>{request.deliveryLocation}</span>
            </div>
          )}
        </div>

        {/* Urgency Tag - Needed By Date */}
        {request.neededBy && (
          <div style={{
            background: isUrgent ? '#fff3e0' : '#f0f9ff',
            border: `1px solid ${isUrgent ? '#ff9800' : '#0070f3'}`,
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>Needed by:</div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: isUrgent ? '#e65100' : '#0070f3'
            }}>
              📅 {new Date(request.neededBy).toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              {daysRemaining !== null && (
                <span style={{ marginLeft: '8px', fontSize: '0.75rem', opacity: 0.8 }}>
                  ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div style={{
          background: '#f8f9fa',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          {/* Target Buy Price (Buyer's Budget) */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Target Buy Price (Buyer's Budget)
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32' }}>
              ₱{request.targetPrice ? request.targetPrice.toLocaleString() : request.price.toLocaleString()}
            </div>
          </div>

          {/* Estimated Profit */}
          {request.estimatedProfit && (
            <div style={{
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              padding: '6px 10px',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#1b5e20' }}>Your Profit (10% fee)</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2e7d32' }}>
                💰 ₱{request.estimatedProfit.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAccept && onAccept(request.id, request.title);
          }}
          disabled={isAccepted}
          style={{
            width: '100%',
            background: isAccepted ? '#2e7d32' : isExclusive ? '#d4af37' : '#0070f3',
            border: 'none',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: isAccepted ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            opacity: isAccepted ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isAccepted) e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isAccepted ? '✓ Accepted' : '✓ Accept Request'}
        </button>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && request.image && (
        <div
          onClick={() => setShowPhotoModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={request.image}
              alt={request.title}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPhotoModal(false);
              }}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>{request.title}</h3>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {request.from} → {request.to}
                {request.deliveryLocation && ` • 📍 ${request.deliveryLocation}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pulse animation for urgent badge */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
}
