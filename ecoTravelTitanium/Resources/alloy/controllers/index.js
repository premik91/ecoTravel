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
    $.__views.__alloyId5 = Alloy.createController("tabJourney/default", {
        id: "__alloyId5"
    });
    $.__views.index.addTab($.__views.__alloyId5.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId6 = Alloy.createController("tabStatistics/default", {
        id: "__alloyId6"
    });
    $.__views.index.addTab($.__views.__alloyId6.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId7 = Alloy.createController("tabFriends/default", {
        id: "__alloyId7"
    });
    $.__views.index.addTab($.__views.__alloyId7.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId8 = Alloy.createController("tabSettings/default", {
        id: "__alloyId8"
    });
    $.__views.index.addTab($.__views.__alloyId8.getViewEx({
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
            modal: true
        });
    }
    __defers["$.__views.index!focus!tabFocus"] && $.__views.index.addEventListener("focus", tabFocus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;