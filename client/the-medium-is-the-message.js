/*
 * Meteor.startup "will run as soon as the DOM is ready and any <body> templates
 * from your .html files have been put on the screen."
 *
 * http://docs.meteor.com/#meteor_startup
 */
Meteor.startup(function(){

	window.startTime = now();

	// Setup the slideshow. 
	var slideshow = stack();
	
	slideshow.on('activate', function(index) {
		console.log('Slide activated', index);
		
		var player = retrieveOrCreatePlayer();
		
		Players.update(player._id, {$set: {slideNumber: index}});
	});

	audio();

	// Set up the current user once the Players collection is ready.
	Meteor.subscribe('allplayers', function() {
		
		var player = retrieveOrCreatePlayer();
		
		slideshow.position(player.slideNumber || 0);
	});	

	// Watch for changes
	Players.find({ lastActive: { $gt: now() - deadAfter } }).observeChanges({
		added:function(id, fields){
			console.log('New Challenger Appears:', id);
			audio.coin.play();
		},
		changed: function(id, fields){
			console.log('Player updated', id, fields);
			
			var player = retrieveOrCreatePlayer();
			
			if(id === player._id && fields.slideNumber !== undefined) {
				console.log('Changing to slide', fields.slideNumber);
				slideshow.position(fields.slideNumber);
			}
		},
		removed: function(id){
			console.log("Head Shot! Player " + id + " is dead.");
		}
	});

	playerHeartbeat();

	Deps.autorun(playerGraph);

	// playerFace();
	
	// Explicitly set the width & height of the SVG element on the dot slide to be the width & height of the slide
	var dotSvg = $('section.dot svg'),
		dotSlide = dotSvg.parent();
	
	dotSvg.attr({width: dotSlide.width(), height: dotSlide.height()});
});

function audio(){
	audio.coin = new buzz.sound( "/audio/coin", { formats: [ "ogg", "mp3" ] }).setVolume(20);
	audio.beat = new buzz.sound( "/audio/beat", { formats: [ "ogg", "mp3" ] });
	buzz.all().load();
}

function retrieveOrCreatePlayer(){

	function createPlayer() {
		var justNow = now();
		var playerId = Players.insert({ created: justNow, lastActive: justNow });
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

	return Players.findOne(playerId);
}

function updateLastActive(){
	var timestamp = now(); // see shared.js
	Players.update(Session.get('playerId'), { $set: { lastActive: timestamp } });
	return timestamp;
}

function playerHeartbeat(){

	if(heartbeatInterval > 0){
		var timestamp = updateLastActive();
		
		audio.beat.setVolume(100).play().fadeOut(3000, function(){
			audio.beat.stop();
		});

		Meteor.setTimeout(function(){ playerHeartbeat(); }, heartbeatInterval); // 

		console.log('YOU ARE ALIVE!', timestamp);

	} else {
		console.log('YOU ARE DEAD!', now());
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
	return Players.find({ lastActive: { $gt: now() - deadAfter } });
}

var tick = 0;

function playerGraph(){

	var svg = d3.select('svg');
	var width = parseInt(svg[0][0].getAttribute('width'));
	var height = parseInt(svg[0][0].getAttribute('height'));

	tick = tick + 1;
	
	var dot = svg.selectAll('g').data([Players.find().count()]);
	
	var dotEnter = dot.enter().append('g');
	
	dotEnter.append('circle')
		.attr('fill', function() { return "#" + Math.random().toString(16).slice(2, 8); });
	
	dotEnter.append('text')
		.style('font-size', '36px')
		.style('font-weight', 'bold')
		.style('fill', '#fff')
		.style('stroke', '#000')
		.style('stroke-width', 2)
		.text(function(d) {return d;})
		.style('text-anchor', 'middle')
		.attr('dy', '.35em');
	
	var dotUpdate = dot.transition();
	
	dotUpdate.attr('transform', function() { return 'translate(' +(width / 2)+ ','+(height / 2)+')';})
	dotUpdate.select('circle').attr('r', function(d){ return d * 5; });
	dotUpdate.select('text').text(function(d) {return d;});
}

function allYourSlideAreBelongToUs() {
	var player = retrieveOrCreatePlayer();
	console.log('Requesting all players switch to slide', player.slideNumber);
	Meteor.call('updateAllSlideNumbers', player.slideNumber);
}

// function playerFace(){
 
//   var streaming = false,
//       video        = document.querySelector('#video'),
//       cover        = document.querySelector('#cover'),
//       canvas       = document.querySelector('#canvas'),
//       photo        = document.querySelector('#photo'),
//       startbutton  = document.querySelector('#startbutton'),
//       width = 320,
//       height = 0;
 
//   navigator.getMedia = ( navigator.getUserMedia ||
//                          navigator.webkitGetUserMedia ||
//                          navigator.mozGetUserMedia ||
//                          navigator.msGetUserMedia);
 
//   navigator.getMedia(
//     {
//       video: true,
//       audio: false
//     },
//     function(stream) {
//       if (navigator.mozGetUserMedia) {
//         video.mozSrcObject = stream;
//       } else {
//         var vendorURL = window.URL || window.webkitURL;
//         video.src = vendorURL.createObjectURL(stream);
//       }
//       video.play();
//     },
//     function(err) {
//       console.log("An error occured! " + err);
//     }
//   );
 
//   video.addEventListener('canplay', function(ev){
//     if (!streaming) {
//       height = video.videoHeight / (video.videoWidth/width);
//       video.setAttribute('width', width);
//       video.setAttribute('height', height);
//       canvas.setAttribute('width', width);
//       canvas.setAttribute('height', height);
//       streaming = true;
//     }
//   }, false);
 
//   function takepicture() {
//     canvas.width = width;
//     canvas.height = height;
//     canvas.getContext('2d').drawImage(video, 0, 0, width, height);
//     var data = canvas.toDataURL('image/png');
//     photo.setAttribute('src', data);
//   }
 
//   startbutton.addEventListener('click', function(ev){
//       takepicture();
//     ev.preventDefault();
//   }, false);
 
// }
