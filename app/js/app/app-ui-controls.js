"use strict";
var ZEN = (typeof ZEN === undefined) ? {} : ZEN;

function PaletteItemControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}
PaletteItemControl.prototype = new ZEN.ui.View();
_.extend(
	PaletteItemControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				ZEN.log('creating pelette item');
				if(params.icon != undefined){
					var div = $('<div class="paletteItem fa ' + params.icon + ' fa-2x"/>').appendTo(this.el);
					
					$('<span/>').text(params.content).appendTo(div); 	
				} else {
					$('<div class="paletteItem"/>').text(params.content).appendTo(this.el);	
				}
			}
		}
);

function IconControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}
IconControl.prototype = new ZEN.ui.View();
_.extend(
	IconControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				var div = $('<div class="icon fa ' + params.icon + ' fa-2x"/>').appendTo(this.el);
			}
		}
);


ZEN.registerType('PaletteItem', PaletteItemControl);
ZEN.registerType('Icon', IconControl);
