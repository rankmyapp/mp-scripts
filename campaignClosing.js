(function(){const r={modules:{},utils:{}};const a={context:{TRACKIER:"trackier",APPSFLYER:"appsflyer",ANDROID:"Android",IOS:"iOS"}};return new function initUltron(){const e=()=>{console.log("Running Ultron version","1.0.5");function _showFeedback(i){return function({title:e,description:t,suffix:n,fail:r,toast:a}){const s=i+(n?" - "+n:"");const o=(e||s)+" | "+(!r?"Sucesso":"Falhou");if(a){SpreadsheetApp.getActiveSpreadsheet().toast(t,o+"\n",15)}else{SpreadsheetApp.getUi().alert(o,t,SpreadsheetApp.getUi().ButtonSet.OK)}}}function _handleQueryString(r){if(typeof r!=="object")return"";const a=(e,t)=>encodeURIComponent(e)+"="+encodeURIComponent(t);return"?"+Object.keys(r).reduce(function(e,t){if(r[t]===undefined)return e;if(Array.isArray(r[t])){const n=r[t].map(e=>a(`${t}[]`,e));return e.concat(n)}return e.concat(a(t,r[t]))},[]).join("&")}function _replaceParamsByValues(e,t){const n=typeof t==="object"&&!Array.isArray(t)?t:{};const r=Object.keys(n);var a=e;r.forEach(function(e){a=a.replace(":"+e,n[e])});return a}function _requester(o,i){return{get:function(e,t,n,r={}){if(typeof e!=="string")return undefined;const a=o+_replaceParamsByValues(e,t)+_handleQueryString(n);console.log("requesting: "+a);const s=UrlFetchApp.fetch(a,{contentType:"application/json",muteHttpExceptions:true,headers:{...i,...r}});if(s.getResponseCode()===200){return JSON.parse(s.getContentText())}else{_showFeedback("System")({fail:true,description:"Erro na request: "+a+"\n\nCode: "+s.getResponseCode()+"\nResponse: "+s.getContentText()});return undefined}}}}const e=(t,n)=>{if(typeof t!=="string"||!n||typeof n.url_base!=="string")return false;if(n&&n.headers!==undefined&&typeof n.headers!=="object")return false;if(r.modules[t]){console.log(t+" already exists in the ULTRON instance.");return false}r.modules[t]=function(){const e=t.toLowerCase().split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ");return{request:_requester(n.url_base,n.headers),showFeedback:_showFeedback(e)}};return r.modules[t]};const t=(e,t)=>{if(typeof e!=="string"||typeof t!=="object"||Array.isArray(t))return false;if(r.utils[e]){console.log(e+" already exists in the ULTRON instance.");return false}r.utils[e]=function(){return t};return r.utils[e]};const n={GLOBAL:a,addModule:e,addUtils:t,getUtil:e=>r.utils[e],getModule:e=>r.modules[e]};return{...n,dispatches:{updateTSIJarvis:()=>updateTSIJarvis.call(n),updateTrackierConversions:()=>updateConversions.call(n,n.GLOBAL.context.TRACKIER),updateAppsflyerConversions:()=>updateConversions.call(n,n.GLOBAL.context.APPSFLYER),updateClicks:()=>updateClicks.call(n,n.GLOBAL.context.TRACKIER),updateNFeJarvis:()=>updateNFeJarvis.call(n),updateCurrenciesJarvis:()=>updateCurrenciesJarvis.call(n),updatecostUA_RTGJarvis:()=>updatecostUA_RTGJarvis.call(n),updatecostCostMPJarvis:()=>updatecostCostMPJarvis.call(n),updateMPAutomationJarvis:()=>updateMPAutomationJarvis.call(n),updateCurrenciesMPAutomationJarvis:()=>updateCurrenciesMPAutomationJarvis.call(n),updateNegativeList:()=>updateNegativeList.call(n)}}};const t=e();t.addModule("jarvis",{url_base:"https://jarvis-gateway.rankmyapp.com/jarvis",headers:{Authorization:"<token>"}});t.addModule("media",{url_base:"https://jarvis-gateway.rankmyapp.com/provider",headers:{Authorization:"<token>"}});t.addModule("edith",{url_base:"https://jarvis-gateway.rankmyapp.com/edith"});initUltronUtils.call(t);return t}})();function initUltronUtils(){this.addUtils("table",{generateColumns:function(e,t){if(!Array.isArray(e))return[];return e.reduce(function(t,e){if(typeof e!=="object"||Array.isArray(e))return t;const n=[];const r=Object.keys(e);r.forEach(function(e){if(!t.includes(e)){n.push(e)}});return t.concat(n)},Array.isArray(t)?t:[])},swapArrayElement:function(e,t,n){if(!Array.isArray(e)||e.length<2)return e;if(typeof t!=="number"||typeof n!=="number")return e;if(t<0||t>=e.length||n<0||n>=e.length||t===n)return e;const r=e[n];e[n]=e[t];e[t]=r;return e},findCellByText:function(e,n){const t=SpreadsheetApp.getActive();const r=t.getSheetByName(e);if(!r)return null;const a=r.getDataRange().getValues();for(let t=0;t<a.length;t++){for(let e=0;e<a[t].length;e++){if(a[t][e]===n)return{column:t+1,row:e+1}}}return undefined},persistPosition:(e,n,r)=>{if(!Array.isArray(e)||!Array.isArray(n)||!Array.isArray(r)||n.length!==r.length){return e}const a=n.length;for(let t=0;t<a;t++){const s=e.findIndex(e=>n[t]===e.toLowerCase());if(s!==-1){e=this.getUtil("table")().swapArrayElement(e,s,r[t])}}return e}})}function updateNFeJarvis(){const e=({year:e,month:t},n)=>{const r=this.getModule("jarvis")().request.get("/sheets/nf-e/:year/:month",{year:e,month:t});if(!Array.isArray(r))return;n(r)};const r=SpreadsheetApp.getActive();const t=r.getSheetByName("Margem");const n=t.getRange("A11").getValue();const a=t.getRange("A14").getValue()?.toString().padStart(2,"0");e({year:n,month:a},e=>{const a=[];e.forEach(e=>{const t=e.budget?.period?.split("T");const n=(e,t)=>{if(typeof e==="number"&&e<=0)return t;if(typeof e==="string"&&isNaN(parseFloat(e)))return t;return e};const r=e.budget?.isInvoiceApproved===1||e.budget?.isInvoiceApproved===true;a.push([e._id,e.status,`${e.account?.businessName}_${e.account?.product}_${e.currency}`,e.account?.name,e.account?.product,e.account?.businessName,t,t,e.currency,e.budget?.initialValue,e.budget?.extraBudget,e.budget?.deduction,e.budget?.revenueChurn,n(e.budget?.invoice,e.budget?.initialValue),r===1?"Sim":"Não",e.accountManager,e.strategist,e.accountAffiliate])});const t=r.getSheetByName("NF_MP");t.getRange("A2:R").clearContent();if(a.length){const n=t.getRange("A2:R"+(2+a.length-1));n.setValues(a)}})}function updateCurrenciesJarvis(){const e=({year:e},t)=>{const n=this.getModule("jarvis")().request.get("/sheets/currencies/:year/",{year:e});if(!Array.isArray(n))return;t(n)};const a=SpreadsheetApp.getActive();const t=a.getSheetByName("Margem");const n=t.getRange("A11").getValue();e({year:n},e=>{const t=[];e.forEach(e=>{t.push([e.year,e.month,e.usd,e.mxn])});const n=a.getSheetByName("currency");n.getRange("A2:D").clearContent();if(t.length){const r=n.getRange("A2:D"+(2+t.length-1));r.setValues(t)}})}function updatecostUA_RTGJarvis(){const e=({year:e,month:t},n)=>{const r=this.getModule("jarvis")().request.get("/sheets/campaign/costs/extra",{},{year:e,month:t});if(!Array.isArray(r))return;n(r)};const a=SpreadsheetApp.getActive();const t=a.getSheetByName("Margem");const n=t.getRange("A11").getValue();const r=t.getRange("A14").getValue()?.toString().padStart(2,"0");e({year:n,month:r},e=>{const t=[];e.forEach(e=>{t.push([e.campaign_id,e.period?.split("T")?.[0]||null,e.month,e.year,e.manual_cost,e.deduction,e.currency])});const n=a.getSheetByName("Cost_ASA.RTG");n.getRange("A2:G").clearContent();if(t.length){const r=n.getRange("A2:G"+(2+t.length-1));r.setValues(t)}})}function updatecostCostMPJarvis(){const e=({year:e,month:t},n)=>{const r=this.getModule("jarvis")().request.get("/sheets/campaign/costs/ua",{},{year:e,month:t});if(!Array.isArray(r))return;n(r)};const a=SpreadsheetApp.getActive();const t=a.getSheetByName("Margem");const n=t.getRange("A11").getValue();const r=t.getRange("A14").getValue()?.toString().padStart(2,"0");e({year:n,month:r},e=>{const n=[];e.forEach(t=>{t?.subcampaigns.forEach(e=>{n.push([e?.costs?.period?.split("T")?.[0],e?.costs?.period?.split("T")?.[0],t._id,t.name,t.currency,e?.costs?.manual_cost,e?.costs?.deduction,t?.costModels?.join(","),`${e?.account?.businessName}_${e?.account?.product}_${t.currency}`,e?.account?.geography,e?.account?.name,e?.mobileApp?.platform,e?.campaign?.strategist])})});const t=a.getSheetByName("Cost_MP");t.getRange("A2:M").clearContent();if(n.length){const r=t.getRange("A2:M"+(2+n.length-1));r.setValues(n)}})}