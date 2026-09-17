import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import NoChallengeDashboard from "./components/ui/NoChallengeDashboard.jsx";
import PaymentPage from "./components/PaymentPage.jsx";

function App() {
  const [screen, setScreen] = useState("homepage");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();

  // Challenge persistence is not wired into the frontend yet. Keep the state
  // explicit so the active-account dashboard can be restored as soon as the
  // backend challenge lookup is connected.
  const hasActiveChallenge = false;

  // Challenge Builder / pricing grid hands a plan object over here; we stash
  // it and move straight to the checkout/activation step.
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setScreen("payment");
  };

  const openChallengeBuilder = () => {
    setScreen("homepage");
  };

  if (screen === "dashboard" || (screen === "auth" && user)) {
    if (!hasActiveChallenge) {
      return (
        <NoChallengeDashboard
          onBack={() => setScreen("homepage")}
          onStartChallenge={openChallengeBuilder}
        />
      );
    }

    return <Dashboard onBack={() => setScreen("homepage")} />;
  }

  if (screen === "auth") {
    return <Auth onBack={() => setScreen("homepage")} />;
  }

  if (screen === "payment") {
    return (
      <PaymentPage
        plan={selectedPlan}
        onBack={() => setScreen("homepage")}
        onSignIn={() => setScreen("auth")}
      />
    );
  }

  return <Homepage onSignIn={() => setScreen("auth")} onSelectPlan={handleSelectPlan} />;
}

export default App;