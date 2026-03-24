from pathlib import Path

import joblib
from ml.feature_extractor import CipherFeatureExtractor

from services.break_caesar import break_caesar
from services.break_affine import break_affine
from services.break_vigenere import break_vigenere

Extractor = CipherFeatureExtractor()
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "cipher_model.pkl"

# load ML model once
model = joblib.load(MODEL_PATH)


def normalize_key(cipher_type, key):
    if cipher_type == "affine" and isinstance(key, (list, tuple)) and len(key) == 2:
        return {"a": key[0], "b": key[1]}
    return key


def extract_probability_map(prediction, features):
    if not hasattr(model, "predict_proba") or not hasattr(model, "classes_"):
        return {prediction: 1.0}

    probabilities = model.predict_proba([features])[0]
    return {
        label: float(probability)
        for label, probability in zip(model.classes_, probabilities)
    }


def build_radar_metrics(features):
    letter_frequencies = features[:26]
    index_of_coincidence = features[26]
    text_length = features[27]
    entropy = features[28]
    bigram_repetition = features[29]

    average_letter_frequency = sum(letter_frequencies) / len(letter_frequencies)
    frequency_variance = sum(
        (frequency - average_letter_frequency) ** 2
        for frequency in letter_frequencies
    ) / len(letter_frequencies)

    return {
        "avgLetterFreq": round(min(100, average_letter_frequency * 2600), 2),
        "indexOfCoincidence": round(min(100, index_of_coincidence * 1500), 2),
        "entropy": round(min(100, (entropy / 5.0) * 100), 2),
        "bigramFreq": round(min(100, bigram_repetition * 100), 2),
        "repetitionScore": round(min(100, (text_length / 200) * 100), 2),
        "varianceOfFreq": round(min(100, frequency_variance * 15000), 2),
    }


def identify_cipher(ciphertext):
    features = Extractor.extract_features(ciphertext)
    prediction = model.predict([features])
    return prediction[0], features, extract_probability_map(prediction[0], features)


def auto_decrypt(ciphertext):

    cipher_type, features, probabilities = identify_cipher(ciphertext)

    result = None

    if cipher_type == "caesar":
        result = break_caesar(ciphertext)

    elif cipher_type == "affine":
        result = break_affine(ciphertext)

    elif cipher_type == "vigenere":
        result = break_vigenere(ciphertext)

    else:
        return {
            "error": f"Unsupported cipher type: {cipher_type}"
        }

    probability = float(probabilities.get(cipher_type, 0.0))
    sorted_probabilities = sorted(
        probabilities.items(),
        key=lambda item: item[1],
        reverse=True
    )

    return {
        "cipher": cipher_type,
        "key": normalize_key(cipher_type, result["key"]),
        "plaintext": result["plaintext"],
        "probability": round(probability * 100, 2),
        "candidates": [
            {
                "name": name,
                "score": round(float(score), 4)
            }
            for name, score in sorted_probabilities
        ],
        "radar": build_radar_metrics(features)
    }
