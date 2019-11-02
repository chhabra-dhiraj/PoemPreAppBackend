# -*- coding: utf-8 -*-
"""poem.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1zYkIOfC0Zl7DT-aioNP8yP5jHyCUz5fG
"""

import pandas as pd
import numpy as np
import math

data = pd.read_csv("poems.csv")

genre = ["all","myth","nature","love"]
genre_class = []
for i in range(0,4):
    genre_class.append([])

n = len(data)

for i in range(0,n):
    genre_class[0].append(i)
    if (data.iloc[i][4] == "Nature"):
        genre_class[2].append(i)
    elif (data.iloc[i][4] == "Love"):
        genre_class[3].append(i)
    else:
        genre_class[1].append(i)

print(genre_class[1])

from collections import Counter
import string

import nltk

poem = data[:]['content'].str.lower()
poem = poem.values.tolist()

poem_break = [nltk.tokenize.wordpunct_tokenize(text) for text in poem]

nltk.download('stopwords')
stopwords = nltk.corpus.stopwords.words('english')

from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()
punctuation = string.punctuation # '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
# Add numbers
punctuation += '0123456789'
print(punctuation)
def comment_raiz(comment):
    text = []
    for lista in comment:
        valids = []
        for word in lista:
            if word not in stopwords and word not in punctuation and len(word)>2:
                valids.append(word)
        text.append(valids)
    return text

poem_clear = comment_raiz(poem_break)

key = "mouse"
gen = 2

cnt = Counter()
for i in range(0,n):
    if key in poem_clear[i] and i in genre_class[gen]:
        t = len(poem_clear[i])
        for k in range (0,t):
            if poem_clear[i][k] == key:
                if k > 0:
                    cnt[poem_clear[i][k-1]] += 1
                
cnt.most_common(30)

key = "might"
gen = 0
cnt = Counter()
for i in range(0,n):
    if key in poem_clear[i] and i in genre_class[gen]:
        t = len(poem_clear[i])
        for k in range (0,t):
            if poem_clear[i][k] == key:
                if k < t-1:
                    cnt[poem_clear[i][k+1]] += 1
                
cnt.most_common(30)