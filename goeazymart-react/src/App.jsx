import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';

import Products from './pages/Products';
import HomePage from './pages/HomePage';

import MarketsSection from './components/MarketsSection';
import ProcessSection from './components/ProcessSection';
import WorldMapSection from './components/WorldMapSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import './index.css';
import SubProducts from './pages/SubProducts';
import ProductDetails from './pages/ProductDetails';
import VariantList from './pages/VariantList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminPanel from './pages/AdminPanel';

// Централизованное управление уникальными SEO-заголовками
const TitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Goeazymart - Connecting Global Buyers and Sellers";

    if (path === "/") {
      title = "Goeazymart - Connecting Global Buyers and Sellers";
    } else if (path === "/products") {
      title = "Products | Goeazymart";
    } else if (path.startsWith("/products/")) {
      const categoryId = path.split("/")[2];
      const formattedCategory = categoryId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      title = `${formattedCategory} Categories | Goeazymart`;
    } else if (path.startsWith("/product/") && path.endsWith("/details")) {
      title = "Product Details | Goeazymart";
    } else if (path.startsWith("/product/")) {
      title = "Product Variants | Goeazymart";
    } else if (path === "/markets") {
      title = "Markets | Goeazymart";
    } else if (path === "/process") {
      title = "How It Works | Goeazymart";
    } else if (path === "/worldmap") {
      title = "Reach | Goeazymart";
    } else if (path === "/contact") {
      title = "Contact Us | Goeazymart";
    } else if (path === "/login") {
      title = "Login | Goeazymart";
    } else if (path === "/signup") {
      title = "Sign Up | Goeazymart";
    } else if (path === "/forgot-password") {
      title = "Reset Password | Goeazymart";
    } else if (path === "/cart") {
      title = "My Cart | Goeazymart";
    } else if (path === "/admin") {
      title = "Admin Dashboard | Goeazymart";
    }

    document.title = title;
  }, [location]);

  return null;
};

// Redirect admin users away from public pages
const RedirectIfAdmin = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.isAdmin) return <Navigate to="/admin" replace />;
    } catch (_) { }
  }
  return children;
};

// Other Pages
const MarketsPage = () => <><MarketsSection /><Footer /></>;
const ProcessPage = () => <><ProcessSection /><Footer /></>;
const WorldMapPage = () => <><WorldMapSection /><Footer /></>;
const ContactPage = () => <><ContactSection /><Footer /></>;

import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

import Cart from './pages/Cart';

function App() {
  const [customAlert, setCustomAlert] = useState({ show: false, message: '' });

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      setCustomAlert({ show: true, message: String(message) });
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    if (customAlert.show) {
      const timer = setTimeout(() => {
        setCustomAlert({ show: false, message: '' });
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [customAlert.show]);

  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <TitleManager />
          <Navbar />

          <Routes>
            <Route path="/" element={<RedirectIfAdmin><HomePage /></RedirectIfAdmin>} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:categoryId" element={<SubProducts />} />
            <Route path="/product/:productId" element={<VariantList />} />
            <Route path="/product/:productId/details" element={<ProductDetails />} />
            <Route path="/product/:productId/:variantName" element={<ProductDetails />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/worldmap" element={<WorldMapPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<RedirectIfAdmin><Login /></RedirectIfAdmin>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>

          {/* Premium Custom Glassmorphic Toast/Popup */}
          {customAlert.show && (
            <div
              style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ffffff',
                border: '2.5px solid #d4a017',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(212,160,23,0.25)',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                zIndex: 999999,
                maxWidth: '90vw',
                width: '420px',
                animation: 'slideDown 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              }}
            >
              <style>{`
                @keyframes slideDown {
                  from {
                    transform: translate(-50%, -40px);
                    opacity: 0;
                  }
                  to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                  }
                }
              `}</style>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#d4a017,#b8860b)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  flexShrink: 0
                }}
              >
                {customAlert.message.includes('⚠️') ||
                  customAlert.message.toLowerCase().includes('fail') ||
                  customAlert.message.toLowerCase().includes('error') ||
                  customAlert.message.toLowerCase().includes('denied') ||
                  customAlert.message.toLowerCase().includes('not match') ||
                  customAlert.message.toLowerCase().includes('exists') ? '!' : '✓'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b', lineHeight: '1.4' }}>
                  Goeazymart Notice
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                  {customAlert.message.replace(/[✅❌🛒🔔⚠️]/g, '').trim()}
                </p>
              </div>
              <button
                onClick={() => setCustomAlert({ show: false, message: '' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
              >
                ✕
              </button>
            </div>
          )}
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;