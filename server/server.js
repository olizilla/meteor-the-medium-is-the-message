/* http://docs.meteor.com/#publishandsubscribe
 * These functions control how Meteor servers publish sets of records and how clients can subscribe to those sets.
 */
Meteor.publish("allplayers", function(){
	return Players.find({ lastActive: { $gt: now() - deadAfter } });
});


/* http://docs.meteor.com/#methods_header
 * Methods are remote functions that Meteor clients can invoke.
 *
 * These methods can be remotely executed from the client via: 
 *   - Method.call('someMethod', arg1, argN, function callback(result){})
 *   - Method.apply('someMethod', [a1, aN], function callback(result){})
 */
Meteor.methods({
	
	killEmAll: function(){
		var total = Players.find().count();
		Players.remove({});
		return { killed: total };
	},

	ping: function(){
		return { serverTime: now() };
	}
	
});