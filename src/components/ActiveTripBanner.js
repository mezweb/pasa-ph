'use client';

export default function ActiveTripBanner({ from, to, date, onEdit }) {
  if (!from || !to) return null;

  const getFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Hong Kong': '🇭🇰',
      'Philippines': '🇵🇭',
      'Manila': '🇵🇭',
      'MNL': '🇵🇭'
    };
    return flags[country] || '✈️';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderRadius: '8px',
      margin: '10px 0',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        <span style={{ fontSize: '1.2rem' }}>✈️</span>
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Current Trip:</div>
          <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {getFlag(from)} {from} → {getFlag(to)} {to}
          </div>
        </div>
        {date && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem'
          }}>
            📅 {date}
          </div>
        )}
      </div>

      {onEdit && (
        <button
          onClick={onEdit}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
          }}
        >
          Edit Trip
        </button>
      )}
    </div>
  );
}
