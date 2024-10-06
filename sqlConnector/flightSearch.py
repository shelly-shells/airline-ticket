import mysql.connector
import datetime


def populate():
    cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("use flightBooking")
    cursor.execute("SET FOREIGN_KEY_CHECKS=0")
    with open("csvs/routes.csv") as f:
        l = f.readlines()
        for line in l[1:]:
            line = line.strip()
            line = line.split(",")
            s = f"insert into routes values ('{line[0]}', '{line[5]}', '{line[1]}', '{line[2]}', '{line[3]}', '{line[4]}', {line[13]}, {line[6]}, {line[7]}, {line[8]}, {line[9]}, {line[10]}, {line[11]}, {line[12]}, '{line[15]}', '{line[14]}')"
            try:
                cursor.execute(s)
            except:
                print(s)
        f.close()
    cursor.execute("SET FOREIGN_KEY_CHECKS=1")
    cnx.commit()


# populate()


def search(source, destination, date, roundTrip, returnDate=None):
    cnx = mysql.connector.connect(user="user", password="user", host="127.0.0.1")
    cursor = cnx.cursor()
    day_dict = {0: "monday", 1: "tuesday", 2: "wednesday", 3: "thursday", 4: "friday", 5: "saturday", 6: "sunday"}
    day = day_dict[datetime.datetime.strptime(date, "%Y-%m-%d").weekday()]
    cursor.execute("use flightBooking")
    cursor.execute(
        f"select * from routes where departureAirportCode='{source}' and arrivalAirportCode='{destination}' and {day}=1"
    )
    res = cursor.fetchall()
    if roundTrip:
        day = day_dict[datetime.datetime.strptime(returnDate, "%Y-%m-%d").weekday()]
        cursor.execute(
            f"select * from routes where departureAirportCode='{destination}' and arrivalAirportCode='{source}' and {day}=1"
        )
        res1 = cursor.fetchall()
    for i in res:
        print(i)
    if roundTrip:
        print("Return Flights")
        for i in res1:
            print(i)

search("DEL", "BOM", "2021-06-01", True, "2021-06-10")
