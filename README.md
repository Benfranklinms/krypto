# Krypto

Krypto is a full-stack classical cryptography project for encrypting text and automatically detecting and decrypting classical substitution-style ciphers. It combines a React frontend, a Flask backend, and a lightweight machine-learning pipeline used to classify ciphertext before passing it into the appropriate breaker.

The project currently supports:

- Caesar cipher encryption
- Affine cipher encryption
- Vigenere cipher encryption
- Automatic cipher detection for Caesar, Affine, and Vigenere ciphertext
- Automatic decryption with recovered key output

## Overview

Krypto is split into two main parts:

- `client/`: a Vite + React frontend for entering plaintext/ciphertext and interacting with the app
- `server/`: a Flask API that handles encryption, automatic cipher identification, and decryption

The auto-decrypt flow works like this:

1. The frontend sends ciphertext to the Flask API.
2. The backend extracts statistical features from the text.
3. A trained model predicts whether the text is Caesar, Affine, or Vigenere.
4. The backend runs the matching cryptanalysis routine.
5. The API returns the predicted cipher, recovered key, and plaintext.

## Features

### Encryption

The encryption page lets you choose a cipher and provide the required parameters:

- `Caesar`: plaintext + shift value
- `Affine`: plaintext + keys `a` and `b`
- `Vigenere`: plaintext + alphabetic key

### Auto Detection and Decryption

The backend includes an automatic decryption service that:

- predicts cipher type with a trained ML model
- breaks Caesar using chi-square scoring and word segmentation
- breaks Affine by searching valid keys and scoring candidates
- breaks Vigenere using Kasiski examination, Index of Coincidence, quadgram scoring, and word segmentation

### Machine Learning Utilities

The project also includes scripts to:

- generate a cipher dataset from English text
- extract numerical features from ciphertext
- train and save a classification model

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Tailwind CSS
- Axios

### Backend

- Flask
- Flask-CORS
- joblib
- NumPy
- pandas
- requests
- scikit-learn
- SciPy
- NLTK
- wordninja

## Project Structure

```text
Krypto/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── controllers/
│   ├── ml/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── requirements.txt
│   └── server.py
└── README.md
```

## API Endpoints

The Flask app registers its routes under:

`/api/cipher`

### `POST /api/cipher/encrypt`

Encrypts plaintext with the selected cipher.

#### Caesar example

```json
{
  "cipher": "caesar",
  "text": "HELLO WORLD",
  "shift": 3
}
```

#### Affine example

```json
{
  "cipher": "affine",
  "text": "HELLO WORLD",
  "a": 5,
  "b": 8
}
```

#### Vigenere example

```json
{
  "cipher": "vigenere",
  "text": "HELLO WORLD",
  "key": "CRYPTO"
}
```

#### Typical response

```json
{
  "result": "KHOOR ZRUOG"
}
```

Note: the Vigenere branch currently returns a nested object shape from the controller, so frontend code already accounts for both plain-string and nested responses.

### `POST /api/cipher/decrypt`

Automatically predicts the cipher type and attempts decryption.

#### Request

```json
{
  "ciphertext": "LXFOPVEFRNHR"
}
```

#### Response

```json
{
  "cipher": "vigenere",
  "key": "LEMON",
  "plaintext": "ATTACKATDAWN"
}
```

## Local Setup

### Prerequisites

Make sure you have:

- Node.js 18+ and npm
- Python 3.10+ recommended
- `pip`

### 1. Clone and enter the project

```bash
git clone <your-repo-url>
cd mini
```

If you rename the folder, the project name is still **Krypto**.

### 2. Set up the backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then start the Flask server:

```bash
python server.py
```

By default, it runs at:

`http://127.0.0.1:5000`

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The Vite development server will usually start at:

`http://127.0.0.1:5173`

## How To Use

### Encrypt text

1. Open the frontend in your browser.
2. Stay on the `Encrypt` tab.
3. Enter plaintext.
4. Choose `Caesar`, `Affine`, or `Vigenere`.
5. Provide the required key values.
6. Click `Encrypt Text`.

### Auto-detect and decrypt

1. Open the `Decrypt (Auto-Detect)` tab.
2. Paste ciphertext into the input box.
3. Trigger automatic detection/decryption from the UI or call the backend endpoint directly.
4. Review the predicted cipher, key, and recovered plaintext.

## Machine Learning Pipeline

The `server/ml/` folder contains the model workflow used by Krypto.

### Files

- `dataset_generator.py`: creates synthetic ciphertext samples from English corpus text
- `feature_extractor.py`: extracts a 30-dimensional feature vector
- `train_model.py`: trains and saves a Random Forest classifier
- `cipher_model.pkl`: the saved model used at runtime
- `cipher_dataset.csv`: generated training data
- `english_corpus.txt`: source corpus for dataset generation

### Extracted features

The classifier uses:

- normalized letter frequencies for A-Z
- Index of Coincidence
- text length
- Shannon entropy
- bigram repetition score

### Regenerating the dataset

```bash
cd server/ml
python dataset_generator.py
```

### Retraining the model

```bash
cd server/ml
python train_model.py
```

After retraining, the saved `cipher_model.pkl` is used by `server/services/auto_decrypt.py`.

## Cryptanalysis Notes

### Caesar breaker

Uses:

- chi-square comparison against English letter frequencies
- word segmentation scoring with `wordninja`

### Affine breaker

Uses:

- brute-force search across valid `a` values coprime to 26
- all `b` values from 0 to 25
- chi-square and word quality scoring

### Vigenere breaker

Uses:

- Kasiski examination for candidate key lengths
- Index of Coincidence ranking
- Caesar breaking on each key column
- quadgram scoring to choose the best plaintext

## Important Notes and Current Limitations

- The backend currently enables Flask debug mode in `server/server.py`.
- The frontend decrypt page contains placeholder UI states and is not fully wired to the backend response yet.
- The model path in `server/services/auto_decrypt.py` is loaded relative to the server working directory, so you should run the backend from inside `server/`.
- Non-letter handling differs a little across some cryptanalysis functions because several breakers normalize input to uppercase alphabetic text before scoring.

## Troubleshooting

### Backend import or model errors

If a dependency install fails, recreate the virtual environment and reinstall from the pinned requirements file:

```bash
cd server
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend cannot reach backend

Make sure:

- Flask is running on `http://127.0.0.1:5000`
- Vite is running separately from `client/`
- you did not change the hardcoded API base URL in `client/src/api/`

### Auto-decrypt fails at startup

Check that this file exists:

`server/ml/cipher_model.pkl`

If it is missing or outdated, regenerate the dataset and retrain the model.

## Future Improvements

- fully connect the decrypt page to live backend results
- add validation and clearer API error responses
- move configuration such as API base URLs into environment variables
- add tests for encryption, decryption, and model prediction
- package all required Python dependencies in a complete requirements file
- add support for more classical ciphers

## License

No license file is currently included in this repository. Add one if you plan to distribute or open-source the project.
