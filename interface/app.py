from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from flask_cors import CORS
import sys
import os
import mysql.connector
import datetime

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sqlConnector"))
)
from loginRegister import login, register
from flightSearch import searchFlights
from admin import flights, routes, cities

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
    query = f"""
        UPDATE flights
        SET model = '{data["model"]}', business = {data["business"]}, economy = {data["economy"]}, updatedBy = '{session["username"]}', uTime = '{time}'
        WHERE aircraftID = '{flight_id}'
    """
    cursor.execute(query)
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
    query = f"""
        UPDATE routes
        SET departureAirportCode = '{data["departureAirportCode"]}', arrivalAirportCode = '{data["arrivalAirportCode"]}', basePrice = {data["basePrice"]},
            aircraftID = '{data["aircraftID"]}', departureTime = '{data["departureTime"]}', arrivalTime = '{data["arrivalTime"]}',
            Mon = {data["Mon"]}, Tue = {data["Tue"]}, Wed = {data["Wed"]}, Thu = {data["Thu"]}, Fri = {data["Fri"]}, Sat = {data["Sat"]}, Sun = {data["Sun"]}, updatedBy = '{session["username"]}', uTime = '{time}'
        WHERE id = '{route_id}'
    """
    cursor.execute(query)
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
    cursor.execute(
        """
        UPDATE cities
        SET cityName = %s, airportName = %s, updatedBy = %s, uTime = %s
        WHERE cityID = %s
        """,
        (data["cityName"], data["airportName"], session["username"], time, city_id),
    )
    cnx.commit()
    cursor.close()
    cnx.close()
    return {"status": "success"}


@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/api/search-flights", methods=["GET"])
def searchFlightsAPI():
    origin = request.args.get("origin")
    destination = request.args.get("destination")
    departure = request.args.get("departure")
    tripType = request.args.get("tripType") == "true"
    returnDate = request.args.get("returnDate") if tripType else None
    print(origin, destination, departure, tripType, returnDate)
    try:
        res = searchFlights(origin, destination, departure, tripType, returnDate)
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
    
    return render_template(
        "search.html",
        origin=origin,
        destination=destination,
        departure=departure,
        tripType=tripType,
        returnDate=returnDate,
        adults=adults,
        children=children,
    )


if __name__ == "__main__":
    app.run(debug=True, port=3000)
