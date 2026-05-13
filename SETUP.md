# 💻 Tutorial Instalasi — Bengkel Aja

Panduan lengkap untuk menjalankan project **Bengkel Aja** di laptop baru dari nol.

---

## ✅ Prasyarat

Sebelum mulai, pastikan laptop sudah terinstall:

| Software | Versi Minimum | Cek dengan |
|---|---|---|
| **Node.js** | v18 ke atas | `node --version` |
| **npm** | v9 ke atas | `npm --version` |
| **Git** | v2 ke atas | `git --version` |

Jika belum terinstall, ikuti langkah di bawah.

---

## 📦 Langkah 1 — Install Node.js

Node.js sudah termasuk npm di dalamnya.

1. Buka browser, pergi ke **https://nodejs.org**
2. Klik tombol **"LTS"** (versi stabil, disarankan)
3. Download installer sesuai OS:
   - Windows: file `.msi`
   - Mac: file `.pkg`
4. Jalankan installer, klik **Next** terus sampai selesai
5. Buka terminal / command prompt baru, verifikasi:

```bash
node --version
# Output contoh: v20.11.0

npm --version
# Output contoh: 10.2.4
```

---

## 📦 Langkah 2 — Install Git

1. Buka browser, pergi ke **https://git-scm.com/downloads**
2. Klik download sesuai OS
3. Jalankan installer:
   - Windows: klik **Next** terus, semua opsi default sudah benar
   - Mac: ikuti instruksi di layar
4. Verifikasi di terminal:

```bash
git --version
# Output contoh: git version 2.44.0
```

---

## 📥 Langkah 3 — Clone Project dari GitHub

Buka terminal / command prompt, lalu jalankan perintah berikut satu per satu:

```bash
# Pindah ke folder yang diinginkan, contoh Desktop
cd Desktop

# Clone repository
git clone https://github.com/trustedtft07/BengkelAja.git

# Masuk ke folder project
cd BengkelAja
```

Setelah selesai, struktur folder akan terlihat seperti ini:

```
BengkelAja/
├── src/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── ...
```

> ⚠️ **Perhatikan:** folder `node_modules/` tidak ikut di-clone karena ada di `.gitignore`. Kita akan install ulang di langkah berikutnya.

---

## 📦 Langkah 4 — Install Dependensi

Masih di dalam folder `BengkelAja`, jalankan:

```bash
npm install
```

Perintah ini akan membaca file `package.json` dan mengunduh semua library yang dibutuhkan ke folder `node_modules/`.

Proses ini membutuhkan koneksi internet dan memakan waktu **1–3 menit** tergantung kecepatan internet.

Jika berhasil, output akhirnya seperti:

```
added 222 packages, and audited 223 packages in 25s
```

---

## 🚀 Langkah 5 — Jalankan Project

```bash
npm run dev
```

Jika berhasil, terminal akan menampilkan:

```
  VITE v5.3.1  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Buka browser dan pergi ke:

```
http://localhost:5173/
```

Website Bengkel Aja sudah berjalan di laptop kamu! 🎉

---

## 🔑 Akun untuk Testing

### Akun User
Daftar akun baru melalui halaman **Register** di aplikasi.

### Akun Admin
1. Klik **"Login sebagai Admin"** di halaman login
2. Isi form **"Buat Akun Admin Baru"**
3. Masukkan kode admin: **`BENGKELAJA2026`**
4. Klik **"Daftar sebagai Admin"**

---

## 🛑 Menghentikan Server

Untuk menghentikan dev server, tekan:

```
Ctrl + C
```

di terminal yang sedang menjalankan `npm run dev`.

---

## 🔄 Update Project (Jika Ada Perubahan Baru)

Jika ada update dari GitHub, jalankan:

```bash
# Ambil perubahan terbaru
git pull

# Install dependensi baru jika ada (aman dijalankan ulang)
npm install

# Jalankan kembali
npm run dev
```

---

## ❌ Troubleshooting

### Error: `node` tidak dikenali
**Penyebab:** Node.js belum terinstall atau terminal belum di-restart setelah install.  
**Solusi:** Tutup terminal, buka terminal baru, coba lagi.

---

### Error: `npm install` gagal / error EACCES
**Penyebab:** Masalah permission di Mac/Linux.  
**Solusi:**
```bash
sudo npm install
```

---

### Error: `Port 5173 already in use`
**Penyebab:** Ada proses lain yang memakai port 5173.  
**Solusi:** Vite otomatis pindah ke port berikutnya (5174, 5175, dst). Lihat output terminal untuk URL yang benar.

---

### Error: `Cannot find module` setelah clone
**Penyebab:** `node_modules` belum terinstall.  
**Solusi:**
```bash
npm install
```

---

### Halaman kosong / blank di browser
**Penyebab:** Firebase tidak terhubung atau ada error JavaScript.  
**Solusi:**
1. Buka DevTools browser (`F12`)
2. Lihat tab **Console** untuk pesan error
3. Pastikan koneksi internet aktif (Firebase butuh internet)

---

### Error: `git clone` gagal
**Penyebab:** Git belum terinstall atau koneksi internet bermasalah.  
**Solusi:** Pastikan Git terinstall dengan `git --version`, lalu coba lagi.

---

## 📋 Ringkasan Perintah

```bash
# 1. Clone project
git clone https://github.com/trustedtft07/BengkelAja.git

# 2. Masuk folder
cd BengkelAja

# 3. Install dependensi
npm install

# 4. Jalankan
npm run dev

# 5. Buka di browser
# http://localhost:5173/
```

---

## 💡 Catatan Tambahan

- Project ini membutuhkan **koneksi internet** saat dijalankan karena data tersimpan di Firebase Cloud
- Firebase config sudah terkonfigurasi di dalam kode, tidak perlu setup tambahan
- Data yang dibuat (booking, layanan, mekanik) tersimpan di cloud dan bisa diakses dari laptop manapun dengan akun yang sama
