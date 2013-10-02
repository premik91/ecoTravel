from django.conf import settings
from django.core.urlresolvers import resolve
from ecoTravel.backend.models import TravelType


travel_types = {
    'Car': 123.0,
    'Train': 74.0,
    'Bus': 78.2,
    'Walk': 5.0,
    'Bicycle': 12.0,
    'Bike': 112.0,
    'Average': 96.0
}


def global_vars(request):
    """
    Adds global variables to the context.
    """
    return {
        # Constants
        'SITE_NAME': settings.SITE_NAME,
        'current_url': resolve(request.path_info).url_name,
    }


def save_to_database():
    # Save all travel types
    for travel_type in travel_types:
        if TravelType.all().filter('name', travel_type).count() == 0:
            TravelType(name=travel_type, co2_exhausts=travel_types.get(travel_type)).put()