import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ReactScan } from "./ReactScan";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactScan />
    <App />
  </StrictMode>
);
