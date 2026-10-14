interface PanelData{title:string;csrf:string;expiresAt:number;actions:{id:string;label:string}[];}
/** Public clients hold neither credentials nor a privileged global API. Panel
 * metadata arrives only from an authenticated, uncached server response. */
export class OwnerAccess{
 private readonly abort=new AbortController();private timer:ReturnType<typeof setInterval>|undefined;
 private panel:HTMLDetailsElement|undefined;private data:PanelData|undefined;private busy=false;private closed=false;
 get active():boolean{return !!this.data&&this.data.expiresAt*1000>Date.now();}
 constructor(private readonly host:HTMLElement,private readonly apply:(action:string)=>void,private readonly message:(text:string)=>void,private readonly changed:()=>void){void this.refresh();}
 private async refresh():Promise<void>{
  if(this.closed)return;
  try{const r=await fetch('/api/owner',{credentials:'same-origin',cache:'no-store',signal:this.abort.signal});if(!r.ok){this.clear();return;}const data=await r.json()as PanelData;
   if(typeof data.csrf!=='string'||typeof data.title!=='string'||!Number.isFinite(data.expiresAt)||data.expiresAt*1000<=Date.now()||!Array.isArray(data.actions)||data.actions.length>32){this.clear();return;}
   this.data=data;if(!this.panel)this.render();if(!this.timer)this.timer=setInterval(()=>void this.refresh(),60000);this.changed();
  }catch{if(!this.closed)this.clear();}
 }
 private render():void{
  const data=this.data!;this.panel=document.createElement('details');this.panel.className='dev-tools online-owner';this.panel.open=true;
  const title=document.createElement('summary');title.textContent=data.title;const note=document.createElement('p');note.className='admin-scope';note.textContent='Sesi pribadi · setiap tindakan diperiksa server.';
  const actions=document.createElement('div');for(const action of data.actions){if(typeof action.id!=='string'||typeof action.label!=='string')continue;const button=document.createElement('button');button.textContent=action.label;button.dataset.ownerAction=action.id;button.addEventListener('click',()=>void this.command(action.id),{signal:this.abort.signal});actions.append(button);}
  const logout=document.createElement('button');logout.textContent='Keluar akun';logout.dataset.ownerLogout='';logout.addEventListener('click',()=>void this.command('logout'),{signal:this.abort.signal});actions.append(logout);
  this.panel.append(title,note,actions);this.host.querySelector('.game-ui')?.append(this.panel);
 }
 private async command(action:string):Promise<void>{
  if(this.busy||!this.active)return;this.busy=true;this.panel?.querySelectorAll('button').forEach(b=>b.disabled=true);
  try{const r=await fetch('/api/owner',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({operation:action==='logout'?'logout':'command',action,csrf:this.data!.csrf}),signal:this.abort.signal});
   if(r.status===401||r.status===403||r.status===404){this.clear();this.message('Sesi pribadi berakhir. Masuk kembali melalui alamat pribadimu.');return;}
   if(!r.ok){this.message(r.status===429?'Terlalu banyak tindakan. Tunggu sebentar.':'Tindakan belum bisa dijalankan.');return;}
   if(action==='logout'){this.clear();this.message('Akun pribadi sudah keluar.');return;}
   const result=await r.json()as{action?:string};if(result.action===action&&this.active&&!this.closed)this.apply(action);
  }catch{if(!this.closed)this.message('Server belum terhubung. Tindakan tidak dijalankan.');}
  finally{this.busy=false;this.panel?.querySelectorAll('button').forEach(b=>b.disabled=false);}
 }
 private clear():void{this.data=undefined;this.panel?.remove();this.panel=undefined;if(this.timer)clearInterval(this.timer);this.timer=undefined;this.changed();}
 dispose():void{if(this.closed)return;this.closed=true;this.abort.abort();this.clear();}
}
