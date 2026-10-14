/** Visual lineage is independent of rarity, growth and the existing Nature element. */
export type TemporaryDragonId='emberdrake'|'crystalwyvern'|'stormserpent'|'suncrest'|'moonveil'|'duneback';
export type DragonVariantId = 'mountain'|'meadow'|'frost'|'ashscale'|TemporaryDragonId;
export interface DragonVariantDefinition{label:string;family:'mountain'|'demon';file:string|null;body:number;wing:number;temporary?:TemporaryDragonId;}
// Stable saved lineage IDs. A validated replacement maps file/rig family here;
// null file deliberately uses its original authored temporary geometry.
export const dragonVariants:Readonly<Record<DragonVariantId,DragonVariantDefinition>> = {
  mountain:{label:'Mountain Dragon',family:'mountain',file:'mountain-family.glb',body:0xffffff,wing:0xffffff},
  meadow:{label:'Meadow Dragon',family:'mountain',file:'mountain-family.glb',body:0x9dc492,wing:0xd7cc8b},
  frost:{label:'Frostcrest Dragon',family:'mountain',file:'mountain-family.glb',body:0xb6dcec,wing:0xbacfe7},
  ashscale:{label:'Ashscale Dragon',family:'demon',file:'ashscale-family.glb',body:0xffffff,wing:0xffffff},
  emberdrake:{label:'Emberdrake',family:'mountain',file:null,temporary:'emberdrake',body:0xb6684e,wing:0xe7ad78},
  crystalwyvern:{label:'Crystalwyvern',family:'mountain',file:null,temporary:'crystalwyvern',body:0x8cc0d4,wing:0xc9e7ed},
  stormserpent:{label:'Stormserpent',family:'mountain',file:null,temporary:'stormserpent',body:0x7a90b7,wing:0xb3dce6},
  suncrest:{label:'Suncrest Dragon',family:'mountain',file:null,temporary:'suncrest',body:0xdab25f,wing:0xf3dd9b},
  moonveil:{label:'Moonveil Dragon',family:'mountain',file:null,temporary:'moonveil',body:0x8572a3,wing:0xc6a9d3},
  duneback:{label:'Duneback Dragon',family:'mountain',file:null,temporary:'duneback',body:0xb89969,wing:0xdfc293},
} as const;
export function validDragonVariant(value:unknown):value is DragonVariantId {return typeof value==='string'&&Object.hasOwn(dragonVariants,value);}
export function variantForNest(id:string):DragonVariantId {
  const added:Readonly<Record<string,TemporaryDragonId>>={dunes:'duneback',ember:'emberdrake',glacier:'crystalwyvern',moonwell:'moonveil',sunreach:'suncrest',stormspire:'stormserpent'};
  if(added[id])return added[id];
  if(id==='volcano'||id==='canyon')return 'ashscale';
  if(id==='frost'||id==='ruins')return 'frost';
  if(id==='highland'||id==='meadow')return 'meadow';
  return 'mountain';
}
export function variantLabel(id:DragonVariantId|undefined):string{return dragonVariants[id??'mountain'].label;}
