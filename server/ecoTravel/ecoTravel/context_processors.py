from django.conf import settings
from django.core.urlresolvers import resolve


travel_types = {
    'car': 123.0,
    'train': 74.0,
    'bus': 78.2,
    'walk': 5.0,
    'bicycle': 12.0,
    'bike': 112.0,
    'AVG': 96.0
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