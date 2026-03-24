import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/cipher";

const buildEncryptPayload = ({ text, algorithm, key, keys = {} }) => {
  const payload = {
    cipher: algorithm,
    text,
  };

  if (algorithm === "caesar") {
    payload.shift = Number.parseInt(key, 10) || 3;
  } else if (algorithm === "vigenere") {
    payload.key = key;
  } else if (algorithm === "affine") {
    payload.a = Number.parseInt(keys.a, 10) || 5;
    payload.b = Number.parseInt(keys.b, 10) || 8;
  }

  return payload;
};

const formatCipherName = (value) => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatKey = (cipher, key) => {
  if (key === null || key === undefined || key === "") {
    return "N/A";
  }

  if (cipher === "affine" && typeof key === "object") {
    return `a=${key.a}, b=${key.b}`;
  }

  if (Array.isArray(key) && key.length === 2) {
    return `a=${key[0]}, b=${key[1]}`;
  }

  return String(key);
};

const buildDecryptStats = (data) => ({
  predictedCipher: formatCipherName(data.cipher),
  probability:
    typeof data.probability === "number" ? Math.round(data.probability) : 0,
  keyLabel: formatKey(data.cipher, data.key),
  ciphers: (data.candidates || []).map((candidate) => ({
    name: formatCipherName(candidate.name),
    score: candidate.score,
  })),
  radar: data.radar || {
    avgLetterFreq: 0,
    indexOfCoincidence: 0,
    entropy: 0,
    bigramFreq: 0,
    repetitionScore: 0,
    varianceOfFreq: 0,
  },
});

export const backendEncrypt = async ({ text, algorithm, key, keys }) => {
  try {
    const payload = buildEncryptPayload({ text, algorithm, key, keys });
    const { data } = await axios.post(`${API_BASE}/encrypt`, payload);

    return {
      result: data.result || "",
      key: data.key || null,
      cipher: data.cipher || algorithm,
    };
  } catch (error) {
    console.error("Backend encrypt error:", error);
    return {
      error:
        error.response?.data?.error ||
        "Encryption failed. Make sure backend is running.",
    };
  }
};

export const backendDecrypt = async ({ text }) => {
  try {
    const { data } = await axios.post(`${API_BASE}/decrypt`, {
      ciphertext: text,
    });

    return {
      result: data.plaintext || "",
      key: data.key ?? null,
      cipher: data.cipher || "Unknown",
      stats: buildDecryptStats(data),
    };
  } catch (error) {
    console.error("Backend decrypt error:", error);
    return {
      error:
        error.response?.data?.error ||
        "Decryption failed. Make sure backend is running.",
    };
  }
};

export const encrypt = async (data) => backendEncrypt(data);

export const decrypt = async (data) =>
  backendDecrypt({ text: data.ciphertext ?? data.text ?? "" });
