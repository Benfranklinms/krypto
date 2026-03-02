import React from "react"


export default function ShiftInput({ value, onChange }) {
  return (
    <input
      type="number"
      min="0"
      max="25"
      value={value}
      onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    />
  )
}
