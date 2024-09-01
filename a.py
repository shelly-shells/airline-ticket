import requests
from bs4 import BeautifulSoup
import pandas as pd

df = pd.read_csv("Indian-Airlines-Dataset.csv")
a = df["fltno"]

d = []
for i in a:
    x, y = i.split(" ")
    url = f"https://www.flightstats.com/v2/flight-tracker/{x}/{y}"  # Replace with the actual URL
    response = requests.get(url)

    # Parse the page content with BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")
    # soup = soup.prettify()

    id = soup.find_all("div", class_="text-helper__TextHelper-sc-8bko4a-0 OvgJa")
    dep = soup.find_all("a", class_="route-with-plane__AirportLink-sc-154xj1h-3 kCdJkI")
    arr = soup.find_all("a", class_="route-with-plane__AirportLink-sc-154xj1h-3 kCdJkI")

    dtime = soup.find_all("div", class_="text-helper__TextHelper-sc-8bko4a-0 kbHzdx")
    atime = soup.find_all("div", class_="text-helper__TextHelper-sc-8bko4a-0 kbHzdx")


    l = [id, dep, arr, dtime, atime]
    d.append([])
    for q in l:
        for j in q:
            d[-1].append(j.get_text())
            
with open("output.csv", "w") as f:
    for i in d:
        f.write(f"{",".join(i)}\n")