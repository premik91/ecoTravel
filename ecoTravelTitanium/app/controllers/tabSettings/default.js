// Wifi switch, to allow user to make all travels private
var resultsPublicSwitch = Ti.UI.createSwitch();
resultsPublicSwitch.addEventListener('change', changeResultsPublicSwitch);
$.settingsTable.addField({
	title : 'Make my results public',
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

// About us title and text
var labelAboutUsTitle = Ti.UI.createLabel({
	color : Alloy.CFG.grayColor,
	text : 'About',
	font : {
		fontFamily : 'Open Sans',
		fontSize : Alloy.CFG.defaultFontSizeLarge,
		fontWeight : 'bold'
	},
	height : '20dp',
	top : '10dp',
	left : '10dp'
});

var aboutUsText = 'ecoTravel is a simple app made by students (we use this as an excuse for possible errors). ;) \n If you spot something wrong or just want to scream at us you are welcome to send as an email.';
var labelAboutUs = Ti.UI.createLabel({
	color : Alloy.CFG.grayColor,
	left : '10dp', 	
	text : aboutUsText,
	font : {
		fontFamily : 'Open Sans',
		fontSize : Alloy.CFG.defaultFontSize
	},
	height : Ti.UI.SIZE,
	top : '40dp'
});

var footerView = Ti.UI.createView({
	top : "8dp",
	left : "5dp",
	right : "5dp",
	height : Ti.UI.SIZE
});
footerView.add(labelAboutUsTitle);
footerView.add(labelAboutUs);
$.settingsTable.getTable().footerView = footerView;

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
