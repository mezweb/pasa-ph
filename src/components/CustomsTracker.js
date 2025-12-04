'use client';

export default function CustomsTracker({ items }) {
  const DE_MINIMIS_LIMIT = 10000; // PHP

  // Calculate total value
  const totalValue = items.reduce((sum, item) => {
    if (item.status === 'delivered') return sum; // Don't count delivered items
    return sum + (item.targetPrice || item.price || 0);
  }, 0);

  const percentage = Math.min((totalValue / DE_MINIMIS_LIMIT) * 100, 100);
  const isNearLimit = percentage >= 75;
  const isOverLimit = totalValue > DE_MINIMIS_LIMIT;

  return (
    <div style={{
      background: isOverLimit ? '#ffebee' : isNearLimit ? '#fff3e0' : 'white',
      border: `1px solid ${isOverLimit ? '#ef5350' : isNearLimit ? '#ff9800' : '#eaeaea'}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🛃</span>
          <span>Customs De Minimis Tracker</span>
        </h3>
        <div style={{
          fontSize: '0.75rem',
          color: '#666',
          background: '#f0f0f0',
          padding: '4px 10px',
          borderRadius: '6px'
        }}>
          Limit: ₱{DE_MINIMIS_LIMIT.toLocaleString()}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '24px',
        background: '#f0f0f0',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '12px'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: isOverLimit
            ? 'linear-gradient(90deg, #ef5350 0%, #d32f2f 100%)'
            : isNearLimit
            ? 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)'
            : 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)',
          transition: 'width 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Value display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px' }}>
            Current Total Value
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: isOverLimit ? '#d32f2f' : isNearLimit ? '#f57c00' : '#2e7d32'
          }}>
            ₱{totalValue.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px' }}>
            Remaining
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: isOverLimit ? '#d32f2f' : '#666'
          }}>
            ₱{Math.max(0, DE_MINIMIS_LIMIT - totalValue).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Warning messages */}
      {isOverLimit && (
        <div style={{
          background: '#d32f2f',
          color: 'white',
          padding: '10px 12px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          marginTop: '12px'
        }}>
          <strong>⚠️ Over De Minimis Limit!</strong>
          <div style={{ marginTop: '4px', opacity: 0.95 }}>
            You may be charged customs duties and taxes on items over ₱10,000.
            Consider removing some items or splitting into multiple trips.
          </div>
        </div>
      )}

      {isNearLimit && !isOverLimit && (
        <div style={{
          background: '#ff9800',
          color: 'white',
          padding: '10px 12px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          marginTop: '12px'
        }}>
          <strong>⚡ Approaching Limit</strong>
          <div style={{ marginTop: '4px', opacity: 0.95 }}>
            You're at {percentage.toFixed(0)}% of the tax-free limit.
            Be careful when accepting more requests!
          </div>
        </div>
      )}

      {/* Info note */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: '#f0f9ff',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#0077b6'
      }}>
        💡 <strong>De Minimis Rule:</strong> Items valued at ₱10,000 or less are generally tax-free.
        Values above this may incur customs duties (~20-30%).
      </div>
    </div>
  );
}
