import pandas as pd

df = pd.read_csv("csvs/booking-details.csv")

curr = None
count = 1
l = []
for i in range(len(df)):
    if curr != df["bid"][i]:
        curr = df["bid"][i]
        count = 1
        l.append(count)
    else:
        count += 1
        l.append(count)
df["passengerNo"] = l   
df.to_csv("csvs/booking-details.csv", index=False)