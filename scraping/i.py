import pandas as pd

df = pd.read_csv("csvs/planes.csv")
df = df["Aircraft"].unique()

d = {"Airbus 321neo" : [78, 0, 0], "Airbus320neo"}