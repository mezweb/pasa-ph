'use client';

import Link from 'next/link';

export default function Breadcrumb({ items }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
      color: '#666',
      padding: '10px 0',
      marginBottom: '15px'
    }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.href ? (
            <Link
              href={item.href}
              style={{
                color: '#0070f3',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#005bb5'}
              onMouseOut={(e) => e.target.style.color = '#0070f3'}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#333', fontWeight: '500' }}>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span style={{ color: '#ccc' }}>›</span>
          )}
        </div>
      ))}
    </nav>
  );
}
