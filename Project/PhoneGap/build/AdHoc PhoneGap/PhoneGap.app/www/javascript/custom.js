var site_url = 'http://192.168.10.111:8080/';
// Send data every 100 meters
var send_when_distance = 0.1;
var R = 6371; // Radius of the earth in km

// PhoneGap is ready
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady () {
    // Initialize the Facebook SDK
    FB.init({ appId: '551670011523207', nativeInterface: CDV.FB, useCachedDialogs: false });

    FB.getLoginStatus(function () {
        //Fetch user's data here
        FB.api('/me', function(response) {
            window.localStorage.setItem('user-logged-in', true);
        });
    });

    var user_logged_in = window.localStorage.getItem('user-logged-in');
    if (user_logged_in) {
        getData('points_co2');
        getData('user');
        getData('friends');
    } else if ($('#login-page').length == 0) document.location = 'index.html';
}

/*-------------------------------- INDEX.html --------------------------------*/
$( document ).delegate('#login-page', 'pageshow', function () {
    $('#facebook-button').click(function () {
        FB.login(
            function (response) {
                if (response.authResponse.session_key) {
                    $.post(
                        site_url + 'user/login/' + response.authResponse.accessToken,
                        function(data) {
                            console.log('DATA-----------: ' + data);
                        }
                    );
                    document.location = 'home.html';
                } else {
                    $('#information > li:first-child').text('Vpisati se je potrebno preko vašega Facebook računa.');
                }
            },
            { scope: 'email' }
        );
        return false;
    });
});

/*-------------------------------- HOME.html --------------------------------*/
// 100% height - ("header height" + "footer height")
$( document ).delegate('#home-page', 'pageshow', function () {
    var height = $(window).height() -
        $(document).find('[data-role="header"]').height() - $(document).find('[data-role="footer"]').height();
    $(document).height(height).find('[data-role="content"]').height(height);

    /*------------ FUNCTIONS ------------*/
    // Start new journey
    $('#choose-type-of-transport li').click(function () {
        var transport_type = $(this).attr('data-transport-type');
        window.localStorage.setItem('transport-type', transport_type);
        sendData( '{journey: ' + transport_type + '},' );
        document.location = 'journey.html';
    });
});
$( document ).delegate("#home-page", "pagebeforecreate", function () {
    $( window ).on( "orientationchange", onOrientationChange);
    function onOrientationChange () {
        var height = $(window).height() - $(document).find('[data-role="header"]').height() - $(document).find('[data-role="footer"]').height();
        $(document).height(height).find('[data-role="content"]').height(height);
    }
});
/*-------------------------------- USER.html --------------------------------*/
$( document ).delegate("#user-page", "pagebeforecreate", function () {
    var user = getData('user');
    if (user) {
        $('.points > span:first-child').text(user.points);
        $('#details-list > li:first-child').text('Prepotoval si ' + user.distance + ' kilometrov');
        // Compute the % of most used transport
        $('#details-list > li:last-child').text('Od tega je bilo ' + ((user.distance > 0) ? user.transport[0].kilometers * 100 / user.distance : 0).toFixed() + '% ' + user.transport[0].type);
        // Fill transport list for user
        for (var i = 0; i < user.transport.length; i++) {
            document.getElementById('user-transport-list').innerHTML +=
                '<li>' +
                    '<img src="images/transports/' + user.transport[i].type + '.png">' +
                    '<h2>' + capitalize(user.transport[i].type) + '</h2>' +
                    '<p>Naredil si ' + user.transport[i].kilometers +
                    ' kilometrov, kar ti je prineslo ' + user.transport[i].points + ' točk' +
                    '</p>' +
                '</li>';
        }
    }
});

/*-------------------------------- FRIENDS.html --------------------------------*/
$( document ).delegate("#friends-page", "pagebeforecreate", function () {
    var friends = getData('friends');
    if (friends) {
        // Fill transport list for user
        document.getElementById('friend-list').innerHTML = '';
        for (var i = 0; i < friends.length; i++) {
            document.getElementById('friend-list').innerHTML +=
                '<li class="friend"><a href="#">' + friends[i].name + '<span class="place">' + friends[i].place + '.</span></a></li>';
        }
    }
    /*------------ FUNCTIONS ------------*/
    // Back to friends list
    $('#back-button').click( function () {
        $('#friend-list').show();
        $('#back-button, #friend-page').hide();
    });

    // Content -> Show the selected friends info
    $('#friend-list').on("click", "li.friend", function () {
        var index = $(this).index();
        var temp_index = index;
        // Subtract indexes of A-Z
        $('#friend-list li').each(function (i) {
            if (i < temp_index && $(this).attr('data-role') == 'list-divider') index --;
        });

        // Set values for chosen friend
        $('#overall').text(friends[index].name + ' ima trenutno ' + friends[index].points +' točk');
        document.getElementById('transport').innerHTML =
            '<li data-role="list-divider">Uporabljeni transporti</li>';
        for (var i = 0; i < friends[index].transport.length; i ++) {
            document.getElementById('transport').innerHTML +=
                '<li>' +
                    '<img src="images/transports/' + friends[index].transport[i].type + '.png">' +
                    '<p>' + 'Naredil je ' + friends[index].transport[i].kilometers + ' kilometrov</p>' +
                '</li>';
        }
        $('#transport').listview('refresh');
        $('#friend-list').hide();
        $('#back-button, #friend-page').show();
    });
});

