import requests
from bs4 import BeautifulSoup
import pandas as pd

df = pd.read_csv("output.csv")
a = df["id"]
d = []
j = 0
for i in a[:10]:
    x, y = i.split()

    url = f"https://www.flightradar24.com/data/flights/{x+y}"  
    response = requests.get(url)

    soup = BeautifulSoup(response.text, "html.parser")
    dist = soup.find_all("td", class_="hidden-xs hidden-sm")
    print([i.get_text() for i in dist])
