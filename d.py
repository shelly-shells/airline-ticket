import pandas as pd

df = pd.read_csv("output.csv")

a = df[(df["origin"] == "DEL") & (df["origin"] != "BOM")]
b = df[(df["destination"] == "BOM") & (df["destination"] != "DEL")]

a = a.sort_values(by="arrival")
b = b.sort_values(by="departure")

merged_df = a.merge(b, left_on="destination", right_on="origin")
merged_df.to_csv("output1.csv", index=False)

