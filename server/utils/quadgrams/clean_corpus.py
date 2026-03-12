import re

with open("server/utils/quadgrams/corpus.txt","r",encoding="utf8") as f:
    text = f.read()

text = re.sub("[^A-Za-z]", "", text).upper()

with open("server/utils/quadgrams/clean_corpus.txt","w") as f:
    f.write(text)

print("Clean corpus ready.")