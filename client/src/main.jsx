import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import KryptoApp from "./App"
import LandingPage from "./pages/LandingPage"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<KryptoApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)