import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import FreeTrialConfirm from "./components/ui/FreeTrialConfirm.jsx";
import FreeTrialResult from "./components/ui/FreeTrialResult.jsx";
import { DEFAULT_COMMERCIAL_CONFIG } from "./utils/challengeRules.js";
import { calculatePrice } from "./utils/pricingEngine.js";

const PENDING_TRIAL_KEY = "acg.pendingFreeTrialPlan";
const PENDING_TRIAL_TTL_MS = 24 * 60 * 60 * 1000;

function clearPendingTrial() {
  localStorage.removeItem(PENDING_TRIAL_KEY);
}

function savePendingTrial(plan) {
  localStorage.setItem(PENDING_TRIAL_KEY, JSON.stringify({
    plan,
    expiresAt: Date.now() + PENDING_TRIAL_TTL_MS,
  }));
}

function readPendingTrial() {
  try {
    const raw = localStorage.getItem(PENDING_TRIAL_KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw);
    if (!stored?.plan?.challengeDefinition || Number(stored.expiresAt) <= Date.now()) {
      clearPendingTrial();
      return null;
    }

    return stored.plan;
  } catch {
    clearPendingTrial();
    return null;
  }
}

function App() {
  const [screen, setScreen] = useState("homepage");
  const [selectedPlan, setSelectedPlan] = useState(() => readPendingTrial());
  const [selectedTrialResult, setSelectedTrialResult] = useState(null);
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
    savePendingTrial(plan);

    if (user) {
      setScreen("freeTrialConfirm");
    } else {
      setScreen("auth");
    }
  };

  const handleTrialCreated = () => {
    clearPendingTrial();
  };

  const handleTrialBack = () => {
    clearPendingTrial();
    setScreen("homepage");
  };

  const handleAuthBack = () => {
    clearPendingTrial();
    setScreen("homepage");
  };

  const handleViewTrialResult = (trial) => {
    setSelectedTrialResult(trial);
    setScreen("freeTrialResult");
  };

  const handleStartChallengeFromTrial = (trial) => {
    const commercialConfig = trial?.sourceCommercialConfig || DEFAULT_COMMERCIAL_CONFIG;
    const challengeDefinition = trial?.challengeDefinition;

    if (!challengeDefinition) return;

    const plan = {
      challengeDefinition,
      commercialConfig,
      pricingPreview: calculatePrice(challengeDefinition, commercialConfig),
      sourceTrialId: trial.accountId,
      conversionSource: "FREE_TRIAL",
    };

    setSelectedPlan(plan);
    setScreen("payment");
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

  if (screen === "freeTrialResult" && selectedTrialResult) {
    return (
      <FreeTrialResult
        trial={selectedTrialResult}
        onBack={() => setScreen("dashboard")}
        onStartChallenge={handleStartChallengeFromTrial}
      />
    );
  }

  if (screen === "dashboard" || (screen === "auth" && user && !readPendingTrial())) {
    return (
      <Dashboard
        onBack={() => setScreen("homepage")}
        onViewTrialResult={handleViewTrialResult}
      />
    );
  }

  if (screen === "auth") {
    return <Auth onBack={handleAuthBack} intent={readPendingTrial() ? "free-trial" : "default"} />;
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
