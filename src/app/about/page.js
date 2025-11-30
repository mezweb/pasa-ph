import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Pasa.ph',
  description: 'Learn about Pasa.ph and our mission to revolutionize peer-to-peer commerce.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div className="container">
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '15px' }}>About Pasa.ph</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
                Connecting the world through trusted peer-to-peer commerce
            </p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 20px' }}>

        {/* Our Story */}
        <div style={{ maxWidth: '800px', margin: '0 auto 80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '30px' }}>Our Story</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
            Pasa.ph was born from a simple idea: what if we could make global shopping accessible to everyone
            in the Philippines by connecting buyers with travelers?
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
            We noticed that Filipinos love international products, but traditional shipping can be expensive
            and complicated. Meanwhile, travelers flying to the Philippines often have extra luggage space.
            Why not connect these two groups?
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555' }}>
            Today, Pasa.ph is the trusted marketplace where thousands of Filipinos get their favorite items
            from around the world, delivered by verified travelers who earn money along the way.
          </p>
        </div>

        {/* Our Mission */}
        <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '60px 40px', marginBottom: '80px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>Our Mission</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555', maxWidth: '700px', margin: '0 auto' }}>
            To make global commerce accessible, affordable, and sustainable by building a community-driven
            marketplace that benefits both buyers and travelers.
          </p>
        </div>

        {/* Our Values */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center' }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤝</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px' }}>Trust First</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                We verify every seller and protect every transaction with escrow, ensuring a safe marketplace for everyone.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌍</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px' }}>Community Driven</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                We're building more than a marketplace—we're creating a global community of buyers and travelers helping each other.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💡</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px' }}>Innovation</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                We constantly improve our platform with new features, better tools, and smarter ways to connect people.
              </p>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)', borderRadius: '16px', padding: '60px 40px', marginBottom: '80px', color: 'white' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center' }}>Pasa.ph by the Numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>10,000+</div>
              <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Happy Buyers</div>
            </div>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>500+</div>
              <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Verified Sellers</div>
            </div>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>15+</div>
              <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Countries Connected</div>
            </div>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>₱10M+</div>
              <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Total Transactions</div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>Ready to Join Our Community?</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
            Whether you're shopping globally or earning while traveling, we're here to help.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>
              Start Shopping
            </Link>
            <Link href="/start-selling" className="btn-primary" style={{ background: '#2e7d32', textDecoration: 'none' }}>
              Become a Seller
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
