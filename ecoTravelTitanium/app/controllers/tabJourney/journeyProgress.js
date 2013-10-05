var sendDataInterval, stopWatchInterval, getLocationInterval;
var last_position_latitude, last_position_longitude;
var distance, distance_in_meters;
var travelType;
function onFocus() {
	distance = 0.0;
	last_position_latitude = null;
	last_position_longitude = null;
	distance_in_meters = true;
	
	travelType = Ti.App.Properties.getString('travelType');
	// Replace null with empty string
	if (Ti.App.Properties.getString('jsonBatch') == null) Ti.App.Properties.setString('jsonBatch', '');
	Ti.App.Properties.setString('jsonBatch', ''); // TODO: Delete this when done debugging
	// Mark start of journey
	var start_journey_json = '{"journey": "' + travelType + '", "date":"' + (new Date().getTime() / 1000).toFixed(0)  + '"},';
	Ti.App.Properties.setString('jsonBatch', Ti.App.Properties.getString('jsonBatch') + start_journey_json);
	
	// Start following
	stopWatchInterval = setInterval(Stopwatch, 100);
	getLocationInterval = setInterval(getLocation, Alloy.CFG.checkLocationSeconds * 1000);
	// Send current batch every X seconds
	sendDataInterval = setInterval(sendData, Alloy.CFG.send_data_seconds * 1000);
}

// --------------------------- User position handling ---------------------------
function getLocation () {
	Titanium.Geolocation.getCurrentPosition(function(e){
		if (e.error) {
			Ti.API.error('Error: ' + e.error);
		} else {
			var current_longitude = e.coords.longitude;
			var current_latitude = e.coords.latitude;
			// Is this the first point in trip
			if (last_position_latitude == null) {
				last_position_latitude = current_latitude;
				last_position_longitude = current_longitude;
				return;
			}
			
			// Are coordiantes the same as before
			if (Number(last_position_latitude) === Number(current_latitude) && Number(last_position_longitude) === Number(current_longitude)) {
				return;
			}

			var new_distance = getDistanceInKm(last_position_latitude, last_position_longitude, current_latitude, current_longitude);
			// If distance beetween points is less than 10 meters
			if (new_distance < 0.010) {
				return;
			}
			
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
			var position = '{"x":' + current_latitude + ',"y":' + current_longitude + ',"speed":' + e.coords.speed + ',"date":' + (e.coords.timestamp / 1000).toFixed(0) + ',"distance":' + new_distance + '},';
			Ti.App.Properties.setString('jsonBatch', Ti.App.Properties.getString('jsonBatch') + position);

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
		var wifi = Titanium.Network.networkType == Titanium.Network.NETWORK_WIFI;
		var onlyWifi = Ti.App.Properties.getBool('onlyWifi');
		if (wifi == true && onlyWifi == true) {
			Ti.API.TFinfo('Only wifi enabled');
		} else {
			var data = Ti.App.Properties.getString('jsonBatch');
			Ti.App.Properties.setString('jsonBatch', '');
			// If there is no data break
			if (data == '') return;
			// Else send data to server
			var json_data = '[' + data.slice(0, -1) + ']';
			Alloy.Globals.XHR.post(Alloy.CFG.site_batch_url, json_data, function(e) {
				Ti.API.TFinfo('Data sent: ' + json_data);
			}, function(e) {
				// If error save data back
				Ti.App.Properties.setString('jsonBatch', data + Ti.App.Properties.getString('jsonBatch'));
				Ti.API.error('Data not send' + json_data);
				Ti.API.error(e);
			});
		}

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
	clearInterval(getLocationInterval);
	clearInterval(sendDataInterval);
	clearInterval(stopWatchInterval);
	// Mark end of journey
	var end_journey_json = '{ "journey": "Stop", "date":"' + (new Date().getTime() / 1000).toFixed(0)  + '"},';
	Ti.App.Properties.setString('jsonBatch', Ti.App.Properties.getString('jsonBatch') + end_journey_json);
	sendData();
	
	// Open end journey page
	var endJourney = Alloy.createController('tabJourney/endJourney', {
		'travelType' : travelType,
		'journeyTime': $.journeyTime.text, 
		'journeyDistance': distance
	}).getView();
	endJourney.open({
		modal : true,
		modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
	});
	$.journeyProgress.close();	
}
