import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),records=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function walk(name,x,z,look){let distance=Infinity;const start=Date.now();await page.keyboard.down('w');while(Date.now()-start<14000){await page.evaluate(({x,z})=>window.__MW.face(x,z),{x,z});await page.waitForTimeout(60);const p=(await page.evaluate(()=>window.__MW.snapshot())).position;distance=Math.hypot(p[0]-x,p[2]-z);if(distance<2)break;}await page.keyboard.up('w');if(distance>=2)throw new Error(name+' blocked distance '+distance);await page.waitForTimeout(150);const s=await page.evaluate(()=>window.__MW.snapshot());records.push({name,target:[x,z],position:s.position,context:s.context});console.log(name,JSON.stringify(s.position));if(look){await page.evaluate(([x,z])=>window.__MW.face(x,z),look);await page.waitForTimeout(600);await page.screenshot({path:'ASSET_WORK/polish/city-'+name+'.png'});}}
try{
 await page.goto('http://127.0.0.1:5174/?debug=1');await page.waitForFunction(()=>!!window.__MW);await page.getByRole('button',{name:/Begin adventure/}).click();await page.waitForFunction(()=>window.__MW.snapshot().assets.sanctuary.vegetation===16);
 await walk('market-approach',-30,60);await walk('shop',-62,48,[-62,30]);
 await walk('garden-bypass',-28,48);await walk('west-promenade',-28,0);await walk('cross-street',-28,-27);await walk('collection',-62,-27,[-62,-48]);
 await walk('stair-approach',0,-27);await walk('hatchery',0,-67,[0,-96]);await walk('stair-return',0,-27);
 await walk('rider',74,-26,[74,-47]);await walk('mount',68,20,[0,22]);await walk('east-return',38,67);await walk('arrival',0,90,[0,-70]);await walk('valley-exit',0,151,[0,-70]);
 await writeFile('ASSET_WORK/polish/city-walkways.json',JSON.stringify({pass:true,noTeleport:true,errors,records,assets:(await page.evaluate(()=>window.__MW.snapshot())).assets},null,2));
}finally{await browser.close();}

