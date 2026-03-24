from math import gcd
from utils.inverse import mod_inverse


def encrypt(text, a, b):
    if gcd(a, 26) != 1:
        return "Invalid key: 'a' must be coprime with 26."

    result = ""

    for char in text:
        if char.isalpha():
            base = 65 if char.isupper() else 97
            x = ord(char) - base
            result += chr(((a * x + b) % 26) + base)
        else:
            result += char

    return result
