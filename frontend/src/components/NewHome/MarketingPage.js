import React, { useEffect, useRef } from 'react';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
import Highlights from './components/Highlights';
import Pricing from './components/Pricing';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { setMarginTop } from '../../actions/userAction'; 
import { useDispatch } from 'react-redux';


function MarketingPage() {
  const dispatch = useDispatch();
  const testimonialsRef = useRef(null);
  const featuresRef = useRef(null);
  const highlightsRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);

  
  useEffect(() => {
    dispatch(setMarginTop('0px'));
  }, [dispatch]);


  return (
    <>
      <AppAppBar 
        testimonialsRef={testimonialsRef} 
        featuresRef={featuresRef} 
        highlightsRef={highlightsRef} 
        pricingRef={pricingRef} 
        faqRef={faqRef} 
        
      />
      <Hero />
      <div>
        <LogoCollection />
        
        {/* Features Section */}
        <div ref={featuresRef}>
          <Features />
        </div>
        <Divider />
        
        {/* Testimonials Section */}
        <div ref={testimonialsRef}>
          <Testimonials />
        </div>
        <Divider />
        
        {/* Highlights Section */}
        <div ref={highlightsRef}>
          <Highlights />
        </div>
        <Divider />
        
        {/* Pricing Section */}
        <div ref={pricingRef}>
          <Pricing />
        </div>
        <Divider />
        
        {/* FAQ Section */}
        <div ref={faqRef}>
          <FAQ />
        </div>
        <Divider />
        
        {/* Footer Section */}
        <Footer />
      </div>
    </>
  );
};


export default MarketingPage;
