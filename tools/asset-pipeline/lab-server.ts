import type { Plugin } from 'vite';
import { readFileSync, existsSync, realpathSync, statSync, createReadStream } from 'node:fs';
import { resolve, sep, extname } from 'node:path';

/** Development-only, narrow file gateway. No production raw source entry. */
export function assetLabServer(): Plugin {
  return { name: 'monster-world-asset-lab', apply: 'serve', configureServer(server) {
    const root = server.config.root;
    const allowed = ['.fbx','.glb','.gltf','.bin','.png','.jpg','.jpeg','.tga','.webp'];
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://localhost');
      if (url.pathname === '/__asset_catalog') {
        try {
          const audit = JSON.parse(readFileSync(resolve(root, 'ASSET_WORK/reports/source-audit.json'), 'utf8'));
          const entries: {id:string;name:string;source:string;textures:{file:string;url:string}[];variants:{name:string;url:string}[]}[] = [];
          for (const asset of audit) {
            let models = asset.models.filter((m: {file:string}) => /\.(glb|gltf|fbx)$/i.test(m.file));
            if (asset.asset === 'fantastic-village') models = models.filter((m: {file:string}) => /3d\/buildings\/SM_BLD_(body_v01_01|base_v01_01|top_v01_01)|3d\/props\/SM_PROP_(flag_01|bridge_stone_01|cart_01)\.fbx/i.test(m.file)).slice(0,6);
            else if (asset.asset === 'fantasy-market') models = models.filter((m: {file:string}) => /V01.glb$/.test(m.file));
            else if (models.some((m:{file:string})=>/\.glb$/i.test(m.file))) models=models.filter((m:{file:string})=>/\.glb$/i.test(m.file));
            else models=models.slice(0,1);
            const variants=models.map((m:{file:string})=>({name:m.file,url:'/__asset_source/'+asset.root+'/'+m.file}));
            const work:Record<string,string>={'stylized-cartoon-boy':'characters/cartoon-boy.glb','tarisland-dragon':'dragons/tarisland.glb','bernardo-dragon':'dragons/bernardo.glb','chinese-dragon':'dragons/chinese.glb','horse':'creatures/horse.glb','medieval-village-scene':'environment/medieval-scene.glb','fantasy-castle':'environment/castle.glb'};
            if(work[asset.asset] && existsSync(resolve(root,'ASSET_WORK',work[asset.asset]!))) variants.push({name:'Derived comparison',url:'/__asset_work/'+work[asset.asset]});
            if(asset.asset==='stylized-cartoon-boy' && existsSync(resolve(root,'ASSET_WORK/characters/cartoon-boy-repaired.glb')))variants.push({name:'Repaired bind comparison',url:'/__asset_work/characters/cartoon-boy-repaired.glb'});
            if(asset.asset==='fantastic-village')for(const id of ['body','body2','base','tower','flag','bridge','cart'])if(existsSync(resolve(root,`ASSET_WORK/environment/village-${id}-runtime.glb`)))variants.push({name:'Prepared '+id,url:`/__asset_work/environment/village-${id}-runtime.glb`});
            if(asset.asset==='fantasy-market' && existsSync(resolve(root,'ASSET_WORK/environment/market-stall.glb')))variants.push({name:'Prepared market stall',url:'/__asset_work/environment/market-stall.glb'});
            if(asset.asset==='mountain-dragon' && existsSync(resolve(root,'ASSET_WORK/dragons/mountain.glb')))variants.push({name:'Prepared Mountain',url:'/__asset_work/dragons/mountain.glb'});
            const published:Record<string,[string,string]>={
              'stylized-cartoon-boy':['Playable Cartoon Boy','models/characters/player/cartoon-boy.glb'],
              'mountain-dragon':['Published Mountain family (bounded keys, corrected PBR)','models/dragons/mountain-family.glb'],
              'traveler':['Published ambient Traveler','models/characters/npc/traveler.glb'],
              'knight-of-tomorrow':['Published ambient Knight','models/characters/npc/knight.glb'],
              'horse':['Published ambient Horse','models/creatures/ambient/horse.glb'],
              'fantastic-village':['Published Village garden tree (LOD0)','models/environment/sanctuary/village-tree.glb'],
            };
            const current=published[asset.asset];if(current&&existsSync(resolve(root,'public/assets',current[1])))variants.push({name:current[0],url:'/assets/'+current[1]});
            if(asset.asset==='stone-pathway')variants.push({name:'Runtime material preview',url:'material:road'});
            entries.push({id:asset.asset,name:asset.asset,source:asset.root,textures:asset.textures.map((t:{file:string})=>({file:t.file,url:'/__asset_source/'+asset.root+'/'+t.file})),variants});
          }
          res.setHeader('Content-Type','application/json');res.end(JSON.stringify(entries));
        } catch(e) {res.statusCode=503;res.end('Run tools/asset-pipeline/audit.py audit first. '+String(e));}
        return;
      }
      const source=url.pathname.startsWith('/__asset_source/'),work=url.pathname.startsWith('/__asset_work/');
      if (!source&&!work) {
        if(/SOURCE_ASSETS|ASSET_WORK/i.test(decodeURIComponent(url.pathname))) {res.statusCode=403;res.end('Use the Asset Lab file gateway.');return;}
        next();return;
      }
      try {
        // Some desktop download managers intercept .bin even for fetch requests.
        // A development-only alias keeps glTF buffers in the browser loader.
        const relative=decodeURIComponent(url.pathname.slice(source?16:14)).replace(/\.gltfbuffer$/i,'.bin');
        const base=realpathSync(resolve(root,source?'SOURCE_ASSETS':'ASSET_WORK'));
        const file=realpathSync(resolve(root,source?relative:'ASSET_WORK/'+relative));
        if(!file.startsWith(base+sep)||!allowed.includes(extname(file).toLowerCase())||!statSync(file).isFile())throw new Error('Not an allowed asset');
        const types:Record<string,string>={'.glb':'model/gltf-binary','.gltf':'model/gltf+json','.bin':'application/gltf-buffer','.fbx':'application/x-fbx','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
        res.setHeader('Content-Type',types[extname(file).toLowerCase()]??'application/octet-stream');res.setHeader('Content-Disposition','inline');res.setHeader('Cache-Control','no-cache');createReadStream(file).pipe(res);
      }catch {res.statusCode=404;res.end('Asset missing or path rejected. Check audit catalog and dependencies.');}
    });
  }};
}
