var args = arguments[0] || {};
// Show statistics
$.journeyTime.text = args.journeyTime;
$.journeyPoints.text = args.journeyDistance;
$.journeyDistance.text = args.journeyDistance;
function finishJourney () {
	$.endJourney.close();
}