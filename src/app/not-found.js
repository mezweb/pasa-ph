'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Custom 404 Not Found page with "Lost Luggage" illustration
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Lost Luggage Illustration */}
        <div style={{
          fontSize: '8rem',
          marginBottom: '20px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          🧳
        </div>

        {/* 404 Error */}
        <h1 style={{
          fontSize: '6rem',
          fontWeight: '900',
          color: '#667eea',
          margin: '0',
          lineHeight: '1',
          marginBottom: '10px'
        }}>
          404
        </h1>

        {/* Main Message */}
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#333',
          marginBottom: '15px'
        }}>
          Lost Luggage!
        </h2>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          Oops! This page seems to have gotten lost in transit. <br />
          Don't worry, we'll help you find your way back!
        </p>

        {/* Helpful Suggestions */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#666',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            💡 Try these instead:
          </div>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '0.95rem',
            color: '#333'
          }}>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                🏠 Go to Homepage
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/shop" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                🛍️ Browse Marketplace
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/offers" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                ✈️ Find Travelers
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/support" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                💬 Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'white',
              border: '2px solid #667eea',
              color: '#667eea',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            ← Go Back
          </button>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              Take Me Home 🏠
            </button>
          </Link>
        </div>

        {/* Error Code */}
        <div style={{
          marginTop: '30px',
          fontSize: '0.85rem',
          color: '#999'
        }}>
          Error Code: <span style={{ fontFamily: 'monospace', color: '#667eea' }}>PAGE_NOT_FOUND</span>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 4rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          .luggage {
            font-size: 5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
