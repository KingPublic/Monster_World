"""Generate durable Phase 2 decisions from measured evidence and reviewed QA."""
from pathlib import Path
import json,re,statistics
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'ASSET_WORK/reports';DOC=ROOT/'DOCS/TECHNICAL'
audit=json.loads((WORK/'source-audit.json').read_text(encoding='utf8'));byid={a['asset']:a for a in audit};promoted=json.loads((WORK/'promoted-assets.json').read_text(encoding='utf8'))
def read(name):return json.loads((WORK/name).read_text(encoding='utf8'))
def write(path,text):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text.rstrip()+'\n',encoding='utf8')
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(str(v).replace('|','\\|').replace('\n','<br>') for v in row)+' |' for row in rows)+'\n'
# Technical status, gameplay status and usage are separate judgements.
rows=[
('stylized-cartoon-boy','Main player','FBX','100 hierarchy bones; weighted skin; 75 morph channels','0 source','PASS repaired bind, clothing/eyes and 11 authored pose states × 3 angles','READY_GLB derived','INTEGRATED_LOCAL','TurboSquid Standard recorded; user supplied','Source bind transforms inconsistent; no baked motion; further pose/art polish'),
('traveler','Wandering NPC','GLB + BLEND','45 joints; weighted skin','1','PASS model and Walk samples','READY_GLB; needs runtime preparation','AUDIT_ONLY','maxpanysh / CC BY 4.0 recorded','Future NPC integration outside scope; no idle/service animation'),
('knight-of-tomorrow','Guard / important NPC','GLB','120 joints; weighted skin','1','PASS model and Action.001 deformation','READY_GLB; NEEDS_OPTIMIZATION','AUDIT_ONLY','Kondrashov Anton / CC BY 4.0 recorded','65,502 triangles and one generic action; retargeting/action meaning UNKNOWN'),
('horse','Ambient only','FBX','676 hierarchy/helper nodes; weighted skin; not 676 independent deform joints','2','PASS source/derived individual movement samples','NEEDS_OPTIMIZATION','AUDIT_ONLY','WildMesh 3D / CC BY-NC 4.0 recorded','82,426 triangles; noncommercial restriction; never a mount'),
('mountain-dragon','Rideable Young visual','GLB','95 joints, 2 skins; weighted wings/head/neck/tail/legs','1','PASS source/derived, montage, actual flight and rider/carry','READY_GLB derived','INTEGRATED_LOCAL','Alexey / CC BY 4.0; attribution retained','One unsplit take; authored motion; no matching Baby; 18.6 MB load'),
('tarisland-dragon','Future rideable species / reference','FBX','155 hierarchy bones; real skin deformation','27','PASS all 27 normalized takes; root motion needs reconciliation','NEEDS_FBX_TO_GLB + NEEDS_MANUAL_REVIEW','BLOCKED','Tencent ownership; uploader noncommercial + PG13; conflicting generic CC label','Blender export attempt stalled; rights unresolved; absolute action timelines'),
('bernardo-dragon','Future rideable species','FBX','107 derived joints; source loader 419 includes helpers','2 source stacks','PARTIAL source texture paths fail; 2 derived actions deform','NEEDS_TEXTURE_RELINK + NEEDS_LOD','BLOCKED','Bernardo Ferreira Baptista / CC BY 4.0 recorded','258,960 triangles; UDIM/name mismatch; generic actions need mapping'),
('chinese-dragon','Future rideable species','FBX','180 source helper nodes / 183 derived joints; naming ambiguous','1 stack; 0 Three source clips','PARTIAL; missing eye texture; 103 derived fragments individually sampled','NEEDS_MATERIAL_FIX + NEEDS_MANUAL_REVIEW','BLOCKED','MAXDESIGN-3D / CC BY 4.0 recorded','103 fragments are not 103 supplied actions; reconstruct take, relink eyes, verify anchors'),
('demon-dragon','Future rideable species','GLB + BLEND','220 joints; weighted skin','3','PASS individual Fly/Idle/Run deformation','READY_GLB + NEEDS_LOD','AUDIT_ONLY','endlessvoidmc / CC BY 4.0 recorded','312,670 triangles; silhouette/material fit and LOD before gameplay'),
('wyvern-animated','Future rideable species','FBX + GLB','181 GLB joints, 4 skins; FBX 277 hierarchy/helper nodes','11','FAIL assembled visual: detached components/bind defects despite changing skins','NEEDS_MANUAL_REVIEW + NEEDS_MATERIAL_FIX','BLOCKED','User supplied Fab package; exact license/creator UNKNOWN','Repair skin/bind and retest all components; optimized copy not promoted'),
('wyvern-fishing','Future Dragon; static reference currently','FBX + GLB','0 usable skin/joints in supplemental GLB','0 skeletal; FBX 154 object/camera takes','PASS static visual; no skeletal flight proof','NEEDS_MANUAL_REVIEW','BLOCKED','Benoit Gagnier + cebraVFX shark / CC BY 4.0 recorded','60,304 triangles; requires actual rig/flight motion and removing fishing props for a runtime variant'),
('fantastic-village','Sanctuary style anchor','602 FBX files','No skeletal rig on selected modules','0 usable skeletal','PASS curated modules after material alias relink','READY_GLB selected subset','INTEGRATED_LOCAL','Tidal Flask Studios; listing Allows usage with AI: No; terms unresolved','Only selected render files; do not load collision/LOD/engine variants together; verify external-use terms'),
('fantasy-market','Sanctuary Food Shop','9 GLB files','Static modular stalls/layout','0','PASS V01 source/derived and functional Food Shop','READY_GLB selected V01','INTEGRATED_LOCAL','User supplied Fab package; exact license/creator UNKNOWN','README count differs from actual instances; other stalls unpromoted; usage verification pending'),
('fantasy-castle','Sanctuary landmark candidate','FBX','Static; no usable skeleton','0','PARTIAL black source material; derived relink comparison available','NEEDS_MATERIAL_FIX + NEEDS_LOD','AUDIT_ONLY','Hawtor Studio / CC BY 4.0 recorded','254,997 binary/export triangles vs 254,988 Three triangulation; huge texture output, split landmark'),
('grand-fantasy-castle','Sanctuary landmark candidate','GLB','Static single mesh','0','PASS appearance, excessive density','NEEDS_LOD + NEEDS_OPTIMIZATION','AUDIT_ONLY','Hamanzz / CC BY 4.0 recorded','1,981,608 triangles in one mesh; manual splitting and silhouette-preserving LOD'),
('medieval-village-scene','Sanctuary secondary set','FBX','Static scene; no usable skeleton','0 skeletal','PARTIAL source atlas dependency mismatch; derived preview available','NEEDS_TEXTURE_RELINK + NEEDS_LOD','AUDIT_ONLY','Speed / CC BY 4.0 recorded','255,453 triangles / 36 meshes; source filename differs from requested atlas'),
('medieval-village-houses','Outskirts building reference','GLB + OBJ','Static 12 meshes','0','PASS appearance; very dense','NEEDS_LOD + NEEDS_OPTIMIZATION','AUDIT_ONLY','Abid7465 / CC BY 4.0 recorded','945,316 triangles; separate houses and lightweight collisions before placement'),
('sky-temple','Future region reference','GLB + DAE','Static 69 meshes','0','PASS GLB appearance','READY_GLB + NEEDS_OPTIMIZATION','AUDIT_ONLY','kylien / CC BY 4.0 recorded','56,198 triangles; many textures/material draws; no new region authorized'),
('stone-pathway','Sanctuary road material','GLTF + BIN + BLEND; PNG/JPG/EXR maps','Static high-poly preview only','0','PASS source preview and actual runtime material','READY_GLTF maps; READY runtime material','INTEGRATED_LOCAL','Amal Kumar / Poly Haven CC0 recorded','107,390-triangle preview excluded; correct 16-bit AO normalization; no blanket displacement'),
]
byrow={r[0]:r for r in rows}
intro='''# Phase 2 asset validation — 2026-10-09

All 19 downloaded sources have been audited from actual files: 635 model/editable files, including 602 individual FANTASTIC Village FBXs. Every acquisition metadata record was read. Acquisition PASS is retained as extraction evidence; it does not establish animation, visual quality, gameplay readiness or usage permission. Original archives were previously removed with user approval; no replacements or downloads were made.

`READY_GLB/READY_GLTF` describes the inspected format or the explicitly selected derived variant. `INTEGRATED_LOCAL` means it is used in this playable local milestone. `AUDIT_ONLY` means inspected but not part of gameplay. `BLOCKED` means a concrete conversion/rig/rights issue prevents promotion. Flags can coexist. Usage text is transcribed from acquired metadata, with unresolved terms retained; this report does not certify release rights.

All 1,092 protected files (SOURCE_ASSETS, all REFERENCES, historical Nature GLB) matched their initial SHA-256 snapshot. The preserved Nature GLB is 5,236,028 bytes, SHA-256 `b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615`. No source write, Git staging/commit/push/PR/deployment or framework migration was performed.

## Decisions for every downloaded source

'''
validation=intro+table(['Asset','Role','Source Format','Rig','Actual Clips','Visual QA','Technical Readiness','Gameplay Readiness','Usage Status','Primary Issues'],rows)
metrics=[]
for row in rows:
 id=row[0];asset=byid[id];models=asset['models'];chosen=next((m for m in models if m['file'].lower().endswith('.glb')),models[0])
 if id=='fantastic-village':chosen=next(m for m in models if m['file']=='3d/buildings/SM_BLD_body_v01_01.fbx')
 if id=='fantasy-market':chosen=next(m for m in models if 'Full_Layout' in m['file'])
 if id=='stone-pathway':chosen=next(m for m in models if m['file'].endswith('.gltf'))
 materials=chosen.get('materials','UNKNOWN');materials=len(materials) if isinstance(materials,list) else materials
 metrics.append([id,chosen['file'],f"{chosen['bytes']:,}",chosen.get('scene_instance_triangles',chosen.get('triangles','UNKNOWN')),chosen.get('scene_mesh_instances',chosen.get('meshes','UNKNOWN')),materials,len(asset['textures']),len(chosen.get('images',[])),chosen.get('joints',chosen.get('bones','UNKNOWN')),chosen.get('weight_entries','UNKNOWN')])
