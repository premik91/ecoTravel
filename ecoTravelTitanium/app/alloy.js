// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
// Testflight
Alloy.Globals.TF = require('dk.napp.testflight');
Alloy.Globals.TF.takeOff(Alloy.CFG.TestFlightToken, true);

Ti.API.TFinfo = function(str) {
	Ti.API.info(str);
	if (str.toString) {
		Alloy.Globals.TF.log(str.toString());
	}
};


// Message to display on app request to monitor users location
Ti.Geolocation.purpose = 'Determine Current Location and to follow your journey';
// iOS location accuracy
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
// The minimum change of position (in meters) before a location event is fired
Ti.Geolocation.distanceFilter = 10;
// The minium change of heading (in degrees) before a heading event is fired
// Ti.Geolocation.headingFilter = 10;

Alloy.Globals.FBUser = require('FacebookUser');
Alloy.Globals.XHR = new (require('xhr'));
Alloy.Globals.CLS = require('customListSearch');

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

// User settings
if (Ti.App.Properties.getString('onlyWifi') == null)
	Ti.App.Properties.setBool('onlyWifi', false);
var onlyWifi = Ti.App.Properties.getBool('onlyWifi');
Alloy.Globals.onlyWifi = onlyWifi;

// System settings
Alloy.Globals.screenSize = ((Ti.Platform.displayCaps.density == 'high')? ((Ti.Platform.displayCaps.platformHeight == 480)?'iPhone4':'iPhone5'):'iPhone3');