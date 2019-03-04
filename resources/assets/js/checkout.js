if (!String.prototype.toProperCase) {
	(function() {
		String.prototype.toProperCase = function () {
			return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
	})();
}

if (!String.prototype.trim) {
	(function() {
		var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
		String.prototype.trim = function() {
			return this.replace(rtrim, '');
		};
	})();
}

if (!String.prototype.tpl) {
	(function(){
		var Strings = {
			tpl : (function() {
				var regexp = /{([^{]+)}/g;

				return function(str, o) {
					return str.replace(regexp, function(ignore, key){
						return (key = o[key]) == null ? '' : key;
					});
				}
			})()
		};
		
		String.prototype.tpl = function(o) {
			return Strings.tpl(this, o);
		}
	})();
}

(function($) {
	$.fn.goTo = function(offset) {
		offset = offset || 0;
		$('html, body').animate({
			scrollTop: ($(this).offset().top - offset) + 'px'
		}, 'fast');
		return this;
	}
})(jQuery);

(function() {
	(function(root, factory) {
		if (typeof define === 'function' && define.amd) {
			define(factory);
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			root.Checkout = factory();
		}
	})(this, function() {
		window.Checkout = {};
		
		Checkout.clientJS = new ClientJS();
		Checkout.startupErrors = [];
		Checkout.validationsBadges = [];

		Checkout.bin = {};
		Checkout.card = {};
		Checkout.client = {};
		Checkout.customer = {};
		
		Checkout.images = [];

		Checkout.devices = {
			'windows'               : 'windows',
			'macintosh|mac os x'    : 'mac',
			'linux'                 : 'linux',
			'ubuntu'                : 'ubuntu',
			'iphone|ipod|ipad'      : 'ios',
			'android'               : 'android',
		};

		Checkout.getClientDevice = function() {
			var device = 'other';
			Object.keys(Checkout.devices).forEach(function(key) {
				if((new RegExp(key, 'i')).test(Checkout.clientJS.getUserAgentLowerCase()))
					device = Checkout.devices[key];
			});
			return device;
		};

		Checkout.preloadImages = function() {
			for (var i = 0; i < arguments.length; i++) {
				Checkout.images[i] = new Image();
				Checkout.images[i].src = preloadImages.arguments[i];
			}
		};

		Checkout.settleClientData = function(){
			Checkout.client.badges = Checkout.validationsBadges;
			Checkout.client.messages = Checkout.startupErrors;
		};

		Checkout.clearCustomer = function(){
			var rtn = null;
			
			if(Checkout.customer.billing_rtn)
				rtn = Checkout.customer.billing_rtn;

			Checkout.customer = {};

			if(rtn)
				Checkout.customer.billing_rtn = rtn;
		};

		Checkout.addStartupError = function(text){
			Checkout.startupErrors.push(text);
			console.warn(text);
		};

		Checkout.addValidationBadge = function(code){
			Checkout.validationsBadges.push(code);
		};

		Checkout.cardTypeFromNumber = function(number) {
			// Diners - Carte Blanche
			re = new RegExp("^30[0-5]");
			if (number.match(re) != null)
				return "diners";

			// Diners
			re = new RegExp("^(30[6-9]|36|38)");
			if (number.match(re) != null)
				return "diners";

			// JCB
			re = new RegExp("^35(2[89]|[3-8][0-9])");
			if (number.match(re) != null)
				return "jcb";

			// AMEX
			re = new RegExp("^3[47]");
			if (number.match(re) != null)
				return "amex";

			// Visa Electron
			re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
			if (number.match(re) != null)
				return "visa";

			// Visa
			var re = new RegExp("^4");
			if (number.match(re) != null)
				return "visa";

			// Mastercard
			re = new RegExp("^(5[1-5]|2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720))");
			if (number.match(re) != null)
				return "mastercard";

			// Discover
			re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
			if (number.match(re) != null)
				return "discover";

			return "";
		};
	});
}).call(this);

jQuery(document).ready(function($) {

	// === INIT CHECKOUT ===
	$('.pay__validation').fadeIn(300);
	$('.pay__welcome .pay__welcome-bg').fadeIn(500, function() {
		$('.pay__welcome .pay__welcome-logo').fadeIn(400, loadingStep());
	});

	function loadingStep(){
		checkClientData();
		checkBrowserSecurity();

		checkClientIdentity(function(ok){
			checkPaymentData();

			Checkout.settleClientData();

			changeLoadingMessage(Lang.get('checkout.loading.done'));

			setTimeout(function(){
				$('.pay__validation').hide();
				$('.pay__container').fadeIn(400);
				$('body').addClass('pay__ready');

				// INIT METHODS
				initGeneralFields();
				initCardFields();
				initBillingFields();

				initComponents();
				init3DSecureFrame();
			}, 1000);
		});
	}

	function validatePaymentAndSend(){
		var valid = true;

		if($(this).attr('disabled'))
			return showErrorMessage(Lang.get('checkout.errors.not_agree'));
		else
			hideMessage();

		testCardNumber(fieldName('cc_pan'));
		testExpDate(fieldName('cc_exp'));
		testCvcCode(fieldName('cc_cvc'));
		testCardName(fieldName('cc_name'));
		checkBillingInputs();

		valid = validateInputs();

		if(valid){
			setCardData();

			loading(true);

			$.ajax({
				url: '/api-payments/sale',
				type: 'POST',
				timeout: 10000,
				data: {
					key : getConfig('app_key'),
					uuid : getConfig('payment_uuid'),
					card : Checkout.card,
					customer : Checkout.customer,
					client : Checkout.client 
				}
			}).retry({ 
				times:3,
				timeout: 2000
			}).done(function(data){
				logger('sale', data);
				capturePaymentResponse(data);
			}).fail(function(request, status){
				loading(false);
				showErrorAlert('EXCEPTION');
			});
		}
	}

	function capturePaymentResponse(data){
		var alternativeFields = {
			'card.hash' : 'cc_pan',
			'card.exp' : 'cc_exp',
			'card.cvc' : 'cc_cvc',
			'card.name' : 'cc_name',
			'card.brand' : 'cc_pan',
			'card.bin' : 'cc_pan',
			'card.last' : 'cc_pan',

			'cc_em' : 'cc_exp',
			'cc_ey' : 'cc_exp',
			'cc_cvv' : 'cc_cvc',
			'cc_type' : 'cc_pan',

			'customer_first_name' : 'cc_name',
			'customer_last_name' : 'cc_name',

			'customer.billing_address' : 'billing_address',
			'customer.billing_city' : 'billing_city',
			'customer.billing_state' : 'billing_state',
			'customer.billing_country' : 'billing_country',
			'customer.billing_zip' : 'billing_zip',
		};

		logger('capture_payment', data);

		if(!data.code)
			showErrorAlert('EXCEPTION');

		switch(data.code){
			case '3D_SECURE':
				var elements = {
					key: getConfig('app_key'),
					endpoint: data.endpoint,
					fields: data.fields,
					redirect: data.redirect
				};

				elements = $.param(elements);

				if(getConfig('app_secure_mode') == 'redirect'){
					window.location.replace('/api-payments/secure?' + elements);
				}else{
					loading(false);

					$('#pay__3d-secure').attr('src', '/api-payments/secure?' + elements);

					MicroModal.show('modal-3ds', {
						onShow: function(modal){ 
							$('body').addClass('modal__opened');
							$(modal).addClass('wait-to-close');
						},
						onClose: function(modal){ 
							$('body').removeClass('modal__opened');
							$('#pay__3d-secure').contents().find('body').html('');
							$('#pay__3d-secure').removeAttr('src');
							$('#pay__3d-secure').removeClass('pay__external');
						},
						awaitCloseAnimation: true
					});
				}

			break;

			case 'INVALID_FIELDS':
				var inputSet = false;

				$.each(data.errors, function(index, val) {
					if(index in alternativeFields){
						setInputAsInvalid(alternativeFields[index]);
						inputSet = true;
					}

					if(fieldName(index).length){
						setInputAsInvalid(index);
						inputSet = true;
					}
				});
				
				loading(false);
				checkBillingInputs();

				if(!inputSet)
					showErrorMessage(Lang.get('checkout.response.INVALID_FIELDS'));
			break;

			case 'SUCCESS':
				checkPaidPayment(function(status){ });
			break;

			default:
				loading(false);
				showErrorAlert(data.code);
		}
	}

	// INITIAL CHECKS
	function checkClientData(){
		Checkout.client.fingerprint = Checkout.clientJS.getFingerprint();
		Checkout.client.agent = Checkout.clientJS.getUserAgentLowerCase();
		Checkout.client.browser = Checkout.clientJS.getBrowser();
		Checkout.client.browser_version = Checkout.clientJS.getBrowserVersion();
		Checkout.client.os = Checkout.clientJS.getOS();
		Checkout.client.os_version = Checkout.clientJS.getOSVersion();
		Checkout.client.is_mobile = Checkout.clientJS.isMobile();
		Checkout.client.resolution = Checkout.clientJS.getCurrentResolution();
		Checkout.client.languaje = Checkout.clientJS.getLanguage();
		Checkout.client.device = Checkout.getClientDevice();

		addLoadingBadge('device', 'device_' + Checkout.client.device, false);

		logger('client', Checkout.client);
	}

	function checkBrowserSecurity(){
		changeLoadingMessage(Lang.get('checkout.loading.tls'));

		var explorer = 'default';

		if(Checkout.clientJS.isIE())
			explorer = 'ie';
		if(Checkout.clientJS.isChrome())
			explorer = 'chrome';
		if(Checkout.clientJS.isFirefox())
			explorer = 'firefox';
		if(Checkout.clientJS.isSafari())
			explorer = 'safari';
		if(Checkout.clientJS.isOpera())
			explorer = 'opera';

		logger('browser', explorer);

		addLoadingBadge('browser', 'browser_' + explorer, false);

		if(location.protocol != 'https:'){
			Checkout.addStartupError(Lang.get('checkout.loading.ssl_error'));
			addLoadingBadge('security', 'shield', true);
		}else{
			addLoadingBadge('security', 'shield', false);
		}

		logger('protocol', location.protocol);
	}

	function checkClientIdentity(callback){
		changeLoadingMessage(Lang.get('checkout.loading.identity'));
		addLoadingBadge('identity', 'fingerprint', false);

		callback(true);
	}

	function checkPaymentData(){
		if(fieldName('billing_country').data('country') != '')
			fieldVal('billing_country', fieldName('billing_country').data('country'));

		setBillingToCustomer();
		refreshBillingZip(fieldVal('billing_country'));
	}

	function checkBinNumber(){
		$('.pay__ticket .pay__loader').fadeIn(400);

		var panNumber = fieldName('cc_pan').cleanVal();
		var binID = panNumber.substring(0,6);
		var lastLenght = $('.pay__card').attr('data-cc-brand') == 'amex' ? -5 : -4;
		var last = panNumber.slice(lastLenght);
		var panHash = md5(panNumber);

		$.ajax({
			url: '/api-payments/binlookup/' + binID,
			type: 'GET',
			timeout: 10000,
			data: {
				'key': getConfig('app_key'),
				'pan-hash' : panHash
			}
		}).retry({ 
			times: 3,
			timeout: 2000
		}).done(function(data){
			logger('bin', data);

			if(!data.success)
				return;

			var bin = data.data;

			if(bin.cc_mode){
				Checkout.card.bin = binID;
				Checkout.card.type = bin.cc_mode;
				Checkout.card.last = last;
			}

			if(bin.remember){
				$.each(bin.remember, function(index, val) {
					if(val && val != '')
						fieldVal(index, val);
				});

				setBillingToCustomer();
				refreshBillingZip(fieldVal('billing_country'));
			}else if(bin.country_code){
				var country = bin.country_code.toLowerCase();

				testCountrySelect(country, bin.country, function(val, lastValue){
					Checkout.customer.billing_country = val;
					refreshBillingZip(val);
				});
			}

			$('.pay__form').fadeIn(400);

			Checkout.bin = bin;

			$('.pay__ticket .pay__loader').hide();
		}).fail(function(){
			$('.pay__ticket .pay__loader').hide();

			Checkout.card.bin = binID;
			Checkout.card.last = last;
		});
	}

	function checkBillingInputs(){
		$('.pay__billing-address input').each(function(index, el) {
			if($(this).attr('required')){
				if($(this).val() != '')
					$(this).attr('data-is-valid', true);
				else
					$(this).removeAttr('data-is-valid');
			}
		});
	}

	function checkPaidPayment(callback){
		loading(true);

		$.ajax({
			headers: { 'X-CSRF-TOKEN': getConfig('csrf_token') },
			url: '/api-payments/check',
			type: 'GET',
			data: {
				key: getConfig('app_key'),
				uuid: getConfig('payment_uuid')
			},
			timeout: 10000
		}).retry({ 
			times:3,
			timeout: 2000
		}).done(function(data){
			logger('paid_check', data);

			$('[data-checkout] .pay__content').hide();

			if(data.success){
				$('[data-checkout] .pay__content').html(data.content);
				$('.pay__lazy').lazy({
					afterLoad: function(element) {
						element.addClass('pay__lazy-loaded');
					}
				});

				setTimeout(function(){
					loading(false);
					$('[data-checkout] .pay__content').show();

					if(callback) callback(true);
				}, 100);
			}else{
				loading(false);
				if(callback) callback(false);
			}
		}).fail(function(request, status){
			loading(false);
			if(callback) callback(false);
		});
	}

	// INIT COMPONENTS
	function initGeneralFields(){
		$('.input__container input').focus(function(event) {
			$(this).closest('.input__container').addClass('input__focus');

			if($(this).closest('.input__container').hasClass('input__has-error'))
				showErrorMessage(Lang.get('checkout.' + $(this).attr('data-error-code'), {digits: $(this).attr('maxlength')}));
			else if($(this).attr('data-is-valid') != 'true')
				showMessage(Lang.get('checkout.focus.' + $(this).attr('name')));
			else
				hideMessage();
		});

		$('.input__container input').blur(function(event) {
			$(this).closest('.input__container').removeClass('input__focus');
		});

		$('.input-group input').focus(function(event) {
			var placeholder = $(this).attr('placeholder');
			$(this).parent('.input-group').addClass('input-float input-focus');

			if(!$(this).data('placeholder'))
				$(this).data('placeholder', placeholder);

			$(this).removeAttr('placeholder');
		});

		$('.input-group input').blur(function(event) {
			if($(this).val().length < 1)
				$(this).parent('.input-group').removeClass('input-float');
			$(this).parent('.input-group').removeClass('input-focus');

			if($(this).data('placeholder'))
				$(this).attr('placeholder', $(this).data('placeholder'));
		});
	}

	function initCardFields(){
		var typingTimerName;
		var doneTypingIntervalName = 1000;
		
		fieldName('cc_pan').keyup(function(event) {
			testCardNumber(fieldName('cc_pan'));
		}).change(function(event) {
			testCardNumber(fieldName('cc_pan'));
		}).on('paste', function() {
			setTimeout(function() {
				testCardNumber(fieldName('cc_pan'));
			}, 100);
		});

		fieldName('cc_exp').keyup(function(event) {
			testExpDate(fieldName('cc_exp'));
		});

		fieldName('cc_pan').mask('0000 0000 0000 0000');

		fieldName('cc_exp').mask('00 - 00', {
			onChange: function(cep, event, field){ testExpDate(field) }
		});

		fieldName('cc_cvc').mask('000', {
			onChange: function(cep, event, field){
				clearTimeout(typingTimerName);
				if (field.val())
					typingTimerName = setTimeout(doneTyping, doneTypingIntervalName);

				function doneTyping () {
					testCvcCode(field)
				}
			}
		});

		fieldName('cc_name').mask('P', {
			translation: {P: {
				pattern: /[A-Za-z ]/, 
				recursive: true
			}},
			onChange: function(cep, event, field){
				field.val($.trim(cep) + (/\s+$/.test(cep) ? ' ' : ''));

				clearTimeout(typingTimerName);
				if (field.val())
					typingTimerName = setTimeout(doneTyping, doneTypingIntervalName);

				function doneTyping () {
					testCardName(field);
				}
			}
		});
	}

	function setBillingToCustomer(){
		if(fieldVal('billing_address'))
			Checkout.customer.billing_address = fieldVal('billing_address');

		if(fieldVal('billing_address'))
			Checkout.customer.billing_address = fieldVal('billing_address');

		if(fieldVal('billing_state'))
			Checkout.customer.billing_state = fieldVal('billing_state');

		if(fieldVal('billing_city'))
			Checkout.customer.billing_city = fieldVal('billing_city');

		if(fieldVal('billing_country'))
			Checkout.customer.billing_country = fieldVal('billing_country');

		if(fieldVal('billing_zip'))
			Checkout.customer.billing_zip = fieldVal('billing_zip');

		if(fieldVal('billing_rtn'))
			Checkout.customer.billing_rtn = fieldVal('billing_rtn');

		$('.input-group').each(function(index, el) {
			var input = $(this).find('input');

			if(input.val() && input.val() != '')
				$(this).addClass('input-float');
		});
	}

	function initBillingFields(){
		fieldName('billing_zip').mask('00000-0000');

		fieldName('billing_country').change(function(event) {
			setBillingToCustomer();
			refreshBillingZip($(this).val());
		});

		$('.pay__billing-address .input__container input').on('keyup change', function(event) {
			if($(this).attr('required')){
				if($(this).val() != ''){
					$(this).closest('.input__container').removeClass('input__has-error');
					$(this).removeAttr('data-error-code');
					$(this).attr('data-is-valid', true);

					hideMessage();
				}else{
					$(this).closest('.input__container').addClass('input__has-error');
					$(this).removeAttr('data-is-valid');
					$(this).attr('data-error-code', 'focus.' + $(this).attr('name'));
					showErrorMessage(Lang.get('checkout.focus.' + $(this).attr('name')));
				}
			}
		});

		$('[data-remember]').each(function(index, el) {
			var element = $(this);
			$(this).keyup(function(){
				Checkout.customer[element.attr('name')] = element.val();
			});
		});
	}

	function initComponents(){
		$('.pay__lazy').lazy({
			afterLoad: function(element) {
				element.addClass('pay__lazy-loaded');
			}
		});

		$('#pay__agree').change(function(event) {
			$('.pay__send').attr('disabled', !this.checked);

			if(this.checked){
				$(this).closest('.input__container').removeClass('input__has-error');
				$(this).removeAttr('data-error-code');
				$(this).attr('data-is-valid', true);

				hideMessage();
			}else{
				$(this).removeAttr('data-is-valid');
			}
		});

		$('.pay__send').click(function(event) {
			event.preventDefault();
			validatePaymentAndSend();
		});

		$('.pay__message').click(function(event) {
			event.preventDefault();
			if($(this).closest('.pay__message-container').hasClass('pay__message-fixed'))
				hideMessage();
		});

		$('[data-click-agree]').click(function(event) {
			event.preventDefault();

			if(!document.getElementById("pay__agree").checked)
				$('#pay__agree').prop('checked', true);
		});

		$('[data-terms]').click(function(event) {
			event.preventDefault();
			MicroModal.show('modal-terms', {
				onShow: function(modal){ $('body').addClass('modal__opened') },
				onClose: function(modal){ $('body').removeClass('modal__opened') },
				awaitCloseAnimation: true
			});
		});

		$('.micromodal-slide').removeAttr('style');

		$('.pay__cards').click(function(event) {
			checkPaidPayment(function(status){ });
		});

		window.addEventListener("message", function(e){
			if(~e.origin.indexOf($('html').attr('app'))){
				var response = '';

				try {
					response = decodeURIComponent(e.data);
					response = atob(response);
					response = JSON.parse(response);
				}catch(error) {
					response = {
						success: false,
						message: error,
						code: 'EXCEPTION'
					}
				}

				capturePaymentResponse(response);
				$('#pay__3d-secure').removeClass('pay__external');
				MicroModal.close('modal-3ds');
			}
		}, false);
	}

	function init3DSecureFrame(){
		var secureFrame, 
			ifContentWindow, 
			lastURL, 
			timerRef, 
			response, 
			frameTimer, 
			frameWaitTime,
			frameWaitInterval, 
			doneFrameInterval;

		secureFrame = document.getElementById("pay__3d-secure");
		secureFrame.addEventListener("load", ifOnLoad, true);

		doneFrameInterval = 1000 * 30;
		updateWaitingTime(0);

		try {
			response = decodeURIComponent(getConfig('app_response'));
			response = atob(response);
			response = JSON.parse(response);

			capturePaymentResponse(response);
		}catch(error) {}

		function updateWaitingTime(time){
			frameWaitTime = time;
			var percent = 0;

			if(time != 0)
				percent = ((time * 1000) / doneFrameInterval) * 100;

			$('.modal__wait-progress i').css('width', percent + '%');
		}

		function ifOnLoad(){
			try{
				ifContentWindow = secureFrame.contentWindow;
				ifContentWindow.addEventListener("beforeunload", ifOnUnload, false);
			}catch(er){
				onExternal(true);
			}
		}

		function ifOnUnload(){
			try{
				notify(ifContentWindow.location);
				lastURL = ifContentWindow.location;
				timerRef = setInterval(delayedIFUnload, 5);
			}catch(er){
				onExternal(true);
			}
		}

		function delayedIFUnload(){
			try{
				if(lastURL != ifContentWindow.location){
					notify(ifContentWindow.location);
					clearInterval(timerRef);
				}
			}catch(er){
				onExternal(true);
			}
		}

		function notify(what){
			if(lastURL.host != what.host)
				onExternal(true);
			else
				onExternal(false);
		}

		function onExternal(status){
			if(status)
				$('#pay__3d-secure').addClass('pay__external');
			else
				$('#pay__3d-secure').removeClass('pay__external');

			clearTimeout(frameTimer);
			frameTimer = setTimeout(doneActivity, doneFrameInterval);

			if(frameWaitInterval){
				clearInterval(frameWaitInterval);
				updateWaitingTime(0);
			}

			frameWaitInterval = setInterval(waitIntervalAction, 1000);

			function waitIntervalAction(){
				updateWaitingTime(frameWaitTime+1);
			}

			function doneActivity () {
				$('#modal-3ds').removeClass('wait-to-close');
				clearInterval(frameWaitInterval);
				updateWaitingTime(0);

				if($('body').hasClass('modal__opened')){
					checkPaidPayment(function(status){
						if(!status) showErrorAlert('EXCEPTION');
					});

					MicroModal.close('modal-3ds');
				}
			}
		}
	}

	// TEST VALIDATION FIELDS
	function testCardNumber(el){
		var number = el.val();
		var brand = Checkout.cardTypeFromNumber(number);
		var cvcEl = fieldName('cc_cvc');
		var validCards = el.data('valid-cards');
		var lastBrand = $('.pay__card').attr('data-cc-brand');

		if(number == el.data('last'))
			return;

		el.data('last', number);

		$('.pay__card').attr('data-cc-brand', brand);

		if(lastBrand != brand){
			if(brand == 'amex'){
				el.mask('0000 000000 00000');
				el.attr('maxlength', 17);
				cvcEl.mask('0000', { 
					onChange: function(cep, event, field){
						clearTimeout(typingTimerName);
						if (field.val())
							typingTimerName = setTimeout(doneTyping, doneTypingIntervalName);

						function doneTyping () {
							testCvcCode(field)
						}
					}
				});
				cvcEl.attr('maxlength', 4);
			}else if(brand == 'diners'){
				el.mask('0000 0000 0000 00');
				el.attr('maxlength', 17)
				cvcEl.attr('maxlength', 3)
				cvcEl.mask('000', { 
					onChange: function(cep, event, field){
						clearTimeout(typingTimerName);
						if (field.val())
							typingTimerName = setTimeout(doneTyping, doneTypingIntervalName);

						function doneTyping () {
							testCvcCode(field)
						}
					}
				});
			}else{
				el.mask('0000 0000 0000 0000');
				el.attr('maxlength', 19)
				cvcEl.mask('000', { 
					onChange: function(cep, event, field){
						clearTimeout(typingTimerName);
						if (field.val())
							typingTimerName = setTimeout(doneTyping, doneTypingIntervalName);

						function doneTyping () {
							testCvcCode(field)
						}
					}
				}); 
				cvcEl.attr('maxlength', 3)
			}
		}

		if(validCards && brand != '' && validCards.split(',').indexOf(brand) == -1){
			el.closest('.input__container').addClass('input__has-error');
			el.removeAttr('data-is-valid');

			showErrorMessage(Lang.get('checkout.errors.pan_not_allowed'));
			el.attr('data-error-code', 'errors.pan_not_allowed');
			return;
		}else{
			el.closest('.input__container').removeClass('input__has-error');
			el.removeAttr('data-error-code');
			el.removeAttr('data-is-valid');

			hideMessage();
		}

		if(el.attr('maxlength') == number.length){
			if(brand && brand != ''){
				el.closest('.input__container').removeClass('input__has-error');
				el.removeAttr('data-error-code');
				el.attr('data-is-valid', true);

				checkBinNumber();
				hideMessage();
			}else{
				el.closest('.input__container').addClass('input__has-error');
				el.removeAttr('data-is-valid');

				showErrorMessage(Lang.get('checkout.errors.pan_invalid'));
				el.attr('data-error-code', 'errors.pan_invalid');
			}
		}else{
			el.closest('.input__container').removeClass('input__has-error');
			el.removeAttr('data-error-code');
			el.removeAttr('data-is-valid');
		}
	}

	function testExpDate(el){
		var exp = el.val();

		exp = (exp || '').replace(/[^0-9]/g, '');

		if(exp.length == 1 && parseInt(exp) > 1)
			el.val('0' + exp);

		if(exp.length == 4){
			exp = moment(exp, 'MMYY').endOf('month');
			var minExp = moment();
			var maxExp = moment().add('years', 30);
			
			if(exp.isBetween(minExp, maxExp)){
				el.closest('.input__container').removeClass('input__has-error');
				el.removeAttr('data-error-code');
				el.attr('data-is-valid', true);

				hideMessage();
			}else{
				el.closest('.input__container').addClass('input__has-error');
				el.removeAttr('data-is-valid');

				showErrorMessage(Lang.get('checkout.errors.exp_invalid'));
				el.attr('data-error-code', 'errors.exp_invalid');
			}
		}else{
			el.closest('.input__container').removeClass('input__has-error');
			el.removeAttr('data-error-code');
			el.removeAttr('data-is-valid');
		}
	}

	function testCvcCode(el){
		var code = el.val();

		if(code && code != '' && el.attr('maxlength') != code.length){
			el.closest('.input__container').addClass('input__has-error');
			el.removeAttr('data-is-valid');

			showErrorMessage(Lang.get('checkout.errors.cvc_invalid', {digits: el.attr('maxlength')}));
			el.attr('data-error-code', 'errors.cvc_invalid');
		}else{
			el.closest('.input__container').removeClass('input__has-error');
			el.removeAttr('data-error-code');
			el.removeAttr('data-is-valid');

			hideMessage();
		}

		if(el.attr('maxlength') == code.length)
			el.attr('data-is-valid', true);
	}

	function testCardName(el){
		var name = $.trim(el.val());
		var names = name.split(/[\s,]+/);

		if(name && names.length < 2){
			el.closest('.input__container').addClass('input__has-error');
			el.removeAttr('data-is-valid');

			showErrorMessage(Lang.get('checkout.errors.name_invalid'));
			el.attr('data-error-code', 'errors.name_invalid');
		}else{
			el.closest('.input__container').removeClass('input__has-error');
			el.removeAttr('data-error-code');
			el.removeAttr('data-is-valid');

			hideMessage();
		}

		if(names.length > 1)
			el.attr('data-is-valid', true);
	}

	function testCountrySelect(val, name, callback){
		try{
			var selectOptions = document.getElementById('billing_country').options;
			var inOptions = false;
			var lastValue = fieldVal('billing_country') || '';

			logger('billing_country', val);

			$.each(selectOptions, function(i, v){ 
				if(val.toLowerCase() == v.value.toLowerCase()){
					if(v.value.toLowerCase() != lastValue.toLowerCase()){
						$('.row-billing input').val('');
						$('.row-billing .input-group').removeClass('input-float');
						Checkout.clearCustomer();
					}

					fieldVal('billing_country', v.value);

					refreshBillingZip(v.value);
					inOptions = true;

					if(callback) 
						callback(v.value, lastValue);

					return;
				}
			});

			if(!inOptions){
				if(!fieldName('billing_country').find('[data-select-optional]').length)
					fieldName('billing_country').append('<optgroup label="' + Lang.get('checkout.recomended') + '" data-select-optional></optgroup>');

				fieldName('billing_country')
					.find('[data-select-optional]')
					.append('<option val="'+val+'">'+name+'</option>');

				if(val.toLowerCase() != lastValue.toLowerCase()){
					$('.row-billing input').val('');
					$('.row-billing .input-group').removeClass('input-float');
					Checkout.clearCustomer();
				}

				fieldVal('billing_country', val);
				refreshBillingZip(val);

				if(callback) 
					callback(val, lastValue);
			}
		}catch(err){ };
	}

	// HELPERS
	function getConfig(code){
		return $('meta[name="'+code+'"]').attr('content');
	}

	function setCardData(){
		Checkout.card.token = md5(fieldName('cc_pan').cleanVal());
		Checkout.card.hash = btoa(fieldName('cc_pan').cleanVal());
		Checkout.card.exp = fieldName('cc_exp').cleanVal();
		Checkout.card.cvc = fieldName('cc_cvc').cleanVal();
		Checkout.card.name = fieldName('cc_name').cleanVal().toUpperCase();
		Checkout.card.brand = $('.pay__card').attr('data-cc-brand');
	}

	function validateInputs(){
		var valid = true;

		$('[required]').each(function(index, el) {
			var jEl = $(this);
			var errorCode = jEl.attr('data-error-code');

			if(!jEl.attr('data-is-valid')){
				if(!(errorCode && errorCode != ''))
					jEl.attr('data-error-code', 'focus.' + jEl.attr('name'));

				jEl.closest('.input__container').addClass('input__has-error');
				jEl.focus();

				logger('invalid', $(this).attr('name'));
				valid = false;
				return;
			}
		});

		return valid;
	}

	function refreshBillingZip(val){
		if(val && (val.toLowerCase() == 'ca' || val.toLowerCase() == 'canada'))
			fieldName('billing_zip').mask("A0A 0A0");
		else
			fieldName('billing_zip').mask('00000-0000');

		if(isBillingAddressNeeded(val)){
			fieldName('billing_zip').attr('required', 'required');
			fieldName('billing_zip').closest('.input__container').fadeIn(400);
			fieldName('billing_country').closest('.input-group').removeClass('right-0');
			Checkout.customer.billing_zip = fieldVal('billing_zip');
		}else{
			fieldName('billing_zip').removeAttr('required');
			fieldName('billing_zip').closest('.input__container').hide();
			fieldName('billing_country').closest('.input-group').addClass('right-0');
			delete Checkout.customer.billing_zip;
		}
	}

	function changeLoadingMessage(message, error){
		$('.pay__loading-message').fadeTo(0, 0, function(){
			$('.pay__loading-message').html(message);
			$('.pay__loading-message').fadeTo(200, 1);

			if(error)
				$('.pay__loading-message').addClass('pay__warning');
			else
				$('.pay__loading-message').removeClass('pay__warning');
		});
	}

	function addLoadingBadge(code, image, error){
		var badge = $('[data-badge="'+code+'"]');
		var img = badge.find('img');
		var path = getConfig('app_asset') + '/images/badges/' + image + '.svg';
		
		if(error)
			badge.addClass('pay__error-badge');

		if(path != img.attr('src'))
			img.attr('src', path);

		badge.removeClass('pay__pending-badge');

		Checkout.addValidationBadge(code + (error ? '_error' : ''));
	}

	function loading(status){
		if(status){
			$('body').removeClass('pay__ready');
			$('.pay__content').hide();
			$('.pay__loading').show();
		}else{
			$('body').addClass('pay__ready');
			$('.pay__content').show();
			$('.pay__loading').hide();
		}
	}

	function showErrorAlert(type){
		hideMessage();

		$('.pay__alert-message').html(Lang.get('checkout.alert.' + type));
		$('[data-container-alert]').removeClass();
		$('[data-container-alert]').addClass('pay__alert-' + (type || '').toLowerCase());
		$('body').addClass('pay__show-alert');
	}

	function showErrorMessage(text, fixed){
		$('.pay__message-container').addClass('pay__show');
		$('.pay__message').text(text)
			.addClass('pay__message-error')
			.removeClass('pay__shake');

		if(!isElementInViewport($('.pay__message-viewport')) || $('body').hasClass('modal__opened') || Checkout.clientJS.isMobile())
			$('.pay__message-container').addClass('pay__message-fixed');
		else
			$('.pay__message-container').removeClass('pay__message-fixed');

		if(fixed)
			$('.pay__message-container').addClass('pay__message-fixed');

		setTimeout(function(){
			$('.pay__message').addClass('pay__shake');
		}, 100);
	}

	function showMessage(text, fixed){
		$('.pay__message')
			.text(text)
			.removeClass('pay__message-error pay__shake');
			
		$('.pay__message-container').addClass('pay__show');

		if(!isElementInViewport($('.pay__message-viewport')) || $('body').hasClass('modal__opened') || Checkout.clientJS.isMobile())
			$('.pay__message-container').addClass('pay__message-fixed');
		else
			$('.pay__message-container').removeClass('pay__message-fixed');

		if(fixed)
			$('.pay__message-container').addClass('pay__message-fixed');
	}

	function hideMessage(){
		$('.pay__message-container').removeClass('pay__show');
		$('.pay__message').text('').removeClass('pay__message-error pay__shake');
	}

	function setInputAsInvalid(name){
		var el = fieldName(name);

		el.removeAttr('data-is-valid');
		el.attr('data-error-code', 'errors.invalid');
		el.closest('.input__container').addClass('input__has-error');

		if(el.attr('data-open-on-error')){
			if($('[data-checkout]').attr('data-billing') == 'off')
				$('[data-checkout]').attr('data-billing', 'on');

			el.attr('required', 'required');
			el.focus();
		}else{
			fieldName(name).focus();
		}
	}

	function isElementInViewport (el) {
		if (typeof jQuery === "function" && el instanceof jQuery)
			el = el[0];

		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	function isBillingAddressNeeded(country){
		if(!country)
			return;

		if(country != '')
			country = country.toLowerCase();
		else
			return;

		return country == 'canada' 
			|| country == 'mexico' 
			|| country == 'united states'

			|| country == 'ca'
			|| country == 'mx'
			|| country == 'us';
	}

	function fieldVal(name, val){
		if(val)
			return $('[name="' + name + '"]').val(val);
		return $('[name="' + name + '"]').val();
	}

	function fieldName(name){
		return $('[name="' + name + '"]');
	}

	function logger(code, data){
		if(getConfig('app_env') == 'local')
			console.log('['+code+']', data);
	}
});

jQuery(document).ready(function($) {
	if($('.px_mantenaince').length){
		$('.px_mantenaince').addClass('active');

		var countDownDate = new Date($('.px_mantenaince').attr('time')).getTime();
		var x = setInterval(function() {
			var now = new Date().getTime();
			var distance = countDownDate - now;
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			
			document.getElementById("countdown").innerHTML = "Inicia en <b>" + hours + "h "
			+ minutes + "m " + seconds + "s</b>";
			
			if (distance < 0) {
				clearInterval(x);
				document.getElementById("countdown").innerHTML = "En Mantenimiento!";
			}
		}, 1000);
	}

	$('.pay__alert button').click(function(event) {
		$('body').removeClass('pay__show-alert');
	});
});