import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import CipherSelect from "../components/cipher-select"
import ShiftInput from "../components/shift-input"
import TextareaInput from "../components/textarea-input"

export default function EncryptPage() {
  const [plaintext, setPlaintext] = useState("THIS IS A SECRET MESSAGE")
  const [cipherType, setCipherType] = useState("caesar")
  const [shift, setShift] = useState(3)
  const [ciphertext, setCiphertext] = useState("WKLV LV D SECRET MESSAGE")

  const handleEncrypt = () => {
    if (cipherType === "caesar") {
      const encrypted = plaintext
        .split("")
        .map((char) => {
          if (/[A-Z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65)
          }
          if (/[a-z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97)
          }
          return char
        })
        .join("")
      setCiphertext(encrypted)
    } else if (cipherType === "rot13") {
      const encrypted = plaintext
        .split("")
        .map((char) => {
          if (/[A-Z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + 13) % 26) + 65)
          }
          if (/[a-z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + 13) % 26) + 97)
          }
          return char
        })
        .join("")
      setCiphertext(encrypted)
    } else if (cipherType === "atbash") {
      const encrypted = plaintext
        .split("")
        .map((char) => {
          if (/[A-Z]/.test(char)) {
            return String.fromCharCode(90 - (char.charCodeAt(0) - 65))
          }
          if (/[a-z]/.test(char)) {
            return String.fromCharCode(122 - (char.charCodeAt(0) - 97))
          }
          return char
        })
        .join("")
      setCiphertext(encrypted)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(ciphertext)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Encrypt Plaintext</h1>
        <p className="text-gray-600">Choose a cipher and key to encrypt your message.</p>
      </div>

      {/* Plaintext Input Section */}
      <Card className="mb-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold text-gray-900">Plaintext Input</label>
          <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">Text to encrypt</span>
        </div>
        <TextareaInput
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter text to encrypt..."
        />
      </Card>

      {/* Controls Section */}
      <Card className="mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Cipher Type</label>
            <CipherSelect value={cipherType} onChange={setCipherType} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Shift (0-25)</label>
            <ShiftInput value={shift} onChange={setShift} />
          </div>
          <div>
            <Button onClick={handleEncrypt} className="w-full flex items-center justify-center gap-2">
              Encrypt Text
            </Button>
          </div>
        </div>
      </Card>

      {/* Ciphertext Output Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg"></span>
            <label className="text-lg font-semibold text-gray-900">Ciphertext Output</label>
          </div>
          <button
            onClick={handleCopyToClipboard}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
        <TextareaInput value={ciphertext} readOnly placeholder="Encrypted text will appear here..." />
        <div className="flex justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
          <span>Chars: {ciphertext.length}</span>
          <span>Words: {ciphertext.split(/\s+/).filter((w) => w).length}</span>
        </div>
      </Card>
    </main>
  )
}
