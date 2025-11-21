import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How it Works | Pasa.ph',
  description: 'Learn how to request items or earn money as a seller on Pasa.ph.',
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      
      <div style={{ background: '#f8f9fa', padding: '60px 20px', textAlign: 'center', borderBottom: '1px solid #eaeaea' }}>
        <div className="container">
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>How Pasa.ph Works</h1>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
                The smartest way to shop globally or earn while you travel.
            </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', marginBottom: '80px' }}>
            
            {/* FOR BUYERS */}
            <div>
                <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>🛒 For Buyers</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={stepCardStyle}>
                        <span style={stepNumberStyle}>1</span>
                        <div>
                            <strong>Create a Request</strong>
                            <p style={stepDescStyle}>Post the item you need. Be specific about the brand, size, and store.</p>
                        </div>
                    </div>
                    <div style={stepCardStyle}>
                        <span style={stepNumberStyle}>2</span>
                        <div>
                            <strong>Get Matched</strong>
                            <p style={stepDescStyle}>Sellers view your request on their dashboard. Top sellers get priority access.</p>
                        </div>
                    </div>
                    <div style={stepCardStyle}>
                        <span style={stepNumberStyle}>3</span>
                        <div>
                            <strong>Receive & Pay</strong>
                            <p style={stepDescStyle}>Once delivered, payment is released from Escrow to the seller.</p>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Link href="/requests" className="btn-primary">Start Requesting</Link>
                </div>
            </div>

            {/* FOR SELLERS */}
            <div>
                <h2 style={{ color: '#2e7d32', marginBottom: '20px' }}>✈️ For Sellers</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={stepCardStyle}>
                        <span style={stepNumberStyle}>1</span>
                        <div>
                            <strong>Access Seller Dashboard</strong>
                            <p style={stepDescStyle}>View a live feed of items people need from your destination.</p>
                        </div>
                    </div>
                    <div style={stepCardStyle}>
                        <span style={stepNumberStyle}>2</span>
                        <div>
                            <strong>Claim Orders</strong>
                            <p style={stepDescStyle}>Accept requests you can fulfill. <span style={{color:'#d4af37', fontWeight:'bold'}}>Gold Members</span> see high-value items first.</p>
                        </div>
                    </div>
                    <div style={stepCardStyle}>
                        <span style={stepNumberStyle}>3</span>
                        <div>
                            <strong>Deliver & Earn</strong>
                            <p style={stepDescStyle}>Meet the buyer, hand over the item, and get paid instantly.</p>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Link href="/seller-dashboard" className="btn-primary" style={{ background: '#2e7d32' }}>Go to Dashboard</Link>
                </div>
            </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '60px 0' }} />

        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Seller Membership Tiers</h2>
            <p style={{ color: '#666' }}>Unlock exclusive access to high-ticket requests.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            
            {/* STANDARD */}
            <div style={{ ...pricingCardStyle, border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px' }}>Standard</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333' }}>Free</div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '10px 0 20px' }}>For casual travelers.</p>
                <ul style={{ listStyle: 'none', textAlign: 'left', color: '#555', fontSize: '0.95rem', lineHeight: '2' }}>
                    <li>✅ Access to Standard Requests</li>
                    <li>✅ Basic Profile</li>
                    <li>✅ 5% Platform Fee</li>
                </ul>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', background: '#eee', color: '#333', justifyContent: 'center' }}>Current Plan</button>
            </div>

            {/* GOLD TIER */}
            <div style={pricingCardStyle}>
                <div style={{ background: '#d4af37', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
                    RECOMMENDED
                </div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px' }}>Gold</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333' }}>₱199<span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#888' }}>/mo</span></div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '10px 0 20px' }}>For serious sellers.</p>
                <ul style={{ listStyle: 'none', textAlign: 'left', color: '#555', fontSize: '0.95rem', lineHeight: '2' }}>
                    <li>✅ <strong>Priority Access</strong> to High-Value Requests</li>
                    <li>✅ Verified Gold Badge</li>
                    <li>✅ 0% Platform Fee (First 5)</li>
                </ul>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', background: '#d4af37', justifyContent: 'center' }}>Upgrade to Gold</button>
            </div>

            {/* DIAMOND TIER */}
            <div style={{ ...pricingCardStyle, border: '2px solid #00c3ff', transform: 'scale(1.05)' }}>
                <div style={{ background: '#00c3ff', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
                    PRO BUSINESS
                </div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px' }}>Diamond</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333' }}>₱499<span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#888' }}>/mo</span></div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '10px 0 20px' }}>For power sellers.</p>
                <ul style={{ listStyle: 'none', textAlign: 'left', color: '#555', fontSize: '0.95rem', lineHeight: '2' }}>
                    <li>💎 <strong>First Dibs</strong> on ALL Requests</li>
                    <li>💎 Unlimited 0% Fee Transactions</li>
                    <li>💎 TikTok Live Selling Support</li>
                    <li>💎 Dedicated Account Manager</li>
                </ul>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', background: '#00c3ff', justifyContent: 'center' }}>Upgrade to Diamond</button>
            </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

const stepCardStyle = {
    display: 'flex', gap: '15px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', alignItems: 'start'
};
const stepNumberStyle = {
    background: '#eee', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', flexShrink: 0
};
const stepDescStyle = {
    margin: '5px 0 0', fontSize: '0.9rem', color: '#666'
};
const pricingCardStyle = {
    background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eee', width: '100%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center'
};