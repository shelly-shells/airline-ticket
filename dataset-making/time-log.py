import pandas as pd
import os
import numpy as np
from datetime import datetime
import random

l = os.listdir("csvs")
d = pd.read_csv("csvs/users.csv")
d = d[d["role"] == "admin"]["username"]
d = d.values

tart_datetime = datetime(2024, 7, 1, 0, 0, 0)
end_datetime = datetime(2024, 8, 31, 23, 59, 59)


def random_datetime(start, end):
    start_timestamp = start.timestamp()
    end_timestamp = end.timestamp()
    random_timestamp = random.uniform(start_timestamp, end_timestamp)
    return datetime.fromtimestamp(random_timestamp).strftime("%Y-%m-%d %H:%M:%S")


for i in l:
    if "booking" not in i and "csv" in i:
        df = pd.read_csv(f"csvs/{i}")
        df["timestamp"] = [
            random_datetime(tart_datetime, end_datetime) for i in range(len(df))
        ]
        df["modified_by"] = np.random.choice(d, len(df))
        df.to_csv(f"csvs/{i}", index=False)


df = pd.read_csv("csvs/users.csv")
for i in range(len(df)):
    if df.loc[i, "role"] == "admin":
        df.loc[i, "modified_by"] = "shretiwar"

df.to_csv("csvs/users.csv", index=False)
