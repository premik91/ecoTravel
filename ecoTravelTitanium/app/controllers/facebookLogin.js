Alloy.Globals.FBUser.fbModule.addEventListener('login', function(e) {
    if (e.success) {
        doLoginFB();
    } else if (e.error) {
        alert(e.error);
    } else if (e.cancelled) {
        alert(e.cancelled);
    }
});

function doLoginFB() {
	Alloy.Globals.FBUser.loginToServer(function() {
		Ti.API.TFinfo('Callback za prijavo ratal!');
	});
	$.loginScreen.close();
	return true;
}

function whyFacebook () {
	var facebook = Alloy.createController('whyFacebook', {}).getView();
	$.whyFacebookNav.open(facebook, {animated: 'true'});
}