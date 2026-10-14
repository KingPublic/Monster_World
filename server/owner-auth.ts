import {createHash,createHmac,randomBytes,scrypt,timingSafeEqual} from 'node:crypto';
export const sessionSeconds=8*3600;
export const cookieName='__Host-mw_owner';
export interface OwnerConfig{user:string;passwordHash:string;key:string;entry:string;}
export interface OwnerSession{sub:string;iat:number;exp:number;nonce:string;}
const derive=(password:string,salt:string)=>new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,64,{N:16384,r:8,p:1,maxmem:64*1024*1024},(error,hash)=>error?reject(error):resolve(hash)));
const encode=(value:string|Buffer)=>Buffer.from(value).toString('base64url');
const equal=(a:string,b:string)=>timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());
const mac=(value:string,key:string)=>createHmac('sha256',key).update(value).digest('base64url');
export function createOwnerConfig(env:Record<string,string|undefined>):OwnerConfig|null{
 const user=env.MW_OWNER_USER,passwordHash=env.MW_OWNER_PASSWORD_HASH,key=env.MW_OWNER_SESSION_KEY,entry=env.MW_OWNER_ENTRY;
 if(!user||user.length>100||!passwordHash||!/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(passwordHash)||!key||key.length<48||!entry||entry.length<24)return null;
 return{user,passwordHash,key,entry};
}
export async function hashPassword(password:string):Promise<string>{const salt=randomBytes(16).toString('hex'),hash=await derive(password,salt);return'scrypt$'+salt+'$'+hash.toString('hex');}
export async function verifyPassword(password:string,encoded:string):Promise<boolean>{
 if(typeof password!=='string'||Buffer.byteLength(password)>1024||!/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(encoded))return false;
 const[,salt,expected]=encoded.split('$'),actual=await derive(password,salt!);
 return timingSafeEqual(actual,Buffer.from(expected!,'hex'));
}
export function ownerNameMatches(name:string,config:OwnerConfig):boolean{return equal(name,config.user);}
export function issueSession(config:OwnerConfig,now=Math.floor(Date.now()/1000)):string{
 const payload=encode(JSON.stringify({sub:config.user,iat:now,exp:now+sessionSeconds,nonce:randomBytes(24).toString('base64url')}));return payload+'.'+mac('session|'+payload,config.key);
}
export function verifySession(token:string|undefined,config:OwnerConfig,now=Math.floor(Date.now()/1000)):OwnerSession|null{
 if(!token||token.length>2048)return null;const parts=token.split('.');if(parts.length!==2||!equal(parts[1]!,mac('session|'+parts[0],config.key)))return null;
 try{const s=JSON.parse(Buffer.from(parts[0]!,'base64url').toString('utf8'))as OwnerSession;
  return typeof s.sub==='string'&&equal(s.sub,config.user)&&Number.isSafeInteger(s.iat)&&Number.isSafeInteger(s.exp)&&s.iat<=now+30&&s.exp===s.iat+sessionSeconds&&s.exp>now&&typeof s.nonce==='string'&&/^[A-Za-z0-9_-]{32}$/.test(s.nonce)?s:null;
 }catch{return null;}
}
export function readSessionCookie(request:Request):string|undefined{const values=(request.headers.get('cookie')??'').split(';').map(v=>v.trim()).filter(v=>v.startsWith(cookieName+'='));return values.length===1?values[0]!.slice(cookieName.length+1):undefined;}
export function sessionCookie(token:string):string{return cookieName+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+sessionSeconds;}
export function clearSessionCookie():string{return cookieName+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';}
export function csrfToken(session:OwnerSession,config:OwnerConfig):string{return mac('csrf|'+session.sub+'|'+session.nonce+'|'+session.exp,config.key);}
export function validCsrf(token:unknown,session:OwnerSession,config:OwnerConfig):boolean{return typeof token==='string'&&token.length<256&&equal(token,csrfToken(session,config));}
export function sameOrigin(request:Request):boolean{try{return new URL(request.url).protocol==='https:'&&request.headers.get('origin')===new URL(request.url).origin&&['same-origin','none',null].includes(request.headers.get('sec-fetch-site'));}catch{return false;}}
export const ownerActions=[
 {id:'home',label:'Sanctuary'},
 {id:'forest',label:'Forest Nest'},{id:'highland',label:'Highland Nest'},{id:'volcano',label:'Volcanic Nest'},{id:'frost',label:'Frost Summit'},
 {id:'meadow',label:'Wildflower Meadow'},{id:'canyon',label:'Amber Canyon'},{id:'marsh',label:'Reedwater Nest'},{id:'ruins',label:'Moonstone Ruins'},
 {id:'dunes',label:'Golden Dunes'},{id:'ember',label:'Emberfall Crater'},{id:'glacier',label:'Crystal Crown'},{id:'moonwell',label:'Moonveil Grove'},{id:'sunreach',label:'Suncrest Temple'},{id:'stormspire',label:'Stormspire'},
 {id:'hatchery',label:'Hatchery'},{id:'mount',label:'Mount court'},{id:'horse',label:'Horse'},{id:'shop',label:'Food Shop'},
 {id:'coins',label:'+500 Coins'},{id:'food',label:'+5 Food'},{id:'legendary-egg',label:'Legendary Egg'},{id:'mythical-egg',label:'Mythical Egg'},{id:'time',label:'Egg respawn ×60'},
]as const;
export function ownerActionAllowed(action:unknown):action is string{return typeof action==='string'&&ownerActions.some(a=>a.id===action);}