validation+='\n## Actual representative file costs\n\nThese are chosen source files, not the optimized runtime or the sum of pack alternatives. External texture count covers each source folder (including duplicates/alternate maps); embedded image count covers the chosen GLB/GLTF. FBX hierarchy counts include helpers.\n\n'+table(['Asset','Chosen source file','Source bytes','Scene triangles','Mesh instances / objects','Materials','External image files','Embedded images','Joints / hierarchy','Weight entries'],metrics)
validation+='''
## Measurement and inspection limits

The binary auditor records model file/hash/size, geometry, scene instances, materials, image dimensions/bit depth, external dependencies, skin weights, joints, exact animation names/targets and morphs in `ASSET_WORK/reports/source-audit.json`. FBX helper node counts differ from weighted joints; unresolved anatomy is UNKNOWN. Bind bounds and sampled animation bounds are labelled separately. Large packs were catalogued in full and visually sampled by representative render modules; all 602 files were not placed or visually inspected simultaneously. Non-GLB editable formats are preserved and their unmeasured properties remain UNKNOWN.

Three.js can report a different triangulation of FBX polygons from the binary polygon count (Frank 66,108 vs 66,130; Castle 254,988 vs 254,997). The runtime Cartoon Boy has 62,810 triangles after excluding its optional skateboard; the source is untouched. LOD/collision/Unreal/Unity variants are alternate files, not concurrent geometry. Fantasy Market's actual full-layout scene is 115,240 triangles and 384 mesh instances; its README claims 54,952 triangles / 28,400 vertices. That claim is not used as a budget. The integrated V01 stall is 10,408 triangles / 35 instances.

The dev Asset Lab provides GLB/GLTF/FBX, safe texture relinking, source/derived variants, framing, orbit, bounds, wireframe, skeleton, exact clip selection, play/pause/speed, metrics and errors. FBX absolute key times are normalized on cloned preview clips; original files never change. This corrects apparent cumulative durations on Tarisland. Cached bind-pose culling is disabled for skinned lab models so root motion remains visible. Production has no raw source middleware or Asset Lab entry.

## Player, NPC and ambient findings

Frank.fbx contains 16 mesh objects, 15 skins, 198 clusters, 64,637 weight entries, 100 LimbNode bones plus a metadata root, 75 morph channels and zero clips. Direct source loading detached facial/clothing parts; the first Blender export also mismatched mesh bind scales. The final derivative rebuilds a canonical skeleton from original cluster TransformLink/Transform matrices and remaps every vertex and morph with original weights. Head/facial binds and left-leg twist/share locations are repaired. All 75 distinct exported target names and 100 hierarchy joints survive; 483 primitive-level targets include duplicates across material splits. Optional Skate_Board is omitted only from the derivative. Runtime maps are at most 1K, PBR relinked, roughness/metal defaults documented by repair-player.py. No baked animation was fabricated: movement is authored against this rig in CartoonBoy/RigPose.

Idle, walk/run/sprint, jump/fall/landing, interact/carry, mount/seated/dismount use authored pose transitions. Mount/dismount inherit actual transform ownership; their transitions are not separate source clips. Clothing, eyes, front/side/back and gameplay silhouettes were inspected. Dedicated cinematic transitions, facial animation, cloth and final gait polishing remain future work. Traveler has one `Walk` clip and Knight one `Action.001`; both deform and remain future NPC content, with no new service. Horse has only the two supplied demo clips and remains ambient-only.

## Exact Dragon clips and rig evidence

'''
latest=read('browser-audit-tarisland-dragon-horse-bernardo-dragon-chinese-dragon.json')['records']
taris=read('browser-audit-tarisland-dragon.json')['records'][0]
base=read('browser-audit-tarisland-dragon-bernardo-dragon-chinese-dragon-demon-dragon-wyvern-animated-wyvern-fishing-traveler-knight-of-tomorrow-horse.json')['records']
mount=read('browser-audit-stylized-cartoon-boy-mountain-dragon-wyvern-animated-fantastic-village-fantasy-market.json')['records']
def source_record(records,id):return next(r for r in records if r['id']==id and 'Derived' not in r['variant']['name'])
cliprows=[]
for id in ['mountain-dragon','demon-dragon','wyvern-animated']:
 rec=source_record(mount if id=='mountain-dragon' else base,id)
 for c in rec['clips']:
  category='Other / unsplit montage' if id=='mountain-dragon' else ('Fly' if c['name'].startswith('flying_skeletal') else 'Idle' if c['name'].startswith('idle_skeletal') else 'Run' if c['name'].startswith('running_skeletal') else 'UNKNOWN — assembly defect')
  cliprows.append([id,c['name'],f"{c['duration']:.6f} s",category,'Skin samples changed' if c['sampledSkinChanged'] else 'No change at sampled vertices; track targets require review'])
