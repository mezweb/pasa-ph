import { Suspense } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ShopContent from './ShopContent';

// Force dynamic rendering just in case
export const dynamic = 'force-dynamic';

export default function ShopPage() {
  return (
    <>
      <Navbar />
      
      <div style={{ background: '#f8f9fa', padding: '40px 20px', borderBottom: '1px solid #eaeaea' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Shop PasaBuy</h1>
            <p style={{ color: '#666' }}>Browse unique items from around the world, verified by travelers.</p>
        </div>
      </div>

      <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading shop items...</div>}>
        <ShopContent />
      </Suspense>

      <Footer />
    </>
  );
}