var express = require('express');
var router = express.Router();
var mongo = require("mongodb");

var connectionString = 'mongodb://bublUser:bublUser@analyticstestvm.cloudapp.net:31031/bublv2';

function getCollection(callback){
	var client = mongo.MongoClient;
	client.connect(connectionString,
		function(error, db){
			if(error){
				console.log(error);
			} else {
				console.log('we have a db' + db);
				var collection = db.collection('objects');
				callback(collection);	
			}
		}
	);
}

router.get('/', function(request, response, next) {
	getCollection(
		function(collection){
			console.log('got collection ' + collection);
			collection.find().toArray(
				function(error, results){
					if(error){
						
					} else {
						response.send(JSON.stringify(results, null, 4));
					}					
				}	
			);
		}
	);
});

router.get('/:object_id', function(request, response, next) {
	getCollection(
		function(collection){
			console.log('got collection ' + collection);
			collection.find({ 'id': request.params.object_id }).toArray(
				function(error, results){
					response.send(JSON.stringify(results[0]));
				}
			);
		}
	);
});

router.get('/:object_id/getchildren', function(request, response, next) {
	getCollection(
		function(collection){
			console.log('got collection ' + collection);
			collection.find({ 'id': request.params.object_id }).toArray(
				function(error, results){
					response.send(JSON.stringify(results[0]));
				}
			);
		}
	);
});

router.get('/:object_id/getdescendents', function(request, response, next) {
	getCollection(
		function(collection){
			console.log('got collection ' + collection);
			collection.find({ 'id': request.params.object_id }).toArray(
				function(error, results){
					response.send(JSON.stringify(results[0]));
				}
			);
		}
	);
});

module.exports = router;
