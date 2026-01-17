import { Routes, Route } from "react-router-dom"
import Header from "./components/header"
import EncryptPage from "./pages/encrypt-page"
import DecryptPage from "./pages/decrypt-page"

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<EncryptPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
      </Routes>
    </div>
  )
}
