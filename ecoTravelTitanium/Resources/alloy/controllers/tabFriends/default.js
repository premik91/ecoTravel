function Controller() {
    function onFocus() {
        Ti.API.info("Getting XHR friends");
        friends = Alloy.Globals.FBUser.getCurrentUserFriends();
        0 === Object.keys(friends).length && Alloy.Globals.FBUser.refreshCurrentUserFriends(function(e) {
            Ti.API.info("Success refreshing friends!");
            refreshFriendsViewData();
            Ti.API.info(e);
        }, function(e) {
            Ti.API.info("Refreshing friends failed!");
            Ti.API.info(e);
        });
    }
    function refreshFriendsViewData() {
        friends = Alloy.Globals.FBUser.getCurrentUserFriends();
        var friends_list = [];
        var i = 0;
        for (friend in friends) {
            var information = friends[friend][1] + " CO₂ savings.";
            var friend = {
                name: {
                    text: friends[friend][0]
                },
                info: {
                    text: information
                },
                pic: {
                    image: "images/user.png"
                },
                properties: {
                    itemId: i++,
                    accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DETAIL
                }
            };
            friends_list.push(friend);
        }
        $.friendsList.data = friends_list;
        $.friendsList.origData = friends_list;
        $.friendsList.setItems(friends_list);
    }
    function friendShow(e) {
        var item = $.friendsList.getItemAt(e.itemIndex);
        item = item.properties.itemId;
        var friend = Alloy.createController("tabFriends/friend", {
            friend: friends[item]
        }).getView();
        $.friendsNav.open(friend, {
            animated: "true"
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabFriends/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.__alloyId9 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        navBarHidden: "true",
        id: "__alloyId9"
    });
    $.__views.friendsWindow = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Competitive much?",
        id: "friendsWindow"
    });
    $.__views.search = Ti.UI.createSearchBar({
        barColor: "#000",
        id: "search",
        showCancel: "false",
        height: "48",
        top: "0",
        hintText: "Search for a friend"
    });
    $.__views.friendsWindow.add($.__views.search);
    var __alloyId10 = {};
    var __alloyId13 = [];
    var __alloyId14 = {
        type: "Ti.UI.ImageView",
        bindId: "pic",
        properties: {
            width: "50dp",
            height: "50dp",
            left: 0,
            bindId: "pic"
        }
    };
    __alloyId13.push(__alloyId14);
    var __alloyId15 = {
        type: "Ti.UI.Label",
        bindId: "name",
        properties: {
            font: {
                fontFamily: "Arial",
                fontSize: "16dp",
                fontWeight: "bold"
            },
            color: "black",
            left: "60dp",
            top: 0,
            height: "20",
            bindId: "name"
        }
    };
    __alloyId13.push(__alloyId15);
    var __alloyId16 = {
        type: "Ti.UI.Label",
        bindId: "info",
        properties: {
            font: {
                fontFamily: "Arial",
                fontSize: "14dp"
            },
            color: "gray",
            left: "60dp",
            top: "25dp",
            bindId: "info"
        }
    };
    __alloyId13.push(__alloyId16);
    var __alloyId12 = {
        properties: {
            name: "template"
        },
        childTemplates: __alloyId13
    };
    __alloyId10["template"] = __alloyId12;
    var __alloyId17 = [];
    $.__views.friendsList = Ti.UI.createListSection({
        id: "friendsList"
    });
    __alloyId17.push($.__views.friendsList);
    $.__views.listView = Ti.UI.createListView({
        sections: __alloyId17,
        templates: __alloyId10,
        id: "listView",
        defaultItemTemplate: "template",
        top: "48"
    });
    $.__views.friendsWindow.add($.__views.listView);
    friendShow ? $.__views.listView.addEventListener("itemclick", friendShow) : __defers["$.__views.listView!itemclick!friendShow"] = true;
    $.__views.friendsNav = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.friendsWindow,
        id: "friendsNav"
    });
    $.__views.__alloyId9.add($.__views.friendsNav);
    $.__views.tabFriends = Ti.UI.createTab({
        window: $.__views.__alloyId9,
        id: "tabFriends",
        icon: "/icons/friends.png",
        title: "Friends"
    });
    $.__views.tabFriends && $.addTopLevelView($.__views.tabFriends);
    onFocus ? $.__views.tabFriends.addEventListener("focus", onFocus) : __defers["$.__views.tabFriends!focus!onFocus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.CLS.setSearch($.search, $.friendsList);
    __defers["$.__views.listView!itemclick!friendShow"] && $.__views.listView.addEventListener("itemclick", friendShow);
    __defers["$.__views.tabFriends!focus!onFocus"] && $.__views.tabFriends.addEventListener("focus", onFocus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;