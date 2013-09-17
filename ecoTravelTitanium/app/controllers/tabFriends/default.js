/*
var friends = '[["Rok Kralj",311.0021136042848,{"bike":15.453,"car":20.3,"bicycle":12.7,"train":1.7977324365584}],["Jon Premik",1265.0021136042848,{"car":45.3,"bicycle":698.456,"train":51.7977324365584}],["Roman Avsec",-2045.0021136042848,{"bike":15.453,"car":21345.3,"bicycle":12.7,"train":12.7977324365584}]]';
*/
// Enable search
Alloy.Globals.CLS.setSearch($.search, $.friendsList);
function onFocus() {
	Ti.API.TFinfo('Getting XHR friends');
	friends = Alloy.Globals.FBUser.getCurrentUserFriends();	
	if (Object.keys(friends).length === 0) { // refresh only if user data is not available
		Alloy.Globals.FBUser.refreshCurrentUserFriends(function(e) {
			Ti.API.TFinfo('Success refreshing friends!');
			refreshFriendsViewData();
			Ti.API.TFinfo(e);
		}, function(e) {
			Ti.API.TFinfo('Refreshing friends failed!');
			Ti.API.TFinfo(e);
		});
	}
}

// TODO: Pull to refresh 
function refreshFriendsViewData() {
	friends = Alloy.Globals.FBUser.getCurrentUserFriends();
	
	var friends_list = [];
	// Add all friends to list
	var i = 0;
	for (friend in friends) {
		var information = friends[friend][1] + 'kg CO₂ savings.';
		var friend = { name: {text: friends[friend][0]}, info: {text: information}, pic: {image: 'images/user.png'}, properties : {
	            itemId: i++,
	            accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DETAIL,
	        }};
		friends_list.push(friend);
	}
	$.friendsList.data = friends_list;
	$.friendsList.origData = friends_list;
	$.friendsList.setItems(friends_list);
}


function friendShow(e) {
	// Get clicked friend
	var item = $.friendsList.getItemAt(e.itemIndex);
	item = item.properties.itemId;
	
	// Show friend in new window
	var friend = Alloy.createController('tabFriends/friend', {
		'friend' : friends[item]
	}).getView();
	$.friendsNav.open(friend, {animated: 'true'});
}
