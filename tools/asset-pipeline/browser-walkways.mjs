// Physical city route, using direction and keyboard only; no teleport.
import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),records=[];
const saved=JSON.parse(await readFile('ASSET_WORK/reports/gameplay-browser.json','utf8')).saved;await context.addInitScript(s=>localStorage.setItem('monster-world-save',s),saved);
await page.goto('http://127.0.0.1:5174/?debug=1');await page.waitForFunction(()=>!!window.__MW);await page.getByRole('button',{name:/Continue adventure/}).click();await page.waitForFunction(()=>window.__MW.snapshot().assets.player.status==='ready');
async function walk(name,x,z){const start=Date.now();let distance=Infinity;await page.keyboard.down('w');while(Date.now()-start<12000){await page.evaluate(({x,z})=>window.__MW.face(x,z),{x,z});await page.waitForTimeout(75);const p=(await page.evaluate(()=>window.__MW.snapshot())).position;distance=Math.hypot(p[0]-x,p[2]-z);if(distance<2.5)break;}await page.keyboard.up('w');await page.waitForTimeout(200);if(distance>=2.5)throw new Error('Route blocked at '+name+'; distance '+distance);const snapshot=await page.evaluate(()=>window.__MW.snapshot());records.push({name,target:[x,z],position:snapshot.position,context:snapshot.context});console.log('REACHED',name,JSON.stringify(snapshot.position));if(!name.startsWith('waypoint'))await page.screenshot({path:'ASSET_WORK/previews/route-'+name+'.png'});}
try{
 await walk('food-shop',-42,40);await page.keyboard.press('e');await page.getByRole('button',{name:/Close/}).click();
 await walk('waypoint-fountain-east',15,40);await walk('waypoint-fountain-clearance',15,4);await walk('waypoint-stair-entrance',0,4);await walk('waypoint-mid-terrace',0,-34);
 await walk('collection-hall',-41,-28);await page.keyboard.press('e');await page.getByRole('button',{name:/Close/}).click();
 await walk('waypoint-upper-stair',0,-34);await walk('hatchery',0,-62);await walk('waypoint-upper-return',0,-34);
 await walk('rider-hall',44,-29);await page.keyboard.press('e');await page.getByRole('button',{name:/Close/}).click();
 await walk('waypoint-mount-terrace-entry',54,-25);await walk('mount-court',54,22);await page.keyboard.press('e');await page.waitForFunction(()=>!!window.__MW.snapshot().mountedId);await page.keyboard.press('f');await page.waitForFunction(()=>!window.__MW.snapshot().mountedId);
 await writeFile('ASSET_WORK/reports/walkways-browser.json',JSON.stringify({pass:true,noTeleport:true,records},null,2));
}finally{await browser.close();}
