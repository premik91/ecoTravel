// https://github.com/viezel/TiSocial.Framework
// v 1.7.0
var args = arguments[0] || {};
var currentTransport = Alloy.Globals.FBUser.getTransportTypes()[args.travelType.toLowerCase()];
// Get CO2 saving per killometer
var savings = Alloy.Globals.FBUser.getTransportTypes()['AVG'] - currentTransport;
savings *= args.journeyDistance;

var resultsShare = 'I just saved {0} CO2 by {1} {2}km with ecoTravel. \n Hooray for alternative means of travel!'.format(
	savings,
	Ti.App.Properties.getString('travelType'),
	args.journeyDistance
);
// Show statistics
$.journeyTime.text = 'All travel time {0}'.format(args.journeyTime);
$.journeySavings.text = 'I just saved {0} CO2'.format(savings);
$.journeyDistance.text = 'I made {0} km'.format(args.journeyDistance);

function finishJourney() {
	$.endJourney.close();
}

if (Titanium.Platform.name == 'iPhone OS') {
	//iOS only module
	var Social = require('dk.napp.social');
	Ti.API.TFinfo("module is => " + Social);

	Ti.API.TFinfo('Facebook available: ' + Social.isFacebookSupported());
	Ti.API.TFinfo('Twitter available: ' + Social.isTwitterSupported());

	// find all Twitter accounts on this phone
	if (Social.isRequestTwitterSupported()) {//min iOS6 required
		var accounts = [];
		Social.addEventListener('accountList', function(e) {
			Ti.API.TFinfo('Accounts:');
			accounts = e.accounts;
			//accounts
			Ti.API.TFinfo(accounts);
		});

		Social.twitterAccountList();
	}

	$.shareBtn.addEventListener('click', function() {
		if (Social.isActivityViewSupported()) {//min iOS6 required
			Social.activityView({
				text : resultsShare,
				image : 'iphone/appicon.png',
				removeIcons : 'print,sms,contact,camera,weibo,copy'
			}
			// , [{
				// title : 'Open in Safari',
				// type : 'images/open.safari',
				// image : 'images/icons/safari.png'
			// }]
			);
		} else {
			//implement fallback sharing..
		}
	});
	
	// Add custom icons and actions
	// Social.addEventListener('customActivity', function(e) {
		// setTimeout(function() {
			// if (e.title == 'Open in Safari') {
				// Ti.Platform.openURL('http://www.google.com');
			// }
		// }, 500);
	// });
}