$(function() {

	var bublApp = {
		init: function(){
			var self = this;
			var url = 'http://localhost:3000/app.json';

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
			self.setupObservers();
			self.setupEvents();
			self.load('http://localhost:3000/app.json', null,
				function(){
					self.load('http://localhost:3000/editor.json', self.BublEditor);
				}	
			);
			//self.load('http://localhost:3000/app.json', null);
			//self.load('http://localhost:3000/editor.json', self.BublEditor);		
		},
		load: function(url, parent, callback){
			var self = this;
			ZEN.data.load(
				url, {},
				function (data) {
					// var app = ZEN.parse(data);
					var parsedData = self.preParse(data, {});
					if(parent !== null){
						ZEN.update(parsedData, parent);
					} else {
						ZEN.init(parsedData);
					}
					if(callback !== undefined){
						callback();
					}
				}
			);
		},
		preParse: function(data, defaults){
			var self = this;
			var childDefaults = {};
			$.extend(true, childDefaults, defaults);
			
			if(data['defaults']){
				$.extend(true, childDefaults, data['defaults']);
				ZEN.log('set defaults');
				ZEN.log(childDefaults);	
			}
			
			if(data['children']){
				var children = data['children'];
				for(var i = 0; i < children.length; i++){
					children[i] = $.extend(true, {}, childDefaults, children[i]);
					self.preParse(children[i], childDefaults);
				}
			}
			return(data);
		},
		setupObservers: function(){
			var self = this;
			ZEN.observe('clicks', null, {},
				function (params) {
					alert('click observer ' + params);
				}
			);	
			ZEN.observe('objectcreation', null, {},
				function(params){
					ZEN.log('object creation observer' + params);
					if(params['id'] === 'BublEditor'){
						self.BublEditor = params['object'];
					}
				}
			);
		},
		setupEvents: function(){
			var self = this;
			$('body').click(
				function(event){
					ZEN.log('click');
					var element = $(event.target);
					var data = element.data('params');
					
					if(data === undefined){
						element = element.closest('[id]');
						data = element.data('params');
					}
					
					ZEN.notify('clicks', { 'id': element.attr('id'), 'data': data });
				}
			);
		}
	};
	
	bublApp.init();	
});
