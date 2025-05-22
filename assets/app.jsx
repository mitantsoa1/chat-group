import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./pages/Main";
import "./styles/app.css";
import { AdminContextProvider } from "./context/useAdmin";

// Nous allons définir l'URL de Mercure dans une variable globale
window.MERCURE_PUBLIC_URL =
  process.env.MERCURE_PUBLIC_URL || "http://localhost:3001/.well-known/mercure";

// window.BASE_URL = process.env.BASE_URL || "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <AdminContextProvider>
        <Main />
      </AdminContextProvider>
    );
  }
});
