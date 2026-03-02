def generate_key(text, key):
    key = key.upper()
    expanded_key = ""
    key_index = 0

    for char in text:
        if char.isalpha():
            expanded_key += key[key_index % len(key)]
            key_index += 1
        else:
            expanded_key += char

    return expanded_key


def encrypt(text, key):
    text = text.upper()
    key = generate_key(text, key)
    result = ""

    for i in range(len(text)):
        char = text[i]

        if char.isalpha():
            x = ord(char) - 65
            k = ord(key[i]) - 65
            encrypted_char = chr((x + k) % 26 + 65)
            result += encrypted_char
        else:
            result += char

    return result