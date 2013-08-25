function Controller() {
    function buttonClick(e) {
        if (!Ti.Geolocation.locationServicesEnabled) {
            alert("Please enable location services");
            return false;
        }
        var startJourney = Alloy.createController("tabJourney/journeyProgress", {
            vehicleType: e.source
        }).getView();
        startJourney.open({
            modal: true,
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabJourney/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId7 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Start new journey",
        id: "__alloyId7"
    });
    $.__views.buttongrid = Alloy.createWidget("com.appcelerator.buttongrid", "widget", {
        id: "buttongrid",
        __parentSymbol: $.__views.__alloyId7
    });
    $.__views.buttongrid.setParent($.__views.__alloyId7);
    $.__views.tabJourney = Ti.UI.createTab({
        window: $.__views.__alloyId7,
        id: "tabJourney",
        icon: "/icons/journey.png",
        title: "Journey"
    });
    $.__views.tabJourney && $.addTopLevelView($.__views.tabJourney);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.buttongrid.init({
        buttons: [ {
            id: "buttonWalk",
            title: "Walk",
            backgroundImage: "images/transports/walk.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonBicycle",
            title: "Bicycle",
            backgroundImage: "images/transports/bicycle.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonBux",
            title: "Bus",
            backgroundImage: "images/transports/bus.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonTrain",
            title: "Train",
            backgroundImage: "images/transports/train.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonCar",
            title: "Car",
            backgroundImage: "images/transports/car.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonBike",
            title: "Bike",
            backgroundImage: "images/transports/bike.png",
            click: _.bind(buttonClick, this)
        } ],
        buttonWidth: 110,
        buttonHeight: 110
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;