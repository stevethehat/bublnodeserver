"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function View (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Base.call(this, params, parent);
			}
			return this;
		}

		View.prototype = new ZEN.ui.Base();

		_.extend(
			View.prototype,
			{

				init: function (params, parent) {
					this.setLayout(params.layout === undefined ? {} : params.layout);
					this.setPosition(params.position === undefined ? {} : params.position);
					this.setSize(params.size === undefined ? {} : params.size);
					this.setConstraints(params.constraints === undefined ? {} : params.constraints);

					// call the base class init method
					ZEN.ui.Base.prototype.init.call(this, params, parent);

					// set sensible defaults for the root view (the application container)
					if (parent === undefined) {
						this.size.width = this.size.width === 'auto' ? 'max' : this.size.width;
						this.size.height = this.size.height === 'auto' ? 'max' : this.size.height;
						this.position.top = this.position.top === 'auto' ? 0 : this.position.top;
						this.position.left = this.position.left === 'auto' ? 0 : this.position.left;
						ZEN.observe('global.resize', null, this, function () {this.resize(true);});
					}
				},


				ready: function () {
					ZEN.ui.Base.prototype.ready.call(this);
					this.positionChildren();
				},


				resize: function (recurse) {
					var idx;
					if (this.visible === true) {
						if (recurse === true) {
							for (idx = 0; idx < this.children.length; idx++) {
								this.children[idx].resize(recurse);
							}
						}
						this.resizeElement();
						this.repositionElement();
						this.positionChildren();
					}
				},
				
				
				setLayout: function (layout) {
					this.layout = {
						style: layout.style !== undefined ? layout.style : 'vertical',
						align: layout.align !== undefined ? layout.align : 'left'
					};
				},

				
				setPosition: function (position) {
					this.position = {
						top: position.top !== undefined ? position.top : 'auto',
						left: position.left !== undefined ? position.left : 'auto',
						bottom: position.bottom !== undefined ? position.bottom : 'auto',
						right: position.right !== undefined ? position.right : 'auto'
					};

				},

				
				setSize: function (size) {
					this.size = {
						height: size.height !== undefined ? size.height : 'auto',
						width: size.width !== undefined ? size.width : 'auto'
					};
				},

				
				setConstraints: function (constraints) {
					this.constraints = {};
					this.constraints.width = constraints.width !== undefined ? constraints.width : {};
					this.constraints.height = constraints.height !== undefined ? constraints.height : {};
					
					this.constraints.width.min = this.constraints.width.min !== undefined ? constraints.width.min : null;
					this.constraints.width.max = this.constraints.width.max !== undefined ? constraints.width.max : null;
					this.constraints.height.min = this.constraints.height.min !== undefined ? constraints.height.min : null;
					this.constraints.height.max = this.constraints.height.max !== undefined ? constraints.height.max : null;
				},


				show: function (recurse) {
					this.resizeElement();
					this.repositionElement();
					ZEN.ui.Base.prototype.show.call(this, recurse);
				},

				
				resizeElement: function () {
					this.el.height(this.getHeight());
					this.el.width(this.getWidth());
				},

				
				repositionElement: function () {
					this.el.css("top", this.position.top);
					this.el.css("left", this.position.left);
					this.el.css("right", this.position.right);
					this.el.css("bottom", this.position.bottom);
				},


				getWidth: function () {
					switch (this.size.width) {
					case "max":
						if (this.parent && this.parent.getAvailableWidth) {
							return Math.floor(this.parent.getAvailableWidth() / this.parent.countUnknownWidths());
						} else {
							if (this.parent) {
								return this.parent.getElement().width();
							} else {
								return $(window).width();
							}
						}
						break;
					case "auto":
						return this.measureChildren().width;
						break;
					default:
						// return this.getElement().width();
						return this.size.width;
						break;
					}
				},


				getHeight: function () {
					switch (this.size.height) {
					case "max":
						if (this.parent && this.parent.layout.style === 'vertical') {
							if (this.parent.getAvailableHeight) {
								return Math.floor(this.parent.getAvailableHeight() / this.parent.countUnknownHeights());
							} else {
								return this.parent.getElement().height();
							}
						} else {
							if (this.parent) {
								return this.parent.getHeight();
							} else {
								return $(window).height();
							}
						}
						break;
					case "auto":
						return this.measureChildren().height;
						break;
					default:
						return this.size.height;
						break;
					}
				},


				getAvailableWidth: function () {
					var idx, o,
						fixed = 0
					;

					for (idx = 0; idx < this.children.length; idx++) {
						o = this.children[idx];
						if (o.size.width !== "max" && o.position.left === "auto" && o.position.right === "auto") {
							fixed += o.size.width;
						}
					}

					return this.getWidth() - fixed;
				},
				

				countUnknownWidths: function () {
					var idx, o,
						unknown = 0;

					if (this.layout.style === 'horizontal') {
						for (idx = 0; idx < this.children.length; idx++) {
							o = this.children[idx];
							if (o.size.width === "max") {
								unknown++;
							}
						}
						return unknown;
					} else {
						return 1;
					}
				},


				getAvailableHeight: function () {
					var idx, o,
						fixed = 0
					;

					for (idx = 0; idx < this.children.length; idx++) {
						o = this.children[idx];
						if (o.size.height !== "max" && o.position.top === "auto" && o.position.bottom === "auto") {
							fixed += o.getHeight();
						}
					}

					return this.getHeight() - fixed;
				},
				

				countUnknownHeights: function () {
					var idx, o,
						unknown = 0;

					for (idx = 0; idx < this.children.length; idx++) {
						o = this.children[idx];
						if (o.size.height === "max") {
							unknown++;
						}
					}

					return unknown;
				},
				

				measureChildren: function () {
					var idx, o, h, w,
						size = {width: 0, height: 0};
					for (idx = 0; idx < this.children.length; idx++) {
						o = this.children[idx];
						h = o.el.height();
						w = o.el.width();
						if (h > size.height) {
							size.height = h;
						}
						if (w > size.width) {
							size.width = w;
						}
					}
					return size;
				},

				
				positionChildren: function () {
					switch (this.layout.style) {
					case 'vertical':
						this.positionChildrenVertical();
						break;
					case 'horizontal':
						this.positionChildrenHorizontal();
						break;
					}
				},

				
				positionChildrenVertical: function () {
					var idx, o,
						top = 0, left = 0, maxWidth = 0;

					for (idx = 0; idx < this.children.length; idx++) {
						o = this.children[idx];

						if (o.positionChildren) {
							o.positionChildren();
						}

						if (o.position.top === 'auto' && o.position.bottom === 'auto') {
							o.el.css({
								"top": top,
								"left": left
							});
							top += o.getHeight();
							if (o.getWidth() > maxWidth) {
								maxWidth = o.getWidth();
							}
						}
					}

					if (this.size.width === 'auto') {
						this.el.css("width", maxWidth);
					}
				},
				
				
				positionChildrenHorizontal: function () {
					var idx, o,
						top = 0, left = 0, right = 0, maxHeight = 0;

					switch (this.layout.align) {
					case 'right':
						for (idx = this.children.length-1; idx > -1; idx--) {
							o = this.children[idx];

							if (o.positionChildren) {
								o.positionChildren();
							}
							
							if (o.position.left === 'auto' && o.position.right === 'auto') {
								o.el.css({
									"top": top,
									"right": right
								});
								right += o.getWidth();

								if (o.getHeight() > maxHeight) {
									maxHeight = o.getHeight();
								}
							}
						}

						break;
					default:
						for (idx = 0; idx < this.children.length; idx++) {
							o = this.children[idx];

							if (o.positionChildren) {
								o.positionChildren();
							}
							
							if (o.position.left === 'auto' && o.position.right === 'auto') {
								o.el.css({
									"top": top,
									"left": left
								});
								left += o.getWidth();

								if (o.getHeight() > maxHeight) {
									maxHeight = o.getHeight();
								}
							}
						}

						break;
					}
					
					if (this.size.height === 'auto') {
						this.el.css("height", maxHeight);
					}
				}
				
				

			}
		);

		ZEN.registerType('Application',View);
		ZEN.registerType('View',View);

		return {
			View: View
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
