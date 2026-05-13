// src/pages/Products.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/productsData';
import '../styles/Products.css';

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="products-page">

      <div className="title">
        <h2>150+ Commodities, <span className="gold">One Partner</span></h2>
        <p>Browse our premium product categories.</p>
      </div>

      <div className="grid">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="card-wrapper fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => navigate(`/products/${cat.id}`)}
          >
            <div className="product-card">
              <img src={cat.image} alt={cat.label} />
            </div>

            <div className="product-info">
              <h5>{cat.label}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;