for c in taris['clips']:
 n=c['name'];kind='Attack' if '_attack' in n else 'Death' if n.endswith('_die') else 'Land' if '_down' in n else 'Fly' if n.endswith('_fly2') else 'Takeoff' if re.search('_up(?:01|_dz)?$',n) else 'Idle' if n.endswith('_stand') else 'Walk' if n.endswith('_walk') else 'Other — turn' if '_turn' in n else 'Other / UNKNOWN cinematic or skill'
 cliprows.append(['tarisland-dragon',n,f"{c['duration']:.6f} s",kind,'All three time samples tested; skin changed'])
for rec in latest:
 if rec['id']=='bernardo-dragon' and rec['variant']['name']=='Derived comparison':
  for c in rec['clips']:cliprows.append(['bernardo-dragon',c['name'],f"{c['duration']:.6f} s",'UNKNOWN — generic derived action','Source stacks Base_Layer / Anim_Layer; Three source exposes 0'])
cliprows.append(['chinese-dragon','Take 001','UNKNOWN coherent source duration','UNKNOWN','One source stack; Three exposes 0; Blender emits 103 fragments (not source actions)'])
cliprows.append(['wyvern-fishing','No usable skeletal clip','—','Static','154 object/camera FBX takes listed in raw audit; GLB 0 skin / 0 clips'])
validation+=table(['Dragon','Exact clip / take','Measured duration','Playback action classification','Evidence / limit'],cliprows)
validation+='''
Mountain's source accessor span is 96.766670 s; the cloned normalized Three preview is 96.766998 s due to a tiny negative start key. `Take 001` is one supplied montage, not separate named Fly/Idle/Land clips. The original clip is preserved byte-for-byte. Runtime freezes a usable rest at t=4 and authors local wing/gait/head/tail/banking motion; animation never drives the physics root. Bones include Pelvis_03, Head_010, WingR_Arm_012 / Forearm_013, WingL_Arm_024 / Forearm_025, R/L thighs and feet, Tail_083 through its segments. Rider anchor follows the pelvis; independent carried-egg anchors follow right and left feet. Scale is 0.009 after measured source bounds, +Y up, source +Z forward rotated to game -Z. All action names and runtime state names are separate concepts.

Tarisland's 27 source takes all deform after normalization; e.g. fly2 keys span 31.600000–68.233330, making the action 36.633330 s rather than the loader's cumulative end timestamp. Cinematics, skills and root-motion tracks still need trimming/mapping, not a combat implementation. Export stalled in Blender and was terminated without source changes; no successful production GLB is claimed. Wyvern Animated contains real weights and actions but its downloaded assembly visibly separates parts. Bernardo source missing paths and Chinese eye path are actionable unresolved dependencies. Chinese helper-based names require anatomy mapping; jaw/wing suitability and carry anchors remain UNKNOWN until repaired. Wyvern Fishing has no proven flight-ready skeleton.

No downloaded species receives finalized rarity/element from its appearance. Mountain temporarily represents the existing owned Nature Young record; all seven species remain intended future obtainable/rideable candidates after readiness work. Baby remains explicitly procedural and unrideable because no appropriate matching Baby was supplied. Guardians retain their existing visuals and chase logic.

## Environment and road findings

FANTASTIC Village's selected body/body2, wooden watchtower, flag and cart were compared against source under neutral lighting after T_wood_03/T_wall_02 alias and normal/albedo relinking. Eleven houses/service buildings, one V01 Food Shop, two towers, two flags and one cart are visible in the actual city. Existing terraces, fountain, bridge, stairs, landing spaces and stone edging preserve the route composition. Large castles/villages are not inserted wholesale. Their splitting/LOD and material issues are listed above; Sky Temple stays a future-region reference.

Stone maps are all 4096×4096: diffuse JPG 8-bit, Normal GL JPG 8-bit and EXR HALF RGB 16-bit, ARM JPG 8-bit (AO R, roughness G, metallic B), AO PNG 16-bit, height PNG 16-bit and EXR HALF Y 16-bit, roughness EXR HALF Y 16-bit. Four runtime 1024×1024 JPEGs use albedo, Normal GL, standalone AO and extracted ARM G roughness. The AO derivative divides 16-bit samples by 257 before 8-bit quantization, avoiding the clipped-white direct PIL conversion. Seven road planes are 14 triangles with tiled maps, UV support, existing edge stones and no height displacement. Near: normal/AO with edge details; mid: same tiled material; far: plain low-detail terrain/material until a measured LOD need arises. The 107,390-triangle GLTF preview sphere is only in the lab.

## Evidence and reusable tools

Bulk evidence lives in ignored ASSET_WORK: source-audit.json, source-hashes-before/after.json, derived-verification.json, promoted-assets.json, browser-audit JSON, mountain-montage.json, authored-pose-browser.json, gameplay-browser.json, carry-browser.json, resilience-browser.json, production-browser.json and previews/*.png. Windows-long first-batch report was shortened to browser-audit-batch-1.json. Every other asset has front/side/back screenshots when loading succeeds; failures remain errors rather than PASS.

Companion reports: [runtime plan](ASSET_RUNTIME_PLAN.md), [integration evidence](ASSET_INTEGRATION_REPORT.md). The required player-audit.md, npc-audit.md, horse-audit.md, dragon-audit.md, environment-audit.md, road-material-audit.md and conversion-queue.md are generated in ASSET_WORK/reports; the full 602-file fantastic-village-catalog.md is retained there. Tool usage is documented in tools/asset-pipeline/README.md.
'''
write(DOC/'ASSET_VALIDATION_REPORT.md',validation)
anatomy=[]
for id in ['mountain-dragon','tarisland-dragon','bernardo-dragon','chinese-dragon','demon-dragon','wyvern-animated','wyvern-fishing']:
 models=byid[id]['models'];model=next((m for m in models if m['file'].endswith('.glb')),models[0]);names=model.get('joint_names',model.get('bone_names',[]))
 regions=[]
 for pattern in ['wing|asa','neck|pescoc|pescoç','head|cabeca|cabeça','jaw|mandib','tail|cauda','thigh|leg|foot|calf|shin|coxa|perna']:
  found=[str(n) for n in names if re.search(pattern,str(n),re.I)];regions.append('; '.join(found[:3]) or 'UNKNOWN / no unambiguous named joint')
 anatomy.append([id]+regions+[model.get('weight_entries','UNKNOWN'),model.get('morph_targets',model.get('morph_channels','UNKNOWN')),'Verified stable pelvis/rider and right/left foot anchors; missing discrete source actions authored' if id=='mountain-dragon' else 'Not authored/verified for gameplay; action/root-motion mapping and anchors pending'])
