import pandas as pd
import os
from sqlalchemy import create_engine
import mysql.connector

l = [i for i in os.listdir("csvs") if i.endswith(".csv")]
engine = create_engine("mysql+pymysql://admin:admin@127.0.0.1/flightBooking")
cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
cursor = cnx.cursor()
cursor.execute("USE flightBooking")
cursor.execute("SET foreign_key_checks = 0")


def insertion(name):
    print(name)
    df = pd.read_csv("csvs/" + name)
    cursor.execute("DESC " + name[:-4])
    columns = [i[0] for i in cursor.fetchall()]
    df1 = pd.DataFrame(columns=columns)
    for i in range(len(df)):
        df1.loc[i] = df.loc[i]
    df1.to_sql(name[:-4], engine, if_exists="append", index=False)


for i in l:
    insertion(i)

cursor.execute("SET foreign_key_checks = 1")
