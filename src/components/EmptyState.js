'use client';

export default function EmptyState({ icon = '📦', title, description, actionLabel, onAction, secondaryLabel, onSecondary }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #eee'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.7 }}>
        {icon}
      </div>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '0.95rem',
        color: '#666',
        marginBottom: '25px',
        lineHeight: '1.6',
        maxWidth: '400px',
        margin: '0 auto 25px'
      }}>
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
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
          {actionLabel}
        </button>
      )}

      {onSecondary && secondaryLabel && (
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
            marginLeft: '10px'
          }}
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  );
}
