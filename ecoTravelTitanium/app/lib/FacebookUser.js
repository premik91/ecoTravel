var fbModule = require('facebook');
fbModule.appid = Alloy.CFG.appId;
//fb.permissions = [FACEBOOK_APP_PERMISSIONS];

var accessToken;

fbModule.addEventListener('logout', function(e) {
   	var FBwin = Alloy.createController('facebookLogin').getView();  	
   	FBwin.open({
		modal: false,
	});
});

var authorizeFB = function() {
	return fbModule.authorize();
}

var checkFB = function() {
	if (fbModule.getLoggedIn()) {
		loginToServer(function() {
			Ti.API.info("Logged in to check");
		});
		return true;
	} else {
		return false;
	}
}

var loginToServer = function(successCallback, errorCallback) {
	if (checkFB) {
		Alloy.Globals.XHR.post(Alloy.CFG.site_url+"user/login/"+fbModule.accessToken, function(e) {
			Ti.info("Logged in to server!");
			Ti.info(e);
			if (successCallback) successCallback;
		}, function(e) {
			Ti.info("NOT Logged in to server!");
			Ti.info(e);
			if (errorCallback) errorCallback;
		});
	}
}

exports.fbModule = fbModule;
exports.authorizeFB = authorizeFB;
exports.checkFB = checkFB;
exports.loginToServer = loginToServer;