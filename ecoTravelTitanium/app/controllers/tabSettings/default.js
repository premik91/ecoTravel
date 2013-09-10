// Wifi switch, to allow user to make all travels private
var resultsPublicSwitch = Ti.UI.createSwitch();
resultsPublicSwitch.addEventListener('change', changeResultsPublicSwitch);
$.settingsTable.addField({
	title : 'Make results public',
	value : true,
	control : resultsPublicSwitch,
	id : 'sharePublic',
	hintText : 'hintText'
});

// Wifi switch, to allow user to send data only when wifi is on
var wifiSwitch = Ti.UI.createSwitch();
wifiSwitch.addEventListener('change', changeWifiSwitch);
$.settingsTable.addField({
	title : 'Send data only over wifi',
	value : Alloy.Globals.onlyWifi,
	control : wifiSwitch,
	id : 'wifi',
	hintText : 'hintText'
});

$.settingsTable.addField({
	title : 'Facebook',
	value : true,
	control : Alloy.Globals.FBUser.fbModule.createLoginButton({
		id : 'fbButton'
	}),
	id : 'fbLogin',
	hintText : 'hintText'
});

function changeResultsPublicSwitch(e) {
	alert(e.value);
}

function changeWifiSwitch(e) {
	var wifi = false;
	if (e.value == 1) {
		wifi = true;
	}
	Ti.App.Properties.setBool('onlyWifi', wifi);
	Alloy.Globals.onlyWifi = wifi;
}
