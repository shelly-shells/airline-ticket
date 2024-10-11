from flask import Flask, request, render_template, redirect, url_for, session
from flask_cors import CORS
import sys
import os

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sqlConnector"))
)
from loginRegister import login, register
from flightSearch import searchFlights
from admin import flights, routes, cities

app = Flask(__name__)
CORS(app)
app.secret_key = "super secret"


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


@app.route("/admin")
def adminPage():
    return render_template("admin.html")

@app.route("/admin/flights")
def flightsPage():
    res = flights()
    return render_template("flights.html", res=res)

@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    res = searchFlights(
        data["origin"],
        data["destination"],
        data["departure"],
        data["tripType"],
        data["returnDate"],
    )
    session["results"] = res
    return redirect(url_for("searchPage"))


@app.route("/search")
def searchPage():
    results = session.get("results")
    return render_template("search.html", results=results)


if __name__ == "__main__":
    app.run(debug=True, port=3000)
