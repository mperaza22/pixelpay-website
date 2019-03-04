document.getDateColumnRender = function(data, type, row){
	if(!data)
		return '';

	return '<div class="field-date" data-export="'+moment(data).format("MMM DD, YYYY")+'">' + 
		'<small> '+moment(data).format("MMM")+' </small>' + 
		'<span>'+moment(data).format("DD")+'</span>' + 
		'<small> '+moment(data).format("YYYY")+' </small>' +
	'</div>';
};

document.getStatusColumnRender = function(data, type, row){
	if(!data)
		return '';

	return '<span data-toggle="tooltip" ' +
		'title="'+ Lang.get('admin.status.' + data + '_description') +'" class="badge badge-pill badge-'+data+'">'+ 
		Lang.choice('admin.status.' + data, 1) +
	'</span>';
};

document.getCustomerColumnRender = function(data, type, row){
	if(!data)
		return '';
	
	return 	'<span class="customer_name" style="display: block" data-export="' + data + '">' + 
				data.trunc(32) + 
			'</span> ' +
			'<small class="color">' + 
				row.customer_email.trunc(32) + 
			'</small>';
};

document.getCheckedColumnRender = function (data, type, row) {
	if(data)
		return '<i class="mdi mdi-check-circle" style="color: #00AE69; font-size: 18px" data-toggle="tooltip" title="Entregado / Cumplido"></i>';
	else
		return '<i class="mdi mdi-circle-outline" style="color: #EA7D37; font-size: 18px" data-toggle="tooltip" title="Pendiente"></i>';
}

String.prototype.trunc = function(n){
	return this.substr(0,n-1)+(this.length>=n?'&hellip;':'');
};

$.fn.dataTable.ext.buttons.range = {
	text: '<i class="mdi mdi-calendar"></i> Rango Fecha',
	action: function ( e, dt, node, config ) {
		$('#datatable-category-filter').hide();				
		$('#datatable-date-filter').toggle().css({
			top: $(node).offset().top,
			left: $(node).offset().left
		});
	}
};

$.fn.dataTable.ext.buttons.filter = {
	text: '<i class="mdi mdi-filter"></i> Filtrar',
	action: function ( e, dt, node, config ) {
		$('#datatable-date-filter').hide();
		$('#datatable-category-filter').toggle().css({
			top: $(node).offset().top,
			left: $(node).offset().left
		});
	}
};

$.fn.dataTable.ext.buttons.export = {
	text: '<i class="mdi mdi-download"></i> Exportar',
	extend: 'excelHtml5',
	exportOptions: {
		columns: '.exportable',
		format: {
			header: function ( data, columnIdx, node ) {
				if(node.getAttribute('data-export-name'))
					return node.getAttribute('data-export-name');

				return data;
			},
			body: function (html, row, columns, node) {
				if($(node).find('[data-export]').length > 0)
					return $(node).find('[data-export]').attr('data-export');

				return $(node).text();
			}
		}
	}
};

$.extend( true, $.fn.dataTable.defaults, {
	processing: true,
	serverSide: true,
	ordering: true,
	stateSave: true,
	order: [[0,'desc']],
	buttons: [ 'range', 'filter', 'export' ],
	pageLength: 25,
	dom: "<'row' <'col-12 col-lg-auto' f><'col' B>>" + 
			"<'card table-responsive'tr>" + 
		"<'row' <'col-md-6' i><'col-md-6' p>>",
	language: {
		emptyTable:     Lang.get('admin.datatable.no_records'),
		info:           Lang.get('admin.datatable.info'),
		infoEmpty:      Lang.get('admin.datatable.info_empty'),
		infoFiltered:   Lang.get('admin.datatable.info_filtered'),
		lengthMenu:     Lang.get('admin.datatable.menu'),
		loadingRecords: '',
		processing:     '',
		search:         "",
		zeroRecords:    '<div class="no-content">' + 
							'<img src="/public/images/icons/search-icon.svg" alt="" width="100" height="100">' + 
							'<h3>' + Lang.get('admin.datatable.no_records') + '</h3>' + 
						'</div>',
		paginate: {
			first: '&laquo;',
			last: '&raquo;',
			next: '&raquo;',
			previous: '&laquo;',
		}
	},
	ajax: function (data, callback, settings) {
		data.data = {
			filters: [
				{
					type : 'range',
					column: $('#date_filter_field').val(),
					min: $('#date_filter_ini').val(),
					max : $('#date_filter_end').val(),
				},
				{
					type: 'select',
					column: $('#datatable-category-filter').attr('data-filter-column'),
					value: $('.filter_field_checkbox:checked').map(function(){ 
						return $(this).val() 
					}).get()
				}
			],
		}; 

		$.get($(this).attr('data-src'), data, function(dataGet) {
			callback(dataGet);
		});
	},
	drawCallback: function(){
		$('[data-toggle="tooltip"]').tooltip({
			placement: 'top'
		});
	},
	initComplete: function( settings ) {
		$('.dataTables_filter input').attr("placeholder", Lang.get('admin.datatable.search'));
	},
});

