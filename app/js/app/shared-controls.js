"use strict";
var ZEN = (typeof ZEN === undefined) ? {} : ZEN;

function ContainerControl (params, parent) {
	if (arguments.length > 0) {
 		ZEN.ui.Base.call(this, params, parent);
    }
    return this;
}

ContainerControl.prototype = new ZEN.ui.Base();

_.extend(
	ContainerControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Base.prototype.init.call(this, params, parent);
			},
			render: function () {
				this.addElement('<div/>');
			}
		}
);

function HeaderControl (params, parent) {
	if (arguments.length > 0) {
 		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}

HeaderControl.prototype = new ZEN.ui.View();

_.extend(
	HeaderControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<h1/>').text(params.content).appendTo(this.el);
			}
		}
);


function ButtonControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}

ButtonControl.prototype = new ZEN.ui.View();
_.extend(
	ButtonControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<button/>').text(params.content).appendTo(this.el);
			}
		}
);

function Image (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}
Image.prototype = new ZEN.ui.View();
_.extend(
	Image.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<img/>').attr('src', params.url).appendTo(this.el);
			}
		}
);

function TextControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}
TextControl.prototype = new ZEN.ui.View();
_.extend(
	TextControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<p/>').text(params.content).appendTo(this.el);
			}
		}
);

function ContentSwitcherControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.View.call(this, params, parent);
    }
    return this;
}
ContentSwitcherControl.prototype = new ZEN.ui.View();
_.extend(
	ContentSwitcherControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.View.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<p/>').text(params.content).appendTo(this.el);
			}
		}
);



ZEN.registerType('Container',ContainerControl);
ZEN.registerType('Header',HeaderControl);
ZEN.registerType('Image', Image);
ZEN.registerType('Button', ButtonControl);
ZEN.registerType('Text', TextControl);

console.log(ZEN);
