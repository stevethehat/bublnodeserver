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
	request.session.uploadUrl = request.query['uploadUrl'];
	
	console.log('init upload');
	console.log(request.session.uploadUrl);
	 
	response.send({ 'result': 'OK' });
});

router.get('/test', function(request, response, next){
	console.log('init test');
	console.log(request.session.uploadUrl);
	 
	response.send({ 'result': 'OK', 'uploadUrl': request.session.uploadUrl });
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

module.exports = router;
