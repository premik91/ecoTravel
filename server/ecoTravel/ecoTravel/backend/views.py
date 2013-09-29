from datetime import datetime
import json
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core import serializers
from django.db.models import Count, Min, Sum, Avg
from django.http import HttpResponse
from django.views import generic as generic_views
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import requests
from ecoTravel.backend.models import UserProfile, Journey, TravelType, Point
import pytz
from ecoTravel.context_processors import travel_types, save_to_database


class GetTravelTypes(generic_views.View):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        save_to_database()
        response = {}
        if 'travel_type' in kwargs:
            # If travel type exists return only average co2 produce
            travel_type = travel_types.get(kwargs['travel_type'])
            if travel_type is not None:
                response = travel_types.get(kwargs['travel_type'])
        else:
            response = json.dumps(travel_types)
        print 'Getting travel types'
        return HttpResponse(response, content_type="application/json")


class GetUserFriends(generic_views.View):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        user_profile = UserProfile.objects.get(user=request.user)
        url = 'https://graph.facebook.com/me/friends?access_token={0}'.format(user_profile.facebook_token)
        friends_json = requests.get(url + '&fields=first_name,last_name').json()['data']
        friends = []
        for friend in friends_json:
            if UserProfile.objects.filter(facebook_id=friend['id']).exists():
                # Create user json and save friend to list
                friends.append(create_user_json(UserProfile.objects.get(facebook_id=friend['id'])))
        return HttpResponse(json.dumps(friends), content_type="application/json")


class GetUserSummary(generic_views.View):
    def get(self, request, *args, **kwargs):
        """
        :return: json
        """
        user_profile = UserProfile.objects.get(user=request.user)
        user_json = create_user_json(user_profile)
        return HttpResponse(json.dumps(user_json), content_type="application/json")


@require_http_methods('POST')
@csrf_exempt
def UserLogin(request, facebook_token):
    """
    :param request: request object
    :param facebook_token: user facebook token
    :return: json with user data
    """
    # Get user data
    url = 'https://graph.facebook.com/me?access_token={0}'.format(facebook_token)
    profile_json = requests.get(url + '&fields=email,first_name,last_name').json()
    # Save or get user from the database
    if not UserProfile.objects.filter(facebook_id=profile_json['id']).exists():
        print 'New user'
        # Username == email, password == facebook_id
        user = User(
            first_name=profile_json['first_name'],
            last_name=profile_json['last_name'],
            username=profile_json['email'],
            email=profile_json['email']
        )
        user.set_password(profile_json['id'])
        user.save()
        # Always use user_profile for accessing user
        user_profile = UserProfile(
            user=user,
            facebook_token=facebook_token,
            facebook_id=profile_json['id']
        )
        user_profile.save()
    else:
        print 'User exists'
        user_profile = UserProfile.objects.get(facebook_id=profile_json['id'])
        print user_profile.user.email

    # Login user to create a new session
    if not request.user.is_authenticated():
        user = authenticate(username=user_profile.user.email, password=user_profile.facebook_id)
        login(request, user)
        print 'User has logged in'
    else:
        print 'User is logged in'
    return HttpResponse(json.dumps(user_profile.facebook_id))


@require_http_methods('POST')
@csrf_exempt
def TripBatch(request):
    user_profile = UserProfile.objects.get(user=request.user)
    for point in json.loads(request.body):
        # Start new journey
        if 'journey' in point:
            if point['journey'] == 'Stop':
                print 'Journey ended'
                journey = Journey.objects.get(id=user_profile.active_trip_id)
                # End date
                date = datetime.fromtimestamp(int(point['date']))
                date = date.replace(tzinfo=pytz.UTC)
                journey.end_date = date
                journey.save()
                # Remove active trip
                user_profile.active_trip_id = -1
            else:
                # Start date
                date = datetime.fromtimestamp(int(point['date']))
                date = date.replace(tzinfo=pytz.UTC)
                journey = Journey(
                    user_profile=user_profile,
                    travel_type=TravelType.objects.get(name=point['journey']),
                    start_date=date
                )
                journey.save()
                print 'Journey started for ' + point['journey']
                user_profile.active_trip_id = journey.id
            user_profile.save()
        elif 'distance' in point and user_profile.active_trip_id > -1:
            # Get the current journey and save point
            date = datetime.fromtimestamp(int(point['date']))
            date = date.replace(tzinfo=pytz.UTC)
            Point(
                journey=Journey.objects.get(id=user_profile.active_trip_id),
                latitude=float(point['x']),
                longitude=float(point['y']),
                speed=float(point['speed']),
                time=date,
                distance=float(point['distance'])
            ).save()
    return HttpResponse()


# ---------------------------- Functions ----------------------------
def create_user_json(user_profile):
    """
    :param user_profile: User profile
    :return: json
    """
    journeys = Journey.objects.filter(user_profile=user_profile)
    user_travel_types = {}

    # Compute total distances for each travel type
    for journey in journeys:
        # Get all points for each journey
        points = Point.objects.filter(journey=journey)
        if points:
            # Saved distance made on a journey
            if journey.travel_type not in user_travel_types:
                user_travel_types[journey.travel_type.name] = {
                    'distance': 0.0,
                    'total': journey.travel_type.co2_exhausts,
                    'saved': TravelType.objects.get(name='Average').co2_exhausts - journey.travel_type.co2_exhausts
                }
            user_travel_types[journey.travel_type.name]['distance'] += round(float(points.aggregate(Sum('distance'))['distance__sum']), 4)

    # Save all data
    total_co2 = 0.0
    total_saved = 0.0
    total_distance = 0.0
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
        'facebook_id': user_profile.facebook_id,
        'name': '{0} {1}'.format(user_profile.user.first_name, user_profile.user.last_name),
        'total': total_co2,
        'saved': total_saved,
        'distance': round(total_distance, 3),
        'travel_types': user_travel_types
    }
    print user_json
    return user_json