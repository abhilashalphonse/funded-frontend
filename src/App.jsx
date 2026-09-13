import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import PaymentPage from "./components/PaymentPage.jsx";

function App() {
  const [screen, setScreen] = useState("homepage");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();

  // Challenge Builder / pricing grid hands a plan object over here; we stash
  // it and move straight to the checkout/activation step.
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setScreen("payment");
  };

  if (screen === "dashboard" || (screen === "auth" && user)) {
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