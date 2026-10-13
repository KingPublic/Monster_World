"""Recreate unchanged pre-Phase-2 app in ignored work area for paired metrics."""
import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'ASSET_WORK/baseline-app'
files=subprocess.check_output(['git','-c','core.fsmonitor=false','ls-files','src','index.html','vite.config.ts'],cwd=ROOT,text=True).splitlines()
for filename in files:
 target=OUT/filename;target.parent.mkdir(parents=True,exist_ok=True)
 data=subprocess.check_output(['git','-c','core.fsmonitor=false','show','HEAD:'+filename],cwd=ROOT);target.write_bytes(data)
print('Read-only HEAD reconstruction:',len(files),'files at',OUT)
