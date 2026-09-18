import React from 'react';
import Hero from './Hero';
import TrustSection from './TrustSection';
import HowItWorksSection from './HowItWorks';
import Proof from './Proof';
import Support from './Support';
import Navbar from './Navbar';
import Footer from './Footer';
import BuildChallenge from './BuildChallenge';

function Homepage({ onSignIn, onDashboard, onGetStarted, onSelectPlan, onFreeTrial }) {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToChallenges = () => {
    document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar onSignIn={onSignIn} onDashboard={onDashboard} onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} onFreeTrial={onFreeTrial} onSeeHowItWorks={scrollToHowItWorks} />
      <TrustSection />
      <div id="challenges">
        <BuildChallenge onSelectPlan={onSelectPlan} />
      </div>
      <HowItWorksSection onGetFunded={onGetStarted} onLearnMore={scrollToChallenges} />
      <Proof />
      <Support />
      <Footer />
    </>
  );
}

export default Homepage;
