import React from "react"
import { Link, useLocation } from "react-router-dom"

export default function Header() {
  const location = useLocation()
  const activeTab = location.pathname === "/" ? "encrypt" : "decrypt"

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl"></span>
            <span>KRYPTO</span>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all sm:px-4 sm:py-2 sm:text-base ${
                activeTab === "encrypt" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Encrypt
            </Link>
            <Link
              to="/decrypt"
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all sm:px-4 sm:py-2 sm:text-base ${
                activeTab === "decrypt" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Decrypt (Auto-Detect)
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
