(function(){const r={modules:{},utils:{}};const s={context:{TRACKIER:"trackier",APPSFLYER:"appsflyer",ANDROID:"Android",IOS:"iOS"}};return new function initUltron(){const e=()=>{console.log("Running Ultron version","1.0.5");function _showFeedback(i){return function({title:e,description:t,suffix:n,fail:r,toast:s}){const a=i+(n?" - "+n:"");const o=(e||a)+" | "+(!r?"Sucesso":"Falhou");if(s){SpreadsheetApp.getActiveSpreadsheet().toast(t,o+"\n",15)}else{SpreadsheetApp.getUi().alert(o,t,SpreadsheetApp.getUi().ButtonSet.OK)}}}function _handleQueryString(r){if(typeof r!=="object")return"";const s=(e,t)=>encodeURIComponent(e)+"="+encodeURIComponent(t);return"?"+Object.keys(r).reduce(function(e,t){if(r[t]===undefined)return e;if(Array.isArray(r[t])){const n=r[t].map(e=>s(`${t}[]`,e));return e.concat(n)}return e.concat(s(t,r[t]))},[]).join("&")}function _replaceParamsByValues(e,t){const n=typeof t==="object"&&!Array.isArray(t)?t:{};const r=Object.keys(n);var s=e;r.forEach(function(e){s=s.replace(":"+e,n[e])});return s}function _requester(o,i){return{get:function(e,t,n,r={}){if(typeof e!=="string")return undefined;const s=o+_replaceParamsByValues(e,t)+_handleQueryString(n);console.log("requesting: "+s);const a=UrlFetchApp.fetch(s,{contentType:"application/json",muteHttpExceptions:true,headers:{...i,...r}});if(a.getResponseCode()===200){return JSON.parse(a.getContentText())}else{_showFeedback("System")({fail:true,description:"Erro na request: "+s+"\n\nCode: "+a.getResponseCode()+"\nResponse: "+a.getContentText()});return undefined}}}}const e=(t,n)=>{if(typeof t!=="string"||!n||typeof n.url_base!=="string")return false;if(n&&n.headers!==undefined&&typeof n.headers!=="object")return false;if(r.modules[t]){console.log(t+" already exists in the ULTRON instance.");return false}r.modules[t]=function(){const e=t.toLowerCase().split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ");return{request:_requester(n.url_base,n.headers),showFeedback:_showFeedback(e)}};return r.modules[t]};const t=(e,t)=>{if(typeof e!=="string"||typeof t!=="object"||Array.isArray(t))return false;if(r.utils[e]){console.log(e+" already exists in the ULTRON instance.");return false}r.utils[e]=function(){return t};return r.utils[e]};const n={GLOBAL:s,addModule:e,addUtils:t,getUtil:e=>r.utils[e],getModule:e=>r.modules[e]};return{...n,dispatches:{updateTSIJarvis:()=>updateTSIJarvis.call(n),updateTrackierConversions:()=>updateConversions.call(n,n.GLOBAL.context.TRACKIER),updateAppsflyerConversions:()=>updateConversions.call(n,n.GLOBAL.context.APPSFLYER),updateClicks:()=>updateClicks.call(n,n.GLOBAL.context.TRACKIER),updateNFeJarvis:()=>updateNFeJarvis.call(n),updateCurrenciesJarvis:()=>updateCurrenciesJarvis.call(n),updatecostUA_RTGJarvis:()=>updatecostUA_RTGJarvis.call(n),updatecostCostMPJarvis:()=>updatecostCostMPJarvis.call(n),updateMPAutomationJarvis:()=>updateMPAutomationJarvis.call(n),updateCurrenciesMPAutomationJarvis:()=>updateCurrenciesMPAutomationJarvis.call(n),updateNegativeList:()=>updateNegativeList.call(n)}}};const t=e();t.addModule("jarvis",{url_base:"https://jarvis-api-gateway.apps.dev.rankmycluster.com/jarvis",headers:{Authorization:"<token>"}});t.addModule("media",{url_base:"https://jarvis-api-gateway.apps.dev.rankmycluster.com/provider",headers:{Authorization:"<token>"}});t.addModule("edith",{url_base:"https://edith.apps.dev.rankmycluster.com"});initUltronUtils.call(t);return t}})();function initUltronUtils(){this.addUtils("table",{generateColumns:function(e,t){if(!Array.isArray(e))return[];return e.reduce(function(t,e){if(typeof e!=="object"||Array.isArray(e))return t;const n=[];const r=Object.keys(e);r.forEach(function(e){if(!t.includes(e)){n.push(e)}});return t.concat(n)},Array.isArray(t)?t:[])},swapArrayElement:function(e,t,n){if(!Array.isArray(e)||e.length<2)return e;if(typeof t!=="number"||typeof n!=="number")return e;if(t<0||t>=e.length||n<0||n>=e.length||t===n)return e;const r=e[n];e[n]=e[t];e[t]=r;return e},findCellByText:function(e,n){const t=SpreadsheetApp.getActive();const r=t.getSheetByName(e);if(!r)return null;const s=r.getDataRange().getValues();for(let t=0;t<s.length;t++){for(let e=0;e<s[t].length;e++){if(s[t][e]===n)return{column:t+1,row:e+1}}}return undefined},persistPosition:(e,n,r)=>{if(!Array.isArray(e)||!Array.isArray(n)||!Array.isArray(r)||n.length!==r.length){return e}const s=n.length;for(let t=0;t<s;t++){const a=e.findIndex(e=>n[t]===e.toLowerCase());if(a!==-1){e=this.getUtil("table")().swapArrayElement(e,a,r[t])}}return e}})}function updateNegativeList(){const o=e=>{const t=SpreadsheetApp.getActive();const n=t.getSheetByName(e);n.getRange("A3:B").clearContent();n.getRange("E3:F").clearContent()};const e=a=>{return(e,t)=>{o(a);const n=SpreadsheetApp.getActive();const r=n.getSheetByName(a);if(e.length){const s=r.getRange("A3:B"+(3+e.length-1));s.setValues(e)}if(t.length){const s=r.getRange("E3:F"+(3+t.length-1));s.setValues(t)}this.getModule("edith")().showFeedback({suffix:"Negative List",description:"Negative list "+a+" updated. \n\n"+(t.length+e.length)+" items finded."})}};const u=(e,t,n)=>{const r=[];const s=[];const a=e.filter(e=>e.campaignId===t);const o=a.map(e=>e.rules.filter(e=>e.variable==="source"&&e.logic==="deny")).flat();const i=a.map(e=>e.rules.filter(e=>e.variable==="p2"&&e.logic==="deny")).flat();const u=new Set(o.map(e=>e.values).flat());const c=new Set(i.map(e=>e.values).flat());[...u].forEach(e=>r.push([n,e]));[...c].forEach(e=>s.push([n,e]));return{sourceRows:r,subSourceRows:s}};const t=(e,t,n,r,s)=>{const a=this.getModule("edith")().request.get("/negative-list",{},{channelId:n},{apiKey:r});if(typeof a!=="object")return;const{sourceRows:o,subSourceRows:i}=u(a,e,t);s(o,i)};const n=SpreadsheetApp.getActive();const r=n.getSheetByName("Config");const s=r.getRange("B3").getValue();const a=r.getRange("B4").getValue();const i=r.getRange("B5").getValue();const c=r.getRange("B6").getValue();t(c.toString(),s,a,i,e("Negative List"))}