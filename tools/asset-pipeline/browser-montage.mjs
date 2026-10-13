import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:5174/asset-lab.html');await page.waitForFunction(()=>!!window.__ASSET_LAB);
await page.evaluate(()=>window.__ASSET_LAB.load('/__asset_work/dragons/mountain.glb'));
const samples=[];
for(let t=0;t<=96;t+=4){const data=await page.evaluate(t=>{const s=window.__ASSET_LAB.sample(0,t);window.__ASSET_LAB.frame();window.__ASSET_LAB.angle(Math.PI/2);return s;},t);samples.push({time:t,...data});await page.screenshot({path:`ASSET_WORK/previews/lab/mountain-time-${t}.png`});}
await writeFile('ASSET_WORK/reports/mountain-montage.json',JSON.stringify(samples,null,2));await browser.close();
