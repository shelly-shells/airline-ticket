import pandas as pd

df = pd.read_csv("csvs/routes.csv")
df.drop(["AircraftCode", "Aircraft"], axis=1, inplace=True)
df['arrival'] = pd.to_datetime(df['arrival'], format='%H:%M').dt.time
df["departure"] = pd.to_datetime(df["departure"], format="%H:%M").dt.time
df.to_csv("csvs/routes.csv", index=False)