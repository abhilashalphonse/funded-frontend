import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import BuildChallenge from "./components/ui/BuildChallenge.jsx";
import PaymentPage from "./components/PaymentPage.jsx";

function App() {
  const [screen, setScreen] = useState(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("payment")) return "payment";
    return "homepage";
  });
  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = window.sessionStorage.getItem("acg:selectedPlan");
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  });
  const [builderMode, setBuilderMode] = useState("paid");
  const [trialError, setTrialError] = useState("");
  const [trialCreating, setTrialCreating] = useState(false);
  const [trialChecking, setTrialChecking] = useState(false);
  const [pendingTrialIntent, setPendingTrialIntent] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("acg:pendingTrial") === "1";
  });
  const [postAuthScreen, setPostAuthScreen] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem("acg:postAuthScreen");
  });
  const { user, getAccessToken } = useAuth();

  // Challenge Builder / pricing grid hands a plan object over here; we stash
  // it and move straight to the checkout/activation step.
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("acg:selectedPlan", JSON.stringify(plan));
    }
    setScreen("payment");
  };

  const handleOpenTrialBuilder = useCallback(async () => {
    if (!user) {
      setPendingTrialIntent(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("acg:pendingTrial", "1");
        window.sessionStorage.setItem("acg:postAuthScreen", "trial");
      }
      setPostAuthScreen("trial");
      setTrialError("");
      setScreen("auth");
      return;
    }

    if (trialChecking) return;
    setTrialChecking(true);
    setTrialError("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/customer/trial-readiness`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.data?.ready) {
        const checks = payload?.data?.checks || {};
        const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
        const suffix = failed.length ? ` Failed checks: ${failed.join(", ")}.` : "";
        throw new Error((payload?.message || payload?.data?.error || "ACG Trader is not ready for free trials.") + suffix);
      }

      setBuilderMode("trial");
      setScreen("builder");
    } catch (error) {
      setTrialError(error?.message || "Unable to verify ACG Trader readiness.");
      setScreen("dashboard");
    } finally {
      setTrialChecking(false);
    }
  }, [getAccessToken, trialChecking, user]);

  useEffect(() => {
    if (!user) return;

    if (pendingTrialIntent || postAuthScreen === "trial") {
      setPendingTrialIntent(false);
      setPostAuthScreen(null);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("acg:pendingTrial");
        window.sessionStorage.removeItem("acg:postAuthScreen");
      }
      void handleOpenTrialBuilder();
      return;
    }

    if (postAuthScreen === "payment" && selectedPlan) {
      setPostAuthScreen(null);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("acg:postAuthScreen");
      }
      setScreen("payment");
    }
  }, [user, pendingTrialIntent, postAuthScreen, selectedPlan, handleOpenTrialBuilder]);

  const handleStartTrial = async (plan) => {
    if (trialCreating) return;
    setTrialCreating(true);
    setTrialError("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/customer/demo-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeDefinition: plan.challengeDefinition,
          commercialConfig: plan.commercialConfig,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message || "Unable to create your free trial.");
      setScreen("dashboard");
    } catch (error) {
      setTrialError(error?.message || "Unable to create your free trial.");
    } finally {
      setTrialCreating(false);
    }
  };

  if (screen === "dashboard" && user) {
    return (
      <Dashboard
        onBack={() => setScreen("homepage")}
        onNewChallenge={() => {
          setBuilderMode("paid");
          setTrialError("");
          setScreen("builder");
        }}
        onFreeTrial={handleOpenTrialBuilder}
        trialChecking={trialChecking}
        trialError={trialError}
      />
    );
  }

  if (screen === "dashboard" && !user) {
    return <Auth onBack={() => setScreen("homepage")} initialView={pendingTrialIntent ? "signup" : "login"} />;
  }

  if (screen === "auth") {
    return <Auth onBack={() => setScreen("homepage")} initialView={pendingTrialIntent ? "signup" : "login"} />;
  }

  if (screen === "builder") {
    return (
      <BuildChallenge
        onSelectPlan={builderMode === "trial" ? handleStartTrial : handleSelectPlan}
        onBack={() => setScreen(user ? "dashboard" : "homepage")}
        actionLabel={builderMode === "trial" ? "Start Free Trial" : "Start Your Challenge"}
        actionLoading={builderMode === "trial" && trialCreating}
        notice={builderMode === "trial" ? trialError : ""}
      />
    );
  }

  if (screen === "payment") {
    return (
      <PaymentPage
        plan={selectedPlan}
        onBack={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setBuilderMode("paid");
          setScreen("builder");
        }}
        onSignIn={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          if (user) {
            setScreen("dashboard");
            return;
          }
          setPostAuthScreen("payment");
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem("acg:postAuthScreen", "payment");
          }
          setScreen("auth");
        }}
      />
    );
  }

  return (
    <Homepage
      onSignIn={() => setScreen("auth")}
      onDashboard={() => setScreen("dashboard")}
      onGetStarted={() => {
        setBuilderMode("paid");
        setScreen("builder");
      }}
      onSelectPlan={handleSelectPlan}
      onFreeTrial={handleOpenTrialBuilder}
    />
  );
}

export default App;