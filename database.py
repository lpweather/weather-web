from peewee import *

db = MySQLDatabase('LowPowerWeatherDB', user='user', passwd='user')

class Sensor(Model):
    connected_since = DateTimeField()
    position = TextField()

    class Meta:
        database = db

class Measurement(Model):
    owner = ForeignKeyField(Sensor, related_name='measurements')
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
