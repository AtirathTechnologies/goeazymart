import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { products } from "../data/productsData";

const VariantList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id === productId);

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="container py-4">

      <Link to={`/products/${product.cat}`} className="back-btn">
        ← Back
      </Link>

      <h2 className="mb-4">{product.name} - Variants</h2>

      <div className="row">
        {product.variants.map((variant, i) => (
          <div className="col-md-4 mb-4" key={i}>
            <div
              className="variant-card image-card"
              onClick={() =>
                navigate(`/product/${product.id}/${encodeURIComponent(variant.name)}`)
              }
            >
              <img
                src={variant.image}
                alt={variant.name}
                className="variant-img"
              />

              <div className="overlay">
                <h5>{variant.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantList;