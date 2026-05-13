# 🔧 Bengkel Aja

Aplikasi web pemesanan layanan bengkel kendaraan berbasis React + Firebase. Pengguna dapat melakukan booking servis, memanggil mekanik darurat, dan memantau status booking secara real-time.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | [React 18](https://react.dev/) | Library UI berbasis komponen |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| **Backend** | [Firebase Firestore](https://firebase.google.com/docs/firestore) | NoSQL cloud database |
| **Auth** | [Firebase Authentication](https://firebase.google.com/docs/auth) | Email/password authentication |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Fast development server & bundler |
| **State Management** | React Context API | Global state tanpa library tambahan |
| **Package Manager** | npm | Manajemen dependensi |

### Dependensi Utama

```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "firebase": "10.12.0",
  "tailwindcss": "3.4.4",
  "vite": "5.3.1"
}
```

---

## 🚀 Cara Menjalankan

```bash
# Install dependensi
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

Buka `http://localhost:5173/` di browser.

---

## 📁 Struktur Folder

```
src/
├── App.jsx                        # Root component, routing antar halaman
├── main.jsx                       # Entry point React
├── index.css                      # Tailwind + custom CSS variables
├── firebase.js                    # Inisialisasi Firebase
├── context/
│   └── AppContext.jsx             # Global state + semua Firebase operations
└── components/
    ├── ui/                        # Komponen UI reusable
    │   ├── Badge.jsx              # Badge status booking
    │   ├── ConfirmDialog.jsx      # Dialog konfirmasi aksi
    │   ├── Loading.jsx            # Loading overlay
    │   ├── Modal.jsx              # Modal wrapper
    │   └── Toast.jsx              # Notifikasi toast
    ├── auth/                      # Halaman autentikasi
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   └── AdminLoginPage.jsx
    ├── modals/                    # Modal-modal spesifik
    │   ├── BookingOkModal.jsx
    │   ├── ForgotPassModal.jsx
    │   └── UbahPassModal.jsx
    ├── user/                      # Dashboard user
    │   ├── UserDashboard.jsx
    │   └── tabs/
    │       ├── BerandaTab.jsx
    │       ├── LayananTab.jsx
    │       ├── PanggilTab.jsx
    │       ├── ProfilTab.jsx
    │       └── RiwayatTab.jsx
    └── admin/                     # Dashboard admin
        ├── AdminDashboard.jsx
        └── tabs/
            ├── BookingTab.jsx
            ├── LayananAdminTab.jsx
            └── MekanikAdminTab.jsx
```

---

## 🧩 Implementasi OOP pada Project

Meskipun React menggunakan paradigma functional programming, konsep-konsep OOP tetap diimplementasikan secara nyata dalam project ini.

---

### 1. Encapsulation (Enkapsulasi)

> Menyembunyikan detail implementasi dan hanya mengekspos apa yang diperlukan.

**Implementasi:**

`AppContext.jsx` mengenkapsulasi seluruh logika Firebase dan state aplikasi. Komponen lain tidak perlu tahu *bagaimana* data diambil dari Firestore — mereka hanya memanggil fungsi yang disediakan.

```jsx
// AppContext.jsx — detail Firebase tersembunyi di dalam context
const loadLayanan = async () => {
  const q = query(collection(db, 'layanan'), orderBy('order', 'asc'))
  let snap = await getDocs(q)
  if (snap.empty) {
    // logic auto-seed data default — tersembunyi dari komponen luar
    const batch = writeBatch(db)
    DEF_LAYANAN.forEach(l => batch.set(doc(collection(db, 'layanan')), l))
    await batch.commit()
  }
  setAllLayanan(snap.docs.map(d => ({ id: d.id, ...d.data() })))
}

// Komponen hanya tahu: "ada data layanan" — tidak tahu cara ambilnya
const { allLayanan } = useApp()
```

Komponen `Modal.jsx` mengenkapsulasi logika close-on-backdrop-click:

```jsx
// Modal.jsx — logika backdrop click tersembunyi di dalam komponen
<div onClick={e => { if (e.target === e.currentTarget) onClose() }}>
  {children}
</div>
```

---

### 2. Inheritance (Pewarisan)

> Mewariskan properti dan perilaku dari satu entitas ke entitas lain.

**Implementasi:**

Semua halaman auth (Login, Register, AdminLogin) mewarisi struktur dan style yang sama dari pola `auth-bg` + `auth-card`. Komponen `Modal.jsx` bertindak sebagai **base component** yang diwarisi oleh semua modal spesifik.

```jsx
// Modal.jsx — base component (parent)
export default function Modal({ children, onClose, wide = false }) {
  return (
    <div className="overlay" onClick={...}>
      <div className="modal">
        <button onClick={onClose}>✕</button>
        {children}  {/* konten diwarisi dari child */}
      </div>
    </div>
  )
}

// ForgotPassModal.jsx — mewarisi Modal (child)
export default function ForgotPassModal({ onClose }) {
  return (
    <Modal onClose={onClose}>   {/* mewarisi semua behavior Modal */}
      <div>Reset Password...</div>
    </Modal>
  )
}

// UbahPassModal.jsx — mewarisi Modal (child)
export default function UbahPassModal({ onClose }) {
  return (
    <Modal onClose={onClose}>   {/* mewarisi semua behavior Modal */}
      <div>Ubah Password...</div>
    </Modal>
  )
}

// BookingOkModal.jsx — mewarisi Modal (child)
export default function BookingOkModal({ onClose, onLihat }) {
  return (
    <Modal onClose={onClose}>   {/* mewarisi semua behavior Modal */}
      <div>Booking Berhasil...</div>
    </Modal>
  )
}
```

Semua modal mewarisi: backdrop overlay, animasi pop, tombol close (✕), dan close-on-backdrop-click — tanpa menulis ulang kode.

---

### 3. Polymorphism (Polimorfisme)

> Satu interface yang sama berperilaku berbeda tergantung konteks.

**Implementasi:**

**a) Komponen `Badge` — satu komponen, tampilan berbeda per status:**

```jsx
// Badge.jsx — satu komponen, output berbeda tergantung prop
const MAP = {
  Menunggu:     'bdg-wait',    // kuning
  Dikonfirmasi: 'bdg-ok',      // hijau
  Selesai:      'bdg-done',    // biru
  Dibatalkan:   'bdg-cancel',  // merah
}
export default function Badge({ status }) {
  return <span className={`badge ${MAP[status] || 'bdg-wait'}`}>{status}</span>
}

// Dipakai di banyak tempat, tampilan otomatis berbeda
<Badge status="Menunggu" />     // → kuning
<Badge status="Dikonfirmasi" /> // → hijau
<Badge status="Selesai" />      // → biru
```

**b) Fungsi `saveLayanan` dan `saveMekanik` — satu fungsi, perilaku berbeda (add vs update):**

