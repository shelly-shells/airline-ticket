from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from flask_cors import CORS
import sys
import os
import mysql.connector
import datetime
import json
import random

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sqlConnector"))
)
from loginRegister import login, register
from flightSearch import searchFlights
from updateProfile import update_profile

app = Flask(__name__)
CORS(app)
app.secret_key = "super secret"


def timedelta_to_hhmmss(td):
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}"


@app.route("/")
def loginPage():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def logMeIn():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    status, role = login(username, password)
    if status == 1:
        session["username"] = username
        return {"status": "success", "role": role}
    else:
        return {"status": "failure", "role": None}


@app.route("/register")
def registerPage():
    return render_template("register.html")


@app.route("/register", methods=["POST"])
def registerMe():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    fname = data.get("fname")
    lname = data.get("lname")
    phone = data.get("mobile")
    email = data.get("email")
    age = data.get("age")
    gender = data.get("gender")
    status = register(username, password, fname, lname, phone, email, age, gender)
    if status[0] == 1:
        session["username"] = username
        return {"status": "success"}
    else:
        return {"status": "failure", "message": status[1]}


@app.route("/update-profile", methods=["POST"])
def updateMe():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    fname = data.get("fname")
    lname = data.get("lname")
    phone = data.get("mobile")
    email = data.get("email")
    age = data.get("age")
    gender = data.get("gender")
    status = update_profile(username, password, fname, lname, phone, email, age, gender)
    if status[0] == 1:
        return {"status": "success"}
    else:
        return {"status": "failure", "message": status[1]}


def get_db_connection():
    return mysql.connector.connect(
        user="admin", password="admin", host="127.0.0.1", database="flightBooking"
    )


@app.route("/admin")
def adminPage():
    return render_template("admin.html")


@app.route("/admin/flights")
def flightsPage():
    return render_template("flights.html")


@app.route("/admin/routes")
def routesPage():
    return render_template("routes.html")


@app.route("/admin/cities")
def citiesPage():
    return render_template("cities.html")


@app.route("/api/flights", methods=["GET"])
def get_flights():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    cursor.execute("SELECT * FROM flights")
    res = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(res)


