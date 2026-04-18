import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/productsData';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [currentCat, setCurrentCat] = useState('rice');

  const viewAllProducts = (catId) => {
    navigate(`/products?cat=${catId}`);
  };

  return (
    <section id="categories" className="categories-section py-5" style={{ background: 'var(--cream)' }}>
      <div className="container text-center">

        {/* Header */}
        <div className="section-tag text-gold-light mb-2">Our Products</div>

        <h2 className="section-title">
          150+ Commodities, <span className="em">One Partner</span>
        </h2>

        <p className="section-subtitle mx-auto">
          Browse our comprehensive product catalogue organised by category. Click any category to explore.
        </p>

        {/* Category Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentCat(cat.id);
                viewAllProducts(cat.id);
              }}
              className={`category-pill ${currentCat === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .text-gold-light {
          color: var(--gold-light);
        }

        .section-subtitle {
          max-width: 650px;
        }

        .category-pill {
          border-radius: 50px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.6);
          color: #000;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .category-pill:hover {
          transform: translateY(-2px);
          border-color: var(--gold);
        }

        .category-pill.active {
          background: var(--gold);
          color: var(--deep);
          border: 1px solid var(--gold);
          font-weight: 700;
        }

        /* Mobile optimization */
        @media (max-width: 576px) {
          .category-pill {
            font-size: 12px;
            padding: 7px 14px;
          }
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;