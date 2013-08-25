$.buttongrid.init({
    buttons: [
        { id: 'buttonWalk', title: 'Walk', backgroundImage:'images/transports/walk.png', click:_.bind(buttonClick, this) },
        { id: 'buttonBicycle', title: 'Bicycle', backgroundImage:'images/transports/bicycle.png', click:_.bind(buttonClick, this) },
        { id: 'buttonBux', title: 'Bus', backgroundImage:'images/transports/bus.png', click:_.bind(buttonClick, this) },
        { id: 'buttonTrain', title: 'Train', backgroundImage:'images/transports/train.png', click:_.bind(buttonClick, this) },        
        { id: 'buttonCar', title: 'Car', backgroundImage:'images/transports/car.png', click:_.bind(buttonClick, this) },
        { id: 'buttonBike', title: 'Bike', backgroundImage:'images/transports/bike.png', click:_.bind(buttonClick, this) },
    ],
    buttonWidth: 110,
    buttonHeight: 110
});

function buttonClick (e) {
	// Did user enable location services
	if (!Ti.Geolocation.locationServicesEnabled) {
	    alert('Please enable location services');
	    return false;
	} else {
		var startJourney = Alloy.createController('tabJourney/journeyProgress', {"vehicleType": e.source}).getView();  	
	   	startJourney.open({
			modal: true,
			modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
		});
	}
}