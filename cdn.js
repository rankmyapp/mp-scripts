(function(){const a={modules:{},utils:{}};const s={context:{TRACKIER:"trackier",APPSFLYER:"appsflyer",ANDROID:"Android",IOS:"iOS"}};return new function initUltron(){const e=()=>{console.log("Running Ultron version","1.2.0");function _showFeedback(r){return function({title:e,description:t,suffix:n,fail:a,toast:s}){const i=r+(n?" - "+n:"");const o=(e||i)+" | "+(!a?"Sucesso":"Falhou");if(s){SpreadsheetApp.getActiveSpreadsheet().toast(t,o+"\n",15)}else{SpreadsheetApp.getUi().alert(o,t,SpreadsheetApp.getUi().ButtonSet.OK)}}}function _handleQueryString(a){if(typeof a!=="object")return"";const s=(e,t)=>encodeURIComponent(e)+"="+encodeURIComponent(t);return"?"+Object.keys(a).reduce(function(e,t){if(a[t]===undefined)return e;if(Array.isArray(a[t])){const n=a[t].map(e=>s(`${t}[]`,e));return e.concat(n)}return e.concat(s(t,a[t]))},[]).join("&")}function _replaceParamsByValues(e,t){const n=typeof t==="object"&&!Array.isArray(t)?t:{};const a=Object.keys(n);var s=e;a.forEach(function(e){s=s.replace(":"+e,n[e])});return s}function _requester(o,r){return{get:function(e,t,n,a={}){if(typeof e!=="string")return undefined;const s=o+_replaceParamsByValues(e,t)+_handleQueryString(n);console.log("requesting: "+s);const i=UrlFetchApp.fetch(s,{contentType:"application/json",muteHttpExceptions:true,headers:{...r,...a}});if(i.getResponseCode()===200){return JSON.parse(i.getContentText())}else{_showFeedback("System")({fail:true,description:"Erro na request: "+s+"\n\nCode: "+i.getResponseCode()+"\nResponse: "+i.getContentText()});return undefined}}}}const e=(t,n)=>{if(typeof t!=="string"||!n||typeof n.url_base!=="string")return false;if(n&&n.headers!==undefined&&typeof n.headers!=="object")return false;if(a.modules[t]){console.log(t+" already exists in the ULTRON instance.");return false}a.modules[t]=function(){const e=t.toLowerCase().split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ");return{request:_requester(n.url_base,n.headers),showFeedback:_showFeedback(e)}};return a.modules[t]};const t=(e,t)=>{if(typeof e!=="string"||typeof t!=="object"||Array.isArray(t))return false;if(a.utils[e]){console.log(e+" already exists in the ULTRON instance.");return false}a.utils[e]=function(){return t};return a.utils[e]};const n={GLOBAL:s,addModule:e,addUtils:t,getUtil:e=>a.utils[e],getModule:e=>a.modules[e]};return{...n,dispatches:{updateTSIJarvis:()=>updateTSIJarvis.call(n),updateTrackierConversions:()=>updateConversions.call(n,n.GLOBAL.context.TRACKIER),updateAppsflyerConversions:()=>updateConversions.call(n,n.GLOBAL.context.APPSFLYER),updateClicks:()=>updateClicks.call(n,n.GLOBAL.context.TRACKIER),updateNFeJarvis:()=>updateNFeJarvis.call(n),updateCurrenciesJarvis:()=>updateCurrenciesJarvis.call(n),updatecostUA_RTGJarvis:()=>updatecostUA_RTGJarvis.call(n),updatecostCostMPJarvis:()=>updatecostCostMPJarvis.call(n),updateMPAutomationJarvis:()=>updateMPAutomationJarvis.call(n),updateCurrenciesMPAutomationJarvis:()=>updateCurrenciesMPAutomationJarvis.call(n),updateNegativeList:()=>updateNegativeList.call(n)}}};const t=e();t.addModule("jarvis",{url_base:"https://jarvis-gateway.rankmyapp.com/jarvis",headers:{Authorization:"<token>"}});t.addModule("media",{url_base:"https://jarvis-gateway.rankmyapp.com/provider",headers:{Authorization:"<token>"}});t.addModule("edith",{url_base:"https://jarvis-gateway.rankmyapp.com/edith"});initUltronUtils.call(t);return t}})();function initUltronUtils(){this.addUtils("table",{generateColumns:function(e,t){if(!Array.isArray(e))return[];return e.reduce(function(t,e){if(typeof e!=="object"||Array.isArray(e))return t;const n=[];const a=Object.keys(e);a.forEach(function(e){if(!t.includes(e)){n.push(e)}});return t.concat(n)},Array.isArray(t)?t:[])},swapArrayElement:function(e,t,n){if(!Array.isArray(e)||e.length<2)return e;if(typeof t!=="number"||typeof n!=="number")return e;if(t<0||t>=e.length||n<0||n>=e.length||t===n)return e;const a=e[n];e[n]=e[t];e[t]=a;return e},findCellByText:function(e,n){const t=SpreadsheetApp.getActive();const a=t.getSheetByName(e);if(!a)return null;const s=a.getDataRange().getValues();for(let t=0;t<s.length;t++){for(let e=0;e<s[t].length;e++){if(s[t][e]===n)return{column:t+1,row:e+1}}}return undefined},persistPosition:(e,n,a)=>{if(!Array.isArray(e)||!Array.isArray(n)||!Array.isArray(a)||n.length!==a.length){return e}const s=n.length;for(let t=0;t<s;t++){const i=e.findIndex(e=>n[t]===e.toLowerCase());if(i!==-1){e=this.getUtil("table")().swapArrayElement(e,i,a[t])}}return e}})}function updateTSIJarvis(){const r=e=>{if(e!==this.GLOBAL.context.ANDROID&&e!==this.GLOBAL.context.IOS)return;const t=SpreadsheetApp.getActive();const n=t.getSheetByName(e===this.GLOBAL.context.ANDROID?"Canais Android":"Canais iOS");n.getRange("A3:J").clearContent();n.getRange("N1:N8").clearContent()};const e=o=>{return(e,t)=>{if(o!==this.GLOBAL.context.ANDROID&&o!==this.GLOBAL.context.IOS)return;r(o);const n=SpreadsheetApp.getActive();const a=n.getSheetByName(o===this.GLOBAL.context.ANDROID?"Canais Android":"Canais iOS");if(e.length){const i=a.getRange("A3:J"+(3+e.length-1));i.setValues(e)}const s=a.getRange("N1:N8");s.setValues([[t.campaign.tokens],[new Date(t.campaign.startDate)],[new Date(t.campaign.endDate)],[t.campaign.payout||""],[t.campaign.currency],[t.campaign.costModel],[t.campaign.budgetTotal],[t.app?.bundle]]);this.getModule("jarvis")().showFeedback({suffix:"Traffic Source Instances",description:"Canais "+o+" atualizado. \n\n"+e.length+" linhas encontradas."})}};const t=(e,t)=>{const r=this.getModule("jarvis")().request.get("/sheets/traffic-source-instance/campaign/:id",{id:e});if(typeof r!=="object")return;const n=r.trafficSourcesInstances||[];const c=[];n.forEach(function(a){const s=a.eventsPayouts.length;const i=new Date(a.endDate);console.log(a.statusVariations);let o=0;a.eventsPayouts.forEach(function(e){const t=new Date(e.effectiveDate);t.setHours(0,0,0,0);let n;if(o===s-1&&s>1){n=new Date(a.eventsPayouts[o-1].effectiveDate);n.setHours(0,0,0,0)}else{n=i;n.setHours(0,0,0,0)}c.push([a.channel,a.costModel,e.value,t,n,a.currency||r.campaign.currency,e.dailyCap,a.tokens,e.event,a.status]);o++})});t(c,{campaign:r.campaign,app:r.app})};const n=SpreadsheetApp.getActive();const a=n.getSheetByName("Android").getRange("C2").getValue();const s=n.getSheetByName("iOS").getRange("C2").getValue();if(a){t(a,e(this.GLOBAL.context.ANDROID))}else{r(this.GLOBAL.context.ANDROID);this.getModule("jarvis")().showFeedback({suffix:"Traffic Source Instances",description:"É necessário adicionar o ID Jarvis (B2) na página Android.",fail:true,toast:true})}if(s){t(s,e(this.GLOBAL.context.IOS))}else{r(this.GLOBAL.context.IOS);this.getModule("jarvis")().showFeedback({suffix:"Traffic Source Instances",description:"É necessário adicionar o ID Jarvis (B2) na página iOS.",fail:true,toast:true})}}function selectAppsflyerLeanSource(){const e=SpreadsheetApp.getUi();const t=e.alert("Dados Consolidados",`Atualmente estamos realizando testes em uma nova forma de processar e armazenar os dados do Appsflyer. Recomenda-se usar \
    a nova fonte de dados, mas caso queira continuar usando a fonte antiga (principalmente para comparar valores), clique em "Não"\n
    Sim = Consultar usando a nova fonte de dados.
    Não = Consultar usando a antiga fonte de dados.
    `,e.ButtonSet.YES_NO);return t===e.Button.NO?"lean-jarvis":"lean"}function updateConversions(f){if(f!==this.GLOBAL.context.APPSFLYER&&f!==this.GLOBAL.context.TRACKIER)return;let i;if(f===this.GLOBAL.context.APPSFLYER){i=selectAppsflyerLeanSource()}const A=this.getUtil("table")();const m={configurationSheet:"configuration_"+f,dashboardAndroidSheet:"dashboard_"+f+"_android",dashboardiOSSheet:"dashboard_"+f+"_ios",canaisAndroid:"Canais Android",canaisIOS:"Canais iOS"};const s=()=>{const e=A.findCellByText("filtro_appsflyer","Event Filter");if(!e)return[];const t=a.getSheetByName("filtro_appsflyer");const n=t.getRange(e.row+1,e.column,20);return n.getValues().filter(e=>Array.isArray(e)&&e.length&&e[0]).map(e=>e[0])};const S=e=>{if(f!==this.GLOBAL.context.APPSFLYER)return e;const t=["campaign_id","publish_name","created","country","channel","media_source","impressions","clicks","ctr","installs","install","conversion_rate"];const n=s();const a=[...t,...n];if(a.length===t.length)return e;return e.reduce((e,t)=>{const n={};a.forEach(e=>{if(t.hasOwnProperty(e)){n[e]=t[e]}});return[...e,n]},[])};const n=({campaignIDAndroid:p,campaignIDiOS:g,contextApplyData:h})=>{return e=>{const n=(p||"").replace(/@/g,",").split(",");const a=(g||"").replace(/@/g,",").split(",");const t=S(e.filter(t=>n.find(e=>parseInt(e)==parseInt(t.campaign_id))));const s=S(e.filter(t=>a.find(e=>parseInt(e)===parseInt(t.campaign_id))));const i=SpreadsheetApp.getActive();const o=i.getSheetByName(m.dashboardAndroidSheet);const r=i.getSheetByName(m.dashboardiOSSheet);const c={names:["created","country","media_source","revenue","revenueWithDuplicates","install","uninstall","is_primary_attribution"],positions:[2,3,4,5,6,7,8,9]};if(t.length){o.getRange(1,1,o.getMaxRows(),o.getMaxColumns()).clearContent();const u=A.persistPosition(A.generateColumns(t),c.names,c.positions);const l=o.getRange(1,1,t.length+1,u.length+1);l.setValues([["source",...u],...t.map(t=>[f,...u.map(e=>t[e])])]);this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardAndroidSheet+" recebeu "+t.length+" linha(s)."})}else if(!t.length&&h===this.GLOBAL.context.ANDROID){o.getRange(2,1,o.getMaxRows(),o.getMaxColumns()).clearContent();this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardAndroidSheet+" recebeu "+t.length+" linha(s)."})}if(s.length){r.getRange(1,1,r.getMaxRows(),r.getMaxColumns()).clearContent();const u=A.persistPosition(A.generateColumns(s),c.names,c.positions);const d=r.getRange(1,1,s.length+1,u.length+1);d.setValues([["source",...u],...s.map(t=>[f,...u.map(e=>t[e])])]);this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardiOSSheet+" recebeu "+s.length+" linha(s)."})}else if(!s.length&&h===this.GLOBAL.context.IOS){r.getRange(2,1,r.getMaxRows(),r.getMaxColumns()).clearContent();this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.dashboardiOSSheet+" recebeu "+s.length+" linha(s)."})}}};const o=(e,t)=>{if(!e.campaignIds){t([])}else{const n=f===this.GLOBAL.context.APPSFLYER?i:"lean";const a=`/${f}/${n}`;const s=this.getModule("media")().request.get(a,{},e);if(!s)return;t(s)}};const r=(e,t,n,a)=>{const s=new Date(e);s.setDate(s.getDate()+n);const i={start:e,end:s};if(s>=t)return[...a,{start:e,end:t}];const o=new Date(s);o.setDate(o.getDate()+1);return r(o,t,n,[...a,i])};const a=SpreadsheetApp.getActive();const c=a.getSheetByName(m.canaisAndroid).getRange("N1").getValue();if(["",null,undefined].includes(c)){this.getModule("media")().showFeedback({suffix:"Error",description:"A campanha Android não possui tokens cadastrados"})}const u=a.getSheetByName(m.canaisIOS).getRange("N1").getValue();if(["",null,undefined].includes(u)){this.getModule("media")().showFeedback({suffix:"Error",description:"A campanha IOS não possui tokens cadastrados"})}const e=a.getSheetByName(m.canaisAndroid).getRange("N2").getValue();const t=a.getSheetByName(m.canaisIOS).getRange("N2").getValue();if(!(e instanceof Date)&&!(t instanceof Date)){this.getModule("media")().showFeedback({suffix:f.charAt(0).toUpperCase()+f.slice(1),description:m.canaisAndroid+" e "+m.canaisIOS+" possuem uma data de início inválida ou não definida.\n\n Dica: Use o Media Automation Jarvis para atualizar as datas."});return}const l=e=>[e].filter(e=>!!e).join(",").replace(/@/g,",").replace(/\s/g,"");const d=e=>typeof e==="number"?e.toString():e;const p=e=>[e.getFullYear(),(e.getMonth()+1).toString().padStart(2,"0"),e.getDate().toString().padStart(2,"0")].join("-");const g=e?e.getMonth():t.getMonth();const h=e?e.getFullYear():t.getFullYear();const y=new Date(h,g+1,0);const O=new Date(y.getFullYear(),y.getMonth(),1);const C=y;const R=s();const L={withDuplicate:true,country:true,orderDirection:"asc",eventNames:R.length?R.join(","):undefined};const v=(a,e,t)=>{return r(e,t,10,[]).map(({start:e,end:n})=>new Promise(t=>{if(["",null,undefined].includes(a)){t()}o({...L,start:p(e),end:p(n),campaignIds:l(a)},e=>{if(!Array.isArray(e))return t({});t(e)})}))};const x=v(c,O,C);const D=v(u,O,C);Promise.all(x).then(e=>{const t=Array.isArray(e)?e:[];n({campaignIDAndroid:d(c),contextApplyData:this.GLOBAL.context.ANDROID})(t.flat())});Promise.all(D).then(e=>{const t=Array.isArray(e)?e:[];n({campaignIDiOS:d(u),contextApplyData:this.GLOBAL.context.IOS})(t.flat())})}function updateClicks(o){if(o!==this.GLOBAL.context.APPSFLYER&&o!==this.GLOBAL.context.TRACKIER)return;const r=this.getUtil("table")();const c={canaisAndroid:"Canais Android",canaisIOS:"Canais iOS",clicks_trackier:"clicks_trackier"};const e=()=>{return e=>{const t=SpreadsheetApp.getActive();const n=t.getSheetByName(c.clicks_trackier);if(e.length){n.getRange(1,1,n.getMaxRows(),n.getMaxColumns()).clearContent();const a={names:["source","campaign_id","publisher","clicks","date","OS"],positions:[0,1,2,3,4,5]};const s=r.persistPosition(r.generateColumns(e),a.names,a.positions);const i=n.getRange(1,1,e.length+1,s.length);i.setValues([s,...e.map(t=>[...s.map(e=>t[e])])]);this.getModule("media")().showFeedback({suffix:o.charAt(0).toUpperCase()+o.slice(1),description:c.clicks_trackier+" recebeu "+e.length+" linha(s)."})}else if(!e.length){n.getRange(1,1,n.getMaxRows(),n.getMaxColumns()).clearContent();this.getModule("media")().showFeedback({suffix:o.charAt(0).toUpperCase()+o.slice(1),description:c.clicks_trackier+" recebeu "+e.length+" linha(s)."})}}};const t=(t,n)=>{if(!t.campaignToken||!t.campaignToken?.length){n([])}else{const e=this.getModule("media")().request.get("/trackier/first-click-grouped",{},t);if(!e)return;n(e?.campaigns??[])}};const n=SpreadsheetApp.getActive();const a=n.getSheetByName(c.canaisAndroid).getRange("N1").getValue();const s=n.getSheetByName(c.canaisIOS).getRange("N1").getValue();const i=n.getSheetByName(c.canaisAndroid).getRange("N2").getValue();const u=n.getSheetByName(c.canaisIOS).getRange("N2").getValue();if(!(i instanceof Date)&&!(u instanceof Date)){this.getModule("media")().showFeedback({suffix:o.charAt(0).toUpperCase()+o.slice(1),description:c.canaisAndroid+" e "+c.canaisIOS+" possuem uma data de início inválida ou não definida.\n\n Dica: Use o Media Automation Jarvis para atualizar as datas."});return}const l=i?i.getMonth():u.getMonth();const d=i?i.getFullYear():u.getFullYear();const p=new Date(d,l+1,0);const g=e=>[e].join(",").replace(/@/g,",").replace(/\s/g,"").split(",").filter(e=>!!e);const h={start:[p.getFullYear(),(p.getMonth()+1).toString().padStart(2,"0"),"01"].join("-"),end:[p.getFullYear(),(p.getMonth()+1).toString().padStart(2,"0"),p.getDate().toString().padStart(2,"0")].join("-")};const f=[];const A=t({...h,campaignToken:g(a)},e=>{if(!Array.isArray(e))return;f.push(...e.map(e=>({...e,source:o,OS:this.GLOBAL.context.ANDROID})))});const m=t({...h,campaignToken:g(s)},e=>{if(!Array.isArray(e))return;f.push(...e.map(e=>({...e,source:o,OS:this.GLOBAL.context.IOS})))});Promise.all([A,m]).then(()=>{e()(f)})}