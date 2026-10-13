# Prompt lanjutan — Task 06: Aset runtime, Sanctuary, dan karakter pemain

> Superseded proposal. Use [the final Phase 2 prompt](MONSTER_WORLD_PHASE_2_ASSET_VALIDATION_AND_INTEGRATION.md), which audits all downloaded assets and includes a downloaded rideable Dragon in the actual game. This earlier proposal remains only for context.

Lanjutkan pengembangan Monster World pada folder:

`C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World`

Saya mengizinkan milestone Task 06: menyiapkan aset runtime yang efisien, meningkatkan visual Sanctuary, dan mengintegrasikan Stylized Cartoon Boy sebagai karakter pemain. Kerjakan sampai hasilnya dapat dimainkan dan diverifikasi. Pertahankan MVP yang sudah berjalan. Berhenti setelah milestone ini; laporkan langkah berikutnya tanpa menjalankannya.

## 1. Pahami proyek dan kondisi aktual

Baca `MASTER_GAME_SPEC.md`, `AGENTS.md`, `TASKS/README.md`, `TASK_MVP_AUTONOMOUS_BUILD_REPORT.md`, `ASSET_MANIFEST.md`, serta dokumen terkait di:

- `DOCS/TECHNICAL/ARCHITECTURE.md`
- `DOCS/TECHNICAL/ASSET_PIPELINE.md`
- `DOCS/TECHNICAL/ASSET_ACQUISITION_REPORT.md`
- `DOCS/WORLD/PLAYER_SANCTUARY.md`, `WORLD_STRUCTURE.md`, dan `SAFE_ZONE.md`
- `DOCS/GAMEPLAY/CORE_LOOP.md`, `TUTORIAL_FLOW.md`, dan `SHOP_AND_FOOD.md`

Baca juga `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\MONSTER_WORLD_ASSET_DOWNLOAD_MASTER_FINAL.md` untuk identitas, peran, dan arah visual aset. Instruksi tahap download di dokumen itu bersifat historis; permintaan ini mengizinkan integrasi sesuai lingkup Task 06.

Periksa kode, konfigurasi, kondisi Git, dan game di browser sebelum mengubahnya. Status laporan lama bukan pengganti pemeriksaan kondisi aktual. Jangan menimpa perubahan pengguna.

Akuisisi 19 aset sudah PASS. Hasil ekstraksi, model sumber, tekstur, metadata, dan catatan verifikasi tersedia di `SOURCE_ASSETS`. Arsip ZIP/RAR dan salinan download yang redundan sudah dihapus atas izin saya setelah verifikasi isi. Tidak perlu mengunduh ulang atau mengembalikan arsip. PASS akuisisi belum berarti aset siap runtime atau semua hak penggunaannya sudah terverifikasi.

## 2. Arah visual dan referensi

Targetnya premium stylized fantasy: Sanctuary terasa seperti kota Dragon yang hangat, hidup, dan sudah berdiri, dengan jalan, plaza, bangunan layanan, vegetasi, landmark, serta perbedaan ketinggian yang masuk akal.

Inspeksi gambar berikut secara visual sebelum implementasi:

- `REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png`
- `REFERENCES/ENVIRONMENT/Player-nest-v1.png`
- `REFERENCES/ENVIRONMENT/Player-nest-services-v1.png`
- `REFERENCES/ENVIRONMENT/World-overview-v1.png`
- `REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png`

FANTASTIC Village Pack adalah acuan utama lingkungan. Gunakan bagian Fantasy Market yang sesuai agar Sanctuary memiliki identitas sendiri. Angka, harga, timer, atau mekanik dalam gambar tidak mengubah spesifikasi gameplay.

## 3. Siapkan pipeline aset yang dapat diulang

Pertahankan sumber di `SOURCE_ASSETS`; buat hasil konversi terpisah di `public/assets`. Jangan menghapus atau menimpa sumber. Gunakan tool lokal yang tersedia dan catat proses konversinya. Jika tool penting belum tersedia, jelaskan hambatan spesifik dan lanjutkan bagian yang dapat dikerjakan.

Utamakan GLB untuk model runtime. Verifikasi skala, orientasi, titik pijak, tekstur, material, skin, dan animasi setelah konversi. Hindari referensi tekstur ke lokasi absolut laptop. Loader harus bekerja pada development dan production dengan base URL proyek.

Pilih modul Village yang benar-benar digunakan; jangan memuat seluruh 602 FBX, semua varian, collision mesh, dan LOD sebagai objek visual sekaligus. Pakai stall Market secara selektif. Deduplicasikan tekstur/material, gunakan instancing untuk objek berulang bila sesuai, dan pilih resolusi tekstur berdasarkan kebutuhan tampilan.

Stone Pathway dipakai sebagai sumber material jalan. Jangan memasukkan mesh preview material yang sangat berat sebagai jalan. Terapkan tiling, normal, roughness, dan warna yang benar, disertai variasi tepi batu, tanah/lumut, serta geometri ringan untuk kedalaman. Hindari displacement berat pada seluruh Sanctuary.

Atur pemuatan, penggunaan ulang, dan disposal aset dengan kepemilikan resource yang jelas. Untuk karakter ber-rig, cloning dan animasi tidak boleh berbagi pose secara keliru. Sediakan fallback saat aset gagal dimuat tanpa merusak gameplay.

## 4. Integrasikan Sanctuary secara bertahap

