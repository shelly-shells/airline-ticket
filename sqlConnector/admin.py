import mysql.connector


def flights():
    cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("USE flightBooking")
    cursor.execute("SELECT * FROM flights")
    res = cursor.fetchall()
    cursor.close()
    cnx.close()
    return res


def routes():
    cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("USE flightBooking")
    cursor.execute("SELECT * FROM routes")
    res = cursor.fetchall()
    cursor.close()
    cnx.close()
    return res


def cities():
    cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("USE flightBooking")
    cursor.execute("SELECT * FROM cities")
    res = cursor.fetchall()
    cursor.close()
    cnx.close()
    return res
