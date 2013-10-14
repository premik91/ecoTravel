from django.conf.urls import patterns, url
from django.contrib import admin
from backend import views as backend_views
from user import views as user_views

admin.autodiscover()
urlpatterns = patterns(
    '',
    # Api
    # Get all travel types
    url(r'^api/travel/types/$', backend_views.GetTravelTypes.as_view(), name='get_travel_types'),
    # Get particular travel type
    url(r'^api/travel/types/(?P<travel_type>\w+)$', backend_views.GetTravelTypes.as_view(), name='get_travel_types'),

    # # User login
    url(r'^user/login/(?P<facebook_token>\w+)$', user_views.UserLogin, name='user_login'),
    # User friends
    url(r'^user/friends/$', user_views.GetUserFriends.as_view(), name='user_friends'),
    url(r'^user/summary/$', user_views.GetUserSummary.as_view(), name='user_summary'),

    # Trip
    url(r'^journey/batch/$', backend_views.JourneyBatch, name='journey_batch'),
    url(r'^journey/map/(?P<journey_id>\w+)$', backend_views.JourneyMap.as_view(), name='journey_map'),
)
