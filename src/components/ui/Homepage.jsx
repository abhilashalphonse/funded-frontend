import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import TrustSection from './TrustSection';
import Challenge from './Challenge';
import HowItWorksSection from './HowItWorks';
import Proof from './Proof';
import Support from './Support';
import Navbar from './Navbar';
import Footer from './Footer';
import BuildChallenge from './BuildChallenge';




function Homepage({ onSignIn, onSelectPlan }) {

  return (
    <>
    <Navbar onSignIn={onSignIn} />
    <Hero /> 
    <TrustSection /> 
    <BuildChallenge onSelectPlan={onSelectPlan} />
    <HowItWorksSection /> 
    <Proof />
    <Support />
    <Footer />
    </> 
  );
}

export default Homepage;