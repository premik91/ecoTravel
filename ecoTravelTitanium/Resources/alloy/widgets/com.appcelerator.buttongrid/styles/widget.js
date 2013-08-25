function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.appcelerator.buttongrid/" + s : s.substring(0, index) + "/com.appcelerator.buttongrid/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0001,
    key: "Window",
    style: {
        barColor: "#A2BF68",
        backgroundColor: "#E5E5E5"
    }
}, {
    isApi: true,
    priority: 1000.0002,
    key: "SearchBar",
    style: {
        barColor: "#395B98"
    }
}, {
    isApi: true,
    priority: 1000.0003,
    key: "WebView",
    style: {
        backgroundColor: "transparent",
        top: 0,
        bottom: 0,
        left: "0%",
        right: "0%"
    }
}, {
    isApi: true,
    priority: 1000.0004,
    key: "Label",
    style: {
        font: {
            fontFamily: "Open Sans"
        }
    }
}, {
    isClass: true,
    priority: 10000.0005,
    key: "opensans",
    style: {
        font: {
            fontFamily: "Open Sans"
        }
    }
}, {
    isClass: true,
    priority: 10000.0006,
    key: "breeserif",
    style: {
        font: {
            fontFamily: "Bree Serif"
        }
    }
}, {
    isId: true,
    priority: 100000.0009,
    key: "scrollview",
    style: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        contentWidth: Ti.UI.FILL,
        contentHeight: "auto",
        showVerticalScrollIndicator: true
    }
} ];