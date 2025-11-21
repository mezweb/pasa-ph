import './globals.css';
import { CartProvider } from '../context/CartContext'; // Import Provider

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
        </CartProvider>
      </body>
    </html>
  );
}