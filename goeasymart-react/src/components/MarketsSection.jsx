import React from 'react';

const MarketsSection = () => {
  const markets = [
    { name: 'South & Southeast Asia', countries: 'Bangladesh, Sri Lanka, Malaysia, Indonesia, Vietnam', bg: 'linear-gradient(135deg,#1A2C42,#0D1B2A)', emoji: '🌏', tag: 'Active Export Corridor' },
    { name: 'Middle East & Africa', countries: 'UAE, Saudi Arabia, Kenya, Tanzania, Egypt, Nigeria', bg: 'linear-gradient(135deg,#2D1A0D,#1A0D0D)', emoji: '🌍', tag: 'Top Trading Region' },
    { name: 'Europe & Americas', countries: 'UK, Germany, Netherlands, USA, Canada', bg: 'linear-gradient(135deg,#0D1A2D,#1A2D1A)', emoji: '🌎', tag: 'Growing Markets' }
  ];

  return (
    <section id="markets" className="markets-section py-5" style={{ background: 'var(--cream)' }}>
      <div className="container">

        {/* Header */}
        <div className="text-center">
          <div className="section-tag">Global Reach</div>
          <h2 className="section-title">
            Markets We <span className="em">Serve</span>
          </h2>
          <p className="section-subtitle">
            Active trade operations across major international markets with region-specific expertise.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4 mt-4">
          {markets.map((market, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              
              <div
                className="market-card"
                style={{ background: market.bg }}
              >

                {/* Emoji Background */}
                <div className="market-emoji">{market.emoji}</div>

                {/* Overlay */}
                <div className="market-overlay"></div>

                {/* Content */}
                <div className="market-content">
                  <h3>{market.name}</h3>
                  <p>{market.countries}</p>
                  <span className="market-tag">{market.tag}</span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .market-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          min-height: 220px;
          display: flex;
          align-items: flex-end;
          cursor: pointer;
          transition: 0.3s;
        }

        .market-card:hover {
          transform: translateY(-6px) scale(1.02);
        }

        .market-emoji {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 90px;
          z-index: 0;
          opacity: 0.9;
        }

        .market-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(13, 27, 42, 0.9) 0%,
            rgba(13, 27, 42, 0.3) 60%,
            transparent 100%
          );
          z-index: 1;
        }

        .market-content {
          position: relative;
          z-index: 2;
          padding: 24px;
          color: #fff;
        }

        .market-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .market-content p {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          margin-bottom: 10px;
        }

        .market-tag {
          display: inline-block;
          background: rgba(200, 151, 43, 0.2);
          border: 1px solid rgba(200, 151, 43, 0.4);
          color: var(--gold-light);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 5px 10px;
          border-radius: 50px;
        }

        /* Mobile */
        @media (max-width: 576px) {
          .market-content {
            padding: 18px;
          }

          .market-content h3 {
            font-size: 18px;
          }

          .market-emoji {
            font-size: 70px;
          }
        }
      `}</style>
    </section>
  );
};

export default MarketsSection;