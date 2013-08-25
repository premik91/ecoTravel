var site_url = 'http://78.47.47.172:8080/';
var send_when_distance = 0.1;   // Send data every 100 meters
var R = 6371;                   // Radius of the earth in km

$.ajaxSetup({
    xhrFields: { withCredentials: true }
});
document.addEventListener("resume", onResume, false);
document.addEventListener("pause", onPause, false);
document.addEventListener("deviceready", onDeviceReady, false); // When PhoneGap is ready

function onResume() { console.log('RESUME'); }
function onPause() { window.localStorage['time'] = (new Date).getMilliseconds(); console.log('PAUSE'); }
function onDeviceReady () {
    // Initialize the Facebook SDK
    FB.init({ appId: '551670011523207', nativeInterface: CDV.FB, useCachedDialogs: false });

    FB.getLoginStatus(function () {
        //Fetch user's data here
        FB.api('/me', function(response) {
            window.localStorage['user-logged-in'] = true;
        });
    });

    if (window.localStorage['user-logged-in']) {
        getData('points_co2');
        getData('user');
        getData('friends');
    } else if ($('#login-page').length == 0) document.location = 'index.html';
}

/*-------------------------------- INDEX.html --------------------------------*/
$( document ).delegate('#login-page', 'pageshow', function () {
    $('#facebook-button').click(function () {
        FB.login(function (response) {
                if (response.authResponse.session_key) {
//                    $.post(site_url + 'user/login/' + response.authResponse.accessToken + '/', function (data) {
//                        alert(data);
//                    }).fail(function(data) {
//                        alert(data.error);
//                    });
                    $.ajax({
                        url: site_url + 'user/login/' + response.authResponse.accessToken + '/',
                        error: function (xhr, status, error) {
                        }
                    });

                    document.location = 'home.html';
                } else $('#information > li:first-child').text('Vpisati se je potrebno preko vašega Facebook računa.');
            }, { scope: 'email' }
        );
        return false;
    });
});

/*-------------------------------- HOME.html --------------------------------*/
$( document ).delegate('#home-page', 'pageshow', function () {
    // 100% height - ("header height" + "footer height")
    var height = $(window).height() -
        $(document).find('[data-role="header"]').height() -
        $(document).find('[data-role="footer"]').height();
    $(document).height(height).find('[data-role="content"]').height(height);

    /*------------ FUNCTIONS ------------*/
    // Start new journey
    $('#choose-type-of-transport li').click(function () {
        var transport_type = $(this).attr('data-transport-type');
        window.localStorage['transport-type'] = transport_type;
        sendData( '{"journey": "' + transport_type + '"},' );
        window.localStorage['time'] = '';
        document.location = 'journey.html';
    });

    $( window ).on( "orientationchange", onOrientationChange);
    function onOrientationChange () {
        location.reload();
    }
});

/*-------------------------------- USER.html --------------------------------*/
$( document ).delegate("#user-page", "pagebeforecreate", function () {
    var user = getData('user');
    if (user) {
        $('#user-name').text(user.name);
        $('.points > span:first-child').text(user.saved.toFixed(2));
        $('#details-list > li:first-child').text('Prepotoval si ' + user.km.toFixed(2) + ' kilometrov');

        // Fill transport list for user
        var is_first = true;
        $.each(user.modes, function(key, mode) {
            document.getElementById('user-transport-list').innerHTML +=
                '<li>' +
                    '<img src="images/transports/' + key + '.png">' +
                    '<h2>' + getCorrectTransportType(key) + '</h2>' +
                    '<p>Naredil si ' + mode.km.toFixed(2) +
                    ' kilometrov, kar ti je prineslo ' + mode.saved.toFixed(2) + ' točk' +
                    '</p>' +
                '</li>';
            // Compute the % of most used transport
            if (is_first) {
                $('#details-list > li:last-child').text('Od tega je bilo ' + ((user.km > 0) ? mode.km * 100 / user.km : 0).toFixed() + '% ' + getCorrectTransportType(key));
                is_first = false;
            }
        });
    }
});

/*-------------------------------- FRIENDS.html --------------------------------*/
$( document ).delegate("#friends-page", "pagebeforecreate", function () {
    var friends = getData('friends');
    if (friends) {
        // Fill transport list for friend
        document.getElementById('friend-list').innerHTML = '';
        for (var i = 0; i < friends.length; i++) {
            document.getElementById('friend-list').innerHTML +=
                '<li class="friend"><a href="#">' + friends[i][0] + '<span class="place"></span></a></li>';
        }
    }

    /*------------ FUNCTIONS ------------*/
    // Back to friends list
    $('#back-button').click( function () {
        $('#friend-list').show();
        $('#back-button, #friend-page').hide();
    });

    // Content -> Show the selected friend info
    $('#friend-list').on("click", "li.friend", function () {
        var index = $(this).index();
        var temp_index = index;
        // Subtract indexes of A-Z
        $('#friend-list li').each(function (i) {
            if (i < temp_index && $(this).attr('data-role') == 'list-divider') index --;
        });

        // Set values for chosen friend
        $('#overall').text(friends[index][0] + ' ima trenutno ' + friends[index][1].toFixed(2) +' točk');
        document.getElementById('transport').innerHTML =
            '<li data-role="list-divider">Uporabljeni transporti</li>';
        $.each(friends[index][2], function(key, value) {
            document.getElementById('transport').innerHTML +=
                '<li>' +
                    '<img src="images/transports/' + key + '.png">' +
                    '<p>' + 'Naredil je ' + value.toFixed(2) + ' kilometrov</p>' +
                '</li>';
        });
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
        $.post(site_url + 'user/contact/',
        '[' +
            '{subject: ' + subject + '},' +
            '{message: ' + message + '}' +
        ']');
    });

    $('#facebook-button').click(function () {
        FB.logout(function(response) {
            $.post( site_url + 'user/logout/', function(data) {} );
            document.location = 'index.html';
        });
    });
});

