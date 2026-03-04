import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

from feature_extractor import CipherFeatureExtractor

extractor = CipherFeatureExtractor()

df = pd.read_csv("cipher_dataset.csv")

X = df["ciphertext"].apply(extractor.extract_features).tolist()
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.5, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nAccuracy:", model.score(X_test, y_test))
print("\nAccuracy:", model.score(X_train, y_train))


print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

joblib.dump(model, "cipher_model.pkl")

print("\nModel trained and saved as cipher_model.pkl")