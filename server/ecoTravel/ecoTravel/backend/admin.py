from django.contrib import admin
from ecoTravel.backend.models import UserProfile, TravelType, Journey, Point

admin.site.register(UserProfile)
admin.site.register(TravelType)
admin.site.register(Journey)
admin.site.register(Point)