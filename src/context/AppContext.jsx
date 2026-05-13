import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, collection, getDocs,
  addDoc, updateDoc, deleteDoc, query,
  where, orderBy, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export const ADMIN_CODE = 'BENGKELAJA2026'

const DEF_LAYANAN = [
  { nama:'Ganti Oli Mesin',       desc:'Penggantian oli mesin berkala untuk performa optimal',    tags:['Servis Umum','Ganti Oli'],  harga:'Rp 50.000 – Rp 150.000',   estimasi:'30–45 Menit', icon:'🛢️', hargaVal:100000, order:0 },
  { nama:'Tune Up Mesin',         desc:'Penyetelan mesin untuk performa maksimal',                tags:['Servis Umum'],              harga:'Rp 150.000 – Rp 400.000',  estimasi:'1–2 Jam',     icon:'🔩', hargaVal:300000, order:1 },
  { nama:'Servis AC Mobil',       desc:'Perbaikan dan perawatan sistem AC kendaraan',             tags:['Servis Umum','AC'],         harga:'Rp 175.000 – Rp 750.000',  estimasi:'2–3 Jam',     icon:'❄️', hargaVal:150000, order:2 },
  { nama:'Perbaikan Kelistrikan', desc:'Diagnosa dan perbaikan sistem kelistrikan kendaraan',     tags:['Kelistrikan'],              harga:'Rp 100.000 – Rp 500.000',  estimasi:'1–3 Jam',     icon:'⚡', hargaVal:200000, order:3 },
  { nama:'Cat & Body Repair',     desc:'Pengecatan dan perbaikan body kendaraan',                 tags:['Body Repair'],              harga:'Rp 300.000 – Rp 3.000.000',estimasi:'1–3 Hari',    icon:'🎨', hargaVal:500000, order:4 },
  { nama:'Ganti Ban',             desc:'Penggantian ban dengan berbagai merk tersedia',           tags:['Servis Rutin','Ban'],       harga:'Rp 200.000 – Rp 800.000',  estimasi:'1–3 Hari',    icon:'🔵', hargaVal:250000, order:5 },
  { nama:'Ganti Kampas Rem',      desc:'Penggantian kampas rem depan dan/atau belakang',          tags:['Servis Rutin','Rem'],       harga:'Rp 90.000 – Rp 450.000',   estimasi:'1–3 Hari',    icon:'🛑', hargaVal:150000, order:6 },
]
const DEF_MEKANIK = [
  { nama:'Budiono Siregar', spek:'Tambal Ban',        harga:150000, waktu:'15–20 menit', exp:'8 Tahun', rating:'4.9', job:500 },
  { nama:'Ahmad Hidayat',   spek:'Mekanik Umum',      harga:175000, waktu:'25–30 menit', exp:'6 Tahun', rating:'4.7', job:320 },
  { nama:'Rizky Pratama',   spek:'AC & Kelistrikan',  harga:200000, waktu:'20–35 menit', exp:'5 Tahun', rating:'4.8', job:210 },
]

