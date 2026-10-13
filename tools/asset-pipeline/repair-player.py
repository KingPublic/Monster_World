"""Reconcile inconsistent per-mesh FBX bind scales into a single canonical rig.
Original coordinates/morph deltas are mapped using each vertex's weighted bind transforms.
No source writes. Run in Blender before visual/animation validation.
"""
import bpy,json,sys,tempfile,hashlib
from pathlib import Path
from mathutils import Matrix,Vector
from io_scene_fbx import parse_fbx
ROOT=Path(__file__).resolve().parents[2];SOURCE=ROOT/'SOURCE_ASSETS/characters/player/stylized-cartoon-boy/FBX/Frank.fbx';OUT=ROOT/'ASSET_WORK/characters/cartoon-boy-repaired.glb'
tempfile.tempdir=str(ROOT/'ASSET_WORK/temp')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.ops.import_scene.fbx(filepath=str(SOURCE));bpy.context.view_layer.update()
tree,_=parse_fbx.parse(str(SOURCE));objs=next(e for e in tree.elems if e.id==b'Objects');cons=[c.props for c in next(e for e in tree.elems if e.id==b'Connections').elems];defs={e.props[0]:e for e in objs.elems if e.props}
def name(e):return e.props[1].decode(errors='replace').split('\0')[0]
def matrix(values):return Matrix([values[i:i+4] for i in range(0,16,4)]).transposed()
clusters={};canonical={};parents={}
for e in objs.elems:
 if e.id==b'Model':
  parent=next((defs[c[2]] for c in cons if c[0]==b'OO' and c[1]==e.props[0] and c[2] in defs and defs[c[2]].id==b'Model'),None)
  parents[name(e)]=name(parent) if parent else None
 if e.id!=b'Deformer' or e.props[-1]!=b'Cluster':continue
 bone=next((defs[c[1]] for c in cons if c[0]==b'OO' and c[2]==e.props[0] and c[1] in defs and defs[c[1]].id==b'Model'),None)
 skin=next((c[2] for c in cons if c[0]==b'OO' and c[1]==e.props[0]),None);geom=next((c[2] for c in cons if c[0]==b'OO' and c[1]==skin),None)
 mesh=next((defs[c[2]] for c in cons if c[0]==b'OO' and c[1]==geom and c[2] in defs and defs[c[2]].id==b'Model'),None)
 if not bone or not mesh:continue
 data={n.id:n.props[0] for n in e.elems};link=matrix(data[b'TransformLink']);bind=link@matrix(data[b'Transform']);bn=name(bone);mn=name(mesh)
 clusters.setdefault(mn,{})[bn]=(link,bind)
 # Body owns the primary full-size rest bind; other meshes fill facial/accessory joints.
 score=1000 if mn=='CC_Base_Body' else sum(link.to_scale())
 if bn not in canonical or score>canonical[bn][0]:canonical[bn]=(score,link)
# The final complete FBX BindPose describes the clothing's common skeleton.
# Its authored actor scale (17.620477) reconciles the centimeter body and garments.
original_canonical={bn:m.copy() for bn,(_,m) in canonical.items()}
poses={}
for e in objs.elems:
 if e.id==b'Pose':
  for n in e.elems:
   if n.id!=b'PoseNode':continue
   data={c.id:c.props[0] for c in n.elems};node=defs.get(data.get(b'Node'))
   if node and name(node) in canonical:poses[name(node)]=matrix(data[b'Matrix'])
for bn,m in poses.items():canonical[bn]=(2000,Matrix.Scale(17.620477,4)@m)
# Facial parts contain centimeter BindPose records mixed with the clothing's
# actor-space poses. Map their original full-size links relative to the head.
head_delta=canonical['CC_Base_Head'][1]@original_canonical['CC_Base_Head'].inverted_safe()
for bn,m in original_canonical.items():
 if any(part in bn for part in ['Eye','Teeth','Tongue']):canonical[bn]=(3000,head_delta@m)
# One left-leg Pose record puts thigh twist joints at the calf/ankle.
# Reconcile twist/share positions with the main joints, matching the right leg.
for side in ['L','R']:
 prefix='CC_Base_'+side+'_'
 thigh=canonical[prefix+'Thigh'][1].translation;calf=canonical[prefix+'Calf'][1].translation;foot=canonical[prefix+'Foot'][1].translation
 for part,position in [('ThighTwist01',thigh),('ThighTwist02',(thigh+calf)/2),('CalfTwist01',calf),('CalfTwist02',(calf+foot)/2),('KneeShareBone',calf)]:
  canonical[prefix+part][1].translation=position
