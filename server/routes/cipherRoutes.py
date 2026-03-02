from flask import Blueprint, request, jsonify
from controllers.cipherController import encrypt_cipher

cipher_bp = Blueprint("cipher", __name__)

@cipher_bp.route("/encrypt", methods=["POST"])
def encrypt():
    data = request.json
    result = encrypt_cipher(data)
    return jsonify({"result": result})