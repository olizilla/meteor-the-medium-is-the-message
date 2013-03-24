
Meteor.publish("allplayers", function(){
	return Players.find({ lastActive: { $gt: now() - deadAfter } });
});
