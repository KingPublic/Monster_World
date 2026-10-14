import { Box3, Color, DirectionalLight, Fog, Group, HemisphereLight, PerspectiveCamera, PMREMGenerator, Scene, Vector3 } from 'three';
import type { WebGLRenderTarget } from 'three';
import { gameConfig } from '../config/gameConfig';
import { carryCapacity, mvpConfig } from '../config/mvpConfig';
import type { UpgradeKind } from '../config/mvpConfig';
import { createDragonVisual } from '../creatures/DragonVariants';
import { variantForNest,variantLabel } from '../config/dragonVariants';
import type { DragonVisual } from '../creatures/RideableDragon';
import { RuntimeAssets } from '../systems/RuntimeAssets';
import { SanctuaryAssets } from '../world/SanctuaryAssets';
import { Atmosphere } from '../world/Atmosphere';
import { AmbientResidents } from '../world/AmbientResidents';
import { AmbientWildlife } from '../world/AmbientWildlife';
import { SafeZoneShield } from '../world/SafeZoneShield';
import { HorseMount,horseHome } from '../creatures/HorseMount';
import { GroundRiding,horseFootprintBlocked } from '../gameplay/GroundRiding';
import { companionGardenSlots,displayedCompanions,canRecallCompanion } from '../gameplay/MountParking';
import { CompanionGarden } from '../world/CompanionGarden';
import { dialoguePage,mayTalk } from '../world/ResidentCatalog';
import { createEgg } from '../creatures/EggModel';
import { poseCarriedEggs } from '../creatures/CarriedEggs';
import { Progression } from '../gameplay/Progression';
import { Flight } from '../gameplay/Flight';
import { Guardian } from '../gameplay/Guardian';
import { Effects } from '../gameplay/Effects';
import { PlayerController } from '../gameplay/PlayerController';
import { FollowCamera } from '../systems/FollowCamera';
import { InputSystem } from '../systems/InputSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { UIManager } from '../ui/UIManager';
import {dragonAvailable,dragonStats,recoveryLabel} from '../gameplay/DragonCare';
import {WorldAudio} from '../systems/WorldAudio';
import {localAdminDebug} from '../systems/LocalAdminDebug';
import {OwnerAccess} from '../systems/OwnerAccess';
import {currentRenderProfile} from '../config/renderProfile';
import {DisplayMode} from '../systems/DisplayMode';
import { MainMenuScene } from '../ui/MainMenuScene';
import { disposeScene } from '../utils/scene';
import { World } from '../world/World';
import { groundHeight, isBlocked } from '../world/Traversal';
import { Renderer } from './Renderer';
import { GameLoop } from './GameLoop';