```jsx
// AppContext.jsx — polimorfisme berdasarkan ada/tidaknya editId
const saveLayanan = async (data, editId) => {
  if (editId) {
    // perilaku UPDATE
    await updateDoc(doc(db, 'layanan', editId), data)
  } else {
    // perilaku CREATE
    await addDoc(collection(db, 'layanan'), data)
  }
}

// Dipanggil dengan cara sama, perilaku berbeda
saveLayanan(data, null)      // → CREATE layanan baru
saveLayanan(data, 'abc123')  // → UPDATE layanan existing
```

**c) Tab dashboard — satu slot render, komponen berbeda:**

```jsx
// UserDashboard.jsx — satu area render, komponen berbeda per tab
{tab === 'beranda' && <BerandaTab />}
{tab === 'layanan' && <LayananTab />}
{tab === 'panggil' && <PanggilTab />}
{tab === 'profil'  && <ProfilTab />}
{tab === 'riwayat' && <RiwayatTab />}
```

---

### 4. Abstraction (Abstraksi)

> Menyederhanakan kompleksitas dengan menyembunyikan detail dan hanya menampilkan interface yang relevan.

**Implementasi:**

**a) `useApp()` hook — abstraksi seluruh Firebase:**

```jsx
// Tanpa abstraksi — komponen harus tahu detail Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
await addDoc(collection(db, 'bookings'), { uid, nama, status, ts: serverTimestamp() })

// Dengan abstraksi — komponen cukup panggil satu fungsi
const { doBooking } = useApp()
await doBooking(layananId)  // semua detail Firebase tersembunyi
```

**b) `ConfirmDialog` — abstraksi dialog konfirmasi:**

```jsx
// Komponen tidak perlu tahu cara kerja dialog
<ConfirmDialog
  title="Hapus layanan ini?"
  msg="Data tidak bisa dikembalikan."
  okLabel="Hapus"
  okClass="btn-red"
  onOk={() => deleteLayanan(id)}
  onCancel={() => setDelId(null)}
/>
```

**c) `fbE()` — abstraksi error Firebase:**

```jsx
// Abstraksi error code Firebase menjadi pesan bahasa Indonesia
const fbE = (e) => {
  const m = {
    'auth/email-already-in-use': 'Email sudah digunakan.',
    'auth/wrong-password':       'Password salah.',
    'auth/too-many-requests':    'Terlalu banyak percobaan.',
    // ...
  }
  return m[e.code] || e.message
}
// Komponen hanya terima string pesan, tidak tahu error code Firebase
```

---

## 📝 Penjelasan Input User

Berikut seluruh input yang dapat dilakukan pengguna beserta validasi dan aksinya.

### 👤 User (Pengguna Umum)

#### Form Login
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Email | `email` | Wajib diisi, format email valid | Firebase Auth sign-in |
| Password | `password` | Wajib diisi | Firebase Auth sign-in |

