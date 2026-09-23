import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import BuildChallenge from "./components/ui/BuildChallenge.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import LegalPage, { getLegalPage } from "./components/ui/LegalPage.jsx";
import RulesPage from "./components/ui/RulesPage.jsx";
import { captureAttribution, getAnalyticsSessionId, trackEvent } from "./utils/analytics.js";

function isAuthCallbackLocation() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/+$/, "");
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return path === "/auth/callback"
    || query.has("code")
    || query.has("token_hash")
    || hash.has("access_token")
    || hash.has("refresh_token")
    || ["signup", "recovery", "email_change", "magiclink"].includes(query.get("type"))
    || ["signup", "recovery", "email_change", "magiclink"].includes(hash.get("type"));
}

function cleanAuthCallbackUrl() {
  if (typeof window === "undefined") return;
  if (!isAuthCallbackLocation()) return;
  window.history.replaceState({}, document.title, "/");
}

function TraderLaunchingPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Opening ACG Trader…";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-black px-6 text-white antialiased">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-12 w-20 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.035] text-[17px] font-black tracking-[-0.05em]">
          ACG
        </div>
        <div className="mx-auto mt-7 size-7 animate-spin rounded-full border-2 border-white/15 border-t-white" />
        <h1 className="mt-6 text-[18px] font-semibold tracking-[-0.025em]">Opening ACG Trader</h1>
        <p className="mx-auto mt-2 max-w-xs text-[12px] leading-5 text-neutral-500">
          Securing your trading session and connecting the selected account.
        </p>
        <div className="mx-auto mt-7 h-px w-36 overflow-hidden bg-white/[0.08]">
          <div className="h-full w-1/2 animate-pulse bg-white/60" />
        </div>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-700">
          ACG Funded · Secure launch
        </p>
      </div>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("payment")) return "payment";
      if (isAuthCallbackLocation()) return "auth-callback";
      if (params.get("postPurchase") === "claim") return "auth";
      if (params.get("postPurchase") === "dashboard") return "dashboard";
    }
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
    const stored = window.sessionStorage.getItem("acg:postAuthScreen");
    if (stored) return stored;
    const intent = new URLSearchParams(window.location.search).get("postPurchase");
    return intent === "claim" ? "claim-purchase" : intent === "dashboard" ? "dashboard" : null;
  });
  const [postPurchaseAccountId, setPostPurchaseAccountId] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("accountId") || window.sessionStorage.getItem("acg:postPurchaseAccountId") || "";
  });
  const { user, loading: authLoading, getAccessToken } = useAuth();
  const checkoutEmailHint = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("email") || window.sessionStorage.getItem("acg:lastCheckoutEmail") || ""
    : "";
  const authEmailHint = ["dashboard", "payment", "claim-purchase"].includes(postAuthScreen) ? checkoutEmailHint : "";

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    if (screen !== "auth-callback" || authLoading) return;
    if (user) {
      cleanAuthCallbackUrl();
      setScreen("dashboard");
      return;
    }
    cleanAuthCallbackUrl();
    setPostAuthScreen("dashboard");
    setScreen("auth");
  }, [authLoading, screen, user]);

  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    if (window.sessionStorage.getItem("acg:authMode") === "signup") {
      window.sessionStorage.removeItem("acg:authMode");
      void trackEvent("signup_completed", { method: "oauth" }, { getAccessToken });
    }
  }, [user, getAccessToken]);

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
        headers: {
          Authorization: `Bearer ${token}`,
          "x-acg-session-id": getAnalyticsSessionId(),
        },
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

    if (postAuthScreen === "dashboard" || postAuthScreen === "claim-purchase") {
      const completedClaim = postAuthScreen === "claim-purchase";
      setPostAuthScreen(null);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("acg:postAuthScreen");
        window.sessionStorage.removeItem("acg:lastCheckoutEmail");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      if (completedClaim) {
        void trackEvent("post_purchase_signup_completed", { accountId: postPurchaseAccountId || null }, { getAccessToken });
      }
      void trackEvent("dashboard_opened_after_purchase", { accountId: postPurchaseAccountId || null }, { getAccessToken });
      setScreen("dashboard");
      return;
    }

    if (postAuthScreen === "payment" && selectedPlan) {
      setPostAuthScreen(null);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("acg:postAuthScreen");
      }
      setScreen("payment");
      return;
    }

    if (screen === "auth") {
      setScreen("dashboard");
    }
  }, [user, pendingTrialIntent, postAuthScreen, postPurchaseAccountId, selectedPlan, screen, handleOpenTrialBuilder, getAccessToken]);

  const handleAuthBack = () => {
    setPendingTrialIntent(false);
    setPostAuthScreen(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("acg:pendingTrial");
      window.sessionStorage.removeItem("acg:postAuthScreen");
    }
    setScreen("homepage");
  };

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
          "x-acg-session-id": getAnalyticsSessionId(),
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

