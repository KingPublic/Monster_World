import {Vector3} from 'three';
export type WorldSound='dragon'|'baby'|'roar'|'hurt'|'defeat'|'meal'|'wings'|'horse'|'hoof'|'step'|'npc'|'mossling'|'pebbleback'|'bird'|'secure';
function voicePitch(id:string){let n=0;for(const c of id)n=(n*31+c.charCodeAt(0))>>>0;return .88+(n%27)/100;}
/** Original synthesized cues; no remote media, autoplay, speech service or timers. */
export class WorldAudio {
 private context:AudioContext|undefined;private master:GainNode|undefined;private compressor:DynamicsCompressorNode|undefined;private wind:AudioBufferSourceNode|undefined;private windGain:GainNode|undefined;private windFilter:BiquadFilterNode|undefined;private noise:AudioBuffer|undefined;
 private readonly voices=new Set<AudioScheduledSourceNode>();private readonly events=new AbortController();private readonly listener=new Vector3();private yaw=0;private enabled=false;private active=false;private disposed=false;
 private muted=false;private volume=.45;private emitted=0;private peakVoices=0;private readonly kinds:Partial<Record<WorldSound,number>>={};
 constructor(){try{const p=JSON.parse(localStorage.getItem('monster-world-audio')??'null');if(p&&typeof p.muted==='boolean')this.muted=p.muted;if(p&&Number.isFinite(p.volume))this.volume=Math.max(0,Math.min(1,p.volume));}catch{/* Cosmetic preference may be unavailable. */}
  const signal=this.events.signal;window.addEventListener('pointerdown',()=>this.resume(),{signal});window.addEventListener('keydown',()=>this.resume(),{signal});document.addEventListener('visibilitychange',()=>{if(document.hidden)this.setActive(false);},{signal});
 }
 unlock():void{if(this.disposed)return;this.enabled=true;this.active=true;
  if(!this.context){try{const Audio=globalThis.AudioContext??(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Audio)return;
    const ctx=this.context=new Audio();this.master=ctx.createGain();this.master.gain.value=this.muted?0:this.volume;this.compressor=ctx.createDynamicsCompressor();this.compressor.threshold.value=-14;this.compressor.knee.value=14;this.compressor.ratio.value=6;this.master.connect(this.compressor).connect(ctx.destination);
    const b=this.noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=b.getChannelData(0);let brown=0;for(let i=0;i<data.length;i++){brown=(brown+(Math.random()*2-1)*.08)/1.02;data[i]=brown*2.4;}
    this.wind=ctx.createBufferSource();this.wind.buffer=b;this.wind.loop=true;this.windFilter=ctx.createBiquadFilter();this.windFilter.type='lowpass';this.windFilter.frequency.value=550;this.windGain=ctx.createGain();this.windGain.gain.value=.035;this.wind.connect(this.windFilter).connect(this.windGain).connect(this.master);this.wind.start();
  }catch{this.context=undefined;}}
  this.resume();
 }
 private resume():void{if(this.enabled&&this.active&&!this.muted&&!document.hidden&&!this.disposed&&this.context?.state==='suspended')void this.context.resume().catch(()=>{});}
 setActive(active:boolean):void{active=active&&!document.hidden;if(this.active===active)return;this.active=active;if(!active){this.stopVoices();if(this.context?.state==='running')void this.context.suspend().catch(()=>{});}else this.resume();}
 setMuted(muted:boolean):void{this.muted=muted;this.applyPreference();}
 setVolume(volume:number):void{if(!Number.isFinite(volume))return;this.volume=Math.max(0,Math.min(1,volume));this.applyPreference();}
 private applyPreference():void{try{localStorage.setItem('monster-world-audio',JSON.stringify({muted:this.muted,volume:this.volume}));}catch{}if(this.master&&this.context)this.master.gain.setTargetAtTime(this.muted?0:this.volume,this.context.currentTime,.04);if(this.muted)this.stopVoices();else this.resume();}
 listen(position:Vector3,yaw:number,airborne=false,quiet=false):void{this.listener.copy(position);this.yaw=yaw;if(this.windGain&&this.context)this.windGain.gain.setTargetAtTime(quiet?0:airborne?.065:.035,this.context.currentTime,.12);}
 play(kind:WorldSound,position:Vector3,id='',family='Mountain'):void{
  const ctx=this.context;if(this.disposed||!this.active||!this.enabled||this.muted||this.volume===0||document.hidden||!ctx||ctx.state!=='running'||!this.master||this.voices.size>18)return;
  const distance=position.distanceTo(this.listener),range=kind==='roar'?260:kind==='npc'?32:kind==='step'?16:120;if(distance>range)return;
  const familyPitch:Readonly<Record<string,number>>={Ashscale:.72,Emberdrake:.78,Crystalwyvern:1.28,Stormserpent:.64,Suncrest:1.1,Moonveil:.9,Duneback:.69};
  const dx=position.x-this.listener.x,dz=position.z-this.listener.z,pan=Math.max(-.85,Math.min(.85,(dx*Math.cos(this.yaw)+dz*Math.sin(this.yaw))/Math.max(8,distance))),gain=Math.max(0,1-distance/range)/(1+distance*.025),pitch=voicePitch(id)*(familyPitch[family]??1);
  const at=ctx.currentTime+.008;
  const tone=(frequency:number,end:number,duration:number,amplitude:number,type:OscillatorType='sine',delay=0)=>{if(this.voices.size>=24)return;const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(frequency*pitch,at+delay);o.frequency.exponentialRampToValueAtTime(Math.max(12,end*pitch),at+delay+duration);this.route(o,at+delay,duration,amplitude*gain,pan);};
  const noise=(duration:number,amplitude:number,frequency:number,delay=0)=>{if(this.voices.size>=24||!this.noise)return;const n=ctx.createBufferSource();n.buffer=this.noise;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=frequency;f.Q.value=.7;n.connect(f);this.route(n,at+delay,duration,amplitude*gain,pan,f);};
  if(kind==='roar'||kind==='dragon'||kind==='hurt'||kind==='defeat'){const roar=kind==='roar',hurt=kind==='hurt',length=roar?1.3:kind==='defeat'?1.1:hurt?.45:.7;const f=roar?68:hurt?160:kind==='defeat'?95:92;tone(f,f*.6,length,roar?.32:.17,'triangle');tone(f*1.51,f*.85,length,.12,'triangle');noise(length,roar?.3:.16,family==='Ashscale'?980:550);}
  else if(kind==='baby'||kind==='meal'){tone(430,670,.18,.12,'triangle');tone(640,450,.23,.1,'sine',.17);}
  else if(kind==='wings'){noise(.28,.25,280);noise(.23,.14,430,.18);}
  else if(kind==='horse'){tone(630,280,.65,.11,'triangle');tone(820,540,.26,.07,'sine',.22);noise(.3,.08,1200);}
  else if(kind==='hoof'){tone(145,45,.07,.22,'triangle');noise(.06,.2,750);tone(115,40,.06,.13,'triangle',.15);}
  else if(kind==='step'){noise(.08,.12,900);tone(130,55,.06,.065,'sine');}
  else if(kind==='npc'){for(let i=0;i<3;i++){tone((id.includes('guide')?270:190)+(i%2)*60,150+i*30,.14,.07,'triangle',i*.18);noise(.11,.035,1200,i*.18);}}
  else if(kind==='mossling'){tone(580,880,.17,.12,'sine');tone(950,610,.17,.08,'sine',.2);}
  else if(kind==='pebbleback'){tone(105,75,.4,.13,'triangle');noise(.24,.07,450);}
  else if(kind==='bird'){tone(1700,2600,.085,.075);tone(2300,1600,.12,.07,'sine',.14);}
  else if(kind==='secure'){for(let i=0;i<3;i++)tone([523,659,784][i]!,[523,659,784][i]!, .28,.09,'sine',i*.12);}
  this.emitted++;this.kinds[kind]=(this.kinds[kind]??0)+1;
 }
 private route(source:AudioScheduledSourceNode,at:number,duration:number,amplitude:number,pan:number,input:AudioNode=source):void{
  const ctx=this.context!,gain=ctx.createGain(),panner=ctx.createStereoPanner();panner.pan.value=pan;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(amplitude,at+Math.min(.055,duration*.22));gain.gain.exponentialRampToValueAtTime(.0001,at+duration);input.connect(gain).connect(panner).connect(this.master!);this.voices.add(source);this.peakVoices=Math.max(this.peakVoices,this.voices.size);
  source.onended=()=>{source.disconnect();if(input!==source)input.disconnect();gain.disconnect();panner.disconnect();this.voices.delete(source);};source.start(at);source.stop(at+duration+.025);
 }
 private stopVoices():void{for(const source of this.voices)try{source.stop();}catch{} }
 snapshot(){return {available:!!this.context,state:this.context?.state??'locked',muted:this.muted,volume:this.volume,active:this.active,voices:this.voices.size,peakVoices:this.peakVoices,emitted:this.emitted,kinds:{...this.kinds},originalSynthesis:true};}
 dispose():void{if(this.disposed)return;this.disposed=true;this.active=false;this.enabled=false;this.events.abort();this.stopVoices();try{this.wind?.stop();}catch{}this.wind?.disconnect();this.windFilter?.disconnect();this.windGain?.disconnect();this.master?.disconnect();this.compressor?.disconnect();if(this.context)void this.context.close().catch(()=>{});this.noise=undefined;}
}
