"""
Separating aircraft information from routes and adding it to the planes csv
"""

import pandas as pd

df = pd.read_csv("csvs/planes.csv")
df1 = pd.read_csv("csvs/routes.csv")


a = df["AircraftCode"]
df1["airline_id"] = a
df1.to_csv("csvs/routes.csv", index=False)

df = df.drop(["id", "airline"], axis=1)
df = df.drop_duplicates()
df.to_csv("csvs/planes.csv", index=False)
