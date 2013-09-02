// https://github.com/viezel/TiSocial.Framework
// v 1.7.0

var args = arguments[0] || {};
// Show statistics
$.journeyTime.text = args.journeyTime;
$.journeyPoints.text = args.journeyDistance;
$.journeyDistance.text = args.journeyDistance;
function finishJourney() {
	// TODO: It should return to home view
	$.endJourney.close();
}

var shareBtn = Ti.UI.createButton({
	width : 200,
	height : 35,
	top : 15,
	title : "Share Results"
});
$.mainView.add(shareBtn);

if (Titanium.Platform.name == 'iPhone OS') {
	//iOS only module
	var Social = require('dk.napp.social');
	Ti.API.info("module is => " + Social);

	Ti.API.info("Facebook available: " + Social.isFacebookSupported());
	Ti.API.info("Twitter available: " + Social.isTwitterSupported());

	// find all Twitter accounts on this phone
	if (Social.isRequestTwitterSupported()) {//min iOS6 required
		var accounts = [];
		Social.addEventListener("accountList", function(e) {
			Ti.API.info("Accounts:");
			accounts = e.accounts;
			//accounts
			Ti.API.info(accounts);
		});

		Social.twitterAccountList();
	}

	shareBtn.addEventListener("click", function() {
		if (Social.isActivityViewSupported()) {//min iOS6 required
			Social.activityView({
				text : "share like a king!",
				image : "images/pin.png",
				removeIcons : "print,sms,copy,contact,camera,weibo"
			}, [{
				title : "Open in Safari",
				type : "images/open.safari",
				image : "images/safari.png"
			}]);
		} else {
			//implement fallback sharing..
		}
	});

	Social.addEventListener("customActivity", function(e) {
		setTimeout(function() {
			if (e.title == "Open in Safari") {
				Ti.Platform.openURL("http://www.google.com");
			}
		}, 500);
	});

}