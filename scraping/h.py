import pandas as pd

df = pd.read_csv("csvs/routes.csv")

df1 = df[["id", "AircraftCode", "Aircraft"]]
a = df["id"]
b = {"6E" : "Indigo Airlines", "SG" : "SpiceJet Airlines", "AI": "Air India"}
a = [b[i.split()[0]] for i in a]
df1["airline"] = a
df1.to_csv("csvs/planes.csv", index=False)