(function() {
	(function(root, factory) {
		if (typeof define === 'function' && define.amd) {
			define(factory);
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			root.Pixel = factory();
		}
	})(this, function() {
		window.Pixel = {};
		
		var appPath = $('html').attr('app');

		Pixel.readFile = function(input, target, croppie) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function (e) {
					target.addClass('ready');
					croppie.croppie('bind', {
						url: e.target.result
					}).then(function(){
						console.log('jQuery bind complete');
					});

				}

				reader.readAsDataURL(input.files[0]);
			}
			else {
				swal("Sorry - you're browser doesn't support the FileReader API");
			}
		}

		Pixel.changeGatewayOptions = function(gateway){
			$('.gateway-options').hide();
			$('.'+gateway+'_gateway').fadeIn();
		}

		Pixel.changeInvoiceOptions = function(type){
			if(type == 'sar')
				$('.invoice-fields').fadeIn();
			else
				$('.invoice-fields').hide();
		}

		Pixel.generateUUID = function() {
			var d = new Date().getTime();
			if (typeof performance !== 'undefined' && typeof performance.now === 'function')
				d += performance.now();

			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}

		Pixel.setSize = function(el, size){
			$(el).find('.tingle-modal-box')
			.removeClass('small-box medium-box big-box')
			.addClass(size + '-box');
		};

		Pixel.abcitize = function(str) {
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
				function toSolidBytes(match, p1) {
					return String.fromCharCode('0x' + p1);
				}));
		};

		Pixel.slugify = function(text){
			return text.toString()
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
				.replace(/\-\-+/g, '-')
				.replace(/^-+/, '')
				.replace(/-+$/, '');
		};

		Pixel.listUsers = function(token){
			$('#guest-users').addClass('loading');

			$.ajax({
				url: appPath + '/admin/settings/users',
				type: 'POST',
				dataType: 'html',
				data: { _token: token }
			}).done(function(data) {
				$('#guest-users').html(data);
				$('#guest-users').removeClass('loading');
				$(document).trigger('closeAllModals');
			});
		}

		Pixel.error = function(text){
			Snackbar.show({ 
				text: text, 
				showAction: false,
				customClass: 'error'
			});
		}

		Pixel.success = function(text){
			Snackbar.show({ 
				text: text, 
				showAction: false,
				customClass: 'success'
			});
		}

		Pixel.currency = function(amount, currency){
			return (Pixel.currencySymbol(currency) || '') + ((parseFloat(amount) || 0.00).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
		}

		Pixel.currencySymbol = function (currency) {
			currency = currency || $('meta[name="app_currency"]').attr('content');

			var localCurrency = $('meta[name="app_local_currency"]').attr('content'),
				localCurrencySymbol = $('meta[name="app_local_currency_symbol"]').attr('content');

			if(currency == localCurrency)
				return localCurrencySymbol;

			if(currency == 'USD')
				return '$';
		};

		Pixel.registerForm = function(element){
			if(!element)
				return;

			element.each(function(index, el) {
				if($(this).attr("data-watch")){
					$(this).find(":input").change(function() {
						$(this).attr("changed",true);
					});
				}

				$(this).on('submit', function(event) {
					try{
						event.preventDefault();
						NProgress.start();
						$(this).addClass('form-loading');
						
						$.ajax({
							url: appPath+'/kernel/ajax/' + $(this).attr('data-request') + '/' + $(this).attr('data-ctrl'),
							type: 'POST',
							context: this,
							data: new FormData(this),
							contentType: false,       
							cache: false,
							processData:false, 
						})
						.fail(function(){
							NProgress.done();
							$(this).removeClass('form-loading');

							Snackbar.show({ 
								text: 'Upps, algo salio mal, intenta de nuevo mas tarde o reporta esto con el soporte técnico.', 
								showAction: false,
								customClass: 'error'
							});
						})
						.done(function(data) {
							console.log('REQ LOG', data);

							if(data.success != null && !data.success){
								Snackbar.show({ 
									text: data.message, 
									showAction: false,
									customClass: 'error'
								});
							}

							if(data.success != null && data.success){
								if(data.message){
									Snackbar.show({ 
										text: data.message, 
										showAction: false,
										customClass: 'success'
									});
								}

								var _dataOnSuccess = $(this).attr('data-on-success');
								if(_dataOnSuccess)
									window.eval.call(window,'(function (result){'+_dataOnSuccess+'})')(data);
							}

							$('.form-group').removeClass('has-danger');
							$('.form-group').find('.form-control-feedback').remove();

							if(data.errors){
								$.each(data.errors, function(index, error) {
									if (index.indexOf('.') > -1) { 
										var temp = index.split('.');
										var index = '';

										$.each(temp, function(key, val) {
											if(key != 0)
												index += '['+val+']';
											else
												index += val;
										});
									}

									if($('[name="'+index+'"]').closest('.form-group').find('.input-group').length)
										$('[name="'+index+'"]').closest('.form-group').find('.input-group').after('<div class="form-control-feedback"><strong>'+error[0]+'</strong></div>');
									else{
										if($('[name="'+index+'"]').closest('form').find('[name="'+index+'"] + .form-control-feedback'))
											$('[name="'+index+'"]').closest('form').find('[name="'+index+'"] + .form-control-feedback').remove()
										$('[name="'+index+'"]').after('<div class="form-control-feedback"><strong>'+error[0]+'</strong></div>');
									}
									
									$('[name="'+index+'"]').closest('.form-group').addClass('has-danger');
								});
							}

							NProgress.done();
							$(this).removeClass('form-loading');
							$(this).attr("changed",false);
							
						});
					}catch(ex){
						console.log(ex)
					}
				});
			});
		};

		Pixel.registerForm($("form[data-request]"));
	});

}).call(this);

