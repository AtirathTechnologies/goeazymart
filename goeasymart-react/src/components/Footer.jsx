import React from 'react';
import logo from '../assets/logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: '#faf6ee',
      color: '#555',
      padding: '60px 0 30px'
    }}>
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Column 1 - Logo & Description */}
          <div className="col-lg-6 col-md-12">
            <a href="#" className="logo d-flex align-items-center gap-3 text-decoration-none mb-4">
              <div style={{ width: '250px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo} alt="Goeasymart Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </a>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666', maxWidth: '500px' }}>India's trusted international commodity trading company, connecting global buyers to premium quality products across 40+ countries with reliability, transparency, and speed.</p>
          </div>

          {/* Column 2 - Products */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '20px' }}>Products</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Rice & Grains</a></li>
              <li className="mb-2"><a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Spices & Seeds</a></li>
              <li className="mb-2"><a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Oils & Dairy</a></li>
              <li className="mb-2"><a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Herbal Products</a></li>
            </ul>
          </div>

          {/* Column 3 - Markets */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '20px' }}>Markets</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#markets" onClick={(e) => { e.preventDefault(); scrollToSection('markets'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Middle East</a></li>
              <li className="mb-2"><a href="#markets" onClick={(e) => { e.preventDefault(); scrollToSection('markets'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Southeast Asia</a></li>
              <li className="mb-2"><a href="#markets" onClick={(e) => { e.preventDefault(); scrollToSection('markets'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Africa</a></li>
              <li className="mb-2"><a href="#markets" onClick={(e) => { e.preventDefault(); scrollToSection('markets'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Europe</a></li>
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '20px' }}>Company</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#why" onClick={(e) => { e.preventDefault(); scrollToSection('why'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>About Us</a></li>
              <li className="mb-2"><a href="#process" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Trade Process</a></li>
              <li className="mb-2"><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Get Quote</a></li>
              <li className="mb-2"><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="footer-link" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4" style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          fontSize: '13px',
          gap: '16px'
        }}>
          <span className="text-center text-md-start">© 2025 Goeasymart. All rights reserved. Any Where &amp; Any Time.</span>
          <div className="d-flex gap-3">
            <a 
              href="https://wa.me/9198XXXXXXX" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn d-flex align-items-center justify-content-center" 
              style={{ 
                width: '36px', 
                height: '36px', 
                background: 'rgba(0,0,0,0.05)', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'all 0.2s', 
                textDecoration: 'none', 
                color: '#25D366'  // WhatsApp green
              }}
            >
              <FaWhatsapp size={18} />
            </a>
            <a 
              href="https://instagram.com/yourpage" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn d-flex align-items-center justify-content-center" 
              style={{ 
                width: '36px', 
                height: '36px', 
                background: 'rgba(0,0,0,0.05)', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'all 0.2s', 
                textDecoration: 'none', 
                color: '#E4405F'  // Instagram pink/red
              }}
            >
              <FaInstagram size={18} />
            </a>
            <a 
              href="https://facebook.com/yourpage" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn d-flex align-items-center justify-content-center" 
              style={{ 
                width: '36px', 
                height: '36px', 
                background: 'rgba(0,0,0,0.05)', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'all 0.2s', 
                textDecoration: 'none', 
                color: '#1877F2'  // Facebook blue
              }}
            >
              <FaFacebookF size={18} />
            </a>
            <a 
              href="mailto:trade@goeasymart.com" 
              className="social-btn d-flex align-items-center justify-content-center" 
              style={{ 
                width: '36px', 
                height: '36px', 
                background: 'rgba(0,0,0,0.05)', 
                borderRadius: '8px', 
                fontSize: '16px', 
                transition: 'all 0.2s', 
                textDecoration: 'none', 
                color: '#D44638'  // Email red
              }}
            >
              <FaEnvelope size={18} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--gold) !important;
          transform: translateX(5px);
          display: inline-block;
        }
        
        .social-btn:hover {
          background: var(--gold) !important;
          transform: translateY(-2px);
          color: white !important;
        }
        
        /* Additional responsive adjustments */
        @media (max-width: 992px) {
          footer {
            padding: 40px 0 25px !important;
          }
          
          .col-lg-6 p {
            margin-bottom: 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          footer [style*="width: 250px"] {
            width: 200px !important;
            height: 100px !important;
          }
          
          h4 {
            margin-top: 0.5rem;
          }
        }
        
        @media (max-width: 576px) {
          footer {
            padding: 30px 0 20px !important;
          }
          
          .footer-link {
            font-size: 13px !important;
          }
          
          .social-btn {
            width: 32px !important;
            height: 32px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;