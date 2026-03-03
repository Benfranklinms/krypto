import re
import math
from collections import Counter


class CipherFeatureExtractor:

    def normalize(self, text):
        # Cleans text by keeping only uppercase A-Z characters
        text = text.upper()
        text = re.sub(r'[^A-Z]', '', text)
        return text

    def letter_frequencies(self, text):
        # Computes normalized frequency of each of the 26 letters
        N = len(text)
        freq = [0] * 26
        counts = Counter(text)

        if N == 0:
            return freq

        for i in range(26):
            letter = chr(ord('A') + i)
            freq[i] = counts[letter] / N

        return freq

    def index_of_coincidence(self, text):
        # Calculates Index of Coincidence of the text
        N = len(text)
        if N <= 1:
            return 0

        counts = Counter(text)
        numerator = sum(f * (f - 1) for f in counts.values())
        denominator = N * (N - 1)

        return numerator / denominator

    def entropy(self, text):
        # Computes Shannon entropy of the text
        N = len(text)
        if N == 0:
            return 0

        counts = Counter(text)
        H = 0

        for f in counts.values():
            p = f / N
            H -= p * math.log2(p)

        return H

    def bigram_repetition_score(self, text):
        # Measures repetition ratio of bigrams in the text
        N = len(text)
        if N < 2:
            return 0

        bigrams = [text[i:i+2] for i in range(N - 1)]
        counts = Counter(bigrams)

        repeated = sum(count for count in counts.values() if count > 1)
        return repeated / len(bigrams)

    def extract_features(self, text):
        # Returns final 30-dimensional feature vector for classification
        text = self.normalize(text)

        features = []
        features.extend(self.letter_frequencies(text))
        features.append(self.index_of_coincidence(text))
        features.append(len(text))
        features.append(self.entropy(text))
        features.append(self.bigram_repetition_score(text))

        return features


if __name__ == "__main__":
    extractor = CipherFeatureExtractor()
    sample_text = "LXFOPVEFRNHR"
    features = extractor.extract_features(sample_text)

    print("Total Features:", len(features))
    print(features)