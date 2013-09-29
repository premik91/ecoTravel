from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    user = models.ForeignKey(User)
    facebook_token = models.CharField(unique=True, max_length=1000)
    facebook_id = models.CharField(unique=True, max_length=1000)
    # -1 if it no active trip
    active_trip_id = models.IntegerField(default=-1)
    # Are user journeys allowed public
    public = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email


class TravelType(models.Model):
    name = models.CharField(max_length=100)
    co2_exhausts = models.FloatField()

    def __str__(self):
        return self.name


class Journey(models.Model):
    user_profile = models.ForeignKey(UserProfile)
    travel_type = models.ForeignKey(TravelType)
    start_date = models.DateTimeField(default=timezone.now())
    end_date = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return self.user_profile.user.email + ' --- ' + str(self.id)


class Point(models.Model):
    journey = models.ForeignKey(Journey)
    latitude = models.FloatField()
    longitude = models.FloatField()
    # In kilometers per hour
    speed = models.FloatField()
    time = models.DateTimeField(default=timezone.now())
    # In kilometers
    distance = models.FloatField()

    def __str__(self):
        return str(self.journey.id)