const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const legalPage = getLegalPage(currentPath);
  const normalizedPath = currentPath.replace(/\/+$/, "") || "/";
  const isAdminPath = normalizedPath.startsWith("/admin");
  const isTraderLaunchingPath = normalizedPath === "/trader-launching";
  const isRulesPath = normalizedPath === "/rules";

  if (isTraderLaunchingPath) {
    return <TraderLaunchingPage />;
  }

  if (legalPage) {
    return <LegalPage page={legalPage} />;
  }

  if (isRulesPath) {
    return <RulesPage />;
  }

  if (isAdminPath) {
    if (!user) {
      return <Auth onBack={() => { window.location.href = "/"; }} initialView="login" />;
    }
    return <AdminDashboard />;
  }

  if (screen === "auth-callback") {
    return (
      <div className="grid min-h-screen place-items-center bg-black px-6 text-center text-white">
        <div>
          <div className="mx-auto size-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4 text-[13px] font-medium text-neutral-300">Confirming your email…</p>
        </div>
      </div>
    );
  }

  if (screen === "dashboard" && user) {
    return (
      <Dashboard
        initialAccountId={postPurchaseAccountId}
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
    return <Auth onBack={handleAuthBack} initialView={pendingTrialIntent || postAuthScreen === "claim-purchase" ? "signup" : "login"} initialEmail={authEmailHint} lockInitialEmail={postAuthScreen === "claim-purchase"} />;
  }

  if (screen === "auth") {
    return <Auth onBack={handleAuthBack} initialView={pendingTrialIntent || postAuthScreen === "claim-purchase" ? "signup" : "login"} initialEmail={authEmailHint} lockInitialEmail={postAuthScreen === "claim-purchase"} />;
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
        onHome={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setScreen("homepage");
        }}
        onDashboard={(accountId = "") => {
          window.history.replaceState({}, document.title, window.location.pathname);
          if (accountId) {
            setPostPurchaseAccountId(accountId);
            window.sessionStorage.setItem("acg:postPurchaseAccountId", accountId);
          }
          if (user) {
            void trackEvent("dashboard_opened_after_purchase", { accountId: accountId || null }, { getAccessToken });
            setScreen("dashboard");
            return;
          }
          setPostAuthScreen("dashboard");
          window.sessionStorage.setItem("acg:postAuthScreen", "dashboard");
          setScreen("auth");
        }}
        onSetupAccount={(purchaseEmail = "", accountId = "") => {
          const normalizedEmail = String(purchaseEmail || "").trim().toLowerCase();
          if (normalizedEmail) window.sessionStorage.setItem("acg:lastCheckoutEmail", normalizedEmail);
          if (accountId) {
            setPostPurchaseAccountId(accountId);
            window.sessionStorage.setItem("acg:postPurchaseAccountId", accountId);
          }
          setPostAuthScreen("claim-purchase");
          window.sessionStorage.setItem("acg:postAuthScreen", "claim-purchase");
          void trackEvent("post_purchase_signup_started", { accountId: accountId || null }, { entryIntent: "paid" });
          window.history.replaceState({}, document.title, window.location.pathname);
          setScreen("auth");
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