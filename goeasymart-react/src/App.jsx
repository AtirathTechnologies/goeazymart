import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import MarqueeBand from './components/MarqueeBand';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import WhySection from './components/WhySection';
import WhyChooseSection from './components/WhyChooseSection';
import CategoriesSection from './components/CategoriesSection';
import MarketsSection from './components/MarketsSection';
import ProcessSection from './components/ProcessSection';
import WorldMapSection from './components/WorldMapSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import Products from './pages/Products';

import './index.css';


// ✅ Home Page
function HomePage() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      <MarqueeBand />
      <Hero />
      <TopBar />
      <WhySection />
      <WhyChooseSection />
      <CategoriesSection />
      <MarketsSection />
      <ProcessSection />
      <WorldMapSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </>
  );
}

// ✅ Separate Pages (reuse sections)
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
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/worldmap" element={<WorldMapPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;