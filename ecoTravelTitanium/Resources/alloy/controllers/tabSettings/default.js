function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabSettings/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId29 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Settings",
        layout: "vertical",
        id: "__alloyId29"
    });
    $.__views.settingsTable = Alloy.createWidget("ti.pedro.forms", "widget", {
        id: "settingsTable",
        __parentSymbol: $.__views.__alloyId29
    });
    $.__views.settingsTable.setParent($.__views.__alloyId29);
    $.__views.tabSettings = Ti.UI.createTab({
        window: $.__views.__alloyId29,
        id: "tabSettings",
        icon: "/icons/settings.png",
        title: "Settings"
    });
    $.__views.tabSettings && $.addTopLevelView($.__views.tabSettings);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.settingsTable.setTitle("Change settings");
    $.settingsTable.setSubmit("Save");
    $.settingsTable.addField({
        title: "Title",
        value: true,
        control: Ti.UI.createSwitch(),
        id: "sharePublic",
        hintText: "hintText"
    });
    $.settingsTable.addField({
        title: "Facebook",
        value: true,
        control: Alloy.Globals.FBUser.fbModule.createLoginButton({
            id: "fbButton"
        }),
        id: "fbLogin",
        hintText: "hintText"
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;