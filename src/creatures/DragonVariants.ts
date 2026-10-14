import type { RuntimeAssets } from '../systems/RuntimeAssets';
import { dragonVariants } from '../config/dragonVariants';
import type { DragonVariantId } from '../config/dragonVariants';
import type { DragonForm } from './ProceduralDragon';
import { RideableDragon } from './RideableDragon';
import type { DragonVisual } from './RideableDragon';
import {AdventureDragon} from './AdventureDragon';
export function createDragonVisual(assets:RuntimeAssets,variant:DragonVariantId,onFailure:(message:string)=>void,form:DragonForm):DragonVisual {
 const definition=dragonVariants[variant];
 if(definition.file===null&&definition.temporary)return new AdventureDragon(form,definition.temporary);
 if(!definition.file)throw new Error('Dragon lineage has no validated renderer: '+variant);
 const file=variant==='ashscale'&&form==='Guardian'?'ashscale-lod1.glb':definition.file;
 return new RideableDragon(assets,(import.meta.env?.BASE_URL??'/')+'assets/models/dragons/'+file,onFailure,form,{family:definition.family==='demon'?'Ashscale':'Mountain',body:definition.body,wing:definition.wing,variant});
}