type Context = {key:string;kind:string;prompt:string;nestId?:string;slot?:number;dragonId?:string;residentId?:string};
type Owned = {model:DragonVisual;stage:string;eat:number};
export class Game {
 private readonly scene=new Scene();
 private readonly camera=new PerspectiveCamera(60,1,0.3,gameConfig.rendering.far);
 private readonly world=new World();
 private readonly saves=new SaveSystem();
 private readonly assets=new RuntimeAssets();
 private readonly atmosphere=new Atmosphere();
 private readonly residents=new AmbientResidents(this.assets,currentRenderProfile.maxResidents);
 private readonly wildlife=new AmbientWildlife();
 private readonly garden=new CompanionGarden();
 private readonly horse=new HorseMount(this.assets,message=>this.ui?.notify(message),groundHeight);
 private readonly horseRide=new GroundRiding(groundHeight,(x,z,heading)=>horseFootprintBlocked(x,z,heading,(a,b)=>isBlocked(a,b,{radius:0,minY:this.horse.root.position.y+.1,maxY:this.horse.root.position.y+4.8})||this.dragonBodyBlocked(a,b)||this.residents.bodyBlocked(a,b)));
 private readonly shield=new SafeZoneShield(mvpConfig.safeZoneRadius,mvpConfig.maxSafeAltitude);
 private environment:WebGLRenderTarget|undefined;
 private readonly sanctuaryAssets:SanctuaryAssets;
 private readonly progression:Progression;
 private readonly renderer:Renderer;
 private readonly input:InputSystem;
 private readonly follow:FollowCamera;
 private readonly player=new PlayerController(groundHeight,(x,z)=>isBlocked(x,z,{minY:this.player.position.y+.05,maxY:this.player.position.y+4.9})||this.dragonBodyBlocked(x,z,this.player.position)||this.horseBodyBlocked(x,z)||this.residents.bodyBlocked(x,z));
 private readonly flight=new Flight();
 private readonly effects=new Effects();
 private readonly audio=new WorldAudio();
 private hitGrace=0;
 private stepClock=0;private wingClock=0;private ambientClock=3;private npcClock=5;private wildlifeClock=4;private horseCallClock=18;
 private readonly dragonCallClocks=new Map<string,number>();
 private lastAirborne=false;
 private readonly ui:UIManager;
 private readonly loop:GameLoop;
 private menu:MainMenuScene|undefined;
 private readonly owned=new Map<string,Owned>();
 private readonly slotVisuals=new Map<string,{id:string;root:Group}>();
 private readonly carriedRoot=new Group();
 private readonly guardians=mvpConfig.nests.map(config=>new Guardian(config,this.assets));
 private readonly sun=new DirectionalLight(0xfff3e5,2.6);
 private readonly debugEnabled=import.meta.env.DEV && localAdminDebug(location.hostname,location.search);
 private readonly owner:OwnerAccess|undefined;
 private readonly display:DisplayMode;
 private started=false;
 private mountedId:string|null=null;
 private ridingHorse=false;
 private gardenDragonId:string|null=null;
 private gardenOrder:string[]=[];
 private talkingResidentId:string|null=null;
 private destinationNestId:string|undefined;
 private heldContext='';
 private hold=0;
 private timeScale=1;
 private flightTime=0;
 private usedBoost=false;
 private lastCarryCount=-1;
 private hatch:{time:number;egg:Group;origin:Vector3}|null=null;
 private disposed=false;
 constructor(private readonly host:HTMLElement) {
   const saved=this.saves.load();this.progression=new Progression(saved);if(this.progression.recoverDragons().length)this.save();
   this.scene.background=new Color(0xdce7f3);this.scene.fog=new Fog(0xdce7f3,1600,10000);
   this.scene.add(new HemisphereLight(0xe0eafa,0x77716a,.9),this.world.group,this.player.root,this.effects.root,this.atmosphere.root,this.residents.root,this.wildlife.root,this.horse.root,this.shield.root,this.garden.root);
   this.world.sanctuary.dragonStage.removeFromParent();disposeScene(this.world.sanctuary.dragonStage);
   this.sun.castShadow=true;this.sun.shadow.mapSize.set(currentRenderProfile.shadowSize,currentRenderProfile.shadowSize);
   Object.assign(this.sun.shadow.camera,{left:-95,right:95,top:95,bottom:-95,far:400});this.sun.shadow.normalBias=.2;this.sun.shadow.bias=-.00015;
   this.scene.add(this.sun,this.sun.target);
   this.renderer=new Renderer(host,this.camera);
   const reflection=new PMREMGenerator(this.renderer.webgl);this.environment=reflection.fromScene(this.atmosphere.reflectionScene(),.08,.5,15000);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.55;reflection.dispose();
   this.renderer.webgl.domElement.setAttribute('aria-label','Monster World gameplay; WASD move and drag to look');
   this.input=new InputSystem(this.renderer.webgl.domElement);this.follow=new FollowCamera(this.camera,this.input);
   this.player.teleport(new Vector3(0,groundHeight(0,48),48));this.player.root.add(this.carriedRoot);
   this.guardians.forEach(guardian=>this.scene.add(guardian.model.root));
   this.syncDragons();this.syncSlots();
   this.ui=new UIManager(host,{start:()=>{this.menu?.dispose();this.menu=undefined;this.started=true;this.audio.unlock();this.audio.listen(this.position,this.follow.yaw);this.input.clear();this.follow.reset(this.position);this.renderer.webgl.domElement.focus({preventScroll:true});this.ui.notify(this.saves.message);},action:(action,id)=>this.action(action,id),debug:this.debugEnabled?action=>this.debug(action):undefined},!!saved,this.debugEnabled);
   this.ui.setAudio(this.audio.snapshot());
   this.display=new DisplayMode(host,text=>this.ui.notify(text));
   if(!import.meta.env.DEV)this.owner=new OwnerAccess(host,action=>{if(!this.disposed&&this.owner?.active)this.adminAction(action);},text=>this.ui.notify(text),()=>{if(!this.owner?.active)this.timeScale=1;});
   this.menu=new MainMenuScene(host,this.renderer.webgl.domElement,value=>this.ui.setMenuMotion(value));
   this.sanctuaryAssets=new SanctuaryAssets(this.world.sanctuary,this.assets,this.world.collision);
   void this.assets.acquire(import.meta.env.BASE_URL+'assets/models/characters/player/cartoon-boy.glb').then(asset=>this.player.attachVisual(asset)).catch(error=>{if(this.disposed)return;this.player.failVisual();this.ui.notify('Player model could not load. Temporary visual active.');console.warn('[Monster World] Player model fallback',error);});
   this.loop=new GameLoop(dt=>this.update(dt));this.loop.start();host.dataset.bootState='ready';
   if(import.meta.env.DEV && this.debugEnabled) {
     const api={snapshot:()=>this.snapshot(),teleport:(destination:string)=>this.debug(destination),face:(x:number,z:number)=>{const p=this.position;this.follow.yaw=Math.atan2(x-p.x,-(z-p.z));},timeScale:(scale:number)=>{this.timeScale=Math.max(1,Math.min(300,scale));},reset:()=>this.debug('reset'),dispose:()=>this.dispose(),carry:()=>this.carriedRoot.children.map(egg=>({attachment:egg.userData.attachment,position:egg.getWorldPosition(new Vector3()).toArray()})),visuals:()=>this.visualEvidence()};
     (window as unknown as {__MW?:typeof api}).__MW=api;
   }
 }
 private get position():Vector3 {return this.ridingHorse?this.horse.root.position:this.mountedId?this.owned.get(this.mountedId)!.model.root.position:this.player.position;}
 private get mounted():boolean{return this.ridingHorse||!!this.mountedId;}
 private get availableDragons(){return this.progression.state.dragons.filter(dragonAvailable);}
 private get selected() {const records=this.progression.state.dragons,id=this.mountedId??this.gardenDragonId??this.progression.state.equippedDragonId??displayedCompanions(this.availableDragons,null,null,null)[0];return records.find(d=>d.id===id);}
 private dragonBodyBlocked(x:number,z:number,escapeFrom?:{x:number;z:number}):boolean {
   for(const owned of this.owned.values()){
     const root=owned.model.root,dx=x-root.position.x,dz=z-root.position.z,c=Math.cos(root.rotation.y),s=Math.sin(root.rotation.y),scale=owned.stage==='Baby'?.4:dragonStats(this.progression.state.dragons.find(d=>this.owned.get(d.id)===owned)).size;
     const localX=dx*c-dz*s,localZ=dx*s+dz*c;
     const metric=(a:number,b:number)=>((a*c-b*s)/(2.7*scale+.65))**2+((a*s+b*c+.8*scale)/(4*scale+.65))**2;
     const depth=(localX/(2.7*scale+.65))**2+((localZ+.8*scale)/(4*scale+.65))**2;
     if(depth<1){const previous=escapeFrom?metric(escapeFrom.x-root.position.x,escapeFrom.z-root.position.z):Infinity;if(previous<1&&depth>previous+1e-8)continue;return true;}
   }return false;
 }
 private save():void{this.saves.save(this.progression.state);}
 private horseBodyBlocked(x:number,z:number):boolean {
   const root=this.horse.root,dx=x-root.position.x,dz=z-root.position.z,c=Math.cos(root.rotation.y),s=Math.sin(root.rotation.y);
   return ((dx*c-dz*s)/1.75)**2+((dx*s+dz*c)/3.1)**2<1;
 }
 private syncDragons(arrange=false):void {
   const records=this.availableDragons,visible=displayedCompanions(records,this.progression.state.equippedDragonId,this.gardenDragonId,this.mountedId);
   const changed=visible.length!==this.gardenOrder?.length||visible.some((id,i)=>id!==this.gardenOrder?.[i]);
   arrange=(arrange||changed)&&canRecallCompanion(this.mounted,this.progression.carried.length);this.gardenOrder=visible;
   for(const [id,old]of this.owned)if(!visible.includes(id)){old.model.dispose();this.owned.delete(id);}
   for(const [index,id]of visible.entries()){
     const record=records.find(r=>r.id===id)!,bay=companionGardenSlots[index]!;
     const old=this.owned.get(record.id);
     if(old&&arrange&&id!==this.mountedId){old.model.root.position.set(bay.x,groundHeight(bay.x,bay.z),bay.z);old.model.root.rotation.set(0,0,0);}
     if(old?.stage===record.stage){old.model.setGrowth?.(dragonStats(record).size);continue;}
     if(old?.model.setForm){old.model.setForm(record.stage);old.model.setGrowth?.(dragonStats(record).size);old.stage=record.stage;continue;}
     const previous=old?.model.root.position.clone();
     if(old){old.model.root.removeFromParent();old.model.dispose();}
     const model:DragonVisual=createDragonVisual(this.assets,record.variant??'mountain',message=>this.ui?.notify(message),record.stage);
     model.setGrowth?.(dragonStats(record).size);
     const freeBay=arrange?bay:[bay,...companionGardenSlots].find(b=>[...this.owned.values()].every(o=>Math.hypot(o.model.root.position.x-b.x,o.model.root.position.z-b.z)>12))??bay;
     model.root.position.copy(previous??new Vector3(freeBay.x,groundHeight(freeBay.x,freeBay.z),freeBay.z));
     this.scene.add(model.root);this.owned.set(record.id,{model,stage:record.stage,eat:0});
   }
 }
 private slotPosition(nestId:string,index:number):Vector3 {
   const cfg=mvpConfig.nests.find(n=>n.id===nestId)!;
   const angle=index/cfg.slotCount*Math.PI*2+Math.PI/2;
   const x=cfg.position[0]+Math.cos(angle)*13,z=cfg.position[2]+Math.sin(angle)*13;
   return new Vector3(x,groundHeight(x,z),z);
 }
 private syncSlots():void {
   for(const nest of this.progression.nests)for(let i=0;i<nest.slots.length;i++){
     const key=nest.id+':'+i,slot=nest.slots[i]!,existing=this.slotVisuals.get(key);
     if(existing&&existing.id===slot.egg?.id){existing.root.visible=existing.root.position.distanceTo(this.position)<currentRenderProfile.eggDistance;continue;}
     if(existing){existing.root.removeFromParent();disposeScene(existing.root);this.slotVisuals.delete(key);}
     if(slot.egg){const root=createEgg(slot.egg.rarity,slot.egg.element,slot.egg.variant);root.position.copy(this.slotPosition(nest.id,i));root.visible=root.position.distanceTo(this.position)<currentRenderProfile.eggDistance;this.scene.add(root);this.slotVisuals.set(key,{id:slot.egg.id,root});}
   }
 }
 private syncCarry():void {
   if(this.lastCarryCount===this.progression.carried.length)return;
   this.lastCarryCount=this.progression.carried.length;disposeScene(this.carriedRoot);
   this.progression.carried.forEach((egg,index)=>{const model=createEgg(egg.rarity,egg.element,egg.variant);model.scale.setScalar(.45);model.position.set((index-1)*.75,.1,-.8);this.carriedRoot.add(model);});
 }
 private context():Context|null {
   if(this.mounted||this.hatch)return null;
   const position=this.position,candidates:{context:Context;distance:number}[]=[];
   for(const nest of this.progression.nests)for(let i=0;i<nest.slots.length;i++)if(nest.slots[i]!.egg){
     const distance=position.distanceTo(this.slotPosition(nest.id,i));
     if(distance<10)candidates.push({distance,context:{key:nest.id+':'+i,kind:'steal',prompt:this.progression.carried.length>=carryCapacity(this.progression.state.carryLevel)?'Carry capacity full — return home':'Hold E to Steal '+nest.slots[i]!.egg!.rarity+' '+variantLabel(nest.slots[i]!.egg!.variant)+' Egg',nestId:nest.id,slot:i}});
   }
   for(const record of this.progression.state.dragons){
     const model=this.owned.get(record.id);if(!model)continue;
     const distance=position.distanceTo(model.model.root.position);
     if(distance<11)candidates.push({distance,context:{key:record.id,kind:record.stage==='Baby'?'feed':'mount',dragonId:record.id,prompt:record.stage==='Baby'?'Feed Baby Dragon · '+this.progression.state.food+' Food':'Mount '+record.name+' · R to feed'}});
   }
   for(const [kind,point] of Object.entries(mvpConfig.services)){
     if(kind==='mount')continue;
     const distance=position.distanceTo(new Vector3(...point));
     if(distance<12)candidates.push({distance,context:{key:kind,kind:kind==='hatchery'?'hatch':kind,prompt:kind==='hatchery'?'Hatchery · '+this.progression.state.securedEggs.length+' secured Eggs':kind==='shop'?'Open Food Shop':kind==='collection'?'Open Dragon Collection':'Open Rider Upgrades'}});
   }
   const horseDistance=position.distanceTo(this.horse.root.position);if(horseDistance<10)candidates.push({distance:horseDistance,context:{key:'horse',kind:'horse',prompt:this.horse.status.state==='loading'?'Prepare Horse · E to saddle up':'Ride Sanctuary Horse · E'}});
   if(mayTalk(this.progression.carried.length,this.mounted)){const resident=this.residents.nearest(position);if(resident)candidates.push({distance:position.distanceTo(this.residents.root.getObjectByName(resident.id)!.position),context:{key:resident.id,kind:'talk',residentId:resident.id,prompt:'Talk to '+resident.name+' · '+resident.title}});}
   const unavailable=(c:Context)=>c.kind==='steal'&&this.progression.carried.length>=carryCapacity(this.progression.state.carryLevel)?1:0;
   candidates.sort((a,b)=>unavailable(a.context)-unavailable(b.context)||a.distance-b.distance);return candidates[0]?.context??null;
 }
 private interact(context:Context):void {
   const p=this.progression;
   if(context.kind==='steal'){
     const egg=p.steal(context.nestId!,context.slot!);
     if(egg){this.ui.notify('Egg stolen! Sprint home — the Guardian has awakened.');this.effects.burst(this.position.clone().add(new Vector3(0,3,0)),0xffba76);this.syncSlots();this.syncCarry();this.save();}
     return;
   }
   if(context.kind==='hatch'){
     if(!p.state.securedEggs.length){this.ui.notify('Bring a stolen Egg safely home first.');return;}
     const secured=p.state.securedEggs[0]!,origin=new Vector3(...mvpConfig.services.hatchery).add(new Vector3(0,2,0)),egg=createEgg(secured.rarity,secured.element,secured.variant);
     egg.position.copy(origin);this.scene.add(egg);this.hatch={time:0,egg,origin};
     this.ui.notify('A new companion is waking…');return;
   }
   if(context.kind==='feed'){
     if(this.mounted||p.carried.length){this.ui.notify('Return safely and dismount before feeding your Dragon.');return;}
     const wasBaby=p.state.dragons.find(d=>d.id===context.dragonId)?.stage==='Baby';
     if(p.feed(context.dragonId!)){
       this.owned.get(context.dragonId!)!.eat=2;this.effects.burst(this.position.clone().add(new Vector3(0,3,0)),0x98e8a1);
       this.syncDragons();const record=p.state.dragons.find(d=>d.id===context.dragonId)!;
       this.audio.play('meal',this.owned.get(record.id)!.model.root.position,record.id);
       if(record.stage==='Young'&&wasBaby){p.equip(record.id);this.gardenDragonId=record.id;this.syncDragons(true);this.ui.notify('Your Baby grew into a Young Dragon. Meet it at the central Mount Court berth to ride!');}
       else if(record.stage==='Young'){const stats=dragonStats(record);this.ui.notify('Happy meal · Lv '+stats.level+' · stronger, healthier and a little bigger!');}
       else this.ui.notify('A happy meal · '+record.growth+' / '+mvpConfig.youngThreshold+' Growth');
       this.save();
     }else this.ui.notify(p.state.food<1?'You need Food. Visit the Sanctuary Food Shop.':'Your Dragon is fully grown and healthy, or still recovering.');
     return;
   }
   if(context.kind==='mount'){this.mount(context.dragonId!);return;}
   if(context.kind==='horse'){void this.mountHorse();return;}
   if(context.kind==='talk'&&context.residentId&&mayTalk(p.carried.length,this.mounted)){const page=dialoguePage(context.residentId);if(page&&this.residents.beginTalk(context.residentId,this.position)){this.audio.play('npc',this.position,context.residentId);this.talkingResidentId=context.residentId;this.input.clear();this.ui.showDialogue(page);}return;}
   this.input.clear();this.ui.showPanel(context.kind,p.state);
 }
 private mount(id:string):void {
   if(!this.progression.equip(id))return;
   this.mountedId=id;this.gardenDragonId=id;const owned=this.owned.get(id)!;
   owned.model.mountAnchor.add(this.player.root);this.player.root.position.set(0,0,0);this.player.root.rotation.set(0,0,0);
   this.flight.reset();this.input.clear();
   this.audio.play('dragon',owned.model.root.position,id,owned.model.root.userData.family);
   if(!this.progression.state.tutorialComplete)this.progression.state.tutorialStep=Math.max(6,this.progression.state.tutorialStep);
   this.ui.notify('Mounted! Space to ascend · C to descend · WASD fly · hold Shift Boost.');this.save();
 }
 private async mountHorse():Promise<void>{
   if(this.mounted||this.hatch)return;this.input.clear();await this.horse.load();
   if(this.disposed||this.mounted||!this.started||this.ui.panelOpen||this.position.distanceTo(this.horse.root.position)>10)return;
   this.ridingHorse=true;this.horse.mountAnchor.add(this.player.root);this.player.root.position.set(0,0,0);this.player.root.rotation.set(0,0,0);this.horseRide.reset();this.input.clear();this.audio.play('horse',this.position,'sanctuary-horse');this.ui.notify('Horse saddled! WASD ride · hold Shift to sprint · Space jump · F dismount.');
 }
 private dismount():void {
   if(!this.mounted)return;
   const position=this.position.clone();
   if((this.ridingHorse?this.horseRide.airborne:this.flight.airborne) || position.y>groundHeight(position.x,position.z)+1){this.ui.notify(this.ridingHorse?'Let your Horse land before dismounting.':'Land with C (or Ctrl) before dismounting.');return;}
   const landing=[...[0,Math.PI,Math.PI/2,-Math.PI/2,.75,-.75,2.4,-2.4].map(angle=>({x:position.x+Math.cos(angle)*8,z:position.z+Math.sin(angle)*8}))].find(p=>!isBlocked(p.x,p.z)&&!this.dragonBodyBlocked(p.x,p.z)&&!this.horseBodyBlocked(p.x,p.z));
   if(!landing){this.ui.notify('Move to an open place to dismount.');return;}const {x,z}=landing,wasDragon=!!this.mountedId;
   this.scene.add(this.player.root);this.player.root.rotation.set(0,0,0);this.player.teleport(new Vector3(x,groundHeight(x,z),z));
   this.mountedId=null;this.ridingHorse=false;this.flight.reset();this.horseRide.reset();this.input.clear();
   if(wasDragon&&this.flightTime>=3 && this.usedBoost && !this.progression.state.tutorialComplete){this.progression.completeTutorial();this.ui.notify('Tutorial complete! Choose a Wild Nest with your destination compass. +75 Coins');}
   else this.ui.notify('Dismounted. Your '+(wasDragon?'Dragon':'Horse')+' is waiting here.');this.save();
 }
 private action(action:string,id?:string):void {
   const p=this.progression;
   if(action==='sound'){this.audio.setMuted(!this.audio.snapshot().muted);this.ui.setAudio(this.audio.snapshot());return;}
   if(action==='audio-volume'&&id){this.audio.setVolume(Number(id)/100);this.ui.setAudio(this.audio.snapshot());return;}
   if(action==='feed-nearby'){const c=this.context();if(!this.ui.panelOpen&&c?.dragonId)this.interact({...c,kind:'feed'});return;}
   if(action==='menu-motion'){if(this.menu)this.ui.setMenuMotion(this.menu.toggleMotion());return;}
   if(action==='menu-help'){this.input.clear();this.ui.showHelp();return;}
   if(action==='close'||action==='pause'){this.residents.endTalk();this.talkingResidentId=null;this.input.clear();return;}
   if(action==='topic'&&id&&this.talkingResidentId){const page=dialoguePage(this.talkingResidentId,id);if(page){this.audio.play('npc',this.position,this.talkingResidentId);this.ui.showDialogue(page);}return;}
   if(action==='destinations'){this.input.clear();this.ui.showPanel('destinations',p.state);return;}
   if(action==='navigate'&&id){const nest=mvpConfig.nests.find(n=>n.id===id);if(nest){this.destinationNestId=id;this.ui.closePanel();this.residents.endTalk();this.talkingResidentId=null;this.input.clear();this.ui.notify('Route marked: '+nest.name+'. Travel there to find '+variantLabel(variantForNest(id))+'.');}return;}
   if(action==='buy'){this.ui.notify(p.buyFood()?'Food purchased. Meet your Dragon to feed, grow or heal it.':'Not enough Coins. Deliver another Egg.');this.save();this.ui.showPanel('shop',p.state);}
   if((action==='equip'||action==='visit')&&id){if(!canRecallCompanion(this.mounted,p.carried.length)){this.ui.notify(this.mounted?'Dismount before calling a companion.':'Secure your stolen Eggs before calling a companion.');return;}const record=p.state.dragons.find(d=>d.id===id);if(record&&dragonAvailable(record)&&(action==='visit'||p.equip(id))){this.gardenDragonId=id;this.syncDragons(true);this.ui.notify(record.stage==='Baby'?'Your Baby is waiting at the garden berth. Meet it there to feed.':'Dragon selected. Meet it at the central Mount Court berth.');this.save();}this.ui.showPanel('collection',p.state);}
   if(action==='upgrade'&&id){this.ui.notify(p.upgrade(id as UpgradeKind)?'Rider upgrade unlocked!':'Not enough Coins or already at maximum.');this.save();this.ui.showPanel('rider',p.state);}
 }
 private update(dt:number):void {
   if(!this.started&&this.menu){this.menu.update(dt);return;}
   const active=this.started&&!this.ui.panelOpen;
   const position=this.position;
   const recovered=this.progression.recoverDragons();
   if(recovered.length){this.syncDragons();this.save();this.ui.notify('Your Dragon has recovered! A healthy companion awaits at the Sanctuary garden.');}
   if(active){
     this.hitGrace=Math.max(0,this.hitGrace-dt);
     if(this.mounted)this.player.stamina.rest(dt);
     if(!this.ridingHorse)this.horseRide.stamina.rest(dt);
     if(this.input.pressed('Escape')){this.input.clear();this.ui.showHelp();}
     if(this.ridingHorse){
       this.horseRide.update(dt,this.horse.root,this.input,this.follow.yaw);if(this.input.pressed('KeyF'))this.dismount();
     }else if(this.mountedId){
       const owned=this.owned.get(this.mountedId)!;this.flight.update(dt,owned.model.root,this.input,this.follow.yaw,this.progression.state,this.progression.state.dragons.find(d=>d.id===this.mountedId));
       if(this.flight.airborne)this.flightTime+=dt;if(this.flight.boosting)this.usedBoost=true;
       if(this.input.pressed('KeyF'))this.dismount();
     } else {
       this.player.update(dt,this.input,this.follow.yaw);
       if(this.progression.state.tutorialStep===0&&this.input.movement.x**2+this.input.movement.y**2>.1){this.progression.state.tutorialStep=1;this.save();}
     }
     this.progression.updateSlots(dt,(this.debugEnabled||this.owner?.active)?this.timeScale:1);this.syncSlots();
     if(this.progression.carried.length && Math.hypot(position.x,position.z)<mvpConfig.safeZoneRadius && position.y<mvpConfig.maxSafeAltitude){
       const count=this.progression.secure();this.effects.burst(position.clone().add(new Vector3(0,5,0)),0x9befe1,36);this.ui.notify(count+' Egg secured! The Guardian returns to its Nest. +'+count*mvpConfig.deliveryReward+' Coins');this.syncCarry();this.save();
       this.audio.play('secure',position);
     }
     for(const guardian of this.guardians){
       const carrying=this.progression.carried.some(egg=>egg.nestId===guardian.config.id);
       guardian.model.root.visible=carrying||guardian.state!=='IDLE'||guardian.model.root.position.distanceTo(this.position)<currentRenderProfile.guardianDistance;
       const previousState=guardian.state,contact=guardian.update(dt,this.position,carrying);
       if(previousState!==guardian.state&&guardian.state==='ROAR')this.audio.play('roar',guardian.model.root.position,guardian.config.id,guardian.model.root.userData.family);
       if(contact&&this.hitGrace===0){
         if(this.mountedId){
           const id=this.mountedId,record=this.progression.state.dragons.find(d=>d.id===id)!,owned=this.owned.get(id)!,where=owned.model.root.position.clone();
           const result=this.progression.hitDragon(id,mvpConfig.dragonCare.guardianDamage);this.hitGrace=mvpConfig.dragonCare.hitInterval;
           this.audio.play(result==='defeated'?'defeat':'hurt',where,id,owned.model.root.userData.family);this.effects.burst(where.clone().add(new Vector3(0,3,0)),0xf3ab79,18);
           if(result==='defeated'){
             this.scene.add(this.player.root);this.player.root.rotation.set(0,0,0);this.mountedId=null;this.flight.reset();
             const landing=[0,Math.PI/2,Math.PI,-Math.PI/2,.75,-.75].map(a=>({x:where.x+Math.cos(a)*9,z:where.z+Math.sin(a)*9})).find(p=>!isBlocked(p.x,p.z)&&!this.horseBodyBlocked(p.x,p.z)&&!this.residents.bodyBlocked(p.x,p.z));
             const x=landing?.x??where.x,z=landing?.z??where.z;this.player.teleport(new Vector3(x,groundHeight(x,z),z));this.follow.reset(this.player.position);this.hitGrace=mvpConfig.dragonCare.riderEscapeGrace;this.syncDragons();
             this.ui.notify('Your Dragon fell! Run — your Eggs are still with you. Dragon returns in '+recoveryLabel(record)+'.');
           }else this.ui.notify('Guardian hit your Dragon · '+record.health+' / '+dragonStats(record).maxHealth+' HP. Keep escaping!');
           this.save();break;
         }
         this.progression.loseCarried();this.syncCarry();
         if(this.mounted){this.scene.add(this.player.root);if(this.ridingHorse)this.horse.root.position.set(...horseHome);this.mountedId=null;this.ridingHorse=false;this.flight.reset();this.horseRide.reset();}
         this.player.teleport(new Vector3(0,groundHeight(0,48),48));this.input.clear();this.ui.notify('Caught! The stolen Eggs were lost. You are safe at home — try sprinting earlier.');this.save();break;
       }
     }
     const context=this.context(),pressedE=this.input.pressed('KeyE');
     if(this.input.pressed('KeyR')&&context?.dragonId)this.interact({...context,kind:'feed'});
     if(context?.kind==='steal'&&this.input.held('KeyE')){
       if(this.heldContext!==context.key){this.hold=0;this.heldContext=context.key;}
       this.hold+=dt/mvpConfig.theftHoldSeconds;
       if(this.hold>=1){this.interact(context);this.hold=0;}
     }else {this.hold=0;this.heldContext='';if(context&&context.kind!=='steal'&&pressedE)this.interact(context);}
     if(this.hatch){
       const hatch=this.hatch;hatch.time+=dt;hatch.egg.rotation.z=Math.sin(hatch.time*17)*.14;hatch.egg.scale.setScalar(1+Math.sin(hatch.time*9)*.06);
       if(hatch.time>=mvpConfig.hatchSeconds){
         this.progression.hatch();hatch.egg.removeFromParent();disposeScene(hatch.egg);this.effects.burst(hatch.origin,0xffe1a0,36);this.hatch=null;this.syncDragons();this.save();
         this.ui.notify('A Baby '+variantLabel(this.progression.state.dragons.at(-1)?.variant)+' hatched! Find it at the Mount Court to feed.');
       }
     }
   }
   this.syncCarry();this.effects.update(dt);
   for(const [id,owned] of this.owned){
     owned.eat=Math.max(0,owned.eat-dt);
     owned.model.root.visible=id===this.mountedId||owned.model.root.position.distanceTo(this.position)<currentRenderProfile.guardianDistance;
     if(!owned.model.root.visible)continue;
     if(id===this.mountedId)owned.model.update(dt,{state:this.flight.airborne?(this.flight.boosting?'boost':Math.hypot(this.flight.velocity.x,this.flight.velocity.z)<15?'glide':'flight'):this.flight.velocity.length()>1?'walk':'land',speed:this.flight.velocity.length()/85,bank:this.flight.bank,vertical:this.flight.vertical/35});
     else owned.model.update(active?dt:0,{state:owned.eat>0?'eat':'idle'});
   }
   this.horse.update(active?dt:0,this.position,{speed:this.ridingHorse?this.horseRide.speed:0,airborne:this.ridingHorse&&this.horseRide.airborne,vertical:this.horseRide.vertical});
   this.player.updateVisual(active?dt:0,this.progression.carried.length>0,this.mounted,this.hold>0||!!this.hatch,{bank:this.ridingHorse?this.horseRide.bank:this.flight.bank,boost:this.ridingHorse?this.horseRide.sprinting:this.flight.boosting,mountKind:this.ridingHorse?'horse':'dragon'});
   poseCarriedEggs(this.carriedRoot,this.ridingHorse?this.horse.carryAnchors:this.mountedId?this.owned.get(this.mountedId)!.model.carryAnchors??[]:[],this.mounted,this.ridingHorse?'horse':'dragon');
   this.follow.update(dt,this.position,this.mounted,this.flight.boosting,this.ridingHorse?this.horseRide.bank:this.flight.bank,this.ridingHorse);
   this.atmosphere.update(dt,this.camera.position);this.world.update(active?dt:0);this.residents.update(active?dt:0,this.position);this.wildlife.update(dt,this.position,active);this.shield.update(active?dt:0);
   this.sun.position.copy(this.position).add(new Vector3(-75,140,60));this.sun.target.position.copy(this.position);
   this.updateAudio(dt,active);
   this.drawHUD();this.renderer.webgl.render(this.scene,this.camera);
 }
 private drawHUD():void {
   const p=this.progression,s=p.state,step=s.tutorialStep;
   const objective=s.tutorialComplete?'Beyond the forest':['Welcome to the Sanctuary','Find your first Dragon Egg','Escape to the Sanctuary','Hatch your secured Egg','Your Dragon is hungry','Your Young Dragon is ready','Take to the skies'][Math.min(step,6)]!;
   const detail=s.tutorialComplete?'Choose a Wild Nest with your compass. Each lineage keeps its look through growth.':['WASD to move. Drag the mouse to look.','Follow the route. Approach an Egg and hold E to steal.','Hold Shift to sprint. The Guardian chases until you reach home.','Find the Hatchery on the upper terrace. Press E to hatch.','Free Starter Food is ready. At the Mount Court, press E twice to feed.','Approach your Young Dragon at the Mount Court and press E to mount.','Space ascend · WASD fly · hold Shift Boost · C land · F dismount.'][Math.min(step,6)]!;
   const nest=mvpConfig.nests.find(n=>n.id===this.destinationNestId)??mvpConfig.nests[s.tutorialComplete?1:0]!;
   const target=s.tutorialComplete||step<=1?new Vector3(...nest.position):step===2?new Vector3(0,0,0):step===3?new Vector3(...mvpConfig.services.hatchery):this.selected&&this.owned.has(this.selected.id)?this.owned.get(this.selected.id)!.model.root.position:new Vector3(...mvpConfig.services.mount);
   const destination=s.tutorialComplete||step<=1?nest.name:step===2?'Sanctuary Safe Zone':step===3?'Hatchery':'Mount Court';
   const diff=target.clone().sub(this.position);
   const threat=this.guardians.filter(g=>['ALERT','ROAR','CHASE'].includes(g.state));
   const danger=threat.length?Math.min(...threat.map(g=>g.model.root.position.distanceTo(this.position))):-1;
   const context=this.context(),record=this.selected;
   const stats=dragonStats(record,s.upgrades);
   const sprint=this.ridingHorse?this.horseRide.stamina:this.player.stamina;
   this.ui.updateCompanions(s);
   this.ui.update({objective,detail,prompt:this.hatch?'Hatching…':this.mounted?'':context?.prompt??'',canFeed:!!context?.dragonId&&!p.carried.length,hold:this.hold,coins:s.coins,food:s.food,carried:p.carried.length,capacity:carryCapacity(s.carryLevel),stamina:this.mountedId?this.flight.stamina/stats.stamina:sprint.ratio,sprintExhausted:!this.mountedId&&sprint.exhausted,mounted:this.mounted,mountKind:this.ridingHorse?'horse':this.mountedId?'dragon':'foot',airborne:this.ridingHorse?this.horseRide.airborne:this.flight.airborne,boosting:this.ridingHorse?this.horseRide.sprinting:this.mountedId?this.flight.boosting:this.player.sprinting,dragon:record?variantLabel(record.variant)+' · '+record.rarity+' · Lv '+stats.level:'Your first companion awaits',health:record?(record.health??stats.maxHealth)/stats.maxHealth:undefined,healthLabel:record?dragonAvailable(record)?'HP '+Math.round(record.health??stats.maxHealth)+' / '+stats.maxHealth:'RECOVERING · '+recoveryLabel(record):'',growth:record?record.stage==='Baby'?record.growth/mvpConfig.youngThreshold:(stats.meals%mvpConfig.dragonCare.mealsPerLevel)/mvpConfig.dragonCare.mealsPerLevel:0,growthLabel:record?.stage==='Baby'?'BABY GROWTH':stats.meals>=mvpConfig.dragonCare.maxMeals?'FULLY GROWN':'CARE · NEXT LEVEL',destination,distance:Math.hypot(diff.x,diff.z),bearing:Math.atan2(diff.x,-diff.z)-this.follow.yaw-Math.PI/2,danger,saveMessage:this.saves.message,guardians:this.guardians.map(g=>g.config.id+': '+g.state).join(' · ')});
 }
 private updateAudio(dt:number,active:boolean):void{
   this.audio.setActive(active||!!this.talkingResidentId);this.audio.listen(this.position,this.follow.yaw,!!this.mountedId&&this.flight.airborne,!active);if(!active)return;
   const speed=this.ridingHorse?this.horseRide.speed:this.mountedId?0:this.player.speed;
   this.stepClock-=dt;if(speed>1&&!this.flight.airborne&&!this.horseRide.airborne&&this.stepClock<=0){this.audio.play(this.ridingHorse?'hoof':'step',this.position,this.ridingHorse?'sanctuary-horse':'player');this.stepClock=this.ridingHorse?Math.max(.2,.5-speed*.005):Math.max(.2,.47-speed*.004);}
   const airborne=!!this.mountedId&&this.flight.airborne;
   if(airborne&&!this.lastAirborne&&this.mountedId)this.audio.play('dragon',this.position,this.mountedId,this.owned.get(this.mountedId)!.model.root.userData.family);
   this.lastAirborne=airborne;this.wingClock-=dt;
   if(airborne&&this.wingClock<=0){this.audio.play('wings',this.position,this.mountedId??'');this.wingClock=this.flight.boosting?.55:1.05;}
   for(const[id,owned]of this.owned){const next=(this.dragonCallClocks.get(id)??(4+id.length%7))-dt;this.dragonCallClocks.set(id,next);if(next<=0){this.audio.play(owned.stage==='Baby'?'baby':'dragon',owned.model.root.position,id,owned.model.root.userData.family);this.dragonCallClocks.set(id,12+Math.random()*7);}}
   for(const id of this.dragonCallClocks.keys())if(!this.owned.has(id))this.dragonCallClocks.delete(id);
   this.ambientClock-=dt;if(this.ambientClock<=0){this.audio.play('bird',this.position.clone().add(new Vector3(25,12,-14)),'forest-bird');this.ambientClock=8+Math.random()*7;}
   this.npcClock-=dt;if(this.npcClock<=0){const npc=this.residents.snapshot().filter(a=>a.loaded&&!a.talking).sort((a,b)=>new Vector3(...a.position as [number,number,number]).distanceTo(this.position)-new Vector3(...b.position as [number,number,number]).distanceTo(this.position))[0];if(npc)this.audio.play('npc',new Vector3(...npc.position as [number,number,number]),npc.id);this.npcClock=7+Math.random()*5;}
   this.wildlifeClock-=dt;if(this.wildlifeClock<=0){const a=this.wildlife.snapshot().actors[0];if(a)this.audio.play(a.kind,new Vector3(...a.position as [number,number,number]),a.id);this.wildlifeClock=9+Math.random()*6;}
   this.horseCallClock-=dt;if(this.horseCallClock<=0){this.audio.play('horse',this.horse.root.position,'sanctuary-horse');this.horseCallClock=20+Math.random()*10;}
 }
 private debug(action:string):void {
   if(!this.debugEnabled)return;
   this.adminAction(action);
 }
 private adminAction(action:string):void {
   if(action==='reset'){this.saves.reset();location.reload();return;}
   if(action==='coins'){this.progression.state.coins+=500;this.save();return;}
   if(action==='food'){this.progression.state.food+=5;this.save();return;}
   if(action==='time'){this.timeScale=this.timeScale===1?60:1;this.ui.notify('Development respawn ×'+this.timeScale);return;}
   if(action==='legendary-egg'||action==='mythical-egg'){
     const p=this.progression;if(p.state.securedEggs.length>=mvpConfig.limits.securedEggs){this.ui.notify('Secured Egg storage is full.');return;}
     const mythical=action==='mythical-egg',nestId=mythical?'stormspire':'sunreach';
     p.state.securedEggs.push({id:'admin-egg-'+crypto.randomUUID(),rarity:mythical?'Mythical':'Legendary',element:'Nature',nestId,variant:variantForNest(nestId)});
     this.save();this.ui.notify('Admin: secured '+(mythical?'Mythical Stormserpent':'Legendary Suncrest')+' Egg added. Visit the Hatchery.');return;
   }
   if(this.progression.carried.length){this.ui.notify('No teleport while carrying stolen Eggs. Escape physically.');return;}
   if(this.mounted){this.ui.notify('Land and dismount before using development travel.');return;}
   const nest=mvpConfig.nests.find(n=>n.id===action),resident=action.startsWith('resident:')?this.residents.root.getObjectByName(action.slice(9)):undefined;
   const pos=resident?resident.position.clone().add(new Vector3(-5,0,-2)):nest?this.slotPosition(nest.id,0).add(new Vector3(0,0,7)):action==='horse'?this.horse.root.position.clone().add(new Vector3(5,0,2)):action==='home'?new Vector3(0,groundHeight(0,48),48):new Vector3(...(mvpConfig.services[action as keyof typeof mvpConfig.services]??mvpConfig.services.mount));
   if(action==='mount'){const chosen=this.selected&&this.owned.get(this.selected.id);if(chosen)pos.copy(chosen.model.root.position);pos.x+=7;pos.z+=2;this.follow.yaw=Math.atan2(-7,2);}
   pos.y=groundHeight(pos.x,pos.z);this.player.teleport(pos);this.follow.reset(pos);this.input.clear();this.ui.closePanel();
 }
 private snapshot() {
   return {
    ready:!this.disposed,started:this.started,position:this.position.toArray(),floor:groundHeight(this.position.x,this.position.z),mountedId:this.mountedId,mountKind:this.ridingHorse?'horse':this.mountedId?'dragon':'foot',ridingHorse:this.ridingHorse,horse:{...this.horse.status,position:this.horse.root.position.toArray(),speed:this.horseRide.speed,airborne:this.horseRide.airborne},airborne:this.ridingHorse?this.horseRide.airborne:this.flight.airborne,boosting:this.ridingHorse?this.horseRide.sprinting:this.flight.boosting,stamina:this.flight.stamina,flightTime:this.flightTime,usedBoost:this.usedBoost,destinationNestId:this.destinationNestId,
    state:structuredClone(this.progression.state),carried:structuredClone(this.progression.carried),nests:structuredClone(this.progression.nests),
    guardians:this.guardians.map(g=>({id:g.config.id,state:g.state,position:g.model.root.position.toArray(),assetStatus:g.model.root.userData.assetStatus,asset:g.model.root.userData.runtimeAsset,form:g.model.root.userData.form,family:g.model.root.userData.family})),
    context:this.context(),timeScale:this.timeScale,menu:this.menu?.snapshot(),wildlife:this.wildlife.snapshot(),audio:this.audio.snapshot(),hitGrace:this.hitGrace,dragonCare:this.progression.state.dragons.map(d=>({id:d.id,available:dragonAvailable(d),...dragonStats(d,this.progression.state.upgrades)})),
    sprint:{player:{ratio:this.player.stamina.ratio,exhausted:this.player.stamina.exhausted,active:this.player.sprinting,speed:this.player.speed},horse:{ratio:this.horseRide.stamina.ratio,exhausted:this.horseRide.stamina.exhausted,active:this.horseRide.sprinting}},
    garden:{visible:[...this.owned.keys()],total:this.progression.state.dragons.length,focusedId:this.gardenDragonId},talkingResidentId:this.talkingResidentId,
    assets:{player:{...this.player.visualState},sanctuary:{...this.sanctuaryAssets.status},residents:{...this.residents.status,motion:this.residents.snapshot()},horse:{...this.horse.status},shield:{...this.shield.root.userData.boundary},dragons:[...this.owned].map(([id,owned])=>({id,status:owned.model.root.userData.assetStatus,asset:owned.model.root.userData.runtimeAsset,form:owned.model.root.userData.form,family:owned.model.root.userData.family,variant:owned.model.root.userData.variant,motion:owned.model.root.userData.motion,mount:owned.model.mountAnchor.getWorldPosition(new Vector3()).toArray()})),cache:this.assets.stats()},
    render:{...this.renderer.webgl.info.render},memory:{...this.renderer.webgl.info.memory},
   };
 }
 private visualEvidence(){
   const bounds=(root:Group)=>{root.updateMatrixWorld(true);const box=new Box3().setFromObject(root,true);return {min:box.min.toArray(),max:box.max.toArray(),size:box.getSize(new Vector3()).toArray()};};
   return {player:bounds(this.player.root),horse:bounds(this.horse.root),camera:this.camera.position.toArray(),target:this.position.toArray(),cameraDistance:this.camera.position.distanceTo(this.position),owned:[...this.owned].map(([id,o])=>({id,form:o.stage,position:o.model.root.position.toArray(),bounds:bounds(o.model.root)})),guardians:this.guardians.map(g=>({id:g.config.id,position:g.model.root.position.toArray(),bounds:bounds(g.model.root)})),city:this.world.sanctuary.buildings.map(b=>({id:b.id,name:b.name,bounds:bounds(b.group)}))};
 }
 dispose():void {
   if(this.disposed)return;this.disposed=true;this.owner?.dispose();this.display.dispose();this.loop.dispose();this.menu?.dispose();this.menu=undefined;this.audio.dispose();this.input.dispose();this.ui.dispose();this.effects.dispose();this.player.dispose();this.world.disposeCollision();this.garden.dispose();
   this.sanctuaryAssets.dispose();this.residents.dispose();this.wildlife.dispose();this.horse.dispose();this.shield.dispose();this.atmosphere.dispose();this.environment?.dispose();this.scene.environment=null;this.sun.dispose();this.owned.forEach(o=>o.model.dispose());this.guardians.forEach(g=>g.model.dispose());this.assets.dispose();disposeScene(this.scene);this.renderer.dispose();
   delete this.host.dataset.bootState;
   if(import.meta.env.DEV)delete (window as unknown as {__MW?:unknown}).__MW;
 }
}
