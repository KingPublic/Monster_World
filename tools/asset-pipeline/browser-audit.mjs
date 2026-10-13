import {createRequire} from 'node:module';import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire('C:/Users/Adrian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Adrian/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto('http://127.0.0.1:5174/asset-lab.html');await page.waitForFunction(()=>!!window.__ASSET_LAB);
const catalog=await page.evaluate(()=>window.__ASSET_LAB.catalog),records=[];await mkdir('ASSET_WORK/previews/lab',{recursive:true});
const ids=process.argv.slice(2);
for(const item of catalog){
 if(ids.length&&!ids.includes(item.id))continue;
 for(let variant=0;variant<item.variants.length;variant++){
  const v=item.variants[variant];console.log('LOAD',item.id,v.name);
  try{
   const start=errors.length;await page.evaluate(async ({id,url})=>{document.querySelector('#asset').value=id;await window.__ASSET_LAB.load(url);}, {id:item.id,url:v.url});
   const initial=await page.evaluate(()=>window.__ASSET_LAB.inspect());const entry={id:item.id,variant:v,initial,clips:[],errors:errors.slice(start)};
   if(!initial.error){
    await page.screenshot({path:`ASSET_WORK/previews/lab/${item.id}-${variant}-front.png`});
    await page.evaluate(()=>window.__ASSET_LAB.angle(Math.PI/2));await page.screenshot({path:`ASSET_WORK/previews/lab/${item.id}-${variant}-side.png`});
    await page.evaluate(()=>window.__ASSET_LAB.angle(Math.PI));await page.screenshot({path:`ASSET_WORK/previews/lab/${item.id}-${variant}-back.png`});
    for(let clip=0;clip<(initial.clips??[]).length;clip++){
     const c=initial.clips[clip],samples=[];
     for(const fraction of [0,.33,.66]){
      const sample=await page.evaluate(({clip,time})=>window.__ASSET_LAB.sample(clip,time),{clip,time:c.duration*fraction});samples.push({fraction,bounds:sample.bounds,bones:sample.bones,vertices:sample.vertices});
      if(fraction===.33){await page.evaluate(()=>window.__ASSET_LAB.frame());await page.screenshot({path:`ASSET_WORK/previews/lab/${item.id}-${variant}-clip-${clip}.png`});}
     }
     const moved=JSON.stringify(samples[0].vertices)!==JSON.stringify(samples[1].vertices);entry.clips.push({name:c.name,duration:c.duration,tracks:c.tracks,sampledSkinChanged:moved,samples});
    }
   }
   records.push(entry);await writeFile(`ASSET_WORK/reports/browser-audit-${ids.join('-')||'all'}.json`,JSON.stringify({browser:await page.evaluate(()=>navigator.userAgent),viewport:[1440,900],records,errors},null,2));
   console.log('CHECK',item.id,initial.meshes,initial.sceneTriangles,'triangles',initial.joints,'bones',entry.clips.length,'clips',initial.error||'');
  }catch(e){records.push({id:item.id,variant:v,error:String(e)});console.log('FAILED',item.id,String(e));}
 }
}
await browser.close();
