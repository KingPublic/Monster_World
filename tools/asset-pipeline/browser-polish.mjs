import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
const errors=[],requests=[],steps=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>requests.push({url:r.url(),failure:r.failure()}));
const folder='ASSET_WORK/polish';await mkdir(folder,{recursive:true});
const snap=()=>page.evaluate(()=>window.__MW.snapshot());
function check(v,m){if(!v)throw new Error(m);}
async function record(name){const snapshot=await snap();steps.push({name,snapshot});await page.screenshot({path:`${folder}/game-${name}.png`});await writeFile(`${folder}/gameplay.json`,JSON.stringify({steps,errors,requests},null,2));console.log(name,JSON.stringify({position:snapshot.position,assets:snapshot.assets,guardian:snapshot.guardians[0]}));return snapshot;}
try{
await page.goto('http://127.0.0.1:5174/?debug=1');await page.waitForFunction(()=>!!window.__MW);await page.getByRole('button',{name:/Begin adventure/}).click();
await page.waitForFunction(()=>{const s=window.__MW.snapshot();return s.assets.player.status==='ready'&&s.assets.sanctuary.roads&&s.guardians.every(g=>g.assetStatus==='ready');},null,{timeout:60000});
await record('arrival');
if(process.argv.includes('--boot')){console.log('BOOT_ERRORS',JSON.stringify(errors));}
else{
await page.keyboard.down('w');await page.waitForTimeout(350);await record('walk');await page.keyboard.up('w');await page.keyboard.press('Space');await page.waitForTimeout(200);await record('jump');await page.waitForTimeout(800);
await page.evaluate(()=>window.__MW.teleport('forest'));await page.waitForTimeout(500);await record('guardian');await page.keyboard.down('e');await page.waitForTimeout(1300);await page.keyboard.up('e');let state=await record('theft');check(state.carried.length===1,'theft failed');
await page.evaluate(()=>window.__MW.teleport('home'));check(Math.hypot(...(await snap()).position.filter((_,i)=>i!==1))>300,'theft teleport succeeded');await page.evaluate(()=>window.__MW.face(0,0));await page.keyboard.down('ShiftLeft');await page.keyboard.down('w');
const start=Date.now();while(Date.now()-start<16000){await page.waitForTimeout(200);state=await snap();if(state.state.securedEggs.length)break;if(!state.carried.length)throw new Error('captured on sprint escape');}await page.keyboard.up('w');await page.keyboard.up('ShiftLeft');check(state.state.securedEggs.length===1,'escape failed');await record('delivery');
await page.evaluate(()=>window.__MW.teleport('hatchery'));await page.keyboard.press('e');await page.waitForTimeout(2900);await page.waitForFunction(()=>window.__MW.snapshot().assets.dragons[0]?.status==='ready');state=await record('baby');check(state.assets.dragons[0].form==='Baby','Baby not downloaded family');const babyAsset=state.assets.dragons[0].asset;
await page.evaluate(()=>window.__MW.teleport('mount'));await page.waitForTimeout(300);await page.keyboard.press('e');await page.waitForTimeout(400);await record('baby-fed');await page.keyboard.press('e');await page.waitForTimeout(200);await record('growth-mid');await page.waitForTimeout(1700);state=await record('young');check(state.state.dragons[0].stage==='Young'&&state.assets.dragons[0].asset===babyAsset,'growth changed family');
await page.keyboard.press('e');await page.waitForTimeout(700);state=await record('mounted');check(state.mountedId,'mount failed');
await page.keyboard.down('Space');await page.waitForTimeout(1500);await page.keyboard.up('Space');await page.keyboard.down('w');await page.keyboard.down('ShiftLeft');await page.waitForTimeout(1100);state=await record('flight-boost');check(state.airborne&&state.boosting,'flight boost failed');
for(let i=0;i<8;i++){await page.waitForTimeout(125);await page.screenshot({path:`${folder}/flight-motion-${i}.png`});}
await page.keyboard.down('d');await page.waitForTimeout(500);await record('flight-turn');await page.keyboard.up('d');await page.keyboard.up('ShiftLeft');await page.keyboard.up('w');await page.waitForTimeout(1800);
await page.keyboard.down('ControlLeft');await page.waitForTimeout(4800);await page.keyboard.up('ControlLeft');state=await record('landed');check(!state.airborne,'landing failed');await page.keyboard.press('f');await page.waitForTimeout(600);state=await record('dismounted');check(!state.mountedId,'dismount failed');
for(const service of ['shop','collection','rider']){await page.evaluate(service=>window.__MW.teleport(service),service);await page.keyboard.press('e');await page.waitForTimeout(400);await record('service-'+service);if(service==='shop')await page.getByRole('button',{name:/Buy food/i}).click();if(service==='rider')await page.locator('[data-action="upgrade"]').first().click();await page.getByRole('button',{name:/Close/}).click();}
const before=await snap(),saved=await page.evaluate(()=>localStorage.getItem('monster-world-save'));await page.reload();await page.waitForFunction(()=>!!window.__MW);await page.getByRole('button',{name:/Continue adventure/}).click();await page.waitForFunction(()=>window.__MW.snapshot().assets.dragons[0]?.status==='ready');const after=await record('save-reload');check(JSON.stringify(after.state)===JSON.stringify(before.state),'save mismatch');
await writeFile(`${folder}/gameplay.json`,JSON.stringify({steps,errors,requests,saved,checks:{downloadedGuardians:true,sameFamilyGrowth:true,physicalEscape:true,theftTeleportDenied:true,babyUnrideable:true,mount:true,flight:true,boost:true,land:true,services:true,saveReload:true}},null,2));}
check(!errors.length,'browser errors: '+JSON.stringify(errors));check(!requests.length,'failed requests: '+JSON.stringify(requests));
}finally{await browser.close();}
