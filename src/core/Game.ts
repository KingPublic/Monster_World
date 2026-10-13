import { Box3, Color, DirectionalLight, Fog, Group, HemisphereLight, PerspectiveCamera, PMREMGenerator, Scene, Vector3, RingGeometry, Mesh, MeshBasicMaterial, DoubleSide } from 'three';
import type { WebGLRenderTarget } from 'three';
import { gameConfig } from '../config/gameConfig';
import { carryCapacity, mvpConfig, upgradeMultiplier } from '../config/mvpConfig';
import type { UpgradeKind } from '../config/mvpConfig';
import { RideableDragon } from '../creatures/RideableDragon';
import { mountainFamilyURL } from '../creatures/dragonAssets';
import type { DragonVisual } from '../creatures/RideableDragon';
import { RuntimeAssets } from '../systems/RuntimeAssets';
import { SanctuaryAssets } from '../world/SanctuaryAssets';
import { Atmosphere } from '../world/Atmosphere';
import { AmbientResidents } from '../world/AmbientResidents';
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
import { Parts, disposeScene } from '../utils/scene';
import { World } from '../world/World';
import { groundHeight, isBlocked } from '../world/Traversal';
import { Renderer } from './Renderer';
import { GameLoop } from './GameLoop';

type Context = {key:string;kind:string;prompt:string;nestId?:string;slot?:number;dragonId?:string};
type Owned = {model:DragonVisual;stage:string;eat:number};
export class Game {
 private readonly scene=new Scene();
 private readonly camera=new PerspectiveCamera(60,1,0.3,gameConfig.rendering.far);
 private readonly world=new World();
 private readonly saves=new SaveSystem();
 private readonly assets=new RuntimeAssets();
 private readonly atmosphere=new Atmosphere();
 private readonly residents=new AmbientResidents(this.assets);
 private environment:WebGLRenderTarget|undefined;
 private readonly sanctuaryAssets:SanctuaryAssets;
 private readonly progression:Progression;
 private readonly renderer:Renderer;
 private readonly input:InputSystem;
 private readonly follow:FollowCamera;
 private readonly player=new PlayerController(groundHeight,(x,z)=>isBlocked(x,z)||this.dragonBodyBlocked(x,z));
 private readonly flight=new Flight();
 private readonly effects=new Effects();
 private readonly ui:UIManager;
 private readonly loop:GameLoop;
 private readonly owned=new Map<string,Owned>();
 private readonly slotVisuals=new Map<string,{id:string;root:Group}>();
 private readonly carriedRoot=new Group();
 private readonly guardians=mvpConfig.nests.map(config=>new Guardian(config,this.assets));
 private readonly sun=new DirectionalLight(0xffeed5,2.8);
 private readonly debugEnabled=import.meta.env.DEV && new URLSearchParams(location.search).get('debug')==='1';
 private started=false;
 private mountedId:string|null=null;
 private heldContext='';
 private hold=0;
 private timeScale=1;
 private flightTime=0;
 private usedBoost=false;
 private lastCarryCount=-1;
 private hatch:{time:number;egg:Group;origin:Vector3}|null=null;
 private disposed=false;
 constructor(private readonly host:HTMLElement) {
   const saved=this.saves.load();this.progression=new Progression(saved);
   this.scene.background=new Color(0xd6dfd8);this.scene.fog=new Fog(0xd6dfd8,1300,10000);
   this.scene.add(new HemisphereLight(0xc9dcea,0x58634a,.85),this.world.group,this.player.root,this.effects.root,this.atmosphere.root,this.residents.root);
   this.world.sanctuary.dragonStage.removeFromParent();disposeScene(this.world.sanctuary.dragonStage);
   this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);
   Object.assign(this.sun.shadow.camera,{left:-95,right:95,top:95,bottom:-95,far:400});this.sun.shadow.normalBias=.2;this.sun.shadow.bias=-.00015;
   this.scene.add(this.sun,this.sun.target);
   this.renderer=new Renderer(host,this.camera);
   const reflection=new PMREMGenerator(this.renderer.webgl);this.environment=reflection.fromScene(this.atmosphere.reflectionScene(),.08,.5,15000);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.55;reflection.dispose();
   this.renderer.webgl.domElement.setAttribute('aria-label','Monster World gameplay; WASD move and drag to look');
   this.input=new InputSystem(this.renderer.webgl.domElement);this.follow=new FollowCamera(this.camera,this.input);
   this.player.teleport(new Vector3(0,groundHeight(0,48),48));this.player.root.add(this.carriedRoot);
   this.guardians.forEach(guardian=>this.scene.add(guardian.model.root));
   this.createSafeZone();this.syncDragons();this.syncSlots();
   this.ui=new UIManager(host,{start:()=>{this.started=true;this.input.clear();this.ui.notify(this.saves.message);},action:(action,id)=>this.action(action,id),debug:this.debugEnabled?action=>this.debug(action):undefined},!!saved,this.debugEnabled);
   this.sanctuaryAssets=new SanctuaryAssets(this.world.sanctuary,this.assets);
   void this.assets.acquire(import.meta.env.BASE_URL+'assets/models/characters/player/cartoon-boy.glb').then(asset=>this.player.attachVisual(asset)).catch(error=>{if(this.disposed)return;this.player.failVisual();this.ui.notify('Player model could not load. Temporary visual active.');console.warn('[Monster World] Player model fallback',error);});
   this.loop=new GameLoop(dt=>this.update(dt));this.loop.start();host.dataset.bootState='ready';
   if(import.meta.env.DEV && this.debugEnabled) {
     const api={snapshot:()=>this.snapshot(),teleport:(destination:string)=>this.debug(destination),face:(x:number,z:number)=>{const p=this.position;this.follow.yaw=Math.atan2(x-p.x,-(z-p.z));},timeScale:(scale:number)=>{this.timeScale=Math.max(1,Math.min(300,scale));},reset:()=>this.debug('reset'),dispose:()=>this.dispose(),carry:()=>this.carriedRoot.children.map(egg=>({attachment:egg.userData.attachment,position:egg.getWorldPosition(new Vector3()).toArray()})),visuals:()=>this.visualEvidence()};
     (window as unknown as {__MW?:typeof api}).__MW=api;
   }
 }
 private get position():Vector3 {return this.mountedId?this.owned.get(this.mountedId)!.model.root.position:this.player.position;}
 private get selected() {return this.progression.state.dragons.find(d=>d.id===this.progression.state.equippedDragonId)??this.progression.state.dragons.find(d=>d.stage==='Baby')??this.progression.state.dragons[0];}
 private dragonBodyBlocked(x:number,z:number):boolean {
   for(const owned of this.owned.values()){
     const root=owned.model.root,dx=x-root.position.x,dz=z-root.position.z,c=Math.cos(root.rotation.y),s=Math.sin(root.rotation.y),scale=owned.stage==='Baby'?.4:1;
     const localX=dx*c-dz*s,localZ=dx*s+dz*c;
     if((localX/(2.7*scale+.65))**2+((localZ+.8*scale)/(4*scale+.65))**2<1)return true;
   }return false;
 }
 private save():void{this.saves.save(this.progression.state);}
 private createSafeZone():void {
   const root=new Group();root.name='SanctuarySafeZone';
   const ring=new Mesh(new RingGeometry(144,146,96),new MeshBasicMaterial({color:0x91e4d1,side:DoubleSide,transparent:true,opacity:.7,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=1.5;root.add(ring);
   const p=new Parts();for(let i=0;i<20;i++){const angle=i*Math.PI/10;p.add(root,'cone',0xb2efd8,[Math.cos(angle)*145,3,Math.sin(angle)*145],[1.4,6,1.4]);}
   root.traverse(node=>{node.castShadow=false;});this.scene.add(root);
 }
 private syncDragons():void {
   for(const record of this.progression.state.dragons){
     const old=this.owned.get(record.id);
     if(old?.stage===record.stage)continue;
     if(old?.model.setForm){old.model.setForm(record.stage);old.stage=record.stage;continue;}
     const previous=old?.model.root.position.clone();
     if(old){old.model.root.removeFromParent();old.model.dispose();}
     const model:DragonVisual=new RideableDragon(this.assets,mountainFamilyURL,message=>this.ui?.notify(message),record.stage);
     const index=this.progression.state.dragons.findIndex(d=>d.id===record.id);
     const x=mvpConfig.services.mount[0]+(index%3)*13,z=mvpConfig.services.mount[2]-Math.floor(index/3)*14;
     model.root.position.copy(previous??new Vector3(x,groundHeight(x,z),z));
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
     if(existing?.id===slot.egg?.id)continue;
     if(existing){existing.root.removeFromParent();disposeScene(existing.root);this.slotVisuals.delete(key);}
     if(slot.egg){const root=createEgg(slot.egg.rarity,slot.egg.element);root.position.copy(this.slotPosition(nest.id,i));this.scene.add(root);this.slotVisuals.set(key,{id:slot.egg.id,root});}
   }
 }
 private syncCarry():void {
   if(this.lastCarryCount===this.progression.carried.length)return;
   this.lastCarryCount=this.progression.carried.length;disposeScene(this.carriedRoot);
   this.progression.carried.forEach((egg,index)=>{const model=createEgg(egg.rarity,egg.element);model.scale.setScalar(.45);model.position.set((index-1)*.75,.1,-.8);this.carriedRoot.add(model);});
 }
 private context():Context|null {
   if(this.mountedId||this.hatch)return null;
   const position=this.position,candidates:{context:Context;distance:number}[]=[];
   for(const nest of this.progression.nests)for(let i=0;i<nest.slots.length;i++)if(nest.slots[i]!.egg){
     const distance=position.distanceTo(this.slotPosition(nest.id,i));
     if(distance<10)candidates.push({distance,context:{key:nest.id+':'+i,kind:'steal',prompt:this.progression.carried.length>=carryCapacity(this.progression.state.carryLevel)?'Carry capacity full — return home':'Hold E to Steal '+nest.slots[i]!.egg!.rarity+' Nature Egg',nestId:nest.id,slot:i}});
   }
   for(const record of this.progression.state.dragons){
     const model=this.owned.get(record.id)!;
     const distance=position.distanceTo(model.model.root.position);
     if(distance<11)candidates.push({distance,context:{key:record.id,kind:record.stage==='Baby'?'feed':'mount',dragonId:record.id,prompt:record.stage==='Baby'?'Feed Baby Dragon · '+this.progression.state.food+' Food':'Mount '+record.name}});
   }
   for(const [kind,point] of Object.entries(mvpConfig.services)){
     if(kind==='mount')continue;
     const distance=position.distanceTo(new Vector3(...point));
     if(distance<12)candidates.push({distance,context:{key:kind,kind:kind==='hatchery'?'hatch':kind,prompt:kind==='hatchery'?'Hatchery · '+this.progression.state.securedEggs.length+' secured Eggs':kind==='shop'?'Open Food Shop':kind==='collection'?'Open Dragon Collection':'Open Rider Upgrades'}});
   }
   candidates.sort((a,b)=>a.distance-b.distance);return candidates[0]?.context??null;
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
     const origin=new Vector3(...mvpConfig.services.hatchery).add(new Vector3(0,2,0)),egg=createEgg(p.state.securedEggs[0]!.rarity);
     egg.position.copy(origin);this.scene.add(egg);this.hatch={time:0,egg,origin};
     this.ui.notify('A new companion is waking…');return;
   }
   if(context.kind==='feed'){
     if(p.feed(context.dragonId!)){
       this.owned.get(context.dragonId!)!.eat=2;this.effects.burst(this.position.clone().add(new Vector3(0,3,0)),0x98e8a1);
       this.syncDragons();const record=p.state.dragons.find(d=>d.id===context.dragonId)!;
       if(record.stage==='Young'){p.equip(record.id);this.ui.notify('Your Baby grew into a Young Dragon. It is ready to ride!');}
       else this.ui.notify('A happy meal · '+record.growth+' / '+mvpConfig.youngThreshold+' Growth');
       this.save();
     }else this.ui.notify('You need Food. Visit the Sanctuary Food Shop.');
     return;
   }
   if(context.kind==='mount'){this.mount(context.dragonId!);return;}
   this.input.clear();this.ui.showPanel(context.kind,p.state);
 }
 private mount(id:string):void {
   if(!this.progression.equip(id))return;
   this.mountedId=id;const owned=this.owned.get(id)!;
   owned.model.mountAnchor.add(this.player.root);this.player.root.position.set(0,0,0);this.player.root.rotation.set(0,0,0);
   this.flight.reset();this.input.clear();
   if(!this.progression.state.tutorialComplete)this.progression.state.tutorialStep=Math.max(6,this.progression.state.tutorialStep);
   this.ui.notify('Mounted! Space to ascend · WASD to fly · hold Shift to Boost.');this.save();
 }
 private dismount():void {
   if(!this.mountedId)return;
   const position=this.position.clone();
   if(this.flight.airborne || position.y>groundHeight(position.x,position.z)+1){this.ui.notify('Land with Left Ctrl before dismounting.');return;}
   let x=position.x+8,z=position.z+3;
   if(isBlocked(x,z)){x=position.x-8;z=position.z+3;}
   this.scene.add(this.player.root);this.player.root.rotation.set(0,0,0);this.player.teleport(new Vector3(x,groundHeight(x,z),z));
   this.mountedId=null;this.flight.reset();this.input.clear();
   if(this.flightTime>=3 && this.usedBoost && !this.progression.state.tutorialComplete){this.progression.completeTutorial();this.ui.notify('Tutorial complete! Your journey continues beyond the Highlands. +75 Coins');}
   else this.ui.notify('Dismounted. Your Dragon is waiting here.');this.save();
 }
 private action(action:string,id?:string):void {
   const p=this.progression;
   if(action==='close'||action==='pause'){this.input.clear();return;}
   if(action==='buy'){this.ui.notify(p.buyFood()?'Food purchased. Return to your Baby to feed it.':'Not enough Coins. Deliver another Egg.');this.save();this.ui.showPanel('shop',p.state);}
   if(action==='equip'&&id){if(p.equip(id)){const model=this.owned.get(id)!;model.model.root.position.set(...mvpConfig.services.mount);model.model.root.position.y=groundHeight(model.model.root.position.x,model.model.root.position.z);this.ui.notify('Dragon selected. Meet it at the Mount Court.');this.save();}else this.ui.notify('Feed this Baby until it grows into a rideable Young Dragon.');this.ui.showPanel('collection',p.state);}
   if(action==='upgrade'&&id){this.ui.notify(p.upgrade(id as UpgradeKind)?'Rider upgrade unlocked!':'Not enough Coins or already at maximum.');this.save();this.ui.showPanel('rider',p.state);}
 }
 private update(dt:number):void {
   const active=this.started&&!this.ui.panelOpen;
   const position=this.position;
   if(active){
     if(this.input.pressed('Escape')){this.input.clear();this.ui.showHelp();}
     if(this.mountedId){
       const owned=this.owned.get(this.mountedId)!;this.flight.update(dt,owned.model.root,this.input,this.follow.yaw,this.progression.state);
       if(this.flight.airborne)this.flightTime+=dt;if(this.flight.boosting)this.usedBoost=true;
       if(this.input.pressed('KeyF'))this.dismount();
     } else {
       this.player.update(dt,this.input,this.follow.yaw);
       if(this.progression.state.tutorialStep===0&&this.input.movement.x**2+this.input.movement.y**2>.1){this.progression.state.tutorialStep=1;this.save();}
     }
     this.progression.updateSlots(dt,this.debugEnabled?this.timeScale:1);this.syncSlots();
     if(this.progression.carried.length && Math.hypot(position.x,position.z)<mvpConfig.safeZoneRadius && position.y<mvpConfig.maxSafeAltitude){
       const count=this.progression.secure();this.effects.burst(position.clone().add(new Vector3(0,5,0)),0x9befe1,36);this.ui.notify(count+' Egg secured! The Guardian returns to its Nest. +'+count*mvpConfig.deliveryReward+' Coins');this.syncCarry();this.save();
     }
     for(const guardian of this.guardians){
       const carrying=this.progression.carried.some(egg=>egg.nestId===guardian.config.id);
       if(guardian.update(dt,position,carrying)){
         this.progression.loseCarried();this.syncCarry();
         if(this.mountedId){this.scene.add(this.player.root);this.mountedId=null;this.flight.reset();}
         this.player.teleport(new Vector3(0,groundHeight(0,48),48));this.input.clear();this.ui.notify('Caught! The stolen Eggs were lost. You are safe at home — try sprinting earlier.');this.save();break;
       }
     }
     const context=this.context(),pressedE=this.input.pressed('KeyE');
     if(context?.kind==='steal'&&this.input.held('KeyE')){
       if(this.heldContext!==context.key){this.hold=0;this.heldContext=context.key;}
       this.hold+=dt/mvpConfig.theftHoldSeconds;
       if(this.hold>=1){this.interact(context);this.hold=0;}
     }else {this.hold=0;this.heldContext='';if(context&&context.kind!=='steal'&&pressedE)this.interact(context);}
     if(this.hatch){
       const hatch=this.hatch;hatch.time+=dt;hatch.egg.rotation.z=Math.sin(hatch.time*17)*.14;hatch.egg.scale.setScalar(1+Math.sin(hatch.time*9)*.06);
       if(hatch.time>=mvpConfig.hatchSeconds){
         this.progression.hatch();hatch.egg.removeFromParent();disposeScene(hatch.egg);this.effects.burst(hatch.origin,0xffe1a0,36);this.hatch=null;this.syncDragons();this.save();
         this.ui.notify('A Baby Nature Dragon hatched! Your Dragon is hungry. Free Starter Food is ready — find it at the Mount Court.');
       }
     }
   }
   this.syncCarry();this.player.updateVisual(active?dt:0,this.progression.carried.length>0,!!this.mountedId,this.hold>0||!!this.hatch,{bank:this.flight.bank,boost:this.flight.boosting});this.effects.update(dt);
   for(const [id,owned] of this.owned){
     owned.eat=Math.max(0,owned.eat-dt);
     if(id===this.mountedId)owned.model.update(dt,{state:this.flight.airborne?(this.flight.boosting?'boost':Math.hypot(this.flight.velocity.x,this.flight.velocity.z)<15?'glide':'flight'):this.flight.velocity.length()>1?'walk':'land',speed:this.flight.velocity.length()/85,bank:this.flight.bank,vertical:this.flight.vertical/35});
     else owned.model.update(dt,{state:owned.eat>0?'eat':'idle'});
   }
   poseCarriedEggs(this.carriedRoot,this.mountedId?this.owned.get(this.mountedId)!.model.carryAnchors??[]:[],!!this.mountedId);
   this.follow.update(dt,this.position,!!this.mountedId,this.flight.boosting,this.flight.bank);
   this.atmosphere.update(dt,this.camera.position);this.residents.update(active?dt:0,this.position);
   this.sun.position.copy(this.position).add(new Vector3(-75,140,60));this.sun.target.position.copy(this.position);
   this.drawHUD();this.renderer.webgl.render(this.scene,this.camera);
 }
 private drawHUD():void {
   const p=this.progression,s=p.state,step=s.tutorialStep;
   const objective=s.tutorialComplete?'Beyond the forest':['Welcome to the Sanctuary','Find your first Dragon Egg','Escape to the Sanctuary','Hatch your secured Egg','Your Dragon is hungry','Your Young Dragon is ready','Take to the skies'][Math.min(step,6)]!;
   const detail=s.tutorialComplete?'Explore distant Nests for rarer Dragons. Deliver Eggs to earn Coins.':['WASD to move. Drag the mouse to look.','Follow the forest trail. Approach an Egg and hold E to steal.','Hold Shift to sprint. The Guardian chases until you reach home.','Find the Hatchery on the upper terrace. Press E to hatch.','Free Starter Food is ready. At the Mount Court, press E twice to feed.','Approach your Young Dragon at the Mount Court and press E to mount.','Space ascend · WASD fly · hold Shift Boost · Ctrl land · F dismount.'][Math.min(step,6)]!;
   const target=s.tutorialComplete?new Vector3(...mvpConfig.nests[1]!.position):step<=1?new Vector3(...mvpConfig.nests[0]!.position):step===2?new Vector3(0,0,0):step===3?new Vector3(...mvpConfig.services.hatchery):this.selected?this.owned.get(this.selected.id)!.model.root.position:new Vector3(...mvpConfig.services.mount);
   const destination=s.tutorialComplete?'Highland Nest':step<=1?'Forest Nest':step===2?'Sanctuary Safe Zone':step===3?'Hatchery':'Mount Court';
   const diff=target.clone().sub(this.position);
   const threat=this.guardians.filter(g=>['ALERT','ROAR','CHASE'].includes(g.state));
   const danger=threat.length?Math.min(...threat.map(g=>g.model.root.position.distanceTo(this.position))):-1;
   const context=this.context(),record=this.selected;
   this.ui.update({objective,detail,prompt:this.hatch?'Hatching…':this.mountedId?'':context?.prompt??'',hold:this.hold,coins:s.coins,food:s.food,carried:p.carried.length,capacity:carryCapacity(s.carryLevel),stamina:this.flight.stamina/(mvpConfig.flight.stamina*upgradeMultiplier(s.upgrades.stamina)),mounted:!!this.mountedId,airborne:this.flight.airborne,boosting:this.flight.boosting,dragon:record?record.rarity+' Nature · '+record.stage:'Your first companion awaits',growth:record?record.growth/mvpConfig.youngThreshold:0,destination,distance:Math.hypot(diff.x,diff.z),bearing:Math.atan2(diff.x,-diff.z)-this.follow.yaw-Math.PI/2,danger,saveMessage:this.saves.message,guardians:this.guardians.map(g=>g.config.id+': '+g.state).join(' · ')});
 }
 private debug(action:string):void {
   if(!this.debugEnabled)return;
   if(action==='reset'){this.saves.reset();location.reload();return;}
   if(action==='coins'){this.progression.state.coins+=500;this.save();return;}
   if(action==='food'){this.progression.state.food+=5;this.save();return;}
   if(action==='time'){this.timeScale=this.timeScale===1?60:1;this.ui.notify('Development respawn ×'+this.timeScale);return;}
   if(this.progression.carried.length){this.ui.notify('No teleport while carrying stolen Eggs. Escape physically.');return;}
   if(this.mountedId){this.ui.notify('Land and dismount before using development travel.');return;}
   const nest=mvpConfig.nests.find(n=>n.id===action);
   const pos=nest?this.slotPosition(nest.id,0).add(new Vector3(0,0,7)):action==='home'?new Vector3(0,groundHeight(0,48),48):new Vector3(...(mvpConfig.services[action as keyof typeof mvpConfig.services]??mvpConfig.services.mount));
   if(action==='mount'){pos.x+=7;pos.z+=2;this.follow.yaw=Math.atan2(-7,2);}
   pos.y=groundHeight(pos.x,pos.z);this.player.teleport(pos);this.follow.reset(pos);this.input.clear();this.ui.closePanel();
 }
 private snapshot() {
   return {
    ready:!this.disposed,started:this.started,position:this.position.toArray(),mountedId:this.mountedId,airborne:this.flight.airborne,boosting:this.flight.boosting,stamina:this.flight.stamina,flightTime:this.flightTime,usedBoost:this.usedBoost,
    state:structuredClone(this.progression.state),carried:structuredClone(this.progression.carried),nests:structuredClone(this.progression.nests),
    guardians:this.guardians.map(g=>({id:g.config.id,state:g.state,position:g.model.root.position.toArray(),assetStatus:g.model.root.userData.assetStatus,asset:g.model.root.userData.runtimeAsset,form:g.model.root.userData.form,family:g.model.root.userData.family})),
    context:this.context(),timeScale:this.timeScale,
    assets:{player:{...this.player.visualState},sanctuary:{...this.sanctuaryAssets.status},residents:{...this.residents.status},dragons:[...this.owned].map(([id,owned])=>({id,status:owned.model.root.userData.assetStatus,asset:owned.model.root.userData.runtimeAsset,form:owned.model.root.userData.form,family:owned.model.root.userData.family,motion:owned.model.root.userData.motion,mount:owned.model.mountAnchor.getWorldPosition(new Vector3()).toArray()})),cache:this.assets.stats()},
    render:{...this.renderer.webgl.info.render},memory:{...this.renderer.webgl.info.memory},
   };
 }
 private visualEvidence(){
   const bounds=(root:Group)=>{root.updateMatrixWorld(true);const box=new Box3().setFromObject(root,true);return {min:box.min.toArray(),max:box.max.toArray(),size:box.getSize(new Vector3()).toArray()};};
   return {player:bounds(this.player.root),camera:this.camera.position.toArray(),target:this.position.toArray(),cameraDistance:this.camera.position.distanceTo(this.position),owned:[...this.owned].map(([id,o])=>({id,form:o.stage,position:o.model.root.position.toArray(),bounds:bounds(o.model.root)})),guardians:this.guardians.map(g=>({id:g.config.id,position:g.model.root.position.toArray(),bounds:bounds(g.model.root)})),city:this.world.sanctuary.buildings.map(b=>({id:b.id,name:b.name,bounds:bounds(b.group)}))};
 }
 dispose():void {
   if(this.disposed)return;this.disposed=true;this.loop.dispose();this.input.dispose();this.ui.dispose();this.effects.dispose();this.player.dispose();
   this.sanctuaryAssets.dispose();this.residents.dispose();this.atmosphere.dispose();this.environment?.dispose();this.scene.environment=null;this.owned.forEach(o=>o.model.dispose());this.guardians.forEach(g=>g.model.dispose());this.assets.dispose();disposeScene(this.scene);this.renderer.dispose();
   delete this.host.dataset.bootState;
   if(import.meta.env.DEV)delete (window as unknown as {__MW?:unknown}).__MW;
 }
}
