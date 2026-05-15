import React from 'react';
const whyChooseData = [
  { icon: '🚀', title: 'Fast & Reliable Logistics', desc: 'Multi-modal shipping with real-time tracking, customs clearance support, and door-step delivery across 40+ countries.', bg: 'rgba(45,106,79,0.2)', border: '#2D6A4F' },
  { icon: '📋', title: 'End-to-End Documentation', desc: 'We handle all export paperwork: phytosanitary certificates, COO, bill of lading, insurance, and LC documentation.', bg: 'rgba(200,151,43,0.2)', border: '#C8972B' },
  { icon: '🔬', title: 'Quality Control Labs', desc: 'In-house testing for purity, moisture, adulteration, and microbiological parameters. Third-party SGS/GeoChem support.', bg: 'rgba(82,183,136,0.2)', border: '#52B788' },
  { icon: '💎', title: 'Competitive B2B Pricing', desc: 'Direct farm & factory sourcing eliminates middlemen. Get the best FOB/CIF rates with flexible payment terms.', bg: 'rgba(200,151,43,0.2)', border: '#E8B84B' },
  { icon: '🌿', title: 'Sustainable Sourcing', desc: 'Ethically sourced agricultural products with traceability. Supporting fair trade and eco-friendly packaging.', bg: 'rgba(45,106,79,0.2)', border: '#2D6A4F' },
  { icon: '🤝', title: 'Dedicated Account Managers', desc: '24/7 dedicated trade expert for every client — from first inquiry to repeat orders, we’re your growth partner.', bg: 'rgba(200,151,43,0.2)', border: '#C8972B' }
];

const WhyChooseSection = () => {
  return (
    <section className="why-choose-section py-5" style={{ background: '#fffdf8' }}>
      <div className="container text-center">

        {/* Header */}
        <div className="section-tag mb-3 text-gold">Why Choose Us</div>

        <h2 className="section-title" style={{ color: '#000000' }}>
          Built for <span style={{ color: 'var(--gold)' }}> B2B</span> Success
        </h2>

        <p className="mx-auto mt-2 why-subtitle">
          We don't just supply products — we build supply chain partnerships that grow with your business.
        </p>

        {/* Cards */}
        <div className="row g-4 mt-4">
          {whyChooseData.map((item, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              
              <div
                className="why-choose-card h-100 text-start"
                style={{ '--borderColor': item.border }}
              >
                
                {/* Icon */}
                <div
                  className="why-icon"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="why-title">{item.title}</h3>

                {/* Description */}
                <p className="why-desc">{item.desc}</p>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .text-gold {
          color: var(--gold);
        }

        .why-subtitle {
          max-width: 600px;
          font-size: 0.95rem;
          color: var(--gold);
          line-height: 1.6;
        }

        .why-choose-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px 22px;
          position: relative;
          overflow: hidden;
          transition: 0.3s;
        }

        .why-choose-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          border-radius: 0 0 var(--radius) var(--radius);
          background: var(--borderColor);
          opacity: 0;
          transition: 0.3s;
        }

        .why-choose-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }

        .why-choose-card:hover::after {
          opacity: 1;
        }

        .why-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 16px;
        }

        .why-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #111;
        }

        .why-desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.6;
        }

        /* Mobile center alignment */
        @media (max-width: 576px) {
          .why-choose-card {
            text-align: center;
          }
          .why-icon {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseSection;