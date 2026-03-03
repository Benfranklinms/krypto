import random
import csv
import string

# ---- CIPHER FUNCTIONS ---- #

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


# ---- RANDOM TEXT GENERATOR ---- #

def generate_random_text(length):
    return ''.join(random.choices(string.ascii_uppercase, k=length))


# ---- MAIN DATASET CREATION ---- #

def create_dataset(samples_per_cipher=5000):
    valid_a = [1,3,5,7,9,11,15,17,19,21,23,25]

    with open("cipher_dataset.csv", mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["ciphertext", "label"])

        for _ in range(samples_per_cipher):

            # Random length between 40-120 (important for ML)
            length = random.randint(40, 120)
            plaintext = generate_random_text(length)

            # Caesar
            shift = random.randint(1, 25)
            ciphertext = caesar_encrypt(plaintext, shift)
            writer.writerow([ciphertext, "caesar"])

            # Affine
            a = random.choice(valid_a)
            b = random.randint(0, 25)
            ciphertext = affine_encrypt(plaintext, a, b)
            writer.writerow([ciphertext, "affine"])

            # Vigenere
            key_length = random.randint(3, 10)
            key = generate_random_text(key_length)
            ciphertext = vigenere_encrypt(plaintext, key)
            writer.writerow([ciphertext, "vigenere"])


if __name__ == "__main__":
    create_dataset()
    print("Dataset created successfully.")