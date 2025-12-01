'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function TrustAndSafety() {
  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div className="container">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '15px' }}>
              🛡️ Trust & Safety
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: '0 auto' }}>
              Your security is our priority. Learn how we protect every transaction on Pasa.ph
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>

          {/* Escrow Protection */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>💰</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Payment Protection (Escrow)</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              All payments are held securely in <strong>escrow</strong> until you confirm you've received your item.
              This means sellers only get paid after successful delivery, protecting you from fraud and non-delivery.
            </p>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '15px', borderRadius: '8px' }}>
              <strong style={{ color: '#0070f3' }}>How it works:</strong>
              <ol style={{ marginTop: '10px', color: '#666', lineHeight: 1.8 }}>
                <li>You pay for your item</li>
                <li>Payment is held securely by Pasa.ph</li>
                <li>Traveler delivers your item</li>
                <li>You confirm receipt in the app</li>
                <li>Payment is released to the traveler</li>
              </ol>
            </div>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
              Learn more about our <Link href="/escrow-policy" style={{ color: '#0070f3', fontWeight: 'bold' }}>Escrow Policy</Link>
            </p>
          </section>

          {/* Verified Travelers */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>✅</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Verified Travelers</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              Every traveler on Pasa.ph must complete identity verification before they can accept requests.
              We verify:
            </p>
            <ul style={{ color: '#666', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li><strong>Government-issued ID</strong> - Passport or National ID</li>
              <li><strong>Phone number</strong> - SMS verification</li>
              <li><strong>Email address</strong> - Email confirmation</li>
              <li><strong>Travel documents</strong> - Flight confirmation when required</li>
            </ul>
            <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: '12px', borderRadius: '8px', marginTop: '15px', fontSize: '0.9rem', color: '#2e7d32' }}>
              <strong>✓ Verified</strong> badge means the traveler has completed all verification steps
            </div>
          </section>

          {/* Ratings & Reviews */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>⭐</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Ratings & Reviews System</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8 }}>
              After every completed transaction, both buyers and sellers can rate each other. This builds trust
              and helps you make informed decisions when choosing who to work with.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
              <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>📊 Traveler Reliability Score</div>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                  Based on delivery success rate, response time, and customer satisfaction
                </p>
              </div>
              <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🏆 Achievement Levels</div>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                  Standard → Gold → Platinum based on completed deliveries and ratings
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Items */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>🚫</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Prohibited Items</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              For everyone's safety, the following items are <strong>strictly prohibited</strong> on Pasa.ph:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>❌ Illegal Substances</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Drugs, controlled substances</div>
              </div>
              <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>❌ Weapons</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Firearms, knives, explosives</div>
              </div>
              <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>❌ Hazardous Materials</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Flammable, toxic, corrosive items</div>
              </div>
              <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>❌ Counterfeit Goods</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Fake designer items, pirated media</div>
              </div>
              <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>❌ Live Animals</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Pets, exotic animals</div>
              </div>
              <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>❌ Perishable Food</strong>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Items requiring refrigeration</div>
              </div>
            </div>
            <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
              <strong style={{ color: '#c62828' }}>⚠️ Violations Result in:</strong>
              <ul style={{ marginTop: '10px', marginBottom: 0, color: '#666' }}>
                <li>Immediate account suspension</li>
                <li>Refund of buyer's payment</li>
                <li>Potential legal action</li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>⚖️</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Dispute Resolution</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              If something goes wrong with your order, our dispute resolution team is here to help:
            </p>
            <ol style={{ color: '#666', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li><strong>Contact Support</strong> - Report the issue through the app</li>
              <li><strong>Provide Evidence</strong> - Photos, messages, receipts</li>
              <li><strong>Mediation</strong> - We work with both parties to find a solution</li>
              <li><strong>Resolution</strong> - Refund, replacement, or compensation</li>
            </ol>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link href="/support">
                <button className="btn-primary" style={{ padding: '12px 30px' }}>
                  Contact Support
                </button>
              </Link>
            </div>
          </section>

          {/* Data Privacy */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>🔒</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Data Privacy & Security</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8 }}>
              Your personal information is encrypted and stored securely. We never share your data with third
              parties without your consent. All transactions use bank-level encryption (256-bit SSL).
            </p>
            <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
              <Link href="/privacy-policy" style={{ color: '#0070f3', fontWeight: 'bold', marginRight: '20px' }}>
                Privacy Policy →
              </Link>
              <Link href="/terms" style={{ color: '#0070f3', fontWeight: 'bold' }}>
                Terms of Service →
              </Link>
            </div>
          </section>

          {/* Report Abuse */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem' }}>🚨</span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Report Suspicious Activity</h2>
            </div>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              If you encounter suspicious behavior, prohibited items, or fraudulent activity, report it immediately:
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link href="/support">
                <button className="btn-primary">
                  📧 Email Support
                </button>
              </Link>
              <a href="tel:+639123456789">
                <button style={{
                  background: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  📞 Call Hotline
                </button>
              </a>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}
