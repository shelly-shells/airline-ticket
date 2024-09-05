# import pandas as pd

# df = pd.read_csv("csvs/Indian-Airlines-Dataset.csv")

# df = df.drop_duplicates("fltno")
# df.to_csv("csvs/output.csv", index=False)

# import pandas as pd

# # Read the CSV files into DataFrames
# df = pd.read_csv("csvs/output.csv")
# df1 = pd.read_csv("csvs/routes.csv")

# merged_df = df.merge(df1, how="left", indicator=True)

# result_df = merged_df[merged_df["_merge"] == "left_only"].drop(columns=["_merge"])

# result_df.to_csv("csvs/output.csv", index=False)

# import pandas as pd

# df = pd.read_csv("csvs/routes.csv")
# df = df.sort_values("id")
# df.to_csv("csvs/routes.csv", index=False)