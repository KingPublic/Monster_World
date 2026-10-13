from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'ASSET_WORK/previews/lab'
def sheet(name,files,columns=4):
 out=Image.new('RGB',(columns*320,((len(files)+columns-1)//columns)*225),'#20282b');draw=ImageDraw.Draw(out)
 for i,p in enumerate(files):
  im=Image.open(p);im.thumbnail((320,200));x=(i%columns)*320;y=(i//columns)*225;out.paste(im,(x,y));draw.text((x+4,y+202),p.stem[:45],fill='white')
 out.save(ROOT/f'ASSET_WORK/previews/{name}.jpg',quality=88)
sheet('tarisland-normalized',sorted(folder.glob('tarisland-dragon-0-clip-*.png'),key=lambda p:int(p.stem.split('-')[-1])),5)
sheet('environment-audit',sorted(p for p in folder.glob('*-0-front.png') if any(a in p.name for a in ['sky-temple','medieval-village-houses','fantasy-castle','grand-fantasy-castle','medieval-village-scene'])),3)
sheet('authored-player-poses',[ROOT/f'ASSET_WORK/previews/pose-{s}-2.png' for s in ['idle','walk','sprint','jump','fall','carry','interact','mounted']],4)
