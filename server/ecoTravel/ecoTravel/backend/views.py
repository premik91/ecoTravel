import json
from django.http import HttpResponse
from django.views import generic as generic_views

from ecoTravel.context_processors import travel_types
from ecoTravel.backend import facebook

class GetTravelTypes(generic_views.RedirectView):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        response = {}
        if 'travel_type' in kwargs:
            # If travel type exists return only average co2 produce
            travel_type = travel_types.get(kwargs['travel_type'])
            if travel_type is not None:
                response = travel_types.get(kwargs['travel_type'])
        else:
            response = json.dumps(travel_types)
        return HttpResponse(response, content_type="application/json")


# graph = facebook.GraphAPI(oauth_access_token)
# profile = graph.get_object("me")
# friends = graph.get_connections("me", "friends")
# graph.put_object("me", "feed", message="I am writing on my wall!")