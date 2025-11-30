'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function CartPopup() {
  const router = useRouter();
  const { cart, showCartPopup, setShowCartPopup } = useCart();

  if (!showCartPopup) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleContinueShopping = () => {
    setShowCartPopup(false);
  };

  const handleCheckout = () => {
    setShowCartPopup(false);
    router.push('/cart');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleContinueShopping}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Popup Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: 'clamp(15px, 4vw, 20px)',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#2e7d32'
            }}>
              ✓ Added to Cart!
            </h3>
            <p style={{
              margin: '5px 0 0 0',
              fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
              color: '#666'
            }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={handleContinueShopping}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
              cursor: 'pointer',
              color: '#999',
              padding: '5px 10px',
              lineHeight: 1,
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#333'}
            onMouseOut={(e) => e.currentTarget.style.color = '#999'}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'clamp(15px, 4vw, 20px)'
        }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: 'clamp(10px, 3vw, 15px)',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              {/* Image */}
              <div style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#f9f9f9',
                flexShrink: 0
              }}>
                <img
                  src={item.images ? item.images[0] : item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Details */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minWidth: 0
              }}>
                <div>
                  <div style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                    color: '#888',
                    marginBottom: '3px'
                  }}>
                    {item.from}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    wordBreak: 'break-word'
                  }}>
                    {item.title}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
                    fontWeight: 'bold',
                    color: '#0070f3'
                  }}>
                    ₱{item.price.toLocaleString()} × {item.quantity}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                    fontWeight: 'bold'
                  }}>
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: 'clamp(15px, 4vw, 20px)',
          borderTop: '1px solid #eee',
          background: '#fafafa'
        }}>
          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span style={{
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              fontWeight: 'bold'
            }}>
              Total:
            </span>
            <span style={{
              fontSize: 'clamp(1.2rem, 3.5vw, 1.4rem)',
              fontWeight: 'bold',
              color: '#0070f3'
            }}>
              ₱{totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column'
          }}>
            <button
              onClick={handleCheckout}
              style={{
                background: '#0070f3',
                color: 'white',
                border: 'none',
                padding: 'clamp(12px, 3vw, 14px) 20px',
                borderRadius: '8px',
                fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#0051cc'}
              onMouseOut={(e) => e.currentTarget.style.background = '#0070f3'}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleContinueShopping}
              style={{
                background: 'white',
                color: '#333',
                border: '1px solid #ddd',
                padding: 'clamp(12px, 3vw, 14px) 20px',
                borderRadius: '8px',
                fontSize: 'clamp(0.95rem, 2.5vw, 1rem)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#ddd';
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
