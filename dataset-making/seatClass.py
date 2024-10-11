import pandas as pd
import random

df = pd.read_csv("csvs/bookings.csv")
df["SeatClass"] = [
    random.choices(["Economy", "Business"], k=1, weights=[0.8, 0.2])[0]
    for i in range(len(df))
]
df.to_csv("csvs/bookings.csv", index=False)
