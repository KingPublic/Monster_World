import { MathUtils,Vector2 } from 'three';

/** Original layered illustrations; no model or extra WebGL scene in the menu. */
export class MainMenuScene {
 private readonly art=document.createElement('div');private readonly overlay:HTMLImageElement;
 private readonly abort=new AbortController();private readonly pointer=new Vector2();private readonly smooth=new Vector2();
 private readonly reduced=matchMedia('(prefers-reduced-motion: reduce)');
 private readonly previousLabel:string|null;private readonly previousTabIndex:string|null;
 private time=0;private disposed=false;motion=true;
 constructor(private readonly host:HTMLElement,private readonly canvas:HTMLCanvasElement,private readonly onMotion:(enabled:boolean)=>void=()=>{}){
  this.previousLabel=canvas.getAttribute('aria-label');this.previousTabIndex=canvas.getAttribute('tabindex');canvas.setAttribute('aria-label','Animated Dragon scenery');canvas.tabIndex=-1;
  try{this.motion=!this.reduced.matches&&localStorage.getItem('monster-world-menu-motion')!=='off';}catch{this.motion=!this.reduced.matches;}
  this.art.className='main-menu-art';this.art.setAttribute('aria-hidden','true');
  this.art.innerHTML=`<div class="menu-panorama"></div><div class="menu-shade"></div><div class="menu-mist menu-mist-a"></div><div class="menu-mist menu-mist-b"></div><div class="menu-sun-glow"></div><div class="menu-dragon-overlay"><div class="menu-dragon-float"><img alt="" draggable="false"></div></div><div class="menu-motes">${Array.from({length:22},(_,i)=>`<i style="--i:${i};left:${(i*43)%100}%;top:${24+(i*17)%70}%;animation-delay:${-i*.83}s"></i>`).join('')}</div>`;
  this.overlay=this.art.querySelector<HTMLImageElement>('.menu-dragon-overlay img')!;this.overlay.src=import.meta.env.BASE_URL+'assets/images/menu/monster-world-dragon-overlay-v1.png';
  const image=import.meta.env.BASE_URL+'assets/images/menu/monster-world-sanctuary-v1.png';
  this.art.querySelector<HTMLElement>('.menu-panorama')!.style.backgroundImage=`url("${image}")`;
  this.host.append(this.art);this.host.dataset.menu='active';this.canvas.classList.add('menu-canvas');
  const signal=this.abort.signal;
  this.overlay.addEventListener('error',()=>{this.overlay.hidden=true;},{signal});
  this.host.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=this.host.getBoundingClientRect();this.pointer.set(MathUtils.clamp((e.clientX-r.left)/r.width*2-1,-1,1),MathUtils.clamp((e.clientY-r.top)/r.height*2-1,-1,1));}},{signal});
  this.host.addEventListener('pointerleave',()=>this.pointer.set(0,0),{signal});
  this.reduced.addEventListener('change',()=>{if(this.reduced.matches)this.setMotion(false);},{signal});
  this.setMotion(this.motion,false);
 }
 private setMotion(enabled:boolean,persist=true):void{this.motion=enabled;this.art.dataset.motion=enabled?'on':'off';this.host.dataset.menuMotion=enabled?'on':'off';this.onMotion(enabled);if(!enabled){this.pointer.set(0,0);this.smooth.set(0,0);}if(persist)try{localStorage.setItem('monster-world-menu-motion',enabled?'on':'off');}catch{/* Cosmetic preference; gameplay save remains independent. */}}
 toggleMotion():boolean{this.setMotion(!this.motion);return this.motion;}
 update(dt:number):void{
  if(this.disposed)return;const delta=this.motion?Math.min(.05,Math.max(0,dt)):0;this.time+=delta;
  this.smooth.lerp(this.pointer,1-Math.exp(-3*delta));
  this.art.style.setProperty('--menu-x',String(this.smooth.x));this.art.style.setProperty('--menu-y',String(this.smooth.y));
 }
 snapshot(){return{motion:this.motion,time:this.time,pointer:this.smooth.toArray(),status:this.overlay.complete?(this.overlay.naturalWidth>0?'illustration':'fallback'):'loading',hero3D:false,art:!this.disposed};}
 dispose():void{if(this.disposed)return;this.disposed=true;this.abort.abort();this.art.remove();this.canvas.classList.remove('menu-canvas');if(this.previousLabel===null)this.canvas.removeAttribute('aria-label');else this.canvas.setAttribute('aria-label',this.previousLabel);if(this.previousTabIndex===null)this.canvas.removeAttribute('tabindex');else this.canvas.setAttribute('tabindex',this.previousTabIndex);delete this.host.dataset.menu;delete this.host.dataset.menuMotion;}
}
