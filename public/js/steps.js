!function(e){function a(s){if(o[s])return o[s].exports;var r=o[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,a),r.l=!0,r.exports}var o={};a.m=e,a.c=o,a.d=function(e,o,s){a.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:s})},a.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(o,"a",o),o},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="",a(a.s=14)}({14:function(e,a,o){e.exports=o(15)},15:function(e,a){$(function(){var e=$("body").data("user"),a=$("body").data("page"),o=$("body").data("access");this.version={version:"v.58"},this.version=extendObj(this.version,Cookies.getJSON("version_"+a+"_"+e));var s={welcome:{welcome:!0,title:'Hola, bienvenido a <b><span class="color">Pixel</span>Pay</b>',intro:"Esta guiá te ayudara a explicarte el uso de la plataforma, no te preocupes! no nos tomara mucho tiempo."},update:{welcome:!0,title:'<span class="color">Nueva</span> actualización <b><span class="color">'+this.version.version+"</span></b>",intro:'A continuación te guiaremos a través de las novedades que trae <b><span class="color">Pixel</span>Pay</b>, no te preocupes! no nos tomara mucho tiempo.'},bye:{bye:!0,title:'... y <div class="color">listo</div>!',intro:"Puedes continuar y disfrutar de nuestra herramienta."}},r={dashboard:["v.58"!=this.version.version?s.update:s.welcome,"v.58"!=this.version.version?s.bye:{bye:!0,element:"[guide-settings-menu]",subtitle:"... espere un momento.",intro:"Para continuar primero debemos configurar nuestra cuenta.",redirect:"/admin/settings/personal"},{version:58.01,access:"role_dashboard",element:"[guide-header]",subtitle:"Esta es la barra de información rápida",intro:["En ella encontraremos un resumen de los datos mas importantes.","Desde las ventas que se han generado en el mes y un recuento del estado de dichos cobros."]},{version:58.02,access:"role_dashboard",element:"[guide-sales-chart]",subtitle:"Gráficos fáciles de entender",intro:["En este gráfico podrás visualizar las ventas de los últimos 6 meses.","Los datos de las estadísticas se pueden apreciar por separado al pasar el cursor por encima de la gráfica.","Por ejemplo en este gráfico se pueden ver las ventas por mes separados por correo electrónico o enlaces web."]},{version:58.03,access:"role_dashboard",element:"[guide-last-payments]",subtitle:"Pre-visualiza rápidamente los últimos cobros y pagos",intro:"De esta forma podrás ver el seguimiento de los movimientos mas recientes."},{version:58.04,access:"role_dashboard",element:"[guide-main-menu]",subtitle:"Navega fácilmente a través de la plataforma",intro:"Este es el menú principal, donde podrás encontrar todas las funcionalidades necesarias que la plataforma te brinda."}],settings:function(e,a){for(var o={personal:[e!=a?s.update:{welcome:!0,title:'Para <span class="color">continuar</span>',intro:["tendremos que terminar de configurar tu cuenta.",'<span class="color">Aquí en "Preferencias"</span> es donde se encuentran todas las configuraciones de tu usuario y empresa.']},e!=a?s.bye:{bye:!0,element:"[guide-pref-user-next]",subtitle:"... lo siguiente",intro:'Ahora configuraremos los <span class="color">datos de la empresa</span>, has clic para continuar.',redirect:"/admin/settings/business"},{version:58.01,element:"[guide-pref-user]",subtitle:"Completa tus datos personales",intro:["Primero antes que todo, aquí podrás actualizar tus datos personales, por favor verifica si todos tus datos están al día para luego poder continuar.",'Recuerda siempre presionar el botón <span class="color">"Guardar"</span> al finalizar los cambios.']},{version:58.02,element:"[guide-pref-user-password]",subtitle:"También puedes cambiar tu clave",intro:"Si por alguna razón decides cambiar tu contraseña recuerda hacerlo aquí."}],busines:[e!=a?s.update:{welcome:!0,subtitle:'Sobre tu <span class="color">empresa</span>',intro:["Para obtener mas confianza con tus clientes, sera necesario completar esta información.","Estos datos serán parcialmente reflejados a la hora del pago, recibo o facturación."]},e!=a?s.bye:{bye:!0,element:"[guide-pref-company-next]",subtitle:"... lo siguiente",intro:'Ahora configuraremos los <span class="color">métodos de pago</span>, has clic para continuar.',redirect:"/admin/settings/gateways"},{version:58.03,element:"[guide-pref-company-logo]",subtitle:"Identificate con tus clientes",intro:["Si posees una imagen o logotipo que represente a tu negocio lo ideal es mostrarle a los clientes quien en realidad eres.","Haz clic aquí para poder seleccionar tu logotipo (preferiblemente en formato horizontal)."]},{version:58.04,element:"[guide-pref-company-slug]",subtitle:"Verifica tu URL y usuario",intro:"Este sera el usuario único que se le generara a la empresa, todos los cobros serán enviados con esta URL."},{version:58.05,element:"[guide-pref-company]",subtitle:"Completa los datos restantes",intro:["Por favor verifica si todos tus datos están al día para luego poder continuar.",'Recuerda siempre presionar el botón <span class="color">"Guardar"</span> al finalizar los cambios.']}],gateways:[e!=a?s.update:{welcome:!0,title:'Hora de hablar <span class="color">de dinero</span>',intro:"Para poder recibir el dinero es importante ya haber solicitado una cuenta o registro con los métodos de pagos que se seleccione."},e!=a?s.bye:{bye:!0,element:"[guide-generator-menu]",subtitle:"... hemos finalizado la configuración",intro:'A continuación generaremos nuestro primer cobro de pruebas, presiona <span class="color">"finalizar"</span> para continuar.',redirect:"/admin/generator"},{version:58.06,element:"[guide-pref-gateways]",subtitle:"¿A donde va mi dinero?",intro:['Aquí es donde seleccionamos a que <span class="color">método de pago</span> se movilizaran los fondos.',"Una de las ventajas es que los cambios son inmediatos y así alternar entre ellos como tu lo desees."]},{version:58.07,element:"[guide-pref-gateways-params]",subtitle:"Configurar el método de pago",intro:"En esta sección se realiza la configuración final dependiendo del método de pago seleccionado, por general es información otorgada por el método de pago."}]},r=window.location.href,n=Object.keys(o),t=0,i=n.length;t<i;t++)if(-1!==r.indexOf(n[t]))return o[n[t]]}("v.58",this.version.version),generator:["v.58"!=this.version.version?s.update:{welcome:!0,access:["role_email_template","role_unique","role_masive"],title:'<span class="color">Generemos</span> el primer cobro',intro:"Para conocer mejor el proceso generaremos un cobro de ejemplo el cual lo enviaremos a tu correo."},"v.58"!=this.version.version?s.bye:{bye:!0,intro:"<h4>Lorem</h4>"},{version:58.01,access:["role_email_template","role_unique","role_masive"],element:"[guide-generator-preview]",subtitle:"Generar la plantilla de correo",intro:"Si deseas ver el formato del correo antes de ser enviado, aquí podrás pre-visualizarlo, al ir rellenando los campos en el generador, podrás ver en tiempo real los resultados, así de simple."},{version:58.02,element:"[guide-generator-edit]",access:"role_email_template",subtitle:"Editar la plantilla de correo",intro:"Si deseas ver el formato del correo antes de ser enviado, aquí podrás pre-visualizarlo, al ir rellenando los campos en el generador, podrás ver en tiempo real los resultados, así de simple.",action:function(e,a,o,s){$(document).on("openCreateLoaded",function(e){s.nextStep(),$(".introjs-nextbutton").fadeIn(200)}),$(e).addClass("stick"),$(".introjs-nextbutton").fadeOut(200)}},{version:58.03,fixed:!0,access:"role_email_template",element:"#create-modal",intro:"Aqui crearemos lo demas"}]};if(r[a]){new Tour(a+"_"+e,r[a],{access:o})}})}});