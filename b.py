import requests
from bs4 import BeautifulSoup
import pandas as pd

df = pd.read_csv("output.csv")
a = ["AI 776"]

d = []
j = 0
for i in a:
    x, y = i.split()
    url = f"https://www.flightstats.com/v2/flight-tracker/{x}/{y}"  # Replace with the actual URL
    response = requests.get(url)

    soup = BeautifulSoup(response.text, "html.parser")
    dist = soup.find_all("h5", class_="labeled-columns__Value-sc-j3eq63-1 bKkaUj")
    a = [i.get_text() for i in dist]
    # d.append([a[0], a[-2], a[-1]])
    # j += 1
    # if j % 500 == 0:
    #     print(j)
    print(a)

# df1 = pd.DataFrame(d, columns=["Distance", "AircraftCode", "Aircraft"])
# df["Distance"] = df1["Distance"]
# df["AircraftCode"] = df1["AircraftCode"]
# df["Aircraft"] = df1["Aircraft"]
# df.to_csv("output.csv", index=False)

