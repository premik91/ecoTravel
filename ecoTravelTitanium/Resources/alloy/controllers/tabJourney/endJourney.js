function Controller() {
    function finishJourney() {
        $.endJourney.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabJourney/endJourney";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.endJourney = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        id: "endJourney",
        title: "Journey Ended",
        layout: "vertical"
    });
    $.__views.endJourney && $.addTopLevelView($.__views.endJourney);
    $.__views.__alloyId8 = Ti.UI.createView({
        layout: "vertical",
        height: "88%",
        id: "__alloyId8"
    });
    $.__views.endJourney.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Journey statistics",
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.journeyTime = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        id: "journeyTime"
    });
    $.__views.__alloyId8.add($.__views.journeyTime);
    $.__views.journeyPoints = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        id: "journeyPoints"
    });
    $.__views.__alloyId8.add($.__views.journeyPoints);
    $.__views.journeyDistance = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        id: "journeyDistance"
    });
    $.__views.__alloyId8.add($.__views.journeyDistance);
    $.__views.__alloyId10 = Ti.UI.createView({
        layout: "horizontal",
        height: "12%",
        id: "__alloyId10"
    });
    $.__views.endJourney.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createButton({
        title: "Finish journey",
        left: "10",
        right: "10",
        top: "5",
        bottom: "5",
        width: Titanium.UI.FILL,
        id: "__alloyId11"
    });
    $.__views.__alloyId10.add($.__views.__alloyId11);
    finishJourney ? $.__views.__alloyId11.addEventListener("click", finishJourney) : __defers["$.__views.__alloyId11!click!finishJourney"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.journeyTime.text = args.journeyTime;
    $.journeyPoints.text = args.journeyDistance;
    $.journeyDistance.text = args.journeyDistance;
    __defers["$.__views.__alloyId11!click!finishJourney"] && $.__views.__alloyId11.addEventListener("click", finishJourney);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;