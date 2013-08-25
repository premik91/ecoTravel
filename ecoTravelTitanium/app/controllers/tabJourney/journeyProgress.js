var args = arguments[0] || {};
// Replace null with empty string
if (Ti.App.Properties.getString('positions') == null) Ti.App.Properties.setString('positions', '');
startFollow();
// Send current batch every X seconds
var send_data_interval = setInterval(sendData, Alloy.CFG.send_data_seconds * 1000);

// --------------------------- User position handling ---------------------------
var last_position_latitude, last_position_longitude;
var distance = 0.0;
var distance_in_meters = true;
function startFollow() {
	setInterval(Stopwatch, 100);
	Ti.Geolocation.addEventListener('location', function(e) {
		if (e.error) {
			Ti.API.error('Error: ' + e.error);
		} else {
			var current_longitude = e.coords.longitude;
			var current_latitude = e.coords.latitude;
			if (last_position_latitude == null) {
				last_position_latitude = current_latitude;
				last_position_longitude = current_longitude;
				return;
			}

			var new_distance = getDistanceInKm(last_position_latitude, last_position_longitude, current_latitude, current_longitude);

			// Ti.API.info(e);
			distance += new_distance;
			if (distance_in_meters) {
				var meters = distance * 1000;
				$.journeyDistance.text = meters.toFixed(0) + ' meters';
				distance_in_meters = meters < 10000;
			} else {
				$.journeyDistance.text = distance.toFixed(2) + ' killometers';
			}

			var region = {
				latitude : current_latitude,
				longitude : current_longitude,
				animate : true,
				latitudeDelta : 0.001,
				longitudeDelta : 0.001
			};
			$.mapview.setLocation(region);

			// Save position to batch
			var position = '{"x":' + current_latitude + ',"y":' + current_longitude + ',"speed":' + e.coords.speed + ',"time":' + e.coords.timestamp + ',"km":' + new_distance + '},';
			Ti.App.Properties.setString('positions', Ti.App.Properties.getString('positions') + position);

			// Save last postion
			last_position_latitude = current_latitude;
			last_position_longitude = current_longitude;
		}
	});
}

// --------------------------- Main functions ---------------------------
function getDistanceInKm(lat1, lon1, lat2, lon2) {
	var dLat = deg2rad(lat2 - lat1);
	var dLon = deg2rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	// Distance in km
	return 6371 * c;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

// --------------------------- Send data to Server ---------------------------
function sendData() {
	if (Ti.Network.online == true) {
		var data = Ti.App.Properties.getString('positions');
		Ti.App.Properties.setString('positions', '');
		// If there is no data return
		if (data == '') return;
		// Else send data to server
		var json_data = '[' + data.slice(0, -1) + ']';
		Alloy.Globals.XHR.post(Alloy.CFG.site_batch_url, json_data, function(e) {
			Ti.API.info('Data sent: ' + json_data);
		}, function(e) {
			// If error save data back
			Ti.App.Properties.setString('positions', data + Ti.App.Properties.getString('positions'));
			Ti.API.error('Data not send' + json_data);
		});
	}
}

// --------------------------- Stopwatch ---------------------------
var milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
function Stopwatch() {
	milliseconds += 100;
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
	$.journeyTime.text = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + ':' + (milliseconds == 0 ? '00' : milliseconds / 10);
}

function endJourney() {
	clearInterval(send_data_interval);
	var endJourney = Alloy.createController('tabJourney/endJourney', {
		'vehicleType' : args.vehicleType,
		'journeyTime': $.journeyTime.text, 
		'journeyDistance': $.journeyDistance.text
	}).getView();
	$.journeyProgress.close();
	endJourney.open({
		modal : true,
		modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL
	});
}
