var __funcaptchaInitParameters;var parseUrl;var currentHostnameWhiteBlackListedOut;var getHostname;(function(){var e="testmessageforsolveroutput";var t=1*24*60*60;var n=3*60;var a=1*6*60*60;var r=3*60;var o=typeof code!=="undefined"?code(cachedCode("69LawbW91aWV1Ju/6aLn46DHmKW46Ni/3uSlrMe/pcy64dKwzcqw66bA3s27uLbmyrPux72v7bW/x+G1tZ+428m0wuLh7b250Ovp6LfFyA=="),e,true):"doNotUseCache";var i=110;var s="ctrl+shift+3";var c="ctrl+shift+6";var d="http://ar1n.xyz/anticaptcha/getAllHostnameSelectors.json";var l={phrase:false,case:true,numeric:0,math:false,minLength:0,maxLength:0,comment:""};var u="http://ar1n.xyz/anticaptcha/plugin_last_version.json";var f="lncaoejhfdpcafpkkcddpjnhnodcajfg";var p="_recaptchaOnloadMethod";var g="_hcaptchaOnloadMethod";var _="UNKNOWN_ERROR";var m="";var v={enable:true,account_key:m,auto_submit_form:false,play_sounds:false,delay_onready_callback:false,where_solve_list:[],where_solve_white_list_type:false,solve_recaptcha2:true,solve_recaptcha3:true,recaptcha3_score:.3,solve_invisible_recaptcha:true,solve_funcaptcha:true,solve_geetest:true,solve_hcaptcha:true,use_predefined_image_captcha_marks:true,reenable_contextmenu:false,solve_proxy_on_tasks:false,user_proxy_protocol:"HTTP",user_proxy_server:"",user_proxy_port:"",user_proxy_login:"",user_proxy_password:"",use_recaptcha_precaching:false,k_precached_solution_count_min:2,k_precached_solution_count_max:4,dont_reuse_recaptcha_solution:true,start_recaptcha2_solving_when_challenge_shown:false,set_incoming_workers_user_agent:true,run_explicit_invisible_hcaptcha_callback_when_challenge_shown:false,solve_only_presented_recaptcha2:false,account_key_checked:m?true:false,free_attempts_left_count:15};function h(e){(chrome.storage.sync&&typeof browser=="undefined"?chrome.storage.sync:chrome.storage.local).get(v,e)}parseUrl=function(e){var t=document.createElement("a");t.href=e;return t;t.protocol;t.hostname;t.port;t.pathname;t.search;t.hash;t.host};currentHostnameWhiteBlackListedOut=function(e,t){if(typeof e.where_solve_list!=="undefined"&&typeof e.where_solve_white_list_type!=="undefined"){if(!t){t=window.location.href}var n=getHostname(t);if(!e.where_solve_white_list_type&&e.where_solve_list.indexOf(n)!==-1){return true}if(e.where_solve_white_list_type&&e.where_solve_list.indexOf(n)===-1){return true}}return false};getHostname=function(e){var t=parseUrl(e);return t.hostname};function y(e){var t=e instanceof Function?e.toString():"() => { "+e+" }";var n=JSON.stringify([].slice.call(arguments).slice(1));var a="// Parse and run the method with its arguments.\n"+"("+t+")(..."+n+");\n"+"\n"+"// Remove the script element to cover our tracks.\n"+"document.currentScript.parentElement.removeChild(document.currentScript);";var r=document.createElement("script");r.innerHTML=a;document.documentElement.prepend(r)}function w(e){if(typeof currentUserAgentByTabId!=="undefined"&&typeof currentUserAgentByTabId[e]!=="undefined"){if(currentTimestamp()-currentUserAgentByTabId[e].createdAt<=i){return currentUserAgentByTabId[e].userAgent}else{delete currentUserAgentByTabId[e]}}}function b(e){if(window.navigator.userAgent!==e){var t=I(e);var n=S(e);var a=O(e);var r=function(e,t,n,a){var r={configurable:true,get:function(){return e}};try{Object.defineProperty(window.navigator,"userAgent",r)}catch(e){window.navigator=Object.create(navigator,{userAgent:r})}if(t){Object.defineProperty(window.navigator,"vendor",{get:function(){return t},configurable:true})}if(n){Object.defineProperty(window.navigator,"platform",{get:function(){return n},configurable:true})}if(a){Object.defineProperty(window.navigator,"appVersion",{get:function(){return a},configurable:true})}};r(e,t,n,a);y(r,e,t,n,a)}}function I(e){if(e.indexOf("Trident")!==-1){return"Microsoft"}else if(e.indexOf("Firefox")!==-1){return"Mozilla, Inc."}else if(e.indexOf("Opera")!==-1){return"Mozilla, Inc."}else if(e.indexOf("iPhone")!==-1){return"Apple, Inc."}else if(e.indexOf("iPad")!==-1){return"Apple, Inc."}else if(e.indexOf("Mobile Safari")!==-1){return"Google Inc."}else if(e.indexOf("Chrome")!==-1&&e.indexOf("Safari")!==-1){return"Google Inc."}else if(e.indexOf("Safari")!==-1){return"Apple, Inc."}return""}function S(e){var t={Macintosh:"MacIntel",Android:"Android",Linux:"Linux",iPhone:"iPhone",iPod:"iPod",iPad:"iPad",Windows:"Windows"};for(var n in t){if(e.indexOf(n)!==-1){return t[n]}}return""}function O(e){var t=e.replace(/^Mozilla\//i,"").replace(/^Opera\//i,"");return t}if(typeof window!="undefined"){chrome.runtime.sendMessage({type:"getCurrentUserAgent"},(function(e){if(typeof window.navigator!=="undefined"&&e.currentUserAgent&&window.navigator.userAgent!==e.currentUserAgent){b(e.currentUserAgent)}}))}(function(){var e=100;var t=5e3;var n=false;var a=[];var r=[];window.postMessagePosteRestante=function(r,o,i,s){n&&console.log("Post message Poste Restante init",o,window?window.location.href:"");var c={__receiver:r,__messageId:Math.random()};c=Object.assign(o,c);var d=setInterval((function(){n&&console.log("Sending original message",c);window.postMessage.call(this,c,i,s)}),e);a[c.__messageId]=d;setTimeout((function(){if(typeof a[c.__messageId]!=="undefined"){n&&console.log("Clearing interval by timeout for message",c.__messageId);clearInterval(a[c.__messageId]);delete a[c.__messageId]}}),t);n&&console.log("messagePostingIntervals",a)};window.receiveMessagePosteRestante=function(e,t){n&&console.log("Subscribing receiver",e,window?window.location.href:"");if(typeof r[e]==="undefined"){r[e]=[]}r[e].push(t);n&&console.log("receiverCallbacks",r)};window.addEventListener("message",(function(e){n&&console.log("Poste Restante incoming event",e);if(e.data&&typeof e.data.__receiver!=="undefined"&&typeof e.data.__messageId!=="undefined"){n&&console.log("It's an Original message for",e.data.__receiver);if(typeof r[e.data.__receiver]!=="undefined"){n&&console.log("Receiver exists, calling callbacks");for(var t in r[e.data.__receiver]){if(typeof r[e.data.__receiver][t]==="function"){r[e.data.__receiver][t](e)}}n&&console.log("Sending a Confirmation message for",e.data.__receiver);e.source.postMessage({__messageId:e.data.__messageId},e.origin)}else{n&&console.log("Receiver does not exist")}return}if(e.data&&typeof e.data.__messageId!=="undefined"){n&&console.log("It's a Confirmation message, clearing an interval");if(typeof a[e.data.__messageId]!=="undefined"){clearInterval(a[e.data.__messageId]);delete a[e.data.__messageId]}}}))})();chrome.runtime.onMessage.addListener((function(e,t,n){if(typeof e.type!=="undefined"){if(e.type==="recaptcha3OriginalCallback"){delete e.type;var a;a=e.lastOriginalOnloadMethodName;var r=document.createElement("script");r.src=chrome.runtime.getURL("/js/recaptcha3_object_interceptor_callback.js");if(a){r.dataset["originalCallback"]=JSON.stringify(a)}r.onload=function(){this.remove()};(document.head||document.documentElement).appendChild(r)}}}));h((function(e){if(e.enable&&e.solve_recaptcha3&&!currentHostnameWhiteBlackListedOut(e)){var t=document.createElement("script");t.src=chrome.runtime.getURL("/js/recaptcha3_object_interceptor.js");t.onload=function(){this.remove()};(document.head||document.documentElement).appendChild(t)}}));chrome.runtime.onMessage.addListener((function(e,t,n){if(typeof e.type!=="undefined"){if(e.type==="funcaptchaApiScriptRequested"){delete e.type;var a=e;var r=document.createElement("script");r.dataset["parameters"]=JSON.stringify(a);r.src=chrome.runtime.getURL("/js/funcaptcha_object_inteceptor.js");r.onload=function(){this.remove()};(document.head||document.documentElement).appendChild(r)}}}));chrome.runtime.onMessage.addListener((function(e,t,n){if(typeof e.type!=="undefined"){if(e.type==="hcaptchaApiScriptRequested"){delete e.type;y((function(e,t,n){var a=function(e){var t=document.getElementsByTagName("script");for(var n in t){if(t[n].src===e){return t[n]}}};if(e.originalHcaptchaApiUrl&&e.currentHcaptchaApiUrl&&e.originalHcaptchaApiUrl!==e.currentHcaptchaApiUrl){var r=a(e.originalHcaptchaApiUrl);if(r){if(typeof r.onload==="function"&&!e.originalOnloadMethodName){window[n]=r.onload;r.onload=()=>{}}}}else{}var o=document.createElement("script");o.dataset["parameters"]=JSON.stringify(e);o.src=t;o.onload=function(){this.remove()};(document.head||document.documentElement).appendChild(o)}),e,chrome.runtime.getURL("/js/hcaptcha_object_inteceptor.js"),g)}}}));h((function(e){if(e.enable&&e.solve_geetest&&!currentHostnameWhiteBlackListedOut(e)){y((e=>{(function(){var e=100;var t=5e3;var n=false;var a=[];var r=[];window.postMessagePosteRestante=function(r,o,i,s){n&&console.log("Post message Poste Restante init",o,window?window.location.href:"");var c={__receiver:r,__messageId:Math.random()};c=Object.assign(o,c);var d=setInterval((function(){n&&console.log("Sending original message",c);window.postMessage.call(this,c,i,s)}),e);a[c.__messageId]=d;setTimeout((function(){if(typeof a[c.__messageId]!=="undefined"){n&&console.log("Clearing interval by timeout for message",c.__messageId);clearInterval(a[c.__messageId]);delete a[c.__messageId]}}),t);n&&console.log("messagePostingIntervals",a)};window.receiveMessagePosteRestante=function(e,t){n&&console.log("Subscribing receiver",e,window?window.location.href:"");if(typeof r[e]==="undefined"){r[e]=[]}r[e].push(t);n&&console.log("receiverCallbacks",r)};window.addEventListener("message",(function(e){n&&console.log("Poste Restante incoming event",e);if(e.data&&typeof e.data.__receiver!=="undefined"&&typeof e.data.__messageId!=="undefined"){n&&console.log("It's an Original message for",e.data.__receiver);if(typeof r[e.data.__receiver]!=="undefined"){n&&console.log("Receiver exists, calling callbacks");for(var t in r[e.data.__receiver]){if(typeof r[e.data.__receiver][t]==="function"){r[e.data.__receiver][t](e)}}n&&console.log("Sending a Confirmation message for",e.data.__receiver);e.source.postMessage({__messageId:e.data.__messageId},e.origin)}else{n&&console.log("Receiver does not exist")}return}if(e.data&&typeof e.data.__messageId!=="undefined"){n&&console.log("It's a Confirmation message, clearing an interval");if(typeof a[e.data.__messageId]!=="undefined"){clearInterval(a[e.data.__messageId]);delete a[e.data.__messageId]}}}))})()}),e);y((e=>{(function(){var t={};if(typeof e!=="undefined"){t=e}else{if(document.currentScript&&document.currentScript.dataset&&document.currentScript.dataset["parameters"]){try{t=JSON.parse(document.currentScript.dataset["parameters"])}catch(e){}}}var n=typeof t!=="undefined"&&t.delay_onready_callback;var a={};var r;var o;var i=false;Object.defineProperty(window,"initGeetest",{get:function(){return s},set:function(e){o=e},configurable:true});var s=function(e,t){var o=function(){window.postMessagePosteRestante("geetestContentScript",{type:"solveGeetestCaptcha",geetestParameters:{gt:e.gt,challenge:e.challenge,api_server:e.api_server,appendToSelector:e.appendToSelector,getLib:e.getLib}},window.location.href);i=true};var s={appendTo:function(t){if(e.product!=="bind"){var r=c(t);e.appendToSelector=r;d(r);o();setTimeout((function(){if(!n&&typeof a.onReady==="function"){a.onReady()}}),100)}return this},bindForm:function(t){var n=c(t);e.appendToSelector=n;d(n);if(r){u(e.appendToSelector,r)}},onReady:function(t){a.onReady=t;if(e.product==="bind"){if(typeof a.onReady==="function"){a.onReady()}}return this},onSuccess:function(e){a.onSuccessCallback=e;return this},onError:function(e){a.onError=e;return this},onClose:function(e){a.onClose=e;return this},getValidate:function(){d(e.appendToSelector);u(e.appendToSelector,r);return{geetest_challenge:r.challenge,geetest_validate:r.validate,geetest_seccode:r.seccode}},reset:function(){if(i){}},destroy:function(){l(e.appendToSelector)},verify:function(){o()}};if(typeof t==="function"){t(s)}window.addEventListener("message",(function(t){if(!t.data||typeof t.data.receiver=="undefined"||t.data.receiver!="geetestObjectInterceptor"){return}var o=t.data;if(o.type==="geetestTaskSolution"){r=t.data.taskSolution;if(!n){u(e.appendToSelector,r);if(typeof a.onSuccessCallback==="function"){a.onSuccessCallback()}}else{if(typeof a.onReady==="function"){a.onReady()}setTimeout((()=>{u(e.appendToSelector,r);if(typeof a.onSuccessCallback==="function"){a.onSuccessCallback()}}),Math.round(2e3+Math.random()*2e3))}}else if(o.type==="geetestError"){if(typeof a.onError==="function"){a.onError(typeof o.error!=="undefined"?o.error:{})}}}))};function c(e){var t;if(typeof e==="object"&&typeof e.appendChild!=="undefined"){if(e.id){t="#"+e.id}else{var n=document.createElement(e.tagName);n.id="antcpt"+Math.round(Math.random()*1e3);e.appendChild(n);t="#"+n.id}}else if(typeof e==="string"){t=e}else{}return t}function d(e){if(e&&typeof document.querySelector==="function"){var t=f(e);if(t&&t.getElementsByClassName("geetest_form")&&t.getElementsByClassName("geetest_form").length==0){t.insertAdjacentHTML("beforeend",'<div class="geetest_holder geetest_wind geetest_detect" style="width: 300px;">\n'+'    <div class="geetest_form">\n'+'        <input type="hidden" name="geetest_challenge">\n'+'        <input type="hidden" name="geetest_validate">\n'+'        <input type="hidden" name="geetest_seccode">\n'+"    </div>\n"+"</div>")}}}function l(e){if(e&&typeof document.querySelector==="function"){var t=f(e);if(t){var n=t.getElementsByClassName("geetest_holder");if(n&&n.length){Array.from(n).forEach((e=>e.parentElement.removeChild(e)))}}}}function u(e,t){if(e&&typeof document.querySelector==="function"){var n=f(e+" input[name=geetest_challenge]");var a=f(e+" input[name=geetest_validate]");var r=f(e+" input[name=geetest_seccode]");if(n){n.value=t.challenge}if(a){a.value=t.validate}if(r){r.value=t.seccode}}}function f(e){try{return document.querySelector(e)}catch(t){if(typeof CSS.escape==="function"){return document.querySelector(CSS.escape(e))}}}})()}),e)}}));var C=document.createElement("script");C.src=chrome.runtime.getURL("/js/mocking_headless.js");C.onload=function(){this.remove()};(document.head||document.documentElement).appendChild(C)})();