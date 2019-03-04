<?php

return [
	"information" => "La información de las tarjetas nunca son guardadas y la transacción es <span>segura</span> y <span>encriptada</span>.",
	"total" => "Total a pagar",
	"total_paid" => "Total pagado",
	"agree" => "Estoy de acuerdo",
	"save" => "Guardar",
	"not_agree" => "Cancelar",
	"billing_address" => "Dirección de facturación",
	"edit_billing" => "Detalles de facturación",
	"click_billing_address" => "Editar esta dirección",
	"terms_title" => "TERMINOS Y CONDICIONES",
	"recomended" => "Recomendado",
	"postal_code" => "Código Postal",
	"3d_secure" => "Autentificación 3D Secure",
	"rtn" => "RTN/ID",
	"close" => "Cerrar",
	"paid" => "Pagado",
	"failed_paid" => "Pago Fallido",
	"cancel_order" => "cancelar orden y regresar",
	"redirect_in" => "Favor no cerrar esta ventana,<br> redireccionando en <span id='data-redirect-in'>3</span> segundos.",

	"loading" => [
		"title" => "Cargando...",
		"init" => "Iniciando pruebas de seguridad",
		"tls" => "Verificando la seguridad y versión del explorador",
		"tls_error" => "La versión del explorador no es soportada, por favor actualice a la versión mas reciente.",
		"ssl_error" => "Su explorador no esta cargando el sitio de forma segura o su conexión de Internet es insegura.",
		"geolocation" => "Verificando localidad y ubicación",
		"geolocation_permission_denied" => "Usuario denegó la solicitud de geolocalización.",
		"geolocation_position_unavailable" => "La información de ubicación no está disponible.",
		"geolocation_timeout" => "La solicitud para obtener la ubicación del usuario supero el tiempo de espera.",
		"geolocation_unknown_error" => "Un error desconocido ocurrió.",
		"geolocation_browser_error" => "La geolocalización no es compatible con este navegador.",
		"location" => "Verificando localidad por IP",
		"geocode" => "Validando la ubicación",
		"identity" => "Verificando identidad del cliente",
		"done" => "Por favor espere unos segundos ...",
	],

	"cc" => [
		"number" => "NUMERO DE TARJETA",
		"expire" => "MM - AA",
		"cvc" => "CVV",
		"name" => "NOMBRE Y APELLIDO"
	],

	"focus" => [
		"cc_pan" => "Ingrese el numero de la tarjeta",
		"cc_exp" => "Ingrese la fecha de expiración de la tarjeta",
		"cc_cvc" => "Ingrese el código de seguridad de la tarjeta",
		"cc_name" => "Ingrese el nombre tal como aparece en la tarjeta",
		"billing_address" => "Ingrese la dirección de facturación de la tarjeta",
		"billing_state" => "Ingrese el estado o departamento de facturación de la tarjeta",
		"billing_city" => "Ingrese la ciudad de facturación de la tarjeta",
		"billing_country" => "Ingrese el país de facturación de la tarjeta",
		"billing_zip" => "Ingrese el código postal de facturación de la tarjeta",
		"billing_rtn" => "Ingrese el Registro Tributario Numérico o Numero de Identidad",
		"agree" => "Debe aceptar los términos y condiciones para continuar",
	],

	"errors" => [
		"pan_invalid" => "El numero de tarjeta ingresado es invalido",
		"pan_not_allowed" => "El comercio no permite este tipo de tarjeta",
		"exp_invalid" => "La fecha de expiración es invalida",
		"cvc_invalid" => "El código de seguridad debe contener :digits dígitos",
		"name_invalid" => "El nombre/tarjeta-habiente debe contener un nombre y un apellido mínimo",
		"invalid" => "La información de este campo es invalida",
	],

	"response" => [
		"DECLINE" => "Transacción declinada",
		"MERCHANT_DECLINE" => "Transacción declinada, favor comunicarse con el comercio",
		"ISSUER_DECLINE" => "Transacción declinada, favor comunicarse con su banco",
		"EXPIRED" => "Tarjeta Expirada",
		"NO_FUNDS" => "Fondos insuficientes en la tarjeta",
		"STOLEN" => "Tarjeta reportada como <b>perdida o robada</b>",
		"REACH_LIMIT" => "La tarjeta ha alcanzado el límite de crédito",
		"CARD_NOT_ACCEPTED" => "El tipo de tarjeta no es aceptada",
		"FAIL_VOID" => "La transacción ya se ha liquidado o revertido",
		"EXCEPTION" => "Error general del sistema",
		"INVALID_CONFIG" => "Configuración del comercio invalida",
		"INVALID_CURRENCY" => "La transacción no permite este tipo de moneda",
		"INVALID_FIELDS" => "Uno o mas campos son inválidos",
		"OUT_STOCK" => "La cantidad solicitada del producto no hay en existencia, comuníquese con el proveedor de esta venta.",
		"undefined" => "Error general del sistema",
	],

	"alert" => [
		"DECLINE" => "La transacción ha sido denegada. Verifica que los <b>datos sean correctos</b>, de lo contrario <b>llama a tu banco</b>.",
		"MERCHANT_DECLINE" => "La transacción ha sido denegada. Verifica que los <b>datos sean correctos</b>, de lo contrario <b>llama a tu banco</b>.",
		"ISSUER_DECLINE" => "La transacción ha sido denegada, Verifica que los <b>datos sean correctos</b>, de lo contrario <b>llama a tu banco</b>.",
		"EXPIRED" => "Transacción denegada debido a que <b>su tarjeta ha expirado</b>.",
		"NO_FUNDS" => "Transacción denegada por <b>fondos insuficientes en la tarjeta</b>.",
		"STOLEN" => "Tarjeta reportada como perdida o robada.",
		"REACH_LIMIT" => "Transacción denegada debido a que la tarjeta ha alcanzado el límite de crédito.",
		"CARD_NOT_ACCEPTED" => "Transacción denegada debido a que el tipo de tarjeta no es aceptada.",
		"EXCEPTION" => "Lo sentimos, pero no podemos procesar tu solicitud. Inténtalo de nuevo más tarde.",
		"INVALID_CONFIG" => "La transacción ha sido denegada. Configuración del comercio invalida.",
		"INVALID_CURRENCY" => "La transacción ha sido denegada. La transacción no permite este tipo de moneda.",
		"INVALID_FIELDS" => "Uno o mas campos son inválidos.",
		"OUT_STOCK" => "La cantidad solicitada del producto no hay en existencia, comuníquese con el proveedor de esta venta.",
		"undefined" => "Lo sentimos, pero no podemos procesar tu solicitud. Inténtalo de nuevo más tarde.",
	],

	"messages" => [
		"starting_3d_secure" => "Autentificando al comprador (3D SECURE) ...",
		"cvv_help" => "El código de seguridad se encuentra al reverso de la tarjeta y contiene 3 dígitos",
		"cvv_help_amex" => "El código de seguridad se encuentra al frente de la tarjeta y contiene 4 dígitos",
	]
];

?>