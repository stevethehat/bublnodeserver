$(function() {

	var url = 'http://localhost:3000/app.json';

	url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
	
	ZEN.data.load(
		url, {},
		function (data) {
			// var app = ZEN.parse(data);
			ZEN.init(data);
		}
	);
	
});
