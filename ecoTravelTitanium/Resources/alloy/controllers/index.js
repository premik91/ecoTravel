function Controller() {
    function tabFocus(e) {
        Ti.API.log("New tab focused: " + e.tab.id);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createTabGroup({
        exitOnClose: "false",
        navBarHidden: "true",
        id: "index",
        activeTabIconTint: "#3A87AD"
    });
    $.__views.__alloyId2 = Alloy.createController("tabJourney/default", {
        id: "__alloyId2"
    });
    $.__views.index.addTab($.__views.__alloyId2.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId3 = Alloy.createController("tabStatistics/default", {
        id: "__alloyId3"
    });
    $.__views.index.addTab($.__views.__alloyId3.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId4 = Alloy.createController("tabFriends/default", {
        id: "__alloyId4"
    });
    $.__views.index.addTab($.__views.__alloyId4.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId5 = Alloy.createController("tabSettings/default", {
        id: "__alloyId5"
    });
    $.__views.index.addTab($.__views.__alloyId5.getViewEx({
        recurse: true
    }));
    $.__views.index && $.addTopLevelView($.__views.index);
    tabFocus ? $.__views.index.addEventListener("focus", tabFocus) : __defers["$.__views.index!focus!tabFocus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    if (!Alloy.Globals.FBUser.checkFB()) {
        var FBwin = Alloy.createController("facebookLogin").getView();
        FBwin.open({
            modal: false
        });
    }
    __defers["$.__views.index!focus!tabFocus"] && $.__views.index.addEventListener("focus", tabFocus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;