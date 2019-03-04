var UTF8 = {
    encode: function (strUni) {
        var strUtf = strUni.replace(
            /[\u0080-\u07ff]/g,
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        });
        strUtf = strUtf.replace(
            /[\u0800-\uffff]/g,
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        });
        return strUtf;
    },

    decode: function (strUtf) {
        var strUni = strUtf.replace(
            /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
        function (c) {
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
        });
        strUni = strUni.replace(
            /[\u00c0-\u00df][\u0080-\u00bf]/g,
        function (c) {
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
        });
        return strUni;
    }
};

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

$(document).ready(function() {
	var appPath = $('html').attr('app');

	var modalTerms = new tingle.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: "CLOSE",
		cssClass: ['pixel__modal-terms'],
		onOpen: function() {  },
		onClose: function() {  },
		beforeClose: function() { return true; }
	});

	modalTerms.setContent('<div id="modal-terms"></div>');

	if(_ss = sessionStorage.getItem('pixelpay_button_session')){
		$('[name="_session_id"]').val(_ss);
	}else{
		var sessionID = makeid();
		sessionStorage.setItem('pixelpay_button_session', sessionID);
		$('[name="_session_id"]').val(sessionID);
	}

	if(_rd = localStorage.getItem('pixel_remeber_data')){
		var inputs = JSON.parse(atob(_rd));

		$.each(inputs, function(index, val) {
			if(!val)
				return;

			$('.input-group [name="'+index+'"]').val(val);
			$('.input-group [name="'+index+'"]').parent('.input-group').addClass('input-float');
		});
	}

	if($('.form-error').length){
		$('html, body').animate({
			scrollTop: ($('.form-error').first().offset().top - 50) + 'px'
		}, 'fast');
	}

	$(document).on('card_status', function(event, data, bin) {
		event.preventDefault();

		if(!data && !$('.pay__billing-address').hasClass('pay__hidden'))
			$('.pay__billing-address').addClass('pay__hidden');

		var lastStatus = $('[name="card_status"]').val() == 'valid';
		$('.pay__body [name="card_status"]').val(data ? 'valid' : 'invalid');

		if(!data || data == lastStatus)
			return;

		$('.pay__loader').fadeIn(400);
		$('.pay__billing-address').data('valid-form', true);

		$.get('/api-payments/binlookup/' + bin, {'key': $('.pay__body').data('key')}, function(data) {
			if(!data.success)
				return;

			var countries = [
				{
					code: 'US',
					name:'UNITED STATES'
				},
				{
					code: 'CA',
					name: 'CANADA',
				},
				{
					code: 'MX',
					name: 'MEXICO',
				}
			];

			var resultCountry = $.grep(countries, function(e){ 
				return e.name == data.data.country; 
			});

			if(resultCountry.length > 0){
				$('.pay__billing-address').removeClass('pay__hidden');
				$('[name="billing_country"]').val(resultCountry[0].code);
				$('.pay__billing-address').data('valid-form', true);
			}else{
				$('.pay__billing-address').addClass('pay__hidden');
				$('.pay__billing-address').data('valid-form', false);
			}

			$('.pay__loader').hide();
		});
	});

	$('[data-total]').html(formatNumber($('[name="total"]').val()));

	$('.button-form-container').submit(function(event) {
		$('body').addClass('loading');
		$('.btn-next').text($(this).data('loading-text') || '. . .').attr('disabled', 'disabled');
	});

	$('.input-group [name]').change(function(event) {
		var inputs = {};
		$('.input-group [name]').each(function(index, el) {
			inputs[$(this).attr('name')] = $(this).val();
		});
		localStorage.setItem('pixel_remeber_data', btoa(JSON.stringify(inputs)));
	});

	$('.input-group input').focus(function(event) {
		$(this).parent('.input-group').addClass('input-float input-focus');
	});

	$('.button-form-container [name="option"]').change(function(event) {
		$('[name="price"]').val($(this).data('variant-price'));
		$('[name="qty_limit"]').val($(this).data('variant-qty'));

		updateProductData(1);
	});

	$('[data-plus]').click(function(event) {
		event.preventDefault();

		if($('[name="has_variant"]').val() == 'on' && $('[name="option"]:checked').val() == null){
			Snackbar.show({ 
				text: "Seleccione una opción para continuar", 
				showAction: false,
			});

			return;
		}


		var qty = $('[name="qty"]').val();
		var limit = $('[name="qty_limit"]').val();
		qty++;

		if(limit && qty > limit){
			Snackbar.show({ 
				text: "Ha llegado a la cantidad limite", 
				showAction: false,
			});

			return;
		}

		updateProductData(qty);
	});

	$('[data-minus]').click(function(event) {
		event.preventDefault();
		var qty = $('[name="qty"]').val();
		qty--;

		if(qty < 1)
			return;

		updateProductData(qty);
	});

	$('.input-group input').blur(function(event) {
		if($(this).val().length < 1)
			$(this).parent('.input-group').removeClass('input-float');
		$(this).parent('.input-group').removeClass('input-focus');
	});

	$('.pay__agree a').click(function(event) {
		event.preventDefault();
		$('#modal-terms').html('<div class="loading-block"></div>');
		var mod = $('.pixel__modal-create'), 
			slug = $('.pay__body').data('merchant');

		mod.addClass('loading');
		$('.tingle-modal-box').css('max-width', 320).css('margin', '20px auto');
		modalTerms.open();

		$.ajax({
			url: appPath+'/kernel/terms/' + slug,
			type: 'GET',
			dataType: 'html'
		})
		.done(function(data) {
			$('.tingle-modal-box').css('max-width', 720).css('margin', '20px auto');
			$('#modal-terms').html(data);
			mod.removeClass('loading');
		});
	});

	$('[data-as-billing]').change(function(event) {
		if($(this).is(':checked')){
			$('[name="shipping_as_billing"]').val('yes');
			$('[data-shipping-input]').hide();
		}else{
			$('[name="shipping_as_billing"]').val('no');
			$('[data-shipping-input]').fadeIn(400);
		}
	});


	$('[class*="-wrapper"] input').focus(function(event) {
		$(this).closest('[class*="-wrapper"]').addClass('focus');
		showMessage($(this).attr('data-focus-message'));
		if($(this).closest('[class*="-wrapper"]').hasClass('has-error'))
			showErrorMessage($(this).attr('data-error-message'));
	});
	$('[class*="-wrapper"] input').blur(function(event) {
		$(this).closest('[class*="-wrapper"]').removeClass('focus');
		if($(this).closest('[class*="-wrapper"]').hasClass('has-error'))
			$(this).focus();
		else
			hideMessage();
	});

	$('#pay__agree').change(function(event) {
		if(this.checked){
			$('.btn').attr('disabled', false)
			$('.pay__agree-wrapper').removeClass('has-error');
		}else{
			$('.btn').attr('disabled', true);
		}
	});

	$('.card-number').focus();

	$('.pay__send').click(function(event) {
		event.stopPropagation();
		updateBillingAddress();

		var pay = $('.pay__body'),
			endpoint = '/api-payments';

		if($('[class*="-wrapper"]').hasClass('has-error'))
			return;

		if(pay.data('gateway') != 'paypal' && !$('.pay__card').CardJs('validate'))
			return;

		if($(this).attr('disabled')){
			$('.pay__agree-wrapper').addClass('has-error');
			return showErrorMessage($('.pay__agree-wrapper').attr('data-error-message'));
		}else{
			$('.pay__agree-wrapper').removeClass('has-error');
		}

		// if(!$('.pay__billing-address').data('valid-form')){
		// 	return showErrorMessage("Complete correctamente todos los datos de la dirección de facturación");
		// }

		loading(true);

		switch(pay.data('gateway')){
			case 'bac':				
				if(pay.data('bac-socket') == 'on')
					$('.pay__card').data('cardjs').payWithBacSocket(endpoint);
				else
					$('.pay__card').data('cardjs').payWithBacForm(endpoint);
			break;

			case 'paypal':
				$.get('/api-payments/form/paypal', {
					uuid: $('.pay__body').data('uuid'), 
					key: $('.pay__body').data('key'),
					customer_rtn: $('.pay__rtn-input').val()
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
				$('.pay__card').data('cardjs').payWithStripeSandbox(endpoint);
			break;

			case 'promerica':
				$('.pay__card').data('cardjs').payWithPromericaSandbox(endpoint);
			break;
		}
	});

	//
	// Initialise for all elements with card-js class.
	//
	$(".pay__card").each(function(i, obj) {
		$(obj).CardJs();
	});

	$('[data-input="rtn"]').mask('0000-0000-000000');
	$('[name="billing_zip"]').mask('00000-0000');

	preloadImage(appPath + '/public/images/loading.gif');
	preloadImage(appPath + '/public/images/check_status.gif');
	preloadImage(appPath + '/public/images/check.png');
	preloadImage(appPath + '/public/images/cvv-es.png');
	preloadImage(appPath + '/public/images/cvv-en.png');
	preloadImage(appPath + '/public/images/cvv-amex-es.png');
	preloadImage(appPath + '/public/images/cvv-amex-en.png');
	preloadImage(appPath + '/public/images/focus-card.png');
	preloadImage(appPath + '/public/images/focus-card-cvv.png');
	preloadImage(appPath + '/public/images/error-card.png');
	preloadImage(appPath + '/public/images/error-card-cvv.png');

	setTimeout(function(){
		$('.error-alert').fadeOut();
	},10000);
});