axis=Matrix.Rotation(3.141592653589793/2,4,'X');unit=Matrix.Scale(.01,4);world=unit@axis
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];history=[]
for o in meshes:
 if o.name=='Skate_Board':bpy.data.objects.remove(o,do_unlink=True);history.append('Omitted optional skateboard from gameplay derivative');continue
 mapping=clusters.get(o.name,{})
 transforms={n:world@canonical[n][1]@link.inverted_safe()@bind for n,(link,bind) in mapping.items() if n in canonical}
 group_names={g.index:g.name for g in o.vertex_groups}
 # Transform every shape key using identical weighted matrices, preserving morph behavior.
 def mapped(co,v):
  result=Vector((0,0,0));total=0
  for weight in v.groups:
   m=transforms.get(group_names[weight.group])
   if m is not None and weight.weight>0:result+=(m@co)*weight.weight;total+=weight.weight
  return result/total if total else o.matrix_world@co
 if o.data.shape_keys:
  for key in o.data.shape_keys.key_blocks:
   for v,k in zip(o.data.vertices,key.data):k.co=mapped(k.co.copy(),v)
 else:
  for v in o.data.vertices:v.co=mapped(v.co.copy(),v)
 o.parent=None;o.matrix_world=Matrix.Identity(4)
 for mod in list(o.modifiers):
  if mod.type=='ARMATURE':o.modifiers.remove(mod)
for o in list(bpy.context.scene.objects):
 if o.type=='ARMATURE':bpy.data.objects.remove(o,do_unlink=True)
armdata=bpy.data.armatures.new('CartoonBoyCanonicalRig');arm=bpy.data.objects.new('CartoonBoyRig',armdata);bpy.context.collection.objects.link(arm);bpy.context.view_layer.objects.active=arm;arm.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
for bn,(_,m) in canonical.items():
 b=armdata.edit_bones.new(bn);wm=world@m;b.head=wm.translation;b.tail=b.head+wm.to_3x3().normalized()@Vector((0,.04,0));b.matrix=wm.normalized();b.length=.04
for bn,b in armdata.edit_bones.items():
 parent=parents.get(bn)
 if parent and parent in armdata.edit_bones:b.parent=armdata.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
for o in [o for o in bpy.context.scene.objects if o.type=='MESH']:
 o.parent=arm;mod=o.modifiers.new('CanonicalSkin','ARMATURE');mod.object=arm
root=SOURCE.parent.parent
paths={}
for p in root.rglob('*'):
 if p.is_file() and p.suffix.lower() in ['.png','.jpg','.jpeg']:paths.setdefault(p.name.lower(),[]).append(p)
for im in bpy.data.images:
 filename=Path(im.filepath.replace('\\','/')).name.lower()
 if filename in paths:
  p=next((p for p in paths[filename] if 'Colors' not in p.parts),paths[filename][0]);im.filepath=str(p);im.reload()
 if max(im.size)>1024 and im.name!='Render Result':
  ratio=1024/max(im.size);im.scale(round(im.size[0]*ratio),round(im.size[1]*ratio))
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 shader=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if shader:shader.inputs['Roughness'].default_value=.65;shader.inputs['Metallic'].default_value=0
for o in list(bpy.context.scene.objects):
 if o.type in ['CAMERA','LIGHT']:bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.export_scene.gltf(filepath=str(OUT),export_format='GLB',export_animations=False,export_skins=True,export_morph=True,export_yup=True)
OUT.with_suffix('.conversion.json').write_text(json.dumps(dict(source=SOURCE.relative_to(ROOT).as_posix(),source_hash=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),output=OUT.relative_to(ROOT).as_posix(),output_hash=hashlib.sha256(OUT.read_bytes()).hexdigest(),output_bytes=OUT.stat().st_size,joints=len(canonical),changes=['Canonical skin rebinding from original per-mesh cluster TransformLink @ Transform','Vertex and morph positions mapped by original weights','Texture relinking and 1K working texture copies']+history,authored_clips=0,source_clips=0),indent=2));print('REPAIRED',OUT)
