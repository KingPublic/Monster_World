import type { SaveData } from '../gameplay/Progression';
import { mvpConfig, upgradeCost, upgradeMultiplier } from '../config/mvpConfig';

export interface HUDState {
 objective:string; detail:string; prompt:string; hold:number; coins:number; food:number; carried:number; capacity:number;
 stamina:number; mounted:boolean; airborne:boolean; boosting:boolean; dragon:string; growth:number;
 destination:string; distance:number; bearing:number; danger:number; saveMessage:string; guardians:string;
}
function escapeText(text:string):string{return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
type Callbacks = {start:()=>void; action:(action:string,id?:string)=>void; debug?:(action:string)=>void};
export class UIManager {
 private readonly root=document.createElement('div');
 private readonly abort=new AbortController();
 private readonly refs=new Map<string,HTMLElement>();
 private panel:string|null=null;
 private notificationTimer=0;
 private lastNotification='';
 constructor(host:HTMLElement,callbacks:Callbacks,hasSave:boolean,debug=false) {
   this.root.className='game-ui';
   this.root.innerHTML=`<header class="game-header"><a class="brand" href="#" aria-label="Monster World">MONSTER <span>WORLD</span><small>DRAGON SANCTUARY</small></a><div class="wallet"><span>◈ <b data-hud="coins">0</b> Coins</span><span>✦ <b data-hud="food">0</b> Food</span><button data-action="help" title="Controls" aria-label="Show controls">?</button></div></header>
   <section class="quest"><p class="eyebrow" data-hud="questLabel">YOUR JOURNEY</p><h2 data-hud="objective"></h2><p data-hud="detail"></p></section>
   <div class="navigation" aria-label="Objective direction"><span data-hud="arrow">➤</span><div><strong data-hud="destination"></strong><small data-hud="distance"></small></div></div>
   <div class="danger" data-hud="danger" hidden></div>
   <div class="notification" data-hud="notification" role="status" aria-live="polite" hidden></div>
   <div class="interaction" data-hud="interaction" hidden><span class="keycap">E</span><div><strong data-hud="prompt"></strong><div class="hold-track"><i data-hud="hold"></i></div></div></div>
   <footer class="game-footer"><section class="flight-status"><div><strong data-hud="mode">EXPLORING ON FOOT</strong><small data-hud="boost">Hold Shift to sprint</small></div><div class="stamina-track"><i data-hud="stamina"></i></div></section><div class="carry-pill">◉ Eggs <b data-hud="carry">0 / 1</b></div><section class="dragon-status"><small>YOUR DRAGON</small><strong data-hud="dragon">Your first companion awaits</strong><div class="growth-track"><i data-hud="growth"></i></div></section></footer>
   <p class="controls-hint">WASD move · drag mouse to look · E interact · Shift sprint / hold Boost · Space jump / ascend · Ctrl descend · F dismount</p>
   <span class="save-status" data-hud="save"></span>
   <div class="panel-backdrop" hidden><section class="service-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" tabindex="-1"><button class="close-panel" data-action="close" aria-label="Close panel">×</button><div class="panel-content"></div></section></div>
   <div class="welcome-backdrop"><section class="welcome"><span class="eyebrow">WELCOME TO THE DRAGON SANCTUARY</span><h1>A wild world.<br>A Dragon of your own.</h1><p>Brave the forest, steal an egg, and escape its Guardian. Raise your companion, then take to the skies.</p><div class="welcome-steps"><span>EXPLORE</span><span>ESCAPE</span><span>GROW</span><span>FLY</span></div><button class="primary" data-action="start">${hasSave?'Continue adventure':'Begin adventure'} <span>↗</span></button><small>WASD to move · drag to look · hold E at an egg<br>Progress is saved in this browser.</small></section></div>
   ${debug?'<details class="dev-tools"><summary>Development tools</summary><p data-hud="guardians"></p><div><button data-debug="home">Sanctuary</button><button data-debug="forest">Forest egg</button><button data-debug="highland">Highland egg</button><button data-debug="volcano">Volcanic egg</button><button data-debug="frost">Frost egg</button><button data-debug="hatchery">Hatchery</button><button data-debug="mount">Mount court</button><button data-debug="shop">Food Shop</button><button data-debug="coins">+ Coins</button><button data-debug="food">+ Food</button><button data-debug="time">Respawn ×60</button><button data-debug="reset">Reset save</button></div></details>':''}`;
   host.append(this.root);
   this.root.querySelectorAll<HTMLElement>('[data-hud]').forEach(e=>this.refs.set(e.dataset.hud!,e));
   this.root.addEventListener('click',e=>{
     const target=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-action],[data-debug]');
     if(!target)return;
     if(target.dataset.debug){callbacks.debug?.(target.dataset.debug);return;}
     const action=target.dataset.action!;
     if(action==='start'){this.root.querySelector('.welcome-backdrop')?.remove();callbacks.start();return;}
     if(action==='close'){this.closePanel();callbacks.action('close');return;}
     if(action==='help'){this.showHelp();callbacks.action('pause');return;}
     callbacks.action(action,target.dataset.id);
   },{signal:this.abort.signal});
   this.root.addEventListener('keydown',e=>{
     if(!this.panel)return;
     if(e.key==='Escape'){this.closePanel();callbacks.action('close');e.stopPropagation();}
     if(e.key==='Tab'){
       const buttons=Array.from(this.root.querySelectorAll<HTMLElement>('.service-panel button'));
       const first=buttons[0],last=buttons.at(-1);
       if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
       else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
     }
   },{signal:this.abort.signal});
 }
 get panelOpen():boolean{return this.panel!==null;}
 private set(key:string,value:string):void {const e=this.refs.get(key);if(e&&e.textContent!==value)e.textContent=value;}
 update(s:HUDState):void {
   this.set('objective',s.objective);this.set('detail',s.detail);this.set('coins',String(s.coins));this.set('food',String(s.food));
   this.set('carry',s.carried+' / '+s.capacity);this.set('dragon',s.dragon);this.set('prompt',s.prompt);
   this.set('destination',s.destination);this.set('distance',Math.round(s.distance)+' world units');
   this.refs.get('arrow')!.style.transform='rotate('+s.bearing+'rad)';
   this.refs.get('interaction')!.hidden=!s.prompt;
   this.refs.get('hold')!.style.width=Math.min(100,s.hold*100)+'%';
   this.refs.get('stamina')!.style.width=Math.max(0,Math.min(100,s.stamina*100))+'%';
   this.refs.get('growth')!.style.width=Math.min(100,s.growth*100)+'%';
   this.set('mode',s.mounted?(s.airborne?'DRAGON FLIGHT':'MOUNTED · SPACE TO TAKE OFF'):'EXPLORING ON FOOT');
   this.set('boost',s.boosting?'BOOSTING · stamina draining':s.mounted?'Hold Shift to Boost · Ctrl to land':'Hold Shift to sprint');
   const danger=this.refs.get('danger')!;danger.hidden=s.danger<0;
   this.set('danger',s.danger>=0?'GUARDIAN PURSUIT · '+Math.round(s.danger)+' units behind':'');
   this.set('save',s.saveMessage);this.set('guardians',s.guardians);
 }
 notify(message:string):void {
   if(message===this.lastNotification)return;this.lastNotification=message;
   const el=this.refs.get('notification')!;el.textContent=message;el.hidden=false;
   clearTimeout(this.notificationTimer);this.notificationTimer=window.setTimeout(()=>{el.hidden=true;this.lastNotification='';},4800);
 }
 private open(kind:string,html:string):void {
   this.panel=kind;const backdrop=this.root.querySelector<HTMLElement>('.panel-backdrop')!;backdrop.hidden=false;
   this.root.querySelector('.panel-content')!.innerHTML=html;
   this.root.querySelector<HTMLElement>('.service-panel')!.focus();
 }
 showHelp():void {this.open('help','<p class="eyebrow">CONTROLS</p><h2 id="panel-title">Explore. Escape. Fly.</h2><p>WASD moves relative to your camera. Drag the mouse or swipe the right side to look.</p><p>Hold Shift to sprint on foot or Boost on your Dragon. Hold E to steal; press E at a service or companion.</p><p>Space jumps on foot / ascends while mounted. Left Ctrl descends. Land before pressing F to dismount.</p><p>Guardians pursue stolen eggs until you reach Sanctuary. Keep moving; sprint during the first escape.</p>');}
 showPanel(kind:string,state:SaveData):void {
   if(kind==='shop')this.open(kind,`<p class="eyebrow">SANCTUARY FOOD SHOP</p><h2 id="panel-title">A meal for your companion</h2><p>Feed Baby Dragons to unlock the Young stage. Growth preserves rarity and element.</p><article class="food-card"><span class="food-icon">✦</span><div><h3>Basic Dragon Food</h3><p>+${mvpConfig.foodGrowth} Growth · ${mvpConfig.foodPrice} Coins</p></div></article><button class="primary" data-action="buy">Buy food · ${mvpConfig.foodPrice} Coins</button><p>Your purse: ${state.coins} Coins · Food: ${state.food}</p>`);
   else if(kind==='collection')this.open(kind,`<p class="eyebrow">DRAGON COLLECTION</p><h2 id="panel-title">Your growing family</h2><div class="collection-list">${state.dragons.length?state.dragons.map(d=>`<article class="dragon-card rarity-${d.rarity.toLowerCase()}"><span class="dragon-emblem">♧</span><div><h3>${escapeText(d.name)}</h3><p>${d.rarity} · ${d.element} · ${d.stage}</p><small>${d.stage==='Young'?'Rideable':'Not yet rideable'} · ${state.equippedDragonId===d.id?'Equipped':'Resting'}</small></div><button data-action="equip" data-id="${d.id}">${state.equippedDragonId===d.id?'Selected':'Select'}</button></article>`).join(''):'<p>Your first Dragon awaits in an egg beyond the Sanctuary.</p>'}</div>`);
   else if(kind==='rider')this.open(kind,`<p class="eyebrow">RIDER UPGRADES</p><h2 id="panel-title">Reach farther horizons</h2><p>Permanent upgrades apply to every Dragon you ride.</p>${(['speed','stamina','boost','carry'] as const).map(kind=>{const level=kind==='carry'?state.carryLevel:state.upgrades[kind],cost=upgradeCost(kind,level);return `<article class="upgrade-card"><div><h3>${kind.charAt(0).toUpperCase()+kind.slice(1)}</h3><small>${kind==='carry'?level+' Eggs':'×'+upgradeMultiplier(level).toFixed(2)} · Level ${level}</small></div><button data-action="upgrade" data-id="${kind}" ${cost===null?'disabled':''}>${cost===null?'Maximum':cost+' Coins'}</button></article>`;}).join('')}`);
 }
 closePanel():void {this.panel=null;this.root.querySelector<HTMLElement>('.panel-backdrop')!.hidden=true;}
 dispose():void{clearTimeout(this.notificationTimer);this.abort.abort();this.root.remove();}
}
