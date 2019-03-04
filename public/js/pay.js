/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),

/***/ 15:
/***/ (function(module, exports) {

var _init;

window.onload = function() {
  var _settings, _ss, cssId, data, head, key, link, req;
  key = _script.getAttribute('key') || null;
  cssId = 'pixelpay';
  if (!document.getElementById(cssId)) {
    head = document.getElementsByTagName('head')[0];
    link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = _maincss;
    link.media = 'all';
    head.appendChild(link);
  }
  if (key === null) {
    return console.warn('The key attribute is not defined');
  } else if (key.length < 9) {
    return console.warn('Please add a valid key/hash attribute');
  }
  if (_ss = sessionStorage.getItem(key)) {
    _settings = JSON.parse(_ss);
    return _init();
  } else {
    data = new FormData();
    data.append('key', key);
    req = ajax('POST', _endpoint + '/settings-response');
    req.onload = function() {
      var json;
      debug("[RESPONSE] Settings response", req);
      json = JSON.parse(req.responseText);
      if (json.success) {
        sessionStorage.setItem(key, JSON.stringify(json.settings));
        _settings = json.settings;
        _init();
      } else {
        return Snackbar.show({
          text: json.message
        });
      }
    };
    req.onerror = function() {
      return Snackbar.show({
        text: _lang.invalid_request
      });
    };
    return req.send(data);
  }
};

_init = function() {
  var _copyright, _dataDescription, _dataEmail, _dataHash, _dataId, _dataName, _dataOnError, _dataOnSuccess, _dataPaymentData, _dataRef, _el, _onAgree, _onPayment, _payments, _sandbox, _terms, amount, cardjs, currencySimbol, modal, total, unclosable;
  debug('=== PIXELPAY READY ===');
  amount = 0.00;
  currencySimbol = _settings.currency_symbol;
  unclosable = false;
  if (_settings === null) {
    return console.warn('The settings is not loaded');
  }
  debug('[OBJECT] Settings', _settings);
  modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeLabel: _lang.close,
    cssClass: ['pay__content', 'pay__object'],
    onOpen: function() {
      return debug("[EVENT] Modal open");
    },
    onClose: function() {
      document.querySelector('.pay__content').classList.remove('loading');
      clearData();
      debug("[EVENT] Modal closed");
    },
    beforeClose: function() {
      return !unclosable;
    }
  });
  modal.setContent(_payTemplate(_settings));
  modal.setFooterContent(location.protocol !== 'https:' ? _unsafe_msj : _safe_msj);
  cardjs = new CardJS.card();
  _el = document.querySelector('.pay__content');
  if (_settings.active_gateway) {
    _el.setAttribute('gateway', _settings.active_gateway);
  }
  _sandbox = document.querySelector('[data-payment-sandbox]');
  _copyright = document.querySelector('.pay__copyright');
  _terms = document.querySelector('[data-terms]');
  _payments = [].slice.call(document.querySelectorAll('[data-payment]'));
  _onPayment = document.querySelector('[data-on-payment]');
  _onAgree = document.querySelector('.pay__agree_checkbox [name="agree"]');
  _dataName = '';
  _dataEmail = '';
  _dataRef = '';
  _dataId = '';
  _dataHash = '';
  _dataDescription = '';
  _dataPaymentData = '';
  _dataOnSuccess = '';
  _dataOnError = '';
  if (typeof _sandbox !== 'undefined' && _sandbox !== null) {
    unclosable = true;
    amount = _sandbox.getAttribute('data-payment-sandbox') * 1.00 || 0.00;
    document.querySelector('body').classList.add('pay__sandbox');
    if (total = document.querySelector('.pay__total')) {
      total.innerHTML = currencySimbol + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    _dataName = _sandbox.dataset.name || 'Anonimous';
    _dataEmail = _sandbox.dataset.email || false;
    _dataDescription = _sandbox.dataset.description || false;
    _dataId = _sandbox.dataset.uuid || false;
    _dataHash = _sandbox.dataset.hash || false;
    if (_dataEmail) {
      document.querySelector('.email').value = _dataEmail;
    }
    if (_sandbox.dataset.emailHidden) {
      document.querySelector('.email').setAttribute('type', 'hidden');
    }
    setTimeout((function() {
      return modal.open();
    }), 1000);
  }
  _copyright.onclick = function(ev) {
    var left, newwindow, top;
    debug('[EVENT] Copyright Click');
    ev.preventDefault();
    left = (screen.width / 2) - (922 / 2);
    top = (screen.height / 2) - (433 / 2);
    newwindow = window.open(this.getAttribute('href'), 'SSL Security', 'height=433,width=933,top=' + top + 'left=' + left);
    if (window.focus) {
      newwindow.focus();
    }
    return false;
  };
  _terms.onclick = function(ev) {
    var app_hash, app_key, left, newwindow, top;
    debug('[EVENT] Terms and Conditions');
    ev.preventDefault();
    app_key = _script.getAttribute('key');
    app_hash = _script.getAttribute('hash');
    left = (screen.width / 2) - (922 / 2);
    top = (screen.height / 2) - (433 / 2);
    newwindow = window.open(_endpoint + '/terms?key=' + app_key, 'height=433,width=933,top=' + top + 'left=' + left);
    if (window.focus) {
      newwindow.focus();
    }
    return false;
  };
  _onAgree.onchange = function(ev) {
    debug("[EVENT] Agreement changed");
    if (this.checked) {
      return _onPayment.setAttribute('disabled', false);
    } else {
      return _onPayment.setAttribute('disabled', true);
    }
  };
  _onPayment.onclick = function(ev) {
    var _acceptedCards, ex, gatewayActive, pay, req, validation;
    debug("[EVENT] Payment process clicked");
    ev.preventDefault();
    if (this.getAttribute('disabled') === 'true') {
      return true;
    }
    gatewayActive = _settings.active_gateway;
    _acceptedCards = ['Visa', 'Mastercard', 'Visa Electron', 'AMEX'];
    debug('[STATS] Active gateway: ' + gatewayActive);
    if (gatewayActive === 'paypal') {
      _el.innerHTML += _paypalIpnTemplate(_dataDescription, amount, _settings);
      _el.querySelector('#send-paypal').submit();
      Snackbar.show({
        text: _lang.paypal_ipn_send
      });
      return true;
    }
    try {
      validation = cardjs.getDataAndValidate(_acceptedCards);
    } catch (error) {
      ex = error;
      Snackbar.show({
        text: ex.message
      });
    }
    if (validation) {
      _el.classList.add('loading');
      pay = new FormData();
      pay.append('key', _script.getAttribute('key'));
      pay.append('hash', _script.getAttribute('hash'));
      pay.append('salt', abcitize(guid() + '|' + validation));
      pay.append('amount', amount);
      pay.append('gateway', gatewayActive);
      pay.append('card', cardjs.getCardType());
      pay.append('email', cardjs.getEmail());
      pay.append('nameholder', cardjs.getName());
      pay.append('name', _dataName);
      pay.append('description', _dataDescription);
      pay.append('currency', _settings.currency);
      pay.append('extra', _dataPaymentData);
      pay.append('ref', _dataRef);
      pay.append('uuid', _dataId);
      pay.append('hash', _dataHash);
      debug('[OBJECT] Payment data', pay);
      req = ajax('POST', _endpoint + '/payment-response');
      req.onload = function() {
        var json;
        json = JSON.parse(req.responseText);
        if (json.success) {
          _el.dataset.paid = 'true';
          document.querySelector('.pay__modal-box').classList.add('pay__success');
          document.querySelector('.pay__step').innerHTML = '<div class="pay__success-payment">' + _lang.success_payment + '</div>';
          _el.classList.remove('loading');
          if (_dataOnSuccess) {
            window["eval"].call(window, '(function (result){' + _dataOnSuccess + '})')(json.data);
          }
        } else {
          Snackbar.show({
            text: json.message
          });
          _el.classList.remove('loading');
          if (_dataOnError) {
            return window["eval"].call(window, '(function (message){' + _dataOnError + '})')(json.message);
          }
        }
      };
      req.onerror = function() {
        Snackbar.show({
          text: _lang.invalid_request
        });
        _el.classList.remove('loading');
        return window["eval"].call(window, '(function (message){' + _dataOnError + '})')(_lang.invalid_request);
      };
      return req.send(pay);
    }
  };
  return _payments.forEach(function(item, pos) {
    debug('[BIND] Payment button bind to click event');
    return item.addEventListener('click', function(ev) {
      debug("[EVENT] Payment button clicked");
      ev.preventDefault();
      if (_el.dataset.paid) {
        modal.open();
        return true;
      }
      amount = this.getAttribute('data-payment') * 1.00 || 0.00;
      if (total = document.querySelector('.pay__total')) {
        total.innerHTML = currencySimbol + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      _dataName = this.dataset.name || 'Anonimous';
      _dataEmail = this.dataset.email || false;
      _dataDescription = this.dataset.description || false;
      _dataRef = this.dataset.ref || false;
      _dataPaymentData = this.dataset.paymentData || false;
      _dataOnSuccess = this.dataset.onSuccess || false;
      _dataOnError = this.dataset.onError || false;
      if (_dataEmail) {
        _el.querySelector('.email').value = _dataEmail;
      }
      if (_dataName) {
        _el.querySelector('.name').value = _dataName;
      }
      if (this.dataset.emailHidden) {
        _el.querySelector('.email').setAttribute('type', 'hidden');
      }
      return modal.open();
    });
  });
};


/***/ })

/******/ });