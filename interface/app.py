from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from flask_cors import CORS
import sys
import os
import mysql.connector
import datetime
import json

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sqlConnector"))
)
from loginRegister import login, register
from flightSearch import searchFlights

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
    if status == 1:
        return {"status": "success"}
    else:
        return {"status": "failure"}


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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
