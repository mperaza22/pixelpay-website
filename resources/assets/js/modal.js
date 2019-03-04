(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.modalbox = factory();
	}
})(this, function() {
	var Modal, _bindEvents, _build, _buildFooter, _findAncestor, _handleClickOutside, _handleKeyboardNav, _recalculateFooterPosition, _unbindEvents, extend, transitionEvent, whichTransitionEvent;
	transitionEvent = whichTransitionEvent;
	Modal = function(options) {
		var defaults;
		defaults = {
			onClose: null,
			onOpen: null,
			beforeClose: null,
			stickyFooter: true,
			footer: true,
			cssClass: ['pay__content'],
			closeLabel: _lang.close,
			closeMethods: ['overlay', 'button', 'escape']
		};
		this.opts = extend({}, defaults, options);
		this.init();
	};
	_recalculateFooterPosition = function() {
		if (!this.modalBoxFooter) {
			return;
		}
		this.modalBoxFooter.style.width = this.modalBox.clientWidth + 'px';
		this.modalBoxFooter.style.left = this.modalBox.offsetLeft + 'px';
	};
	_build = function() {
		this.modal = document.createElement('div');
		this.modal.classList.add('pay__modal');
		if (this.opts.closeMethods.length === 0 || this.opts.closeMethods.indexOf('overlay') === -1) {
			this.modal.classList.add('pay__modal--noOverlayClose');
		}
		this.modal.style.display = 'none';
		this.opts.cssClass.forEach((function(item) {
			if (typeof item === 'string') {
				this.modal.classList.add(item);
			}
		}), this);
		if (this.opts.closeMethods.indexOf('button') !== -1) {
			this.modalCloseBtn = document.createElement('a');
			this.modalCloseBtn.classList.add('pay__modal__close');
			this.modalCloseBtnIcon = document.createElement('span');
			this.modalCloseBtnIcon.classList.add('pay__modal__closeIcon');
			this.modalCloseBtnIcon.innerHTML = '&times;';
			this.modalCloseBtnLabel = document.createElement('span');
			this.modalCloseBtnLabel.classList.add('pay__modal__closeLabel');
			this.modalCloseBtnLabel.innerHTML = this.opts.closeLabel;
			this.modalCloseBtn.appendChild(this.modalCloseBtnIcon);
			this.modalCloseBtn.appendChild(this.modalCloseBtnLabel);
		}
		this.modalBox = document.createElement('div');
		this.modalBox.classList.add('pay__modal-box');
		this.modalBoxContent = document.createElement('div');
		this.modalBoxContent.classList.add('pay__modal-box__content');
		this.modalBox.appendChild(this.modalBoxContent);
		if (this.opts.closeMethods.indexOf('button') !== -1) {
			this.modal.appendChild(this.modalCloseBtn);
		}
		this.modal.appendChild(this.modalBox);
	};
	_buildFooter = function() {
		this.modalBoxFooter = document.createElement('div');
		this.modalBoxFooter.classList.add('pay__modal-box__footer');
		this.modalBox.appendChild(this.modalBoxFooter);
	};
	_bindEvents = function() {
		this._events = {
			clickCloseBtn: this.close.bind(this),
			clickOverlay: _handleClickOutside.bind(this),
			resize: this.checkOverflow.bind(this),
			keyboardNav: _handleKeyboardNav.bind(this)
		};
		if (this.opts.closeMethods.indexOf('button') !== -1) {
			this.modalCloseBtn.addEventListener('click', this._events.clickCloseBtn);
		}
		this.modal.addEventListener('mousedown', this._events.clickOverlay);
		window.addEventListener('resize', this._events.resize);
		document.addEventListener('keydown', this._events.keyboardNav);
	};
	_handleKeyboardNav = function(event) {
		// escape key
		if (this.opts.closeMethods.indexOf('escape') !== -1 && event.which === 27 && this.isOpen()) {
			this.close();
		}
	};
	_handleClickOutside = function(event) {
		// if click is outside the modal
		if (this.opts.closeMethods.indexOf('overlay') !== -1 && !_findAncestor(event.target, 'pay__modal') && event.clientX < this.modal.clientWidth) {
			this.close();
		}
	};
	_findAncestor = function(el, cls) {
		var results;
		results = [];
		while ((el = el.parentElement) && !el.classList.contains(cls)) {
			results.push(el);
		}
		return results;
	};
	_unbindEvents = function() {
		if (this.opts.closeMethods.indexOf('button') !== -1) {
			this.modalCloseBtn.removeEventListener('click', this._events.clickCloseBtn);
		}
		this.modal.removeEventListener('mousedown', this._events.clickOverlay);
		window.removeEventListener('resize', this._events.resize);
		document.removeEventListener('keydown', this._events.keyboardNav);
	};
	extend = function() {
		var i, key;
		i = 1;
		while (i < arguments.length) {
			for (key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
			i++;
		}
		return arguments[0];
	};
	whichTransitionEvent = function() {
		var el, t, transitions;
		t = void 0;
		el = document.createElement('pay__test-transition');
		transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		};
		for (t in transitions) {
			t = t;
			if (el.style[t] !== void 0) {
				return transitions[t];
			}
		}
	};
	Modal.prototype.init = function() {
		if (this.modal) {
			return;
		}
		_build.call(this);
		_bindEvents.call(this);
		document.body.insertBefore(this.modal, document.body.firstChild);
		if (this.opts.footer) {
			this.addFooter();
		}
	};
	Modal.prototype.destroy = function() {
		if (this.modal === null) {
			return;
		}
		_unbindEvents.call(this);
		this.modal.parentNode.removeChild(this.modal);
		this.modal = null;
	};
	Modal.prototype.open = function() {
		var self;
		if (this.modal.style.removeProperty) {
			this.modal.style.removeProperty('display');
		} else {
			this.modal.style.removeAttribute('display');
		}
		document.body.classList.add('pay__enabled');
		this.setStickyFooter(this.opts.stickyFooter);
		this.modal.classList.add('pay__modal--visible');
		self = this;
		if (transitionEvent) {
			this.modal.addEventListener(transitionEvent, (function() {
				if (typeof self.opts.onOpen === 'function') {
					self.opts.onOpen.call(self);
				}
				self.modal.removeEventListener(transitionEvent, handler, false);
			}), false);
		} else {
			if (typeof self.opts.onOpen === 'function') {
				self.opts.onOpen.call(self);
			}
		}
		this.checkOverflow();
	};
	Modal.prototype.isOpen = function() {
		return !!this.modal.classList.contains('pay__modal--visible');
	};
	Modal.prototype.close = function() {
		var close, self;
		if (typeof this.opts.beforeClose === 'function') {
			close = this.opts.beforeClose.call(this);
			if (!close) {
				return;
			}
		}
		document.body.classList.remove('pay__enabled');
		this.modal.classList.remove('pay__modal--visible');
		self = this;
		if (transitionEvent) {
			this.modal.addEventListener(transitionEvent, (function() {
				self.modal.removeEventListener(transitionEvent, handler, false);
				self.modal.style.display = 'none';
				if (typeof self.opts.onClose === 'function') {
					self.opts.onClose.call(this);
				}
			}), false);
		} else {
			self.modal.style.display = 'none';
			if (typeof self.opts.onClose === 'function') {
				self.opts.onClose.call(this);
			}
		}
	};
	Modal.prototype.setContent = function(content) {
		if (typeof content === 'string') {
			this.modalBoxContent.innerHTML = content;
		} else {
			this.modalBoxContent.innerHTML = '';
			this.modalBoxContent.appendChild(content);
		}
	};
	Modal.prototype.getContent = function() {
		return this.modalBoxContent;
	};
	Modal.prototype.addFooter = function() {
		_buildFooter.call(this);
	};
	Modal.prototype.setFooterContent = function(content) {
		this.modalBoxFooter.innerHTML = content;
	};
	Modal.prototype.getFooterContent = function() {
		return this.modalBoxFooter;
	};
	Modal.prototype.setStickyFooter = function(isSticky) {
		if (!this.isOverflow()) {
			isSticky = false;
		}
		if (isSticky) {
			if (this.modalBox.contains(this.modalBoxFooter)) {
				this.modalBox.removeChild(this.modalBoxFooter);
				this.modal.appendChild(this.modalBoxFooter);
				this.modalBoxFooter.classList.add('pay__modal-box__footer--sticky');
				_recalculateFooterPosition.call(this);
				this.modalBoxContent.style['padding-bottom'] = this.modalBoxFooter.clientHeight + 20 + 'px';
			}
		} else if (this.modalBoxFooter) {
			if (!this.modalBox.contains(this.modalBoxFooter)) {
				this.modal.removeChild(this.modalBoxFooter);
				this.modalBox.appendChild(this.modalBoxFooter);
				this.modalBoxFooter.style.width = 'auto';
				this.modalBoxFooter.style.left = '';
				this.modalBoxContent.style['padding-bottom'] = '';
				this.modalBoxFooter.classList.remove('pay__modal-box__footer--sticky');
			}
		}
	};
	Modal.prototype.addFooterBtn = function(label, cssClass, callback) {
		var btn;
		btn = document.createElement('button');
		btn.innerHTML = label;
		btn.addEventListener('click', callback);
		if (typeof cssClass === 'string' && cssClass.length) {
			cssClass.split(' ').forEach(function(item) {
				btn.classList.add(item);
			});
		}
		this.modalBoxFooter.appendChild(btn);
		return btn;
	};
	Modal.prototype.resize = function() {
		console.warn('Resize is deprecated and will be removed in version 1.0');
	};
	Modal.prototype.isOverflow = function() {
		var modalHeight, viewportHeight;
		viewportHeight = window.innerHeight;
		modalHeight = this.modalBox.clientHeight;
		return modalHeight >= viewportHeight;
	};
	Modal.prototype.checkOverflow = function() {
		if (this.modal.classList.contains('pay__modal--visible')) {
			if (this.isOverflow()) {
				this.modal.classList.add('pay__modal--overflow');
			} else {
				this.modal.classList.remove('pay__modal--overflow');
			}
			if (!this.isOverflow() && this.opts.stickyFooter) {
				this.setStickyFooter(false);
			} else if (this.isOverflow() && this.opts.stickyFooter) {
				_recalculateFooterPosition.call(this);
				this.setStickyFooter(true);
			}
		}
	};
	return {
		modal: Modal
	};
});