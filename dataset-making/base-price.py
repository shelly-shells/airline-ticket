"""
Sets base price using flight duration and frequency. 130 rupees per minute / frequency is set as base price
"""

import pandas as pd

df = pd.read_csv("csvs/routes.csv")
freq = df[["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]].astype(int).sum(axis=1)

arr = df["arrival"].apply(lambda x: int(x.split(":")[0]) * 60 + int(x.split(":")[1]))
dep = df["departure"].apply(lambda x: int(x.split(":")[0]) * 60 + int(x.split(":")[1]))

dur = arr - dep
dur = dur.apply(lambda x: x if x > 0 else 1440 + x)
p = dur.apply(lambda x: x * 130)
bp = p / freq
df["base_price"] = bp.astype(int)
df.to_csv("csvs/routes.csv", index=False)
