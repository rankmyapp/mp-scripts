(function(){const a={modules:{},utils:{}};const s={context:{TRACKIER:"trackier",APPSFLYER:"appsflyer",ANDROID:"Android",IOS:"iOS"}};return new function initUltron(){const e=()=>{console.log("Running Ultron version","1.0.3");function _showFeedback(o){return function({title:e,description:t,suffix:n,fail:a,toast:s}){const r=o+(n?" - "+n:"");const i=(e||r)+" | "+(!a?"Sucesso":"Falhou");if(s){SpreadsheetApp.getActiveSpreadsheet().toast(t,i+"\n",15)}else{SpreadsheetApp.getUi().alert(i,t,SpreadsheetApp.getUi().ButtonSet.OK)}}}function _handleQueryString(n){if(typeof n!=="object")return"";return"?"+Object.keys(n).reduce(function(e,t){if(n[t]===undefined)return e;return e.concat(encodeURIComponent(t)+"="+encodeURIComponent(n[t]))},[]).join("&")}function _replaceParamsByValues(e,t){const n=typeof t==="object"&&!Array.isArray(t)?t:{};const a=Object.keys(n);var s=e;a.forEach(function(e){s=s.replace(":"+e,n[e])});return s}function _requester(r,i){return{get:function(e,t,n){if(typeof e!=="string")return undefined;const a=r+_replaceParamsByValues(e,t)+_handleQueryString(n);console.log("requesting: "+a);const s=UrlFetchApp.fetch(a,{contentType:"application/json",muteHttpExceptions:true,headers:i});if(s.getResponseCode()===200){return JSON.parse(s.getContentText())}else{_showFeedback("System")({fail:true,description:"Erro na request: "+a+"\n\nCode: "+s.getResponseCode()+"\nResponse: "+s.getContentText()});return undefined}}}}const e=(t,n)=>{if(typeof t!=="string"||!n||typeof n.url_base!=="string")return false;if(n&&n.headers!==undefined&&typeof n.headers!=="object")return false;if(a.modules[t]){console.log(t+" already exists in the ULTRON instance.");return false}a.modules[t]=function(){const e=t.toLowerCase().split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ");return{request:_requester(n.url_base,n.headers),showFeedback:_showFeedback(e)}};return a.modules[t]};const t=(e,t)=>{if(typeof e!=="string"||typeof t!=="object"||Array.isArray(t))return false;if(a.utils[e]){console.log(e+" already exists in the ULTRON instance.");return false}a.utils[e]=function(){return t};return a.utils[e]};const n={GLOBAL:s,addModule:e,addUtils:t,getUtil:e=>a.utils[e],getModule:e=>a.modules[e]};return{...n,dispatches:{updateTSIJarvis:()=>updateTSIJarvis.call(n),updateTrackierConversions:()=>updateConversions.call(n,n.GLOBAL.context.TRACKIER),updateAppsflyerConversions:()=>updateConversions.call(n,n.GLOBAL.context.APPSFLYER),updateNFeJarvis:()=>updateNFeJarvis.call(n),updateCurrenciesJarvis:()=>updateCurrenciesJarvis.call(n),updatecostUA_RTGJarvis:()=>updatecostUA_RTGJarvis.call(n),updatecostCostMPJarvis:()=>updatecostCostMPJarvis.call(n),updateMPAutomationJarvis:()=>updateMPAutomationJarvis.call(n),updateCurrenciesMPAutomationJarvis:()=>updateCurrenciesMPAutomationJarvis.call(n)}}};const t=e();t.addModule("jarvis",{url_base:"https://jarvis-gateway.rankmyapp.com/jarvis",headers:{Authorization:"<token>"}});t.addModule("media",{url_base:"https://jarvis-gateway.rankmyapp.com/provider",headers:{Authorization:"<token>"}});initUltronUtils.call(t);return t}})();function initUltronUtils(){this.addUtils("table",{generateColumns:function(e,t){if(!Array.isArray(e))return[];return e.reduce(function(t,e){if(typeof e!=="object"||Array.isArray(e))return t;const n=[];const a=Object.keys(e);a.forEach(function(e){if(!t.includes(e)){n.push(e)}});return t.concat(n)},Array.isArray(t)?t:[])},swapArrayElement:function(e,t,n){if(!Array.isArray(e)||e.length<2)return e;if(typeof t!=="number"||typeof n!=="number")return e;if(t<0||t>=e.length||n<0||n>=e.length||t===n)return e;const a=e[n];e[n]=e[t];e[t]=a;return e},findCellByText:function(e,n){const t=SpreadsheetApp.getActive();const a=t.getSheetByName(e);if(!a)return null;const s=a.getDataRange().getValues();for(let t=0;t<s.length;t++){for(let e=0;e<s[t].length;e++){if(s[t][e]===n)return{column:t+1,row:e+1}}}return undefined},persistPosition:(e,n,a)=>{if(!Array.isArray(e)||!Array.isArray(n)||!Array.isArray(a)||n.length!==a.length){return e}const s=n.length;for(let t=0;t<s;t++){const r=e.findIndex(e=>n[t]===e.toLowerCase());if(r!==-1){e=this.getUtil("table")().swapArrayElement(e,r,a[t])}}return e}})}function updateTSIJarvis(){const o=e=>{if(e!==this.GLOBAL.context.ANDROID&&e!==this.GLOBAL.context.IOS)return;const t=SpreadsheetApp.getActive();const n=t.getSheetByName(e===this.GLOBAL.context.ANDROID?"Canais Android":"Canais iOS");n.getRange("A3:J").clearContent();n.getRange("N1:N8").clearContent()};const e=i=>{return(e,t)=>{if(i!==this.GLOBAL.context.ANDROID&&i!==this.GLOBAL.context.IOS)return;o(i);const n=SpreadsheetApp.getActive();const a=n.getSheetByName(i===this.GLOBAL.context.ANDROID?"Canais Android":"Canais iOS");if(e.length){const r=a.getRange("A3:J"+(3+e.length-1));r.setValues(e)}const s=a.getRange("N1:N8");s.setValues([[t.campaign.tokens],[new Date(t.campaign.startDate)],[new Date(t.campaign.endDate)],[t.campaign.payout||""],[t.campaign.currency],[t.campaign.costModel],[t.campaign.budgetTotal],[t.app.bundle]]);this.getModule("jarvis")().showFeedback({suffix:"Traffic Source Instances",description:"Canais "+i+" atualizado. \n\n"+e.length+" linhas encontradas."})}};const t=(e,t)=>{const s=this.getModule("jarvis")().request.get("/sheets/traffic-source-instance/campaign/:id",{id:e});if(typeof s!=="object")return;const n=s.trafficSourcesInstances||[];const r=[];n.forEach(function(a){a.eventsPayouts.forEach(function(e){const t=new Date(e.effectiveDate);t.setHours(0,0,0,0);const n=new Date(e.endDate);n.setHours(0,0,0,0);r.push([a.channel,a.costModel,e.value,t,n,a.currency||s.campaign.currency,e.dailyCap,a.tokens,e.event,a.status])})});t(r,{campaign:s.campaign,app:s.app})};const n=SpreadsheetApp.getActive();const a=n.getSheetByName("Android").getRange("C2").getValue();const s=n.getSheetByName("iOS").getRange("C2").getValue();if(a){t(a,e(this.GLOBAL.context.ANDROID))}else{o(this.GLOBAL.context.ANDROID);this.getModule("jarvis")().showFeedback({suffix:"Traffic Source Instances",description:"É necessário adicionar o ID Jarvis (B2) na página Android.",fail:true,toast:true})}if(s){t(s,e(this.GLOBAL.context.IOS))}else{o(this.GLOBAL.context.IOS);this.getModule("jarvis")().showFeedback({suffix:"Traffic Source Instances",description:"É necessário adicionar o ID Jarvis (B2) na página iOS.",fail:true,toast:true})}}function updateConversions(f){if(f!==this.GLOBAL.context.APPSFLYER&&f!==this.GLOBAL.context.TRACKIER)return;const A=this.getUtil("table")();const m={configurationSheet:"configuration_"+f,dashboardAndroidSheet:"dashboard_"+f+"_android",dashboardiOSSheet:"dashboard_"+f+"_ios",canaisAndroid:"Canais Android",canaisIOS:"Canais iOS"};const s=()=>{const e=A.findCellByText("filtro_appsflyer","Event Filter");if(!e)return[];const t=a.getSheetByName("filtro_appsflyer");const n=t.getRange(e.row+1,e.column,20);return n.getValues().filter(e=>Array.isArray(e)&&e.length&&e[0]).map(e=>e[0])};const y=e=>{if(f!==this.GLOBAL.context.APPSFLYER)return e;const t=["campaign_id","publish_name","created","country","channel","media_source","impressions","clicks","ctr","installs","install","conversion_rate"];const n=s();const a=[...t,...n];if(a.length===t.length)return e;return e.reduce((e,t)=>{const n={};a.forEach(e=>{if(t.hasOwnProperty(e)){n[e]=t[e]}});return[...e,n]},[])};const e=({campaignIDAndroid:p,campaignIDiOS:g,contextApplyData:h})=>{return e=>{const n=(p||"").replace(/@/g,",").split(",");const a=(g||"").replace(/@/g,",").split(",");const t=y(e.filter(t=>n.find(e=>parseInt(e)==parseInt(t.campaign_id))));const s=y(e.filter(t=>a.find(e=>parseInt(e)===parseInt(t.campaign_id))));const r=SpreadsheetApp.getActive();const i=r.getSheetByName(m.dashboardAndroidSheet);const o=r.getSheetByName(m.dashboardiOSSheet);const c={names:["created","country","media_source","revenue","revenueWithDuplicates","install","uninstall","is_primary_attribution"],positions:[2,3,4,5,6,7,8,9]};if(t.length){i.getRange(1,1,i.getMaxRows(),i.getMaxColumns()).clearContent();const u=A.persistPosition(A.generateColumns(t),c.names,c.positions);const l=i.getRange(1,1,t.length+1,u.length+1);l.setValues([["source",...u],...t.map(t=>[f,...u.map(e=>t[e])])]);this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardAndroidSheet+" recebeu "+t.length+" linha(s)."})}else if(!t.length&&h===this.GLOBAL.context.ANDROID){i.getRange(2,1,i.getMaxRows(),i.getMaxColumns()).clearContent();this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardAndroidSheet+" recebeu "+t.length+" linha(s)."})}if(s.length){o.getRange(1,1,o.getMaxRows(),o.getMaxColumns()).clearContent();const u=A.persistPosition(A.generateColumns(s),c.names,c.positions);const d=o.getRange(1,1,s.length+1,u.length+1);d.setValues([["source",...u],...s.map(t=>[f,...u.map(e=>t[e])])]);this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardiOSSheet+" recebeu "+s.length+" linha(s)."})}else if(!s.length&&h===this.GLOBAL.context.IOS){o.getRange(2,1,o.getMaxRows(),o.getMaxColumns()).clearContent();this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardiOSSheet+" recebeu "+s.length+" linha(s)."})}}};const t=(e,t)=>{if(!e.campaignIds){t([])}else{const n=this.getModule("media")().request.get("/"+f,{},e);if(!n)return;t(n)}};const a=SpreadsheetApp.getActive();const n=a.getSheetByName(m.canaisAndroid).getRange("N1").getValue();const r=a.getSheetByName(m.canaisIOS).getRange("N1").getValue();const i=a.getSheetByName(m.canaisAndroid).getRange("N2").getValue();const o=a.getSheetByName(m.canaisIOS).getRange("N2").getValue();if(!(i instanceof Date)&&!(o instanceof Date)){this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.canaisAndroid+" e "+m.canaisIOS+" possuem uma data de início inválida ou não definida.\n\n Dica: Use o Media Automation Jarvis para atualizar as datas."});return}const c=i?i.getMonth():o.getMonth();const u=i?i.getFullYear():o.getFullYear();const l=new Date(u,c+1,0);const d=s();const p={start:[l.getFullYear(),(l.getMonth()+1).toString().padStart(2,"0"),"01"].join("-"),end:[l.getFullYear(),(l.getMonth()+1).toString().padStart(2,"0"),l.getDate().toString().padStart(2,"0")].join("-"),withDuplicate:true,country:true,orderDirection:"asc",eventNames:d.length?d.join(","):undefined};const g=e=>[e].filter(e=>!!e).join(",").replace(/@/g,",").replace(/\s/g,"");const h=e=>typeof e==="number"?e.toString():e;const S=t({...p,campaignIds:g(n)},e({campaignIDAndroid:h(n),contextApplyData:this.GLOBAL.context.ANDROID}));const O=t({...p,campaignIds:g(r)},e({campaignIDiOS:h(r),contextApplyData:this.GLOBAL.context.IOS}));Promise.all([S,O])}