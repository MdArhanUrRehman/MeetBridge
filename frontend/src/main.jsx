import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as BrowseRoute } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowseRoute>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowseRoute>
);
