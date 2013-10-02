/*
 var user = '{"name":"Rok Kralj","total":4513.068200305322,"saved":311.0021136042848,"km":50.2507324365584,"modes":{"bike":{"km":15.453,"total":1730.736,"saved":-247.248,"number":1},"car":{"km":20.3,"total":2496.9,"saved":-548.1,"number":3},"bicycle":{"km":12.7,"total":152.4,"saved":1066.8,"number":1},"train":{"km":1.7977324365584,"total":133.032200305322,"saved":39.5501136042848,"number":1}}}';
 user = JSON.parse(user);

 */

function onFocus() {
	Ti.API.TFinfo('Getting XHR statistics');
	user = Alloy.Globals.FBUser.getCurrentUserStats();
	if (Object.keys(user).length === 0) { // refresh only if user data is not available	
		refreshXHRData();
	} else {
		refreshStatViewData();
	}
}

// ptr is Pull to Refresh control when we manually invoke refresh 
function refreshXHRData(ptr) {
	Alloy.Globals.FBUser.refreshCurrentUserStats(function(e) {
		Ti.API.TFinfo('Success refreshing!');
		refreshStatViewData();
		Ti.API.TFinfo(e);
		if (ptr && ptr.hide) ptr.hide();
	}, function(e) {
		Ti.API.TFinfo('Refreshing failed');
		Ti.API.TFinfo(e);
		if (ptr && ptr.hide) ptr.hide();		
	});
}

// TODO: Pull to refresh
function refreshStatViewData(e) {
	user = Alloy.Globals.FBUser.getCurrentUserStats();
	$.name.text = user['name'];
	$.points.text = 'CO₂ released: ' + (user['total']) + ' kg';
	$.distance.text = 'Distance traveled: ' + user['distance'] + ' km';
	$.co2saved.text = 'CO₂ saved: ' + (user['saved']) + ' kg';
	$.userImage.setImage(Alloy.Globals.FBUser.getCurrentUserPicture());

	var tableData = [];
	var i = 0;
	for (var transport_name in user['travel_types']) {
		var transport = user['travel_types'][transport_name];
		var row = Ti.UI.createTableViewRow({
			className : 'transportRow',
			selectedBackgroundColor : 'white',
			rowIndex : i++,
			height : 140
		});

		// Transport image
		var transportImage = Ti.UI.createImageView({
			image : 'images/transports/' + transport_name + '.png',
			left : 10,
			top : 5,
			width : 50,
			height : 50
		});
		row.add(transportImage);

		// Current user's image
		var labelTransportName = Ti.UI.createLabel({
			color : '#576996',
			text : transport_name.capitalize(),
			left : 70,
			top : 6,
			width : 200,
			height : 30
		});
		row.add(labelTransportName);

		// Transports details
		var labelDetails = Ti.UI.createLabel({
			color : '#222',
			text : 'Saved ' + transport['saved'] + 'kg CO₂',
			left : 70,
			top : 44,
			width : 360,
			font:{
		    	fontFamily: "Open Sans"
		   	}
		});
		row.add(labelDetails);

		// Add all data for each transport type
		var results = ['km', 'total'];
		var resultsText = [
			'You made ' + transport['distance'] + ' km.', 
			'You made ' + transport['total'] +'kg CO₂.',
		];
		var resultsIcons = ['road.png', 'fire.png'];
		for (var i = 0; i < results.length; i++) {
			var resultImage = Ti.UI.createImageView({
				image : 'icons/' + resultsIcons[i],
				bottom : 2 + i*32,
				width : 32,
				height : 32,
				left : 0
			});
			row.add(resultImage);

			var resultLabel = Ti.UI.createLabel({
				color : '#999',
				text : resultsText[i],
				bottom : 10 + i*32,
				width : 200,
				height : 20,
				left : 32,
				id : results[i],
				font:{
			    	fontFamily: "Open Sans"
			   	}
			});
			row.add(resultLabel);
		}
		tableData.push(row);
	}

	$.tableView.data = tableData;
}

function pullToRefresh(e) {
	refreshXHRData(e);
} 
