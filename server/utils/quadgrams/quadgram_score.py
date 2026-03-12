import math
import os

class QuadgramScore:

    def __init__(self):

        path = os.path.join(os.path.dirname(__file__), "quadgrams.txt")

        self.quadgrams = {}
        self.total = 0

        with open(path) as f:
            for line in f:
                key, count = line.split()
                self.quadgrams[key] = int(count)
                self.total += int(count)

        for key in self.quadgrams:
            self.quadgrams[key] = math.log10(self.quadgrams[key] / self.total)

        self.floor = math.log10(0.01 / self.total)


    def score(self, text):

        score = 0

        for i in range(len(text) - 3):

            gram = text[i:i+4]

            if gram in self.quadgrams:
                score += self.quadgrams[gram]
            else:
                score += self.floor

        return score