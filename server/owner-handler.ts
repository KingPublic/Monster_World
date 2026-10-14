import {cookieName,clearSessionCookie,csrfToken,issueSession,ownerActions,ownerActionAllowed,ownerNameMatches,readSessionCookie,sameOrigin,sessionCookie,validCsrf,verifyPassword,verifySession}from'./owner-auth';
import type{OwnerConfig}from'./owner-auth';
import{ownerLoginPage}from'./owner-page';
const baseHeaders={'Cache-Control':'private, no-store, max-age=0','Vercel-CDN-Cache-Control':'no-store','CDN-Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'};
const respond=(status:number,body:unknown=null,extra:Record<string,string>={})=>new Response(body===null?null:JSON.stringify(body),{status,headers:{...baseHeaders,...(body===null?{}:{'Content-Type':'application/json'}),...extra}});
// A small per-instance backstop supplements the production edge rate limit.
const failures=new Map<string,{count:number;until:number}>();
async function bodyWithinLimit(request:Request):Promise<Record<string,unknown>|null>{
 if((request.headers.get('content-type')??'').split(';')[0]!=='application/json'||Number(request.headers.get('content-length'))>4096)return null;
 const reader=request.body?.getReader();if(!reader)return null;const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return null;}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}const value=JSON.parse(new TextDecoder().decode(bytes));return value&&typeof value==='object'&&!Array.isArray(value)?value:null;}catch{return null;}
}
export async function handleOwnerRequest(request:Request,config:OwnerConfig|null,now=Math.floor(Date.now()/1000)):Promise<Response>{
 if(!config)return respond(404);
 const url=new URL(request.url);if(url.protocol!=='https:')return respond(404);
 const session=verifySession(readSessionCookie(request),config,now);
 if(request.method==='GET'){
  if(session)return respond(200,{title:'Admin '+config.user,csrf:csrfToken(session,config),expiresAt:session.exp,actions:ownerActions});
  if(url.searchParams.get('entry')===config.entry){const page=ownerLoginPage();return new Response(page.html,{headers:{...baseHeaders,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':page.policy}});}
  return respond(404);
 }
 if(request.method!=='POST')return respond(405,null,{Allow:'GET, POST'});
 if(!sameOrigin(request))return respond(403);
 const data=await bodyWithinLimit(request);if(!data)return respond(400);
 if(data.operation==='login'){
  const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()??'local';
  const key=ip,limit=failures.get(key);if(limit&&limit.until>now&&limit.count>=5)return respond(429,null,{'Retry-After':String(limit.until-now)});
  if(typeof data.username!=='string'||data.username.length>100||typeof data.password!=='string'||data.password.length>1024)return respond(401);
  const passwordOK=await verifyPassword(data.password,config.passwordHash),nameOK=ownerNameMatches(data.username,config);
  if(!passwordOK||!nameOK){if(failures.size>1024)for(const[k,v]of failures)if(v.until<=now)failures.delete(k);if(failures.size>=2048)failures.delete(failures.keys().next().value!);failures.set(key,{count:limit&&limit.until>now?limit.count+1:1,until:limit&&limit.until>now?limit.until:now+300});return respond(401);}
  failures.delete(key);return respond(200,{ok:true},{'Set-Cookie':sessionCookie(issueSession(config,now))});
 }
 if(!session)return respond(404);
 if(!validCsrf(data.csrf,session,config))return respond(403);
 if(data.operation==='logout')return respond(200,{ok:true},{'Set-Cookie':clearSessionCookie()});
 if(data.operation==='command'&&ownerActionAllowed(data.action))return respond(200,{action:data.action});
 return respond(400);
}
export{cookieName};
