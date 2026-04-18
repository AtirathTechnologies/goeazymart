import React from 'react';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="container-fluid overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-content">

            <span>🌾 Premium Quality Products</span>
            <span className="sep">✦</span>

            <span>🚢 Global Shipping</span>
            <span className="sep">✦</span>

            <span>✅ Quality Assured</span>
            <span className="sep">✦</span>

            <span>📦 Flexible Packaging</span>
            <span className="sep">✦</span>

            <span>🤝 24/7 Trade Support</span>

          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .topbar {
          background: #1A0D0D;
          color: var(--gold);
          border-bottom: 1px solid var(--border);
          font-weight: bold;
          font-style: italic;
          letter-spacing: 0.05em;
          padding: 6px 0;
          text-align: center;
          font-size: 14px;
        }

        .ticker-wrapper {
          overflow: hidden;
          white-space: nowrap;
        }

        .ticker-content {
          display: inline-block;
          padding-left: 100%;
          animation: ticker 35s linear infinite;
        }

        .sep {
          margin: 0 25px;
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        /* 📱 Mobile optimization */
        @media (max-width: 768px) {
          .topbar {
            font-size: 12px;
            padding: 5px 0;
          }

          .sep {
            margin: 0 15px;
          }

          .ticker-content {
            animation-duration: 25s;
          }
        }

        /* 💻 Large screens */
        @media (min-width: 1200px) {
          .topbar {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default TopBar;