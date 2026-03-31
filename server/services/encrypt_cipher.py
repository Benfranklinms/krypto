from services import caesar, affine, vigenere


def encrypt_cipher(data):
    cipher_type = data.get("cipher")
    text = data.get("text")

    if not text:
        return {"error": "Missing text"}

    if cipher_type == "caesar":
        result = caesar.encrypt(text, int(data.get("shift", 3)))

    elif cipher_type == "affine":
        result = affine.encrypt(
            text,
            int(data.get("a", 5)),
            int(data.get("b", 8))
        )
    elif cipher_type == "vigenere":
        key = data.get("key")
        if not key:
            return {"error": "Missing key"}
        result = vigenere.encrypt(text, key)

    else:
        return {"error": "Invalid cipher type"}

    if isinstance(result, dict):
        return result

    return {
        "cipher": cipher_type,
        "result": result
    }
