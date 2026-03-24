import wordninja
from services.break_caesar import chi_square


VALID_A = [1,3,5,7,9,11,15,17,19,21,23,25]


def mod_inverse(a, m):

    for x in range(1, m):
        if (a * x) % m == 1:
            return x

    return None


def decrypt_affine(text, a, b):

    result = ""
    inv_a = mod_inverse(a, 26)

    for char in text:

        if char.isalpha():

            x = ord(char) - 65
            result += chr((inv_a * (x - b)) % 26 + 65)

        else:
            result += char

    return result


# Word segmentation scoring
def word_score(text):

    words = wordninja.split(text.lower())

    if len(words) == 0:
        return 0

    return sum(len(w) for w in words) / len(words)


def break_affine(ciphertext):

    ciphertext = ciphertext.upper()

    best_score = float("inf")
    best_plain = ""
    best_key = (1, 0)

    for a in VALID_A:
        for b in range(26):

            plaintext = decrypt_affine(ciphertext, a, b)

            chi = chi_square(plaintext)
            wscore = word_score(plaintext)

            final_score = chi - (wscore * 5)

            if final_score < best_score:

                best_score = final_score
                best_plain = plaintext
                best_key = (a, b)

    return {
        "key": best_key,
        "plaintext": best_plain
    }
