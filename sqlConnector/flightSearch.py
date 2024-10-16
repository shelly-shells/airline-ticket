import mysql.connector
import datetime


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
    return res


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

        return d

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

    finally:
        cursor.close()
        cnx.close()


# print(searchFlights("DEL", "BOM", "2024-10-18", True, 5, "2024-10-20"))
