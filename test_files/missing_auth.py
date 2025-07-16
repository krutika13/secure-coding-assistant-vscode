from flask import Flask

app = Flask(__name__)

@app.route("/dashboard")
def dashboard():
    return "Welcome to the admin dashboard"
