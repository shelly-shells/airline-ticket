import pandas as pd

df = pd.read_csv("csvs/planes.csv")
d = {
  "Airbus A321neo": {
    "economy": 174,
    "business": 16,
    "first_class": 0
  },
  "Airbus A320neo": {
    "economy": 150,
    "business": 12,
    "first_class": 0
  },
  "Airbus A320": {
    "economy": 150,
    "business": 12,
    "first_class": 0
  },
  "Airbus A321": {
    "economy": 185,
    "business": 16,
    "first_class": 0
  },
  "Airbus A320 (sharklets)": {
    "economy": 150,
    "business": 12,
    "first_class": 0
  },
  "ATR 42 / ATR 72": {
    "economy": 68,
    "business": 0,
    "first_class": 0
  },
  "ATR 72": {
    "economy": 70,
    "business": 0,
    "first_class": 0
  },
  "Airbus A350-900": {
    "economy": 270,
    "business": 48,
    "first_class": 0
  },
  "Airbus A319": {
    "economy": 126,
    "business": 12,
    "first_class": 0
  },
  "Boeing 777-300ER": {
    "economy": 268,
    "business": 42,
    "first_class": 8
  },
  "De Havilland (Bombardier) DHC-8-400 Dash 8Q": {
    "economy": 74,
    "business": 0,
    "first_class": 0
  },
  "Boeing 737-700 (winglets) Passenger/BBJ1": {
    "economy": 112,
    "business": 12,
    "first_class": 0
  },
  "Boeing 737-800 (winglets) Passenger/BBJ2": {
    "economy": 160,
    "business": 16,
    "first_class": 0
  },
  "Boeing 737-900 (winglets) Passenger/BBJ3": {
    "economy": 178,
    "business": 16,
    "first_class": 0
  }
}

df1 = pd.DataFrame(d).T.reset_index()
df1.columns = ["Aircraft", "economy", "business", "first_class"]
df = df.merge(df1, on="Aircraft")
df.drop("first_class", axis=1, inplace=True)

df.to_csv("csvs/planes.csv", index=False)

