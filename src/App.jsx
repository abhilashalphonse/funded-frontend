import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import FreeTrialConfirm from "./components/ui/FreeTrialConfirm.jsx";

const PENDING_TRIAL_KEY = "acg.pendingFreeTrialPlan";

function readPendingTrial() {
  try {
    const raw = sessionStorage.getItem(PENDING_TRIAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem(PENDING_TRIAL_KEY);
    return null;
  }
}

function App() {
  const [screen, setScreen] = useState("homepage");
  const [selectedPlan, setSelectedPlan] = useState(() => readPendingTrial());
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const pendingTrial = readPendingTrial();
    if (pendingTrial?.challengeDefinition) {
      setSelectedPlan(pendingTrial);
      setScreen("freeTrialConfirm");
    }
  }, [user]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setScreen("payment");
  };

  const handleSelectFreeTrial = (plan) => {
    setSelectedPlan(plan);
    sessionStorage.setItem(PENDING_TRIAL_KEY, JSON.stringify(plan));

    if (user) {
      setScreen("freeTrialConfirm");
    } else {
      setScreen("auth");
    }
  };

  const handleTrialCreated = () => {
    sessionStorage.removeItem(PENDING_TRIAL_KEY);
  };

  const handleTrialBack = () => {
    sessionStorage.removeItem(PENDING_TRIAL_KEY);
    setScreen("homepage");
  };

  const handleAuthBack = () => {
    sessionStorage.removeItem(PENDING_TRIAL_KEY);
    setScreen("homepage");
  };

  if (screen === "freeTrialConfirm" && user && selectedPlan?.challengeDefinition) {
    return (
      <FreeTrialConfirm
        plan={selectedPlan}
        onBack={handleTrialBack}
        onCreated={handleTrialCreated}
        onGoToDashboard={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "dashboard" || (screen === "auth" && user && !readPendingTrial())) {
    return <Dashboard onBack={() => setScreen("homepage")} />;
  }

  if (screen === "auth") {
    return <Auth onBack={handleAuthBack} />;
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

  return (
    <Homepage
      onSignIn={() => setScreen("auth")}
      onSelectPlan={handleSelectPlan}
      onSelectFreeTrial={handleSelectFreeTrial}
    />
  );
}

export default App;
