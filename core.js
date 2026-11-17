import {LGAS,seedRecords,seedActions,seedPartners,seedBudget} from './data.js';
export const ACTION_STATUSES=['Not started','In progress','Blocked','Done'];
export const PARTNER_STATUSES=['To identify','To approach','Discussion planned','Scoping in progress'];
export const OWNERS=['State liaison','LGA coordinator','Finance lead','Community liaison','Training lead','Data quality lead','Project lead'];
export const RECORD_KEYS=['month','lga','sites','reportsExpected','reportsReceived','approved','released','spent','staffTrained','communitySessions','peopleReached'];
export const clone=value=>JSON.parse(JSON.stringify(value));
export const freshState=()=>({version:1,records:clone(seedRecords),actions:clone(seedActions),partners:clone(seedPartners),budget:clone(seedBudget)});
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const whole=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const exactKeys=(o,keys)=>plain(o)&&Object.keys(o).length===keys.length&&Object.keys(o).every(k=>keys.includes(k));
export function validDate(s){return typeof s==='string'&&/^20\d\d-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
export function validateImport(payload){
  if(!exactKeys(payload,['schemaVersion','synthetic','records'])||payload.schemaVersion!==1||payload.synthetic!==true)throw Error('Use the synthetic aggregate template (schemaVersion 1). No extra fields are allowed.');
  if(!Array.isArray(payload.records)||payload.records.length<1||payload.records.length>240)throw Error('Import 1–240 aggregate rows.');
  const seen=new Set();
  for(const [i,r]of payload.records.entries()){
    const line=`Row ${i+1}: `;
    if(!exactKeys(r,RECORD_KEYS))throw Error(line+'unexpected or missing fields. Individual records are not accepted.');
    if(!LGAS.includes(r.lga)||typeof r.month!=='string'||!/^20\d\d-(0[1-9]|1[0-2])$/.test(r.month))throw Error(line+'choose a proposed LGA and a valid YYYY-MM month.');
    const key=r.lga+'|'+r.month;if(seen.has(key))throw Error(line+'duplicate LGA and month.');seen.add(key);
    if(r.sites!==3||r.reportsExpected!==3||!whole(r.reportsReceived,3))throw Error(line+'each proposed LGA has 3 sites and expects 3 reports.');
    if(!['approved','released','spent'].every(k=>whole(r[k],100000000)))throw Error(line+'financing values must be whole naira from 0 to 100 million.');
    if(r.spent>r.released||r.released>r.approved)throw Error(line+'require spent ≤ released ≤ approved.');
    if(!whole(r.staffTrained,1000)||!whole(r.communitySessions,1000)||!whole(r.peopleReached,100000))throw Error(line+'activity counts exceed template bounds.');
    if(r.reportsReceived===0&&(r.staffTrained>0||r.communitySessions>0||r.peopleReached>0))throw Error(line+'activity counts must be zero when no reports were received.');
  }
  return clone(payload.records);
}
export function selectRecords(records,{lga='All',month='All'}={}){return records.filter(r=>(lga==='All'||r.lga===lga)&&(month==='All'||r.month===month));}
export function summarize(records){const totals={approved:0,released:0,spent:0,reportsReceived:0,reportsExpected:0,staffTrained:0,communitySessions:0,peopleReached:0};for(const r of records)for(const k of Object.keys(totals))totals[k]+=r[k];return {...totals,lgas:new Set(records.map(r=>r.lga)).size,sites:new Set(records.map(r=>r.lga)).size*3,months:new Set(records.map(r=>r.month)).size,completion:totals.reportsExpected?totals.reportsReceived/totals.reportsExpected:0,releaseRate:totals.approved?totals.released/totals.approved:0,spendRate:totals.released?totals.spent/totals.released:0};}
export function calculateBudget(budget){
  if(!plain(budget)||!Array.isArray(budget.items)||budget.items.length!==seedBudget.items.length)throw Error('The scenario requires every budget line.');
  if(!Number.isFinite(budget.contingency)||budget.contingency<0||budget.contingency>30||!whole(budget.assumedFunding,1000000000)||!whole(budget.ceiling,1000000000))throw Error('Invalid scenario assumptions.');
  const seen=new Set();let base=0;const categories={};
  for(const b of budget.items){const original=seedBudget.items.find(x=>x.id===b.id);if(!original||seen.has(b.id)||!whole(b.quantity,10000)||!whole(b.unitCost,1000000000))throw Error('Budget quantities and unit costs must be bounded whole numbers.');seen.add(b.id);const total=b.quantity*b.unitCost;if(!Number.isSafeInteger(total)||total>1000000000)throw Error('A budget line cannot exceed ₦1 billion.');base+=total;categories[original.category]=(categories[original.category]||0)+total;}
  if(base>1000000000)throw Error('The scenario base cannot exceed ₦1 billion.');
  const contingency=Math.round(base*budget.contingency/100),total=base+contingency;
  return {base,contingency,total,gap:Math.max(0,total-budget.assumedFunding),surplus:Math.max(0,budget.assumedFunding-total),ceilingVariance:budget.ceiling-total,categories};
}
export function isOverdue(action,today=new Date().toISOString().slice(0,10)){return action.status!=='Done'&&action.due<today;}
export function toCSV(records){const quote=v=>'"'+String(v).replaceAll('"','""')+'"';return '\uFEFF'+['synthetic',...RECORD_KEYS].join(',')+'\r\n'+records.map(r=>[true,...RECORD_KEYS.map(k=>r[k])].map(quote).join(',')).join('\r\n');}
export function parseStoredState(text){
  const value=JSON.parse(text);if(!plain(value)||value.version!==1)throw Error('Unsupported saved version.');
  const fresh=freshState();fresh.records=validateImport({schemaVersion:1,synthetic:true,records:value.records});
  if(!Array.isArray(value.actions)||value.actions.length!==fresh.actions.length||!Array.isArray(value.partners)||value.partners.length!==fresh.partners.length)throw Error('Saved lists are incomplete.');
  fresh.actions=fresh.actions.map(original=>{const edits=value.actions.filter(x=>x.id===original.id);if(edits.length!==1)throw Error('Invalid saved action.');const a=edits[0];if(!ACTION_STATUSES.includes(a.status)||!OWNERS.includes(a.owner)||!validDate(a.due))throw Error('Invalid saved action fields.');return {...original,status:a.status,owner:a.owner,due:a.due};});
  fresh.partners=fresh.partners.map(original=>{const edits=value.partners.filter(x=>x.id===original.id);if(edits.length!==1)throw Error('Invalid saved partner.');const p=edits[0];if(!PARTNER_STATUSES.includes(p.status)||typeof p.note!=='string'||p.note.length>500)throw Error('Invalid saved partner fields.');return {...original,status:p.status,note:p.note};});
  calculateBudget(value.budget);fresh.budget={...clone(seedBudget),contingency:value.budget.contingency,assumedFunding:value.budget.assumedFunding,ceiling:value.budget.ceiling,items:seedBudget.items.map(b=>{const x=value.budget.items.find(x=>x.id===b.id);return {...b,quantity:x.quantity,unitCost:x.unitCost};})};return fresh;
}
