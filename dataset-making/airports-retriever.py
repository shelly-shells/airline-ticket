"""
Retrieves the airports' names and cities from the IATA website.
"""

import pandas as pd
from bs4 import BeautifulSoup
import requests

df1 = pd.read_csv("csvs/routes.csv")
codes = sorted(set(df1["origin"].to_list() + df1["destination"].to_list()))

l = []
for i in codes:
    url = f"https://www.iata.org/en/publications/directories/code-search/?airport.search={i}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    try:
        name = soup.find_all("td")
        l.append([name[3], name[4], name[5]])
    except:
        print(f"{i}: Not Found")

df = pd.DataFrame(l, columns=["City", "Airport Name", "ID"])
df.to_csv("csvs/airports.csv", index=False)
