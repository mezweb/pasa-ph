import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Careers | Pasa.ph',
  description: 'Join the Pasa.ph team and help us revolutionize peer-to-peer commerce.',
};

export default function CareersPage() {
  return (
    <>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #0070f3 0%, #0051cc 100%)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div className="container">
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '15px' }}>Join Our Team</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
                Help us build the future of peer-to-peer commerce in the Philippines
            </p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 20px', maxWidth: '800px', textAlign: 'center' }}>

        <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '16px', padding: '60px 40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px', color: '#333' }}>
            We're Building Something Great
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
            Pasa.ph is on a mission to connect people around the world through trusted peer-to-peer commerce.
            We're a passionate team creating innovative solutions that make global shopping accessible to everyone.
          </p>

          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '40px', marginTop: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#333' }}>
              Openings Coming Soon
            </h3>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '25px' }}>
              We're currently building our team and will be posting opportunities soon.
              Stay tuned for exciting positions in engineering, design, customer success, and more!
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: 'white', padding: '15px 25px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Engineering</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0070f3' }}>Coming Soon</div>
              </div>
              <div style={{ background: 'white', padding: '15px 25px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Design</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0070f3' }}>Coming Soon</div>
              </div>
              <div style={{ background: 'white', padding: '15px 25px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Operations</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0070f3' }}>Coming Soon</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '50px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#333' }}>
              Interested in Joining Us?
            </h3>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '25px' }}>
              Send us your resume and why you'd love to work with Pasa.ph
            </p>
            <Link href="/support" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Get in Touch
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '60px', padding: '40px', background: '#f8f9fa', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
            Why Work at Pasa.ph?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌟</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Make an Impact</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Build products that empower communities</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚀</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Fast Growth</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Rapid learning in a startup environment</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤝</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Amazing Team</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Work with passionate, talented people</div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
