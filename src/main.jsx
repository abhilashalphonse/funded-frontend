import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'flag-icons/css/flag-icons.min.css';
import { AuthProvider } from './AuthContext.jsx';
import { useAuth } from './AuthContext.jsx';
import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";

function Root() {
  const [screen, setScreen] = useState("dashboard");
  const { user } = useAuth();

  if (user && screen === "auth") {
    return <Dashboard onBack={() => setScreen("homepage")} />;
  }

  if (screen === "dashboard") {
    return <Dashboard onBack={() => setScreen("homepage")} />;
  }

  if (screen === "auth") {
    return <Auth onBack={() => setScreen("homepage")} />;
  }

  return <Homepage onSignIn={() => setScreen("auth")} />;
}

createRoot(document.getElementById("root")).render( 
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>
);
