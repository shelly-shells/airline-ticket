import mysql.connector
import datetime
from pricing import getPrice


def timedelta_to_hhmmss(td):
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}"


def filterFlights(cursor, res, date, seatClass, noPassengers):
    res = [
        [timedelta_to_hhmmss(i) if isinstance(i, datetime.timedelta) else i for i in j]
        for j in res
    ]
    l = []
    for i in res:
        cursor.execute("SELECT seatAvailability(%s, %s, %s)", (i[0], date, seatClass))
        seatAvailability = cursor.fetchone()[0]
        l.append(seatAvailability if seatAvailability is not None else -1)

    res = [res[i] for i in range(len(res)) if l[i] >= noPassengers or l[i] == -1]
    res = [
        [
            (
                j[i]
                if i != 3
                else priceCalc(
                    cursor,
                    j[0],
                    seatClass,
                    j[-1] if seatClass == "Economy" else j[-2],
                    j[3],
                    date,
                )
            )
            for i in range(len(j))
        ]
        for j in res
    ]
    return sorted(res, key=lambda x: x[3])


def priceCalc(cursor, flightID, seatClass, seatCount, basePrice, date):
    cursor.execute("SELECT DATEDIFF(%s, CURDATE())", (date,))
    daysLeft = cursor.fetchone()[0]
    cursor.execute("SELECT seatAvailability(%s, %s, %s)", (flightID, date, seatClass))
    seatAvailability = cursor.fetchone()[0]
    seatAvailability = seatAvailability if seatAvailability is not None else seatCount
    return getPrice(int(basePrice), seatAvailability / seatCount, daysLeft)


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


def searchFlights(
    source,
    destination,
    date,
    roundTrip,
    noAdults,
    noChildren,
    seatClass,
    returnDate=None,
):
    try:
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

        query = """
        SELECT 
            routes.id, 
            routes.departureTime, 
            routes.arrivalTime, 
            routes.basePrice, 
            flights.model, 
            flights.business, 
            flights.economy 
        FROM 
            routes 
        JOIN 
            flights ON routes.aircraftID = flights.aircraftID 
        WHERE 
            departureAirportCode=%s 
            AND arrivalAirportCode=%s 
            AND {}=1
        """.format(
            day
        )

        cursor.execute(query, (source, destination))
        res = cursor.fetchall()
        res = filterFlights(
            cursor, res, date, seatClass, int(noAdults) + int(noChildren)
        )

        if roundTrip:
            day = day_dict[datetime.datetime.strptime(returnDate, "%Y-%m-%d").weekday()]
            query = """
            SELECT 
                routes.id, 
                routes.departureTime, 
                routes.arrivalTime, 
                routes.basePrice, 
                flights.model, 
                flights.business, 
                flights.economy 
            FROM 
                routes 
            JOIN 
                flights ON routes.aircraftID = flights.aircraftID 
            WHERE 
                departureAirportCode=%s 
                AND arrivalAirportCode=%s 
                AND {}=1
            """.format(
                day
            )

            cursor.execute(query, (destination, source))
            res1 = cursor.fetchall()
            res1 = filterFlights(
                cursor, res1, returnDate, seatClass, int(noAdults) + int(noChildren)
            )

        d = {"toFlights": res}
        d["returnFlights"] = res1 if roundTrip else False

        cursor.execute("CALL airportDetails(%s, @cityName, @airportName)", (source,))
        cursor.execute("SELECT @cityName, @airportName")
        source_details = cursor.fetchone()

        cursor.execute(
            "CALL airportDetails(%s, @cityName, @airportName)", (destination,)
        )
        cursor.execute("SELECT @cityName, @airportName")
        destination_details = cursor.fetchone()

        d["source"] = source_details
        d["destination"] = destination_details
        d["connectingOneWay"] = connectingFlights(source, destination, date, seatClass)
        if roundTrip:
            d["connectingReturn"] = connectingFlights(
                destination, source, returnDate, seatClass
            )
        cursor.close()
        cnx.close()
        return d

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None


# print(searchFlights("DEL", "BOM", "2025-01-01", False, 5, 1, "Economy"))
