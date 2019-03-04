"use strict";

(function() {
	(function(root, factory) {
		if (typeof define === 'function' && define.amd) {
			define(factory);
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			root.Generator = factory();
		}
	})(this, function() {
		window.Generator = {};

		Generator.generatorResult = function (result){
			if(result.type == 'massive'){
				$('[data-massive-sent]').html(result.sent);
				$('[data-massive-fails]').html(result.log.length);

				$('.massive-fails').empty();
				$.each(result.log, function(index, val) {
					var errors = '';

					$.each(val.errors, function(index, error) {
						errors += '- '+error.join('<br>')+'<br />';
					});

					$('.massive-fails').append('<li>Fila #'+val.row+' - '+(val.name||'???')+'<br /><small class="text-danger">'+errors+'</small></li>');
				});

				$('.card-form').hide();
				$('.card-result').attr('mode', $('#type_unique').val());
				$('.card-result-massive').fadeIn();
			}else{
				$('#payment-url').text(result.url);
				$('[payment-url]').attr('href', result.url);
				$('[data-open-preview]').attr('data-id', result.id);

				$('.card-form').hide();
				$('.card-result').attr('mode', $('#type_unique').val());
				$('.card-result').fadeIn();
			}

		};

		Generator.reloadEmailTemplate = function (){
			if(!document.querySelector('#email-template'))
				return;

			var html = document.querySelector('#email-template').innerHTML;

			html = html.replace(/({\w+})/g, function(word) {
				var wordScape = word.replace(/{/, '').replace(/}/, '');
				if(word == '{url}')
					return word;
				if(word == '{amount}')
					return '<b contenteditable="false" append="'+ Generator.getCurrencySymbol($('[name="currency"]').val())+'" bind="'+wordScape+'" placeholder="'+wordScape+'"></b>';	
				return '<b contenteditable="false" bind="'+wordScape+'" placeholder="'+wordScape+'"></b>';
			});

			document.querySelector('#email-template').innerHTML = html;
		};

		Generator.getCurrencySymbol = function (currency){
			var localCurrency = $('meta[name="app_local_currency"]').attr('content'),
				localCurrencySymbol = $('meta[name="app_local_currency_symbol"]').attr('content');

			if(currency == localCurrency)
				return localCurrencySymbol;

			if(currency == 'USD')
				return '$';
		};

		Generator.addItem = function (e){
			if(e)
				e.preventDefault();

			$('.editable-row tbody').append($('#row-template').html());
			$('.unbind [data-listener]').keyup(Generator.resolveItems);
			$('.unbind [data-delete-row]').click(function(event) {
				event.preventDefault();
				if($('.editable-row .item').size() > 1)
					$(this).closest('.item').remove();
				else
					Pixel.error(Lang.get('admin.actions.delete_one'));
			});
			$('.item').removeClass('unbind');
		};

		Generator.resolveItems = function (e){
			var tableResult = {
				'items': [],
				'subtotal': 0.00,
				'tax': 0.00,
				'total': 0.00
			};

			$('.editable-row').find('.item').each(function(index, el) {
				var trow = $(this).closest('tr'),
					code = trow.find('[data-code]').val(),
					title = trow.find('[data-title]').val(),
					price = trow.find('[data-price]').val().replace(/,/g , ''),
					qty = trow.find('[data-qty]').val().replace(/,/g , ''),
					tax = trow.find('[data-tax]').val().replace(/%/g , '').replace(/,/g , ''),
					total = trow.find('[data-total]'),
					result = 0.00;

				result = Math.round((price * qty) * 100) / 100;
				tableResult.subtotal += Math.round(result * 100) / 100;
				tableResult.tax += ($('[tax-type]').attr('tax-type') == '%') ? Math.round((result * (tax/100)) * 100) / 100 : Math.round(tax * 100) / 100;
				total.text(Generator.formatNumber(result));

				if(title.length > 3 && result > 0)
					tableResult.items.push({
						'code': code,
						'title': title,
						'price': price,
						'qty': qty,
						'tax': tax,
						'total': result
					});
			});

			tableResult.total = Math.round((tableResult.subtotal + tableResult.tax) * 100) / 100;

			$('[data-main-subtotal]').text(Generator.formatNumber(tableResult.subtotal));
			$('[data-main-tax]').text(Generator.formatNumber(tableResult.tax));
			$('[data-main-total]').text(Generator.formatNumber(tableResult.total));

			$('[data-items-count]').text(tableResult.items.length);

			var itemsContent = JSON.stringify(tableResult.items);
			itemsContent = encodeURI(itemsContent);

			$('[name="content"]').val(itemsContent);
			$('[name="tax_amount"]').val(tableResult.tax);
			$('[name="amount"]').val(Generator.formatNumber(tableResult.total));

			var bindEl = $('[bind="amount"]'),
				val = $('[name="amount"]').val();

			if(bindEl.attr('append'))
				val = bindEl.attr('append') + ' ' + val;

			if(bindEl.length)
				bindEl.html(val);
		};

		Generator.formatNumber = function (number){
			return number.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		};
	});

}).call(this);

String.prototype.trunc = String.prototype.trunc || function(n){
	return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
};

// =====================================

