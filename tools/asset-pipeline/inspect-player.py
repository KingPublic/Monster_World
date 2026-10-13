import bpy,json
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[2];bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.ops.import_scene.fbx(filepath=str(root/'SOURCE_ASSETS/characters/player/stylized-cartoon-boy/FBX/Frank.fbx'));bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();out=[]
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 e=o.evaluated_get(deps);m=e.to_mesh();points=[e.matrix_world@v.co for v in m.vertices];out.append(dict(name=o.name,location=list(o.location),scale=list(o.scale),parent=o.parent.name if o.parent else None,matrix=[list(r) for r in o.matrix_world],local_bounds=[list(min(v.co[a] for v in o.data.vertices) for a in range(3)),list(max(v.co[a] for v in o.data.vertices) for a in range(3))],evaluated_bounds=[list(min(v[a] for v in points) for a in range(3)),list(max(v[a] for v in points) for a in range(3))]));e.to_mesh_clear()
(root/'ASSET_WORK/reports/player-transforms.json').write_text(json.dumps(out,indent=2));print([(o['name'],o['scale'],o['evaluated_bounds']) for o in out])
