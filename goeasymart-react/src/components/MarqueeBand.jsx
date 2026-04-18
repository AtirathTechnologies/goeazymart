import React from 'react';

const MarqueeBand = () => {
  const items = ['BASMATI RICE', 'SESAME SEEDS', 'SPICES & MASALA', 'COCONUT PRODUCTS', 'HERBAL POWDERS', 'EDIBLE OILS', 'DAIRY PRODUCTS', 'CONSTRUCTION MATERIALS', 'TEXTILES', 'INDUSTRIAL GOODS'];
  
  return (
    <div style={{
      background: 'var(--gold)',
      padding: '1px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}>
      <div style={{
        display: 'inline-block',
        animation: 'marquee 30s linear infinite'
      }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '18px',
            letterSpacing: '3px',
            color: 'var(--deep)',
            margin: '0 30px'
          }}>
            {item}
            {i < items.length - 1 && <span style={{ margin: '0 15px' }}>·</span>}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBand;