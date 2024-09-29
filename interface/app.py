from flask import Flask, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def login():
    return render_template("login.html")


@app.route("/home")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=True, port=3000)
