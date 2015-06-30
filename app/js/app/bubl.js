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
					ZEN.log(parsedData);
					ZEN.init(parsedData);
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
		}
	};
	
	bublApp.init();	
});
