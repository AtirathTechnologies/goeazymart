import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { products } from "../data/productsData";
import '../styles/Products.css';

const VariantList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id === productId);

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="products-page">

      <div className="header">
        <Link to={`/products/${product.cat}`} className="back-btn">
          ← Back
        </Link>
      </div>

      <div className="title">
        <h2>{product.name} - <span className="gold">Variants</span></h2>
        <p>{product.variants.length} products available</p>
      </div>

      <div className="grid">
        {product.variants.map((variant, i) => (
          <div 
            className="card-wrapper fade-in" 
            key={i}
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() =>
                navigate(`/product/${product.id}/${encodeURIComponent(variant.name)}`)
            }
          >
            <div className="product-card">
              <div className="image-box">
                <img
                  src={variant.image}
                  alt={variant.name}
                />
              </div>
            </div>

            <div className="product-info">
              <h5>{variant.name}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantList;
