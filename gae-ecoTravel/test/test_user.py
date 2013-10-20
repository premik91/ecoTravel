from time import sleep
import time
import unittest
from ecoTravel.user.models import User
from ecoTravel.user.views import create_user_json
from libs import requests

facebook_token = 'CAACV9S8jfPIBAOa9vlyRnQ3bBUcjmrTkbs4kvH77AtMG6sVaTfZCukVp06alJZC2B04Gix7Qnadf9wagULRoDmZAYbBBkMIyoXUKewk6o7gT7i8s40KtAm85TTQ4SkOHkPWeG9zVWCTFRx3dcImkf2Gxwsobdmf4tTrZAZAKtSGbYsXxGjXRYCJ4x2i1i4B4ZD'
site_url = 'http://localhost:8080/'
# Variables
user = None


class Test(unittest.TestCase):
    def test_login(self):
        global user
        url = site_url + 'user/login/{0}'.format(facebook_token)
        requests.post(url)

        # Check if user has been registered
        user = User.all().filter('facebook_token', facebook_token).get()
        if user is not None:
            self.assertTrue(user.facebook_token == facebook_token)
        else:
            self.assertTrue(False)

    def test_trip(self):
        # Wait for first test to finish
        while user is None:
            sleep(0.2)
        user_json = create_user_json(user)

        current_latitude = current_longitude = speed = distance = 0.0
        position = '{{"x": {0}, "y":{1}, "speed":{2}, "date":{3}, "distance":{4} }},'.format(
            current_latitude,
            current_longitude,
            speed,
            time.time(),
            distance
        )
        print position
        # Start a new trip
        json_batch = '{{"journey": "car", "date":{0}}},'.format(time.time())
        print json_batch
        json_batch += '{ "journey": "Stop", "date":"' + str(time.time()) + '"},'
        self.assertTrue(len(user_json['travel_types']) == 0 and user.facebook_id == user_json['facebook_id'])


if __name__ == "__main__":
    unittest.main()