import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { countriesData, tradeRoutes } from '../data/productsData';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WorldMapSection = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    if (mapInstanceRef.current) return;
    
    const map = L.map(mapRef.current).setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    
    const createPinIcon = () => L.divIcon({
      className: 'custom-pin-marker',
      html: '<div class="pin-icon" style="display:block; width:28px; height:28px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); position:relative; cursor:pointer; background:transparent;"></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -25]
    });
    
    countriesData.forEach(country => {
      const marker = L.marker([country.lat, country.lng], { icon: createPinIcon() }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;text-align:center;min-width:180px;">
          <div style="font-size:32px;margin-bottom:5px;">${country.flag}</div>
          <strong style="color:#C8972B;font-size:16px;">${country.name}</strong><br>
          <span style="font-size:12px;color:#666;">${country.region}</span><br>
          <button onclick="window.dispatchEvent(new CustomEvent('quoteFromMap', { detail: { country: '${country.name}' } }))" style="margin-top:10px;background:linear-gradient(135deg,#C8972B,#E8B84B);border:none;padding:6px 16px;border-radius:25px;cursor:pointer;color:#0D1B2A;font-weight:bold;font-size:12px;width:100%;">📦 Request Quote →</button>
        </div>
      `);
    });
    
    tradeRoutes.forEach(route => {
      L.polyline(route, {
        color: '#C8972B',
        weight: 1.8,
        opacity: 0.6,
        dashArray: '6, 8'
      }).addTo(map);
    });
    
    mapInstanceRef.current = map;
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    const handleQuoteFromMap = (e) => {
      const countryInput = document.getElementById('formCountry');
      const messageArea = document.getElementById('formMessage');
      if (countryInput) countryInput.value = e.detail.country;
      if (messageArea && messageArea.value === '') {
        messageArea.value = `Interested in exporting to ${e.detail.country}. Please share best offers with FOB/CIF pricing.`;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    };
    
    window.addEventListener('quoteFromMap', handleQuoteFromMap);
    return () => window.removeEventListener('quoteFromMap', handleQuoteFromMap);
  }, []);
  
  return (
    <section className="worldmap-section py-5" id="worldmap" style={{ background: 'var(--cream)', position: 'relative' }}>
      <div className="container">
        <div className="text-center mb-4">
          <div className="section-tag d-inline-flex align-items-center justify-content-center mb-3" style={{
            background: 'rgba(200, 151, 43, 0.1)',
            borderRadius: '50px',
            padding: '5px 20px',
            display: 'inline-flex',
            color: 'var(--gold)'
          }}>Our Reach</div>
          <h2 className="section-title mb-3" style={{ color: 'var(--gold-dark)' }}>40+ Countries <span style={{ color: 'var(--gold)' }}>Worldwide</span></h2>
          <p className="mx-auto" style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6 }}>We actively export to these markets. Click on any pin to explore our global footprint and trade routes.</p>
        </div>
        
        <div className="reveal mt-5" style={{
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          border: '1px solid rgba(200, 151, 43, 0.3)'
        }}>
          <div ref={mapRef} style={{ height: '550px', width: '100%', borderRadius: '20px', zIndex: 1 }}></div>
          
          <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap mt-4" style={{
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            <span className="d-flex align-items-center gap-2">
              <span style={{
                display: 'inline-block',
                width: '40px',
                height: '2px',
                background: 'repeating-linear-gradient(90deg, #C8972B, #C8972B 8px, transparent 8px, transparent 16px)',
                position: 'relative',
                top: '-2px'
              }}></span>
              <span>Active Trade Routes</span>
            </span>
            <span>📍 Click any pin to request a quote</span>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-pin-marker {
          background: transparent;
          border: none;
        }
        .pin-icon {
          background: transparent;
        }
        .pin-icon::before {
          content: '📍';
          position: absolute;
          font-size: 14px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          color: #ff4444;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border-left: 4px solid #C8972B;
        }
        .leaflet-popup-tip {
          background: #C8972B;
        }
        
        /* Bootstrap responsive overrides */
        @media (max-width: 992px) {
          .worldmap-section .reveal div[style*="height: 550px"] {
            height: 450px !important;
          }
        }
        
        @media (max-width: 768px) {
          .worldmap-section .reveal div[style*="height: 550px"] {
            height: 400px !important;
          }
          
          .section-title {
            font-size: 1.75rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .worldmap-section .reveal div[style*="height: 550px"] {
            height: 350px !important;
          }
          
          .worldmap-section .reveal {
            padding: 12px !important;
          }
          
          .leaflet-popup-content-wrapper {
            max-width: 260px !important;
          }
          
          .leaflet-popup-content {
            min-width: auto !important;
            width: auto !important;
          }
        }
        
        /* Ensure map container is responsive */
        .leaflet-container {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default WorldMapSection;