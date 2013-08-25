function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabSettings/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId16 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Settings",
        layout: "vertical",
        id: "__alloyId16"
    });
    $.__views.label = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Hello, Settings",
        id: "label"
    });
    $.__views.__alloyId16.add($.__views.label);
    $.__views.fbButton = Alloy.Globals.FBUser.fbModule.createLoginButton({
        id: "fbButton",
        ns: "Alloy.Globals.FBUser.fbModule"
    });
    $.__views.__alloyId16.add($.__views.fbButton);
    $.__views.tabSettings = Ti.UI.createTab({
        window: $.__views.__alloyId16,
        id: "tabSettings",
        icon: "/icons/settings.png",
        title: "Settings"
    });
    $.__views.tabSettings && $.addTopLevelView($.__views.tabSettings);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;