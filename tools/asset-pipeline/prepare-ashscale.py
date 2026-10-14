"""New derivative only; original downloaded source and Mountain remain untouched."""
import bpy, sys, json, hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[2]
source=root/'SOURCE_ASSETS/dragons/demon-dragon/demon_dragon_full_texture.glb'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
before={o.name:sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes}
actions=[{'name':a.name,'frames':list(a.frame_range)} for a in bpy.data.actions]
for im in bpy.data.images:
    if max(im.size)>1024: im.scale(1024,1024)
for mat in bpy.data.materials:
    if mat.use_nodes:
        shader=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
        if shader: shader.inputs['Metallic'].default_value=0;shader.inputs['Roughness'].default_value=.8
report={'source':str(source.relative_to(root)),'sourceHash':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceTriangles':before,'actions':actions,'blender':bpy.app.version_string,'lods':[]}
for label,ratio in [('family',.17),('lod1',.07)]:
    for o in meshes:
        bpy.context.view_layer.objects.active=o
        m=o.modifiers.new('DerivativeCollapse','DECIMATE');m.ratio=ratio if label=='family' else .07/.17
        # Collapse on the original bind geometry; Armature modifier stays intact.
        bpy.ops.object.modifier_move_up(modifier=m.name)
        bpy.ops.object.modifier_apply(modifier=m.name)
    out=root/f'ASSET_WORK/iteration2/ashscale-{label}.glb'
    bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',export_animations=True,export_animation_mode='ACTIONS',export_force_sampling=False,export_skins=True,export_yup=True,export_image_format='AUTO')
    report['lods'].append({'file':out.name,'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes),'bytes':out.stat().st_size,'hash':hashlib.sha256(out.read_bytes()).hexdigest(),'vertices':sum(len(o.data.vertices) for o in meshes)})
(root/'ASSET_WORK/iteration2/ashscale-conversion.json').write_text(json.dumps(report,indent=2))
