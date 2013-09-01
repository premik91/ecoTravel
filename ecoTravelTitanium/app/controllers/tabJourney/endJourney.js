var args = arguments[0] || {};
// Show statistics
$.journeyTime.text = args.journeyTime;
$.journeyPoints.text = args.journeyDistance;
$.journeyDistance.text = args.journeyDistance;
function finishJourney() {
	// TODO: It should return to home view
	$.endJourney.close();
}

function shareFacebook() {

}

function shareTwitter() {
	// https://gist.github.com/dawsontoth/2eabc31db388144b3abc
	var social = require('social');
	var twitter = social.create({
		site : 'Twitter',
		consumerKey : Alloy.CFG.twitterConsumerKey,
		consumerSecret : Alloy.CFG.twitterConsumerSecret
	});
	twitter.share({
		message : 'Hello, world!',
		success : function() {
			alert('Tweeted!');
		},
		error : function(error) {
			alert('Oh no! ' + error);
		}
	});
}
