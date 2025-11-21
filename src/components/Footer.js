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
                    <ul style={{ color: '#666', fontSize: '0.9rem', lineHeight: '2' }}>
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Press</li>
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