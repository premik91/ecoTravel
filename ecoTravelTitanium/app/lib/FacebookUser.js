var fbModule = require('facebook');
fbModule.appid = Alloy.CFG.appId;
fbModule.permissions = ['email'];
fbModule.forceDialogAuth = true;

var accessToken;
var currentUserStats = {};
var currentUserFriends = {};
var transportTypes = {}; 
var currentUserProfile = {};


fbModule.addEventListener('logout', function(e) {
	Ti.API.TFinfo("FB User logged out!");
	var FBwin = Alloy.createController('facebookLogin').getView();
	FBwin.open({
		modal : true,
	});
});

var authorizeFB = function() {
	Ti.API.TFinfo("FB authorizing!");
	return fbModule.authorize();
};

var checkFB = function() {
	Ti.API.TFinfo("Checking if FB User is logged in");
	if (fbModule.getLoggedIn()) {
		Ti.API.TFinfo("Facebook is logged in, logging in to server");
		loginToServer();
		return true;
	} else {
		Ti.API.TFinfo("Facebook user is not logged in!");
		return false;
	}
};

var loginToServer = function(successCallback, errorCallback) {
	Alloy.Globals.XHR.post(Alloy.CFG.site_url + "user/login/" + fbModule.accessToken, {}, function(e) {
		Ti.API.TFinfo("Logged in to server!");
		Ti.API.TFinfo(""+e.data);
		refreshTransportTypes();
		//refreshCurrentUserProfile();
		if (successCallback)
			successCallback;
	}, function(e) {
		Ti.API.TFinfo("NOT Logged in to server!");
		Ti.API.TFinfo(""+e);
		if (errorCallback)
			errorCallback;
	});
};

var getCurrentUserUid = function() {
	return fbModule.getUid();
};

var getCurrentUserPicture = function() {
	return "https://graph.facebook.com/"+getCurrentUserUid()+"/picture?width=100&height=100";
};

var getCurrentUserProfile = function() {
	return currentUserProfile;
};

var refreshCurrentUserProfile = function() {
	fbModule.requestWithGraphPath('me', {}, 'GET', function(e) {
    	if (e.success) {
        	alert(e.mail);
    	} else if (e.error) {
	        alert(e.error);
	    } else {
        	alert('Unknown response');
    	}
    });
};

var getCurrentUserStats = function() {
	return currentUserStats;
};

var refreshCurrentUserStats = function(onSuccess, onError) {
	Ti.API.TFinfo("Refreshing current user stats");
	Alloy.Globals.XHR.get(Alloy.CFG.site_url+"user/summary/", function(e) {
		currentUserStats = JSON.parse(e.data);
		Ti.API.TFinfo("Refreshed current user stats");		
		if (onSuccess) onSuccess(e);
	}, function(e) {	
		Ti.API.TFinfo("Error refreshing current user stats: "+e);		
		if (onError) onError(e);
	});
};

var refreshCurrentUserFriends = function(onSuccess, onError) {
	Ti.API.TFinfo("Getting current user friends");
	Alloy.Globals.XHR.get(Alloy.CFG.site_url+"user/friends/", function(e) {
		Ti.API.TFinfo("Got current user friends");		
		currentUserFriends = JSON.parse(e.data);
		if (onSuccess) onSuccess(e);
	}, function(e) {	
		Ti.API.TFinfo("Error getting current user friends:"+e);		
		if (onError) onError(e);
	});
};

var getCurrentUserFriends = function() {
	return currentUserFriends;
};

// Get transport type
var refreshTransportTypes = function () {
	Alloy.Globals.XHR.get(Alloy.CFG.site_transport_modes_url, function(e) {
		Ti.API.TFinfo('Transport types returned successfully.') + e;
		transportTypes = JSON.parse(e.data);
	}, function(e) {
		Ti.API.TFinfo('No transports returned!' + e);
	});
};

var getTransportTypes = function() {
	return transportTypes;
};

exports.fbModule = fbModule;
exports.authorizeFB = authorizeFB;
exports.checkFB = checkFB;
exports.loginToServer = loginToServer;
exports.getCurrentUserStats = getCurrentUserStats; 
exports.refreshCurrentUserStats = refreshCurrentUserStats;
exports.getCurrentUserFriends = getCurrentUserFriends; 
exports.refreshCurrentUserFriends = refreshCurrentUserFriends;
exports.refreshTransportTypes = refreshTransportTypes;
exports.getTransportTypes = getTransportTypes;
exports.getCurrentUserUid = getCurrentUserUid;
exports.getCurrentUserPicture = getCurrentUserPicture;