anatomy_text='\n## Individual Dragon anatomy and action gaps\n\nNamed joints below are inspection clues; a name alone does not prove anatomical weighting, articulation or independent deform control. Source helper/end nodes remain distinct from weighted influences. UNKNOWN is retained for ambiguous generic names and absent jaw evidence. Exact hierarchies, weight counts and sampled bone/vertex transforms are in source-audit.json and browser-audit records. Mountain head/neck/wings/legs/tail are exercised by the gameplay poses; a dedicated jaw/roar system was not implemented. Every unselected species still needs actual rider/carry anchor and required Idle/Walk/Takeoff/Fly/Land action mapping, regardless of supplied clip names.\n\n'+table(['Dragon','Wing named clues','Neck','Head','Jaw','Tail','Leg/foot','Weight entries','Morphs','Gameplay gaps / anchors'],anatomy)
write(DOC/'ASSET_VALIDATION_REPORT.md',validation+anatomy_text)
# Append actual clip tables to small domain audit records, without duplicating large binary dumps.
for name,ids in [('player-audit',['stylized-cartoon-boy']),('npc-audit',['traveler','knight-of-tomorrow']),('horse-audit',['horse']),('dragon-audit',[r[0] for r in rows if r[0] in ['mountain-dragon','tarisland-dragon','bernardo-dragon','chinese-dragon','demon-dragon','wyvern-animated','wyvern-fishing']]),('environment-audit',[r[0] for r in rows if 'village' in r[0] or 'castle' in r[0] or r[0] in ['fantasy-market','sky-temple']]),('road-material-audit',['stone-pathway'])]:
 text='# '+name.replace('-',' ').title()+'\n\n'+table(['Asset','Role','Format','Rig','Clips','Visual QA','Technical','Gameplay','Usage','Issues'],[byrow[id] for id in ids])
 text+='\nDetailed methods, fixes, counts, clip durations and evidence: DOCS/TECHNICAL/ASSET_VALIDATION_REPORT.md.\n'
 if name in ['dragon-audit','horse-audit','npc-audit']:
  clips=cliprows if name=='dragon-audit' else [[rec['id'],c['name'],f"{c['duration']:.6f} s",'Playback sampled','Exact supplied demo/GLB clip'] for rec in (latest if name=='horse-audit' else base) if rec['id'] in ids and 'Derived' not in rec['variant']['name'] for c in rec['clips']]
  text+='\n'+table(['Asset','Exact clip','Duration','Classification','Evidence'],clips)
 if name=='dragon-audit':text+=anatomy_text
 write(WORK/(name+'.md'),text)
