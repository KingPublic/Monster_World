import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),out='ASSET_WORK/iteration7';
const fixture=JSON.parse(await readFile('ASSET_WORK/iteration6/dragon-care-close.json','utf8')).mobile.state;
fixture.food=20;fixture.securedEggs=[];
const result={pass:false,errors:[],networkErrors:[],provenance:'Isolated browser context with prior earned save fixture. Food and private secured-Egg grants staged; real UI hatching, feeding, mounting, Space/C flight, saving and reload. No personal browser storage touched.',steps:[]};
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const check=(v,m)=>{if(!v)throw new Error(m);};
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(s=>{if(location.protocol==='http:'&&!sessionStorage.getItem('expansion-fixture')){localStorage.setItem('monster-world-save',JSON.stringify(s));sessionStorage.setItem('expansion-fixture','1');}},fixture);
 const page=await context.newPage();
 page.on('pageerror',e=>result.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)result.networkErrors.push({url:r.url(),status:r.status()});});
 const snapshot=()=>page.evaluate(()=>window.__MW.snapshot());
 await page.goto('http://127.0.0.1:5174/?debug=1');
 await page.waitForFunction(()=>!!window.__MW);
 await page.evaluate(async()=>{window.__MW.dispose();const{Game}=await import('/src/core/Game.ts');window.__EXP=new Game(document.querySelector('#app'));});
 await page.getByRole('button',{name:'Continue adventure'}).click();
 await page.waitForFunction(()=>window.__MW.snapshot().assets.player.status==='ready',null,{timeout:30000});
 const initial=await snapshot();check(initial.nests.length===14&&initial.guardians.length===14,'Physical region count');
 check(initial.nests.find(n=>n.id==='sunreach').slots.every(s=>s.egg?.rarity==='Legendary'&&s.egg.variant==='suncrest'),'Natural Legendary slots');
 check(initial.nests.find(n=>n.id==='stormspire').slots.every(s=>s.egg?.rarity==='Mythical'&&s.egg.variant==='stormserpent'),'Natural Mythical slots');
 check(await page.locator('[data-debug]').count()===25,'Expanded private admin entries');
 result.world={nests:initial.nests,guardians:initial.guardians,residents:initial.assets.residents};
 await page.evaluate(()=>window.__EXP.ui.showPanel('destinations',window.__EXP.progression.state));
 check(await page.locator('[data-action="navigate"]').count()===14,'Destination route cards');
 check((await page.locator('.service-panel').textContent()).includes('Mythical 100%'),'Destination rarity information');
 await page.screenshot({path:out+'/world-destinations.png'});await page.getByRole('button',{name:'Close panel'}).click();
 const newIds=[];
 for(const [rarity,variant] of [['Legendary','suncrest'],['Mythical','stormserpent']]){
  const before=(await snapshot()).state.dragons.length;
  await page.getByRole('button',{name:rarity+' Egg',exact:true}).click();
  await page.evaluate(()=>window.__MW.teleport('hatchery'));await page.waitForFunction(()=>window.__MW.snapshot().context?.kind==='hatch');
  await page.keyboard.press('e');await page.waitForFunction(n=>window.__MW.snapshot().state.dragons.length>n,before,{timeout:15000});
  const baby=(await snapshot()).state.dragons.at(-1);check(baby.rarity===rarity&&baby.variant===variant&&baby.stage==='Baby','Real '+rarity+' hatch');newIds.push(baby.id);
  await page.evaluate(()=>window.__EXP.ui.showPanel('collection',window.__EXP.progression.state));
  await page.locator('[data-action="visit"][data-id="'+baby.id+'"]').click();await page.getByRole('button',{name:'Close panel'}).click();
  for(let meal=0;meal<2;meal++){
   await page.evaluate(()=>window.__MW.teleport('mount'));await page.waitForFunction(id=>window.__MW.snapshot().context?.dragonId===id,baby.id);
   await page.keyboard.press('e');await page.waitForFunction(({id,growth})=>window.__MW.snapshot().state.dragons.find(d=>d.id===id).growth>=growth,{id:baby.id,growth:(meal+1)*50});
  }
  await page.evaluate(()=>window.__MW.teleport('mount'));await page.waitForFunction(()=>window.__MW.snapshot().context?.kind==='mount');
  await page.keyboard.press('e');await page.waitForFunction(id=>window.__MW.snapshot().mountedId===id,baby.id);
  const young=await snapshot();check(young.state.dragons.find(d=>d.id===baby.id).variant===variant&&young.assets.dragons.find(d=>d.id===baby.id).asset==='authored:'+variant,'Young retains authored family');
  await page.keyboard.down('Space');await page.waitForFunction(()=>{const s=window.__MW.snapshot();return s.airborne&&s.position[1]>s.floor+12;},null,{timeout:10000});await page.keyboard.up('Space');
  await page.evaluate(()=>{window.__EXP.follow.yaw=-2.3;window.__EXP.follow.pitch=.13;});await page.waitForTimeout(350);
  const raised=await snapshot();await page.screenshot({path:out+'/'+variant+'-ridden-in-game.png'});
  await page.keyboard.down('c');await page.waitForFunction(()=>!window.__MW.snapshot().airborne,null,{timeout:10000});await page.keyboard.up('c');
  const landed=await snapshot();check(landed.mountedId===baby.id&&Math.abs(landed.position[1]-landed.floor)<.01,'Actual C landing');
  await page.keyboard.press('f');await page.waitForFunction(()=>!window.__MW.snapshot().mountedId);
  result.steps.push({rarity,variant,id:baby.id,baby,young:young.state.dragons.find(d=>d.id===baby.id),visual:young.assets.dragons.find(d=>d.id===baby.id),raised:raised.position,landed:landed.position,flightTime:landed.flightTime});
  console.log('PASS '+rarity+' real hatch -> two meals -> same Young family -> mount/Space/C/dismount');
 }
 result.saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('monster-world-save')));
 await page.reload();await page.getByRole('button',{name:'Continue adventure'}).click();await page.waitForFunction(()=>window.__MW.snapshot().assets.player.status==='ready');
 const restored=await snapshot();check(newIds.every(id=>restored.state.dragons.some(d=>d.id===id&&d.stage==='Young')),'New lineages survive reload');result.restored=restored.state;
 await page.evaluate(async()=>{window.__MW.dispose();const{Game}=await import('/src/core/Game.ts');window.__EXP=new Game(document.querySelector('#app'));});await page.getByRole('button',{name:'Continue adventure'}).click();
 result.regions=[];
 for(const id of ['dunes','ember','glacier','moonwell','sunreach','stormspire']){
  await page.evaluate(id=>window.__MW.teleport(id),id);await page.waitForFunction(id=>window.__MW.snapshot().context?.nestId===id,id);
  await page.waitForTimeout(180);const s=await snapshot(),guardian=s.guardians.find(g=>g.id===id);
  check(guardian.assetStatus==='ready'&&guardian.asset.startsWith('authored:'),'New Guardian renderer '+id);check(Math.abs(s.position[1]-s.floor)<.01,'Region floor '+id);
  await page.evaluate(()=>{const g=window.__EXP;g.follow.pitch=.14;g.follow.yaw=.85;});await page.waitForTimeout(200);
  await page.screenshot({path:out+'/region-'+id+'.png'});
  result.regions.push({id,position:s.position,floor:s.floor,context:s.context,guardian,render:s.render});
 }
 // A real high-rarity slot theft in this isolated context; no staged return claim.
 await page.evaluate(()=>window.__MW.teleport('stormspire'));await page.waitForFunction(()=>window.__MW.snapshot().context?.kind==='steal');
 await page.keyboard.down('e');await page.waitForFunction(()=>window.__MW.snapshot().carried.length===1,null,{timeout:5000});await page.keyboard.up('e');
 result.mythicalTheft=await snapshot();check(result.mythicalTheft.carried[0].rarity==='Mythical'&&result.mythicalTheft.carried[0].variant==='stormserpent','Physical Mythical theft');
 const stolenPosition=result.mythicalTheft.position;await page.evaluate(()=>window.__MW.teleport('home'));const refused=await snapshot();check(refused.carried.length===1&&Math.hypot(refused.position[0]-stolenPosition[0],refused.position[2]-stolenPosition[2])<2,'Theft travel shortcut allowed');
 await page.screenshot({path:out+'/mythical-egg-real-theft.png'});await context.close();
 const production=await browser.newContext({viewport:{width:1280,height:800}}),pp=await production.newPage();pp.on('pageerror',e=>result.errors.push(e.message));
 await pp.goto('http://127.0.0.1:5176/?debug=1');await pp.getByRole('button',{name:'Begin adventure'}).click();await pp.waitForTimeout(1200);
 result.production=await pp.evaluate(()=>({debugAPI:typeof window.__MW,adminButtons:document.querySelectorAll('[data-debug]').length,canvas:document.querySelector('canvas')?.width}));
 check(result.production.debugAPI==='undefined'&&result.production.adminButtons===0&&result.production.canvas>0,'Production boot/private admin isolation');
 await pp.screenshot({path:out+'/production-adventure-world.png'});await production.close();
 check(!result.errors.length&&!result.networkErrors.length,'Browser or asset errors');result.pass=true;console.log('PASS14physical nests, natural high rarity,6authored guardians, save reload, real Mythical theft and production boot');
}catch(error){result.failure=String(error);throw error;}finally{await writeFile(out+'/adventure-expansion-browser.json',JSON.stringify(result,null,2));await browser.close();}
