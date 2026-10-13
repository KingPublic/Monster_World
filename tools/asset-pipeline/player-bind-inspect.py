import sys,json
from pathlib import Path
from io_scene_fbx import parse_fbx
from mathutils import Matrix
ROOT=Path(__file__).resolve().parents[2]
tree,version=parse_fbx.parse(str(ROOT/'SOURCE_ASSETS/characters/player/stylized-cartoon-boy/FBX/Frank.fbx'))
objects=next(e for e in tree.elems if e.id==b'Objects');connections=next(e for e in tree.elems if e.id==b'Connections')
defs={e.props[0]:e for e in objects.elems if e.props};con=[list(c.props) for c in connections.elems];report=[]
for e in objects.elems:
 if e.id!=b'Deformer' or e.props[-1]!=b'Cluster':continue
 bone=next((defs[c[1]] for c in con if c[0]==b'OO' and c[2]==e.props[0] and defs.get(c[1]) and defs[c[1]].id==b'Model'),None)
 skin=next((c[2] for c in con if c[0]==b'OO' and c[1]==e.props[0]),None)
 geom=next((c[2] for c in con if c[0]==b'OO' and c[1]==skin),None)
 model=next((defs[c[2]] for c in con if c[0]==b'OO' and c[1]==geom and defs.get(c[2]) and defs[c[2]].id==b'Model'),None)
 data={n.id.decode():list(n.props[0]) for n in e.elems if n.id in [b'Transform',b'TransformLink']}
 report.append(dict(bone=bone.props[1].decode(errors='replace') if bone else None,mesh=model.props[1].decode(errors='replace') if model else None,**data))
(ROOT/'ASSET_WORK/reports/player-bind.json').write_text(json.dumps(report,indent=2));print('cluster binds',len(report));print(report[:3])
poses=[]
for e in objects.elems:
 if e.id==b'Pose':
  for n in e.elems:
   if n.id==b'PoseNode':
    data={c.id:c.props[0] for c in n.elems};o=defs.get(data.get(b'Node'));poses.append(dict(name=o.props[1].decode(errors='replace').split('\0')[0] if o else None,matrix=list(data[b'Matrix'])))
(ROOT/'ASSET_WORK/reports/player-pose-binds.json').write_text(json.dumps(poses,indent=2));print([(p['name'],p['matrix'][12:15]) for p in poses if p['name'] in ['CC_Base_Hip','CC_Base_Head','CC_Base_L_Upperarm','CC_Base_L_Thigh']])
