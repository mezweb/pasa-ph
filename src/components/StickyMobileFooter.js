'use client';

export default function StickyMobileFooter({ earnings, itemCount, onAction, actionLabel = 'View Fulfillment List' }) {
  return (
    <>
      {/* Mobile sticky footer */}
      <div
        className="mobile-sticky-footer"
        style={{
          position: 'fixed',
          bottom: '60px', // Above bottom navigation
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '2px solid #0070f3',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
          padding: '15px 20px',
          zIndex: 998,
          display: 'none' // Hidden by default, shown via media query
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px'
        }}>
          {/* Earnings info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>Potential Earnings</div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              💰 ₱{earnings.toLocaleString()}
            </div>
            {itemCount > 0 && (
              <div style={{ fontSize: '0.7rem', color: '#888' }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in list
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={onAction}
            style={{
              background: '#0070f3',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
              minHeight: '44px',
              whiteSpace: 'nowrap'
            }}
          >
            {actionLabel}
          </button>
        </div>
      </div>

      {/* CSS for mobile-only display */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-sticky-footer {
            display: block !important;
          }
          /* Add extra padding to body to prevent content from being hidden */
          body {
            padding-bottom: 150px !important;
          }
        }
      `}</style>
    </>
  );
}
