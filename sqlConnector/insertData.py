import pandas as pd
import os
import mysql.connector

l = [i for i in os.listdir("csvs") if i.endswith(".csv")]
cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
cursor = cnx.cursor()
cursor.execute("USE flightBooking")
cursor.execute("SET foreign_key_checks = 0")


def quotes(type):
    if "INT" in type or "int" in type or "decimal" in type:
        return ""
    else:
        return "'"


def insertion(name):
    df = pd.read_csv("csvs/" + name)
    cursor.execute("DESC " + name[:-4])
    columns = [(i[0], i[1]) for i in cursor.fetchall()]
    df1 = pd.DataFrame(columns=[i[0] for i in columns])
    for i in range(len(df)):
        df1.loc[i] = df.loc[i]

    for i in range(len(df1)):
        cursor.execute(
            f"INSERT INTO {name[:-4]} VALUES ({', '.join([quotes(columns[j][1]) + str(df1.iloc[i, j]) + quotes(columns[j][1]) for j in range(len(columns))])})"
        )
    cnx.commit()


for i in l:
    try:
        insertion(i)
    except Exception as e:
        print(e)
        break

cursor.execute("SET foreign_key_checks = 1")
