import type { SaveData } from '../gameplay/Progression';
import { mvpConfig, upgradeCost, upgradeMultiplier } from '../config/mvpConfig';
import { variantForNest,variantLabel } from '../config/dragonVariants';
import type { DialoguePage } from '../world/ResidentCatalog';
import {dragonStats,dragonAvailable,recoveryLabel} from '../gameplay/DragonCare';

export interface HUDState {
 objective:string; detail:string; prompt:string; hold:number; coins:number; food:number; carried:number; capacity:number;
 stamina:number; sprintExhausted?:boolean; mounted:boolean; mountKind?:'foot'|'dragon'|'horse';airborne:boolean; boosting:boolean; dragon:string; growth:number;
 destination:string; distance:number; bearing:number; danger:number; saveMessage:string; guardians:string;
 canFeed?:boolean;health?:number;healthLabel?:string;growthLabel?:string;
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
 private audioState={muted:false,volume:.45};
 private companionUpdate=0;
 constructor(host:HTMLElement,callbacks:Callbacks,hasSave:boolean,debug=false) {
   this.root.className='game-ui';
   this.root.innerHTML=`<header class="game-header"><a class="brand" href="#" aria-label="Monster World">MONSTER <span>WORLD</span><small>DRAGON SANCTUARY</small></a><div class="wallet"><span>◈ <b data-hud="coins">0</b> Coins</span><span>✦ <b data-hud="food">0</b> Food</span><button data-action="help" title="Controls" aria-label="Show controls">?</button></div></header>
   <section class="quest"><p class="eyebrow" data-hud="questLabel">YOUR JOURNEY</p><h2 data-hud="objective"></h2><p data-hud="detail"></p></section>
   <button class="navigation" data-action="destinations" aria-label="Choose Wild Nest" title="Choose a Wild Nest"><span data-hud="arrow">➤</span><div><strong data-hud="destination"></strong><small data-hud="distance"></small></div></button>
   <div class="danger" data-hud="danger" hidden></div>
   <div class="notification" data-hud="notification" role="status" aria-live="polite" hidden></div>
   <div class="interaction" data-hud="interaction" data-action="interact" role="button" tabindex="0" aria-label="Interact" hidden><span class="keycap">E</span><div><strong data-hud="prompt"></strong><div class="hold-track"><i data-hud="hold"></i></div></div></div>
   <footer class="game-footer"><section class="flight-status"><div><strong data-hud="mode">EXPLORING ON FOOT</strong><small data-hud="boost">Hold Shift to sprint</small></div><div class="stamina-caption" data-hud="stamina-label">PLAYER STAMINA · 100%</div><div class="stamina-track" role="progressbar" aria-label="Player sprint stamina" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><i data-hud="stamina"></i></div></section><div class="carry-pill">◉ Eggs <b data-hud="carry">0 / 1</b></div><section class="dragon-status"><small>YOUR DRAGON</small><strong data-hud="dragon">Your first companion awaits</strong><div class="growth-track"><i data-hud="growth"></i></div></section></footer>
   <p class="controls-hint">WASD move · drag mouse to look · E interact · Shift sprint / hold Boost · Space jump / ascend · C descend (Ctrl also works) · F dismount</p>
   <span class="save-status" data-hud="save"></span>
   <div class="panel-backdrop" hidden><section class="service-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" tabindex="-1"><button class="close-panel" data-action="close" aria-label="Close panel">×</button><div class="panel-content"></div></section></div>
   <div class="welcome-backdrop main-menu"><div class="menu-topline"><span class="menu-edition">A DRAGON ADVENTURE</span><button class="menu-motion" data-action="menu-motion" aria-pressed="true"><span aria-hidden="true">✧</span> Motion on</button></div><section class="welcome main-menu-copy" aria-labelledby="menu-title"><div class="menu-crest" aria-hidden="true"><svg viewBox="0 0 100 60" fill="none"><path d="M50 8 43 22 23 12 7 9 21 29 36 32 42 43 50 51 58 43 64 32 79 29 93 9 77 12 57 22Z" stroke="currentColor" stroke-width="1.5"/><path d="m50 8 0 43M7 9l29 23M93 9 64 32M43 22l7 9 7-9" stroke="currentColor"/></svg></div><h1 id="menu-title">MONSTER<span>WORLD</span></h1><div class="menu-subtitle"><i></i>DRAGON SANCTUARY<i></i></div><p class="menu-intro">Beyond the Sanctuary, a wild world awaits.<br>Find your Dragon. Make the skies your own.</p><div class="menu-actions"><button class="primary menu-start" data-action="start">${hasSave?'Continue adventure':'Begin adventure'} <span aria-hidden="true">↗</span></button><button class="menu-help" data-action="menu-help">How to play</button></div><small class="menu-save">${hasSave?'Your companions are waiting. Your journey continues.':'Your journey is saved as you explore.'}</small></section><div class="menu-world-note" aria-hidden="true"><span>THE SKIES ARE CALLING</span><p>A companion. A whole new horizon.</p></div><footer class="menu-bottom"><span class="menu-chapters">EXPLORE <i>·</i> ESCAPE <i>·</i> GROW <i>·</i> FLY</span><span class="menu-local">Single player · Saved in this browser</span></footer></div>
   ${debug?`<details class="dev-tools" open><summary>Admin Adrian · Lokal</summary><p class="admin-scope">Server lokal Anda. Panel ini tidak aktif di build publik.</p><p data-hud="guardians"></p><div><button data-debug="home">Sanctuary</button>${mvpConfig.nests.map(n=>`<button data-debug="${n.id}">${escapeText(n.name)}</button>`).join('')}<button data-debug="hatchery">Hatchery</button><button data-debug="mount">Mount court</button><button data-debug="horse">Horse</button><button data-debug="shop">Food Shop</button><button data-debug="coins">+500 Coins</button><button data-debug="food">+5 Food</button><button data-debug="legendary-egg">Legendary Egg</button><button data-debug="mythical-egg">Mythical Egg</button><button data-debug="time">Egg respawn ×60</button><button data-debug="reset" title="Menghapus seluruh progres yang tersimpan di browser ini">Reset save</button></div></details>`:''}`;
   host.append(this.root);
   this.root.querySelector('.wallet')!.insertAdjacentHTML('beforeend','<button data-action="sound" class="sound-toggle" aria-label="Mute world sounds" aria-pressed="false">♫</button>');
   this.root.querySelector('.interaction')!.insertAdjacentHTML('beforeend','<button data-action="feed-nearby" hidden>Feed · R</button>');
   this.root.querySelector('.flight-status')!.insertAdjacentHTML('beforeend','<div class="companion-health" data-hud="health-group" hidden><small data-hud="health-label"></small><div class="health-track" role="progressbar" aria-label="Dragon health" aria-valuemin="0" aria-valuemax="100"><i data-hud="health"></i></div></div>');
   this.root.querySelector('.dragon-status .growth-track')!.insertAdjacentHTML('beforebegin','<small class="care-caption" data-hud="growth-label"></small>');
   this.root.querySelectorAll<HTMLElement>('[data-hud]').forEach(e=>this.refs.set(e.dataset.hud!,e));
   this.root.addEventListener('click',e=>{
     const target=(e.target as HTMLElement).closest<HTMLElement>('[data-action],[data-debug]');
     if(!target)return;
     if(target.dataset.debug){callbacks.debug?.(target.dataset.debug);return;}
     const action=target.dataset.action!;
     if(action==='start'){this.closePanel();this.root.querySelector('.welcome-backdrop')?.remove();callbacks.start();return;}
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
   this.root.addEventListener('input',e=>{const target=e.target as HTMLInputElement;if(target.dataset.action==='audio-volume')callbacks.action('audio-volume',target.value);},{signal:this.abort.signal});
 }
 get panelOpen():boolean{return this.panel!==null;}
 setMenuMotion(enabled:boolean):void {const button=this.root.querySelector<HTMLButtonElement>('[data-action="menu-motion"]');if(button){button.setAttribute('aria-pressed',String(enabled));button.innerHTML=`<span aria-hidden="true">✧</span> Motion ${enabled?'on':'off'}`;}}
 setAudio(state:{muted:boolean;volume:number}):void{this.audioState={muted:state.muted,volume:state.volume};const b=this.root.querySelector<HTMLButtonElement>('[data-action="sound"]')!;b.textContent=state.muted?'♪̸':'♫';b.setAttribute('aria-pressed',String(state.muted));b.setAttribute('aria-label',state.muted?'Enable world sounds':'Mute world sounds');const range=this.root.querySelector<HTMLInputElement>('[data-action="audio-volume"]');if(range)range.value=String(Math.round(state.volume*100));}
 private set(key:string,value:string):void {const e=this.refs.get(key);if(e&&e.textContent!==value)e.textContent=value;}
 update(s:HUDState):void {
   this.set('objective',s.objective);this.set('detail',s.detail);this.set('coins',String(s.coins));this.set('food',String(s.food));
   this.set('carry',s.carried+' / '+s.capacity);this.set('dragon',s.dragon);this.set('prompt',s.prompt);
   this.set('destination',s.destination);this.set('distance',Math.round(s.distance)+' world units');
   this.refs.get('arrow')!.style.transform='rotate('+s.bearing+'rad)';
   this.refs.get('interaction')!.hidden=!s.prompt;
   this.refs.get('hold')!.style.width=Math.min(100,s.hold*100)+'%';
   this.refs.get('stamina')!.style.width=Math.max(0,Math.min(100,s.stamina*100))+'%';
   this.refs.get('growth')!.style.width=(s.growthLabel==='FULLY GROWN'?100:Math.min(100,s.growth*100))+'%';
   this.root.querySelector<HTMLButtonElement>('[data-action="feed-nearby"]')!.hidden=!s.canFeed;
   this.refs.get('health-group')!.hidden=s.health===undefined;this.set('health-label','DRAGON '+(s.healthLabel??''));this.set('growth-label',s.growthLabel??'GROWTH');
   const health=this.refs.get('health')!,percentHP=Math.round(Math.max(0,Math.min(1,s.health??0))*100);health.style.width=percentHP+'%';health.parentElement!.setAttribute('aria-valuenow',String(percentHP));health.parentElement!.dataset.low=String(percentHP<30);
   this.set('mode',s.mountKind==='horse'?(s.airborne?'HORSE JUMP':'RIDING SANCTUARY HORSE'):s.mounted?(s.airborne?'DRAGON FLIGHT':'MOUNTED · SPACE TO TAKE OFF'):'EXPLORING ON FOOT');
   this.set('boost',s.sprintExhausted?'Recovering · release Shift, then sprint again':s.mountKind==='horse'?(s.boosting?'SPRINTING · Space jumps · F dismounts':'Hold Shift to sprint · Space jumps · F dismounts'):s.mounted?(s.boosting?'BOOSTING · stamina draining':'Hold Shift to Boost · C to land'):s.boosting?'SPRINTING · stamina draining':'Hold Shift to sprint');
   const kind=s.mountKind==='horse'?'HORSE':s.mounted?'DRAGON':'PLAYER',percent=Math.round(Math.max(0,Math.min(100,s.stamina*100))),track=this.refs.get('stamina')!.parentElement!;
   this.set('stamina-label',kind+' STAMINA · '+percent+'%');track.hidden=false;track.setAttribute('aria-label',kind.toLowerCase()+' stamina');track.setAttribute('aria-valuenow',String(percent));track.dataset.low=String(s.stamina<.2||!!s.sprintExhausted);
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
 showHelp():void {this.open('help',`<p class="eyebrow">CONTROLS</p><h2 id="panel-title">Explore. Escape. Fly.</h2><p>WASD moves relative to your camera. Drag the mouse or swipe the right side to look.</p><p>Hold Shift to sprint on foot/on your Horse or Boost on your Dragon. Hold E to steal; press E at a service or mount. Near your companion, R or the Feed button gives Food, even after it becomes Young.</p><p>Space jumps on foot/on your Horse, or ascends on your Dragon. C descends in Dragon flight; Ctrl also works as a backup. Land before F to dismount.</p><p>Guardians hit your ridden Dragon first. If it falls, run! Eggs stay with you until you are caught. Your companion recovers at the Sanctuary: Common1m, Uncommon2m, Rare3m, Epic5m, Legendary7m, Mythical10m.</p><label class="audio-volume">World sound volume <input type="range" min="0" max="100" value="${Math.round(this.audioState.volume*100)}" data-action="audio-volume" aria-label="World sound volume"></label>`);}
 showDialogue(page:DialoguePage):void {this.open('dialogue',`<div class="conversation-heading"><span class="conversation-emblem" aria-hidden="true">✧</span><div><p class="eyebrow">${escapeText(page.title)}</p><h2 id="panel-title">${escapeText(page.name)}</h2></div></div><p class="conversation-text">${escapeText(page.text)}</p><div class="conversation-options">${page.options.map(o=>`<button data-action="${o.topic?'topic':'navigate'}" data-id="${escapeText(o.topic??o.nestId??'')}">${escapeText(o.label)} <span aria-hidden="true">↗</span></button>`).join('')}<button data-action="close">Safe travels. <span aria-hidden="true">✓</span></button></div>`);}
 showPanel(kind:string,state:SaveData):void {
   if(kind==='destinations'){this.open(kind,`<p class="eyebrow">WILD NEST ROUTES</p><h2 id="panel-title">Choose your next journey</h2><p>Mark a destination on your compass. Travel there to steal an Egg and return safely. Your Horse travels on land; Dragon flight reaches distant cliffs.</p><div class="collection-list">${mvpConfig.nests.map(n=>`<article class="dragon-card"><div><h3>${escapeText(n.name)}</h3><p>${escapeText(n.tier)} · ${variantLabel(variantForNest(n.id))}</p><small>${n.slotCount} Egg slots · ${Math.round(Math.hypot(n.position[0],n.position[2]))} units from home</small><small class="nest-loot">${n.pool.map(p=>p.rarity+' '+p.weight+'%').join(' · ')}</small></div><button data-action="navigate" data-id="${n.id}">Mark route</button></article>`).join('')}</div>`);return;}
   if(kind==='shop')this.open(kind,`<p class="eyebrow">SANCTUARY FOOD SHOP</p><h2 id="panel-title">A meal for your companion</h2><p>Baby food unlocks Young. Keep feeding Young Dragons to grow a little larger, improve flight stats and restore HP. Rarity and lineage stay the same.</p><article class="food-card"><span class="food-icon">✦</span><div><h3>Basic Dragon Food</h3><p>Baby: +${mvpConfig.foodGrowth} Growth · Young: care + HP · ${mvpConfig.foodPrice} Coins</p></div></article><button class="primary" data-action="buy">Buy food · ${mvpConfig.foodPrice} Coins</button><p>Your purse: ${state.coins} Coins · Food: ${state.food}</p>`);
   else if(kind==='collection')this.open(kind,`<p class="eyebrow">DRAGON COLLECTION</p><h2 id="panel-title">Your growing family</h2><p>Five companions rest in the garden at a time. Meet them there to feed with R or the Feed button. Meals improve Speed, Stamina, Boost and HP, and gradually increase size. Recovering Dragons return here healthy.</p><div class="collection-list">${state.dragons.length?state.dragons.map(d=>{const stats=dragonStats(d,state.upgrades),ready=dragonAvailable(d);return `<article class="dragon-card rarity-${d.rarity.toLowerCase()}" data-companion="${escapeText(d.id)}"><span class="dragon-emblem">♧</span><div><h3>${escapeText(d.name)}</h3><p>${d.rarity} · ${d.stage} · Lv ${stats.level}</p><small data-care-health>${ready?'HP '+Math.round(d.health??stats.maxHealth)+' / '+stats.maxHealth:'Recovering · '+recoveryLabel(d)}</small><small class="dragon-stats">Speed ${stats.speed.toFixed(1)} · Stamina ${stats.stamina.toFixed(0)} · Boost ${stats.boost.toFixed(1)}<br>Size +${Math.round((stats.size-1)*100)}% · ${stats.meals}/${mvpConfig.dragonCare.maxMeals} care meals</small></div><button data-action="${d.stage==='Baby'?'visit':'equip'}" data-id="${escapeText(d.id)}" ${ready?'':'disabled'}>${!ready?'Resting':d.stage==='Baby'?'Meet & feed':state.equippedDragonId===d.id?'Call selected':'Select'}</button></article>`;}).join(''):'<p>Your first Dragon awaits in an egg beyond the Sanctuary.</p>'}</div>`);
   else if(kind==='rider')this.open(kind,`<p class="eyebrow">RIDER UPGRADES</p><h2 id="panel-title">Reach farther horizons</h2><p>Permanent upgrades apply to every Dragon you ride.</p>${(['speed','stamina','boost','carry'] as const).map(kind=>{const level=kind==='carry'?state.carryLevel:state.upgrades[kind],cost=upgradeCost(kind,level);return `<article class="upgrade-card"><div><h3>${kind.charAt(0).toUpperCase()+kind.slice(1)}</h3><small>${kind==='carry'?level+' Eggs':'×'+upgradeMultiplier(level).toFixed(2)} · Level ${level}</small></div><button data-action="upgrade" data-id="${kind}" ${cost===null?'disabled':''}>${cost===null?'Maximum':cost+' Coins'}</button></article>`;}).join('')}`);
 }
 updateCompanions(state:SaveData):void{if(this.panel!=='collection'||performance.now()-this.companionUpdate<500)return;this.companionUpdate=performance.now();this.root.querySelectorAll<HTMLElement>('[data-companion]').forEach(card=>{const d=state.dragons.find(d=>d.id===card.dataset.companion);if(!d)return;const stats=dragonStats(d),ready=dragonAvailable(d);card.querySelector('[data-care-health]')!.textContent=ready?'HP '+Math.round(d.health??stats.maxHealth)+' / '+stats.maxHealth:'Recovering · '+recoveryLabel(d);const b=card.querySelector('button')!;b.disabled=!ready;b.textContent=!ready?'Resting':d.stage==='Baby'?'Meet & feed':state.equippedDragonId===d.id?'Call selected':'Select';});}
 closePanel():void {this.panel=null;this.root.querySelector<HTMLElement>('.panel-backdrop')!.hidden=true;}
 dispose():void{clearTimeout(this.notificationTimer);this.abort.abort();this.root.remove();}
}
