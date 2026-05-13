import React from 'react';

const MarketsSection = () => {

  const markets = [
    {
      name: 'South & Southeast Asia',
      countries: 'Bangladesh, Sri Lanka, Malaysia, Indonesia, Vietnam',
      flags: ['bd', 'lk', 'my', 'id', 'vn']
    },
    {
      name: 'Middle East & Africa',
      countries: 'UAE, Saudi Arabia, Kenya, Tanzania, Egypt, Nigeria',
      flags: ['ae', 'sa', 'ke', 'tz', 'eg', 'ng']
    },
    {
      name: 'Europe & Americas',
      countries: 'UK, Germany, Netherlands, USA, Canada',
      flags: ['gb', 'de', 'nl', 'us', 'ca']
    }
  ];

  return (
    <section className="markets-section py-5" style={{ background: 'var(--cream)' }}>
      <div className="container">

        {/* Header */}
        <div className="text-center">
          <div className="section-tag">Global Reach</div>
          <h2 className="section-title">
            Markets We <span className="em">Serve</span>
          </h2>
          <p className="section-subtitle mx-auto" style={{ color: 'var(--gold)' }}>
            Active trade operations across major international markets.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4 mt-4">
          {markets.map((market, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">

              <div className="market-card fade-in" style={{ animationDelay: `${i * 0.2}s` }}>

                {/* Content */}
                <div className="market-content">
                  <h3>{market.name}</h3>
                  <p>{market.countries}</p>

                  {/* 🌍 FLAGS */}
                  <div className="flags">
                    {market.flags.map((code, index) => (
                      <img
                        key={index}
                        src={`https://flagcdn.com/w40/${code}.png`}
                        alt={code}
                      />
                    ))}
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .market-card {
          background: linear-gradient(135deg, #0d1b2a, #1b263b);
          border-radius: 18px;
          padding: 25px;
          color: #fff;
          transition: 0.4s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        /* Glow effect */
        .market-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: 0.4s;
        }

        .market-card:hover::before {
          opacity: 1;
        }

        .market-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .market-content h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .market-content p {
          font-size: 13px;
          opacity: 0.8;
          margin-bottom: 15px;
        }

        /* FLAGS */
        .flags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .flags img {
          width: 32px;
          height: 22px;
          border-radius: 4px;
          object-fit: cover;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transition: 0.3s;
        }

        .flags img:hover {
          transform: scale(1.2);
        }

        /* Entry animation */
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.8s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          .flags img {
            width: 26px;
            height: 18px;
          }
        }
      `}</style>

    </section>
  );
};

export default MarketsSection;