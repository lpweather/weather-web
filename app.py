from flask import Flask, send_from_directory
import os

app = Flask(__name__)
app.debug = True

port = int(os.getenv("VCAP_APP_PORT") or 8080)
print port

app._static_folder = 'www/'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('www/js/', path)

if __name__ == '__main__':
    app.run('0.0.0.0', port)
