from flask import Blueprint, request, jsonify
from services.auto_decrypt import auto_decrypt

decrypt_bp = Blueprint("decrypt", __name__)


@decrypt_bp.route("/decrypt", methods=["POST"])
def decrypt():
    data = request.get_json() or {}
    ciphertext = data.get("ciphertext", "").strip()

    if not ciphertext:
        return jsonify({"error": "Missing ciphertext"}), 400

    result = auto_decrypt(ciphertext)

    status_code = 400 if result.get("error") else 200
    return jsonify(result), status_code
