/**** HELPERS ****/

(function() {
	(function(root, factory) {
		if (typeof define === 'function' && define.amd) {
			define(factory);
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			root.Helper = factory();
		}
	})(this, function() {
		var _h = function (selector, context) {
			var Helper = function () {
				this.nodes = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
			};


			Helper.prototype.first = function () {
				if (this.nodes == null) 
					return this;

				this.nodes = [this.nodes[0]];
				return this;
			};

			Helper.prototype.last = function () {
				if (this.nodes == null || this.nodes.length < 1) 
					return this;
				
				this.nodes = [this.nodes[this.nodes.length - 1]];
				return this;
			};

			Helper.prototype.attr = function (name, value){
				if(!name){
					var attrs = this.nodes[0].attributes,
						list = {};
					
					for (var i = 0; i < attrs.length; i++)
						list[attrs[i].name] = attrs[i].value;

					return list;
				}

				if(!value)
					return this.nodes[0].getAttribute(name);

				for (var i = 0; i < this.nodes.length; i++)
					this.nodes[i].setAttribute(name, value);
				return this;
			}

			Helper.prototype.data = function (name, value){
				if(!name)
					return this.nodes[0].dataset;

				if(!value)
					return this.nodes[0].dataset[name];

				for (var i = 0; i < this.nodes.length; i++)
					this.nodes[0].dataset[name] = value;
				return this;
			}

			Helper.prototype.addClass = function (className) {
				for (var i = 0; i < this.nodes.length; i++)
					this.nodes[i].classList.add(className);

				return this;
			};

			Helper.prototype.removeClass = function (className) {
				for (var i = 0; i < this.nodes.length; i++)
					this.nodes[i].classList.remove(className);
				return this;
			};

			Helper.prototype.fadeIn = function (ms) {
				for (var i = 0; i < this.nodes.length; i++)
					_h.fadeIn(this.nodes[i], ms);
				return this;
			};

			Helper.prototype.fadeOut = function (ms) {
				for (var i = 0; i < this.nodes.length; i++)
					_h.fadeOut(this.nodes[i], ms);
				return this;
			};

			return new Helper();
		};

		_h.serialize = function (data) {
			str = "";
			for (var key in data) {
				if (str != "")
					str += "&";
				str += key + "=" + encodeURIComponent(data[key]);
			}
			return str;
		}

		_h.text = function(text) {
			return text;
		}

		_h.fadeIn = function (elem, ms){
			if(!elem)
				return;

			elem.style.opacity = 0;
			elem.style.filter = "alpha(opacity=0)";
			elem.style.display = null;
			elem.style.visibility = null;

			if(!ms)
				ms = 400;

			var opacity = 0;
			var timer = setInterval( function() {
				opacity += 50 / ms;
				if(opacity >= 1){
					clearInterval(timer);
					opacity = null;
				}
				elem.style.opacity = opacity;
				elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
			}, 50 );
		}

		_h.fadeOut = function (elem, ms){
			if(!elem)
				return;

			if(!ms)
				ms = 400;

			var opacity = 1;
			var timer = setInterval( function() {
				opacity -= 50 / ms;
				if(opacity <= 0){
					clearInterval(timer);
					opacity = 0;
					elem.style.display = "none";
					elem.style.visibility = "hidden";
				}
				elem.style.opacity = opacity;
				elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
			}, 50 );
		}

		window.Helper = window._ = _h;
	});
}).call(this);

/**** CARD LIBRARY ****/
