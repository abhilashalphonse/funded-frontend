import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { customerApi } from "./api/customer.js";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import OnboardingDashboard from "./components/ui/OnboardingDashboard.jsx";
import BuildChallenge from "./components/ui/BuildChallenge.jsx";
import DemoTrading from "./components/ui/DemoTrading.jsx";
import PaymentPage from "./components/PaymentPage.jsx";

function WorkspaceLoading() {
  return <div className="grid min-h-screen place-items-center bg-black text-white"><div className="flex items-center gap-2 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading your ACG workspace...</div></div>;
}

function App() {
  const [screen, setScreen] = useState("homepage");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const [demoAccount, setDemoAccount] = useState(null);
  const { user } = useAuth();

  const refreshWorkspace = async () => {
    if (!user) {
      setWorkspace(null);
      setDemoAccount(null);
      return null;
    }
    setWorkspaceLoading(true);
    setWorkspaceError("");
    try {
      const next = await customerApi.workspace();
      setWorkspace(next);
      if (next?.demos?.[0]) setDemoAccount(next.demos[0]);
      return next;
    } catch (error) {
      setWorkspaceError(error.message || "Unable to load your customer workspace.");
      return null;
    } finally {
      setWorkspaceLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setWorkspace(null);
      setDemoAccount(null);
      return;
    }
    void refreshWorkspace();
  }, [user?.id]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setScreen("payment");
  };

  const openChallengeBuilder = () => setScreen("challenge");

  const openDemo = async () => {
    setWorkspaceError("");
    try {
      let account = demoAccount || workspace?.demos?.[0];
      if (!account) account = await customerApi.createDemoAccount();
      setDemoAccount(account);
      setWorkspace(current => current ? {
        ...current,
        demos: [account, ...(current.demos || []).filter(item => item.accountId !== account.accountId)],
        accounts: [account, ...(current.accounts || []).filter(item => item.accountId !== account.accountId)],
      } : current);
      setScreen("demo");
    } catch (error) {
      setWorkspaceError(error.message || "Unable to open the demo account.");
    }
  };

  const handleDemoAccountChange = (account) => {
    setDemoAccount(account);
    setWorkspace(current => current ? {
      ...current,
      demos: [account, ...(current.demos || []).filter(item => item.accountId !== account.accountId)],
      accounts: [account, ...(current.accounts || []).filter(item => item.accountId !== account.accountId)],
    } : current);
  };

  if (screen === "demo" && user && demoAccount) {
    return <DemoTrading account={demoAccount} onAccountChange={handleDemoAccountChange} onBack={() => setScreen("dashboard")} onStartChallenge={openChallengeBuilder} />;
  }

  if (screen === "challenge") {
    return <BuildChallenge onSelectPlan={handleSelectPlan} />;
  }

  if (screen === "dashboard" || (screen === "auth" && user)) {
    if (workspaceLoading && !workspace) return <WorkspaceLoading />;

    if (!workspace?.hasActiveChallenge) {
      return <>
        {workspaceError && <div className="fixed left-1/2 top-4 z-[100] -translate-x-1/2 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-300">{workspaceError}</div>}
        <OnboardingDashboard
          workspace={workspace}
          onBack={() => setScreen("homepage")}
          onStartChallenge={openChallengeBuilder}
          onTryDemo={openDemo}
        />
      </>;
    }

    return <Dashboard account={workspace.activeChallenge} onBack={() => setScreen("homepage")} />;
  }

  if (screen === "auth") {
    return <Auth onBack={() => setScreen("homepage")} />;
  }

  if (screen === "payment") {
    return <PaymentPage plan={selectedPlan} onBack={openChallengeBuilder} onSignIn={() => setScreen("auth")} />;
  }

  return <Homepage onSignIn={() => setScreen("auth")} onSelectPlan={handleSelectPlan} />;
}

export default App;