function updateBillingAddress(){
	var billing = {},
		encoded = null,
		formValid = true;

	billing.first_line = $('[name="billing_address"]').val();
	billing.city = $('[name="billing_city"]').val();
	billing.state = $('[name="billing_state"]').val();
	billing.country = $('[name="billing_country"]').val();
	billing.zip = $('[name="billing_zip"]').val();

	if(billing.first_line.isEmpty())
		formValid = false;

	if(billing.city.isEmpty())
		formValid = false;

	if(billing.state.isEmpty())
		formValid = false;

	if(billing.zip.isEmpty())
		formValid = false;

	encoded = JSON.stringify(billing);

	$('[data-input="address"]').val(encoded);
	$('.pay__billing-address').data('valid-form', formValid);
}

function updateProductData(qty){
	$('[name="qty"]').val(qty);
	$('[data-qty]').html(qty);

	$('[name="total"]').val($('[name="price"]').val() * qty);
	$('[data-total]').html(formatNumber($('[name="total"]').val()));
	$('[data-product-price]').html(formatNumber($('[name="price"]').val()));
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

function showPaymentErrorMessage(text){
	$('.error-alert').remove();
	$('.pay__error').after('<div class="error-alert">'+text+'</div>');
}

function hideMessage(){
	$('.pay__message').text('').removeClass('show error shake');
}

function loading(status){
	if(status){
		$('.middle-wrap').fadeOut(400);
		$('.middle').addClass('loading');
	}else{
		$('.middle').removeClass('loading');
		$('.middle-wrap').fadeIn(400);
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

function formatNumber(number){
	number = parseFloat(number);
	return number.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function preloadImage(url){
	var img=new Image();
	img.src=url;
}

function cybs_dfprofiler(merchantID,environment) {
	if (environment.toLowerCase() == 'live')
		var org_id = 'k8vif92e';
	else
		var org_id = '1snn5n9w';

	var sessionID = new Date().getTime();
	var paragraphTM = document.createElement("p");
	str = "";
	str = "background:url(https://h.online-metrix.net/fp/clear.png?org_id=" + org_id + "&session_id=" + merchantID + sessionID + "&m=1)";
	paragraphTM.styleSheets = str;

	document.body.appendChild(paragraphTM);
	var img = document.createElement("img");
	str = "https://h.online-metrix.net/fp/clear.png?org_id=" + org_id + "&session_id=" + merchantID + sessionID + "&m=2";
	img.src = str;
	img.alt = "";
	document.body.appendChild(img);
	var objectTM = document.createElement("object");
	objectTM.data = "https://h.online-metrix.net/fp/fp.swf?org_id=" + org_id + "&session_id=" + merchantID + sessionID;
	objectTM.type = "application/x-shockwave-flash";
	objectTM.width = "1";
	objectTM.height = "1";
	objectTM.id = "thm_fp";

	var param = document.createElement("param");
	param.name = "movie";
	param.value = "https://h.online-metrix.net/fp/fp.swf?org_id=" + org_id + "&session_id=" + merchantID + sessionID;
	objectTM.appendChild(param);
	document.body.appendChild(objectTM);

	var tmscript = document.createElement("script");
	tmscript.src = "https://h.online-metrix.net/fp/tags.js?org_id=" + org_id + "&session_id=" + merchantID + sessionID;
	tmscript.type = "text/javascript";
	document.body.appendChild(tmscript);
	return sessionID;
}