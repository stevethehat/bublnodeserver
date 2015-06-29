var express = require('express');
var router = express.Router();
var _ = require('underscore');
var objectStore = require('../lib/objectstore');

function requestStart(){
	console.log('');
	console.log('');

	console.log('===================================================================================================');

	console.log('');
	console.log('');
}

router.get('/init', function(request, response, next){
	requestStart();
	console.log('init objectStore');
	objectStore.init().then(
		function(){
			console.log('objectStore.init');
			response.send('{}');
		}
	);
});

router.get('/version', function(request, response, next){
	requestStart();
	console.log('init objectStore');
	objectStore.init().then(
		function(){
			console.log('objectStore.init');
			response.send('{ "version": "' + process.env.npm_package_version + '" }');
		}
	);
});

router.get('/', function(request, response, next) {
	requestStart();
	objectStore.getAllObjects(
		function(objects){
			response.send(JSON.stringify(objects, null, 4));		
		}
	);
});

router.get('/:object_id', function(request, response, next) {
	requestStart();
	objectStore.getObject(request.params.object_id, 0,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/withchildren', function(request, response, next) {
	requestStart();
	objectStore.getObject(request.params.object_id, 1,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/withdescendents', function(request, response, next) {
	requestStart();
	objectStore.getObject(request.params.object_id, null,
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}
	);
});

router.get('/:object_id/nextorder', function(request, response, next) {
	requestStart();
	objectStore.getNextOrder(request.params.object_id).then(
		function(object){
			response.send(JSON.stringify(object, null, 4));		
		}		
	);
});

router.post('/', function(request, response, next){
	requestStart();
	var object = request.body;
	objectStore.upsertObject(object).done(
		function(insertedObject){
			response.send(JSON.stringify(insertedObject));		
		}
	);
});

router.post('/:object_id', function(request, response, next){
	requestStart();
	var object = request.body;
	object['id'] = request.params.object_id;
	objectStore.upsertObject(object,
		function(insertedObject){
			response.send(JSON.stringify(insertedObject));	
		}
	);
});

router.delete('/', function(request, response, next){
	requestStart();
	var object = request.body;
	objectStore.deleteObject(object['id'], function(){
		response.send('{}');
	});
});

router.delete('/:object_id', function(request, response, next){
	requestStart();
	objectStore.deleteObject(request.params.object_id, function(){
		response.send('{}');
	});
});

module.exports = router;
