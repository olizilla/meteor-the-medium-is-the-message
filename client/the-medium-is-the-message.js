/*
 * Meteor.startup "will run as soon as the DOM is ready and any <body> templates
 * from your .html files have been put on the screen."
 *
 * http://docs.meteor.com/#meteor_startup
 */
Meteor.startup(function(){

	window.startTime = now();

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

	// Deps.autorun(playerGraph);

	// playerFace();
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

	return playerId;
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

Meteor.setInterval(function(){
	playerGraph();	
}, 1000);

var tick = 0;

function playerGraph(){

	var svg = d3.select('svg');
	if (svg[0][0].clientWidth < 1){ return; }

	tick = tick + 1;

	var dot = svg.selectAll('circle').data([Players.find().count()]);

	dot.enter()
		.append('circle')
		.attr('cx', svg[0][0].clientWidth / 2 )
		.attr('cy', svg[0][0].clientHeight / 2 )
		// .attr('r', function(d){ return d * 10; })
		.attr('fill', function(d) { return "#" + Math.random().toString(16).slice(2, 8); });

	dot
		.transition()
		.attr('r', function(d){ return d * 10; });


	// Data: Join the data & it's representation
	// var dots = svg.selectAll('circle').data(Players.find().fetch(), function(d){return d._id});

	// // Enter: The set of new data points without an existing representation
	// dots.enter()
	// 		.append('circle');

	// // Update: update all points with both data and representation. The circles created during the enter() step above are also updated.
	// dots.transition()
	// 		.attr("cx", function(d) { return (tick * 100) % svg[0][0].clientWidth } )
	// 		.attr("cy", function(d) { return 10 } )
	// 		.attr("r", function(d) { return 4 } )
	// 		.attr('fill', function(d) { return "#991111" });
	// 		// .attr('fill', function(d) { return "#" + Math.random().toString(16).slice(2, 8) });

	// // Exit: the set of representations without a data
	// dots.exit()
	// 		.transition()
	// 		.attr("fill", '#FFFFFF').attr('r', 0)
	// 		.remove();

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
