import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";

function App() {
  const [screen, setScreen] = useState("homepage");
  const { user } = useAuth();

  if (screen === "dashboard" || (screen === "auth" && user)) {
    return <Dashboard onBack={() => setScreen("homepage")} />;
  }

  if (screen === "auth") {
    return <Auth onBack={() => setScreen("homepage")} />;
  }

  return <Homepage onSignIn={() => setScreen("auth")} />;
}

export default App;