var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var flake = require('flake-idgen');
var intFormat = require('biguint-format');

var connectionString = 'mongodb://bublUser:bublUser@analyticstestvm.cloudapp.net:31031/bublv2';
var collectionName = 'stevesobjects';

function getCollection(callback){
	var client = mongo.MongoClient;
	client.connect(connectionString,
		function(error, db){
			if(error){
				console.log(error);
			} else {
				console.log('we have a db' + db);
				var collection = db.collection(collectionName);
				callback(collection);	
			}
		}
	);
}

function getObjects(callback){
	getCollection(
		function(collection){
			console.log('got collection ' + collection);
			collection.find().toArray(
				function(error, results){
					if(error){
						
					} else {
						callback(results);
					}					
				}	
			);
		}
	);
}

function getObject(id, depth, callback){
	getCollection(
		function(collection){
			console.log('got collection ' + collection);
			collection.find({ 'id': id }).toArray(
				function(error, results){
					var object = results[0];
					addChildObjects(object, depth, function(){
						callback(object);
					});
				}
			);
		}
	);
}

function addChildObjects(object, depth, callback){
	if(depth === 0){
		callback(object);
	} else {
		getCollection(
			function(collection){
				console.log('got collection ' + collection);
				collection.find({ 'parentId': object['id'] }).toArray(
					function(error, results){
						if(error){
							
						} else {
							object['children'] = results;
							callback(object);							
						}
					}
				);
			}
		);
	}
}

function upsertObject(data, callback){
	getCollection(
		function(collection){
			collection.find( { 'id': data['id'] } ).toArray(
				function(error, results){
					if(results.length == 0){
						collection.insert(data,
							function(error, info){
								callback(data);
							}
						);
					} else {
						collection.update( { 'id': data['id'] }, data,
							function(error, count, info){
								callback(data);					
							}
						);
					}	
				}				
			);		
		}
	);
}

function deleteObject(id, callback){
	getCollection(
		function(collection){
			collection.remove( { 'id': id }, function(result){
				callback();
			});
		}
	);
}

router.get('/', function(request, response, next) {
	getObjects(
		function(objects){
			response.send(JSON.stringify(objects, null, 4));		
		}
	);
});

router.get('/:object_id', function(request, response, next) {
	getObject(request.params.object_id, 0,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/getchildren', function(request, response, next) {
	getObject(request.params.object_id, 1,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/getdescendents', function(request, response, next) {
	getObject(request.params.object_id, 1,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.post('/', function(request, response, next){
	var object = request.body;
	if(object['id']){
		upsertObject(object,
			function(insertedObject){
				response.send(JSON.stringify(insertedObject));	
			}
		);
	} else {
		var generator = new flake;
		object['id'] = intFormat(generator.next(), 'dec');
		upsertObject(object,
			function(insertedObject){
				response.send(JSON.stringify(insertedObject));	
			}
		);
	}
});

router.post('/:object_id', function(request, response, next){
	var object = request.body;
	object['id'] = request.params.object_id;
	upsertObject(object,
		function(insertedObject){
			response.send(JSON.stringify(insertedObject));	
		}
	);
});

router.delete('/', function(request, response, next){
	var object = request.body;
	deleteObject(object['id'], function(){
		response.send('{}');
	});
});

router.delete('/:object_id', function(request, response, next){
	deleteObject(request.params.object_id, function(){
		response.send('{}');
	});
});

module.exports = router;