write(WORK/'conversion-queue.md','# Conversion queue\n\n'+table(['Asset','Primary decision + issue flags','Gameplay state','Next repair'],[[r[0],r[6],r[7],r[9]] for r in rows])+'\nFailed/unfinished exports remain in ASSET_WORK only. Do not promote by file existence alone.\n')
# Full catalog already contains all files; add actual category examples.
catalog=WORK/'fantastic-village-catalog.md';old=catalog.read_text(encoding='utf8');old=old.split('\n## Reviewed categories')[0]
groups=[]
models=byid['fantastic-village']['models'];render=[m for m in models if '/collision' not in m['file'].lower() and 'lod' not in m['file'].lower()]
for label,pattern in [('Buildings','body'),('Towers','watchtower'),('Walls','wall_'),('Gates','gate'),('Bridges','bridge'),('Market/support','market'),('Fences','fence'),('Furniture','table_'),('Carts','cart_'),('Food','food_'),('Flags','flag_'),('Plants','plant_'),('Trees','env_tree')]:
 found=[m['file'] for m in render if pattern in m['file'].lower()];groups.append([label,'; '.join(found[:3]) if found else 'No matching supplied filename verified',len(found)])
write(catalog,old+'\n## Reviewed categories\n\n'+table(['Category','Representative supplied render filenames','Matching files'],groups)+'\nNo banner-named file was verified; flags are supplied. collision_UE, collision_unity, LOD and render directories are alternatives; never sum them as a placed city. Selected conversions use render files only.\n')
destinations={'stylized-cartoon-boy':['cartoon-boy.glb'],'mountain-dragon':['mountain-young.glb'],'fantastic-village':['village-body.glb','village-body2.glb','village-tower.glb','village-flag.glb','village-cart.glb'],'fantasy-market':['market-stall.glb'],'stone-pathway':['stone-pathway-albedo.jpg','stone-pathway-normal.jpg','stone-pathway-roughness.jpg','stone-pathway-ao.jpg']}
decision=[]
for r in rows:
 files=[p for p in promoted if Path(p['production_file']).name in destinations.get(r[0],[])];decision.append([r[0],'YES' if files else 'NO', '<br>'.join(p['production_file'] for p in files) or '—',f"{sum(p['bytes'] for p in files):,} bytes" if files else 'Not loaded',r[4],r[9], 'Maintain / profile / polish' if files else r[9]])
