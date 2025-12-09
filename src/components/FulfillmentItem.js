'use client';

import { useState } from 'react';

export default function FulfillmentItem({
  item,
  onStatusChange,
  onRemove,
  onMessageBuyer,
  onToggleBought,
  showBuyerName = false
}) {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeReason, setRemoveReason] = useState('');

  // Calculate deadline urgency
  const getDeadlineUrgency = () => {
    if (!item.neededBy) return { isUrgent: false, hoursRemaining: null };

    const now = new Date();
    const deadline = new Date(item.neededBy);
    const diffMs = deadline - now;
    const hoursRemaining = Math.ceil(diffMs / (1000 * 60 * 60));

    return {
      isUrgent: hoursRemaining <= 48 && hoursRemaining > 0,
      hoursRemaining,
      isPastDue: hoursRemaining <= 0
    };
  };

  const { isUrgent, hoursRemaining, isPastDue } = getDeadlineUrgency();

  const handleRemove = () => {
    if (!removeReason) {
      alert('Please select a reason for removal');
      return;
    }
    onRemove(item.id, removeReason);
    setShowRemoveModal(false);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'to-buy': {
        label: 'To Buy',
        color: '#ff9800',
        bg: '#fff3e0',
        icon: '🛒'
      },
      'purchased': {
        label: 'Purchased',
        color: '#2196f3',
        bg: '#e3f2fd',
        icon: '✅'
      },
      'delivered': {
        label: 'Delivered',
        color: '#4caf50',
        bg: '#e8f5e9',
        icon: '🎉'
      }
    };

    const config = statusConfig[status] || statusConfig['to-buy'];

    return (
      <div style={{
        background: config.bg,
        color: config.color,
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
    );
  };

  return (
    <>
      <div style={{
        background: 'white',
        border: isUrgent ? '2px solid #ff4d4f' : isPastDue ? '2px solid #d32f2f' : '1px solid #eaeaea',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        position: 'relative',
        opacity: item.isBought ? 0.7 : 1,
        transition: 'all 0.3s'
      }}>
        {/* Urgent deadline banner */}
        {(isUrgent || isPastDue) && (
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            background: isPastDue ? '#d32f2f' : '#ff4d4f',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '11px 11px 0 0',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {isPastDue ? '⚠️ PAST DUE!' : `⏰ URGENT: ${hoursRemaining}h remaining`}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr auto',
          gap: '15px',
          alignItems: 'start',
          marginTop: (isUrgent || isPastDue) ? '20px' : '0'
        }}>

          {/* Checkbox for strike-through */}
          <div style={{ paddingTop: '8px' }}>
            <input
              type="checkbox"
              checked={item.isBought || false}
              onChange={() => onToggleBought(item.id)}
              style={{
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                accentColor: '#4caf50'
              }}
              title="Mark as bought"
            />
          </div>

          {/* Item details */}
          <div style={{
            textDecoration: item.isBought ? 'line-through' : 'none',
            opacity: item.isBought ? 0.6 : 1
          }}>
            {/* Buyer name (if shown) */}
            {showBuyerName && (
              <div style={{
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '4px',
                fontWeight: '600'
              }}>
                👤 {item.buyerName || 'Unknown Buyer'}
              </div>
            )}

            {/* Item title */}
            <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>
              {item.title}
            </h4>

            {/* Specs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '8px'
            }}>
              {item.color && (
                <span style={{
                  background: '#f0f9ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#0077b6'
                }}>
                  {item.color}
                </span>
              )}
              {item.capacity && (
                <span style={{
                  background: '#f0f9ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#0077b6'
                }}>
                  {item.capacity}
                </span>
              )}
              {item.quantity && item.quantity > 1 && (
                <span style={{
                  background: '#f0f9ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#0077b6'
                }}>
                  Qty: {item.quantity}
                </span>
              )}
            </div>

            {/* Delivery method + Location */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '8px',
              fontSize: '0.85rem',
              color: '#666'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {item.deliveryMethod === 'shipping' ? (
                  <>
                    <span style={{ fontSize: '1.2rem' }}>📦</span>
                    <span>Shipping</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.2rem' }}>🤝</span>
                    <span>Meetup</span>
                  </>
                )}
              </div>
              {item.deliveryLocation && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>📍</span>
                  <span>{item.deliveryLocation}</span>
                </div>
              )}
            </div>

            {/* Auto-calculated delivery date */}
            {(() => {
              // Mock return flight date - in production this would come from seller's trip data
              const returnFlightDate = new Date();
              returnFlightDate.setDate(returnFlightDate.getDate() + 14); // Assume 2 weeks from now

              // Add processing time based on delivery method
              const deliveryDate = new Date(returnFlightDate);
              if (item.deliveryMethod === 'shipping') {
                deliveryDate.setDate(deliveryDate.getDate() + 3); // +3 days for shipping
              } else {
                deliveryDate.setDate(deliveryDate.getDate() + 1); // +1 day for meetup
              }

              const isUrgent = deliveryDate < new Date(item.neededBy || '9999-12-31');

              return (
                <div style={{
                  background: isUrgent && item.neededBy ? '#fff3e0' : '#f0f9ff',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '8px',
                  border: `1px solid ${isUrgent && item.neededBy ? '#ff9800' : '#0077b6'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span>✈️</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>
                      Est. Delivery: {deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginLeft: '22px' }}>
                    Return flight + {item.deliveryMethod === 'shipping' ? '3' : '1'} day{item.deliveryMethod === 'shipping' ? 's' : ''}
                  </div>
                  {isUrgent && item.neededBy && (
                    <div style={{ fontSize: '0.7rem', color: '#e65100', marginLeft: '22px', marginTop: '4px', fontWeight: '600' }}>
                      ⚠️ Needed by {new Date(item.neededBy).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Profit Math */}
            <div style={{
              background: '#e8f5e9',
              padding: '10px 12px',
              borderRadius: '8px',
              marginTop: '10px',
              fontSize: '0.85rem'
            }}>
              <div style={{ color: '#666', marginBottom: '4px' }}>Payout Breakdown:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span>Item Cost:</span>
                <span style={{ fontWeight: '600' }}>₱{(item.targetPrice || item.price || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span>Service Fee (10%):</span>
                <span style={{ fontWeight: '600', color: '#2e7d32' }}>₱{(item.estimatedProfit || Math.floor((item.price || 0) * 0.1)).toLocaleString()}</span>
              </div>
              <div style={{
                borderTop: '1px solid #c8e6c9',
                paddingTop: '6px',
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.75rem', opacity: 0.8 }}>Subtotal</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>
                  ₱{((item.targetPrice || item.price || 0) + (item.estimatedProfit || Math.floor((item.price || 0) * 0.1))).toLocaleString()}
                </span>
              </div>
              <div style={{
                paddingTop: '4px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>TOTAL EARNINGS:</span>
                <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '1.25rem' }}>
                  ₱{((item.targetPrice || item.price || 0) + (item.estimatedProfit || Math.floor((item.price || 0) * 0.1))).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Status & Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'flex-end',
            minWidth: '140px'
          }}>
            {/* Status dropdown */}
            <select
              value={item.status || 'to-buy'}
              onChange={(e) => onStatusChange(item.id, e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="to-buy">🛒 To Buy</option>
              <option value="purchased">✅ Purchased</option>
              <option value="delivered">🎉 Delivered</option>
            </select>

            {/* Message buyer button */}
            <button
              onClick={() => onMessageBuyer(item.buyerId, item.buyerName)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#0051cc'}
              onMouseOut={(e) => e.currentTarget.style.background = '#0070f3'}
            >
              <span>💬</span>
              <span>Message</span>
            </button>

            {/* Remove button */}
            <button
              onClick={() => setShowRemoveModal(true)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'white',
                color: '#ff4d4f',
                border: '1px solid #ff4d4f',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#ff4d4f';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#ff4d4f';
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Remove modal */}
      {showRemoveModal && (
        <div
          onClick={() => setShowRemoveModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem' }}>
              Remove Item from List
            </h3>

            {/* Profit Loss Warning */}
            <div style={{
              background: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#e65100', fontWeight: 'bold', marginBottom: '4px' }}>
                ⚠️ You'll lose this profit:
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>
                ₱{((item.targetPrice || item.price || 0) + (item.estimatedProfit || Math.floor((item.price || 0) * 0.1))).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                (₱{(item.targetPrice || item.price || 0).toLocaleString()} item cost + ₱{(item.estimatedProfit || Math.floor((item.price || 0) * 0.1)).toLocaleString()} service fee)
              </div>
            </div>

            <p style={{ margin: '0 0 16px', color: '#666' }}>
              Why are you removing "{item.title}"?
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '8px', display: 'block' }}>
                Select removal reason:
              </label>
              <select
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '2px solid #ff9800',
                  marginBottom: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: removeReason === 'out-of-stock' ? '#fff3e0' : 'white'
                }}
              >
                <option value="">Select a reason...</option>
                <option value="out-of-stock">🚫 OUT OF STOCK (Most Common)</option>
                <option value="too-expensive">💰 Price too high</option>
                <option value="buyer-cancelled">❌ Buyer cancelled</option>
                <option value="cant-find">🔍 Can't find item</option>
                <option value="exceeded-luggage">🧳 Exceeds luggage limit</option>
                <option value="customs-issue">🛃 Customs/import issue</option>
                <option value="other">📝 Other reason</option>
              </select>
              {removeReason === 'out-of-stock' && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666',
                  marginTop: '4px',
                  padding: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px'
                }}>
                  💡 Tip: Message {item.buyerName?.split(' ')[0] || 'the buyer'} to suggest alternative items or offer a refund.
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowRemoveModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                style={{
                  padding: '10px 20px',
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
