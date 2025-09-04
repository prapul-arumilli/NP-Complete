# backend

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests

@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask backend! Test Test"})

if __name__ == '__main__':
    app.run(debug=True)