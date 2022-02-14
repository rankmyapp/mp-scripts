(function(){const r={modules:{},utils:{}};const s={context:{TRACKIER:"trackier",APPSFLYER:"appsflyer",ANDROID:"Android",IOS:"iOS"}};return new function initUltron(){const e=()=>{console.log("Running Ultron version","1.0.5");function _showFeedback(c){return function({title:e,description:t,suffix:n,fail:r,toast:s}){const a=c+(n?" - "+n:"");const o=(e||a)+" | "+(!r?"Sucesso":"Falhou");if(s){SpreadsheetApp.getActiveSpreadsheet().toast(t,o+"\n",15)}else{SpreadsheetApp.getUi().alert(o,t,SpreadsheetApp.getUi().ButtonSet.OK)}}}function _handleQueryString(r){if(typeof r!=="object")return"";const s=(e,t)=>encodeURIComponent(e)+"="+encodeURIComponent(t);return"?"+Object.keys(r).reduce(function(e,t){if(r[t]===undefined)return e;if(Array.isArray(r[t])){const n=r[t].map(e=>s(`${t}[]`,e));return e.concat(n)}return e.concat(s(t,r[t]))},[]).join("&")}function _replaceParamsByValues(e,t){const n=typeof t==="object"&&!Array.isArray(t)?t:{};const r=Object.keys(n);var s=e;r.forEach(function(e){s=s.replace(":"+e,n[e])});return s}function _requester(a,o){return{get:function(e,t,n){if(typeof e!=="string")return undefined;const r=a+_replaceParamsByValues(e,t)+_handleQueryString(n);console.log("requesting: "+r);const s=UrlFetchApp.fetch(r,{contentType:"application/json",muteHttpExceptions:true,headers:o});if(s.getResponseCode()===200){return JSON.parse(s.getContentText())}else{_showFeedback("System")({fail:true,description:"Erro na request: "+r+"\n\nCode: "+s.getResponseCode()+"\nResponse: "+s.getContentText()});return undefined}}}}const e=(t,n)=>{if(typeof t!=="string"||!n||typeof n.url_base!=="string")return false;if(n&&n.headers!==undefined&&typeof n.headers!=="object")return false;if(r.modules[t]){console.log(t+" already exists in the ULTRON instance.");return false}r.modules[t]=function(){const e=t.toLowerCase().split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ");return{request:_requester(n.url_base,n.headers),showFeedback:_showFeedback(e)}};return r.modules[t]};const t=(e,t)=>{if(typeof e!=="string"||typeof t!=="object"||Array.isArray(t))return false;if(r.utils[e]){console.log(e+" already exists in the ULTRON instance.");return false}r.utils[e]=function(){return t};return r.utils[e]};const n={GLOBAL:s,addModule:e,addUtils:t,getUtil:e=>r.utils[e],getModule:e=>r.modules[e]};return{...n,dispatches:{updateTSIJarvis:()=>updateTSIJarvis.call(n),updateTrackierConversions:()=>updateConversions.call(n,n.GLOBAL.context.TRACKIER),updateAppsflyerConversions:()=>updateConversions.call(n,n.GLOBAL.context.APPSFLYER),updateClicks:()=>updateClicks.call(n,n.GLOBAL.context.TRACKIER),updateNFeJarvis:()=>updateNFeJarvis.call(n),updateCurrenciesJarvis:()=>updateCurrenciesJarvis.call(n),updatecostUA_RTGJarvis:()=>updatecostUA_RTGJarvis.call(n),updatecostCostMPJarvis:()=>updatecostCostMPJarvis.call(n),updateMPAutomationJarvis:()=>updateMPAutomationJarvis.call(n),updateCurrenciesMPAutomationJarvis:()=>updateCurrenciesMPAutomationJarvis.call(n)}}};const t=e();t.addModule("jarvis",{url_base:"https://jarvis-api-gateway.apps.dev.rankmycluster.com/jarvis",headers:{Authorization:"<token>"}});t.addModule("media",{url_base:"https://jarvis-api-gateway.apps.dev.rankmycluster.com/provider",headers:{Authorization:"<token>"}});initUltronUtils.call(t);return t}})();function initUltronUtils(){this.addUtils("table",{generateColumns:function(e,t){if(!Array.isArray(e))return[];return e.reduce(function(t,e){if(typeof e!=="object"||Array.isArray(e))return t;const n=[];const r=Object.keys(e);r.forEach(function(e){if(!t.includes(e)){n.push(e)}});return t.concat(n)},Array.isArray(t)?t:[])},swapArrayElement:function(e,t,n){if(!Array.isArray(e)||e.length<2)return e;if(typeof t!=="number"||typeof n!=="number")return e;if(t<0||t>=e.length||n<0||n>=e.length||t===n)return e;const r=e[n];e[n]=e[t];e[t]=r;return e},findCellByText:function(e,n){const t=SpreadsheetApp.getActive();const r=t.getSheetByName(e);if(!r)return null;const s=r.getDataRange().getValues();for(let t=0;t<s.length;t++){for(let e=0;e<s[t].length;e++){if(s[t][e]===n)return{column:t+1,row:e+1}}}return undefined},persistPosition:(e,n,r)=>{if(!Array.isArray(e)||!Array.isArray(n)||!Array.isArray(r)||n.length!==r.length){return e}const s=n.length;for(let t=0;t<s;t++){const a=e.findIndex(e=>n[t]===e.toLowerCase());if(a!==-1){e=this.getUtil("table")().swapArrayElement(e,a,r[t])}}return e}})}function updateNFeJarvis(){const e=({year:e,month:t},n)=>{const r=this.getModule("jarvis")().request.get("/sheets/nf-e/:year/:month",{year:e,month:t});if(!Array.isArray(r))return;n(r)};const s=SpreadsheetApp.getActive();const t=s.getSheetByName("Margem");const n=t.getRange("A11").getValue();const r=t.getRange("A14").getValue()?.toString().padStart(2,"0");e({year:n,month:r},e=>{const n=[];e.forEach(e=>{const t=e.budget?.period?.split("T");n.push([e._id,e.status,`${e.account?.businessName}_${e.account?.product}_${e.currency}`,e.account?.name,e.account?.product,e.account?.businessName,t,t,e.currency,e.budget?.initialValue,e.budget?.extraBudget,e.budget?.deduction,e.budget?.revenueChurn,e.budget?.invoice,e.budget?.isInvoiceApproved===1?"Sim":"Não",e.accountManager,e.strategist,e.accountAffiliate])});const t=s.getSheetByName("NF_MP");t.getRange("A2:R").clearContent();if(n.length){const r=t.getRange("A2:R"+(2+n.length-1));r.setValues(n)}})}function updateCurrenciesJarvis(){const e=({year:e},t)=>{const n=this.getModule("jarvis")().request.get("/sheets/currencies/:year/",{year:e});if(!Array.isArray(n))return;t(n)};const s=SpreadsheetApp.getActive();const t=s.getSheetByName("Margem");const n=t.getRange("A11").getValue();e({year:n},e=>{const t=[];e.forEach(e=>{t.push([e.year,e.month,e.usd,e.mxn])});const n=s.getSheetByName("currency");n.getRange("A2:D").clearContent();if(t.length){const r=n.getRange("A2:D"+(2+t.length-1));r.setValues(t)}})}function updatecostUA_RTGJarvis(){const e=({year:e,month:t},n)=>{const r=this.getModule("jarvis")().request.get("/sheets/campaign/costs/extra",{},{year:e,month:t});if(!Array.isArray(r))return;n(r)};const s=SpreadsheetApp.getActive();const t=s.getSheetByName("Margem");const n=t.getRange("A11").getValue();const r=t.getRange("A14").getValue()?.toString().padStart(2,"0");e({year:n,month:r},e=>{const t=[];e.forEach(e=>{t.push([e.campaign_id,e.period?.split("T")?.[0]||null,e.month,e.year,e.manual_cost,e.deduction,e.currency])});const n=s.getSheetByName("Cost_ASA.RTG");n.getRange("A2:G").clearContent();if(t.length){const r=n.getRange("A2:G"+(2+t.length-1));r.setValues(t)}})}function updatecostCostMPJarvis(){const e=({year:e,month:t},n)=>{const r=this.getModule("jarvis")().request.get("/sheets/campaign/costs/ua",{},{year:e,month:t});if(!Array.isArray(r))return;n(r)};const s=SpreadsheetApp.getActive();const t=s.getSheetByName("Margem");const n=t.getRange("A11").getValue();const r=t.getRange("A14").getValue()?.toString().padStart(2,"0");e({year:n,month:r},e=>{const n=[];e.forEach(t=>{t?.subcampaigns.forEach(e=>{n.push([e?.costs?.period?.split("T")?.[0],e?.costs?.period?.split("T")?.[0],t._id,t.name,t.currency,e?.costs?.manual_cost,e?.costs?.deduction,t?.costModels?.join(","),`${e?.account?.businessName}_${e?.account?.product}_${t.currency}`,e?.account?.geography,e?.account?.name,e?.mobileApp?.platform,e?.campaign?.strategist])})});const t=s.getSheetByName("Cost_MP");t.getRange("A2:M").clearContent();if(n.length){const r=t.getRange("A2:M"+(2+n.length-1));r.setValues(n)}})}