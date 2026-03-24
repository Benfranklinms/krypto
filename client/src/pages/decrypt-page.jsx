import { useState } from "react"
import { decrypt } from "../api/decryption"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import TextareaInput from "../components/textarea-input"

export default function DecryptPage() {
  const [ciphertext, setCiphertext] = useState("")
  const [showStats, setShowStats] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [predictedCipher, setPredictedCipher] = useState("")
  const [confidence, setConfidence] = useState(97)
  const [decryptedText, setDecryptedText] = useState(
    "THIS IS A SECRET MESSAGE THAT HAS BEEN ENCRYPTED USING THE VIGENERE CIPHER. THE KEY USED WAS QUITE SHORT BUT IT WAS ENOUGH TO HIDE THE MEANING FROM A SIMPLE FREQUENCY ANALYSIS. HOWEVER, WITH MODERN COMPUTATIONAL TOOLS, BREAKING IT IS TRIVIAL.",
  )
  const [recoveredKey, setRecoveredKey] = useState("CRYPTO")

  const handleDecrypt = async () => {
  try {
    const res = await decrypt({ ciphertext })

    if (res.error) {
      console.error("Decrypt error:", res.error)
      return
    }

    setPredictedCipher(res.cipher || "")
    setRecoveredKey(res.key || "")
    setDecryptedText(res.result || "")
    setConfidence(res.stats?.probability || 97)
    setAnalysisComplete(true)

  } catch (error) {
    console.error("Decrypt error:", error)
  }
}

  const cipherProbabilities = [
    { name: "Vigenère", prob: 0.87 },
    { name: "Affine", prob: 0.08 },
    { name: "Caesar", prob: 0.03 },
  ]

  const stats = [
    {
      label: "Index of Coincidence (IC)",
      value: "0.042",
      description: "Low IC (≤0.04) suggests polyalphabetic cipher like Vigenère. English plaintext ≈ 0.067.",
    },
  ]

  const handleDetectCipherType = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Classical Cipher Detector & Decrypter</h1>
        <p className="text-muted-foreground">Automated analysis and decryption tool for classical cryptography</p>
      </div>

      {/* Ciphertext Input Section */}
      <Card className="mb-6 p-6 bg-card border border-border">
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold text-foreground">Ciphertext Input</label>
          <span className="text-xs text-blue-600">Non-letters will be ignored</span>
        </div>
        <TextareaInput
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder="Paste encrypted text here..."
          className="min-h-37.5"
        />
      </Card>

      {/* Options Section */}
      <Card className="mb-6 p-6 bg-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Known Plaintext Hint (optional)</label>
            <input
              type="text"
              disabled
              placeholder="Disabled for now"
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-muted-foreground opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Language (for scoring)</label>
            <select className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground">
              <option>English (Default)</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            onClick={handleDecrypt}
            disabled={isAnalyzing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <span></span>
            {isAnalyzing ? "Analyzing..." : "Detect & Decrypt Automatically"}
          </Button>
          <Button
            onClick={handleDetectCipherType}
            disabled={isAnalyzing}
            className="flex-1 bg-white hover:bg-gray-100 text-blue-600 font-semibold py-2 rounded-lg border border-blue-300 flex items-center justify-center gap-2"
          >
            <span></span>
            Detect Cipher Type
          </Button>
        </div>

        {/* Checkbox Option */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="stats"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
            className="w-4 h-4 rounded border-border cursor-pointer"
          />
          <label htmlFor="stats" className="text-sm text-foreground cursor-pointer">
            Show intermediate statistics (IC, frequencies)
          </label>
          <span className="text-xs text-muted-foreground">
            The system computes statistical features (Index of Coincidence, letter frequencies, chi-square) and uses a
            trained model to predict the cipher type.
          </span>
        </div>
      </Card>

      {/* Analysis Complete Status */}
      {analysisComplete && (
        <Card className="mb-6 p-6 bg-green-50 border border-green-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <div>
              <h3 className="font-semibold text-foreground">Analysis Complete</h3>
              <p className="text-sm text-muted-foreground">Execution time: 42ms</p>
            </div>
          </div>
        </Card>
      )}

      {/* Results Grid */}
      {analysisComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Detection Result */}
          <Card className="p-6 bg-card border border-border">
            <h3 className="text-xs font-semibold text-blue-600 mb-4 tracking-wider">DETECTION RESULT</h3>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Predicted Cipher</p>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">{predictedCipher}</h2>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground">Confidence</span>
                  <span className="text-sm font-semibold text-foreground">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${confidence}%` }}></div>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Cipher</span>
                <span className="font-semibold">Prob</span>
              </div>
              {cipherProbabilities.map((cipher, idx) => (
                <div key={idx} className="flex justify-between items-center py-2">
                  <span className="text-foreground">{cipher.name}</span>
                  <span className="text-muted-foreground">{cipher.prob.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Decryption Result */}
          <Card className="p-6 bg-green-50 border border-green-200">
            <h3 className="text-xs font-semibold text-green-600 mb-4 tracking-wider">DECRYPTION RESULT</h3>
            <p className="text-xs text-green-600 mb-2">Score: 98.4</p>
            <TextareaInput
              value={decryptedText}
              readOnly
              className="min-h-50 bg-white border-green-200 text-foreground"
            />
          </Card>
        </div>
      )}

      {/* Statistics Section */}
      {analysisComplete && showStats && (
        <Card className="mb-6 p-6 bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wider">STATISTICS</h3>
          <div className="space-y-4">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-foreground font-semibold">{stat.label}</span>
                  <span className="text-lg font-bold text-blue-600">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recovered Key Section */}
      {analysisComplete && (
        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg"></span>
              <span className="text-foreground font-semibold">Recovered Key:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-mono font-semibold">
                {recoveredKey}
              </span>
              <span className="text-xs text-muted-foreground">Key Length: {recoveredKey.length}</span>
            </div>
          </div>
        </Card>
      )}
    </main>
  )
}
