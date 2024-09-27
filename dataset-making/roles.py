import pandas as pd

df = pd.read_csv("csvs/users.csv")
df["role"] = ["admin" if i > 90 else "user" for i in range(len(df))]
df.to_csv("csvs/users.csv", index=False)
