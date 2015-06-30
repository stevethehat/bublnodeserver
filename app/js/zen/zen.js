"use strict";


var ZEN = (function (ZEN, _) {
	_.extend(ZEN, (function () {

		function namespace () {
			var a = arguments, o = null, i, j, d;
			for (i = 0; i < a.length; i = i + 1) {
				d = a[i].toString().split(".");
				o = ZEN;
				
				for (j = (d[0] === "ZEN") ? 1 : 0; j < d.length; j = j + 1) {
					o[d[j]] = o[d[j]] || {};
					o = o[d[j]];
				}
			}
			return o;
		};

		
		var types = {};
		var objects = {};
		

		function log () {
			return window.console && console.log &&
				Function.apply.call(console.log, console, arguments);
		}


		function parse (data, parent) {
			var o, item, container, i, child;
			if (data !== null) {
				if (data.type !== undefined) {
					if (types.hasOwnProperty(data.type)) {
						// create an instance
						o = new types[data.type](data, parent);
						addObject(o);
						
						// check for container objects
						for (item in data) {
							if (data.hasOwnProperty(item)) {
								if (_.isArray(data[item])) {
									container = data[item];
									for (i = 0; i < container.length; i = i + 1) {
										child = parse(container[i], o);
									}
								}
							}
						}
					} else {
						ZEN.log('Unknown ZEN Type: ' + data.type);
					}
				}
			}
			return o;
		}


		function init (data) {
			var app = parse(data);
			app.ready();
		}

		function update (data, parent) {
			var app = parse(data, parent);
			app.ready();
			ZEN.notify("global.resize", {});
		}

		
		function registerType (name, obj) {
			types[name] = obj;
		}


		function addObject (o) {
			if (objects.hasOwnProperty(o.id)) {
				log('DUPLICATE ID',o.id);
				objects[o.id].cleanup();
			}
			//log(o.id);
			objects[o.id] = o;
		}
		

		function getObject (id) {
			if (objects.hasOwnProperty(id)) {
				return objects[id];
			}
			return null;
		}
		


		var messageObservers = {};

		function observe (queueName, filter, o, callback) {
			var queue, observer;
			
			ZEN.log('add observer "' + queueName + '"');

			if (!(queueName in messageObservers)) {
				messageObservers[queueName] = [];
			}

			queue = messageObservers[queueName];

			// console.log('queue', messageObservers, queueName, queue);
			
			observer = {
				id: queueName,
				filter: filter,
				obj: null,
				callable: null
			};
			
			if (callback) {
				observer.obj = o;
				observer.callable = callback;
			} else {
				observer.callable = o;
			}

			queue.push(observer);
		}


		function notify (queueName, message) {
			var observers, idx, observer;
			ZEN.log('notify "' + queueName + '"');
			ZEN.log(message);

			// is there a queue for this message?
			if (queueName in messageObservers) {
				observers = messageObservers[queueName];
				for (idx = 0; idx < observers.length; idx++) {
					observer = observers[idx];

					// TODO: implement filtering by type, target etc...
					// console.log('notify', observer);

					if (observer.obj !== null) {
						observer.callable.call(observer.obj, message);
					} else {
						observer.callable(message);
					}
				}
			}
		};

		
		return {
			init: init,
			namespace: namespace,
			log: log,
			parse: parse,
			registerType: registerType,
			getObject: getObject,
			objects: objects,
			observe: observe,
			notify: notify,
			update: update
		};

	}()));

	return ZEN;
	
}(ZEN || {}, _));
