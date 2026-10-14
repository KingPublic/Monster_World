const desktop={maxPixelRatio:1.5,shadowSize:2048,maxResidents:20,eggDistance:1100,guardianDistance:1900}as const;
const mobile={maxPixelRatio:1,shadowSize:1024,maxResidents:12,eggDistance:750,guardianDistance:1250}as const;
export function renderProfile(coarse:boolean){return coarse?mobile:desktop;}
export const currentRenderProfile=renderProfile(typeof window!=='undefined'&&window.matchMedia('(any-pointer: coarse)').matches);
