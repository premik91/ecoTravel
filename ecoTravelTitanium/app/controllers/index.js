// check facebook login
$.index.open();

// oh dear god no...move this ASAP!

if (!Alloy.Globals.FBUser.checkFB()) {	
	var FBwin = Alloy.createController('facebookLogin').getView();  	
   	FBwin.open({
		modal: true,
	});
}

function tabFocus(e) {
	Ti.API.TFinfo('New tab focused: ' + e.tab.id);
//	Alloy.Globals.GA.trackScreen(e.tab.id);
	Alloy.Globals.TF.passCheckpoint("tab.focus: " + e.tab.id);	
}
