import mysql.connector
import datetime


def timedelta_to_hhmmss(td):
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}"


def searchFlights(source, destination, date, roundTrip, returnDate=None):
    cnx = mysql.connector.connect(user="user", password="user", host="127.0.0.1")
    cursor = cnx.cursor()
    day_dict = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
    day = day_dict[datetime.datetime.strptime(date, "%Y-%m-%d").weekday()]
    cursor.execute("USE flightBooking")
    cursor.execute(
        f"""
        SELECT 
            routes.id, 
            routes.departureTime, 
            routes.arrivalTime, 
            routes.basePrice, 
            flights.model, 
            flights.business, 
            flights.economy, 
            departure_city.cityName AS departureCityName, 
            departure_city.airportName AS departureAirportName, 
            arrival_city.cityName AS arrivalCityName, 
            arrival_city.airportName AS arrivalAirportName 
        FROM 
            routes 
        JOIN 
            flights ON routes.aircraftID = flights.aircraftID 
        JOIN 
            cities AS departure_city ON routes.departureAirportCode = departure_city.cityID 
        JOIN 
            cities AS arrival_city ON routes.arrivalAirportCode = arrival_city.cityID 
        WHERE 
            departureAirportCode='{source}' 
            AND arrivalAirportCode='{destination}' 
            AND {day}=1
        """
    )
    res = cursor.fetchall()
    res = [
        [timedelta_to_hhmmss(i) if isinstance(i, datetime.timedelta) else i for i in j]
        for j in res
    ]
    if roundTrip == "True":
        day = day_dict[datetime.datetime.strptime(returnDate, "%Y-%m-%d").weekday()]
        cursor.execute(
            f"""
        SELECT 
            routes.id, 
            routes.departureTime, 
            routes.arrivalTime, 
            routes.basePrice, 
            flights.model, 
            flights.business, 
            flights.economy, 
        FROM 
            routes 
        JOIN 
            flights ON routes.aircraftID = flights.aircraftID 
        WHERE 
            departureAirportCode='{source}' 
            AND arrivalAirportCode='{destination}' 
            AND {day}=1
        """
        )
        res1 = cursor.fetchall()
        res1 = [
            [
                timedelta_to_hhmmss(i) if isinstance(i, datetime.timedelta) else i
                for i in j
            ]
            for j in res1
        ]
    d = {}
    d["toFlights"] = res
    if roundTrip == "True":
        d["returnFlights"] = res1
    else:
        d["returnFlights"] = False
    
    cursor.execute(f"CALL airportDetails('{source}', @cityName, @airportName)")
    cursor.execute("SELECT @cityName, @airportName")
    source = cursor.fetchone()
    cursor.execute(f"CALL airportDetails('{destination}', @cityName, @airportName)")
    cursor.execute("SELECT @cityName, @airportName")
    destination = cursor.fetchone()
    d["source"] = source
    d["destination"] = destination
    return d


# print(searchFlights("DEL", "BOM", "2021-06-01", True, "2021-06-10"))
