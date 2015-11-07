import os
import re
import datetime
from flask import (Flask,
    send_from_directory,
    request, jsonify, g)
from database import db, Sensor, Measurement, create_tables
import xml.etree.ElementTree as ElementTree
import os

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
        the payload has the folowing format:
        ['tt', 'xx', 'xx', 'xx', 'xx']

        'tt' is the measurement type
        mapped via the 'measurement_type_map'

        the 'xx' values represent a number in the format of
        'xxxx.xxxx' (four digits bevore the and four after the dot)
    '''
    # remove namespace for parsing
    xml = ElementTree.fromstring(re.sub(' xmlns="[^"]+"', '', request.data, count=1))

    measurement = {
        'deveui': None,
        'time': None,
        'payload_hex': None }

    measurement_type_map = {
        '00': 'temparature',
        '01': 'lumen',
        '02': 'light' }

    for child in xml:
        print(child.tag.lower())
        if child.tag.lower() in measurement:
            print('added {0}'.format(child.text))
            measurement[child.tag.lower()] = child.text

    sensor, created = Sensor.get_or_create(
        deveuid=measurement['deveui'],
        position='47.3846794:8.5329564')

    Measurement.create(
        timestamp=datetime.datetime.strptime(measurement['time'][:19], '%Y-%m-%dT%H:%M:%S'),
        type=measurement_type_map[measurement['payload_hex'][:2]],
        value=measurement['payload_hex'][2:],
        sensor=sensor).save()

    sensor.save()

    return jsonify({'message': str(xml)})

@app.route('/lazy_setup')
def lazy_setup():
    '''
        Lazy setup to create the database connection
    '''
    db.connect()
    create_tables()

@app.before_request
def before_request():
    g.db = db
    g.db.connect()

@app.after_request
def after_request(response):
    g.db.close()
    return response

if __name__ == '__main__':
    app.run('0.0.0.0', port)
