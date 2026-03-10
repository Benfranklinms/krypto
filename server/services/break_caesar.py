import string
import wordninja


# English letter frequency
ENGLISH_FREQ = {
    'A': 8.2, 'B': 1.5, 'C': 2.8, 'D': 4.3,
    'E': 12.7, 'F': 2.2, 'G': 2.0, 'H': 6.1,
    'I': 7.0, 'J': 0.15, 'K': 0.8, 'L': 4.0,
    'M': 2.4, 'N': 6.7, 'O': 7.5, 'P': 1.9,
    'Q': 0.1, 'R': 6.0, 'S': 6.3, 'T': 9.1,
    'U': 2.8, 'V': 1.0, 'W': 2.4, 'X': 0.15,
    'Y': 2.0, 'Z': 0.07
}


# Caesar decryption
def decrypt_caesar(text, shift):

    result = ""

    for char in text:
        x = ord(char) - 65
        result += chr((x - shift) % 26 + 65)

    return result


# Chi-square frequency score
def chi_square(text):

    N = len(text)
    score = 0

    for letter in string.ascii_uppercase:

        observed = text.count(letter)
        expected = ENGLISH_FREQ[letter] * N / 100

        score += ((observed - expected) ** 2) / expected

    return score


# WordNinja word quality score
def word_score(text):

    words = wordninja.split(text.lower())

    if len(words) == 0:
        return 0

    # average word length
    return sum(len(w) for w in words) / len(words)


# Hybrid Caesar breaker
def break_caesar(ciphertext):

    best_score = float("inf")
    best_plain = ""
    best_key = 0

    for shift in range(26):

        plaintext = decrypt_caesar(ciphertext, shift)

        chi = chi_square(plaintext)
        word_quality = word_score(plaintext)

        # combine scores
        final_score = chi - (word_quality * 5)
        
        if final_score < best_score:

            best_score = final_score
            best_plain = plaintext
            best_key = shift

    return {
        "key": best_key,
        "plaintext": best_plain
    }

result=break_caesar("Bptggtabwxmaxmknma".upper())
print(result["key"],result["plaintext"])