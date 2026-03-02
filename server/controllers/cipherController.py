from services import caesar, affine, vigenere


def encrypt_cipher(data):
    cipher_type = data.get("cipher")
    text = data.get("text")

    if cipher_type == "caesar":
        return caesar.encrypt(text, int(data.get("shift")))

    elif cipher_type == "affine":
        return affine.encrypt(
            text,
            int(data.get("a")),
            int(data.get("b"))
        )
    elif cipher_type == "vigenere":
        key = data.get("key")
        if not key:
            return {"error": "Missing key"}
        result = vigenere.encrypt(text, key)

    else:
        return {"error": "Invalid cipher type"}

    return {"result": result}