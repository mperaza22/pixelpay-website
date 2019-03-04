(function($){
	var _script = $('script[src*="/pay.js"]'),

	_template = '<div class="pay__body" data-gateway>' +
		'<div class="pay__message"></div>' +
		'<div class="pay__card card-js" data-capture-name="true">' +
			'<i class="pay__icon"></i>' +
		'</div>' +

		'<div class="pay__ticket pay__ticket-card">' +
			'<p>' +
				'<span class="customer-name" data-customer-name></span>' +
				'<small class="customer-email" data-customer-email></small>' +
			'</p>' +
			'<h4 class="no-margin" data-payment-amount>L0.00</h4>' +
			'<div class="pay__agree">' +
				'<div class="pay__agree-wrapper" data-error-message="' + _lang.agree_message + '">' +
					'<input type="checkbox" name="agree" id="pay__agree">' +
					'<label for="pay__agree">' + _lang.agree + '</label>' +
				'</div>' +
				'<p class="pay__no-save">La información de las tarjetas nunca son guardadas y la transacción es <span>segura</span> y <span>encriptada</span>.</p>' +
			'</div>' +
		'</div>' +

		'<div id="pay__error"></div>' +

		'<a href="#" class="btn" id="pay__submit" disabled="disabled">' + _lang.pay + '</a>' +
	'</div>' + 
	'<div class="pay__data" style="display:none"></div>' +
	'<div class="pay__loading" style="display:none"></div>' +
	'<div class="pay__terms-content" style="display:none"></div>' + 
	'<div class="pay__error-validation" style="display:none">' +
		'<h3>Este cobro no puede realizarse</h3>' +
		'<p>Al parecer este cobro o sitio no pasa las pruebas de seguridad.</p>' +
		'<div class="pay__validations">' + 
		'<span class="pay__ft-label pay__ft-ssl">'+_lang.verify_ssl+'</span>' +
		'<span class="pay__ft-label pay__ft-browser">'+_lang.verify_browser+'</span>' +
		'<span class="pay__ft-label pay__ft-crypto">'+_lang.verify_crypto+'</span>' +
		'</div>' +
	'</div>' +
	'<div class="pay__paid-content" style="display:none"></div>', 

	_footer_template = '<div class="pay__footer"><div class="pay__footer-wrap">' +
		'<span class="pay__powered"><a href="https://pay.pixel.hn" target="_blank">' +
		'</a></span>' +
	'</div></div>',

	_local_endpoint = 'http://pixelpay.test/api-payments',
	_local_maincss = 'http://pixelpay.test/public/css/pay.css',
	_local_domain = 'http://pixelpay.test/',

	_endpoint = 'https://pay.pixel.hn/api-payments',
	_maincss = 'https://pay.pixel.hn/public/css/pay.css',
	_prod_domain = 'https://pay.pixel.hn/',

	_key = _script.attr('key'),
	_env = _script.attr('env') || 'prod',
	_debug = _script.attr('debug'),
	_cssId = 'pixelpay',
	_settings = {},
	_payment = {},

	_modalTerms = new modalbox.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: _lang.close,
		cssClass: ['pixel__modal-terms'],
		onOpen: function() {  },
		onClose: function() { $('body').addClass('pay__enabled') },
		beforeClose: function() { return true; }
	}),

	_modal = new modalbox.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: _lang.close,
		cssClass: ['pixel__modal-payment'],
		onOpen: function() { },
		onClose: function() { _payment = {}; },
		beforeClose: function() { 
			if($('.pay__body').attr('locked'))
				return false;
			return true;
		}
	}),

	methods = {
		init : function(options) {
			$(this).click(function(event) {
				event.preventDefault();

				$(this).data('uuid', _key + '-' + $(document).pixelpay('generateUUID'));
				var data = $(this).data();

				if($(this).hasClass('pay__disabled') || $(this).attr('disabled'))
					return;

				$('.pay__ft-crypto').removeClass('pay__valid').html(_lang.verify);
				
				loading(true);
				$('.pay__error-validation').hide();
				$('.pay__paid-content').hide();

				if($(this).data('order'))
					_payment.uuid = _key + '-' + $(this).data('order');
				else
					_payment.uuid = data.uuid;

				_payment.amount = data.payment || 0.00;
				_payment.tax = data.tax || 0.00;
				_payment.shipping = data.shipping || 0.00;
				_payment.description = data.description || '';

				_payment.name = data.customerName || '';
				_payment.email = data.customerEmail || '';
				_payment.phone = data.customerPhone || '';

				_payment.return = data.returnUrl;
				_payment.cancel = data.cancelUrl || window.location.href;

				_payment.success = data.success;
				_payment.successURL = data.successUrl;
				_payment.extra = data.paymentExtra || {};


				try{
					$(document).on('successAction', function(event) {
						debug("[EVENT] Success loaded", _payment.success);

						if(_payment.success)
							window.eval.call(window,'(function (result){'+_payment.success+'})')(event);

						if(_payment.successURL){
							var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

							if(regex.test(_payment.successURL))
								location.href = _payment.successURL;
						}
					});

					var dirtyJson = eval('('+data.paymentExtra+')');
					_payment.extra = JSON.stringify(dirtyJson);
				}catch(e){ }

				var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

				if(_payment.amount < 1)
					return debug('[LOAD] Amount error');

				if(_payment.name.length < 4)
					return debug('[LOAD] Customer name error');

				if(!emailReg.test(_payment.email))
					return debug('[LOAD] Customer email error');

				$('.pay__body').data('token', Base64.encode(JSON.stringify(_payment)));
				$('.pay__body').data('uuid', _payment.uuid);

				$('.pay__body [data-customer-name]').text(_payment.name.toUpperCase());
				$('.pay__body [data-customer-email]').text(_payment.email);

				$('.pay__body [data-payment-amount]').text(formatPrice(_payment.amount, _settings.currency));

				$.get(getEndpoint() + '/check', {
					uuid: _payment.uuid, 
					key: _key
				}, function(data) {
					loading(false);

					console.log(_payment.uuid,  data)

					debug("[REQUEST] Check payment", data);
					
					if(data.success){
						$('.pay__paid-content').html(data.content);

						$('.pay__loading').hide();
						$('.pay__body').hide();
						$('.pay__paid-content').fadeIn(400);
					}

					$('.pay__ft-crypto').addClass('pay__valid').html(_lang.valid_crypto);

					if ($('.pay__footer').data('invalid')) {
						$('.pay__body').hide();
						$('.pay__paid-content').hide();
						$('.pay__error-validation').fadeIn();
					}

					$('.card-number').focus()
				}).fail(function() {
					$('.pay__ft-crypto').addClass('pay__invalid').html(_lang.invalid_crypto);
					$('.pay__footer').data('invalid', true);
				});

				debug("[EVENT] Button clicked", _payment);

				_modal.open();
			});
			// END CLICK
		},
		show : function( ) {  },
		hide : function( ) {  },
		update : function( content ) {  },
		error: function(message){
			Snackbar.show({
				text: message,
				actionText: 'X',
				actionTextColor: '#eee',
				customClass: 'error',
				duration: 50000
			})
		},

		generateUUID : function() {
			var d = new Date().getTime();
			if (typeof performance !== 'undefined' && typeof performance.now === 'function')
				d += performance.now();

			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		},

		setSize : function(el, size){
			$(el).find('.pay__modal-box')
			.removeClass('small-box medium-box big-box')
			.addClass(size + '-box');
		},
	};

	_modalTerms.setContent('<div id="pixel__modal-terms"></div>');
	_modal.setContent('<div id="pixel__modal-payment">' + _template + '</div>');

	$('.pixel__modal-payment').append(_footer_template);

	// LOAD JQUERY PLUGIN
	$.fn.pixelpay = function(methodOrOptions) {
		if ( methods[methodOrOptions] ) {
			return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.pixelpay' );
		}
	};

	// LOAD PIXELPAY
	if (!document.getElementById(_cssId)){
		var head  = document.getElementsByTagName('head')[0],
			link  = document.createElement('link');

		link.id   = _cssId;
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = (_env === 'prod') ? _maincss : _local_maincss;
		link.media = 'all';
		
		head.appendChild(link);
	}

	if(_key == null)
		return console.warn('[PIXELPAY] The key attribute is not defined')
	else if(_key.length < 9)
		return console.warn('[PIXELPAY] Please add a valid key/hash attribute')

	if(_ss = sessionStorage.getItem(_key)){
		_settings = JSON.parse(_ss);
		_init();
	}else{
		$.get(getEndpoint() + '/settings', { key: _key }, function(data){
			debug("[RESPONSE] Settings response", data);

			if(data.success){
				sessionStorage.setItem(_key, JSON.stringify(data.settings));
				_settings = data.settings;
				_init();
			}else{
				console.warn(data.message)
			}
		});
	}

	function debug(message, object){
		if(_debug == 'true' || _debug){
			if(object) 
				console.warn(message, object);
			else
				console.warn(message);
		}
	}

	function showMessage(text){
		$('.pay__message').text(text).addClass('show');
	}

	function showErrorMessage(text){
		$('.pay__message').text(text)
		.addClass('show error')
		.removeClass('shake');

		setTimeout(function(){
			$('.pay__message').addClass('shake');
		}, 100);
	}

	function hideMessage(){
		$('.pay__message').text('').removeClass('show error shake');
	}

	function formatPrice(amount, currency){
		var simbol = 'USD';

		if(currency === 'USD')
			simbol = '$';

		if(currency === 'HNL')
			simbol = 'L.';

		amount = parseFloat(amount);
		amount = amount.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

		return simbol+amount;
	}

	function abcitize(str){
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
	}

	function getEndpoint(){
		return (_env === 'prod') ? _endpoint : _local_endpoint;
	}

	function _init(){
		var body = $('.pay__body'),
			mainUrl = (_env === 'prod') ? _prod_domain : _local_domain;

		body.data('gateway', _settings.gateway);
		body.data('currency', _settings.currency);
		body.data('merchant', _settings.company.slug);
		body.data('hash', Base64.decode(_settings.token));
		body.data('key', _key);

		$(".pay__card").CardJs();

		preloadImage(mainUrl + 'public/images/loading.gif');
		preloadImage(mainUrl + 'public/images/check_status.gif');
		preloadImage(mainUrl + 'public/images/check.png');
		preloadImage(mainUrl + 'public/images/cvv-es.png');
		preloadImage(mainUrl + 'public/images/cvv-en.png');
		preloadImage(mainUrl + 'public/images/cvv-amex-es.png');
		preloadImage(mainUrl + 'public/images/cvv-amex-en.png');
		preloadImage(mainUrl + 'public/images/focus-card.png');
		preloadImage(mainUrl + 'public/images/focus-card-cvv.png');
		preloadImage(mainUrl + 'public/images/error-card.png');
		preloadImage(mainUrl + 'public/images/error-card-cvv.png');

		if(_settings.gateway == 'bac'){
			if(_settings.bac_valid_cards == 'on')
				$('.pay__powered a').html('<img src="'+mainUrl+'public/images/secure/powered-limit.png" alt="Paga seguro con PixelPay&reg;" class="pay__pixelpay" height="28">');
			else
				$('.pay__powered a').html('<img src="'+mainUrl+'public/images/secure/powered-all.png" alt="Paga seguro con PixelPay&reg;" class="pay__pixelpay" height="28">');
		}else if(_settings.gateway == 'promerica'){
			$('.pay__powered a').html('<img src="'+mainUrl+'public/images/secure/powered-limit.png" alt="Paga seguro con PixelPay&reg;" class="pay__pixelpay" height="28">');
		}else{
			$('.pay__powered a').html('<img src="'+mainUrl+'public/images/secure/powered-all.png" alt="Paga seguro con PixelPay&reg;" class="pay__pixelpay" height="28">');
		}

		$('.pay__footer-wrap').append('<div class="pay__cards"><img src="'+mainUrl+'public/images/secure/'+_settings.gateway+'.png" height="34" alt=""></div>');

		if(_script.attr('opacity'))
			$('.pixel__modal-payment').css('background-color', 'rgba(255,255,255, '+_script.attr('opacity')+')');

		if(_settings.gateway == 'paypal'){
			$('.pay__ticket')
				.prepend('<div class="pay__paypal-logo"></div><hr />')
				.removeClass('pay__ticket-card')
				.addClass('pay__ticket-paypal');
			$('.card-js').remove();
		}

		$.get('https://www.howsmyssl.com/a/check', function(data){
			var version = data.tls_version.split(' ');
			if(version[0] != 'TLS' || version[1] < 1.2){
				debug('[VERIFY] So bad! Your browser only supports ' + data.tls_version + '. Please upgrade to a browser with TLS 1.2 support.')
				$('.pay__ft-browser').addClass('pay__invalid').html(_lang.invalid_browser);
				$('.pay__footer').data('invalid', true);
			}else{
				debug('[VERIFY] All OK. Your browser supports ' + data.tls_version + '.');
				$('.pay__ft-browser').addClass('pay__valid').html(_lang.valid_browser);

				var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+
				var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
				var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)); // Safari 3.0+ "[object HTMLElementConstructor]" 
				var isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
				var isEdge = !isIE && !!window.StyleMedia; // Edge 20+
				var isChrome = !!window.chrome && !!window.chrome.webstore; // Chrome 1+

				if(isOpera)
					$('.pay__ft-browser').addClass('pay__valid-opera');

				if(isFirefox)
					$('.pay__ft-browser').addClass('pay__valid-firefox');

				if(isSafari)
					$('.pay__ft-browser').addClass('pay__valid-safari');

				if(isIE)
					$('.pay__ft-browser').addClass('pay__valid-explorer');

				if(isEdge)
					$('.pay__ft-browser').addClass('pay__valid-edge');

				if(isChrome)
					$('.pay__ft-browser').addClass('pay__valid-chrome');
			}
		});

		if(location.protocol != 'https:'){
			$('.pay__ft-ssl').addClass('pay__invalid').html(_lang.invalid_ssl);
			if(_env != 'local') 
				$('.pay__footer').data('invalid', true);
		}else
			$('.pay__ft-ssl').addClass('pay__valid').html(_lang.valid_ssl);

		if($('.pay__badge').length)
			$('.pay__badge').addClass('pay__badge-' + _settings.gateway);

		$('.pay__badge').click(function(event) {
			window.open('https://pay.pixel.hn');
		});

		$('#pay__agree').change(function(event) {
			if(this.checked){
				$('.btn').attr('disabled', false)
				$('.pay__agree-wrapper').removeClass('has-error');
			}else{
				$('.btn').attr('disabled', true);
			}
		});

		$('.pay__body [data-terms]').click(function(event) {
			loading(true);

			$.get(getEndpoint() + '/terms', {key:_key}, function(data){
				if(data.success){
					loading(false);
					$('#pixel__modal-terms').html(data.content);
					$('.pay__terms-content').html(data.content);
					_modalTerms.open();
				}
			});
		});

		$('#pay__submit').click(function(event) {
			event.preventDefault();

			if($('[class*="-wrapper"]').hasClass('has-error'))
				return;

			if($('.pay__body').data('gateway') != 'paypal' && !$('.card-js').CardJs('validate'))
				return;

			if($(this).attr('disabled')){
				$('.pay__agree-wrapper').addClass('has-error');
				return showErrorMessage($('.pay__agree-wrapper').attr('data-error-message'));
			}else{
				$('.pay__agree-wrapper').removeClass('has-error');
			}

			loading(true);

			switch(_settings.gateway){
				case 'bac':
					loading(true, true)
					$('.pay__card').data('cardjs').payWithBacFrame(getEndpoint());
				break;

				case 'paypal':
					$.get(getEndpoint() + '/form/paypal', {
						uuid: $('.pay__body').data('uuid'), 
						key: $('.pay__body').data('key'),
						token: $('.pay__body').data('token')
					}, function(data) {
						if(data.success){
							$('.pay__data').html(data.content);
							$('#paypal-form').submit();
						}else{
							showPaymentErrorMessage(data.message);
							loading(false);
						}
					});
				break;

				case 'stripe':
					$('.pay__card').data('cardjs').payWithStripe(getEndpoint());
				break;
			}
		});
	}

	window.addEventListener("message", function(e){
		var origin = 'https://pay.pixel.hn';

		if(_env != 'prod')
			origin = 'http://pixelpay.test';

		if(~e.origin.indexOf(origin)){
			if(e.data == 'success')
				$.get(getEndpoint() + '/check', {
					uuid: $('.pay__body').data('uuid'), 
					key: $('.pay__body').data('key')
				}, function(data) {
					if(data.success){
						$('.pay__paid-content').html(data.content);

						$('.pay__loading').hide();
						$('.pay__body').hide();
						$('.pay__paid-content').fadeIn(400);

						$(document).trigger('successAction');
					}else
						showPaymentErrorMessage(data.message);
				});

			if(e.data.search("error:") >= 0)
				showError(e.data.replace('error:', ''))
		}

		loading(false);
	}, false);

	$('[data-payment]').pixelpay();
}( jQuery ));

function showError(message){
	$('.pay__loading').hide();
	$('.pay__body').fadeIn(400);

	$('#pay__error').html('<div class="pay__error-alert">'+message+'</div>').fadeIn();
}

function showPaymentErrorMessage(text){
	$('.pay__error-alert').remove();
	$('.pay__ticket').after('<div class="pay__error-alert">'+text+'</div>');
}

function loading(status, frame){
	if(status){
		$('.pay__body').hide();
		if(frame){
			$('.pay__loading').hide();
			$('.pay__data').show();
		}else
			$('.pay__loading').fadeIn(400);
		$('.pay__body').attr('locked', true);
	}else{
		$('.pay__loading').hide();
		$('.pay__body').fadeIn(400);
		$('.pay__body').removeAttr('locked');
		$('.pay__data').hide();
	}
}

function sluglify(text){
	return text.toString()
	.toLowerCase()
	.replace(/\s+/g, '-')
	.replace(/[^\w\-]+/g, '')
	.replace(/\-\-+/g, '-')
	.replace(/^-+/, '')
	.replace(/-+$/, '');
}

function preloadImage(url){
	var img=new Image();
	img.src=url;
}