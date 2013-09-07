function Controller() {
    function buttonClick(e) {
        if (!Ti.Geolocation.locationServicesEnabled) {
            alert("Please enable location services");
            return false;
        }
        var startJourney = Alloy.createController("tabJourney/journeyProgress", {
            transportType: e.source
        }).getView();
        startJourney.open({
            modal: false,
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "tabJourney/default";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.__alloyId20 = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        title: "Start new journey",
        layout: "composite",
        id: "__alloyId20"
    });
    $.__views.buttongrid = Alloy.createWidget("com.appcelerator.buttongrid", "widget", {
        id: "buttongrid",
        top: "0",
        __parentSymbol: $.__views.__alloyId20
    });
    $.__views.buttongrid.setParent($.__views.__alloyId20);
    $.__views.__alloyId21 = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Tap on a transport mode to start new journey!",
        bottom: "3",
        id: "__alloyId21"
    });
    $.__views.__alloyId20.add($.__views.__alloyId21);
    $.__views.tabJourney = Ti.UI.createTab({
        window: $.__views.__alloyId20,
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
            subtitle: "walking, running, jogging",
            backgroundImage: "images/transports/walk.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonBicycle",
            title: "Bicycle",
            subtitle: "bicycle, skate, rollerblade",
            backgroundImage: "images/transports/bicycle.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonBux",
            title: "Bus",
            subtitle: "bus, tram",
            backgroundImage: "images/transports/bus.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonTrain",
            title: "Train",
            subtitle: "train, underground",
            backgroundImage: "images/transports/train.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonCar",
            title: "Car",
            subtitle: "car, taxi",
            backgroundImage: "images/transports/car.png",
            click: _.bind(buttonClick, this)
        }, {
            id: "buttonBike",
            title: "Bike",
            subtitle: "bike, motor bike",
            backgroundImage: "images/transports/bike.png",
            click: _.bind(buttonClick, this)
        } ],
        buttonWidth: 160,
        buttonHeight: 114,
        realButtonWidth: 60,
        realButtonHeight: 60,
        duration: 1,
        textColor: "#8EB92A",
        textSize: Alloy.CFG.defaultFontSize + 1,
        textFont: "Bree Serif",
        textSubSize: Alloy.CFG.defaultFontSize - 2,
        textSubFont: "Open Sans",
        textSubColor: "#3A3F44"
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;