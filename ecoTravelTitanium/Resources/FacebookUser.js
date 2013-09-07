var fbModule = require("facebook");

fbModule.appid = Alloy.CFG.appId;

var accessToken;

var currentUserStats = {};

var currentUserFriends = {};

fbModule.addEventListener("logout", function() {
    var FBwin = Alloy.createController("facebookLogin").getView();
    FBwin.open({
        modal: true
    });
});

var authorizeFB = function() {
    return fbModule.authorize();
};

var checkFB = function() {
    if (fbModule.getLoggedIn()) {
        Ti.API.info("Facebook is logged in, logging in to server");
        loginToServer();
        return true;
    }
    return false;
};

var loginToServer = function(successCallback, errorCallback) {
    Alloy.Globals.XHR.post(Alloy.CFG.site_url + "user/login/" + fbModule.accessToken, {}, function(e) {
        Ti.API.info("Logged in to server!");
        Ti.API.info(e);
        successCallback && successCallback;
    }, function(e) {
        Ti.API.info("NOT Logged in to server!");
        Ti.API.info(e);
        errorCallback && errorCallback;
    });
};

var getCurrentUserStats = function() {
    return currentUserStats;
};

var refreshCurrentUserStats = function(onSuccess, onError) {
    Alloy.Globals.XHR.get(Alloy.CFG.site_url + "user/summary", function(e) {
        currentUserStats = JSON.parse(e.data);
        onSuccess && onSuccess(e);
    }, function(e) {
        onError && onError(e);
    });
};

var refreshCurrentUserFriends = function(onSuccess, onError) {
    Alloy.Globals.XHR.get(Alloy.CFG.site_url + "user/friends", function(e) {
        currentUserFriends = JSON.parse(e.data);
        onSuccess && onSuccess(e);
    }, function(e) {
        onError && onError(e);
    });
};

var getCurrentUserFriends = function() {
    return currentUserFriends;
};

exports.fbModule = fbModule;

exports.authorizeFB = authorizeFB;

exports.checkFB = checkFB;

exports.loginToServer = loginToServer;

exports.getCurrentUserStats = getCurrentUserStats;

exports.refreshCurrentUserStats = refreshCurrentUserStats;

exports.getCurrentUserFriends = getCurrentUserFriends;

exports.refreshCurrentUserFriends = refreshCurrentUserFriends;