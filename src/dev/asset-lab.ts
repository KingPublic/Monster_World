import { AnimationMixer, Box3, Box3Helper, Color, DirectionalLight, Group, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, SkeletonHelper, SkinnedMesh, Vector3, WebGLRenderer, TextureLoader, RepeatWrapping, SRGBColorSpace, Texture } from 'three';
import type { AnimationClip, Object3D, Material } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LoadingManager } from 'three';
import { disposeScene } from '../utils/scene';
import './asset-lab.css';

if (!import.meta.env.DEV) throw new Error('Asset Lab is available only on the development server.');
type Entry={id:string;name:string;source:string;textures:{file:string;url:string}[];variants:{name:string;url:string}[]};
const host=document.querySelector<HTMLElement>('#lab')!;
host.innerHTML='<aside><h1>Asset Lab</h1><p>Neutral lighting · one asset at a time.<br>Raw sources stay outside production.</p><label>Asset<select id="asset"></select></label><label>Variant<select id="variant"></select></label><label>Animation<select id="clip"></select></label><button id="play">Pause</button><label>Speed<input id="speed" type="range" min="0" max="2" step="0.05" value="1"></label><label class="toggle"><input id="bounds" type="checkbox">Bounds</label><label class="toggle"><input id="skeleton" type="checkbox">Skeleton</label><label class="toggle"><input id="wire" type="checkbox">Wireframe</label><button id="frame">Frame asset</button><p id="error" role="status"></p><pre id="stats"></pre><a href="/">Return to game</a></aside><div id="view"></div>';
const get=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const scene=new Scene();scene.background=new Color(0x64737b);
scene.add(new HemisphereLight(0xf6f3e7,0x555e68,2.2));const light=new DirectionalLight(0xfff1df,2.6);light.position.set(8,15,10);scene.add(light);
const renderer=new WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));get('view').append(renderer.domElement);
const camera=new PerspectiveCamera(45,1,.02,100000);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
const floor=new Mesh(new PlaneGeometry(20000,20000),new MeshStandardMaterial({color:0x697674,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;scene.add(floor);
const container=new Group();scene.add(container);let model:Object3D|undefined,mixer:AnimationMixer|undefined,clips:AnimationClip[]=[],clipRanges:{start:number;end:number;loaderDuration:number}[]=[],skeleton:SkeletonHelper|undefined,bounds:Box3Helper|undefined,token=0,paused=false,loadedUrl='',lastError='',statistics:Record<string,unknown>={};
const catalog:Entry[]=await fetch('/__asset_catalog').then(r=>{if(!r.ok)throw new Error('Run source audit first');return r.json();});
const asset=get<HTMLSelectElement>('asset'),variant=get<HTMLSelectElement>('variant'),clip=get<HTMLSelectElement>('clip');
for(const item of catalog)asset.add(new Option(item.name,item.id));
function clear(){if(model){mixer?.stopAllAction();mixer?.uncacheRoot(model);const skins=new Set();model.traverse(node=>{if(node instanceof SkinnedMesh)skins.add(node.skeleton);});for(const skin of skins)(skin as SkinnedMesh['skeleton']).dispose();disposeScene(model);model.removeFromParent();}skeleton?.dispose();skeleton?.removeFromParent();bounds?.geometry.dispose();(bounds?.material as Material|undefined)?.dispose();bounds?.removeFromParent();model=undefined;mixer=undefined;skeleton=undefined;bounds=undefined;}
function frame(){if(!model)return;model.updateMatrixWorld(true);model.traverse(o=>{if(o instanceof SkinnedMesh)o.computeBoundingBox();});const b=new Box3().setFromObject(model),size=b.getSize(new Vector3()),center=b.getCenter(new Vector3()),r=Math.max(size.x,size.y,size.z,.1);controls.target.copy(center);camera.position.copy(center).add(new Vector3(r*.85,r*.45,r*1.2));camera.near=Math.max(.001,r/1000);camera.far=Math.max(1000,r*100);camera.updateProjectionMatrix();controls.update();}
function toggles(){if(bounds)bounds.visible=get<HTMLInputElement>('bounds').checked;if(skeleton)skeleton.visible=get<HTMLInputElement>('skeleton').checked;model?.traverse(o=>{if(o instanceof Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if('wireframe' in m)(m as MeshStandardMaterial).wireframe=get<HTMLInputElement>('wire').checked;});}
function selectClip(index:number,time=0){mixer?.stopAllAction();if(mixer&&clips[index]){const action=mixer.clipAction(clips[index]);action.reset().play();mixer.setTime(time);}clip.value=String(index);model?.updateMatrixWorld(true);}
async function road(){const loader=new TextureLoader(),maps=await Promise.all(['albedo','normal','roughness','ao'].map(name=>loader.loadAsync('/__asset_work/materials/stone-pathway-'+name+'.jpg')));for(const t of maps){t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(3,3);}maps[0]!.colorSpace=SRGBColorSpace;const mesh=new Mesh(new PlaneGeometry(10,10,1,1),new MeshStandardMaterial({map:maps[0],normalMap:maps[1],roughnessMap:maps[2],aoMap:maps[3],roughness:1}));mesh.geometry.setAttribute('uv1',mesh.geometry.getAttribute('uv').clone());mesh.rotation.x=-Math.PI/2;mesh.position.y=.01;return mesh;}
async function load(url:string){const mine=++token;clear();lastError='';get('error').textContent='Loading…';clip.innerHTML='';
 const selected=catalog.find(a=>a.variants.some(v=>v.url===url));if(selected){asset.value=selected.id;variant.innerHTML='';selected.variants.forEach(v=>variant.add(new Option(v.name,v.url)));variant.value=url;}
 try{let object:Object3D;let animations:AnimationClip[]=[];
  if(url==='material:road')object=await road();
  else {const manager=new LoadingManager();manager.onError=path=>{lastError='Missing dependency: '+path;get('error').textContent=lastError;};
    manager.setURLModifier(path=>path.replace(/\.bin$/i,'.gltfbuffer'));
    if(/\.fbx$/i.test(url))manager.setURLModifier(path=>{const entry=catalog.find(a=>url.includes(a.source));const name=decodeURIComponent(path).replaceAll('\\','/').split('/').pop()?.toLowerCase();return entry?.textures.find(t=>t.file.split('/').pop()?.toLowerCase()===name)?.url??path;});
    if(/\.fbx$/i.test(url)){object=await new FBXLoader(manager).loadAsync(url);animations=object.animations;}
    else {const gltf=await new GLTFLoader(manager).loadAsync(url);object=gltf.scene;animations=gltf.animations;}}
  if(mine!==token){disposeScene(object);return;}
  // FBX takes can retain absolute timeline keys. Loader duration then equals
  // end time rather than action length; normalize copies for honest playback.
  clipRanges=animations.map(c=>({start:Math.min(...c.tracks.filter(t=>t.times.length).map(t=>t.times[0]!)),end:Math.max(...c.tracks.filter(t=>t.times.length).map(t=>t.times[t.times.length-1]!)),loaderDuration:c.duration}));
  clips=animations.map((c,i)=>{const copy=c.clone(),start=clipRanges[i]!.start;for(const track of copy.tracks)for(let key=0;key<track.times.length;key++)track.times[key]!-=start;return copy.resetDuration();});
  model=object;loadedUrl=url;container.add(model);mixer=new AnimationMixer(model);
  // Animated bones can leave cached bind-pose spheres; a lab must show them.
  model.traverse(o=>{if(o instanceof SkinnedMesh)o.frustumCulled=false;});
  const materials=new Set<Material>(),textures=new Set<Texture>(),geometry=new Set();let meshes=0,triangles=0,joints=0,skinned=0,morphs=0;
  model.traverse(o=>{if(o.type==='Bone')joints++;if(o instanceof SkinnedMesh)skinned++;if(o instanceof Mesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3;geometry.add(o.geometry);morphs+=o.morphTargetInfluences?.length??0;for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof Texture)textures.add(v);}}});
  statistics={url,meshes,uniqueGeometries:geometry.size,sceneTriangles:triangles,materials:materials.size,textures:textures.size,joints,skinned,morphs,clips:clips.map((c,i)=>({name:c.name,duration:c.duration,tracks:c.tracks.length,sourceTimeRange:clipRanges[i],previewKeysNormalized:true})),boundsPose:'loaded pose; changes with sampled clip'};
  clip.add(new Option('Bind / source pose','-1'));clips.forEach((c,i)=>clip.add(new Option(c.name+' · '+c.duration.toFixed(2)+' s',String(i))));clip.value='-1';
  skeleton=new SkeletonHelper(model);scene.add(skeleton);bounds=new Box3Helper(new Box3().setFromObject(model),0xffcc66);scene.add(bounds);frame();toggles();get('error').textContent=lastError||'Loaded. Clips are source names; action semantics require visual inspection.';get('stats').textContent=JSON.stringify(statistics,null,2);
 }catch(e){if(mine!==token)return;lastError=String(e);get('error').textContent='Load failed: '+lastError+'. Inspect dependency paths or convert with Blender.';statistics={url,error:lastError};}
}
async function choose(id:string){asset.value=id;const item=catalog.find(a=>a.id===id)!;variant.innerHTML='';item.variants.forEach(v=>variant.add(new Option(v.name,v.url)));if(item.variants.length)await load(item.variants[0]!.url);}
asset.onchange=()=>void choose(asset.value);variant.onchange=()=>void load(variant.value);clip.onchange=()=>selectClip(Number(clip.value));get('play').onclick=()=>{paused=!paused;get('play').textContent=paused?'Play':'Pause';};get('frame').onclick=frame;for(const id of ['bounds','skeleton','wire'])get(id).onchange=toggles;
const observer=new ResizeObserver(()=>{const view=get('view');renderer.setSize(view.clientWidth,view.clientHeight);camera.aspect=view.clientWidth/Math.max(1,view.clientHeight);camera.updateProjectionMatrix();});observer.observe(get('view'));
let last=performance.now();renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.1);last=now;if(!paused)mixer?.update(dt*Number(get<HTMLInputElement>('speed').value));model?.updateMatrixWorld(true);bounds?.box.setFromObject(model!);controls.update();renderer.render(scene,camera);});
const api={catalog,choose,load,sample:(index:number,time:number)=>{paused=true;selectClip(index,time);return inspect();},frame,angle:(angle:number)=>{const target=controls.target.clone(),distance=camera.position.distanceTo(target);camera.position.set(target.x+Math.sin(angle)*distance,target.y+distance*.25,target.z+Math.cos(angle)*distance);controls.update();},inspect};
function inspect(){const vertices:number[][]=[];model?.updateMatrixWorld(true);model?.traverse(o=>{if(o instanceof SkinnedMesh){o.skeleton.update();o.computeBoundingBox();const count=o.geometry.getAttribute('position').count;for(let i=0;i<8;i++)vertices.push(o.getVertexPosition(Math.floor(i*(count-1)/7),new Vector3()).applyMatrix4(o.matrixWorld).toArray());}});return {...statistics,loadedUrl,error:lastError,vertices,bounds:model?new Box3().setFromObject(model).getSize(new Vector3()).toArray():null,bones:model?(()=>{const result:Record<string,number[]>={};model!.traverse(o=>{if(o.type==='Bone')result[o.name]=o.getWorldPosition(new Vector3()).toArray();});return result;})():{},render:{...renderer.info.render},memory:{...renderer.info.memory}};}
(window as unknown as {__ASSET_LAB:typeof api}).__ASSET_LAB=api;
await choose(catalog[0]!.id);
if(import.meta.hot)import.meta.hot.dispose(()=>{++token;clear();renderer.setAnimationLoop(null);observer.disconnect();controls.dispose();disposeScene(scene);renderer.dispose();delete (window as unknown as {__ASSET_LAB?:unknown}).__ASSET_LAB;});
