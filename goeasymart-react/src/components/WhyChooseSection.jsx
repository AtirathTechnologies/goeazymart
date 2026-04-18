import React from 'react';
import { whyChooseData } from '../data/productsData';

const WhyChooseSection = () => {
  return (
    <section className="why-choose-section py-5" style={{ background: '#fffdf8' }}>
      <div className="container text-center">

        {/* Header */}
        <div className="section-tag mb-3 text-gold">Why Choose Us</div>

        <h2 className="section-title" style={{ color: 'var(--green)' }}>
          Built for <span> B2B Success</span>
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