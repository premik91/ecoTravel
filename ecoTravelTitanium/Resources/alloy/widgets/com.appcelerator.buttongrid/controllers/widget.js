function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.appcelerator.buttongrid/" + s : s.substring(0, index) + "/com.appcelerator.buttongrid/" + s.substring(index + 1);
    return path;
}

function Controller() {
    new (require("alloy/widget"))("com.appcelerator.buttongrid");
    this.__widgetId = "com.appcelerator.buttongrid";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.scrollview = Ti.UI.createScrollView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        contentWidth: Ti.UI.FILL,
        contentHeight: "auto",
        showVerticalScrollIndicator: true,
        id: "scrollview"
    });
    $.__views.scrollview && $.addTopLevelView($.__views.scrollview);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var TEXTSIZE = 10;
    var defaults = {
        buttonWidth: 50,
        buttonHeight: 75,
        realButtonWidth: 40,
        realButtonHeight: 65,
        textSize: TEXTSIZE + "dp",
        textFont: "Helvetica",
        textSubSize: TEXTSIZE + "dp",
        textSubFont: "Helvetica",
        textColor: "white",
        textSubColor: "white",
        textSelectedColor: "black",
        assetDir: "/images/"
    };
    exports.init = function(args) {
        $._buttons = args.buttons;
        $._params = _.defaults(args, defaults);
        _.each($._buttons, function(button, index) {
            Ti.API.info("Buttongrid: creating button " + button.id);
            var buttonProps = _.defaults(button, {
                center: {
                    x: "50%",
                    y: "50%"
                },
                backgroundImage: $._params.assetDir + button.id + ".png",
                backgroundColor: $._params.backgroundColor || "transparent",
                backgroundSelectedColor: $._params.backgroundSelectedColor || "transparent",
                width: $._params.realButtonWidth,
                height: $._params.realButtonHeight,
                click: $._params.click,
                top: 30,
                transportTitle: button.title
            });
            $._buttons[index].b = Titanium.UI.createView({
                borderColor: "#C8C8C8",
                backgroundColor: "transparent",
                width: $._params.buttonWidth,
                height: $._params.buttonHeight
            });
            var btn = Ti.UI.createButton(buttonProps);
            $._buttons[index].b.add(btn);
            btn.click && btn.addEventListener("click", function(e) {
                var source = _.clone(e.source);
                var temp = e.source;
                source.title = e.source.title || e.source._title;
                e.source = source;
                button.click(e);
                e.source = temp;
            });
            $.scrollview.add($._buttons[index].b);
            if (true && button.title) {
                var theLabel = Ti.UI.createLabel({
                    color: $._params.textColor,
                    backgroundColor: "transparent",
                    width: $._params.buttonWidth,
                    height: Ti.UI.SIZE,
                    top: 3,
                    font: {
                        fontSize: $._params.textSize,
                        fontFamily: $._params.textFont
                    },
                    text: button.title,
                    textAlign: "center",
                    touchEnabled: false
                });
                $._buttons[index].b.add(theLabel);
                btn.title = "";
            }
            if (true && button.subtitle) {
                var theSubLabel = Ti.UI.createLabel({
                    color: $._params.textSubColor,
                    backgroundColor: "transparent",
                    width: $._params.buttonWidth,
                    height: Ti.UI.SIZE,
                    bottom: 3,
                    font: {
                        fontSize: $._params.textSubSize,
                        fontFamily: $._params.textSubFont
                    },
                    text: button.subtitle,
                    textAlign: "center",
                    touchEnabled: false
                });
                $._buttons[index].b.add(theSubLabel);
            }
        });
        var autoLayout = $._params.autoLayout || "undefined" == typeof $._params.autoLayout;
        autoLayout && Ti.Gesture.addEventListener("orientationchange", exports.relayout);
        exports.relayout();
    };
    exports.destroy = function() {
        Ti.Gesture.removeEventListener("orientationchange", exports.relayout);
        _.each($._buttons, function(button) {
            button.click && button.b.removeEventListener("click", button.click);
            $.scrollview.remove(button.b);
            button.b = null;
        });
    };
    exports.relayout = function() {
        Ti.API.info("ButtonGrid: relayout");
        var duration = $._params.duration || 2e3;
        $.scrollview.contentWidth = Ti.Platform.displayCaps.getPlatformWidth();
        $.scrollview.contentHeight = "auto";
        var w = Ti.Platform.displayCaps.getPlatformWidth();
        var n = Math.floor(w / $._params.buttonWidth);
        var gutter = (w - n * $._params.buttonWidth) / (n + 1);
        var left = gutter, top = gutter;
        _.each($._buttons, function(button) {
            button.b.animate({
                left: left,
                top: top,
                duration: duration
            });
            left += gutter + $._params.buttonWidth;
            if (left >= w) {
                left = gutter;
                top += gutter + $._params.buttonHeight;
            }
        });
    };
    exports.getButton = function(id) {
        for (var i in $._buttons) if ($._buttons[i].id == id) return $._buttons[i].b;
        return false;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;