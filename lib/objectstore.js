var mongoAccess = require('./mongoaccess'),
	Q = require('Q'),
	flake = require('flake-idgen'),
	intFormat = require('biguint-format');


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
	addChildObjects: function(id, children){
		var self = this;
		var deferred = Q.defer();
		
		if(children){
			if(children.length > 0){
				var childPromises = [];
				for(var i=0; i<children.length;i++){
					var child = children[i];
					child['parentId'] = String(id);
					childPromises.push(self.upsertObject(child));
				}
				Q.all(childPromises).then(
					function(){
						deferred.resolve(true);
					}
				)
			} else {
				deferred.resolve(true);
			}
		} else {
			deferred.resolve(true);
		}
		return(deferred.promise);	
	},
	upsertObject: function(object){
		var self = this;
		var deferred = Q.defer();
		
		if(!object['id']){
			var generator = new flake;
			object['id'] = intFormat(generator.next(), 'dec');
		}	
		var children = object['children'];	
		if(children !== undefined){
			delete object['children'];
		}
		mongoAccess.getCollection(
			function(collection){
				collection.find( { 'id': object['id'] } ).toArray(
					function(error, results){
						if(results.length == 0){
							collection.insert(object,
								function(error, info){
									self.addChildObjects(object['id'], children).then(
										function(){
											deferred.resolve(object);		
										}
									);
								}
							);
						} else {
							collection.update( { 'id': object['id'] }, object,
								function(error, count, info){
									self.addChildObjects(object['id'], children).then(
										function(){
											deferred.resolve(object);		
										}
									);
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