/*-------------------------------- SETTINGS.html --------------------------------*/
$( document ).delegate("#settings-page", "pageshow", function () {
    $('#settings-page').submit(function () {
        var subject = $('#subject').val();
        var message = $('#message').val();
        $.post(site_url + 'api/send/mail/',
        '[' +
            '{subject: ' + subject + '},' +
            '{message: ' + message + '}' +
        ']');
    });

    $('#facebook-button').click(function () {
        FB.logout(function(response) { document.location = 'index.html'; });
    });
});

/*-------------------------------- JOURNEY.html --------------------------------*/
$( document ).delegate("#journey-page", "pageshow", function () {
    var points_co2 = getData('points_co2');
    $('#type-of-transport').attr('src',
        $('#type-of-transport').attr('src').replace('__', window.localStorage.getItem('transport-type')));

    // Get position every 3 seconds and update time every 10 milliseconds
    var distance = 0, points = 0;
    var follow_id = setInterval(GetCurrentPosition, 3000), stopwatch_id = setInterval(Stopwatch, 100);

    // Stopwatch
    var milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
    function Stopwatch () {
        milliseconds+=100;
        if (milliseconds == 1000) {
            seconds++;
            milliseconds = 0;
        }
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }
        $('#stopwatch').text(
            hours       + ':' +
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds + ':' +
            (milliseconds == 0 ? '00' : milliseconds/10)
        );
    }

    function GetCurrentPosition () {
        var options = { enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(geoLocationSuccess, PhoneGapError, options);
    }

    // onSuccess Geolocation
    var last_position_latitude, last_position_longitude, number_positions = 0;
    var temp_distance = 0;
    function geoLocationSuccess (position) {
        number_positions ++;
        // Ignore first results due to inaccuracy
        if (number_positions < 3) {
            last_position_latitude = position.coords.latitude;
            last_position_longitude = position.coords.longitude;
            return;
        }
        if (last_position_latitude != position.coords.latitude || last_position_longitude != position.coords.longitude) {
            var temp = getDistanceInKm(
                last_position_latitude,
                last_position_longitude,
                position.coords.latitude,
                position.coords.longitude
            );
            distance += temp;
            temp_distance += temp;
            // Set distance
            $('#current-distance-value').text(distance.toFixed(2));
            // Set points
            points = (points_co2['AVG'] - points_co2[window.localStorage.getItem('transport-type')]) * distance;
            $('#current-points-value').text(points.toFixed(2));
            // Save data
            last_position_latitude = position.coords.latitude;
            last_position_longitude = position.coords.longitude;
            window.localStorage['journey-data'] +=
                '{' +
                    position.coords.latitude + ',' +
                    position.coords.longitude + ',' +
                    position.coords.speed + ',' +
                    position.timestamp +
                '},';
            // Send data
            if (temp_distance > send_when_distance) {
                temp_distance = 0;
                sendData({ journey: window.localStorage['journey-data'] });
                window.localStorage['journey-data'] = '';
            }
        }
    }
    /*------------ FUNCTIONS ------------*/
    $('#pause-journey').click(function () {
        if ($('#pause-journey-text').text() == 'Pauziraj pot') {
            window.clearInterval(follow_id);
            window.clearInterval(stopwatch_id);
            $('#pause-journey-text').text('Nadaljuj pot');
        } else {
            follow_id = setInterval(GetCurrentPosition, 3000);
            stopwatch_id = setInterval(Stopwatch, 10);
            $('#pause-journey-text').text('Pauziraj pot');
        }
    });

    $('#end-journey').click(function () {
        window.localStorage.setItem('distance', distance.toFixed(2));
        window.localStorage.setItem('points', points);
        window.localStorage.setItem('time-in-minutes', hours * 60 + minutes + seconds / 60);
        sendData( '{ journey: "Stop" },' );
        document.location = 'end_journey.html';
    });
});

function getDistanceInKm (lat1, lon1, lat2, lon2) {
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

function deg2rad (deg) {
    return deg * (Math.PI / 180)
}

/*-------------------------------- END_JOURNEY.html --------------------------------*/
$( document ).delegate("#end-journey-page", "pagebeforecreate", function () {
    var user = getData('user');
    if (user) {
        // New data
        var distance = parseInt(window.localStorage.getItem('distance'));
        var points = parseInt(window.localStorage.getItem('points'));
        var time = parseInt(window.localStorage.getItem('time-in-minutes'));
        // Old data
        var old_distance = user.distance;
        var old_points = user.points;
        // Content
        $('#time-of-travel').text(time);
        $('#points-earned').text(points.toFixed(2));
        $('#all-points').text(old_points + points);
        $('#distance-made').text(distance);
        $('#all-distance').text(old_distance + distance);
        $('#earth-radius').text(((old_distance + distance) / R).toFixed(3));
    }
});

function getData (type) {
    var temp = '';
    console.log('DATA TYPE: ' + type +', SITE: ' + site_url + temp);
    if (type == 'user') temp = 'user/summary/';
    else if (type == 'friends') temp = 'user/friends/';
    else if (type == 'points_co2') temp = 'api/modes/'
    else return;
    $.get(site_url + temp, function (data) {
        console.log(data);
        temp = data;
    });
    if (navigator.onLine)  window.localStorage.setItem(type.toLowerCase(), temp);

}

function sendData (data) {
    data = window.localStorage.getItem('data') + data;
    if (navigator.onLine) {
        $.post(
            site_url + 'api/send/',
            {
                data: '[' + data.slice(0,-1) + ']'
            }
        );
    } else {
        window.localStorage.setItem('data', data);
    }
}

function PhoneGapError (error) { console.log('ERROR: code: ' + error.code + '\n' + 'message: ' + error.message + '\n'); }

function capitalize (s) {
    if (s == 'pes') s = 'peš';
    return s[0].toUpperCase() + s.slice(1);
}

$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});