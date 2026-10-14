import type { RuntimeAssets } from '../systems/RuntimeAssets';
import { dragonVariants } from '../config/dragonVariants';
import type { DragonVariantId } from '../config/dragonVariants';
import type { DragonForm } from './ProceduralDragon';
import { RideableDragon } from './RideableDragon';
import type { DragonVisual } from './RideableDragon';
export function createDragonVisual(assets:RuntimeAssets,variant:DragonVariantId,onFailure:(message:string)=>void,form:DragonForm):DragonVisual {
 const definition=dragonVariants[variant];
 const file=variant==='ashscale'&&form==='Guardian'?'ashscale-lod1.glb':definition.file;
 return new RideableDragon(assets,(import.meta.env?.BASE_URL??'/')+'assets/models/dragons/'+file,onFailure,form,{family:definition.family==='demon'?'Ashscale':'Mountain',body:definition.body,wing:definition.wing,variant});
}
