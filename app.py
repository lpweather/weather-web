from flask import Flask
import os

app = Flask(__name__)

port = int(os.getenv("VCAP_APP_PORT") or 8080)
print port

@app.route('/')
def index():
    return 'Hello World'

if __name__ == '__main__':
    app.run('0.0.0.0', port)
