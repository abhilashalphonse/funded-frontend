import React from 'react';
import Hero from './Hero';
import TrustSection from './TrustSection';
import HowItWorksSection from './HowItWorks';
import Proof from './Proof';
import Support from './Support';
import Navbar from './Navbar';
import Footer from './Footer';
import BuildChallenge from './BuildChallenge';

function scrollToBuilder() {
  document.getElementById('challenge-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Homepage({ onSignIn, onSelectPlan, onSelectFreeTrial }) {
  return (
    <>
      <Navbar onSignIn={onSignIn} />
      <Hero onStartChallenge={scrollToBuilder} onStartFreeTrial={scrollToBuilder} />
      <TrustSection />
      <BuildChallenge onSelectPlan={onSelectPlan} onSelectFreeTrial={onSelectFreeTrial} />
      <HowItWorksSection />
      <Proof />
      <Support />
      <Footer />
    </>
  );
}

export default Homepage;
