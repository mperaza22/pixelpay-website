<?php

return [

	/*
	|--------------------------------------------------------------------------
	| Validation Language Lines
	|--------------------------------------------------------------------------
	|
	| The following language lines contain the default error messages used by
	| the validator class. Some of these rules have multiple versions such
	| as the size rules. Feel free to tweak each of these messages here.
	|
	*/

	'accepted'             => 'El campo :attribute debe ser aceptado.',
	'active_url'           => 'El campo :attribute no es una URL válida.',
	'after'                => 'El campo :attribute debe ser una fecha posterior a :date.',
	'after_or_equal'       => 'El campo :attribute debe ser una fecha posterior o igual a :date.',
	'alpha'                => 'El campo :attribute sólo puede contener letras.',
	'alpha_dash'           => 'El campo :attribute sólo puede contener letras, números y guiones (a-z, 0-9, -_).',
	'alpha_num'            => 'El campo :attribute sólo puede contener letras y números.',
	'array'                => 'El campo :attribute debe ser un array.',
	'before'               => 'El campo :attribute debe ser una fecha anterior a :date.',
	'before_or_equal'      => 'El campo :attribute debe ser una fecha anterior o igual a :date.',
	'between'              => [
		'numeric' => 'El campo :attribute debe ser un valor entre :min y :max.',
		'file'    => 'El archivo :attribute debe pesar entre :min y :max kilobytes.',
		'string'  => 'El campo :attribute debe contener entre :min y :max caracteres.',
		'array'   => 'El campo :attribute debe contener entre :min y :max elementos.',
	],
	'boolean'              => 'El campo :attribute debe ser verdadero o falso.',
	'confirmed'            => 'El campo confirmación de :attribute no coincide.',
	'date'                 => 'El campo :attribute no corresponde con una fecha válida.',
	'date_format'          => 'El campo :attribute no corresponde con el formato de fecha :format.',
	'different'            => 'Los campos :attribute y :other han de ser diferentes.',
	'digits'               => 'El campo :attribute debe ser un número de :digits dígitos.',
	'digits_between'       => 'El campo :attribute debe contener entre :min y :max dígitos.',
	'dimensions'           => 'El campo :attribute tiene dimensiones inválidas.',
	'distinct'             => 'El campo :attribute tiene un valor duplicado.',
	'email'                => 'El campo :attribute no corresponde con una dirección de e-mail válida.',
	'file'                 => 'El campo :attribute debe ser un archivo.',
	'filled'               => 'El campo :attribute es obligatorio.',
	'exists'               => 'El campo :attribute no existe.',
	'image'                => 'El campo :attribute debe ser una imagen.',
	'in'                   => 'El campo :attribute debe ser igual a alguno de estos valores :values.',
	'in_array'             => 'El campo :attribute no existe en :other.',
	'integer'              => 'El campo :attribute debe ser un número entero.',
	'ip'                   => 'El campo :attribute debe ser una dirección IP válida.',
	'ipv4'                 => 'El campo :attribute debe ser una dirección IPv4 válida.',
	'ipv6'                 => 'El campo :attribute debe ser una dirección IPv6 válida.',
	'json'                 => 'El campo :attribute debe ser una cadena de texto JSON válida.',
	'max'                  => [
		'numeric' => 'El campo :attribute debe ser :max como máximo.',
		'file'    => 'El archivo :attribute debe pesar :max kilobytes como máximo.',
		'string'  => 'El campo :attribute debe contener :max caracteres como máximo.',
		'array'   => 'El campo :attribute debe contener :max elementos como máximo.',
	],
	'mimes'                => 'El campo :attribute debe ser un archivo de tipo :values.',
	'mimetypes'            => 'El campo :attribute debe ser un archivo de tipo :values.',
	'min'                  => [
		'numeric' => 'El campo :attribute debe tener al menos :min.',
		'file'    => 'El archivo :attribute debe pesar al menos :min kilobytes.',
		'string'  => 'El campo :attribute debe contener al menos :min caracteres.',
		'array'   => 'El campo :attribute no debe contener más de :min elementos.',
	],
	'not_in'               => 'El campo :attribute seleccionado es inválido.',
	'numeric'              => 'El campo :attribute debe ser un número.',
	'present'              => 'El campo :attribute debe estar presente.',
	'regex'                => 'El formato del campo :attribute es inválido.',
	'required'             => 'El campo :attribute es obligatorio.',
	'required_if'          => 'El campo :attribute es obligatorio cuando el campo :other es :value.',
	'required_unless'      => 'El campo :attribute es requerido a menos que :other se encuentre en :values.',
	'required_with'        => 'El campo :attribute es obligatorio cuando :values está presente.',
	'required_with_all'    => 'El campo :attribute es obligatorio cuando :values está presente.',
	'required_without'     => 'El campo :attribute es obligatorio cuando :values no está presente.',
	'required_without_all' => 'El campo :attribute es obligatorio cuando ninguno de los campos :values está presente.',
	'same'                 => 'Los campos :attribute y :other deben coincidir.',
	'size'                 => [
		'numeric' => 'El campo :attribute debe ser :size.',
		'file'    => 'El archivo :attribute debe pesar :size kilobytes.',
		'string'  => 'El campo :attribute debe contener :size caracteres.',
		'array'   => 'El campo :attribute debe contener :size elementos.',
	],
	'string'               => 'El campo :attribute debe contener sólo caracteres.',
	'timezone'             => 'El campo :attribute debe contener una zona válida.',
	'unique'               => 'El elemento :attribute ya está en uso.',
	'uploaded'             => 'El elemento :attribute falló al subir.',
	'url'                  => 'El formato de :attribute no corresponde con el de una URL válida.',
	'alpha_spaces'         => 'El campo :attribute solo puede contener letras y espacios.',
	'price'                => 'El campo :attribute debe ser mayor a 1.00 o contener un formato valido.',


	/*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines
	|--------------------------------------------------------------------------
	|
	| Here you may specify custom validation messages for attributes using the
	| convention "attribute.rule" to name the lines. This makes it quick to
	| specify a specific custom language line for a given attribute rule.
	|
	*/

	'money' => 'El valor no coincide con un formato de moneda (ex. 9999.99)',

	'custom' => [
		'options.invoice.prefix' => [
			'required_if' => 'El prefijo es obligatorio al activar la facturación',
		],
		'options.invoice.doc_id' => [
			'required_if' => 'El ID del documento fiscal es obligatorio al activar la facturación',
		],
		'options.invoice.date_init' => [
			'required_if' => 'La fecha inicial es obligatoria al activar la facturación',
		],
		'options.invoice.date_end' => [
			'required_if' => 'La fecha final es obligatoria al activar la facturación'
		],
	],

	/*
	|--------------------------------------------------------------------------
	| Custom Validation Attributes
	|--------------------------------------------------------------------------
	|
	| The following language lines are used to swap attribute place-holders
	| with something more reader friendly such as E-Mail Address instead
	| of "email". This simply helps us make messages a little cleaner.
	|
	*/

	'attributes' => [
		'code' => 'código',
		'type' => 'tipo',
		'name' => 'nombre',
		'password' => 'contraseña',
		'email' => 'correo electrónico',
		'active' => 'activo',
		'address' => 'dirección',
		'amount' => 'cantidad',
		'option' => 'opción',
		'attachment' => 'adjunto',
		'avatar' => 'avatar',
		'city' => 'ciudad',
		'currency' => 'moneda',
		'description' => 'descripción',
		'hash' => 'secret key',
		'key' => 'key id',
		'logo' => 'logo',
		'nid' => 'numero de identidad',
		'note' => 'nota',
		'phone' => 'teléfono',
		'place' => 'lugar',
		'ref' => 'referencia',
		'rtn' => 'rtn/id',
		'state' => 'departamento',
		'total' => 'total',
		'username' => 'username',
		'tax' => 'impuesto',
		'price' => 'precio',
		'subject' => 'asunto',
		'csv_file' => 'archivo CSV',
		'gateway' => 'método de pago',

		'data.bac_key' => 'id. de clave',
		'data.bac_key_id' => 'clave',
		'data.stripe_api_key' => 'api key',
		'data.paypal_email' => 'e-mail de mercante',
		'data.promerica_merchant_id' => 'ID del mercante',
		'data.promerica_transaction_key' => 'llave de transacción de API',
		'data.pixel_bank' => 'banco',
		'data.pixel_bank_account' => 'cuenta bancaria',
		'plan_mode' => 'método de pago',

		'options.webhook.error' => 'url de error',
		'options.webhook.success' => 'url de éxito',

		'options.gateways.active_gateway' => 'método de pago por defecto',
		'options.gateways.bac_key' => 'key id',
		'options.gateways.bac_key_id' => 'api key',
		'options.gateways.bac_currency' => 'moneda',
		'options.gateways.stripe_api_key' => 'api key',
		'options.gateways.paypal_email' => 'e-mail de mercante',
		'options.gateways.visanet_merchant_id' => 'Merchant ID',
		'options.gateways.visanet_merchant_reference_code' => 'Merchant Reference Code',
		'options.gateways.visanet_transaction_key' => 'Transaction Key',
		'options.gateways.promerica_merchant_id' => 'Merchant ID',
		'options.gateways.promerica_transaction_key' => 'Transaction Key',
		'options.invoice.number_actual' => 'numero actual',
		'options.invoice.date_init' => 'fecha de inicio',
		'options.invoice.date_end' => 'fecha final',
		'options.notifications.paid_custom' => 'E-mail',
		'options.notifications.paid_to' => 'destino',
		'options.payments.due_amount' => 'cantidad',
		'options.payments.active_charge' => 'activar recargos',
		'now' => 'hoy',

		'options.*.name' => 'Nombre de opción',
		'options.*.values' => 'Valores de la opción',

		'user_nid_doc' => 'copia de cedula',
		'user_rtn_doc' => 'copia de RTN',
		'company_legal_doc' => 'copia de escritura',
		'company_rtn_doc' => 'copia de RTN',
	],
	'values' => [
		'type' => [
			'unique' => 'por unidad',
			'massive' => 'masivo'
		],
		'options' => [
			'gateways' => [
				'active_gateway' => [
					'promerica' => 'Banco Promerica',
					'bac' => 'BAC Credomatic',
					'stripe' => 'Stripe'
				]
			],
			'notifications' => [
				'paid_to' => [
					'custom' => 'personalizado'
				]
			]
		]
	]
];
