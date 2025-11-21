'use client';

import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { POPULAR_PRODUCTS } from '../../../lib/products'; 

// --- MOCK DATA GENERATOR ---
const getSellerProfile = (id) => {
  const levels = [
    { lvl: 1, name: "Novice", color: "#888" },
    { lvl: 2, name: "Explorer", color: "#2e7d32" },
    { lvl: 3, name: "Pro", color: "#0070f3" },
    { lvl: 4, name: "Elite", color: "#d4af37" },
    { lvl: 5, name: "Legend", color: "#7b1fa2" }
  ];

  const sales = id.length * 12; 
  const trips = Math.floor(sales / 5);
  const rating = (4 + (id.length % 10) / 10).toFixed(1); 
  
  let levelObj = levels[0];
  if (sales > 100) levelObj = levels[4];
  else if (sales > 50) levelObj = levels[3];
  else if (sales > 25) levelObj = levels[2];
  else if (sales > 10) levelObj = levels[1];

  return {
    id,
    name: id,
    bio: `Hi! I'm ${id}. I travel frequently for business and leisure. I love finding unique items for my Pasa.ph customers!`,
    level: levelObj,
    stats: { sales, trips, rating },
    destinations: ['Japan', 'South Korea', 'Singapore', 'USA'].slice(0, (id.length % 4) + 1),
    joined: `202${id.length % 4}`,
    topItems: [
        { id: 's1', title: 'Tokyo Banana', price: 800, from: 'Japan', to: 'Manila', image: 'https://placehold.co/400x400/ffeeba/856404?text=Tokyo+Banana' },
        { id: 's2', title: 'Don Quijote Snacks', price: 500, from: 'Japan', to: 'Manila', image: 'https://placehold.co/400x400/ffeb3b/000000?text=Snacks' },
        { id: 's3', title: 'Rare KitKat', price: 300, from: 'Japan', to: 'Bulacan', image: 'https://placehold.co/400x400/d50000/ffffff?text=KitKat' }
    ]
  };
};

export default function SellerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const sellerName = decodeURIComponent(id);
  const seller = getSellerProfile(sellerName);

  // Helper to find product ID by title
  const getProductLink = (title) => {
    const found = POPULAR_PRODUCTS.find(p => p.title === title);
    return found ? `/product/${found.id}` : '#'; 
  };

  return (
    <>
      <Navbar />
      
      {/* PROFILE HEADER */}
      <div style={{ background: 'white', borderBottom: '1px solid #eaeaea' }}>
        <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Avatar & Level */}
                <div style={{ position: 'relative' }}>
                    <img 
                        src={`https://placehold.co/120x120/0070f3/ffffff?text=${seller.name.charAt(0)}`} 
                        style={{ width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${seller.level.color}` }}
                    />
                    <div style={{ 
                        position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                        background: seller.level.color, color: 'white', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        Level {seller.level.lvl}: {seller.level.name}
                    </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: '0 0 10px' }}>{seller.name}</h1>
                    <p style={{ color: '#666', marginBottom: '15px', maxWidth: '500px' }}>{seller.bio}</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {seller.destinations.map(dest => (
                            <span key={dest} style={{ background: '#f0f0f0', color: '#333', padding: '5px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                ✈️ {dest}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats Box */}
                <div style={{ display: 'flex', gap: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333' }}>{seller.stats.sales}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Sold</div>
                    </div>
                    <div style={{ width: '1px', background: '#ddd' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333' }}>{seller.stats.trips}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Trips</div>
                    </div>
                    <div style={{ width: '1px', background: '#ddd' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f09433' }}>{seller.stats.rating} ★</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Rating</div>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div style={{ background: '#f8f9fa', minHeight: '60vh', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Top Items & Recent Activity</h2>
                <button 
                    className="btn-primary" 
                    // UPDATED: Redirect to new Request Item page
                    onClick={() => router.push(`/request-item/${seller.name}`)}
                    style={{ fontSize: '0.9rem' }}
                >
                    Request Item from {seller.name}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {seller.topItems.map(item => (
                    <Link href={getProductLink(item.title)} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea', transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '180px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h4 style={{ margin: '0 0 5px' }}>{item.title}</h4>
                                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>{item.from} &rarr; {item.to}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: '#0070f3' }}>₱{item.price}</span>
                                    <span style={{ fontSize: '0.7rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px' }}>SOLD RECENTLY</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                
                <div style={{ background: 'white', borderRadius: '8px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#888', minHeight: '250px' }}>
                    <span style={{ fontSize: '2rem', marginBottom: '10px' }}>🛍️</span>
                    See all 50+ items sold
                </div>
            </div>

        </div>
      </div>

      <Footer />
    </>
  );
}