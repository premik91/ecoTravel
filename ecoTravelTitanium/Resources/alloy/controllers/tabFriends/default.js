function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabFriends/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.friendsWindow = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Jealous much?",
        id: "friendsWindow"
    });
    $.__views.search = Ti.UI.createSearchBar({
        barColor: "#000",
        id: "search",
        showCancel: "true",
        height: "43",
        top: "0"
    });
    $.__views.friendsWindow.add($.__views.search);
    $.__views.tabFriends = Ti.UI.createTab({
        window: $.__views.friendsWindow,
        id: "tabFriends",
        icon: "/icons/friends.png",
        title: "Friends"
    });
    $.__views.tabFriends && $.addTopLevelView($.__views.tabFriends);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var listView = Ti.UI.createListView();
    var sections = [];
    var natureSection = Ti.UI.createListSection({
        headerTitle: "Nature lovers"
    });
    var natureDataSet = [ {
        properties: {
            title: "Joze lare"
        }
    }, {
        properties: {
            title: "Miha tovo"
        }
    } ];
    natureSection.setItems(natureDataSet);
    sections.push(natureSection);
    var badSection = Ti.UI.createListSection({
        headerTitle: "They could do better..."
    });
    var badDataSet = [ {
        properties: {
            title: "Joze lare"
        }
    }, {
        properties: {
            title: "Miha tovo"
        }
    } ];
    badSection.setItems(badDataSet);
    sections.push(badSection);
    listView.sections = sections;
    $.friendsWindow.add(listView);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;