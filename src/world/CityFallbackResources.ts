import{Mesh}from'three';import type{BufferGeometry,Material,Object3D}from'three';
/** Procedural fallbacks borrow Parts resources from each other. Release only
 * after the final remaining city user is gone; cache-owned GLBs are untouched. */
export function releaseCityFallbacks(city:Object3D,removed:readonly Object3D[]):void{
 const geometries=new Set<BufferGeometry>(),materials=new Set<Material>();
 for(const root of removed)root.traverse(n=>{if(n instanceof Mesh){geometries.add(n.geometry);for(const m of Array.isArray(n.material)?n.material:[n.material])materials.add(m);}});
 city.traverse(n=>{if(n instanceof Mesh){geometries.delete(n.geometry);for(const m of Array.isArray(n.material)?n.material:[n.material])materials.delete(m);}});
 for(const g of geometries)g.dispose();for(const m of materials)m.dispose();
}
