import json
import logging
from datetime import datetime

from django.http import HttpResponse
from django.views import generic as generic_views
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from google.appengine.ext import db
from google.appengine.ext.db import to_dict

from ecoTravel.backend.models import TravelType, User, Journey, Point
from ecoTravel.context_processors import save_to_database
from libs import requests, pytz


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


class GetUserFriends(generic_views.View):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        user = User.all().filter('facebook_id', request.session['facebook_id']).get()
        url = 'https://graph.facebook.com/me/friends?access_token={0}'.format(user.facebook_token)
        friends_json = requests.get(url + '&fields=first_name,last_name').json()['data']
        friends = []
        for friend in friends_json:
            if User.all().filter('facebook_id', friend['id']).count() > 0:
                # Create user json and save friend to list
                friend = User.all().filter('facebook_id', friend['id']).get()
                friend = create_user_json(friend)
                friends.append(friend)
        return HttpResponse(json.dumps(friends), content_type="application/json")


class GetUserSummary(generic_views.View):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        # for point in Point.all():
        #     db.delete(point.key())
        # for journey in Journey.all():
        #     db.delete(journey.key())
        # del request.session['facebook_id']
        user = User.all().filter('facebook_id', request.session['facebook_id']).get()
        user_json = create_user_json(user)
        return HttpResponse(json.dumps(user_json), content_type="application/json")


@require_http_methods('POST')
@csrf_exempt
def UserLogin(request, facebook_token):
    """
    :param request: request object
    :param facebook_token: user facebook token
    :return: json with user data
    """
    # Get and save user data
    url = 'https://graph.facebook.com/me?access_token={0}'.format(facebook_token)
    profile_json = requests.get(url + '&fields=email,first_name,last_name').json()
    # Is user already logged in?
    if not 'facebook_id' in request.session:
        user = User.all().filter('email', profile_json['email'])
        if not user.count() > 0:
            user = User(
                first_name=profile_json['first_name'],
                last_name=profile_json['last_name'],
                email=profile_json['email'],
                facebook_token=facebook_token,
                facebook_id=profile_json['id']
            )
            user.put()
            logging.info('New user with facebook id: {0}'.format(user.facebook_id))
        else:
            user = user.get()
            logging.info('User logged in with facebook id: {0}'.format(user.facebook_id))
        request.session['facebook_id'] = user.facebook_id
    else:
        logging.info('User already logged in with facebook id: {0}'.format(request.session['facebook_id']))
    return HttpResponse(json.dumps(request.session['facebook_id']))


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


# ---------------------------- Functions ----------------------------
def create_user_json(user):
    """
    :param user: User
    :return: json
    """
    create_journey_distances(user)
    user_travel_types = {}
    # Compute total distances for each travel type
    for journey in Journey.all().filter('user', user):
        # Get all points for each journey
        points = Point.all().filter('journey', journey)
        if points.count() > 0:
            # Saved distance made on a journey
            if journey.travel_type.name not in user_travel_types:
                user_travel_types[journey.travel_type.name] = {
                    'distance': 0.0,
                    'total': journey.travel_type.co2_exhausts,
                    'saved': TravelType.all().filter('name', 'Average').get().co2_exhausts - journey.travel_type.co2_exhausts
                }
            user_travel_types[journey.travel_type.name]['distance'] += round(journey.distance, 4)

    # Save all data
    total_co2 = total_saved = total_distance = 0.0
    for travel_type in user_travel_types:
        # For each travel type
        travel_type = user_travel_types[travel_type]
        distance = travel_type['distance']
        travel_type['total'] = round(travel_type['total'] * distance, 4)
        travel_type['saved'] = round(travel_type['saved'] * distance, 4)

        # Total
        total_distance += distance
        total_saved += travel_type['saved']
        total_co2 += travel_type['total']

    # Create json
    user_json = {
        'facebook_id': user.facebook_id,
        'name': '{0} {1}'.format(user.first_name, user.last_name),
        'total': total_co2,
        'saved': round(total_saved, 3),
        'distance': round(total_distance, 3),
        'travel_types': user_travel_types
    }
    return user_json


def create_journey_distances(user):
    for journey in Journey.all().filter('distance', 0.0).filter('user', user):
        points = Point.all().filter('journey', journey)
        journey.distance = sum(point.distance for point in points) if points.count() > 0 else 0.000001
        journey.put()
