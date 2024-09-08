import pandas as pd
import random
from datetime import datetime, timedelta

# df = pd.read_csv("csvs/users.csv")
# df1 = pd.read_csv("csvs/routes.csv")

# book = df.sample(random.randint(20, 45))
# book["route_id"] = df1.sample(len(book))["route_id"]

start = datetime(2024, 9, 1)
end = datetime(2024, 9, 8)

while start <= end:
    start += timedelta(days=1)
    print(start)
    if start.weekday() == 0:
        print(start.strftime("%Y-%m-%d"))