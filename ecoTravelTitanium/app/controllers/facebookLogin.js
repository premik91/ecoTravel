Alloy.Globals.FBUser.fbModule.addEventListener('login', function(e) {
    if (e.success) {
        doPrijaviFB();
    } else if (e.error) {
        alert(e.error);
    } else if (e.cancelled) {
        alert(e.cancelled);
    }
});

function doPrijaviFB() {
	Alloy.Globals.FBUser.loginToServer(function() {
		Ti.API.info('Callback za prijavo ratal!');
	});
	$.FBWin.close();
	return true;
}
