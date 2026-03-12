import requests

books = [
"https://www.gutenberg.org/files/1342/1342-0.txt",
"https://www.gutenberg.org/files/1661/1661-0.txt",
"https://www.gutenberg.org/files/11/11-0.txt",
"https://www.gutenberg.org/files/2701/2701-0.txt"
]

with open("server/utils/quadgrams/corpus.txt","w",encoding="utf8") as corpus:

    for url in books:

        r = requests.get(url)

        corpus.write(r.text)
        corpus.write("\n")

print("Corpus created")