import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const previous=JSON.parse(await readFile('ASSET_WORK/polish/gameplay.json','utf8'));const saved=previous.saved;
await page.addInitScript(saved=>localStorage.setItem('monster-world-save',saved),saved);
const records=[];async function record(name){const state=await page.evaluate(()=>window.__MW.snapshot()),visuals=await page.evaluate(()=>window.__MW.visuals());records.push({name,state,visuals});await page.screenshot({path:`ASSET_WORK/polish/visual-${name}.png`});console.log(name,JSON.stringify({visuals,residents:state.assets.residents}));}
try{
await page.goto('http://127.0.0.1:5174/?debug=1');await page.waitForFunction(()=>!!window.__MW);await page.getByRole('button',{name:/Continue adventure/}).click();await page.waitForFunction(()=>{const s=window.__MW.snapshot();return s.assets.dragons[0]?.status==='ready'&&s.assets.sanctuary.vegetation===16;},null,{timeout:60000});await page.waitForTimeout(1600);
await page.evaluate(()=>{window.__MW.teleport('mount');window.__MW.face(68,-50);});await record('young-front');
await page.keyboard.down('s');await page.waitForTimeout(400);await page.keyboard.up('s');await page.waitForTimeout(250);await record('young-clear');
await page.evaluate(()=>window.__MW.teleport('mount'));await page.keyboard.press('e');await page.waitForTimeout(700);await record('mounted');
await page.keyboard.down('Space');await page.waitForTimeout(1600);await page.keyboard.up('Space');await page.keyboard.down('w');await page.keyboard.down('ShiftLeft');
for(let i=0;i<9;i++){await page.waitForTimeout(180);await record('air-'+i);}
await page.keyboard.up('ShiftLeft');await page.keyboard.up('w');await page.waitForTimeout(1600);await page.keyboard.down('ControlLeft');await page.waitForTimeout(6000);await page.keyboard.up('ControlLeft');await page.keyboard.press('f');await page.waitForTimeout(300);
await page.evaluate(()=>window.__MW.teleport('shop'));await page.waitForTimeout(1300);await record('market-horse');
await writeFile('ASSET_WORK/polish/visuals.json',JSON.stringify({records,errors},null,2));if(errors.length)throw new Error(JSON.stringify(errors));
}finally{await browser.close();}
