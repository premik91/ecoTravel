function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabStatistics/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId16 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "My statistics",
        id: "__alloyId16"
    });
    $.__views.label = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Hello, Statistics",
        id: "label"
    });
    $.__views.__alloyId16.add($.__views.label);
    $.__views.tabStatistics = Ti.UI.createTab({
        window: $.__views.__alloyId16,
        id: "tabStatistics",
        icon: "/icons/statistics.png",
        title: "Statistics"
    });
    $.__views.tabStatistics && $.addTopLevelView($.__views.tabStatistics);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;