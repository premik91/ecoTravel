from django.conf.urls import patterns, url
from django.contrib import admin
from backend import views as frontend_views

admin.autodiscover()
urlpatterns = patterns(
    '',
    # Api
    # Get all travel types
    url(r'^api/travel/types/$', frontend_views.GetTravelTypes.as_view(), name='get_travel_types'),
    # Get particular travel type
    url(r'^api/travel/types/(?P<travel_type>\w+)$', frontend_views.GetTravelTypes.as_view(), name='get_travel_types'),

    # # User login
    url(r'^user/login/(?P<facebook_token>\w+)$', frontend_views.UserLogin, name='user_login'),
    # User friends
    url(r'^user/friends/$', frontend_views.GetUserFriends.as_view(), name='user_friends'),
    url(r'^user/summary/$', frontend_views.GetUserSummary.as_view(), name='user_summary'),

    # Trip
    url(r'^trip/batch/$', frontend_views.TripBatch, name='trip_batch'),
)