export function AppProvider({ children }) {
  const [page, setPage]           = useState('login')   // login | register | admin-login | user-dash | admin-dash
  const [loading, setLoading]     = useState(true)
  const [loadTxt, setLoadTxt]     = useState('Memuat...')
  const [toast, setToast]         = useState(null)
  const [CU, setCU]               = useState(null)
  const [UP, setUP]               = useState({})
  const [isAdmin, setIsAdmin]     = useState(false)
  const [userBooks, setUserBooks] = useState([])
  const [allBooks, setAllBooks]   = useState([])
  const [allLayanan, setAllLayanan] = useState([])
  const [allMekanik, setAllMekanik] = useState([])

  /* ── TOAST ── */
  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  /* ── LOAD HELPERS ── */
  const showLoad = (txt = 'Memuat...') => { setLoadTxt(txt); setLoading(true) }
  const hideLoad = () => setLoading(false)

  /* ── FIREBASE ERROR MAP ── */
  const fbE = (e) => {
    const m = {
      'auth/email-already-in-use': 'Email sudah digunakan.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/weak-password': 'Password terlalu lemah (min. 6 karakter).',
      'auth/user-not-found': 'Akun tidak ditemukan.',
      'auth/wrong-password': 'Password salah.',
      'auth/invalid-credential': 'Email atau password salah.',
      'auth/too-many-requests': 'Terlalu banyak percobaan.',
      'auth/network-request-failed': 'Koneksi bermasalah.',
      'auth/requires-recent-login': 'Harap login ulang sebelum mengubah password.',
    }
    return m[e.code] || e.message
  }

  /* ── FIRESTORE HELPERS ── */
  const loadProfile = async (user) => {
    const snap = await getDoc(doc(db, 'users', user.uid))
    const data = snap.exists() ? snap.data() : {}
    setUP(data)
    setIsAdmin(data.role === 'admin')
    return data
  }

  const saveProfile = async (data) => {
    if (!CU) return
    await setDoc(doc(db, 'users', CU.uid), data, { merge: true })
    setUP(prev => ({ ...prev, ...data }))
  }

  const loadLayanan = async () => {
    const q = query(collection(db, 'layanan'), orderBy('order', 'asc'))
    let snap = await getDocs(q)
    if (snap.empty) {
      const batch = writeBatch(db)
      DEF_LAYANAN.forEach(l => batch.set(doc(collection(db, 'layanan')), l))
      await batch.commit()
      snap = await getDocs(q)
    }
    setAllLayanan(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const loadMekanik = async () => {
    const snap = await getDocs(collection(db, 'mekanik'))
    if (snap.empty) {
      const batch = writeBatch(db)
      DEF_MEKANIK.forEach(m => batch.set(doc(collection(db, 'mekanik')), m))
      await batch.commit()
      const snap2 = await getDocs(collection(db, 'mekanik'))
      setAllMekanik(snap2.docs.map(d => ({ id: d.id, ...d.data() })))
    } else {
      setAllMekanik(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
  }

  const loadUserBooks = async (user) => {
    const q = query(collection(db, 'bookings'), where('uid', '==', user.uid), orderBy('ts', 'desc'))
    const snap = await getDocs(q)
    setUserBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const loadAllBooks = async () => {
    const q = query(collection(db, 'bookings'), orderBy('ts', 'desc'))
    const snap = await getDocs(q)
    setAllBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  /* ── AUTH STATE ── */
  useEffect(() => {
    showLoad('Mengecek sesi...')
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCU(user)
        const profile = await loadProfile(user)
        await loadLayanan()
        await loadMekanik()
        if (profile.role === 'admin') {
          await loadAllBooks()
          setPage('admin-dash')
        } else {
          await loadUserBooks(user)
          setPage('user-dash')
        }
      } else {
        setCU(null); setUP({}); setIsAdmin(false)
        setPage('login')
      }
      hideLoad()
    })
    return () => unsub()
  }, []) // eslint-disable-line

  /* ── AUTH ACTIONS ── */
  const doLogin = async (email, pass) => {
    showLoad('Masuk...')
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (e) {
      hideLoad()
      throw new Error(fbE(e))
    }
  }

  const doRegister = async (fields) => {
    showLoad('Membuat akun...')
    try {
      const cred = await createUserWithEmailAndPassword(auth, fields.email, fields.pass)
      await setDoc(doc(db, 'users', cred.user.uid), {
        nama: fields.nama, username: fields.username, email: fields.email,
        telp: fields.telp, gender: fields.gender, alamat: fields.alamat,
        role: 'user', createdAt: new Date().toISOString(),
      })
    } catch (e) {
      hideLoad()
      throw new Error(fbE(e))
    }
  }

  const doAdminRegister = async (fields) => {
    if (fields.code !== ADMIN_CODE) throw new Error('Kode admin salah. Hubungi pemilik sistem.')
    showLoad('Membuat akun admin...')
    try {
      const cred = await createUserWithEmailAndPassword(auth, fields.email, fields.pass)
      await setDoc(doc(db, 'users', cred.user.uid), {
        nama: fields.nama, email: fields.email,
        role: 'admin', createdAt: new Date().toISOString(),
      })
    } catch (e) {
      hideLoad()
      throw new Error(fbE(e))
    }
  }

  const doLogout = async () => {
    await signOut(auth)
  }

  const doForgotPass = async (email) => {
    showLoad('Mengirim email reset...')
    try {
      await sendPasswordResetEmail(auth, email)
    } finally { hideLoad() }
  }

  const doUbahPass = async (oldPass, newPass) => {
    showLoad('Memperbarui password...')
    try {
      const cred = EmailAuthProvider.credential(CU.email, oldPass)
      await reauthenticateWithCredential(CU, cred)
      await updatePassword(CU, newPass)
    } catch (e) {
      hideLoad()
      throw new Error(fbE(e))
    }
    hideLoad()
  }

  /* ── BOOKING ACTIONS ── */
  const doBooking = async (layId) => {
    const l = allLayanan.find(x => x.id === layId)
    if (!l) return
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const now   = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    showLoad('Memproses booking...')
    try {
      const ref = await addDoc(collection(db, 'bookings'), {
        uid: CU.uid, userName: UP?.nama || CU.email, userEmail: CU.email,
        nama: l.nama, icon: l.icon || '🔧', tanggal: `${today} • ${now}`,
        harga: `Rp ${(l.hargaVal || 0).toLocaleString('id-ID')}`,
        status: 'Menunggu', ts: serverTimestamp(),
      })
      const nb = { id: ref.id, uid: CU.uid, userName: UP?.nama || CU.email, userEmail: CU.email, nama: l.nama, icon: l.icon || '🔧', tanggal: `${today} • ${now}`, harga: `Rp ${(l.hargaVal || 0).toLocaleString('id-ID')}`, status: 'Menunggu' }
      setUserBooks(prev => [nb, ...prev])
    } finally { hideLoad() }
  }

  const doPanggil = async (nama, harga) => {
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const now   = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    showLoad('Memanggil mekanik...')
    try {
      const ref = await addDoc(collection(db, 'bookings'), {
        uid: CU.uid, userName: UP?.nama || CU.email, userEmail: CU.email,
        nama: `Panggil Mekanik – ${nama}`, icon: '📞', tanggal: `${today} • ${now}`,
        harga: `Rp ${harga.toLocaleString('id-ID')}`,
        status: 'Menunggu', ts: serverTimestamp(),
      })
      const nb = { id: ref.id, uid: CU.uid, userName: UP?.nama || CU.email, nama: `Panggil Mekanik – ${nama}`, icon: '📞', tanggal: `${today} • ${now}`, harga: `Rp ${harga.toLocaleString('id-ID')}`, status: 'Menunggu' }
      setUserBooks(prev => [nb, ...prev])
    } finally { hideLoad() }
  }

  /* ── ADMIN BOOKING ── */
  const updateStatus = async (bookId, newStatus) => {
    showLoad('Memperbarui status...')
    try {
      await updateDoc(doc(db, 'bookings', bookId), { status: newStatus })
      setAllBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: newStatus } : b))
      setUserBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: newStatus } : b))
      showToast(`Booking ${newStatus} ✓`)
    } finally { hideLoad() }
  }

  /* ── ADMIN LAYANAN ── */
  const saveLayanan = async (data, editId) => {
    showLoad('Menyimpan layanan...')
    try {
      if (editId) {
        await updateDoc(doc(db, 'layanan', editId), data)
        setAllLayanan(prev => prev.map(l => l.id === editId ? { ...l, ...data } : l))
        showToast('Layanan berhasil diperbarui ✓')
      } else {
        const d = { ...data, order: allLayanan.length }
        const ref = await addDoc(collection(db, 'layanan'), d)
        setAllLayanan(prev => [...prev, { id: ref.id, ...d }])
        showToast('Layanan berhasil ditambahkan ✓')
      }
    } finally { hideLoad() }
  }

  const deleteLayanan = async (id) => {
    showLoad('Menghapus...')
    try {
      await deleteDoc(doc(db, 'layanan', id))
      setAllLayanan(prev => prev.filter(l => l.id !== id))
      showToast('Layanan dihapus')
    } finally { hideLoad() }
  }

  /* ── ADMIN MEKANIK ── */
  const saveMekanik = async (data, editId) => {
    showLoad('Menyimpan mekanik...')
    try {
      if (editId) {
        await updateDoc(doc(db, 'mekanik', editId), data)
        setAllMekanik(prev => prev.map(m => m.id === editId ? { ...m, ...data } : m))
        showToast('Mekanik berhasil diperbarui ✓')
      } else {
        const full = { ...data, job: 0, status: 'Tersedia' }
        const ref = await addDoc(collection(db, 'mekanik'), full)
        setAllMekanik(prev => [...prev, { id: ref.id, ...full }])
        showToast('Mekanik berhasil ditambahkan ✓')
      }
    } finally { hideLoad() }
  }

  const deleteMekanik = async (id) => {
    showLoad('Menghapus...')
    try {
      await deleteDoc(doc(db, 'mekanik', id))
      setAllMekanik(prev => prev.filter(m => m.id !== id))
      showToast('Mekanik dihapus')
    } finally { hideLoad() }
  }

  return (
    <Ctx.Provider value={{
      page, setPage,
      loading, loadTxt,
      toast, showToast,
      CU, UP, setUP, isAdmin,
      userBooks, allBooks, allLayanan, allMekanik,
      saveProfile,
      doLogin, doRegister, doAdminRegister, doLogout,
      doForgotPass, doUbahPass,
      doBooking, doPanggil,
      updateStatus,
      saveLayanan, deleteLayanan,
      saveMekanik, deleteMekanik,
    }}>
      {children}
    </Ctx.Provider>
  )
}
