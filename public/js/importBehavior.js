!function(e){function n(t){if(i[t])return i[t].exports;var r=i[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var i={};n.m=e,n.c=i,n.d=function(e,i,t){n.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(i,"a",i),i},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=10)}({10:function(e,n,i){e.exports=i(11)},11:function(e,n){+function(e){"use strict";var n=function(e,n,i){for(var t=i,r=[],a=0;a<n.length;a++)r.push(n[a].toLowerCase());for(var a=0;a<e.length;a+=1){var o=r.indexOf(e[a]);if(o>-1)return o}return t},i=function(i){var t={},r={name:["name","nombre","client","cliente","customer","first name","primer nombre"],email:["email","e-mail","correo","correo electronico"],amount:["amount","total","price","cantidad","precio"],tax:["tax","impuesto","imp"],rtn:["number id","rtn","id","numero de identidad","identidad"],ref:["ref","reference","invoice","number","numero","referencia","recibo","factura"]};return e.each(r,function(e,r){t[e]="ref"==e||"rtn"==e||"tax"==e?n(r,i,-2):n(r,i,-1)}),t},t=function(){this.onLoadFile=function(n){var t,r,a="<ul>",o="valid";r=e("#csv-fields").connect(),t=i(n[0]),e.each(t,function(e,n){a+=n>-1?"<li data-index='"+n+"' data-connect='"+e+"'' class='valid'><i class='mdi mdi-check-circle'/> VALIDO</li>":-2==n?"<li data-index='"+n+"' data-connect='"+e+"''><i class='mdi mdi-alert-circle'/> OPCIONAL</li>":"<li data-index='"+n+"' data-connect='"+e+"'' class='invalid'><i class='mdi mdi-close-circle'/> REQUERIDO</li>",-1==n&&(o="invalid")}),a+="</ul>",e("#csv-fields .fields-file").empty().append(a),e(".type_massive").attr("data-mode",o),e("li[data-name]").on("drop",function(e){e.preventDefault()}),e.each(t,function(e,n){r.drawLine({left_node:'[data-name="'+e+'"]',right_node:'[data-connect="'+e+'"]',horizantal_gap:10,error:!0,width:2,color:"#99ACD2"})}),"valid"==o&&(e('[name="csv_file"]').val(JSON.stringify(n)),e('[name="csv_index"]').val(JSON.stringify(t)))}};e.importBehavior=new t}(window.jQuery)}});