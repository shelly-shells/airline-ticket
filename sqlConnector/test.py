import mysql.connector
import pandas as pd
cnx = mysql.connector.connect(
    user="admin", password="admin", host="127.0.0.1"
)
# def quotes(type):
#     if "INT" in type or "int" in type or "decimal" in type:
#         return ""
#     else:
#         return "'"


# df = pd.read_csv("csvs/bookings.csv")
# cursor = cnx.cursor()
# cursor.execute("USE flightBooking")
# cursor.execute("set foreign_key_checks =0")
# cursor.execute("DESC bookings")
# columns = [(i[0], i[1]) for i in cursor.fetchall()]
# df1 = pd.DataFrame(columns=[i[0] for i in columns])
# for i in range(len(df)):
#         df1.loc[i] = df.loc[i]

# for i in range(len(df1)):
#         cursor.execute(
#             f"INSERT INTO bookings VALUES ({', '.join([quotes(columns[j][1]) + str(df1.iloc[i, j]) + quotes(columns[j][1]) for j in range(len(columns))])})"
#         )
# cnx.commit()
# cursor.execute("set foreign_key_checks = 1")

cursor = cnx.cursor()
cursor.execute("use flightBooking;")
cursor.execute(f"select seatAvailability('6E 7211', '2024-10-19', 'Business')")
print(cursor.fetchone()[0] > 0)
