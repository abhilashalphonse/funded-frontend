import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'flag-icons/css/flag-icons.min.css';
import App from "./App";
import { AuthProvider } from './AuthContext.jsx';
import WaitingList from "./components/WaitingList.jsx";
import Homepage from "./components/ui/Homepage.jsx";
import Auth from "./components/ui/Auth.jsx"; 
import Dashboard from "./components/ui/Dashboard.jsx";

createRoot(document.getElementById("root")).render( 
  <StrictMode>
    <AuthProvider>
      < Dashboard />
    </AuthProvider>
  </StrictMode>
);