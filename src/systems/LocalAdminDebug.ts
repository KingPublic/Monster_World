/** Local development opt-in, not account authentication. Never use this as
 * authorization for an online server; production is gated separately by DEV. */
export function localAdminDebug(hostname:string,search:string):boolean{
 return ['127.0.0.1','localhost','[::1]'].includes(hostname)&&new URLSearchParams(search).get('debug')==='1';
}
