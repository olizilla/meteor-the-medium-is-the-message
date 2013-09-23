/*
 * shared.js
 * Common collections for client and server.
 */

heartbeatInterval = 5000; //ms
deadAfter = heartbeatInterval + 5000; //ms

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
