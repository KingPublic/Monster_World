import struct,zlib

def read_fbx(path):
    raw = path.read_bytes()
    if not raw.startswith(b'Kaydara FBX Binary  \x00\x1a\x00'):
        return {'format':'ASCII FBX', 'inspection':'UNKNOWN; not parsed'}
    version = struct.unpack_from('<I', raw, 23)[0]
    fmt = '<QQQB' if version >= 7500 else '<IIIB'
    hs = struct.calcsize(fmt)
    allnodes = []
    def node(pos):
        end, count, plen, nlen = struct.unpack_from(fmt, raw, pos)
        if end == 0: return None, pos + hs
        assert end <= len(raw) and end > pos, 'Invalid FBX node boundary'
        pos += hs
        name = raw[pos:pos+nlen].decode('utf-8',errors='replace')
        pos += nlen
        props = []
        start = pos
        for _ in range(count):
            t = chr(raw[pos]); pos += 1
            scalars = {'Y':'h','C':'?','I':'i','F':'f','D':'d','L':'q'}
            if t in scalars:
                f = '<'+scalars[t]; value = struct.unpack_from(f,raw,pos)[0]; pos += struct.calcsize(f)
            elif t in ['S','R']:
                size = struct.unpack_from('<I',raw,pos)[0]; pos += 4
                value = raw[pos:pos+size].decode('utf-8',errors='replace').split('\x00\x01')[0] if t == 'S' else {'raw_bytes':size}
                pos += size
            elif t in ['f','d','l','i','b','c']:
                size, enc, packed = struct.unpack_from('<III',raw,pos); pos += 12
                value = {'array_count':size, 'type':t, 'compression':enc}
                if name == 'PolygonVertexIndex':
                    payload = raw[pos:pos+packed]
                    values = zlib.decompress(payload) if enc else payload
                    assert len(values) == size * 4
                    value['triangles'] = size - 2 * sum(v[0] < 0 for v in struct.iter_unpack('<i',values))
                pos += packed
            else: raise ValueError(f'Unknown FBX property type {t}')
            props.append(value)
        assert pos == start + plen
        children = []
        while pos < end - hs:
            child, nextpos = node(pos)
            if child is None: break
            children.append(child); pos = nextpos
        result = {'name':name,'props':props,'children':children}
        allnodes.append(result)
        return result, end
    pos = 27
    while pos + hs < len(raw):
        obj, pos = node(pos)
        if obj is None: break
    def objects(name): return [n for n in allnodes if n['name']==name and len(n['props']) >= 2]
    bones = [n for n in objects('Model') if len(n['props']) >= 3 and n['props'][2] in ['LimbNode','Root']]
    geometry = [n for n in objects('Geometry') if len(n['props']) >= 3 and n['props'][2]=='Mesh']
    stacks = [n['props'][1] for n in objects('AnimationStack')]
    skin = [n for n in objects('Deformer') if len(n['props']) >= 3 and n['props'][2]=='Skin']
    clusters = [n for n in objects('Deformer') if len(n['props']) >= 3 and n['props'][2]=='Cluster']
    cluster_ids = {n['props'][0] for n in clusters}
    connected_bones = {n['props'][1] for n in allnodes if n['name']=='C' and len(n['props'])>=3 and n['props'][0]=='OO' and n['props'][2] in cluster_ids}
    bones = [n for n in objects('Model') if n['props'][0] in connected_bones or (len(n['props'])>=3 and n['props'][2] in ['LimbNode','Root'])]
    triangles = sum(c['props'][0].get('triangles',0) for n in geometry for c in n['children'] if c['name']=='PolygonVertexIndex' and c['props'])
    morphs = [n for n in objects('Deformer') if len(n['props']) >= 3 and n['props'][2]=='BlendShapeChannel']
    bone_ids = {b['props'][0] for b in bones}
    hierarchy = [n['props'][1:3] for n in allnodes if n['name']=='C' and len(n['props'])>=3 and n['props'][0]=='OO' and n['props'][1] in bone_ids and n['props'][2] in bone_ids]
    return {'format':f'Binary FBX {version}', 'meshes':len(geometry),'triangles':triangles,'materials':len(objects('Material')),
            'bones':len(bones),'bone_names':[b['props'][1] for b in bones], 'bone_parent_connections':hierarchy,
            'skin_deformers':len(skin),'skin_clusters':len(clusters), 'animation_names':stacks,
            'weight_entries':sum(c['props'][0]['array_count'] for cluster in clusters for c in cluster['children'] if c['name']=='Weights' and c['props']),
            'model_types':{t:sum(n['props'][2]==t for n in objects('Model') if len(n['props'])>=3) for t in {n['props'][2] for n in objects('Model') if len(n['props'])>=3}},
            'animation_layers':[n['props'][1] for n in objects('AnimationLayer')],
            'morph_channels':len(morphs), 'rig':bool(bones and skin and clusters)}
