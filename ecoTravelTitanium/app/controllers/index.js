// check facebook login
$.index.open();

if (!Alloy.Globals.FBUser.checkFB()) {	
	var FBwin = Alloy.createController('facebookLogin').getView();  	
   	FBwin.open({
		modal: false,
	});
}

function tabFocus(e) {
	Ti.API.log("New tab focused: " + e.tab.id);
//	Alloy.Globals.GA.trackScreen(e.tab.id);
//	Alloy.Globals.testflight.passCheckpoint("tab.focus: " + e.tab.id);	
}