plan='''# Phase 2 runtime plan and final promotion decisions

The bounded integration is complete for local play: repaired Cartoon Boy, curated city pieces, Stone Pathway maps and rideable Mountain Young. The whole downloaded library is not production-ready and external release is not cleared by this milestone. Future work listed below is a recommendation, not implemented scope.

## Final decision table

'''+table(['Asset/Pack','Integrated Now?','Production File','Runtime Size','Actual Animation Count','Main Risk','Required Next Action'],decision)
plan+='\n## Promoted outputs and exact hashes\n\n'+table(['Output','Bytes','SHA-256','Working derivative'],[[p['production_file'],f"{p['bytes']:,}",p['sha256'],p['working_file']] for p in promoted])
plan+=f"\nTwelve files total {sum(p['bytes'] for p in promoted):,} bytes; historical Nature GLB is additional preserved content and never requested by Game. No failed exports are in this table.\n"
sourcefiles={'cartoon-boy.glb':'SOURCE_ASSETS/characters/player/stylized-cartoon-boy/FBX/Frank.fbx','mountain-young.glb':'SOURCE_ASSETS/dragons/mountain-dragon/source/MOUNTAIN_DRAGON_ANIMATIONS.glb','market-stall.glb':'SOURCE_ASSETS/environment/sanctuary/fantasy-market/Fantasy_Vendor_Market_Free_8_Stall_Kit_V01.glb'}
for name,file in [('body','buildings/SM_BLD_body_v01_01.fbx'),('body2','buildings/SM_BLD_body_v02_01.fbx'),('tower','props/SM_PROP_watchtower_wood_01.fbx'),('flag','props/SM_PROP_flag_01.fbx'),('cart','props/SM_PROP_cart_01.fbx')]:sourcefiles['village-'+name+'.glb']='SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/'+file
protected=read('source-hashes-before.json');source_map=[]
for p in promoted:
 name=Path(p['production_file']).name;s=sourcefiles.get(name)
 if not s:s='SOURCE_ASSETS/materials/roads/stone-pathway/textures/'+{'stone-pathway-albedo.jpg':'stone_pathway_diff_4k.jpg','stone-pathway-normal.jpg':'stone_pathway_nor_gl_4k.jpg','stone-pathway-roughness.jpg':'stone_pathway_arm_4k.jpg','stone-pathway-ao.jpg':'stone_pathway_ao_4k.png'}[name]
 source_map.append([p['production_file'],s,protected[s]['sha256']])
