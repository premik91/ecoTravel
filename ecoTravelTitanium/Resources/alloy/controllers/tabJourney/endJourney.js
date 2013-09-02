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
    $.__views.mainView = Ti.UI.createView({
        layout: "vertical",
        height: "88%",
        id: "mainView"
    });
    $.__views.endJourney.add($.__views.mainView);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Journey statistics",
        id: "__alloyId7"
    });
    $.__views.mainView.add($.__views.__alloyId7);
    $.__views.journeyTime = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        id: "journeyTime"
    });
    $.__views.mainView.add($.__views.journeyTime);
    $.__views.journeyPoints = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        id: "journeyPoints"
    });
    $.__views.mainView.add($.__views.journeyPoints);
    $.__views.journeyDistance = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        id: "journeyDistance"
    });
    $.__views.mainView.add($.__views.journeyDistance);
    $.__views.__alloyId8 = Ti.UI.createView({
        layout: "horizontal",
        height: "12%",
        id: "__alloyId8"
    });
    $.__views.endJourney.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createButton({
        title: "Finish journey",
        left: "10",
        right: "10",
        top: "5",
        bottom: "5",
        width: Titanium.UI.FILL,
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    finishJourney ? $.__views.__alloyId9.addEventListener("click", finishJourney) : __defers["$.__views.__alloyId9!click!finishJourney"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.journeyTime.text = args.journeyTime;
    $.journeyPoints.text = args.journeyDistance;
    $.journeyDistance.text = args.journeyDistance;
    var shareBtn = Ti.UI.createButton({
        width: 200,
        height: 35,
        top: 15,
        title: "Share Results"
    });
    $.mainView.add(shareBtn);
    var Social = require("dk.napp.social");
    Ti.API.info("module is => " + Social);
    Ti.API.info("Facebook available: " + Social.isFacebookSupported());
    Ti.API.info("Twitter available: " + Social.isTwitterSupported());
    if (Social.isRequestTwitterSupported()) {
        var accounts = [];
        Social.addEventListener("accountList", function(e) {
            Ti.API.info("Accounts:");
            accounts = e.accounts;
            Ti.API.info(accounts);
        });
        Social.twitterAccountList();
    }
    shareBtn.addEventListener("click", function() {
        Social.isActivityViewSupported() && Social.activityView({
            text: "share like a king!",
            image: "images/pin.png",
            removeIcons: "print,sms,copy,contact,camera,weibo"
        }, [ {
            title: "Open in Safari",
            type: "images/open.safari",
            image: "images/safari.png"
        } ]);
    });
    Social.addEventListener("customActivity", function(e) {
        setTimeout(function() {
            "Open in Safari" == e.title && Ti.Platform.openURL("http://www.google.com");
        }, 500);
    });
    __defers["$.__views.__alloyId9!click!finishJourney"] && $.__views.__alloyId9.addEventListener("click", finishJourney);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;