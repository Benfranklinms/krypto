import random
import csv
import string
from pathlib import Path



def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        x = ord(char) - 65
        result += chr((x + shift) % 26 + 65)
    return result


def affine_encrypt(text, a, b):
    result = ""
    for char in text:
        x = ord(char) - 65
        result += chr((a * x + b) % 26 + 65)
    return result


def vigenere_encrypt(text, key):
    result = ""
    key = key.upper()
    key_len = len(key)

    for i, char in enumerate(text):
        x = ord(char) - 65
        k = ord(key[i % key_len]) - 65
        result += chr((x + k) % 26 + 65)

    return result


def load_corpus():
    corpus_path = Path("english_corpus.txt")

    if not corpus_path.exists():
        raise FileNotFoundError("english_corpus.txt not found inside ml folder.")

    with open(corpus_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Keep only letters and spaces
    text = ''.join(c.upper() if c.isalpha() else ' ' for c in text)

    # Remove multiple spaces
    text = ' '.join(text.split())

    return text


def get_random_chunk(corpus, min_len=80, max_len=200):
    length = random.randint(min_len, max_len)
    start = random.randint(0, len(corpus) - length - 1)
    chunk = corpus[start:start + length]

    # Remove spaces for encryption
    return ''.join(c for c in chunk if c.isalpha())


def create_dataset(samples_per_cipher=5000):
    corpus = load_corpus()

    valid_a = [1,3,5,7,9,11,15,17,19,21,23,25]

    with open("cipher_dataset.csv", mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["ciphertext", "label"])

        for _ in range(samples_per_cipher):

            plaintext = get_random_chunk(corpus)
            shift = random.randint(1, 25)
            ciphertext = caesar_encrypt(plaintext, shift)
            writer.writerow([ciphertext, "caesar"])
            
            
            a = random.choice(valid_a)
            b = random.randint(0, 25)
            ciphertext = affine_encrypt(plaintext, a, b)
            writer.writerow([ciphertext, "affine"])



            key_length = random.randint(3, 10)
            key = ''.join(random.choices(string.ascii_uppercase, k=key_length))
            ciphertext = vigenere_encrypt(plaintext, key)
            writer.writerow([ciphertext, "vigenere"])

    print("Dataset created successfully.")


if __name__ == "__main__":
    create_dataset(samples_per_cipher=5000)