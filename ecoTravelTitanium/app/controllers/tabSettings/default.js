$.settingsTable.addField({
	title: 'Title',
	value: true,
	control: Ti.UI.createSwitch(),
	id: 'sharePublic',
	hintText: 'hintText'
});

$.settingsTable.addField({
	title: 'Facebook',
	value: true,
	control: Alloy.Globals.FBUser.fbModule.createLoginButton({id: 'fbButton'}),
	id: 'fbLogin',
	hintText: 'hintText'
});


