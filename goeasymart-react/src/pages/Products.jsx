import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('cat');
  const [products, setProducts] = useState([]);
  const [pageTitle, setPageTitle] = useState('All Products');

  const categoryNames = {
    rice: "Rice & Grains",
    spices: "Spices & Condiments",
    seeds: "Seeds & Nuts",
    oils: "Oils & Dairy",
    herbal: "Herbal & Ayurvedic",
    processed: "Processed Foods",
    construction: "Construction Materials",
    textile: "Textiles",
    industrial: "Industrial Goods"
  };

  const productsData = {
    rice: [
      "1121 Steam Basmati Rice", "Pusa Sella Basmati Rice", "Non Basmati Rice", "Idli Rice",
      "Poha", "Rava", "Idli Flour", "Wheat Flour", "Bajra Flour", "Besan", "Juvaar Flour", "Maize Starch"
    ],
    spices: [
      "Chilli Powder", "Turmeric Powder", "Garam Masala", "Tej Patta",
      "Garlic Powder", "Onion Powder", "Akkhi Mirchi", "Haldi", "Kasuri Methi"
    ],
    seeds: [
      "Natural Sesame Seeds", "Hulled Sesame Seeds", "Chia Seeds", "Dill Seeds",
      "Fenugreek Seeds", "Pumpkin Seeds", "Kalonji Seeds", "Coriander Seeds",
      "Asaliya Seeds", "Methi Dana", "Peanuts", "Groundnuts"
    ],
    oils: [
      "Mustard Oil", "Castor Oil", "Coconut Oil", "Palm Oil", "Ghee", "Honey", "Kalonji Oil",
      "Butter", "Paneer"
    ],
    herbal: [
      "Ashwagandha", "Safed Musli", "Gokhuru", "Akarkara", "Satavari", "Vidharikand", "Isabgol", "Mehendi Powder"
    ],
    processed: [
      "Triple Refined Iodised Salt", "Kala Namak", "Makhana", "Coconuts", "Coconut Powder", "Khopra",
      "Amla Candy", "Aamchur Powder", "Milk Powder", "Achaar", "Banana Chips", "Sabudana", "Mamra",
      "Glucose Powder", "Soda Powder", "Corn Flakes", "Papad", "Fryums", "Khari", "Toast", "Tea",
      "Mukhwaas", "Rasgulla", "Gulab Jamun", "Indian Sweets", "Peanut Butter", "Sauce", "Mayonese",
      "Ginger Paste", "Garlic Paste", "Fruits & Vegetables"
    ],
    construction: [
      "Sanitary Wares", "Tiles", "Marbles", "Granites", "Bentonite", "Quartz Powder",
      "Construction Materials", "Cement", "Bricks", "TMT Bars"
    ],
    textile: [
      "Cotton Clothes", "Bath Towels", "Napkins"
    ],
    industrial: [
      "Batteries", "Cells", "Motor Pumps", "Submersible Pumps", "Electrical Products",
      "Ropes", "Wall Clocks", "Safety Shoes", "Helmets"
    ]
  };

  const getIcon = (name) => {
    if (name.includes("Rice") || name.includes("Flour")) return "🌾";
    if (name.includes("Oil") || name.includes("Ghee")) return "🫙";
    if (name.includes("Seed")) return "🌱";
    if (name.includes("Powder")) return "🧂";
    if (name.includes("Sweet") || name.includes("Candy")) return "🍬";
    if (name.includes("Fruit")) return "🍎";
    if (name.includes("Pump")) return "⚙️";
    if (name.includes("Clothes")) return "👗";
    if (name.includes("Tile") || name.includes("Marble")) return "🧱";
    return "📦";
  };

  useEffect(() => {
    if (category && categoryNames[category]) {
      setPageTitle(categoryNames[category]);
      setProducts(productsData[category] || []);
    } else {
      setPageTitle("All Products");
      // Show all products if no category selected
      const allProducts = [];
      Object.values(productsData).forEach(catProducts => {
        allProducts.push(...catProducts);
      });
      setProducts(allProducts);
    }
  }, [category]);

  return (
    <div className="products-page">

      {/* Back Button */}
      <div className="header">
        <Link to="/" className="back-btn">← Back</Link>
      </div>

      {/* ✅ IF NO CATEGORY → SHOW CATEGORY UI (Image 2) */}
      {!category ? (
        <>
          <div className="title">
            <h2>150+ Commodities, <span style={{ color: "#c89b3c" }}>One Partner</span></h2>
            <p>Browse our comprehensive product catalogue organised by category.</p>
          </div>

          <div className="category-buttons">
            {Object.keys(categoryNames).map((key) => (
              <Link
                key={key}
                to={`/products?cat=${key}`}
                className="category-btn"
              >
                {categoryNames[key]}
              </Link>
            ))}
          </div>
        </>
      ) : (

        /* ✅ IF CATEGORY SELECTED → SHOW PRODUCTS (Image 1) */
        <>
          <div className="title">
            <h2>{pageTitle}</h2>
          </div>

          <div className="grid">
            {products.map((product, index) => (
              <div
                key={index}
                className="card"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="icon">{getIcon(product)}</div>
                <h3>{product}</h3>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Products;