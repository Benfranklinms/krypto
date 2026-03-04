from flask import Blueprint, request, jsonify
from services.auto_decrypt import auto_decrypt

decrypt_bp = Blueprint("decrypt", __name__)


@decrypt_bp.route("/decrypt", methods=["POST"])
def decrypt():

    data = request.get_json()
    ciphertext = data["ciphertext"]

    result = auto_decrypt(ciphertext)

    return jsonify(result)