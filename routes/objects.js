var express = require('express');
var router = express.Router();
var flake = require('flake-idgen');
var intFormat = require('biguint-format');
var _ = require('underscore');
var objectStore = require('../lib/objectstore');

router.get('/', function(request, response, next) {
	objectStore.getAllObjects(
		function(objects){
			response.send(JSON.stringify(objects, null, 4));		
		}
	);
});

router.get('/:object_id', function(request, response, next) {
	objectStore.getObject(request.params.object_id, 0,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/getchildren', function(request, response, next) {
	objectStore.getObject(request.params.object_id, 1,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/getdescendents', function(request, response, next) {
	objectStore.getObject(request.params.object_id, null,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.post('/', function(request, response, next){
	var object = request.body;
	console.log('postedt object');
	console.log(JSON.stringify(object, null, 4));
	if(object['id']){
		objectStore.upsertObject(object,
			function(insertedObject){
				response.send(JSON.stringify(insertedObject));	
			}
		);
	} else {
		var generator = new flake;
		object['id'] = intFormat(generator.next(), 'dec');
		objectStore.upsertObject(object,
			function(insertedObject){
				response.send(JSON.stringify(insertedObject));	
			}
		);
	}
});

router.post('/:object_id', function(request, response, next){
	var object = request.body;
	object['id'] = request.params.object_id;
	objectStore.upsertObject(object,
		function(insertedObject){
			response.send(JSON.stringify(insertedObject));	
		}
	);
});

router.delete('/', function(request, response, next){
	var object = request.body;
	objectStore.deleteObject(object['id'], function(){
		response.send('{}');
	});
});

router.delete('/:object_id', function(request, response, next){
	objectStore.deleteObject(request.params.object_id, function(){
		response.send('{}');
	});
});

router.delete('/init', function(request, response, next){
	objectStore.init(request.params.object_id, function(){
		response.send('{}');
	});
});

module.exports = router;