$(function() {
	moment.locale($('html').attr('lang')); 
	var appPath = $('html').attr('app');
	
	var modalPreview = new tingle.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: Lang.get('admin.close').toUpperCase(),
		cssClass: ['pixel__modal-preview'],
		onOpen: function() { 
			$(document).trigger('modalPreviewOpen') 
		},
		onClose: function() { 
			Pixel.setSize($('.pixel__modal-preview'), 'small'); 
			$(document).trigger('modalPreviewClose') 
		},
		beforeClose: function() { 
			if($('.pixel__modal-preview').hasClass('is_dirty'))
				if(confirm("Hay cambios sin guardar, en realidad desea cerrar esta ventana?")){
					$('.pixel__modal-preview').removeClass('is_dirty');
					return true;
				}else{
					return false;
				}

			return true;
		}
	});

	var modalCreate = new tingle.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: Lang.get('admin.close').toUpperCase(),
		cssClass: ['pixel__modal-create'],
		onOpen: function() { 
			$(document).trigger('modalCreateOpen') 
		},
		onClose: function() { 
			Pixel.setSize($('.pixel__modal-create'), 'small'); 
			$(document).trigger('modalCreateClose');
		},
		beforeClose: function() { 
			if($('.pixel__modal-create').hasClass('is_dirty'))
				if(confirm("Hay cambios sin guardar, en realidad desea cerrar esta ventana?")){
					$('.pixel__modal-create').removeClass('is_dirty');
					return true;
				}else{
					return false;
				}

			return true; 
		}
	});

	var modalConfirm = new tingle.modal({
		footer: false,
		stickyFooter: false,
		closeMethods: ['overlay', 'button', 'escape'],
		closeLabel: Lang.get('admin.close').toUpperCase(),
		cssClass: ['pixel__modal-confirm'],
		onOpen: function() { 
			$(document).trigger('modalConfirmOpen') 
		},
		onClose: function() { 
			Pixel.setSize($('.pixel__modal-confirm'), 'small'); 
			$(document).trigger('modalConfirmClose') 
		},
		beforeClose: function() { return true; }
	});

	$(document).on("closeAllModals", function(e){
		modalCreate.close();
		modalPreview.close();
		modalConfirm.close();
	});

	$(document).on("checkOverflow", function(e){
		modalCreate.checkOverflow();
		modalPreview.checkOverflow();
	});

	$('.btn-filter').click(function(event) {
		$(document).trigger('refreshList');
		$('.filter-popover').hide();
	});

	$('.btn-clear').click(function(event) {
		$(this).closest('.filter-popover')
			.find('.filter_field').val('');
		$(this).closest('.filter-popover')
			.find('.filter_field_checkbox').prop( "checked", false );
		$(document).trigger('refreshList');
	});

	$('.filter_ini').daterangepicker({
		startDate: moment().subtract(1, 'months'),
		singleDatePicker: true,
		autoUpdateInput: false,
	});

	$('.filter_ini').on('apply.daterangepicker', function(ev, picker) {
		$('.filter_ini').val(picker.startDate.format('MMM DD, YYYY'));
		$('#date_filter_ini').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
	});

	$('.filter_end').daterangepicker({
		singleDatePicker: true,
		autoUpdateInput: false,
	});

	$('.filter_end').on('apply.daterangepicker', function(ev, picker) {
		$('.filter_end').val(picker.startDate.format('MMM DD, YYYY'));
		$('#date_filter_end').val(picker.startDate.endOf('day').format('YYYY-MM-DD HH:mm:ss'));
	});

	$('[data-confirm]').click(function(event) {
		event.preventDefault();
		$('#modal-confirm').html('<div class="loading-block"></div>');
		var mod = $('.pixel__modal-confirm'),
			message = $(this).data('confirm'),
			button = $(this);

		mod.addClass('loading');
		modalConfirm.open();

		$.ajax({
			url: appPath + '/modals/confirm',
			type: 'GET',
			dataType: 'html',
			data: {
				text: message,
				icon: ''
			}
		})
		.done(function(data) {
			$('#modal-confirm').html(data);
			mod.removeClass('loading');
			setTimeout(function(){ 
				$(document).trigger('openConfirmLoaded') ;
				$(document).trigger('checkOverflow');
			}, 500);
		});

		$(document).on('confirmYes', function(event) {
			try{
				event.preventDefault();
				NProgress.start();
				mod.addClass('loading');

				var actionPath = appPath+'/kernel/ajax/' + button.attr('data-action') + '/' + button.attr('data-action-ctrl');
				var crappyJSON = '{' + button.attr('data-action-data') + '}' || '{}';
				var fixedJSON = crappyJSON.replace(/'/g, '"')
						.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');

				console.log(JSON.parse(fixedJSON))

				if(button.attr('data-action-event')){
					$(document).trigger(button.attr('data-action-event'));
					NProgress.done();
					modalConfirm.close();
					return;
				}

				if(!button.attr('data-action') || !button.attr('data-action-ctrl')){
					Snackbar.show({ 
						text: 'Esta confirmacion no tiene una accion definida', 
						showAction: false,
						customClass: 'error'
					});
					return;
				}

				$.post(actionPath, JSON.parse(fixedJSON))
				.fail(function(){
					NProgress.done();

					Snackbar.show({ 
						text: 'Upps, algo salio mal, intenta de nuevo mas tarde o reporta esto con el soporte técnico.', 
						showAction: false,
						customClass: 'error'
					});
				})
				.done(function(data) {
					if(data.success != null && !data.success){
						Snackbar.show({ 
							text: data.message, 
							showAction: false,
							customClass: 'error'
						});

						mod.removeClass('loading');

						if(data.action && data.action == 'refresh')
							setTimeout(function() { location.reload() }, 3000);
					}

					if(data.success != null && data.success){
						if(data.message){
							Snackbar.show({ 
								text: data.message, 
								showAction: false,
								customClass: 'success'
							});
						}

						console.log(data)

						if(data.action && data.action == 'refresh')
							location.reload();

						if(data.action && data.action == 'redirect')
							window.location.replace(button.attr('data-action-redirect'));

						if(data.action && data.action == 'content'){
							$('#modal-confirm').html(data.content);
							mod.removeClass('loading');
						}else{
							modalConfirm.close();
						}
					}

					NProgress.done();
				});
			}catch(ex){
				console.log(ex)
			}
		});
	});

	$('[data-open-create]').click(function(event) {
		event.preventDefault();
		$('#modal-create').html('<div class="loading-block"></div>');
		var mod = $('.pixel__modal-create'), 
			_id = $(this).attr('data-id'),
			_model = $(this).attr('data-model'),
			_params = $(this).data();
			
		mod.addClass('loading');
		modalCreate.open();

		$.ajax({
			url: appPath+'/modals/create/' + $(this).attr('data-open-create'),
			type: 'GET',
			dataType: 'html',
			data: {
				id: _id,
				model: _model,
				params: _params
			}
		})
		.done(function(data) {
			$('#modal-create').html(data);
			mod.removeClass('loading');

			setTimeout(function(){ 
				$(document).trigger('openCreateLoaded');
				$(document).trigger('checkOverflow');
			}, 500);
		});
	});

	$('[data-open-preview]').click(function(event) {
		event.preventDefault();
		var _id = $(this).attr('data-id'),
			_partial = $(this).attr('data-open-preview'),
			_model = $(this).attr('data-model'),
			_params = $(this).data();

		$(document).trigger('openPreview', [_id, _model, _partial, _params]);
	});

	$(document).on('openPreview', function(event, id, model, partial, params){
		$('#modal-preview').html('<div class="loading-block"></div>');
		var mod = $('.pixel__modal-preview');

		mod.addClass('loading');
		modalPreview.open();

		$.ajax({
			url: appPath + '/modals/preview/' + partial,
			type: 'GET',
			dataType: 'html',
			data: {
				id: id,
				model: model,
				params: params
			}
		})
		.done(function(data) {
			$('#modal-preview').html(data);
			mod.removeClass('loading');

			setTimeout(function(){ 
				$(document).trigger('openPreviewLoaded');
				$(document).trigger('checkOverflow');
			}, 500);
		});
	});

	modalCreate.setContent('<div id="modal-create"></div>');
	modalPreview.setContent('<div id="modal-preview"></div>');
	modalConfirm.setContent('<div id="modal-confirm"></div>');

	$('.mobile-menu, .content-menu-overlay').click(function(event) {
		$('.main-menu').toggleClass('toggled');
	});

	$('number').each(function(index, el) {
		var decimal_places = $(el).attr('decimal') || 0;
		var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);

		$(el).animateNumber({ 
			number: $(el).attr('value') * decimal_factor, 
			numberStep: function(now, tween) {
				var floored_number = Math.floor(now) / decimal_factor,
				target = $(tween.elem);

				if (decimal_places > 0)
					floored_number = floored_number.toFixed(decimal_places);

				floored_number = floored_number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

				target.text(floored_number);
			}
		}, 750);
	});

	$('.generate-hash').click(function(event) {
		$key = Pixel.generateUUID();
		$('#key-hash').val($key);
		$('#js-hash').html($key);
		Snackbar.show({ 
			text: 'New secret key was generate, please save your data first!', 
			customClass: 'info',
			showAction: false
		});
	});

	$('.add-tax').click(function(event) {
		var content = $($('#template-tax').html());
		content.find('.remove-tax').click(function(event) {
			content.remove();
		});
		$('#taxes').append(content);
	});

	$('.rich-editor').froalaEditor({
		theme: 'dark',
		// toolbarInline: true,
		toolbarVisibleWithoutSelection: true,
		toolbarBottom: false,

		paragraphFormatSelection: true,
		editorClass: 'rich-editor-box',

		imageUploadParam: 'image',
		imageUploadURL: '{{ "/api/v1/image/upload"|app }}/{{ model.id }}',
		imageUploadMethod: 'POST',
		imageMaxSize: 2 * 1024 * 1024,
		imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],

		imageEditButtons: [
			'imageReplace',
			'imageAlign',

			'imageLink',
			'linkOpen', 
			'linkEdit', 
			'linkRemove',

			'imageAlt', 
			'imageSize',
			'imageRemove',
		],

		toolbarButtons: [
			'paragraphFormat',
			'color', 
			'|',
			'bold', 
			'italic', 
			'underline', 
			'|', 
			'align', 
			'formatOL', 
			'formatUL'
		]
	});

	$("div#logo-upload").dropzone({ url: appPath + "/kernel/images/logo" });

	$('[data-img]').each(function(index, el) {
		$(this).css('background-image', 'url(' + $(this).data('img') + ')');
		console.log($(this).data('img'))
	});

	$('.main-menu').addClass('toggled');
	$('[data-toggle="tooltip"]').tooltip();
});

function readFile(input, target, croppie) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			target.addClass('ready');
			croppie.croppie('bind', {
				url: e.target.result
			}).then(function(){
				console.log('jQuery bind complete');
			});

		}

		reader.readAsDataURL(input.files[0]);
	}
	else {
		swal("Sorry - you're browser doesn't support the FileReader API");
	}
}

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
});