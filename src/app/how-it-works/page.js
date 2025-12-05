import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How it Works | Pasa.ph',
  description: 'Learn how to request items or earn money as a traveler on Pasa.ph.',
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div className="container">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              ✈️ How Pasa.ph Works
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: '0 auto 30px', lineHeight: '1.6' }}>
              Your personal shopper from around the world.<br/>Shop globally or earn while you travel.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="#for-shoppers" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '15px 30px', background: 'white', color: '#667eea', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  🛍️ I Want to Shop
                </button>
              </Link>
              <Link href="#for-travelers" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                  ✈️ I Want to Earn
                </button>
              </Link>
            </div>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>

        {/* FOR SHOPPERS */}
        <div id="for-shoppers" style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>For Shoppers</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', margin: '20px 0 15px', color: '#333' }}>
              🛍️ Get Items from Anywhere
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Want something from Japan, USA, or Korea? We'll bring it to you!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <span style={{ fontSize: '2rem' }}>📝</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>1. Post Your Request</h3>
                <p style={stepDescStyle}>
                  Tell us what you need - brand, size, color, store. The more details, the better!
                </p>
              </div>
            </div>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <span style={{ fontSize: '2rem' }}>🤝</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>2. Match with a Traveler</h3>
                <p style={stepDescStyle}>
                  Verified travelers heading to the Philippines see your request and accept it.
                </p>
              </div>
            </div>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <span style={{ fontSize: '2rem' }}>💰</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>3. Pay with Escrow</h3>
                <p style={stepDescStyle}>
                  Your payment is held safely. Released only when you receive your item!
                </p>
              </div>
            </div>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                <span style={{ fontSize: '2rem' }}>📦</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>4. Get Your Item</h3>
                <p style={stepDescStyle}>
                  Meet up in Metro Manila or have it shipped to your province. Easy!
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/requests">
              <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '30px', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,112,243,0.3)' }}>
                Start Shopping Now →
              </button>
            </Link>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '2px solid #f0f0f0', margin: '80px 0' }} />

        {/* FOR TRAVELERS */}
        <div id="for-travelers" style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ background: '#fff3e0', color: '#f57c00', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>For Travelers</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', margin: '20px 0 15px', color: '#333' }}>
              ✈️ Earn While You Travel
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Turn your next trip into extra income. Offset your travel costs!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                <span style={{ fontSize: '2rem' }}>🗓️</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>1. Register Your Trip</h3>
                <p style={stepDescStyle}>
                  Going to Tokyo? NYC? Seoul? Tell us when and where you're flying!
                </p>
              </div>
            </div>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                <span style={{ fontSize: '2rem' }}>📋</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>2. Browse Requests</h3>
                <p style={stepDescStyle}>
                  See what people need from your destination. Pick what fits your luggage!
                </p>
              </div>
            </div>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
                <span style={{ fontSize: '2rem' }}>🛒</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>3. Shop & Bring It Home</h3>
                <p style={stepDescStyle}>
                  Buy the items abroad, pack them in your luggage, and bring them back.
                </p>
              </div>
            </div>

            <div style={stepCardStyle}>
              <div style={{ ...iconCircleStyle, background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
                <span style={{ fontSize: '2rem' }}>💵</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 10px', color: '#333' }}>4. Deliver & Get Paid</h3>
                <p style={stepDescStyle}>
                  Hand over the item, and instantly receive payment + your traveler's fee!
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/start-selling">
              <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '30px', justifyContent: 'center', background: '#f57c00', boxShadow: '0 4px 15px rgba(245,124,0,0.3)' }}>
                Start Earning Now →
              </button>
            </Link>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '2px solid #f0f0f0', margin: '80px 0' }} />

        {/* TRUST & SAFETY */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', padding: '60px 40px', color: 'white', textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', fontWeight: '900', marginBottom: '20px' }}>
            🔒 Safe & Secure
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            Your safety is our priority. All travelers are verified, and payments are held in escrow until delivery.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✅</div>
              <strong style={{ fontSize: '1.1rem' }}>ID Verification</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '8px' }}>All travelers verified</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔐</div>
              <strong style={{ fontSize: '1.1rem' }}>Escrow Protection</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '8px' }}>Payment held safely</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⭐</div>
              <strong style={{ fontSize: '1.1rem' }}>Ratings & Reviews</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '8px' }}>Track traveler reputation</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💬</div>
              <strong style={{ fontSize: '1.1rem' }}>24/7 Support</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '8px' }}>We're here to help</p>
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '20px', color: '#333' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
            Join thousands of shoppers and travelers on Pasa.ph
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup?role=buyer">
              <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '30px', justifyContent: 'center' }}>
                Sign Up as Shopper
              </button>
            </Link>
            <Link href="/signup?role=seller">
              <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '30px', justifyContent: 'center', background: '#f57c00' }}>
                Sign Up as Traveler
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const stepCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  background: 'white',
  padding: '30px',
  borderRadius: '16px',
  border: '1px solid #eaeaea',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  cursor: 'default'
};

const iconCircleStyle = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  flexShrink: 0
};

const stepDescStyle = {
  margin: '0',
  fontSize: '0.95rem',
  color: '#666',
  lineHeight: '1.6'
};
