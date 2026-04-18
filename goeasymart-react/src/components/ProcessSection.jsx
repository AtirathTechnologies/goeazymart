import React from 'react';

const ProcessSection = () => {
  const steps = [
    { icon: '📋', title: 'Submit Inquiry', desc: 'Share your product requirements, quantity, destination, and packaging preferences.' },
    { icon: '💬', title: 'Get Custom Quote', desc: 'Receive a competitive, transparent price quote within 24 hours from your trade manager.' },
    { icon: '🔬', title: 'Quality Check', desc: 'Pre-shipment inspection, lab certification, and full documentation preparation.' },
    { icon: '🚢', title: 'Ship & Track', desc: 'Containerised shipment via sea or air with real-time tracking and timely delivery.' }
  ];

  return (
    <section id="process" className="process-section py-5" style={{ background: 'var(--white)' }}>
      <div className="container">

        {/* Header */}
        <div className="text-center">
          <div className="section-tag d-inline-flex justify-content-center">
            Trade Process
          </div>
          <h2 className="section-title">
            How <span className="em">It Works</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Our streamlined process ensures smooth, transparent transactions from inquiry to delivery.
          </p>
        </div>

        {/* Steps */}
        <div className="row text-center process-steps mt-5">
          {steps.map((step, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3 process-step">

              {/* Circle */}
              <div className="step-circle">
                <span>{step.icon}</span>
              </div>

              {/* Content */}
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>

            </div>
          ))}
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .process-steps {
          position: relative;
        }

        /* Desktop connecting line */
        .process-steps::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          z-index: 0;
        }

        .process-step {
          position: relative;
          padding: 20px;
        }

        .step-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--deep);
          border: 3px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 26px;
          color: var(--gold-light);
          position: relative;
          z-index: 1;
          box-shadow: 0 0 0 6px var(--white);
          transition: 0.3s;
        }

        .process-step:hover .step-circle {
          transform: scale(1.1);
          background: var(--gold);
          color: var(--deep);
        }

        .step-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Tablet */
        @media (max-width: 992px) {
          .process-steps::before {
            display: none;
          }
        }

        /* Mobile */
        @media (max-width: 576px) {
          .step-circle {
            width: 60px;
            height: 60px;
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
};

export default ProcessSection;