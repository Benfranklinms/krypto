from flask import Blueprint, request, jsonify
from server.controllers.cipherController import encrypt_cipher

cipher_bp = Blueprint("cipher", __name__)

@cipher_bp.route("/encrypt", methods=["POST"])
def encrypt():
    data = request.get_json() or {}
    result = encrypt_cipher(data)
    status_code = 400 if result.get("error") else 200
    return jsonify(result), status_code
