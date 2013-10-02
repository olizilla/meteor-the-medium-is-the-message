/*
 * Meteor.startup "will run as soon as the DOM is ready and any <body> templates
 * from your .html files have been put on the screen."
 *
 * http://docs.meteor.com/#meteor_startup
 */
Meteor.startup(function(){

	window.startTime = Date.now();

	// Setup the slideshow. 
	var slideshow = stack();
	
	slideshow.on('activate', function(index) {
		console.log('Slide activated', index);
		
		var player = retrieveOrCreatePlayer();

		if (!player) { return console.log('Player not ready yet...')}
		
		Players.update(player._id, {$set: {slideNumber: index}});
	});

	audio();

	// Set up the current user once the Players collection is ready.
	Meteor.subscribe('allplayers', function() {
		
		var player = retrieveOrCreatePlayer();
		
		//  slideshow.position(player.slideNumber || 0);

		// Watch for changes to me
		Players.find(Session.get('playerId')).observeChanges({
			
			changed: function(id, fields){
				if(id === player._id && fields.gotoSlide !== undefined) {
					console.log('Changing to slide', fields.gotoSlide);
					slideshow.position(fields.gotoSlide);
				}
			}
		});
	});	

	// Watch for changes to others
	Players.find({ lastActive: { $gt: Date.now() - deadAfter } }).observeChanges({
		added:function(id, fields){
			console.log('New Challenger Appears:', id);
			audio.coin.play();
		},
		removed: function(id){
			console.log("Head Shot! Player " + id + " is dead.");
		}
	});

	playerHeartbeat();
	
	playerGraph();
});

function playerGraph(){
	// Explicitly set the width & height of the SVG element on the dot slide to be the width & height of the slide
	var dotSvg = $('section.dot svg'),
		dotSlide = dotSvg.parent();
	
	dotSvg.attr({width: dotSlide.width(), height: dotSlide.height()});

	Deps.autorun(updatePlayerGraph);
}

function audio(){
	audio.coin = new buzz.sound( "/audio/coin", { formats: [ "ogg", "mp3" ] }).setVolume(20);
	audio.beat = new buzz.sound( "/audio/beat", { formats: [ "ogg", "mp3" ] });
	buzz.all().load();
}

function retrieveOrCreatePlayer(){

	function createPlayer() {
		var justNow = Date.now();
		var playerId = Players.insert({ created: justNow, lastActive: justNow });
		window.localStorage['playerId'] = playerId;
		return playerId;
	}

	if (Session.get('playerId')){
		// return early as we already know who you are
		return Players.findOne(Session.get('playerId'));
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

	return Players.findOne(playerId);
}

function updateLastActive(){
	var timestamp = Date.now(); // see shared.js
	Players.update(Session.get('playerId'), { $set: { lastActive: timestamp } });
	return timestamp;
}

function playerHeartbeat(){

	if(heartbeatInterval > 0){
		var timestamp = updateLastActive();
		
		// audio.beat.setVolume(100).play().fadeOut(3000, function(){
		// 	audio.beat.stop();
		// });

		Meteor.setTimeout(function(){ playerHeartbeat(); }, heartbeatInterval); // 

		// console.log('YOU ARE ALIVE!', timestamp);

	} else {
		console.log('YOU ARE DEAD!', Date.now());
	}
}

function stopHeart(){
	oldHeartbeatInterval = heartbeatInterval;
	heartbeatInterval = 0;
}

function startHeart(){
	heartbeatInterval = oldHeartbeatInterval;
	playerHeartbeat();
}

function activePlayers(){
	return Players.find({ lastActive: { $gt: Date.now() - deadAfter } });
}

function updatePlayerGraph(){

	function appendCircleAndNumber(selection){
		selection.append('circle');
		selection.append('text')
			.style('font-size', '36px')
			.style('font-weight', 'bold')
			.style('fill', '#fff')
			.style('stroke', '#000')
			.style('stroke-width', 2)
			.style('text-anchor', 'middle')
			.attr('dy', '.35em');
	}

	var svg = d3.select('svg');
	var x = parseInt(svg.attr('width'), 10) / 2;
	var y = parseInt(svg.attr('height'), 10) / 2;
	
	var graph = svg.selectAll('g').data([activePlayers().count()]);

	graph.enter().append('g').call(appendCircleAndNumber);
	
	var graphUpdate = graph.transition();

	graphUpdate.attr('transform', function() { return 'translate(' + x + ','+ y +')';});

	graphUpdate.select('text').text(function(d) {return d;});

	graphUpdate.select('circle')
		.attr('r', function(d){ return d * 22; })
		.attr('fill', function() { return "#" + Math.random().toString(16).slice(2, 8); });
}

allYourSlideAreBelongToUs = function() {
	var player = retrieveOrCreatePlayer();
	console.log('Requesting all players switch to slide', player.slideNumber);
	Meteor.call('updateAllSlideNumbers', player.slideNumber);
}

fin = function(){
	Meteor.call('updateAllSlideNumbers', 43);
	console.log('Launched Fin');
}

gotofin = function(){
	stack().position(43);
}
