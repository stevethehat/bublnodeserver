$(function() {

	var bublApp = {
		init: function(){
			var self = this;
			var url = 'http://localhost:3000/app.json';

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
			
			ZEN.data.load(
				url, {},
				function (data) {
					// var app = ZEN.parse(data);
					var parsedData = self.preParse(data, {});
					ZEN.init(parsedData);
					self.setupObservers();
					self.setupEvents();
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
			ZEN.observe('clicks', null, {},
				function (params) {
					alert('click observer ' + params);
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
