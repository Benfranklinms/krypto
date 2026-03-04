import joblib
from ml.feature_extractor import CipherFeatureExtractor

from services.break_caesar import break_caesar
from services.break_affine import break_affine

Extractor = CipherFeatureExtractor()

# load ML model once
model = joblib.load("ml/cipher_model.pkl")


def identify_cipher(ciphertext):
    features = Extractor.extract_features(ciphertext)
    prediction = model.predict([features])
    return prediction[0]


def auto_decrypt(ciphertext):

    cipher_type = identify_cipher(ciphertext)

    if cipher_type == "caesar":
        result = break_caesar(ciphertext)

    elif cipher_type == "affine":
        result = break_affine(ciphertext)

    elif cipher_type == "vigenere":
        result = break_vigenere(ciphertext)

    return {
        "cipher": cipher_type,
        "key": result["key"],
        "plaintext": result["plaintext"]
    }