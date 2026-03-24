import { useState } from "react"
import { encrypt } from "../api/encryption"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import CipherSelect from "../components/cipher-select"
import ShiftInput from "../components/shift-input"
import TextareaInput from "../components/textarea-input"

export default function EncryptPage() {
  const [plaintext, setPlaintext] = useState("THIS IS A SECRET MESSAGE")
  const [cipherType, setCipherType] = useState("caesar")
  const [shift, setShift] = useState(0)
  const [a, setA] = useState(1)          // For affine
  const [b, setB] = useState(0)          // For affine
  const [key, setKey] = useState("")     // For vigenere
  const [result, setResult] = useState("")

  const handleEncrypt = async () => {
    try {
      let data = {
        cipher: cipherType,
        text: plaintext,
        key: key
      }

      if (cipherType === "caesar") {
        data.shift = shift
      }

      if (cipherType === "affine") {
        data.a = a
        data.b = b
      }

      if (cipherType === "vigenere") {
        data.key = key
      }

    const res = await encrypt(data)
console.log("RES:", res)

const output =
  res?.result?.result ??
  res?.result ??
  res?.data?.result ??
  res?.error ??
  ""

setResult(String(output))

    } catch (error) {
      console.error("Encryption failed:", error)
      setResult("Encryption failed. Please try again.")
    }
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
        <TextareaInput
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter text to encrypt..."
        />
      </Card>

      {/* Controls Section */}
      <Card className="mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

          {/* Cipher Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cipher Type</label>
            <CipherSelect value={cipherType} onChange={setCipherType} />
          </div>

          {/* Caesar */}
          {cipherType === "caesar" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Shift (0-25)</label>
              <ShiftInput value={shift} onChange={setShift} />
            </div>
          )}

          {/* Affine */}
          {cipherType === "affine" && (
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="a"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
                className="border px-3 py-2 rounded-lg w-full"
              />
              <input
                type="number"
                placeholder="b"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>
          )}

          {/* Vigenere */}
          {cipherType === "vigenere" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Key</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter key"
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>
          )}

          <div>
            <Button onClick={handleEncrypt} className="w-full !bg-black">
              Encrypt Text
            </Button>
          </div>

        </div>
      </Card>

      {/* Ciphertext Output Section */}
      <Card className="p-6">
        <TextareaInput
          value={result}
          readOnly
          placeholder="Encrypted text will appear here..."
        />

        <div className="flex justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
          <span>Chars: {result ? result.length : 0}</span>
          <span>
          Words: {result ? result.trim().split(/\s+/).filter((w) => w).length : 0}
          </span>
        </div>
      </Card>

    </main>
  )
}
