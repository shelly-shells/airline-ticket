from flask import Flask, request, render_template, redirect, url_for
from flask_cors import CORS
import sys
import os
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sqlConnector"))
)
from loginRegister import login, register

app = Flask(__name__)
CORS(app)


@app.route("/")
def loginPage():
    return render_template("login.html")


@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/login", methods=["POST"])
def logMeIn():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    status = login(username, password)
    if status == 1:
        return {"status": "success"}
    else:
        return {"status": "failure"}


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    print(data)
    return redirect(url_for("search_results", **data))


@app.route("/search-results")
def search_results():
    origin = request.args.get("origin")
    destination = request.args.get("destination")
    departure = request.args.get("departure")
    return_date = request.args.get("returnDate")
    trip_type = request.args.get("tripType")
    adults = request.args.get("adults")
    children = request.args.get("children")

    return render_template(
        "search.html",
        origin=origin,
        destination=destination,
        departure=departure,
        return_date=return_date,
        trip_type=trip_type,
        adults=adults,
        children=children,
    )


if __name__ == "__main__":
    app.run(debug=True, port=3000)
