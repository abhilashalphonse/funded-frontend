import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import YourChallengeSection from "./components/YourChallengeSection";
import ChallengesSection from "./components/ChallengeSection";
import ReviewSection from "./components/ReviewSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PlatformsSection from "./components/PlatformsSection";
import AcademySection from "./components/AcademySection";
import TeamSection from "./components/TeamSection";
import SupportSection from "./components/SupportSection";
import FaqSection from "./components/FaqSection";
import StartChallengeSection from "./components/StartChallengeSection";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import PaymentPage from "./components/PaymentPage"; 



function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, loading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Sync dashboard visibility with the user's authentication status
  useEffect(() => {
    if (user) {
      setShowDashboard(true);
    } else {
      setShowDashboard(false);
    }
  }, [user]);

  // 1. Loading State
  if (loading) { 
    return (
      <div className="min-h-screen w-full bg-[#0a0b0d] flex items-center justify-center">
        <span className="h-5 w-5 rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin" />
      </div>
    );
  }

  // 2. Authenticated State
  if (user && showDashboard) {  
    return (
      <Dashboard onBack={() => setShowDashboard(false)} /> 
    );
  }

  if (selectedPlan) {
    return (
      <PaymentPage
        plan={selectedPlan}
        onBack={() => setSelectedPlan(null)}
      />
    );
  }

  // 3. Unauthenticated State (Landing Page)
  return (
    <div className="min-h-screen bg-black">
      {showLogin ? (
        <Auth onBack={() => setShowLogin(false)} />
      ) : (
        <>
          <Navbar onLogin={() => {
            if (user) setShowDashboard(true);
            else setShowLogin(true);
          }} />
          <HeroSection />
          <YourChallengeSection /> 
          <ChallengesSection onSelectPlan={setSelectedPlan} /> {/* <-- pass callback */}
          <FeaturesSection />
          <ReviewSection />
          <HowItWorksSection />
          <PlatformsSection />
          <AcademySection />
          <TeamSection />
          <SupportSection />
          <FaqSection />
          <StartChallengeSection />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;