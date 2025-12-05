'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

// FAQ Data - Categorized
const FAQ_CATEGORIES = {
  'Getting Started': [
    {
      question: "How does Pasa.ph work?",
      answer: "Shoppers post requests for items they need from abroad. Verified travelers accept these requests, buy the items, and bring them back to the Philippines. Payments are held safely in escrow until delivery!"
    },
    {
      question: "How do I become a traveler?",
      answer: "Click 'Start Selling' in the navigation. You'll verify your identity, set up your profile, and start browsing shopper requests. It's that easy!"
    },
    {
      question: "What countries can I request items from?",
      answer: "Currently we support Japan, USA, South Korea, Singapore, Hong Kong, and Vietnam. More countries coming soon!"
    }
  ],
  'Payments & Safety': [
    {
      question: "Is my payment safe?",
      answer: "Absolutely! We use escrow protection. When you pay, your money is held safely by Pasa.ph. It's only released to the traveler after you confirm you've received your item."
    },
    {
      question: "What are the service fees?",
      answer: "Shoppers pay a small platform fee per transaction. Travelers earn a service fee (typically 10%) for bringing your items. No hidden charges!"
    },
    {
      question: "How do I get my money as a traveler?",
      answer: "Once you deliver the item and the shopper confirms receipt, payment is instantly available in your balance. You can withdraw anytime to your bank account or e-wallet!"
    }
  ],
  'Orders & Delivery': [
    {
      question: "How long does delivery take?",
      answer: "It depends on the traveler's schedule! Most items arrive within 1-3 weeks. You can message your traveler to get updates anytime."
    },
    {
      question: "Can I return an item?",
      answer: "Since items are bought specifically for you, returns are tricky. However, if the item is damaged or incorrect, contact our support team immediately and we'll help resolve it!"
    },
    {
      question: "What if my traveler cancels?",
      answer: "No worries! You'll receive a full refund if a traveler cancels. Your request will automatically be shown to other travelers."
    }
  ]
};

const QUICK_LINKS = [
  { icon: '📖', title: 'How It Works', description: 'Learn the basics', href: '/how-it-works' },
  { icon: '🔒', title: 'Trust & Safety', description: 'Our security measures', href: '/trust-and-safety' },
  { icon: '📝', title: 'Start Selling', description: 'Become a traveler', href: '/start-selling' },
  { icon: '💬', title: 'Contact Us', description: 'Get in touch', href: '#contact' }
];

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFAQ = (category, index) => {
    const key = `${category}-${index}`;
    setOpenFAQ(openFAQ === key ? null : key);
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            💬 Help Center
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', opacity: 0.95, maxWidth: '700px', margin: '0 auto 30px', lineHeight: '1.6' }}>
            We're here to help! Find answers below or reach out to our team.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>

        {/* QUICK LINKS */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', textAlign: 'center', marginBottom: '40px', color: '#333' }}>
            Quick Links
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {QUICK_LINKS.map((link, index) => (
              <Link key={index} href={link.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #eaeaea',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#0070f3';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#eaeaea';
                }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{link.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 5px', color: '#333' }}>{link.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ SECTION */}
        <div style={{ marginBottom: '80px', maxWidth: '900px', margin: '0 auto 80px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', textAlign: 'center', marginBottom: '50px', color: '#333' }}>
            Frequently Asked Questions
          </h2>

          {Object.entries(FAQ_CATEGORIES).map(([category, faqs]) => (
            <div key={category} style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: '#0070f3' }}>
                {category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, index) => {
                  const isOpen = openFAQ === `${category}-${index}`;
                  return (
                    <div key={index} style={{
                      background: 'white',
                      border: '1px solid #eaeaea',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: isOpen ? '0 4px 12px rgba(0,112,243,0.1)' : '0 2px 6px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease'
                    }}>
                      <button
                        onClick={() => toggleFAQ(category, index)}
                        style={{
                          width: '100%',
                          padding: '18px 25px',
                          background: isOpen ? '#f8f9fa' : 'white',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'background 0.2s'
                        }}
                      >
                        <span style={{ color: '#333' }}>{faq.question}</span>
                        <span style={{
                          fontSize: '1.5rem',
                          color: isOpen ? '#0070f3' : '#999',
                          fontWeight: '300',
                          transition: 'all 0.3s',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                          display: 'inline-block'
                        }}>
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{
                          padding: '0 25px 20px 25px',
                          background: 'white',
                          color: '#555',
                          lineHeight: '1.7',
                          borderTop: '1px solid #f0f0f0',
                          fontSize: '0.95rem'
                        }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT FORM */}
        <div id="contact" style={{ maxWidth: '700px', margin: '0 auto 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px', color: '#333' }}>
              Still Need Help?
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#666' }}>
              Can't find what you're looking for? Send us a message and we'll get back to you ASAP!
            </p>
          </div>

          {submitted ? (
            <div style={{
              padding: '50px 40px',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #d4edda 100%)',
              borderRadius: '16px',
              textAlign: 'center',
              border: '2px solid #c3e6cb',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>✓</div>
              <h3 style={{ color: '#2e7d32', marginBottom: '12px', fontSize: '1.5rem', fontWeight: '800' }}>Message Sent!</h3>
              <p style={{ color: '#155724', fontSize: '1.05rem', marginBottom: '25px' }}>
                Thanks for reaching out! Our support team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  background: 'white',
                  border: '2px solid #2e7d32',
                  color: '#2e7d32',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              border: '1px solid #eaeaea',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.95rem', color: '#333' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Juan Dela Cruz"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.95rem', color: '#333' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan@email.com"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.95rem', color: '#333' }}>
                    What can we help with? *
                  </label>
                  <select
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      background: 'white',
                      transition: 'border 0.2s',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                  >
                    <option value="">Select a topic...</option>
                    <option>General Question</option>
                    <option>Order Issue / Dispute</option>
                    <option>Payment Problem</option>
                    <option>Report a User</option>
                    <option>Account Help</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.95rem', color: '#333' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    placeholder="Tell us more about your issue..."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      minHeight: '140px',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#0070f3'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '16px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,112,243,0.3)'
                  }}
                >
                  Send Message →
                </button>
              </form>
            </div>
          )}
        </div>

        {/* CONTACT INFO */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
            Other Ways to Reach Us
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📧</div>
              <strong style={{ display: 'block', marginBottom: '5px' }}>Email</strong>
              <a href="mailto:support@pasa.ph" style={{ color: '#0070f3', textDecoration: 'none' }}>
                support@pasa.ph
              </a>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏰</div>
              <strong style={{ display: 'block', marginBottom: '5px' }}>Response Time</strong>
              <span style={{ color: '#666' }}>Within 24 hours</span>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
              <strong style={{ display: 'block', marginBottom: '5px' }}>Live Chat</strong>
              <span style={{ color: '#666' }}>Mon-Fri, 9AM-6PM PHT</span>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
