import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "flag-icons/css/flag-icons.min.css";

import { AuthProvider } from "./AuthContext.jsx";
import App from "./App.jsx";
import SupportAssistant from "./components/ui/SupportAssistant.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <SupportAssistant />
    </AuthProvider>
  </StrictMode>
);
