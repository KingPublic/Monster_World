import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';
const require = createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const url=process.env.GAME_URL??'http://127.0.0.1:5174/?debug=1',label=process.env.REPORT_LABEL??'final-boot';
const browser = await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const context = await browser.newContext({ viewport:{width:1440,height:900} });
const page = await context.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.addInitScript(()=>{
  const stats={draws:0,triangles:0,frames:[],last:0};window.__perf=stats;
  for(const key of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){
    const proto=WebGL2RenderingContext.prototype, original=proto[key];
    proto[key]=function(...args){stats.draws++;if(args[0]===4)stats.triangles+=args[key.includes('Elements')?1:2]/3*(key.includes('Instanced')?args.at(-1):1);return original.apply(this,args);};
  }
  function frame(t){if(stats.last)stats.frames.push({ms:t-stats.last,draws:stats.draws,triangles:stats.triangles});stats.last=t;stats.draws=0;stats.triangles=0;if(stats.frames.length>300)stats.frames.shift();requestAnimationFrame(frame);}requestAnimationFrame(frame);
});
await page.goto(url);await page.waitForFunction(()=>!!window.__MW);
await page.getByRole('button',{name:/Begin adventure|Continue adventure/}).click();
await page.waitForFunction(()=>{const a=window.__MW.snapshot().assets;return !a||(a.player.status==='ready'&&a.sanctuary.props===5&&a.sanctuary.roads);});
await page.waitForTimeout(2500);
await mkdir('ASSET_WORK/previews',{recursive:true});await page.screenshot({path:`ASSET_WORK/previews/${label}-game.png`});
const data=await page.evaluate(()=>({snapshot:window.__MW.snapshot(),frames:window.__perf.frames,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,decoded:r.decodedBodySize})),browser:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,hardware:{cores:navigator.hardwareConcurrency}}));
if(label.startsWith('baseline')&&data.snapshot.assets)throw new Error('Expected historical baseline; integrated asset snapshot detected');
data.errors=errors;await writeFile(`ASSET_WORK/reports/${label}-browser.json`,JSON.stringify(data,null,2));console.log(JSON.stringify({errors,frames:data.frames.slice(-3),bytes:data.resources.reduce((s,r)=>s+r.decoded,0),snapshot:data.snapshot}));await browser.close();