Mulai dengan contoh kecil untuk membuktikan konversi dan material, lalu integrasikan bangunan, jalan, vegetasi, props, dan stall terpilih ke Sanctuary.

Pertahankan Hatchery, Food Shop, Collection Hall, Rider Hall, dan Mount Court sebagai layanan yang mudah ditemukan dan digunakan. Jaga anchor interaksi, rute berjalan, tangga/ramp, tempat mendarat, serta jalur kembali dari Wild Nest. Sesuaikan collision sederhana dengan bangunan yang benar-benar ditempatkan; jangan meninggalkan collision dari bangunan lama yang sudah hilang.

Jangan menambahkan sistem city-building, layanan baru, atau merombak UI di luar kebutuhan integrasi. Jangan memasukkan kastil sangat berat atau seluruh paket lingkungan sebagai satu scene tanpa seleksi dan pengukuran.

## 5. Integrasikan Cartoon Boy sebagai pemain

Gunakan sumber `SOURCE_ASSETS/characters/player/stylized-cartoon-boy/FBX/Frank.fbx` beserta teksturnya. Peran ini terkunci sebagai karakter utama.

Hasil inspeksi menemukan rig dan morph, tetapi **nol animation clips**. Jangan menganggap walk/run sudah tersedia. Verifikasi rig dan material, kemudian siapkan gerakan yang diperlukan melalui animasi lokal atau retargeting dari sumber yang memang tersedia dan sesuai penggunaannya. Jangan mengunduh karakter pengganti tanpa persetujuan.

Karakter perlu menampilkan idle, berjalan, berlari, melompat, membawa telur, dan pose duduk saat menunggang. Gerakan harus mengikuti status gameplay, tidak berhenti dalam T-pose. Pertahankan root movement, collision, input, mount anchor, dan save yang sudah bekerja; ganti bagian visualnya secara terukur.

Jangan membuang skin/morph yang diperlukan secara membabi buta ketika mengoptimalkan. Jika ada gerakan yang belum berhasil, laporkan kekurangannya dengan jelas dan jangan menyatakan integrasi karakter selesai.

## 6. Jaga aturan gameplay dan batas milestone

Alur yang harus tetap berfungsi:

Explore → menemukan Wild Nest → mencuri telur → dikejar Guardian → kembali secara fisik ke Sanctuary → mengamankan telur → hatch Baby → memberi makan → tumbuh Young → menunggang dan terbang → mengunjungi nest berikutnya.

Pertahankan skala dunia dan jarak nest, aturan Safe Zone, kapasitas membawa telur, respawn per slot, Coins/Food, upgrade rider, collection, dan local save. Baby tetap tidak dapat ditunggangi. Boost tetap dengan tombol ditahan. Guardian tidak kehilangan pengejaran hanya karena pemain menjauh. Tidak ada teleport atau fast travel saat membawa telur curian.

Pertahankan Dragon Nature Baby/Young dan Guardian yang sudah berfungsi untuk milestone ini. Penggantian model Dragon, pemetaan elemen/rarity/stage, Adult, NPC baru, horse, combat, multiplayer, backend, cloud save, dan monetisasi belum termasuk lingkup.

Catat kandidat Dragon dan kebutuhan animasinya sebagai masukan milestone berikutnya. Jangan menganggap nama clip membuktikan aksi yang tepat atau aset heavy/static siap dipakai. Pertahankan catatan batas penggunaan yang sudah diketahui; jangan menyatakan Tarisland cleared untuk produksi komersial.

Tetap gunakan Vite, TypeScript, Three.js, dan HTML/CSS. Jangan mengubah framework. Tidak ada stage, commit, merge, push, PR, deployment, perubahan remote, atau layanan berbayar dalam tugas ini.

## 7. Verifikasi dan hasil akhir

Jalankan `npm run typecheck`, `npm test`, dan `npm run build`. Periksa production preview di browser, console, dan kegagalan pemuatan aset.

Uji pemain berjalan di Sanctuary dan menggunakan seluruh layanan; kemudian uji alur mencuri–dikejar–kembali–hatch–feed–grow–mount–flight–landing. Periksa save/reload tanpa menghapus save pengguna, serta perilaku fallback jika model gagal dimuat. Gunakan pengujian terisolasi untuk kondisi awal yang bersih.

Periksa desktop dan viewport mobile/touch. Bedakan pengujian emulasi dari perangkat fisik. Bandingkan sebelum/sesudah untuk ukuran aset yang dimuat, draw calls, triangles, dan performa pada kondisi yang disebutkan. Jangan mengklaim kelancaran semua laptop/HP dari satu pengujian.

Simpan screenshot Sanctuary, karakter, layanan, dan penerbangan sebagai bukti. Tambahkan definisi Task 06 dan statusnya ke dokumentasi tugas; jangan menandainya selesai sebelum kriteria terpenuhi. Perbarui manifest aset runtime dengan sumber, hasil konversi, ukuran/hash, material, rig/clip yang benar-benar tersedia, serta status penggunaannya.

Laporkan perubahan konkret, pemeriksaan yang lulus/gagal, keterbatasan, kondisi Git, dan langkah berikutnya. Kriteria selesai: Sanctuary memakai aset pilihan dengan material yang benar, Cartoon Boy berfungsi sebagai pemain dengan gerakan yang diperlukan, layanan dan core loop tetap dapat dimainkan, serta hasil validasi tersedia. Jika kriteria belum terpenuhi, laporkan sebagai pekerjaan parsial, bukan production-ready.
