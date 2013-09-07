function Controller() {
    function onFocus() {
        Ti.API.info("Getting XHR statistics");
        user = Alloy.Globals.FBUser.getCurrentUserStats();
        0 === Object.keys(user).length && Alloy.Globals.FBUser.refreshCurrentUserStats(function(e) {
            Ti.API.info("Success refreshing!");
            refreshStatViewData();
            Ti.API.info(e);
        }, function(e) {
            Ti.API.info("Success failed");
            Ti.API.info(e);
        });
    }
    function refreshStatViewData() {
        user = Alloy.Globals.FBUser.getCurrentUserStats();
        $.points.text = user["total"];
        $.name.text = user["name"];
        $.distance.text = user["km"];
        $.co2saved.text = user["saved"];
        var tableData = [];
        var i = 0;
        for (var transport_name in user["modes"]) {
            var transport = user["modes"][transport_name];
            var row = Ti.UI.createTableViewRow({
                className: "transportRow",
                selectedBackgroundColor: "white",
                rowIndex: i++,
                height: 140
            });
            var transportImage = Ti.UI.createImageView({
                image: "images/transports/" + transport_name + ".png",
                left: 10,
                top: 5,
                width: 50,
                height: 50
            });
            row.add(transportImage);
            var labelTransportName = Ti.UI.createLabel({
                color: "#576996",
                text: transport_name.capitalize(),
                left: 70,
                top: 6,
                width: 200,
                height: 30
            });
            row.add(labelTransportName);
            var labelDetails = Ti.UI.createLabel({
                color: "#222",
                text: "Saved " + transport["saved"] + " CO₂",
                left: 70,
                top: 44,
                width: 360,
                font: {
                    fontFamily: "Open Sans"
                }
            });
            row.add(labelDetails);
            var results = [ "km", "total" ];
            var resultsText = [ "You made 100 km.", "You made " + transport["total"] + "kg CO₂." ];
            var resultsIcons = [ "road.png", "fire.png" ];
            for (var i = 0; results.length > i; i++) {
                var resultImage = Ti.UI.createImageView({
                    image: "icons/" + resultsIcons[i],
                    bottom: 2 + 32 * i,
                    width: 32,
                    height: 32,
                    left: 0
                });
                row.add(resultImage);
                var resultLabel = Ti.UI.createLabel({
                    color: "#999",
                    text: resultsText[i],
                    bottom: 10 + 32 * i,
                    width: 200,
                    height: 20,
                    left: 32,
                    id: results[i],
                    font: {
                        fontFamily: "Open Sans"
                    }
                });
                row.add(resultLabel);
            }
            tableData.push(row);
        }
        $.tableView.data = tableData;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabStatistics/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.__alloyId30 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "My statistics",
        layout: "vertical",
        id: "__alloyId30"
    });
    $.__views.mainView = Ti.UI.createView({
        layout: "composite",
        id: "mainView",
        height: "100"
    });
    $.__views.__alloyId30.add($.__views.mainView);
    $.__views.__alloyId31 = Ti.UI.createImageView({
        width: "100dp",
        height: "100dp",
        left: 0,
        image: "images/user.png",
        id: "__alloyId31"
    });
    $.__views.mainView.add($.__views.__alloyId31);
    $.__views.name = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        left: "100dp",
        id: "name",
        top: "20"
    });
    $.__views.mainView.add($.__views.name);
    $.__views.points = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        left: "100dp",
        id: "points",
        top: "40"
    });
    $.__views.mainView.add($.__views.points);
    $.__views.distance = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        left: "100dp",
        id: "distance",
        top: "60"
    });
    $.__views.mainView.add($.__views.distance);
    $.__views.co2saved = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        left: "100dp",
        id: "co2saved",
        top: "80"
    });
    $.__views.mainView.add($.__views.co2saved);
    $.__views.tableView = Ti.UI.createTableView({
        id: "tableView"
    });
    $.__views.__alloyId30.add($.__views.tableView);
    $.__views.tabStatistics = Ti.UI.createTab({
        window: $.__views.__alloyId30,
        id: "tabStatistics",
        icon: "/icons/statistics.png",
        title: "Statistics"
    });
    $.__views.tabStatistics && $.addTopLevelView($.__views.tabStatistics);
    onFocus ? $.__views.tabStatistics.addEventListener("focus", onFocus) : __defers["$.__views.tabStatistics!focus!onFocus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.tabStatistics!focus!onFocus"] && $.__views.tabStatistics.addEventListener("focus", onFocus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;