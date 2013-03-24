/*
 * Meteor.startup "will run as soon as the DOM is ready and any <body> templates
 * from your .html files have been put on the screen."
 *
 * http://docs.meteor.com/#meteor_startup
 */
Meteor.startup(function(){

	// Setup the slideshow. 
	stack();

	audio();

	// Set up the current user once the Players collection is ready.
	Meteor.subscribe('allplayers', function(){	
		retrieveOrCreatePlayer();
	});	

	// Watch for changes
	Players.find().observeChanges({
		added:function(id, fields){
			console.log('New Challenger Appears:', id);
			audio.coin.play();
		},
		changed: function(id, fields){
			//console.log('Player updated', id, fields);
		}
	});

	playerHeartbeat();
});

function audio(){
	audio.coin = new buzz.sound( "/audio/coin", { formats: [ "ogg", "mp3" ] });
}

function retrieveOrCreatePlayer(){

	function createPlayer() {
		var playerId = Players.insert({ lastActive: now() });
		window.localStorage['playerId'] = playerId;
		return playerId;
	}

	var playerId = window.localStorage['playerId'];
	
	// Never seen you before
	if (!playerId){
		playerId = createPlayer();
	} else {
		var player = Players.findOne({_id: playerId});
		// Are you still in the db?
		if (!player){
			console.log('Player not found, db probably got wiped, recreating now.');
			playerId = createPlayer();
		}
	}

	Session.set('playerId', playerId);

	console.log('Your playerId is:', playerId);

	return playerId;
}

function updateLastActive(){
	var timestamp = now(); // see shared.js
	Players.update(Session.get('playerId'), { $set: { lastActive: timestamp } });
	return timestamp;
}

function playerHeartbeat(){
	updateLastActive();
	Meteor.setTimeout(function(){ playerHeartbeat(); }, heartbeatInterval); // N
	// console.log('Player ' + Session.get('playerId') + ' STILL ALIVE');
}

function activePlayers(){
	return Players.find({ lastActive: { $gt: now() - deadAfter } });
}
