+function ($) { "use strict";
	var matchArrays = function(a, b, def){
		var ret = def, sorted = [];
		for (var i = 0; i < b.length; i++) {
			sorted.push(b[i].toLowerCase());
		}

		for(var i = 0; i < a.length; i += 1) {
			var pos = sorted.indexOf( a[i] );
			if(pos > -1)
				return pos;
		}
		return ret;
	};

	var validateHeaders = function(fields) {
		var positions = {}, validate = {
			name: [
				'name',
				'nombre',
				'client',
				'cliente',
				'customer',
				'first name',
				'primer nombre'
			],
			email: [
				'email',
				'e-mail',
				'correo',
				'correo electronico'
			],
			amount: [
				'amount',
				'total',
				'price',
				'cantidad',
				'precio'
			],
			tax: [
				'tax',
				'impuesto',
				'imp'
			],
			'rtn' : [
				'number id',
				'rtn',
				'id',
				'numero de identidad',
				'identidad'
			],
			'ref': [
				'ref',
				'reference',
				'invoice',
				'number',
				'numero',
				'referencia',
				'recibo',
				'factura'
			]
		};

		$.each(validate, function(i, rule) {
			if(i == 'ref' || i == 'rtn' || i == 'tax')
				positions[i] = matchArrays(rule, fields, -2);
			else	
				positions[i] = matchArrays(rule, fields, -1);
		});

		return positions;
	};

    var ImportBehavior = function() {
		this.onLoadFile = function (results){
			console.log(results)
			
			var fields = "<ul>", mode = 'valid', indexes, matchFields;

			matchFields = $('#csv-fields').connect();
			indexes = validateHeaders(results[0]);

			$.each(indexes, function(index, val) {
				if(val > -1)
					fields += "<li data-index='"+val+"' data-connect='"+index+"'' class='valid'><i class='mdi mdi-check-circle'/> VALIDO</li>";
				else if(val == -2)
					fields += "<li data-index='"+val+"' data-connect='"+index+"''><i class='mdi mdi-alert-circle'/> OPCIONAL</li>";
				else
					fields += "<li data-index='"+val+"' data-connect='"+index+"'' class='invalid'><i class='mdi mdi-close-circle'/> REQUERIDO</li>";

				if(val == -1)
					mode = "invalid";
			});

			fields += '</ul>';

			$('#csv-fields .fields-file').empty().append(fields);

			$('.type_massive').attr('data-mode', mode);

			$("li[data-name]").on('drop', function(event){
				event.preventDefault();
				console.log(event);
			});

			$.each(indexes, function(index, val) {
				matchFields.drawLine({
					left_node:'[data-name="'+index+'"]',
					right_node:'[data-connect="'+index+'"]',
					horizantal_gap:10,
					error:true,
					width:2,
					color: '#99ACD2'
				});
			});

			if(mode == 'valid'){
				$('[name="csv_file"]').val(JSON.stringify(results));
				$('[name="csv_index"]').val(JSON.stringify(indexes));
			}
		}
    };

    $.importBehavior = new ImportBehavior;
}(window.jQuery);