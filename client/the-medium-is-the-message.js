var heartbeatInterval = 5000 //ms
var deadAfter = 10000 //ms

/*
 * Meteor.startup "will run as soon as the DOM is ready and any <body> templates
 * from your .html files have been put on the screen."
 *
 * http://docs.meteor.com/#meteor_startup
 */
Meteor.startup(function(){

	// Setup the slideshow. 
	stack();

	// Set up the current user once the Players collection is ready.
	Meteor.subscribe('allplayers', function(){	
		retrieveOrCreatePlayer();
	});	

	// Watch for changes
	Players.find().observeChanges({
		added:function(id, fields){
			console.log('New Challenger Appears:', id);
		},
		changed: function(id, fields){
			//console.log('Player updated', id, fields);
		}
	});

	playerHeartbeat();
});


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

function now(){
	return Date.now();
}

function updateLastActive(){
	Players.update(Session.get('playerId'), { $set: { lastActive: now() } });
}

function playerHeartbeat(){
	updateLastActive();
	Meteor.setTimeout(function(){ playerHeartbeat(); }, heartbeatInterval); // N
	// console.log('Player ' + Session.get('playerId') + ' STILL ALIVE');
}

function activePlayers(){
	Players.find({ lastActive: { $gt: now() - deadAfter } });
}

