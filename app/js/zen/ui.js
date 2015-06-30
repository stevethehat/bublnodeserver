"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		var instanceCount = 0;

		
		function Base (params, parent) {
			if (arguments.length > 0) {
				this.init(params, parent);
			}
			return this;
		}

		
		Base.prototype = {
			init: function (params, parent) {
				this.type = params.type;
				this.id = params.id === undefined ? 'zen-'+this.type+'-'+instanceCount : params.id;
				instanceCount++;

				this.parent = parent;
				this.baseHTML = '<div/>';
				this.el = null;
				this.children = [];

				this.visible = false;
				
				if (this.parent !== undefined) {
					this.parent.addChild(this);
				}

				this.getElement()
					.css('position', 'absolute')
				;
				if(params.style){
					this.el.css(params.style);
				}
				if(params.class){
					this.el.attr('class', params.class);
				}
				var noChildrenParams = {};
				$.extend(true, noChildrenParams, params)
				if(noChildrenParams['children']){
					delete noChildrenParams['children'];
				}
				this.el.data('params', params);
				this.render(params);

				if (params.colour !== undefined) {
					this.getElement().css('background-color', params.colour);
				}
				if (params.color !== undefined) {
					this.getElement().css('background-color', params.color);
				}

				this.autoShow = params.show === true;
				
				ZEN.notify('objectcreation', { 'id': this.el.attr('id'), 'object': this });
			},
			
			render: function(params){
				//this.el.text(params.type + " ("+this.id+")")
			},

			ready: function (callback) {
				var idx;

				if (this.autoShow === true) {
					this.show(true);
				}

				for (idx = 0; idx < this.children.length; idx++) {
					this.children[idx].ready();
				}
			},
			

			addChild: function (o) {
				this.children.push(o);
				o.getElement().appendTo(this.getElement());
			},
			

			getElement: function () {
				if (this.el === null) {
					//ZEN.log('get element' + this.id + ' = ' + this.baseHTML);
					this.el = $(this.baseHTML);
					this.el.attr('id', this.id);
					this.el.css('overflow', 'hidden');
					if (this.parent) {
						this.el.hide();
						this.el.appendTo(this.parent.el);
					} else {
						this.el.appendTo($('body'));
					}
					
				}

				return this.el;
			},

			
			getWidth: function () {
				return this.getElement().width();
			},
			

			getHeight: function () {
				return this.getElement().height();
			},
			

			show: function (recurse) {
				var idx;

				if (this.parent && this.parent.visible === false) {
					this.parent.show();
				}
				
				if (recurse === true) {
					for (idx = 0; idx < this.children.length; idx++) {
						this.children[idx].show(recurse);
					}
				}					

				this.el.show();
				this.visible = true;
			},


			hide: function (recurse) {
				var idx;
				if (recurse === true) {
					for (idx = 0; idx < this.children.length; idx++) {
						this.children[idx].hide(recurse);
					}
				}					
				this.el.hide();
				this.visible = false;
			},
			

			cleanup: function () {
				var idx;
				for (idx = 0; idx < this.children.length; idx++) {
					this.children[idx].cleanup();
				}
				this.el.remove();
			},
			

			testLoad: function () {
				var self = this;
				ZEN.data.load(
					'data.json', {},
					function (data) {
						ZEN.parse(data, self);
					}
				);
			}
		};


		ZEN.registerType('Control',Base);
		ZEN.registerType('Button',Base);
		ZEN.registerType('SearchInput',Base);
		ZEN.registerType('ListItem',Base);
		

		return {
			Base: Base
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
