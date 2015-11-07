import os
import json
from peewee import *

credentials = json.loads(os.environ.get('VCAP_SERVICES'))
print(credentials)
db = MySQLDatabase(credentials['mariadb'][0]['credentials']['database'],
    host=credentials['mariadb'][0]['credentials']['host'],
    port=credentials['mariadb'][0]['credentials']['port'],
    user=credentials['mariadb'][0]['credentials']['username'],
    passwd=credentials['mariadb'][0]['credentials']['password'])

class Sensor(Model):
    deveuid = TextField()
    position = TextField()

    class Meta:
        database = db

class Measurement(Model):
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
