/** Visual lineage is independent of rarity, growth and the existing Nature element. */
export type DragonVariantId = 'mountain'|'meadow'|'frost'|'ashscale';
export const dragonVariants = {
  mountain:{label:'Mountain Dragon',family:'mountain',file:'mountain-family.glb',body:0xffffff,wing:0xffffff},
  meadow:{label:'Meadow Dragon',family:'mountain',file:'mountain-family.glb',body:0x9dc492,wing:0xd7cc8b},
  frost:{label:'Frostcrest Dragon',family:'mountain',file:'mountain-family.glb',body:0xb6dcec,wing:0xbacfe7},
  ashscale:{label:'Ashscale Dragon',family:'demon',file:'ashscale-family.glb',body:0xffffff,wing:0xffffff},
} as const;
export function validDragonVariant(value:unknown):value is DragonVariantId {return typeof value==='string'&&Object.hasOwn(dragonVariants,value);}
export function variantForNest(id:string):DragonVariantId {
  if(id==='volcano'||id==='canyon')return 'ashscale';
  if(id==='frost'||id==='ruins')return 'frost';
  if(id==='highland'||id==='meadow')return 'meadow';
  return 'mountain';
}
export function variantLabel(id:DragonVariantId|undefined):string{return dragonVariants[id??'mountain'].label;}
