import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),reports=[];
const saved=JSON.parse(await readFile('ASSET_WORK/reports/gameplay-browser.json','utf8')).saved;
for(const young of [false,true]){
 const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),errors=[],failed=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('requestfailed',r=>failed.push(r.url()));
 if(young)await c.addInitScript(value=>localStorage.setItem('monster-world-save',value),saved);
 await p.addInitScript(()=>{const s={draws:0,triangles:0,frames:[],last:0};window.__PERF=s;for(const key of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const proto=WebGL2RenderingContext.prototype,original=proto[key];proto[key]=function(...a){s.draws++;if(a[0]===4)s.triangles+=a[key.includes('Elements')?1:2]/3*(key.includes('Instanced')?a.at(-1):1);return original.apply(this,a);};}function frame(t){if(s.last)s.frames.push({ms:t-s.last,draws:s.draws,triangles:s.triangles});s.last=t;s.draws=0;s.triangles=0;if(s.frames.length>180)s.frames.shift();requestAnimationFrame(frame);}requestAnimationFrame(frame);});
 const player=p.waitForResponse(r=>r.url().endsWith('/cartoon-boy.glb')&&r.status()===200),dragon=young?p.waitForResponse(r=>r.url().endsWith('/mountain-young.glb')&&r.status()===200):Promise.resolve();
 await p.goto('http://127.0.0.1:5176/?debug=1');await p.getByRole('button',{name:/Begin adventure|Continue adventure/}).click();await player;await dragon;
 // A response event only proves headers arrived; count complete model bodies.
 await p.waitForFunction(young=>{const resources=performance.getEntriesByType('resource');return resources.some(r=>r.name.endsWith('/cartoon-boy.glb')&&r.decodedBodySize>12000000)&&(!young||resources.some(r=>r.name.endsWith('/mountain-young.glb')&&r.decodedBodySize>18000000));},young,{timeout:60000});
 await p.waitForTimeout(2500);
 const data=await p.evaluate(()=>{const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info'),gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'UNKNOWN';gl.getExtension('WEBGL_lose_context')?.loseContext();return {frames:window.__PERF.frames,resources:performance.getEntriesByType('resource').map(r=>({url:r.name,transfer:r.transferSize,decoded:r.decodedBodySize})),browser:navigator.userAgent,gpu,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,debugAPI:!!window.__MW,labAPI:!!window.__ASSET_LAB};});
 data.youngLoaded=young;data.errors=errors;data.failed=failed;data.rawRoutes=[];
 for(const path of ['/asset-lab.html','/__asset_catalog','/__asset_source/SOURCE_ASSETS/dragons/mountain-dragon/source/MOUNTAIN_DRAGON_ANIMATIONS.glb','/__asset_work/dragons/mountain.glb']){const response=await c.request.get('http://127.0.0.1:5176'+path),body=await response.text();data.rawRoutes.push({path,status:response.status(),contentType:response.headers()['content-type'],labOrSourceExposed:!body.includes('<title>Monster World')});}
 if(data.debugAPI||data.labAPI||errors.length||failed.length||data.rawRoutes.some(x=>x.labOrSourceExposed))throw new Error('Production boot/isolation failed');
 await p.screenshot({path:`ASSET_WORK/previews/production-${young?'young':'fresh'}.png`});reports.push(data);await c.close();console.log('Production',young?'Young':'fresh','PASS',data.resources.reduce((s,r)=>s+r.decoded,0),'decoded bytes');
}
await writeFile('ASSET_WORK/reports/production-browser.json',JSON.stringify({pass:true,reports},null,2));await browser.close();
