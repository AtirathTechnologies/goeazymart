import React from 'react';

const WhySection = () => {
  const whyItems = [
    { icon: '🌍', title: 'Global Network', desc: 'Established trade corridors connecting South Asia, Southeast Asia, Middle East, Africa, and Europe with trusted logistics partners.' },
    { icon: '✅', title: 'Quality Assured', desc: 'Every consignment is quality-tested against international standards with phytosanitary certificates, lab reports, and export documentation.' },
    { icon: '⚡', title: 'Fast Processing', desc: 'Streamlined documentation, pre-shipment inspections, and dedicated trade managers to close your orders within record time.' },
    { icon: '📦', title: 'Flexible Packaging', desc: 'Private label, bulk, retail, or custom packaging — we adapt to your market\'s regulatory and commercial requirements.' },
    { icon: '💱', title: 'Competitive Pricing', desc: 'Direct sourcing from farms and manufacturers eliminates middlemen. You receive the best FOB, CIF, or DDP pricing globally.' },
    { icon: '🤝', title: 'End-to-End Support', desc: 'From inquiry to delivery, your dedicated trade advisor keeps you informed at every stage with real-time updates.' }
  ];

  return (
    <section id="why" className="py-5">
      <div className="container">

        {/* Header */}
        <div className="text-center">
          <div className="section-tag">Why Goeasymart</div>
          <h2 className="section-title">
            Trade With <span className="em">Confidence</span>
          </h2>
          <p className="section-subtitle">
            From sourcing to delivery, we handle every link in the international trade chain so you can focus on growing your business.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4 mt-4">
          {whyItems.map((item, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div className="why-card h-100 text-center text-sm-start">

                <div className="why-icon">{item.icon}</div>

                <h3 className="why-title">{item.title}</h3>

                <p className="why-desc">{item.desc}</p>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .why-card {
          background: var(--white);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 30px 24px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .why-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          transform: scaleX(0);
          transition: transform 0.3s;
        }

        .why-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          border-color: var(--gold-pale);
        }

        .why-card:hover::before {
          transform: scaleX(1);
        }

        .why-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }

        .why-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .why-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Mobile */
        @media (max-width: 576px) {
          .why-card {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default WhySection;