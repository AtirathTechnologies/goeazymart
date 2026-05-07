import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Other Pages
const MarketsPage = () => <><MarketsSection /><Footer /></>;
const ProcessPage = () => <><ProcessSection /><Footer /></>;
const WorldMapPage = () => <><WorldMapSection /><Footer /></>;
const ContactPage = () => <><ContactSection /><Footer /></>;

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryId" element={<SubProducts />} />
        <Route path="/product/:productId" element={<VariantList />} />
        <Route path="/product/:productId/details" element={<ProductDetails />} />
        <Route path="/product/:productId/:variantName" element={<ProductDetails />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/worldmap" element={<WorldMapPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;