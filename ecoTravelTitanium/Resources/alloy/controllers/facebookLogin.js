function Controller() {
    function doPrijaviFB() {
        Alloy.Globals.FBUser.loginToServer(function() {
            Ti.API.info("Callback za prijavo ratal!");
        });
        $.FBWin.close();
        return true;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "facebookLogin";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.FBWin = Ti.UI.createWindow({
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5",
        id: "FBWin",
        title: "Facebook login",
        layout: "vertical"
    });
    $.__views.FBWin && $.addTopLevelView($.__views.FBWin);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        font: {
            fontFamily: "Open Sans"
        },
        text: "Please login with Facebook",
        id: "__alloyId3"
    });
    $.__views.FBWin.add($.__views.__alloyId3);
    $.__views.fbButton = Alloy.Globals.FBUser.fbModule.createLoginButton({
        id: "fbButton",
        ns: "Alloy.Globals.FBUser.fbModule"
    });
    $.__views.FBWin.add($.__views.fbButton);
    $.__views.__alloyId4 = Ti.UI.createButton({
        title: "Nah, just let me in!",
        id: "__alloyId4"
    });
    $.__views.FBWin.add($.__views.__alloyId4);
    doPrijaviFB ? $.__views.__alloyId4.addEventListener("click", doPrijaviFB) : __defers["$.__views.__alloyId4!click!doPrijaviFB"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Globals.FBUser.fbModule.addEventListener("login", function(e) {
        e.success ? doPrijaviFB() : e.error ? alert(e.error) : e.cancelled && alert(e.cancelled);
    });
    __defers["$.__views.__alloyId4!click!doPrijaviFB"] && $.__views.__alloyId4.addEventListener("click", doPrijaviFB);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;