import os
import json
from peewee import *

# read config from environement or use fallback
env = os.environ.get('VCAP_SERVICES')
credentials = json.loads(env) if env else {
    'mariadb': [
        {'credentials': {
            'database': 'LowPowerWeatherDB',
            'host': 'localhost',
            'port': 3306,
            'username': 'user',
            'password': 'user' }
        }
    ]
}

db = MySQLDatabase(credentials['mariadb'][0]['credentials']['database'],
    host=credentials['mariadb'][0]['credentials']['host'],
    port=credentials['mariadb'][0]['credentials']['port'],
    user=credentials['mariadb'][0]['credentials']['username'],
    passwd=credentials['mariadb'][0]['credentials']['password'])

class Sensor(Model):
    '''
        Represents a 'weather station' sensor node
    '''
    deveuid = TextField()
    position = TextField()

    class Meta:
        database = db

class Measurement(Model):
    '''
        Represents a measurement of a given sensor
        (sensor type) attached to the sensor node
    '''
    sensor = ForeignKeyField(Sensor, related_name='measurements')
    type = TextField()
    value = TextField()
    timestamp = DateTimeField()

    class Meta:
        database = db


def create_tables():
    '''
        Creates tables
    '''
    db.connect()
    db.create_tables([Sensor, Measurement])