plan+='\n## Canonical sources\n\n'+table(['Output','Canonical source','Source SHA-256'],source_map)
plan+='''
## Conversion and ownership

Blender 4.5.4 LTS is installed; no desktop software was installed. Node 20.19.3 / npm 10.8.2 / Python 3.10 + Pillow/numpy and existing Three loaders provide inspection. @types/node is the only lightweight added development type dependency (for safe Vite middleware); no runtime framework/decoder was added. Version checks did not invoke package downloads.

Player: repair-player.py imports original FBX into memory, repairs canonical mesh binds, preserves skin/morph keys and relinks original textures; exports GLB with no animations, +Y up and at most 1K working images. prepare.optimize_glb repacks embedded images (JPEG quality 90 / PNG when alpha exists) without changing non-image buffers. Mountain uses the supplied GLB, preserves 20,460 triangles / 95 joints / 2 skins / Take 001 and downsizes embedded maps to at most 2K: 64,285,316 → 18,636,276 bytes. Player repaired GLB → final 12,120,668 bytes. V01 Market 4,499,412 → 842,844 bytes with at most 1K maps; 10,408 triangles unchanged. Village exports retain separate modular meshes, +Y up, relink base-color/normal aliases, at most 1K maps; no giant merged city. Road maps use 1K JPEG quality 93, roughness ARM G and normalized 16-bit AO. Exact settings and image changes are in *.conversion.json next to intermediates and the scripts.

No animation tracks, required skin or morphs were stripped for compression. Meshopt/KTX2/Draco are not enabled because verified runtime decoders are absent and measured texture cost dominates these selected files. Geometry is unchanged by image optimization; verify-derived.py asserts all non-image buffer views and nodes/meshes/skins/animations/accessors identical. It also verifies player morph target names and AO dynamic range. Unused optional skateboard is the one documented player prop omission.

RuntimeAssets owns shared template geometry/materials/textures and creates SkeletonUtils clones with independent bones/skeleton textures. Concurrent requests share one load. Instances release only their own skeletons; cache teardown releases shared resources once, including late fulfilled loads; failed loads can retry. Game keeps physics roots and stable mount/carry groups outside animated source roots. Roads wait for every texture result before cleaning up failed/late loads.

Runtime destinations exist for models/characters/{player,npc}, models/dragons, models/creatures/ambient, models/environment/{sanctuary,outskirts,regions}, textures/{characters,dragons,environment,materials/roads}. Existing audio/fonts/images/vfx and historical files are preserved. Initial Phase 2 derivative copies were moved to these destinations after exact hash verification; source files never moved.

## Recommended Phase 3 order

1. Confirm recorded package usage terms for Village/Market/player and Tarisland before any public release; retain creator attribution. No legal readiness inferred from local integration.
2. Profile physical mobile devices; reduce startup texture residency/draw calls with shared atlases, selective city streaming and appropriate LOD; code-split the >500 kB script. Improve Cartoon Boy gait/landing/mount transitions and dedicated matching Baby art; refine saddle/talon grasp.
3. Repair Wyvern Animated bind assembly and Chinese eye/take export; resolve Bernardo UDIM aliases and author screen-coverage LOD for Bernardo/Demon. Keep hero silhouettes and compare visually.
4. Stabilize Tarisland export/action root-motion mappings only after usage terms are settled. Rig a purpose-built Wyvern Fishing gameplay variant if selected, without claiming its camera takes are a rig.
5. Split and LOD dense village/castle scenes before measured environment additions; prepare Traveler/Knight for future authorized NPC scope. No quests, services, regions, combat, Adult progression or horse riding added now.
'''
write(DOC/'ASSET_RUNTIME_PLAN.md',plan)
# Keep explicit attributions bundled with derived runtime files.
credits='# Local Phase 2 runtime asset provenance\n\nDerived files keep their original creator attribution. Local integration was authorized by the user; unresolved usage terms are preserved here and no deployment occurred.\n\n'
for id in destinations:
 info=byid[id]['acquisition_evidence']['info'];url=next((l.split('Source URL: ',1)[1] for l in info.splitlines() if l.startswith('Source URL: ')),'UNKNOWN');license=next((l.split('License / creator: ',1)[1] for l in info.splitlines() if l.startswith('License / creator: ')),'UNKNOWN');credits+=f'- **{id}** — {license} Source: {url}. Changes: derived texture resizing/repacking; player canonical bind repair; Village GLB/material relink; road channel/bit-depth conversion. Detailed per-file changes: DOCS/TECHNICAL/ASSET_RUNTIME_PLAN.md.\n'
write(ROOT/'public/assets/ATTRIBUTION.md',credits)
print('Generated validation, runtime decisions, domain audits, catalog summaries, conversion queue and runtime attribution.')
