'use client';

// Trust & Security Badge Components

export function EscrowBadge({ size = 'medium' }) {
  const sizes = {
    small: { padding: '4px 8px', fontSize: '0.7rem', iconSize: '0.9rem' },
    medium: { padding: '6px 12px', fontSize: '0.8rem', iconSize: '1rem' },
    large: { padding: '8px 16px', fontSize: '0.9rem', iconSize: '1.1rem' }
  };

  const style = sizes[size];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
      color: 'white',
      padding: style.padding,
      borderRadius: '6px',
      fontSize: style.fontSize,
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(46, 125, 50, 0.3)'
    }}>
      <span style={{ fontSize: style.iconSize }}>🛡️</span>
      Escrow Secured
    </div>
  );
}

export function VerifiedBadge({ size = 'small', inline = false }) {
  const sizes = {
    tiny: { iconSize: '14px', padding: '2px' },
    small: { iconSize: '18px', padding: '3px' },
    medium: { iconSize: '24px', padding: '4px' }
  };

  const style = sizes[size];

  if (inline) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2196f3',
        borderRadius: '50%',
        width: style.iconSize,
        height: style.iconSize,
        padding: style.padding,
        marginLeft: '4px',
        verticalAlign: 'middle'
      }} title="Verified Seller">
        <span style={{ color: 'white', fontSize: `calc(${style.iconSize} * 0.7)`, fontWeight: 'bold' }}>✓</span>
      </span>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '-2px',
      right: '-2px',
      background: '#2196f3',
      borderRadius: '50%',
      width: style.iconSize,
      height: style.iconSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }} title="Verified Seller">
      <span style={{ color: 'white', fontSize: `calc(${style.iconSize} * 0.6)`, fontWeight: 'bold' }}>✓</span>
    </div>
  );
}

export function CapitalDisplay({ mode, amount, showLabel = true }) {
  const isEarning = mode === 'earn';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 14px',
      background: isEarning ? '#e8f5e9' : '#fff3e0',
      borderRadius: '8px',
      border: `1px solid ${isEarning ? '#2e7d32' : '#f57c00'}`
    }}>
      <span style={{ fontSize: '1.2rem' }}>{isEarning ? '💰' : '💳'}</span>
      <div>
        {showLabel && (
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px' }}>
            {isEarning ? 'You earn:' : 'You pay:'}
          </div>
        )}
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: isEarning ? '#2e7d32' : '#f57c00'
        }}>
          ₱{amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export function ServiceFeeInfo({ amount, percentage = 10, showTooltip = true }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      padding: '8px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
        <span>Service Fee ({percentage}%)</span>
        {showTooltip && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#e3f2fd',
            color: '#0070f3',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            cursor: 'help'
          }} title={`Platform fee: ${percentage}% covers payment processing, escrow protection, and customer support.`}>
            ?
          </span>
        )}
      </div>
      <div style={{ fontWeight: '500' }}>₱{amount.toLocaleString()}</div>
    </div>
  );
}

export function UploadReceiptButton({ disabled = true, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        background: disabled ? '#f5f5f5' : '#0070f3',
        color: disabled ? '#999' : 'white',
        border: disabled ? '2px dashed #ccc' : 'none',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        justifyContent: 'center',
        minHeight: '44px',
        position: 'relative'
      }}
      title={disabled ? 'Available after item is purchased' : 'Upload receipt to get paid'}
    >
      <span style={{ fontSize: '1.2rem' }}>📄</span>
      Upload Receipt
      {disabled && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: '#ff9800',
          color: 'white',
          fontSize: '0.7rem',
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Soon
        </span>
      )}
    </button>
  );
}

export function PayoutTimingInfo() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px',
      background: '#e8f5e9',
      borderRadius: '8px',
      border: '1px solid #2e7d32',
      fontSize: '0.85rem'
    }}>
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>💰</span>
      <div>
        <div style={{ fontWeight: 'bold', color: '#1b5e20', marginBottom: '4px' }}>
          How Payment Works
        </div>
        <div style={{ color: '#2e7d32', lineHeight: '1.5' }}>
          <strong>Funds released upon verified delivery.</strong> Buyer confirms receipt → Payment releases to you within 24 hours. Protected by escrow! 🛡️
        </div>
      </div>
    </div>
  );
}

export function AddressPrivacyNote() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '14px',
      background: '#fff3e0',
      borderRadius: '10px',
      border: '1px solid #f57c00',
      marginTop: '15px'
    }}>
      <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>🔒</span>
      <div style={{ fontSize: '0.85rem', color: '#e65100', lineHeight: '1.6' }}>
        <strong>Your Privacy Protected:</strong> Your exact address is hidden until transaction confirmation. Only general location (city) is visible to other users.
      </div>
    </div>
  );
}

export function TotalCapitalSummary({ items, mode = 'seller' }) {
  const totalCost = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const platformFee = Math.round(totalCost * 0.10);
  const earnings = Math.round(totalCost * 0.15); // 15% earnings for sellers
  const netCapitalNeeded = totalCost; // What seller pays upfront
  const netEarnings = earnings; // What seller earns

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid #0070f3',
      marginTop: '20px'
    }}>
      <h3 style={{
        margin: '0 0 15px 0',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '1.3rem' }}>💼</span>
        Capital Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>Total Items Cost:</span>
          <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>₱{totalCost.toLocaleString()}</span>
        </div>

        <CapitalDisplay mode="pay" amount={netCapitalNeeded} showLabel={true} />

        <div style={{ fontSize: '0.75rem', color: '#888', padding: '8px', background: '#f9f9f9', borderRadius: '6px' }}>
          💡 <strong>Tip:</strong> You buy these items, bring them back, and earn ₱{netEarnings.toLocaleString()} ({Math.round((netEarnings / totalCost) * 100)}% profit)!
        </div>

        <CapitalDisplay mode="earn" amount={netEarnings} showLabel={true} />
      </div>
    </div>
  );
}
