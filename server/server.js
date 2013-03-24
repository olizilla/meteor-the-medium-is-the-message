
Meteor.publish("allplayers", function(){
	return Players.find({});
});



