// src/pages/SubProducts.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, categories } from '../data/productsData';
import '../styles/Products.css';

const SubProducts = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState('');

    const getCategoryLabel = (catId) => {
        const cat = categories.find(c => c.id === catId);
        return cat ? cat.label : catId;
    };

    useEffect(() => {
        const filtered = products.filter(p => p.cat === categoryId);
        setFilteredProducts(filtered);
        setPageTitle(getCategoryLabel(categoryId));
    }, [categoryId]);

    const getCategoryImage = (catId) => {
        const category = categories.find(c => c.id === catId);
        return category?.image;
    };

    return (
        <div className="products-page">

            {/* BACK BUTTON */}
            <div className="header">
                <Link to="/products" className="back-btn">← Back</Link>
            </div>

            <div className="title">
                <h2>{pageTitle}</h2>
                <p>{filteredProducts.length} products available</p>
            </div>

            <div className="grid">
                {filteredProducts.map((product, index) => (
                    <div
                        key={index}
                        className="card-wrapper fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div
                            className="product-card"
                            onClick={() => {
                                if (product.variants) {
                                    // processed foods → go to Variant page
                                    navigate(`/product/${product.id}`);
                                } else {
                                    // rice → direct details page
                                    navigate(`/product/${product.id}/details`);
                                }
                            }}
                        >
                            <div className="image-box">
                                <img
                                    src={product.banner || product.images?.[0]}
                                    alt={product.name}
                                />
                            </div>

                            <div className="overlay">
                                <h5>{product.icon} {product.name}</h5>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SubProducts;