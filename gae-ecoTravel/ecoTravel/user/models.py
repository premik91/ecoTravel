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