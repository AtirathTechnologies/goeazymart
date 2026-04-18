import React from 'react';
import { testimonials } from '../data/productsData';
import 'bootstrap/dist/css/bootstrap.min.css';

const TestimonialsSection = () => {
  const duplicated = [...testimonials, ...testimonials];
  
  return (
    <section className="testimonials-section py-5" id="testimonials" style={{ background: '#fffdf8', color: '#111' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="text-center">
          <div className="section-tag d-inline-flex align-items-center justify-content-center" style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50px',
            padding: '5px 20px',
            marginBottom: '20px',
            color: 'var(--gold-light)'
          }}>Testimonials</div>
          <h2 className="section-title mb-3" style={{ color: 'var(--gold)' }}>Trusted by <span style={{ color: 'var(--gold)' }}>500+ Businesses</span></h2>
          <p className="mx-auto" style={{ fontSize: '1rem', color: 'var(--gold)', maxWidth: '600px', lineHeight: 1.6 }}>What our B2B partners say about working with us.</p>
        </div>
        
        <div className="position-relative overflow-hidden mt-5">
          <div style={{
            display: 'flex',
            gap: '24px',
            width: 'max-content',
            animation: 'scrollTesti 40s linear infinite'
          }} className="testi-track">
            {duplicated.map((t, i) => (
              <div key={i} className="testi-card" style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '28px',
                minWidth: '300px',
                maxWidth: '350px',
                flexShrink: 0,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
              }}>
                <div className="mb-3" style={{ color: 'var(--gold)', fontSize: '1rem', letterSpacing: '2px' }}>★★★★★</div>
                <p className="mb-3" style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.75, fontStyle: 'italic' }}>"{t.text}"</p>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                    background: t.color
                  }}>{t.avatar}</div>
                  <div>
                    <div className="fw-bold" style={{ color: '#111', fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#777' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scrollTesti {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .testimonials-section .overflow-hidden:hover .testi-track {
          animation-play-state: paused !important;
        }
        
        .testi-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
          border-color: rgba(200, 151, 43, 0.4);
        }
        
        /* Bootstrap responsive overrides */
        @media (max-width: 768px) {
          .testi-card {
            min-width: 280px !important;
            padding: 20px !important;
          }
          
          .section-title {
            font-size: 1.75rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .testi-card {
            min-width: 260px !important;
            padding: 16px !important;
          }
          
          .testimonials-section .container {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;