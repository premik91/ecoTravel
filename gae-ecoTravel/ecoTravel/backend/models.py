from google.appengine.ext import db
from ecoTravel.user.models import User


class TravelType(db.Model):
    name = db.StringProperty()
    co2_exhausts = db.FloatProperty()


class Journey(db.Model):
    user = db.ReferenceProperty(User)
    travel_type = db.ReferenceProperty(TravelType)
    start_date = db.DateTimeProperty(auto_now_add=True)
    end_date = db.DateTimeProperty(auto_now_add=True)
    distance = db.FloatProperty(default=0.0)


class Point(db.Model):
    journey = db.ReferenceProperty(Journey)
    latitude = db.FloatProperty()
    longitude = db.FloatProperty()
    # In kilometers per hour
    speed = db.FloatProperty()
    time = db.DateTimeProperty(auto_now_add=True)
    # In kilometers
    distance = db.FloatProperty()