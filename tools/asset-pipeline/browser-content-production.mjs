import {createRequire} from 'node:module';import {readFile,writeFile,mkdir} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),reports=[];
const saved=JSON.parse(await readFile('ASSET_WORK/iteration2/gameplay.json','utf8')).saved;
const out=process.argv[2]??'ASSET_WORK/iteration2';await mkdir(out,{recursive:true});
let failure='';try{for(const young of [false,true]){
 const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),errors=[],failed=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('requestfailed',r=>failed.push(r.url()));
 if(young)await c.addInitScript(value=>localStorage.setItem('monster-world-save',value),saved);
 await p.addInitScript(()=>{const s={draws:0,triangles:0,frames:[],last:0};window.__PERF=s;for(const key of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const proto=WebGL2RenderingContext.prototype,original=proto[key];proto[key]=function(...a){s.draws++;if(a[0]===4)s.triangles+=a[key.includes('Elements')?1:2]/3*(key.includes('Instanced')?a.at(-1):1);return original.apply(this,a);};}function frame(t){if(s.last)s.frames.push({ms:t-s.last,draws:s.draws,triangles:s.triangles});s.last=t;s.draws=0;s.triangles=0;if(s.frames.length>180)s.frames.shift();requestAnimationFrame(frame);}requestAnimationFrame(frame);});
 const player=p.waitForResponse(r=>r.url().endsWith('/cartoon-boy.glb')&&r.status()===200),dragon=p.waitForResponse(r=>r.url().endsWith('/mountain-family.glb')&&r.status()===200);
 await p.goto('http://127.0.0.1:5176/?debug=1');await p.getByRole('button',{name:/Begin adventure|Continue adventure/}).click();await player;await dragon;
 // A response event only proves headers arrived; count complete model bodies.
 await p.waitForFunction(young=>{const resources=performance.getEntriesByType('resource');return resources.some(r=>r.name.endsWith('/cartoon-boy.glb')&&r.decodedBodySize>12000000)&&resources.some(r=>r.name.endsWith('/mountain-family.glb')&&r.decodedBodySize>10000000);},young,{timeout:60000});
 // Complete bodies still precede texture decode/shader compilation. Measure a
 // separate warmed window, never turn a short cold-load sample into an FPS claim.
 await p.waitForTimeout(6000);await p.evaluate(()=>{window.__PERF.frames=[];});
 await p.waitForFunction(()=>window.__PERF.frames.filter(x=>x.draws>0).length>=120,null,{timeout:30000});
 const data=await p.evaluate(()=>{const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info'),gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'UNKNOWN';gl.getExtension('WEBGL_lose_context')?.loseContext();return {frames:window.__PERF.frames,resources:performance.getEntriesByType('resource').map(r=>({url:r.name,transfer:r.transferSize,decoded:r.decodedBodySize})),browser:navigator.userAgent,gpu,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,debugAPI:!!window.__MW,labAPI:!!window.__ASSET_LAB};});
 data.youngLoaded=young;data.measurement='120 rendered frames after complete model bodies and 6s shader/texture warmup; idle spawn, shadows included';data.errors=errors;data.failed=failed;data.rawRoutes=[];
 for(const path of ['/asset-lab.html','/__asset_catalog','/__asset_source/SOURCE_ASSETS/dragons/mountain-dragon/source/MOUNTAIN_DRAGON_ANIMATIONS.glb','/__asset_work/dragons/mountain.glb']){const response=await c.request.get('http://127.0.0.1:5176'+path),body=await response.text();data.rawRoutes.push({path,status:response.status(),contentType:response.headers()['content-type'],labOrSourceExposed:!body.includes('<title>Monster World')});}
 if(data.debugAPI||data.labAPI||errors.length||failed.length||data.rawRoutes.some(x=>x.labOrSourceExposed))throw new Error('Production boot/isolation failed');
 await p.screenshot({path:`${out}/production-${young?'young':'fresh'}.png`});
 if(young){
  // Play the Horse in the shipped bundle through ordinary controls and HUD.
  // The south lawn avoids the house at(-66,82); no debug object/teleport exists.
  await p.getByRole('button',{name:'Choose Wild Nest'}).click();await p.locator('[data-action="navigate"][data-id="highland"]').click();
  // Infer position from the visible destination distance/bearing (yaw stays0),
  // so lazy-load stalls cannot turn elapsed wall time into presumed movement.
  const hudPosition=()=>p.evaluate(()=>{const r=parseFloat(document.querySelector('[data-hud="distance"]').textContent),a=parseFloat(document.querySelector('[data-hud="arrow"]').style.transform.slice(7));return{x:-780-Math.cos(a)*r,z:-900-Math.sin(a)*r};});
  const walkAxis=async(axis,target)=>{const start=Date.now(),before=await hudPosition(),key=axis==='x'?(target<before.x?'a':'d'):(target<before.z?'w':'s');await p.keyboard.down(key);let current=before;while(Date.now()-start<20000){await p.waitForTimeout(80);current=await hudPosition();if(Math.abs(current[axis]-target)<2||Math.sign(target-current[axis])!==Math.sign(target-before[axis]))break;}await p.keyboard.up(key);await p.waitForTimeout(300);if(Math.abs(current[axis]-target)>4)throw new Error('Production foot route blocked '+JSON.stringify({axis,target,current}));};
  await walkAxis('z',116);await walkAxis('x',-98);await walkAxis('z',84);
  await p.waitForFunction(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/horse.glb')&&r.decodedBodySize>13000000),null,{timeout:30000});await p.waitForTimeout(800);
  const approach=await p.evaluate(()=>({prompt:document.querySelector('[data-hud="prompt"]').textContent,distance:document.querySelector('[data-hud="distance"]').textContent,bearing:document.querySelector('[data-hud="arrow"]').style.transform,mode:document.querySelector('[data-hud="mode"]').textContent}));console.log('Horse approach HUD',JSON.stringify(approach));await p.screenshot({path:out+'/production-horse-approach.png'});await writeFile(out+'/production-horse-approach.json',JSON.stringify(approach,null,2));
  await p.keyboard.press('e');await p.getByText('RIDING SANCTUARY HORSE',{exact:true}).waitFor();
  await p.keyboard.down('s');await p.keyboard.down('ShiftLeft');await p.waitForTimeout(600);await p.keyboard.up('s');await p.keyboard.up('ShiftLeft');await p.waitForTimeout(400);await p.keyboard.press('Space');await p.getByText('HORSE JUMP',{exact:true}).waitFor();await p.keyboard.press('f');await p.getByText('HORSE JUMP',{exact:true}).waitFor();await p.waitForTimeout(1400);await p.getByText('RIDING SANCTUARY HORSE',{exact:true}).waitFor();await p.keyboard.press('f');await p.getByText('EXPLORING ON FOOT',{exact:true}).waitFor();
  data.horsePlay={ordinaryControls:true,noDebugAPI:!await p.evaluate(()=>!!window.__MW),mount:true,sprint:true,jump:true,airborneDismountBlocked:true,land:true,dismount:true};await p.screenshot({path:out+'/production-horse-play.png'});console.log('Production Horse ordinary controls PASS');
 }
 reports.push(data);await c.close();console.log('Production',young?'saved lineages':'fresh','PASS',data.resources.reduce((s,r)=>s+r.decoded,0),'decoded bytes');
}
await writeFile(out+'/production.json',JSON.stringify({pass:true,reports},null,2));}catch(error){failure=String(error);throw error;}finally{if(failure)await writeFile(out+'/production-attempt.json',JSON.stringify({pass:false,reports,error:failure},null,2));await browser.close();}

