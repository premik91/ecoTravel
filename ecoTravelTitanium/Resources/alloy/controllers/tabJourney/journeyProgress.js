function Controller() {
    function startFollow() {
        setInterval(Stopwatch, 100);
        Ti.Geolocation.addEventListener("location", function(e) {
            if (e.error) Ti.API.error("Error: " + e.error); else {
                var current_longitude = e.coords.longitude;
                var current_latitude = e.coords.latitude;
                if (null == last_position_latitude) {
                    last_position_latitude = current_latitude;
                    last_position_longitude = current_longitude;
                    return;
                }
                var new_distance = getDistanceInKm(last_position_latitude, last_position_longitude, current_latitude, current_longitude);
                distance += new_distance;
                if (distance_in_meters) {
                    var meters = 1e3 * distance;
                    $.journeyDistance.text = meters.toFixed(0) + " meters";
                    distance_in_meters = 1e4 > meters;
                } else $.journeyDistance.text = distance.toFixed(2) + " killometers";
                var region = {
                    latitude: current_latitude,
                    longitude: current_longitude,
                    animate: true,
                    latitudeDelta: .001,
                    longitudeDelta: .001
                };
                $.mapview.setLocation(region);
                var position = '{"x":' + current_latitude + ',"y":' + current_longitude + ',"speed":' + e.coords.speed + ',"time":' + e.coords.timestamp + ',"km":' + new_distance + "},";
                Ti.App.Properties.setString("positions", Ti.App.Properties.getString("positions") + position);
                last_position_latitude = current_latitude;
                last_position_longitude = current_longitude;
            }
        });
    }
    function getDistanceInKm(lat1, lon1, lat2, lon2) {
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    function sendData() {
        if (true == Ti.Network.online) {
            var data = Ti.App.Properties.getString("positions");
            Ti.App.Properties.setString("positions", "");
            if ("" == data) return;
            var json_data = "[" + data.slice(0, -1) + "]";
            Alloy.Globals.XHR.post(Alloy.CFG.site_batch_url, json_data, function() {
                Ti.API.info("Data sent: " + json_data);
            }, function() {
                Ti.App.Properties.setString("positions", data + Ti.App.Properties.getString("positions"));
                Ti.API.error("Data not send" + json_data);
            });
        }
    }
    function Stopwatch() {
        milliseconds += 100;
        if (1e3 == milliseconds) {
            seconds++;
            milliseconds = 0;
        }
        if (60 == seconds) {
            minutes++;
            seconds = 0;
        }
        if (60 == minutes) {
            hours++;
            minutes = 0;
        }
        $.journeyTime.text = hours + ":" + (10 > minutes ? "0" : "") + minutes + ":" + (10 > seconds ? "0" : "") + seconds + ":" + (0 == milliseconds ? "00" : milliseconds / 10);
    }
    function endJourney() {
        clearInterval(send_data_interval);
        var endJourney = Alloy.createController("tabJourney/endJourney", {
            vehicleType: args.vehicleType,
            journeyTime: $.journeyTime.text,
            journeyDistance: $.journeyDistance.text
        }).getView();
        endJourney.open({
            modal: true,
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
        });
        $.journeyProgress.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabJourney/journeyProgress";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.journeyProgress = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        id: "journeyProgress",
        title: "Journey Progress",
        layout: "vertical"
    });
    $.__views.journeyProgress && $.addTopLevelView($.__views.journeyProgress);
    $.__views.__alloyId13 = Ti.UI.createView({
        layout: "vertical",
        height: "88%",
        id: "__alloyId13"
    });
    $.__views.journeyProgress.add($.__views.__alloyId13);
    $.__views.journeyTime = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "00:00:00",
        id: "journeyTime"
    });
    $.__views.__alloyId13.add($.__views.journeyTime);
    $.__views.journeyDistance = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "0 meters",
        id: "journeyDistance"
    });
    $.__views.__alloyId13.add($.__views.journeyDistance);
    var __alloyId14 = [];
    $.__views.mapview = Ti.Map.createView({
        annotations: __alloyId14,
        id: "mapview",
        ns: Ti.Map,
        animate: "true",
        regionFit: "true",
        userLocation: "true",
        mapType: Ti.Map.STANDARD_TYPE
    });
    $.__views.__alloyId13.add($.__views.mapview);
    $.__views.__alloyId15 = Ti.UI.createView({
        layout: "horizontal",
        height: "12%",
        id: "__alloyId15"
    });
    $.__views.journeyProgress.add($.__views.__alloyId15);
    $.__views.__alloyId16 = Ti.UI.createButton({
        title: "End journey",
        left: "10",
        right: "10",
        top: "5",
        bottom: "5",
        width: Titanium.UI.FILL,
        id: "__alloyId16"
    });
    $.__views.__alloyId15.add($.__views.__alloyId16);
    endJourney ? $.__views.__alloyId16.addEventListener("click", endJourney) : __defers["$.__views.__alloyId16!click!endJourney"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    null == Ti.App.Properties.getString("positions") && Ti.App.Properties.setString("positions", "");
    startFollow();
    var send_data_interval = setInterval(sendData, 1e3 * Alloy.CFG.send_data_seconds);
    var last_position_latitude, last_position_longitude;
    var distance = 0;
    var distance_in_meters = true;
    var milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
    __defers["$.__views.__alloyId16!click!endJourney"] && $.__views.__alloyId16.addEventListener("click", endJourney);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;