from collections import Counter

INPUT_FILE = "server/utils/quadgrams/clean_corpus.txt"
OUTPUT_FILE = "server/utils/quadgrams/quadgrams.txt"

quadgrams = Counter()

with open(INPUT_FILE, "r", encoding="utf8") as f:
    text = f.read()

for i in range(len(text) - 3):
    quad = text[i:i+4]
    quadgrams[quad] += 1

with open(OUTPUT_FILE, "w") as f:
    for quad, count in quadgrams.most_common():
        f.write(f"{quad} {count}\n")

print("Quadgram dataset created.")