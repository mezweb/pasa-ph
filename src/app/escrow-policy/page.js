'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function EscrowPolicy() {
  return (
    <>
      <Navbar />
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div className="container">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '15px' }}>
              💰 Escrow Policy
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: '0 auto' }}>
              100% Payment Protection - You only pay when you receive your item
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>

          {/* What is Escrow */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>What is Escrow?</h2>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              <strong>Escrow</strong> is a secure payment method where Pasa.ph holds your money until you confirm
              you've received your item. This protects both buyers and sellers by ensuring fair transactions.
            </p>
            <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: '20px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '10px', fontSize: '1.1rem' }}>
                🛡️ You're Protected When:
              </div>
              <ul style={{ color: '#666', lineHeight: 1.8, marginBottom: 0 }}>
                <li>Item never arrives</li>
                <li>Item is significantly different from description</li>
                <li>Item is damaged or defective</li>
                <li>Seller doesn't respond after payment</li>
              </ul>
            </div>
          </section>

          {/* How Escrow Works */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>How Escrow Works</h2>

            <div style={{ position: 'relative', paddingLeft: '30px', borderLeft: '3px solid #0070f3' }}>
              {[
                {
                  step: 1,
                  title: 'Buyer Places Order',
                  description: 'You find an item you want and submit a request or checkout.',
                  icon: '🛒'
                },
                {
                  step: 2,
                  title: 'Payment Held in Escrow',
                  description: 'Your payment is securely held by Pasa.ph (not sent to the seller yet).',
                  icon: '🔒'
                },
                {
                  step: 3,
                  title: 'Seller Confirms & Ships',
                  description: 'Traveler accepts your request and purchases/ships the item.',
                  icon: '✈️'
                },
                {
                  step: 4,
                  title: 'You Receive Item',
                  description: 'Traveler delivers the item to your specified location.',
                  icon: '📦'
                },
                {
                  step: 5,
                  title: 'You Confirm Receipt',
                  description: 'You inspect the item and click "Confirm Receipt" in the app.',
                  icon: '✅'
                },
                {
                  step: 6,
                  title: 'Payment Released',
                  description: 'Pasa.ph releases payment to the traveler. Transaction complete!',
                  icon: '💸'
                }
              ].map((item, index) => (
                <div key={index} style={{ position: 'relative', marginBottom: '30px', paddingLeft: '15px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-42px',
                    top: '0',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#0070f3',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    border: '4px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px', color: '#333' }}>
                      Step {item.step}: {item.title}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.95rem' }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Escrow Fees */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Service Fees</h2>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '20px' }}>
              Pasa.ph charges a small service fee to maintain our secure escrow system and platform:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '5px' }}>10%</div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Service Fee</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  Added to item price at checkout
                </div>
              </div>
              <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', border: '1px solid #a5d6a7' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>₱0</div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Escrow Fee</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  Payment protection is FREE
                </div>
              </div>
            </div>
            <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '0.9rem' }}>
              <strong>💡 Example:</strong> If item costs ₱1,000, you pay ₱1,100 total (₱1,000 + ₱100 service fee).
              The seller receives ₱1,000 after delivery.
            </div>
          </section>

          {/* Refund Policy */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Refund Policy</h2>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              You are eligible for a <strong>full refund</strong> in the following cases:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span>✅</span>
                <div>
                  <strong>Item Not Received</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Seller doesn't deliver within agreed timeframe</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span>✅</span>
                <div>
                  <strong>Item Not as Described</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Significantly different from listing (wrong size, color, model, etc.)</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span>✅</span>
                <div>
                  <strong>Damaged or Defective</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Item arrives broken, damaged, or doesn't work</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span>✅</span>
                <div>
                  <strong>Counterfeit Item</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Item is proven to be fake or unauthorized</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span>✅</span>
                <div>
                  <strong>Seller Cancellation</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Seller cancels order after payment</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
              <strong style={{ color: '#c62828' }}>⚠️ Refunds Not Available When:</strong>
              <ul style={{ marginTop: '10px', marginBottom: 0, color: '#666', fontSize: '0.9rem' }}>
                <li>You already confirmed receipt and released payment</li>
                <li>You changed your mind after receiving the correct item</li>
                <li>Minor cosmetic differences that were disclosed</li>
                <li>Item is as described but you don't like it personally</li>
              </ul>
            </div>
          </section>

          {/* Dispute Timeline */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Dispute & Resolution Timeline</h2>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '20px' }}>
              If you need to file a dispute:
            </p>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <strong>📅 Within 7 Days</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    Report issue to Pasa.ph support after receiving item
                  </div>
                </div>
                <div>
                  <strong>🔍 24-48 Hours</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    Our team reviews your case and requests evidence
                  </div>
                </div>
                <div>
                  <strong>⚖️ 3-5 Business Days</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    Investigation and mediation between parties
                  </div>
                </div>
                <div>
                  <strong>✅ Resolution</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    Refund issued or alternative solution provided
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* For Sellers */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>For Sellers / Travelers</h2>
            <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
              As a seller/traveler, escrow also protects you:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💵</div>
                <strong>Guaranteed Payment</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                  Payment is already secured when you accept an order
                </div>
              </div>
              <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛡️</div>
                <strong>Fraud Protection</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                  No chargebacks or payment reversals after delivery
                </div>
              </div>
              <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📸</div>
                <strong>Evidence Matters</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                  Photo proof of delivery protects you from false claims
                </div>
              </div>
            </div>
            <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '0.9rem' }}>
              <strong>📝 Pro Tip:</strong> Always take photos/videos during packaging and handoff to protect yourself
              in case of disputes.
            </div>
          </section>

          {/* Contact */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Questions About Escrow?</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Our support team is here to help you understand how escrow works
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/support">
                <button className="btn-primary">
                  Contact Support
                </button>
              </Link>
              <Link href="/trust-and-safety">
                <button style={{
                  background: 'white',
                  color: '#0070f3',
                  border: '2px solid #0070f3',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  Trust & Safety
                </button>
              </Link>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}
