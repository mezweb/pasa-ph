import './globals.css';
import { CartProvider } from '../context/CartContext'; // Import Provider
import CartPopup from '../components/CartPopup'; // Import CartPopup

export const metadata = {
  title: 'Pasa.ph - Pasabuy Marketplace',
  description: 'The trusted peer-to-peer pasabuy marketplace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
            {children}
            <CartPopup />
        </CartProvider>
      </body>
    </html>
  );
}