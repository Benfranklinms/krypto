from break_caesar import break_caesar
import wordninja
from math import gcd
from functools import reduce


# -----------------------------
# Index of Coincidence
# -----------------------------
def index_of_coincidence(text):

    N = len(text)

    if N <= 1:
        return 0

    freq = {}

    for c in text:
        freq[c] = freq.get(c, 0) + 1

    ic = 0

    for f in freq.values():
        ic += f * (f - 1)

    return ic / (N * (N - 1))


# -----------------------------
# Kasiski Examination
# -----------------------------
def kasiski(ciphertext):

    ciphertext = ''.join(c for c in ciphertext if c.isalpha())

    distances = []

    for i in range(len(ciphertext) - 3):

        seq = ciphertext[i:i+3]

        for j in range(i + 3, len(ciphertext) - 3):

            if ciphertext[j:j+3] == seq:
                distances.append(j - i)

    if not distances:
        return []

    factors = []

    for d in distances:
        for i in range(2, 21):
            if d % i == 0:
                factors.append(i)

    return list(set(factors))


# -----------------------------
# Key Length Candidates
# -----------------------------
def possible_key_lengths(ciphertext, max_len=12):

    kasiski_lengths = kasiski(ciphertext)

    scores = []

    for k in range(1, max_len + 1):

        columns = [''] * k

        for i, char in enumerate(ciphertext):

            if char.isalpha():
                columns[i % k] += char

        avg_ic = sum(index_of_coincidence(col) for col in columns) / k

        scores.append((k, avg_ic))

    scores.sort(key=lambda x: x[1], reverse=True)

    ic_lengths = [k for k, _ in scores[:5]]

    return list(set(ic_lengths + kasiski_lengths))


# -----------------------------
# Split Columns
# -----------------------------
def split_columns(ciphertext, key_length):

    columns = [""] * key_length

    for i, char in enumerate(ciphertext):

        if char.isalpha():
            columns[i % key_length] += char

    return columns


# -----------------------------
# Recover Key
# -----------------------------
def find_key(ciphertext, key_length):

    columns = split_columns(ciphertext, key_length)

    key = ""

    for col in columns:

        result = break_caesar(col)

        shift = result["key"]

        key += chr(shift + 65)

    return key


# -----------------------------
# Decrypt Vigenère
# -----------------------------
def decrypt_vigenere(ciphertext, key):

    plaintext = ""
    key_len = len(key)
    key_index = 0

    for char in ciphertext:

        if char.isalpha():

            shift = ord(key[key_index % key_len]) - 65
            x = ord(char) - 65

            plaintext += chr((x - shift) % 26 + 65)

            key_index += 1

        else:
            plaintext += char

    return plaintext


# -----------------------------
# Word Score using WordNinja
# -----------------------------
def word_score(text):

    words = wordninja.split(text.lower())

    if len(words) == 0:
        return 0

    avg_len = sum(len(w) for w in words) / len(words)
    coverage = sum(len(w) for w in words) / len(text)

    return avg_len * coverage


# -----------------------------
# Break Vigenère
# -----------------------------
def break_vigenere(ciphertext):

    ciphertext = ciphertext.upper()

    key_lengths = possible_key_lengths(ciphertext)

    best_plain = ""
    best_key = ""
    best_score = -1

    for klen in key_lengths:

        key = find_key(ciphertext, klen)

        plaintext = decrypt_vigenere(ciphertext, key)

        score = word_score(plaintext)

        if score > best_score:

            best_score = score
            best_plain = plaintext
            best_key = key

    return {
        "key": best_key,
        "plaintext": best_plain
    }


# -----------------------------
# Test
# -----------------------------
result = break_vigenere("Vycfnqkmspdpvnqohjfxaqmcgeihaumvl".upper())

print(result["key"], result["plaintext"])