@app.route("/api/flights/<string:flight_id>", methods=["PUT"])
def update_flight(flight_id):
    data = request.get_json()
    cnx = get_db_connection()
    cursor = cnx.cursor()
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.callproc(
        "update_flight",
        (
            flight_id,
            data["model"],
            data["business"],
            data["economy"],
            session["username"],
            time,
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/api/flights", methods=["POST"])
def add_flight():
    data = request.get_json()
    cnx = get_db_connection()
    cursor = cnx.cursor()
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.callproc(
        "insert_flight",
        (
            data["aircraftID"],
            data["model"],
            data["business"],
            data["economy"],
            session["username"],
            time,
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {
        "aircraftID": data["aircraftID"],
        "model": data["model"],
        "business": data["business"],
        "economy": data["economy"],
    }


@app.route("/api/flights/<string:aircraft_id>", methods=["DELETE"])
def delete_flight(aircraft_id):
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.callproc(
        "delete_flight",
        (
            aircraft_id,
            session["username"],
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/api/routes", methods=["GET"])
def get_routes():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    cursor.execute("SELECT * FROM routes")
    res = cursor.fetchall()
    cursor.close()
    cnx.close()
    res = [
        {
            key: (
                timedelta_to_hhmmss(value)
                if isinstance(value, datetime.timedelta)
                else value
            )
            for key, value in route.items()
        }
        for route in res
    ]
    return jsonify(res)


@app.route("/api/routes/<string:route_id>", methods=["PUT"])
def update_route(route_id):
    data = request.get_json()
    cnx = get_db_connection()
    cursor = cnx.cursor()
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.callproc(
        "update_route",
        (
            route_id,
            data["departureAirportCode"],
            data["arrivalAirportCode"],
            data["basePrice"],
            data["aircraftID"],
            data["departureTime"],
            data["arrivalTime"],
            data["Mon"],
            data["Tue"],
            data["Wed"],
            data["Thu"],
            data["Fri"],
            data["Sat"],
            data["Sun"],
            session["username"],
            time,
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/api/routes", methods=["POST"])
def add_route():
    data = request.get_json()
    cnx = get_db_connection()
    cursor = cnx.cursor()
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.callproc(
        "insert_route",
        (
            data["id"],
            data["departureAirportCode"],
            data["arrivalAirportCode"],
            data["basePrice"],
            data["aircraftID"],
            data["departureTime"],
            data["arrivalTime"],
            data["Mon"],
            data["Tue"],
            data["Wed"],
            data["Thu"],
            data["Fri"],
            data["Sat"],
            data["Sun"],
            session["username"],
            time,
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {
        "id": data["id"],
        "departureAirportCode": data["departureAirportCode"],
        "arrivalAirportCode": data["arrivalAirportCode"],
        "basePrice": data["basePrice"],
        "aircraftID": data["aircraftID"],
        "departureTime": data["departureTime"],
        "arrivalTime": data["arrivalTime"],
        "Mon": data["Mon"],
        "Tue": data["Tue"],
        "Wed": data["Wed"],
        "Thu": data["Thu"],
        "Fri": data["Fri"],
        "Sat": data["Sat"],
        "Sun": data["Sun"],
    }


@app.route("/api/routes/<string:route_id>", methods=["DELETE"])
def delete_route(route_id):
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.callproc(
        "delete_route",
        (
            route_id,
            session["username"],
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/api/cities", methods=["GET"])
def get_cities():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cities")
    res = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(res)


@app.route("/api/cities/<string:city_id>", methods=["PUT"])
def update_city(city_id):
    data = request.get_json()
    cnx = get_db_connection()
    cursor = cnx.cursor()
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.callproc(
        "update_city",
        (
            city_id,
            data["cityName"],
            data["airportName"],
            session["username"],
            time,
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/api/cities", methods=["POST"])
def add_city():
    data = request.get_json()
    cnx = get_db_connection()
    cursor = cnx.cursor()
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.callproc(
        "insert_city",
        (
            data["cityID"],
            data["cityName"],
            data["airportName"],
            session["username"],
            time,
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {
        "cityID": data["cityID"],
        "cityName": data["cityName"],
        "airportName": data["airportName"],
    }


@app.route("/api/cities/<string:city_id>", methods=["DELETE"])
def delete_city(city_id):
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.callproc(
        "delete_city",
        (
            city_id,
            session["username"],
        ),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/api/get-cities", methods=["GET"])
def fetchCities():
    cnx = get_db_connection()
    cursor = cnx.cursor()
    cursor.execute("SELECT getCities();")
    res = cursor.fetchone()[0]
    res = json.loads(res)
    cursor.close()
    cnx.close()
    return jsonify({"cities": res})


@app.route("/api/search-flights", methods=["GET"])
def searchFlightsAPI():
    origin = request.args.get("origin")
    destination = request.args.get("destination")
    departure = request.args.get("departure")
    tripType = request.args.get("tripType") == "true"
    returnDate = request.args.get("returnDate") if tripType else None
    adults = request.args.get("adults")
    children = request.args.get("children")
    seatClass = request.args.get("seatClass")

    try:
        res = searchFlights(
            origin,
            destination,
            departure,
            tripType,
            adults,
            children,
            seatClass,
            returnDate,
        )
        if res is None:
            res = {
                "toFlights": [],
                "returnFlights": [],
                "source": [],
                "destination": [],
            }
        return jsonify({"status": "success", "results": res})
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500


@app.route("/search")
def searchPage():
    origin = request.args.get("origin")
    destination = request.args.get("destination")
    departure = request.args.get("departure")
    tripType = request.args.get("tripType")
    returnDate = request.args.get("returnDate") if tripType else None
    adults = request.args.get("adults")
    children = request.args.get("children")
    seatClass = request.args.get("seatClass")

    return render_template(
        "search.html",
        origin=origin,
        destination=destination,
        departure=departure,
        tripType=tripType,
        returnDate=returnDate,
        adults=adults,
        children=children,
        seatClass=seatClass,
    )


def get_user_profile(username):
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    query = "SELECT * FROM view_users WHERE username = %s"
    cursor.execute(query, (username,))
    user_data = cursor.fetchone()
    cursor.close()
    cnx.close()
    return user_data


@app.route("/profile")
def profile():
    if "username" not in session:
        return redirect(url_for("loginPage"))

    user_data = get_user_profile(session["username"])
    if user_data:
        return render_template("profile.html", user=json.dumps(user_data))
    else:
        return render_template("profile.html", error="User profile not found.")


@app.route("/bookingConfirmation")
def booking_confirmation_page():
    return render_template("bookingConfirmation.html")


@app.route("/api/confirm-booking", methods=["POST"])
def confirm_booking():
    data = request.get_json()
    username = session.get("username")
    if not username:
        return jsonify({"status": "failure", "message": "User not logged in"}), 403

    cnx = get_db_connection()
    cursor = cnx.cursor()

    bookingID = random.randint(1000000, 9999999)

    query_string = f"""INSERT INTO bookings (bookingID, username, flightID, date, adults, children, 
                    seatClass, amountPaid, food, extraLuggage) VALUES ({bookingID}, '{username}', '{data["flightID"]}', 
                    '{data["date"]}', {data["adults"]}, {data["children"]}, '{data["seatClass"]}', {data["amountPaid"]}, 
                    {str(data["food"]).upper()}, {str(data["extraLuggage"]).upper()})"""

    cursor.execute(query_string)
    cnx.commit()

    passenger_no = 0
    for passenger in data["passengers"]:
        query_string = f"""INSERT INTO bookingDetails (bookingID, passengerNo, firstName, lastName, gender, age) 
                            VALUES ({bookingID}, {passenger_no}, '{passenger["firstName"]}', '{passenger["lastName"]}', 
                            '{passenger["gender"]}', {passenger["age"]})"""

        cursor.execute(query_string)
        passenger_no += 1

    cnx.commit()
    cursor.close()
    cnx.close()
    return jsonify({"status": "success"})


@app.route("/myBookings")
def my_bookings_page():
    if "username" not in session:
        return redirect(url_for("loginPage"))
    return render_template("myBookings.html")


@app.route("/api/my-bookings", methods=["GET"])
def get_my_bookings():
    username = session.get("username")
    if not username:
        return jsonify({"status": "failure", "message": "User not logged in"}), 403

    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)

    query = """
    SELECT 
        bookingID, 
        flightID, 
        date, 
        adults, 
        children, 
        seatClass, 
        amountPaid, 
        food, 
        extraLuggage, 
        view_routes.departureAirportCode, 
        view_routes.arrivalAirportCode, 
        view_routes.departureTime, 
        view_routes.arrivalTime
    FROM 
        view_bookings
    JOIN 
        view_routes 
    ON 
        view_bookings.flightID = view_routes.id
    WHERE 
        username = %s
    ORDER BY 
        date ASC
    """
    cursor.execute(query, (username,))
    bookings = cursor.fetchall()
    cursor.close()
    cnx.close()

    if bookings:
        for i in bookings:
            i["date"] = i["date"].strftime("%Y-%m-%d")
            i["departureTime"] = timedelta_to_hhmmss(i["departureTime"])
            i["arrivalTime"] = timedelta_to_hhmmss(i["arrivalTime"])

        return jsonify({"status": "success", "bookings": bookings})
    else:
        return jsonify({"status": "success", "bookings": []})


@app.route("/api/booking-details", methods=["GET"])
def get_booking_details():
    booking_id = request.args.get("bookingID")
    username = session.get("username")

    if not username:
        return jsonify({"status": "failure", "message": "User not logged in"}), 403

    if not booking_id:
        return jsonify({"status": "failure", "message": "Booking ID is required"}), 400

    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)

    query = """
        SELECT passengerNo, firstName, lastName, gender, age
        FROM view_bookingDetails
        WHERE bookingID = %s
    """
    cursor.execute(query, (booking_id,))
    passengers = cursor.fetchall()

    cursor.close()
    cnx.close()

    return jsonify({"status": "success", "passengers": passengers})


@app.route("/api/cancel-booking", methods=["POST"])
def cancel_booking():
    try:
        data = request.json
        booking_id = data.get("bookingID")
        username = session.get("username")

        if not username:
            return jsonify({"status": "failure", "message": "User not logged in"}), 403

        if not booking_id:
            return (
                jsonify({"status": "failure", "message": "Booking ID is required"}),
                400,
            )

        cnx = get_db_connection()
        cursor = cnx.cursor()

        delete_query = """
        DELETE FROM bookings
        WHERE bookingID = (
            SELECT * FROM (
                SELECT bookingID
                FROM bookings
                WHERE bookingID = %s AND username = %s
            ) AS subquery
        )
        """
        cursor.execute(delete_query, (booking_id, username))
        cnx.commit()

        if cursor.rowcount == 0:
            return (
                jsonify(
                    {
                        "status": "failure",
                        "message": "Booking not found or already canceled",
                    }
                ),
                404,
            )

        cursor.close()
        cnx.close()

        return jsonify(
            {"status": "success", "message": "Booking canceled successfully"}
        )

    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500


@app.route("/logout", methods=["GET"])
def logout():
    session.pop("username", None)
    return redirect(url_for("loginPage"))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
