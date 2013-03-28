/*
 * shared.js
 * Common collections for client and server.
 */

var heartbeatInterval = 5000; //ms
var deadAfter = heartbeatInterval + 5000; //ms

function now(){
	return Date.now();
}

Players = new Meteor.Collection("players");

// TODO: this is equivalent to using the insecure package, tighten up.
Players.allow({

	insert: function (id, player) {
		return true;
	},

	update:function (id, player) {
		return true;
	},

	remove:function (id, player) {
		return false;
	}
});
