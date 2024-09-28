"""
Generate bookings csv. Randomly assign users to flights, generate random number of passengers and children, assign random food and luggage, and generate random timestamps.
Number of passengers chosen from a normal distribution with mean 3.5 and standard deviation 2.291. Number of children chosen randomly from 0 to half the number of passengers.
Chose a random day of the week that the flight is available and chose a random date between sept 1 and oct 31
"""

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
fid = [[x[0], x[1], random.choice(weekdays[x[2]])] for x in fid]
bookings = [
    [
        random.randint(1000000, 9999999),
        random.choice(users),
        *random.choice(fid),
        passengers[i],
        children[i],
    ]
    for i in range(500)
]

bookings = pd.DataFrame(
    bookings,
    columns=["bid", "username", "fid", "base_price", "day", "passengers", "children"],
)
bookings["price"] = (
    bookings["base_price"] * bookings["passengers"]
    + bookings["base_price"] * 0.5 * bookings["children"]
)
bookings.drop(columns=["base_price"], inplace=True)
bookings["food"] = [
    random.choices([0, 1], weights=[0.75, 0.25], k=1)[0] for i in range(500)
]
bookings["luggage"] = [
    random.choices([0, 1], weights=[0.75, 0.25], k=1)[0] for i in range(500)
]
start_date = datetime(2024, 3, 1)
end_date = datetime(2024, 7, 31)


def random_timestamp(start_date, end_date):
    start_timestamp = start_date.timestamp()
    end_timestamp = end_date.timestamp()
    random_timestamp = random.uniform(start_timestamp, end_timestamp)
    return datetime.fromtimestamp(random_timestamp).strftime("%Y-%m-%d %H:%M:%S")


bookings["timestamp"] = [random_timestamp(start_date, end_date) for i in range(500)]


bookings.to_csv("csvs/bookings.csv", index=False)
