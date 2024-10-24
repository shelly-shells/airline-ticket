import mysql.connector
from flightSearch import timedelta_to_hhmmss, priceCalc
import datetime


def connectingFlights(departureAirportCode, arrivalAirportCode, date, seatClass):
    cnx = mysql.connector.connect(
        user="user", password="user", host="127.0.0.1", database="flightBooking"
    )
    cursor = cnx.cursor()
    day_dict = {
        0: "Mon",
        1: "Tue",
        2: "Wed",
        3: "Thu",
        4: "Fri",
        5: "Sat",
        6: "Sun",
    }
    day = day_dict[datetime.datetime.strptime(date, "%Y-%m-%d").weekday()]

    query = f"""
    SELECT r1.id, r1.departureTime, r1.arrivalTime, r1.basePrice, f1.model, f1.business, f1.economy,
    r2.id, r2.departureTime, r2.arrivalTime, r2.basePrice, f2.model, f2.business, f2.economy
    FROM routes r1
    JOIN routes r2 ON r1.arrivalAirportCode = r2.departureAirportCode
    JOIN flights f1 ON r1.aircraftID = f1.aircraftID
    JOIN flights f2 ON r2.aircraftID = f2.aircraftID
    WHERE r1.departureAirportCode = %s
    AND r2.arrivalAirportCode = %s
    AND r1.{day} = 1
    AND r2.{day} = 1
    AND r1.arrivalTime < r2.departureTime;
    """
    cursor.execute(query, (departureAirportCode, arrivalAirportCode))
    connecting_flights = cursor.fetchall()
    connecting_flights = [{0: list(i[:7]), 1: list(i[7:])} for i in connecting_flights]
    for i in connecting_flights:
        i[0][1] = timedelta_to_hhmmss(i[0][1])
        i[0][2] = timedelta_to_hhmmss(i[0][2])
        i[1][1] = timedelta_to_hhmmss(i[1][1])
        i[1][2] = timedelta_to_hhmmss(i[1][2])
        cursor.execute(
            "SELECT seatAvailability(%s, %s, %s)", (i[0][0], date, seatClass)
        )
        i[0].append(
            1 if cursor.fetchone()[0] is None or cursor.fetchone()[0] >= 0 else -1
        )
        cursor.execute(
            "SELECT seatAvailability(%s, %s, %s)", (i[1][0], date, seatClass)
        )
        i[1].append(
            1 if cursor.fetchone()[0] is None or cursor.fetchone()[0] >= 0 else -1
        )

    connecting_flights = [
        i for i in connecting_flights if i[0][-1] == 1 and i[1][-1] == 1
    ]

    for i in connecting_flights:
        i[0][3] = priceCalc(
            cursor,
            i[0][1],
            seatClass,
            i[0][5] if seatClass == "Business" else i[0][6],
            i[0][3],
            date,
        )

        i[1][3] = priceCalc(
            cursor,
            i[1][1],
            seatClass,
            i[1][5] if seatClass == "Business" else i[1][6],
            i[1][3],
            date,
        )

    cursor.close()
    cnx.close()
    return connecting_flights


print(connectingFlights("AMD", "BHO", "2024-11-01", "Economy"))