/*-------------------------------- JOURNEY.html --------------------------------*/
$( document ).delegate("#journey-page", "pageshow", function () {
    window.localStorage['journey-data'] = '';
    var points_co2 = getData('points_co2');

    $('#type-of-transport').attr('src',
        $('#type-of-transport').attr('src').replace('__', window.localStorage['transport-type']));

    // Get position every 3 seconds and update time every 10 milliseconds
    var distance = 0, points = 0;
    var follow_id = setInterval(GetCurrentPosition, 3000), stopwatch_id = setInterval(Stopwatch, 100);

    // Stopwatch
    var milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
    function Stopwatch () {
        if (window.localStorage['time']) {
            var time = (new Date).getMilliseconds() - window.localStorage['time'];
            seconds += parseInt((time/1000)%60);
            minutes += parseInt((time/(1000*60))%60);
            hours += parseInt((time/(1000*60*60))%24);
            console.log(window.localStorage['time'] + '->time:'+hours+':'+minutes+':'+seconds);
            window.localStorage['time'] = '';
        }
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
            hours                               + ':' +
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds + ':' +
            (milliseconds == 0 ? '00' : milliseconds/10)
        );
    }

    function GetCurrentPosition () {
        var options = { enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(geoLocationSuccess, PhoneGapError, options);
    }

    var last_position_latitude,
        last_position_longitude,
        number_positions = 0,
        temp_distance = 0;

    function geoLocationSuccess (position) {
        number_positions++;
        // Ignore first results due to inaccuracy
        if (number_positions < 3) {
            last_position_latitude = position.coords.latitude;
            last_position_longitude = position.coords.longitude;
        } else if (last_position_latitude != position.coords.latitude || last_position_longitude != position.coords.longitude) {
            var temp = getDistanceInKm(
                last_position_latitude,
                last_position_longitude,
                position.coords.latitude,
                position.coords.longitude
            );
            window.localStorage['journey-data'] +=
                '{' +
                    '"x": '     + position.coords.latitude  + ',' +
                    '"y": '     + position.coords.longitude + ',' +
                    '"speed": ' + position.coords.speed     + ',' +
                    '"time": "'  + position.timestamp        + '",' +
                    '"km": '    + temp +
                '},';
            distance += temp;
            temp_distance += temp;
            // Set distance
            $('#current-distance-value').text(distance.toFixed(2));
            // Set points
            points = (points_co2['AVG'] - points_co2[window.localStorage['transport-type']]) * distance;
            $('#current-points-value').text(points.toFixed(2));
            // Save data
            last_position_latitude = position.coords.latitude;
            last_position_longitude = position.coords.longitude;
            // Send data
            if (temp_distance > send_when_distance) {
                temp_distance = 0;
                sendData( window.localStorage['journey-data'] );
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
        window.localStorage['distance'] =  distance.toFixed(2);
        window.localStorage['points'] = points;
        window.localStorage['time-in-minutes'] = hours * 60 + minutes + seconds / 60;
        sendData( '{ "journey": "Stop" },' );
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
        var distance = parseInt(window.localStorage['distance']);
        var points = parseInt(window.localStorage['points']);
        var time = parseInt(window.localStorage['time-in-minutes']);
        // Old data
        var old_distance = user.km;
        var old_points = user.saved;
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
    if (type == 'user') temp = 'user/summary/';
    else if (type == 'friends') temp = 'user/friends/';
    else if (type == 'points_co2') temp = 'api/modes/';
    else return;
    $.get(site_url + temp, function (data) {
        window.localStorage[type.toLowerCase()] = data;
    });
    try {
        temp = jQuery.parseJSON(window.localStorage[type.toLowerCase()]);
    } catch (Exception) {
        temp = '';
    }
    return temp;
}

function sendData (data) {
    if (window.localStorage.getItem('data')) data = window.localStorage['data'] + data;
    if (navigator.onLine) {
        $.post(
            site_url + 'trip/batch/',
            { data: '[' + data.slice(0,-1) + ']' },
            function () {
                window.localStorage['data'] = '';
            }
        );
    } else window.localStorage['data'] = data;
}

function PhoneGapError (error) { console.log('ERROR: code: ' + error.code + '\n' + 'message: ' + error.message + '\n'); }

function getCorrectTransportType (item) {
    switch (item) {
        case 'walk':
            item = 'Peš';
            break;
        case 'bicycle':
            item = 'Kolo';
            break;
        case 'bus':
            item = 'Avtobus';
            break;
        case 'train':
            item = 'Vlak';
            break;
        case 'car':
            item = 'Avtomobil';
            break;
        case 'bike':
            item = 'Motor';
    }
    return item;
}