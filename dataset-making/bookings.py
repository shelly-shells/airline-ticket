import pandas as pd
import random
import numpy as np
from datetime import datetime, timedelta

df1 = pd.read_csv("csvs/users.csv")
df = pd.read_csv("csvs/routes.csv")


start = datetime(2024, 9, 1)
end = datetime(2024, 10, 31)
weekdays = {}
while start <= end:
    if start.weekday() not in weekdays:
        weekdays[start.weekday()] = []
    weekdays[start.weekday()].append(start.strftime("%Y-%m-%d"))
    start += timedelta(days=1)

users = df1[df1["role"] == "user"]["username"].tolist()
fid = df[
    ["id", "base_price", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
].values.tolist()
passengers = [
    int(np.clip(np.round(np.random.normal((3.5, 2.291))), 1, 8)[0]) for i in range(500)
]
children = [random.randint(0, i // 2) for i in passengers]
passengers = [i - j for i, j in zip(passengers, children)]
fid = [[x[0], x[1], random.choice([i for i in range(7) if x[i + 2] == 1])] for x in fid]
bookings = [
    [random.choice(users), *random.choice(fid), passengers[i], children[i]]
    for i in range(500)
]
bookings = pd.DataFrame(
    bookings, columns=["username", "fid", "base_price", "day", "passengers", "children"]
)
bookings.to_csv("a.csv", index=False)
