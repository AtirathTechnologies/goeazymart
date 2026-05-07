import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

import MarqueeBand from '../components/MarqueeBand';
import TopBar from '../components/TopBar';
import Hero from '../components/Hero';
import WhySection from '../components/WhySection';
import WhyChooseSection from '../components/WhyChooseSection';
import CategoriesSection from '../components/CategoriesSection';
import MarketsSection from '../components/MarketsSection';
import ProcessSection from '../components/ProcessSection';
import WorldMapSection from '../components/WorldMapSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage = () => {

  const location = useLocation();

  useLayoutEffect(() => {
    if (location.hash === "#products") {
      const el = document.getElementById("products");

      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });

        // ✅ IMPORTANT: scroll ayyaka hash remove cheyyali
        setTimeout(() => {
          window.history.replaceState(null, "", "/");
        }, 500); // small delay for smooth scroll finish
      }
    } else {
      // normal load → top
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);

  
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
};

export default HomePage;