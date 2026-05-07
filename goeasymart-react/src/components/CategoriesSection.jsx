import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/productsData';

const CategoriesSection = () => {
  const navigate = useNavigate();

  // const categories = [
  //   {
  //     id: 'rice',
  //     label: 'Rice & Grains',
  //     image: 'https://tiimg.tistatic.com/fp/1/005/862/rice-products-rice-rawa-rice-flour-rice-whole--451.jpg'
  //   },
  //   {
  //     id: 'spices',
  //     label: 'Spices & Condiments',
  //     image: 'https://proficiencytesting.in/wp-content/uploads/2023/08/23-e1693221149166.jpg'
  //   },
  //   {
  //     id: 'seeds',
  //     label: 'Seeds & Nuts',
  //     image: 'https://nyspiceshop.com/cdn/shop/articles/TYPES_OF_NUTS_AND_SEEDS_AND_THEIR_HEALTH_BENEFITS.jpeg?v=1730226897'
  //   },
  //   {
  //     id: 'processed',
  //     label: 'Sea Foods',
  //     image: 'https://agrospectrumindia.com/wp-content/uploads/2024/12/seafood-iStock-1.jpg'
  //   },
  //   {
  //     id: 'textile',
  //     label: 'Textiles',
  //     image: 'https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg?semt=ais_hybrid&w=740&q=80'
  //   },
  //   {
  //     id: 'herbal',
  //     label: 'Herbal & Ayurvedic',
  //     image: 'https://i.herbalreality.com/wp-content/uploads/2022/07/21123810/ayurveda-ayurvedic-herbs-terms-glossary.jpg'
  //   }
  // ];

  const displayCategories = categories.filter(cat =>
    ['rice', 'spices', 'seeds', 'processed', 'textile', 'herbal'].includes(cat.id)
  );



  const handleClick = (catId) => {
    navigate(`/products?cat=${catId}`);
  };

  // 🎯 REAL 3D TILT
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateX = ((y - midY) / midY) * 10;
    const rotateY = ((x - midX) / midX) * 10;

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const resetTilt = (card) => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <section
      id="products"
      className="categories-section py-5"
      style={{ background: 'var(--cream)' }}
    >      <div className="container text-center">

        <div className="section-tag text-gold-light mb-2">Our Products</div>

        <h2 className="section-title">
          150+ Commodities, <span className="em">One Partner</span>
        </h2>

        <p className="section-subtitle mx-auto">
          Browse our premium product categories.
        </p>

        {/* 🔥 CARDS */}
        <div className="row mt-5 g-4 justify-content-center">
          {displayCategories.map((cat, index) => (
            <div key={cat.id} className="col-6 col-md-4 col-lg-2">

              <div
                className="card-wrapper fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="category-card"
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => resetTilt(e.currentTarget)}
                  onClick={() => handleClick(cat.id)}
                >
                  <img src={cat.image} alt={cat.label} />

                  {/* ✨ Shine Effect */}
                  <div className="shine"></div>

                  <div className="overlay">
                    <h5>{cat.label}</h5>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Button */}
        <div style={{ marginTop: "50px" }}>
          <button
            className="view-all-btn"
            onClick={() => navigate('/products')}
          >
            View All Products →
          </button>
        </div>

      </div>

      {/* 🔥 STYLES */}
      <style>{`
        .card-wrapper {
          perspective: 1200px;
        }

        .category-card {
          position: relative;
          height: 190px;
          border-radius: 16px;
          overflow: hidden;
          transform-style: preserve-3d;
          transition: transform 0.2s ease;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .category-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Shine */
        .shine {
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0.2),
            rgba(255,255,255,0.6),
            rgba(255,255,255,0.2)
          );
          transform: skewX(-20deg);
        }

        .category-card:hover .shine {
          animation: shineMove 0.8s forwards;
        }

        @keyframes shineMove {
          100% {
            left: 125%;
          }
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2));
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 15px;
        }

        .overlay h5 {
          color: #fff;
          font-weight: 600;
          font-size: 15px;
        }

        /* Entry Animation */
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 0.6s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .view-all-btn {
          background: var(--gold);
          color: var(--deep);
          padding: 12px 30px;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .view-all-btn:hover {
          transform: translateY(-3px);
        }

        @media (max-width: 576px) {
          .category-card {
            height: 150px;
          }

          .category-card {
            transform: none !important;
          }
        }
      `}</style>

    </section>
  );
};

export default CategoriesSection;