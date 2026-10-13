"""Blender non-destructive FBX/GLB inspector/converter. Output must be under ASSET_WORK.
blender --background --factory-startup --python tools/asset-pipeline/convert.py -- input output [--prepare]
"""
import bpy,sys,json,hashlib,os,math,tempfile
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
args=sys.argv[sys.argv.index('--')+1:];source=(ROOT/args[0]).resolve();dest=(ROOT/args[1]).resolve();prepare='--prepare' in args
assert source.is_relative_to(ROOT/'SOURCE_ASSETS')
assert dest.is_relative_to(ROOT/'ASSET_WORK') and dest.suffix=='.glb'
dest.parent.mkdir(parents=True,exist_ok=True)
tempdir=ROOT/'ASSET_WORK'/'temp';tempdir.mkdir(exist_ok=True);tempfile.tempdir=str(tempdir)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
if source.suffix.lower()=='.fbx':bpy.ops.import_scene.fbx(filepath=str(source),use_anim=True,ignore_leaf_bones=False)
elif source.suffix.lower() in ['.glb','.gltf']:bpy.ops.import_scene.gltf(filepath=str(source))
else:raise ValueError('Unsupported conversion format')
assetroot=source.parent
while assetroot.parent!=ROOT/'SOURCE_ASSETS' and not (assetroot/'ASSET_INFO.md').exists():assetroot=assetroot.parent
imagepaths={}
for p in assetroot.rglob('*'):
    if p.is_file() and p.suffix.lower() in ['.jpg','.jpeg','.png','.tga','.tif','.exr']:imagepaths.setdefault(p.name.lower(),[]).append(p)
fixes=[]
for image in list(bpy.data.images):
    if image.name=='Render Result':continue
    old=image.filepath;name=Path(old.replace('\\','/')).name.lower()
    if name in imagepaths:
        choices=imagepaths[name];p=next((p for p in choices if 'colors' not in p.as_posix().lower()),choices[0]);image.filepath=str(p);image.reload();fixes.append(dict(image=image.name,source=p.relative_to(ROOT).as_posix()))
materials=[]
for mat in bpy.data.materials:
    if not mat.use_nodes:mat.use_nodes=True
    shader=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if not shader:continue
    # FANTASTIC FBXs preserve material slots, but rely on engine material paths.
    if assetroot.name=='fantastic-village' and prepare:
        key=mat.name.split('.')[0].replace('M_','T_',1)
        aliases={'T_wall_01':'T_wall_02','T_wood_01':'T_wood_03','T_wood_02':'T_wood_03'}
        key=aliases.get(key,key)
        bc=next((p for p in assetroot.rglob('*.png') if p.stem.lower() in [key.lower()+'_bc',key.lower()]),None)
        if bc:
            node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=bpy.data.images.load(str(bc),check_existing=True);mat.node_tree.links.new(node.outputs['Color'],shader.inputs['Base Color']);fixes.append(dict(material=mat.name,albedo=bc.relative_to(ROOT).as_posix()))
            normal=bc.with_name(bc.name.replace('_BC','_N'))
            if normal!=bc and normal.exists():
                tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(normal),check_existing=True);tex.image.colorspace_settings.name='Non-Color';n=mat.node_tree.nodes.new('ShaderNodeNormalMap');mat.node_tree.links.new(tex.outputs['Color'],n.inputs['Color']);mat.node_tree.links.new(n.outputs['Normal'],shader.inputs['Normal'])
        else:fixes.append(dict(material=mat.name,issue='UNMAPPED; retain supplied base color'))
    if prepare:
        shader.inputs['Metallic'].default_value=min(.35,shader.inputs['Metallic'].default_value)
        shader.inputs['Roughness'].default_value=max(.45,shader.inputs['Roughness'].default_value)
    materials.append(dict(name=mat.name,images=[n.image.filepath for n in mat.node_tree.nodes if n.type=='TEX_IMAGE' and n.image]))
resized=[]
if prepare:
    for im in bpy.data.images:
        if im.size[0]>2048 or im.size[1]>2048:
            size=tuple(im.size);ratio=2048/max(size);im.scale(round(size[0]*ratio),round(size[1]*ratio));resized.append(dict(name=im.name,before=size,after=tuple(im.size)))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];arms=[o for o in bpy.context.scene.objects if o.type=='ARMATURE']
report=dict(source=source.relative_to(ROOT).as_posix(),source_hash=hashlib.sha256(source.read_bytes()).hexdigest(),prepare=prepare,materials=materials,fixes=fixes,resizing=resized,
 meshes=[dict(name=o.name,triangles=sum(len(p.vertices)-2 for p in o.data.polygons),vertices=len(o.data.vertices),morphs=[k.name for k in o.data.shape_keys.key_blocks] if o.data.shape_keys else [],weights=sum(len(v.groups) for v in o.data.vertices),weighted_groups=[g.name for g in o.vertex_groups if any(any(x.group==g.index and x.weight>0 for x in v.groups) for v in o.data.vertices)],bounds=[list(min((o.matrix_world@Vector(c))[a] for c in o.bound_box) for a in range(3)),list(max((o.matrix_world@Vector(c))[a] for c in o.bound_box) for a in range(3))]) for o in meshes],
 armatures=[dict(name=o.name,bones=[dict(name=b.name,parent=b.parent.name if b.parent else None,deform=b.use_deform,head=list(b.head_local),tail=list(b.tail_local)) for b in o.data.bones]) for o in arms],
 actions=[dict(name=a.name,frames=list(a.frame_range),duration=(a.frame_range[1]-a.frame_range[0])/bpy.context.scene.render.fps) for a in bpy.data.actions],fps=bpy.context.scene.render.fps)
for o in list(bpy.context.scene.objects):
    if o.type in ['CAMERA','LIGHT']:bpy.data.objects.remove(o,do_unlink=True)
# Save importer evidence even if export fails (Blender otherwise can exit zero).
dest.with_suffix('.inspection.json').write_text(json.dumps(report,indent=2),encoding='utf8')
# No geometry simplification on rigs. Export all source actions, weights and morphs.
bpy.ops.export_scene.gltf(filepath=str(dest),export_format='GLB',export_animations=True,export_animation_mode='ACTIONS',export_force_sampling=False,export_skins=True,export_morph=True,export_yup=True,export_image_format='AUTO',export_keep_originals=False)
report.update(output=dest.relative_to(ROOT).as_posix(),output_hash=hashlib.sha256(dest.read_bytes()).hexdigest(),output_bytes=dest.stat().st_size,settings=dict(texture_max=2048 if prepare else 'source',geometry_simplification=False,rig_morphs_preserved=True,exporter=bpy.app.version_string))
dest.with_suffix('.conversion.json').write_text(json.dumps(report,indent=2),encoding='utf8');print('CONVERSION_REPORT',str(dest.with_suffix('.conversion.json')),flush=True)
