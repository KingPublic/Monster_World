// Invoke only through a wrapper that consumes stdout privately. Never log the
// generated secret object, pass secrets as arguments, or store it in the repo.
import{randomBytes,scryptSync}from'node:crypto';
import{mkdir,writeFile}from'node:fs/promises';
import{resolve,dirname}from'node:path';
const credentialDirectory='C:/Users/Adrian/Games/Credential';
const file=resolve(credentialDirectory,'Monster_World_Admin.txt');
if(dirname(file)!==resolve(credentialDirectory))throw new Error('Credential target outside requested directory');
const user='Adrian',password=randomBytes(24).toString('base64url'),salt=randomBytes(16).toString('hex'),key=randomBytes(48).toString('base64url'),entry=randomBytes(24).toString('base64url');
const passwordHash='scrypt$'+salt+'$'+scryptSync(password,salt,64,{N:16384,r:8,p:1,maxmem:64*1024*1024}).toString('hex');
const origin='https://monster-world-seven.vercel.app';
await mkdir(credentialDirectory,{recursive:true});
await writeFile(file,['Monster World — akses admin pribadi','',`Game: ${origin}`,`Alamat masuk pribadi: ${origin}/api/owner?entry=${entry}`,`Akun: ${user}`,`Password: ${password}`,'','Buka alamat masuk pribadi, masuk, lalu Begin/Continue adventure.','Panel Admin Adrian akan muncul. Gunakan Keluar akun saat selesai.','Sesi berlaku 8 jam. Tidak ada pendaftaran akun lain.','Jangan bagikan password atau alamat masuk pribadi ini. Simpan di password manager.','File ini berada di luar GitHub dan tidak diunggah ke Vercel.','Jika perlu mencabut semua sesi, ganti MW_OWNER_SESSION_KEY di Vercel lalu redeploy.','Password diganti dengan hash scrypt baru di MW_OWNER_PASSWORD_HASH dan redeploy.','Game masih single player; save tersimpan per browser/domain.',''].join('\r\n'),{flag:'wx',mode:0o600});
process.stdout.write(JSON.stringify({user,passwordHash,key,entry,file,origin}));
