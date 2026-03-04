from flask import Flask
from flask_cors import CORS
from routes.cipherRoutes import cipher_bp
from routes.decryptRoutes import decrypt_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(cipher_bp, url_prefix="/api/cipher")
app.register_blueprint(decrypt_bp, url_prefix="/api/cipher")

if __name__ == "__main__":
    app.run(debug=True)