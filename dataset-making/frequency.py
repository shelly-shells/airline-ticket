import pandas as pd
import random

df = pd.read_csv("csvs/routes.csv")
df = df.drop(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], axis=1)
a = df[["origin", "destination"]].values
metros = ["BOM", "DEL", "BLR", "HYD", "MAA", "CCU", "AMD", "PNQ", "COK", "GOI", "GAU"]
prio = []
for i in a:
    if i[0] in metros and i[1] in metros:
        prio.append(random.randint(6, 7))
    elif i[0] in metros or i[1] in metros:
        prio.append(random.randint(4, 6))
    else:
        prio.append(random.randint(2, 4))

days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

prio = [random.sample(days, k=i) for i in prio]
onehot = [[1 if day in i else 0 for day in days] for i in prio]
freq = pd.DataFrame(onehot, columns=days)
df = pd.concat([df, freq], axis=1)
df.to_csv("csvs/routes.csv", index=False)
