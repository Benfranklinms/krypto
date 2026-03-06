import joblib
from feature_extractor import CipherFeatureExtractor

# Load trained model
model = joblib.load("cipher_model.pkl")

def predict_cipher(ciphertext):
    extractor = CipherFeatureExtractor()
    features = extractor.extract_features(ciphertext)
    prediction = model.predict([features])
    return prediction[0]

if __name__ == "__main__":
    text = input("Enter ciphertext: ").upper()
    cipher_type = predict_cipher(text)
    print("Predicted cipher:", cipher_type)
    
#cahnges needed