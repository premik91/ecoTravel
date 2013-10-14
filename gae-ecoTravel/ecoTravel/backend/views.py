import json
import logging
from datetime import datetime

from django.http import HttpResponse
from django.views import generic as generic_views
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from google.appengine.ext.db import to_dict

from ecoTravel.backend.models import TravelType, Journey, Point
from ecoTravel.user.models import User
from ecoTravel.context_processors import save_to_database
from libs import pytz


class JourneyMap(generic_views.TemplateView):
    template_name = 'journey_map.html'

    def get(self, request, *args, **kwargs):
        return super(JourneyMap, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(JourneyMap, self).get_context_data(**kwargs)
        journey = Journey.get_by_id(long(kwargs['journey_id']))
        points = Point.all().filter('journey', journey)
        if points.count() > 0:
            context.update({
                'journey_points': points.order('-time'),
            })
        return context


class GetTravelTypes(generic_views.View):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        save_to_database()
        response = {}
        if 'travel_type' in kwargs:
            # If travel type exists return only average co2 produce
            travel_type = TravelType.all().filter('name', kwargs['travel_type'].capitalize())
            if travel_type.count() > 0:
                response = to_dict(travel_type.get())
        else:
            for travel_type in TravelType.all():
                response[travel_type.name] = travel_type.co2_exhausts

        logging.info('Getting travel types')
        return HttpResponse(json.dumps(response), content_type="application/json")

@require_http_methods('POST')
@csrf_exempt
def JourneyBatch(request):
    user = User.all().filter('facebook_id', request.session['facebook_id']).get()

    for point in json.loads(request.body):
        # Date sent
        date = datetime.fromtimestamp(int(point['date'])).replace(tzinfo=pytz.UTC)
        if 'journey' in point:
            if point['journey'] != 'Stop':
                journey = Journey(
                    user=user,
                    travel_type=TravelType.all().filter('name', point['journey']).get(),
                    start_date=date
                )
                journey.put()
                logging.info('Journey started for ' + point['journey'])
                user.active_trip_id = journey.key().id()
            else:
                logging.info('Journey ended')
                journey = Journey.get_by_id(user.active_trip_id)
                journey.end_date = date
                journey.put()
                # Remove active trip
                user.active_trip_id = -1
            user.put()

        elif 'distance' in point and user.active_trip_id != -1:
            # Get the current journey and save point
            Point(
                journey=Journey.get_by_id(user.active_trip_id),
                latitude=float(point['x']),
                longitude=float(point['y']),
                speed=float(point['speed']),
                time=date,
                distance=float(point['distance'])
            ).put()
    return HttpResponse()