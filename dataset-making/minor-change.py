import pandas as pd
import random

df = pd.read_csv("csvs/users.csv")
a = df["first_name"]
b = df["last_name"]
usn = [
    i[: random.randint(3, 6)].lower()
    + j[: random.randint(3, 6)].lower()
    + "".join([str(random.randint(1, 9)) for i in range(random.randint(0, 2))])
    for i, j in zip(a, b)
]

df["username"] = usn
df["age"] = [random.randint(18, 70) for i in range(len(df))]
df["gender"] = ['M' if i < 78 else 'F' for i in range(len(df))]
df.to_csv("csvs/users.csv", index=False)

