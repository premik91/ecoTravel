from google.appengine.ext import db


class User(db.Model):
    first_name = db.StringProperty()
    last_name = db.StringProperty()
    email = db.StringProperty()

    facebook_token = db.StringProperty()
    facebook_id = db.StringProperty()
    # -1 if it no active trip
    active_trip_id = db.IntegerProperty(default=-1)

    # Are user journeys allowed public
    public = db.BooleanProperty(default=True)


class TravelType(db.Model):
    name = db.StringProperty()
    co2_exhausts = db.FloatProperty()


class Journey(db.Model):
    user = db.ReferenceProperty(User)
    travel_type = db.ReferenceProperty(TravelType)
    start_date = db.DateTimeProperty(auto_now_add=True)
    end_date = db.DateTimeProperty(auto_now_add=True)


class Point(db.Model):
    journey = db.ReferenceProperty(Journey)
    latitude = db.FloatProperty()
    longitude = db.FloatProperty()
    # In kilometers per hour
    speed = db.FloatProperty()
    time = db.DateTimeProperty(auto_now_add=True)
    # In kilometers
    distance = db.FloatProperty()