import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
const countriesData = [
  { name: "India", lat: 20.5937, lng: 78.9629, flag: "🇮🇳", region: "South Asia" },
  { name: "UAE", lat: 23.4241, lng: 53.8478, flag: "🇦🇪", region: "Middle East" },
  { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, flag: "🇸🇦", region: "Middle East" },
  { name: "Oman", lat: 21.4735, lng: 55.9754, flag: "🇴🇲", region: "Middle East" },
  { name: "Qatar", lat: 25.3548, lng: 51.1839, flag: "🇶🇦", region: "Middle East" },
  { name: "Kuwait", lat: 29.3117, lng: 47.4818, flag: "🇰🇼", region: "Middle East" },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, flag: "🇧🇩", region: "South Asia" },
  { name: "Sri Lanka", lat: 7.8731, lng: 80.7718, flag: "🇱🇰", region: "South Asia" },
  { name: "Malaysia", lat: 4.2105, lng: 101.9758, flag: "🇲🇾", region: "Southeast Asia" },
  { name: "Indonesia", lat: -0.7893, lng: 113.9213, flag: "🇮🇩", region: "Southeast Asia" },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, flag: "🇻🇳", region: "Southeast Asia" },
  { name: "Philippines", lat: 12.8797, lng: 121.7740, flag: "🇵🇭", region: "Southeast Asia" },
  { name: "Thailand", lat: 15.8700, lng: 100.9925, flag: "🇹🇭", region: "Southeast Asia" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, flag: "🇸🇬", region: "Southeast Asia" },
  { name: "Kenya", lat: -1.2864, lng: 36.8172, flag: "🇰🇪", region: "Africa" },
  { name: "Tanzania", lat: -6.3690, lng: 34.8888, flag: "🇹🇿", region: "Africa" },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, flag: "🇪🇬", region: "Africa" },
  { name: "Nigeria", lat: 9.0820, lng: 8.6753, flag: "🇳🇬", region: "Africa" },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, flag: "🇿🇦", region: "Africa" },
  { name: "United Kingdom", lat: 51.5074, lng: -0.1278, flag: "🇬🇧", region: "Europe" },
  { name: "Germany", lat: 51.1657, lng: 10.4515, flag: "🇩🇪", region: "Europe" },
  { name: "Netherlands", lat: 52.1326, lng: 5.2913, flag: "🇳🇱", region: "Europe" },
  { name: "France", lat: 46.2276, lng: 2.2137, flag: "🇫🇷", region: "Europe" },
  { name: "Italy", lat: 41.8719, lng: 12.5674, flag: "🇮🇹", region: "Europe" },
  { name: "Spain", lat: 40.4637, lng: -3.7492, flag: "🇪🇸", region: "Europe" },
  { name: "USA", lat: 37.0902, lng: -95.7129, flag: "🇺🇸", region: "North America" },
  { name: "Canada", lat: 56.1304, lng: -106.3468, flag: "🇨🇦", region: "North America" },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, flag: "🇲🇽", region: "North America" },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, flag: "🇧🇷", region: "South America" },
  { name: "Australia", lat: -25.2744, lng: 133.7751, flag: "🇦🇺", region: "Oceania" },
  { name: "Nepal", lat: 28.3949, lng: 84.1240, flag: "🇳🇵", region: "South Asia" },
  { name: "Maldives", lat: 3.2028, lng: 73.2207, flag: "🇲🇻", region: "South Asia" },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, flag: "🇹🇷", region: "Middle East" },
  { name: "Jordan", lat: 30.5852, lng: 36.2384, flag: "🇯🇴", region: "Middle East" },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, flag: "🇪🇹", region: "Africa" },
  { name: "Uganda", lat: 1.3733, lng: 32.2903, flag: "🇺🇬", region: "Africa" },
  { name: "Ghana", lat: 7.9465, lng: -1.0232, flag: "🇬🇭", region: "Africa" },
  { name: "Mauritius", lat: -20.3484, lng: 57.5522, flag: "🇲🇺", region: "Africa" },
  { name: "Pakistan", lat: 30.3753, lng: 69.3451, flag: "🇵🇰", region: "South Asia" }
];

const tradeRoutes = [
  [[20.5937, 78.9629], [23.4241, 53.8478]],
  [[20.5937, 78.9629], [23.8859, 45.0792]],
  [[20.5937, 78.9629], [23.6850, 90.3563]],
  [[20.5937, 78.9629], [7.8731, 80.7718]],
  [[20.5937, 78.9629], [4.2105, 101.9758]],
  [[20.5937, 78.9629], [-0.7893, 113.9213]],
  [[20.5937, 78.9629], [14.0583, 108.2772]],
  [[20.5937, 78.9629], [15.8700, 100.9925]],
  [[23.4241, 53.8478], [26.8206, 30.8025]],
  [[26.8206, 30.8025], [-1.2864, 36.8172]],
  [[-1.2864, 36.8172], [-6.3690, 34.8888]],
  [[20.5937, 78.9629], [51.5074, -0.1278]],
  [[51.5074, -0.1278], [51.1657, 10.4515]],
  [[51.1657, 10.4515], [52.1326, 5.2913]],
  [[20.5937, 78.9629], [37.0902, -95.7129]],
  [[37.0902, -95.7129], [56.1304, -106.3468]],
  [[20.5937, 78.9629], [-14.2350, -51.9253]],
  [[20.5937, 78.9629], [-25.2744, 133.7751]],
  [[20.5937, 78.9629], [28.3949, 84.1240]],
  [[23.4241, 53.8478], [38.9637, 35.2433]]
];
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WorldMapSection = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Important: Leaflet maps need invalidateSize when they become visible
          if (mapInstanceRef.current) {
            setTimeout(() => {
              mapInstanceRef.current.invalidateSize();
            }, 300);
          }
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.worldmap-section .reveal');
    elements.forEach(el => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      dragging: true, // changed to true for better usability on separate page
      scrollWheelZoom: false,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true
    }).setView([20, 0], 2);
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
        <div className="section-tag mb-3" style={{
          background: 'rgba(200, 151, 43, 0.1)',
          borderRadius: '50px',
          padding: '5px 20px',
          display: 'inline-flex',
          color: 'var(--gold)'
        }}>Our Reach</div>

        <div className="text-center mb-4">
          <h2 className="section-title mb-3" style={{ color: '#000000' }}><span style={{ color: 'var(--gold)' }}>40+</span> Countries <span style={{ color: 'var(--gold)' }}>Worldwide</span></h2>
          <p className="mx-auto text-center" style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6 }}>We actively export to these markets. Click on any pin to explore our global footprint and trade routes.</p>
        </div>

        <div className="reveal mt-5" style={{
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          border: '1px solid rgba(200, 151, 43, 0.3)'
        }}>
          <div ref={mapRef} className="map-container" style={{ height: '550px', width: '100%', borderRadius: '20px', zIndex: 1 }}></div>

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
        
        .map-container {
          height: 550px;
          width: 100%;
        }
        
        /* Bootstrap responsive overrides */
        @media (max-width: 992px) {
          .map-container {
            height: 450px !important;
          }
        }
        
        @media (max-width: 768px) {
          .map-container {
            height: 380px !important;
          }
          
          .section-title {
            font-size: 1.75rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .map-container {
            height: 300px !important;
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