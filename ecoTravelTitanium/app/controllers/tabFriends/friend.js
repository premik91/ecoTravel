var args = arguments[0] || {};
var friend = args.friend;
$.friendName.text = friend[0];
$.friendPoints.text = friend[1];

var tableData = [];
var i = 0;
for (var transport in friend[2]) {
	var row = Ti.UI.createTableViewRow({
		className : 'transportRow',
		selectedBackgroundColor : 'white',
		rowIndex : i++,
		height : 110
	});

	// Transport image
	var transportImage = Ti.UI.createImageView({
		image : 'images/transports/' + transport + '.png',
		left : 10,
		top : 5,
		width : 50,
		height : 50
	});
	row.add(transportImage);

	// Current user's image
	var labelTransportName = Ti.UI.createLabel({
		color : '#576996',
		text : transport.capitalize(),
		left : 70,
		top : 6,
		width : 200,
		height : 30
	});
	row.add(labelTransportName);

	// Transports details
	var labelDetails = Ti.UI.createLabel({
		color : '#222',
		text : 'Saved ' + friend[2][transport] + 'kg CO₂',
		left : 70,
		top : 44,
		width : 360,
		font:{
	    	fontFamily : 'Open Sans'
	   	}
	});
	row.add(labelDetails);
	
	// Label and image for comparing user's and friend's results
	// Get current users stats for this transport
	var user_saved = 0;
	if (Alloy.Globals.FBUser.getCurrentUserStats()['modes'][transport] != undefined) {
		user_saved = Alloy.Globals.FBUser.getCurrentUserStats()['modes'][transport]['total'];
	}
	
	// Choose image based on users result
	var resultImage = 'icons/';
	if (user_saved >= friend[2][transport]) {
		resultImage += 'smile.png';
	} else {
		resultImage += 'frown.png';
	}
	var userResultImage = Ti.UI.createImageView({
		image : resultImage,
		left : 70,
		bottom : 2,
		width : 32,
		height : 32
	});
	row.add(userResultImage);
	
	var compareLabel = Ti.UI.createLabel({
		color : '#999',
		text : 'You made ' + user_saved + 'kg CO₂',
		left : 105,
		bottom : 10,
		width : 200,
		height : 20,
		font:{
	    	fontFamily : 'Open Sans'
	   	}
	});
	row.add(compareLabel);

	tableData.push(row);
}

$.tableView.data = tableData; 