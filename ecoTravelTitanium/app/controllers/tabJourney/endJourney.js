var args = arguments[0] || {};
// Show statistics
$.journeyTime.text = args.journeyTime;
$.journeyPoints.text = args.journeyDistance;
$.journeyDistance.text = args.journeyDistance;
function finishJourney () {
	$.endJourney.close();
}

function shareFacebook () {
	
}

function shareTwitter () {
	// https://gist.github.com/dawsontoth/00e95c5d95d2b7d5d027#L991
	// http://developer.appcelerator.com/question/142880/post-a-tweet-from-iphone-app---stuck-on-callback-url
}

