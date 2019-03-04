<?php

return [

    'status' => [
		'pending' => 'Pendiente|Pendientes',
		'delivered' => 'Entregado|Entregados',
		'viewed' => 'Visto|Vistos',
		'open' => 'Abierto|Abiertos',
		'opened' => 'Abierto|Abiertos',
		'paid' => 'Pagado|Pagados',
		
		'drop' => 'Fallido|Fallidos',
		'spam' => 'Spam|Spams',
		'void' => 'Anulado|Anulados',
		'draft' => 'Borrador|Borradores',
		'ready' => 'Aprobado|Aprobados',
		'temp' => 'Temporal|Temporales',

		'new' => 'Nuevo|Nuevos',
		'working' => 'Trabajando',
		'solved' => 'Resuelto|Resuletos',
		'closed' => 'Cerrado|Cerrados',

		'pending_description' => 'Este cobro aun esta pendiente de ser recibido vía correo',
		'delivered_description' => 'El correo fue recibido con éxito',
		'viewed_description' => 'El cobro fue visto por el cliente',
		'open_description' => 'El cobro fue abierto por el cliente',
		'paid_description' => 'El cobro fue pagado con éxito',
		
		'drop_description' => 'Este cobro fallo al ser entregado, intente enviarlo de nuevo',
		'spam_description' => 'Este cobro posiblemente este en Junk o Spam',
		'draft_description' => 'Este documento aun no esta listo para su envió',
		'ready_description' => 'Este documento esta listo para ser enviado o pagado',
		'temp_description' => 'Este cobro es temporal, generado por Hosted Payment Gateway o InstaShop',

		'overdue' => 'Vencido',
		'complete' => 'Completado',
		'on_hold' => 'En espera',
		'complete_description' => 'La transacción se ha completado con exito.',
		'on_hold_description' => 'La transacción esta en proceso de liquidacion.',
		'sale' => 'Venta',
		'withdraw' => 'Retiro'
	],

	'datatable' => [
		'search' => 'Buscar...',
		'info' => 'Mostrando _START_ a _END_ de _TOTAL_ elementos',
		'info_empty' => 'Mostrando 0 a 0 de 0 elementos',
		'info_filtered' => '(filtrado _MAX_ elementos totales)',
		'menu' => 'Mostrar _MENU_ elementos',
		'no_records' => 'No se encontraron resultados',
		'last_activity_date' => 'Fecha de creación',
	],

	'chart' => [
		'keys' => [
			'visa' => 'Visa',
			'mastercard' => 'MasterCard',
			'amex' => 'AMEX',
			'diners' => 'Diners Club',
			'jcb' => 'JCB',
			'discover' => 'Discover',
			
			'other' => 'Otro',
			'others' => 'Otros',

			'mail' => 'E-mail',
			'link' => 'Enlace',
			'woocommerce' => 'WooCommerce',
			'shopify' => 'Shopify',
			'prestashop' => 'PrestaShop',
			'button' => 'InstaShop',
			'october' => 'OctoberCMS',
			'null' => 'Enviado',

			"android" => "Android",
			"blackberry" => "Blackberry",
			"ios" => "iPhone/iPad",
			"linux" => "Linux",
			"mobile" => "Móvil",
			"mac" => "Mac",
			"ubuntu" => "Ubuntu",
			"windows" => "Windows",
		],
		'percent' => 'Porcentaje',
		'sale' => 'Venta',
		'sales' => 'Ventas',
		'total_sales' => 'en Ventas Totales',
		'group_by_sales_from' => 'Agrupado por ventas de',
		'no_data' => 'No hay datos suficientes para mostrar el gráfico.',
		'no_data_range' => 'Seleccione un rango de fecha para continuar.'
	],

	'actions' => [
		'copy' => 'Se copio la url con éxito al portapapeles',
		'delete_one' => 'No puede eliminar este elemento, ya que es único.',
	],

	'buttons' => [
		'upload_placeholder' => 'Seleccione un archivo',
	],

	'no_items' => 'No hay elementos para mostar',
	'no_buttons' => 'Aún no se han creado botones',
	'no_sales' => 'Aún no se han realizado ventas',
	'no_payments' => 'Aún no se han realizado cobros',
	'no_invoices' => 'Aún no se han realizado facturas',
	'no_guest_users' => 'No se encontraron usuarios para administrar',
	'close' => 'Cerrar'
];
