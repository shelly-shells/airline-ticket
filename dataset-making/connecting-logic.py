"""
Logic for choosing connecting flights, to be used in the future
"""

import pandas as pd

df = pd.read_csv("output.csv")

a = df[(df["origin"] == "DEL") & (df["origin"] != "BOM")]
b = df[(df["destination"] == "BOM") & (df["destination"] != "DEL")]

a = a.sort_values(by="arrival")
b = b.sort_values(by="departure")

merged_df = a.merge(b, left_on="destination", right_on="origin")
merged_df = merged_df[["origin_x", "destination_x", "arrival_x", "departure_y"]]
a = merged_df["arrival_x"]
h, m = [], []
for i in a:
    j = i[:-4].split(":")
    h.append(int(j[0]))
    m.append(int(j[1]))
merged_df["arrival_h"] = h
merged_df["arrival_m"] = m

b = merged_df["departure_y"]
h, m = [], []
for i in b:
    j = i[:-4].split(":")
    h.append(int(j[0]))
    m.append(int(j[1]))
merged_df["departure_h"] = h
merged_df["departure_m"] = m

merged_df["time"] = (merged_df["departure_h"] - merged_df["arrival_h"]) * 60 + (
    merged_df["departure_m"] - merged_df["arrival_m"]
)

merged_df = merged_df[(merged_df["time"] > 45) & (merged_df["time"] < 180)]
merged_df.to_csv("output1.csv", index=False)
