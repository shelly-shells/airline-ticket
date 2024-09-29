from flask import Flask, request, render_template, redirect, url_for
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def login():
    return render_template("login.html")


@app.route("/home")
def home():
    return render_template("home.html")


@app.route("/login", methods=["POST"])
def logMeIn():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    print(username, password)
    return {"status": "success"}


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
