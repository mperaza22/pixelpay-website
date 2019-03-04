!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=12)}({12:function(e,t,n){e.exports=n(13)},13:function(e,t,n){var i,r,s,a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(n,a){r=[],i=a,void 0!==(s="function"==typeof i?i.apply(t,r):i)&&(e.exports=s)}(0,function(){"use strict";function e(e,t){t=t||{};var n=t.dynamicTyping||!1;if(m(n)&&(t.dynamicTypingFunction=n,n={}),t.dynamicTyping=n,t.worker&&S.WORKERS_SUPPORTED){var a=f();return a.userStep=t.step,a.userChunk=t.chunk,a.userComplete=t.complete,a.userError=t.error,t.step=m(t.step),t.chunk=m(t.chunk),t.complete=m(t.complete),t.error=m(t.error),delete t.worker,void a.postMessage({input:e,config:t,workerId:a.id})}var u=null;return"string"==typeof e?u=t.download?new i(t):new s(t):!0===e.readable&&m(e.read)&&m(e.on)?u=new o(t):(y.File&&e instanceof File||e instanceof Object)&&(u=new r(t)),u.stream(e)}function t(e,t){function n(e){if("object"!=(void 0===e?"undefined":a(e)))return[];var t=[];for(var n in e)t.push(n);return t}function i(e,t){var n="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var i=e instanceof Array&&e.length>0,s=!(t[0]instanceof Array);if(i&&u){for(var a=0;a<e.length;a++)a>0&&(n+=h),n+=r(e[a],a);t.length>0&&(n+=f)}for(var o=0;o<t.length;o++){for(var c=i?e.length:t[o].length,d=0;d<c;d++){d>0&&(n+=h);var l=i&&s?e[d]:d;n+=r(t[o][l],d)}o<t.length-1&&(n+=f)}return n}function r(e,t){return void 0===e||null===e?"":(e=e.toString().replace(d,c+c),"boolean"==typeof o&&o||o instanceof Array&&o[t]||s(e,S.BAD_DELIMITERS)||e.indexOf(h)>-1||" "===e.charAt(0)||" "===e.charAt(e.length-1)?c+e+c:e)}function s(e,t){for(var n=0;n<t.length;n++)if(e.indexOf(t[n])>-1)return!0;return!1}var o=!1,u=!0,h=",",f="\r\n",c='"';!function(){"object"==(void 0===t?"undefined":a(t))&&("string"==typeof t.delimiter&&1===t.delimiter.length&&-1===S.BAD_DELIMITERS.indexOf(t.delimiter)&&(h=t.delimiter),("boolean"==typeof t.quotes||t.quotes instanceof Array)&&(o=t.quotes),"string"==typeof t.newline&&(f=t.newline),"string"==typeof t.quoteChar&&(c=t.quoteChar),"boolean"==typeof t.header&&(u=t.header))}();var d=new RegExp(c,"g");if("string"==typeof e&&(e=JSON.parse(e)),e instanceof Array){if(!e.length||e[0]instanceof Array)return i(null,e);if("object"==a(e[0]))return i(n(e[0]),e)}else if("object"==(void 0===e?"undefined":a(e)))return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),e.data instanceof Array&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=e.data[0]instanceof Array?e.fields:n(e.data[0])),e.data[0]instanceof Array||"object"==a(e.data[0])||(e.data=[e.data])),i(e.fields||[],e.data||[]);throw"exception: Unable to serialize unrecognized input"}function n(e){function t(e){var t=_(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new u(t),this._handle.streamer=this,this._config=t}this._handle=null,this._paused=!1,this._finished=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},t.call(this,e),this.parseChunk=function(e){if(this.isFirstChunk&&m(this._config.beforeFirstChunk)){var t=this._config.beforeFirstChunk(e);void 0!==t&&(e=t)}this.isFirstChunk=!1;var n=this._partialLine+e;this._partialLine="";var i=this._handle.parse(n,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var r=i.meta.cursor;this._finished||(this._partialLine=n.substring(r-this._baseIndex),this._baseIndex=r),i&&i.data&&(this._rowCount+=i.data.length);var s=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(b)y.postMessage({results:i,workerId:S.WORKER_ID,finished:s});else if(m(this._config.chunk)){if(this._config.chunk(i,this._handle),this._paused)return;i=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(i.data),this._completeResults.errors=this._completeResults.errors.concat(i.errors),this._completeResults.meta=i.meta),!s||!m(this._config.complete)||i&&i.meta.aborted||this._config.complete(this._completeResults,this._input),s||i&&i.meta.paused||this._nextChunk(),i}},this._sendError=function(e){m(this._config.error)?this._config.error(e):b&&this._config.error&&y.postMessage({workerId:S.WORKER_ID,error:e,finished:!1})}}function i(e){function t(e){var t=e.getResponseHeader("Content-Range");return null===t?-1:parseInt(t.substr(t.lastIndexOf("/")+1))}e=e||{},e.chunkSize||(e.chunkSize=S.RemoteChunkSize),n.call(this,e);var i;this._nextChunk=k?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)return void this._chunkLoaded();if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),k||(i.onload=g(this._chunkLoaded,this),i.onerror=g(this._chunkError,this)),i.open("GET",this._input,!k),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t])}if(this._config.chunkSize){var n=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+n),i.setRequestHeader("If-None-Match","webkit-no-cache")}try{i.send()}catch(e){this._chunkError(e.message)}k&&0===i.status?this._chunkError():this._start+=this._config.chunkSize},this._chunkLoaded=function(){if(4==i.readyState){if(i.status<200||i.status>=400)return void this._chunkError();this._finished=!this._config.chunkSize||this._start>t(i),this.parseChunk(i.responseText)}},this._chunkError=function(e){var t=i.statusText||e;this._sendError(t)}}function r(e){e=e||{},e.chunkSize||(e.chunkSize=S.LocalChunkSize),n.call(this,e);var t,i,r="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,i=e.slice||e.webkitSlice||e.mozSlice,r?(t=new FileReader,t.onload=g(this._chunkLoaded,this),t.onerror=g(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var n=Math.min(this._start+this._config.chunkSize,this._input.size);e=i.call(e,this._start,n)}var s=t.readAsText(e,this._config.encoding);r||this._chunkLoaded({target:{result:s}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function s(e){e=e||{},n.call(this,e);var t,i;this.stream=function(e){return t=e,i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?i.substr(0,e):i;return i=e?i.substr(e):"",this._finished=!i,this.parseChunk(t)}}}function o(e){e=e||{},n.call(this,e);var t=[],i=!0;this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._nextChunk=function(){t.length?this.parseChunk(t.shift()):i=!0},this._streamData=g(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=g(function(e){this._streamCleanUp(),this._sendError(e.message)},this),this._streamEnd=g(function(){this._streamCleanUp(),this._finished=!0,this._streamData("")},this),this._streamCleanUp=g(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function u(e){function t(){if(C&&p&&(c("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+S.DefaultDelimiter+"'"),p=!1),e.skipEmptyLines)for(var t=0;t<C.data.length;t++)1===C.data[t].length&&""===C.data[t][0]&&C.data.splice(t--,1);return n()&&i(),a()}function n(){return e.header&&0===w.length}function i(){if(C){for(var e=0;n()&&e<C.data.length;e++)for(var t=0;t<C.data[e].length;t++)w.push(C.data[e][t]);C.data.splice(0,1)}}function r(t){return e.dynamicTypingFunction&&void 0===e.dynamicTyping[t]&&(e.dynamicTyping[t]=e.dynamicTypingFunction(t)),!0===(e.dynamicTyping[t]||e.dynamicTyping)}function s(e,t){return r(e)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&f(t):t}function a(){if(!C||!e.header&&!e.dynamicTyping)return C;for(var t=0;t<C.data.length;t++){for(var n=e.header?{}:[],i=0;i<C.data[t].length;i++){var r=i,a=C.data[t][i];e.header&&(r=i>=w.length?"__parsed_extra":w[i]),a=s(r,a),"__parsed_extra"===r?(n[r]=n[r]||[],n[r].push(a)):n[r]=a}C.data[t]=n,e.header&&(i>w.length?c("FieldMismatch","TooManyFields","Too many fields: expected "+w.length+" fields but parsed "+i,t):i<w.length&&c("FieldMismatch","TooFewFields","Too few fields: expected "+w.length+" fields but parsed "+i,t))}return e.header&&C.meta&&(C.meta.fields=w),C}function o(t,n){for(var i,r,s,a=[",","\t","|",";",S.RECORD_SEP,S.UNIT_SEP],o=0;o<a.length;o++){var u=a[o],f=0,c=0;s=void 0;for(var d=new h({delimiter:u,newline:n,preview:10}).parse(t),l=0;l<d.data.length;l++){var p=d.data[l].length;c+=p,void 0!==s?p>1&&(f+=Math.abs(p-s),s=p):s=p}d.data.length>0&&(c/=d.data.length),(void 0===r||f<r)&&c>1.99&&(r=f,i=u)}return e.delimiter=i,{successful:!!i,bestDelimiter:i}}function u(e){e=e.substr(0,1048576);var t=e.split("\r"),n=e.split("\n"),i=n.length>1&&n[0].length<t[0].length;if(1===t.length||i)return"\n";for(var r=0,s=0;s<t.length;s++)"\n"===t[s][0]&&r++;return r>=t.length/2?"\r\n":"\r"}function f(e){return g.test(e)?parseFloat(e):e}function c(e,t,n,i){C.errors.push({type:e,code:t,message:n,row:i})}var d,l,p,g=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,v=this,y=0,k=!1,b=!1,w=[],C={data:[],errors:[],meta:{}};if(m(e.step)){var R=e.step;e.step=function(i){if(C=i,n())t();else{if(t(),0===C.data.length)return;y+=i.data.length,e.preview&&y>e.preview?l.abort():R(C,v)}}}this.parse=function(n,i,r){if(e.newline||(e.newline=u(n)),p=!1,e.delimiter)m(e.delimiter)&&(e.delimiter=e.delimiter(n),C.meta.delimiter=e.delimiter);else{var s=o(n,e.newline);s.successful?e.delimiter=s.bestDelimiter:(p=!0,e.delimiter=S.DefaultDelimiter),C.meta.delimiter=e.delimiter}var a=_(e);return e.preview&&e.header&&a.preview++,d=n,l=new h(a),C=l.parse(d,i,r),t(),k?{meta:{paused:!0}}:C||{meta:{paused:!1}}},this.paused=function(){return k},this.pause=function(){k=!0,l.abort(),d=d.substr(l.getCharIndex())},this.resume=function(){k=!1,v.streamer.parseChunk(d)},this.aborted=function(){return b},this.abort=function(){b=!0,l.abort(),C.meta.aborted=!0,m(e.complete)&&e.complete(C),d=""}}function h(e){e=e||{};var t=e.delimiter,n=e.newline,i=e.comments,r=e.step,s=e.preview,a=e.fastMode,o=e.quoteChar||'"';if(("string"!=typeof t||S.BAD_DELIMITERS.indexOf(t)>-1)&&(t=","),i===t)throw"Comment character same as delimiter";!0===i?i="#":("string"!=typeof i||S.BAD_DELIMITERS.indexOf(i)>-1)&&(i=!1),"\n"!=n&&"\r"!=n&&"\r\n"!=n&&(n="\n");var u=0,h=!1;this.parse=function(e,f,c){function d(e){C.push(e),E=u}function l(t){return c?_():(void 0===t&&(t=e.substr(u)),S.push(t),u=v,d(S),w&&g(),_())}function p(t){u=t,d(S),S=[],T=e.indexOf(n,u)}function _(e){return{data:C,errors:R,meta:{delimiter:t,linebreak:n,aborted:h,truncated:!!e,cursor:E+(f||0)}}}function g(){r(_()),C=[],R=[]}if("string"!=typeof e)throw"Input must be a string";var v=e.length,y=t.length,k=n.length,b=i.length,w=m(r);u=0;var C=[],R=[],S=[],E=0;if(!e)return _();if(a||!1!==a&&-1===e.indexOf(o)){for(var x=e.split(n),O=0;O<x.length;O++){var S=x[O];if(u+=S.length,O!==x.length-1)u+=n.length;else if(c)return _();if(!i||S.substr(0,b)!==i){if(w){if(C=[],d(S.split(t)),g(),h)return _()}else d(S.split(t));if(s&&O>=s)return C=C.slice(0,s),_(!0)}}return _()}for(var I=e.indexOf(t,u),T=e.indexOf(n,u),D=new RegExp(o+o,"g");;)if(e[u]!==o)if(i&&0===S.length&&e.substr(u,b)===i){if(-1===T)return _();u=T+k,T=e.indexOf(n,u),I=e.indexOf(t,u)}else if(-1!==I&&(I<T||-1===T))S.push(e.substring(u,I)),u=I+y,I=e.indexOf(t,u);else{if(-1===T)break;if(S.push(e.substring(u,T)),p(T+k),w&&(g(),h))return _();if(s&&C.length>=s)return _(!0)}else{var P=u;for(u++;;){var P=e.indexOf(o,P+1);if(-1===P)return c||R.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:C.length,index:u}),l();if(P===v-1){var L=e.substring(u,P).replace(D,o);return l(L)}if(e[P+1]!==o){if(e[P+1]===t){S.push(e.substring(u,P).replace(D,o)),u=P+1+y,I=e.indexOf(t,u),T=e.indexOf(n,u);break}if(e.substr(P+1,k)===n){if(S.push(e.substring(u,P).replace(D,o)),p(P+1+k),I=e.indexOf(t,u),w&&(g(),h))return _();if(s&&C.length>=s)return _(!0);break}}else P++}}return l()},this.abort=function(){h=!0},this.getCharIndex=function(){return u}}function f(){if(!S.WORKERS_SUPPORTED)return!1;if(!w&&null===S.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var e=S.SCRIPT_PATH||v;e+=(-1!==e.indexOf("?")?"&":"?")+"papaworker";var t=new y.Worker(e);return t.onmessage=c,t.id=R++,C[t.id]=t,t}function c(e){var t=e.data,n=C[t.workerId],i=!1;if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){var r=function(){i=!0,d(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},s={abort:r,pause:l,resume:l};if(m(n.userStep)){for(var a=0;a<t.results.data.length&&(n.userStep({data:[t.results.data[a]],errors:t.results.errors,meta:t.results.meta},s),!i);a++);delete t.results}else m(n.userChunk)&&(n.userChunk(t.results,s,t.file),delete t.results)}t.finished&&!i&&d(t.workerId,t.results)}function d(e,t){var n=C[e];m(n.userComplete)&&n.userComplete(t),n.terminate(),delete C[e]}function l(){throw"Not implemented."}function p(e){var t=e.data;if(void 0===S.WORKER_ID&&t&&(S.WORKER_ID=t.workerId),"string"==typeof t.input)y.postMessage({workerId:S.WORKER_ID,results:S.parse(t.input,t.config),finished:!0});else if(y.File&&t.input instanceof File||t.input instanceof Object){var n=S.parse(t.input,t.config);n&&y.postMessage({workerId:S.WORKER_ID,results:n,finished:!0})}}function _(e){if("object"!=(void 0===e?"undefined":a(e)))return e;var t=e instanceof Array?[]:{};for(var n in e)t[n]=_(e[n]);return t}function g(e,t){return function(){e.apply(t,arguments)}}function m(e){return"function"==typeof e}var v,y=function(){return"undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==y?y:{}}(),k=!y.document&&!!y.postMessage,b=k&&/(\?|&)papaworker(=|&|$)/.test(y.location.search),w=!1,C={},R=0,S={};if(S.parse=e,S.unparse=t,S.RECORD_SEP=String.fromCharCode(30),S.UNIT_SEP=String.fromCharCode(31),S.BYTE_ORDER_MARK="\ufeff",S.BAD_DELIMITERS=["\r","\n",'"',S.BYTE_ORDER_MARK],S.WORKERS_SUPPORTED=!k&&!!y.Worker,S.SCRIPT_PATH=null,S.LocalChunkSize=10485760,S.RemoteChunkSize=5242880,S.DefaultDelimiter=",",S.Parser=h,S.ParserHandle=u,S.NetworkStreamer=i,S.FileStreamer=r,S.StringStreamer=s,S.ReadableStreamStreamer=o,y.jQuery){var E=y.jQuery;E.fn.parse=function(e){function t(){if(0===s.length)return void(m(e.complete)&&e.complete());var t=s[0];if(m(e.before)){var r=e.before(t.file,t.inputElem);if("object"==(void 0===r?"undefined":a(r))){if("abort"===r.action)return void n("AbortError",t.file,t.inputElem,r.reason);if("skip"===r.action)return void i();"object"==a(r.config)&&(t.instanceConfig=E.extend(t.instanceConfig,r.config))}else if("skip"===r)return void i()}var o=t.instanceConfig.complete;t.instanceConfig.complete=function(e){m(o)&&o(e,t.file,t.inputElem),i()},S.parse(t.file,t.instanceConfig)}function n(t,n,i,r){m(e.error)&&e.error({name:t},n,i,r)}function i(){s.splice(0,1),t()}var r=e.config||{},s=[];return this.each(function(e){if("INPUT"!==E(this).prop("tagName").toUpperCase()||"file"!==E(this).attr("type").toLowerCase()||!y.FileReader||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)s.push({file:this.files[t],inputElem:this,instanceConfig:E.extend({},r)})}),t(),this}}return b?y.onmessage=p:S.WORKERS_SUPPORTED&&(v=function(){var e=document.getElementsByTagName("script");return e.length?e[e.length-1].src:""}(),document.body?document.addEventListener("DOMContentLoaded",function(){w=!0},!0):w=!0),i.prototype=Object.create(n.prototype),i.prototype.constructor=i,r.prototype=Object.create(n.prototype),r.prototype.constructor=r,s.prototype=Object.create(s.prototype),s.prototype.constructor=s,o.prototype=Object.create(n.prototype),o.prototype.constructor=o,S})}});