var mongoAccess = require('./mongoaccess'),
	Q = require('Q');


var ObjectStore = {
	getAllObjects: function(callback){
		var self = this;
		mongoAccess.getCollection(
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
	},	
	getObject: function(id, depth, callback){
		var self = this;
		mongoAccess.getCollection(
			function(collection){
				console.log('got collection ' + collection);
				collection.find({ 'id': id }).toArray(
					function(error, results){
						var object = results[0];
						self.getChildObjects(object, depth).then(
							function(){
								callback(object);
							}
						).done();
					}
				);
			}
		);
	},
	getChildObjects: function(object, depth){
		var self = this;
		var deferred = new Q.defer()
		if(depth === 0){
			deferred.resolve(true);
		} else {
			if(depth !== null){
				depth = depth -1;
			}
			console.log('load children of "' + object['type'] + '" (' + object['title'] + ') depth=' + depth);
			mongoAccess.getCollection(
				function(collection){
					console.log('got collection ' + collection);
					collection.find({ 'parentId': object['id'] }).toArray(
						function(error, results){
							if(error){
								
							} else {
								if(results.length > 0){
									console.log(results);
									object['children'] = results;
									var childPromises = [];
									for(var i=0; i<results.length;i++){
										childPromises.push(self.getChildObjects(results[i], depth));
									}
									Q.all(childPromises).then(
										function(){
											deferred.resolve(true);
										}
									)
								} else {
									deferred.resolve(true);
								}
							}
						}
					);
				}
			);
		}
		return(deferred.promise);
	},
	upsertObject: function(data){
		var deferred = Q.defer();
		mongoAccess.getCollection(
			function(collection){
				collection.find( { 'id': data['id'] } ).toArray(
					function(error, results){
						if(results.length == 0){
							collection.insert(data,
								function(error, info){
									deferred.resolve(data);
								}
							);
						} else {
							collection.update( { 'id': data['id'] }, data,
								function(error, count, info){
									deferred.resolve(data);
								}
							);
						}	
					}				
				);		
			}
		);
		return(deferred.promise);
	},
	deleteObject: function(id, callback){
		mongoAccess.getCollection(
			function(collection){
				collection.remove( { 'id': id }, function(result){
					callback();
				});
			}
		);
	},
	clearAll: function(){
		var self = this;
		var deferred = Q.defer();
		console.log('>>ObjectStore.clearAll');
		mongoAccess.getCollection(
			function(collection){
				console.log('remove all objects');
				collection.remove( {}, function(result){
					console.log('<<ObjectStore.clearAll');
					deferred.resolve(true);
				});
			}
		);
		return(deferred.promise);
	},
	init: function(){
		var self = this;
		var deferred = Q.defer();
		console.log('>>ObjectStore.init');
		
		self.clearAll().then(
			function(){
				return(self.upsertObject( { 'id': '1', 'type': 'root', 'title': 'Root' } ));
			}
		).then(
			function(){
				return(self.upsertObject( { 'id': '100', 'parentId': '1', 'type': 'customers', 'title': 'Customers' } ));
			}
		).done(
			function(){
				console.log('<<ObjectStore.init');
				deferred.resolve( { 'result': 'init complete' } );
			}
		);
		
		return(deferred.promise);
	}
};

module.exports = ObjectStore;