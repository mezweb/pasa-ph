import './globals.css';
import { CartProvider } from '../context/CartContext';
import CartPopup from '../components/CartPopup';
import BottomNavigation from '../components/BottomNavigation';
import BackToTop from '../components/BackToTop';

export const metadata = {
  title: 'Pasa.ph - Pasabuy Marketplace',
  description: 'The trusted peer-to-peer pasabuy marketplace.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: '#0070f3',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pasa.ph'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#0070f3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <CartProvider>
            {children}
            <CartPopup />
            <BottomNavigation />
            <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}