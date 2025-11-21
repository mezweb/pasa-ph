'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// FAQ Data
const FAQS = [
    { 
        question: "How does Pasa.ph work?", 
        answer: "Buyers post requests for items they need from abroad. Verified travelers (Sellers) accept these requests, buy the items, and deliver them to the buyer. Payments are held in escrow until delivery is confirmed." 
    },
    { 
        question: "Is my payment safe?", 
        answer: "Yes! We use an Escrow system. When you pay, the money is held by Pasa.ph. It is only released to the Seller after you confirm that you have received your item." 
    },
    { 
        question: "How do I become a Seller?", 
        answer: "Click on 'Start Selling' in the navigation bar. You will need to verify your identity and set up your profile before you can accept requests." 
    },
    { 
        question: "What are the service fees?", 
        answer: "Standard users pay a small platform fee per transaction. Gold and Diamond members enjoy 0% fees on their first few transactions and other benefits." 
    },
    { 
        question: "Can I return an item?", 
        answer: "Since items are bought specifically for you, returns are generally not accepted unless the item is damaged or incorrect. Please coordinate with our support team if there is an issue." 
    }
];

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); // Track open FAQ

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
        
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Help Center</h1>
        <p style={{ color: '#666', marginBottom: '50px', textAlign: 'center' }}>
            Find answers to common questions or contact our support team.
        </p>

        {/* --- FAQ SECTION --- */}
        <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FAQS.map((faq, index) => (
                    <div key={index} style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
                        <button 
                            onClick={() => toggleFAQ(index)}
                            style={{ 
                                width: '100%', 
                                padding: '15px 20px', 
                                background: 'white', 
                                border: 'none', 
                                textAlign: 'left', 
                                fontSize: '1rem', 
                                fontWeight: '600', 
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            {faq.question}
                            <span style={{ fontSize: '1.2rem', color: '#0070f3' }}>{openIndex === index ? '−' : '+'}</span>
                        </button>
                        
                        {openIndex === index && (
                            <div style={{ padding: '0 20px 20px 20px', background: 'white', color: '#555', lineHeight: '1.6', borderTop: '1px solid #f0f0f0' }}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '40px 0' }} />

        {/* --- CONTACT FORM --- */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>Still need help? Contact Us</h2>

            {submitted ? (
                <div style={{ padding: '40px', background: '#e8f5e9', borderRadius: '12px', textAlign: 'center', border: '1px solid #c8e6c9' }}>
                    <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>Message Sent!</h3>
                    <p style={{ color: '#555' }}>Thank you for contacting us. Our support team will get back to you shortly.</p>
                    <button 
                        onClick={() => setSubmitted(false)} 
                        style={{ marginTop: '20px', background: 'none', border: 'none', color: '#2e7d32', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Name</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Your Name"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Email</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="your@email.com"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Subject</label>
                            <select style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
                                <option>General Inquiry</option>
                                <option>Order Issue</option>
                                <option>Report a User</option>
                                <option>Feedback</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Message</label>
                            <textarea 
                                required 
                                placeholder="How can we help you?"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', minHeight: '120px', fontFamily: 'inherit' }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                        >
                            Submit Ticket
                        </button>
                    </form>
                </div>
            )}
            
            <div style={{ marginTop: '40px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                <p>Or email us directly at <a href="mailto:support@pasa.ph" style={{ color: '#0070f3' }}>support@pasa.ph</a></p>
            </div>
        </div>

      </div>
      <Footer />
    </>
  );
}