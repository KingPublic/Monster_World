/** Fullscreen must begin from the user's click; unsupported browsers get an
 * honest Home Screen hint. No forced orientation or save/storage migration. */
export class DisplayMode{
 private readonly abort=new AbortController();private readonly buttons:HTMLButtonElement[]=[];
 constructor(host:HTMLElement,private readonly notify:(text:string)=>void){
  for(const[selector,menu]of [['.wallet',false],['.menu-topline',true]]as const){const target=host.querySelector(selector);if(!target)continue;const b=document.createElement('button');b.className=menu?'menu-motion screen-menu':'screen-toggle';b.type='button';b.dataset.displayMode='';b.textContent=menu?'⛶ Layar penuh':'⛶';b.title='Layar penuh';b.setAttribute('aria-label',menu?'Layar penuh menu':'Layar penuh');b.addEventListener('click',()=>void this.toggle(),{signal:this.abort.signal});target.append(b);this.buttons.push(b);}
  document.addEventListener('fullscreenchange',()=>this.sync(),{signal:this.abort.signal});
  const quest=host.querySelector<HTMLElement>('.quest');if(quest){const toggle=document.createElement('button');toggle.className='quest-toggle';toggle.textContent='⌄';toggle.type='button';toggle.setAttribute('aria-label','Detail tujuan');toggle.setAttribute('aria-expanded','false');toggle.addEventListener('click',()=>{const expanded=quest.classList.toggle('quest-expanded');toggle.setAttribute('aria-expanded',String(expanded));toggle.textContent=expanded?'⌃':'⌄';},{signal:this.abort.signal});quest.append(toggle);}
 }
 private sync():void{for(const b of this.buttons){const full=!!document.fullscreenElement;b.setAttribute('aria-pressed',String(full));b.setAttribute('aria-label',full?'Keluar layar penuh':b.classList.contains('screen-menu')?'Layar penuh menu':'Layar penuh');b.textContent=b.classList.contains('screen-menu')?(full?'⛶ Keluar layar penuh':'⛶ Layar penuh'):'⛶';}}
 private async toggle():Promise<void>{
  if(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches){this.notify('Game sudah dibuka sebagai aplikasi layar penuh.');return;}
  if(!document.fullscreenEnabled){this.notify('Untuk layar tanpa bilah alamat: Bagikan / menu browser → Tambahkan ke Layar Utama, lalu buka ikonnya.');return;}
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch{this.notify('Browser belum mengizinkan layar penuh. Buka lewat ikon Layar Utama atau coba tombol ini lagi.');}
 }
 dispose():void{this.abort.abort();for(const b of this.buttons)b.remove();this.buttons.length=0;}
}