$(function() {
	var _re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	var clipboard = new Clipboard('[copy-url]');

	var modalDetails = new tingle.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: "CLOSE",
		cssClass: ['pixel__modal-details'],
		onOpen: function() {
			$('[data-close]').click(function(event) {
				modalDetails.close();
			});
		},
		onClose: function() {  },
		beforeClose: function() { return true; }
	});

	modalDetails.setContent('<div id="modal-details">'+ $('#table-template').html() +'</div>');

	clipboard.on('success', function(e) {
		Snackbar.show({ 
			text: Lang.get('admin.actions.copy'), 
			showAction: false,
			customClass: 'success',
		})
	});

	$('[data-url]').addClass('disabled');

	$('.form-control').on('keyup change', function(event) {
		var bindEl = $('[bind="'+$(this).attr('name')+'"]'),
			val = $(this).val();

		if(bindEl.attr('append'))
			val = bindEl.attr('append') + ' ' + val;

		if(bindEl.length)
			bindEl.html(val);
	});

	$('.manage-details').click(function(event) {
		modalDetails.open();
	});

	$('[name="amount"]').maskMoney();
	$('[name="tax_amount"]').maskMoney();

	$('[name="type"]').change(function(event) {
		if($(this).val() == 'unique'){
			$('.type_unique').fadeIn();
			$('.type_massive').hide();
		}else{
			$('.type_unique').hide();
			$('.type_massive').fadeIn();
		}
	});

	$('#file').change(function(event) {
		$(this).parse({
			config: {
				skipEmptyLines: true,
				header: false,
				complete: function(results, file){
					if(results.data){
						$.importBehavior.onLoadFile(results.data);
					}
				}
			}
		});
	});

	$('[type="file"]').click(function(event) {
		if(!$(this).is(':focus'))
			event.preventDefault();
	});

	$('.inputfile').change(function(event) {
		var files = event.target.files;
		for (var i = 0, f; f = files[i]; i++) {
			$(this).next().html('<i class="mdi mdi-file"></i>'+f.name.trunc(25))
		}
	});

	$('.new-payment').click(function(event) {
		$('.card-result').hide();
		$('.card-form').fadeIn();

		$('#generator')[0].reset();
		$('[type="file"]').val('').next().html('<i class="mdi mdi-upload"></i> ' + Lang.get('admin.buttons.upload_placeholder'));

		$('.editable-row tbody').empty();
		Generator.addItem(event);
	});

	Generator.reloadEmailTemplate();

	$('.radio-selector input[type="radio"]:first-child').click();

	$('[data-price]').mask('0,000,000.00', {reverse: true});
	$('[data-tax]').mask('00%', {reverse: true});
	$('[data-qty]').mask('0,000', {reverse: true});
	$('[name="phone"]').mask('0000-0000');

	$('[name="send_email"], [name="send_sms"]').change(function(event) {
		if($(this).is(":checked"))
			$('#' + $(this).attr('name')).fadeIn(200);
		else
			$('#' + $(this).attr('name')).hide();
	});

	$('.unbind [data-listener]').keyup(Generator.resolveItems);

	$('[add-row]').click(Generator.addItem);

	$('.activate-details [type="checkbox"]').change(function(event) {
		if($(this).is(':checked')){
			$('.manage-details-wrap').fadeIn();
			$('.tax-wrap').hide();
			$('[name="amount"]').hide();
			$('[data-main-total]').fadeIn();
			Generator.resolveItems(event);
		}else{
			$('.manage-details-wrap').hide();
			$('.tax-wrap').fadeIn();
			$('[name="amount"]').fadeIn();
			$('[data-main-total]').hide();
			$('[name="amount"]').removeClass('disabled').val(null);
			$('[name="tax_amount"]').val(null);
		}
	});

	$('.activate-tax [type="checkbox"]').change(function(event) {
		if($(this).is(':checked')){
			$('.tax-wrap-input').fadeIn();
		}else{
			$('.tax-wrap-input').hide();
		}
	});

	$('[tax-type]').click(function(event) {
		event.preventDefault();

		if($(this).attr('tax-type') == '%'){
			var icon = $(this).attr('tax-type-token');
			console.log(icon)
			$(this).attr('tax-type', icon);
			$(this).find('.btn-round').text(icon);
			$('[data-tax]').mask('000,000.00', {reverse: true}).attr('placeholder', icon + '0.00');
		}else{
			$(this).attr('tax-type', '%');
			$(this).find('.btn-round').text('%');
			$('[data-tax]').mask('00%', {reverse: true}).attr('placeholder', '0%');
		}

		Generator.resolveItems(event);
	});

	$('[data-edit]').click(function(event) {
		if($(this).attr('loaded'))
			return;

		$(this).attr('loaded', true);

		var text = $(this).text();

		$(this).empty();

		var input = $('<input/>')
		.addClass('form-control form-control-inline')
		.attr({
			value: text,
			type: $(this).attr('data-type'),
			name: $(this).attr('data-edit')
		});

		$(this).append(input);

		input.focus();
	});

	$('[name="currency"]').change(function(event) {
		var localCurrency = $('meta[name="app_local_currency"]').attr('content'),
			localCurrencySymbol = $('meta[name="app_local_currency_symbol"]').attr('content');

		if($(this).val() == 'USD'){
			$('[bind="amount"]').attr('append', '$');
			$('.currency_indicator').html('$');
		}

		if($(this).val() == localCurrency){
			$('[bind="amount"]').attr('append', localCurrencySymbol);
			$('.currency_indicator').html(localCurrencySymbol);
		}

		var bindEl = $('[bind="amount"]'),
			val = $('[name="amount"]').val();

		if(bindEl.attr('append'))
			val = bindEl.attr('append') + ' ' + val;

		if(bindEl.length)
			bindEl.html(val);
	});

	Generator.addItem(null);
});