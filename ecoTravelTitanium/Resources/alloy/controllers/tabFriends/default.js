function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabFriends/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId6 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Jealous much?",
        id: "__alloyId6"
    });
    $.__views.label = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Hello, Friends",
        id: "label"
    });
    $.__views.__alloyId6.add($.__views.label);
    $.__views.tabFriends = Ti.UI.createTab({
        window: $.__views.__alloyId6,
        id: "tabFriends",
        icon: "/icons/friends.png",
        title: "Friends"
    });
    $.__views.tabFriends && $.addTopLevelView($.__views.tabFriends);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;