import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./pages/Main";
import "./styles/app.css";

// Nous allons définir l'URL de Mercure dans une variable globale
window.MERCURE_PUBLIC_URL =
  process.env.MERCURE_PUBLIC_URL || "http://localhost:3000/.well-known/mercure";

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Main />);
  }
});
