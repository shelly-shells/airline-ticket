import pandas as pd
import random
from datetime import datetime, timedelta

df = pd.read_csv("csvs/users.csv")
df1 = pd.read_csv("csvs/routes.csv")


start = datetime(2024, 9, 1)
end = datetime(2024, 10, 31)
weekdays = {}
while start <= end:
    if start.weekday() not in weekdays:
        weekdays[start.weekday()] = []
    weekdays[start.weekday()].append(start.strftime("%Y-%m-%d"))
    start += timedelta(days=1)

users = df1[df1["role"] == "user"]["username"].tolist()
fid = df["id"].tolist()