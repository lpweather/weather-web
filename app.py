import os
from flask import Flask, send_from_directory, request, jsonify
import xml.etree.ElementTree as ElementTree


app = Flask(__name__)
app.debug = True
# get the port from the app cloud or use fallback
port = int(os.getenv("VCAP_APP_PORT") or 8080)

app._static_folder = 'www/'

@app.route('/')
def index():
    '''
        Home page of the weather app
    '''
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def send_js(path):
    '''
        Serves static javascript files
    '''
    return send_from_directory('www/js/', path)

@app.route('/css/<path:path>')
def send_css(path):
    '''
        Serves static style sheets
    '''
    return send_from_directory('www/css/', path)

@app.route('/weather_data', methods=['POST'])
def weather_data():
    '''
        Handles data recieved from the weather sensors
    '''
    xml = ElementTree.fromstring(request.data).getroot()
    print(xml)
    return  jsonify({'message': str(xml)})

if __name__ == '__main__':
    app.run('0.0.0.0', port)