#### Form Register
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Nama Lengkap | `text` | Wajib diisi | Disimpan ke Firestore `users` |
| Username | `text` | Wajib diisi | Disimpan ke Firestore `users` |
| Email | `email` | Wajib diisi, format valid | Firebase Auth create user |
| Nomor Telepon | `tel` | Opsional | Disimpan ke Firestore `users` |
| Jenis Kelamin | `select` | Opsional | Disimpan ke Firestore `users` |
| Alamat / Kota | `text` | Opsional | Disimpan ke Firestore `users` |
| Password | `password` | Min. 6 karakter | Firebase Auth create user |
| Konfirmasi Password | `password` | Harus sama dengan password | Validasi client-side |

#### Form Edit Profil
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Nama Lengkap | `text` | Wajib diisi | Update Firestore `users/{uid}` |
| Nomor Telepon | `tel` | Opsional | Update Firestore `users/{uid}` |
| Jenis Kelamin | `select` | Opsional | Update Firestore `users/{uid}` |
| Alamat | `text` | Opsional | Update Firestore `users/{uid}` |

#### Form Ubah Password
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Password Lama | `password` | Wajib diisi | Reauthenticate Firebase |
| Password Baru | `password` | Min. 6 karakter | `updatePassword()` Firebase |
| Konfirmasi Password Baru | `password` | Harus sama dengan password baru | Validasi client-side |

#### Form Reset Password (Lupa Password)
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Email | `email` | Wajib diisi | `sendPasswordResetEmail()` Firebase |

#### Booking Layanan
| Input | Tipe | Aksi |
|---|---|---|
| Klik tombol "Booking" pada kartu layanan | Button | Buat dokumen baru di Firestore `bookings` dengan status `Menunggu` |

#### Panggil Mekanik
| Input | Tipe | Aksi |
|---|---|---|
| Pilih jenis masalah | Button toggle | Menandai masalah yang dipilih (visual only) |
| Klik tombol "📞 Panggil" pada kartu mekanik | Button | Buat dokumen baru di Firestore `bookings` dengan nama mekanik |

#### Pencarian Layanan
| Input | Tipe | Aksi |
|---|---|---|
| Kolom pencarian layanan | `text` | Filter real-time berdasarkan nama, deskripsi, dan tag layanan |

#### Pencarian Riwayat
| Input | Tipe | Aksi |
|---|---|---|
| Kolom pencarian riwayat | `text` | Filter real-time berdasarkan nama layanan dan tanggal |

---

### 🛠️ Admin

#### Form Login Admin
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Email | `email` | Wajib diisi | Firebase Auth sign-in, cek `role === 'admin'` di Firestore |
| Password | `password` | Wajib diisi | Firebase Auth sign-in |

#### Form Daftar Admin
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Nama | `text` | Wajib diisi | Disimpan ke Firestore `users` dengan `role: 'admin'` |
| Email | `email` | Wajib diisi | Firebase Auth create user |
| Password | `password` | Min. 6 karakter | Firebase Auth create user |
| Kode Admin | `text` | Harus `BENGKELAJA2026` | Validasi client-side sebelum register |

#### Manajemen Booking
| Input | Tipe | Aksi |
|---|---|---|
| Filter status | `select` | Filter daftar booking berdasarkan status |
| Kolom pencarian | `text` | Filter berdasarkan nama layanan, nama user, atau email |
| Tombol "Konfirmasi" | Button | Update status booking → `Dikonfirmasi` di Firestore |
| Tombol "Tolak" | Button | Update status booking → `Dibatalkan` di Firestore |
| Tombol "✓ Selesai" | Button | Update status booking → `Selesai` di Firestore |

#### Form Tambah / Edit Layanan
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Nama Layanan | `text` | Wajib diisi | Add/Update Firestore `layanan` |
| Kategori | `select` | Opsional | Add/Update Firestore `layanan` |
| Range Harga | `text` | Wajib diisi | Add/Update Firestore `layanan` |
| Estimasi Waktu | `text` | Wajib diisi | Add/Update Firestore `layanan` |
| Deskripsi | `textarea` | Opsional | Add/Update Firestore `layanan` |
| Tombol Hapus | Button | Konfirmasi dialog | Delete dokumen dari Firestore `layanan` |

#### Form Tambah / Edit Mekanik
| Field | Tipe | Validasi | Aksi |
|---|---|---|---|
| Nama Mekanik | `text` | Wajib diisi | Add/Update Firestore `mekanik` |
| Spesialisasi | `select` | Wajib dipilih | Add/Update Firestore `mekanik` |
| Pengalaman | `text` | Opsional | Add/Update Firestore `mekanik` |
| Rating | `number` | Opsional, 1–5 | Add/Update Firestore `mekanik` |
| Harga Panggil | `number` | Opsional | Add/Update Firestore `mekanik` |
| Waktu Respons | `text` | Opsional | Add/Update Firestore `mekanik` |
| Tombol Hapus | Button | Konfirmasi dialog | Delete dokumen dari Firestore `mekanik` |

---

## 🔐 Keamanan

- Firebase config bersifat public by design (client-side)
- Proteksi data bergantung pada **Firebase Security Rules** di Firestore
- Role admin diverifikasi dari field `role` di koleksi `users` Firestore
- Kode registrasi admin (`BENGKELAJA2026`) sebagai lapisan proteksi tambahan

---
