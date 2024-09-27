import mysql.connector

cnx = mysql.connector.connect(
    user="shusrith", password="2004", host="127.0.0.1"
)
cursor = cnx.cursor()
cursor.execute("drop database Fest_Database")
print(cursor.fetchall())
cnx.close()
