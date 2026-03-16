from collections import Counter
from services.break_caesar import break_caesar
from utils.quadgrams.quadgram_score import QuadgramScore
import wordninja


def clean_text(text):
    return ''.join(c for c in text.upper() if c.isalpha())


def index_of_coincidence(text):
    N = len(text)
    freq = Counter(text)
    ic = sum(f * (f - 1) for f in freq.values())
    return ic / (N * (N - 1)) if N > 1 else 0


def kasiski(ciphertext):

    distances = []

    for i in range(len(ciphertext) - 3):
        seq = ciphertext[i:i+3]

        for j in range(i + 3, len(ciphertext) - 3):

            if ciphertext[j:j+3] == seq:
                distances.append(j - i)

    factors = []

    for d in distances:

        for i in range(2, 21):

            if d % i == 0:
                factors.append(i)

    return list(set(factors))


def candidate_key_lengths(ciphertext, max_len=20):

    kasiski_lengths = kasiski(ciphertext)

    scores = []

    for k in range(1, max_len + 1):

        columns = [''] * k

        for i, c in enumerate(ciphertext):
            columns[i % k] += c

        avg_ic = sum(index_of_coincidence(col) for col in columns) / k

        scores.append((k, avg_ic))

    scores.sort(key=lambda x: x[1], reverse=True)

    ic_lengths = [k for k, _ in scores[:6]]

    return list(set(ic_lengths + kasiski_lengths))


def split_columns(text, key_len):

    cols = [''] * key_len

    for i, c in enumerate(text):
        cols[i % key_len] += c

    return cols


def find_key(ciphertext, key_len):

    cols = split_columns(ciphertext, key_len)

    key = ""

    for col in cols:

        result = break_caesar(col)

        shift = result["key"]

        key += chr(shift + 65)

    return key


def decrypt_vigenere(ciphertext, key):

    plaintext = ""
    key_index = 0

    for c in ciphertext:

        if c.isalpha():

            shift = ord(key[key_index % len(key)]) - 65
            x = ord(c.upper()) - 65

            plaintext += chr((x - shift) % 26 + 65)

            key_index += 1

        else:
            plaintext += c

    return plaintext


def break_vigenere(ciphertext):

    original_text = ciphertext

    ciphertext = clean_text(ciphertext)

    quad = QuadgramScore()

    key_lengths = candidate_key_lengths(ciphertext)

    best_score = float("-inf")
    best_key = ""
    best_plain = ""

    for klen in key_lengths:

        key = find_key(ciphertext, klen)

        plaintext = decrypt_vigenere(ciphertext, key)

        score = quad.score(plaintext)

        if score > best_score:

            best_score = score
            best_key = key
            best_plain = plaintext

    # Add word segmentation for readability
    spaced_plain = " ".join(wordninja.split(best_plain.lower())).upper()

    return {
        "key": best_key,
        "plaintext": spaced_plain
    }