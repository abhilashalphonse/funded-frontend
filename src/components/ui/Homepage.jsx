import React, { useEffect } from 'react';
import Hero from './Hero';
import TrustSection from './TrustSection';
import HowItWorksSection from './HowItWorks';
import Proof from './Proof';
import Support from './Support';
import Navbar from './Navbar';
import Footer from './Footer';
import BuildChallenge from './BuildChallenge';
import { captureAttribution, trackEvent } from '../../utils/analytics.js';

function Homepage({ onSignIn, onDashboard, onGetStarted, onSelectPlan, onFreeTrial }) {
  useEffect(() => {
    captureAttribution();
    void trackEvent("landing_view");
  }, []);

  const startChallenge = (source) => {
    void trackEvent("hero_cta_click", { source, intent: "paid" }, { entryIntent: "paid" });
    onGetStarted?.();
  };

  const startTrial = (source) => {
    void trackEvent("free_trial_click", { source, intent: "trial" }, { entryIntent: "trial" });
    onFreeTrial?.();
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToChallenges = () => {
    document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar onSignIn={onSignIn} onDashboard={onDashboard} onGetStarted={() => startChallenge("navbar")} />
      <Hero onGetStarted={() => startChallenge("hero")} onFreeTrial={() => startTrial("hero_badge")} onSeeHowItWorks={scrollToHowItWorks} />
      <TrustSection />
      <div id="challenges">
        <BuildChallenge onSelectPlan={onSelectPlan} />
      </div>
      <HowItWorksSection onGetFunded={() => startChallenge("how_it_works")} onLearnMore={scrollToChallenges} />
      <Proof />
      <Support />
      <Footer />
    </>
  );
}

export default Homepage;
