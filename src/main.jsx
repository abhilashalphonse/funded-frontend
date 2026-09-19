import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "flag-icons/css/flag-icons.min.css";

import { AuthProvider } from "./AuthContext.jsx";
import App from "./App.jsx";
import SupportAssistant from "./components/ui/SupportAssistant.jsx";

const isAdminPath = typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "").startsWith("/admin");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      {!isAdminPath && <SupportAssistant />}
    </AuthProvider>
  </StrictMode>
);
