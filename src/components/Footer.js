'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'white', borderTop: '1px solid #eaeaea', padding: '60px 0 30px', marginTop: 'auto' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0070f3', marginBottom: '15px', display: 'block' }}>📦 Pasa.ph</span>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>The trusted peer-to-peer marketplace connecting global items to local doorsteps.</p>
                </div>
                <div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Company</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/about" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0070f3'} onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                About Us
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link href="/careers" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0070f3'} onMouseOut={(e) => e.currentTarget.style.color = '#666'}>
                                Careers
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                &copy; 2025 Pasa.ph. All rights reserved.
            </div>
        </div>
    </footer>
  );
}