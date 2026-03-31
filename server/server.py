from pathlib import Path
import sys
from flask import Flask
from flask_cors import CORS
from routes.encryptRoutes import cipher_bp
from routes.decryptRoutes import decrypt, decrypt_bp

SERVER_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVER_DIR.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


app = Flask(__name__)
CORS(app)

app.register_blueprint(cipher_bp, url_prefix="/api/cipher")
app.register_blueprint(decrypt_bp, url_prefix="/api/cipher")

if __name__ == "__main__":
    app.run(debug=True)