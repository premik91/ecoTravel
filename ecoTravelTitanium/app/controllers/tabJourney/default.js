$.buttongrid.init({
    buttons: [
        { id: 'buttonWalk', title: 'Walk', subtitle: 'walking, running, jogging', backgroundImage:'images/transports/walk.png', click:_.bind(buttonClick, this) },
        { id: 'buttonBicycle', title: 'Bicycle', subtitle: 'bicycle, skate, rollerblade', backgroundImage:'images/transports/bicycle.png', click:_.bind(buttonClick, this) },
        { id: 'buttonBux', title: 'Bus', subtitle: 'bus, tram', backgroundImage:'images/transports/bus.png', click:_.bind(buttonClick, this) },
        { id: 'buttonTrain', title: 'Train', subtitle: 'train, underground', backgroundImage:'images/transports/train.png', click:_.bind(buttonClick, this) },        
        { id: 'buttonCar', title: 'Car', subtitle: 'car, taxi', backgroundImage:'images/transports/car.png', click:_.bind(buttonClick, this) },
        { id: 'buttonBike', title: 'Bike', subtitle: 'bike, motor bike', backgroundImage:'images/transports/bike.png', click:_.bind(buttonClick, this) },
    ],
    buttonWidth: 160,
    buttonHeight: (Alloy.Globals.screenSize == "iPhone5") ? 144 : 114,
    realButtonWidth: (Alloy.Globals.screenSize == "iPhone5") ? 90 : 60,
    realButtonHeight: (Alloy.Globals.screenSize == "iPhone5") ? 90 : 60,
    duration: 1,
    backgroundColor: "transparent",
    backgroundSelectedColor: "#E3E9EB",
    textColor: Alloy.CFG.greenColor,
    textSize: Alloy.CFG.defaultFontSize+2,
    textFont: 'Bree Serif',
    textSubSize: Alloy.CFG.defaultFontSize-2,
    textSubFont: 'Open Sans',
    textSubColor: Alloy.CFG.grayColor
});


function buttonClick (e) {
	// Did user enable location services
	if (!Ti.Geolocation.locationServicesEnabled) {
	    alert('Please enable location services');
	    return false;
	} else {
		Ti.App.Properties.setString('travelType', e.source['transportTitle']);
		var startJourney = Alloy.createController('tabJourney/journeyProgress', {}).getView();  	
	   	startJourney.open({
			modal: false,
			modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
		});
	}
}