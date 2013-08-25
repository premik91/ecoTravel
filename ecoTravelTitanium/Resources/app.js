var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Ti.Geolocation.purpose = "Determine Current Location and to follow your journey";

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;

Ti.Geolocation.distanceFilter = 10;

Alloy.Globals.FBUser = require("FacebookUser");

Alloy.Globals.XHR = new (require("xhr"))();

Alloy.createController("index");