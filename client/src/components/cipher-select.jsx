import React from "react"


export default function CipherSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="caesar">Caesar</option>
      <option value="affine">Affine</option>
      <option value="vigenere">Vigenère</option>
    </select>
  )
}
