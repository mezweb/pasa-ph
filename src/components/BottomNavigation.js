'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Search', path: '/search' },
    { icon: '📦', label: 'Orders', path: '/buyer-dashboard' },
    { icon: '👤', label: 'Profile', path: '/seller-dashboard' }
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav
        style={{
          position: 'fixed',
          bottom: isVisible ? 0 : '-80px',
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #eaeaea',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
          zIndex: 9999,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          transition: 'bottom 0.3s ease-in-out'
        }}
        className="mobile-only"
      >
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive(item.path) ? '#0070f3' : '#666',
              transition: 'color 0.2s',
              minHeight: '56px'
            }}
          >
            <span style={{ fontSize: '24px' }}>{item.icon}</span>
            <span style={{
              fontSize: '11px',
              fontWeight: isActive(item.path) ? '600' : '400'
            }}>
              {item.label}
            </span>
            {isActive(item.path) && (
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#0070f3',
                marginTop: '2px'
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Add padding to body to account for bottom nav */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-only {
            display: grid !important;
          }
          body {
            padding-bottom: 80px;
          }
        }
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
