var mongo = require("mongodb");

var MongoAccess = {
	connectionString: 'mongodb://bublUser:bublUser@analyticstestvm.cloudapp.net:31031/bublv2',
	collectionName: 'stevesobjects',
	db: null,
	collection: null,
	mongoClient: mongo.MongoClient,
	initalized: false,
	
	getCollection: function(callback){
		var self = this;
		if(self.initalized){
			callback(self.collection);
		} else {
			console.log('init mongo connection "' + self.connectionString + '"');
			self.mongoClient.connect(self.connectionString,
				function(error, db){
					self.db = db;
					console.log('get collection "' + self.collectionName + '"');
					self.collection = self.db.collection(self.collectionName);
					self.initalized = true;
					callback(self.collection);
				}
			);
		}
	}	
};

module.exports = MongoAccess;